import { z } from 'zod';

// ─── RFC / CURP Format Patterns ─────────────────────────────────
const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
const CURP_REGEX = /^[A-Z]{4}\d{6}[HMX][A-Z]{2}[A-Z]{3}[A-Z0-9]\d$/;

// ─── Create Person ──────────────────────────────────────────────
export const createPersonSchema = z.object({
  person_type: z.enum(['fisica', 'moral']),
  rfc: z
    .string()
    .toUpperCase()
    .trim()
    .regex(RFC_REGEX, 'Invalid RFC format')
    .optional(),
  curp: z
    .string()
    .toUpperCase()
    .trim()
    .length(18, 'CURP must be 18 characters')
    .regex(CURP_REGEX, 'Invalid CURP format')
    .optional(),
  name: z.string().min(2).max(200),
  first_name: z.string().max(100).optional(),
  last_name_paterno: z.string().max(100).optional(),
  last_name_materno: z.string().max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  phone_secondary: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  fiscal_regime: z.string().max(3).optional(),
  fiscal_use: z.string().max(4).optional(),
  fiscal_address: z.record(z.unknown()).optional(),
  zip_code: z.string().length(5).optional(),
  vulnerable: z.boolean().default(false),
  vulnerability_type: z
    .enum(['adulto_mayor', 'discapacidad', 'pobreza'])
    .optional(),
  digital_access: z.boolean().default(false),
  preferred_channel: z
    .enum(['whatsapp', 'email', 'sms', 'phone', 'portal'])
    .default('whatsapp'),
  language: z.string().max(5).default('es-MX'),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).default([]),
});
export type CreatePersonInput = z.infer<typeof createPersonSchema>;

// ─── Update Person ──────────────────────────────────────────────
export const updatePersonSchema = createPersonSchema.partial().omit({
  person_type: true,
});
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;

// ─── Search Person ──────────────────────────────────────────────
export const searchPersonSchema = z.object({
  q: z.string().min(1).max(200).optional(),
  rfc: z.string().max(13).optional(),
  curp: z.string().max(18).optional(),
  phone: z.string().max(20).optional(),
  person_type: z.enum(['fisica', 'moral']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type SearchPersonInput = z.infer<typeof searchPersonSchema>;

// ─── Person ID Param ────────────────────────────────────────────
export const personIdSchema = z.object({
  id: z.string().uuid(),
});
