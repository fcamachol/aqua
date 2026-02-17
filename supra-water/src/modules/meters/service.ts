import { db } from '../../config/database.js';
import { sql } from 'drizzle-orm';
import {
  emitMeterRegistered,
  emitReadingReceived,
  emitReadingAnomaly,
  emitMeterReplaced,
} from './events.js';
import type {
  RegisterMeterInput,
  SubmitReadingInput,
  SmartIngestInput,
  ReplaceMeterInput,
} from './validators.js';

// ─── Types ──────────────────────────────────────────────────────

export interface Meter {
  id: string;
  tenant_id: string;
  toma_id: string | null;
  serial_number: string;
  brand: string | null;
  model: string | null;
  diameter_inches: number | null;
  meter_type: string;
  is_smart: boolean;
  communication_protocol: string | null;
  device_eui: string | null;
  last_communication: string | null;
  installation_date: string | null;
  last_calibration_date: string | null;
  expected_replacement_date: string | null;
  status: string;
  initial_reading: number;
  location_description: string | null;
  accessible: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReadingResult {
  id: string;
  meter_id: string;
  toma_id: string;
  reading_value: number;
  consumption: number | null;
  status: string;
  anomaly_type: string | null;
}

// ─── Register Meter ─────────────────────────────────────────────

export async function registerMeter(
  tenantId: string,
  input: RegisterMeterInput,
): Promise<Meter> {
  const rows = await db.execute(sql`
    INSERT INTO meters (
      tenant_id, toma_id, serial_number, brand, model,
      diameter_inches, meter_type, is_smart,
      communication_protocol, device_eui,
      installation_date, last_calibration_date, expected_replacement_date,
      status, initial_reading, location_description, accessible, notes
    ) VALUES (
      ${tenantId}, ${input.toma_id ?? null}, ${input.serial_number},
      ${input.brand ?? null}, ${input.model ?? null},
      ${input.diameter_inches ?? null}, ${input.meter_type}, ${input.is_smart},
      ${input.communication_protocol ?? null}, ${input.device_eui ?? null},
      ${input.installation_date?.toISOString().split('T')[0] ?? null},
      ${input.last_calibration_date?.toISOString().split('T')[0] ?? null},
      ${input.expected_replacement_date?.toISOString().split('T')[0] ?? null},
      ${input.toma_id ? 'activo' : 'en_almacen'}, ${input.initial_reading},
      ${input.location_description ?? null}, ${input.accessible},
      ${input.notes ?? null}
    )
    RETURNING *
  `);

  const meter = rows[0] as unknown as Meter;

  // If assigned to a toma, update the toma's meter_id
  if (input.toma_id) {
    await db.execute(sql`
      UPDATE tomas SET meter_id = ${meter.id}, has_meter = true, updated_at = now()
      WHERE tenant_id = ${tenantId} AND id = ${input.toma_id}
    `);
  }

  await emitMeterRegistered(tenantId, {
    meter_id: meter.id,
    serial_number: meter.serial_number,
    toma_id: input.toma_id,
  });

  return meter;
}

// ─── Get Meter by ID ────────────────────────────────────────────

export async function getById(
  tenantId: string,
  id: string,
): Promise<Meter | null> {
  const rows = await db.execute(sql`
    SELECT * FROM meters
    WHERE tenant_id = ${tenantId} AND id = ${id}
    LIMIT 1
  `);
  return (rows[0] as unknown as Meter) ?? null;
}

// ─── Submit Manual Reading ──────────────────────────────────────

export async function submitReading(
  tenantId: string,
  meterId: string,
  input: SubmitReadingInput,
): Promise<ReadingResult> {
  // 1. Load meter and validate
  const meter = await getById(tenantId, meterId);
  if (!meter) {
    throw Object.assign(new Error('Meter not found'), { name: 'NotFoundError' });
  }
  if (!meter.toma_id) {
    throw Object.assign(
      new Error('Meter is not assigned to a toma'),
      { name: 'ConflictError' },
    );
  }

  // 2. Get previous reading for validation
  const prevRows = await db.execute(sql`
    SELECT reading_value, reading_date FROM meter_readings
    WHERE tenant_id = ${tenantId} AND meter_id = ${meterId}
    ORDER BY reading_date DESC LIMIT 1
  `);
  const previousReading = (prevRows[0] as any)?.reading_value ?? meter.initial_reading;

  // 3. Validate: new reading should be >= previous (meters don't go backwards)
  const consumption = input.reading_value - previousReading;
  let readingStatus = 'valid';
  let anomalyType: string | null = null;

  if (consumption < 0) {
    readingStatus = 'suspicious';
    anomalyType = 'negative';
  } else if (consumption === 0) {
    readingStatus = 'suspicious';
    anomalyType = 'zero';
  } else if (consumption > 500) {
    // Suspiciously high consumption (>500 m3 in a single reading)
    readingStatus = 'suspicious';
    anomalyType = 'high_consumption';
  }

  // 4. Get the active contract for this toma
  const contractRows = await db.execute(sql`
    SELECT id FROM contracts
    WHERE tenant_id = ${tenantId} AND toma_id = ${meter.toma_id}
      AND status IN ('activo', 'pendiente')
    ORDER BY created_at DESC LIMIT 1
  `);
  const contractId = (contractRows[0] as any)?.id ?? null;

  // 5. Store reading
  const readingDate = input.reading_date?.toISOString() ?? new Date().toISOString();

  const rows = await db.execute(sql`
    INSERT INTO meter_readings (
      tenant_id, meter_id, toma_id, contract_id,
      reading_value, previous_reading, consumption,
      reading_date, source, reader_user_id,
      status, anomaly_type, observations,
      photo_url, gps_latitude, gps_longitude
    ) VALUES (
      ${tenantId}, ${meterId}, ${meter.toma_id}, ${contractId},
      ${input.reading_value}, ${previousReading}, ${consumption},
      ${readingDate}, ${input.source}, ${input.reader_user_id ?? null},
      ${readingStatus}, ${anomalyType}, ${input.observations ?? null},
      ${input.photo_url ?? null}, ${input.gps_latitude ?? null}, ${input.gps_longitude ?? null}
    )
    RETURNING id, meter_id, toma_id, reading_value, consumption, status, anomaly_type
  `);

  const result = rows[0] as unknown as ReadingResult;

  // 6. Emit events
  await emitReadingReceived(tenantId, {
    reading_id: result.id,
    meter_id: meterId,
    toma_id: meter.toma_id,
    consumption: consumption,
  });

  if (anomalyType) {
    await emitReadingAnomaly(tenantId, {
      reading_id: result.id,
      anomaly_type: anomalyType,
      confidence: anomalyType === 'negative' ? 0.95 : 0.7,
    });
  }

  return result;
}

// ─── Smart Meter Bulk Ingestion ─────────────────────────────────

export async function smartIngest(
  tenantId: string,
  input: SmartIngestInput,
): Promise<{ ingested: number; errors: Array<{ device_eui: string; error: string }> }> {
  let ingested = 0;
  const errors: Array<{ device_eui: string; error: string }> = [];

  for (const reading of input.readings) {
    try {
      // 1. Look up meter by device_eui
      const meterRows = await db.execute(sql`
        SELECT id, toma_id, initial_reading FROM meters
        WHERE tenant_id = ${tenantId} AND device_eui = ${reading.device_eui}
          AND status = 'activo'
        LIMIT 1
      `);
      if (!meterRows[0]) {
        errors.push({ device_eui: reading.device_eui, error: 'Meter not found or inactive' });
        continue;
      }
      const meter = meterRows[0] as any;

      // 2. Get previous reading
      const prevRows = await db.execute(sql`
        SELECT reading_value FROM meter_readings
        WHERE tenant_id = ${tenantId} AND meter_id = ${meter.id}
        ORDER BY reading_date DESC LIMIT 1
      `);
      const previousReading = (prevRows[0] as any)?.reading_value ?? meter.initial_reading ?? 0;
      const consumption = reading.reading_value - previousReading;

      // 3. Determine status
      let status = 'valid';
      let anomalyType: string | null = null;
      if (consumption < 0) { status = 'suspicious'; anomalyType = 'negative'; }
      else if (consumption === 0) { status = 'suspicious'; anomalyType = 'zero'; }
      else if (consumption > 500) { status = 'suspicious'; anomalyType = 'high_consumption'; }

      // 4. Get contract
      const contractRows = await db.execute(sql`
        SELECT id FROM contracts
        WHERE tenant_id = ${tenantId} AND toma_id = ${meter.toma_id}
          AND status IN ('activo', 'pendiente')
        ORDER BY created_at DESC LIMIT 1
      `);
      const contractId = (contractRows[0] as any)?.id ?? null;

      // 5. Insert reading
      const insertRows = await db.execute(sql`
        INSERT INTO meter_readings (
          tenant_id, meter_id, toma_id, contract_id,
          reading_value, previous_reading, consumption,
          reading_date, source, device_id, status, anomaly_type
        ) VALUES (
          ${tenantId}, ${meter.id}, ${meter.toma_id}, ${contractId},
          ${reading.reading_value}, ${previousReading}, ${consumption},
          ${reading.timestamp.toISOString()}, 'smart_meter', ${reading.device_eui},
          ${status}, ${anomalyType}
        )
        RETURNING id
      `);

      // 6. Update meter last_communication
      await db.execute(sql`
        UPDATE meters SET last_communication = ${reading.timestamp.toISOString()}, updated_at = now()
        WHERE tenant_id = ${tenantId} AND id = ${meter.id}
      `);

      const readingId = (insertRows[0] as any).id;

      await emitReadingReceived(tenantId, {
        reading_id: readingId,
        meter_id: meter.id,
        toma_id: meter.toma_id,
        consumption,
      });

      if (anomalyType) {
        await emitReadingAnomaly(tenantId, {
          reading_id: readingId,
          anomaly_type: anomalyType,
          confidence: anomalyType === 'negative' ? 0.95 : 0.7,
        });
      }

      ingested++;
    } catch (err) {
      errors.push({
        device_eui: reading.device_eui,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return { ingested, errors };
}

// ─── Meter Replacement ──────────────────────────────────────────

export async function replaceMeter(
  tenantId: string,
  meterId: string,
  input: ReplaceMeterInput,
): Promise<{ old_meter: Meter; new_meter: Meter }> {
  // 1. Load old meter
  const oldMeter = await getById(tenantId, meterId);
  if (!oldMeter) {
    throw Object.assign(new Error('Meter not found'), { name: 'NotFoundError' });
  }
  if (!oldMeter.toma_id) {
    throw Object.assign(
      new Error('Meter is not assigned to a toma'),
      { name: 'ConflictError' },
    );
  }

  // 2. Record final reading on old meter
  await submitReading(tenantId, meterId, {
    reading_value: input.final_reading_old,
    source: 'manual_office',
    observations: `Lectura final por reemplazo de medidor: ${input.reason}`,
  });

  // 3. Deactivate old meter
  await db.execute(sql`
    UPDATE meters
    SET status = 'retirado', toma_id = NULL, updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${meterId}
  `);

  const updatedOldRows = await db.execute(sql`
    SELECT * FROM meters WHERE tenant_id = ${tenantId} AND id = ${meterId}
  `);
  const updatedOld = updatedOldRows[0] as unknown as Meter;

  // 4. Register new meter and assign to same toma
  const newMeter = await registerMeter(tenantId, {
    toma_id: oldMeter.toma_id,
    serial_number: input.new_serial_number,
    brand: input.new_brand,
    model: input.new_model,
    diameter_inches: input.new_diameter_inches,
    meter_type: input.new_meter_type,
    is_smart: input.new_is_smart,
    communication_protocol: input.new_communication_protocol,
    device_eui: input.new_device_eui,
    installation_date: new Date(),
    initial_reading: input.initial_reading_new,
    accessible: oldMeter.accessible,
    location_description: oldMeter.location_description ?? undefined,
  });

  // 5. Emit replacement event
  await emitMeterReplaced(tenantId, {
    old_meter_id: meterId,
    new_meter_id: newMeter.id,
    toma_id: oldMeter.toma_id,
    reason: input.reason,
  });

  return { old_meter: updatedOld, new_meter: newMeter };
}
