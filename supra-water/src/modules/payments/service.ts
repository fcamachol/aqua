import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { db } from '../../config/database.js';
import {
  emitEvent,
  paymentReceivedEvent,
  paymentBouncedEvent,
  paymentReconciledEvent,
} from './events.js';
import { generateSpeiReference, formatSpeiDisplayReference, processSpeiWebhook, findInvoiceBySpeiReference } from './gateways/spei.js';
import { generateOxxoReference, parseOxxoWebhook } from './gateways/oxxo.js';
import { createCharge, refundCharge } from './gateways/conekta.js';
import { reconcileBatch as reconcileBatchEntries } from './reconciliation.js';
import type {
  ProcessPaymentInput,
  ListPaymentsInput,
  ReconcileBatchInput,
  CreateChargeInput,
  RefundInput,
  SpeiWebhookInput,
  OxxoWebhookInput,
} from './validators.js';

// ---- Types ----

interface Payment {
  id: string;
  tenant_id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  channel: string;
  status: string;
  external_id: string | null;
  receipt_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface PaymentListResult {
  data: Payment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface Invoice {
  id: string;
  tenant_id: string;
  contract_id: string;
  total: number;
  amount_paid: number;
  status: string;
  contract_number: string;
  invoice_seq: number;
}

// ---- Main Payment Processing (SUPRA 4.4) ----

/**
 * Process a payment following SUPRA 4.4 flow:
 * 1. Validate invoice exists and amount is correct
 * 2. Process payment through appropriate gateway
 * 3. Create payment record
 * 4. Update invoice status (cobrada/parcial)
 * 5. Check delinquency procedure
 * 6. Generate receipt
 * 7. Emit payment.received event
 */
export async function processPayment(
  tenantId: string,
  input: ProcessPaymentInput,
): Promise<Payment> {
  // 1. Validate invoice
  const invoice = await getInvoice(tenantId, input.invoice_id);
  if (!invoice) {
    throw Object.assign(new Error('Invoice not found'), { name: 'NotFoundError' });
  }

  if (invoice.status === 'cobrada') {
    throw new Error('Invoice is already fully paid');
  }

  if (invoice.status === 'cancelada') {
    throw new Error('Invoice is cancelled');
  }

  const remaining = invoice.total - invoice.amount_paid;
  if (input.amount > remaining + 0.01) {
    throw new Error(`Payment amount ${input.amount} exceeds remaining balance ${remaining.toFixed(2)}`);
  }

  // 2. Route to gateway (for card/oxxo payments that need gateway processing)
  let externalId: string | null = null;
  let gatewayMetadata: Record<string, unknown> = {};

  if (input.payment_method === 'tarjeta_debito' || input.payment_method === 'tarjeta_credito') {
    if (input.transaction_data.token_id) {
      const charge = await createCharge({
        invoice_id: input.invoice_id,
        token_id: input.transaction_data.token_id as string,
        amount: input.amount,
        three_d_secure: (input.transaction_data.three_d_secure as boolean) ?? false,
        customer_email: input.transaction_data.customer_email as string | undefined,
        customer_name: input.transaction_data.customer_name as string | undefined,
      });
      externalId = charge.order_id;
      gatewayMetadata = {
        conekta_order_id: charge.order_id,
        conekta_charge_id: charge.charge_id,
        card_last4: charge.last4,
        card_brand: charge.brand,
        three_d_secure_url: charge.three_d_secure_url,
      };

      if (charge.status === 'declined') {
        throw new Error('Card payment was declined');
      }
    }
  }

  // 3. Create payment record
  const paymentId = uuid();
  const now = new Date().toISOString();
  const status = externalId && gatewayMetadata.three_d_secure_url ? 'pending' : 'completed';

  const payment: Payment = {
    id: paymentId,
    tenant_id: tenantId,
    invoice_id: input.invoice_id,
    amount: input.amount,
    payment_method: input.payment_method,
    channel: input.channel,
    status,
    external_id: externalId,
    receipt_url: null,
    metadata: { ...input.transaction_data, ...gatewayMetadata },
    created_at: now,
  };

  await db.execute(
    `INSERT INTO payments (id, tenant_id, invoice_id, amount, payment_method, channel, status, external_id, metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)` as any,
  );

  // 4. Update invoice status (only if payment is completed)
  if (status === 'completed') {
    const newAmountPaid = invoice.amount_paid + input.amount;
    const newInvoiceStatus = newAmountPaid >= invoice.total ? 'cobrada' : 'parcial';

    await db.execute(
      `UPDATE invoices SET amount_paid = $1, status = $2, updated_at = NOW()
       WHERE id = $3 AND tenant_id = $4` as any,
    );

    // 5. Check delinquency procedure
    if (newInvoiceStatus === 'cobrada') {
      await checkAndResolveDelinquency(tenantId, invoice.contract_id);
    }

    // 7. Emit event
    await emitEvent(paymentReceivedEvent(tenantId, paymentId, input.invoice_id, input.amount));
  }

  return payment;
}

// ---- List Payments ----

export async function listPayments(
  tenantId: string,
  filters: ListPaymentsInput,
): Promise<PaymentListResult> {
  const conditions: string[] = ['tenant_id = $1'];
  const params: unknown[] = [tenantId];
  let paramIndex = 2;

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }
  if (filters.payment_method) {
    conditions.push(`payment_method = $${paramIndex++}`);
    params.push(filters.payment_method);
  }
  if (filters.channel) {
    conditions.push(`channel = $${paramIndex++}`);
    params.push(filters.channel);
  }
  if (filters.invoice_id) {
    conditions.push(`invoice_id = $${paramIndex++}`);
    params.push(filters.invoice_id);
  }
  if (filters.from_date) {
    conditions.push(`created_at >= $${paramIndex++}`);
    params.push(filters.from_date);
  }
  if (filters.to_date) {
    conditions.push(`created_at <= $${paramIndex++}`);
    params.push(filters.to_date);
  }

  const whereClause = conditions.join(' AND ');
  const offset = (filters.page - 1) * filters.page_size;

  const countResult = await db.execute(
    `SELECT COUNT(*) as total FROM payments WHERE ${whereClause}` as any,
  );
  const total = Number((countResult as any)[0]?.total ?? 0);

  const rows = await db.execute(
    `SELECT * FROM payments WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}` as any,
  );

  return {
    data: (rows as any[]).map(mapPaymentRow),
    pagination: {
      page: filters.page,
      pageSize: filters.page_size,
      total,
      totalPages: Math.ceil(total / filters.page_size),
    },
  };
}

// ---- Receipt Generation ----

/**
 * Generate a payment receipt as HTML (to be converted to PDF by caller).
 */
export async function getReceipt(
  tenantId: string,
  paymentId: string,
): Promise<{ html: string; payment: Payment }> {
  const rows = await db.execute(
    `SELECT p.*, i.total as invoice_total, i.period_start, i.period_end,
            c.contract_number, per.name as customer_name, per.rfc
     FROM payments p
     JOIN invoices i ON p.invoice_id = i.id
     JOIN contracts c ON i.contract_id = c.id
     LEFT JOIN persons per ON c.person_id = per.id
     WHERE p.id = $1 AND p.tenant_id = $2` as any,
  );

  const row = (rows as any)[0];
  if (!row) {
    throw Object.assign(new Error('Payment not found'), { name: 'NotFoundError' });
  }

  const payment = mapPaymentRow(row);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Recibo de Pago</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 5px 0; color: #666; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    .details td:first-child { font-weight: bold; width: 40%; }
    .amount { font-size: 28px; font-weight: bold; text-align: center; color: #2563eb; margin: 20px 0; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Recibo de Pago</h1>
    <p>Folio: ${payment.id.slice(0, 8).toUpperCase()}</p>
    <p>${dayjs(payment.created_at).format('DD/MM/YYYY HH:mm')}</p>
  </div>

  <div class="amount">$${payment.amount.toFixed(2)} MXN</div>

  <table class="details">
    <tr><td>Cliente</td><td>${row.customer_name ?? 'N/A'}</td></tr>
    <tr><td>RFC</td><td>${row.rfc ?? 'N/A'}</td></tr>
    <tr><td>Contrato</td><td>${row.contract_number ?? 'N/A'}</td></tr>
    <tr><td>Periodo</td><td>${row.period_start ?? ''} - ${row.period_end ?? ''}</td></tr>
    <tr><td>Total Factura</td><td>$${Number(row.invoice_total ?? 0).toFixed(2)}</td></tr>
    <tr><td>Monto Pagado</td><td>$${payment.amount.toFixed(2)}</td></tr>
    <tr><td>Metodo de Pago</td><td>${payment.payment_method}</td></tr>
    <tr><td>Canal</td><td>${payment.channel}</td></tr>
    <tr><td>Estatus</td><td>${payment.status}</td></tr>
  </table>

  <div class="footer">
    <p>Este recibo es un comprobante de pago. Conservelo para cualquier aclaracion.</p>
    <p>SUPRA Water - Sistema Unificado de Gestion de Agua</p>
  </div>
</body>
</html>`;

  return { html, payment };
}

// ---- Reconciliation ----

export async function reconcileBatch(
  tenantId: string,
  input: ReconcileBatchInput,
) {
  return reconcileBatchEntries(tenantId, input);
}

// ---- SPEI Webhook Handler ----

export async function handleSpeiWebhook(data: SpeiWebhookInput) {
  const parsed = await processSpeiWebhook(data);
  const invoice = await findInvoiceBySpeiReference(parsed.reference);

  if (!invoice) {
    // Store in reconciliation queue for manual review
    await db.execute(
      `INSERT INTO reconciliation_queue (id, tenant_id, batch_id, external_reference, amount, transaction_date, payer_name, reason, status, created_at)
       VALUES ($1, 'system', $2, $3, $4, $5, $6, 'No matching invoice for SPEI reference', 'pending', NOW())` as any,
    );
    return { matched: false, reference: parsed.reference };
  }

  // Process as payment
  const payment = await processPayment(invoice.tenant_id, {
    invoice_id: invoice.invoice_id,
    amount: parsed.amount,
    payment_method: 'transferencia_spei',
    channel: 'banco',
    transaction_data: {
      spei_id: parsed.externalId,
      payer_clabe: parsed.payerClabe,
      payer_name: parsed.payerName,
      auto_reconciled: true,
    },
  });

  return { matched: true, payment_id: payment.id, invoice_id: invoice.invoice_id };
}

// ---- OXXO Webhook Handler ----

export async function handleOxxoWebhook(data: OxxoWebhookInput) {
  const parsed = parseOxxoWebhook(data);

  if (parsed.status !== 'paid') {
    return { processed: false, status: parsed.status };
  }

  // Find invoice by OXXO reference
  const rows = await db.execute(
    `SELECT id, tenant_id, contract_id FROM invoices
     WHERE oxxo_reference = $1
     AND status IN ('pendiente', 'parcial', 'vencida')
     LIMIT 1` as any,
  );

  const invoice = (rows as any)[0];
  if (!invoice) {
    return { processed: false, reason: 'No matching invoice' };
  }

  const amountMxn = parsed.amountCents / 100;
  const payment = await processPayment(invoice.tenant_id, {
    invoice_id: invoice.id,
    amount: amountMxn,
    payment_method: 'oxxo',
    channel: 'oxxo',
    transaction_data: {
      conekta_order_id: parsed.conektaOrderId,
      oxxo_reference: parsed.reference,
      paid_at: parsed.paidAt,
      auto_reconciled: true,
    },
  });

  return { processed: true, payment_id: payment.id };
}

// ---- Card Webhook Handler ----

export async function handleCardWebhook(data: { order_id: string; status: string }) {
  if (data.status !== 'paid') return { processed: false, status: data.status };

  // Find pending payment by conekta order id
  const rows = await db.execute(
    `SELECT id, tenant_id, invoice_id, amount FROM payments
     WHERE external_id = $1 AND status = 'pending' LIMIT 1` as any,
  );

  const pending = (rows as any)[0];
  if (!pending) return { processed: false, reason: 'No pending payment found' };

  // Complete the payment
  await db.execute(
    `UPDATE payments SET status = 'completed', updated_at = NOW()
     WHERE id = $1` as any,
  );

  // Update invoice
  const invoiceRows = await db.execute(
    `SELECT total, COALESCE(amount_paid, 0) as amount_paid, contract_id FROM invoices WHERE id = $1` as any,
  );
  const inv = (invoiceRows as any)[0];
  if (inv) {
    const newPaid = Number(inv.amount_paid) + Number(pending.amount);
    const newStatus = newPaid >= Number(inv.total) ? 'cobrada' : 'parcial';
    await db.execute(
      `UPDATE invoices SET amount_paid = $1, status = $2, updated_at = NOW()
       WHERE id = $3` as any,
    );

    if (newStatus === 'cobrada') {
      await checkAndResolveDelinquency(pending.tenant_id, inv.contract_id);
    }
  }

  await emitEvent(
    paymentReceivedEvent(pending.tenant_id, pending.id, pending.invoice_id, Number(pending.amount)),
  );

  return { processed: true, payment_id: pending.id };
}

// ---- Refund ----

export async function refundPayment(tenantId: string, input: RefundInput): Promise<{ refund_id: string }> {
  const rows = await db.execute(
    `SELECT * FROM payments WHERE id = $1 AND tenant_id = $2 AND status = 'completed'` as any,
  );

  const payment = (rows as any)[0];
  if (!payment) {
    throw Object.assign(new Error('Payment not found or not refundable'), { name: 'NotFoundError' });
  }

  const refundAmount = input.amount ?? Number(payment.amount);
  const metadata = payment.metadata as Record<string, unknown> ?? {};
  const conektaOrderId = metadata.conekta_order_id as string | undefined;

  // If it was a Conekta payment, process refund via gateway
  if (conektaOrderId) {
    const result = await refundCharge(conektaOrderId, Math.round(refundAmount * 100), input.reason);
    await db.execute(
      `UPDATE payments SET status = 'refunded',
              metadata = metadata || jsonb_build_object('refund_id', $1, 'refund_reason', $2),
              updated_at = NOW()
       WHERE id = $3` as any,
    );
    return { refund_id: result.refund_id };
  }

  // For non-gateway payments, just mark as refunded
  const refundId = uuid();
  await db.execute(
    `UPDATE payments SET status = 'refunded',
            metadata = metadata || jsonb_build_object('refund_id', $1, 'refund_reason', $2),
            updated_at = NOW()
     WHERE id = $3` as any,
  );

  // Revert invoice amount
  await db.execute(
    `UPDATE invoices SET
       amount_paid = GREATEST(0, amount_paid - $1),
       status = CASE WHEN amount_paid - $1 <= 0 THEN 'pendiente' ELSE 'parcial' END,
       updated_at = NOW()
     WHERE id = $2 AND tenant_id = $3` as any,
  );

  return { refund_id: refundId };
}

// ---- Helpers ----

async function getInvoice(tenantId: string, invoiceId: string): Promise<Invoice | null> {
  const rows = await db.execute(
    `SELECT i.id, i.tenant_id, i.contract_id, i.total, COALESCE(i.amount_paid, 0) as amount_paid,
            i.status, c.contract_number, i.invoice_seq
     FROM invoices i
     JOIN contracts c ON i.contract_id = c.id
     WHERE i.id = $1 AND i.tenant_id = $2` as any,
  );

  const row = (rows as any)[0];
  if (!row) return null;

  return {
    id: row.id,
    tenant_id: row.tenant_id,
    contract_id: row.contract_id,
    total: Number(row.total),
    amount_paid: Number(row.amount_paid),
    status: row.status,
    contract_number: row.contract_number,
    invoice_seq: Number(row.invoice_seq ?? 0),
  };
}

async function checkAndResolveDelinquency(tenantId: string, contractId: string): Promise<void> {
  // Check if all invoices for this contract are paid
  const unpaidResult = await db.execute(
    `SELECT COUNT(*) as unpaid FROM invoices
     WHERE contract_id = $1 AND tenant_id = $2
     AND status IN ('pendiente', 'parcial', 'vencida')` as any,
  );

  const unpaid = Number((unpaidResult as any)[0]?.unpaid ?? 0);

  if (unpaid === 0) {
    // Resolve any active delinquency procedure
    await db.execute(
      `UPDATE delinquency_procedures SET status = 'resolved', resolution_type = 'payment',
              resolved_at = NOW(), updated_at = NOW()
       WHERE contract_id = $1 AND tenant_id = $2 AND status = 'active'` as any,
    );
  } else {
    // Update remaining debt in procedure
    const debtResult = await db.execute(
      `SELECT COALESCE(SUM(total - amount_paid), 0) as remaining_debt FROM invoices
       WHERE contract_id = $1 AND tenant_id = $2
       AND status IN ('pendiente', 'parcial', 'vencida')` as any,
    );
    const remainingDebt = Number((debtResult as any)[0]?.remaining_debt ?? 0);

    await db.execute(
      `UPDATE delinquency_procedures SET total_debt = $1, updated_at = NOW()
       WHERE contract_id = $2 AND tenant_id = $3 AND status = 'active'` as any,
    );
  }
}

function mapPaymentRow(row: any): Payment {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    invoice_id: row.invoice_id,
    amount: Number(row.amount),
    payment_method: row.payment_method,
    channel: row.channel,
    status: row.status,
    external_id: row.external_id ?? null,
    receipt_url: row.receipt_url ?? null,
    metadata: row.metadata ?? {},
    created_at: row.created_at,
  };
}
