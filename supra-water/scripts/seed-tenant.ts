/**
 * Seed first tenant: CEA Queretaro
 *
 * Usage: npx tsx scripts/seed-tenant.ts
 *
 * Creates:
 *   - Tenant: cea-queretaro
 *   - Admin user: admin@cea.gob.mx / changeme
 *   - Explotacion: QRO-CENTRO
 *   - Sample tariff schedule (domestica) with realistic Queretaro rates
 *   - Sample office
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { tenants, explotaciones, offices } from '../db/schema/tenants.js';
import { users } from '../db/schema/users.js';
import { tariffSchedules } from '../db/schema/invoices.js';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://supra:supra@localhost:5432/supra_water';

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function seed() {
  console.log('Seeding CEA Queretaro...\n');

  // ── 1. Tenant ──────────────────────────────────────────────────

  const [tenant] = await db
    .insert(tenants)
    .values({
      slug: 'cea-queretaro',
      name: 'CEA Queretaro',
      rfc: 'CEQ850101AAA',
      fiscalName: 'Comision Estatal de Aguas de Queretaro',
      fiscalAddress: {
        street: 'Av. 5 de Febrero',
        exterior_number: '35',
        colonia: 'Las Campanas',
        municipality: 'Queretaro',
        state: 'Queretaro',
        zip_code: '76010',
        country: 'MX',
      },
      config: {
        billing_period: 'mensual',
        currency: 'MXN',
        iva_rate: 0,
        water_services_exempt_iva: true,
        default_due_days: 20,
        late_payment_surcharge_pct: 2,
        reconnection_fee: 350,
        cfdi_enabled: true,
        whatsapp_enabled: true,
        sms_enabled: true,
      },
    })
    .returning();

  console.log(`  Tenant: ${tenant.name} (${tenant.slug})`);

  // ── 2. Admin User ──────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('changeme', 12);

  const [admin] = await db
    .insert(users)
    .values({
      tenantId: tenant.id,
      email: 'admin@cea.gob.mx',
      passwordHash,
      name: 'Administrador CEA',
      role: 'admin',
      permissions: ['*'],
    })
    .returning();

  console.log(`  Admin user: ${admin.email} (role: ${admin.role})`);

  // ── 3. Explotacion ─────────────────────────────────────────────

  const [explotacion] = await db
    .insert(explotaciones)
    .values({
      tenantId: tenant.id,
      code: 'QRO-CENTRO',
      name: 'Zona Centro Queretaro',
      municipality: 'Queretaro',
      state: 'Queretaro',
      config: {},
      billingConfig: {
        billing_period: 'mensual',
        due_days: 20,
      },
      readingConfig: {
        schedule: 'monthly',
        reading_window_days: 5,
      },
    })
    .returning();

  console.log(`  Explotacion: ${explotacion.code} - ${explotacion.name}`);

  // ── 4. Sample Office ──────────────────────────────────────────

  const [office] = await db
    .insert(offices)
    .values({
      tenantId: tenant.id,
      explotacionId: explotacion.id,
      name: 'Oficina Central CEA',
      address: {
        street: 'Av. 5 de Febrero',
        exterior_number: '35',
        colonia: 'Las Campanas',
        municipality: 'Queretaro',
        state: 'Queretaro',
        zip_code: '76010',
      },
      phone: '+52 442 238 1500',
      officeType: 'presencial',
      config: {
        hours: 'Lun-Vie 08:00-16:00',
        services: ['pagos', 'contratos', 'quejas', 'lecturas'],
      },
    })
    .returning();

  console.log(`  Office: ${office.name}`);

  // ── 5. Tariff Schedule (Domestica) ────────────────────────────

  const [tariff] = await db
    .insert(tariffSchedules)
    .values({
      tenantId: tenant.id,
      explotacionId: explotacion.id,
      name: 'Tarifa Domestica 2026',
      category: 'domestica',
      effectiveFrom: '2026-01-01',
      billingPeriod: 'mensual',
      blocks: [
        { from_m3: 0, to_m3: 10, price_per_m3: 5.50, fixed_charge: 45.00 },
        { from_m3: 10, to_m3: 20, price_per_m3: 8.75, fixed_charge: 0 },
        { from_m3: 20, to_m3: 40, price_per_m3: 15.30, fixed_charge: 0 },
        { from_m3: 40, to_m3: null, price_per_m3: 25.00, fixed_charge: 0 },
      ],
      additionalConcepts: [
        {
          code: 'alcantarillado',
          name: 'Alcantarillado',
          type: 'percentage',
          value: 0.25,
          base: 'agua',
        },
        {
          code: 'saneamiento',
          name: 'Saneamiento',
          type: 'fixed',
          value: 15.00,
        },
      ],
      ivaApplicable: false,
      socialDiscountPct: '30.00',
      approvedBy: 'H. Congreso del Estado de Queretaro',
      approvalDate: '2025-12-15',
      gazetteReference: 'Periodico Oficial del Estado No. 95, 2025-12-20',
    })
    .returning();

  console.log(`  Tariff: ${tariff.name} (${tariff.category})`);

  console.log('\nSeed complete.');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
