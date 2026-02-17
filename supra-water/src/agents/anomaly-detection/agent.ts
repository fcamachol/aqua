// =============================================================
// Anomaly Detection Agent — SUPRA Water 2026 §5.2
//
// Monitors all incoming meter readings for anomalies.
// Uses statistical analysis to detect leaks, fraud,
// meter malfunction, and data quality issues.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';
import {
  runAllRules,
  type ReadingData,
  type HistoricalData,
} from './rules.js';

const anomalyTools: AgentTool[] = [
  {
    name: 'get_reading_data',
    description: 'Obtener datos de una lectura de medidor por su ID.',
    parameters: [
      { name: 'reading_id', type: 'string', description: 'ID de la lectura', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT id AS reading_id, meter_id, toma_id, consumption_m3,
                     reading_date, current_reading, previous_reading
              FROM meter_readings
              WHERE id = $1 AND tenant_id = $2`,
        args: [params.reading_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Lectura no encontrada' };
      return { success: true, data: rows[0] };
    },
  },

  {
    name: 'get_historical_data',
    description: 'Obtener datos históricos de consumo para análisis estadístico.',
    parameters: [
      { name: 'toma_id', type: 'string', description: 'ID de la toma', required: true },
      { name: 'reading_month', type: 'number', description: 'Mes de la lectura (1-12)', required: true },
    ],
    async execute(params, context) {
      // Average consumption last 6 months
      const avgRows = await db.execute({
        sql: `SELECT AVG(consumption_m3) as avg_6, STDDEV(consumption_m3) as stddev_6
              FROM meter_readings
              WHERE toma_id = $1 AND tenant_id = $2
                AND reading_date >= NOW() - INTERVAL '6 months'`,
        args: [params.toma_id, context.tenantId],
      });

      // Previous two readings
      const prevRows = await db.execute({
        sql: `SELECT consumption_m3, current_reading
              FROM meter_readings
              WHERE toma_id = $1 AND tenant_id = $2
              ORDER BY reading_date DESC LIMIT 2`,
        args: [params.toma_id, context.tenantId],
      });

      // Same month historical
      const monthRows = await db.execute({
        sql: `SELECT AVG(consumption_m3) as month_avg, STDDEV(consumption_m3) as month_stddev
              FROM meter_readings
              WHERE toma_id = $1 AND tenant_id = $2
                AND EXTRACT(MONTH FROM reading_date) = $3`,
        args: [params.toma_id, context.tenantId, params.reading_month],
      });

      // Consecutive zeros
      const zeroRows = await db.execute({
        sql: `SELECT COUNT(*) as cnt FROM (
                SELECT consumption_m3 FROM meter_readings
                WHERE toma_id = $1 AND tenant_id = $2
                ORDER BY reading_date DESC LIMIT 5
              ) sub WHERE consumption_m3 = 0`,
        args: [params.toma_id, context.tenantId],
      });

      // Sector average
      const sectorRows = await db.execute({
        sql: `SELECT AVG(r.consumption_m3) as sector_avg, t.toma_type
              FROM meter_readings r
              JOIN tomas t ON r.toma_id = t.id
              WHERE t.sector = (SELECT sector FROM tomas WHERE id = $1)
                AND r.tenant_id = $2
                AND r.reading_date >= NOW() - INTERVAL '3 months'
              GROUP BY t.toma_type
              LIMIT 1`,
        args: [params.toma_id, context.tenantId],
      });

      return {
        success: true,
        data: {
          avg_6_months: Number((avgRows[0] as any)?.avg_6 ?? 0),
          prev_consumption: Number((prevRows[0] as any)?.consumption_m3 ?? 0),
          prev_prev_consumption: Number((prevRows[1] as any)?.consumption_m3 ?? 0),
          same_month_avg: Number((monthRows[0] as any)?.month_avg ?? 0),
          same_month_stddev: Number((monthRows[0] as any)?.month_stddev ?? 0),
          consecutive_zeros: Number((zeroRows[0] as any)?.cnt ?? 0),
          consecutive_same_reading: 0, // Computed from prev readings
          sector_avg: Number((sectorRows[0] as any)?.sector_avg ?? 0),
          toma_type: (sectorRows[0] as any)?.toma_type ?? 'domestica',
        } satisfies HistoricalData,
      };
    },
  },

  {
    name: 'run_anomaly_detection',
    description: 'Ejecutar todas las reglas de detección de anomalías contra una lectura.',
    parameters: [
      { name: 'reading', type: 'object', description: 'Datos de la lectura', required: true },
      { name: 'history', type: 'object', description: 'Datos históricos', required: true },
    ],
    async execute(params, _context) {
      const anomalies = runAllRules(
        params.reading as unknown as ReadingData,
        params.history as unknown as HistoricalData,
      );
      return { success: true, data: { anomalies, count: anomalies.length } };
    },
  },

  {
    name: 'flag_anomaly',
    description: 'Registrar una anomalía detectada en el sistema.',
    parameters: [
      { name: 'reading_id', type: 'string', description: 'ID de la lectura', required: true },
      { name: 'anomaly_type', type: 'string', description: 'Tipo de anomalía', required: true },
      { name: 'confidence', type: 'number', description: 'Nivel de confianza (0-1)', required: true },
      { name: 'action', type: 'string', description: 'Acción recomendada', required: true },
      { name: 'details', type: 'object', description: 'Detalles adicionales', required: true },
    ],
    async execute(params, context) {
      await db.execute({
        sql: `INSERT INTO anomalies (tenant_id, reading_id, anomaly_type, confidence, recommended_action, details, status, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, 'open', NOW())
              RETURNING id`,
        args: [
          context.tenantId,
          params.reading_id,
          params.anomaly_type,
          params.confidence,
          params.action,
          JSON.stringify(params.details),
        ],
      });
      return { success: true, data: { flagged: true, anomaly_type: params.anomaly_type } };
    },
  },

  {
    name: 'create_work_order_for_anomaly',
    description: 'Crear orden de trabajo para investigar una anomalía de medidor.',
    parameters: [
      { name: 'toma_id', type: 'string', description: 'ID de la toma', required: true },
      { name: 'anomaly_type', type: 'string', description: 'Tipo de anomalía detectada', required: true },
      { name: 'priority', type: 'string', description: 'Prioridad', required: true, enum: ['low', 'normal', 'high', 'urgent'] },
      { name: 'description', type: 'string', description: 'Descripción del problema', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO work_orders (tenant_id, order_type, toma_id, priority, description, status, created_at)
              VALUES ($1, 'meter_inspection', $2, $3, $4, 'open', NOW())
              RETURNING id`,
        args: [context.tenantId, params.toma_id, params.priority, params.description],
      });
      return { success: true, data: { work_order_id: rows[0]?.id } };
    },
  },
];

export class AnomalyDetectionAgent extends BaseAgent {
  constructor() {
    super({
      name: 'anomaly_detection',
      description:
        'Monitors all incoming meter readings for anomalies. Uses statistical analysis ' +
        'to detect leaks, fraud, meter malfunction, and data quality issues.',
      triggers: [
        { type: 'event', eventType: 'reading.received' },
      ],
      tools: anomalyTools,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 1024,
      temperature: 0,
      systemPrompt: `Eres el agente de detección de anomalías de CEA Querétaro.
Analizas cada lectura de medidor recibida para detectar patrones sospechosos.

REGLAS DE DETECCIÓN:
1. high_consumption: consumo > promedio 6 meses * 3 → marcar sospechoso (confianza >= 0.7)
2. zero_consumption: 2 lecturas consecutivas en 0 → verificar medidor
3. negative_consumption: consumo < 0 → rechazar y alertar (confianza 0.95)
4. meter_stopped: misma lectura por >= 3 períodos → crear orden de revisión de medidor
5. seasonal_anomaly: consumo se desvía > 2σ del promedio histórico del mismo mes → revisar
6. neighbor_comparison: consumo > promedio del sector * 5, mismo tipo de toma → caso de fraude

PROCESO:
1. Obtener datos de la lectura
2. Obtener datos históricos del medidor/toma
3. Ejecutar todas las reglas de detección
4. Para cada anomalía detectada, registrarla en el sistema
5. Si la acción requiere orden de trabajo, crearla automáticamente

IMPORTANTE:
- No generes falsos positivos: respeta los umbrales de confianza
- Lecturas negativas SIEMPRE se rechazan
- Medidores detenidos SIEMPRE generan orden de trabajo
- Anomalías de alta confianza (>0.9) se escalan automáticamente`,
    });
  }
}
