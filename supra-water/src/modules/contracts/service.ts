import { db } from '../../config/database.js';
import { sql } from 'drizzle-orm';
import {
  paginationOffsetLimit,
  paginatedResponse,
  type PaginationParams,
  type PaginatedResult,
} from '../../utils/pagination.js';
import {
  emitContractRequested,
  emitContractCreated,
  emitContractTerminated,
  emitContractTitularChanged,
} from './events.js';
import type {
  CreateContractInput,
  UpdateContractInput,
  ListContractsInput,
  TerminateContractInput,
  ChangeTitularInput,
  SubrogateContractInput,
} from './validators.js';

// ─── Types ──────────────────────────────────────────────────────

export interface Contract {
  id: string;
  tenant_id: string;
  explotacion_id: string;
  contract_number: string;
  person_id: string;
  toma_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  termination_reason: string | null;
  billing_address_id: string | null;
  payment_method: string;
  bank_account: Record<string, unknown> | null;
  digital_invoice: boolean;
  tariff_category: string;
  social_tariff: boolean;
  special_conditions: Record<string, unknown> | null;
  preferred_contact_method: string;
  notification_channels: string[];
  previous_contract_id: string | null;
  documents: unknown[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Generate the next sequential contract number for a given explotacion.
 * Format: {explotacion_code}-{sequential_number}
 */
async function nextContractNumber(tenantId: string, explotacionId: string): Promise<string> {
  const codeRows = await db.execute(sql`
    SELECT code FROM explotaciones
    WHERE tenant_id = ${tenantId} AND id = ${explotacionId}
    LIMIT 1
  `);
  const code = (codeRows[0] as any)?.code ?? 'UNK';

  const countRows = await db.execute(sql`
    SELECT count(*)::int AS cnt FROM contracts
    WHERE tenant_id = ${tenantId} AND explotacion_id = ${explotacionId}
  `);
  const seq = ((countRows[0] as any).cnt + 1).toString().padStart(6, '0');
  return `${code}-${seq}`;
}

// ─── Create Contract ────────────────────────────────────────────

export async function createContract(
  tenantId: string,
  input: CreateContractInput,
): Promise<Contract> {
  // 1. Validate toma exists and has no active contract
  const tomaRows = await db.execute(sql`
    SELECT id, status FROM tomas
    WHERE tenant_id = ${tenantId} AND id = ${input.toma_id}
    LIMIT 1
  `);
  if (!tomaRows[0]) {
    throw Object.assign(new Error('Toma not found'), { name: 'NotFoundError' });
  }

  const activeContracts = await db.execute(sql`
    SELECT id FROM contracts
    WHERE tenant_id = ${tenantId} AND toma_id = ${input.toma_id}
      AND status IN ('activo', 'pendiente')
    LIMIT 1
  `);
  if (activeContracts[0]) {
    throw Object.assign(
      new Error('Toma already has an active contract'),
      { name: 'ConflictError' },
    );
  }

  // 2. Validate person exists
  const personRows = await db.execute(sql`
    SELECT id, rfc FROM persons
    WHERE tenant_id = ${tenantId} AND id = ${input.person_id}
    LIMIT 1
  `);
  if (!personRows[0]) {
    throw Object.assign(new Error('Person not found'), { name: 'NotFoundError' });
  }

  // 3. Generate contract number
  const contractNumber = await nextContractNumber(tenantId, input.explotacion_id);

  // 4. Create the contract
  const rows = await db.execute(sql`
    INSERT INTO contracts (
      tenant_id, explotacion_id, contract_number, person_id, toma_id,
      status, start_date, tariff_category, billing_period,
      payment_method, bank_account, digital_invoice,
      social_tariff, special_conditions,
      preferred_contact_method, notification_channels,
      billing_address_id, documents, notes
    ) VALUES (
      ${tenantId}, ${input.explotacion_id}, ${contractNumber},
      ${input.person_id}, ${input.toma_id},
      'pendiente', CURRENT_DATE, ${input.tariff_category},
      ${input.billing_period},
      ${input.payment_method},
      ${input.bank_account ? JSON.stringify(input.bank_account) : null},
      ${input.digital_invoice},
      ${input.social_tariff},
      ${input.special_conditions ? JSON.stringify(input.special_conditions) : null},
      ${input.preferred_contact_method},
      ${`{${input.notification_channels.join(',')}}`},
      ${input.billing_address_id ?? null},
      ${JSON.stringify(input.documents)},
      ${input.notes ?? null}
    )
    RETURNING *
  `);

  const contract = rows[0] as unknown as Contract;

  // 5. Update toma status to pendiente_alta
  await db.execute(sql`
    UPDATE tomas SET status = 'pendiente_alta', updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${input.toma_id}
  `);

  // 6. Emit events
  await emitContractRequested(tenantId, {
    contract_id: contract.id,
    person_id: input.person_id,
    toma_id: input.toma_id,
  });

  await emitContractCreated(tenantId, {
    contract_id: contract.id,
    contract_number: contractNumber,
  });

  return contract;
}

// ─── List Contracts ─────────────────────────────────────────────

export async function list(
  tenantId: string,
  input: ListContractsInput,
): Promise<PaginatedResult<Contract>> {
  const params: PaginationParams = {
    page: input.page,
    limit: input.limit,
    sort: input.sort,
    order: input.order,
  };
  const { offset, limit } = paginationOffsetLimit(params);

  const conditions: string[] = [`tenant_id = '${tenantId}'`];
  if (input.status) conditions.push(`status = '${input.status}'`);
  if (input.person_id) conditions.push(`person_id = '${input.person_id}'`);
  if (input.toma_id) conditions.push(`toma_id = '${input.toma_id}'`);
  if (input.explotacion_id) conditions.push(`explotacion_id = '${input.explotacion_id}'`);

  const where = conditions.join(' AND ');
  const orderDir = input.order === 'asc' ? 'ASC' : 'DESC';

  const countRows = await db.execute(
    sql.raw(`SELECT count(*)::int AS total FROM contracts WHERE ${where}`),
  );
  const total = (countRows[0] as any).total;

  const dataRows = await db.execute(
    sql.raw(
      `SELECT * FROM contracts WHERE ${where}
       ORDER BY ${input.sort} ${orderDir}
       LIMIT ${limit} OFFSET ${offset}`,
    ),
  );

  return paginatedResponse(dataRows as unknown as Contract[], total, params);
}

// ─── Get by ID ──────────────────────────────────────────────────

export async function getById(
  tenantId: string,
  id: string,
): Promise<Contract | null> {
  const rows = await db.execute(sql`
    SELECT * FROM contracts
    WHERE tenant_id = ${tenantId} AND id = ${id}
    LIMIT 1
  `);
  return (rows[0] as unknown as Contract) ?? null;
}

// ─── Update Contract ────────────────────────────────────────────

export async function update(
  tenantId: string,
  id: string,
  input: UpdateContractInput,
): Promise<Contract | null> {
  const setClauses: string[] = [];

  if (input.payment_method !== undefined) setClauses.push(`payment_method = '${input.payment_method}'`);
  if (input.bank_account !== undefined) setClauses.push(`bank_account = '${JSON.stringify(input.bank_account)}'::jsonb`);
  if (input.digital_invoice !== undefined) setClauses.push(`digital_invoice = ${input.digital_invoice}`);
  if (input.social_tariff !== undefined) setClauses.push(`social_tariff = ${input.social_tariff}`);
  if (input.special_conditions !== undefined) setClauses.push(`special_conditions = '${JSON.stringify(input.special_conditions)}'::jsonb`);
  if (input.preferred_contact_method !== undefined) setClauses.push(`preferred_contact_method = '${input.preferred_contact_method}'`);
  if (input.notification_channels !== undefined) setClauses.push(`notification_channels = '{${input.notification_channels.join(',')}}'`);
  if (input.billing_address_id !== undefined) setClauses.push(`billing_address_id = '${input.billing_address_id}'`);
  if (input.notes !== undefined) setClauses.push(`notes = '${input.notes.replace(/'/g, "''")}'`);

  if (setClauses.length === 0) return getById(tenantId, id);

  setClauses.push(`updated_at = now()`);

  const rows = await db.execute(
    sql.raw(
      `UPDATE contracts SET ${setClauses.join(', ')}
       WHERE tenant_id = '${tenantId}' AND id = '${id}'
       RETURNING *`,
    ),
  );

  return (rows[0] as unknown as Contract) ?? null;
}

// ─── Terminate Contract ─────────────────────────────────────────

export async function terminateContract(
  tenantId: string,
  id: string,
  input: TerminateContractInput,
): Promise<Contract> {
  // 1. Load the contract
  const contract = await getById(tenantId, id);
  if (!contract) {
    throw Object.assign(new Error('Contract not found'), { name: 'NotFoundError' });
  }
  if (contract.status === 'baja' || contract.status === 'cancelado') {
    throw Object.assign(
      new Error('Contract is already terminated'),
      { name: 'ConflictError' },
    );
  }

  // 2. Record final reading if provided
  if (input.final_reading !== undefined) {
    const meterRows = await db.execute(sql`
      SELECT meter_id FROM tomas
      WHERE tenant_id = ${tenantId} AND id = ${contract.toma_id}
      LIMIT 1
    `);
    const meterId = (meterRows[0] as any)?.meter_id;

    if (meterId) {
      // Get previous reading to compute consumption
      const prevRows = await db.execute(sql`
        SELECT reading_value FROM meter_readings
        WHERE tenant_id = ${tenantId} AND meter_id = ${meterId}
        ORDER BY reading_date DESC LIMIT 1
      `);
      const prevReading = (prevRows[0] as any)?.reading_value ?? 0;
      const consumption = input.final_reading - prevReading;

      await db.execute(sql`
        INSERT INTO meter_readings (
          tenant_id, meter_id, toma_id, contract_id,
          reading_value, previous_reading, consumption,
          reading_date, source, status
        ) VALUES (
          ${tenantId}, ${meterId}, ${contract.toma_id}, ${id},
          ${input.final_reading}, ${prevReading}, ${consumption},
          now(), 'manual_office', 'valid'
        )
      `);
    }
  }

  // 3. Terminate the contract
  const rows = await db.execute(sql`
    UPDATE contracts
    SET status = 'baja',
        end_date = CURRENT_DATE,
        termination_reason = ${input.reason},
        updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${id}
    RETURNING *
  `);

  // 4. Update toma status to 'baja'
  await db.execute(sql`
    UPDATE tomas SET status = 'baja', updated_at = now()
    WHERE tenant_id = ${tenantId} AND id = ${contract.toma_id}
  `);

  // 5. Emit event
  await emitContractTerminated(tenantId, {
    contract_id: id,
    reason: input.reason,
  });

  return rows[0] as unknown as Contract;
}

// ─── Change Titular ─────────────────────────────────────────────

export async function changeTitular(
  tenantId: string,
  id: string,
  input: ChangeTitularInput,
): Promise<{ old_contract: Contract; new_contract: Contract }> {
  // 1. Load existing contract
  const oldContract = await getById(tenantId, id);
  if (!oldContract) {
    throw Object.assign(new Error('Contract not found'), { name: 'NotFoundError' });
  }
  if (oldContract.status !== 'activo') {
    throw Object.assign(
      new Error('Only active contracts can change titular'),
      { name: 'ConflictError' },
    );
  }

  // 2. Validate new person exists
  const personRows = await db.execute(sql`
    SELECT id FROM persons
    WHERE tenant_id = ${tenantId} AND id = ${input.new_person_id}
    LIMIT 1
  `);
  if (!personRows[0]) {
    throw Object.assign(new Error('New person not found'), { name: 'NotFoundError' });
  }

  const oldPersonId = oldContract.person_id;

  // 3. Terminate old contract
  const terminated = await terminateContract(tenantId, id, {
    reason: `Cambio de titular a persona ${input.new_person_id}`,
  });

  // 4. Create new contract with same toma
  const newContract = await createContract(tenantId, {
    person_id: input.new_person_id,
    toma_id: oldContract.toma_id,
    explotacion_id: oldContract.explotacion_id,
    tariff_category: oldContract.tariff_category,
    billing_period: oldContract.billing_period as 'mensual' | 'bimestral' | 'trimestral',
    payment_method: oldContract.payment_method as any,
    digital_invoice: oldContract.digital_invoice,
    social_tariff: oldContract.social_tariff,
    preferred_contact_method: oldContract.preferred_contact_method as any,
    notification_channels: oldContract.notification_channels as any,
    billing_address_id: oldContract.billing_address_id ?? undefined,
    documents: input.documents,
    notes: input.notes,
  });

  // 5. Optionally transfer debt (move unpaid invoices to new contract)
  if (input.transfer_debt) {
    await db.execute(sql`
      UPDATE invoices
      SET contract_id = ${newContract.id},
          person_id = ${input.new_person_id},
          updated_at = now()
      WHERE tenant_id = ${tenantId}
        AND contract_id = ${id}
        AND status IN ('pendiente', 'impagada', 'parcial')
    `);
  }

  // Link new contract to previous
  await db.execute(sql`
    UPDATE contracts
    SET previous_contract_id = ${id}
    WHERE tenant_id = ${tenantId} AND id = ${newContract.id}
  `);

  // 6. Emit titular changed event
  await emitContractTitularChanged(tenantId, {
    contract_id: newContract.id,
    old_person_id: oldPersonId,
    new_person_id: input.new_person_id,
  });

  return { old_contract: terminated, new_contract: newContract };
}

// ─── Subrogate Contract ─────────────────────────────────────────

export async function subrogateContract(
  tenantId: string,
  id: string,
  input: SubrogateContractInput,
): Promise<{ old_contract: Contract; new_contract: Contract }> {
  // Subrogation is similar to change titular but preserves the contract history
  // and always transfers debt by default
  return changeTitular(tenantId, id, {
    new_person_id: input.new_person_id,
    transfer_debt: input.transfer_debt,
    documents: input.documents,
    notes: input.notes ?? `Subrogación: ${input.reason}`,
  });
}
