import type {
  DomainEvent,
  PaymentReceivedPayload,
  PaymentBouncedPayload,
  PaymentReconciledPayload,
} from '../../events/types.js';

export function paymentReceivedEvent(
  tenantId: string,
  paymentId: string,
  invoiceId: string,
  amount: number,
): DomainEvent<'payment.received'> {
  return {
    type: 'payment.received',
    aggregate_type: 'payment',
    aggregate_id: paymentId,
    tenant_id: tenantId,
    payload: { payment_id: paymentId, invoice_id: invoiceId, amount },
  };
}

export function paymentBouncedEvent(
  tenantId: string,
  paymentId: string,
  reason: string,
): DomainEvent<'payment.bounced'> {
  return {
    type: 'payment.bounced',
    aggregate_type: 'payment',
    aggregate_id: paymentId,
    tenant_id: tenantId,
    payload: { payment_id: paymentId, reason },
  };
}

export function paymentReconciledEvent(
  tenantId: string,
  paymentIds: string[],
): DomainEvent<'payment.reconciled'> {
  return {
    type: 'payment.reconciled',
    aggregate_type: 'payment',
    aggregate_id: paymentIds[0],
    tenant_id: tenantId,
    payload: { payment_ids: paymentIds },
  };
}

// Placeholder emitter -- will be replaced by the real event bus once integrated
export async function emitEvent(event: DomainEvent): Promise<void> {
  console.log(`[event] ${event.type}`, JSON.stringify(event.payload));
}
