import { z } from 'zod';

// ─── Invoice Generation ─────────────────────────────────────────
export const generateInvoiceSchema = z.object({
  contractId: z.string().uuid(),
  readingId: z.string().uuid().optional(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  invoiceType: z
    .enum(['periodica', 'manual', 'abono', 'nota_credito', 'refactura'])
    .default('periodica'),
  origin: z
    .enum(['lecturas', 'contratacion', 'varios', 'fraude', 'reconexion'])
    .default('lecturas'),
  notes: z.string().max(1000).optional(),
});
export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;

// ─── List Invoices ──────────────────────────────────────────────
export const listInvoicesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum([
      'provisional', 'pendiente', 'bloqueada', 'cobrada',
      'impagada', 'abonada', 'parcial', 'descargada', 'amortizada',
    ])
    .optional(),
  contractId: z.string().uuid().optional(),
  personId: z.string().uuid().optional(),
  invoiceType: z
    .enum(['periodica', 'manual', 'abono', 'nota_credito', 'refactura'])
    .optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(['billing_date', 'due_date', 'total', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type ListInvoicesInput = z.infer<typeof listInvoicesSchema>;

// ─── Invoice ID Param ───────────────────────────────────────────
export const invoiceIdSchema = z.object({
  id: z.string().uuid(),
});

// ─── Cancel Invoice ─────────────────────────────────────────────
export const cancelInvoiceSchema = z.object({
  reason: z.string().min(5).max(500),
  cancellationCode: z
    .enum(['01', '02', '03', '04'])
    .default('02'),
  // SAT cancellation reasons:
  // 01 = Comprobante emitido con errores con relación
  // 02 = Comprobante emitido con errores sin relación
  // 03 = No se llevó a cabo la operación
  // 04 = Operación nominativa relacionada en factura global
  relatedFolioFiscal: z.string().uuid().optional(),
});
export type CancelInvoiceInput = z.infer<typeof cancelInvoiceSchema>;

// ─── Credit Note ────────────────────────────────────────────────
export const creditNoteSchema = z.object({
  reason: z.string().min(5).max(500),
  lineAdjustments: z
    .array(
      z.object({
        conceptCode: z.string(),
        adjustedSubtotal: z.number().min(0),
      }),
    )
    .optional(),
});
export type CreditNoteInput = z.infer<typeof creditNoteSchema>;
