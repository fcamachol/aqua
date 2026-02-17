import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { db } from '../../../config/database.js';
import { validateClabe } from './spei.js';
import type { RegisterDomiciliacionInput } from '../validators.js';

// ---- Types ----

export interface DomiciliacionAccount {
  id: string;
  tenant_id: string;
  contract_id: string;
  clabe: string;
  account_holder_name: string;
  bank_name: string | null;
  status: 'active' | 'suspended' | 'cancelled';
  registered_at: string;
}

export interface DebitBatchEntry {
  domiciliation_id: string;
  contract_id: string;
  invoice_id: string;
  clabe: string;
  amount: number;
  reference: string;
}

export interface DebitBatchResult {
  batch_id: string;
  total_entries: number;
  total_amount: number;
  entries: DebitBatchEntry[];
  generated_at: string;
}

export interface BouncedPayment {
  domiciliation_id: string;
  contract_id: string;
  invoice_id: string;
  amount: number;
  bounce_reason: string;
  bounced_at: string;
}

// ---- Registration ----

/**
 * Register a CLABE account for automatic monthly debit (domiciliacion bancaria).
 * Validates the CLABE before registration.
 */
export async function registerAccount(
  tenantId: string,
  input: RegisterDomiciliacionInput,
): Promise<DomiciliacionAccount> {
  const clabeValidation = validateClabe(input.clabe);
  if (!clabeValidation.valid) {
    throw new Error(`Invalid CLABE: ${clabeValidation.error}`);
  }

  const id = uuid();
  const now = new Date().toISOString();

  await db.execute(
    `INSERT INTO domiciliation_accounts (id, tenant_id, contract_id, clabe, account_holder_name, bank_name, status, registered_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)` as any,
  );

  return {
    id,
    tenant_id: tenantId,
    contract_id: input.contract_id,
    clabe: input.clabe,
    account_holder_name: input.account_holder_name,
    bank_name: input.bank_name ?? null,
    status: 'active',
    registered_at: now,
  };
}

/**
 * Cancel a domiciliation account.
 */
export async function cancelAccount(tenantId: string, domiciliationId: string): Promise<void> {
  await db.execute(
    `UPDATE domiciliation_accounts SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND tenant_id = $2` as any,
  );
}

// ---- Monthly Batch Generation ----

/**
 * Generate a monthly debit batch for all active domiciliation accounts in a tenant.
 * Collects pending invoices for each account and creates debit instructions.
 */
export async function generateMonthlyBatch(tenantId: string): Promise<DebitBatchResult> {
  const batchId = uuid();
  const now = dayjs();

  // Find all active domiciliation accounts with pending invoices
  const rows = await db.execute(
    `SELECT da.id as domiciliation_id, da.contract_id, da.clabe,
            i.id as invoice_id, i.total as amount
     FROM domiciliation_accounts da
     JOIN invoices i ON i.contract_id = da.contract_id
     WHERE da.tenant_id = $1
       AND da.status = 'active'
       AND i.status IN ('pendiente', 'vencida')
       AND i.period_end <= $2
     ORDER BY da.contract_id` as any,
  );

  const entries: DebitBatchEntry[] = (rows as any[]).map((row: any) => ({
    domiciliation_id: row.domiciliation_id,
    contract_id: row.contract_id,
    invoice_id: row.invoice_id,
    clabe: row.clabe,
    amount: Number(row.amount),
    reference: `DOM-${batchId.slice(0, 8)}-${row.invoice_id.slice(0, 8)}`,
  }));

  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);

  return {
    batch_id: batchId,
    total_entries: entries.length,
    total_amount: totalAmount,
    entries,
    generated_at: now.toISOString(),
  };
}

// ---- Bounce Handling ----

/**
 * Process bounced (rejected) direct debit payments.
 * Updates the payment status and marks the invoice as unpaid.
 */
export async function handleBouncedPayments(
  tenantId: string,
  bounced: BouncedPayment[],
): Promise<{ processed: number; suspended: string[] }> {
  const suspended: string[] = [];

  for (const bounce of bounced) {
    // Mark payment as bounced
    await db.execute(
      `UPDATE payments SET status = 'bounced', metadata = metadata || $1, updated_at = NOW()
       WHERE invoice_id = $2 AND tenant_id = $3 AND payment_method = 'domiciliacion'
       AND status = 'completed'
       ORDER BY created_at DESC LIMIT 1` as any,
    );

    // Revert invoice status
    await db.execute(
      `UPDATE invoices SET status = 'pendiente', updated_at = NOW()
       WHERE id = $1 AND tenant_id = $2` as any,
    );

    // Check bounce count -- suspend account after 3 bounces
    const countResult = await db.execute(
      `SELECT COUNT(*) as bounce_count FROM payments
       WHERE tenant_id = $1 AND payment_method = 'domiciliacion' AND status = 'bounced'
       AND metadata->>'domiciliation_id' = $2` as any,
    );

    const bounceCount = Number((countResult as any)[0]?.bounce_count ?? 0);
    if (bounceCount >= 3) {
      await db.execute(
        `UPDATE domiciliation_accounts SET status = 'suspended', updated_at = NOW()
         WHERE id = $1 AND tenant_id = $2` as any,
      );
      suspended.push(bounce.domiciliation_id);
    }
  }

  return { processed: bounced.length, suspended };
}

// ---- Reconciliation ----

/**
 * Reconcile a batch of domiciliation results against pending payments.
 */
export async function reconcileBatch(
  tenantId: string,
  batchId: string,
  results: Array<{ reference: string; status: 'success' | 'bounced'; reason?: string }>,
): Promise<{ successful: number; bounced: number }> {
  let successful = 0;
  let bouncedCount = 0;

  for (const result of results) {
    if (result.status === 'success') {
      await db.execute(
        `UPDATE payments SET status = 'completed', updated_at = NOW()
         WHERE metadata->>'batch_reference' = $1 AND tenant_id = $2` as any,
      );
      successful++;
    } else {
      await db.execute(
        `UPDATE payments SET status = 'bounced',
                metadata = metadata || jsonb_build_object('bounce_reason', $1),
                updated_at = NOW()
         WHERE metadata->>'batch_reference' = $2 AND tenant_id = $3` as any,
      );
      bouncedCount++;
    }
  }

  return { successful, bounced: bouncedCount };
}
