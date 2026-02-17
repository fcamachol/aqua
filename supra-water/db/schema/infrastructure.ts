import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';
import { addresses } from './addresses.js';

// =============================================================
// INFRASTRUCTURE (ESTRUCTURA TECNICA)
// =============================================================

export const sectoresHidraulicos = pgTable(
  'sectores_hidraulicos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),
    parentId: uuid('parent_id'), // Self-reference for subsectores (FK in 002-tables.sql)
    code: varchar('code', { length: 20 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    level: integer('level').notNull().default(1),
    // geom GEOGRAPHY(POLYGON, 4326) handled in 002-tables.sql
    active: boolean('active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_sectores_tenant_explotacion_code').on(
      table.tenantId,
      table.explotacionId,
      table.code,
    ),
  ],
);

export const acometidas = pgTable(
  'acometidas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    sectorId: uuid('sector_id')
      .notNull()
      .references(() => sectoresHidraulicos.id),
    addressId: uuid('address_id')
      .notNull()
      .references(() => addresses.id),
    code: varchar('code', { length: 30 }).notNull(),
    diameterMm: integer('diameter_mm'),
    material: varchar('material', { length: 50 }),
    installationDate: date('installation_date'),
    status: varchar('status', { length: 20 }).default('activa'),
    // geom GEOGRAPHY(POINT, 4326) handled in 002-tables.sql
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_acometidas_tenant_code').on(table.tenantId, table.code),
  ],
);
