import { emitEvent } from '../../events/publisher.js';
import type { DomainEvent } from '../../events/types.js';

// ─── Person Domain Events ───────────────────────────────────────
// These are module-level events not yet in the global DomainEventMap.
// We use the generic emitEvent with a typed wrapper.

export interface PersonCreatedPayload {
  person_id: string;
  person_type: 'fisica' | 'moral';
  name: string;
  rfc?: string;
}

export interface PersonUpdatedPayload {
  person_id: string;
  changed_fields: string[];
}

export async function emitPersonCreated(
  tenantId: string,
  payload: PersonCreatedPayload,
): Promise<void> {
  await emitEvent({
    type: 'person.created' as any,
    aggregate_type: 'person',
    aggregate_id: payload.person_id,
    tenant_id: tenantId,
    payload: payload as any,
  });
}

export async function emitPersonUpdated(
  tenantId: string,
  payload: PersonUpdatedPayload,
): Promise<void> {
  await emitEvent({
    type: 'person.updated' as any,
    aggregate_type: 'person',
    aggregate_id: payload.person_id,
    tenant_id: tenantId,
    payload: payload as any,
  });
}
