import { z } from 'zod';

// ---- Enums ----

export const ProcedureType = z.enum(['standard', 'commercial', 'government']);
export type ProcedureType = z.infer<typeof ProcedureType>;

export const ProcedureStatus = z.enum([
  'activo',
  'pausado',
  'resuelto',
  'cerrado',
  'judicial',
]);
export type ProcedureStatus = z.infer<typeof ProcedureStatus>;

export const ResolutionType = z.enum([
  'paid',
  'plan',
  'pardoned',
  'judicial',
  'write_off',
]);
export type ResolutionType = z.infer<typeof ResolutionType>;

export const RiskLevel = z.enum(['low_risk', 'medium_risk', 'high_risk', 'vulnerable']);
export type RiskLevel = z.infer<typeof RiskLevel>;

// ---- Request Schemas ----

export const ListDelinquencySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: ProcedureStatus.optional(),
  procedure_type: ProcedureType.optional(),
  contract_id: z.string().uuid().optional(),
  person_id: z.string().uuid().optional(),
  vulnerability_flag: z.coerce.boolean().optional(),
  min_debt: z.coerce.number().min(0).optional(),
  max_debt: z.coerce.number().min(0).optional(),
});
export type ListDelinquencyInput = z.infer<typeof ListDelinquencySchema>;

export const DelinquencyIdSchema = z.object({
  id: z.string().uuid(),
});

export const ExecuteStepSchema = z.object({
  action_override: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});
export type ExecuteStepInput = z.infer<typeof ExecuteStepSchema>;
