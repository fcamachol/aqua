import { z } from 'zod';

// ─── Toma enums ─────────────────────────────────────────────────
export const tomaTypeEnum = z.enum([
  'domestica', 'comercial', 'industrial', 'gobierno',
  'mixta', 'rural', 'hidrante', 'fuente', 'temporal',
]);

export const tomaStatusEnum = z.enum([
  'activa', 'cortada', 'suspendida', 'baja', 'clausurada', 'pendiente_alta',
]);

export const billingTypeEnum = z.enum(['medido', 'cuota_fija', 'estimado']);
export const billingPeriodEnum = z.enum(['mensual', 'bimestral', 'trimestral']);

// ─── List Tomas ─────────────────────────────────────────────────
export const listTomasSchema = z.object({
  toma_type: tomaTypeEnum.optional(),
  status: tomaStatusEnum.optional(),
  explotacion_id: z.string().uuid().optional(),
  has_meter: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['toma_number', 'created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type ListTomasInput = z.infer<typeof listTomasSchema>;

// ─── Update Toma ────────────────────────────────────────────────
export const updateTomaSchema = z.object({
  toma_type: tomaTypeEnum.optional(),
  status: tomaStatusEnum.optional(),
  billing_type: billingTypeEnum.optional(),
  tariff_category: z.string().max(30).optional(),
  billing_period: billingPeriodEnum.optional(),
  inhabitants: z.number().int().min(0).optional(),
  property_type: z.string().max(30).optional(),
  notes: z.string().max(2000).optional(),
  has_meter: z.boolean().optional(),
});
export type UpdateTomaInput = z.infer<typeof updateTomaSchema>;

// ─── Toma Readings Query ────────────────────────────────────────
export const tomaReadingsSchema = z.object({
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  source: z
    .enum(['smart_meter', 'manual_field', 'manual_office', 'autolectura', 'telelectura', 'estimated', 'photo', 'api'])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type TomaReadingsInput = z.infer<typeof tomaReadingsSchema>;

// ─── Consumption Summary Query ──────────────────────────────────
export const consumptionSummarySchema = z.object({
  period: z.enum(['monthly', 'bimonthly', 'quarterly', 'yearly']).default('monthly'),
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
});
export type ConsumptionSummaryInput = z.infer<typeof consumptionSummarySchema>;

// ─── Toma ID Param ──────────────────────────────────────────────
export const tomaIdSchema = z.object({
  id: z.string().uuid(),
});
