import { emitEvent } from '../../events/publisher.js';
import type { DomainEvent } from '../../events/types.js';

// ---- Work Order Domain Events ----

export async function emitWorkOrderCreated(
  tenantId: string,
  orderId: string,
  orderType: string,
  tomaId: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'work_order.created'> = {
    type: 'work_order.created',
    aggregate_type: 'work_order',
    aggregate_id: orderId,
    tenant_id: tenantId,
    payload: { order_id: orderId, order_type: orderType, toma_id: tomaId },
    metadata,
  };
  await emitEvent(event);
}

export async function emitWorkOrderAssigned(
  tenantId: string,
  orderId: string,
  assignedTo: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'work_order.assigned'> = {
    type: 'work_order.assigned',
    aggregate_type: 'work_order',
    aggregate_id: orderId,
    tenant_id: tenantId,
    payload: { order_id: orderId, assigned_to: assignedTo },
    metadata,
  };
  await emitEvent(event);
}

export async function emitWorkOrderCompleted(
  tenantId: string,
  orderId: string,
  result: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'work_order.completed'> = {
    type: 'work_order.completed',
    aggregate_type: 'work_order',
    aggregate_id: orderId,
    tenant_id: tenantId,
    payload: { order_id: orderId, result },
    metadata,
  };
  await emitEvent(event);
}
