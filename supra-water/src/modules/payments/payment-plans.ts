import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { db } from '../../config/database.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  CreatePaymentPlanSchema,
  RecordInstallmentSchema,
  type CreatePaymentPlanInput,
  type RecordInstallmentInput,
} from './validators.js';
import { processPayment } from './service.js';

// ---- Types ----

interface PaymentPlan {
  id: string;
  tenant_id: string;
  contract_id: string;
  invoice_ids: string[];
  total_amount: number;
  down_payment: number;
  installments: number;
  interest_rate: number;
  installment_amount: number;
  paid_installments: number;
  paid_amount: number;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  start_date: string;
  schedule: InstallmentScheduleEntry[];
  notes: string | null;
  created_at: string;
}

interface InstallmentScheduleEntry {
  number: number;
  due_date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paid_at: string | null;
  payment_id: string | null;
}

// ---- Service ----

/**
 * Create a convenio de pago (payment plan/agreement).
 * Calculates the installment schedule with optional interest.
 */
async function createPaymentPlan(
  tenantId: string,
  input: CreatePaymentPlanInput,
): Promise<PaymentPlan> {
  const id = uuid();
  const now = new Date().toISOString();

  // Calculate installment amounts
  const principalAfterDown = input.total_amount - input.down_payment;
  const monthlyInterest = input.interest_rate / 100 / 12;

  let installmentAmount: number;
  if (monthlyInterest > 0) {
    // Amortization formula
    installmentAmount =
      (principalAfterDown * monthlyInterest * Math.pow(1 + monthlyInterest, input.installments)) /
      (Math.pow(1 + monthlyInterest, input.installments) - 1);
  } else {
    installmentAmount = principalAfterDown / input.installments;
  }
  installmentAmount = Math.round(installmentAmount * 100) / 100;

  // Build schedule
  const schedule: InstallmentScheduleEntry[] = [];
  const startDate = dayjs(input.start_date);

  for (let i = 1; i <= input.installments; i++) {
    const dueDate = startDate.add(i, 'month');
    // Last installment absorbs rounding difference
    const amount =
      i === input.installments
        ? Math.round((principalAfterDown - installmentAmount * (input.installments - 1)) * 100) / 100
        : installmentAmount;

    schedule.push({
      number: i,
      due_date: dueDate.format('YYYY-MM-DD'),
      amount,
      status: 'pending',
      paid_at: null,
      payment_id: null,
    });
  }

  const plan: PaymentPlan = {
    id,
    tenant_id: tenantId,
    contract_id: input.contract_id,
    invoice_ids: input.invoice_ids,
    total_amount: input.total_amount,
    down_payment: input.down_payment,
    installments: input.installments,
    interest_rate: input.interest_rate,
    installment_amount: installmentAmount,
    paid_installments: 0,
    paid_amount: input.down_payment,
    status: 'active',
    start_date: input.start_date,
    schedule,
    notes: input.notes ?? null,
    created_at: now,
  };

  await db.execute(
    `INSERT INTO payment_plans (id, tenant_id, contract_id, invoice_ids, total_amount, down_payment,
     installments, interest_rate, installment_amount, paid_installments, paid_amount, status,
     start_date, schedule, notes, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, $10, 'active', $11, $12, $13, $14)` as any,
  );

  return plan;
}

/**
 * Get payment plan detail.
 */
async function getPaymentPlan(tenantId: string, planId: string): Promise<PaymentPlan> {
  const rows = await db.execute(
    `SELECT * FROM payment_plans WHERE id = $1 AND tenant_id = $2` as any,
  );

  const row = (rows as any)[0];
  if (!row) {
    throw Object.assign(new Error('Payment plan not found'), { name: 'NotFoundError' });
  }

  return mapPlanRow(row);
}

/**
 * Record an installment payment on a payment plan.
 * Processes the actual payment and updates the plan schedule.
 */
async function recordInstallment(
  tenantId: string,
  planId: string,
  input: RecordInstallmentInput,
): Promise<{ plan: PaymentPlan; payment_id: string; installment_number: number }> {
  const plan = await getPaymentPlan(tenantId, planId);

  if (plan.status !== 'active') {
    throw new Error(`Payment plan is ${plan.status}, cannot record installment`);
  }

  // Find the next pending installment
  const nextInstallment = plan.schedule.find((s) => s.status === 'pending');
  if (!nextInstallment) {
    throw new Error('All installments have been paid');
  }

  // Process the actual payment against the first unpaid invoice
  const targetInvoiceId = plan.invoice_ids[0]; // simplified: pays against first invoice
  const payment = await processPayment(tenantId, {
    invoice_id: targetInvoiceId,
    amount: input.amount,
    payment_method: input.payment_method,
    channel: input.channel,
    transaction_data: {
      ...input.transaction_data,
      payment_plan_id: planId,
      installment_number: nextInstallment.number,
    },
  });

  // Update installment in schedule
  nextInstallment.status = 'paid';
  nextInstallment.paid_at = new Date().toISOString();
  nextInstallment.payment_id = payment.id;

  plan.paid_installments += 1;
  plan.paid_amount += input.amount;

  // Check if plan is completed
  const allPaid = plan.schedule.every((s) => s.status === 'paid');
  if (allPaid) {
    plan.status = 'completed';
  }

  await db.execute(
    `UPDATE payment_plans SET
       paid_installments = $1,
       paid_amount = $2,
       status = $3,
       schedule = $4,
       updated_at = NOW()
     WHERE id = $5 AND tenant_id = $6` as any,
  );

  return { plan, payment_id: payment.id, installment_number: nextInstallment.number };
}

/**
 * Check for defaulted payment plans (incumplimiento).
 * A plan defaults if any installment is overdue by more than 30 days.
 */
async function checkDefaults(tenantId: string): Promise<string[]> {
  const rows = await db.execute(
    `SELECT * FROM payment_plans WHERE tenant_id = $1 AND status = 'active'` as any,
  );

  const defaultedIds: string[] = [];
  const now = dayjs();

  for (const row of rows as any[]) {
    const plan = mapPlanRow(row);
    const hasDefault = plan.schedule.some(
      (s) => s.status === 'pending' && now.diff(dayjs(s.due_date), 'day') > 30,
    );

    if (hasDefault) {
      await db.execute(
        `UPDATE payment_plans SET status = 'defaulted', updated_at = NOW()
         WHERE id = $1 AND tenant_id = $2` as any,
      );
      defaultedIds.push(plan.id);
    }
  }

  return defaultedIds;
}

// ---- Helpers ----

function mapPlanRow(row: any): PaymentPlan {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    contract_id: row.contract_id,
    invoice_ids: row.invoice_ids ?? [],
    total_amount: Number(row.total_amount),
    down_payment: Number(row.down_payment),
    installments: Number(row.installments),
    interest_rate: Number(row.interest_rate),
    installment_amount: Number(row.installment_amount),
    paid_installments: Number(row.paid_installments),
    paid_amount: Number(row.paid_amount),
    status: row.status,
    start_date: row.start_date,
    schedule: typeof row.schedule === 'string' ? JSON.parse(row.schedule) : (row.schedule ?? []),
    notes: row.notes ?? null,
    created_at: row.created_at,
  };
}

// ---- Router ----

const router = Router();

// POST /payment-plans -- Create convenio de pago
router.post(
  '/payment-plans',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreatePaymentPlanSchema.parse(req.body);
      const plan = await createPaymentPlan(req.tenantId!, input);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  },
);

// GET /payment-plans/:id -- Get plan detail
router.get(
  '/payment-plans/:id',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier', 'customer'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan = await getPaymentPlan(req.tenantId!, req.params.id);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  },
);

// POST /payment-plans/:id/installment -- Record installment payment
router.post(
  '/payment-plans/:id/installment',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RecordInstallmentSchema.parse(req.body);
      const result = await recordInstallment(req.tenantId!, req.params.id, input);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

export { router as paymentPlansRouter, checkDefaults };
