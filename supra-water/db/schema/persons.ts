import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

// =============================================================
// PERSONS (CUSTOMERS / CONTACTS)
// =============================================================

export const persons = pgTable(
  'persons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    // Identity
    personType: varchar('person_type', { length: 10 }).notNull(),
    rfc: varchar('rfc', { length: 13 }),
    curp: varchar('curp', { length: 18 }),
    name: varchar('name', { length: 200 }).notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastNamePaterno: varchar('last_name_paterno', { length: 100 }),
    lastNameMaterno: varchar('last_name_materno', { length: 100 }),

    // Contact
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    phoneSecondary: varchar('phone_secondary', { length: 20 }),
    whatsapp: varchar('whatsapp', { length: 20 }),

    // Fiscal
    fiscalRegime: varchar('fiscal_regime', { length: 3 }),
    fiscalUse: varchar('fiscal_use', { length: 4 }),
    fiscalAddress: jsonb('fiscal_address'),
    zipCode: varchar('zip_code', { length: 5 }),

    // Flags
    vulnerable: boolean('vulnerable').default(false),
    vulnerabilityType: varchar('vulnerability_type', { length: 50 }),
    digitalAccess: boolean('digital_access').default(false),
    preferredChannel: varchar('preferred_channel', { length: 20 }).default('whatsapp'),
    language: varchar('language', { length: 5 }).default('es-MX'),

    // Metadata
    notes: text('notes'),
    tags: varchar('tags', { length: 50 }).array().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_persons_tenant_rfc').on(table.tenantId, table.rfc),
    index('idx_persons_tenant').on(table.tenantId),
    index('idx_persons_rfc').on(table.tenantId, table.rfc),
    index('idx_persons_curp').on(table.tenantId, table.curp),
    // gin_trgm_ops index on name handled in 002-tables.sql
    index('idx_persons_phone').on(table.tenantId, table.phone),
  ],
);
