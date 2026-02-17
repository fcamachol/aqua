/**
 * Test CFDI Stamping — create test invoice, stamp via Finkok sandbox, verify response
 *
 * Usage:
 *   npx tsx scripts/test-cfdi.ts
 *
 * Requires:
 *   FINKOK_USERNAME, FINKOK_PASSWORD env vars (or defaults to sandbox credentials)
 *   FINKOK_ENVIRONMENT=sandbox (default)
 *
 * Steps:
 *   1. Build a minimal CFDI 4.0 XML for a water service invoice
 *   2. Send to Finkok sandbox for stamping
 *   3. Verify the response and print the UUID
 */

// ─── Configuration ─────────────────────────────────────────────

const FINKOK_USERNAME = process.env.FINKOK_USERNAME ?? 'test@finkok.com';
const FINKOK_PASSWORD = process.env.FINKOK_PASSWORD ?? 'test';
const FINKOK_ENV = process.env.FINKOK_ENVIRONMENT ?? 'sandbox';

const FINKOK_URLS = {
  sandbox: 'https://demo-facturacion.finkok.com/servicios/soap/stamp.wsdl',
  production: 'https://facturacion.finkok.com/servicios/soap/stamp.wsdl',
} as const;

const STAMP_URL = FINKOK_URLS[FINKOK_ENV as keyof typeof FINKOK_URLS] ?? FINKOK_URLS.sandbox;

// ─── Test Invoice Data ─────────────────────────────────────────

const testInvoice = {
  serie: 'A',
  folio: '1001',
  fecha: new Date().toISOString().replace(/\.\d+Z$/, ''),
  formaPago: '01', // Efectivo
  metodoPago: 'PUE', // Pago en una sola exhibicion
  tipoDeComprobante: 'I', // Ingreso
  lugarExpedicion: '76010', // CP Queretaro
  moneda: 'MXN',

  emisor: {
    rfc: 'CEQ850101AAA',
    nombre: 'Comision Estatal de Aguas de Queretaro',
    regimenFiscal: '603', // Personas morales con fines no lucrativos
  },

  receptor: {
    rfc: 'XAXX010101000', // RFC generico publico en general
    nombre: 'PUBLICO EN GENERAL',
    usoCFDI: 'S01', // Sin efectos fiscales
    domicilioFiscalReceptor: '76000',
    regimenFiscalReceptor: '616', // Sin obligaciones fiscales
  },

  conceptos: [
    {
      claveProdServ: '72154503', // Servicios de suministro de agua
      claveUnidad: 'E48', // Servicio
      descripcion: 'Servicio de agua potable - Periodo Enero 2026',
      cantidad: 15, // m3
      valorUnitario: 8.75,
      importe: 131.25,
    },
    {
      claveProdServ: '72141100', // Servicios de alcantarillado
      claveUnidad: 'E48',
      descripcion: 'Servicio de alcantarillado',
      cantidad: 1,
      valorUnitario: 32.81,
      importe: 32.81,
    },
    {
      claveProdServ: '72141100',
      claveUnidad: 'E48',
      descripcion: 'Saneamiento',
      cantidad: 1,
      valorUnitario: 15.00,
      importe: 15.00,
    },
  ],
};

// ─── Build CFDI XML ────────────────────────────────────────────

function buildCfdiXml(): string {
  const subtotal = testInvoice.conceptos.reduce((s, c) => s + c.importe, 0);
  const total = subtotal; // Water services typically IVA exempt

  const conceptosXml = testInvoice.conceptos
    .map(
      (c) =>
        `      <cfdi:Concepto ClaveProdServ="${c.claveProdServ}" Cantidad="${c.cantidad}" ` +
        `ClaveUnidad="${c.claveUnidad}" Descripcion="${c.descripcion}" ` +
        `ValorUnitario="${c.valorUnitario.toFixed(2)}" Importe="${c.importe.toFixed(2)}" ` +
        `ObjetoImp="01" />`, // 01 = No objeto de impuesto
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
  Version="4.0"
  Serie="${testInvoice.serie}"
  Folio="${testInvoice.folio}"
  Fecha="${testInvoice.fecha}"
  FormaPago="${testInvoice.formaPago}"
  MetodoPago="${testInvoice.metodoPago}"
  TipoDeComprobante="${testInvoice.tipoDeComprobante}"
  LugarExpedicion="${testInvoice.lugarExpedicion}"
  Moneda="${testInvoice.moneda}"
  SubTotal="${subtotal.toFixed(2)}"
  Total="${total.toFixed(2)}"
  Exportacion="01">
  <cfdi:Emisor Rfc="${testInvoice.emisor.rfc}" Nombre="${testInvoice.emisor.nombre}" RegimenFiscal="${testInvoice.emisor.regimenFiscal}" />
  <cfdi:Receptor Rfc="${testInvoice.receptor.rfc}" Nombre="${testInvoice.receptor.nombre}" UsoCFDI="${testInvoice.receptor.usoCFDI}" DomicilioFiscalReceptor="${testInvoice.receptor.domicilioFiscalReceptor}" RegimenFiscalReceptor="${testInvoice.receptor.regimenFiscalReceptor}" />
  <cfdi:Conceptos>
${conceptosXml}
  </cfdi:Conceptos>
</cfdi:Comprobante>`;
}

// ─── SOAP Envelope ─────────────────────────────────────────────

function buildSoapEnvelope(cfdiXml: string): string {
  const xmlBase64 = Buffer.from(cfdiXml, 'utf-8').toString('base64');

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:stamp="apps.services.soap.core.views">
  <soapenv:Header/>
  <soapenv:Body>
    <stamp:stamp>
      <stamp:xml>${xmlBase64}</stamp:xml>
      <stamp:username>${FINKOK_USERNAME}</stamp:username>
      <stamp:password>${FINKOK_PASSWORD}</stamp:password>
    </stamp:stamp>
  </soapenv:Body>
</soapenv:Envelope>`;
}

// ─── Main ──────────────────────────────────────────────────────

async function testCfdi() {
  console.log('=== CFDI 4.0 Test Stamp ===\n');
  console.log(`Environment: ${FINKOK_ENV}`);
  console.log(`Stamp URL:   ${STAMP_URL}`);
  console.log(`Username:    ${FINKOK_USERNAME}\n`);

  // 1. Build CFDI XML
  const cfdiXml = buildCfdiXml();
  console.log('--- Generated CFDI XML ---');
  console.log(cfdiXml);
  console.log('\n--- End XML ---\n');

  // 2. Send to Finkok
  console.log('Sending to Finkok for stamping...');

  const soapEnvelope = buildSoapEnvelope(cfdiXml);

  try {
    const response = await fetch(STAMP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: '',
      },
      body: soapEnvelope,
    });

    const responseText = await response.text();

    console.log(`\nHTTP Status: ${response.status}`);

    // 3. Parse response for UUID
    const uuidMatch = responseText.match(/<UUID>(.*?)<\/UUID>/);
    const statusMatch = responseText.match(/<CodEstatus>(.*?)<\/CodEstatus>/);
    const errorMatch = responseText.match(/<Incidencias>.*?<CodigoError>(.*?)<\/CodigoError>.*?<MensajeIncidencia>(.*?)<\/MensajeIncidencia>/s);

    if (uuidMatch) {
      console.log('\n=== STAMP SUCCESSFUL ===');
      console.log(`UUID (Folio Fiscal): ${uuidMatch[1]}`);
      if (statusMatch) {
        console.log(`Status: ${statusMatch[1]}`);
      }
    } else if (errorMatch) {
      console.log('\n=== STAMP ERROR ===');
      console.log(`Error Code:    ${errorMatch[1]}`);
      console.log(`Error Message: ${errorMatch[2]}`);
    } else {
      console.log('\n=== RAW RESPONSE ===');
      console.log(responseText.substring(0, 2000));
    }

    if (FINKOK_ENV === 'sandbox') {
      console.log('\nNote: Sandbox stamps are not valid for SAT. Use production credentials for real invoices.');
    }
  } catch (err) {
    console.error('\nFailed to connect to Finkok:');
    console.error(err instanceof Error ? err.message : err);
    console.log('\nMake sure you have valid Finkok credentials and network access.');
  }
}

testCfdi().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
