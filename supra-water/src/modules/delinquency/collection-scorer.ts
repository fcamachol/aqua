// =============================================================
// Collection Scoring Model — Stub
// Predicts probability of payment within 30 days given account
// features. Uses a simple weighted scoring model as placeholder
// for a future ML model.
// =============================================================

export interface AccountFeatures {
  payment_history: number;       // 0-1, fraction of on-time payments in last 12 months
  days_past_due: number;         // Days since oldest unpaid invoice due date
  total_debt: number;            // Total outstanding debt in MXN
  invoice_count: number;         // Number of unpaid invoices
  account_age: number;           // Account age in years
  toma_type: string;             // 'domestico', 'comercial', 'industrial', 'gobierno'
  previous_plans: number;        // Number of previous payment plans
  vulnerability_flag: boolean;   // Social tariff / vulnerable household
  sector_rate: number;           // Sector-level delinquency rate (0-1)
}

export interface CollectionScore {
  probability_of_payment_within_30_days: number;   // 0-1
  risk_level: 'low_risk' | 'medium_risk' | 'high_risk' | 'vulnerable';
  factors: ScoringFactor[];
}

interface ScoringFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
}

// Feature weights (trained on historical data — placeholder values)
const WEIGHTS = {
  payment_history: 0.30,
  days_past_due: 0.20,
  total_debt: 0.10,
  invoice_count: 0.08,
  account_age: 0.07,
  toma_type: 0.05,
  previous_plans: 0.10,
  sector_rate: 0.10,
};

/**
 * Score an account's likelihood of payment within 30 days.
 * Returns a probability between 0 and 1, plus a risk classification.
 *
 * In production, this would call a trained ML model (e.g., XGBoost)
 * served via a model endpoint.
 */
export function scoreAccount(features: AccountFeatures): CollectionScore {
  // Vulnerability override: always classify as vulnerable
  if (features.vulnerability_flag) {
    return {
      probability_of_payment_within_30_days: 0.5,
      risk_level: 'vulnerable',
      factors: [
        {
          name: 'vulnerability_flag',
          weight: 1.0,
          value: 1,
          contribution: 1.0,
        },
      ],
    };
  }

  const factors: ScoringFactor[] = [];

  // Payment history: higher = better
  const historyScore = features.payment_history;
  factors.push({
    name: 'payment_history',
    weight: WEIGHTS.payment_history,
    value: historyScore,
    contribution: historyScore * WEIGHTS.payment_history,
  });

  // Days past due: more days = worse (decay function)
  const dpdScore = Math.max(0, 1 - features.days_past_due / 180);
  factors.push({
    name: 'days_past_due',
    weight: WEIGHTS.days_past_due,
    value: dpdScore,
    contribution: dpdScore * WEIGHTS.days_past_due,
  });

  // Total debt: higher debt = slightly lower probability
  const debtScore = Math.max(0, 1 - Math.min(features.total_debt / 10000, 1));
  factors.push({
    name: 'total_debt',
    weight: WEIGHTS.total_debt,
    value: debtScore,
    contribution: debtScore * WEIGHTS.total_debt,
  });

  // Invoice count: more invoices = worse
  const invoiceScore = Math.max(0, 1 - Math.min(features.invoice_count / 6, 1));
  factors.push({
    name: 'invoice_count',
    weight: WEIGHTS.invoice_count,
    value: invoiceScore,
    contribution: invoiceScore * WEIGHTS.invoice_count,
  });

  // Account age: older accounts slightly more reliable
  const ageScore = Math.min(features.account_age / 10, 1);
  factors.push({
    name: 'account_age',
    weight: WEIGHTS.account_age,
    value: ageScore,
    contribution: ageScore * WEIGHTS.account_age,
  });

  // Toma type: government pays slower, domestic is baseline
  const tomaScores: Record<string, number> = {
    domestico: 0.7,
    comercial: 0.8,
    industrial: 0.85,
    gobierno: 0.4,
  };
  const tomaScore = tomaScores[features.toma_type] ?? 0.7;
  factors.push({
    name: 'toma_type',
    weight: WEIGHTS.toma_type,
    value: tomaScore,
    contribution: tomaScore * WEIGHTS.toma_type,
  });

  // Previous plans: more plans = repeat offender
  const planScore = Math.max(0, 1 - Math.min(features.previous_plans / 3, 1));
  factors.push({
    name: 'previous_plans',
    weight: WEIGHTS.previous_plans,
    value: planScore,
    contribution: planScore * WEIGHTS.previous_plans,
  });

  // Sector rate: high sector delinquency = harder to collect
  const sectorScore = 1 - features.sector_rate;
  factors.push({
    name: 'sector_rate',
    weight: WEIGHTS.sector_rate,
    value: sectorScore,
    contribution: sectorScore * WEIGHTS.sector_rate,
  });

  // Sum weighted contributions
  const probability = Math.max(
    0,
    Math.min(1, factors.reduce((sum, f) => sum + f.contribution, 0)),
  );

  // Risk classification
  let riskLevel: CollectionScore['risk_level'];
  if (probability > 0.7) {
    riskLevel = 'low_risk';
  } else if (probability >= 0.3) {
    riskLevel = 'medium_risk';
  } else {
    riskLevel = 'high_risk';
  }

  return {
    probability_of_payment_within_30_days: Math.round(probability * 1000) / 1000,
    risk_level: riskLevel,
    factors,
  };
}
