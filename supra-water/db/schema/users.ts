import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';

// =============================================================
// USERS & AUTH
// =============================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  permissions: jsonb('permissions').notNull().default([]),
  explotacionIds: uuid('explotacion_ids').array().notNull().default([]),
  officeIds: uuid('office_ids').array().notNull().default([]),
  active: boolean('active').default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
