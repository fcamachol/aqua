import { registerHandler } from './subscriber.js';
import { onReadingReceived } from './handlers/on-reading-received.js';
import { onInvoiceGenerated } from './handlers/on-invoice-generated.js';
import { onPaymentReceived } from './handlers/on-payment-received.js';
import { onInvoicePastDue } from './handlers/on-invoice-past-due.js';
import { onWorkOrderCreated } from './handlers/on-work-order-created.js';

// =============================================================
// Event Handler Registry
// Bootstrap all event handlers at application startup.
// =============================================================

export function registerAllHandlers(): void {
  // Reading pipeline
  registerHandler('reading.received', onReadingReceived);

  // Billing pipeline
  registerHandler('invoice.generated', onInvoiceGenerated);

  // Payment pipeline
  registerHandler('payment.received', onPaymentReceived);

  // Delinquency triggers
  registerHandler('invoice.past_due', onInvoicePastDue);

  // Work order pipeline
  registerHandler('work_order.created', onWorkOrderCreated);

  console.log('[registry] All event handlers registered');
}
