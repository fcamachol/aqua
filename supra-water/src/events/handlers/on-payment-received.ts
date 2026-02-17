import type { DomainEvent } from '../types.js';
import { emitEvent } from '../publisher.js';

// =============================================================
// Handler: payment.received
// When a payment is received:
//   1. Update invoice status (mark as paid / partially paid)
//   2. Check if there's an active delinquency procedure → resolve
//   3. Generate payment receipt
//   4. Emit downstream events
// =============================================================

export async function onPaymentReceived(
  event: DomainEvent<'payment.received'>,
): Promise<void> {
  const { payment_id, invoice_id, amount } = event.payload;

  console.log(
    `[on-payment-received] Processing payment ${payment_id} — invoice ${invoice_id}, amount $${amount}`,
  );

  // ---- Step 1: Update invoice status ----
  // TODO: Query invoice from DB, compare amount vs total, update status
  const invoiceStatus = await updateInvoiceStatus(invoice_id, amount);

  console.log(
    `[on-payment-received] Invoice ${invoice_id} status: ${invoiceStatus}`,
  );

  // ---- Step 2: Check delinquency ----
  // TODO: Query active delinquency procedures for this invoice's contract
  const delinquencyResolved = await checkAndResolveDelinquency(
    invoice_id,
    event.tenant_id,
  );

  if (delinquencyResolved) {
    console.log(
      `[on-payment-received] Delinquency resolved for invoice ${invoice_id}`,
    );
  }

  // ---- Step 3: Generate receipt ----
  // TODO: Use Handlebars template + Puppeteer to generate receipt PDF
  await generateReceipt(payment_id, invoice_id, amount);

  // ---- Step 4: Emit notification ----
  await emitEvent({
    type: 'notification.sent',
    aggregate_type: 'payment',
    aggregate_id: payment_id,
    tenant_id: event.tenant_id,
    payload: {
      communication_id: `receipt-${payment_id}`,
      channel: 'email', // TODO: resolve from person preferences
      person_id: '', // TODO: resolve from invoice → contract → person
    },
    metadata: {
      ...event.metadata,
      invoice_id,
      amount,
      invoice_status: invoiceStatus,
      source_event: event.type,
    },
  });

  console.log(
    `[on-payment-received] Payment ${payment_id} fully processed`,
  );
}

// ---- Stub implementations ----

type InvoiceStatus = 'paid' | 'partial' | 'overpaid';

async function updateInvoiceStatus(
  invoiceId: string,
  amountPaid: number,
): Promise<InvoiceStatus> {
  // TODO: Fetch invoice total from DB, compare with cumulative payments
  // For now, assume fully paid
  console.log(
    `[invoice] Updating status for ${invoiceId} with payment $${amountPaid}`,
  );
  return 'paid';
}

async function checkAndResolveDelinquency(
  invoiceId: string,
  tenantId: string,
): Promise<boolean> {
  // TODO: Query procedimientos_cobranza for active procedures
  // linked to this invoice's contract. If total debt is covered, resolve.
  console.log(
    `[delinquency] Checking active procedures for invoice ${invoiceId}`,
  );
  return false;
}

async function generateReceipt(
  paymentId: string,
  invoiceId: string,
  amount: number,
): Promise<void> {
  // TODO: Render receipt using templates/receipt.hbs + Puppeteer
  console.log(
    `[receipt] Generating receipt for payment ${paymentId} ($${amount})`,
  );
}
