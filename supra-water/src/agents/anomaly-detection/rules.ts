// =============================================================
// Anomaly Detection Rules — SUPRA Water 2026 §5.2
//
// Statistical analysis functions for each anomaly type:
// high_consumption, zero_consumption, negative_consumption,
// meter_stopped, seasonal_anomaly, neighbor_comparison.
// =============================================================

// ─── Types ──────────────────────────────────────────────────

export interface ReadingData {
  reading_id: string;
  meter_id: string;
  toma_id: string;
  consumption_m3: number;
  reading_date: string;
  current_reading: number;
  previous_reading: number;
}

export interface HistoricalData {
  avg_6_months: number;
  prev_consumption: number;
  prev_prev_consumption: number;
  same_month_avg: number;
  same_month_stddev: number;
  consecutive_zeros: number;
  consecutive_same_reading: number;
  sector_avg: number;
  toma_type: string;
}

export interface AnomalyResult {
  rule: string;
  detected: boolean;
  confidence: number;
  action: string;
  details: Record<string, unknown>;
}

// ─── Detection Rules ────────────────────────────────────────

/**
 * High consumption: consumption > avg_6_months * 3
 * Possible leak or unusual usage.
 */
export function detectHighConsumption(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult {
  const threshold = history.avg_6_months * 3;
  const ratio = history.avg_6_months > 0
    ? reading.consumption_m3 / history.avg_6_months
    : 0;

  // Confidence scales with how far above threshold
  const confidence = ratio > 3
    ? Math.min(0.5 + (ratio - 3) * 0.1, 0.99)
    : 0;

  return {
    rule: 'high_consumption',
    detected: reading.consumption_m3 > threshold && confidence >= 0.7,
    confidence,
    action: 'flag_suspicious',
    details: {
      consumption: reading.consumption_m3,
      avg_6_months: history.avg_6_months,
      threshold,
      ratio: Math.round(ratio * 100) / 100,
    },
  };
}

/**
 * Zero consumption: consumption == 0 AND previous > 0, after 2 consecutive zeros.
 * Possible meter malfunction or disconnection.
 */
export function detectZeroConsumption(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult {
  const isZero = reading.consumption_m3 === 0;
  const prevWasPositive = history.prev_consumption > 0;
  const consecutiveZeros = isZero ? history.consecutive_zeros + 1 : 0;

  return {
    rule: 'zero_consumption',
    detected: isZero && consecutiveZeros >= 2,
    confidence: consecutiveZeros >= 3 ? 0.95 : consecutiveZeros >= 2 ? 0.8 : 0.4,
    action: 'check_meter_status',
    details: {
      consumption: reading.consumption_m3,
      prev_consumption: history.prev_consumption,
      consecutive_zeros: consecutiveZeros,
      prev_was_positive: prevWasPositive,
    },
  };
}

/**
 * Negative consumption: consumption < 0
 * Almost certainly a meter error or data entry mistake.
 */
export function detectNegativeConsumption(
  reading: ReadingData,
): AnomalyResult {
  const isNegative = reading.consumption_m3 < 0;

  return {
    rule: 'negative_consumption',
    detected: isNegative,
    confidence: isNegative ? 0.99 : 0,
    action: 'reject_and_alert',
    details: {
      consumption: reading.consumption_m3,
      current_reading: reading.current_reading,
      previous_reading: reading.previous_reading,
    },
  };
}

/**
 * Meter stopped: same reading for >= 3 periods.
 * Meter likely malfunctioning.
 */
export function detectMeterStopped(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult {
  const sameReading = reading.consumption_m3 === 0 && history.consecutive_same_reading >= 2;
  const consecutivePeriods = sameReading ? history.consecutive_same_reading + 1 : 0;

  return {
    rule: 'meter_stopped',
    detected: consecutivePeriods >= 3,
    confidence: consecutivePeriods >= 4 ? 0.95 : consecutivePeriods >= 3 ? 0.85 : 0.3,
    action: 'create_work_order_meter_check',
    details: {
      consecutive_same_reading: consecutivePeriods,
      current_reading: reading.current_reading,
    },
  };
}

/**
 * Seasonal anomaly: consumption deviates > 2 sigma from same month historical.
 * Unusual for the time of year.
 */
export function detectSeasonalAnomaly(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult {
  if (history.same_month_stddev === 0) {
    return {
      rule: 'seasonal_anomaly',
      detected: false,
      confidence: 0,
      action: 'flag_for_review',
      details: { reason: 'Insufficient historical data for seasonal analysis' },
    };
  }

  const zScore = Math.abs(
    (reading.consumption_m3 - history.same_month_avg) / history.same_month_stddev,
  );

  return {
    rule: 'seasonal_anomaly',
    detected: zScore > 2,
    confidence: zScore > 3 ? 0.95 : zScore > 2 ? 0.75 : 0.3,
    action: 'flag_for_review',
    details: {
      consumption: reading.consumption_m3,
      same_month_avg: history.same_month_avg,
      same_month_stddev: history.same_month_stddev,
      z_score: Math.round(zScore * 100) / 100,
    },
  };
}

/**
 * Neighbor comparison: consumption > sector_avg * 5 AND same toma type.
 * Possible fraud or major leak.
 */
export function detectNeighborAnomaly(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult {
  const ratio = history.sector_avg > 0
    ? reading.consumption_m3 / history.sector_avg
    : 0;

  return {
    rule: 'neighbor_comparison',
    detected: ratio > 5,
    confidence: ratio > 10 ? 0.95 : ratio > 5 ? 0.8 : 0.3,
    action: 'create_fraud_case',
    details: {
      consumption: reading.consumption_m3,
      sector_avg: history.sector_avg,
      toma_type: history.toma_type,
      ratio: Math.round(ratio * 100) / 100,
    },
  };
}

// ─── Run All Rules ──────────────────────────────────────────

/**
 * Run all detection rules against a reading and return any detected anomalies.
 */
export function runAllRules(
  reading: ReadingData,
  history: HistoricalData,
): AnomalyResult[] {
  const results = [
    detectHighConsumption(reading, history),
    detectZeroConsumption(reading, history),
    detectNegativeConsumption(reading),
    detectMeterStopped(reading, history),
    detectSeasonalAnomaly(reading, history),
    detectNeighborAnomaly(reading, history),
  ];

  return results.filter((r) => r.detected);
}
