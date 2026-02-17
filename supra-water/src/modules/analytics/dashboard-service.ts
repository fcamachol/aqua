import { db } from '../../config/database.js';

// =============================================================
// Analytics Dashboard Service
// Real-time dashboard data and KPI calculations
// =============================================================

export interface DashboardData {
  active_contracts: number;
  revenue_this_month: number;
  collection_rate: number;
  delinquency_rate: number;
  average_consumption_m3: number;
  pending_work_orders: number;
  open_contacts: number;
  active_fraud_cases: number;
  active_delinquency_procedures: number;
  as_of: string;
}

export interface RevenueData {
  period: string;
  invoiced: number;
  collected: number;
  collection_rate: number;
}

export interface DelinquencyMetrics {
  period: string;
  total_delinquent_accounts: number;
  total_debt: number;
  average_days_past_due: number;
  procedures_started: number;
  procedures_resolved: number;
}

export interface ConsumptionData {
  period: string;
  total_m3: number;
  average_m3: number;
  reading_count: number;
  toma_type?: string;
}

export interface CollectionRateData {
  period: string;
  invoiced: number;
  collected: number;
  rate: number;
  overdue_amount: number;
}

export interface ConaguaReport {
  year: number;
  month: number;
  report_type: string;
  data: Record<string, unknown>;
  generated_at: string;
}

/**
 * Get real-time dashboard KPIs.
 */
export async function getDashboard(
  tenantId: string,
  explotacionId?: string,
): Promise<DashboardData> {
  const explotacionFilter = explotacionId
    ? `AND c.explotacion_id = '${explotacionId}'`
    : '';

  const rows = await db.execute({
    sql: `
      SELECT
        (SELECT COUNT(*) FROM contracts c
         WHERE c.tenant_id = $1 AND c.status = 'activo' ${explotacionFilter})::int
          AS active_contracts,

        (SELECT COALESCE(SUM(p.amount), 0) FROM payments p
         JOIN invoices i ON p.invoice_id = i.id
         JOIN contracts c ON i.contract_id = c.id
         WHERE c.tenant_id = $1 AND p.status = 'completed'
           AND p.created_at >= DATE_TRUNC('month', NOW())
           ${explotacionFilter})
          AS revenue_this_month,

        (SELECT COUNT(*) FROM work_orders wo
         WHERE wo.tenant_id = $1 AND wo.status IN ('pendiente', 'asignada'))::int
          AS pending_work_orders,

        (SELECT COUNT(*) FROM contacts ct
         WHERE ct.tenant_id = $1 AND ct.status IN ('abierto', 'en_proceso', 'escalado'))::int
          AS open_contacts,

        (SELECT COUNT(*) FROM fraud_cases fc
         WHERE fc.tenant_id = $1 AND fc.status IN ('abierto', 'en_inspeccion', 'confirmado'))::int
          AS active_fraud_cases,

        (SELECT COUNT(*) FROM delinquency_procedures dp
         WHERE dp.tenant_id = $1 AND dp.status = 'activo')::int
          AS active_delinquency_procedures
    `,
    args: [tenantId],
  });

  const raw = (rows as unknown as Array<Record<string, unknown>>)[0];

  // Calculate collection and delinquency rates
  const rateRows = await db.execute({
    sql: `
      SELECT
        COALESCE(SUM(i.total), 0) AS total_invoiced,
        COALESCE(SUM(CASE WHEN i.status IN ('cobrada', 'abonada') THEN i.total ELSE 0 END), 0) AS total_collected,
        COUNT(*) FILTER (WHERE i.status IN ('impagada', 'pendiente') AND i.due_date < NOW()) AS overdue_count,
        COUNT(*) AS total_count
      FROM invoices i
      JOIN contracts c ON i.contract_id = c.id
      WHERE c.tenant_id = $1
        AND i.billing_date >= DATE_TRUNC('month', NOW()) - INTERVAL '3 months'
        ${explotacionFilter}
    `,
    args: [tenantId],
  });

  const rates = (rateRows as unknown as Array<Record<string, unknown>>)[0];
  const totalInvoiced = Number(rates?.total_invoiced ?? 0);
  const totalCollected = Number(rates?.total_collected ?? 0);
  const overdueCount = Number(rates?.overdue_count ?? 0);
  const totalCount = Number(rates?.total_count ?? 1);

  // Average consumption
  const consumptionRows = await db.execute({
    sql: `
      SELECT COALESCE(AVG(r.consumption_m3), 0) AS avg_consumption
      FROM readings r
      WHERE r.tenant_id = $1
        AND r.reading_date >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    `,
    args: [tenantId],
  });
  const avgConsumption = Number(
    (consumptionRows as unknown as Array<{ avg_consumption: number }>)[0]?.avg_consumption ?? 0,
  );

  return {
    active_contracts: Number(raw?.active_contracts ?? 0),
    revenue_this_month: Number(raw?.revenue_this_month ?? 0),
    collection_rate: totalInvoiced > 0
      ? Math.round((totalCollected / totalInvoiced) * 10000) / 100
      : 0,
    delinquency_rate: totalCount > 0
      ? Math.round((overdueCount / totalCount) * 10000) / 100
      : 0,
    average_consumption_m3: Math.round(avgConsumption * 100) / 100,
    pending_work_orders: Number(raw?.pending_work_orders ?? 0),
    open_contacts: Number(raw?.open_contacts ?? 0),
    active_fraud_cases: Number(raw?.active_fraud_cases ?? 0),
    active_delinquency_procedures: Number(raw?.active_delinquency_procedures ?? 0),
    as_of: new Date().toISOString(),
  };
}

/**
 * Get revenue data by period.
 */
export async function getRevenue(
  tenantId: string,
  period: string,
  fromDate: string,
  toDate: string,
  explotacionId?: string,
): Promise<RevenueData[]> {
  const truncInterval = period === 'daily' ? 'day'
    : period === 'weekly' ? 'week'
    : period === 'yearly' ? 'year'
    : 'month';

  const explotacionFilter = explotacionId
    ? `AND c.explotacion_id = '${explotacionId}'`
    : '';

  const rows = await db.execute({
    sql: `
      SELECT
        DATE_TRUNC('${truncInterval}', i.billing_date)::date AS period,
        COALESCE(SUM(i.total), 0) AS invoiced,
        COALESCE(SUM(CASE WHEN i.status IN ('cobrada', 'abonada') THEN i.total ELSE 0 END), 0) AS collected
      FROM invoices i
      JOIN contracts c ON i.contract_id = c.id
      WHERE c.tenant_id = $1
        AND i.billing_date >= $2
        AND i.billing_date <= $3
        ${explotacionFilter}
      GROUP BY DATE_TRUNC('${truncInterval}', i.billing_date)
      ORDER BY period
    `,
    args: [tenantId, fromDate, toDate],
  });

  return (rows as unknown as Array<{ period: string; invoiced: number; collected: number }>).map(
    (r) => ({
      period: r.period,
      invoiced: Number(r.invoiced),
      collected: Number(r.collected),
      collection_rate:
        Number(r.invoiced) > 0
          ? Math.round((Number(r.collected) / Number(r.invoiced)) * 10000) / 100
          : 0,
    }),
  );
}

/**
 * Get delinquency metrics by period.
 */
export async function getDelinquencyMetrics(
  tenantId: string,
  period: string,
  fromDate?: string,
  toDate?: string,
  explotacionId?: string,
): Promise<DelinquencyMetrics[]> {
  const truncInterval = period === 'daily' ? 'day'
    : period === 'weekly' ? 'week'
    : 'month';

  const dateFilter = fromDate && toDate
    ? `AND dp.created_at >= '${fromDate}' AND dp.created_at <= '${toDate}'`
    : `AND dp.created_at >= NOW() - INTERVAL '12 months'`;

  const rows = await db.execute({
    sql: `
      SELECT
        DATE_TRUNC('${truncInterval}', dp.created_at)::date AS period,
        COUNT(*) FILTER (WHERE dp.status = 'activo')::int AS total_delinquent_accounts,
        COALESCE(SUM(dp.total_debt), 0) AS total_debt,
        COALESCE(AVG(EXTRACT(EPOCH FROM NOW() - dp.oldest_unpaid_date) / 86400), 0)::int AS average_days_past_due,
        COUNT(*) FILTER (WHERE dp.created_at >= DATE_TRUNC('${truncInterval}', dp.created_at))::int AS procedures_started,
        COUNT(*) FILTER (WHERE dp.status = 'resuelto')::int AS procedures_resolved
      FROM delinquency_procedures dp
      WHERE dp.tenant_id = $1
        ${dateFilter}
      GROUP BY DATE_TRUNC('${truncInterval}', dp.created_at)
      ORDER BY period
    `,
    args: [tenantId],
  });

  return (rows as unknown as DelinquencyMetrics[]).map((r) => ({
    period: r.period,
    total_delinquent_accounts: Number(r.total_delinquent_accounts),
    total_debt: Number(r.total_debt),
    average_days_past_due: Number(r.average_days_past_due),
    procedures_started: Number(r.procedures_started),
    procedures_resolved: Number(r.procedures_resolved),
  }));
}

/**
 * Get consumption pattern data.
 */
export async function getConsumption(
  tenantId: string,
  period: string,
  fromDate?: string,
  toDate?: string,
  tomaType?: string,
  explotacionId?: string,
): Promise<ConsumptionData[]> {
  const truncInterval = period === 'daily' ? 'day'
    : period === 'weekly' ? 'week'
    : period === 'yearly' ? 'year'
    : 'month';

  const dateFilter = fromDate && toDate
    ? `AND r.reading_date >= '${fromDate}' AND r.reading_date <= '${toDate}'`
    : `AND r.reading_date >= NOW() - INTERVAL '12 months'`;

  const tomaFilter = tomaType ? `AND t.toma_type = '${tomaType}'` : '';
  const explotacionFilter = explotacionId
    ? `AND t.explotacion_id = '${explotacionId}'`
    : '';

  const rows = await db.execute({
    sql: `
      SELECT
        DATE_TRUNC('${truncInterval}', r.reading_date)::date AS period,
        COALESCE(SUM(r.consumption_m3), 0) AS total_m3,
        COALESCE(AVG(r.consumption_m3), 0) AS average_m3,
        COUNT(*)::int AS reading_count
      FROM readings r
      JOIN tomas t ON r.toma_id = t.id
      WHERE r.tenant_id = $1
        ${dateFilter}
        ${tomaFilter}
        ${explotacionFilter}
      GROUP BY DATE_TRUNC('${truncInterval}', r.reading_date)
      ORDER BY period
    `,
    args: [tenantId],
  });

  return (rows as unknown as ConsumptionData[]).map((r) => ({
    period: r.period,
    total_m3: Math.round(Number(r.total_m3) * 100) / 100,
    average_m3: Math.round(Number(r.average_m3) * 100) / 100,
    reading_count: Number(r.reading_count),
  }));
}

/**
 * Get collection rate data.
 */
export async function getCollectionRate(
  tenantId: string,
  period: string,
  fromDate?: string,
  toDate?: string,
  explotacionId?: string,
): Promise<CollectionRateData[]> {
  const truncInterval = period === 'daily' ? 'day'
    : period === 'weekly' ? 'week'
    : period === 'yearly' ? 'year'
    : 'month';

  const dateFilter = fromDate && toDate
    ? `AND i.billing_date >= '${fromDate}' AND i.billing_date <= '${toDate}'`
    : `AND i.billing_date >= NOW() - INTERVAL '12 months'`;

  const explotacionFilter = explotacionId
    ? `AND c.explotacion_id = '${explotacionId}'`
    : '';

  const rows = await db.execute({
    sql: `
      SELECT
        DATE_TRUNC('${truncInterval}', i.billing_date)::date AS period,
        COALESCE(SUM(i.total), 0) AS invoiced,
        COALESCE(SUM(CASE WHEN i.status IN ('cobrada', 'abonada') THEN i.total ELSE 0 END), 0) AS collected,
        COALESCE(SUM(CASE WHEN i.status IN ('impagada') AND i.due_date < NOW() THEN i.total ELSE 0 END), 0) AS overdue_amount
      FROM invoices i
      JOIN contracts c ON i.contract_id = c.id
      WHERE c.tenant_id = $1
        ${dateFilter}
        ${explotacionFilter}
      GROUP BY DATE_TRUNC('${truncInterval}', i.billing_date)
      ORDER BY period
    `,
    args: [tenantId],
  });

  return (rows as unknown as Array<Record<string, unknown>>).map((r) => {
    const invoiced = Number(r.invoiced);
    const collected = Number(r.collected);
    return {
      period: String(r.period),
      invoiced,
      collected,
      rate: invoiced > 0 ? Math.round((collected / invoiced) * 10000) / 100 : 0,
      overdue_amount: Number(r.overdue_amount),
    };
  });
}

/**
 * Generate CONAGUA regulatory report stub.
 * In production, this would pull from official CONAGUA report templates
 * and populate with actual operational data.
 */
export async function generateConaguaReport(
  tenantId: string,
  year: number,
  month: number,
  reportType: string,
  explotacionId?: string,
): Promise<ConaguaReport> {
  const explotacionFilter = explotacionId
    ? `AND e.id = '${explotacionId}'`
    : '';

  if (reportType === 'monthly_extraction') {
    const rows = await db.execute({
      sql: `
        SELECT
          COALESCE(SUM(r.consumption_m3), 0) AS total_extraction_m3,
          COUNT(DISTINCT r.toma_id)::int AS active_connections,
          COALESCE(AVG(r.consumption_m3), 0) AS avg_consumption_per_connection
        FROM readings r
        JOIN tomas t ON r.toma_id = t.id
        JOIN explotaciones e ON t.explotacion_id = e.id
        WHERE r.tenant_id = $1
          AND EXTRACT(YEAR FROM r.reading_date) = $2
          AND EXTRACT(MONTH FROM r.reading_date) = $3
          ${explotacionFilter}
      `,
      args: [tenantId, year, month],
    });

    const data = (rows as unknown as Array<Record<string, unknown>>)[0] ?? {};

    return {
      year,
      month,
      report_type: reportType,
      data: {
        total_extraction_m3: Number(data.total_extraction_m3 ?? 0),
        active_connections: Number(data.active_connections ?? 0),
        avg_consumption_per_connection: Math.round(Number(data.avg_consumption_per_connection ?? 0) * 100) / 100,
        report_status: 'draft',
        notes: 'Auto-generated report — requires regulatory review before submission',
      },
      generated_at: new Date().toISOString(),
    };
  }

  // quarterly_efficiency
  const rows = await db.execute({
    sql: `
      SELECT
        COALESCE(SUM(r.consumption_m3), 0) AS billed_volume_m3,
        COUNT(DISTINCT c.id)::int AS total_contracts,
        (SELECT COUNT(*) FROM tomas t2
         JOIN explotaciones e2 ON t2.explotacion_id = e2.id
         WHERE t2.tenant_id = $1 ${explotacionFilter})::int AS total_tomas
      FROM readings r
      JOIN tomas t ON r.toma_id = t.id
      JOIN explotaciones e ON t.explotacion_id = e.id
      JOIN contracts c ON c.toma_id = t.id
      WHERE r.tenant_id = $1
        AND EXTRACT(YEAR FROM r.reading_date) = $2
        AND EXTRACT(MONTH FROM r.reading_date) BETWEEN $3 AND $3 + 2
        ${explotacionFilter}
    `,
    args: [tenantId, year, month],
  });

  const data = (rows as unknown as Array<Record<string, unknown>>)[0] ?? {};

  return {
    year,
    month,
    report_type: reportType,
    data: {
      billed_volume_m3: Number(data.billed_volume_m3 ?? 0),
      total_contracts: Number(data.total_contracts ?? 0),
      total_tomas: Number(data.total_tomas ?? 0),
      commercial_efficiency_pct: 0, // Requires produced volume data
      physical_efficiency_pct: 0,   // Requires produced volume data
      report_status: 'draft',
      notes: 'Efficiency metrics require produced water volume data (not yet available)',
    },
    generated_at: new Date().toISOString(),
  };
}
