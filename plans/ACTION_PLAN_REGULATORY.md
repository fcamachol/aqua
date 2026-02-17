# ACTION PLAN: Mexican Regulatory Compliance
## SUPRA Water 2026 — CEA Queretaro

**Document:** ACTION_PLAN_REGULATORY.md
**Date:** 2026-02-16
**Owner:** Regulatory & Compliance Specialist
**Status:** Draft v1.0

---

## Table of Contents

1. [LFPDPPP Data Protection Compliance](#1-lfpdppp-data-protection-compliance)
2. [CFDI 4.0 Fiscal Compliance](#2-cfdi-40-fiscal-compliance)
3. [Water Utility Regulatory Requirements](#3-water-utility-regulatory-requirements)
4. [Consumer Protection](#4-consumer-protection)
5. [Government IT Standards](#5-government-it-standards)
6. [Compliance Implementation Roadmap](#6-compliance-implementation-roadmap)
7. [Compliance Checklist](#7-compliance-checklist)

---

## 1. LFPDPPP Data Protection Compliance

### 1.1 Legal Framework

The **Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares (LFPDPPP)** was substantially reformed on March 21, 2025, replacing the 2010 version. The reform incorporates principles of data minimization, purpose limitation, and proactive accountability. Enforcement authority shifted from the dissolved INAI to the **Secretaria de Anticorrupcion y Buen Gobierno (SACBG)**.

> **Note on applicability:** CEA Queretaro is a state-level public organism. Public sector entities are governed by the **Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados (LGPDPPSO)**, published May 26, 2017 (DOF). However, SUPRA Water also processes data through private-sector processors (PAC providers, payment gateways, cloud providers), which fall under the LFPDPPP. Both frameworks require ARCO rights, privacy notices, breach notification, and data security. This plan addresses requirements from **both** laws.

**Key legal references:**
| Requirement | LGPDPPSO (Public Sector) | LFPDPPP (Private Sector) |
|---|---|---|
| ARCO rights | Arts. 43-66 | Arts. 28-35 (reformed 2025) |
| Privacy notice (Aviso de Privacidad) | Arts. 26-30 | Arts. 15-18 |
| Breach notification | Arts. 40-42 | Arts. 20 bis (reformed 2025) |
| Data retention/deletion | Arts. 23-25 | Arts. 11, 37 |
| Consent | Arts. 20-22 | Arts. 8-10 |
| Security measures | Arts. 31-39 | Arts. 19-20 |
| Cross-border transfers | Art. 68 | Arts. 36-37 |

### 1.2 ARCO Rights Implementation (Derechos ARCO)

ARCO = **A**cceso, **R**ectificacion, **C**ancelacion, **O**posicion

Each right must be implementable through the system with auditable tracking.

#### 1.2.1 Access (Acceso)

**Legal requirement (Art. 43 LGPDPPSO / Art. 28 LFPDPPP):** Any data subject (usuario/contribuyente) can request to know what personal data the system holds about them.

**Implementation:**
```
API Endpoint: GET /api/v1/arco/access-request
Trigger: Web portal form, WhatsApp message, in-person at CEA office
Process:
  1. Verify identity (RFC + CURP + one additional factor)
  2. Generate complete data export within 20 business days (Art. 47 LGPDPPSO)
  3. Data export includes: personal data, usage history, billing records,
     meter readings, payment history, contacts, complaints
  4. Export format: PDF human-readable + JSON machine-readable
  5. Delivery: secure download link (encrypted, 72-hour expiration)
  6. Log the request in arco_requests table with full audit trail
```

**Data included in access response:**
- `personas`: nombre, RFC, CURP, email, telefono, direccion
- `contratos`: contract details, service address, toma details
- `facturas`: billing history (last 5 years per fiscal requirements)
- `pagos`: payment records
- `lecturas`: meter reading history
- `ordenes_trabajo`: work orders associated with the account
- `contactos`: all contact interactions (calls, WhatsApp, in-person)
- `consentimientos`: consent records and privacy notice versions accepted

#### 1.2.2 Rectification (Rectificacion)

**Legal requirement (Art. 50 LGPDPPSO / Art. 30 LFPDPPP):** Data subjects can request correction of inaccurate, incomplete, or outdated personal data.

**Implementation:**
```
API Endpoint: POST /api/v1/arco/rectification-request
Fields subject to rectification:
  - Name/Razon social (requires INE/IFE or acta constitutiva)
  - RFC (requires CSF - Constancia de Situacion Fiscal from SAT)
  - CURP (requires CURP document from RENAPO)
  - Address (requires comprobante de domicilio)
  - Phone/Email (identity verification only)
  - Meter number (requires field verification work order)
Process:
  1. Receive request with supporting documentation
  2. Validate supporting documents
  3. Apply correction within 15 business days (Art. 51 LGPDPPSO)
  4. Notify data subject of completion
  5. Propagate correction to all system records (cascade update)
  6. Generate domain event: person.rectified
  7. Update CFDI records if RFC changed (reissue affected invoices)
```

#### 1.2.3 Cancellation (Cancelacion)

**Legal requirement (Art. 52 LGPDPPSO / Art. 31 LFPDPPP):** Data subjects can request deletion of their personal data when it is no longer necessary for the purpose it was collected, OR they withdraw consent.

**Implementation:**
```
API Endpoint: POST /api/v1/arco/cancellation-request
Process:
  1. Receive request
  2. Evaluate legal retention obligations (see 1.6 Retention Policy)
  3. If retention obligation exists:
     - Inform data subject of legal basis for retention
     - Block data from processing (bloqueo) per Art. 3-III LFPDPPP
     - Schedule deletion after retention period expires
  4. If no retention obligation:
     - Execute "soft delete" — anonymize PII fields
     - Replace: nombre → "USUARIO ELIMINADO"
     - Replace: RFC → null, CURP → null
     - Replace: telefono → null, email → null
     - Retain: account number, billing aggregates (anonymized)
     - Generate domain event: person.cancelled
  5. Response within 20 business days (Art. 53 LGPDPPSO)
```

**Blocking (Bloqueo) period:** Personal data enters a blocking period before final deletion. During this period:
- Data is not processed for any purpose
- Data is stored in a restricted-access area
- After blocking period, data is permanently deleted or anonymized

#### 1.2.4 Opposition (Oposicion)

**Legal requirement (Art. 55 LGPDPPSO / Art. 34 LFPDPPP):** Data subjects can oppose specific processing activities, especially automated decisions and marketing.

**Implementation:**
```
API Endpoint: POST /api/v1/arco/opposition-request
Opposable processing activities:
  - Marketing communications (WhatsApp, SMS, email)
  - Automated credit scoring / collections prioritization
  - Data sharing with third-party payment processors (beyond minimum)
  - Analytics and profiling
Non-opposable (legal obligation):
  - CFDI generation (fiscal obligation under CFF Art. 29)
  - CONAGUA reporting (aggregated, anonymized)
  - Service billing (contractual necessity)
  - Debt collection (legitimate interest)
Process:
  1. Receive request specifying which processing to oppose
  2. Evaluate if opposition is legally valid
  3. If valid: update consent/preferences record, cease processing
  4. If invalid: respond with legal basis for continued processing
  5. Response within 20 business days
```

**2025 Reform addition:** The reformed LFPDPPP introduces the right to object to **automated processing** that significantly affects a data subject's rights or freedoms. The collections intelligence agent's risk scoring must provide a mechanism for human review upon request.

### 1.3 Privacy Notice (Aviso de Privacidad)

**Legal requirement (Arts. 26-30 LGPDPPSO / Arts. 15-18 LFPDPPP):** Three modalities required.

#### 1.3.1 Integral Privacy Notice (Aviso de Privacidad Integral)

Required on first data collection. Full legal document. Must be available on the CEA website.

**Required content (Art. 27 LGPDPPSO):**
```
1. Identity and address of the data controller
   → "Comision Estatal de Aguas de Queretaro (CEA Queretaro)"
   → Registered office address

2. Personal data categories collected
   → Identification: nombre, RFC, CURP, INE
   → Contact: telefono, email, direccion
   → Financial: datos bancarios, historial de pagos
   → Service: lecturas de medidor, consumo, contratos
   → Geolocation: ubicacion de toma (service connection point)
   → Biometric: voice recordings (if Voice AI implemented)

3. Purposes of processing
   → Primary: provision of water/sewer services, billing, collections
   → Secondary: service improvement analytics, customer satisfaction
   → Legal: CFDI generation, CONAGUA reporting, fiscal compliance

4. Legal basis for processing
   → Contractual: service agreement (contrato de prestacion de servicios)
   → Legal obligation: CFF Art. 29 (CFDI), LAN (CONAGUA reports)
   → Legitimate interest: fraud detection, NRW reduction
   → Consent: marketing, analytics, secondary purposes

5. Third-party transfers
   → PAC (Proveedor Autorizado de Certificacion): Finkok/similar for CFDI
   → Payment processors: Conekta, STP (SPEI)
   → Government: SAT, CONAGUA, SEMARNAT (legal obligation)
   → Cloud provider: infrastructure hosting (see data residency 1.8)

6. ARCO rights mechanism
   → How to exercise: web portal, email, in-person at offices
   → Response time: 20 business days
   → Contact: datos.personales@ceaqueretaro.gob.mx

7. Consent revocation mechanism

8. Use of tracking technologies (cookies, analytics)

9. Updates procedure for privacy notice
```

#### 1.3.2 Simplified Privacy Notice (Aviso de Privacidad Simplificado)

For physical forms, kiosks, and secondary data collection points.

```
AVISO DE PRIVACIDAD SIMPLIFICADO

CEA Queretaro es responsable del tratamiento de sus datos personales.
Sus datos seran utilizados para: prestacion de servicios de agua potable,
alcantarillado y saneamiento, facturacion, cobranza y atencion al usuario.

Para conocer el aviso de privacidad integral, mecanismos para el ejercicio
de sus derechos ARCO, y opciones para revocar su consentimiento, visite:
https://www.ceaqueretaro.gob.mx/aviso-de-privacidad

Contacto: datos.personales@ceaqueretaro.gob.mx
```

#### 1.3.3 WhatsApp/Digital Channel Privacy Notice

For the WhatsApp CX agent and Voice AI agent, a privacy micro-notice must be presented before collecting any data.

```
WhatsApp first-interaction message:
"CEA Queretaro protege sus datos personales conforme a la LGPDPPSO.
Al continuar esta conversacion, acepta el tratamiento de sus datos para
atencion a su solicitud. Aviso de privacidad completo: [link]
Escriba ARCO para ejercer sus derechos de datos personales."

Voice AI prompt:
"Esta llamada puede ser grabada para fines de calidad y como evidencia
de su solicitud. Si desea conocer nuestro aviso de privacidad o ejercer
sus derechos ARCO, diga 'privacidad' en cualquier momento."
```

### 1.4 Consent Tracking Mechanism

**Database table: `consentimientos` (consents)**

```sql
CREATE TABLE consentimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  persona_id UUID NOT NULL REFERENCES personas(id),
  tipo_consentimiento VARCHAR(50) NOT NULL,
    -- 'aviso_privacidad_integral'
    -- 'aviso_privacidad_simplificado'
    -- 'comunicaciones_marketing'
    -- 'grabacion_voz'
    -- 'procesamiento_automatizado'
    -- 'transferencia_terceros'
  version_aviso VARCHAR(20) NOT NULL,  -- e.g., "2026.1"
  estado VARCHAR(20) NOT NULL DEFAULT 'otorgado',
    -- 'otorgado' (granted)
    -- 'revocado' (revoked)
    -- 'parcial' (partial — specific purposes only)
  canal_obtencion VARCHAR(30) NOT NULL,
    -- 'web_portal', 'whatsapp', 'presencial', 'telefono', 'app_movil'
  fecha_otorgamiento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_revocacion TIMESTAMPTZ,
  ip_address INET,
  evidencia JSONB,
    -- { "whatsapp_message_id": "...", "signed_form_url": "..." }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consentimientos_persona ON consentimientos(tenant_id, persona_id);
CREATE INDEX idx_consentimientos_tipo ON consentimientos(tenant_id, tipo_consentimiento, estado);
```

**Consent lifecycle:**
1. **Obtain:** At first interaction (contract signing, web registration, WhatsApp first message)
2. **Record:** Immutable log entry with timestamp, channel, evidence
3. **Verify:** Before any secondary processing, check consent state
4. **Revoke:** API endpoint for consent revocation; cease processing within 5 business days
5. **Re-consent:** When privacy notice is updated, trigger re-consent for affected data subjects

### 1.5 Data Breach Notification

**Legal requirement (Arts. 40-42 LGPDPPSO / Art. 20 bis LFPDPPP reformed 2025):**
- Notify affected data subjects **without undue delay** (sin dilacion)
- The LGPDPPSO requires notification to the **Organismo Garante** (in Queretaro: ITEQROO — Instituto de Transparencia y Acceso a la Informacion del Estado de Queretaro, or its successor under the 2025 reform)
- Penalties: fines up to approximately $1.7 million USD per the 2025 LFPDPPP reform

**Breach response procedure:**

```
INCIDENT RESPONSE PROTOCOL — DATA BREACH (Vulneracion de Datos Personales)

PHASE 1: DETECTION & CONTAINMENT (0-4 hours)
  1. Security team detects/receives breach report
  2. Activate incident response team
  3. Contain the breach (isolate affected systems)
  4. Preserve forensic evidence (logs, snapshots)
  5. Initial severity assessment (# of records, data types affected)

PHASE 2: ASSESSMENT (4-24 hours)
  1. Determine scope: which personal data was affected
  2. Classify data types: identification, financial, sensitive
  3. Count affected data subjects
  4. Determine attack vector and persistence
  5. Assess risk to data subjects' rights and freedoms

PHASE 3: NOTIFICATION (24-72 hours)
  If the breach "significativamente afecta" (significantly affects)
  the patrimonial or moral rights of data subjects:

  A. Notify affected individuals:
     - Nature of the breach
     - Personal data types affected
     - Recommendations for self-protection
     - Corrective actions taken
     - Contact information for inquiries
     Channels: email, WhatsApp (if consented), registered mail

  B. Notify regulatory authority:
     - Report to Organismo Garante (state level)
     - Report to SACBG if private-sector processors involved
     - Include: facts, data types, # affected, measures taken

  C. Notify CERT-MX (if cybersecurity incident)

PHASE 4: REMEDIATION (72 hours - 30 days)
  1. Implement permanent fixes
  2. Review and update security measures
  3. Update risk assessment
  4. Document lessons learned
  5. Update breach registry (registro de vulneraciones)

PHASE 5: POST-INCIDENT (30-90 days)
  1. External audit if required
  2. Update privacy impact assessment
  3. Retrain affected staff
  4. File compliance report with regulatory authority
```

**Breach registry (required by LGPDPPSO Art. 42):**
```sql
CREATE TABLE registro_vulneraciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  fecha_deteccion TIMESTAMPTZ NOT NULL,
  fecha_contencion TIMESTAMPTZ,
  fecha_notificacion_afectados TIMESTAMPTZ,
  fecha_notificacion_autoridad TIMESTAMPTZ,
  tipo_vulneracion VARCHAR(100) NOT NULL,
    -- 'acceso_no_autorizado', 'perdida', 'destruccion',
    -- 'uso_indebido', 'modificacion_no_autorizada'
  datos_afectados JSONB NOT NULL,
    -- ["RFC", "CURP", "datos_bancarios", "historial_pagos"]
  num_afectados INTEGER,
  descripcion TEXT NOT NULL,
  medidas_correctivas TEXT,
  estado VARCHAR(30) DEFAULT 'investigando',
    -- 'investigando', 'contenido', 'notificado', 'remediado', 'cerrado'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 1.6 Data Retention and Deletion Policies

Different data types have different legal retention requirements.

| Data Category | Retention Period | Legal Basis | Post-Retention Action |
|---|---|---|---|
| **CFDI/Facturas** | 5 years from issuance | CFF Art. 30 | Archive (no deletion — fiscal requirement) |
| **Contabilidad (accounting records)** | 5 years | CFF Art. 30 | Archive |
| **Payment records** | 5 years | CFF Art. 30 | Archive |
| **Contratos de servicio** | Duration of contract + 5 years | CFF Art. 30 + Ley de Aguas Qro. | Anonymize PII, retain contract structure |
| **Meter readings** | 5 years (billing) / indefinite (aggregated analytics) | CEA operational + CFF | Anonymize after 5 years; retain aggregated data |
| **Customer PII (RFC, CURP, name)** | Duration of service relationship + 5 years | LGPDPPSO Art. 23 + CFF | Blocking period (1 year) then deletion |
| **Contact interaction records** | 3 years | CEA operational policy | Anonymize |
| **WhatsApp conversations** | 2 years | CEA operational policy | Delete |
| **Voice recordings** | 1 year | CEA operational policy | Delete |
| **ARCO request records** | 5 years from resolution | LGPDPPSO Art. 45 | Archive |
| **Consent records** | Duration of consent + 5 years | LGPDPPSO + LFPDPPP | Archive |
| **Breach records** | 5 years from closure | LGPDPPSO Art. 42 | Archive |
| **Work orders** | 5 years | CEA operational | Anonymize PII |
| **Fraud case records** | 10 years | Penal code statute of limitations | Archive |
| **System audit logs** | 3 years (online) + 7 years (archive) | MAAGTICSI + best practice | Cold storage archive |
| **CONAGUA/SEMARNAT reports** | 5 years | LAN + LGEEPA | Archive |

**Deletion process:**
```
AUTOMATED DATA LIFECYCLE MANAGEMENT

1. Monthly scan: identify records past retention period
2. Generate deletion candidate report for DPO review
3. DPO approves deletion batch
4. Execute deletion:
   a. For PII: anonymize (replace with hashed placeholder)
   b. For complete records: soft delete + archive to cold storage
   c. For CFDI: NEVER delete — legal obligation
5. Generate deletion certificate (certificado de supresion)
6. Log deletion event in domain_events
```

### 1.7 Data Minimization

**Principle (Art. 6 LGPDPPSO / Art. 6-II LFPDPPP reformed):** Only collect personal data that is adequate, relevant, and limited to what is necessary.

**Application to SUPRA Water schema:**

| Field | Collected? | Justification |
|---|---|---|
| Nombre completo | Yes | Contract identification, CFDI |
| RFC | Yes | Fiscal obligation (CFF Art. 29) |
| CURP | Yes | Unique citizen identification |
| INE number | No (reference only) | Only referenced for identity verification, not stored |
| Fecha de nacimiento | No | Not needed for water service |
| Genero/Sexo | No | Not needed for water service |
| Estado civil | No | Not needed for water service |
| Telephone | Yes (1 primary) | Service notifications, billing |
| Email | Yes (optional) | Digital invoice delivery |
| Domicilio fiscal | Yes | CFDI 4.0 requirement (CP) |
| Domicilio de servicio | Yes | Service delivery |
| Datos bancarios (CLABE) | Yes (encrypted) | Direct debit (domiciliacion) |
| IP address | Yes (transient) | Security audit; deleted after 90 days |
| Geolocation of toma | Yes | Service infrastructure, not personal |
| Vulnerability status | Yes | Legal protection (Ley de Aguas Qro.) |
| Voice biometrics | No | Not stored; only real-time processing |
| Photograph | No | Not collected |

### 1.8 Cross-Border Data Transfer Restrictions

**Legal requirement (Art. 68 LGPDPPSO / Arts. 36-37 LFPDPPP):**
- International transfers require: (a) consent of data subject, OR (b) legal obligation, OR (c) adequate protection level in receiving country
- The data recipient must assume same obligations as the controller

**SUPRA Water data residency architecture:**

```
MANDATORY: All PII must reside in Mexico

PRIMARY DATABASE:
  → Azure Mexico Central (Queretaro) — PostgreSQL
  → All tables with PII: personas, contratos, facturas, pagos
  → Encryption at rest: Azure Disk Encryption (AES-256) + pgcrypto

ALLOWED CROSS-BORDER (non-PII or legal obligation):
  → SAT CFDI timbrado: via PAC API (data transits, not stored abroad)
  → Conekta/STP payment processing: tokenized, PCI DSS compliant
  → Claude AI API (Anthropic):
     - MUST NOT send raw PII to AI endpoints
     - Use anonymized/tokenized context only
     - Account numbers → tokens; names → "el usuario"
     - Meter readings → acceptable (not PII)

PROHIBITED:
  → Replication of PII to non-Mexico regions
  → Backup storage of PII outside Mexico
  → Analytics exports with identifiable PII to foreign services
  → Embedding PII in AI training data or vector stores abroad
```

**AI Agent PII safeguard:**
```typescript
// Before sending context to Claude API, strip PII
function sanitizeForAI(context: CustomerContext): SanitizedContext {
  return {
    accountId: context.accountId,  // internal ID, not RFC
    accountType: context.accountType,
    currentBalance: context.currentBalance,
    consumptionHistory: context.consumptionHistory,  // m3, no address
    vulnerability: context.isVulnerable,  // boolean only
    // STRIPPED: nombre, RFC, CURP, telefono, email, direccion
  };
}
```

### 1.9 Data Protection Officer (DPO) / Responsable de Datos Personales

**Legal requirement:** The LGPDPPSO requires public entities to designate a **Unidad de Transparencia** (Transparency Unit) responsible for ARCO requests (Art. 85). While a formal "DPO" role is not mandated by Mexican law as in GDPR, the 2025 LFPDPPP reform strengthens accountability requirements.

**Recommended structure for CEA Queretaro:**

```
PRIVACY GOVERNANCE STRUCTURE

1. Comite de Transparencia (Transparency Committee)
   → Required by LGPDPPSO Art. 64
   → At least 3 members including the head of the Transparency Unit
   → Classifies reserved/confidential information
   → Reviews ARCO denials
   → Approves privacy impact assessments

2. Unidad de Transparencia (Transparency Unit)
   → Required by LGPDPPSO Art. 85
   → Receives and processes ARCO requests
   → Manages privacy notices
   → Coordinates with regulatory authorities
   → First point of contact for data subjects

3. Responsable de Seguridad de Datos (Data Security Officer)
   → Manages technical security measures
   → Leads breach response team
   → Conducts security assessments
   → Reports to Comite de Transparencia

4. In SUPRA Water system:
   → ARCO API endpoints route to Transparency Unit queue
   → Automated tracking of 20-business-day SLA
   → Dashboard for ARCO request status
   → Escalation alerts at 15, 18, 19 business days
```

---

## 2. CFDI 4.0 Fiscal Compliance

### 2.1 Legal Framework

- **Codigo Fiscal de la Federacion (CFF):** Arts. 29, 29-A — obligation to issue CFDI
- **Anexo 20 of the Resolucion Miscelanea Fiscal (RMF):** Technical standard for CFDI 4.0
- **RMF 2026:** Annual fiscal rules including cancellation procedures
- **Ley del IVA (LIVA):** Art. 2-A — rate differentiation for water services

**2026 Reform highlights:**
- CFF Art. 29-A Fraction IX (new): CFDIs must reflect **real and truthful operations**; false CFDIs carry criminal penalties
- SAT has expedited verification powers to audit CFDI authenticity
- Updated SAT catalog codes as of December 31, 2025

### 2.2 Complete CFDI 4.0 Field Mapping for Water Utility Invoices

```xml
<!-- CFDI 4.0 Structure for Water Utility Invoice -->
<cfdi:Comprobante
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0"
  Serie="SUPRA"
  Folio="{sequential_number}"
  Fecha="{ISO 8601 timestamp}"
  FormaPago="{SAT payment form code}"
  SubTotal="{sum of conceptos before tax}"
  Moneda="MXN"
  Total="{final total}"
  TipoDeComprobante="I"
  MetodoPago="{PUE or PPD}"
  LugarExpedicion="{CP of CEA office}"
  Exportacion="01">

  <!-- EMISOR: CEA Queretaro -->
  <cfdi:Emisor
    Rfc="{CEA_RFC}"
    Nombre="COMISION ESTATAL DE AGUAS DE QUERETARO"
    RegimenFiscal="603"/>  <!-- Personas morales con fines no lucrativos -->

  <!-- RECEPTOR: Customer -->
  <cfdi:Receptor
    Rfc="{customer_RFC or XAXX010101000}"
    Nombre="{customer_name_as_in_CSF}"
    DomicilioFiscalReceptor="{customer_CP}"
    RegimenFiscalReceptor="{customer_fiscal_regime}"
    UsoCFDI="{G03 or S01}"/>

  <cfdi:Conceptos>
    <!-- Water Service -->
    <cfdi:Concepto
      ClaveProdServ="10171500"
      ClaveUnidad="MTQ"
      Cantidad="{m3_consumed}"
      Descripcion="Servicio de agua potable"
      ValorUnitario="{price_per_m3_weighted}"
      Importe="{water_amount}"
      ObjetoImp="01">  <!-- 01 = No objeto de impuesto (domestic) -->
      <!-- OR ObjetoImp="02" for commercial with IVA -->
    </cfdi:Concepto>

    <!-- Sewer Service (Alcantarillado) -->
    <cfdi:Concepto
      ClaveProdServ="72151802"
      ClaveUnidad="E48"
      Cantidad="1"
      Descripcion="Servicio de alcantarillado"
      ValorUnitario="{alcantarillado_amount}"
      Importe="{alcantarillado_amount}"
      ObjetoImp="01"/>

    <!-- Sanitation Service (Saneamiento) -->
    <cfdi:Concepto
      ClaveProdServ="72151801"
      ClaveUnidad="E48"
      Cantidad="1"
      Descripcion="Servicio de saneamiento"
      ValorUnitario="{saneamiento_amount}"
      Importe="{saneamiento_amount}"
      ObjetoImp="01"/>
  </cfdi:Conceptos>

  <!-- Taxes section: only if commercial with IVA -->
  <cfdi:Impuestos TotalImpuestosTrasladados="{total_iva}">
    <cfdi:Traslados>
      <cfdi:Traslado
        Base="{taxable_base}"
        Impuesto="002"
        TipoFactor="Tasa"
        TasaOCuota="0.160000"
        Importe="{iva_amount}"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>

</cfdi:Comprobante>
```

### 2.3 IVA Rules for Water Utility Services

**Legal basis: Ley del Impuesto al Valor Agregado (LIVA) Art. 2-A, Fraccion II, inciso h)**

| Customer Type | Service | IVA Rate | ObjetoImp | TipoFactor | Notes |
|---|---|---|---|---|---|
| **Domestic (uso domestico)** | Agua potable | 0% (tasa 0) | "02" | Tasa 0.000000 | LIVA Art. 2-A, Fr. II, inc. h) |
| **Domestic** | Alcantarillado | 0% (tasa 0) | "02" | Tasa 0.000000 | Same provision |
| **Domestic** | Saneamiento | 0% (tasa 0) | "02" | Tasa 0.000000 | Same provision |
| **Commercial/Industrial** | Agua potable | 16% | "02" | Tasa 0.160000 | General rate LIVA Art. 1 |
| **Commercial/Industrial** | Alcantarillado | 16% | "02" | Tasa 0.160000 | General rate |
| **Commercial/Industrial** | Saneamiento | 16% | "02" | Tasa 0.160000 | General rate |
| **Government entity** | All services | 0% (tasa 0) | "02" | Tasa 0.000000 | Government as public service |
| **Publico general** | All services | 0% (tasa 0) | "01" | N/A | No objeto de impuesto |

> **Critical distinction:** The 0% rate (tasa cero) is different from "exempt" (exento). Water for domestic use applies **tasa 0%** (Art. 2-A LIVA), which means the tax applies but at zero rate. This has fiscal implications: CEA can credit IVA paid on inputs (IVA acreditable) against tasa 0% operations.

**Implementation in billing engine:**
```typescript
function calculateIVA(contract: Contract, lineItems: InvoiceLine[]): TaxCalculation {
  const customerType = contract.uso;  // 'domestico', 'comercial', 'industrial', 'gobierno'

  switch (customerType) {
    case 'domestico':
    case 'gobierno':
      return {
        rate: 0.00,
        tipoFactor: 'Tasa',
        tasaOCuota: '0.000000',
        objetoImp: '02',  // Si objeto de impuesto (tasa 0)
      };
    case 'comercial':
    case 'industrial':
      return {
        rate: 0.16,
        tipoFactor: 'Tasa',
        tasaOCuota: '0.160000',
        objetoImp: '02',
      };
    default:
      // Publico general — no objeto de impuesto
      return {
        rate: 0,
        tipoFactor: null,
        tasaOCuota: null,
        objetoImp: '01',
      };
  }
}
```

### 2.4 SAT Catalog Codes for Water Utilities

**Product/Service codes (ClaveProdServ):**

| Code | Description | Use |
|---|---|---|
| `10171500` | Agua (Water) | Main water service charge |
| `72151802` | Servicios de alcantarillado (Sewerage services) | Sewer service charge |
| `72151801` | Servicios de saneamiento (Sanitation services) | Wastewater treatment charge |
| `72101500` | Servicios de mantenimiento de sistemas de agua (Water system maintenance) | Reconnection, maintenance charges |
| `72102900` | Servicios de instalacion de tuberias (Pipe installation services) | New connection charges (acometida) |
| `81112200` | Mantenimiento de software (Software maintenance) | If SUPRA charges tech fees |

**Unit codes (ClaveUnidad):**

| Code | Description | Use |
|---|---|---|
| `MTQ` | Metro cubico (Cubic meter) | Water consumption |
| `E48` | Unidad de servicio (Service unit) | Fixed service charges |
| `H87` | Pieza (Piece) | Physical items (meter, fittings) |
| `ACT` | Actividad (Activity) | Service activities (reconnection) |

**Payment form codes (FormaPago):**

| Code | Description | SUPRA Payment Channel |
|---|---|---|
| `01` | Efectivo (Cash) | In-office cash, OXXO |
| `02` | Cheque nominativo | Check payments |
| `03` | Transferencia electronica de fondos | SPEI, bank transfer |
| `04` | Tarjeta de credito | Credit card via Conekta |
| `28` | Tarjeta de debito | Debit card via Conekta |
| `99` | Por definir | PPD method (payment pending) |

**Payment method (MetodoPago):**

| Code | Description | When Used |
|---|---|---|
| `PUE` | Pago en una sola exhibicion | Immediate full payment |
| `PPD` | Pago en parcialidades o diferido | Payment agreements (convenios), deferred |

**CFDI use (UsoCFDI):**

| Code | Description | When Used |
|---|---|---|
| `G03` | Gastos en general | Most common for water service |
| `S01` | Sin efectos fiscales | Publico general, non-deductible |
| `P01` | Por definir | When customer doesn't specify |

**Fiscal regime codes (RegimenFiscal):**

| Code | Description | Typical User |
|---|---|---|
| `601` | General de Ley Personas Morales | Commercial companies |
| `603` | Personas Morales con Fines no Lucrativos | CEA Queretaro (emisor), government entities |
| `605` | Sueldos y Salarios | Individuals (empleados) |
| `606` | Arrendamiento | Landlords (property owners) |
| `612` | Personas Fisicas con Actividades Empresariales | Small business owners |
| `616` | Sin obligaciones fiscales | Informal sector, publico general |
| `625` | Regimen Simplificado de Confianza (RESICO) | Small taxpayers (since 2022) |

### 2.5 RFC Validation Rules

**Format validation:**

```
RFC for Personas Morales (companies):   [A-Z&]{3}[0-9]{6}[A-Z0-9]{3}  (12 characters)
  Example: CEA991231AB3

RFC for Personas Fisicas (individuals): [A-Z&]{4}[0-9]{6}[A-Z0-9]{3}  (13 characters)
  Example: GAPA850101HM3

Special RFCs:
  XAXX010101000 — Publico general (unregistered customers)
  XEXX010101000 — Foreign residents (extranjeros)
```

**Validation layers:**
1. **Format validation:** Regex match for structure
2. **Homoclave verification:** Last 3 characters via SAT algorithm (modulo 11)
3. **SAT Lista 69-B check:** Verify RFC is not in the "EFOS" blacklist (Art. 69-B CFF — companies simulating operations)
4. **Constancia de Situacion Fiscal (CSF):** For CFDI 4.0, the name and fiscal regime must match the CSF exactly. SAT provides a validation web service (ws) for this.

**Implementation:**
```typescript
interface RFCValidation {
  isFormatValid: boolean;
  isHomoclaveValid: boolean;
  isSATBlacklisted: boolean;  // 69-B check
  csfMatch: {
    nameMatches: boolean;
    regimenMatches: boolean;
    cpMatches: boolean;
  };
  isPublicoGeneral: boolean;  // XAXX010101000
  isExtranjero: boolean;       // XEXX010101000
}
```

### 2.6 CURP Validation Rules

**Format:** 18 characters: `[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9][0-9]`

```
Position:  1-4   First letters of apellido paterno, materno, nombre
Position:  5-10  Fecha de nacimiento (YYMMDD)
Position:  11    Sexo (H = hombre, M = mujer)
Position:  12-13 Estado de nacimiento (two-letter code)
Position:  14-16 First consonants of apellido paterno, materno, nombre
Position:  17    Disambiguation character
Position:  18    Check digit (verification)
```

**Validation:**
1. Format regex check
2. RENAPO (Registro Nacional de Poblacion) web service validation
3. CURP is not strictly required for water service contracts, but is useful for unique identification and cross-referencing with government databases

### 2.7 Publico General Handling (XAXX010101000)

For customers who do not provide RFC (informal sector, refuse to share):

```
CFDI for Publico General:
  Receptor.Rfc = "XAXX010101000"
  Receptor.Nombre = "PUBLICO GENERAL"
  Receptor.DomicilioFiscalReceptor = "{CP of CEA office}" (emisor's CP)
  Receptor.RegimenFiscalReceptor = "616" (Sin obligaciones fiscales)
  Receptor.UsoCFDI = "S01" (Sin efectos fiscales)

Rules:
  - CFDI amount must not exceed $2,000 MXN per transaction
    (per RMF 2026 rule for publico general)
  - If invoice exceeds $2,000 MXN, customer RFC is REQUIRED
  - No IVA desglose — use ObjetoImp="01" (No objeto de impuesto)
```

### 2.8 Complemento de Pago (Payment Complement)

**When required:** When MetodoPago = "PPD" (Pago en Parcialidades o Diferido)

This applies to:
- Payment agreements (convenios de pago) — customer pays in installments
- Deferred payments — invoice issued before payment received
- Large commercial accounts with credit terms

**Structure:**
```xml
<cfdi:Comprobante TipoDeComprobante="P" ...>
  <cfdi:Emisor .../>
  <cfdi:Receptor .../>
  <cfdi:Conceptos>
    <cfdi:Concepto
      ClaveProdServ="84111506"
      ClaveUnidad="ACT"
      Cantidad="1"
      Descripcion="Pago"
      ValorUnitario="0"
      Importe="0"
      ObjetoImp="01"/>
  </cfdi:Conceptos>
  <pago20:Pagos Version="2.0">
    <pago20:Totales
      TotalTrasladosBaseIVA16="{base}"
      TotalTrasladosImpuestoIVA16="{iva_amount}"
      MontoTotalPagos="{total_paid}"/>
    <pago20:Pago
      FechaPago="{payment_date}"
      FormaDePagoP="{payment_form_code}"
      MonedaP="MXN"
      Monto="{amount_paid}">
      <pago20:DoctoRelacionado
        IdDocumento="{UUID_of_original_CFDI}"
        Serie="{original_serie}"
        Folio="{original_folio}"
        MonedaDR="MXN"
        NumParcialidad="{installment_number}"
        ImpSaldoAnt="{previous_balance}"
        ImpPagado="{amount_applied}"
        ImpSaldoInsoluto="{remaining_balance}"
        ObjetoImpDR="02"
        EquivalenciaDR="1"/>
    </pago20:Pago>
  </pago20:Pagos>
</cfdi:Comprobante>
```

**Generation rules:**
1. Generate complemento de pago within the calendar month following the payment
2. One complemento can cover multiple payments to multiple invoices
3. The original CFDI (ingreso) remains unchanged; the complemento references it by UUID
4. When the full balance is paid, the sum of all complementos must equal the original CFDI total

### 2.9 CFDI Cancellation Rules (RMF 2026)

**Rule 2.7.1.34 RMF 2026:**

| Scenario | Receiver Acceptance Required? | Deadline |
|---|---|---|
| CFDI amount > $1,000 MXN | Yes | Receiver has 3 business days to accept/reject |
| CFDI amount <= $1,000 MXN | No | Direct cancellation |
| CFDI for payroll (nomina) | No | Direct cancellation |
| CFDI type egreso (nota de credito) | No | Direct cancellation |
| CFDI with Complemento de Pago | **Yes (new 2026)** | Receiver has 3 business days |

**Cancellation deadlines (Rule 2.7.1.34):**
- CFDIs issued in fiscal year 2025: legal entities must cancel by **March 31, 2026**; individuals by **April 30, 2026**
- After deadline: cancellation requires formal SAT process (declaracion complementaria)

**Cancellation reasons (MotivoCancelacion):**
| Code | Description | When Used |
|---|---|---|
| `01` | Comprobante emitido con errores con relacion | Error, replacement CFDI issued |
| `02` | Comprobante emitido con errores sin relacion | Error, no replacement |
| `03` | No se llevo a cabo la operacion | Service not delivered |
| `04` | Operacion nominativa en CFDI global | Global invoice adjustment |

**Implementation in SUPRA:**
```
CFDI CANCELLATION WORKFLOW

1. Billing user or system initiates cancellation request
2. System validates:
   a. Is CFDI within cancellation deadline?
   b. Does amount require receiver acceptance?
   c. Is there an associated complemento de pago?
3. If receiver acceptance needed:
   a. Send cancellation request to PAC (Finkok)
   b. PAC notifies SAT → SAT notifies receiver
   c. Wait up to 3 business days for response
   d. If no response: auto-accepted
   e. If rejected: escalate to manual resolution
4. If cancellation approved:
   a. Mark CFDI as cancelled in database
   b. Generate replacement CFDI if MotivoCancelacion = "01"
   c. Update invoice status in billing system
   d. Log domain event: cfdi.cancelled
5. Generate CFDI cancellation receipt (acuse de cancelacion)
```

### 2.10 DIOT (Declaracion Informativa de Operaciones con Terceros)

**Legal requirement (LIVA Art. 32, Fraccion VIII):** Monthly informative declaration of operations with third parties.

**CEA Queretaro DIOT obligations:**
- Report all operations with suppliers and service providers
- Monthly filing by the 17th of the following month
- Report format: XML via SAT portal or batch upload

**SUPRA automation:**
```
DIOT MONTHLY GENERATION

Data sources:
  - Supplier payments (proveedores)
  - Service provider invoices received
  - Payment complement CFDIs issued

Report fields per third party:
  - RFC of third party
  - Type of operation (servicios, arrendamiento, etc.)
  - Taxable amount at 16%
  - Taxable amount at 0%
  - Amount not subject to IVA
  - IVA withheld (retenido)

Schedule: Auto-generate by 10th of each month, review by 15th, file by 17th
```

### 2.11 SAT Catalog Versioning and Updates

**Current catalog version:** Updated December 31, 2025 (effective January 1, 2026)

**Update monitoring process:**
```
1. Subscribe to SAT RSS feed / official communications
2. Monthly check: compare local catalog versions against SAT published versions
3. When update detected:
   a. Download new catalog XML from SAT
   b. Diff against current catalog
   c. Identify affected CFDI generation logic
   d. Update internal lookup tables
   e. Test with PAC validation
   f. Deploy update
4. Maintain catalog version history for audit
5. Never delete old catalog entries — mark as inactive with vigencia dates
```

**Catalog tables to maintain:**
- `sat_claves_prod_serv` — Product/service codes
- `sat_claves_unidad` — Unit of measure codes
- `sat_formas_pago` — Payment form codes
- `sat_metodos_pago` — Payment method codes
- `sat_usos_cfdi` — CFDI use codes
- `sat_regimenes_fiscales` — Fiscal regime codes
- `sat_tipos_relacion` — Relation types for related CFDIs
- `sat_motivos_cancelacion` — Cancellation reason codes
- `sat_codigos_postales` — Postal codes (for fiscal address validation)

---

## 3. Water Utility Regulatory Requirements

### 3.1 CONAGUA Reporting Obligations

**Legal basis:** Ley de Aguas Nacionales (LAN), reformed December 11, 2025, and its Reglamento.

CEA Queretaro operates under a **titulo de asignacion** (assignment title) from CONAGUA for public water supply. The new Ley General de Aguas (2025) creates a **Registro Nacional de Aguas** replacing the former REPDA.

#### 3.1.1 Monthly Water Extraction Volume Report

**Requirement:** Report volumes extracted from each source (well, dam, spring) per month.

```
CONAGUA MONTHLY EXTRACTION REPORT — SUPRA AUTOMATION

Data sources:
  - Smart meters on extraction wells (telelectura)
  - Production meter readings (manual or automated)
  - Bulk water purchase receipts (if applicable)

Report fields per extraction point:
  - Titulo/asignacion number
  - Source identification (pozo, presa, manantial)
  - Geographic coordinates
  - Monthly volume extracted (m3)
  - Assigned/authorized volume (m3)
  - Percentage of authorized volume used
  - Operating hours of extraction equipment
  - Water quality parameters (if available)

Format: XML per CONAGUA schema / SIGA (Sistema Integral de Gestion del Agua)
Deadline: 10th of the following month
Automation: Generate report from meter_readings + production_logs tables
Review: Water operations manager approves before submission
```

#### 3.1.2 Quarterly Efficiency Metrics

**Requirement:** Report key performance indicators to CONAGUA quarterly.

```
QUARTERLY EFFICIENCY REPORT

KPIs required:
  1. Eficiencia fisica (Physical efficiency)
     = Volume billed / Volume produced × 100
     Target: > 60% (national average ~55%)

  2. Eficiencia comercial (Commercial efficiency)
     = Revenue collected / Revenue billed × 100
     Target: > 85%

  3. Agua No Contabilizada / NRW (Non-Revenue Water)
     = (Volume produced - Volume billed) / Volume produced × 100
     Target: < 40%

  4. Cobertura de servicio (Service coverage)
     = Connections served / Total connections in service area × 100

  5. Dotacion (Per-capita supply)
     = Liters per capita per day (l/hab/dia)

  6. Micromedicion (Metering coverage)
     = Metered connections / Total connections × 100

  7. Tarifa media (Average tariff)
     = Total revenue / Total volume billed ($/m3)

Data sources:
  - invoices table (billed volumes and amounts)
  - payments table (collected amounts)
  - meter_readings table (consumption data)
  - production logs (extraction volumes)
  - tomas table (connection count, metering status)

Format: PIGOO (Programa de Indicadores de Gestion de Organismos Operadores)
Deadline: 30 days after quarter end
```

#### 3.1.3 Annual Water Balance Report (Balance Hidrico)

```
ANNUAL WATER BALANCE

Components:
  Supply side:
    - Total volume extracted by source
    - Volume purchased (if any)
    - Volume received from other operators

  Demand side:
    - Volume billed to domestic users
    - Volume billed to commercial/industrial users
    - Volume billed to government/public entities
    - Volume used internally (flushing, fire hydrants)
    - Estimated unbilled authorized consumption

  Losses:
    - Apparent losses (meter inaccuracy, unauthorized consumption)
    - Real losses (leaks, pipe breaks, overflow)

  Balance:
    Total supply = Total demand + Total losses
    NRW = Apparent losses + Real losses + Unbilled authorized

Automation: Auto-calculate from SUPRA data, present for review
Deadline: March 31 of the following year
```

### 3.2 SEMARNAT Wastewater Discharge Reporting

**Legal basis:** NOM-001-SEMARNAT-2021 — Permissible limits of contaminants in wastewater discharges to national water bodies. Published DOF March 11, 2022; in force since March 11, 2023.

**Requirements for CEA Queretaro:**
```
WASTEWATER DISCHARGE COMPLIANCE

1. Discharge permit:
   - CEA must hold SEMARNAT discharge permit for each treatment plant
   - Permit specifies: receiving body, max volume, max contaminant levels

2. Monitoring parameters (NOM-001-SEMARNAT-2021):
   - Temperature (max 35°C for rivers)
   - pH (5-10 range)
   - Suspended solids (SST)
   - Biochemical oxygen demand (DBO5)
   - Chemical oxygen demand (DQO) — NEW in 2021 version
   - Total nitrogen
   - Total phosphorus
   - Fats and oils
   - Fecal coliforms / E. coli
   - Toxicity — NEW in 2021 version
   - True color — NEW in 2021 version
   - Heavy metals (as applicable)

3. Reporting frequency:
   - Monthly self-monitoring (internal)
   - Quarterly reports to SEMARNAT/CONAGUA
   - Annual certification by accredited laboratory

4. SUPRA automation:
   - Integration with SCADA/lab systems for quality parameters
   - Automated comparison against permitted limits
   - Alert system when parameters approach limits (80% threshold)
   - Report generation per SEMARNAT format
   - Domain event: discharge.parameter_exceeded for immediate action

5. Compliance timeline:
   - Full compliance with NOM-001-SEMARNAT-2021 by March 11, 2027
     (deferred compliance programs accepted until this date)
```

### 3.3 NOM Standards for Water Metering

**Note:** NOM-007-CONAGUA-1997 addressed water tank safety requirements and was cancelled in 2014. The applicable standards for water metering are:

| Standard | Description | Relevance |
|---|---|---|
| **NOM-012-SCFI-1994** | Requirements for cold water meters (medidores de agua potable fria) | Meter technical specifications |
| **NMX-AA-179-SCFI-2018** | Selection, installation, and operation of meters for national water use | Comprehensive meter management |
| **NOM-001-CONAGUA-2011** | Water supply systems, service connections, and sewer systems — hermetic sealing tests | Connection specifications |
| **NMX-AA-149/1-SCFI-2018** | Drinking water meters — Part 1: Metrological and technical requirements | Accuracy classes |

**Implementation in SUPRA:**
```
METER MANAGEMENT COMPLIANCE

1. Meter specification tracking:
   - Brand, model, serial number
   - NOM compliance certificate number
   - Accuracy class (per NMX-AA-149)
   - Installation date
   - Last calibration date
   - Next calibration due date

2. Calibration schedule:
   - Residential meters: every 5-8 years (per manufacturer + NMX)
   - Commercial/industrial meters: every 2-3 years
   - Bulk/production meters: annually

3. Accuracy monitoring:
   - Flag meters with consumption patterns suggesting malfunction
   - Compare consumption vs historical baseline
   - Auto-generate replacement work orders for aged/inaccurate meters

4. Table: medidores
   - Fields: serial, marca, modelo, clase_precision, nom_certificado,
     fecha_instalacion, fecha_ultima_calibracion, fecha_proxima_calibracion,
     estado ('activo', 'retirado', 'en_calibracion', 'danado')
```

### 3.4 State-Level Regulatory Requirements — Queretaro

**Legal basis:** Ley que Regula la Prestacion de los Servicios de Agua Potable, Alcantarillado y Saneamiento del Estado de Queretaro (published May 21, 2022, in La Sombra de Arteaga; reformed April 9, 2024).

#### 3.4.1 Tariff Regulation

```
TARIFF GOVERNANCE — QUERETARO

Legal process:
  1. CEA proposes tariff structure based on:
     - Financial sustainability analysis (equilibrio presupuestal)
     - Operating cost projections
     - Infrastructure investment plan
     - Social impact assessment

  2. State government reviews and approves via:
     - Secretaria de Finanzas del Estado
     - Periódico Oficial "La Sombra de Arteaga" publication

  3. Tariff structure (per Ley de Aguas Qro. Arts. 51, 69, 154):
     - Classified by socioeconomic zones
     - Determined by: zone type, contract type, m3 consumed
     - Tiered/block rate structure (tarifa escalonada metro a metro)

  4. Service components in tariff:
     - Agua potable: base rate per m3 tier
     - Alcantarillado: 10% surcharge on water amount
     - Saneamiento: 12% surcharge on water amount

  5. Tariff updates:
     - Published in La Sombra de Arteaga
     - Recent: February 1, 2025 (current); May 1, 2025 (updated)
     - November 1, 2025 (latest update)

SUPRA implementation:
  - tariff_schedules table with effective_from/effective_to dates
  - JSONB blocks array with per-m3 pricing tiers
  - Automatic tariff version management
  - Billing engine selects correct tariff based on:
    a. Contract type (domestico, comercial, industrial, gobierno)
    b. Zone classification
    c. Invoice period dates (match to effective tariff)
  - Tariff change alerts to billing team when new version published
```

#### 3.4.2 Service Quality Indicators

**Required state-level reporting:**

| Indicator | Target | Measurement |
|---|---|---|
| Continuidad del servicio | > 18 hrs/day | SCADA monitoring |
| Presion en red | 1.0 - 5.0 kg/cm2 | Pressure sensors |
| Calidad de agua potable | NOM-127-SSA1-2021 compliant | Lab testing |
| Atencion a fugas | < 24 hrs response | Work order SLA |
| Atencion a quejas | Per Ley de Aguas Qro. | Contact center SLA |
| Cobertura de micromedicion | > 90% (goal) | Meter installation tracking |

---

## 4. Consumer Protection

### 4.1 Vulnerability Classification

**Legal basis:** Ley que Regula la Prestacion de los Servicios de Agua Potable, Alcantarillado y Saneamiento del Estado de Queretaro (reformed 2024) + Article 4 of the Mexican Constitution (human right to water).

The 2024 reform to the Queretaro water law guarantees a **minimum supply of 50 liters per person per day** to all inhabitants, aligned with World Health Organization recommendations.

**Vulnerability categories in SUPRA:**

```sql
-- In personas table
vulnerable BOOLEAN DEFAULT FALSE,
vulnerability_type VARCHAR(50),
  -- 'adulto_mayor'      — Senior citizen (60+ years)
  -- 'discapacidad'      — Person with disability
  -- 'pobreza_extrema'   — Extreme poverty (validated by SEDESOL/Bienestar)
  -- 'madre_soltera'     — Single mother head of household
  -- 'indigena'          — Indigenous community member
  -- 'enfermedad_cronica'— Chronic illness requiring water (dialysis, etc.)
vulnerability_document TEXT,     -- Supporting documentation reference
vulnerability_validated_at TIMESTAMPTZ,
vulnerability_validated_by UUID, -- Employee who validated
vulnerability_expires_at TIMESTAMPTZ, -- Annual revalidation
```

**Validation process:**
```
VULNERABILITY REGISTRATION

1. Customer presents at CEA office or requests via WhatsApp
2. Documentation required:
   - Adulto mayor: INE showing age 60+
   - Discapacidad: Credential from DIF or CONADIS
   - Pobreza extrema: Constancia de Bienestar or CONEVAL classification
   - Madre soltera: Birth certificates + declaration
   - Indigena: Community certification
   - Enfermedad cronica: Medical certificate
3. CEA social worker validates and approves
4. System flags account as vulnerable
5. Annual revalidation required (system auto-schedules)
6. Vulnerability status triggers:
   a. Disconnection protection (see 4.2)
   b. Potential tariff discount (per tariff structure)
   c. Collections intelligence: excluded from automated escalation
   d. Priority for payment agreement offers
```

### 4.2 Service Disconnection Rules (Reglas de Corte)

**Legal basis:** Ley de Aguas Queretaro (reformed 2024), Articles regarding suspension and restriction of service.

```
SERVICE DISCONNECTION PROTOCOL

GENERAL RULES:
  1. Written notice (previo aviso) required:
     - Minimum 10 business days before disconnection
     - Must specify: amount owed, deadline, consequences
     - Delivery: physical notice at property + WhatsApp/SMS if registered

  2. Grounds for disconnection:
     - Two or more billing periods in arrears (comercial/industrial)
     - Per tariff regulations for domestic
     - Unauthorized modification of service connection
     - Meter tampering or fraud

  3. PROHIBITED disconnections:
     - Vulnerable accounts (see 4.1) — CANNOT be fully disconnected
     - Vulnerable accounts may have flow restriction (restriccion)
       but must maintain minimum 50 liters/person/day
     - During declared public health emergencies
     - For amounts in active dispute (reclamacion en curso)
     - For debt older than 5 years (prescripcion)

  4. Restriction vs disconnection:
     - Restriccion: flow reducer installed, minimum supply maintained
     - Corte total: full disconnection of supply
     - Only non-vulnerable, non-domestic accounts may face corte total
       for non-payment

  5. Reconnection rules:
     - Customer pays owed amount or enters payment agreement
     - Reconnection fee per tariff schedule
     - Must reconnect within 24-48 hours of payment/agreement
     - During reconnection, verify no unauthorized modifications

SUPRA IMPLEMENTATION:
  - disconnection_requests table with status workflow
  - Automated notice generation at 1 period overdue
  - System blocks disconnection work order if:
    a. Account has vulnerable flag
    b. Active complaint/reclamacion exists
    c. Payment agreement (convenio) is active and current
    d. Amount owed is within dispute period
  - Domain event: corte.blocked_vulnerable logged for audit
  - Monthly report of blocked disconnections for management
```

### 4.3 Complaint Resolution SLAs

**Legal basis:** Ley de Aguas Queretaro + general consumer protection practices.

| Complaint Type | Response Deadline | Resolution Deadline | Escalation |
|---|---|---|---|
| Water quality (turbia, olor, color) | 4 hours | 24 hours | Immediate if health risk |
| No water supply (sin agua) | 2 hours | 24 hours | Operations center |
| Visible leak (fuga visible) | 24 hours | 72 hours | Emergency if major |
| Billing dispute (reclamacion de cobro) | 5 business days | 15 business days | Billing supervisor |
| Meter reading dispute | 5 business days | 15 business days | Field verification |
| Service connection issue | 10 business days | 30 business days | Technical department |
| Wrongful disconnection | Immediate | 24 hours (reconnection) | Legal department |
| ARCO data request | 5 business days (acknowledgment) | 20 business days | Unidad de Transparencia |
| General information request | 3 business days | 5 business days | Customer service |

**SUPRA implementation:**
```
- complaints table with:
  tipo_queja, fecha_recepcion, fecha_compromiso, fecha_resolucion
  sla_hours, sla_exceeded (boolean), escalation_level

- Automated SLA tracking:
  1. On creation: calculate deadline based on complaint type
  2. At 75% of SLA: alert assigned agent
  3. At 90% of SLA: escalate to supervisor
  4. At 100% of SLA: escalate to department head, flag as SLA breach
  5. Generate weekly SLA compliance report

- WhatsApp notifications to customer:
  1. Complaint received confirmation
  2. Assignment to agent
  3. Resolution notification
  4. Satisfaction survey (24 hours after resolution)
```

### 4.4 Transparency and Information Access (LGTAIP)

**Legal basis:** Ley General de Transparencia y Acceso a la Informacion Publica (reformed March 20, 2025) — regulatory of Article 6 of the Mexican Constitution.

**CEA Queretaro obligations as "sujeto obligado" (obligated subject):**

```
TRANSPARENCY OBLIGATIONS

1. Proactive transparency (transparencia proactiva):
   Publish on CEA website without request:
   - Organizational structure
   - Directory of public servants
   - Salaries and benefits
   - Budget and expenditure
   - Tariff tables (current and historical)
   - Service coverage statistics
   - Water quality reports
   - CONAGUA efficiency indicators
   - Contracts with suppliers (above threshold)
   - Procurement processes
   - Audit results
   - Customer complaint statistics

2. Reactive transparency (acceso a la informacion):
   - Any citizen can request information
   - Response: 20 business days (extendable by 10)
   - Cannot deny based on requester identity or purpose
   - Cannot charge fees beyond reproduction costs

3. SUPRA data for transparency portal:
   Auto-generate reports for public portal:
   - Monthly billing statistics (aggregate)
   - Payment collection rates
   - Service disruption incidents
   - Infrastructure investment progress
   - Water balance summary
   - Customer service KPIs (complaints resolved, SLA compliance)

4. Platform Nacional de Transparencia:
   - CEA must upload obligated information to national platform
   - SIPOT (Sistema de Portales de Obligaciones de Transparencia)
```

### 4.5 Citizen Participation Mechanisms

**Legal basis:** Ley de Aguas Queretaro provisions on citizen oversight + Ley de Participacion Ciudadana del Estado de Queretaro.

```
CITIZEN ENGAGEMENT CHANNELS

1. Contraloria Social (Social Oversight):
   - Community committees oversee service quality
   - CEA provides data access for monitoring
   - SUPRA: read-only dashboard for authorized community monitors

2. Public consultation for tariff changes:
   - Published in La Sombra de Arteaga
   - Public comment period
   - CEA must respond to substantive comments

3. Water quality notifications:
   - Proactive notification of quality issues
   - SUPRA: automated WhatsApp broadcast when quality event detected

4. Open data:
   - Anonymized consumption patterns by zone
   - Infrastructure maps (public network)
   - Service coverage statistics
   - Published in formatos abiertos (open formats: CSV, JSON, API)
```

---

## 5. Government IT Standards

### 5.1 Data Residency Requirements

**Current legal landscape:** Mexico does not have a comprehensive data localization law, but multiple provisions create de facto requirements for government systems.

```
DATA RESIDENCY ANALYSIS FOR CEA QUERETARO

MANDATORY localization (data MUST reside in Mexico):
  1. Citizen PII (personas table):
     - LGPDPPSO Art. 68 restricts cross-border transfers
     - No adequate protection finding for all countries
     - Practical requirement: keep in Mexico

  2. Fiscal data (CFDI, accounting):
     - CFF Art. 28: accounting records must be maintained
       at the fiscal domicile (domicilio fiscal)
     - SAT Buzon Tributario requires Mexican server responses

  3. CONAGUA/SEMARNAT reports:
     - Official government data
     - Must be accessible to Mexican authorities

RECOMMENDED localization (strong reasons):
  4. All operational data:
     - Government entity operating critical infrastructure
     - National security considerations
     - Ley General de Aguas provisions on data sovereignty

  5. Backup data:
     - If primary DB is in Mexico, backups should be too
     - At minimum, encrypted backups with keys held in Mexico

INFRASTRUCTURE CHOICE:
  Primary: Azure Mexico Central (Queretaro)
    - Physical location: Queretaro, Mexico
    - Meets all residency requirements
    - Supports Azure Government compliance features

  Alternative: On-premises in CEA data center
    - For most sensitive data if cloud concern exists
    - Hybrid model possible

  NOT recommended: GCP (no Mexico region), AWS (no Mexico region yet)
    - us-south1 (Dallas) or us-east-1 (Virginia) do NOT satisfy
      Mexican data residency requirements for government PII
```

### 5.2 MAAGTICSI and Government IT Standards

**MAAGTICSI** (Manual Administrativo de Aplicacion General en Materia de Tecnologias de la Informacion y Comunicaciones y de Seguridad de la Informacion):

> **Applicability note:** MAAGTICSI applies to **federal** government entities (APF — Administracion Publica Federal). CEA Queretaro is a **state-level** entity and is not directly subject to MAAGTICSI. However, it serves as a best-practice reference and may be required by federal funding conditions or CONAGUA IT integration requirements.

**Relevant MAAGTICSI processes to adopt voluntarily:**

```
MAAGTICSI ALIGNMENT (Voluntary Best Practice)

1. ATIC — Administracion de TIC
   - IT governance structure
   - IT strategic plan aligned with CEA mission
   - Annual technology budget

2. ASI — Administracion de la Seguridad de la Informacion
   - Information security management system (aligned with ISO 27001)
   - Risk assessment methodology
   - Security controls catalog
   - Incident response procedures

3. APCT — Administracion de Proyectos de TIC
   - Project management methodology
   - Change management process
   - Quality assurance

4. ADS — Administracion del Desarrollo de Soluciones
   - Software development lifecycle
   - Code review requirements
   - Testing requirements
   - Security testing (SAST/DAST)
```

### 5.3 Cybersecurity Requirements

**Legal basis:** No umbrella cybersecurity law in Mexico (as of February 2026), but multiple frameworks apply.

**Applicable standards:**

| Standard | Description | Status |
|---|---|---|
| NMX-I-27001-NYCE-2015 | ISMS based on ISO 27001:2013 | Voluntary, recommended |
| NMX-I-27002-NYCE-2015 | Security controls based on ISO 27002:2013 | Voluntary, recommended |
| NOM-151-SCFI-2016 | Digital data message conservation | Mandatory |
| LGPDPPSO Security Chapter | Security measures for personal data | Mandatory for public entities |
| Agencia de Transformacion Digital guidelines | Federal cybersecurity strategy | Advisory |

**Minimum cybersecurity requirements for SUPRA Water:**

```
CYBERSECURITY BASELINE

1. Access Control:
   - Multi-factor authentication for all admin accounts
   - Role-based access control (RBAC)
   - Principle of least privilege
   - Session management (timeout, single-session)
   - API key rotation schedule

2. Encryption:
   - Data at rest: AES-256 (PostgreSQL pgcrypto / Azure Disk Encryption)
   - Data in transit: TLS 1.3 minimum
   - PII fields: column-level encryption for RFC, CURP, datos bancarios
   - Encryption key management: Azure Key Vault or HashiCorp Vault

3. Audit Logging:
   - All PII access logged (who, when, what, from where)
   - All admin actions logged
   - Log retention: 3 years online + 7 years archive
   - Tamper-evident logging (append-only, signed)
   - NOM-151-SCFI-2016 compliance for digital evidence conservation

4. Network Security:
   - WAF (Web Application Firewall)
   - DDoS protection
   - Network segmentation (DB not directly accessible from internet)
   - VPN for administrative access
   - IP allowlisting for API consumers

5. Application Security:
   - OWASP Top 10 compliance
   - Input validation on all endpoints
   - SQL injection prevention (parameterized queries / ORM)
   - XSS prevention (output encoding)
   - CSRF protection
   - Rate limiting on public APIs
   - Dependency vulnerability scanning

6. Operational Security:
   - Vulnerability scanning (monthly)
   - Penetration testing (annual)
   - Backup testing (quarterly)
   - Disaster recovery testing (annual)
   - Security awareness training for all staff
```

### 5.4 Interoperability Standards

```
GOVERNMENT INTEROPERABILITY REQUIREMENTS

1. SAT Integration:
   - CFDI web services (timbrado via PAC)
   - RFC validation web service
   - 69-B blacklist consultation
   - Buzon Tributario notifications
   - Protocol: SOAP/XML (SAT's specification)

2. CONAGUA Integration:
   - SIGA (Sistema Integral de Gestion del Agua)
   - REPDA/Registro Nacional de Aguas consultation
   - Reporting formats: XML per CONAGUA schema
   - Protocol: Web services or file upload to portal

3. SEMARNAT Integration:
   - Discharge permit compliance reporting
   - Environmental impact data
   - Format: per SEMARNAT requirements

4. INEGI Integration:
   - Geographic data (claves de localidad, municipio)
   - Census tract alignment
   - Format: INEGI standard geographic codes

5. SEPOMEX:
   - Postal code validation
   - Address standardization
   - Protocol: REST API or catalog download

6. RENAPO:
   - CURP validation web service
   - Protocol: SOAP web service

7. State Government (Queretaro):
   - Financial reporting to Secretaria de Finanzas
   - Performance reporting to Contraloria
   - Transparency portal upload (SIPOT)
   - Format: per state requirements

8. Data exchange standards:
   - XML for government (SAT, CONAGUA, SEMARNAT)
   - JSON for internal/modern APIs
   - CSV for bulk data exchange
   - Character encoding: UTF-8 throughout
   - Date format: ISO 8601
   - Currency: MXN, DECIMAL(12,2)
```

---

## 6. Compliance Implementation Roadmap

### 6.1 Compliance Requirements Mapped to Development Phases

| Compliance Requirement | Dev Phase | Priority | Dependency |
|---|---|---|---|
| **LFPDPPP/LGPDPPSO** | | | |
| Privacy notice (aviso de privacidad) | Phase 1 (Pre-dev) | CRITICAL | Legal review |
| Consent tracking schema | Phase 3 (DB) | HIGH | Schema design |
| ARCO request API | Phase 5 (API) | HIGH | API layer |
| Data encryption at rest | Phase 3 (DB) | CRITICAL | DB setup |
| Breach response procedure | Phase 1 (Pre-dev) | CRITICAL | Security team |
| Cross-border transfer controls | Phase 6 (Cloud) | CRITICAL | Infrastructure |
| **CFDI 4.0** | | | |
| SAT catalog tables | Phase 3 (DB) | HIGH | Schema design |
| RFC/CURP validation | Phase 5 (API) | HIGH | API layer |
| CFDI generation engine | Phase 7 (Billing) | CRITICAL | Billing module |
| PAC integration (Finkok) | Phase 7 (Billing) | CRITICAL | PAC contract |
| Complemento de pago | Phase 7 (Billing) | HIGH | Payment module |
| CFDI cancellation workflow | Phase 7 (Billing) | HIGH | Billing module |
| IVA calculation rules | Phase 7 (Billing) | CRITICAL | Billing engine |
| DIOT generation | Phase 7 (Billing) | MEDIUM | Billing module |
| **Water Regulatory** | | | |
| CONAGUA extraction report | Phase 9/10 | MEDIUM | Smart metering |
| CONAGUA efficiency report | Phase 10 | MEDIUM | Analytics |
| SEMARNAT discharge report | Phase 10 | MEDIUM | Lab integration |
| Meter compliance tracking | Phase 9 | MEDIUM | Metering module |
| Tariff management | Phase 7 (Billing) | CRITICAL | Billing engine |
| **Consumer Protection** | | | |
| Vulnerability flags | Phase 3 (DB) | HIGH | Schema design |
| Disconnection protection logic | Phase 7 (Billing) | CRITICAL | Collections |
| Complaint SLA tracking | Phase 4/5 (API) | HIGH | Work orders |
| Transparency data exports | Phase 10 | MEDIUM | Analytics |
| **IT Standards** | | | |
| Data residency (Azure Mexico) | Phase 6 (Cloud) | CRITICAL | Infrastructure |
| Encryption infrastructure | Phase 3 (DB) | CRITICAL | DB setup |
| Audit logging | Phase 3 (DB) | HIGH | Schema design |
| Security testing | All phases | HIGH | CI/CD pipeline |

### 6.2 Required Legal Documents and Approvals

| Document | Responsible | Deadline | Status |
|---|---|---|---|
| Aviso de Privacidad Integral | Legal + IT | Before first data collection | Pending |
| Aviso de Privacidad Simplificado | Legal | Before first data collection | Pending |
| Breach Response Policy | Security + Legal | Before go-live | Pending |
| ARCO Procedures Manual | Unidad de Transparencia | Before go-live | Pending |
| Data Retention Policy | Legal + DBA | Phase 3 | Pending |
| PAC contract (Finkok or equivalent) | Legal + Finance | Phase 7 start | Pending |
| SAT certificate (CSD — Certificado de Sello Digital) | Finance | Phase 7 start | Existing? |
| CONAGUA data sharing agreement | Legal + Operations | Phase 9 start | Pending |
| Data processing agreements (DPA) with vendors | Legal | Before each integration | Pending |
| Tariff approval from state government | Finance + Operations | Before billing launch | Existing |
| Cloud provider data residency certification | IT + Legal | Phase 6 | Pending |
| Penetration test report | Security vendor | Before go-live | Pending |
| Privacy impact assessment (PIA) | IT + Legal | Phase 3 | Pending |
| NOM-151-SCFI-2016 compliance certificate | IT | Before go-live | Pending |

### 6.3 Compliance Testing and Audit Schedule

| Test/Audit | Frequency | Responsible | Phase |
|---|---|---|---|
| CFDI validation against SAT sandbox | Every sprint with billing changes | QA team | Phase 7+ |
| RFC/CURP validation accuracy | Monthly after launch | QA team | Phase 5+ |
| ARCO request response time test | Quarterly | Compliance | Phase 5+ |
| Data encryption verification | Monthly | Security | Phase 3+ |
| PII access audit review | Monthly | Compliance + Security | Phase 3+ |
| Breach simulation exercise (tabletop) | Semi-annually | Security + Legal | Phase 6+ |
| Penetration test (external) | Annually | External vendor | Pre-launch + annual |
| OWASP compliance scan | Every deployment | CI/CD automated | Phase 5+ |
| Data retention compliance check | Quarterly | DBA + Compliance | Phase 3+ |
| Consent record integrity check | Quarterly | Compliance | Phase 5+ |
| CONAGUA report accuracy validation | Monthly | Operations | Phase 9+ |
| SEMARNAT discharge compliance | Monthly | Environment team | Phase 10+ |
| Tariff calculation accuracy | After every tariff change | Billing + QA | Phase 7+ |
| Vulnerability classification review | Annually | Social services | Phase 3+ |
| Disconnection rule compliance audit | Monthly | Compliance + Operations | Phase 7+ |
| Transparency portal content review | Quarterly | Compliance | Phase 10+ |

### 6.4 Regulatory Body Notification Requirements

| Event | Notify | Deadline | Method |
|---|---|---|---|
| Data breach (significant) | Organismo Garante (ITEQROO) | Without undue delay | Written notification |
| Data breach (significant) | Affected data subjects | Without undue delay | Multi-channel |
| Data breach (cyber incident) | CERT-MX | Within 72 hours | Email/portal |
| New system launch | CEA internal audit | Before launch | Internal report |
| CFDI system change | SAT (via PAC) | Before production use | PAC certification |
| Tariff system change | State finance | Before implementation | Internal approval |
| CONAGUA extraction exceeds assignment | CONAGUA | Immediate | SIGA portal |
| Discharge exceeds permitted limits | SEMARNAT/CONAGUA | Within 48 hours | Written notification |
| Major service disruption | Customers + State | Within 4 hours | Multi-channel |

### 6.5 Annual Compliance Review Process

```
ANNUAL COMPLIANCE REVIEW — Q4 EACH YEAR

Month 10 (October):
  1. Review all regulatory changes from past year
     - LFPDPPP/LGPDPPSO amendments
     - RMF annual update (SAT)
     - SAT catalog version changes
     - NOM updates (CONAGUA, SEMARNAT)
     - State water law amendments

  2. Gap analysis: current system vs updated requirements

  3. Privacy impact assessment update

Month 11 (November):
  4. Update privacy notices if needed (trigger re-consent)
  5. Update CFDI generation logic for new RMF
  6. Update SAT catalogs
  7. Test updated billing logic in sandbox
  8. Update compliance documentation

Month 12 (December):
  9. Final compliance audit
  10. Staff training on regulatory changes
  11. Update breach response procedures
  12. Publish annual transparency report
  13. Archive completed ARCO requests (older than 5 years)
  14. Data retention review and deletion cycle

Month 1 (January):
  15. Deploy RMF updates to production
  16. Confirm new fiscal year CFDI compliance
  17. Reset annual compliance calendar
  18. File previous year DIOT (if applicable)
```

---

## 7. Compliance Checklist

### 7.1 Pre-Launch Compliance Checklist

Everything required before the system goes live with real customer data.

#### Data Protection (LFPDPPP/LGPDPPSO)

- [ ] **Aviso de privacidad integral** — Drafted, legally reviewed, published on website
- [ ] **Aviso de privacidad simplificado** — Printed for office use, included in contract forms
- [ ] **WhatsApp privacy micro-notice** — Configured in chatbot first-interaction flow
- [ ] **Voice AI privacy statement** — Recorded/programmed in call flow
- [ ] **Consent tracking system** — `consentimientos` table created, API tested
- [ ] **ARCO request system** — API endpoints functional, SLA tracking active
- [ ] **ARCO procedures manual** — Documented, staff trained
- [ ] **Transparency Committee** — Designated per LGPDPPSO Art. 64
- [ ] **Transparency Unit** — Established, contact published
- [ ] **Data encryption at rest** — pgcrypto or equivalent active for PII columns
- [ ] **Data encryption in transit** — TLS 1.3 on all connections
- [ ] **PII access audit logging** — All reads/writes to PII tables logged
- [ ] **Cross-border data controls** — PII confirmed to reside in Mexico only
- [ ] **AI agent PII sanitization** — Verified that no raw PII sent to Claude API
- [ ] **Breach response plan** — Documented, team assigned, tabletop exercise completed
- [ ] **Breach registry table** — `registro_vulneraciones` created
- [ ] **Data retention policies** — Documented per data type, implemented in system
- [ ] **Data processing agreements** — Signed with all third-party processors
- [ ] **Privacy impact assessment** — Completed for the system
- [ ] **Data minimization review** — Confirmed only necessary data collected

#### Fiscal (CFDI 4.0)

- [ ] **CSD (Certificado de Sello Digital)** — Valid and configured in system
- [ ] **PAC contract** — Signed with certified PAC (Finkok or equivalent)
- [ ] **PAC integration tested** — Successful timbrado in SAT sandbox
- [ ] **SAT catalog tables** — Loaded with current version (December 2025 update)
- [ ] **RFC validation** — Format, homoclave, and 69-B blacklist check working
- [ ] **CURP validation** — Format check and RENAPO service integrated
- [ ] **Publico general handling** — XAXX010101000 logic implemented and tested
- [ ] **IVA calculation** — Domestic (0%), commercial (16%) logic verified
- [ ] **CFDI XML generation** — Compliant with Anexo 20, validated against SAT XSD
- [ ] **CFDI PDF representation** — Human-readable invoice with CFDI data
- [ ] **Complemento de pago** — PPD workflow implemented and tested
- [ ] **CFDI cancellation** — Workflow with receiver acceptance implemented
- [ ] **CFDI storage** — 5-year retention with integrity guaranteed
- [ ] **DIOT report generation** — Template configured
- [ ] **Fiscal regime mapping** — All customer types correctly mapped

#### Water Regulatory

- [ ] **Tariff schedules loaded** — Current CEA Queretaro tariffs configured
- [ ] **Tariff calculation verified** — Test billing against known correct amounts
- [ ] **Alcantarillado surcharge** — 10% surcharge logic implemented
- [ ] **Saneamiento surcharge** — 12% surcharge logic implemented
- [ ] **Vulnerability flags** — Schema and validation process ready
- [ ] **Disconnection protection** — System blocks corte for vulnerable accounts
- [ ] **Minimum supply guarantee** — 50 L/person/day logic for restricted accounts
- [ ] **Complaint SLA tracking** — SLA timers and escalation configured
- [ ] **CONAGUA report template** — Ready (even if data not yet flowing)
- [ ] **Meter compliance fields** — Tracking calibration, NOM certificates

#### IT Security

- [ ] **Multi-factor authentication** — Enabled for all admin users
- [ ] **Role-based access control** — Configured per job function
- [ ] **WAF configured** — Application-layer protection active
- [ ] **Rate limiting** — Configured on public-facing APIs
- [ ] **OWASP scan passed** — No critical or high vulnerabilities
- [ ] **Penetration test passed** — External test completed, findings remediated
- [ ] **Backup and recovery tested** — Successfully restored from backup
- [ ] **NOM-151-SCFI-2016** — Digital evidence conservation compliant
- [ ] **Security incident response plan** — Documented and tested
- [ ] **Dependency vulnerability scan** — No known critical CVEs

### 7.2 Ongoing Compliance Monitoring Requirements

| Requirement | Frequency | Responsible | Dashboard/Report |
|---|---|---|---|
| ARCO request SLA monitoring | Daily | Transparency Unit | ARCO dashboard |
| CFDI timbrado success rate | Daily | Billing team | Billing dashboard |
| CFDI cancellation requests pending | Daily | Billing team | Billing dashboard |
| PII access anomaly detection | Daily (automated) | Security | Alert system |
| SAT catalog version check | Monthly | IT | Automated check |
| RFC 69-B blacklist update | Monthly | Billing | Automated sync |
| Consent re-validation (after privacy notice update) | As needed | Compliance | Consent dashboard |
| Data retention execution | Monthly | DBA | Retention report |
| Encryption key rotation | Quarterly | Security | Key management |
| Vulnerability scan | Monthly | Security | Vulnerability report |
| Disconnection protection audit | Monthly | Compliance | Disconnection report |
| Customer complaint SLA compliance | Weekly | Operations | SLA dashboard |
| CONAGUA extraction volumes vs assignment | Monthly | Operations | Water balance dashboard |
| SEMARNAT discharge parameters | Monthly | Environment | Quality dashboard |
| Tariff correctness verification | After each update | Billing + QA | Test report |

### 7.3 Annual Reporting Calendar

| Month | Reporting Obligation | Responsible | Regulatory Body |
|---|---|---|---|
| **January** | Previous year DIOT filing | Finance | SAT |
| **January** | Annual RMF update implementation | IT + Billing | SAT |
| **January** | SAT catalog update deployment | IT | SAT |
| **February** | Annual transparency report | Compliance | SIPOT |
| **March** | Annual water balance report | Operations | CONAGUA |
| **March** | CFDI cancellation deadline (previous year) | Billing | SAT |
| **Monthly** | CONAGUA extraction volume report | Operations | CONAGUA |
| **Monthly** | DIOT filing (by 17th) | Finance | SAT |
| **Quarterly** | CONAGUA efficiency indicators (PIGOO) | Operations | CONAGUA |
| **Quarterly** | SEMARNAT discharge quality report | Environment | SEMARNAT |
| **Quarterly** | Tax provisional declarations | Finance | SAT |
| **Semi-annual** | Data breach simulation exercise | Security | Internal |
| **Annually** | Penetration test | Security | Internal |
| **Annually** | Privacy impact assessment update | Compliance | Internal |
| **Annually** | Vulnerability classification revalidation | Social services | Internal |
| **Annually** | Compliance framework review | Legal + IT | Internal |
| **As published** | Tariff update implementation | Billing + IT | State Gov (La Sombra de Arteaga) |
| **As published** | NOM standard updates | Compliance + IT | CONAGUA/SEMARNAT |

---

## Appendix A: Glossary of Regulatory Terms

| Spanish Term | English Translation | Legal Reference |
|---|---|---|
| Aviso de Privacidad | Privacy Notice | LGPDPPSO Arts. 26-30 |
| Derechos ARCO | ARCO Rights (Access, Rectification, Cancellation, Opposition) | LGPDPPSO Arts. 43-66 |
| Vulneracion de datos | Data breach | LGPDPPSO Arts. 40-42 |
| Sujeto obligado | Obligated subject (public entity) | LGTAIP |
| Responsable | Data controller | LGPDPPSO Art. 3 |
| Encargado | Data processor | LGPDPPSO Art. 3 |
| Titular | Data subject | LGPDPPSO Art. 3 |
| Consentimiento | Consent | LGPDPPSO Art. 20 |
| Bloqueo | Blocking (pre-deletion phase) | LGPDPPSO Art. 3 |
| Supresion | Deletion/destruction of data | LGPDPPSO Art. 3 |
| Timbrado | CFDI digital stamping by PAC | CFF Art. 29 |
| Complemento de Pago | Payment complement CFDI | RMF 2026 |
| Publico General | Generic taxpayer (no RFC) | RMF 2026 |
| Constancia de Situacion Fiscal (CSF) | Tax status certificate | SAT |
| Regimen fiscal | Fiscal/tax regime | LIVA, LISR |
| Domicilio fiscal | Fiscal address | CFF Art. 10 |
| Corte de servicio | Service disconnection | Ley de Aguas Qro. |
| Reconexion | Service reconnection | Ley de Aguas Qro. |
| Convenio de pago | Payment agreement | Ley de Aguas Qro. |
| Tarifa escalonada | Tiered/block rate tariff | Ley de Aguas Qro. Art. 154 |
| Periódico Oficial (La Sombra de Arteaga) | Official state gazette of Queretaro | State Constitution |
| Organismo Garante | Data protection authority (state) | LGTAIP |
| Unidad de Transparencia | Transparency unit | LGPDPPSO Art. 85 |
| Comite de Transparencia | Transparency committee | LGPDPPSO Art. 64 |
| Titulo de asignacion | Water assignment title (public entities) | LAN Art. 3 |
| Balance hidrico | Water balance | LAN |
| Agua No Contabilizada | Non-Revenue Water (NRW) | CONAGUA/IWA |
| PIGOO | Performance Indicators for Water Utilities | CONAGUA |
| EFOS | Companies simulating fiscal operations (69-B) | CFF Art. 69-B |

---

## Appendix B: Key Legal References

| Law/Standard | Full Name | Issuing Body |
|---|---|---|
| LGPDPPSO | Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados | Congress |
| LFPDPPP (2025) | Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares (reformed 2025) | Congress |
| CFF | Codigo Fiscal de la Federacion | Congress |
| LIVA | Ley del Impuesto al Valor Agregado | Congress |
| LAN | Ley de Aguas Nacionales (reformed Dec 11, 2025) | Congress |
| LGA | Ley General de Aguas (new, 2025) | Congress |
| LGTAIP | Ley General de Transparencia y Acceso a la Informacion Publica (reformed March 20, 2025) | Congress |
| Ley de Aguas Qro. | Ley que Regula la Prestacion de los Servicios de Agua Potable, Alcantarillado y Saneamiento del Estado de Queretaro (reformed 2024) | Queretaro Legislature |
| RMF 2026 | Resolucion Miscelanea Fiscal 2026 | SAT |
| Anexo 20 | Technical standard for CFDI 4.0 | SAT |
| NOM-001-SEMARNAT-2021 | Permissible limits of contaminants in wastewater discharges | SEMARNAT |
| NOM-127-SSA1-2021 | Drinking water quality | SSA |
| NOM-012-SCFI-1994 | Cold water meter requirements | SE |
| NMX-AA-179-SCFI-2018 | Water meter selection, installation, operation | SE |
| NOM-151-SCFI-2016 | Conservation of digital data messages | SE |
| NMX-I-27001-NYCE-2015 | Information security management (ISO 27001) | NYCE |

---

*This document should be reviewed by CEA Queretaro's legal department and updated annually or when significant regulatory changes occur.*

*Last updated: 2026-02-16*
