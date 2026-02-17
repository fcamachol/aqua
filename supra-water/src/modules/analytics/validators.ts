import { z } from 'zod';

// ---- Analytics Query Schemas ----

export const DashboardQuerySchema = z.object({
  explotacion_id: z.string().uuid().optional(),
});
export type DashboardQueryInput = z.infer<typeof DashboardQuerySchema>;

export const RevenueQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  from_date: z.string(),
  to_date: z.string(),
  explotacion_id: z.string().uuid().optional(),
});
export type RevenueQueryInput = z.infer<typeof RevenueQuerySchema>;

export const DelinquencyQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  explotacion_id: z.string().uuid().optional(),
});
export type DelinquencyQueryInput = z.infer<typeof DelinquencyQuerySchema>;

export const ConsumptionQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  toma_type: z.string().optional(),
  sector: z.string().optional(),
  explotacion_id: z.string().uuid().optional(),
});
export type ConsumptionQueryInput = z.infer<typeof ConsumptionQuerySchema>;

export const CollectionRateQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  explotacion_id: z.string().uuid().optional(),
});
export type CollectionRateQueryInput = z.infer<typeof CollectionRateQuerySchema>;

export const ConaguaReportQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
  report_type: z.enum([
    'monthly_extraction',
    'quarterly_efficiency',
  ]).default('monthly_extraction'),
  explotacion_id: z.string().uuid().optional(),
});
export type ConaguaReportQueryInput = z.infer<typeof ConaguaReportQuerySchema>;
