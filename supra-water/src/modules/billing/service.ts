/**
 * Billing Service — SUPRA Water 2026
 *
 * Main billing orchestration service implementing the full invoice lifecycle
 * from SUPRA spec section 4.3. Event-driven: triggered by reading.billing_ready.
 */

import { db } from '../../config/database.js';
import { calculateTariff, type TariffSchedule, type InvoiceLineItem } from './tariff-calculator.js';
import { stampInvoice, cancelInvoice as cfdiCancel, buildCFDI, SAT_CATALOGS, type CFDIEmisor, type CFDIReceptor } from './cfdi-service.js';
import { generateInvoicePDF, type InvoicePDFData } from './pdf-generator.js';
import { emitBillingEvent } from './events.js';
import type { GenerateInvoiceInput, ListInvoicesInput, CancelInvoiceInput, CreditNoteInput } from './validators.js';
import dayjs from 'dayjs';

// ─── Types ──────────────────────────────────────────────────────

interface Invoice {
  id: string;
  tenantId: string;
  contractId: string;
  personId: string;
  tomaId: string;
  explotacionId: string;
  invoiceNumber: string;
  folioFiscal: string | null;
  serie: string;
  invoiceType: string;
  origin: string;
  periodStart: Date;
  periodEnd: Date;
  billingDate: Date;
  dueDate: Date;
  subtotal: number;
  ivaAmount: number;
  total: number;
  currency: string;
  readingId: string | null;
  consumptionM3: number | null;
  previousReading: number | null;
  currentReading: number | null;
  status: string;
  cfdiStatus: string | null;
  cfdiXml: string | null;
  cfdiPdfUrl: string | null;
  cfdiStampDate: Date | null;
  paymentReference: string | null;
  speiReference: string | null;
  relatedInvoiceId: string | null;
  delivered: boolean;
  deliveryChannel: string | null;
  deliveredAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceLine {
  id: string;
  invoiceId: string;
  tenantId: string;
  conceptCode: string;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ivaRate: number;
  ivaAmount: number;
  total: number;
  tariffDetail: unknown;
  claveProdServ: string;
  claveUnidad: string;
  sortOrder: number;
}

interface InvoiceWithLines extends Invoice {
  lines: InvoiceLine[];
}

// ─── Generate Invoice ───────────────────────────────────────────

/**
 * Full invoice generation flow from SUPRA spec 4.3:
 * 1. Load contract, toma, person, tariff schedule
 * 2. Get consumption from reading
 * 3. Calculate line items (tarifa escalonada + additional concepts)
 * 4. Create invoice record with status 'provisional'
 * 5. Generate payment references
 * 6. Emit 'invoice.generated' event
 */
export async function generateInvoice(
  tenantId: string,
  input: GenerateInvoiceInput,
  userId?: string,
): Promise<InvoiceWithLines> {
  // 1. Load contract with related entities
  const [contract] = await db.execute({
    sql: `
      SELECT c.*, t.toma_number, t.toma_type, t.billing_type,
             t.id AS toma_id, t.explotacion_id,
             p.id AS person_id, p.full_name, p.rfc, p.fiscal_regime,
             p.fiscal_address_cp
      FROM contracts c
      JOIN tomas t ON t.id = c.toma_id AND t.tenant_id = c.tenant_id
      JOIN persons p ON p.id = c.person_id AND p.tenant_id = c.tenant_id
      WHERE c.id = $1 AND c.tenant_id = $2
    `,
    args: [input.contractId, tenantId],
  });

  if (!contract) {
    throw Object.assign(new Error('Contract not found'), { name: 'NotFoundError' });
  }

  // 2. Get consumption from reading (if provided)
  let consumptionM3 = 0;
  let previousReading: number | null = null;
  let currentReading: number | null = null;

  if (input.readingId) {
    const [reading] = await db.execute({
      sql: `
        SELECT reading_value, previous_reading, consumption
        FROM meter_readings
        WHERE id = $1 AND tenant_id = $2
      `,
      args: [input.readingId, tenantId],
    });

    if (!reading) {
      throw Object.assign(new Error('Reading not found'), { name: 'NotFoundError' });
    }

    consumptionM3 = Number(reading.consumption) || 0;
    previousReading = reading.previous_reading != null ? Number(reading.previous_reading) : null;
    currentReading = reading.reading_value != null ? Number(reading.reading_value) : null;
  }

  // 3. Load tariff schedule for contract's category and explotacion
  const [tariffRow] = await db.execute({
    sql: `
      SELECT id, category, billing_period, blocks, additional_concepts,
             iva_applicable, social_discount_pct
      FROM tariff_schedules
      WHERE tenant_id = $1
        AND (explotacion_id = $2 OR explotacion_id IS NULL)
        AND category = $3
        AND active = true
        AND effective_from <= $4
        AND (effective_until IS NULL OR effective_until >= $4)
      ORDER BY explotacion_id NULLS LAST, effective_from DESC
      LIMIT 1
    `,
    args: [tenantId, contract.explotacion_id, contract.tariff_category, input.periodEnd],
  });

  if (!tariffRow) {
    throw Object.assign(
      new Error(`No active tariff schedule found for category '${contract.tariff_category}'`),
      { name: 'NotFoundError' },
    );
  }

  const tariff: TariffSchedule = {
    id: tariffRow.id as string,
    category: tariffRow.category as string,
    billingPeriod: tariffRow.billing_period as string,
    blocks: typeof tariffRow.blocks === 'string'
      ? JSON.parse(tariffRow.blocks)
      : tariffRow.blocks as TariffSchedule['blocks'],
    additionalConcepts: typeof tariffRow.additional_concepts === 'string'
      ? JSON.parse(tariffRow.additional_concepts)
      : (tariffRow.additional_concepts as TariffSchedule['additionalConcepts']) ?? [],
    ivaApplicable: !!tariffRow.iva_applicable,
    socialDiscountPct: tariffRow.social_discount_pct != null
      ? Number(tariffRow.social_discount_pct)
      : null,
  };

  // 4. Calculate line items
  const calculation = calculateTariff(consumptionM3, tariff, {
    socialTariffEligible: !!contract.social_tariff,
  });

  // 5. Generate sequential invoice number
  const [seqResult] = await db.execute({
    sql: `
      SELECT COALESCE(MAX(CAST(invoice_number AS INTEGER)), 0) + 1 AS next_number
      FROM invoices
      WHERE tenant_id = $1
    `,
    args: [tenantId],
  });
  const invoiceNumber = String(seqResult.next_number).padStart(8, '0');

  // 6. Generate payment references
  const paymentReference = generateOxxoReference(tenantId, invoiceNumber);
  const speiReference = generateSpeiReference(invoiceNumber);

  // 7. Determine due date (30 days from billing)
  const billingDate = new Date();
  const dueDate = dayjs(billingDate).add(30, 'day').toDate();

  // 8. Insert invoice record
  const [newInvoice] = await db.execute({
    sql: `
      INSERT INTO invoices (
        tenant_id, contract_id, person_id, toma_id, explotacion_id,
        invoice_number, serie, invoice_type, origin,
        period_start, period_end, billing_date, due_date,
        subtotal, iva_amount, total, currency,
        reading_id, consumption_m3, previous_reading, current_reading,
        status, payment_reference, spei_reference, notes,
        reading_id_fk
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, 'MXN',
        $17, $18, $19, $20,
        'provisional', $21, $22, $23,
        $17
      )
      RETURNING *
    `,
    args: [
      tenantId, input.contractId, contract.person_id, contract.toma_id, contract.explotacion_id,
      invoiceNumber, 'A', input.invoiceType, input.origin,
      input.periodStart, input.periodEnd, billingDate, dueDate,
      calculation.subtotal, calculation.ivaTotal, calculation.grandTotal,
      input.readingId ?? null, consumptionM3, previousReading, currentReading,
      paymentReference, speiReference, input.notes ?? null,
    ],
  });

  // 9. Insert line items
  const insertedLines: InvoiceLine[] = [];
  for (const line of calculation.lines) {
    const [inserted] = await db.execute({
      sql: `
        INSERT INTO invoice_lines (
          invoice_id, tenant_id, concept_code, concept_name,
          quantity, unit_price, subtotal, iva_rate, iva_amount, total,
          tariff_detail, clave_prod_serv, clave_unidad, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `,
      args: [
        newInvoice.id, tenantId, line.conceptCode, line.conceptName,
        line.quantity, line.unitPrice, line.subtotal, line.ivaRate, line.ivaAmount, line.total,
        JSON.stringify(line.tariffDetail ?? null), line.claveProdServ, line.claveUnidad, line.sortOrder,
      ],
    });
    insertedLines.push(mapInvoiceLine(inserted));
  }

  // 10. Emit 'invoice.generated' event
  await emitBillingEvent({
    type: 'invoice.generated',
    tenantId,
    aggregateId: newInvoice.id as string,
    payload: {
      invoiceNumber,
      contractId: input.contractId,
      personId: contract.person_id,
      total: calculation.grandTotal,
      consumptionM3,
      status: 'provisional',
    },
    metadata: { userId, source: 'billing-service' },
  });

  return {
    ...mapInvoice(newInvoice),
    lines: insertedLines,
  };
}

// ─── Get Invoice ────────────────────────────────────────────────

export async function getInvoice(
  tenantId: string,
  invoiceId: string,
): Promise<InvoiceWithLines> {
  const [invoice] = await db.execute({
    sql: 'SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2',
    args: [invoiceId, tenantId],
  });

  if (!invoice) {
    throw Object.assign(new Error('Invoice not found'), { name: 'NotFoundError' });
  }

  const lines = await db.execute({
    sql: 'SELECT * FROM invoice_lines WHERE invoice_id = $1 AND tenant_id = $2 ORDER BY sort_order',
    args: [invoiceId, tenantId],
  });

  return {
    ...mapInvoice(invoice),
    lines: (lines as unknown as Record<string, unknown>[]).map(mapInvoiceLine),
  };
}

// ─── List Invoices ──────────────────────────────────────────────

export async function listInvoices(
  tenantId: string,
  filters: ListInvoicesInput,
): Promise<{
  data: Invoice[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const conditions: string[] = ['tenant_id = $1'];
  const args: unknown[] = [tenantId];
  let paramIndex = 2;

  if (filters.status) {
    conditions.push(`status = $${paramIndex++}`);
    args.push(filters.status);
  }
  if (filters.contractId) {
    conditions.push(`contract_id = $${paramIndex++}`);
    args.push(filters.contractId);
  }
  if (filters.personId) {
    conditions.push(`person_id = $${paramIndex++}`);
    args.push(filters.personId);
  }
  if (filters.invoiceType) {
    conditions.push(`invoice_type = $${paramIndex++}`);
    args.push(filters.invoiceType);
  }
  if (filters.dateFrom) {
    conditions.push(`billing_date >= $${paramIndex++}`);
    args.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    conditions.push(`billing_date <= $${paramIndex++}`);
    args.push(filters.dateTo);
  }

  const whereClause = conditions.join(' AND ');

  // Count total
  const [countResult] = await db.execute({
    sql: `SELECT COUNT(*)::int AS total FROM invoices WHERE ${whereClause}`,
    args,
  });
  const total = Number(countResult.total);
  const totalPages = Math.ceil(total / filters.pageSize);

  // Fetch page
  const offset = (filters.page - 1) * filters.pageSize;
  const sortCol = filters.sortBy === 'billing_date' ? 'billing_date'
    : filters.sortBy === 'due_date' ? 'due_date'
    : filters.sortBy === 'total' ? 'total'
    : 'created_at';
  const sortDir = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';

  const rows = await db.execute({
    sql: `
      SELECT * FROM invoices
      WHERE ${whereClause}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `,
    args: [...args, filters.pageSize, offset],
  });

  return {
    data: (rows as unknown as Record<string, unknown>[]).map(mapInvoice),
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total,
      totalPages,
    },
  };
}

// ─── Cancel Invoice ─────────────────────────────────────────────

/**
 * Cancel an invoice: update status + cancel CFDI at SAT if stamped.
 */
export async function cancelInvoiceById(
  tenantId: string,
  invoiceId: string,
  input: CancelInvoiceInput,
  userId?: string,
): Promise<Invoice> {
  const invoice = await getInvoice(tenantId, invoiceId);

  if (invoice.status === 'cobrada') {
    throw Object.assign(
      new Error('Cannot cancel a paid invoice — issue a credit note instead'),
      { name: 'ForbiddenError' },
    );
  }

  // Cancel CFDI at SAT if stamped
  if (invoice.folioFiscal && invoice.cfdiStatus === 'stamped') {
    // Load emisor RFC from tenant
    const [tenant] = await db.execute({
      sql: 'SELECT rfc FROM tenants WHERE id = $1',
      args: [tenantId],
    });

    await cfdiCancel(invoice.folioFiscal, input.reason, tenant?.rfc as string ?? '');
  }

  // Update invoice status
  const [updated] = await db.execute({
    sql: `
      UPDATE invoices
      SET status = 'descargada',
          cfdi_status = CASE WHEN folio_fiscal IS NOT NULL THEN 'cancelled' ELSE cfdi_status END,
          cfdi_cancellation_date = CASE WHEN folio_fiscal IS NOT NULL THEN NOW() ELSE cfdi_cancellation_date END,
          notes = COALESCE(notes, '') || E'\\nCancelado: ' || $3,
          updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING *
    `,
    args: [invoiceId, tenantId, input.reason],
  });

  await emitBillingEvent({
    type: 'invoice.cancelled',
    tenantId,
    aggregateId: invoiceId,
    payload: {
      reason: input.reason,
      cancellationCode: input.cancellationCode,
      previousStatus: invoice.status,
      folioFiscal: invoice.folioFiscal,
    },
    metadata: { userId, source: 'billing-service' },
  });

  return mapInvoice(updated);
}

// ─── Generate Credit Note ───────────────────────────────────────

/**
 * Generate a nota de credito referencing the original invoice.
 */
export async function generateCreditNote(
  tenantId: string,
  originalInvoiceId: string,
  input: CreditNoteInput,
  userId?: string,
): Promise<InvoiceWithLines> {
  const original = await getInvoice(tenantId, originalInvoiceId);

  if (!['pendiente', 'cobrada', 'impagada', 'parcial'].includes(original.status)) {
    throw Object.assign(
      new Error(`Cannot create credit note for invoice with status '${original.status}'`),
      { name: 'ForbiddenError' },
    );
  }

  // Build credit note lines (mirror of original or adjusted)
  let creditLines: InvoiceLineItem[];
  if (input.lineAdjustments && input.lineAdjustments.length > 0) {
    // Partial credit: only adjust specified concepts
    creditLines = original.lines
      .filter((l) => input.lineAdjustments!.some((a) => a.conceptCode === l.conceptCode))
      .map((l) => {
        const adjustment = input.lineAdjustments!.find((a) => a.conceptCode === l.conceptCode)!;
        const ivaAmount = round2(adjustment.adjustedSubtotal * l.ivaRate);
        return {
          conceptCode: l.conceptCode,
          conceptName: `NC: ${l.conceptName}`,
          quantity: l.quantity,
          unitPrice: round2(adjustment.adjustedSubtotal / (l.quantity || 1)),
          subtotal: adjustment.adjustedSubtotal,
          ivaRate: l.ivaRate,
          ivaAmount,
          total: round2(adjustment.adjustedSubtotal + ivaAmount),
          claveProdServ: l.claveProdServ,
          claveUnidad: l.claveUnidad,
          sortOrder: l.sortOrder,
        };
      });
  } else {
    // Full credit: mirror all lines
    creditLines = original.lines.map((l) => ({
      conceptCode: l.conceptCode,
      conceptName: `NC: ${l.conceptName}`,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      subtotal: l.subtotal,
      ivaRate: l.ivaRate,
      ivaAmount: l.ivaAmount,
      total: l.total,
      claveProdServ: l.claveProdServ,
      claveUnidad: l.claveUnidad,
      sortOrder: l.sortOrder,
    }));
  }

  const subtotal = round2(creditLines.reduce((s, l) => s + l.subtotal, 0));
  const ivaTotal = round2(creditLines.reduce((s, l) => s + l.ivaAmount, 0));
  const grandTotal = round2(subtotal + ivaTotal);

  // Generate credit note number
  const [seqResult] = await db.execute({
    sql: `
      SELECT COALESCE(MAX(CAST(invoice_number AS INTEGER)), 0) + 1 AS next_number
      FROM invoices WHERE tenant_id = $1
    `,
    args: [tenantId],
  });
  const invoiceNumber = String(seqResult.next_number).padStart(8, '0');
  const billingDate = new Date();
  const dueDate = dayjs(billingDate).add(30, 'day').toDate();

  // Insert credit note
  const [creditNote] = await db.execute({
    sql: `
      INSERT INTO invoices (
        tenant_id, contract_id, person_id, toma_id, explotacion_id,
        invoice_number, serie, invoice_type, origin,
        period_start, period_end, billing_date, due_date,
        subtotal, iva_amount, total, currency,
        consumption_m3, status, related_invoice_id, notes
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, 'NC', 'nota_credito', $7,
        $8, $9, $10, $11,
        $12, $13, $14, 'MXN',
        $15, 'provisional', $16, $17
      )
      RETURNING *
    `,
    args: [
      tenantId, original.contractId, original.personId, original.tomaId, original.explotacionId,
      invoiceNumber, original.origin,
      original.periodStart, original.periodEnd, billingDate, dueDate,
      subtotal, ivaTotal, grandTotal,
      original.consumptionM3, originalInvoiceId, input.reason,
    ],
  });

  // Insert credit note line items
  const insertedLines: InvoiceLine[] = [];
  for (const line of creditLines) {
    const [inserted] = await db.execute({
      sql: `
        INSERT INTO invoice_lines (
          invoice_id, tenant_id, concept_code, concept_name,
          quantity, unit_price, subtotal, iva_rate, iva_amount, total,
          clave_prod_serv, clave_unidad, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `,
      args: [
        creditNote.id, tenantId, line.conceptCode, line.conceptName,
        line.quantity, line.unitPrice, line.subtotal, line.ivaRate, line.ivaAmount, line.total,
        line.claveProdServ, line.claveUnidad, line.sortOrder,
      ],
    });
    insertedLines.push(mapInvoiceLine(inserted));
  }

  await emitBillingEvent({
    type: 'invoice.credit_note_issued',
    tenantId,
    aggregateId: creditNote.id as string,
    payload: {
      invoiceNumber,
      originalInvoiceId,
      originalInvoiceNumber: original.invoiceNumber,
      total: grandTotal,
      reason: input.reason,
    },
    metadata: { userId, source: 'billing-service' },
  });

  return {
    ...mapInvoice(creditNote),
    lines: insertedLines,
  };
}

// ─── PDF Generation ─────────────────────────────────────────────

/**
 * Generate a PDF for the given invoice.
 */
export async function getInvoicePDF(
  tenantId: string,
  invoiceId: string,
): Promise<Buffer> {
  const invoice = await getInvoice(tenantId, invoiceId);

  // Load tenant info
  const [tenant] = await db.execute({
    sql: 'SELECT * FROM tenants WHERE id = $1',
    args: [tenantId],
  });

  // Load customer info
  const [person] = await db.execute({
    sql: 'SELECT * FROM persons WHERE id = $1 AND tenant_id = $2',
    args: [invoice.personId, tenantId],
  });

  // Load contract info
  const [contract] = await db.execute({
    sql: `
      SELECT c.contract_number, t.toma_number, c.tariff_category
      FROM contracts c
      JOIN tomas t ON t.id = c.toma_id
      WHERE c.id = $1 AND c.tenant_id = $2
    `,
    args: [invoice.contractId, tenantId],
  });

  const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const pdfData: InvoicePDFData = {
    tenantName: (tenant?.name as string) ?? 'CEA',
    tenantRfc: (tenant?.rfc as string) ?? '',
    tenantAddress: (tenant?.address as string) ?? '',
    tenantPhone: (tenant?.phone as string) ?? '',
    tenantEmail: (tenant?.email as string) ?? '',

    invoiceNumber: invoice.invoiceNumber,
    serie: invoice.serie,
    billingDate: dayjs(invoice.billingDate).format('DD/MM/YYYY'),
    dueDate: dayjs(invoice.dueDate).format('DD/MM/YYYY'),
    invoiceType: invoice.invoiceType,
    status: invoice.status,

    customerName: (person?.full_name as string) ?? '',
    customerRfc: (person?.rfc as string) ?? 'XAXX010101000',
    customerAddress: (person?.address as string) ?? '',
    contractNumber: (contract?.contract_number as string) ?? '',
    tomaNumber: (contract?.toma_number as string) ?? '',
    tariffCategory: (contract?.tariff_category as string) ?? '',

    previousReading: invoice.previousReading,
    currentReading: invoice.currentReading,
    consumptionM3: invoice.consumptionM3,
    periodStart: dayjs(invoice.periodStart).format('DD/MM/YYYY'),
    periodEnd: dayjs(invoice.periodEnd).format('DD/MM/YYYY'),

    lineItems: invoice.lines.map((l) => ({
      conceptName: l.conceptName,
      quantity: l.quantity,
      unitPrice: fmt(l.unitPrice),
      subtotal: fmt(l.subtotal),
      ivaRate: `${(l.ivaRate * 100).toFixed(0)}%`,
      ivaAmount: fmt(l.ivaAmount),
      total: fmt(l.total),
    })),

    subtotal: fmt(invoice.subtotal),
    ivaTotal: fmt(invoice.ivaAmount),
    grandTotal: fmt(invoice.total),
    currency: invoice.currency,

    folioFiscal: invoice.folioFiscal,
    selloCFD: null,
    selloSAT: null,
    noCertificadoSAT: null,
    fechaTimbrado: invoice.cfdiStampDate ? dayjs(invoice.cfdiStampDate).format('DD/MM/YYYY HH:mm:ss') : null,
    cadenaOriginal: null,
    qrCodeUrl: null,

    paymentReference: invoice.paymentReference,
    speiClabe: null, // Loaded from tenant config
    speiReference: invoice.speiReference,

    contactPhone: (tenant?.phone as string) ?? '',
    contactEmail: (tenant?.email as string) ?? '',
  };

  return generateInvoicePDF(pdfData);
}

// ─── CFDI XML Download ──────────────────────────────────────────

export async function getInvoiceXML(
  tenantId: string,
  invoiceId: string,
): Promise<string> {
  const [invoice] = await db.execute({
    sql: 'SELECT cfdi_xml FROM invoices WHERE id = $1 AND tenant_id = $2',
    args: [invoiceId, tenantId],
  });

  if (!invoice) {
    throw Object.assign(new Error('Invoice not found'), { name: 'NotFoundError' });
  }

  if (!invoice.cfdi_xml) {
    throw Object.assign(
      new Error('CFDI XML not available — invoice has not been stamped'),
      { name: 'NotFoundError' },
    );
  }

  return invoice.cfdi_xml as string;
}

// ─── Helpers ────────────────────────────────────────────────────

function mapInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    contractId: row.contract_id as string,
    personId: row.person_id as string,
    tomaId: row.toma_id as string,
    explotacionId: row.explotacion_id as string,
    invoiceNumber: row.invoice_number as string,
    folioFiscal: (row.folio_fiscal as string) ?? null,
    serie: (row.serie as string) ?? '',
    invoiceType: row.invoice_type as string,
    origin: row.origin as string,
    periodStart: new Date(row.period_start as string),
    periodEnd: new Date(row.period_end as string),
    billingDate: new Date(row.billing_date as string),
    dueDate: new Date(row.due_date as string),
    subtotal: Number(row.subtotal),
    ivaAmount: Number(row.iva_amount),
    total: Number(row.total),
    currency: (row.currency as string) ?? 'MXN',
    readingId: (row.reading_id as string) ?? null,
    consumptionM3: row.consumption_m3 != null ? Number(row.consumption_m3) : null,
    previousReading: row.previous_reading != null ? Number(row.previous_reading) : null,
    currentReading: row.current_reading != null ? Number(row.current_reading) : null,
    status: row.status as string,
    cfdiStatus: (row.cfdi_status as string) ?? null,
    cfdiXml: (row.cfdi_xml as string) ?? null,
    cfdiPdfUrl: (row.cfdi_pdf_url as string) ?? null,
    cfdiStampDate: row.cfdi_stamp_date ? new Date(row.cfdi_stamp_date as string) : null,
    paymentReference: (row.payment_reference as string) ?? null,
    speiReference: (row.spei_reference as string) ?? null,
    relatedInvoiceId: (row.related_invoice_id as string) ?? null,
    delivered: !!row.delivered,
    deliveryChannel: (row.delivery_channel as string) ?? null,
    deliveredAt: row.delivered_at ? new Date(row.delivered_at as string) : null,
    notes: (row.notes as string) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapInvoiceLine(row: Record<string, unknown>): InvoiceLine {
  return {
    id: row.id as string,
    invoiceId: row.invoice_id as string,
    tenantId: row.tenant_id as string,
    conceptCode: row.concept_code as string,
    conceptName: row.concept_name as string,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    subtotal: Number(row.subtotal),
    ivaRate: Number(row.iva_rate),
    ivaAmount: Number(row.iva_amount),
    total: Number(row.total),
    tariffDetail: row.tariff_detail,
    claveProdServ: (row.clave_prod_serv as string) ?? '',
    claveUnidad: (row.clave_unidad as string) ?? '',
    sortOrder: Number(row.sort_order ?? 0),
  };
}

/**
 * Generate OXXO-compatible payment reference.
 * Format: 10 digits derived from tenant prefix + invoice number.
 */
function generateOxxoReference(tenantId: string, invoiceNumber: string): string {
  const prefix = tenantId.slice(0, 4).replace(/-/g, '').toUpperCase();
  return `${prefix}${invoiceNumber}`.slice(0, 20);
}

/**
 * Generate SPEI reference number (7 digits numeric).
 */
function generateSpeiReference(invoiceNumber: string): string {
  return invoiceNumber.replace(/\D/g, '').slice(-7).padStart(7, '0');
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
