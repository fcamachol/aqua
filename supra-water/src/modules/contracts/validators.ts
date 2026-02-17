import { z } from 'zod';

// ─── Contract Status ────────────────────────────────────────────
export const contractStatusEnum = z.enum([
  'pendiente', 'activo', 'suspendido', 'baja', 'cancelado',
]);

export const paymentMethodEnum = z.enum([
  'ventanilla', 'domiciliacion', 'digital', 'oxxo', 'gestor_cobro',
]);

// ─── Create Contract ────────────────────────────────────────────
export const createContractSchema = z.object({
  person_id: z.string().uuid(),
  toma_id: z.string().uuid(),
  explotacion_id: z.string().uuid(),
  tariff_category: z.string().max(30),
  billing_period: z.enum(['mensual', 'bimestral', 'trimestral']).default('mensual'),
  payment_method: paymentMethodEnum.default('ventanilla'),
  bank_account: z
    .object({
      clabe: z.string().length(18).optional(),
      bank_name: z.string().max(100).optional(),
    })
    .optional(),
  digital_invoice: z.boolean().default(false),
  social_tariff: z.boolean().default(false),
  special_conditions: z.record(z.unknown()).optional(),
  preferred_contact_method: z
    .enum(['whatsapp', 'email', 'sms', 'phone', 'portal'])
    .default('whatsapp'),
  notification_channels: z
    .array(z.enum(['whatsapp', 'email', 'sms', 'portal']))
    .default(['whatsapp']),
  billing_address_id: z.string().uuid().optional(),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string(),
        verified: z.boolean().default(false),
      }),
    )
    .default([]),
  notes: z.string().max(2000).optional(),
});
export type CreateContractInput = z.infer<typeof createContractSchema>;

// ─── Update Contract ────────────────────────────────────────────
export const updateContractSchema = z.object({
  payment_method: paymentMethodEnum.optional(),
  bank_account: z
    .object({
      clabe: z.string().length(18).optional(),
      bank_name: z.string().max(100).optional(),
    })
    .optional(),
  digital_invoice: z.boolean().optional(),
  social_tariff: z.boolean().optional(),
  special_conditions: z.record(z.unknown()).optional(),
  preferred_contact_method: z
    .enum(['whatsapp', 'email', 'sms', 'phone', 'portal'])
    .optional(),
  notification_channels: z
    .array(z.enum(['whatsapp', 'email', 'sms', 'portal']))
    .optional(),
  billing_address_id: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateContractInput = z.infer<typeof updateContractSchema>;

// ─── Terminate Contract ─────────────────────────────────────────
export const terminateContractSchema = z.object({
  reason: z.string().min(3).max(500),
  final_reading: z.number().min(0).optional(),
});
export type TerminateContractInput = z.infer<typeof terminateContractSchema>;

// ─── Change Titular ─────────────────────────────────────────────
export const changeTitularSchema = z.object({
  new_person_id: z.string().uuid(),
  transfer_debt: z.boolean().default(false),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string(),
        verified: z.boolean().default(false),
      }),
    )
    .default([]),
  notes: z.string().max(2000).optional(),
});
export type ChangeTitularInput = z.infer<typeof changeTitularSchema>;

// ─── Subrogate Contract ─────────────────────────────────────────
export const subrogateContractSchema = z.object({
  new_person_id: z.string().uuid(),
  reason: z.string().min(3).max(500),
  transfer_debt: z.boolean().default(true),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string(),
        verified: z.boolean().default(false),
      }),
    )
    .default([]),
  notes: z.string().max(2000).optional(),
});
export type SubrogateContractInput = z.infer<typeof subrogateContractSchema>;

// ─── List Contracts ─────────────────────────────────────────────
export const listContractsSchema = z.object({
  status: contractStatusEnum.optional(),
  person_id: z.string().uuid().optional(),
  toma_id: z.string().uuid().optional(),
  explotacion_id: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['contract_number', 'start_date', 'created_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type ListContractsInput = z.infer<typeof listContractsSchema>;

// ─── Contract ID Param ──────────────────────────────────────────
export const contractIdSchema = z.object({
  id: z.string().uuid(),
});
