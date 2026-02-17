import type { DomainEvent } from '../types.js';
import { emitEvent } from '../publisher.js';

// =============================================================
// Handler: reading.received
// When a meter reading arrives, run anomaly detection.
// If valid, emit reading.billing_ready.
// =============================================================

/** Thresholds for basic anomaly detection */
const CONSUMPTION_ZERO_THRESHOLD = 0;
const CONSUMPTION_SPIKE_MULTIPLIER = 3;
const AVERAGE_MONTHLY_CONSUMPTION = 15; // m³ — rough default

export async function onReadingReceived(
  event: DomainEvent<'reading.received'>,
): Promise<void> {
  const { reading_id, meter_id, toma_id, consumption } = event.payload;

  console.log(
    `[on-reading-received] Processing reading ${reading_id} — meter ${meter_id}, consumption ${consumption} m³`,
  );

  // ---- Anomaly Detection ----
  const anomaly = detectAnomaly(consumption);

  if (anomaly) {
    console.warn(
      `[on-reading-received] Anomaly detected for reading ${reading_id}: ${anomaly.type} (confidence ${anomaly.confidence})`,
    );

    await emitEvent({
      type: 'reading.anomaly_detected',
      aggregate_type: 'reading',
      aggregate_id: reading_id,
      tenant_id: event.tenant_id,
      payload: {
        reading_id,
        anomaly_type: anomaly.type,
        confidence: anomaly.confidence,
      },
      metadata: {
        ...event.metadata,
        source_event: event.type,
      },
    });

    // Anomalous readings still proceed to billing but are flagged.
    // A human reviewer or AI agent will approve/reject later.
  }

  // ---- Emit billing-ready ----
  // TODO: Look up contract_id from toma_id via the contracts table.
  // For now, we pass a placeholder that the billing module will resolve.
  await emitEvent({
    type: 'reading.billing_ready',
    aggregate_type: 'reading',
    aggregate_id: reading_id,
    tenant_id: event.tenant_id,
    payload: {
      reading_id,
      contract_id: '', // Resolved by billing service from toma_id
    },
    metadata: {
      ...event.metadata,
      toma_id,
      meter_id,
      consumption,
      has_anomaly: !!anomaly,
      source_event: event.type,
    },
  });

  console.log(
    `[on-reading-received] reading.billing_ready emitted for ${reading_id}`,
  );
}

// ---- Internal helpers ----

function detectAnomaly(
  consumption: number,
): { type: string; confidence: number } | null {
  // Zero consumption could indicate a stuck meter or vacancy
  if (consumption <= CONSUMPTION_ZERO_THRESHOLD) {
    return { type: 'zero_consumption', confidence: 0.6 };
  }

  // Spike detection: consumption far exceeds average
  if (consumption > AVERAGE_MONTHLY_CONSUMPTION * CONSUMPTION_SPIKE_MULTIPLIER) {
    const confidence = Math.min(
      0.95,
      0.5 + (consumption / (AVERAGE_MONTHLY_CONSUMPTION * 10)) * 0.5,
    );
    return { type: 'consumption_spike', confidence };
  }

  // Negative consumption (meter rollback / tampering)
  if (consumption < 0) {
    return { type: 'negative_consumption', confidence: 0.9 };
  }

  return null;
}
