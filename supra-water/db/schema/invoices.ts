import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  date,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';
import { contracts } from './contracts.js';
import { persons } from './persons.js';
import { tomas } from './tomas.js';

// =============================================================
// INVOICES (FACTURAS / RECIBOS)
// =============================================================

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id),
    personId: uuid('person_id')
      .notNull()
      .references(() => persons.id),
    tomaId: uuid('toma_id')
      .notNull()
      .references(() => tomas.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),

    // Invoice identification
    invoiceNumber: varchar('invoice_number', { length: 30 }),
    folioFiscal: uuid('folio_fiscal'),
    serie: varchar('serie', { length: 10 }),

    // Type & origin
    invoiceType: varchar('invoice_type', { length: 20 }).notNull(),
    origin: varchar('origin', { length: 20 }).notNull(),

    // Billing period
    periodStart: date('period_start').notNull(),
    periodEnd: date('period_end').notNull(),
    billingDate: date('billing_date').notNull(),
    dueDate: date('due_date').notNull(),

    // Amounts
    subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
    ivaAmount: decimal('iva_amount', { precision: 12, scale: 2 }).notNull().default('0'),
    total: decimal('total', { precision: 12, scale: 2 }).notNull().default('0'),
    currency: varchar('currency', { length: 3 }).default('MXN'),

    // Consumption data
    readingId: uuid('reading_id'),
    consumptionM3: decimal('consumption_m3', { precision: 10, scale: 3 }),
    previousReading: decimal('previous_reading', { precision: 12, scale: 3 }),
    currentReading: decimal('current_reading', { precision: 12, scale: 3 }),

    // Status lifecycle
    status: varchar('status', { length: 20 }).notNull().default('provisional'),

    // CFDI fields
    cfdiStatus: varchar('cfdi_status', { length: 20 }),
    cfdiXml: text('cfdi_xml'),
    cfdiPdfUrl: varchar('cfdi_pdf_url', { length: 500 }),
    cfdiStampDate: timestamp('cfdi_stamp_date', { withTimezone: true }),
    cfdiCancellationDate: timestamp('cfdi_cancellation_date', { withTimezone: true }),
    pacResponse: jsonb('pac_response'),

    // Payment reference
    paymentReference: varchar('payment_reference', { length: 30 }),
    speiReference: varchar('spei_reference', { length: 20 }),

    // Links
    relatedInvoiceId: uuid('related_invoice_id'), // Self-ref FK in 002-tables.sql
    readingIdFk: uuid('reading_id_fk'), // FK to meter_readings in 002-tables.sql (DEFERRABLE)

    // Delivery
    delivered: boolean('delivered').default(false),
    deliveryChannel: varchar('delivery_channel', { length: 20 }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),

    // Metadata
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_invoices_contract').on(table.tenantId, table.contractId),
    index('idx_invoices_person').on(table.tenantId, table.personId),
    index('idx_invoices_status').on(table.tenantId, table.status),
    // Partial indexes (idx_invoices_due, idx_invoices_cfdi) handled in 002-tables.sql
  ],
);

// =============================================================
// INVOICE LINE ITEMS (CONCEPTOS)
// =============================================================

export const invoiceLines = pgTable('invoice_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id').notNull(),

  // Concept identification
  conceptCode: varchar('concept_code', { length: 20 }).notNull(),
  conceptName: varchar('concept_name', { length: 200 }).notNull(),
  subconceptCode: varchar('subconcept_code', { length: 20 }),
  subconceptName: varchar('subconcept_name', { length: 200 }),

  // Owner
  ownerEntity: varchar('owner_entity', { length: 50 }),

  // Amounts
  quantity: decimal('quantity', { precision: 12, scale: 3 }).default('1'),
  unitPrice: decimal('unit_price', { precision: 12, scale: 4 }).default('0'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  ivaRate: decimal('iva_rate', { precision: 5, scale: 4 }).default('0'),
  ivaAmount: decimal('iva_amount', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull().default('0'),

  // Tariff calculation detail
  tariffDetail: jsonb('tariff_detail'),

  // SAT catalog codes
  claveProdServ: varchar('clave_prod_serv', { length: 10 }),
  claveUnidad: varchar('clave_unidad', { length: 5 }),

  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// =============================================================
// TARIFF STRUCTURE (ESTRUCTURA TARIFARIA)
// =============================================================

export const tariffSchedules = pgTable('tariff_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  explotacionId: uuid('explotacion_id').references(() => explotaciones.id),

  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 30 }).notNull(),
  effectiveFrom: date('effective_from').notNull(),
  effectiveUntil: date('effective_until'),
  active: boolean('active').default(true),

  // Structure
  billingPeriod: varchar('billing_period', { length: 10 }).notNull(),
  blocks: jsonb('blocks').notNull(),
  additionalConcepts: jsonb('additional_concepts').default([]),

  ivaApplicable: boolean('iva_applicable').default(false),
  socialDiscountPct: decimal('social_discount_pct', { precision: 5, scale: 2 }),

  approvedBy: varchar('approved_by', { length: 200 }),
  approvalDate: date('approval_date'),
  gazetteReference: varchar('gazette_reference', { length: 100 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
