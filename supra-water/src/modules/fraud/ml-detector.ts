import { db } from '../../config/database.js';

// =============================================================
// ML Fraud Detector — Stub
// Analyzes consumption patterns, meter data integrity,
// geospatial clustering, and billing gaps to flag potential fraud.
// =============================================================

export interface FraudSignal {
  signal_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data: Record<string, unknown>;
}

export interface FraudAnalysisResult {
  toma_id: string;
  overall_risk_score: number;     // 0-1
  signals: FraudSignal[];
  recommended_action: string;
  analysis_timestamp: string;
}

/**
 * Analyze a toma for potential fraud indicators.
 * In production this would call a trained ML model.
 * Currently uses rule-based heuristics as a stub.
 */
export async function analyzeToma(
  tenantId: string,
  tomaId: string,
): Promise<FraudAnalysisResult> {
  const signals: FraudSignal[] = [];

  // 1. Consumption pattern analysis
  const consumptionSignals = await analyzeConsumptionPattern(tenantId, tomaId);
  signals.push(...consumptionSignals);

  // 2. Meter data integrity
  const meterSignals = await analyzeMeterIntegrity(tenantId, tomaId);
  signals.push(...meterSignals);

  // 3. Billing gaps
  const billingSignals = await analyzeBillingGaps(tenantId, tomaId);
  signals.push(...billingSignals);

  // 4. Geospatial clustering (nearby fraud cases)
  const geoSignals = await analyzeGeospatialClustering(tenantId, tomaId);
  signals.push(...geoSignals);

  // Calculate overall risk score
  const overallRisk = calculateOverallRisk(signals);

  // Determine recommended action
  let recommendedAction = 'No action required';
  if (overallRisk >= 0.8) {
    recommendedAction = 'Programar inspeccion de campo urgente';
  } else if (overallRisk >= 0.5) {
    recommendedAction = 'Programar inspeccion de campo';
  } else if (overallRisk >= 0.3) {
    recommendedAction = 'Monitorear en proxima lectura';
  }

  return {
    toma_id: tomaId,
    overall_risk_score: overallRisk,
    signals,
    recommended_action: recommendedAction,
    analysis_timestamp: new Date().toISOString(),
  };
}

/**
 * Detect sudden consumption drops that might indicate meter tampering.
 */
async function analyzeConsumptionPattern(
  tenantId: string,
  tomaId: string,
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = [];

  const rows = await db.execute({
    sql: `
      SELECT
        consumption_m3,
        reading_date,
        LAG(consumption_m3) OVER (ORDER BY reading_date) AS prev_consumption
      FROM readings
      WHERE tenant_id = $1 AND toma_id = $2
      ORDER BY reading_date DESC
      LIMIT 12
    `,
    args: [tenantId, tomaId],
  });

  const readings = rows as unknown as Array<{
    consumption_m3: number;
    reading_date: string;
    prev_consumption: number | null;
  }>;

  if (readings.length < 3) return signals;

  // Sudden drop: consumption dropped by more than 70% from average
  const avgConsumption =
    readings.reduce((s, r) => s + Number(r.consumption_m3), 0) / readings.length;
  const latest = Number(readings[0].consumption_m3);

  if (avgConsumption > 0 && latest < avgConsumption * 0.3) {
    signals.push({
      signal_type: 'consumption_drop',
      description: `Consumo actual (${latest} m3) es ${Math.round((1 - latest / avgConsumption) * 100)}% menor al promedio (${Math.round(avgConsumption)} m3)`,
      severity: 'high',
      confidence: 0.7,
      data: { latest, average: avgConsumption, drop_pct: 1 - latest / avgConsumption },
    });
  }

  // Zero consumption for occupied property
  if (latest === 0 && readings.length > 1 && Number(readings[1].consumption_m3) > 0) {
    signals.push({
      signal_type: 'zero_consumption',
      description: 'Consumo cero despues de historial positivo',
      severity: 'medium',
      confidence: 0.6,
      data: { latest, previous: Number(readings[1].consumption_m3) },
    });
  }

  return signals;
}

/**
 * Check for meter data anomalies: reverse readings, impossible values.
 */
async function analyzeMeterIntegrity(
  tenantId: string,
  tomaId: string,
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = [];

  const rows = await db.execute({
    sql: `
      SELECT
        r.reading_value,
        r.reading_date,
        r.anomaly_flags,
        LAG(r.reading_value) OVER (ORDER BY r.reading_date) AS prev_value
      FROM readings r
      WHERE r.tenant_id = $1 AND r.toma_id = $2
      ORDER BY r.reading_date DESC
      LIMIT 6
    `,
    args: [tenantId, tomaId],
  });

  const readings = rows as unknown as Array<{
    reading_value: number;
    reading_date: string;
    anomaly_flags: string[] | null;
    prev_value: number | null;
  }>;

  for (const reading of readings) {
    // Reverse reading (current < previous)
    if (reading.prev_value !== null && Number(reading.reading_value) < Number(reading.prev_value)) {
      signals.push({
        signal_type: 'meter_reversal',
        description: `Lectura actual (${reading.reading_value}) menor a lectura anterior (${reading.prev_value})`,
        severity: 'critical',
        confidence: 0.9,
        data: {
          current: reading.reading_value,
          previous: reading.prev_value,
          date: reading.reading_date,
        },
      });
      break; // One reversal signal is enough
    }
  }

  return signals;
}

/**
 * Check for gaps in billing that might indicate unmetered consumption.
 */
async function analyzeBillingGaps(
  tenantId: string,
  tomaId: string,
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = [];

  const rows = await db.execute({
    sql: `
      SELECT
        COUNT(*) AS total_periods,
        COUNT(*) FILTER (WHERE status = 'cancelada') AS cancelled,
        MAX(billing_date) AS last_billed,
        MIN(billing_date) AS first_billed
      FROM invoices i
      JOIN contracts c ON i.contract_id = c.id
      WHERE c.tenant_id = $1 AND c.toma_id = $2
        AND i.billing_date > NOW() - INTERVAL '24 months'
    `,
    args: [tenantId, tomaId],
  });

  const summary = (rows as unknown as Array<{
    total_periods: number;
    cancelled: number;
    last_billed: string;
    first_billed: string;
  }>)[0];

  if (!summary) return signals;

  // High cancellation rate
  if (
    Number(summary.total_periods) > 3 &&
    Number(summary.cancelled) / Number(summary.total_periods) > 0.3
  ) {
    signals.push({
      signal_type: 'high_cancellation_rate',
      description: `${summary.cancelled} de ${summary.total_periods} facturas canceladas (${Math.round(Number(summary.cancelled) / Number(summary.total_periods) * 100)}%)`,
      severity: 'medium',
      confidence: 0.5,
      data: {
        total: summary.total_periods,
        cancelled: summary.cancelled,
      },
    });
  }

  return signals;
}

/**
 * Check for geographic clustering of fraud cases near this toma.
 */
async function analyzeGeospatialClustering(
  tenantId: string,
  tomaId: string,
): Promise<FraudSignal[]> {
  const signals: FraudSignal[] = [];

  const rows = await db.execute({
    sql: `
      SELECT COUNT(*) AS nearby_cases
      FROM fraud_cases fc
      JOIN addresses fa ON fc.address_id = fa.id
      JOIN tomas t ON t.id = $2
      JOIN addresses ta ON t.address_id = ta.id
      WHERE fc.tenant_id = $1
        AND fc.status IN ('confirmado', 'en_inspeccion', 'en_proceso_legal')
        AND ta.geom IS NOT NULL
        AND fa.geom IS NOT NULL
        AND ST_DWithin(fa.geom, ta.geom, 500)
    `,
    args: [tenantId, tomaId],
  });

  const result = (rows as unknown as Array<{ nearby_cases: number }>)[0];
  const count = Number(result?.nearby_cases ?? 0);

  if (count >= 3) {
    signals.push({
      signal_type: 'geospatial_cluster',
      description: `${count} casos de fraude confirmados en un radio de 500m`,
      severity: count >= 5 ? 'high' : 'medium',
      confidence: 0.5,
      data: { nearby_cases: count, radius_m: 500 },
    });
  }

  return signals;
}

/**
 * Aggregate individual signal scores into an overall risk score.
 */
function calculateOverallRisk(signals: FraudSignal[]): number {
  if (signals.length === 0) return 0;

  const severityWeights: Record<string, number> = {
    critical: 1.0,
    high: 0.8,
    medium: 0.5,
    low: 0.2,
  };

  let totalWeight = 0;
  let weightedSum = 0;

  for (const signal of signals) {
    const weight = severityWeights[signal.severity] ?? 0.5;
    totalWeight += weight;
    weightedSum += signal.confidence * weight;
  }

  const raw = totalWeight > 0 ? weightedSum / totalWeight : 0;
  // Boost score if multiple signals present
  const multiplier = Math.min(1 + (signals.length - 1) * 0.1, 1.5);

  return Math.min(1, Math.round(raw * multiplier * 1000) / 1000);
}
