import { db } from '../../config/database.js';
import {
  emitDelinquencyStarted,
  emitDelinquencyStepExecuted,
  emitDelinquencyResolved,
} from './events.js';
import { scoreAccount, type AccountFeatures } from './collection-scorer.js';
import type { ListDelinquencyInput, ExecuteStepInput } from './validators.js';

// =============================================================
// Delinquency Procedures Service
// Implements collection sequences from SUPRA §5
// =============================================================

interface DelinquencyProcedure {
  id: string;
  tenant_id: string;
  contract_id: string;
  person_id: string;
  total_debt: number;
  oldest_unpaid_date: string;
  invoice_count: number;
  procedure_type: string;
  current_step: number;
  current_step_name: string | null;
  status: string;
  steps_history: StepEntry[];
  next_step_date: string | null;
  vulnerability_flag: boolean;
  vulnerability_reason: string | null;
  resolved_date: string | null;
  resolution_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface StepEntry {
  step: number;
  action: string;
  date: string;
  result: string;
  day_offset: number;
}

// ---- Collection Sequences (SUPRA §5) ----

interface SequenceStep {
  day: number;
  action: string;
}

const COLLECTION_SEQUENCES: Record<string, SequenceStep[]> = {
  low_risk: [
    { day: 1, action: 'sms_reminder' },
    { day: 5, action: 'whatsapp_reminder_with_payment_link' },
    { day: 15, action: 'email_formal_notice' },
  ],
  medium_risk: [
    { day: 1, action: 'whatsapp_reminder_with_payment_link' },
    { day: 3, action: 'phone_call_ai' },
    { day: 7, action: 'whatsapp_warning_corte' },
    { day: 14, action: 'formal_letter' },
    { day: 21, action: 'schedule_corte_order' },
  ],
  high_risk: [
    { day: 1, action: 'phone_call_ai' },
    { day: 3, action: 'whatsapp_warning_corte' },
    { day: 7, action: 'formal_letter' },
    { day: 10, action: 'schedule_corte_order' },
  ],
  vulnerable: [
    { day: 1, action: 'whatsapp_social_tariff_offer' },
    { day: 7, action: 'phone_call_human_agent' },
    { day: 14, action: 'in_person_visit' },
    // NEVER auto-schedule corte for vulnerable accounts
  ],
};

/**
 * Determine the risk level for a delinquency procedure
 * based on account scoring.
 */
async function determineRiskLevel(
  tenantId: string,
  contractId: string,
  vulnerabilityFlag: boolean,
): Promise<string> {
  if (vulnerabilityFlag) return 'vulnerable';

  // Fetch account features for scoring
  const rows = await db.execute({
    sql: `
      SELECT
        COALESCE(
          (SELECT COUNT(*) FILTER (WHERE p.status = 'completed')::float / NULLIF(COUNT(*), 0)
           FROM payments p JOIN invoices i ON p.invoice_id = i.id
           WHERE i.contract_id = $1
             AND p.created_at > NOW() - INTERVAL '12 months'),
          0.5
        ) AS payment_history,
        COALESCE(
          (SELECT EXTRACT(EPOCH FROM NOW() - MIN(due_date)) / 86400
           FROM invoices WHERE contract_id = $1 AND status IN ('pendiente', 'impagada')),
          0
        )::int AS days_past_due,
        COALESCE(
          (SELECT SUM(total) FROM invoices WHERE contract_id = $1 AND status IN ('pendiente', 'impagada')),
          0
        ) AS total_debt,
        COALESCE(
          (SELECT COUNT(*) FROM invoices WHERE contract_id = $1 AND status IN ('pendiente', 'impagada')),
          0
        )::int AS invoice_count,
        COALESCE(
          EXTRACT(YEAR FROM AGE(NOW(), c.start_date)),
          1
        ) AS account_age,
        COALESCE(t.toma_type, 'domestico') AS toma_type,
        COALESCE(
          (SELECT COUNT(*) FROM payment_plans WHERE contract_id = $1),
          0
        )::int AS previous_plans
      FROM contracts c
      LEFT JOIN tomas t ON c.toma_id = t.id
      WHERE c.id = $1 AND c.tenant_id = $2
    `,
    args: [contractId, tenantId],
  });

  const raw = (rows as unknown as Array<Record<string, unknown>>)[0];
  if (!raw) return 'medium_risk';

  const features: AccountFeatures = {
    payment_history: Number(raw.payment_history),
    days_past_due: Number(raw.days_past_due),
    total_debt: Number(raw.total_debt),
    invoice_count: Number(raw.invoice_count),
    account_age: Number(raw.account_age),
    toma_type: String(raw.toma_type),
    previous_plans: Number(raw.previous_plans),
    vulnerability_flag: false,
    sector_rate: 0.15, // Default sector delinquency rate
  };

  const score = scoreAccount(features);
  return score.risk_level;
}

/**
 * List active delinquency procedures with filtering and pagination.
 */
export async function listProcedures(
  tenantId: string,
  input: ListDelinquencyInput,
): Promise<{ data: DelinquencyProcedure[]; total: number }> {
  const conditions: string[] = ['dp.tenant_id = $1'];
  const args: unknown[] = [tenantId];
  let paramIdx = 2;

  if (input.status) {
    conditions.push(`dp.status = $${paramIdx++}`);
    args.push(input.status);
  }
  if (input.procedure_type) {
    conditions.push(`dp.procedure_type = $${paramIdx++}`);
    args.push(input.procedure_type);
  }
  if (input.contract_id) {
    conditions.push(`dp.contract_id = $${paramIdx++}`);
    args.push(input.contract_id);
  }
  if (input.person_id) {
    conditions.push(`dp.person_id = $${paramIdx++}`);
    args.push(input.person_id);
  }
  if (input.vulnerability_flag !== undefined) {
    conditions.push(`dp.vulnerability_flag = $${paramIdx++}`);
    args.push(input.vulnerability_flag);
  }
  if (input.min_debt !== undefined) {
    conditions.push(`dp.total_debt >= $${paramIdx++}`);
    args.push(input.min_debt);
  }
  if (input.max_debt !== undefined) {
    conditions.push(`dp.total_debt <= $${paramIdx++}`);
    args.push(input.max_debt);
  }

  const where = conditions.join(' AND ');
  const offset = (input.page - 1) * input.page_size;

  const countRows = await db.execute({
    sql: `SELECT COUNT(*)::int AS total FROM delinquency_procedures dp WHERE ${where}`,
    args,
  });
  const total = (countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0;

  const dataRows = await db.execute({
    sql: `
      SELECT dp.* FROM delinquency_procedures dp
      WHERE ${where}
      ORDER BY dp.total_debt DESC, dp.oldest_unpaid_date ASC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `,
    args: [...args, input.page_size, offset],
  });

  return { data: dataRows as unknown as DelinquencyProcedure[], total };
}

/**
 * Get a single delinquency procedure by ID.
 */
export async function getProcedure(
  tenantId: string,
  procedureId: string,
): Promise<DelinquencyProcedure> {
  const rows = await db.execute({
    sql: `SELECT * FROM delinquency_procedures WHERE id = $1 AND tenant_id = $2`,
    args: [procedureId, tenantId],
  });

  const procedure = (rows as unknown as DelinquencyProcedure[])[0];
  if (!procedure) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  return procedure;
}

/**
 * Execute the next step in the collection sequence.
 * Determines risk level, looks up the next action in the sequence,
 * and records it. NEVER auto-schedules corte for vulnerable accounts.
 */
export async function executeNextStep(
  tenantId: string,
  procedureId: string,
  input: ExecuteStepInput,
  metadata?: Record<string, unknown>,
): Promise<DelinquencyProcedure> {
  const procedure = await getProcedure(tenantId, procedureId);

  if (procedure.status !== 'activo') {
    throw new Error('Procedure is not active');
  }

  // Determine risk level for sequence selection
  const riskLevel = await determineRiskLevel(
    tenantId,
    procedure.contract_id,
    procedure.vulnerability_flag,
  );

  const sequence = COLLECTION_SEQUENCES[riskLevel];
  if (!sequence) {
    throw new Error(`Unknown risk level: ${riskLevel}`);
  }

  const nextStepIdx = procedure.current_step;
  if (nextStepIdx >= sequence.length) {
    throw new Error('All collection steps have been executed for this sequence');
  }

  const stepDef = sequence[nextStepIdx];
  const action = input.action_override ?? stepDef.action;

  // SAFETY: Never auto-schedule corte for vulnerable accounts
  if (
    procedure.vulnerability_flag &&
    (action === 'schedule_corte_order' || action === 'corte')
  ) {
    throw new Error(
      'Cannot schedule corte for vulnerable accounts. Manual review required.',
    );
  }

  const now = new Date().toISOString().split('T')[0];
  const stepEntry: StepEntry = {
    step: nextStepIdx + 1,
    action,
    date: now,
    result: 'executed',
    day_offset: stepDef.day,
  };

  const history: StepEntry[] = Array.isArray(procedure.steps_history)
    ? procedure.steps_history
    : [];
  history.push(stepEntry);

  // Calculate next step date
  const nextIdx = nextStepIdx + 1;
  let nextStepDate: string | null = null;
  if (nextIdx < sequence.length) {
    const daysDiff = sequence[nextIdx].day - stepDef.day;
    const next = new Date();
    next.setDate(next.getDate() + daysDiff);
    nextStepDate = next.toISOString().split('T')[0];
  }

  const rows = await db.execute({
    sql: `
      UPDATE delinquency_procedures
      SET
        current_step = $1,
        current_step_name = $2,
        steps_history = $3,
        next_step_date = $4,
        notes = CASE WHEN $5::text IS NOT NULL
          THEN COALESCE(notes, '') || E'\n' || $5
          ELSE notes END,
        updated_at = NOW()
      WHERE id = $6 AND tenant_id = $7
      RETURNING *
    `,
    args: [
      nextIdx,
      action,
      JSON.stringify(history),
      nextStepDate,
      input.notes ?? null,
      procedureId,
      tenantId,
    ],
  });

  const updated = (rows as unknown as DelinquencyProcedure[])[0];

  await emitDelinquencyStepExecuted(
    tenantId,
    procedureId,
    String(nextIdx),
    action,
    metadata,
  );

  return updated;
}
