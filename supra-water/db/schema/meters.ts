import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  date,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { tomas } from './tomas.js';

// =============================================================
// METERS (MEDIDORES)
// =============================================================

export const meters = pgTable(
  'meters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    tomaId: uuid('toma_id').references(() => tomas.id),

    serialNumber: varchar('serial_number', { length: 50 }).notNull(),
    brand: varchar('brand', { length: 50 }),
    model: varchar('model', { length: 50 }),
    diameterInches: decimal('diameter_inches', { precision: 4, scale: 2 }),
    meterType: varchar('meter_type', { length: 30 }),

    // Smart meter fields
    isSmart: boolean('is_smart').default(false),
    communicationProtocol: varchar('communication_protocol', { length: 20 }),
    deviceEui: varchar('device_eui', { length: 50 }),
    lastCommunication: timestamp('last_communication', { withTimezone: true }),

    // Lifecycle
    installationDate: date('installation_date'),
    lastCalibrationDate: date('last_calibration_date'),
    expectedReplacementDate: date('expected_replacement_date'),
    status: varchar('status', { length: 20 }).default('activo'),
    initialReading: decimal('initial_reading', { precision: 12, scale: 3 }).default('0'),

    // Metadata
    locationDescription: varchar('location_description', { length: 200 }),
    accessible: boolean('accessible').default(true),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_meters_tenant_serial').on(table.tenantId, table.serialNumber),
  ],
);
