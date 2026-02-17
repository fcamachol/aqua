import { eq, and, ilike, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../../config/database.js';
import { users } from '../../../db/schema/users.js';

// =============================================================
// User Service — CRUD, role management, password reset
// =============================================================

const SALT_ROUNDS = 12;

export interface CreateUserInput {
  tenantId: string;
  email: string;
  password: string;
  name: string;
  role: string;
  permissions?: unknown[];
  explotacionIds?: string[];
  officeIds?: string[];
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: string;
  permissions?: unknown[];
  explotacionIds?: string[];
  officeIds?: string[];
  active?: boolean;
}

export interface ListUsersParams {
  tenantId: string;
  page: number;
  pageSize: number;
  role?: string;
  active?: boolean;
  search?: string;
}

// Strip password_hash from returned rows
function sanitize(row: typeof users.$inferSelect) {
  const { passwordHash: _, ...rest } = row;
  return rest;
}

export async function createUser(input: CreateUserInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const rows = await db
    .insert(users)
    .values({
      tenantId: input.tenantId,
      email: input.email.toLowerCase().trim(),
      passwordHash,
      name: input.name,
      role: input.role,
      permissions: input.permissions ?? [],
      explotacionIds: input.explotacionIds ?? [],
      officeIds: input.officeIds ?? [],
    })
    .returning();

  return sanitize(rows[0]);
}

export async function listUsers(params: ListUsersParams) {
  const conditions = [eq(users.tenantId, params.tenantId)];

  if (params.role) conditions.push(eq(users.role, params.role));
  if (params.active !== undefined) conditions.push(eq(users.active, params.active));
  if (params.search) conditions.push(ilike(users.name, `%${params.search}%`));

  const where = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(users)
      .where(where)
      .limit(params.pageSize)
      .offset((params.page - 1) * params.pageSize)
      .orderBy(users.createdAt),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(where),
  ]);

  return {
    data: rows.map(sanitize),
    total: countResult[0].count,
  };
}

export async function getUserById(tenantId: string, userId: string) {
  const rows = await db
    .select()
    .from(users)
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
    .limit(1);

  if (!rows[0]) return null;
  return sanitize(rows[0]);
}

export async function updateUser(tenantId: string, userId: string, input: UpdateUserInput) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (input.email !== undefined) updates.email = input.email.toLowerCase().trim();
  if (input.name !== undefined) updates.name = input.name;
  if (input.role !== undefined) updates.role = input.role;
  if (input.permissions !== undefined) updates.permissions = input.permissions;
  if (input.explotacionIds !== undefined) updates.explotacionIds = input.explotacionIds;
  if (input.officeIds !== undefined) updates.officeIds = input.officeIds;
  if (input.active !== undefined) updates.active = input.active;

  const rows = await db
    .update(users)
    .set(updates)
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
    .returning();

  if (!rows[0]) return null;
  return sanitize(rows[0]);
}

export async function deactivateUser(tenantId: string, userId: string) {
  const rows = await db
    .update(users)
    .set({ active: false, updatedAt: new Date() })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
    .returning();

  if (!rows[0]) return null;
  return sanitize(rows[0]);
}

export async function resetPassword(tenantId: string, userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const rows = await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
    .returning();

  if (!rows[0]) return null;
  return sanitize(rows[0]);
}

export async function getUserByEmail(email: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  return rows[0] ?? null;
}

export async function updateLastLogin(userId: string) {
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, userId));
}
