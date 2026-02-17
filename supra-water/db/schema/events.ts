import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { persons } from './persons.js';
import { contracts } from './contracts.js';

// =============================================================
// EVENT STORE (AUDIT + EVENT SOURCING) — TimescaleDB Hypertable
// =============================================================
// Note: Hypertable conversion handled in 002-tables.sql
// Composite PK (id, created_at) required for TimescaleDB

export const domainEvents = pgTable(
  'domain_events',
  {
    id: uuid('id').defaultRandom().notNull(),
    tenantId: uuid('tenant_id').notNull(),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    aggregateType: varchar('aggregate_type', { length: 50 }).notNull(),
    aggregateId: uuid('aggregate_id').notNull(),
    payload: jsonb('payload').notNull(),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.createdAt] }),
    index('idx_events_aggregate').on(
      table.aggregateType,
      table.aggregateId,
      table.createdAt,
    ),
    index('idx_events_type').on(table.eventType, table.createdAt),
  ],
);

// =============================================================
// COMMUNICATION LOG
// =============================================================

export const communications = pgTable('communications', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  personId: uuid('person_id').references(() => persons.id),
  contractId: uuid('contract_id').references(() => contracts.id),

  channel: varchar('channel', { length: 20 }).notNull(),
  direction: varchar('direction', { length: 10 }).notNull(),
  commType: varchar('comm_type', { length: 30 }),

  // Content
  subject: varchar('subject', { length: 300 }),
  body: text('body'),
  templateId: varchar('template_id', { length: 50 }),

  // Status
  status: varchar('status', { length: 20 }).default('sent'),
  externalId: varchar('external_id', { length: 200 }),
  errorMessage: text('error_message'),

  // Response tracking
  responseReceived: boolean('response_received').default(false),
  responseAt: timestamp('response_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
