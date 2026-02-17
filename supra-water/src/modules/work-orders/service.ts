import { db } from '../../config/database.js';
import { emitWorkOrderCreated, emitWorkOrderAssigned, emitWorkOrderCompleted } from './events.js';
import { getOptimizedRoute, type OptimizedRoute } from './route-optimizer.js';
import type {
  CreateWorkOrderInput,
  ListWorkOrdersInput,
  UpdateWorkOrderInput,
  CompleteWorkOrderInput,
} from './validators.js';

// =============================================================
// Work Orders Service
// =============================================================

interface WorkOrder {
  id: string;
  tenant_id: string;
  explotacion_id: string;
  order_number: string;
  order_type: string;
  contract_id: string | null;
  toma_id: string | null;
  meter_id: string | null;
  address_id: string | null;
  delinquency_id: string | null;
  assigned_to: string | null;
  team: string | null;
  priority: string;
  scheduled_date: string | null;
  scheduled_time_start: string | null;
  scheduled_time_end: string | null;
  estimated_duration_minutes: number | null;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  result: string | null;
  result_code: string | null;
  field_notes: string | null;
  photos: unknown[];
  gps_arrival: unknown | null;
  gps_departure: unknown | null;
  technician_signature_url: string | null;
  customer_signature_url: string | null;
  materials: unknown[];
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Generate a sequential order number for the tenant.
 */
async function generateOrderNumber(tenantId: string): Promise<string> {
  const rows = await db.execute({
    sql: `
      SELECT COUNT(*)::int + 1 AS next_num
      FROM work_orders
      WHERE tenant_id = $1
    `,
    args: [tenantId],
  });
  const num = (rows as unknown as Array<{ next_num: number }>)[0]?.next_num ?? 1;
  return `OT-${String(num).padStart(6, '0')}`;
}

/**
 * Resolve explotacion_id from the tenant's default or from the toma/contract.
 */
async function resolveExplotacionId(
  tenantId: string,
  input: CreateWorkOrderInput,
): Promise<string> {
  if (input.toma_id) {
    const rows = await db.execute({
      sql: `SELECT explotacion_id FROM tomas WHERE id = $1 AND tenant_id = $2`,
      args: [input.toma_id, tenantId],
    });
    const toma = (rows as unknown as Array<{ explotacion_id: string }>)[0];
    if (toma) return toma.explotacion_id;
  }
  if (input.contract_id) {
    const rows = await db.execute({
      sql: `SELECT t.explotacion_id FROM contracts c JOIN tomas t ON c.toma_id = t.id WHERE c.id = $1 AND c.tenant_id = $2`,
      args: [input.contract_id, tenantId],
    });
    const contract = (rows as unknown as Array<{ explotacion_id: string }>)[0];
    if (contract) return contract.explotacion_id;
  }
  // Fall back to tenant's default explotacion
  const rows = await db.execute({
    sql: `SELECT id FROM explotaciones WHERE tenant_id = $1 LIMIT 1`,
    args: [tenantId],
  });
  const expl = (rows as unknown as Array<{ id: string }>)[0];
  if (!expl) throw new Error('No explotacion found for tenant');
  return expl.id;
}

/**
 * Create a new work order.
 */
export async function createWorkOrder(
  tenantId: string,
  input: CreateWorkOrderInput,
  metadata?: Record<string, unknown>,
): Promise<WorkOrder> {
  const orderNumber = await generateOrderNumber(tenantId);
  const explotacionId = await resolveExplotacionId(tenantId, input);

  const rows = await db.execute({
    sql: `
      INSERT INTO work_orders (
        tenant_id, explotacion_id, order_number, order_type,
        contract_id, toma_id, meter_id, address_id, delinquency_id,
        assigned_to, team, priority,
        scheduled_date, scheduled_time_start, scheduled_time_end,
        estimated_duration_minutes, source, notes,
        status
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15,
        $16, $17, $18,
        $19
      )
      RETURNING *
    `,
    args: [
      tenantId,
      explotacionId,
      orderNumber,
      input.order_type,
      input.contract_id ?? null,
      input.toma_id ?? null,
      input.meter_id ?? null,
      input.address_id ?? null,
      input.delinquency_id ?? null,
      input.assigned_to ?? null,
      input.team ?? null,
      input.priority,
      input.scheduled_date ?? null,
      input.scheduled_time_start ?? null,
      input.scheduled_time_end ?? null,
      input.estimated_duration_minutes ?? null,
      input.source,
      input.notes ?? null,
      input.assigned_to ? 'asignada' : 'pendiente',
    ],
  });

  const order = (rows as unknown as WorkOrder[])[0];

  await emitWorkOrderCreated(
    tenantId,
    order.id,
    order.order_type,
    order.toma_id ?? '',
    metadata,
  );

  if (input.assigned_to) {
    await emitWorkOrderAssigned(tenantId, order.id, input.assigned_to, metadata);
  }

  return order;
}

/**
 * List work orders with filtering and pagination.
 */
export async function listWorkOrders(
  tenantId: string,
  input: ListWorkOrdersInput,
): Promise<{ data: WorkOrder[]; total: number }> {
  const conditions: string[] = ['wo.tenant_id = $1'];
  const args: unknown[] = [tenantId];
  let paramIdx = 2;

  if (input.status) {
    conditions.push(`wo.status = $${paramIdx++}`);
    args.push(input.status);
  }
  if (input.order_type) {
    conditions.push(`wo.order_type = $${paramIdx++}`);
    args.push(input.order_type);
  }
  if (input.assigned_to) {
    conditions.push(`wo.assigned_to = $${paramIdx++}`);
    args.push(input.assigned_to);
  }
  if (input.priority) {
    conditions.push(`wo.priority = $${paramIdx++}`);
    args.push(input.priority);
  }
  if (input.scheduled_date) {
    conditions.push(`wo.scheduled_date = $${paramIdx++}`);
    args.push(input.scheduled_date);
  }
  if (input.from_date) {
    conditions.push(`wo.created_at >= $${paramIdx++}`);
    args.push(input.from_date);
  }
  if (input.to_date) {
    conditions.push(`wo.created_at <= $${paramIdx++}`);
    args.push(input.to_date);
  }

  const where = conditions.join(' AND ');
  const offset = (input.page - 1) * input.page_size;

  const countRows = await db.execute({
    sql: `SELECT COUNT(*)::int AS total FROM work_orders wo WHERE ${where}`,
    args,
  });
  const total = (countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0;

  const dataRows = await db.execute({
    sql: `
      SELECT wo.* FROM work_orders wo
      WHERE ${where}
      ORDER BY
        CASE wo.priority
          WHEN 'urgente' THEN 1 WHEN 'alta' THEN 2
          WHEN 'normal' THEN 3 WHEN 'baja' THEN 4
        END,
        wo.scheduled_date ASC NULLS LAST,
        wo.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `,
    args: [...args, input.page_size, offset],
  });

  return { data: dataRows as unknown as WorkOrder[], total };
}

/**
 * Update a work order (status, assignment, scheduling).
 */
export async function updateWorkOrder(
  tenantId: string,
  orderId: string,
  input: UpdateWorkOrderInput,
  metadata?: Record<string, unknown>,
): Promise<WorkOrder> {
  const sets: string[] = ['updated_at = NOW()'];
  const args: unknown[] = [];
  let paramIdx = 1;

  if (input.status !== undefined) {
    sets.push(`status = $${paramIdx++}`);
    args.push(input.status);
    if (input.status === 'en_progreso') {
      sets.push('started_at = NOW()');
    }
  }
  if (input.assigned_to !== undefined) {
    sets.push(`assigned_to = $${paramIdx++}`);
    args.push(input.assigned_to);
  }
  if (input.team !== undefined) {
    sets.push(`team = $${paramIdx++}`);
    args.push(input.team);
  }
  if (input.priority !== undefined) {
    sets.push(`priority = $${paramIdx++}`);
    args.push(input.priority);
  }
  if (input.scheduled_date !== undefined) {
    sets.push(`scheduled_date = $${paramIdx++}`);
    args.push(input.scheduled_date);
  }
  if (input.scheduled_time_start !== undefined) {
    sets.push(`scheduled_time_start = $${paramIdx++}`);
    args.push(input.scheduled_time_start);
  }
  if (input.scheduled_time_end !== undefined) {
    sets.push(`scheduled_time_end = $${paramIdx++}`);
    args.push(input.scheduled_time_end);
  }
  if (input.estimated_duration_minutes !== undefined) {
    sets.push(`estimated_duration_minutes = $${paramIdx++}`);
    args.push(input.estimated_duration_minutes);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${paramIdx++}`);
    args.push(input.notes);
  }

  const rows = await db.execute({
    sql: `
      UPDATE work_orders
      SET ${sets.join(', ')}
      WHERE id = $${paramIdx++} AND tenant_id = $${paramIdx++}
      RETURNING *
    `,
    args: [...args, orderId, tenantId],
  });

  const order = (rows as unknown as WorkOrder[])[0];
  if (!order) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  if (input.assigned_to) {
    await emitWorkOrderAssigned(tenantId, orderId, input.assigned_to, metadata);
  }

  return order;
}

/**
 * Complete a work order with field data (photos, GPS, signatures, materials).
 */
export async function completeWorkOrder(
  tenantId: string,
  orderId: string,
  input: CompleteWorkOrderInput,
  metadata?: Record<string, unknown>,
): Promise<WorkOrder> {
  const rows = await db.execute({
    sql: `
      UPDATE work_orders
      SET
        status = 'completada',
        completed_at = NOW(),
        updated_at = NOW(),
        result = $1,
        result_code = $2,
        field_notes = $3,
        photos = $4,
        gps_arrival = $5,
        gps_departure = $6,
        technician_signature_url = $7,
        customer_signature_url = $8,
        materials = $9
      WHERE id = $10 AND tenant_id = $11
        AND status IN ('asignada', 'en_ruta', 'en_progreso')
      RETURNING *
    `,
    args: [
      input.result,
      input.result_code ?? null,
      input.field_notes ?? null,
      JSON.stringify(input.photos),
      input.gps_arrival ? JSON.stringify(input.gps_arrival) : null,
      input.gps_departure ? JSON.stringify(input.gps_departure) : null,
      input.technician_signature_url ?? null,
      input.customer_signature_url ?? null,
      JSON.stringify(input.materials),
      orderId,
      tenantId,
    ],
  });

  const order = (rows as unknown as WorkOrder[])[0];
  if (!order) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  await emitWorkOrderCompleted(tenantId, orderId, input.result, metadata);

  return order;
}

/**
 * Get optimized route for a technician's daily work orders.
 */
export async function getTechnicianRoute(
  tenantId: string,
  userId: string,
): Promise<OptimizedRoute> {
  return getOptimizedRoute(tenantId, userId);
}
