// =============================================================
// Fraud Detection Agent — SUPRA Water 2026 §5.2
//
// ML-powered fraud detection. Analyzes consumption patterns,
// meter data, and geospatial clusters to identify illegal
// connections and meter tampering.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';

const fraudDetectionTools: AgentTool[] = [
  {
    name: 'consumption_pattern_analysis',
    description: 'Analizar patrones de consumo para detectar caídas súbitas o reducciones imposibles.',
    parameters: [
      { name: 'toma_id', type: 'string', description: 'ID de la toma', required: true },
      { name: 'months', type: 'number', description: 'Meses a analizar', required: false },
    ],
    async execute(params, context) {
      const months = (params.months as number) ?? 24;
      const rows = await db.execute({
        sql: `SELECT r.billing_period, r.consumption_m3, r.reading_date,
                     LAG(r.consumption_m3) OVER (ORDER BY r.reading_date) as prev_consumption,
                     r.consumption_m3 - LAG(r.consumption_m3) OVER (ORDER BY r.reading_date) as delta
              FROM meter_readings r
              WHERE r.toma_id = $1 AND r.tenant_id = $2
                AND r.reading_date >= NOW() - ($3 || ' months')::interval
              ORDER BY r.reading_date`,
        args: [params.toma_id, context.tenantId, months],
      });

      // Detect sudden drops (>70% reduction)
      const suddenDrops = rows.filter((r: any) => {
        const prev = Number(r.prev_consumption);
        const curr = Number(r.consumption_m3);
        return prev > 0 && curr < prev * 0.3;
      });

      return {
        success: true,
        data: {
          readings: rows,
          sudden_drops: suddenDrops,
          suspicious: suddenDrops.length > 0,
          analysis: 'consumption_pattern',
        },
      };
    },
  },

  {
    name: 'meter_data_integrity',
    description: 'Verificar integridad de datos del medidor: lecturas invertidas, saltos, reinicios.',
    parameters: [
      { name: 'meter_id', type: 'string', description: 'ID del medidor', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT r.reading_date, r.current_reading, r.previous_reading, r.consumption_m3,
                     LAG(r.current_reading) OVER (ORDER BY r.reading_date) as expected_prev
              FROM meter_readings r
              WHERE r.meter_id = $1 AND r.tenant_id = $2
              ORDER BY r.reading_date`,
        args: [params.meter_id, context.tenantId],
      });

      const issues: any[] = [];
      for (const row of rows as any[]) {
        // Reversed meter (current < previous)
        if (row.current_reading < row.previous_reading) {
          issues.push({ type: 'reversed_reading', date: row.reading_date, details: row });
        }
        // Reading jump (current_reading doesn't match expected previous)
        if (row.expected_prev !== null && row.previous_reading !== row.expected_prev) {
          issues.push({ type: 'reading_gap', date: row.reading_date, details: row });
        }
      }

      return {
        success: true,
        data: { issues, suspicious: issues.length > 0, analysis: 'meter_integrity' },
      };
    },
  },

  {
    name: 'geospatial_clustering',
    description: 'Detectar clusters geográficos de anomalías que podrían indicar fraude organizado.',
    parameters: [
      { name: 'sector', type: 'string', description: 'Sector a analizar', required: false },
      { name: 'radius_km', type: 'number', description: 'Radio de búsqueda en km', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT t.id as toma_id, t.address_street, t.address_colony, t.lat, t.lng,
                     COUNT(a.id) as anomaly_count,
                     ARRAY_AGG(DISTINCT a.anomaly_type) as anomaly_types
              FROM anomalies a
              JOIN meter_readings r ON a.reading_id = r.id
              JOIN tomas t ON r.toma_id = t.id
              WHERE a.tenant_id = $1 AND a.status = 'open'
                AND a.created_at >= NOW() - INTERVAL '6 months'
                AND ($2::text IS NULL OR t.sector = $2)
              GROUP BY t.id, t.address_street, t.address_colony, t.lat, t.lng
              HAVING COUNT(a.id) >= 2
              ORDER BY anomaly_count DESC`,
        args: [context.tenantId, params.sector ?? null],
      });

      return {
        success: true,
        data: {
          clusters: rows,
          total_suspicious_tomas: rows.length,
          analysis: 'geospatial_clustering',
        },
      };
    },
  },

  {
    name: 'billing_gap_analysis',
    description: 'Detectar períodos sin facturación que podrían indicar manipulación.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato (null para todos)', required: false },
    ],
    async execute(params, context) {
      const query = params.contract_id
        ? `SELECT c.id as contract_id, c.contract_number,
                  ARRAY_AGG(i.billing_period ORDER BY i.billing_period) as billed_periods,
                  c.created_at as contract_start
           FROM contracts c
           LEFT JOIN invoices i ON i.contract_id = c.id
           WHERE c.id = $2 AND c.tenant_id = $1 AND c.status = 'active'
           GROUP BY c.id, c.contract_number, c.created_at`
        : `SELECT c.id as contract_id, c.contract_number,
                  COUNT(i.id) as invoice_count,
                  EXTRACT(MONTH FROM AGE(NOW(), c.created_at)) as months_active,
                  COUNT(i.id)::float / GREATEST(EXTRACT(MONTH FROM AGE(NOW(), c.created_at)), 1) as billing_ratio
           FROM contracts c
           LEFT JOIN invoices i ON i.contract_id = c.id
           WHERE c.tenant_id = $1 AND c.status = 'active'
           GROUP BY c.id, c.contract_number, c.created_at
           HAVING COUNT(i.id)::float / GREATEST(EXTRACT(MONTH FROM AGE(NOW(), c.created_at)), 1) < 0.5
           ORDER BY billing_ratio ASC
           LIMIT 50`;

      const rows = await db.execute({
        sql: query,
        args: params.contract_id ? [context.tenantId, params.contract_id] : [context.tenantId],
      });

      return {
        success: true,
        data: { gaps: rows, analysis: 'billing_gap' },
      };
    },
  },

  {
    name: 'new_connection_audit',
    description: 'Auditar conexiones recientes sin medidor o sin lecturas.',
    parameters: [
      { name: 'months_back', type: 'number', description: 'Meses hacia atrás a revisar', required: false },
    ],
    async execute(params, context) {
      const months = (params.months_back as number) ?? 6;
      const rows = await db.execute({
        sql: `SELECT t.id as toma_id, c.contract_number, t.address_street, t.address_colony,
                     t.created_at, m.id as meter_id, m.serial_number,
                     (SELECT COUNT(*) FROM meter_readings r WHERE r.toma_id = t.id) as reading_count
              FROM tomas t
              JOIN contracts c ON c.toma_id = t.id
              LEFT JOIN meters m ON m.toma_id = t.id
              WHERE t.tenant_id = $1
                AND t.created_at >= NOW() - ($2 || ' months')::interval
                AND (m.id IS NULL OR (SELECT COUNT(*) FROM meter_readings r WHERE r.toma_id = t.id) = 0)
              ORDER BY t.created_at DESC`,
        args: [context.tenantId, months],
      });

      return {
        success: true,
        data: {
          suspicious_connections: rows,
          count: rows.length,
          analysis: 'new_connection_audit',
        },
      };
    },
  },

  {
    name: 'open_fraud_case',
    description: 'Abrir un caso de fraude con la evidencia recopilada.',
    parameters: [
      { name: 'toma_id', type: 'string', description: 'ID de la toma', required: true },
      { name: 'fraud_type', type: 'string', description: 'Tipo de fraude', required: true, enum: ['meter_tampering', 'illegal_connection', 'billing_manipulation', 'meter_bypass', 'other'] },
      { name: 'confidence', type: 'number', description: 'Nivel de confianza (0-1)', required: true },
      { name: 'evidence', type: 'object', description: 'Evidencia recopilada', required: true },
      { name: 'recommended_action', type: 'string', description: 'Acción recomendada', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO fraud_cases (tenant_id, toma_id, fraud_type, confidence, evidence, recommended_action, status, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, 'open', NOW())
              RETURNING id`,
        args: [
          context.tenantId,
          params.toma_id,
          params.fraud_type,
          params.confidence,
          JSON.stringify(params.evidence),
          params.recommended_action,
        ],
      });
      return { success: true, data: { case_id: rows[0]?.id, fraud_type: params.fraud_type } };
    },
  },
];

export class FraudDetectionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'fraud_detection',
      description:
        'ML-powered fraud detection. Analyzes consumption patterns, meter data, ' +
        'and geospatial clusters to identify illegal connections and meter tampering.',
      triggers: [
        { type: 'event', eventType: 'anomaly.high_confidence' },
        { type: 'schedule', cron: '0 3 * * 0' },
      ],
      tools: fraudDetectionTools,
      model: 'claude-sonnet-4-20250514',
      maxTokens: 4096,
      temperature: 0.1,
      systemPrompt: `Eres el agente de detección de fraude de CEA Querétaro.
Tu objetivo es identificar conexiones ilegales, manipulación de medidores y otros fraudes al servicio de agua.

MÉTODOS DE ANÁLISIS:
1. consumption_pattern_analysis: Detectar caídas súbitas (>70% reducción) o reducciones imposibles
2. meter_data_integrity: Verificar lecturas invertidas, saltos de numeración, reinicios de medidor
3. geospatial_clustering: Identificar clusters de anomalías en la misma zona (fraude organizado)
4. billing_gap_analysis: Detectar períodos sin facturación sospechosos
5. new_connection_audit: Auditar tomas recientes sin medidor o sin lecturas

PROCESO PARA EVENTO anomaly.high_confidence:
1. Analizar el patrón de consumo de la toma
2. Verificar integridad del medidor
3. Buscar clusters cercanos
4. Si hay evidencia suficiente (confianza > 0.8), abrir caso de fraude
5. Crear orden de inspección de campo

SCAN SEMANAL (Domingo 3 AM):
1. Ejecutar billing_gap_analysis global
2. Auditar nuevas conexiones de los últimos 6 meses
3. Analizar clusters geográficos
4. Generar reporte de casos sospechosos

IMPORTANTE:
- Documentar toda la evidencia antes de abrir un caso
- No acusar sin evidencia múltiple convergente
- Priorizar fraudes de alto impacto (mayor consumo estimado no facturado)`,
    });
  }
}
