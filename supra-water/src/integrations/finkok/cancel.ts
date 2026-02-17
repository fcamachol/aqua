// =============================================================
// CFDI Cancellation — Finkok PAC — SUPRA Water 2026 §7.1
// =============================================================

import { FinkokClient, escapeXml, type FinkokResponse, type FinkokIncidencia } from './client.js';

/**
 * SAT cancellation motivos:
 *   01 - Comprobante emitido con errores con relacion
 *   02 - Comprobante emitido con errores sin relacion
 *   03 - No se llevo a cabo la operacion
 *   04 - Operacion nominativa relacionada en la factura global
 */
export type CancelMotivo = '01' | '02' | '03' | '04';

export interface CancelInput {
  /** UUID (folio fiscal) of the CFDI to cancel */
  uuid: string;
  /** RFC of the emisor (must match the certificate) */
  rfc_emisor: string;
  /** Cancellation reason code */
  motivo: CancelMotivo;
  /** UUID of the replacement CFDI (required when motivo = '01') */
  folio_sustitucion?: string;
}

export type CancelStatus =
  | 'Cancelado'          // Successfully cancelled
  | 'En proceso'         // Pending acceptance by receptor
  | 'Rechazado'          // Receptor rejected cancellation
  | 'No Cancelable';     // SAT says CFDI cannot be cancelled

export interface CancelResult {
  uuid: string;
  estatus_uuid: CancelStatus;
  estatus_cancelacion: string;
  fecha?: string;
}

export interface CancelError {
  code: string;
  message: string;
  incidencias?: FinkokIncidencia[];
}

/**
 * Cancel a stamped CFDI via Finkok.
 *
 * Motivo 01 requires folio_sustitucion (the UUID of the replacement CFDI).
 * Motivos 02, 03, 04 do not require a replacement UUID.
 */
export async function cancelCFDI(
  client: FinkokClient,
  input: CancelInput,
): Promise<{ result: CancelResult } | { error: CancelError }> {
  // Validate: motivo 01 requires replacement UUID
  if (input.motivo === '01' && !input.folio_sustitucion) {
    return {
      error: {
        code: 'MISSING_FOLIO_SUSTITUCION',
        message: 'Motivo 01 requires folio_sustitucion (replacement CFDI UUID)',
      },
    };
  }

  const uuidsXml = `<UUIDS>
    <UUID>${escapeXml(input.uuid)}</UUID>
    <RFC>${escapeXml(input.rfc_emisor)}</RFC>
    <Motivo>${input.motivo}</Motivo>
    ${input.folio_sustitucion ? `<FolioSustitucion>${escapeXml(input.folio_sustitucion)}</FolioSustitucion>` : ''}
  </UUIDS>`;

  const soapBody = client.buildSoapEnvelope(
    'cancel:cancel',
    `<UUIDS><UUIDS_List>${uuidsXml}</UUIDS_List></UUIDS>
     <taxpayer_id>${escapeXml(input.rfc_emisor)}</taxpayer_id>`,
  );

  const response: FinkokResponse<string> = await client.request(
    '/servicios/soap/cancel.wsdl',
    soapBody,
  );

  if (!response.success || !response.data) {
    return {
      error: {
        code: 'PAC_ERROR',
        message: response.error?.message ?? 'Cancel request failed',
        incidencias: response.error?.incidencias,
      },
    };
  }

  const xml = response.data;

  // Check for error incidencias
  const incidencias = parseCancelIncidencias(xml);
  if (incidencias.length > 0) {
    return {
      error: {
        code: incidencias[0].CodigoError,
        message: incidencias[0].MensajeIncidencia,
        incidencias,
      },
    };
  }

  // Parse cancellation response
  const estatusUuid = extractValue(xml, 'EstatusUUID') as CancelStatus ?? 'Rechazado';
  const estatusCancelacion = extractValue(xml, 'EstatusCancelacion') ?? '';
  const fecha = extractValue(xml, 'Fecha') ?? undefined;

  return {
    result: {
      uuid: input.uuid,
      estatus_uuid: estatusUuid,
      estatus_cancelacion: estatusCancelacion,
      fecha,
    },
  };
}

/**
 * Check the cancellation status of a previously submitted cancel request.
 */
export async function getCancelStatus(
  client: FinkokClient,
  uuid: string,
  rfcEmisor: string,
): Promise<{ result: CancelResult } | { error: CancelError }> {
  const soapBody = client.buildSoapEnvelope(
    'cancel:get_sat_status',
    `<taxpayer_id>${escapeXml(rfcEmisor)}</taxpayer_id>
     <uuid>${escapeXml(uuid)}</uuid>`,
  );

  const response: FinkokResponse<string> = await client.request(
    '/servicios/soap/cancel.wsdl',
    soapBody,
  );

  if (!response.success || !response.data) {
    return {
      error: {
        code: 'PAC_ERROR',
        message: response.error?.message ?? 'Status request failed',
      },
    };
  }

  const xml = response.data;
  const estatusUuid = extractValue(xml, 'EstatusUUID') as CancelStatus ?? 'Rechazado';
  const estatusCancelacion = extractValue(xml, 'EstatusCancelacion') ?? extractValue(xml, 'Estado') ?? '';

  return {
    result: {
      uuid,
      estatus_uuid: estatusUuid,
      estatus_cancelacion: estatusCancelacion,
    },
  };
}

// ---- XML Helpers ----

function parseCancelIncidencias(xml: string): FinkokIncidencia[] {
  const incidencias: FinkokIncidencia[] = [];
  const regex = /<Incidencia>([\s\S]*?)<\/Incidencia>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const block = match[1];
    incidencias.push({
      IdIncidencia: extractValue(block, 'IdIncidencia') ?? '',
      MensajeIncidencia: extractValue(block, 'MensajeIncidencia') ?? '',
      CodigoError: extractValue(block, 'CodigoError') ?? '',
      ExtraInfo: extractValue(block, 'ExtraInfo') ?? undefined,
    });
  }

  return incidencias;
}

function extractValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = regex.exec(xml);
  return match ? match[1] : null;
}
