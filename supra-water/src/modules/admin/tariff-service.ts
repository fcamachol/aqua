import { eq, and, sql, isNull, lte, or } from 'drizzle-orm';
import { db } from '../../config/database.js';
import { tariffSchedules } from '../../../db/schema/invoices.js';

// =============================================================
// Tariff Service — schedule management
// =============================================================

export interface CreateTariffInput {
  tenantId: string;
  explotacionId?: string;
  name: string;
  category: string;
  effectiveFrom: string;
  effectiveUntil?: string;
  billingPeriod: string;
  blocks: TariffBlock[];
  additionalConcepts?: AdditionalConcept[];
  ivaApplicable?: boolean;
  socialDiscountPct?: string;
  approvedBy?: string;
  approvalDate?: string;
  gazetteReference?: string;
}

export interface TariffBlock {
  from_m3: number;
  to_m3: number | null;
  price_per_m3: number;
  fixed_charge: number;
}

export interface AdditionalConcept {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  base?: string;
}

export interface UpdateTariffInput {
  name?: string;
  effectiveUntil?: string;
  active?: boolean;
  blocks?: TariffBlock[];
  additionalConcepts?: AdditionalConcept[];
  ivaApplicable?: boolean;
  socialDiscountPct?: string;
  approvedBy?: string;
  approvalDate?: string;
  gazetteReference?: string;
}

export async function createTariffSchedule(input: CreateTariffInput) {
  // Deactivate overlapping schedules for the same category/tenant
  await db
    .update(tariffSchedules)
    .set({ active: false, updatedAt: new Date() })
    .where(
      and(
        eq(tariffSchedules.tenantId, input.tenantId),
        eq(tariffSchedules.category, input.category),
        eq(tariffSchedules.active, true),
        or(
          isNull(tariffSchedules.effectiveUntil),
          lte(tariffSchedules.effectiveFrom, input.effectiveFrom),
        ),
      ),
    );

  const rows = await db
    .insert(tariffSchedules)
    .values({
      tenantId: input.tenantId,
      explotacionId: input.explotacionId,
      name: input.name,
      category: input.category,
      effectiveFrom: input.effectiveFrom,
      effectiveUntil: input.effectiveUntil,
      billingPeriod: input.billingPeriod,
      blocks: input.blocks,
      additionalConcepts: input.additionalConcepts ?? [],
      ivaApplicable: input.ivaApplicable ?? false,
      socialDiscountPct: input.socialDiscountPct,
      approvedBy: input.approvedBy,
      approvalDate: input.approvalDate,
      gazetteReference: input.gazetteReference,
    })
    .returning();

  return rows[0];
}

export async function listTariffSchedules(
  tenantId: string,
  opts?: { category?: string; activeOnly?: boolean },
) {
  const conditions = [eq(tariffSchedules.tenantId, tenantId)];

  if (opts?.category) conditions.push(eq(tariffSchedules.category, opts.category));
  if (opts?.activeOnly !== false) conditions.push(eq(tariffSchedules.active, true));

  return db
    .select()
    .from(tariffSchedules)
    .where(and(...conditions))
    .orderBy(tariffSchedules.category, tariffSchedules.effectiveFrom);
}

export async function getTariffScheduleById(tenantId: string, tariffId: string) {
  const rows = await db
    .select()
    .from(tariffSchedules)
    .where(and(eq(tariffSchedules.id, tariffId), eq(tariffSchedules.tenantId, tenantId)))
    .limit(1);

  return rows[0] ?? null;
}

export async function updateTariffSchedule(
  tenantId: string,
  tariffId: string,
  input: UpdateTariffInput,
) {
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (input.name !== undefined) updates.name = input.name;
  if (input.effectiveUntil !== undefined) updates.effectiveUntil = input.effectiveUntil;
  if (input.active !== undefined) updates.active = input.active;
  if (input.blocks !== undefined) updates.blocks = input.blocks;
  if (input.additionalConcepts !== undefined) updates.additionalConcepts = input.additionalConcepts;
  if (input.ivaApplicable !== undefined) updates.ivaApplicable = input.ivaApplicable;
  if (input.socialDiscountPct !== undefined) updates.socialDiscountPct = input.socialDiscountPct;
  if (input.approvedBy !== undefined) updates.approvedBy = input.approvedBy;
  if (input.approvalDate !== undefined) updates.approvalDate = input.approvalDate;
  if (input.gazetteReference !== undefined) updates.gazetteReference = input.gazetteReference;

  const rows = await db
    .update(tariffSchedules)
    .set(updates)
    .where(and(eq(tariffSchedules.id, tariffId), eq(tariffSchedules.tenantId, tenantId)))
    .returning();

  return rows[0] ?? null;
}

export async function getActiveTariff(tenantId: string, category: string, asOfDate?: string) {
  const dateStr = asOfDate ?? new Date().toISOString().split('T')[0];

  const rows = await db
    .select()
    .from(tariffSchedules)
    .where(
      and(
        eq(tariffSchedules.tenantId, tenantId),
        eq(tariffSchedules.category, category),
        eq(tariffSchedules.active, true),
        lte(tariffSchedules.effectiveFrom, dateStr),
        or(
          isNull(tariffSchedules.effectiveUntil),
          sql`${tariffSchedules.effectiveUntil} >= ${dateStr}`,
        ),
      ),
    )
    .orderBy(sql`${tariffSchedules.effectiveFrom} DESC`)
    .limit(1);

  return rows[0] ?? null;
}
