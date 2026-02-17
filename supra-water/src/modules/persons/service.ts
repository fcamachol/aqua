import { db } from '../../config/database.js';
import { sql } from 'drizzle-orm';
import {
  parsePagination,
  paginationOffsetLimit,
  paginatedResponse,
  type PaginationParams,
  type PaginatedResult,
} from '../../utils/pagination.js';
import { emitPersonCreated, emitPersonUpdated } from './events.js';
import type { CreatePersonInput, UpdatePersonInput, SearchPersonInput } from './validators.js';

// ─── Types ──────────────────────────────────────────────────────

export interface Person {
  id: string;
  tenant_id: string;
  person_type: string;
  rfc: string | null;
  curp: string | null;
  name: string;
  first_name: string | null;
  last_name_paterno: string | null;
  last_name_materno: string | null;
  email: string | null;
  phone: string | null;
  phone_secondary: string | null;
  whatsapp: string | null;
  fiscal_regime: string | null;
  fiscal_use: string | null;
  fiscal_address: Record<string, unknown> | null;
  zip_code: string | null;
  vulnerable: boolean;
  vulnerability_type: string | null;
  digital_access: boolean;
  preferred_channel: string;
  language: string;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ─── Create ─────────────────────────────────────────────────────

export async function create(
  tenantId: string,
  input: CreatePersonInput,
): Promise<Person> {
  const rows = await db.execute(sql`
    INSERT INTO persons (
      tenant_id, person_type, rfc, curp, name,
      first_name, last_name_paterno, last_name_materno,
      email, phone, phone_secondary, whatsapp,
      fiscal_regime, fiscal_use, fiscal_address, zip_code,
      vulnerable, vulnerability_type, digital_access,
      preferred_channel, language, notes, tags
    ) VALUES (
      ${tenantId}, ${input.person_type}, ${input.rfc ?? null}, ${input.curp ?? null}, ${input.name},
      ${input.first_name ?? null}, ${input.last_name_paterno ?? null}, ${input.last_name_materno ?? null},
      ${input.email ?? null}, ${input.phone ?? null}, ${input.phone_secondary ?? null}, ${input.whatsapp ?? null},
      ${input.fiscal_regime ?? null}, ${input.fiscal_use ?? null},
      ${input.fiscal_address ? JSON.stringify(input.fiscal_address) : null},
      ${input.zip_code ?? null},
      ${input.vulnerable}, ${input.vulnerability_type ?? null}, ${input.digital_access},
      ${input.preferred_channel}, ${input.language}, ${input.notes ?? null},
      ${input.tags.length > 0 ? `{${input.tags.join(',')}}` : '{}'}
    )
    RETURNING *
  `);

  const person = rows[0] as unknown as Person;

  await emitPersonCreated(tenantId, {
    person_id: person.id,
    person_type: person.person_type as 'fisica' | 'moral',
    name: person.name,
    rfc: person.rfc ?? undefined,
  });

  return person;
}

// ─── Get by ID ──────────────────────────────────────────────────

export async function getById(
  tenantId: string,
  id: string,
): Promise<Person | null> {
  const rows = await db.execute(sql`
    SELECT * FROM persons
    WHERE tenant_id = ${tenantId} AND id = ${id}
    LIMIT 1
  `);
  return (rows[0] as unknown as Person) ?? null;
}

// ─── Search ─────────────────────────────────────────────────────

export async function search(
  tenantId: string,
  input: SearchPersonInput,
): Promise<PaginatedResult<Person>> {
  const params: PaginationParams = {
    page: input.page,
    limit: input.limit,
    sort: input.sort,
    order: input.order,
  };
  const { offset, limit } = paginationOffsetLimit(params);

  // Build WHERE conditions
  const conditions: string[] = [`tenant_id = '${tenantId}'`];
  const values: unknown[] = [];

  if (input.q) {
    // pg_trgm fuzzy search on name
    conditions.push(`name % $${values.length + 1}`);
    values.push(input.q);
  }
  if (input.rfc) {
    conditions.push(`rfc = $${values.length + 1}`);
    values.push(input.rfc.toUpperCase());
  }
  if (input.curp) {
    conditions.push(`curp = $${values.length + 1}`);
    values.push(input.curp.toUpperCase());
  }
  if (input.phone) {
    conditions.push(`(phone = $${values.length + 1} OR phone_secondary = $${values.length + 1} OR whatsapp = $${values.length + 1})`);
    values.push(input.phone);
  }
  if (input.person_type) {
    conditions.push(`person_type = $${values.length + 1}`);
    values.push(input.person_type);
  }

  const where = conditions.join(' AND ');
  const orderCol = input.sort === 'name' ? 'name' : input.sort;
  const orderDir = input.order === 'asc' ? 'ASC' : 'DESC';

  // If fuzzy search, order by similarity first
  const orderBy = input.q
    ? `similarity(name, '${input.q.replace(/'/g, "''")}') DESC, ${orderCol} ${orderDir}`
    : `${orderCol} ${orderDir}`;

  const countRows = await db.execute(
    sql.raw(`SELECT count(*)::int AS total FROM persons WHERE ${where}`),
  );
  const total = (countRows[0] as any).total;

  const dataRows = await db.execute(
    sql.raw(
      `SELECT * FROM persons WHERE ${where} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
    ),
  );

  return paginatedResponse(dataRows as unknown as Person[], total, params);
}

// ─── Update ─────────────────────────────────────────────────────

export async function update(
  tenantId: string,
  id: string,
  input: UpdatePersonInput,
): Promise<Person | null> {
  // Build SET clause dynamically from provided fields
  const setClauses: string[] = [];
  const changedFields: string[] = [];

  const fieldMap: Record<string, unknown> = {
    rfc: input.rfc,
    curp: input.curp,
    name: input.name,
    first_name: input.first_name,
    last_name_paterno: input.last_name_paterno,
    last_name_materno: input.last_name_materno,
    email: input.email,
    phone: input.phone,
    phone_secondary: input.phone_secondary,
    whatsapp: input.whatsapp,
    fiscal_regime: input.fiscal_regime,
    fiscal_use: input.fiscal_use,
    fiscal_address: input.fiscal_address ? JSON.stringify(input.fiscal_address) : undefined,
    zip_code: input.zip_code,
    vulnerable: input.vulnerable,
    vulnerability_type: input.vulnerability_type,
    digital_access: input.digital_access,
    preferred_channel: input.preferred_channel,
    language: input.language,
    notes: input.notes,
    tags: input.tags ? `{${input.tags.join(',')}}` : undefined,
  };

  for (const [col, val] of Object.entries(fieldMap)) {
    if (val !== undefined) {
      const escaped = typeof val === 'string'
        ? `'${val.replace(/'/g, "''")}'`
        : typeof val === 'boolean'
          ? val.toString()
          : val === null
            ? 'NULL'
            : `'${String(val)}'`;
      setClauses.push(`${col} = ${escaped}`);
      changedFields.push(col);
    }
  }

  if (setClauses.length === 0) return getById(tenantId, id);

  setClauses.push(`updated_at = now()`);

  const rows = await db.execute(
    sql.raw(
      `UPDATE persons SET ${setClauses.join(', ')}
       WHERE tenant_id = '${tenantId}' AND id = '${id}'
       RETURNING *`,
    ),
  );

  if (!rows[0]) return null;

  const person = rows[0] as unknown as Person;

  await emitPersonUpdated(tenantId, {
    person_id: person.id,
    changed_fields: changedFields,
  });

  return person;
}
