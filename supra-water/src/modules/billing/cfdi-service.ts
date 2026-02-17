/**
 * CFDI 4.0 Service — SUPRA Water 2026
 *
 * Service stub ready for Finkok PAC integration.
 * Implements SAT catalog mappings from SUPRA spec section 7.1.
 */

import { env } from '../../config/env.js';
import type { InvoiceLineItem } from './tariff-calculator.js';

// ─── SAT Catalog Constants (SUPRA spec 7.1) ────────────────────

export const SAT_CATALOGS = {
  productServiceKeys: {
    agua: '10171500',
    alcantarillado: '72151802',
    saneamiento: '72151801',
    reconexion: '72151800',
  },
  unitKeys: {
    m3: 'MTQ',
    servicio: 'E48',
    pieza: 'H87',
  },
  paymentMethods: {
    efectivo: '01',
    transferencia: '03',
    tarjeta_debito: '28',
    tarjeta_credito: '04',
    por_definir: '99',
  },
  paymentForms: {
    pago_unico: 'PUE',
    parcialidades: 'PPD',
  },
  fiscalRegimes: {
    gobierno: '603',
    general: '601',
    sin_obligaciones: '616',
  },
  cfdiUses: {
    gastos_general: 'G03',
    sin_efectos: 'S01',
    por_definir: 'P01',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────

export interface CFDIEmisor {
  rfc: string;
  nombre: string;
  regimenFiscal: string;  // SAT fiscal regime code
}

export interface CFDIReceptor {
  rfc: string;
  nombre: string;
  domicilioFiscalReceptor: string;  // CP (postal code)
  regimenFiscalReceptor: string;
  usoCFDI: string;
}

export interface CFDIConcepto {
  claveProdServ: string;
  claveUnidad: string;
  cantidad: number;
  descripcion: string;
  valorUnitario: number;
  importe: number;
  objetoImp: '01' | '02' | '03';  // 01=No objeto, 02=Si objeto, 03=Si objeto no obligado
  impuestos?: {
    traslados: Array<{
      base: number;
      impuesto: '002';   // IVA
      tipoFactor: 'Tasa';
      tasaOCuota: number;
      importe: number;
    }>;
  };
}

export interface CFDIInput {
  serie: string;
  folio: string;
  fecha: string;           // ISO datetime
  formaPago: string;       // SAT payment method code
  metodoPago: string;      // PUE or PPD
  moneda: 'MXN';
  subtotal: number;
  total: number;
  tipoDeComprobante: 'I' | 'E';  // I=Ingreso, E=Egreso (credit note)
  emisor: CFDIEmisor;
  receptor: CFDIReceptor;
  conceptos: CFDIConcepto[];
  impuestos: {
    totalImpuestosTrasladados: number;
    traslados: Array<{
      impuesto: '002';
      tipoFactor: 'Tasa';
      tasaOCuota: number;
      importe: number;
      base: number;
    }>;
  };
  cfdiRelacionados?: {
    tipoRelacion: string;
    uuids: string[];
  };
}

export interface CFDIStampResult {
  success: boolean;
  uuid: string;
  fechaTimbrado: string;
  selloCFD: string;
  selloSAT: string;
  noCertificadoSAT: string;
  cadenaOriginal: string;
  xml: string;
  qrCode?: string;
}

export interface CFDICancelResult {
  success: boolean;
  acuse: string;
  fechaCancelacion: string;
}

export interface CFDIStatusResult {
  uuid: string;
  status: 'vigente' | 'cancelado' | 'no_encontrado';
  esCancelable: boolean;
  estatusCancelacion: string | null;
}

// ─── CFDI Service ───────────────────────────────────────────────

/**
 * Build CFDI XML conceptos from invoice line items.
 */
function buildConceptos(lines: InvoiceLineItem[]): CFDIConcepto[] {
  return lines.map((line) => {
    const hasIva = line.ivaRate > 0;
    const concepto: CFDIConcepto = {
      claveProdServ: line.claveProdServ,
      claveUnidad: line.claveUnidad,
      cantidad: Math.abs(line.quantity),
      descripcion: line.conceptName,
      valorUnitario: Math.abs(line.unitPrice),
      importe: Math.abs(line.subtotal),
      objetoImp: hasIva ? '02' : '01',
    };

    if (hasIva) {
      concepto.impuestos = {
        traslados: [
          {
            base: Math.abs(line.subtotal),
            impuesto: '002',
            tipoFactor: 'Tasa',
            tasaOCuota: line.ivaRate,
            importe: Math.abs(line.ivaAmount),
          },
        ],
      };
    }

    return concepto;
  });
}

/**
 * Build the full CFDI 4.0 data structure ready for PAC stamping.
 */
export function buildCFDI(params: {
  invoice: {
    serie: string;
    invoiceNumber: string;
    billingDate: Date;
    subtotal: number;
    ivaAmount: number;
    total: number;
    paymentMethod?: string;
    relatedFolioFiscal?: string;
  };
  emisor: CFDIEmisor;
  receptor: CFDIReceptor;
  lines: InvoiceLineItem[];
  tipoComprobante?: 'I' | 'E';
}): CFDIInput {
  const { invoice, emisor, receptor, lines, tipoComprobante = 'I' } = params;

  const paymentMethodCode =
    SAT_CATALOGS.paymentMethods[
      (invoice.paymentMethod as keyof typeof SAT_CATALOGS.paymentMethods) ?? 'por_definir'
    ] ?? SAT_CATALOGS.paymentMethods.por_definir;

  const conceptos = buildConceptos(lines);

  // Aggregate IVA traslados
  const ivaBase = lines
    .filter((l) => l.ivaRate > 0)
    .reduce((sum, l) => sum + Math.abs(l.subtotal), 0);
  const ivaTotal = lines
    .filter((l) => l.ivaRate > 0)
    .reduce((sum, l) => sum + Math.abs(l.ivaAmount), 0);

  const cfdi: CFDIInput = {
    serie: invoice.serie,
    folio: invoice.invoiceNumber,
    fecha: invoice.billingDate.toISOString(),
    formaPago: paymentMethodCode,
    metodoPago: SAT_CATALOGS.paymentForms.pago_unico,
    moneda: 'MXN',
    subtotal: Math.abs(invoice.subtotal),
    total: Math.abs(invoice.total),
    tipoDeComprobante: tipoComprobante,
    emisor,
    receptor,
    conceptos,
    impuestos: {
      totalImpuestosTrasladados: round2(ivaTotal),
      traslados:
        ivaTotal > 0
          ? [
              {
                impuesto: '002',
                tipoFactor: 'Tasa',
                tasaOCuota: 0.16,
                importe: round2(ivaTotal),
                base: round2(ivaBase),
              },
            ]
          : [],
    },
  };

  if (invoice.relatedFolioFiscal) {
    cfdi.cfdiRelacionados = {
      tipoRelacion: '01', // Nota de crédito de documentos relacionados
      uuids: [invoice.relatedFolioFiscal],
    };
  }

  return cfdi;
}

/**
 * Stamp an invoice through the Finkok PAC.
 * Builds CFDI XML, sends to Finkok, returns UUID and stamped XML.
 */
export async function stampInvoice(params: {
  invoice: {
    serie: string;
    invoiceNumber: string;
    billingDate: Date;
    subtotal: number;
    ivaAmount: number;
    total: number;
    paymentMethod?: string;
  };
  emisor: CFDIEmisor;
  receptor: CFDIReceptor;
  lines: InvoiceLineItem[];
}): Promise<CFDIStampResult> {
  const cfdiData = buildCFDI(params);

  const finkokUrl =
    env.FINKOK_ENVIRONMENT === 'production'
      ? 'https://facturacion.finkok.com/servicios/soap/stamp'
      : 'https://demo-facturacion.finkok.com/servicios/soap/stamp';

  // TODO: Implement actual SOAP call to Finkok.
  // For now, build the XML structure and return a stub response
  // so the rest of the billing pipeline can be tested end-to-end.
  const _xmlPayload = JSON.stringify(cfdiData);

  if (!env.FINKOK_USERNAME || !env.FINKOK_PASSWORD) {
    // Return stub for development/testing
    const stubUuid = crypto.randomUUID();
    return {
      success: true,
      uuid: stubUuid,
      fechaTimbrado: new Date().toISOString(),
      selloCFD: 'STUB_SELLO_CFD',
      selloSAT: 'STUB_SELLO_SAT',
      noCertificadoSAT: '00001000000000000000',
      cadenaOriginal: `||1.1|${stubUuid}|${new Date().toISOString()}|STUB_SELLO_CFD|00001000000000000000||`,
      xml: `<!-- CFDI Stub: configure FINKOK_USERNAME and FINKOK_PASSWORD for real stamping -->\n<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0" Serie="${cfdiData.serie}" Folio="${cfdiData.folio}" Total="${cfdiData.total}" />`,
    };
  }

  // Production Finkok integration
  try {
    const response = await fetch(finkokUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'stamp',
      },
      body: buildFinkokSoapEnvelope('stamp', {
        username: env.FINKOK_USERNAME,
        password: env.FINKOK_PASSWORD,
        xml: _xmlPayload,
      }),
    });

    if (!response.ok) {
      throw new Error(`Finkok stamp failed: HTTP ${response.status}`);
    }

    const responseText = await response.text();
    return parseFinkokStampResponse(responseText);
  } catch (error) {
    throw new Error(
      `CFDI stamping error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Cancel a stamped CFDI at SAT through Finkok.
 */
export async function cancelInvoice(
  uuid: string,
  reason: string,
  emisorRfc: string,
): Promise<CFDICancelResult> {
  const finkokUrl =
    env.FINKOK_ENVIRONMENT === 'production'
      ? 'https://facturacion.finkok.com/servicios/soap/cancel'
      : 'https://demo-facturacion.finkok.com/servicios/soap/cancel';

  if (!env.FINKOK_USERNAME || !env.FINKOK_PASSWORD) {
    return {
      success: true,
      acuse: 'STUB_ACUSE',
      fechaCancelacion: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(finkokUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'cancel',
      },
      body: buildFinkokSoapEnvelope('cancel', {
        username: env.FINKOK_USERNAME,
        password: env.FINKOK_PASSWORD,
        uuid,
        rfc: emisorRfc,
        motivo: reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Finkok cancel failed: HTTP ${response.status}`);
    }

    const responseText = await response.text();
    return parseFinkokCancelResponse(responseText);
  } catch (error) {
    throw new Error(
      `CFDI cancellation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Check CFDI status at SAT through Finkok.
 */
export async function getStatus(uuid: string, emisorRfc: string, receptorRfc: string): Promise<CFDIStatusResult> {
  const finkokUrl =
    env.FINKOK_ENVIRONMENT === 'production'
      ? 'https://facturacion.finkok.com/servicios/soap/query'
      : 'https://demo-facturacion.finkok.com/servicios/soap/query';

  if (!env.FINKOK_USERNAME || !env.FINKOK_PASSWORD) {
    return {
      uuid,
      status: 'vigente',
      esCancelable: true,
      estatusCancelacion: null,
    };
  }

  try {
    const response = await fetch(finkokUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'query_pending',
      },
      body: buildFinkokSoapEnvelope('query', {
        username: env.FINKOK_USERNAME,
        password: env.FINKOK_PASSWORD,
        uuid,
        rfcEmisor: emisorRfc,
        rfcReceptor: receptorRfc,
      }),
    });

    if (!response.ok) {
      throw new Error(`Finkok query failed: HTTP ${response.status}`);
    }

    const responseText = await response.text();
    return parseFinkokStatusResponse(responseText, uuid);
  } catch (error) {
    throw new Error(
      `CFDI status query error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

// ─── Finkok SOAP Helpers ────────────────────────────────────────

function buildFinkokSoapEnvelope(
  action: string,
  params: Record<string, string>,
): string {
  const paramXml = Object.entries(params)
    .map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:stam="apps.services.soap.core.views">
  <soapenv:Header/>
  <soapenv:Body>
    <stam:${action}>
      ${paramXml}
    </stam:${action}>
  </soapenv:Body>
</soapenv:Envelope>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseFinkokStampResponse(xml: string): CFDIStampResult {
  // Extract key fields from SOAP response XML
  const extract = (tag: string): string => {
    const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    return match?.[1]?.trim() ?? '';
  };

  const uuid = extract('UUID') || extract('uuid');
  if (!uuid) {
    const fault = extract('faultstring') || extract('CodEstatus');
    throw new Error(`Finkok stamp failed: ${fault || 'No UUID returned'}`);
  }

  return {
    success: true,
    uuid,
    fechaTimbrado: extract('FechaTimbrado') || new Date().toISOString(),
    selloCFD: extract('SelloCFD'),
    selloSAT: extract('SelloSAT'),
    noCertificadoSAT: extract('NoCertificadoSAT'),
    cadenaOriginal: extract('CadenaOriginalSAT'),
    xml: extract('xml') || xml,
  };
}

function parseFinkokCancelResponse(xml: string): CFDICancelResult {
  const extract = (tag: string): string => {
    const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    return match?.[1]?.trim() ?? '';
  };

  const acuse = extract('Acuse') || extract('acuse');
  return {
    success: !!acuse,
    acuse: acuse || '',
    fechaCancelacion: extract('Fecha') || new Date().toISOString(),
  };
}

function parseFinkokStatusResponse(xml: string, uuid: string): CFDIStatusResult {
  const extract = (tag: string): string => {
    const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    return match?.[1]?.trim() ?? '';
  };

  const estado = extract('Estado') || extract('estado') || '';
  let status: CFDIStatusResult['status'] = 'no_encontrado';
  if (estado.toLowerCase().includes('vigente')) status = 'vigente';
  else if (estado.toLowerCase().includes('cancelado')) status = 'cancelado';

  return {
    uuid,
    status,
    esCancelable: extract('EsCancelable')?.toLowerCase() === 'cancelable',
    estatusCancelacion: extract('EstatusCancelacion') || null,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
