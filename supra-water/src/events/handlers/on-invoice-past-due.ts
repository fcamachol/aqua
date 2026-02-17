import type { DomainEvent } from '../types.js';
import { emitEvent } from '../publisher.js';

// =============================================================
// Handler: invoice.past_due
// When an invoice passes its due date:
//   1. Start or escalate delinquency procedure
//   2. Trigger collection sequence based on days past due
//   3. Send notification to customer
// =============================================================

/** Collection escalation steps based on days past due */
const COLLECTION_STEPS = [
  { minDays: 1, action: 'reminder_sms', step: 'friendly_reminder' },
  { minDays: 15, action: 'formal_notice', step: 'first_notice' },
  { minDays: 30, action: 'restriction_warning', step: 'restriction_warning' },
  { minDays: 45, action: 'service_restriction', step: 'service_restriction' },
  { minDays: 60, action: 'disconnection_order', step: 'disconnection' },
  { minDays: 90, action: 'legal_referral', step: 'legal' },
] as const;

export async function onInvoicePastDue(
  event: DomainEvent<'invoice.past_due'>,
): Promise<void> {
  const { invoice_id, days_past_due } = event.payload;

  console.log(
    `[on-invoice-past-due] Invoice ${invoice_id} is ${days_past_due} day(s) past due`,
  );

  // ---- Determine the current collection step ----
  const step = resolveCollectionStep(days_past_due);

  if (!step) {
    console.log(
      `[on-invoice-past-due] No collection step for ${days_past_due} days`,
    );
    return;
  }

  // ---- Start or escalate delinquency procedure ----
  // TODO: Query DB for existing procedure on this invoice's contract.
  // If none exists, create one. If exists, escalate to current step.
  const procedureId = await ensureDelinquencyProcedure(
    invoice_id,
    event.tenant_id,
  );

  await emitEvent({
    type: 'delinquency.started',
    aggregate_type: 'delinquency',
    aggregate_id: procedureId,
    tenant_id: event.tenant_id,
    payload: {
      procedure_id: procedureId,
      contract_id: '', // TODO: resolve from invoice → contract
      total_debt: 0, // TODO: sum outstanding invoices
    },
    metadata: {
      ...event.metadata,
      invoice_id,
      days_past_due,
      source_event: event.type,
    },
  });

  // ---- Execute the collection step ----
  await emitEvent({
    type: 'delinquency.step_executed',
    aggregate_type: 'delinquency',
    aggregate_id: procedureId,
    tenant_id: event.tenant_id,
    payload: {
      procedure_id: procedureId,
      step: step.step,
      action: step.action,
    },
    metadata: {
      ...event.metadata,
      invoice_id,
      days_past_due,
      source_event: event.type,
    },
  });

  console.log(
    `[on-invoice-past-due] Collection step "${step.step}" executed — action: ${step.action}`,
  );

  // ---- Send notification to customer ----
  await emitEvent({
    type: 'notification.sent',
    aggregate_type: 'invoice',
    aggregate_id: invoice_id,
    tenant_id: event.tenant_id,
    payload: {
      communication_id: `pastdue-${invoice_id}-${days_past_due}`,
      channel: 'sms', // Escalation notifications default to SMS
      person_id: '', // TODO: resolve from invoice → contract → person
    },
    metadata: {
      ...event.metadata,
      collection_step: step.step,
      collection_action: step.action,
      source_event: event.type,
    },
  });
}

// ---- Internal helpers ----

function resolveCollectionStep(daysPastDue: number) {
  // Walk backwards to find the highest applicable step
  for (let i = COLLECTION_STEPS.length - 1; i >= 0; i--) {
    if (daysPastDue >= COLLECTION_STEPS[i].minDays) {
      return COLLECTION_STEPS[i];
    }
  }
  return null;
}

async function ensureDelinquencyProcedure(
  invoiceId: string,
  tenantId: string,
): Promise<string> {
  // TODO: Check if a delinquency procedure already exists for this
  // invoice's contract. If so, return its ID. Otherwise, create one.
  console.log(
    `[delinquency] Ensuring procedure exists for invoice ${invoiceId}`,
  );
  return `proc-${invoiceId.slice(0, 8)}-${Date.now()}`;
}
