import type { DomainEvent } from '../types.js';
import { emitEvent } from '../publisher.js';

// =============================================================
// Handler: invoice.generated
// When an invoice is generated:
//   1. Stamp CFDI (fiscal digital invoice)
//   2. Generate PDF
//   3. Deliver via preferred channel
//   4. Emit invoice.stamped
// =============================================================

export async function onInvoiceGenerated(
  event: DomainEvent<'invoice.generated'>,
): Promise<void> {
  const { invoice_id, contract_id, total } = event.payload;

  console.log(
    `[on-invoice-generated] Processing invoice ${invoice_id} — contract ${contract_id}, total $${total}`,
  );

  // ---- Step 1: Stamp CFDI ----
  // TODO: Integrate with Finkok PAC via src/modules/billing/cfdi-service.ts
  const folioFiscal = await stampCfdi(invoice_id);

  await emitEvent({
    type: 'invoice.stamped',
    aggregate_type: 'invoice',
    aggregate_id: invoice_id,
    tenant_id: event.tenant_id,
    payload: {
      invoice_id,
      folio_fiscal: folioFiscal,
    },
    metadata: {
      ...event.metadata,
      source_event: event.type,
    },
  });

  console.log(
    `[on-invoice-generated] CFDI stamped — folio ${folioFiscal}`,
  );

  // ---- Step 2: Generate PDF ----
  // TODO: Integrate with src/modules/billing/pdf-generator.ts
  await generateInvoicePdf(invoice_id, folioFiscal);

  console.log(`[on-invoice-generated] PDF generated for ${invoice_id}`);

  // ---- Step 3: Deliver via preferred channel ----
  // TODO: Look up person's preferred_channel from contract → person
  const channel = await deliverInvoice(invoice_id, contract_id);

  await emitEvent({
    type: 'invoice.delivered',
    aggregate_type: 'invoice',
    aggregate_id: invoice_id,
    tenant_id: event.tenant_id,
    payload: {
      invoice_id,
      channel,
    },
    metadata: {
      ...event.metadata,
      folio_fiscal: folioFiscal,
      source_event: event.type,
    },
  });

  console.log(
    `[on-invoice-generated] Invoice ${invoice_id} delivered via ${channel}`,
  );
}

// ---- Stub implementations (to be replaced with real service calls) ----

async function stampCfdi(invoiceId: string): Promise<string> {
  // TODO: Call Finkok PAC for real CFDI stamping
  // Returns the UUID folio fiscal from SAT
  console.log(`[cfdi] Stamping invoice ${invoiceId}...`);
  return `CFDI-${Date.now()}-${invoiceId.slice(0, 8)}`;
}

async function generateInvoicePdf(
  invoiceId: string,
  folioFiscal: string,
): Promise<void> {
  // TODO: Use Puppeteer + Handlebars template to render invoice PDF
  console.log(
    `[pdf] Generating PDF for invoice ${invoiceId} (folio ${folioFiscal})...`,
  );
}

async function deliverInvoice(
  invoiceId: string,
  contractId: string,
): Promise<string> {
  // TODO: Look up preferred channel, send via WhatsApp/email/SMS
  // Default to email for now
  const channel = 'email';
  console.log(
    `[delivery] Delivering invoice ${invoiceId} for contract ${contractId} via ${channel}...`,
  );
  return channel;
}
