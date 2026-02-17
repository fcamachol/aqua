import { z } from 'zod';

// ---- Enums ----

export const DetectionSource = z.enum([
  'ai_anomaly',
  'manual_report',
  'field_inspection',
  'meter_data',
  'neighbor_report',
  'audit',
  'gis_analysis',
]);
export type DetectionSource = z.infer<typeof DetectionSource>;

export const FraudType = z.enum([
  'toma_clandestina',
  'medidor_alterado',
  'bypass',
]);
export type FraudType = z.infer<typeof FraudType>;

export const FraudStatus = z.enum([
  'abierto',
  'en_inspeccion',
  'confirmado',
  'no_confirmado',
  'en_proceso_legal',
  'resuelto',
  'cerrado',
]);
export type FraudStatus = z.infer<typeof FraudStatus>;

export const FraudResolutionType = z.enum([
  'regularization',
  'legal',
  'closed_no_fraud',
]);
export type FraudResolutionType = z.infer<typeof FraudResolutionType>;

// ---- Inspection Sub-schema ----

const InspectionSchema = z.object({
  date: z.string(),
  inspector_id: z.string().uuid(),
  findings: z.string().max(5000),
  photos: z.array(z.string().url()).default([]),
  result: z.string().max(500),
});

// ---- Request Schemas ----

export const CreateFraudCaseSchema = z.object({
  contract_id: z.string().uuid().optional(),
  toma_id: z.string().uuid().optional(),
  address_id: z.string().uuid(),
  detection_source: DetectionSource,
  detection_date: z.string(),
  anomaly_data: z.record(z.unknown()).optional(),
  fraud_type: FraudType.optional(),
  estimated_volume_m3: z.number().min(0).optional(),
  estimated_value: z.number().min(0).optional(),
  notes: z.string().max(5000).optional(),
});
export type CreateFraudCaseInput = z.infer<typeof CreateFraudCaseSchema>;

export const ListFraudCasesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: FraudStatus.optional(),
  detection_source: DetectionSource.optional(),
  fraud_type: FraudType.optional(),
  contract_id: z.string().uuid().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});
export type ListFraudCasesInput = z.infer<typeof ListFraudCasesSchema>;

export const UpdateFraudCaseSchema = z.object({
  status: FraudStatus.optional(),
  fraud_type: FraudType.optional(),
  estimated_volume_m3: z.number().min(0).optional(),
  estimated_value: z.number().min(0).optional(),
  resolution_type: FraudResolutionType.optional(),
  resolution_date: z.string().optional(),
  legal_case_reference: z.string().max(50).optional(),
  inspection: InspectionSchema.optional(),
  notes: z.string().max(5000).optional(),
});
export type UpdateFraudCaseInput = z.infer<typeof UpdateFraudCaseSchema>;

export const FraudCaseIdSchema = z.object({
  id: z.string().uuid(),
});
