import { z } from 'zod';

// ---- Enums ----

export const PaymentMethod = z.enum([
  'efectivo',
  'tarjeta_debito',
  'tarjeta_credito',
  'transferencia_spei',
  'codi',
  'oxxo',
  'domiciliacion',
  'cheque',
  'gestor_cobro',
  'portal_web',
]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

export const PaymentChannel = z.enum([
  'ventanilla',
  'banco',
  'portal',
  'whatsapp',
  'oxxo',
  'kiosko',
  'domiciliacion',
  'api',
]);
export type PaymentChannel = z.infer<typeof PaymentChannel>;

export const PaymentStatus = z.enum([
  'pending',
  'completed',
  'failed',
  'bounced',
  'refunded',
  'cancelled',
]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const InvoiceStatus = z.enum([
  'pendiente',
  'cobrada',
  'parcial',
  'cancelada',
  'vencida',
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatus>;

// ---- Request Schemas ----

export const ProcessPaymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_method: PaymentMethod,
  channel: PaymentChannel,
  transaction_data: z.record(z.unknown()).default({}),
});
export type ProcessPaymentInput = z.infer<typeof ProcessPaymentSchema>;

export const ListPaymentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: PaymentStatus.optional(),
  payment_method: PaymentMethod.optional(),
  channel: PaymentChannel.optional(),
  invoice_id: z.string().uuid().optional(),
  contract_id: z.string().uuid().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
});
export type ListPaymentsInput = z.infer<typeof ListPaymentsSchema>;

export const ReconcileBatchSchema = z.object({
  source: z.enum(['spei', 'oxxo', 'bank_statement', 'domiciliacion']),
  entries: z.array(
    z.object({
      external_reference: z.string(),
      amount: z.number().positive(),
      transaction_date: z.string(),
      payer_name: z.string().optional(),
      payer_clabe: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    }),
  ),
});
export type ReconcileBatchInput = z.infer<typeof ReconcileBatchSchema>;

// ---- SPEI Webhook ----

export const SpeiWebhookSchema = z.object({
  id: z.string(),
  clabe_destino: z.string(),
  clabe_origen: z.string().optional(),
  monto: z.number().positive(),
  referencia_numerica: z.string(),
  concepto: z.string().optional(),
  nombre_ordenante: z.string().optional(),
  fecha_operacion: z.string(),
});
export type SpeiWebhookInput = z.infer<typeof SpeiWebhookSchema>;

// ---- OXXO Webhook (Conekta) ----

export const OxxoWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      amount: z.number(),
      currency: z.string(),
      payment_method: z.object({
        type: z.literal('oxxo'),
        reference: z.string(),
        barcode_url: z.string().optional(),
      }),
      status: z.string(),
      paid_at: z.number().optional(),
    }),
  }),
});
export type OxxoWebhookInput = z.infer<typeof OxxoWebhookSchema>;

// ---- Card Webhook (Conekta) ----

export const CardWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      amount: z.number(),
      currency: z.string(),
      payment_method: z.object({
        type: z.string(),
        last4: z.string().optional(),
        brand: z.string().optional(),
      }),
      status: z.string(),
    }),
  }),
});
export type CardWebhookInput = z.infer<typeof CardWebhookSchema>;

// ---- Conekta Charge ----

export const CreateChargeSchema = z.object({
  invoice_id: z.string().uuid(),
  token_id: z.string(),
  amount: z.number().positive(),
  three_d_secure: z.boolean().default(false),
  customer_email: z.string().email().optional(),
  customer_name: z.string().optional(),
});
export type CreateChargeInput = z.infer<typeof CreateChargeSchema>;

export const RefundSchema = z.object({
  payment_id: z.string().uuid(),
  amount: z.number().positive().optional(),
  reason: z.string().optional(),
});
export type RefundInput = z.infer<typeof RefundSchema>;

// ---- Bank Domiciliation ----

export const RegisterDomiciliacionSchema = z.object({
  contract_id: z.string().uuid(),
  clabe: z.string().length(18).regex(/^\d{18}$/, 'CLABE must be 18 digits'),
  account_holder_name: z.string().min(1),
  bank_name: z.string().optional(),
});
export type RegisterDomiciliacionInput = z.infer<typeof RegisterDomiciliacionSchema>;

// ---- Payment Plan (Convenio de Pago) ----

export const CreatePaymentPlanSchema = z.object({
  contract_id: z.string().uuid(),
  invoice_ids: z.array(z.string().uuid()).min(1),
  total_amount: z.number().positive(),
  down_payment: z.number().min(0).default(0),
  installments: z.number().int().min(2).max(48),
  interest_rate: z.number().min(0).max(100).default(0),
  start_date: z.string(),
  notes: z.string().optional(),
});
export type CreatePaymentPlanInput = z.infer<typeof CreatePaymentPlanSchema>;

export const RecordInstallmentSchema = z.object({
  amount: z.number().positive(),
  payment_method: PaymentMethod,
  channel: PaymentChannel,
  transaction_data: z.record(z.unknown()).default({}),
});
export type RecordInstallmentInput = z.infer<typeof RecordInstallmentSchema>;

export const PaymentPlanStatus = z.enum([
  'active',
  'completed',
  'defaulted',
  'cancelled',
]);
export type PaymentPlanStatus = z.infer<typeof PaymentPlanStatus>;
