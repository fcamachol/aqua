import { z } from 'zod';

// ─── Enums ─────────────────────────────────────────────────────
export const routeStatusEnum = z.enum(['draft', 'active', 'archived']);

export const optimizationMethodEnum = z.enum([
  'tsp_nearest', 'tsp_2opt', 'dijkstra', 'manual',
]);

export const assignmentStatusEnum = z.enum([
  'pendiente', 'en_progreso', 'completada', 'cancelada',
]);

// ─── Optimize Routes ───────────────────────────────────────────
export const optimizeRoutesSchema = z.object({
  zoneId: z.string().uuid(),
  billingPeriodId: z.string().uuid(),
  numCapturistas: z.coerce.number().int().min(1).max(50),
  maxReadingsPerRoute: z.coerce.number().int().min(1).max(1000),
  shiftDurationMin: z.coerce.number().int().min(60).max(720).default(480),
  optimizationMethod: optimizationMethodEnum.default('tsp_2opt'),
});
export type OptimizeRoutesInput = z.infer<typeof optimizeRoutesSchema>;

// ─── Create Route Graph (manual) ──────────────────────────────
export const createRouteGraphSchema = z.object({
  tenantId: z.string().uuid(),
  explotacionId: z.string().uuid(),
  zoneId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
});
export type CreateRouteGraphInput = z.infer<typeof createRouteGraphSchema>;

// ─── Assign Route ──────────────────────────────────────────────
export const assignRouteSchema = z.object({
  userId: z.string().uuid(),
  billingPeriodId: z.string().uuid(),
  assignedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
});
export type AssignRouteInput = z.infer<typeof assignRouteSchema>;

// ─── Update Assignment ─────────────────────────────────────────
export const updateAssignmentSchema = z.object({
  status: assignmentStatusEnum.optional(),
  readingsCompleted: z.coerce.number().int().min(0).optional(),
});
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;

// ─── List Routes Query ─────────────────────────────────────────
export const listRoutesQuerySchema = z.object({
  zoneId: z.string().uuid().optional(),
  billingPeriodId: z.string().uuid().optional(),
  status: routeStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListRoutesQueryInput = z.infer<typeof listRoutesQuerySchema>;

// ─── Route ID Param ────────────────────────────────────────────
export const routeIdSchema = z.object({
  id: z.string().uuid(),
});

// ─── Route + Assignment ID Params ──────────────────────────────
export const routeAssignmentParamsSchema = z.object({
  id: z.string().uuid(),
  aid: z.string().uuid(),
});

// ─── Zone ID Param ─────────────────────────────────────────────
export const zoneIdSchema = z.object({
  zoneId: z.string().uuid(),
});
