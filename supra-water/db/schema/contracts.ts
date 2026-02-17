import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  date,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';
import { persons } from './persons.js';
import { tomas } from './tomas.js';
import { addresses } from './addresses.js';

// =============================================================
// CONTRACTS (CONTRATOS)
// =============================================================

export const contracts = pgTable(
  'contracts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),

    // Parties
    contractNumber: varchar('contract_number', { length: 30 }).notNull(),
    personId: uuid('person_id')
      .notNull()
      .references(() => persons.id),
    tomaId: uuid('toma_id')
      .notNull()
      .references(() => tomas.id),

    // Lifecycle
    status: varchar('status', { length: 20 }).notNull().default('activo'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    terminationReason: varchar('termination_reason', { length: 50 }),

    // Billing preferences
    billingAddressId: uuid('billing_address_id').references(() => addresses.id),
    paymentMethod: varchar('payment_method', { length: 30 }).default('ventanilla'),
    bankAccount: jsonb('bank_account'),
    digitalInvoice: boolean('digital_invoice').default(false),

    // Tariff
    tariffCategory: varchar('tariff_category', { length: 30 }).notNull(),
    socialTariff: boolean('social_tariff').default(false),
    specialConditions: jsonb('special_conditions'),

    // Communication
    preferredContactMethod: varchar('preferred_contact_method', { length: 20 }).default('whatsapp'),
    notificationChannels: varchar('notification_channels', { length: 20 }).array().default(['{whatsapp}']),

    // Metadata
    previousContractId: uuid('previous_contract_id'), // Self-reference FK in 002-tables.sql
    documents: jsonb('documents').default([]),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_contracts_tenant_number').on(table.tenantId, table.contractNumber),
    index('idx_contracts_person').on(table.tenantId, table.personId),
    index('idx_contracts_toma').on(table.tenantId, table.tomaId),
    index('idx_contracts_status').on(table.tenantId, table.status),
  ],
);
