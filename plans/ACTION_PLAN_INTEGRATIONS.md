# ACTION PLAN: Integration Layer
## SUPRA Water 2026 — CEA Queretaro

**Role:** Integration Specialist
**Date:** 2026-02-16
**Status:** DRAFT
**Dependencies:** Backend API (fullstack), DevOps (infrastructure), AI Agents (agent architecture), Database (schema)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [CFDI 4.0 Integration (Finkok PAC)](#2-cfdi-40-integration-finkok-pac)
3. [Payment Gateway Integrations](#3-payment-gateway-integrations)
4. [Communication Integrations](#4-communication-integrations)
5. [CRM Integration (Chatwoot/AGORA)](#5-crm-integration-chatwootagora)
6. [Legacy AquaCIS Bridge (Strangler Fig)](#6-legacy-aquacis-bridge-strangler-fig)
7. [Accounting Integration](#7-accounting-integration)
8. [Integration Testing Strategy](#8-integration-testing-strategy)
9. [Sprint-by-Sprint Integration Delivery](#9-sprint-by-sprint-integration-delivery)

---

## 1. Executive Summary

### Scope

This plan defines every external integration SUPRA Water 2026 must implement to become CEA Queretaro's operational CIS. There are **7 integration domains** comprising **20+ distinct provider connections**:

| Domain | Providers / Systems | Business Criticality |
|--------|---------------------|:--------------------:|
| **Fiscal (CFDI)** | Finkok PAC, SAT catalogs | CRITICAL |
| **Payments** | STP/SPEI, Conekta (OXXO + Cards), CoDi/DiMo, Domiciliacion bancaria, Ventanilla POS | CRITICAL |
| **Communication** | WhatsApp Business API (360dialog/Meta), Twilio (Voice + SMS), AWS SES/SendGrid | HIGH |
| **CRM** | Chatwoot (AGORA) existing installation | HIGH |
| **Legacy Bridge** | AquaCIS 5 SOAP services (126 operations) | CRITICAL |
| **Accounting** | SAP/CONTPAQi | MEDIUM |
| **Government** | CONAGUA, SEMARNAT (reporting APIs) | MEDIUM |

### Key Constraints

1. **Provider account setup lead times** — Finkok sandbox: 1-2 days; Finkok production: 1-2 weeks; WhatsApp Business API approval: 2-4 weeks; WhatsApp template pre-approval: 1-4 weeks; Conekta merchant account: 1-3 weeks; STP CLABE concentradora: 2-4 weeks; Twilio Mexican numbers: 1-2 weeks.
2. **Regulatory deadlines** — CFDI 4.0 is mandatory for all invoicing. No grace period.
3. **Legacy coexistence** — AquaCIS remains operational during the entire migration. All 17 currently integrated SOAP operations must continue working while new ones are added and the architecture transitions to BFF.
4. **Single data truth** — During migration, payment and billing data must be consistent across legacy AquaCIS and SUPRA. Double-entry is unacceptable for financial operations.

---

## 2. CFDI 4.0 Integration (Finkok PAC)

### 2.1 Overview

All invoices issued by CEA Queretaro must be CFDI 4.0 compliant, stamped by an authorized PAC (Proveedor Autorizado de Certificacion). Finkok is the selected PAC for SUPRA.

**Monthly volume estimate:** ~400,000 accounts, bimonthly billing = ~200,000 CFDI stamps/month peak. Finkok pricing is typically per-stamp (MXN $0.50-$2.00 depending on volume tier).

### 2.2 Finkok API Endpoints

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| **Sandbox** | `https://demo-facturacion.finkok.com/servicios/soap/` | Development and testing |
| **Production** | `https://facturacion.finkok.com/servicios/soap/` | Live stamping |

**Core services:**

| Service | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| `stamp` | `/stamp` | POST (SOAP/REST) | Stamp a CFDI XML, returns UUID + XML timbrado |
| `cancel` | `/cancel` | POST | Cancel a previously stamped CFDI (requires UUID + RFC + certificate) |
| `get_status` | `/query` | GET/POST | Query stamping status by UUID |
| `get_xml` | `/utilities/query` | GET | Retrieve stamped XML by UUID |
| `get_acuse` | `/cancel` | POST | Get SAT cancellation acknowledgement |
| `get_related` | `/utilities/query` | POST | Get CFDIs related to a given UUID (for complemento de pago) |

### 2.3 CFDI 4.0 XML Structure for Water Utility Invoices

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital"
  Version="4.0"
  Serie="CEA"
  Folio="{{invoice_number}}"
  Fecha="{{iso_datetime}}"
  FormaPago="{{payment_method_code}}"
  MetodoPago="{{PUE_or_PPD}}"
  TipoDeComprobante="I"
  LugarExpedicion="76000"
  Moneda="MXN"
  SubTotal="{{subtotal}}"
  Total="{{total}}"
  Exportacion="01"
  Sello="{{digital_seal}}"
  NoCertificado="{{cert_number}}"
  Certificado="{{base64_cert}}">

  <cfdi:Emisor
    Rfc="{{CEA_RFC}}"
    Nombre="COMISION ESTATAL DE AGUAS DE QUERETARO"
    RegimenFiscal="603" />

  <cfdi:Receptor
    Rfc="{{customer_rfc_or_XAXX010101000}}"
    Nombre="{{customer_name}}"
    DomicilioFiscalReceptor="{{customer_zip_code}}"
    RegimenFiscalReceptor="{{customer_fiscal_regime}}"
    UsoCFDI="{{G03_or_S01_or_P01}}" />

  <cfdi:Conceptos>
    <!-- Water service -->
    <cfdi:Concepto
      ClaveProdServ="10171500"
      ClaveUnidad="MTQ"
      Cantidad="{{consumption_m3}}"
      Descripcion="Servicio de agua potable"
      ValorUnitario="{{unit_price}}"
      Importe="{{line_total}}"
      ObjetoImp="01">
      <!-- IVA exempt for domestic, 16% for commercial -->
    </cfdi:Concepto>

    <!-- Alcantarillado -->
    <cfdi:Concepto
      ClaveProdServ="72151802"
      ClaveUnidad="E48"
      Cantidad="1"
      Descripcion="Servicio de alcantarillado"
      ValorUnitario="{{alcantarillado_amount}}"
      Importe="{{alcantarillado_amount}}"
      ObjetoImp="01" />

    <!-- Saneamiento -->
    <cfdi:Concepto
      ClaveProdServ="72151801"
      ClaveUnidad="E48"
      Cantidad="1"
      Descripcion="Tratamiento de aguas residuales (saneamiento)"
      ValorUnitario="{{saneamiento_amount}}"
      Importe="{{saneamiento_amount}}"
      ObjetoImp="01" />

    <!-- Reconexion (when applicable) -->
    <cfdi:Concepto
      ClaveProdServ="72151800"
      ClaveUnidad="E48"
      Cantidad="1"
      Descripcion="Reconexion de servicio de agua"
      ValorUnitario="{{reconexion_fee}}"
      Importe="{{reconexion_fee}}"
      ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="{{reconexion_fee}}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="{{iva_amount}}" />
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
</cfdi:Comprobante>
```

### 2.4 Complete SAT Catalog Code Mapping

```typescript
// src/integrations/cfdi/sat-catalogs.ts

export const SAT_CATALOGS = {
  // ---- Product/Service Keys (c_ClaveProdServ) ----
  product_service_keys: {
    agua_potable:       '10171500',   // Agua
    alcantarillado:     '72151802',   // Servicios de alcantarillado
    saneamiento:        '72151801',   // Tratamiento de aguas residuales
    reconexion:         '72151800',   // Servicios de agua/alcantarillado (generic)
    cuota_fija:         '10171500',   // Cuota fija uses same agua key
    multa:              '80141600',   // Servicios de gestion de multas
    deposito_garantia:  '80141900',   // Servicios de gestion financiera
  },

  // ---- Unit Keys (c_ClaveUnidad) ----
  unit_keys: {
    m3:        'MTQ',    // Metro cubico
    servicio:  'E48',    // Unidad de servicio
    pieza:     'H87',    // Pieza
    actividad: 'ACT',    // Actividad (for flat rates)
    litro:     'LTR',    // Litro (for bulk water sales)
  },

  // ---- Payment Methods (c_FormaPago) ----
  payment_methods: {
    efectivo:            '01',   // Cash at ventanilla
    cheque_nominativo:   '02',   // Nominative check
    transferencia:       '03',   // SPEI bank transfer
    tarjeta_credito:     '04',   // Credit card
    monedero_electronico:'05',   // Electronic wallet (CoDi/DiMo)
    dinero_electronico:  '06',   // Electronic money
    tarjeta_debito:      '28',   // Debit card
    tarjeta_servicios:   '29',   // Services card
    intermediario_pago:  '31',   // Payment intermediary (OXXO via Conekta)
    por_definir:         '99',   // To be defined (for PPD invoices)
  },

  // ---- Payment Forms (c_MetodoPago) ----
  payment_forms: {
    pago_unico:    'PUE',   // Pago en Una sola Exhibicion
    parcialidades: 'PPD',   // Pago en Parcialidades o Diferido
  },

  // ---- Fiscal Regimes (c_RegimenFiscal) ----
  fiscal_regimes: {
    general_ley_pm:        '601',   // General de Ley Personas Morales
    gobierno:              '603',   // Personas Morales con Fines no Lucrativos (CEA)
    sueldos_salarios:      '605',   // Sueldos y Salarios
    sin_obligaciones:      '616',   // Sin obligaciones fiscales
    regimen_simplificado:  '626',   // Resico (Regimen Simplificado de Confianza)
  },

  // ---- CFDI Uses (c_UsoCFDI) ----
  cfdi_uses: {
    gastos_general:   'G03',   // Gastos en general
    sin_efectos:      'S01',   // Sin efectos fiscales
    por_definir:      'P01',   // Por definir (for PPD)
  },

  // ---- Tax Object (c_ObjetoImp) ----
  tax_object: {
    no_objeto:       '01',   // No objeto de impuesto (agua domestica)
    si_objeto:       '02',   // Si objeto de impuesto (agua comercial, reconexion)
    si_no_obligado:  '03',   // Si objeto, no obligado al desglose
  },

  // ---- Cancellation Reasons (c_MotivoCancelacion) ----
  cancellation_reasons: {
    comprobante_errores:      '01',   // Comprobante emitido con errores con relacion
    comprobante_sin_relacion: '02',   // Comprobante emitido con errores sin relacion
    no_se_llevo_operacion:    '03',   // No se llevo a cabo la operacion
    operacion_nominativa:     '04',   // Operacion nominativa relacionada en global
  },

  // ---- Special RFC values ----
  rfc_publico_general: 'XAXX010101000',  // Publico en general (no RFC provided)
  rfc_extranjero:      'XEXX010101000',  // Persona extranjera

  // ---- CEA Queretaro specifics ----
  emisor: {
    rfc: process.env.CEA_RFC!,
    nombre: 'COMISION ESTATAL DE AGUAS DE QUERETARO',
    regimen_fiscal: '603',
    lugar_expedicion: '76000',  // CP of CEA offices
  },
} as const;

// IVA Rules for water services
export function getIVARate(tomaType: string, conceptCode: string): number {
  // Domestic water service: IVA exempt (tasa 0%)
  if (tomaType === 'domestica' && ['agua_potable', 'alcantarillado', 'saneamiento'].includes(conceptCode)) {
    return 0;
  }
  // Commercial, industrial, government: 16% IVA
  if (['comercial', 'industrial', 'gobierno'].includes(tomaType)) {
    return 0.16;
  }
  // Reconexion and special services always have 16% IVA
  if (['reconexion', 'multa'].includes(conceptCode)) {
    return 0.16;
  }
  return 0;
}
```

### 2.5 Complemento de Pago (PPD Handling)

When invoices use `MetodoPago: PPD` (payment in installments or deferred), a separate CFDI "Complemento de Pago" must be issued each time a payment is received.

```typescript
// src/integrations/cfdi/complemento-pago.ts

interface ComplementoPagoInput {
  original_cfdi_uuid: string;    // UUID of the PPD invoice
  payment_date: string;          // ISO date of payment
  payment_method: string;        // SAT code (01, 03, 04, etc.)
  amount: number;                // Amount paid
  currency: 'MXN';
  rfc_emisor_banco?: string;     // Bank RFC (for transfers)
  cuenta_ordenante?: string;     // Payer's account (last 4 digits for card)
  rfc_emisor_cta_ben?: string;   // Beneficiary bank RFC
  cuenta_beneficiario?: string;  // CEA's account (CLABE for SPEI)
  remaining_balance: number;     // Saldo insoluto after this payment
  installment_number: number;    // Parcialidad number
  previous_balance: number;      // Saldo anterior
}

async function generateComplementoPago(input: ComplementoPagoInput): Promise<string> {
  const xml = buildComplementoPagoXML(input);
  const stamped = await finkokClient.stamp(xml);
  return stamped.uuid;
}

// Complemento de Pago 2.0 XML structure
function buildComplementoPagoXML(input: ComplementoPagoInput): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante Version="4.0" Serie="PAGO" TipoDeComprobante="P"
  Moneda="XXX" SubTotal="0" Total="0" LugarExpedicion="76000"
  Exportacion="01">
  <cfdi:Emisor Rfc="${SAT_CATALOGS.emisor.rfc}"
    Nombre="${SAT_CATALOGS.emisor.nombre}"
    RegimenFiscal="603" />
  <cfdi:Receptor ... />
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="84111506" ClaveUnidad="ACT"
      Cantidad="1" Descripcion="Pago" ValorUnitario="0" Importe="0"
      ObjetoImp="01" />
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <pago20:Pagos Version="2.0">
      <pago20:Totales MontoTotalPagos="${input.amount}" />
      <pago20:Pago FechaPago="${input.payment_date}"
        FormaDePagoP="${input.payment_method}" MonedaP="MXN"
        Monto="${input.amount}" TipoCambioP="1">
        <pago20:DoctoRelacionado
          IdDocumento="${input.original_cfdi_uuid}"
          Serie="CEA" MonedaDR="MXN"
          NumParcialidad="${input.installment_number}"
          ImpSaldoAnt="${input.previous_balance}"
          ImpPagado="${input.amount}"
          ImpSaldoInsoluto="${input.remaining_balance}"
          ObjetoImpDR="01"
          EquivalenciaDR="1" />
      </pago20:Pago>
    </pago20:Pagos>
  </cfdi:Complemento>
</cfdi:Comprobante>`;
}
```

### 2.6 Finkok Stamping Service

```typescript
// src/integrations/cfdi/finkok-client.ts

import axios from 'axios';

interface FinkokConfig {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
}

interface StampResult {
  success: boolean;
  uuid: string;
  xml_timbrado: string;         // Full stamped XML
  cadena_original_sat: string;
  sello_sat: string;
  fecha_timbrado: string;
  no_certificado_sat: string;
  error?: { code: string; message: string };
}

interface CancelResult {
  success: boolean;
  acuse: string;               // SAT acknowledgement XML
  status: string;              // 'Cancelado' | 'En proceso' | 'Rechazado'
  error?: { code: string; message: string };
}

class FinkokClient {
  private baseUrl: string;
  private credentials: { username: string; password: string };

  constructor(config: FinkokConfig) {
    this.baseUrl = config.environment === 'production'
      ? 'https://facturacion.finkok.com/servicios/soap'
      : 'https://demo-facturacion.finkok.com/servicios/soap';
    this.credentials = { username: config.username, password: config.password };
  }

  async stamp(xmlContent: string): Promise<StampResult> {
    // Finkok stamp SOAP envelope
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:stamp="http://stamp.finkok.com">
  <soapenv:Body>
    <stamp:stamp>
      <stamp:xml><![CDATA[${xmlContent}]]></stamp:xml>
      <stamp:username>${this.credentials.username}</stamp:username>
      <stamp:password>${this.credentials.password}</stamp:password>
    </stamp:stamp>
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await axios.post(`${this.baseUrl}/stamp`, soapEnvelope, {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      timeout: 30000,
    });

    return this.parseStampResponse(response.data);
  }

  async cancel(uuid: string, rfcEmisor: string, cerB64: string, keyB64: string, password: string): Promise<CancelResult> {
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:can="http://cancel.finkok.com">
  <soapenv:Body>
    <can:cancel>
      <can:UUIDS>
        <can:uuids>
          <can:uuid>${uuid}</can:uuid>
        </can:uuids>
      </can:UUIDS>
      <can:username>${this.credentials.username}</can:username>
      <can:password>${this.credentials.password}</can:password>
      <can:taxpayer_id>${rfcEmisor}</can:taxpayer_id>
      <can:cer>${cerB64}</can:cer>
      <can:key>${keyB64}</can:key>
      <can:store_pending>true</can:store_pending>
    </can:cancel>
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await axios.post(`${this.baseUrl}/cancel`, soapEnvelope, {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      timeout: 30000,
    });

    return this.parseCancelResponse(response.data);
  }

  async getStatus(uuid: string): Promise<{ status: string; cancellable: boolean }> {
    // Query SAT validation status via Finkok
    const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:quer="http://query.finkok.com">
  <soapenv:Body>
    <quer:query_pending>
      <quer:uuid>${uuid}</quer:uuid>
      <quer:username>${this.credentials.username}</quer:username>
      <quer:password>${this.credentials.password}</quer:password>
      <quer:taxpayer_id>${SAT_CATALOGS.emisor.rfc}</quer:taxpayer_id>
    </quer:query_pending>
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await axios.post(`${this.baseUrl}/Utilities`, soapEnvelope, {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      timeout: 15000,
    });

    return this.parseStatusResponse(response.data);
  }

  private parseStampResponse(xml: string): StampResult { /* XML parsing logic */ }
  private parseCancelResponse(xml: string): CancelResult { /* XML parsing logic */ }
  private parseStatusResponse(xml: string): { status: string; cancellable: boolean } { /* XML parsing logic */ }
}

export const finkokClient = new FinkokClient({
  username: process.env.FINKOK_USERNAME!,
  password: process.env.FINKOK_PASSWORD!,
  environment: (process.env.FINKOK_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
});
```

### 2.7 Error Handling and Retry Logic

```typescript
// src/integrations/cfdi/cfdi-service.ts

const FINKOK_RETRYABLE_ERRORS = [
  'TIMEOUT',
  '503',           // Service unavailable
  '500',           // Internal server error (transient)
  'ECONNRESET',
  'ECONNREFUSED',
];

const FINKOK_NON_RETRYABLE_ERRORS = [
  '301',   // XML mal formado
  '302',   // Sello del emisor invalido
  '303',   // Certificado revocado
  '304',   // Certificado no corresponde al emisor
  '305',   // Fecha de emision no vigente
  '401',   // Fecha fuera de rango
  '402',   // RFC del receptor no registrado en SAT
];

async function stampWithRetry(xml: string, maxRetries = 3): Promise<StampResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await finkokClient.stamp(xml);

      if (result.success) {
        // Log successful stamp
        await logCFDIEvent('stamp_success', { uuid: result.uuid, attempt });
        return result;
      }

      // Check if error is retryable
      if (result.error && FINKOK_NON_RETRYABLE_ERRORS.includes(result.error.code)) {
        await logCFDIEvent('stamp_permanent_failure', {
          error: result.error,
          attempt,
        });
        throw new CFDIStampError(result.error.code, result.error.message);
      }

      lastError = new Error(`Finkok error: ${result.error?.message}`);
    } catch (err) {
      lastError = err as Error;

      if (!isRetryable(err)) {
        throw err;
      }
    }

    // Exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries) {
      await sleep(1000 * Math.pow(2, attempt - 1));
    }
  }

  await logCFDIEvent('stamp_exhausted_retries', { error: lastError?.message });
  throw lastError;
}
```

### 2.8 Certificate Management

```typescript
// src/integrations/cfdi/certificate-manager.ts

// CEA's digital certificates are stored encrypted in the database
// .cer = public certificate (X.509)
// .key = private key (PKCS#8 DER encrypted)
// password = key to decrypt the .key file

interface CertificateConfig {
  // Stored in environment / secrets manager, NOT in code
  cer_path: string;         // Path to .cer file or base64 in env
  key_path: string;         // Path to .key file or base64 in env
  key_password: string;     // Password to decrypt .key
}

// Certificate rotation monitoring
// SAT certificates expire every 4 years
// Alert 90 days before expiration
async function checkCertificateExpiration(): Promise<{
  expires_at: Date;
  days_remaining: number;
  needs_renewal: boolean;
}> {
  const cert = loadCertificate(process.env.CSD_CER_BASE64!);
  const expiresAt = cert.validity.notAfter;
  const daysRemaining = Math.floor((expiresAt.getTime() - Date.now()) / 86400000);

  return {
    expires_at: expiresAt,
    days_remaining: daysRemaining,
    needs_renewal: daysRemaining < 90,
  };
}
```

### 2.9 Sandbox vs Production Setup

| Aspect | Sandbox | Production |
|--------|---------|------------|
| **URL** | `demo-facturacion.finkok.com` | `facturacion.finkok.com` |
| **Credentials** | Test user/password from Finkok | Production credentials |
| **Certificates** | Finkok provides test CSD (.cer/.key) | CEA Queretaro's real CSD from SAT |
| **RFC Emisor** | `EKU9003173C9` (Finkok test RFC) | CEA's real RFC |
| **RFC Receptor** | Any valid test RFC | Real customer RFCs |
| **SAT Validation** | Not validated against SAT | Validated in real time |
| **Switch** | `FINKOK_ENVIRONMENT=sandbox` | `FINKOK_ENVIRONMENT=production` |

**Action items for production cutover:**
1. Obtain CSD (Certificado de Sello Digital) from SAT for CEA Queretaro
2. Register CSD with Finkok via their portal
3. Validate test stamps in sandbox with real XML structures
4. Switch environment variable and run integration tests against production
5. Stamp a test invoice and validate at `verificacfdi.facturaelectronica.sat.gob.mx`

---

## 3. Payment Gateway Integrations

### 3.1 SPEI (Sistema de Pagos Electronicos Interbancarios)

**Architecture:** CEA gets a CLABE concentradora (master account) from STP (Sistema de Transferencias y Pagos). Each invoice gets a unique reference embedded in the CLABE or concepto field, enabling automatic reconciliation.

```typescript
// src/integrations/payments/spei-config.ts

export const SPEI_CONFIG = {
  bank: 'STP',                                  // Sistema de Transferencias y Pagos
  clabe_concentradora: process.env.SPEI_CLABE!, // 18-digit CLABE
  reference_format: '{contract_number}-{invoice_seq}',
  webhook_url: '/api/v1/payments/spei/webhook',
  reconciliation: 'real-time',                   // STP sends webhook per transaction
};

// Generate a unique SPEI reference for an invoice
function generateSPEIReference(contractNumber: number, invoiceSeq: number): string {
  // 7-digit numeric reference that maps to invoice
  // Format: CCCCCII where C=contract(5), I=invoice_seq(2)
  const ref = `${String(contractNumber).padStart(5, '0')}${String(invoiceSeq).padStart(2, '0')}`;
  return ref;
}
```

**SPEI Webhook Payload (from STP):**

```json
{
  "id": "evt_spei_123456",
  "type": "spei.payment.received",
  "data": {
    "clabe_destino": "646180110400000001",
    "clabe_origen": "012345678901234567",
    "monto": 456.78,
    "concepto": "442761-01",
    "referencia_numerica": "4427610",
    "fecha_operacion": "2026-03-15",
    "nombre_ordenante": "JUAN PEREZ GOMEZ",
    "rfc_curp_ordenante": "PEGJ800101XXX",
    "institucion_contraparte": "40012"
  }
}
```

```typescript
// src/integrations/payments/spei-webhook.ts

import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

router.post('/api/v1/payments/spei/webhook', async (req, res) => {
  // 1. Validate webhook signature (STP uses HMAC-SHA256)
  const signature = req.headers['x-stp-signature'] as string;
  const expectedSig = crypto
    .createHmac('sha256', process.env.STP_WEBHOOK_SECRET!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSig) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { concepto, monto, referencia_numerica, fecha_operacion } = req.body.data;

  // 2. Parse reference to find invoice
  const invoice = await findInvoiceByReference(concepto || referencia_numerica);
  if (!invoice) {
    await logUnmatchedPayment('spei', req.body);
    return res.status(200).json({ status: 'unmatched', queued: true });
  }

  // 3. Process payment
  await processPayment({
    invoice_id: invoice.id,
    amount: monto,
    payment_method: '03',       // SAT code for transferencia
    channel: 'spei',
    transaction_data: req.body.data,
    payment_date: fecha_operacion,
  });

  // 4. Acknowledge to STP
  res.status(200).json({ status: 'processed' });
});

export default router;
```

### 3.2 OXXO (via Conekta)

**Flow:** Customer receives barcode on invoice/WhatsApp -> presents at any OXXO store -> OXXO scans barcode -> Conekta processes -> webhook to SUPRA -> reconciliation.

```typescript
// src/integrations/payments/oxxo-config.ts

export const OXXO_CONFIG = {
  provider: 'conekta',
  api_base: 'https://api.conekta.io',
  api_version: '2.1.0',
  reference_format: 'barcode_128',
  expiration_days: 30,
  webhook_url: '/api/v1/payments/oxxo/webhook',
  reconciliation: 'batch_daily',    // Conekta sends daily batch at ~6am
  max_amount: 10000,                // OXXO max single payment: MXN $10,000
};

// Generate OXXO payment reference via Conekta
async function createOXXOReference(invoice: Invoice): Promise<{
  barcode: string;
  barcode_url: string;
  reference: string;
  expires_at: string;
}> {
  const response = await fetch(`${OXXO_CONFIG.api_base}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CONEKTA_PRIVATE_KEY}`,
      'Accept': 'application/vnd.conekta-v2.1.0+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: 'MXN',
      customer_info: {
        name: invoice.customer_name,
        email: invoice.customer_email || 'noemail@ceaqueretaro.gob.mx',
        phone: invoice.customer_phone || '+520000000000',
      },
      line_items: [{
        name: `Recibo de agua - Contrato ${invoice.contract_number}`,
        unit_price: Math.round(invoice.total * 100),  // Conekta uses centavos
        quantity: 1,
      }],
      charges: [{
        payment_method: {
          type: 'oxxo_cash',
          expires_at: Math.floor(Date.now() / 1000) + (OXXO_CONFIG.expiration_days * 86400),
        },
      }],
      metadata: {
        invoice_id: invoice.id,
        contract_number: invoice.contract_number,
        supra_environment: process.env.NODE_ENV,
      },
    }),
  });

  const order = await response.json();
  const charge = order.charges.data[0];

  return {
    barcode: charge.payment_method.barcode,
    barcode_url: charge.payment_method.barcode_url,
    reference: charge.payment_method.reference,
    expires_at: new Date(charge.payment_method.expires_at * 1000).toISOString(),
  };
}
```

**Conekta OXXO Webhook:**

```json
{
  "type": "charge.paid",
  "data": {
    "object": {
      "id": "chr_2sGVPcgqPZKmT",
      "amount": 45678,
      "currency": "MXN",
      "payment_method": {
        "type": "oxxo_cash",
        "reference": "93000262280678",
        "barcode_url": "https://pay.conekta.com/barcode/93000262280678",
        "store_name": "OXXO",
        "auth_code": "123456"
      },
      "order_id": "ord_2sGVPcgqPZKmS",
      "paid_at": 1710532800
    }
  }
}
```

```typescript
// src/integrations/payments/conekta-webhook.ts

router.post('/api/v1/payments/oxxo/webhook', async (req, res) => {
  // 1. Verify Conekta webhook signature
  const signature = req.headers['digest'] as string;
  if (!verifyConektaSignature(req.rawBody, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { type, data } = req.body;

  if (type === 'charge.paid') {
    const charge = data.object;
    const orderId = charge.order_id;

    // 2. Lookup invoice by Conekta order metadata
    const order = await getConektaOrder(orderId);
    const invoiceId = order.metadata.invoice_id;

    // 3. Process payment
    await processPayment({
      invoice_id: invoiceId,
      amount: charge.amount / 100,   // Convert centavos to pesos
      payment_method: '31',           // SAT: intermediario de pago
      channel: 'oxxo',
      transaction_data: {
        conekta_charge_id: charge.id,
        conekta_order_id: orderId,
        auth_code: charge.payment_method.auth_code,
        store_name: charge.payment_method.store_name,
        paid_at: charge.paid_at,
      },
    });
  }

  res.status(200).json({ status: 'ok' });
});
```

### 3.3 Card Payments (Conekta)

```typescript
// src/integrations/payments/card-config.ts

export const CARD_CONFIG = {
  provider: 'conekta',
  api_base: 'https://api.conekta.io',
  currency: 'MXN',
  three_d_secure: true,             // 3D Secure mandatory for MXN
  tokenization: true,               // Never store raw card numbers
  webhook_url: '/api/v1/payments/card/webhook',
};

// Tokenize and charge a card
async function chargeCard(input: {
  invoice_id: string;
  token_id: string;           // Conekta.js frontend tokenization token
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}): Promise<{ success: boolean; charge_id: string; auth_code: string }> {
  const response = await fetch(`${CARD_CONFIG.api_base}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CONEKTA_PRIVATE_KEY}`,
      'Accept': 'application/vnd.conekta-v2.1.0+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currency: 'MXN',
      customer_info: {
        name: input.customer_name,
        email: input.customer_email,
        phone: input.customer_phone,
      },
      line_items: [{
        name: `Pago de servicio de agua`,
        unit_price: Math.round(input.amount * 100),
        quantity: 1,
      }],
      charges: [{
        payment_method: {
          type: 'card',
          token_id: input.token_id,
        },
      }],
      metadata: {
        invoice_id: input.invoice_id,
      },
    }),
  });

  const order = await response.json();

  if (order.charges?.data?.[0]?.status === 'paid') {
    return {
      success: true,
      charge_id: order.charges.data[0].id,
      auth_code: order.charges.data[0].auth_code,
    };
  }

  throw new PaymentError(order.charges?.data?.[0]?.failure_code || 'UNKNOWN');
}
```

**Frontend tokenization (Conekta.js):**

```typescript
// Frontend: src/components/PaymentForm.tsx
// Conekta.js tokenizes card data client-side — raw card numbers NEVER touch our server

// Load Conekta.js
// <script src="https://cdn.conekta.io/js/latest/conekta.js"></script>

window.Conekta.setPublicKey(process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY);

const tokenParams = {
  card: {
    number: cardNumber,     // Only on client
    name: cardName,         // Only on client
    exp_year: expYear,      // Only on client
    exp_month: expMonth,    // Only on client
    cvc: cvc,               // Only on client
  },
};

const token = await window.Conekta.Token.create(tokenParams);
// token.id is sent to backend — never raw card data
```

### 3.4 CoDi / DiMo (QR Code Payments)

```typescript
// src/integrations/payments/codi-config.ts

export const CODI_CONFIG = {
  // CoDi was rebranded to DiMo in 2024 by Banxico
  qr_standard: 'EMVCo',          // QR code standard used by CoDi/DiMo
  webhook_url: '/api/v1/payments/codi/webhook',
  reconciliation: 'real-time',
};

// Generate CoDi QR code for an invoice
function generateCoDiQR(invoice: Invoice): {
  qr_data: string;
  qr_image_base64: string;
} {
  // CoDi QR contains:
  // - Beneficiary CLABE
  // - Amount
  // - Reference (invoice number)
  // - Concept
  const qrPayload = {
    v: 1,
    ic: 0,                          // Transfer type (0 = CoDi)
    bfi: process.env.SPEI_CLABE,    // Beneficiary CLABE
    mn: invoice.total.toFixed(2),
    rf: invoice.reference_number,
    cn: `Agua CEA ${invoice.contract_number}`,
  };

  return {
    qr_data: JSON.stringify(qrPayload),
    qr_image_base64: generateQRImage(qrPayload),
  };
}
```

### 3.5 Domiciliacion Bancaria (Direct Debit)

```typescript
// src/integrations/payments/domiciliacion-config.ts

export const DOMICILIACION_CONFIG = {
  // Direct debit from customer's bank account
  // Requires customer to sign a mandate (mandato) authorizing recurring debits
  schedule: 'monthly',           // Day is per-contract, typically after billing
  file_format: 'CECOBAN',       // Mexican interbank debit standard
  processing_bank: 'STP',       // or customer's bank via CECOBAN
  bounce_retry_days: 5,         // Retry failed debits after 5 days
  max_retries: 2,
  webhook_url: '/api/v1/payments/domiciliacion/webhook',
};

interface DomiciliacionMandate {
  contract_id: string;
  customer_clabe: string;       // Customer's 18-digit CLABE
  customer_bank_code: string;   // 3-digit bank code
  max_amount: number;           // Maximum authorized debit amount
  signed_at: Date;
  mandate_pdf_url: string;      // Signed mandate document
  active: boolean;
}

// Generate monthly domiciliacion batch file
async function generateDomiciliacionBatch(billingPeriod: string): Promise<{
  filename: string;
  record_count: number;
  total_amount: number;
}> {
  // 1. Get all active mandates with pending invoices
  const mandates = await getActiveMandatesWithPendingInvoices(billingPeriod);

  // 2. Generate CECOBAN format batch file
  const records = mandates.map(m => ({
    clabe_cargo: m.customer_clabe,
    clabe_abono: process.env.SPEI_CLABE,
    monto: m.invoice_total,
    referencia: m.invoice_reference,
    concepto: `Agua CEA ${m.contract_number}`,
  }));

  // 3. Submit batch to processing bank
  const batchFile = formatCECOBANBatch(records);

  return {
    filename: `DOM_${billingPeriod}_${Date.now()}.txt`,
    record_count: records.length,
    total_amount: records.reduce((sum, r) => sum + r.monto, 0),
  };
}

// Handle bounce (cargo rechazado)
async function handleDomiciliacionBounce(bounce: {
  clabe: string;
  reference: string;
  reason_code: string;  // 'insufficient_funds' | 'account_closed' | 'invalid_clabe'
  amount: number;
}): Promise<void> {
  const mandate = await findMandateByClabe(bounce.clabe);

  if (bounce.reason_code === 'insufficient_funds') {
    // Schedule retry in 5 days
    await scheduleDomiciliacionRetry(mandate, bounce.amount, DOMICILIACION_CONFIG.bounce_retry_days);
    // Notify customer via WhatsApp
    await sendWhatsAppTemplate('payment_reminder', mandate.customer_phone, {
      customer_name: mandate.customer_name,
      debt_amount: bounce.amount.toFixed(2),
      days_past_due: '0',
    });
  } else {
    // Deactivate mandate for account_closed or invalid_clabe
    await deactivateMandate(mandate.id, bounce.reason_code);
    // Notify customer to update bank details
    await sendWhatsAppTemplate('bank_details_update_needed', mandate.customer_phone, {});
  }
}
```

### 3.6 Cash (Ventanilla / POS)

```typescript
// src/integrations/payments/ventanilla-config.ts

export const VENTANILLA_CONFIG = {
  // In-office cash payments with receipt
  receipt_format: 'thermal_80mm',   // POS thermal printer
  receipt_copies: 2,                // Original + customer copy
  requires_cashier_auth: true,
  daily_close_time: '18:00',        // Corte de caja
  webhook_url: null,                // No webhook — direct API call from POS terminal
};

// POS terminal integration
// CEA offices have thermal receipt printers connected to the web POS
async function processVentanillaPayment(input: {
  invoice_id: string;
  amount: number;
  payment_type: 'cash' | 'check';
  cashier_user_id: string;
  terminal_id: string;
}): Promise<{
  receipt_number: string;
  receipt_pdf: string;
}> {
  // 1. Validate cashier is authorized for this terminal
  // 2. Process payment
  const payment = await processPayment({
    invoice_id: input.invoice_id,
    amount: input.amount,
    payment_method: input.payment_type === 'cash' ? '01' : '02',
    channel: 'ventanilla',
    transaction_data: {
      cashier_user_id: input.cashier_user_id,
      terminal_id: input.terminal_id,
    },
  });

  // 3. Generate thermal receipt
  const receipt = await generateThermalReceipt(payment);

  // 4. Print receipt on POS terminal
  await printReceipt(input.terminal_id, receipt);

  return {
    receipt_number: payment.receipt_number,
    receipt_pdf: receipt.pdf_base64,
  };
}
```

### 3.7 Payment Reconciliation Service

```typescript
// src/integrations/payments/reconciliation.ts

// Daily reconciliation runs at 6 AM via n8n scheduled workflow
async function dailyReconciliation(date: string): Promise<ReconciliationReport> {
  const report: ReconciliationReport = {
    date,
    channels: {},
    discrepancies: [],
    total_collected: 0,
  };

  // 1. SPEI — real-time, should already be reconciled
  const speiPayments = await getPaymentsByChannel('spei', date);
  const stpTransactions = await fetchSTPStatement(date);
  report.channels.spei = reconcileChannel(speiPayments, stpTransactions);

  // 2. OXXO — Conekta daily batch
  const oxxoPayments = await getPaymentsByChannel('oxxo', date);
  const conektaOxxo = await fetchConektaTransactions('oxxo_cash', date);
  report.channels.oxxo = reconcileChannel(oxxoPayments, conektaOxxo);

  // 3. Cards — Conekta real-time
  const cardPayments = await getPaymentsByChannel('card', date);
  const conektaCards = await fetchConektaTransactions('card', date);
  report.channels.card = reconcileChannel(cardPayments, conektaCards);

  // 4. Ventanilla — internal POS
  const ventanillaPayments = await getPaymentsByChannel('ventanilla', date);
  report.channels.ventanilla = { count: ventanillaPayments.length, total: sum(ventanillaPayments) };

  // 5. Domiciliacion — bank batch response
  const domPayments = await getPaymentsByChannel('domiciliacion', date);
  report.channels.domiciliacion = { count: domPayments.length, total: sum(domPayments) };

  // 6. Flag discrepancies
  for (const channel of Object.keys(report.channels)) {
    if (report.channels[channel].discrepancies?.length > 0) {
      report.discrepancies.push(...report.channels[channel].discrepancies);
    }
  }

  report.total_collected = Object.values(report.channels).reduce((s, c) => s + c.total, 0);

  // 7. Store report and notify if discrepancies found
  await storeReconciliationReport(report);
  if (report.discrepancies.length > 0) {
    await notifyFinanceTeam(report);
  }

  return report;
}
```

---

## 4. Communication Integrations

### 4.1 WhatsApp Business API

**Provider options:** 360dialog (BSP) or Meta Cloud API (direct). 360dialog provides a simpler onboarding experience and manages the WhatsApp Business Account on behalf of CEA.

#### Configuration

```typescript
// src/integrations/whatsapp/config.ts

export const WHATSAPP_CONFIG = {
  // 360dialog BSP configuration
  api_url: process.env.WHATSAPP_API_URL || 'https://waba.360dialog.io/v1',
  api_key: process.env.WHATSAPP_API_KEY!,
  phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  webhook_url: '/api/v1/whatsapp/webhook',
  webhook_verify_token: process.env.WHATSAPP_VERIFY_TOKEN!,

  // Message windows
  template_window: 'unlimited',     // Templates can be sent anytime
  session_window_hours: 24,         // Free-form messages within 24h of last customer message
  interactive_types: ['button', 'list', 'product'],
};
```

#### Pre-Approved Message Templates

These templates must be submitted to Meta for approval **before** they can be used. Approval takes 1-4 weeks. Start submission in Sprint 1.

```typescript
// src/integrations/whatsapp/templates.ts

export const WHATSAPP_TEMPLATES = {
  // Template 1: Invoice Ready
  recibo_listo: {
    name: 'recibo_listo',
    language: 'es_MX',
    category: 'UTILITY',
    components: [
      {
        type: 'header',
        format: 'TEXT',
        text: 'CEA Queretaro - Recibo de Agua',
      },
      {
        type: 'body',
        text: 'Hola {{1}}, tu recibo de agua esta listo.\n\nTotal: ${{2}} MXN\nVencimiento: {{3}}\n\nPaga en linea o en cualquier OXXO.',
        example: { body_text: [['Juan Perez', '456.78', '15 de abril 2026']] },
      },
      {
        type: 'footer',
        text: 'CEA Queretaro - Comision Estatal de Aguas',
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Pagar en linea', url: 'https://pago.ceaqueretaro.gob.mx/{{1}}' },
          { type: 'QUICK_REPLY', text: 'Ver detalle' },
        ],
      },
    ],
  },

  // Template 2: Payment Reminder
  recordatorio_pago: {
    name: 'recordatorio_pago',
    language: 'es_MX',
    category: 'UTILITY',
    components: [
      {
        type: 'body',
        text: 'Hola {{1}}, tienes un adeudo pendiente de ${{2}} MXN con {{3}} dias de atraso.\n\nEvita el corte de servicio realizando tu pago.',
        example: { body_text: [['Maria Lopez', '1,234.56', '15']] },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Pagar ahora', url: 'https://pago.ceaqueretaro.gob.mx/{{1}}' },
        ],
      },
    ],
  },

  // Template 3: Payment Confirmation
  pago_confirmado: {
    name: 'pago_confirmado',
    language: 'es_MX',
    category: 'UTILITY',
    components: [
      {
        type: 'body',
        text: 'Hola {{1}}, hemos recibido tu pago de ${{2}} MXN.\n\nFolio: {{3}}\n\nGracias por pagar a tiempo.',
        example: { body_text: [['Juan Perez', '456.78', 'PAG-2026-00001']] },
      },
    ],
  },

  // Template 4: Leak Report Received
  reporte_fuga_recibido: {
    name: 'reporte_fuga_recibido',
    language: 'es_MX',
    category: 'UTILITY',
    components: [
      {
        type: 'body',
        text: 'Hola {{1}}, hemos recibido tu reporte de fuga.\n\nFolio: {{2}}\nTiempo estimado de atencion: {{3}}\n\nTe notificaremos cuando una cuadrilla sea asignada.',
        example: { body_text: [['Ana Garcia', 'FUG-2026-00045', '24-48 horas']] },
      },
    ],
  },

  // Template 5: Service Cut Warning
  aviso_corte: {
    name: 'aviso_corte',
    language: 'es_MX',
    category: 'UTILITY',
    components: [
      {
        type: 'body',
        text: 'AVISO IMPORTANTE\n\nHola {{1}}, tu servicio de agua sera suspendido por adeudo de ${{2}} MXN.\n\nFecha programada de corte: {{3}}\n\nRealiza tu pago para evitar la suspension.',
        example: { body_text: [['Pedro Martinez', '2,345.67', '20 de marzo 2026']] },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'Pagar ahora', url: 'https://pago.ceaqueretaro.gob.mx/{{1}}' },
        ],
      },
    ],
  },
};
```

#### Sending Template Messages

```typescript
// src/integrations/whatsapp/send.ts

async function sendWhatsAppTemplate(
  templateName: string,
  recipientPhone: string,
  parameters: Record<string, string>,
): Promise<{ message_id: string; status: string }> {
  const template = WHATSAPP_TEMPLATES[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);

  // Format phone number for WhatsApp (E.164 without +)
  const phone = recipientPhone.replace(/\D/g, '');
  const whatsappPhone = phone.startsWith('52') ? phone : `52${phone}`;

  const response = await fetch(`${WHATSAPP_CONFIG.api_url}/messages`, {
    method: 'POST',
    headers: {
      'D360-API-KEY': WHATSAPP_CONFIG.api_key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: whatsappPhone,
      type: 'template',
      template: {
        name: template.name,
        language: { code: template.language },
        components: buildTemplateComponents(template, parameters),
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new WhatsAppError(result.error?.code, result.error?.message);
  }

  return {
    message_id: result.messages[0].id,
    status: result.messages[0].message_status || 'sent',
  };
}

// Build template components with parameter substitution
function buildTemplateComponents(template: any, params: Record<string, string>) {
  const components = [];
  const paramValues = Object.values(params);
  let paramIndex = 0;

  for (const comp of template.components) {
    if (comp.type === 'body') {
      const bodyParams = [];
      // Count {{N}} placeholders
      const placeholders = (comp.text.match(/\{\{\d+\}\}/g) || []).length;
      for (let i = 0; i < placeholders; i++) {
        bodyParams.push({ type: 'text', text: paramValues[paramIndex++] || '' });
      }
      components.push({ type: 'body', parameters: bodyParams });
    }
    if (comp.type === 'BUTTONS') {
      for (let i = 0; i < comp.buttons.length; i++) {
        if (comp.buttons[i].type === 'URL' && comp.buttons[i].url.includes('{{')) {
          components.push({
            type: 'button',
            sub_type: 'url',
            index: i,
            parameters: [{ type: 'text', text: paramValues[paramIndex++] || '' }],
          });
        }
      }
    }
  }

  return components;
}
```

#### Webhook Handler (Inbound Messages)

```typescript
// src/integrations/whatsapp/webhook.ts

router.get('/api/v1/whatsapp/webhook', (req, res) => {
  // Meta/360dialog webhook verification
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_CONFIG.webhook_verify_token) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

router.post('/api/v1/whatsapp/webhook', async (req, res) => {
  res.sendStatus(200); // Acknowledge immediately

  const { entry } = req.body;
  for (const e of entry) {
    for (const change of e.changes) {
      if (change.field === 'messages') {
        for (const message of change.value.messages || []) {
          await handleInboundMessage({
            from: message.from,               // Sender phone number
            message_id: message.id,
            timestamp: message.timestamp,
            type: message.type,               // 'text', 'image', 'location', 'button', 'interactive'
            text: message.text?.body,
            location: message.location,
            button: message.button,
            interactive: message.interactive,
          });
        }

        // Handle status updates (delivered, read)
        for (const status of change.value.statuses || []) {
          await updateMessageStatus(status.id, status.status, status.timestamp);
        }
      }
    }
  }
});

async function handleInboundMessage(message: InboundWhatsAppMessage) {
  // 1. Find or create contact in SUPRA
  const contact = await findOrCreateContact(message.from);

  // 2. Forward to Chatwoot/AGORA for conversation tracking
  await forwardToAgora(contact, message);

  // 3. If AI agent is enabled, invoke WhatsApp CX agent
  if (await isAIAgentEnabled(contact.tenant_id)) {
    await invokeWhatsAppAgent(contact, message);
  }
}
```

### 4.2 Twilio Voice Integration

```typescript
// src/integrations/voice/twilio-config.ts

export const TWILIO_CONFIG = {
  account_sid: process.env.TWILIO_ACCOUNT_SID!,
  auth_token: process.env.TWILIO_AUTH_TOKEN!,
  phone_number: process.env.TWILIO_PHONE_NUMBER!,  // +52 number
  webhook_url: '/api/v1/voice/incoming',
  status_callback_url: '/api/v1/voice/status',
  recording_enabled: true,
  recording_channels: 'dual',     // Separate caller/agent tracks
  speech_language: 'es-MX',
  voice_name: 'Polly.Mia-Neural', // AWS Polly Mexican Spanish
};

// Mexican phone number format: +52 (country code) + 10 digits
// Twilio numbers for Mexico: +52 area_code + number
// CEA Queretaro area code: 442
```

**TwiML for Incoming Calls:**

```typescript
// src/integrations/voice/incoming-call.ts

import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

router.post('/api/v1/voice/incoming', (req, res) => {
  const twiml = new VoiceResponse();

  // 1. Welcome message
  twiml.say({
    language: 'es-MX',
    voice: 'Polly.Mia-Neural',
  }, 'Bienvenido a la Comision Estatal de Aguas de Queretaro. ¿En que le podemos ayudar?');

  // 2. Gather speech input for Claude AI processing
  const gather = twiml.gather({
    input: ['speech'],
    language: 'es-MX',
    speechTimeout: 'auto',
    action: '/api/v1/voice/process',
    method: 'POST',
  });

  gather.say({
    language: 'es-MX',
    voice: 'Polly.Mia-Neural',
  }, 'Puede consultar su saldo, reportar una fuga, o hacer un pago. Digame como puedo ayudarle.');

  // 3. If no input, redirect to human agent
  twiml.redirect('/api/v1/voice/transfer-human');

  res.type('text/xml');
  res.send(twiml.toString());
});

// Process speech with Claude AI
router.post('/api/v1/voice/process', async (req, res) => {
  const speechResult = req.body.SpeechResult;
  const callerNumber = req.body.From;
  const callSid = req.body.CallSid;

  // Invoke Voice AI agent with Claude
  const agentResponse = await invokeVoiceAgent({
    caller_phone: callerNumber,
    speech_text: speechResult,
    call_sid: callSid,
    conversation_history: await getCallHistory(callSid),
  });

  const twiml = new VoiceResponse();

  // Speak Claude's response
  twiml.say({
    language: 'es-MX',
    voice: 'Polly.Mia-Neural',
  }, agentResponse.text);

  // If agent needs more input, gather again
  if (agentResponse.needs_input) {
    const gather = twiml.gather({
      input: ['speech'],
      language: 'es-MX',
      speechTimeout: 'auto',
      action: '/api/v1/voice/process',
      method: 'POST',
    });
  }

  // If agent wants to transfer to human
  if (agentResponse.transfer_to_human) {
    twiml.say({
      language: 'es-MX',
      voice: 'Polly.Mia-Neural',
    }, 'Le transferire con un agente. Por favor espere en la linea.');
    twiml.dial('+524421234567'); // CEA call center number
  }

  res.type('text/xml');
  res.send(twiml.toString());
});
```

### 4.3 SMS (Twilio)

```typescript
// src/integrations/sms/twilio-sms.ts

import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(to: string, body: string): Promise<{ sid: string; status: string }> {
  // Format Mexican phone number
  const formattedTo = formatMexicanPhone(to);

  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: formattedTo,
    statusCallback: `${process.env.BASE_URL}/api/v1/sms/status`,
  });

  return { sid: message.sid, status: message.status };
}

// SMS use cases (short, no templates required)
const SMS_MESSAGES = {
  payment_reminder: (name: string, amount: string) =>
    `CEA Qro: Hola ${name}, tienes un adeudo de $${amount}. Paga en linea: pago.ceaqueretaro.gob.mx`,
  payment_confirmation: (amount: string, folio: string) =>
    `CEA Qro: Pago de $${amount} recibido. Folio: ${folio}. Gracias.`,
  cut_warning: (name: string, date: string) =>
    `CEA Qro: AVISO - Corte de servicio programado para ${date}. Regularice su pago.`,
  work_order_update: (folio: string, status: string) =>
    `CEA Qro: Su orden ${folio} ha sido actualizada: ${status}`,
};

function formatMexicanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('52')) return `+${digits}`;
  if (digits.length === 10) return `+52${digits}`;
  return `+52${digits}`;
}
```

### 4.4 Email (AWS SES or SendGrid)

```typescript
// src/integrations/email/ses-config.ts

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const EMAIL_CONFIG = {
  from_address: 'notificaciones@ceaqueretaro.gob.mx',
  from_name: 'CEA Queretaro',
  reply_to: 'atencion@ceaqueretaro.gob.mx',
};

async function sendInvoiceEmail(input: {
  to: string;
  customer_name: string;
  invoice_number: string;
  total: number;
  due_date: string;
  pdf_base64: string;
  payment_url: string;
}): Promise<{ message_id: string }> {
  // Build MIME message with PDF attachment
  const boundary = `----=_Part_${Date.now()}`;

  const rawMessage = [
    `From: ${EMAIL_CONFIG.from_name} <${EMAIL_CONFIG.from_address}>`,
    `To: ${input.to}`,
    `Subject: Recibo de agua CEA Queretaro - ${input.invoice_number}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    '',
    buildInvoiceEmailHTML(input),
    '',
    `--${boundary}`,
    'Content-Type: application/pdf',
    `Content-Disposition: attachment; filename="Recibo_${input.invoice_number}.pdf"`,
    'Content-Transfer-Encoding: base64',
    '',
    input.pdf_base64,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const command = new SendEmailCommand({
    Source: `${EMAIL_CONFIG.from_name} <${EMAIL_CONFIG.from_address}>`,
    Destination: { ToAddresses: [input.to] },
    Message: {
      Subject: { Data: `Recibo de agua CEA Queretaro - ${input.invoice_number}` },
      Body: { Html: { Data: buildInvoiceEmailHTML(input) } },
    },
    ReplyToAddresses: [EMAIL_CONFIG.reply_to],
  });

  const result = await sesClient.send(command);
  return { message_id: result.MessageId! };
}
```

---

## 5. CRM Integration (Chatwoot/AGORA)

### 5.1 Existing AGORA Installation Assessment

CEA Queretaro already runs Chatwoot as "AGORA" for customer service. SUPRA integrates with AGORA via webhooks and API calls rather than replacing it.

**Current AGORA capabilities:**
- WhatsApp inbox (connected to CEA's WhatsApp Business number)
- Web live chat widget
- Agent workspace for human agents
- Contact management
- Conversation history
- Canned responses

**Integration approach:** SUPRA becomes the data backend; AGORA remains the agent workspace.

### 5.2 Webhook Integration with SUPRA Event Bus

```typescript
// src/integrations/agora/webhook-config.ts

export const AGORA_CONFIG = {
  api_url: process.env.AGORA_API_URL || 'http://agora:3000',
  api_token: process.env.AGORA_API_TOKEN!,
  account_id: process.env.AGORA_ACCOUNT_ID!,
  webhook_url: '/api/v1/agora/webhook',
};

// Events AGORA sends to SUPRA
const AGORA_EVENTS = [
  'message_created',          // New message in conversation
  'message_updated',          // Message status update
  'conversation_created',     // New conversation started
  'conversation_status_changed',  // Open, resolved, pending
  'contact_created',          // New contact
  'contact_updated',          // Contact info changed
];

// Events SUPRA sends to AGORA
const SUPRA_TO_AGORA_EVENTS = [
  'payment.received',         // Add payment note to conversation
  'invoice.generated',        // Notify agent of new invoice
  'work_order.status_changed', // Update agent on work order
  'ai_agent.escalated',       // AI agent handing off to human
];
```

### 5.3 Agent Handoff (AI to Human)

```typescript
// src/integrations/agora/handoff.ts

async function escalateToHumanAgent(input: {
  contact_id: string;
  conversation_id: string;
  reason: string;
  ai_summary: string;           // AI agent's summary of the issue
  priority: 'urgent' | 'normal';
}): Promise<void> {
  // 1. Create or find conversation in Chatwoot
  const conversation = await findOrCreateAgoraConversation(input.contact_id);

  // 2. Add AI summary as internal note
  await createAgoraMessage({
    conversation_id: conversation.id,
    content: `**Resumen del agente IA:**\n${input.ai_summary}\n\n**Motivo de escalacion:** ${input.reason}`,
    message_type: 'outgoing',
    private: true,  // Internal note, not visible to customer
  });

  // 3. Assign to appropriate team/agent
  const team = input.priority === 'urgent' ? 'urgentes' : 'atencion_general';
  await assignAgoraConversation(conversation.id, { team });

  // 4. Update conversation status to 'open'
  await updateAgoraConversation(conversation.id, { status: 'open' });
}
```

### 5.4 Contact Synchronization

```typescript
// src/integrations/agora/contact-sync.ts

// Bidirectional sync: SUPRA persons <-> AGORA contacts
async function syncContactToAgora(person: Person): Promise<void> {
  const existingContact = await findAgoraContactByPhone(person.phone);

  const contactData = {
    name: `${person.nombre} ${person.apellido1} ${person.apellido2 || ''}`.trim(),
    phone_number: formatMexicanPhone(person.phone),
    email: person.email,
    identifier: person.id,   // SUPRA person ID
    custom_attributes: {
      contract_number: person.active_contract_number,
      rfc: person.rfc,
      account_status: person.account_status,
      total_debt: person.total_debt,
      vulnerability_flag: person.vulnerable,
    },
  };

  if (existingContact) {
    await updateAgoraContact(existingContact.id, contactData);
  } else {
    await createAgoraContact(contactData);
  }
}
```

---

## 6. Legacy AquaCIS Bridge (Strangler Fig)

### 6.1 SOAP-to-REST Adapter Design

The legacy AquaCIS system exposes 5 SOAP services with 126 total operations. Currently, 17 are integrated through a Rails passthrough proxy. The Strangler Fig pattern wraps each SOAP operation in a REST endpoint, one at a time.

```
Current architecture:
  Vue Frontend --> SOAP XML (in browser!) --> Rails Proxy --> AquaCIS SOAP

Target architecture (BFF):
  React/Vue Frontend --> REST JSON --> Node.js BFF --> AquaCIS SOAP
                                         |
                                    SUPRA PostgreSQL (for new features)
```

```typescript
// src/integrations/legacy/aquasis-adapter.ts

import { createClient } from 'soap';

interface AquasisConfig {
  services: {
    contracts: string;   // InterfazGenericaContratacionWS
    debt: string;        // InterfazGenericaGestionDeudaWS
    meters: string;      // InterfazGenericaContadoresWS
    readings: string;    // InterfazOficinaVirtualClientesWS
    workOrders: string;  // InterfazGenericaOrdenesServicioWS
  };
  credentials: {
    username: string;
    password: string;
  };
  timeout: number;
}

const AQUASIS_CONFIG: AquasisConfig = {
  services: {
    contracts: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS?wsdl',
    debt: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS?wsdl',
    meters: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS?wsdl',
    readings: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS?wsdl',
    workOrders: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS?wsdl',
  },
  credentials: {
    username: process.env.AQUASIS_WS_USERNAME!,
    password: process.env.AQUASIS_WS_PASSWORD!,
  },
  timeout: 30000,
};
```

### 6.2 REST API Mapping (v2 Endpoints)

```typescript
// src/integrations/legacy/rest-routes.ts

// REST endpoint -> SOAP operation mapping
const REST_TO_SOAP_MAP = {
  // ---- Customer Identification (Phase 1) ----
  'GET  /api/v2/aquasis/customers/search?nif=':        'getContratosPorNif',
  'GET  /api/v2/aquasis/customers/:nif':               'getTitularPorNif',
  'GET  /api/v2/aquasis/customers/:nif/contracts':     'getContratosPorNifconDeuda',

  // ---- Contracts ----
  'GET  /api/v2/aquasis/contracts/:id':                'consultaDetalleContrato',
  'GET  /api/v2/aquasis/contracts/:id/detail':         'getContrato',
  'GET  /api/v2/aquasis/contracts/:id/history':        'consultaHistoricoActuacionesContrato',
  'GET  /api/v2/aquasis/contracts/:id/invoices':       'getFacturasContrato',
  'GET  /api/v2/aquasis/contracts/:id/invoices/:inv/pdf': 'getPdfFactura',

  // ---- Debt ----
  'GET  /api/v2/aquasis/contracts/:id/debt':           'getDeuda',
  'GET  /api/v2/aquasis/contracts/:id/debt/invoices':  'getDeudaTotalConFacturas',
  'GET  /api/v2/aquasis/contracts/:id/debt/unpaid':    'getImpagadosContrato',
  'GET  /api/v2/aquasis/contracts/:id/debt/block':     'getDeudaContratoBloqueoCobro',

  // ---- Payments ----
  'POST /api/v2/aquasis/payments/document':            'getDocumentoPago',
  'POST /api/v2/aquasis/payments/collect':             'cobrarReferenciaFrmPago',
  'POST /api/v2/aquasis/payments/notify':              'avisarPago',
  'POST /api/v2/aquasis/payments/cancel':              'cancelarReferencia',

  // ---- Meters ----
  'GET  /api/v2/aquasis/meters/:serial':               'getContador',
  'GET  /api/v2/aquasis/meters/:serial/service-point': 'getPuntoServicioPorContador',
  'GET  /api/v2/aquasis/meters/:serial/changes':       'getCambiosContadorDeContrato',

  // ---- Work Orders ----
  'POST /api/v2/aquasis/work-orders':                  'crearOrdenTrabajo',
  'GET  /api/v2/aquasis/work-orders/:id':              'refreshData',
  'POST /api/v2/aquasis/work-orders/:id/visits':       'informarVisita',
  'PUT  /api/v2/aquasis/work-orders/:id/resolve':      'resolveOT',
  'GET  /api/v2/aquasis/work-orders/:id/pdf':          'getDocumentoOrdenTrabajo',

  // ---- Readings ----
  'GET  /api/v2/aquasis/contracts/:id/readings':       'getLecturas',
  'GET  /api/v2/aquasis/contracts/:id/consumption':    'getConsumos',
  'GET  /api/v2/aquasis/contracts/:id/tariff':         'getTarifaDeAguaPorContrato',
};
```

### 6.3 Bidirectional Data Sync During Migration

```typescript
// src/integrations/legacy/data-sync.ts

// During migration, certain writes must go to BOTH systems:
// 1. Payment in SUPRA -> also notify AquaCIS via avisarPago
// 2. Work order in AquaCIS -> also create in SUPRA via webhook
// 3. Contract changes in AquaCIS -> sync to SUPRA nightly

const SYNC_RULES = {
  // Writes that SUPRA is source-of-truth for:
  supra_primary: [
    'payments',          // New payment channels (SPEI, OXXO, card)
    'communications',    // WhatsApp, SMS, email
    'ai_interactions',   // AI agent conversations
  ],

  // Writes that AquaCIS is source-of-truth for:
  aquasis_primary: [
    'contracts',         // Until contract module migrated
    'meter_readings',    // Until reading module migrated
    'work_orders',       // Until WO module migrated
    'debt',              // Until billing module migrated
  ],

  // Bidirectional sync (both systems must agree):
  bidirectional: [
    'customer_data',     // Name, address, phone updates
    'payment_status',    // Invoice paid/unpaid status
  ],
};

// Nightly sync job (runs at 2 AM)
async function nightlySyncFromAquaCIS(): Promise<SyncReport> {
  // 1. Fetch all contracts modified since last sync
  // 2. Fetch all readings since last sync
  // 3. Fetch all debt changes since last sync
  // 4. Upsert into SUPRA PostgreSQL
  // 5. Log sync report with counts and errors
}
```

### 6.4 API Gateway Routing (New vs Legacy)

```typescript
// src/integrations/legacy/api-gateway.ts
// Traefik routing rules

/*
# traefik/dynamic/aquasis-routing.yml

http:
  routers:
    # New SUPRA API (v2) — handled by Node.js
    supra-api:
      rule: "PathPrefix(`/api/v2/`)"
      service: supra-api
      middlewares:
        - auth-jwt
        - rate-limit

    # Legacy proxy (v1) — still handled by Rails AGORA
    legacy-proxy:
      rule: "PathPrefix(`/api/v1/cea/soap/`)"
      service: agora-rails
      middlewares:
        - auth-session

    # Gradual cutover: specific operations routed to SUPRA
    # Even while /api/v1/ still exists
    supra-override-debt:
      rule: "PathPrefix(`/api/v1/cea/soap/InterfazGenericaGestionDeudaWS`) && HeadersRegexp(`X-Supra-Enabled`, `true`)"
      service: supra-api
      priority: 10

  services:
    supra-api:
      loadBalancer:
        servers:
          - url: "http://supra-api:3000"

    agora-rails:
      loadBalancer:
        servers:
          - url: "http://agora:3001"
*/
```

### 6.5 Gradual Cutover Strategy

| Phase | Domain | Source of Truth | Approach |
|-------|--------|----------------|----------|
| **Now** | All | AquaCIS | Rails passthrough proxy |
| **Sprint 3-4** | Customer lookup | SUPRA (cached from AquaCIS) | SUPRA calls AquaCIS, caches in Redis |
| **Sprint 5-8** | Payments | SUPRA (new channels) | SUPRA processes new payments, notifies AquaCIS via `avisarPago` |
| **Sprint 9-12** | Work orders | Dual-write | SUPRA creates in both systems, reads from AquaCIS |
| **Sprint 13-16** | Billing | SUPRA | SUPRA generates invoices, stamps CFDI, notifies AquaCIS |
| **Sprint 17-20** | Full | SUPRA | AquaCIS read-only archive, SUPRA is primary |

### 6.6 Known AquaCIS Bugs to Handle

These bugs from the INTEGRATION_ROADMAP must be handled in the BFF adapter:

| Bug | Operation | Workaround in BFF |
|-----|-----------|-------------------|
| `NullPointerException` on missing `idPtoServicio` | `crearOrdenTrabajo` | BFF always calls `getPuntoServicioPorContador` first, validates non-null |
| Missing WS-Security headers cause 500 | `crearOrdenTrabajo` | BFF always injects WS-Security `UsernameToken` |
| Wrong `otClassID` (0 instead of 1) | `refreshData` | BFF hardcodes `otClassID=1` and populates `operationalSiteID` |
| `reultado` typo in response DTOs | Multiple Debt ops | BFF normalizer: `response.resultado \|\| response.reultado` |
| `codigoError` as string not int | `getDocumentoOrdenTrabajo` | BFF type-aware parsing for both `int` and `string` error codes |
| `busVHFumberSerie` typo | `resolveOT` | BFF uses exact misspelled field name |
| `vistitComments` typo | `resolveOT` | BFF uses exact misspelled field name |
| `emailAntigo` typo | `cambiarEmailNotificacionPersona` | BFF uses exact misspelled field name |

---

## 7. Accounting Integration

### 7.1 SAP/CONTPAQi Sync

CEA Queretaro uses either SAP or CONTPAQi for financial accounting. SUPRA must export financial data in formats compatible with either.

```typescript
// src/integrations/accounting/sync-config.ts

export const ACCOUNTING_CONFIG = {
  system: process.env.ACCOUNTING_SYSTEM || 'contpaqi',  // 'sap' or 'contpaqi'
  export_schedule: 'daily',         // Daily export at end of business day
  export_format: 'xml',             // CONTPAQi XML or SAP IDoc
  sftp_host: process.env.ACCOUNTING_SFTP_HOST,
  sftp_user: process.env.ACCOUNTING_SFTP_USER,
};

// Chart of accounts mapping
const CHART_OF_ACCOUNTS = {
  // SUPRA concept -> Accounting account number
  agua_potable:       { debit: '4101001', credit: '1101001' },  // Revenue - Water service
  alcantarillado:     { debit: '4101002', credit: '1101001' },  // Revenue - Sewer
  saneamiento:        { debit: '4101003', credit: '1101001' },  // Revenue - Treatment
  reconexion:         { debit: '4102001', credit: '1101001' },  // Revenue - Reconnection
  iva_trasladado:     { debit: '2101001', credit: '1101001' },  // IVA payable
  payment_cash:       { debit: '1101001', credit: '1102001' },  // Cash -> Bank
  payment_spei:       { debit: '1102001', credit: '1103001' },  // Bank -> Revenue
  payment_card:       { debit: '1102002', credit: '1103001' },  // Card processor -> Revenue
  payment_oxxo:       { debit: '1102003', credit: '1103001' },  // OXXO intermediary -> Revenue
};

// Daily accounting export
async function generateDailyAccountingExport(date: string): Promise<{
  filename: string;
  records: number;
  debit_total: number;
  credit_total: number;
}> {
  // 1. Get all invoices stamped on this date
  const invoices = await getInvoicesByDate(date);

  // 2. Get all payments received on this date
  const payments = await getPaymentsByDate(date);

  // 3. Generate journal entries
  const entries = [
    ...invoices.map(inv => generateInvoiceJournalEntry(inv)),
    ...payments.map(pmt => generatePaymentJournalEntry(pmt)),
  ];

  // 4. Format for CONTPAQi or SAP
  const exportFile = ACCOUNTING_CONFIG.system === 'contpaqi'
    ? formatCONTPAQiXML(entries)
    : formatSAPIDoc(entries);

  // 5. Upload via SFTP
  await uploadToSFTP(exportFile);

  return {
    filename: exportFile.filename,
    records: entries.length,
    debit_total: entries.reduce((s, e) => s + e.debit, 0),
    credit_total: entries.reduce((s, e) => s + e.credit, 0),
  };
}
```

### 7.2 Monthly Reconciliation

```typescript
// Monthly close reconciliation between SUPRA and accounting system
async function monthlyReconciliation(month: string): Promise<MonthlyReconciliationReport> {
  return {
    period: month,
    total_invoiced: await getTotalInvoicedForMonth(month),
    total_collected: await getTotalCollectedForMonth(month),
    total_cfdi_stamped: await getCFDICountForMonth(month),
    total_cfdi_cancelled: await getCFDICancelledForMonth(month),
    accounts_receivable: await getAccountsReceivableBalance(month),
    discrepancies: await findDiscrepancies(month),
  };
}
```

---

## 8. Integration Testing Strategy

### 8.1 Sandbox Environments

| Provider | Sandbox URL | Test Credentials | Notes |
|----------|-------------|-----------------|-------|
| **Finkok** | `demo-facturacion.finkok.com` | Finkok provides test user | Uses test RFC `EKU9003173C9` |
| **Conekta** | `api.conekta.io` (test mode) | Test API key (prefix `key_test_`) | Test card: 4242424242424242 |
| **STP/SPEI** | STP sandbox environment | STP provides test CLABE | Simulated webhook callbacks |
| **WhatsApp** | 360dialog sandbox | Test phone number | Limited to 5 test numbers |
| **Twilio** | `api.twilio.com` (test mode) | Test credentials (prefix `AC_test`) | Magic phone numbers for testing |
| **AWS SES** | SES sandbox | AWS credentials | Must verify sender/receiver emails |
| **AquaCIS** | CEA staging instance | Test credentials | Ask CEA IT for staging access |

### 8.2 Test Data and Test Accounts

```typescript
// src/tests/integration/test-fixtures.ts

export const TEST_DATA = {
  // CFDI test data
  cfdi: {
    emisor_rfc: 'EKU9003173C9',        // Finkok test RFC
    receptor_rfc: 'XAXX010101000',      // Publico general
    receptor_rfc_valid: 'AAA010101AAA',  // Valid test RFC
    test_cert_path: './test/fixtures/CSD_Pruebas_CFDI_EKU9003173C9.cer',
    test_key_path: './test/fixtures/CSD_Pruebas_CFDI_EKU9003173C9.key',
    test_key_password: '12345678a',
  },

  // Payment test data
  payments: {
    conekta_test_card: '4242424242424242',
    conekta_test_card_declined: '4000000000000002',
    conekta_test_oxxo_reference: '93000262280678',
    spei_test_clabe: '646180110400000001',
  },

  // AquaCIS test data
  aquasis: {
    test_contract: 442761,
    test_nif: 'XAXX010101000',
    test_meter_serial: '10005237',
    test_exploitation: 8,
  },

  // Communication test data
  whatsapp: {
    test_phone: '5214421234567',  // Verified sandbox number
  },
};
```

### 8.3 End-to-End Payment Flow Testing

```typescript
// src/tests/integration/payment-e2e.test.ts

describe('End-to-end payment flow', () => {
  it('should complete SPEI payment and stamp CFDI', async () => {
    // 1. Create invoice
    const invoice = await createTestInvoice({ total: 456.78 });

    // 2. Generate SPEI reference
    const ref = generateSPEIReference(invoice.contract_number, invoice.seq);

    // 3. Simulate SPEI webhook
    await simulateSPEIWebhook({
      monto: 456.78,
      concepto: ref,
      referencia_numerica: ref.replace('-', ''),
    });

    // 4. Verify payment was processed
    const payment = await getPaymentByInvoice(invoice.id);
    expect(payment.status).toBe('completed');
    expect(payment.amount).toBe(456.78);

    // 5. Verify CFDI complemento de pago was stamped (if PPD)
    if (invoice.metodo_pago === 'PPD') {
      const complemento = await getCFDIComplemento(payment.id);
      expect(complemento.uuid).toBeDefined();
    }

    // 6. Verify invoice status updated
    const updatedInvoice = await getInvoice(invoice.id);
    expect(updatedInvoice.status).toBe('cobrada');
  });

  it('should complete OXXO payment via Conekta', async () => {
    // 1. Create invoice
    const invoice = await createTestInvoice({ total: 200.00 });

    // 2. Generate OXXO reference
    const oxxoRef = await createOXXOReference(invoice);
    expect(oxxoRef.barcode).toBeDefined();

    // 3. Simulate Conekta webhook (charge.paid)
    await simulateConektaWebhook({
      type: 'charge.paid',
      data: {
        object: {
          amount: 20000,  // centavos
          payment_method: { type: 'oxxo_cash', reference: oxxoRef.reference },
          order_id: oxxoRef.order_id,
        },
      },
    });

    // 4. Verify payment processed
    const payment = await getPaymentByInvoice(invoice.id);
    expect(payment.status).toBe('completed');
  });

  it('should handle card payment with 3D Secure', async () => {
    // Test with Conekta test card that requires 3D Secure
    // ...
  });
});
```

### 8.4 CFDI Validation Testing

```typescript
// src/tests/integration/cfdi-validation.test.ts

describe('CFDI 4.0 compliance', () => {
  it('should stamp a valid water utility CFDI', async () => {
    const result = await stampWithRetry(buildTestCFDI({
      product_key: '10171500',  // Agua
      unit_key: 'MTQ',
      quantity: 15,             // 15 m3
      unit_price: 8.50,
    }));

    expect(result.success).toBe(true);
    expect(result.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should handle RFC publico general', async () => {
    const result = await stampWithRetry(buildTestCFDI({
      receptor_rfc: 'XAXX010101000',
      receptor_nombre: 'PUBLICO EN GENERAL',
      regimen_fiscal: '616',
      uso_cfdi: 'S01',
    }));

    expect(result.success).toBe(true);
  });

  it('should correctly apply IVA exemption for domestic water', async () => {
    const cfdi = buildTestCFDI({
      toma_type: 'domestica',
      product_key: '10171500',
    });

    // Domestic water should have ObjetoImp="01" (no tax object)
    expect(cfdi).toContain('ObjetoImp="01"');
    expect(cfdi).not.toContain('TasaOCuota="0.160000"');
  });

  it('should apply 16% IVA for commercial water', async () => {
    const cfdi = buildTestCFDI({
      toma_type: 'comercial',
      product_key: '10171500',
    });

    expect(cfdi).toContain('ObjetoImp="02"');
    expect(cfdi).toContain('TasaOCuota="0.160000"');
  });

  it('should generate complemento de pago for PPD', async () => {
    // Stamp original PPD invoice
    const original = await stampWithRetry(buildTestCFDI({ metodo_pago: 'PPD' }));

    // Generate complemento de pago
    const complemento = await generateComplementoPago({
      original_cfdi_uuid: original.uuid,
      payment_date: '2026-03-15',
      payment_method: '03',
      amount: 200.00,
      currency: 'MXN',
      remaining_balance: 256.78,
      installment_number: 1,
      previous_balance: 456.78,
    });

    expect(complemento).toBeDefined();
  });

  it('should cancel a CFDI and get SAT acknowledgement', async () => {
    const original = await stampWithRetry(buildTestCFDI({}));
    const cancelResult = await finkokClient.cancel(
      original.uuid,
      SAT_CATALOGS.emisor.rfc,
      process.env.CSD_CER_BASE64!,
      process.env.CSD_KEY_BASE64!,
      process.env.CSD_KEY_PASSWORD!,
    );

    expect(cancelResult.success).toBe(true);
    expect(cancelResult.acuse).toBeDefined();
  });
});
```

### 8.5 WhatsApp Message Delivery Testing

```typescript
// src/tests/integration/whatsapp.test.ts

describe('WhatsApp integration', () => {
  it('should send template message and receive delivery status', async () => {
    const result = await sendWhatsAppTemplate('recibo_listo', TEST_DATA.whatsapp.test_phone, {
      customer_name: 'Juan Perez',
      total: '456.78',
      due_date: '15 de abril 2026',
    });

    expect(result.message_id).toBeDefined();
    expect(result.status).toBe('sent');

    // Wait for delivery webhook
    const status = await waitForWebhook('whatsapp_status', result.message_id, 30000);
    expect(['delivered', 'read']).toContain(status);
  });

  it('should handle inbound message and route to AI agent', async () => {
    // Simulate inbound WhatsApp message
    await simulateInboundWhatsApp({
      from: TEST_DATA.whatsapp.test_phone,
      text: 'Quiero consultar mi saldo',
    });

    // Verify AI agent was invoked
    const agentLog = await getLatestAgentInvocation('whatsapp_cx');
    expect(agentLog.input).toContain('consultar mi saldo');
  });
});
```

---

## 9. Sprint-by-Sprint Integration Delivery

### Provider Account Setup Timeline (Start Immediately)

These tasks have multi-week lead times and must begin in Sprint 0 (before development):

| Task | Lead Time | Start | Ready By |
|------|-----------|-------|----------|
| Finkok sandbox account | 1-2 days | Sprint 0, Day 1 | Sprint 0 |
| Finkok production account | 1-2 weeks | Sprint 0, Day 1 | Sprint 2 |
| CEA CSD certificate from SAT | 1-4 weeks | Sprint 0, Day 1 | Sprint 3 |
| Conekta merchant account | 1-3 weeks | Sprint 0, Day 1 | Sprint 3 |
| STP CLABE concentradora | 2-4 weeks | Sprint 0, Day 1 | Sprint 4 |
| WhatsApp Business API (360dialog) | 2-4 weeks | Sprint 0, Day 1 | Sprint 3 |
| WhatsApp template pre-approval (5 templates) | 1-4 weeks | Sprint 1 | Sprint 4 |
| Twilio account + Mexican number | 1-2 weeks | Sprint 0, Day 1 | Sprint 2 |
| AWS SES production access | 1-2 weeks | Sprint 0, Day 1 | Sprint 2 |
| AquaCIS staging environment credentials | 1-2 weeks | Sprint 0, Day 1 | Sprint 1 |

### Sprint 0 (Week 1-2): Foundation

**Goal:** Provider accounts initiated, integration scaffolding in place.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Initiate ALL provider account signups | Account applications submitted | Business authorization |
| Set up integration project structure | `src/integrations/` folder tree with stubs | Repo created |
| Configure environment variables | `.env.example` with all integration vars | None |
| Set up Finkok sandbox | Sandbox stamping works | Finkok sandbox creds |
| Submit WhatsApp templates to Meta for pre-approval | 5 templates submitted | WABA number assigned |
| AquaCIS connectivity test | Can call `getDeuda` from Node.js | Staging credentials |
| Set up Conekta test mode | Test card charge works | Conekta test API key |
| Set up Twilio test mode | Test call/SMS works | Twilio test credentials |

### Sprint 1-2 (Weeks 3-6): CFDI + Legacy Bridge Core

**Goal:** CFDI stamping works end-to-end in sandbox. AquaCIS BFF adapter handles critical reads.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Finkok stamping service (stamp, cancel, status) | CFDI stamps in sandbox | Finkok sandbox |
| SAT catalog mapping (complete) | All product/unit/payment codes | None |
| CFDI 4.0 XML builder | Generates valid XML for water invoices | SAT catalogs |
| IVA calculation (domestic 0%, commercial 16%) | Correct tax on invoices | Tariff data |
| Complemento de pago builder | PPD payment receipts | Stamp service |
| AquaCIS SOAP-to-REST adapter (base class) | `AquasisClient` with WS-Security, error handling | AquaCIS staging |
| Customer identification endpoints (v2) | `getContratosPorNif`, `getTitularPorNif`, `getTitulares` | Adapter base |
| Debt visibility endpoints (v2) | `getDeudaTotalConFacturas`, `getImpagadosContrato`, `getDeudaContratoBloqueoCobro` | Adapter base |
| Work order query endpoints (v2) | `refreshData`, `getDocumentoOrdenTrabajo` | Adapter base |
| Known bug workarounds in BFF | `reultado` typo, `otClassID=1`, `idPtoServicio` validation | Adapter base |

### Sprint 3-4 (Weeks 7-10): Payment Channels

**Goal:** SPEI, OXXO, and card payments operational with webhook reconciliation.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| SPEI webhook handler | Process STP payment notifications | STP CLABE (should be ready) |
| SPEI reference generation per invoice | Unique numeric reference for each invoice | Invoice model |
| Conekta OXXO reference generation | Barcode creation via Conekta API | Conekta merchant account |
| Conekta OXXO webhook handler | Process OXXO payment notifications | Conekta webhook config |
| Conekta card tokenization (frontend) | Conekta.js integration, 3D Secure | Conekta public key |
| Conekta card charge (backend) | Process card payments via token | Conekta private key |
| Payment processing service | Unified `processPayment()` across all channels | All payment providers |
| Idempotency tokens for payments | Prevent double-collection | Payment service |
| `bloquearCobro` check before every payment | Safety gate from AquaCIS | AquaCIS adapter |
| AquaCIS payment notification (`avisarPago`) | Notify legacy system of payments | AquaCIS adapter |
| Daily reconciliation job (n8n workflow) | Compare SUPRA payments vs provider records | All providers |

### Sprint 5-6 (Weeks 11-14): Communication Channels

**Goal:** WhatsApp, Voice, SMS, and Email operational. AI agent handoff works.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| WhatsApp webhook handler (inbound messages) | Receive and route messages | WABA account (should be ready) |
| WhatsApp template sending (5 templates) | Send approved templates | Template pre-approval (should be done) |
| WhatsApp session messaging | Free-form replies within 24h window | Webhook handler |
| WhatsApp <-> Chatwoot/AGORA bridge | Messages sync to AGORA conversations | AGORA API token |
| Twilio Voice incoming call handler | TwiML response with gather | Twilio Mexican number |
| Twilio Voice <-> Claude AI integration | Speech-to-text to Claude, response back | Claude API key |
| Twilio SMS sending service | Send SMS notifications | Twilio number |
| AWS SES email service | Send invoice emails with PDF attachment | SES verified domain |
| Email HTML templates (invoice, reminder, confirmation) | Handlebars templates | Design spec |
| AI agent escalation to human (AGORA) | Handoff conversation from AI to agent | AGORA integration |

### Sprint 7-8 (Weeks 15-18): CRM + Self-Service Operations

**Goal:** AGORA fully integrated, self-service AquaCIS operations in BFF.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| AGORA contact synchronization | SUPRA persons <-> AGORA contacts | AGORA API |
| AGORA event webhook (conversation events) | SUPRA reacts to AGORA events | AGORA webhook config |
| AGORA conversation enrichment | Payment/invoice notes in conversations | Payment service |
| AquaCIS self-service BFF endpoints | Address change, bank change, mobile notification, meter reading | AquaCIS adapter |
| AquaCIS payment document generation (BFF) | `getDocumentoPago`, `getDocumentoPagoXML` | AquaCIS adapter |
| AquaCIS payment collection (BFF) | `cobrarReferenciaFrmPago`, `cobrarReferencia` | AquaCIS adapter + safety checks |
| CoDi/DiMo QR generation | QR codes for CoDi payments | QR library |
| Domiciliacion bancaria batch processing | CECOBAN batch file generation | Bank account setup |
| Ventanilla POS integration | Cash payment with thermal receipt | POS hardware |

### Sprint 9-10 (Weeks 19-22): Production Hardening + Accounting

**Goal:** All integrations production-ready. CFDI in production. Accounting sync.

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| CFDI production cutover (Finkok production) | Live SAT stamping with real CSD | CSD certificate, Finkok production |
| CFDI validation against SAT portal | Verify stamps at SAT website | Production stamps |
| SAP/CONTPAQi daily export | Journal entries to accounting | Chart of accounts mapping |
| Monthly reconciliation automation | SUPRA vs accounting comparison | Accounting export |
| Production webhook hardening | Retry logic, dead letter queue, monitoring | All webhooks |
| Payment reconciliation production mode | Daily automated reconciliation across all channels | All payment providers |
| WhatsApp message analytics | Delivery rates, read rates, response times | WhatsApp metadata |
| Integration monitoring dashboard (Grafana) | Real-time integration health | Metrics collection |
| Load testing all webhooks | 100 concurrent webhooks per endpoint | Load test tool |
| Security audit for all integrations | No credential leaks, webhook signatures verified, PCI compliance | Security team |

### Dependency Map

```
Sprint 0 (Foundation)
  |
  ├── Sprint 1-2 (CFDI + Legacy Bridge)
  |     |
  |     ├── Sprint 3-4 (Payments) ←── requires CFDI for complemento de pago
  |     |     |                        requires AquaCIS for avisarPago / bloquearCobro
  |     |     |
  |     |     └── Sprint 7-8 (CRM + Self-Service) ←── requires payment processing
  |     |           |
  |     |           └── Sprint 9-10 (Production) ←── all integrations ready
  |     |
  |     └── Sprint 5-6 (Communications) ←── requires WABA approval (started Sprint 0)
  |           |                               requires Twilio number (started Sprint 0)
  |           |
  |           └── Sprint 7-8 (CRM)
```

### Integration Delivery Milestones

| Milestone | Sprint | Criteria | Business Value |
|-----------|:------:|----------|----------------|
| **M1: First CFDI stamp** | 2 | Sandbox stamp validated | Billing proof-of-concept |
| **M2: First digital payment** | 4 | SPEI or card payment end-to-end | Revenue collection |
| **M3: First WhatsApp notification** | 5 | Template delivered to real phone | Customer communication |
| **M4: AI handles first call** | 6 | Voice AI resolves a balance inquiry | Call center support |
| **M5: First production CFDI** | 9 | Live stamp validated at SAT | Regulatory compliance |
| **M6: Full payment reconciliation** | 10 | All channels reconciled automatically | Financial control |
| **M7: Go-live integration** | 10 | All integrations production-hardened | System launch |

---

## Appendix A: Environment Variables Reference

```bash
# ---- CFDI / Finkok PAC ----
FINKOK_USERNAME=                    # Finkok account username
FINKOK_PASSWORD=                    # Finkok account password
FINKOK_ENVIRONMENT=sandbox          # 'sandbox' or 'production'
CEA_RFC=                            # CEA Queretaro's RFC
CSD_CER_BASE64=                     # Base64 of .cer file
CSD_KEY_BASE64=                     # Base64 of .key file
CSD_KEY_PASSWORD=                   # Password for .key file

# ---- Payments: Conekta ----
CONEKTA_PUBLIC_KEY=                 # Frontend tokenization key
CONEKTA_PRIVATE_KEY=                # Backend API key

# ---- Payments: SPEI/STP ----
SPEI_CLABE=                         # CLABE concentradora (18 digits)
STP_WEBHOOK_SECRET=                 # HMAC secret for webhook verification

# ---- WhatsApp (360dialog) ----
WHATSAPP_API_URL=https://waba.360dialog.io/v1
WHATSAPP_API_KEY=                   # 360dialog API key
WHATSAPP_PHONE_NUMBER_ID=           # WhatsApp phone number ID
WHATSAPP_VERIFY_TOKEN=              # Webhook verification token

# ---- Twilio (Voice + SMS) ----
TWILIO_ACCOUNT_SID=                 # Twilio account SID
TWILIO_AUTH_TOKEN=                  # Twilio auth token
TWILIO_PHONE_NUMBER=                # Mexican +52 number

# ---- Email (AWS SES) ----
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# ---- CRM (Chatwoot/AGORA) ----
AGORA_API_URL=http://agora:3000
AGORA_API_TOKEN=                    # Chatwoot API access token
AGORA_ACCOUNT_ID=                   # Chatwoot account ID

# ---- Legacy AquaCIS ----
AQUASIS_WS_USERNAME=                # WS-Security username (server-side ONLY)
AQUASIS_WS_PASSWORD=                # WS-Security password (server-side ONLY)

# ---- Accounting ----
ACCOUNTING_SYSTEM=contpaqi          # 'sap' or 'contpaqi'
ACCOUNTING_SFTP_HOST=
ACCOUNTING_SFTP_USER=

# ---- AI ----
ANTHROPIC_API_KEY=                  # Claude API key for agents
```

## Appendix B: Webhook Endpoint Summary

| Endpoint | Provider | Method | Auth | Purpose |
|----------|----------|--------|------|---------|
| `/api/v1/payments/spei/webhook` | STP | POST | HMAC-SHA256 | SPEI payment received |
| `/api/v1/payments/oxxo/webhook` | Conekta | POST | Digest header | OXXO payment collected |
| `/api/v1/payments/card/webhook` | Conekta | POST | Digest header | Card payment status |
| `/api/v1/payments/codi/webhook` | STP/Banxico | POST | HMAC-SHA256 | CoDi/DiMo payment |
| `/api/v1/payments/domiciliacion/webhook` | Bank | POST | mTLS | Direct debit result |
| `/api/v1/whatsapp/webhook` | 360dialog/Meta | GET/POST | Verify token | WhatsApp messages + status |
| `/api/v1/voice/incoming` | Twilio | POST | Request signing | Inbound phone call |
| `/api/v1/voice/process` | Twilio | POST | Request signing | Speech processing |
| `/api/v1/voice/status` | Twilio | POST | Request signing | Call status callback |
| `/api/v1/sms/status` | Twilio | POST | Request signing | SMS delivery status |
| `/api/v1/agora/webhook` | Chatwoot | POST | API token | Conversation events |

## Appendix C: Integration Health Checks

```typescript
// src/integrations/health-check.ts

// Run every 5 minutes via n8n or cron
async function integrationHealthCheck(): Promise<HealthCheckReport> {
  const checks = await Promise.allSettled([
    checkFinkok(),        // Stamp a test CFDI in sandbox
    checkConekta(),       // GET /api/v1/orders (list orders)
    checkSTP(),           // Ping STP status endpoint
    checkWhatsApp(),      // GET /v1/configs (360dialog)
    checkTwilio(),        // GET /2010-04-01/Accounts/{sid}
    checkAWSSES(),        // GET send statistics
    checkAgora(),         // GET /api/v1/profile
    checkAquaCIS(),       // Call getDeuda with test contract
  ]);

  return {
    timestamp: new Date().toISOString(),
    overall: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
    checks: checks.map((c, i) => ({
      name: PROVIDER_NAMES[i],
      status: c.status === 'fulfilled' ? 'up' : 'down',
      latency_ms: c.status === 'fulfilled' ? c.value.latency : null,
      error: c.status === 'rejected' ? c.reason.message : null,
    })),
  };
}
```

---

*ACTION_PLAN_INTEGRATIONS.md -- Integration Specialist*
*SUPRA Water 2026 -- CEA Queretaro*
*Generated 2026-02-16*
