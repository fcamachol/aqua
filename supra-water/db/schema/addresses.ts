import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
} from 'drizzle-orm/pg-core';
import { tenants, explotaciones } from './tenants.js';

// =============================================================
// ADDRESSES (CALLEJERO)
// =============================================================
// Note: PostGIS geography columns (geom), generated columns (normalized_text),
// and GIN/GIST indexes are handled in 002-tables.sql

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  explotacionId: uuid('explotacion_id').references(() => explotaciones.id),

  // Mexican address structure
  street: varchar('street', { length: 200 }).notNull(),
  exteriorNumber: varchar('exterior_number', { length: 20 }),
  interiorNumber: varchar('interior_number', { length: 20 }),
  colonia: varchar('colonia', { length: 200 }),
  municipality: varchar('municipality', { length: 100 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }).default('Querétaro'),
  zipCode: varchar('zip_code', { length: 5 }),
  country: varchar('country', { length: 2 }).default('MX'),

  // Geolocation (lat/lng as decimals; PostGIS geom column in 002-tables.sql)
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  // normalized_text is a GENERATED ALWAYS AS column — defined in 002-tables.sql

  // Metadata
  addressType: varchar('address_type', { length: 20 }).default('callejero'),
  validated: boolean('validated').default(false),
  inegiCveLoc: varchar('inegi_cve_loc', { length: 20 }),
  sepomexValidated: boolean('sepomex_validated').default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
