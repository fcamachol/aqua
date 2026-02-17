import { db } from '../../config/database.js';

// ─── Billing Domain Events ──────────────────────────────────────
export type BillingEventType =
  | 'invoice.generated'
  | 'invoice.stamped'
  | 'invoice.delivered'
  | 'invoice.past_due'
  | 'invoice.cancelled'
  | 'invoice.credit_note_issued';

export interface BillingEvent {
  type: BillingEventType;
  tenantId: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  metadata?: {
    userId?: string;
    correlationId?: string;
    source?: string;
  };
}

/**
 * Emit a billing domain event into the event store.
 * Also publishes to any registered in-process listeners.
 */
export async function emitBillingEvent(event: BillingEvent): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO domain_events (tenant_id, event_type, aggregate_type, aggregate_id, payload, metadata)
      VALUES ($1, $2, 'invoice', $3, $4, $5)
    `,
    args: [
      event.tenantId,
      event.type,
      event.aggregateId,
      JSON.stringify(event.payload),
      JSON.stringify(event.metadata ?? {}),
    ],
  });

  // Notify in-process listeners
  for (const listener of eventListeners) {
    try {
      listener(event);
    } catch (err) {
      console.error(`[billing-events] Listener error for ${event.type}:`, err);
    }
  }
}

// Simple in-process event bus for billing events
type EventListener = (event: BillingEvent) => void;
const eventListeners: EventListener[] = [];

export function onBillingEvent(listener: EventListener): () => void {
  eventListeners.push(listener);
  return () => {
    const idx = eventListeners.indexOf(listener);
    if (idx >= 0) eventListeners.splice(idx, 1);
  };
}
