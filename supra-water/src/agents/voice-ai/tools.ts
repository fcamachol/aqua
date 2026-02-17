// =============================================================
// Voice AI Agent — Tool Definitions
// SUPRA Water 2026 §5.2 (Voice AI Tools)
// =============================================================

import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';

export const voiceAITools: AgentTool[] = [
  {
    name: 'lookup_account_by_number',
    description: 'Buscar cuenta por número de cuenta. Retorna datos básicos del contrato.',
    parameters: [
      { name: 'account_number', type: 'string', description: 'Número de cuenta del usuario', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT c.id, c.contract_number, c.status, p.first_name, p.last_name,
                     t.address_street, t.address_colony, t.address_city
              FROM contracts c
              JOIN persons p ON c.person_id = p.id
              JOIN tomas t ON c.toma_id = t.id
              WHERE c.contract_number = $1 AND c.tenant_id = $2
              LIMIT 1`,
        args: [params.account_number, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Cuenta no encontrada' };
      return { success: true, data: rows[0] };
    },
  },

  {
    name: 'lookup_account_by_address',
    description: 'Buscar cuenta por dirección de la toma. Retorna posibles coincidencias.',
    parameters: [
      { name: 'street', type: 'string', description: 'Calle o dirección parcial', required: true },
      { name: 'colony', type: 'string', description: 'Colonia', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT c.contract_number, p.first_name, p.last_name,
                     t.address_street, t.address_colony, t.address_city
              FROM contracts c
              JOIN persons p ON c.person_id = p.id
              JOIN tomas t ON c.toma_id = t.id
              WHERE t.address_street ILIKE $1
                AND ($2::text IS NULL OR t.address_colony ILIKE $2)
                AND c.tenant_id = $3
              LIMIT 5`,
        args: [`%${params.street}%`, params.colony ? `%${params.colony}%` : null, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'No se encontraron coincidencias' };
      return { success: true, data: rows };
    },
  },

  {
    name: 'get_account_balance',
    description: 'Obtener el saldo actual y adeudo total de una cuenta.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT i.id, i.billing_period, i.total, i.status, i.due_date
              FROM invoices i
              WHERE i.contract_id = $1 AND i.tenant_id = $2 AND i.status IN ('pending', 'past_due')
              ORDER BY i.due_date ASC`,
        args: [params.contract_id, context.tenantId],
      });
      const total = rows.reduce((sum: number, r: any) => sum + Number(r.total), 0);
      return { success: true, data: { unpaid_invoices: rows, total_debt: total } };
    },
  },

  {
    name: 'get_payment_history',
    description: 'Obtener historial de pagos de los últimos 12 meses.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT p.id, p.amount, p.payment_date, p.payment_method, p.status
              FROM payments p
              JOIN invoices i ON p.invoice_id = i.id
              WHERE i.contract_id = $1 AND p.tenant_id = $2
                AND p.payment_date >= NOW() - INTERVAL '12 months'
              ORDER BY p.payment_date DESC`,
        args: [params.contract_id, context.tenantId],
      });
      return { success: true, data: rows };
    },
  },

  {
    name: 'get_consumption_history',
    description: 'Obtener historial de consumos (m3) de los últimos 12 meses.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT r.id, r.reading_date, r.current_reading, r.previous_reading,
                     r.consumption_m3, r.billing_period
              FROM meter_readings r
              JOIN tomas t ON r.toma_id = t.id
              JOIN contracts c ON c.toma_id = t.id
              WHERE c.id = $1 AND r.tenant_id = $2
                AND r.reading_date >= NOW() - INTERVAL '12 months'
              ORDER BY r.reading_date DESC`,
        args: [params.contract_id, context.tenantId],
      });
      return { success: true, data: rows };
    },
  },

  {
    name: 'report_leak',
    description: 'Registrar un reporte de fuga de agua con ubicación.',
    parameters: [
      { name: 'location', type: 'string', description: 'Ubicación de la fuga (dirección o referencia)', required: true },
      { name: 'description', type: 'string', description: 'Descripción del problema', required: true },
      { name: 'severity', type: 'string', description: 'Gravedad: leve, moderada, grave', required: false, enum: ['leve', 'moderada', 'grave'] },
      { name: 'reporter_name', type: 'string', description: 'Nombre del reportante', required: false },
      { name: 'reporter_phone', type: 'string', description: 'Teléfono del reportante', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO work_orders (tenant_id, order_type, priority, description, location, status, reported_by, reported_phone, created_at)
              VALUES ($1, 'leak_report', $2, $3, $4, 'open', $5, $6, NOW())
              RETURNING id, order_type, priority, status`,
        args: [
          context.tenantId,
          params.severity === 'grave' ? 'urgent' : params.severity === 'moderada' ? 'high' : 'normal',
          params.description,
          params.location,
          params.reporter_name ?? null,
          params.reporter_phone ?? null,
        ],
      });
      return { success: true, data: { folio: rows[0]?.id, message: 'Reporte registrado exitosamente' } };
    },
  },

  {
    name: 'create_contact',
    description: 'Registrar una queja, solicitud o contacto general.',
    parameters: [
      { name: 'contact_type', type: 'string', description: 'Tipo: queja, solicitud, informacion, sugerencia', required: true, enum: ['queja', 'solicitud', 'informacion', 'sugerencia'] },
      { name: 'subject', type: 'string', description: 'Asunto del contacto', required: true },
      { name: 'description', type: 'string', description: 'Descripción detallada', required: true },
      { name: 'contract_id', type: 'string', description: 'ID del contrato asociado', required: false },
      { name: 'reporter_name', type: 'string', description: 'Nombre del contacto', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO contacts (tenant_id, contact_type, subject, description, contract_id, channel, status, created_at)
              VALUES ($1, $2, $3, $4, $5, 'voice', 'open', NOW())
              RETURNING id, contact_type, status`,
        args: [context.tenantId, params.contact_type, params.subject, params.description, params.contract_id ?? null],
      });
      return { success: true, data: { folio: rows[0]?.id, message: 'Contacto registrado' } };
    },
  },

  {
    name: 'create_work_order',
    description: 'Crear una orden de servicio (reparación, inspección, reconexión, etc.).',
    parameters: [
      { name: 'order_type', type: 'string', description: 'Tipo de orden', required: true, enum: ['repair', 'inspection', 'reconnection', 'disconnection', 'meter_change', 'new_connection'] },
      { name: 'description', type: 'string', description: 'Descripción del trabajo', required: true },
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: false },
      { name: 'priority', type: 'string', description: 'Prioridad', required: false, enum: ['low', 'normal', 'high', 'urgent'] },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO work_orders (tenant_id, order_type, description, contract_id, priority, status, created_at)
              VALUES ($1, $2, $3, $4, $5, 'open', NOW())
              RETURNING id, order_type, priority, status`,
        args: [context.tenantId, params.order_type, params.description, params.contract_id ?? null, params.priority ?? 'normal'],
      });
      return { success: true, data: { folio: rows[0]?.id, message: 'Orden de servicio creada' } };
    },
  },

  {
    name: 'transfer_to_human',
    description: 'Transferir la llamada a un agente humano cuando no se puede resolver.',
    parameters: [
      { name: 'reason', type: 'string', description: 'Motivo de la transferencia', required: true },
      { name: 'department', type: 'string', description: 'Departamento destino', required: false, enum: ['atencion_cliente', 'cobranza', 'tecnico', 'juridico'] },
      { name: 'context_summary', type: 'string', description: 'Resumen de la conversación para el agente humano', required: true },
    ],
    async execute(params, _context) {
      return {
        success: true,
        data: {
          action: 'transfer',
          department: params.department ?? 'atencion_cliente',
          reason: params.reason,
          summary: params.context_summary,
          message: 'Transfiriendo a un agente humano...',
        },
      };
    },
  },

  {
    name: 'get_tariff_info',
    description: 'Obtener información sobre tarifas vigentes por categoría.',
    parameters: [
      { name: 'category', type: 'string', description: 'Categoría de tarifa', required: false, enum: ['domestica', 'comercial', 'industrial', 'gobierno'] },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT id, category, billing_period, blocks, additional_concepts, social_discount_pct
              FROM tariff_schedules
              WHERE tenant_id = $1 AND ($2::text IS NULL OR category = $2) AND active = true
              ORDER BY category`,
        args: [context.tenantId, params.category ?? null],
      });
      return { success: true, data: rows };
    },
  },
];
