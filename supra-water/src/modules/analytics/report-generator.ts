import {
  getRevenue,
  getDelinquencyMetrics,
  getConsumption,
  getCollectionRate,
  generateConaguaReport,
  type RevenueData,
  type DelinquencyMetrics,
  type ConsumptionData,
  type CollectionRateData,
  type ConaguaReport,
} from './dashboard-service.js';

// =============================================================
// Report Generator
// Generates structured reports from analytics data.
// In production, these would also produce PDF via Puppeteer.
// =============================================================

export interface Report {
  title: string;
  type: string;
  tenant_id: string;
  parameters: Record<string, unknown>;
  data: unknown;
  generated_at: string;
}

/**
 * Generate a revenue report for a given period.
 */
export async function generateRevenueReport(
  tenantId: string,
  fromDate: string,
  toDate: string,
  period: string = 'monthly',
  explotacionId?: string,
): Promise<Report> {
  const data = await getRevenue(tenantId, period, fromDate, toDate, explotacionId);

  const totalInvoiced = data.reduce((s, r) => s + r.invoiced, 0);
  const totalCollected = data.reduce((s, r) => s + r.collected, 0);

  return {
    title: `Reporte de Ingresos — ${fromDate} a ${toDate}`,
    type: 'revenue',
    tenant_id: tenantId,
    parameters: { fromDate, toDate, period, explotacionId },
    data: {
      periods: data,
      summary: {
        total_invoiced: totalInvoiced,
        total_collected: totalCollected,
        overall_collection_rate:
          totalInvoiced > 0
            ? Math.round((totalCollected / totalInvoiced) * 10000) / 100
            : 0,
        period_count: data.length,
      },
    },
    generated_at: new Date().toISOString(),
  };
}

/**
 * Generate a delinquency report.
 */
export async function generateDelinquencyReport(
  tenantId: string,
  period: string = 'monthly',
  fromDate?: string,
  toDate?: string,
  explotacionId?: string,
): Promise<Report> {
  const data = await getDelinquencyMetrics(
    tenantId,
    period,
    fromDate,
    toDate,
    explotacionId,
  );

  const totalDebt = data.reduce((s, r) => s + r.total_debt, 0);
  const totalStarted = data.reduce((s, r) => s + r.procedures_started, 0);
  const totalResolved = data.reduce((s, r) => s + r.procedures_resolved, 0);

  return {
    title: `Reporte de Morosidad`,
    type: 'delinquency',
    tenant_id: tenantId,
    parameters: { period, fromDate, toDate, explotacionId },
    data: {
      periods: data,
      summary: {
        total_debt: totalDebt,
        total_procedures_started: totalStarted,
        total_procedures_resolved: totalResolved,
        resolution_rate:
          totalStarted > 0
            ? Math.round((totalResolved / totalStarted) * 10000) / 100
            : 0,
      },
    },
    generated_at: new Date().toISOString(),
  };
}

/**
 * Generate a consumption patterns report.
 */
export async function generateConsumptionReport(
  tenantId: string,
  period: string = 'monthly',
  fromDate?: string,
  toDate?: string,
  tomaType?: string,
  explotacionId?: string,
): Promise<Report> {
  const data = await getConsumption(
    tenantId,
    period,
    fromDate,
    toDate,
    tomaType,
    explotacionId,
  );

  const totalM3 = data.reduce((s, r) => s + r.total_m3, 0);
  const totalReadings = data.reduce((s, r) => s + r.reading_count, 0);

  return {
    title: `Reporte de Consumo`,
    type: 'consumption',
    tenant_id: tenantId,
    parameters: { period, fromDate, toDate, tomaType, explotacionId },
    data: {
      periods: data,
      summary: {
        total_m3: Math.round(totalM3 * 100) / 100,
        total_readings: totalReadings,
        overall_average_m3:
          totalReadings > 0
            ? Math.round((totalM3 / totalReadings) * 100) / 100
            : 0,
      },
    },
    generated_at: new Date().toISOString(),
  };
}

/**
 * Generate a collection efficiency report.
 */
export async function generateCollectionReport(
  tenantId: string,
  period: string = 'monthly',
  fromDate?: string,
  toDate?: string,
  explotacionId?: string,
): Promise<Report> {
  const data = await getCollectionRate(
    tenantId,
    period,
    fromDate,
    toDate,
    explotacionId,
  );

  const totalInvoiced = data.reduce((s, r) => s + r.invoiced, 0);
  const totalCollected = data.reduce((s, r) => s + r.collected, 0);
  const totalOverdue = data.reduce((s, r) => s + r.overdue_amount, 0);

  return {
    title: `Reporte de Eficiencia de Cobranza`,
    type: 'collection_rate',
    tenant_id: tenantId,
    parameters: { period, fromDate, toDate, explotacionId },
    data: {
      periods: data,
      summary: {
        total_invoiced: totalInvoiced,
        total_collected: totalCollected,
        total_overdue: totalOverdue,
        overall_rate:
          totalInvoiced > 0
            ? Math.round((totalCollected / totalInvoiced) * 10000) / 100
            : 0,
      },
    },
    generated_at: new Date().toISOString(),
  };
}

/**
 * Generate CONAGUA regulatory report.
 */
export async function generateConaguaReportForPeriod(
  tenantId: string,
  year: number,
  month: number,
  reportType: string,
  explotacionId?: string,
): Promise<Report> {
  const data = await generateConaguaReport(
    tenantId,
    year,
    month,
    reportType,
    explotacionId,
  );

  return {
    title: `Reporte CONAGUA — ${reportType} — ${year}/${String(month).padStart(2, '0')}`,
    type: `conagua_${reportType}`,
    tenant_id: tenantId,
    parameters: { year, month, reportType, explotacionId },
    data,
    generated_at: new Date().toISOString(),
  };
}
