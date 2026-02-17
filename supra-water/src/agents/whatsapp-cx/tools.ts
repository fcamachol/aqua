// =============================================================
// WhatsApp CX Agent — Tool Definitions
// SUPRA Water 2026 §5.2 (WhatsApp CX Tools)
// =============================================================

import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';

export const whatsappCXTools: AgentTool[] = [
  {
    name: 'lookup_account',
    description: 'Buscar cuenta por número de cuenta o teléfono del usuario.',
    parameters: [
      { name: 'account_number', type: 'string', description: 'Número de cuenta', required: false },
      { name: 'phone', type: 'string', description: 'Número de teléfono del usuario', required: false },
    ],
    async execute(params, context) {
      let rows;
      if (params.account_number) {
        rows = await db.execute({
          sql: `SELECT c.id, c.contract_number, c.status, p.first_name, p.last_name,
                       t.address_street, t.address_colony
                FROM contracts c
                JOIN persons p ON c.person_id = p.id
                JOIN tomas t ON c.toma_id = t.id
                WHERE c.contract_number = $1 AND c.tenant_id = $2
                LIMIT 1`,
          args: [params.account_number, context.tenantId],
        });
      } else if (params.phone) {
        rows = await db.execute({
          sql: `SELECT c.id, c.contract_number, c.status, p.first_name, p.last_name,
                       t.address_street, t.address_colony
                FROM contracts c
                JOIN persons p ON c.person_id = p.id
                JOIN tomas t ON c.toma_id = t.id
                WHERE p.phone = $1 AND c.tenant_id = $2
                LIMIT 3`,
          args: [params.phone, context.tenantId],
        });
      } else {
        return { success: false, error: 'Se requiere número de cuenta o teléfono' };
      }
      if (rows.length === 0) return { success: false, error: 'Cuenta no encontrada' };
      return { success: true, data: rows.length === 1 ? rows[0] : rows };
    },
  },

  {
    name: 'get_balance',
    description: 'Obtener saldo actual de una cuenta.',
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
    name: 'get_last_invoice_pdf',
    description: 'Obtener URL del PDF del último recibo generado.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT i.id, i.billing_period, i.total, i.pdf_url, i.status
              FROM invoices i
              WHERE i.contract_id = $1 AND i.tenant_id = $2 AND i.pdf_url IS NOT NULL
              ORDER BY i.created_at DESC
              LIMIT 1`,
        args: [params.contract_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'No se encontró recibo con PDF' };
      return { success: true, data: rows[0] };
    },
  },

  {
    name: 'get_consumption_chart',
    description: 'Obtener datos de consumo de los últimos 12 meses para generar gráfica.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT r.billing_period, r.consumption_m3, r.reading_date
              FROM meter_readings r
              JOIN tomas t ON r.toma_id = t.id
              JOIN contracts c ON c.toma_id = t.id
              WHERE c.id = $1 AND r.tenant_id = $2
                AND r.reading_date >= NOW() - INTERVAL '12 months'
              ORDER BY r.reading_date ASC`,
        args: [params.contract_id, context.tenantId],
      });
      return { success: true, data: { periods: rows } };
    },
  },

  {
    name: 'report_leak',
    description: 'Registrar un reporte de fuga de agua.',
    parameters: [
      { name: 'location', type: 'string', description: 'Ubicación de la fuga', required: true },
      { name: 'description', type: 'string', description: 'Descripción del problema', required: true },
      { name: 'severity', type: 'string', description: 'Gravedad: leve, moderada, grave', required: false, enum: ['leve', 'moderada', 'grave'] },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO work_orders (tenant_id, order_type, priority, description, location, status, created_at)
              VALUES ($1, 'leak_report', $2, $3, $4, 'open', NOW())
              RETURNING id`,
        args: [
          context.tenantId,
          params.severity === 'grave' ? 'urgent' : params.severity === 'moderada' ? 'high' : 'normal',
          params.description,
          params.location,
        ],
      });
      return { success: true, data: { folio: rows[0]?.id, message: 'Reporte registrado. Le notificaremos el avance.' } };
    },
  },

  {
    name: 'create_contact',
    description: 'Registrar un contacto, queja o solicitud.',
    parameters: [
      { name: 'contact_type', type: 'string', description: 'Tipo de contacto', required: true, enum: ['queja', 'solicitud', 'informacion', 'sugerencia'] },
      { name: 'subject', type: 'string', description: 'Asunto', required: true },
      { name: 'description', type: 'string', description: 'Descripción', required: true },
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO contacts (tenant_id, contact_type, subject, description, contract_id, channel, status, created_at)
              VALUES ($1, $2, $3, $4, $5, 'whatsapp', 'open', NOW())
              RETURNING id`,
        args: [context.tenantId, params.contact_type, params.subject, params.description, params.contract_id ?? null],
      });
      return { success: true, data: { folio: rows[0]?.id } };
    },
  },

  {
    name: 'get_office_hours',
    description: 'Obtener horarios y ubicaciones de oficinas de atención.',
    parameters: [],
    async execute(_params, context) {
      const rows = await db.execute({
        sql: `SELECT name, address, phone, schedule, services
              FROM offices
              WHERE tenant_id = $1 AND active = true
              ORDER BY name`,
        args: [context.tenantId],
      });
      return { success: true, data: rows };
    },
  },

  {
    name: 'get_requirements',
    description: 'Obtener lista de requisitos para un trámite específico.',
    parameters: [
      { name: 'procedure_type', type: 'string', description: 'Tipo de trámite', required: true, enum: ['alta', 'baja', 'cambio_titular', 'reconexion', 'convenio_pago', 'medidor_nuevo'] },
    ],
    async execute(params, context) {
      const requirements: Record<string, string[]> = {
        alta: [
          'Identificación oficial vigente (INE/IFE)',
          'Comprobante de domicilio reciente',
          'Escritura pública o contrato de arrendamiento',
          'Pago de derechos de conexión',
          'Croquis de ubicación',
        ],
        baja: [
          'Identificación oficial del titular',
          'Último recibo de agua pagado',
          'Solicitud por escrito',
          'Estar al corriente en pagos',
        ],
        cambio_titular: [
          'Identificación oficial del nuevo titular',
          'Identificación oficial del titular actual (o acta de defunción)',
          'Escritura pública o contrato a nombre del nuevo titular',
          'Estar al corriente en pagos',
        ],
        reconexion: [
          'Pago total del adeudo o convenio vigente',
          'Identificación oficial del titular',
          'Pago del derecho de reconexión',
        ],
        convenio_pago: [
          'Identificación oficial del titular',
          'Pago mínimo del 30% del adeudo total',
          'Firma del convenio en oficina',
        ],
        medidor_nuevo: [
          'Solicitud por escrito',
          'Identificación oficial del titular',
          'Pago del medidor y la instalación',
        ],
      };
      return {
        success: true,
        data: {
          procedure_type: params.procedure_type,
          requirements: requirements[params.procedure_type as string] ?? ['Consulte en oficina'],
        },
      };
    },
  },

  {
    name: 'send_payment_link',
    description: 'Generar y enviar enlace de pago al usuario.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'amount', type: 'number', description: 'Monto a pagar (si es parcial)', required: false },
    ],
    async execute(params, context) {
      // Generate a payment reference
      const ref = `PAY-${Date.now().toString(36).toUpperCase()}`;
      return {
        success: true,
        data: {
          payment_link: `https://pago.cea.gob.mx/${context.tenantId}/${params.contract_id}?ref=${ref}`,
          reference: ref,
          amount: params.amount ?? null,
          message: 'Enlace de pago generado',
        },
      };
    },
  },

  {
    name: 'escalate_to_human',
    description: 'Transferir la conversación a un agente humano en AGORA (Chatwoot).',
    parameters: [
      { name: 'reason', type: 'string', description: 'Motivo de la escalación', required: true },
      { name: 'context_summary', type: 'string', description: 'Resumen de la conversación', required: true },
    ],
    async execute(params, _context) {
      return {
        success: true,
        data: {
          action: 'escalate',
          reason: params.reason,
          summary: params.context_summary,
          message: 'Te voy a transferir con un agente. Por favor espera un momento.',
        },
      };
    },
  },
];
