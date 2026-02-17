/**
 * Generate Tariff Schedules — all categories with realistic Mexican water tariff rates
 *
 * Usage: npx tsx scripts/generate-tariffs.ts [--tenant cea-queretaro]
 *
 * Creates tariff schedules for:
 *   domestica, comercial, industrial, gobierno, mixta, rural
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { tenants, explotaciones } from '../db/schema/tenants.js';
import { tariffSchedules } from '../db/schema/invoices.js';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://supra:supra@localhost:5432/supra_water';

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// ─── CLI Args ──────────────────────────────────────────────────

const args = process.argv.slice(2);
const tenantIdx = args.indexOf('--tenant');
const tenantSlug = tenantIdx >= 0 ? args[tenantIdx + 1] : 'cea-queretaro';

// ─── Tariff Definitions ────────────────────────────────────────

interface TariffDef {
  category: string;
  name: string;
  blocks: { from_m3: number; to_m3: number | null; price_per_m3: number; fixed_charge: number }[];
  additional: { code: string; name: string; type: 'percentage' | 'fixed'; value: number; base?: string }[];
  iva: boolean;
  socialDiscount?: string;
}

const TARIFFS: TariffDef[] = [
  {
    category: 'domestica',
    name: 'Tarifa Domestica 2026',
    blocks: [
      { from_m3: 0, to_m3: 10, price_per_m3: 5.50, fixed_charge: 45.00 },
      { from_m3: 10, to_m3: 20, price_per_m3: 8.75, fixed_charge: 0 },
      { from_m3: 20, to_m3: 40, price_per_m3: 15.30, fixed_charge: 0 },
      { from_m3: 40, to_m3: null, price_per_m3: 25.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.25, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 15.00 },
    ],
    iva: false,
    socialDiscount: '30.00',
  },
  {
    category: 'comercial',
    name: 'Tarifa Comercial 2026',
    blocks: [
      { from_m3: 0, to_m3: 15, price_per_m3: 12.50, fixed_charge: 120.00 },
      { from_m3: 15, to_m3: 30, price_per_m3: 18.00, fixed_charge: 0 },
      { from_m3: 30, to_m3: 60, price_per_m3: 26.50, fixed_charge: 0 },
      { from_m3: 60, to_m3: null, price_per_m3: 38.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.30, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 35.00 },
    ],
    iva: true,
  },
  {
    category: 'industrial',
    name: 'Tarifa Industrial 2026',
    blocks: [
      { from_m3: 0, to_m3: 50, price_per_m3: 22.00, fixed_charge: 500.00 },
      { from_m3: 50, to_m3: 150, price_per_m3: 32.00, fixed_charge: 0 },
      { from_m3: 150, to_m3: 500, price_per_m3: 45.00, fixed_charge: 0 },
      { from_m3: 500, to_m3: null, price_per_m3: 58.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.35, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 85.00 },
      { code: 'descarga_industrial', name: 'Descarga Industrial', type: 'percentage', value: 0.15, base: 'agua' },
    ],
    iva: true,
  },
  {
    category: 'gobierno',
    name: 'Tarifa Gobierno 2026',
    blocks: [
      { from_m3: 0, to_m3: 30, price_per_m3: 9.00, fixed_charge: 200.00 },
      { from_m3: 30, to_m3: 80, price_per_m3: 14.50, fixed_charge: 0 },
      { from_m3: 80, to_m3: null, price_per_m3: 22.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.25, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 50.00 },
    ],
    iva: false,
  },
  {
    category: 'mixta',
    name: 'Tarifa Mixta 2026',
    blocks: [
      { from_m3: 0, to_m3: 10, price_per_m3: 7.00, fixed_charge: 80.00 },
      { from_m3: 10, to_m3: 25, price_per_m3: 12.00, fixed_charge: 0 },
      { from_m3: 25, to_m3: 50, price_per_m3: 20.00, fixed_charge: 0 },
      { from_m3: 50, to_m3: null, price_per_m3: 30.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.28, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 25.00 },
    ],
    iva: true,
  },
  {
    category: 'rural',
    name: 'Tarifa Rural 2026',
    blocks: [
      { from_m3: 0, to_m3: 15, price_per_m3: 3.50, fixed_charge: 30.00 },
      { from_m3: 15, to_m3: 30, price_per_m3: 5.50, fixed_charge: 0 },
      { from_m3: 30, to_m3: null, price_per_m3: 10.00, fixed_charge: 0 },
    ],
    additional: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.20, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 10.00 },
    ],
    iva: false,
    socialDiscount: '40.00',
  },
];

// ─── Main ──────────────────────────────────────────────────────

async function generate() {
  console.log(`Generating tariff schedules for tenant: ${tenantSlug}\n`);

  // Resolve tenant
  const tenantRows = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug!))
    .limit(1);

  if (!tenantRows[0]) {
    console.error(`Tenant "${tenantSlug}" not found.`);
    process.exit(1);
  }

  const tenant = tenantRows[0];

  // Get first explotacion
  const explotacionRows = await db
    .select()
    .from(explotaciones)
    .where(eq(explotaciones.tenantId, tenant.id))
    .limit(1);

  const explotacion = explotacionRows[0] ?? null;

  for (const def of TARIFFS) {
    const [tariff] = await db
      .insert(tariffSchedules)
      .values({
        tenantId: tenant.id,
        explotacionId: explotacion?.id,
        name: def.name,
        category: def.category,
        effectiveFrom: '2026-01-01',
        billingPeriod: 'mensual',
        blocks: def.blocks,
        additionalConcepts: def.additional,
        ivaApplicable: def.iva,
        socialDiscountPct: def.socialDiscount,
        approvedBy: 'H. Congreso del Estado de Queretaro',
        approvalDate: '2025-12-15',
        gazetteReference: 'Periodico Oficial del Estado No. 95, 2025-12-20',
      })
      .returning();

    const blockSummary = def.blocks
      .map((b) => `${b.from_m3}-${b.to_m3 ?? '+'} m3 @ $${b.price_per_m3}`)
      .join(', ');

    console.log(`  ${tariff.category.padEnd(12)} ${tariff.name}`);
    console.log(`    Blocks: ${blockSummary}`);
    console.log(`    Additional: ${def.additional.map((a) => a.name).join(', ')}`);
    console.log(`    IVA: ${def.iva ? 'Si (16%)' : 'Exento'}\n`);
  }

  console.log(`Generated ${TARIFFS.length} tariff schedules.`);
}

generate()
  .catch((err) => {
    console.error('Tariff generation failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
