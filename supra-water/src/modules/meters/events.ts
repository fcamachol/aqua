import { emitEvent } from '../../events/publisher.js';
import type { ReadingReceivedPayload, ReadingAnomalyDetectedPayload } from '../../events/types.js';

// ─── Meter Domain Events ────────────────────────────────────────

export interface MeterRegisteredPayload {
  meter_id: string;
  serial_number: string;
  toma_id?: string;
}

export interface MeterReplacedPayload {
  old_meter_id: string;
  new_meter_id: string;
  toma_id: string;
  reason: string;
}

export async function emitMeterRegistered(
  tenantId: string,
  payload: MeterRegisteredPayload,
): Promise<void> {
  await emitEvent({
    type: 'meter.registered' as any,
    aggregate_type: 'meter',
    aggregate_id: payload.meter_id,
    tenant_id: tenantId,
    payload: payload as any,
  });
}

export async function emitReadingReceived(
  tenantId: string,
  payload: ReadingReceivedPayload,
): Promise<void> {
  await emitEvent({
    type: 'reading.received',
    aggregate_type: 'reading',
    aggregate_id: payload.reading_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitReadingAnomaly(
  tenantId: string,
  payload: ReadingAnomalyDetectedPayload,
): Promise<void> {
  await emitEvent({
    type: 'reading.anomaly_detected',
    aggregate_type: 'reading',
    aggregate_id: payload.reading_id,
    tenant_id: tenantId,
    payload,
  });
}

export async function emitMeterReplaced(
  tenantId: string,
  payload: MeterReplacedPayload,
): Promise<void> {
  await emitEvent({
    type: 'meter.replaced' as any,
    aggregate_type: 'meter',
    aggregate_id: payload.new_meter_id,
    tenant_id: tenantId,
    payload: payload as any,
  });
}
