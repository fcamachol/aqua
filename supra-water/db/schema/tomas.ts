import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';
import { addresses } from './addresses.js';
import { acometidas } from './infrastructure.js';

// =============================================================
// TOMAS (PUNTOS DE SERVICIO)
// =============================================================
// Note: meter_id FK to meters is added in 002-tables.sql (circular dep)
// PostGIS geom column and GIST index handled in 002-tables.sql

export const tomas = pgTable(
  'tomas',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),
    acometidaId: uuid('acometida_id').references(() => acometidas.id),
    addressId: uuid('address_id')
      .notNull()
      .references(() => addresses.id),

    // Identification
    tomaNumber: varchar('toma_number', { length: 20 }).notNull(),
    tomaType: varchar('toma_type', { length: 30 }).notNull(),

    // Service status
    status: varchar('status', { length: 20 }).notNull().default('activa'),
    cutDate: timestamp('cut_date', { withTimezone: true }),
    cutReason: varchar('cut_reason', { length: 50 }),

    // Meter info
    hasMeter: boolean('has_meter').default(true),
    meterId: uuid('meter_id'), // FK added in 002-tables.sql

    // Billing
    billingType: varchar('billing_type', { length: 20 }).default('medido'),
    tariffCategory: varchar('tariff_category', { length: 30 }),
    billingPeriod: varchar('billing_period', { length: 10 }).default('mensual'),

    // GIS
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    // geom GEOGRAPHY(POINT, 4326) handled in 002-tables.sql

    // Metadata
    inhabitants: integer('inhabitants'),
    propertyType: varchar('property_type', { length: 30 }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_tomas_tenant_number').on(table.tenantId, table.tomaNumber),
    index('idx_tomas_tenant_status').on(table.tenantId, table.status),
    index('idx_tomas_explotacion').on(table.tenantId, table.explotacionId),
    // GIST index on geom handled in 002-tables.sql
  ],
);
