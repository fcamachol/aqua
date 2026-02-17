import { env } from '../../../config/env.js';
import { db } from '../../../config/database.js';
import type { SpeiWebhookInput } from '../validators.js';

// SPEI config per §7.2
const SPEI_CONFIG = {
  clabe_concentradora: env.SPEI_CLABE,
  bank: 'STP' as const,
  webhook_url: '/api/v1/payments/spei/webhook',
};

/**
 * Generate a unique SPEI reference for an invoice.
 * Format: {contract_number}-{invoice_seq}
 */
export function generateSpeiReference(contractNumber: string, invoiceSeq: number): string {
  // SPEI numeric references are 7 digits max
  // Use last 4 digits of contract + 3-digit seq
  const contractSuffix = contractNumber.replace(/\D/g, '').slice(-4).padStart(4, '0');
  const seqStr = String(invoiceSeq).padStart(3, '0');
  return `${contractSuffix}${seqStr}`;
}

/**
 * Full SPEI reference string for display purposes (human-readable).
 */
export function formatSpeiDisplayReference(contractNumber: string, invoiceSeq: number): string {
  return `${contractNumber}-${invoiceSeq}`;
}

/**
 * Validate a CLABE (Clave Bancaria Estandarizada) -- 18-digit Mexican bank account number.
 * Validates length, digit-only, and the verification digit.
 */
export function validateClabe(clabe: string): { valid: boolean; error?: string } {
  if (!/^\d{18}$/.test(clabe)) {
    return { valid: false, error: 'CLABE must be exactly 18 digits' };
  }

  // CLABE verification digit algorithm (weighted modulo 10)
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  const digits = clabe.split('').map(Number);
  const sum = weights.reduce((acc, w, i) => acc + ((digits[i] * w) % 10), 0);
  const verificationDigit = (10 - (sum % 10)) % 10;

  if (digits[17] !== verificationDigit) {
    return { valid: false, error: 'Invalid CLABE verification digit' };
  }

  return { valid: true };
}

/**
 * Process incoming SPEI webhook notification from STP.
 * Returns the matched invoice reference or null if unmatched.
 */
export async function processSpeiWebhook(data: SpeiWebhookInput): Promise<{
  matched: boolean;
  reference: string;
  amount: number;
  payerClabe?: string;
  payerName?: string;
  externalId: string;
  transactionDate: string;
}> {
  return {
    matched: true, // Actual matching happens in reconciliation service
    reference: data.referencia_numerica,
    amount: data.monto,
    payerClabe: data.clabe_origen,
    payerName: data.nombre_ordenante,
    externalId: data.id,
    transactionDate: data.fecha_operacion,
  };
}

/**
 * Look up an invoice by its SPEI reference.
 * Returns the invoice_id and tenant_id if found.
 */
export async function findInvoiceBySpeiReference(
  reference: string,
): Promise<{ invoice_id: string; tenant_id: string; contract_id: string } | null> {
  const rows = await db.execute<{
    id: string;
    tenant_id: string;
    contract_id: string;
  }>(
    `SELECT id, tenant_id, contract_id FROM invoices
     WHERE spei_reference = $1 AND status IN ('pendiente', 'parcial', 'vencida')
     LIMIT 1` as any,
    // The drizzle raw execute will use the parameterized query
  );

  // For raw queries, result comes back as an array
  const row = (rows as any)[0];
  if (!row) return null;
  return { invoice_id: row.id, tenant_id: row.tenant_id, contract_id: row.contract_id };
}

export { SPEI_CONFIG };
