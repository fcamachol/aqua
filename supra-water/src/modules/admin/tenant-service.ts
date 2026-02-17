import { eq } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { tenants } from '../../../db/schema/tenants.js';

// =============================================================
// Tenant Service — admin-only tenant configuration
// =============================================================

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  rfc: string | null;
  fiscalName: string | null;
  fiscalAddress: unknown;
  config: unknown;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UpdateTenantInput {
  name?: string;
  rfc?: string;
  fiscalName?: string;
  fiscalAddress?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

export async function getTenant(tenantId: string): Promise<TenantConfig | null> {
  const rows = await db
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  return (rows[0] as TenantConfig | undefined) ?? null;
}

export async function updateTenant(
  tenantId: string,
  input: UpdateTenantInput,
): Promise<TenantConfig | null> {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (input.name !== undefined) updates.name = input.name;
  if (input.rfc !== undefined) updates.rfc = input.rfc;
  if (input.fiscalName !== undefined) updates.fiscalName = input.fiscalName;
  if (input.fiscalAddress !== undefined) updates.fiscalAddress = input.fiscalAddress;
  if (input.config !== undefined) updates.config = input.config;

  const rows = await db
    .update(tenants)
    .set(updates)
    .where(eq(tenants.id, tenantId))
    .returning();

  return (rows[0] as TenantConfig | undefined) ?? null;
}
