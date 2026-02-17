import { emitEvent } from '../../events/publisher.js';
import type { DomainEvent } from '../../events/types.js';

// ---- Fraud Domain Events ----

export async function emitFraudCaseOpened(
  tenantId: string,
  caseId: string,
  tomaId: string,
  detectionSource: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'fraud.case_opened'> = {
    type: 'fraud.case_opened',
    aggregate_type: 'fraud',
    aggregate_id: caseId,
    tenant_id: tenantId,
    payload: {
      case_id: caseId,
      toma_id: tomaId,
      detection_source: detectionSource,
    },
    metadata,
  };
  await emitEvent(event);
}

export async function emitFraudConfirmed(
  tenantId: string,
  caseId: string,
  fraudType: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const event: DomainEvent<'fraud.confirmed'> = {
    type: 'fraud.confirmed',
    aggregate_type: 'fraud',
    aggregate_id: caseId,
    tenant_id: tenantId,
    payload: { case_id: caseId, fraud_type: fraudType },
    metadata,
  };
  await emitEvent(event);
}
