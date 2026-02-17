import { z } from 'zod';

// ---- Enums ----

export const OrderType = z.enum([
  'instalacion_medidor',
  'cambio_medidor',
  'reparacion',
  'corte',
  'reconexion',
  'inspeccion',
  'lectura_especial',
  'verificacion_fraude',
  'mantenimiento',
  'nueva_toma',
]);
export type OrderType = z.infer<typeof OrderType>;

export const OrderStatus = z.enum([
  'pendiente',
  'asignada',
  'en_ruta',
  'en_progreso',
  'completada',
  'cancelada',
  'reprogramada',
  'fallida',
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const OrderPriority = z.enum(['urgente', 'alta', 'normal', 'baja']);
export type OrderPriority = z.infer<typeof OrderPriority>;

export const OrderSource = z.enum(['system', 'manual', 'api', 'chatbot']);
export type OrderSource = z.infer<typeof OrderSource>;

// ---- GPS / Field Data ----

const GpsPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().datetime().optional(),
});

const PhotoSchema = z.object({
  url: z.string().url(),
  description: z.string().max(500).optional(),
  taken_at: z.string().datetime().optional(),
});

const MaterialSchema = z.object({
  item: z.string().min(1),
  quantity: z.number().positive(),
  unit_cost: z.number().min(0),
});

// ---- Request Schemas ----

export const CreateWorkOrderSchema = z.object({
  order_type: OrderType,
  contract_id: z.string().uuid().optional(),
  toma_id: z.string().uuid().optional(),
  meter_id: z.string().uuid().optional(),
  address_id: z.string().uuid().optional(),
  delinquency_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  team: z.string().max(50).optional(),
  priority: OrderPriority.default('normal'),
  scheduled_date: z.string().optional(),
  scheduled_time_start: z.string().optional(),
  scheduled_time_end: z.string().optional(),
  estimated_duration_minutes: z.number().int().positive().optional(),
  source: OrderSource.default('system'),
  notes: z.string().max(2000).optional(),
});
export type CreateWorkOrderInput = z.infer<typeof CreateWorkOrderSchema>;

export const ListWorkOrdersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: OrderStatus.optional(),
  order_type: OrderType.optional(),
  assigned_to: z.string().uuid().optional(),
  priority: OrderPriority.optional(),
  scheduled_date: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});
export type ListWorkOrdersInput = z.infer<typeof ListWorkOrdersSchema>;

export const UpdateWorkOrderSchema = z.object({
  status: OrderStatus.optional(),
  assigned_to: z.string().uuid().optional(),
  team: z.string().max(50).optional(),
  priority: OrderPriority.optional(),
  scheduled_date: z.string().optional(),
  scheduled_time_start: z.string().optional(),
  scheduled_time_end: z.string().optional(),
  estimated_duration_minutes: z.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateWorkOrderInput = z.infer<typeof UpdateWorkOrderSchema>;

export const CompleteWorkOrderSchema = z.object({
  result: z.string().min(1).max(2000),
  result_code: z.string().max(20).optional(),
  field_notes: z.string().max(5000).optional(),
  photos: z.array(PhotoSchema).default([]),
  gps_arrival: GpsPointSchema.optional(),
  gps_departure: GpsPointSchema.optional(),
  technician_signature_url: z.string().url().optional(),
  customer_signature_url: z.string().url().optional(),
  materials: z.array(MaterialSchema).default([]),
});
export type CompleteWorkOrderInput = z.infer<typeof CompleteWorkOrderSchema>;

export const WorkOrderIdSchema = z.object({
  id: z.string().uuid(),
});

export const RouteParamsSchema = z.object({
  user_id: z.string().uuid(),
});
