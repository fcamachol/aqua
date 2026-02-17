import { emitEvent } from '../../events/publisher.js';
import type {
  DomainEvent,
  RouteOptimizedPayload,
  RouteAssignedPayload,
  RouteStartedPayload,
  RouteCompletedPayload,
} from '../../events/types.js';

// ─── Reading Route Lifecycle Events ─────────────────────────────

export type {
  RouteOptimizedPayload,
  RouteAssignedPayload,
  RouteStartedPayload,
  RouteCompletedPayload,
};

export async function emitRouteOptimized(
  tenantId: string,
  payload: RouteOptimizedPayload,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'route.optimized'> = {
    type: 'route.optimized',
    aggregate_type: 'route',
    aggregate_id: payload.zoneId,
    tenant_id: tenantId,
    payload,
    metadata,
  };
  await emitEvent(event);
}

export async function emitRouteAssigned(
  tenantId: string,
  payload: RouteAssignedPayload,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'route.assigned'> = {
    type: 'route.assigned',
    aggregate_type: 'route',
    aggregate_id: payload.assignmentId,
    tenant_id: tenantId,
    payload,
    metadata,
  };
  await emitEvent(event);
}

export async function emitRouteStarted(
  tenantId: string,
  payload: RouteStartedPayload,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'route.started'> = {
    type: 'route.started',
    aggregate_type: 'route',
    aggregate_id: payload.assignmentId,
    tenant_id: tenantId,
    payload,
    metadata,
  };
  await emitEvent(event);
}

export async function emitRouteCompleted(
  tenantId: string,
  payload: RouteCompletedPayload,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'route.completed'> = {
    type: 'route.completed',
    aggregate_type: 'route',
    aggregate_id: payload.assignmentId,
    tenant_id: tenantId,
    payload,
    metadata,
  };
  await emitEvent(event);
}
