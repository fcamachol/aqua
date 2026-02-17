import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { db } from '../../config/database.js';
import { emitEvent, paymentReceivedEvent, paymentReconciledEvent } from './events.js';
import type { ReconcileBatchInput } from './validators.js';

// ---- Types ----

export interface ReconciliationResult {
  batch_id: string;
  source: string;
  total_entries: number;
  matched: ReconciliationMatch[];
  partial: ReconciliationMatch[];
  unmatched: UnmatchedEntry[];
  summary: {
    matched_count: number;
    matched_amount: number;
    partial_count: number;
    partial_amount: number;
    unmatched_count: number;
    unmatched_amount: number;
  };
  processed_at: string;
}

export interface ReconciliationMatch {
  entry_reference: string;
  invoice_id: string;
  contract_id: string;
  payment_id: string;
  amount: number;
  invoice_total: number;
  remaining: number;
}

export interface UnmatchedEntry {
  external_reference: string;
  amount: number;
  transaction_date: string;
  payer_name?: string;
  reason: string;
}

interface InvoiceLookup {
  id: string;
  tenant_id: string;
  contract_id: string;
  total: number;
  amount_paid: number;
  status: string;
  spei_reference: string | null;
  oxxo_reference: string | null;
}

// ---- Main Reconciliation ----

/**
 * Process a batch of incoming bank/OXXO payments and match them to invoices.
 * Handles full payments, partial payments, and unmatched entries.
 */
export async function reconcileBatch(
  tenantId: string,
  input: ReconcileBatchInput,
): Promise<ReconciliationResult> {
  const batchId = uuid();
  const matched: ReconciliationMatch[] = [];
  const partial: ReconciliationMatch[] = [];
  const unmatched: UnmatchedEntry[] = [];

  for (const entry of input.entries) {
    const invoice = await findInvoiceByReference(tenantId, input.source, entry.external_reference);

    if (!invoice) {
      unmatched.push({
        external_reference: entry.external_reference,
        amount: entry.amount,
        transaction_date: entry.transaction_date,
        payer_name: entry.payer_name,
        reason: 'No matching invoice found for reference',
      });
      continue;
    }

    const remaining = invoice.total - invoice.amount_paid;

    // Create payment record
    const paymentId = uuid();
    const appliedAmount = Math.min(entry.amount, remaining);

    await db.execute(
      `INSERT INTO payments (id, tenant_id, invoice_id, amount, payment_method, channel, status, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed', $7, $8)` as any,
    );

    // Update invoice paid amount and status
    const newAmountPaid = invoice.amount_paid + appliedAmount;
    const newStatus = newAmountPaid >= invoice.total ? 'cobrada' : 'parcial';

    await db.execute(
      `UPDATE invoices SET amount_paid = $1, status = $2, updated_at = NOW()
       WHERE id = $3 AND tenant_id = $4` as any,
    );

    const matchResult: ReconciliationMatch = {
      entry_reference: entry.external_reference,
      invoice_id: invoice.id,
      contract_id: invoice.contract_id,
      payment_id: paymentId,
      amount: appliedAmount,
      invoice_total: invoice.total,
      remaining: Math.max(0, remaining - appliedAmount),
    };

    if (newStatus === 'cobrada') {
      matched.push(matchResult);
    } else {
      partial.push(matchResult);
    }

    // Emit payment event
    await emitEvent(paymentReceivedEvent(tenantId, paymentId, invoice.id, appliedAmount));

    // If the incoming amount exceeds the invoice, add the overpayment to unmatched
    if (entry.amount > remaining) {
      unmatched.push({
        external_reference: entry.external_reference,
        amount: entry.amount - remaining,
        transaction_date: entry.transaction_date,
        payer_name: entry.payer_name,
        reason: `Overpayment of ${(entry.amount - remaining).toFixed(2)} on invoice ${invoice.id}`,
      });
    }
  }

  // Emit reconciled event for all matched payments
  const allPaymentIds = [...matched, ...partial].map((m) => m.payment_id);
  if (allPaymentIds.length > 0) {
    await emitEvent(paymentReconciledEvent(tenantId, allPaymentIds));
  }

  // Store unmatched entries for manual review
  for (const um of unmatched) {
    await db.execute(
      `INSERT INTO reconciliation_queue (id, tenant_id, batch_id, external_reference, amount, transaction_date, payer_name, reason, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())` as any,
    );
  }

  const result: ReconciliationResult = {
    batch_id: batchId,
    source: input.source,
    total_entries: input.entries.length,
    matched,
    partial,
    unmatched,
    summary: {
      matched_count: matched.length,
      matched_amount: matched.reduce((s, m) => s + m.amount, 0),
      partial_count: partial.length,
      partial_amount: partial.reduce((s, m) => s + m.amount, 0),
      unmatched_count: unmatched.length,
      unmatched_amount: unmatched.reduce((s, m) => s + m.amount, 0),
    },
    processed_at: new Date().toISOString(),
  };

  return result;
}

// ---- Invoice Lookup by Reference ----

async function findInvoiceByReference(
  tenantId: string,
  source: string,
  reference: string,
): Promise<InvoiceLookup | null> {
  let query: string;

  switch (source) {
    case 'spei':
      query = `SELECT id, tenant_id, contract_id, total, COALESCE(amount_paid, 0) as amount_paid, status, spei_reference, oxxo_reference
               FROM invoices WHERE tenant_id = $1 AND spei_reference = $2
               AND status IN ('pendiente', 'parcial', 'vencida') LIMIT 1`;
      break;
    case 'oxxo':
      query = `SELECT id, tenant_id, contract_id, total, COALESCE(amount_paid, 0) as amount_paid, status, spei_reference, oxxo_reference
               FROM invoices WHERE tenant_id = $1 AND oxxo_reference = $2
               AND status IN ('pendiente', 'parcial', 'vencida') LIMIT 1`;
      break;
    default:
      // Generic reference match -- try spei_reference first, then contract number prefix
      query = `SELECT id, tenant_id, contract_id, total, COALESCE(amount_paid, 0) as amount_paid, status, spei_reference, oxxo_reference
               FROM invoices WHERE tenant_id = $1
               AND (spei_reference = $2 OR oxxo_reference = $2)
               AND status IN ('pendiente', 'parcial', 'vencida') LIMIT 1`;
      break;
  }

  const rows = await db.execute(query as any);
  const row = (rows as any)[0];
  if (!row) return null;

  return {
    id: row.id,
    tenant_id: row.tenant_id,
    contract_id: row.contract_id,
    total: Number(row.total),
    amount_paid: Number(row.amount_paid),
    status: row.status,
    spei_reference: row.spei_reference,
    oxxo_reference: row.oxxo_reference,
  };
}

// ---- Daily Report ----

/**
 * Generate a daily reconciliation report for a tenant.
 */
export async function generateDailyReport(
  tenantId: string,
  date?: string,
): Promise<{
  date: string;
  total_payments: number;
  total_amount: number;
  by_method: Record<string, { count: number; amount: number }>;
  by_channel: Record<string, { count: number; amount: number }>;
  pending_reconciliation: number;
}> {
  const reportDate = date || dayjs().format('YYYY-MM-DD');

  const paymentsResult = await db.execute(
    `SELECT payment_method, channel, COUNT(*) as count, COALESCE(SUM(amount), 0) as amount
     FROM payments
     WHERE tenant_id = $1 AND DATE(created_at) = $2 AND status = 'completed'
     GROUP BY payment_method, channel` as any,
  );

  const pendingResult = await db.execute(
    `SELECT COUNT(*) as count FROM reconciliation_queue
     WHERE tenant_id = $1 AND status = 'pending'` as any,
  );

  const rows = paymentsResult as any[];
  const byMethod: Record<string, { count: number; amount: number }> = {};
  const byChannel: Record<string, { count: number; amount: number }> = {};
  let totalPayments = 0;
  let totalAmount = 0;

  for (const row of rows) {
    const count = Number(row.count);
    const amount = Number(row.amount);
    totalPayments += count;
    totalAmount += amount;

    if (!byMethod[row.payment_method]) byMethod[row.payment_method] = { count: 0, amount: 0 };
    byMethod[row.payment_method].count += count;
    byMethod[row.payment_method].amount += amount;

    if (!byChannel[row.channel]) byChannel[row.channel] = { count: 0, amount: 0 };
    byChannel[row.channel].count += count;
    byChannel[row.channel].amount += amount;
  }

  return {
    date: reportDate,
    total_payments: totalPayments,
    total_amount: totalAmount,
    by_method: byMethod,
    by_channel: byChannel,
    pending_reconciliation: Number((pendingResult as any)[0]?.count ?? 0),
  };
}
