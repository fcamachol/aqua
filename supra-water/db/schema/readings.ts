import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  decimal,
  date,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { meters } from './meters.js';
import { tomas } from './tomas.js';
import { contracts } from './contracts.js';

// =============================================================
// METER READINGS (LECTURAS) — TimescaleDB Hypertable
// =============================================================
// Note: Hypertable conversion handled in 002-tables.sql
// Composite PK (id, reading_date) required for TimescaleDB

export const meterReadings = pgTable(
  'meter_readings',
  {
    id: uuid('id').defaultRandom().notNull(),
    tenantId: uuid('tenant_id').notNull(),
    meterId: uuid('meter_id')
      .notNull()
      .references(() => meters.id),
    tomaId: uuid('toma_id')
      .notNull()
      .references(() => tomas.id),
    contractId: uuid('contract_id').references(() => contracts.id),

    // Reading data
    readingValue: decimal('reading_value', { precision: 12, scale: 3 }).notNull(),
    previousReading: decimal('previous_reading', { precision: 12, scale: 3 }),
    consumption: decimal('consumption', { precision: 12, scale: 3 }),
    readingDate: timestamp('reading_date', { withTimezone: true }).notNull(),
    periodStart: date('period_start'),
    periodEnd: date('period_end'),

    // Source
    source: varchar('source', { length: 20 }).notNull(),
    readerUserId: uuid('reader_user_id'),
    deviceId: varchar('device_id', { length: 50 }),

    // Quality
    status: varchar('status', { length: 20 }).default('valid'),
    anomalyType: varchar('anomaly_type', { length: 30 }),
    anomalyScore: decimal('anomaly_score', { precision: 5, scale: 3 }),
    observations: text('observations'),

    // Photo evidence
    photoUrl: varchar('photo_url', { length: 500 }),
    gpsLatitude: decimal('gps_latitude', { precision: 10, scale: 7 }),
    gpsLongitude: decimal('gps_longitude', { precision: 10, scale: 7 }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.readingDate] }),
    index('idx_readings_meter').on(table.tenantId, table.meterId, table.readingDate),
    index('idx_readings_toma').on(table.tenantId, table.tomaId, table.readingDate),
  ],
);
