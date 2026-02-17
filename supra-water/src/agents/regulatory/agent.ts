// =============================================================
// Regulatory Compliance Agent — SUPRA Water 2026 §5.2
//
// Auto-generates regulatory reports for CONAGUA, SEMARNAT,
// and state-level entities. Monitors compliance deadlines.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';

const regulatoryTools: AgentTool[] = [
  {
    name: 'generate_conagua_monthly_extraction',
    description: 'Generar reporte mensual de volúmenes de extracción de agua para CONAGUA.',
    parameters: [
      { name: 'year', type: 'number', description: 'Año', required: true },
      { name: 'month', type: 'number', description: 'Mes (1-12)', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT
                SUM(r.consumption_m3) as total_consumption_m3,
                COUNT(DISTINCT r.toma_id) as active_connections,
                AVG(r.consumption_m3) as avg_consumption_per_toma,
                t.toma_type,
                COUNT(r.id) as reading_count
              FROM meter_readings r
              JOIN tomas t ON r.toma_id = t.id
              WHERE r.tenant_id = $1
                AND EXTRACT(YEAR FROM r.reading_date) = $2
                AND EXTRACT(MONTH FROM r.reading_date) = $3
              GROUP BY t.toma_type`,
        args: [context.tenantId, params.year, params.month],
      });

      const total = rows.reduce((sum: number, r: any) => sum + Number(r.total_consumption_m3 ?? 0), 0);

      return {
        success: true,
        data: {
          report_type: 'conagua_monthly_extraction',
          period: `${params.year}-${String(params.month).padStart(2, '0')}`,
          total_extraction_m3: total,
          breakdown_by_type: rows,
        },
      };
    },
  },

  {
    name: 'generate_conagua_quarterly_efficiency',
    description: 'Generar reporte trimestral de eficiencia para CONAGUA.',
    parameters: [
      { name: 'year', type: 'number', description: 'Año', required: true },
      { name: 'quarter', type: 'number', description: 'Trimestre (1-4)', required: true },
    ],
    async execute(params, context) {
      const startMonth = ((params.quarter as number) - 1) * 3 + 1;
      const endMonth = startMonth + 2;

      const rows = await db.execute({
        sql: `SELECT
                SUM(r.consumption_m3) as billed_volume,
                (SELECT COUNT(*) FROM tomas t WHERE t.tenant_id = $1 AND t.status = 'active') as total_connections,
                (SELECT COUNT(*) FROM tomas t
                 JOIN meters m ON m.toma_id = t.id
                 WHERE t.tenant_id = $1 AND t.status = 'active') as metered_connections,
                (SELECT COUNT(*) FROM anomalies a
                 WHERE a.tenant_id = $1
                   AND a.anomaly_type = 'high_consumption'
                   AND EXTRACT(YEAR FROM a.created_at) = $2
                   AND EXTRACT(MONTH FROM a.created_at) BETWEEN $3 AND $4) as leak_detections
              FROM meter_readings r
              WHERE r.tenant_id = $1
                AND EXTRACT(YEAR FROM r.reading_date) = $2
                AND EXTRACT(MONTH FROM r.reading_date) BETWEEN $3 AND $4`,
        args: [context.tenantId, params.year, startMonth, endMonth],
      });

      const data = rows[0] as any;
      const meteringCoverage = data?.total_connections > 0
        ? Number(data.metered_connections) / Number(data.total_connections)
        : 0;

      return {
        success: true,
        data: {
          report_type: 'conagua_quarterly_efficiency',
          period: `${params.year}-Q${params.quarter}`,
          billed_volume_m3: Number(data?.billed_volume ?? 0),
          total_connections: Number(data?.total_connections ?? 0),
          metered_connections: Number(data?.metered_connections ?? 0),
          metering_coverage: Math.round(meteringCoverage * 1000) / 10,
          leak_detections: Number(data?.leak_detections ?? 0),
        },
      };
    },
  },

  {
    name: 'generate_semarnat_discharge',
    description: 'Generar reporte de descargas de aguas residuales para SEMARNAT.',
    parameters: [
      { name: 'year', type: 'number', description: 'Año', required: true },
      { name: 'month', type: 'number', description: 'Mes (1-12)', required: true },
    ],
    async execute(params, context) {
      // Wastewater is typically estimated as 80% of consumption
      const rows = await db.execute({
        sql: `SELECT SUM(r.consumption_m3) * 0.8 as estimated_discharge_m3,
                     COUNT(DISTINCT r.toma_id) as connected_tomas
              FROM meter_readings r
              WHERE r.tenant_id = $1
                AND EXTRACT(YEAR FROM r.reading_date) = $2
                AND EXTRACT(MONTH FROM r.reading_date) = $3`,
        args: [context.tenantId, params.year, params.month],
      });

      return {
        success: true,
        data: {
          report_type: 'semarnat_discharge',
          period: `${params.year}-${String(params.month).padStart(2, '0')}`,
          estimated_discharge_m3: Number((rows[0] as any)?.estimated_discharge_m3 ?? 0),
          connected_tomas: Number((rows[0] as any)?.connected_tomas ?? 0),
          discharge_factor: 0.8,
        },
      };
    },
  },

  {
    name: 'generate_state_service_indicators',
    description: 'Generar indicadores de servicio para el gobierno estatal.',
    parameters: [
      { name: 'year', type: 'number', description: 'Año', required: true },
      { name: 'month', type: 'number', description: 'Mes (1-12)', required: true },
    ],
    async execute(params, context) {
      const indicators = await db.execute({
        sql: `SELECT
                (SELECT COUNT(*) FROM contracts c WHERE c.tenant_id = $1 AND c.status = 'active') as active_contracts,
                (SELECT COUNT(*) FROM work_orders wo WHERE wo.tenant_id = $1
                  AND EXTRACT(YEAR FROM wo.created_at) = $2
                  AND EXTRACT(MONTH FROM wo.created_at) = $3) as work_orders_created,
                (SELECT COUNT(*) FROM work_orders wo WHERE wo.tenant_id = $1
                  AND wo.status = 'completed'
                  AND EXTRACT(YEAR FROM wo.completed_at) = $2
                  AND EXTRACT(MONTH FROM wo.completed_at) = $3) as work_orders_completed,
                (SELECT COUNT(*) FROM contacts ct WHERE ct.tenant_id = $1
                  AND EXTRACT(YEAR FROM ct.created_at) = $2
                  AND EXTRACT(MONTH FROM ct.created_at) = $3) as contacts_received,
                (SELECT COUNT(*) FROM contacts ct WHERE ct.tenant_id = $1
                  AND ct.status = 'resolved'
                  AND EXTRACT(YEAR FROM ct.created_at) = $2
                  AND EXTRACT(MONTH FROM ct.created_at) = $3) as contacts_resolved,
                (SELECT AVG(EXTRACT(HOUR FROM (ct.resolved_at - ct.created_at)))
                 FROM contacts ct WHERE ct.tenant_id = $1
                  AND ct.status = 'resolved'
                  AND EXTRACT(YEAR FROM ct.created_at) = $2
                  AND EXTRACT(MONTH FROM ct.created_at) = $3) as avg_resolution_hours`,
        args: [context.tenantId, params.year, params.month],
      });

      return {
        success: true,
        data: {
          report_type: 'state_service_indicators',
          period: `${params.year}-${String(params.month).padStart(2, '0')}`,
          ...indicators[0],
        },
      };
    },
  },

  {
    name: 'generate_financial_summary',
    description: 'Generar resumen financiero: ingresos, cobranza, cartera vencida.',
    parameters: [
      { name: 'year', type: 'number', description: 'Año', required: true },
      { name: 'month', type: 'number', description: 'Mes (1-12)', required: true },
    ],
    async execute(params, context) {
      const financial = await db.execute({
        sql: `SELECT
                (SELECT COALESCE(SUM(total), 0) FROM invoices i WHERE i.tenant_id = $1
                  AND EXTRACT(YEAR FROM i.created_at) = $2
                  AND EXTRACT(MONTH FROM i.created_at) = $3) as invoiced_amount,
                (SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.tenant_id = $1
                  AND EXTRACT(YEAR FROM p.payment_date) = $2
                  AND EXTRACT(MONTH FROM p.payment_date) = $3
                  AND p.status = 'applied') as collected_amount,
                (SELECT COALESCE(SUM(total), 0) FROM invoices i WHERE i.tenant_id = $1
                  AND i.status = 'past_due') as total_past_due,
                (SELECT COUNT(*) FROM invoices i WHERE i.tenant_id = $1
                  AND i.status = 'past_due') as past_due_count`,
        args: [context.tenantId, params.year, params.month],
      });

      const data = financial[0] as any;
      const invoiced = Number(data?.invoiced_amount ?? 0);
      const collected = Number(data?.collected_amount ?? 0);

      return {
        success: true,
        data: {
          report_type: 'financial_summary',
          period: `${params.year}-${String(params.month).padStart(2, '0')}`,
          invoiced_amount: invoiced,
          collected_amount: collected,
          collection_rate: invoiced > 0 ? Math.round((collected / invoiced) * 1000) / 10 : 0,
          total_past_due: Number(data?.total_past_due ?? 0),
          past_due_invoice_count: Number(data?.past_due_count ?? 0),
        },
      };
    },
  },

  {
    name: 'save_report',
    description: 'Guardar un reporte generado en el sistema.',
    parameters: [
      { name: 'report_type', type: 'string', description: 'Tipo de reporte', required: true },
      { name: 'period', type: 'string', description: 'Período del reporte', required: true },
      { name: 'data', type: 'object', description: 'Datos del reporte', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO regulatory_reports (tenant_id, report_type, period, data, status, generated_at)
              VALUES ($1, $2, $3, $4, 'generated', NOW())
              ON CONFLICT (tenant_id, report_type, period)
                DO UPDATE SET data = $4, status = 'generated', generated_at = NOW()
              RETURNING id`,
        args: [context.tenantId, params.report_type, params.period, JSON.stringify(params.data)],
      });
      return { success: true, data: { report_id: rows[0]?.id, report_type: params.report_type } };
    },
  },
];

export class RegulatoryAgent extends BaseAgent {
  constructor() {
    super({
      name: 'regulatory_compliance',
      description:
        'Auto-generates regulatory reports for CONAGUA, SEMARNAT, and state-level entities. ' +
        'Monitors compliance deadlines.',
      triggers: [
        { type: 'schedule', cron: '0 7 1 * *' },
      ],
      tools: regulatoryTools,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 2048,
      temperature: 0,
      systemPrompt: `Eres el agente de cumplimiento regulatorio de CEA Querétaro.
Tu trabajo es generar automáticamente los reportes regulatorios requeridos.

REPORTES MENSUALES (1ro de cada mes a las 7 AM):
1. conagua_monthly_extraction: Volúmenes mensuales de extracción para CONAGUA
2. semarnat_discharge: Reporte de descargas de aguas residuales para SEMARNAT
3. state_service_indicators: Indicadores de servicio para el gobierno estatal
4. financial_summary: Resumen financiero (ingresos, cobranza, cartera vencida)

REPORTES TRIMESTRALES (1ro del mes después de cada trimestre):
5. conagua_quarterly_efficiency: Métricas trimestrales de eficiencia para CONAGUA

PROCESO:
1. Determinar el período a reportar (mes anterior)
2. Generar cada reporte ejecutando la herramienta correspondiente
3. Guardar cada reporte en el sistema
4. Si es inicio de trimestre, generar también el reporte trimestral

IMPORTANTE:
- Los datos deben ser exactos — estos reportes se presentan a autoridades
- Si faltan datos, reportar el faltante en lugar de estimar
- Guardar cada reporte para auditoría
- Los reportes deben generarse para el mes ANTERIOR al actual`,
    });
  }
}
