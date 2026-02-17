import { z } from 'zod';

// ---- Enums ----

export const ContactType = z.enum([
  'consulta',
  'queja',
  'solicitud',
  'reporte_fuga',
  'felicitacion',
  'sugerencia',
  'reclamo',
  'informacion',
]);
export type ContactType = z.infer<typeof ContactType>;

export const ContactChannel = z.enum([
  'whatsapp',
  'telefono',
  'email',
  'presencial',
  'portal_web',
  'redes_sociales',
  'chatbot',
  'voice_ai',
]);
export type ContactChannel = z.infer<typeof ContactChannel>;

export const ContactStatus = z.enum([
  'abierto',
  'en_proceso',
  'pendiente_cliente',
  'resuelto',
  'cerrado',
  'escalado',
  'transferido',
]);
export type ContactStatus = z.infer<typeof ContactStatus>;

export const ContactPriority = z.enum(['urgente', 'alta', 'normal', 'baja']);
export type ContactPriority = z.infer<typeof ContactPriority>;

// ---- Request Schemas ----

export const CreateContactSchema = z.object({
  contact_type: ContactType,
  person_id: z.string().uuid().optional(),
  contract_id: z.string().uuid().optional(),
  toma_id: z.string().uuid().optional(),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  subject: z.string().max(300),
  description: z.string().max(5000),
  channel: ContactChannel,
  channel_conversation_id: z.string().max(200).optional(),
  priority: ContactPriority.default('normal'),
  notes: z.string().max(2000).optional(),
});
export type CreateContactInput = z.infer<typeof CreateContactSchema>;

export const ListContactsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: ContactStatus.optional(),
  contact_type: ContactType.optional(),
  channel: ContactChannel.optional(),
  priority: ContactPriority.optional(),
  person_id: z.string().uuid().optional(),
  contract_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  sla_breached: z.coerce.boolean().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});
export type ListContactsInput = z.infer<typeof ListContactsSchema>;

export const UpdateContactSchema = z.object({
  status: ContactStatus.optional(),
  assigned_to: z.string().uuid().optional(),
  department: z.string().max(50).optional(),
  priority: ContactPriority.optional(),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  resolution: z.string().max(5000).optional(),
  resolution_satisfaction: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;

export const EscalateContactSchema = z.object({
  department: z.string().max(50),
  reason: z.string().max(1000),
  assigned_to: z.string().uuid().optional(),
});
export type EscalateContactInput = z.infer<typeof EscalateContactSchema>;

export const ContactIdSchema = z.object({
  id: z.string().uuid(),
});
