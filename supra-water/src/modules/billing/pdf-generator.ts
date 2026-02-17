/**
 * Invoice PDF Generator — SUPRA Water 2026
 *
 * Renders invoice HTML from a Handlebars template, then converts to PDF via Puppeteer.
 */

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = resolve(__dirname, 'templates', 'invoice.hbs');

// ─── Types ──────────────────────────────────────────────────────

export interface InvoicePDFData {
  // Tenant/CEA info
  tenantName: string;
  tenantRfc: string;
  tenantLogo?: string;
  tenantAddress: string;
  tenantPhone: string;
  tenantEmail: string;

  // Invoice identification
  invoiceNumber: string;
  serie: string;
  billingDate: string;
  dueDate: string;
  invoiceType: string;
  status: string;

  // Customer info
  customerName: string;
  customerRfc: string;
  customerAddress: string;
  contractNumber: string;
  tomaNumber: string;
  tariffCategory: string;

  // Consumption data
  previousReading: number | null;
  currentReading: number | null;
  consumptionM3: number | null;
  periodStart: string;
  periodEnd: string;

  // Line items
  lineItems: Array<{
    conceptName: string;
    quantity: number;
    unitPrice: string;
    subtotal: string;
    ivaRate: string;
    ivaAmount: string;
    total: string;
  }>;

  // Totals
  subtotal: string;
  ivaTotal: string;
  grandTotal: string;
  currency: string;

  // CFDI fiscal data
  folioFiscal: string | null;
  selloCFD: string | null;
  selloSAT: string | null;
  noCertificadoSAT: string | null;
  fechaTimbrado: string | null;
  cadenaOriginal: string | null;
  qrCodeUrl: string | null;

  // Payment references
  paymentReference: string | null;    // OXXO barcode reference
  speiClabe: string | null;           // SPEI CLABE for bank transfer
  speiReference: string | null;       // SPEI reference number

  // Contact
  contactPhone: string;
  contactEmail: string;
  contactWebsite?: string;
}

// ─── Handlebars Helpers ─────────────────────────────────────────

Handlebars.registerHelper('formatCurrency', (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

Handlebars.registerHelper('ifEquals', function (
  this: unknown,
  a: unknown,
  b: unknown,
  options: Handlebars.HelperOptions,
) {
  return a === b ? options.fn(this) : options.inverse(this);
});

// ─── PDF Generation ─────────────────────────────────────────────

let cachedTemplate: Handlebars.TemplateDelegate | null = null;

async function getTemplate(): Promise<Handlebars.TemplateDelegate> {
  if (cachedTemplate) return cachedTemplate;
  const source = await readFile(TEMPLATE_PATH, 'utf-8');
  cachedTemplate = Handlebars.compile(source);
  return cachedTemplate;
}

/**
 * Generate an invoice PDF buffer from structured data.
 *
 * 1. Loads the Handlebars template
 * 2. Populates with invoice data
 * 3. Renders HTML -> PDF using Puppeteer
 * 4. Returns the PDF as a Buffer
 */
export async function generateInvoicePDF(data: InvoicePDFData): Promise<Buffer> {
  const template = await getTemplate();
  const html = template(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: {
        top: '15mm',
        bottom: '20mm',
        left: '12mm',
        right: '12mm',
      },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * Invalidate the cached template (useful for development/hot-reload).
 */
export function clearTemplateCache(): void {
  cachedTemplate = null;
}
