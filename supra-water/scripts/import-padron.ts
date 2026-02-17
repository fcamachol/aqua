/**
 * Padron Import Script — import existing customer registry from CSV/Excel
 *
 * Usage:
 *   npx tsx scripts/import-padron.ts --file ./data/padron.csv --tenant cea-queretaro
 *   npx tsx scripts/import-padron.ts --file ./data/padron.xlsx --tenant cea-queretaro --dry-run
 *
 * Expected CSV columns (adaptable):
 *   cuenta, nombre, apellido_paterno, apellido_materno, rfc, curp,
 *   telefono, email, calle, num_ext, colonia, cp,
 *   toma_numero, tipo_toma, medidor_serie, uso
 *
 * Features:
 *   - Validates RFC/CURP formats
 *   - Inserts in batches with progress reporting
 *   - Reports validation errors at the end
 *   - Supports --dry-run to validate without inserting
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';
import { tenants } from '../db/schema/tenants.js';
import { persons } from '../db/schema/persons.js';
import { addresses } from '../db/schema/addresses.js';
import { tomas } from '../db/schema/tomas.js';
import { contracts } from '../db/schema/contracts.js';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://supra:supra@localhost:5432/supra_water';

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// ─── CLI Args ──────────────────────────────────────────────────

const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const tenantIdx = args.indexOf('--tenant');
const dryRun = args.includes('--dry-run');

const filePath = fileIdx >= 0 ? args[fileIdx + 1] : null;
const tenantSlug = tenantIdx >= 0 ? args[tenantIdx + 1] : null;

if (!filePath || !tenantSlug) {
  console.error('Usage: npx tsx scripts/import-padron.ts --file <path> --tenant <slug> [--dry-run]');
  process.exit(1);
}

// ─── Validation Helpers ────────────────────────────────────────

const RFC_REGEX = /^[A-Z&]{3,4}\d{6}[A-Z0-9]{3}$/;
const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
}

function validateRfc(rfc: string | undefined): boolean {
  if (!rfc) return true; // optional
  return RFC_REGEX.test(rfc.toUpperCase().trim());
}

function validateCurp(curp: string | undefined): boolean {
  if (!curp) return true; // optional
  return CURP_REGEX.test(curp.toUpperCase().trim());
}

// ─── CSV Parser (simple, no external deps) ─────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ?? '';
    }
    rows.push(row);
  }

  return rows;
}

// ─── Main Import ───────────────────────────────────────────────

const BATCH_SIZE = 100;

async function importPadron() {
  console.log(`Import padron from: ${filePath}`);
  console.log(`Tenant: ${tenantSlug}`);
  console.log(`Dry run: ${dryRun}\n`);

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
  console.log(`Resolved tenant: ${tenant.name} (${tenant.id})\n`);

  // Read file
  const ext = path.extname(filePath!).toLowerCase();
  if (ext !== '.csv') {
    console.error('Only CSV files are supported in this version. For Excel (.xlsx), convert to CSV first.');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath!, 'utf-8');
  const rows = parseCsv(content);
  console.log(`Parsed ${rows.length} rows from CSV.\n`);

  if (rows.length === 0) {
    console.log('No data rows found. Exiting.');
    return;
  }

  const errors: ValidationError[] = [];
  let imported = 0;
  let skipped = 0;

  for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
    const batch = rows.slice(batchStart, batchStart + BATCH_SIZE);

    for (let i = 0; i < batch.length; i++) {
      const rowNum = batchStart + i + 2; // +2 for header + 1-based
      const row = batch[i];

      // Validate RFC
      if (row.rfc && !validateRfc(row.rfc)) {
        errors.push({ row: rowNum, field: 'rfc', value: row.rfc, message: 'Invalid RFC format' });
      }

      // Validate CURP
      if (row.curp && !validateCurp(row.curp)) {
        errors.push({ row: rowNum, field: 'curp', value: row.curp, message: 'Invalid CURP format' });
      }

      // Require name
      const name = [row.nombre, row.apellido_paterno, row.apellido_materno]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (!name) {
        errors.push({ row: rowNum, field: 'nombre', value: '', message: 'Name is required' });
        skipped++;
        continue;
      }

      if (dryRun) {
        imported++;
        continue;
      }

      try {
        // Insert person
        const [person] = await db
          .insert(persons)
          .values({
            tenantId: tenant.id,
            personType: row.rfc && row.rfc.length === 12 ? 'moral' : 'fisica',
            rfc: row.rfc?.toUpperCase().trim() || null,
            curp: row.curp?.toUpperCase().trim() || null,
            name,
            firstName: row.nombre || null,
            lastNamePaterno: row.apellido_paterno || null,
            lastNameMaterno: row.apellido_materno || null,
            email: row.email || null,
            phone: row.telefono || null,
          })
          .returning();

        // Insert address if street provided
        if (row.calle) {
          await db.insert(addresses).values({
            tenantId: tenant.id,
            street: row.calle,
            exteriorNumber: row.num_ext || null,
            colonia: row.colonia || null,
            zipCode: row.cp || null,
            state: 'Queretaro',
          });
        }

        imported++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ row: rowNum, field: 'insert', value: name, message });
        skipped++;
      }
    }

    const progress = Math.min(batchStart + BATCH_SIZE, rows.length);
    const pct = Math.round((progress / rows.length) * 100);
    process.stdout.write(`\r  Progress: ${progress}/${rows.length} (${pct}%)`);
  }

  console.log('\n');

  // ── Report ──────────────────────────────────────────────────────

  console.log('=== Import Summary ===');
  console.log(`  Total rows:    ${rows.length}`);
  console.log(`  Imported:      ${imported}`);
  console.log(`  Skipped:       ${skipped}`);
  console.log(`  Errors:        ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n=== Validation Errors ===');
    for (const err of errors.slice(0, 50)) {
      console.log(`  Row ${err.row}: [${err.field}] "${err.value}" — ${err.message}`);
    }
    if (errors.length > 50) {
      console.log(`  ... and ${errors.length - 50} more errors.`);
    }
  }

  if (dryRun) {
    console.log('\n(Dry run — no data was inserted.)');
  }
}

importPadron()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
