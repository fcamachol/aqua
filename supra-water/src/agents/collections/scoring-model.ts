// =============================================================
// Collections Scoring Model — SUPRA Water 2026 §5.2
//
// 9 features → probability of payment within 30 days (0-1)
//
// Features:
//   1. payment_history_last_12_months (0-1, ratio of on-time payments)
//   2. days_past_due (0+)
//   3. total_debt_amount (MXN)
//   4. number_of_unpaid_invoices (0+)
//   5. account_age_years (0+)
//   6. toma_type (domestica/comercial/industrial/gobierno)
//   7. previous_payment_plans (count)
//   8. vulnerability_flag (boolean)
//   9. sector_delinquency_rate (0-1, rate of delinquent accounts in sector)
// =============================================================

export interface ScoringFeatures {
  payment_history_last_12_months: number;  // 0-1 (ratio on-time)
  days_past_due: number;
  total_debt_amount: number;               // MXN
  number_of_unpaid_invoices: number;
  account_age_years: number;
  toma_type: 'domestica' | 'comercial' | 'industrial' | 'gobierno';
  previous_payment_plans: number;
  vulnerability_flag: boolean;
  sector_delinquency_rate: number;         // 0-1
}

export type RiskTier = 'low_risk' | 'medium_risk' | 'high_risk' | 'vulnerable';

export interface ScoringResult {
  probability_of_payment_within_30_days: number;  // 0-1
  risk_tier: RiskTier;
  features: ScoringFeatures;
  feature_contributions: Record<string, number>;
}

// ─── Feature Weights (logistic regression coefficients) ─────

const WEIGHTS = {
  payment_history: 2.5,
  days_past_due: -0.03,
  debt_amount: -0.0001,
  unpaid_invoices: -0.3,
  account_age: 0.15,
  toma_type_commercial: -0.2,
  toma_type_industrial: -0.3,
  toma_type_gobierno: 0.5,
  payment_plans: -0.4,
  vulnerability: 0.1,
  sector_delinquency: -1.5,
  intercept: 0.5,
};

// ─── Sigmoid ────────────────────────────────────────────────

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// ─── Toma Type Encoding ─────────────────────────────────────

function tomaTypeScore(type: string): number {
  switch (type) {
    case 'comercial': return WEIGHTS.toma_type_commercial;
    case 'industrial': return WEIGHTS.toma_type_industrial;
    case 'gobierno': return WEIGHTS.toma_type_gobierno;
    default: return 0; // domestica is baseline
  }
}

// ─── Score Calculation ──────────────────────────────────────

/**
 * Calculate probability of payment within 30 days using a logistic regression model.
 * Returns 0-1 where higher = more likely to pay.
 */
export function calculateScore(features: ScoringFeatures): ScoringResult {
  const contributions: Record<string, number> = {};

  contributions.payment_history = features.payment_history_last_12_months * WEIGHTS.payment_history;
  contributions.days_past_due = features.days_past_due * WEIGHTS.days_past_due;
  contributions.debt_amount = features.total_debt_amount * WEIGHTS.debt_amount;
  contributions.unpaid_invoices = features.number_of_unpaid_invoices * WEIGHTS.unpaid_invoices;
  contributions.account_age = Math.min(features.account_age_years, 20) * WEIGHTS.account_age;
  contributions.toma_type = tomaTypeScore(features.toma_type);
  contributions.payment_plans = features.previous_payment_plans * WEIGHTS.payment_plans;
  contributions.vulnerability = features.vulnerability_flag ? WEIGHTS.vulnerability : 0;
  contributions.sector_delinquency = features.sector_delinquency_rate * WEIGHTS.sector_delinquency;

  const logit = WEIGHTS.intercept + Object.values(contributions).reduce((a, b) => a + b, 0);
  const probability = sigmoid(logit);

  // Determine risk tier
  let risk_tier: RiskTier;
  if (features.vulnerability_flag) {
    risk_tier = 'vulnerable';
  } else if (probability > 0.7) {
    risk_tier = 'low_risk';
  } else if (probability >= 0.3) {
    risk_tier = 'medium_risk';
  } else {
    risk_tier = 'high_risk';
  }

  return {
    probability_of_payment_within_30_days: Math.round(probability * 1000) / 1000,
    risk_tier,
    features,
    feature_contributions: contributions,
  };
}
