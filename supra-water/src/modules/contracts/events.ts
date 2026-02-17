import { emitEvent } from '../../events/publisher.js';
import type {
  ContractRequestedPayload,
  ContractCreatedPayload,
  ContractActivatedPayload,
  ContractTerminatedPayload,
  ContractTitularChangedPayload,
} from '../../events/types.js';

// ─── Contract Domain Events ─────────────────────────────────────

export async function emitContractRequested(
  tenantId: string,
  payload: ContractRequestedPayload,
): Promise<void> {
  await emitEvent({
    type: 'contract.requested',
    aggregate_type: 'contract',
    aggregate_id: payload.contract_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitContractCreated(
  tenantId: string,
  payload: ContractCreatedPayload,
): Promise<void> {
  await emitEvent({
    type: 'contract.created',
    aggregate_type: 'contract',
    aggregate_id: payload.contract_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitContractActivated(
  tenantId: string,
  payload: ContractActivatedPayload,
): Promise<void> {
  await emitEvent({
    type: 'contract.activated',
    aggregate_type: 'contract',
    aggregate_id: payload.contract_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitContractTerminated(
  tenantId: string,
  payload: ContractTerminatedPayload,
): Promise<void> {
  await emitEvent({
    type: 'contract.terminated',
    aggregate_type: 'contract',
    aggregate_id: payload.contract_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitContractTitularChanged(
  tenantId: string,
  payload: ContractTitularChangedPayload,
): Promise<void> {
  await emitEvent({
    type: 'contract.titular_changed',
    aggregate_type: 'contract',
    aggregate_id: payload.contract_id,
    tenant_id: tenantId,
    payload,
  });
}
