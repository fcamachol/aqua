import { db } from '../../config/database.js';
import { sql } from 'drizzle-orm';
import {
  paginationOffsetLimit,
  paginatedResponse,
  type PaginationParams,
  type PaginatedResult,
} from '../../utils/pagination.js';
import type {
  ListTomasInput,
  UpdateTomaInput,
  TomaReadingsInput,
  ConsumptionSummaryInput,
} from './validators.js';

// ─── Types ──────────────────────────────────────────────────────

export interface Toma {
  id: string;
  tenant_id: string;
  explotacion_id: string;
  acometida_id: string | null;
  address_id: string;
  toma_number: string;
  toma_type: string;
  status: string;
  cut_date: string | null;
  cut_reason: string | null;
  has_meter: boolean;
  meter_id: string | null;
  billing_type: string;
  tariff_category: string | null;
  billing_period: string;
  latitude: number | null;
  longitude: number | null;
  inhabitants: number | null;
  property_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeterReading {
  id: string;
  reading_value: number;
  previous_reading: number | null;
  consumption: number | null;
  reading_date: string;
  source: string;
  status: string;
  anomaly_type: string | null;
  observations: string | null;
}

export interface ConsumptionBucket {
  period_label: string;
  total_consumption: number;
  reading_count: number;
  avg_consumption: number;
}

// ─── List Tomas ─────────────────────────────────────────────────

export async function list(
  tenantId: string,
  input: ListTomasInput,
): Promise<PaginatedResult<Toma>> {
  const params: PaginationParams = {
    page: input.page,
    limit: input.limit,
    sort: input.sort,
    order: input.order,
  };
  const { offset, limit } = paginationOffsetLimit(params);

  const conditions: string[] = [`tenant_id = '${tenantId}'`];
  if (input.toma_type) conditions.push(`toma_type = '${input.toma_type}'`);
  if (input.status) conditions.push(`status = '${input.status}'`);
  if (input.explotacion_id) conditions.push(`explotacion_id = '${input.explotacion_id}'`);
  if (input.has_meter !== undefined) conditions.push(`has_meter = ${input.has_meter}`);

  const where = conditions.join(' AND ');
  const orderDir = input.order === 'asc' ? 'ASC' : 'DESC';

  const countRows = await db.execute(
    sql.raw(`SELECT count(*)::int AS total FROM tomas WHERE ${where}`),
  );
  const total = (countRows[0] as any).total;

  const dataRows = await db.execute(
    sql.raw(
      `SELECT * FROM tomas WHERE ${where}
       ORDER BY ${input.sort} ${orderDir}
       LIMIT ${limit} OFFSET ${offset}`,
    ),
  );

  return paginatedResponse(dataRows as unknown as Toma[], total, params);
}

// ─── Get by ID ──────────────────────────────────────────────────

export async function getById(
  tenantId: string,
  id: string,
): Promise<Toma | null> {
  const rows = await db.execute(sql`
    SELECT * FROM tomas
    WHERE tenant_id = ${tenantId} AND id = ${id}
    LIMIT 1
  `);
  return (rows[0] as unknown as Toma) ?? null;
}

// ─── Update Toma ────────────────────────────────────────────────

export async function update(
  tenantId: string,
  id: string,
  input: UpdateTomaInput,
): Promise<Toma | null> {
  const setClauses: string[] = [];

  const fieldMap: Record<string, unknown> = {
    toma_type: input.toma_type,
    status: input.status,
    billing_type: input.billing_type,
    tariff_category: input.tariff_category,
    billing_period: input.billing_period,
    inhabitants: input.inhabitants,
    property_type: input.property_type,
    notes: input.notes,
    has_meter: input.has_meter,
  };

  for (const [col, val] of Object.entries(fieldMap)) {
    if (val !== undefined) {
      const escaped =
        typeof val === 'string'
          ? `'${val.replace(/'/g, "''")}'`
          : typeof val === 'boolean'
            ? val.toString()
            : typeof val === 'number'
              ? String(val)
              : 'NULL';
      setClauses.push(`${col} = ${escaped}`);
    }
  }

  if (setClauses.length === 0) return getById(tenantId, id);

  setClauses.push(`updated_at = now()`);

  const rows = await db.execute(
    sql.raw(
      `UPDATE tomas SET ${setClauses.join(', ')}
       WHERE tenant_id = '${tenantId}' AND id = '${id}'
       RETURNING *`,
    ),
  );

  return (rows[0] as unknown as Toma) ?? null;
}

// ─── Reading History for a Toma ─────────────────────────────────

export async function getReadings(
  tenantId: string,
  tomaId: string,
  input: TomaReadingsInput,
): Promise<PaginatedResult<MeterReading>> {
  const params: PaginationParams = {
    page: input.page,
    limit: input.limit,
    sort: 'reading_date',
    order: 'desc',
  };
  const { offset, limit } = paginationOffsetLimit(params);

  const conditions: string[] = [
    `tenant_id = '${tenantId}'`,
    `toma_id = '${tomaId}'`,
  ];
  if (input.date_from) conditions.push(`reading_date >= '${input.date_from.toISOString()}'`);
  if (input.date_to) conditions.push(`reading_date <= '${input.date_to.toISOString()}'`);
  if (input.source) conditions.push(`source = '${input.source}'`);

  const where = conditions.join(' AND ');

  const countRows = await db.execute(
    sql.raw(`SELECT count(*)::int AS total FROM meter_readings WHERE ${where}`),
  );
  const total = (countRows[0] as any).total;

  const dataRows = await db.execute(
    sql.raw(
      `SELECT id, reading_value, previous_reading, consumption, reading_date,
              source, status, anomaly_type, observations
       FROM meter_readings WHERE ${where}
       ORDER BY reading_date DESC
       LIMIT ${limit} OFFSET ${offset}`,
    ),
  );

  return paginatedResponse(dataRows as unknown as MeterReading[], total, params);
}

// ─── Consumption Summary ────────────────────────────────────────

export async function getConsumptionSummary(
  tenantId: string,
  tomaId: string,
  input: ConsumptionSummaryInput,
): Promise<ConsumptionBucket[]> {
  const truncInterval =
    input.period === 'monthly' ? 'month'
    : input.period === 'bimonthly' ? '2 months'
    : input.period === 'quarterly' ? 'quarter'
    : 'year';

  const conditions: string[] = [
    `tenant_id = '${tenantId}'`,
    `toma_id = '${tomaId}'`,
    `consumption IS NOT NULL`,
  ];
  if (input.date_from) conditions.push(`reading_date >= '${input.date_from.toISOString()}'`);
  if (input.date_to) conditions.push(`reading_date <= '${input.date_to.toISOString()}'`);

  const where = conditions.join(' AND ');

  // For bimonthly, use a manual approach; for others, use date_trunc
  const truncExpr =
    input.period === 'bimonthly'
      ? `date_trunc('month', reading_date) - (EXTRACT(MONTH FROM reading_date)::int % 2) * INTERVAL '1 month'`
      : `date_trunc('${truncInterval}', reading_date)`;

  const rows = await db.execute(
    sql.raw(
      `SELECT
         to_char(${truncExpr}, 'YYYY-MM') AS period_label,
         COALESCE(SUM(consumption), 0)::float AS total_consumption,
         COUNT(*)::int AS reading_count,
         COALESCE(AVG(consumption), 0)::float AS avg_consumption
       FROM meter_readings
       WHERE ${where}
       GROUP BY ${truncExpr}
       ORDER BY ${truncExpr} DESC`,
    ),
  );

  return rows as unknown as ConsumptionBucket[];
}
