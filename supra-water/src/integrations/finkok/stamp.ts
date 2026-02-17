// =============================================================
// CFDI 4.0 Stamping — Finkok PAC — SUPRA Water 2026 §7.1
// =============================================================

import { FinkokClient, escapeXml, type FinkokResponse, type FinkokIncidencia } from './client.js';

// ---- SAT Catalog Codes for Water Services ----

export const SAT_CATALOGS = {
  productServiceKeys: {
    agua: '10171500',
    alcantarillado: '72151802',
    saneamiento: '72151801',
    reconexion: '72151800',
  },
  unitKeys: {
    m3: 'MTQ',       // Metro cubico
    servicio: 'E48', // Unidad de servicio
    pieza: 'H87',    // Pieza
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

// ---- Input Types ----

export interface CFDIEmisor {
  rfc: string;
  nombre: string;
  regimen_fiscal: string; // SAT fiscal regime code e.g. '603'
  codigo_postal: string;  // Emisor domicilio fiscal CP
}

export interface CFDIReceptor {
  rfc: string;
  nombre: string;
  domicilio_fiscal: string;   // CP del receptor
  regimen_fiscal: string;
  uso_cfdi: string;           // e.g. 'G03', 'S01', 'P01'
}

export interface CFDIConcepto {
  clave_prod_serv: string;   // SAT product/service key
  clave_unidad: string;      // SAT unit key
  cantidad: number;
  unidad: string;            // Descriptive unit name
  descripcion: string;
  valor_unitario: number;
  importe: number;
  objeto_imp: '01' | '02' | '03'; // 01=No objeto, 02=Si, 03=Si y no obligado
  traslados?: CFDITraslado[];
}

export interface CFDITraslado {
  base: number;
  impuesto: '002';          // 002=IVA
  tipo_factor: 'Tasa' | 'Exento';
  tasa_o_cuota?: string;    // e.g. '0.160000'
  importe?: number;
}

export interface StampInput {
  emisor: CFDIEmisor;
  receptor: CFDIReceptor;
  conceptos: CFDIConcepto[];
  serie?: string;
  folio?: string;
  forma_pago: string;       // SAT payment method code
  metodo_pago: 'PUE' | 'PPD';
  moneda?: string;           // Default: 'MXN'
  condiciones_pago?: string;
  exportacion?: '01' | '02' | '03' | '04'; // Default: '01' (No aplica)
}

// ---- Output Types ----

export interface StampResult {
  uuid: string;
  fecha_timbrado: string;
  sello_cfd: string;
  sello_sat: string;
  cadena_original: string;
  no_certificado_sat: string;
  xml: string;
}

export type StampError =
  | 'INVALID_RFC'
  | 'DUPLICATE_CFDI'
  | 'EXPIRED_CERTIFICATE'
  | 'INVALID_XML'
  | 'PAC_ERROR'
  | 'UNKNOWN';

export interface StampErrorDetail {
  type: StampError;
  message: string;
  incidencias?: FinkokIncidencia[];
}

// ---- Error Code Mapping ----

const ERROR_CODE_MAP: Record<string, StampError> = {
  '301': 'INVALID_XML',
  '302': 'EXPIRED_CERTIFICATE',
  '303': 'INVALID_RFC',
  '307': 'INVALID_RFC',
  '402': 'DUPLICATE_CFDI',
};

// ---- Build CFDI 4.0 XML ----

export function buildCFDI40Xml(input: StampInput): string {
  const now = new Date().toISOString().replace('Z', '');

  const subtotal = input.conceptos.reduce((sum, c) => sum + c.importe, 0);

  // Calculate total taxes
  let totalTrasladados = 0;
  for (const concepto of input.conceptos) {
    if (concepto.traslados) {
      for (const t of concepto.traslados) {
        totalTrasladados += t.importe ?? 0;
      }
    }
  }

  const total = subtotal + totalTrasladados;

  const conceptosXml = input.conceptos
    .map((c) => {
      const trasladosXml = c.traslados?.length
        ? `<cfdi:Impuestos>
              <cfdi:Traslados>
                ${c.traslados
                  .map(
                    (t) =>
                      `<cfdi:Traslado Base="${t.base.toFixed(2)}" Impuesto="${t.impuesto}" TipoFactor="${t.tipo_factor}"${
                        t.tipo_factor !== 'Exento'
                          ? ` TasaOCuota="${t.tasa_o_cuota}" Importe="${(t.importe ?? 0).toFixed(2)}"`
                          : ''
                      }/>`,
                  )
                  .join('\n                ')}
              </cfdi:Traslados>
            </cfdi:Impuestos>`
        : '';

      return `<cfdi:Concepto
        ClaveProdServ="${c.clave_prod_serv}"
        ClaveUnidad="${c.clave_unidad}"
        Cantidad="${c.cantidad}"
        Unidad="${escapeXml(c.unidad)}"
        Descripcion="${escapeXml(c.descripcion)}"
        ValorUnitario="${c.valor_unitario.toFixed(2)}"
        Importe="${c.importe.toFixed(2)}"
        ObjetoImp="${c.objeto_imp}">
        ${trasladosXml}
      </cfdi:Concepto>`;
    })
    .join('\n      ');

  // Global tax summary
  const globalTaxXml =
    totalTrasladados > 0
      ? `<cfdi:Impuestos TotalImpuestosTrasladados="${totalTrasladados.toFixed(2)}">
      <cfdi:Traslados>
        <cfdi:Traslado Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${totalTrasladados.toFixed(2)}" Base="${subtotal.toFixed(2)}"/>
      </cfdi:Traslados>
    </cfdi:Impuestos>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
  Version="4.0"
  ${input.serie ? `Serie="${escapeXml(input.serie)}"` : ''}
  ${input.folio ? `Folio="${escapeXml(input.folio)}"` : ''}
  Fecha="${now}"
  FormaPago="${input.forma_pago}"
  MetodoPago="${input.metodo_pago}"
  TipoDeComprobante="I"
  Exportacion="${input.exportacion ?? '01'}"
  ${input.condiciones_pago ? `CondicionesDePago="${escapeXml(input.condiciones_pago)}"` : ''}
  LugarExpedicion="${input.emisor.codigo_postal}"
  Moneda="${input.moneda ?? 'MXN'}"
  SubTotal="${subtotal.toFixed(2)}"
  Total="${total.toFixed(2)}">

  <cfdi:Emisor
    Rfc="${escapeXml(input.emisor.rfc)}"
    Nombre="${escapeXml(input.emisor.nombre)}"
    RegimenFiscal="${input.emisor.regimen_fiscal}"/>

  <cfdi:Receptor
    Rfc="${escapeXml(input.receptor.rfc)}"
    Nombre="${escapeXml(input.receptor.nombre)}"
    DomicilioFiscalReceptor="${input.receptor.domicilio_fiscal}"
    RegimenFiscalReceptor="${input.receptor.regimen_fiscal}"
    UsoCFDI="${input.receptor.uso_cfdi}"/>

  <cfdi:Conceptos>
    ${conceptosXml}
  </cfdi:Conceptos>

  ${globalTaxXml}

</cfdi:Comprobante>`;
}

// ---- Stamp CFDI ----

export async function stampCFDI(
  client: FinkokClient,
  input: StampInput,
): Promise<{ result: StampResult } | { error: StampErrorDetail }> {
  const xml = buildCFDI40Xml(input);
  const xmlBase64 = Buffer.from(xml, 'utf-8').toString('base64');

  const soapBody = client.buildSoapEnvelope(
    'stamp:stamp',
    `<xml>${xmlBase64}</xml>`,
  );

  const response: FinkokResponse<string> = await client.request(
    '/servicios/soap/stamp.wsdl',
    soapBody,
  );

  if (!response.success || !response.data) {
    return {
      error: {
        type: 'PAC_ERROR',
        message: response.error?.message ?? 'Stamp request failed',
        incidencias: response.error?.incidencias,
      },
    };
  }

  const responseXml = response.data;

  // Check for incidencias (errors from Finkok)
  const incidencias = parseIncidencias(responseXml);
  if (incidencias.length > 0) {
    const firstCode = incidencias[0].CodigoError;
    return {
      error: {
        type: ERROR_CODE_MAP[firstCode] ?? 'UNKNOWN',
        message: incidencias[0].MensajeIncidencia,
        incidencias,
      },
    };
  }

  // Parse successful stamp response
  const uuid = extractXmlValue(responseXml, 'UUID') ?? '';
  const fechaTimbrado = extractXmlValue(responseXml, 'Fecha') ?? '';
  const selloCfd = extractXmlValue(responseXml, 'SelloCFD') ?? '';
  const selloSat = extractXmlValue(responseXml, 'SelloSAT') ?? '';
  const cadenaOriginal = extractXmlValue(responseXml, 'CadenaOriginalSAT') ?? '';
  const noCertificadoSat = extractXmlValue(responseXml, 'NoCertificadoSAT') ?? '';
  const stampedXml = extractCdataOrValue(responseXml, 'xml') ?? responseXml;

  if (!uuid) {
    return {
      error: {
        type: 'PAC_ERROR',
        message: 'Stamp response did not contain UUID',
      },
    };
  }

  return {
    result: {
      uuid,
      fecha_timbrado: fechaTimbrado,
      sello_cfd: selloCfd,
      sello_sat: selloSat,
      cadena_original: cadenaOriginal,
      no_certificado_sat: noCertificadoSat,
      xml: stampedXml,
    },
  };
}

// ---- XML Helpers ----

function parseIncidencias(xml: string): FinkokIncidencia[] {
  const incidencias: FinkokIncidencia[] = [];
  const regex = /<Incidencia>([\s\S]*?)<\/Incidencia>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const block = match[1];
    incidencias.push({
      IdIncidencia: extractXmlValue(block, 'IdIncidencia') ?? '',
      MensajeIncidencia: extractXmlValue(block, 'MensajeIncidencia') ?? '',
      CodigoError: extractXmlValue(block, 'CodigoError') ?? '',
      ExtraInfo: extractXmlValue(block, 'ExtraInfo') ?? undefined,
    });
  }

  return incidencias;
}

function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = regex.exec(xml);
  return match ? match[1] : null;
}

function extractCdataOrValue(xml: string, tag: string): string | null {
  // Try CDATA first
  const cdataRegex = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
    'i',
  );
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1];

  return extractXmlValue(xml, tag);
}
