import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// =============================================================
// TENANT & ORGANIZATION
// =============================================================

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  rfc: varchar('rfc', { length: 13 }),
  fiscalName: varchar('fiscal_name', { length: 300 }),
  fiscalAddress: jsonb('fiscal_address'),
  config: jsonb('config').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const explotaciones = pgTable(
  'explotaciones',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    code: varchar('code', { length: 20 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    municipality: varchar('municipality', { length: 100 }),
    state: varchar('state', { length: 50 }).default('Querétaro'),
    config: jsonb('config').notNull().default({}),
    billingConfig: jsonb('billing_config').notNull().default({}),
    readingConfig: jsonb('reading_config').notNull().default({}),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_explotaciones_tenant_code').on(table.tenantId, table.code),
  ],
);

export const offices = pgTable('offices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  explotacionId: uuid('explotacion_id').references(() => explotaciones.id),
  name: varchar('name', { length: 200 }).notNull(),
  address: jsonb('address'),
  phone: varchar('phone', { length: 20 }),
  officeType: varchar('office_type', { length: 20 }),
  config: jsonb('config').notNull().default({}),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
