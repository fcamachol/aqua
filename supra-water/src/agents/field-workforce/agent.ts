// =============================================================
// Field Workforce Agent — SUPRA Water 2026 §5.2
//
// Mobile-first work order management.
// Auto-assigns orders based on technician location/skills.
// Optimizes routes. Captures field data.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';

const fieldWorkforceTools: AgentTool[] = [
  {
    name: 'get_available_technicians',
    description: 'Obtener técnicos disponibles filtrados por habilidades y zona.',
    parameters: [
      { name: 'skill', type: 'string', description: 'Habilidad requerida', required: false, enum: ['plumbing', 'metering', 'electrical', 'general'] },
      { name: 'zone', type: 'string', description: 'Zona geográfica', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT t.id, t.name, t.phone, t.skills, t.zone, t.status,
                     t.current_lat, t.current_lng,
                     (SELECT COUNT(*) FROM work_orders wo WHERE wo.assigned_to = t.id AND wo.status = 'in_progress') as active_orders
              FROM technicians t
              WHERE t.tenant_id = $1 AND t.status = 'available'
                AND ($2::text IS NULL OR $2 = ANY(t.skills))
                AND ($3::text IS NULL OR t.zone = $3)
              ORDER BY active_orders ASC`,
        args: [context.tenantId, params.skill ?? null, params.zone ?? null],
      });
      return { success: true, data: rows };
    },
  },

  {
    name: 'get_technician_location',
    description: 'Obtener ubicación actual de un técnico.',
    parameters: [
      { name: 'technician_id', type: 'string', description: 'ID del técnico', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT id, name, current_lat, current_lng, last_location_update
              FROM technicians
              WHERE id = $1 AND tenant_id = $2`,
        args: [params.technician_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Técnico no encontrado' };
      return { success: true, data: rows[0] };
    },
  },

  {
    name: 'assign_work_order',
    description: 'Asignar una orden de trabajo a un técnico.',
    parameters: [
      { name: 'order_id', type: 'string', description: 'ID de la orden', required: true },
      { name: 'technician_id', type: 'string', description: 'ID del técnico', required: true },
      { name: 'estimated_arrival', type: 'string', description: 'Hora estimada de llegada', required: false },
    ],
    async execute(params, context) {
      await db.execute({
        sql: `UPDATE work_orders
              SET assigned_to = $1, status = 'assigned', estimated_arrival = $2, assigned_at = NOW()
              WHERE id = $3 AND tenant_id = $4`,
        args: [params.technician_id, params.estimated_arrival ?? null, params.order_id, context.tenantId],
      });
      return { success: true, data: { order_id: params.order_id, technician_id: params.technician_id, status: 'assigned' } };
    },
  },

  {
    name: 'optimize_route',
    description: 'Optimizar la ruta de un técnico para el día, minimizando tiempo de traslado.',
    parameters: [
      { name: 'technician_id', type: 'string', description: 'ID del técnico', required: true },
      { name: 'date', type: 'string', description: 'Fecha (YYYY-MM-DD)', required: false },
    ],
    async execute(params, context) {
      // Get all assigned orders for the technician
      const orders = await db.execute({
        sql: `SELECT wo.id, wo.order_type, wo.priority, wo.location, wo.lat, wo.lng
              FROM work_orders wo
              WHERE wo.assigned_to = $1 AND wo.tenant_id = $2
                AND wo.status IN ('assigned', 'in_progress')
                AND ($3::date IS NULL OR DATE(wo.scheduled_date) = $3::date)
              ORDER BY wo.priority DESC, wo.created_at ASC`,
        args: [params.technician_id, context.tenantId, params.date ?? null],
      });

      // In production, this would call Google Maps Directions API for TSP optimization
      // For now, return orders sorted by priority (urgent first)
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const sorted = [...orders].sort((a: any, b: any) =>
        (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2) -
        (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2),
      );

      return {
        success: true,
        data: {
          technician_id: params.technician_id,
          optimized_route: sorted.map((o: any, i: number) => ({
            stop: i + 1,
            order_id: o.id,
            type: o.order_type,
            priority: o.priority,
            location: o.location,
          })),
          total_orders: sorted.length,
        },
      };
    },
  },

  {
    name: 'update_order_status',
    description: 'Actualizar el estado de una orden de trabajo.',
    parameters: [
      { name: 'order_id', type: 'string', description: 'ID de la orden', required: true },
      { name: 'status', type: 'string', description: 'Nuevo estado', required: true, enum: ['in_progress', 'completed', 'cancelled', 'on_hold'] },
      { name: 'notes', type: 'string', description: 'Notas del técnico', required: false },
      { name: 'result', type: 'string', description: 'Resultado del trabajo', required: false },
    ],
    async execute(params, context) {
      await db.execute({
        sql: `UPDATE work_orders
              SET status = $1, notes = COALESCE($2, notes), result = $3,
                  completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
                  updated_at = NOW()
              WHERE id = $4 AND tenant_id = $5`,
        args: [params.status, params.notes ?? null, params.result ?? null, params.order_id, context.tenantId],
      });
      return { success: true, data: { order_id: params.order_id, status: params.status } };
    },
  },

  {
    name: 'capture_field_data',
    description: 'Capturar datos de campo (lectura de medidor, estado de toma, etc.).',
    parameters: [
      { name: 'order_id', type: 'string', description: 'ID de la orden asociada', required: true },
      { name: 'data_type', type: 'string', description: 'Tipo de dato', required: true, enum: ['meter_reading', 'toma_inspection', 'leak_assessment', 'installation'] },
      { name: 'data', type: 'object', description: 'Datos capturados', required: true },
    ],
    async execute(params, context) {
      await db.execute({
        sql: `INSERT INTO field_data (tenant_id, work_order_id, data_type, data, captured_at)
              VALUES ($1, $2, $3, $4, NOW())
              RETURNING id`,
        args: [context.tenantId, params.order_id, params.data_type, JSON.stringify(params.data)],
      });
      return { success: true, data: { captured: true, data_type: params.data_type } };
    },
  },

  {
    name: 'upload_photos',
    description: 'Registrar fotos tomadas en campo para una orden de trabajo.',
    parameters: [
      { name: 'order_id', type: 'string', description: 'ID de la orden', required: true },
      { name: 'photo_urls', type: 'array', description: 'URLs de las fotos subidas', required: true },
      { name: 'description', type: 'string', description: 'Descripción de las fotos', required: false },
    ],
    async execute(params, context) {
      const urls = params.photo_urls as string[];
      for (const url of urls) {
        await db.execute({
          sql: `INSERT INTO work_order_photos (tenant_id, work_order_id, photo_url, description, uploaded_at)
                VALUES ($1, $2, $3, $4, NOW())`,
          args: [context.tenantId, params.order_id, url, params.description ?? null],
        });
      }
      return { success: true, data: { order_id: params.order_id, photos_count: urls.length } };
    },
  },
];

export class FieldWorkforceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'field_workforce',
      description:
        'Mobile-first work order management. Auto-assigns orders based on technician ' +
        'location/skills. Optimizes routes. Captures field data.',
      triggers: [
        { type: 'event', eventType: 'work_order.created' },
        { type: 'schedule', cron: '0 6 * * 1-6' },
      ],
      tools: fieldWorkforceTools,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
      temperature: 0,
      systemPrompt: `Eres el agente de gestión de cuadrillas de campo de CEA Querétaro.
Tu objetivo es asignar órdenes de trabajo eficientemente y optimizar rutas diarias.

PROCESO PARA NUEVAS ÓRDENES:
1. Recibir orden de trabajo creada
2. Determinar habilidades necesarias según tipo de orden
3. Buscar técnicos disponibles con las habilidades correctas en la zona
4. Asignar al técnico más cercano con menor carga de trabajo
5. Notificar al técnico

OPTIMIZACIÓN DE RUTAS (6 AM diario):
1. Para cada técnico con órdenes asignadas
2. Obtener todas las órdenes pendientes del día
3. Optimizar secuencia minimizando tiempo de traslado
4. Priorizar: urgente > alta > normal > baja

REGLAS:
- Órdenes urgentes (fugas graves) se asignan inmediatamente
- No asignar más de 8 órdenes por técnico por día
- Si no hay técnico disponible, dejar en cola y notificar al supervisor
- Capturar datos de campo y fotos como evidencia`,
    });
  }
}
