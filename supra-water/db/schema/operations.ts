import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  integer,
  date,
  time,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';
import { contracts } from './contracts.js';
import { persons } from './persons.js';
import { tomas } from './tomas.js';
import { meters } from './meters.js';
import { addresses } from './addresses.js';
import { users } from './users.js';
import { invoices } from './invoices.js';

// =============================================================
// DELINQUENCY MANAGEMENT (GESTION DE IMPAGADOS)
// =============================================================

export const delinquencyProcedures = pgTable('delinquency_procedures', {
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

  totalDebt: decimal('total_debt', { precision: 12, scale: 2 }).notNull(),
  oldestUnpaidDate: date('oldest_unpaid_date').notNull(),
  invoiceCount: integer('invoice_count').notNull(),

  // Procedure tracking
  procedureType: varchar('procedure_type', { length: 30 }).notNull(),
  currentStep: integer('current_step').default(0),
  currentStepName: varchar('current_step_name', { length: 100 }),
  status: varchar('status', { length: 20 }).default('activo'),

  // Steps executed
  stepsHistory: jsonb('steps_history').default([]),

  nextStepDate: date('next_step_date'),
  vulnerabilityFlag: boolean('vulnerability_flag').default(false),
  vulnerabilityReason: varchar('vulnerability_reason', { length: 200 }),

  // Resolution
  resolvedDate: timestamp('resolved_date', { withTimezone: true }),
  resolutionType: varchar('resolution_type', { length: 30 }),

  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// =============================================================
// WORK ORDERS (ORDENES DE SERVICIO)
// =============================================================

export const workOrders = pgTable(
  'work_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),

    orderNumber: varchar('order_number', { length: 20 }).notNull(),
    orderType: varchar('order_type', { length: 30 }).notNull(),

    // Related entities
    contractId: uuid('contract_id').references(() => contracts.id),
    tomaId: uuid('toma_id').references(() => tomas.id),
    meterId: uuid('meter_id').references(() => meters.id),
    addressId: uuid('address_id').references(() => addresses.id),
    delinquencyId: uuid('delinquency_id').references(() => delinquencyProcedures.id),

    // Assignment
    assignedTo: uuid('assigned_to').references(() => users.id),
    team: varchar('team', { length: 50 }),
    priority: varchar('priority', { length: 10 }).default('normal'),

    // Scheduling
    scheduledDate: date('scheduled_date'),
    scheduledTimeStart: time('scheduled_time_start'),
    scheduledTimeEnd: time('scheduled_time_end'),
    estimatedDurationMinutes: integer('estimated_duration_minutes'),

    // Status
    status: varchar('status', { length: 20 }).default('pendiente'),

    // Execution
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    result: text('result'),
    resultCode: varchar('result_code', { length: 20 }),

    // Field data
    fieldNotes: text('field_notes'),
    photos: jsonb('photos').default([]),
    gpsArrival: jsonb('gps_arrival'),
    gpsDeparture: jsonb('gps_departure'),
    technicianSignatureUrl: varchar('technician_signature_url', { length: 500 }),
    customerSignatureUrl: varchar('customer_signature_url', { length: 500 }),

    // Materials used
    materials: jsonb('materials').default([]),

    // Metadata
    source: varchar('source', { length: 20 }).default('system'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_work_orders_tenant_number').on(table.tenantId, table.orderNumber),
    index('idx_orders_assigned').on(table.tenantId, table.assignedTo, table.status),
    index('idx_orders_scheduled').on(table.tenantId, table.scheduledDate, table.status),
  ],
);

// =============================================================
// CONTACTS & COMPLAINTS (CONTACTOS Y QUEJAS)
// =============================================================

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    // Who
    personId: uuid('person_id').references(() => persons.id),
    contractId: uuid('contract_id').references(() => contracts.id),
    tomaId: uuid('toma_id').references(() => tomas.id),

    // What
    contactType: varchar('contact_type', { length: 20 }).notNull(),
    category: varchar('category', { length: 50 }),
    subcategory: varchar('subcategory', { length: 50 }),
    subject: varchar('subject', { length: 300 }),
    description: text('description'),

    // Channel
    channel: varchar('channel', { length: 20 }).notNull(),
    channelConversationId: varchar('channel_conversation_id', { length: 200 }),

    // Assignment & Resolution
    assignedTo: uuid('assigned_to').references(() => users.id),
    department: varchar('department', { length: 50 }),
    priority: varchar('priority', { length: 10 }).default('normal'),
    status: varchar('status', { length: 20 }).default('abierto'),
    resolution: text('resolution'),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolutionSatisfaction: integer('resolution_satisfaction'),

    // AI processing
    aiClassification: jsonb('ai_classification'),
    aiAutoResolved: boolean('ai_auto_resolved').default(false),
    sentimentScore: decimal('sentiment_score', { precision: 3, scale: 2 }),

    // SLA
    slaDueAt: timestamp('sla_due_at', { withTimezone: true }),
    slaBreached: boolean('sla_breached').default(false),

    // Linked work orders
    workOrderIds: uuid('work_order_ids').array().default([]),

    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_contacts_person').on(table.tenantId, table.personId),
    index('idx_contacts_status').on(table.tenantId, table.status, table.createdAt),
  ],
);

// =============================================================
// FRAUD CASES (EXPEDIENTES SIF)
// =============================================================

export const fraudCases = pgTable(
  'fraud_cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    caseNumber: varchar('case_number', { length: 20 }).notNull(),
    contractId: uuid('contract_id').references(() => contracts.id),
    tomaId: uuid('toma_id').references(() => tomas.id),
    addressId: uuid('address_id')
      .notNull()
      .references(() => addresses.id),

    // Detection
    detectionSource: varchar('detection_source', { length: 30 }).notNull(),
    detectionDate: date('detection_date').notNull(),
    anomalyData: jsonb('anomaly_data'),

    // Case management
    status: varchar('status', { length: 20 }).default('abierto'),
    fraudType: varchar('fraud_type', { length: 30 }),
    estimatedVolumeM3: decimal('estimated_volume_m3', { precision: 12, scale: 3 }),
    estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }),

    // Inspections
    inspections: jsonb('inspections').default([]),

    // Resolution
    resolutionType: varchar('resolution_type', { length: 30 }),
    resolutionDate: date('resolution_date'),
    invoiceId: uuid('invoice_id').references(() => invoices.id),
    legalCaseReference: varchar('legal_case_reference', { length: 50 }),

    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_fraud_cases_tenant_number').on(table.tenantId, table.caseNumber),
  ],
);
