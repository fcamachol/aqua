import { db } from '../../config/database.js';
import { emitFraudCaseOpened, emitFraudConfirmed } from './events.js';
import type {
  CreateFraudCaseInput,
  ListFraudCasesInput,
  UpdateFraudCaseInput,
} from './validators.js';

// =============================================================
// Fraud Cases Service (SIF — Sistema de Inspección de Fraudes)
// =============================================================

interface FraudCase {
  id: string;
  tenant_id: string;
  case_number: string;
  contract_id: string | null;
  toma_id: string | null;
  address_id: string;
  detection_source: string;
  detection_date: string;
  anomaly_data: unknown | null;
  status: string;
  fraud_type: string | null;
  estimated_volume_m3: number | null;
  estimated_value: number | null;
  inspections: unknown[];
  resolution_type: string | null;
  resolution_date: string | null;
  invoice_id: string | null;
  legal_case_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Generate a sequential case number.
 */
async function generateCaseNumber(tenantId: string): Promise<string> {
  const rows = await db.execute({
    sql: `SELECT COUNT(*)::int + 1 AS next_num FROM fraud_cases WHERE tenant_id = $1`,
    args: [tenantId],
  });
  const num = (rows as unknown as Array<{ next_num: number }>)[0]?.next_num ?? 1;
  return `SIF-${String(num).padStart(6, '0')}`;
}

/**
 * Create a new fraud case.
 */
export async function createFraudCase(
  tenantId: string,
  input: CreateFraudCaseInput,
  metadata?: Record<string, unknown>,
): Promise<FraudCase> {
  const caseNumber = await generateCaseNumber(tenantId);

  const rows = await db.execute({
    sql: `
      INSERT INTO fraud_cases (
        tenant_id, case_number, contract_id, toma_id, address_id,
        detection_source, detection_date, anomaly_data,
        fraud_type, estimated_volume_m3, estimated_value,
        notes
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9, $10, $11,
        $12
      )
      RETURNING *
    `,
    args: [
      tenantId,
      caseNumber,
      input.contract_id ?? null,
      input.toma_id ?? null,
      input.address_id,
      input.detection_source,
      input.detection_date,
      input.anomaly_data ? JSON.stringify(input.anomaly_data) : null,
      input.fraud_type ?? null,
      input.estimated_volume_m3 ?? null,
      input.estimated_value ?? null,
      input.notes ?? null,
    ],
  });

  const fraudCase = (rows as unknown as FraudCase[])[0];

  await emitFraudCaseOpened(
    tenantId,
    fraudCase.id,
    fraudCase.toma_id ?? '',
    fraudCase.detection_source,
    metadata,
  );

  return fraudCase;
}

/**
 * List fraud cases with filtering and pagination.
 */
export async function listFraudCases(
  tenantId: string,
  input: ListFraudCasesInput,
): Promise<{ data: FraudCase[]; total: number }> {
  const conditions: string[] = ['fc.tenant_id = $1'];
  const args: unknown[] = [tenantId];
  let paramIdx = 2;

  if (input.status) {
    conditions.push(`fc.status = $${paramIdx++}`);
    args.push(input.status);
  }
  if (input.detection_source) {
    conditions.push(`fc.detection_source = $${paramIdx++}`);
    args.push(input.detection_source);
  }
  if (input.fraud_type) {
    conditions.push(`fc.fraud_type = $${paramIdx++}`);
    args.push(input.fraud_type);
  }
  if (input.contract_id) {
    conditions.push(`fc.contract_id = $${paramIdx++}`);
    args.push(input.contract_id);
  }
  if (input.from_date) {
    conditions.push(`fc.detection_date >= $${paramIdx++}`);
    args.push(input.from_date);
  }
  if (input.to_date) {
    conditions.push(`fc.detection_date <= $${paramIdx++}`);
    args.push(input.to_date);
  }

  const where = conditions.join(' AND ');
  const offset = (input.page - 1) * input.page_size;

  const countRows = await db.execute({
    sql: `SELECT COUNT(*)::int AS total FROM fraud_cases fc WHERE ${where}`,
    args,
  });
  const total = (countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0;

  const dataRows = await db.execute({
    sql: `
      SELECT fc.* FROM fraud_cases fc
      WHERE ${where}
      ORDER BY fc.detection_date DESC, fc.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `,
    args: [...args, input.page_size, offset],
  });

  return { data: dataRows as unknown as FraudCase[], total };
}

/**
 * Get a single fraud case by ID.
 */
export async function getFraudCase(
  tenantId: string,
  caseId: string,
): Promise<FraudCase> {
  const rows = await db.execute({
    sql: `SELECT * FROM fraud_cases WHERE id = $1 AND tenant_id = $2`,
    args: [caseId, tenantId],
  });

  const fraudCase = (rows as unknown as FraudCase[])[0];
  if (!fraudCase) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  return fraudCase;
}

/**
 * Update a fraud case: status, inspection data, resolution.
 */
export async function updateFraudCase(
  tenantId: string,
  caseId: string,
  input: UpdateFraudCaseInput,
  metadata?: Record<string, unknown>,
): Promise<FraudCase> {
  // If adding an inspection, append to existing array
  let inspectionUpdate = '';
  const sets: string[] = ['updated_at = NOW()'];
  const args: unknown[] = [];
  let paramIdx = 1;

  if (input.status !== undefined) {
    sets.push(`status = $${paramIdx++}`);
    args.push(input.status);
  }
  if (input.fraud_type !== undefined) {
    sets.push(`fraud_type = $${paramIdx++}`);
    args.push(input.fraud_type);
  }
  if (input.estimated_volume_m3 !== undefined) {
    sets.push(`estimated_volume_m3 = $${paramIdx++}`);
    args.push(input.estimated_volume_m3);
  }
  if (input.estimated_value !== undefined) {
    sets.push(`estimated_value = $${paramIdx++}`);
    args.push(input.estimated_value);
  }
  if (input.resolution_type !== undefined) {
    sets.push(`resolution_type = $${paramIdx++}`);
    args.push(input.resolution_type);
  }
  if (input.resolution_date !== undefined) {
    sets.push(`resolution_date = $${paramIdx++}`);
    args.push(input.resolution_date);
  }
  if (input.legal_case_reference !== undefined) {
    sets.push(`legal_case_reference = $${paramIdx++}`);
    args.push(input.legal_case_reference);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${paramIdx++}`);
    args.push(input.notes);
  }
  if (input.inspection) {
    sets.push(`inspections = inspections || $${paramIdx++}::jsonb`);
    args.push(JSON.stringify([input.inspection]));
  }

  const rows = await db.execute({
    sql: `
      UPDATE fraud_cases
      SET ${sets.join(', ')}
      WHERE id = $${paramIdx++} AND tenant_id = $${paramIdx++}
      RETURNING *
    `,
    args: [...args, caseId, tenantId],
  });

  const fraudCase = (rows as unknown as FraudCase[])[0];
  if (!fraudCase) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  // Emit confirmed event when status changes to confirmado
  if (input.status === 'confirmado' && input.fraud_type) {
    await emitFraudConfirmed(tenantId, caseId, input.fraud_type, metadata);
  }

  return fraudCase;
}
