import { emitEvent } from '../../events/publisher.js';
import type { DomainEvent } from '../../events/types.js';

// ---- Delinquency Domain Events ----

export async function emitDelinquencyStarted(
  tenantId: string,
  procedureId: string,
  contractId: string,
  totalDebt: number,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'delinquency.started'> = {
    type: 'delinquency.started',
    aggregate_type: 'delinquency',
    aggregate_id: procedureId,
    tenant_id: tenantId,
    payload: {
      procedure_id: procedureId,
      contract_id: contractId,
      total_debt: totalDebt,
    },
    metadata,
  };
  await emitEvent(event);
}

export async function emitDelinquencyStepExecuted(
  tenantId: string,
  procedureId: string,
  step: string,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'delinquency.step_executed'> = {
    type: 'delinquency.step_executed',
    aggregate_type: 'delinquency',
    aggregate_id: procedureId,
    tenant_id: tenantId,
    payload: { procedure_id: procedureId, step, action },
    metadata,
  };
  await emitEvent(event);
}

export async function emitDelinquencyResolved(
  tenantId: string,
  procedureId: string,
  resolutionType: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'delinquency.resolved'> = {
    type: 'delinquency.resolved',
    aggregate_type: 'delinquency',
    aggregate_id: procedureId,
    tenant_id: tenantId,
    payload: { procedure_id: procedureId, resolution_type: resolutionType },
    metadata,
  };
  await emitEvent(event);
}
