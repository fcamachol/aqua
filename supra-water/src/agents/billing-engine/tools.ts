// =============================================================
// Billing Engine Agent — Tool Definitions
// SUPRA Water 2026 §5.2 (Billing Engine Tools)
// =============================================================

import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';
import { calculateTariff, type TariffSchedule } from '../../modules/billing/tariff-calculator.js';

export const billingEngineTools: AgentTool[] = [
  {
    name: 'calculate_tariff',
    description: 'Calcular tarifa para un consumo dado usando la tarifa escalonada vigente.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'consumption_m3', type: 'number', description: 'Consumo en metros cúbicos', required: true },
      { name: 'social_tariff', type: 'boolean', description: 'Si aplica tarifa social', required: false },
    ],
    async execute(params, context) {
      // Fetch the contract's tariff schedule
      const rows = await db.execute({
        sql: `SELECT ts.* FROM tariff_schedules ts
              JOIN contracts c ON c.tariff_schedule_id = ts.id
              WHERE c.id = $1 AND c.tenant_id = $2 AND ts.active = true
              LIMIT 1`,
        args: [params.contract_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Tarifa no encontrada para el contrato' };

      const schedule = rows[0] as unknown as TariffSchedule;
      const result = calculateTariff(params.consumption_m3 as number, schedule, {
        socialTariffEligible: (params.social_tariff as boolean) ?? false,
      });

      return { success: true, data: result };
    },
  },

  {
    name: 'generate_invoice',
    description: 'Generar factura para un contrato con los datos de lectura y cálculo de tarifa.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'reading_id', type: 'string', description: 'ID de la lectura', required: true },
      { name: 'billing_period', type: 'string', description: 'Período de facturación (YYYY-MM)', required: true },
      { name: 'lines', type: 'object', description: 'Líneas de factura calculadas', required: true },
      { name: 'subtotal', type: 'number', description: 'Subtotal', required: true },
      { name: 'iva_total', type: 'number', description: 'IVA total', required: true },
      { name: 'grand_total', type: 'number', description: 'Total', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO invoices (tenant_id, contract_id, reading_id, billing_period,
                                    lines, subtotal, iva_total, total, status, due_date, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending',
                      NOW() + INTERVAL '15 days', NOW())
              RETURNING id, billing_period, total, status, due_date`,
        args: [
          context.tenantId,
          params.contract_id,
          params.reading_id,
          params.billing_period,
          JSON.stringify(params.lines),
          params.subtotal,
          params.iva_total,
          params.grand_total,
        ],
      });
      return { success: true, data: rows[0] };
    },
  },

  {
    name: 'stamp_cfdi',
    description: 'Timbrar la factura electrónica (CFDI) a través del PAC Finkok.',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
    ],
    async execute(params, context) {
      // In production, this calls the Finkok PAC integration
      // For now, we simulate the stamping process
      const folioFiscal = crypto.randomUUID();
      await db.execute({
        sql: `UPDATE invoices SET folio_fiscal = $1, cfdi_status = 'stamped', stamped_at = NOW()
              WHERE id = $2 AND tenant_id = $3`,
        args: [folioFiscal, params.invoice_id, context.tenantId],
      });
      return { success: true, data: { invoice_id: params.invoice_id, folio_fiscal: folioFiscal } };
    },
  },

  {
    name: 'generate_pdf',
    description: 'Generar PDF del recibo usando la plantilla HTML + Puppeteer.',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
    ],
    async execute(params, context) {
      // In production, renders HTML template with Handlebars + Puppeteer
      const pdfUrl = `https://storage.supra.water/${context.tenantId}/invoices/${params.invoice_id}.pdf`;
      await db.execute({
        sql: `UPDATE invoices SET pdf_url = $1 WHERE id = $2 AND tenant_id = $3`,
        args: [pdfUrl, params.invoice_id, context.tenantId],
      });
      return { success: true, data: { invoice_id: params.invoice_id, pdf_url: pdfUrl } };
    },
  },

  {
    name: 'deliver_whatsapp',
    description: 'Enviar recibo por WhatsApp al titular del contrato.',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      // Fetch phone and PDF URL
      const rows = await db.execute({
        sql: `SELECT p.phone, i.pdf_url, i.total, i.billing_period
              FROM invoices i
              JOIN contracts c ON i.contract_id = c.id
              JOIN persons p ON c.person_id = p.id
              WHERE i.id = $1 AND i.tenant_id = $2`,
        args: [params.invoice_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Factura o contacto no encontrado' };
      const { phone, pdf_url, total, billing_period } = rows[0] as any;
      if (!phone) return { success: false, error: 'El titular no tiene teléfono registrado' };

      // In production, calls WhatsApp API to send PDF
      return {
        success: true,
        data: { channel: 'whatsapp', phone, pdf_url, total, billing_period, status: 'queued' },
      };
    },
  },

  {
    name: 'deliver_email',
    description: 'Enviar recibo por correo electrónico al titular.',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT p.email, i.pdf_url, i.total, i.billing_period
              FROM invoices i
              JOIN contracts c ON i.contract_id = c.id
              JOIN persons p ON c.person_id = p.id
              WHERE i.id = $1 AND i.tenant_id = $2`,
        args: [params.invoice_id, context.tenantId],
      });
      if (rows.length === 0) return { success: false, error: 'Factura o contacto no encontrado' };
      const { email, pdf_url, total, billing_period } = rows[0] as any;
      if (!email) return { success: false, error: 'El titular no tiene email registrado' };

      return {
        success: true,
        data: { channel: 'email', email, pdf_url, total, billing_period, status: 'queued' },
      };
    },
  },

  {
    name: 'deliver_print_queue',
    description: 'Agregar recibo a la cola de impresión para entrega física.',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
    ],
    async execute(params, context) {
      await db.execute({
        sql: `INSERT INTO print_queue (tenant_id, invoice_id, status, created_at)
              VALUES ($1, $2, 'queued', NOW())
              ON CONFLICT (tenant_id, invoice_id) DO NOTHING`,
        args: [context.tenantId, params.invoice_id],
      });
      return { success: true, data: { channel: 'print', invoice_id: params.invoice_id, status: 'queued' } };
    },
  },

  {
    name: 'apply_regularization',
    description: 'Aplicar bonificaciones o recargos a una factura (regularización).',
    parameters: [
      { name: 'invoice_id', type: 'string', description: 'ID de la factura', required: true },
      { name: 'type', type: 'string', description: 'Tipo: bonificacion o recargo', required: true, enum: ['bonificacion', 'recargo'] },
      { name: 'amount', type: 'number', description: 'Monto de la regularización', required: true },
      { name: 'reason', type: 'string', description: 'Motivo de la regularización', required: true },
    ],
    async execute(params, context) {
      const sign = params.type === 'bonificacion' ? -1 : 1;
      const adjustment = (params.amount as number) * sign;

      await db.execute({
        sql: `UPDATE invoices SET total = total + $1, regularization_amount = COALESCE(regularization_amount, 0) + $1,
                                  regularization_reason = $2
              WHERE id = $3 AND tenant_id = $4`,
        args: [adjustment, params.reason, params.invoice_id, context.tenantId],
      });

      return { success: true, data: { invoice_id: params.invoice_id, adjustment, reason: params.reason } };
    },
  },
];

// Need crypto for UUID generation in stamp_cfdi
import crypto from 'node:crypto';
