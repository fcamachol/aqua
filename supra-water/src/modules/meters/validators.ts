import { z } from 'zod';

// ─── Meter enums ────────────────────────────────────────────────
export const meterTypeEnum = z.enum([
  'volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart',
]);

export const meterStatusEnum = z.enum([
  'activo', 'inactivo', 'averiado', 'retirado', 'en_almacen',
]);

export const communicationProtocolEnum = z.enum([
  'lorawan', 'nbiot', 'sigfox', 'wifi',
]);

// ─── Register Meter ─────────────────────────────────────────────
export const registerMeterSchema = z.object({
  toma_id: z.string().uuid().optional(),
  serial_number: z.string().min(1).max(50),
  brand: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  diameter_inches: z.number().positive().optional(),
  meter_type: meterTypeEnum,
  is_smart: z.boolean().default(false),
  communication_protocol: communicationProtocolEnum.optional(),
  device_eui: z.string().max(50).optional(),
  installation_date: z.coerce.date().optional(),
  last_calibration_date: z.coerce.date().optional(),
  expected_replacement_date: z.coerce.date().optional(),
  initial_reading: z.number().min(0).default(0),
  location_description: z.string().max(200).optional(),
  accessible: z.boolean().default(true),
  notes: z.string().max(2000).optional(),
});
export type RegisterMeterInput = z.infer<typeof registerMeterSchema>;

// ─── Submit Manual Reading ──────────────────────────────────────
export const submitReadingSchema = z.object({
  reading_value: z.number().min(0),
  reading_date: z.coerce.date().optional(),
  source: z
    .enum(['manual_field', 'manual_office', 'autolectura', 'photo'])
    .default('manual_field'),
  observations: z.string().max(1000).optional(),
  photo_url: z.string().max(500).optional(),
  gps_latitude: z.number().optional(),
  gps_longitude: z.number().optional(),
  reader_user_id: z.string().uuid().optional(),
});
export type SubmitReadingInput = z.infer<typeof submitReadingSchema>;

// ─── Smart Meter Bulk Ingestion ─────────────────────────────────
export const smartIngestSchema = z.object({
  readings: z.array(
    z.object({
      device_eui: z.string().max(50),
      reading_value: z.number().min(0),
      timestamp: z.coerce.date(),
      battery_level: z.number().min(0).max(100).optional(),
      signal_strength: z.number().optional(),
    }),
  ).min(1).max(1000),
});
export type SmartIngestInput = z.infer<typeof smartIngestSchema>;

// ─── Meter Replacement ──────────────────────────────────────────
export const replaceMeterSchema = z.object({
  new_serial_number: z.string().min(1).max(50),
  new_brand: z.string().max(50).optional(),
  new_model: z.string().max(50).optional(),
  new_diameter_inches: z.number().positive().optional(),
  new_meter_type: meterTypeEnum,
  new_is_smart: z.boolean().default(false),
  new_communication_protocol: communicationProtocolEnum.optional(),
  new_device_eui: z.string().max(50).optional(),
  final_reading_old: z.number().min(0),
  initial_reading_new: z.number().min(0).default(0),
  reason: z.string().min(3).max(500),
});
export type ReplaceMeterInput = z.infer<typeof replaceMeterSchema>;

// ─── Meter ID Param ─────────────────────────────────────────────
export const meterIdSchema = z.object({
  id: z.string().uuid(),
});
