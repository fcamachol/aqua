# Phase 7: Billing Engine & Payments Modernization

**Target:** Modern tariff engine, CFDI 4.0 electronic invoicing, full Mexican payment ecosystem integration
**Timeline:** Months 12-20 (28 weeks / 14 sprints)
**Priority Score:** 9/10 -- Billing is the revenue-generating core of the utility

---

## 1. Phase Overview

### 1.1 Goal

Replace the monolithic SOAP-based billing pipeline inherited from Agbar/OCCAM with an event-driven billing microservice architecture featuring a configurable tariff engine, native CFDI 4.0 electronic invoicing, and integration with Mexico's full payment ecosystem (SPEI, CoDi/DiMo, OXXO, direct debit). The system must handle CEA Queretaro's complex multi-tier volumetric pricing, social tariffs, seasonal rates, and both batch and real-time rating for smart meters.

### 1.2 Timeline

| Sprint | Weeks | Focus Area |
|--------|-------|------------|
| 1-3 | 1-6 | Tariff Engine |
| 4-6 | 7-12 | Billing Microservice |
| 7-9 | 13-18 | CFDI 4.0 Compliance |
| 10-12 | 19-24 | Payment Ecosystem |
| 13-14 | 25-28 | Parallel Run & Validation |

### 1.3 Team

| Role | Count | Responsibility |
|------|-------|---------------|
| Billing Domain Expert | 1 | Tariff logic validation, CEA Queretaro business rules, OCCAM legacy knowledge |
| Senior Backend Developers | 2 | Tariff engine, billing microservice, event sourcing, API development |
| CFDI/SAT Specialist | 1 | CFDI 4.0 XML generation, PAC integration, digital signatures, SAT compliance |
| QA Engineer | 1 | Financial accuracy testing, parallel run validation, regression testing |
| Part-time DevOps | 0.5 | Infrastructure for billing microservice, message bus, PAC connectivity |
| Part-time Frontend | 0.5 | Tariff configuration UI, billing dashboard |

### 1.4 Prerequisites

- **Phase 4 (partially complete):** Core platform infrastructure -- API gateway, event bus (Kafka/RabbitMQ), database migration tooling
- **Phase 5 (partially complete):** Customer & Contract domain extracted -- `contrato` table modernized, contract service API available
- **Phase 6 (partially complete):** Meter reading pipeline modernized -- readings available as events, `poldetsum`/`polhissum` data accessible via API
- **Data migration tooling:** ETL pipelines for `tarifa`, `aplictarif`, `concepto`, `facturacio`, `facturable`, `factura`, `linfactura` tables

### 1.5 Current State Summary

The existing AquaCIS billing pipeline spans 37 tables across a 7-stage flow: meter reading collection (`lote` -> `poldetsum`) -> billing batch creation (`facturacio`) -> billable record generation (`facturable`, 59 columns) -> tariff application (`fbletarif` + `aplictarif` + `tarifa` + `polcontar`) -> invoice generation (`factura` + `linfactura`) -> tax computation (`impuesto`/`impufact`/`aplicimpues`) -> payment collection (`gescartera` -> `opecargest` -> `opedesglos`). The system supports only SOAP/XML access with 126 API operations across 5 services, of which only 17 are integrated. Payment channels are limited to cash/card (`efectivoTarjeta`), with no SPEI, CoDi, or convenience store integration.

---

## 2. Sprint 1-3 (Weeks 1-6): Tariff Engine

### 2.1 Objectives

Build a flexible, rule-based tariff engine that replaces the opaque OCCAM tariff calculation with a transparent, configurable, testable, and auditable rating system supporting CEA Queretaro's full tariff complexity.

### 2.2 Sprint 1 (Weeks 1-2): Tariff Domain Modeling

**Tasks:**

1. **Analyze existing tariff data structures**
   - Map current `tarifa` table (with `codigo`, `descripcion`, `publicacion`, `subconceptos[]`, `variablesContratos[]`, `variablesPuntoServicio[]`)
   - Map `tipotarifa` (tariff types), `tipovariable` (parametric variables)
   - Map `concepto` table (billing concepts: `codigoConcepto`, `conceptoPeriodico`, `importe`)
   - Map `aplictarif` (10 columns: exploitation + concept + tariff type + date-effective assignment)
   - Map `polcontar` (8 columns: per-contract tariff overrides)
   - Document `Subconcepto` -> `correctoresAplicables[]` modifier chain

2. **Design tariff engine data model**
   ```
   TariffPlan
     ├── id, name, version, effective_from, effective_to
     ├── usage_category (domestic, commercial, industrial, government, mixed)
     ├── meter_size_category (13mm, 19mm, 25mm, 38mm, 50mm+)
     └── RateBlock[]
          ├── lower_bound_m3, upper_bound_m3
          ├── rate_per_m3
          └── SeasonMultiplier[]
               ├── season (dry: Mar-Jun, rainy: Jul-Oct, normal: Nov-Feb)
               └── multiplier

   TariffModifier
     ├── type (social_discount, surcharge, penalty, zone_adjustment, pensioner)
     ├── condition_expression (JSON rule DSL)
     ├── adjustment_type (percentage, fixed_amount, rate_override)
     └── value

   BillingConcept
     ├── code, name, type (water, sewer, fixed, tax, surcharge)
     ├── calculation_method (tiered, flat, percentage_of, formula)
     ├── formula_expression
     └── applicable_to[] (usage categories)
   ```

3. **Define tariff versioning strategy**
   - Every tariff plan has `effective_from`/`effective_to` dates (matches existing `aptfecapl`/`aptfecfin` pattern)
   - New rates created per annual municipal decree without modifying historical versions
   - Historical invoices always reference the tariff version active during the billing period

**Deliverables:** Tariff domain model document, database schema (PostgreSQL), entity relationship diagrams

### 2.3 Sprint 2 (Weeks 3-4): Rule Engine & Rating Pipeline

**Tasks:**

1. **Implement rule-based tariff engine**
   - Lightweight JSON Rules Engine for tariff evaluation (avoid heavy engines like Drools)
   - Rules evaluate: customer classification, block/tier consumption, seasonal multipliers, social rate eligibility, fixed charges by meter caliber, sewer charges, surcharges/discounts, IVA tax
   - Support `polcontar`-equivalent per-contract overrides as highest-priority rules

2. **Build rating pipeline**
   ```
   Input: { contract, reading, period, meter_caliber, usage_code }

   Pipeline Steps:
   1. Resolve applicable tariff version (by date + exploitation)
   2. Check contract-level overrides (polcontar equivalent)
   3. Determine customer classification (usage_code + flags)
   4. Calculate block/tier consumption breakdown
   5. Apply seasonal multipliers (based on billing period month)
   6. Apply social rate adjustments (jubilad flag, zone-based)
   7. Calculate fixed charges (by meter caliber: fblecalib1/fblecalib2)
   8. Calculate sewer/drainage charges (alcantarillado)
   9. Apply infrastructure surcharges (zone-specific)
   10. Calculate IVA tax (16% standard, exempt for fbleexento='S')

   Output: ChargeBreakdown[] with full audit trail
   ```

3. **Implement simulation mode**
   - Mirror existing `ftosnsimula` flag functionality
   - "What-if" capability: given proposed tariff changes, calculate revenue impact across customer segments

**Deliverables:** Rating engine service, unit test suite with 100% rule coverage, simulation API endpoint

### 2.4 Sprint 3 (Weeks 5-6): Tariff Configuration UI & Data Migration

**Tasks:**

1. **Tariff configuration UI**
   - Admin interface for tariff plan CRUD operations
   - Rate block editor with visual tier builder
   - Modifier/corrector configuration (replacing `correctoresAplicables[]`)
   - Tariff version comparison view (diff between versions)
   - Simulation runner: select customer segment, apply proposed tariff, view impact

2. **Migrate existing tariff data**
   - ETL from `tarifa` -> TariffPlan
   - ETL from `aplictarif` -> tariff assignments (date-effective)
   - ETL from `polcontar` -> contract-level overrides
   - ETL from `concepto` -> BillingConcept
   - ETL from `tipotarifa`/`tipovariable` -> tariff type/variable configuration
   - Validate: run existing tariff calculations through new engine, compare outputs for 100% of active contracts

3. **Tariff engine API**
   - `POST /tariffs/rate` -- rate a single reading
   - `POST /tariffs/rate-batch` -- rate a batch of readings
   - `GET /tariffs/plans` -- list tariff plans with version history
   - `GET /tariffs/plans/{id}/simulate` -- simulate tariff impact
   - `PUT /tariffs/plans/{id}` -- update tariff plan (creates new version)

**Deliverables:** Configuration UI, migrated tariff data, REST API, migration validation report

---

## 3. Sprint 4-6 (Weeks 7-12): Billing Microservice

### 3.1 Objectives

Extract billing as a standalone microservice with an event-sourced pipeline, replacing the monolithic `facturacio` -> `facturable` -> `factura` -> `linfactura` batch chain with a modern, independently deployable service.

### 3.2 Sprint 4 (Weeks 7-8): Event-Sourced Billing Core

**Tasks:**

1. **Design event-sourced billing pipeline**
   - Events: `MeterReadingReceived`, `ConsumptionCalculated`, `ChargeRated`, `InvoiceGenerated`, `InvoiceAdjusted`, `PaymentApplied`, `InvoiceCancelled`
   - Event store: append-only log (PostgreSQL with event sourcing pattern or dedicated EventStoreDB)
   - Projections: current account balance, invoice history, billing period summary
   - CQRS: separate command (billing operations) and query (balance/invoice lookup) models

2. **Implement billing microservice skeleton**
   - Standalone deployable service with its own database
   - Event bus integration (consume meter reading events, publish billing events)
   - API Gateway registration
   - Health checks, circuit breakers, retry policies

3. **Consumption calculation engine**
   - Replace `facturable` 59-column record with clean consumption event
   - Handle reading types: regular (`detoriid` manual), telemetry (smart meter), estimated
   - Implement validation/correction flow (replace `val`-suffixed dual-column pattern with event-sourced correction events)
   - Days-between-readings calculation (`fblediaslec` equivalent)
   - Consumption breakdown: regular, estimated, replacement, other (`fbleconsreg`, `fbleconsest`, `fbleconsrep`, `fbleconsotr`)

**Deliverables:** Event-sourced billing service, consumption calculator, event schema definitions

### 3.3 Sprint 5 (Weeks 9-10): Rating Engine Integration & Invoice Generation

**Tasks:**

1. **Integrate tariff engine as rating step**
   - Hybrid rating model:
     - Smart meter customers (`sntelelectura` flag): real-time rating on each reading event
     - Manual reading customers: batch rating when readings are captured
     - Prepaid customers: real-time with credit deduction
     - Large commercial/industrial: real-time with daily settlement
   - Single rating engine processes events from both smart meter streams and manual reading batch imports

2. **Invoice generation**
   - Replace `factura` + `linfactura` with modern invoice model
   - Invoice line items from ChargeBreakdown[] (water charges by tier, fixed charges, sewer, surcharges, taxes)
   - Invoice numbering: sequential per exploitation, compatible with CFDI folio requirements
   - Invoice states: draft -> generated -> sent -> paid -> cancelled (replacing `factura.facestado` numeric codes)
   - PDF generation (maintain `getPdfFactura` capability)

3. **Billing cycle management**
   - Pro-rating for mid-cycle contract changes (new connections, disconnections, tariff changes)
   - Billing adjustments: credit notes, rebilling, corrections (event-sourced for full audit trail)
   - Billing period configuration by zone (replacing `facturacio.ftozonid` zone-based batching)
   - Multi-entity support: `sociedad` propietaria/emisora separation (current `fbltsocpro`/`fbltsocemi` pattern)

**Deliverables:** Integrated rating pipeline, invoice generation service, billing cycle manager

### 3.4 Sprint 6 (Weeks 11-12): Revenue Assurance & Billing API

**Tasks:**

1. **Revenue assurance rules**
   - Automated checks: unbilled contracts, consumption anomalies, tariff mismatches
   - Comparison: total billed vs. total metered consumption (non-revenue water detection)
   - Aging analysis: invoice age distribution, overdue thresholds
   - Revenue leakage alerts: contracts with readings but no invoices, invoices with zero amounts

2. **Billing microservice API**
   - `POST /billing/runs` -- create billing batch (replaces `facturacio` creation)
   - `POST /billing/runs/{id}/execute` -- execute billing run
   - `GET /billing/runs/{id}/status` -- batch progress and results
   - `GET /billing/invoices/{id}` -- invoice detail with line items
   - `GET /billing/invoices/{id}/pdf` -- PDF download
   - `GET /billing/contracts/{contractNum}/balance` -- current balance
   - `GET /billing/contracts/{contractNum}/history` -- billing history
   - `POST /billing/invoices/{id}/adjust` -- create adjustment/credit note
   - `POST /billing/simulate` -- dry-run billing (replaces `ftosnsimula`)

3. **Backward compatibility layer**
   - SOAP adapter exposing existing WSDL operations (`getFacturas`, `getFacturaE`, `getConceptos`) backed by new microservice
   - Gradual consumer migration from SOAP to REST

**Deliverables:** Revenue assurance dashboard, complete billing REST API, SOAP compatibility adapter

---

## 4. Sprint 7-9 (Weeks 13-18): CFDI 4.0 Compliance

### 4.1 Objectives

Implement full CFDI 4.0 (Comprobante Fiscal Digital por Internet) electronic invoicing compliant with SAT (Servicio de Administracion Tributaria) requirements for water utility services, including XML generation, PAC certification, digital signatures, payment complements, and cancellation workflows.

### 4.2 Sprint 7 (Weeks 13-14): CFDI 4.0 XML Generation

**Tasks:**

1. **CFDI 4.0 XML structure implementation**
   - Implement full `cfdi:Comprobante` XML generation per SAT Anexo 20
   - Water utility service classification: ClaveProdServ `80141600` (water distribution) and `80141601` (sewerage services)
   - ClaveUnidad: `E48` (unit of service), `MTQ` (cubic meter)
   - Required attributes: Version 4.0, Serie, Folio, Fecha, FormaPago, SubTotal, Moneda (MXN), Total, TipoDeComprobante (I=Ingreso), MetodoPago (PUE/PPD), LugarExpedicion (CP)
   - `cfdi:Emisor`: RFC, Nombre, RegimenFiscal of CEA Queretaro
   - `cfdi:Receptor`: RFC del contribuyente, Nombre, DomicilioFiscalReceptor, RegimenFiscalReceptor, UsoCFDI (S01 for sin obligaciones / G03 for gastos en general)
   - `cfdi:Conceptos`: One `cfdi:Concepto` per billing concept line item
   - `cfdi:Impuestos`: IVA 16% traslado calculation (IVA exempt for domestic water up to social tariff threshold per Art. 2-A LIVA)

2. **Tax logic for water services**
   - IVA exemption rules for residential water service (domestic use, up to threshold)
   - IVA 16% on commercial/industrial water, sewer surcharges, and administrative fees
   - Map existing `fbleexento` flag and `impuesto`/`impufact`/`aplicimpues` tax framework to CFDI tax nodes
   - Withholding tax handling if applicable

3. **XML serialization and validation**
   - XSD validation against SAT published schemas
   - UTF-8 encoding, canonical XML (C14N) for signing
   - Addenda support for CEA Queretaro-specific supplementary data

**Deliverables:** CFDI 4.0 XML generator, tax calculation engine, XSD validation suite

### 4.3 Sprint 8 (Weeks 15-16): PAC Integration & Digital Signatures

**Tasks:**

1. **CSD (Certificado de Sello Digital) management**
   - Secure storage of CEA Queretaro's CSD private key and certificate (HSM or encrypted vault)
   - Certificate renewal workflow (CSD certificates expire every 4 years)
   - Key rotation procedures
   - Sign XML using XSLT original string method per SAT specification

2. **PAC (Proveedor Autorizado de Certificacion) integration**
   - Integrate with primary PAC provider (recommended: Finkok, SW sapien, or Digifort -- all have REST APIs)
   - PAC failover: integrate secondary PAC for high availability
   - Stamping flow: send signed XML -> receive timbrado (UUID, FechaTimbrado, SelloCFD, SelloSAT, NoCertificadoSAT)
   - `cfdi:Complemento` -> `tfd:TimbreFiscalDigital` attachment
   - Retry and error handling (PAC downtime, validation errors)

3. **SAT web service integration**
   - Real-time CFDI status verification via SAT web service
   - RFC validation service (validate customer RFC against SAT registry)
   - Constancia de Situacion Fiscal lookup capability

**Deliverables:** CSD key management module, PAC integration service with failover, SAT verification client

### 4.4 Sprint 9 (Weeks 17-18): Payment Complements & Cancellation

**Tasks:**

1. **Payment complement generation (Complemento de Pago 2.0)**
   - For invoices with `MetodoPago=PPD` (Pago en Parcialidades o Diferido)
   - Generate `pago20:Pagos` complement when payment is received
   - Link payment to original invoice via `pago20:DoctoRelacionado` (IdDocumento=UUID of original CFDI)
   - Support partial payments with running balance (ImpSaldoAnt, ImpPagado, ImpSaldoInsoluto)
   - Multiple payment complements per invoice

2. **CFDI cancellation workflow**
   - Cancellation request via PAC with motivo (01=with replacement, 02=without replacement, 03=not executed, 04=related to global)
   - Replacement CFDI generation (when motivo=01)
   - Customer acceptance flow for invoices > 72 hours old and > $1,000 MXN (SAT regulation)
   - Cancellation status tracking (pendiente, cancelado, rechazado)
   - Credit note CFDIs (TipoDeComprobante=E) for partial adjustments

3. **CFDI storage and retrieval**
   - Store original XML, timbrado XML, PDF representation
   - UUID-based lookup
   - Batch download for SAT audit compliance
   - Monthly CFDI reconciliation against SAT portal

**Deliverables:** Payment complement service, cancellation workflow, CFDI archive system

---

## 5. Sprint 10-12 (Weeks 19-24): Payment Ecosystem

### 5.1 Objectives

Integrate with Mexico's complete payment ecosystem, replacing the limited cash/card (`efectivoTarjeta`) system with support for convenience store payments (35-40% of volume), bank transfers, mobile payments, and direct debit. Build a reconciliation engine to handle multi-channel payment matching.

### 5.2 Sprint 10 (Weeks 19-20): Conekta PSP & OXXO Integration

**Tasks:**

1. **Conekta integration (primary payment service provider)**
   - Conekta API integration for payment orchestration
   - Customer payment object creation
   - Webhook handling for asynchronous payment notifications
   - Idempotency keys for reliable payment processing
   - PCI DSS compliance through Conekta tokenization (no card data stored locally)

2. **OXXO convenience store payments (35-40% of payment volume)**
   - OXXO Pay via Conekta: generate OXXO payment references (barcode)
   - Reference format compatible with existing `referencia.refreferencia` (varchar 25) pattern
   - Reference expiration management (`reffeclimitec` equivalent)
   - OXXO payment notification handling (T+1 settlement)
   - Map to existing `formapago` channel classification system

3. **Payment reference generation service**
   - Replace SOAP `cobrarReferencia` with REST reference generation
   - Barcode/QR code generation for physical payment points
   - Reference-to-invoice mapping (single reference -> multiple invoices via `referfact` pattern)
   - Reference lifecycle: generated -> active -> paid -> expired -> cancelled

**Deliverables:** Conekta integration, OXXO payment flow, reference generation service

### 5.3 Sprint 11 (Weeks 21-22): Bank Transfers & Mobile Payments

**Tasks:**

1. **SPEI (Sistema de Pagos Electronicos Interbancarios) integration**
   - CLABE generation for CEA Queretaro collection accounts
   - SPEI payment notification via STP (Sistema de Transferencias y Pagos) or banking partner
   - Reference reconciliation: match SPEI reference field to invoice/contract
   - Real-time SPEI payment confirmation
   - CSB file format compatibility (existing `gscnapuntescsb`/`gscimportecsb` pattern in `gescartera`)

2. **CoDi/DiMo mobile payments**
   - QR code generation for CoDi (Cobro Digital) / DiMo payment initiation
   - Payment confirmation via Banxico CoDi infrastructure
   - Integration with customer-facing payment screens and kiosks
   - Mobile app deep-link for payment initiation

3. **Online card payments**
   - Conekta-powered card payment page (embedded or redirect)
   - 3D Secure 2.0 support for card authentication
   - Tokenization for recurring payments
   - Card-on-file for autopay enrollment

**Deliverables:** SPEI integration, CoDi/DiMo flow, online card payment portal

### 5.4 Sprint 12 (Weeks 23-24): Direct Debit & Reconciliation Engine

**Tasks:**

1. **Direct debit (domiciliacion bancaria)**
   - SEPA-style direct debit mandate management (Mexican banking standards)
   - CSB19/CSB58 file generation for bank submission (leveraging existing `gescartera` remittance patterns)
   - Direct debit scheduling aligned with billing cycles
   - Return/rejection handling (`opdopdiddevol` reversal pattern)
   - Map to existing `fblesnbancario` (bank direct debit flag) in facturable

2. **Payment reconciliation engine**
   - Multi-channel reconciliation: match payments from all channels to invoices
   - Automatic matching: reference-based (exact match), amount-based (fuzzy match), FIFO (oldest invoice first)
   - Unmatched payment handling: suspense account, manual resolution queue
   - Bank statement reconciliation (CSB43 format import)
   - Settlement and funding reconciliation by channel
   - Daily reconciliation reports with exception highlighting

3. **Payment event integration**
   - Publish `PaymentReceived`, `PaymentApplied`, `PaymentReversed` events to billing microservice
   - Update contract balance (`contratodeuda.cntdsaldo` equivalent) via event projection
   - Trigger CFDI payment complement generation on payment application
   - Update debt snapshot (`cntddeudafac`, `cntddeudaint` equivalents)

**Deliverables:** Direct debit service, reconciliation engine, payment event pipeline

---

## 6. Sprint 13-14 (Weeks 25-28): Parallel Run & Validation

### 6.1 Objectives

Run old (OCCAM) and new billing systems in parallel, compare every invoice output, validate financial accuracy, and execute a controlled cutover.

### 6.2 Sprint 13 (Weeks 25-26): Parallel Run

**Tasks:**

1. **Dual-run infrastructure**
   - Shadow billing: new system processes same readings as legacy in parallel
   - Output comparator: automated line-by-line invoice comparison
   - Discrepancy database: log every difference with root cause classification
   - Tolerance thresholds: define acceptable variance (recommend $0.00 for charges, allow formatting differences)

2. **Comparison scope**
   - All active contracts (full customer base)
   - All billing concepts: water charges, fixed charges, sewer, surcharges, taxes
   - Tariff application validation: verify correct tariff version, tier calculation, social rates
   - Tax calculation: IVA amounts must match exactly
   - Invoice totals: must match to the centavo

3. **Discrepancy resolution**
   - Categorize: tariff engine bug, data migration gap, rounding difference, legacy bug (document known legacy errors)
   - Fix-and-rerun cycle: fix discrepancies, rerun comparison until convergence
   - Target: 100% match rate for all standard billing scenarios, documented exceptions for known legacy anomalies

**Deliverables:** Parallel run infrastructure, comparison reports, discrepancy resolution log

### 6.3 Sprint 14 (Weeks 27-28): Revenue Reconciliation & Cutover

**Tasks:**

1. **Revenue reconciliation**
   - Total revenue comparison: legacy vs. new system (by period, zone, tariff type)
   - Accounts receivable balancing: `contratodeuda` snapshots must match
   - Payment application verification: all payment channels producing correct results
   - CFDI compliance audit: sample CFDIs validated against SAT acceptance criteria

2. **Cutover plan**
   - Phase A (Week 27): Switch new system to primary for a pilot zone (lowest risk)
   - Phase B (Week 28): Expand to all zones if Phase A successful
   - Rollback plan: legacy system remains hot-standby for 2 billing cycles post-cutover
   - Data freeze window: define maintenance window for final data sync
   - Communication plan: internal staff training, customer notification for payment reference changes

3. **Post-cutover monitoring**
   - Real-time billing accuracy dashboard
   - Payment channel monitoring (all channels active and processing)
   - CFDI stamping success rate monitoring
   - Customer complaint tracking for billing-related issues
   - Weekly revenue comparison for first 8 weeks post-cutover

**Deliverables:** Revenue reconciliation report, cutover runbook, post-cutover monitoring dashboard

---

## 7. CFDI 4.0 Technical Specification

### 7.1 XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante
  xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfd40.xsd"
  Version="4.0"
  Serie="CEA"
  Folio="{invoice_number}"
  Fecha="{ISO8601_datetime}"
  FormaPago="{SAT_payment_form_code}"
  SubTotal="{subtotal_before_tax}"
  Moneda="MXN"
  Total="{total_with_tax}"
  TipoDeComprobante="I"
  MetodoPago="{PUE|PPD}"
  LugarExpedicion="{postal_code_CEA}"
  Exportacion="01"
  Certificado="{base64_certificate}"
  NoCertificado="{certificate_number}"
  Sello="{digital_signature}">

  <cfdi:Emisor
    Rfc="{CEA_RFC}"
    Nombre="{CEA_RAZON_SOCIAL}"
    RegimenFiscal="{regime_code}" />

  <cfdi:Receptor
    Rfc="{customer_RFC}"
    Nombre="{customer_name}"
    DomicilioFiscalReceptor="{customer_postal_code}"
    RegimenFiscalReceptor="{customer_regime}"
    UsoCFDI="{uso_CFDI_code}" />

  <cfdi:Conceptos>
    <!-- One Concepto per billing line item -->
    <cfdi:Concepto
      ClaveProdServ="80141600"
      Cantidad="{consumption_m3}"
      ClaveUnidad="MTQ"
      Unidad="Metro Cubico"
      Descripcion="Servicio de agua potable - Bloque {n}"
      ValorUnitario="{rate_per_m3}"
      Importe="{line_total}"
      ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado
            Base="{line_total}"
            Impuesto="002"
            TipoFactor="Tasa"
            TasaOCuota="0.160000"
            Importe="{iva_amount}" />
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>

    <!-- Sewer/drainage as separate concept -->
    <cfdi:Concepto
      ClaveProdServ="80141601"
      Cantidad="1"
      ClaveUnidad="E48"
      Unidad="Servicio"
      Descripcion="Servicio de alcantarillado"
      ValorUnitario="{sewer_charge}"
      Importe="{sewer_total}"
      ObjetoImp="02">
      <!-- Tax nodes -->
    </cfdi:Concepto>
  </cfdi:Conceptos>

  <cfdi:Impuestos TotalImpuestosTrasladados="{total_iva}">
    <cfdi:Traslados>
      <cfdi:Traslado
        Base="{taxable_subtotal}"
        Impuesto="002"
        TipoFactor="Tasa"
        TasaOCuota="0.160000"
        Importe="{total_iva}" />
    </cfdi:Traslados>
  </cfdi:Impuestos>

  <!-- Added by PAC after timbrado -->
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital
      xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital"
      Version="1.1"
      UUID="{uuid}"
      FechaTimbrado="{timestamp}"
      SelloCFD="{cfd_seal}"
      NoCertificadoSAT="{sat_cert_number}"
      SelloSAT="{sat_seal}" />
  </cfdi:Complemento>
</cfdi:Comprobante>
```

### 7.2 Required SAT Catalogs

| Catalog | Usage |
|---------|-------|
| `c_ClaveProdServ` | 80141600 (water distribution), 80141601 (sewerage) |
| `c_ClaveUnidad` | MTQ (cubic meter), E48 (service unit), ACT (activity) |
| `c_FormaPago` | 01 (cash), 02 (check), 03 (transfer/SPEI), 04 (credit card), 28 (debit card), 99 (other) |
| `c_MetodoPago` | PUE (single payment), PPD (deferred/installment) |
| `c_UsoCFDI` | S01 (no tax obligation), G03 (general expenses) |
| `c_RegimenFiscal` | Depends on customer type (601, 603, 605, 606, 612, 616, 625, 626) |
| `c_Impuesto` | 002 (IVA) |
| `c_TipoDeComprobante` | I (income), E (credit note), P (payment complement) |
| `c_Moneda` | MXN |

### 7.3 IVA Treatment for Water Services

| Service | IVA Rate | Legal Basis |
|---------|---------|-------------|
| Domestic water (residential, up to social threshold) | 0% / Exempt | Art. 2-A Fraccion II, LIVA |
| Domestic water (above threshold) | 16% | General rule |
| Commercial/industrial water | 16% | General rule |
| Sewer/drainage (residential) | Exempt | Art. 2-A Fraccion II, LIVA |
| Sewer/drainage (commercial) | 16% | General rule |
| Fixed service charge | 16% | General rule |
| Reconnection fees | 16% | General rule |
| Late payment surcharges | 16% | General rule |

---

## 8. Risk Register

| # | Risk | Probability | Impact | Severity | Mitigation |
|---|------|------------|--------|----------|------------|
| R1 | **Financial accuracy errors** -- New billing engine produces different amounts than legacy | Medium | Critical | **Critical** | Mandatory parallel run with 100% invoice comparison; zero-tolerance policy on amount discrepancies; fix before cutover |
| R2 | **CFDI rejection by SAT** -- Invalid XML structure, incorrect tax calculation, or wrong catalog codes | Medium | High | **High** | Validate against SAT XSD schemas; test with PAC sandbox environment; run sample CFDIs through SAT validation tool; engage CFDI specialist |
| R3 | **PAC provider downtime** -- PAC unavailable prevents invoice stamping | Low | High | **High** | Integrate two PAC providers with automatic failover; implement queuing for retry during outages; SLA monitoring |
| R4 | **Payment channel integration delays** -- OXXO, SPEI, or CoDi integration takes longer than estimated | Medium | Medium | **Medium** | Start with Conekta as PSP (abstracts multiple channels); implement channels incrementally; maintain legacy payment paths as fallback |
| R5 | **Tariff logic gaps** -- Undocumented OCCAM tariff rules not captured in new engine | High | High | **High** | Engage billing domain expert from Day 1; extract tariff logic from production data (not just documentation); validate every tariff scenario with real historical data |
| R6 | **Data migration errors** -- Corrupted or incomplete migration of tariff/billing history | Medium | High | **High** | Migrate incrementally with validation at each step; maintain read access to legacy data post-cutover; checksums on migrated records |
| R7 | **Revenue reconciliation failure** -- Post-cutover revenue doesn't match projections | Low | Critical | **High** | 2-cycle parallel run; maintain legacy hot-standby; automated revenue comparison dashboards; defined rollback triggers |
| R8 | **CSD certificate management** -- Private key compromise or certificate expiration | Low | Critical | **High** | HSM or encrypted vault for key storage; certificate expiration monitoring with 90-day advance alerts; documented renewal procedure |
| R9 | **Convenience store payment delays** -- OXXO T+1 settlement creates reconciliation gaps | Low | Medium | **Medium** | Design reconciliation engine to handle T+1 settlement natively; daily batch reconciliation with exception handling |
| R10 | **Customer confusion during transition** -- Payment references change format, new invoice layout | Medium | Medium | **Medium** | Phase cutover by zone; customer communication campaign; maintain old reference format compatibility during transition period |

---

## 9. Staffing Plan

### 9.1 Core Team (Months 12-20)

| Role | Name/Source | Allocation | Sprint Focus |
|------|-----------|-----------|-------------|
| **Billing Domain Expert** | Internal (CEA Queretaro operations) | 100% | All sprints -- tariff validation, business rules, UAT |
| **Senior Backend Dev 1** | Internal/Hire | 100% | Sprints 1-6: Tariff engine + billing microservice |
| **Senior Backend Dev 2** | Internal/Hire | 100% | Sprints 4-12: Billing microservice + payment integration |
| **CFDI/SAT Specialist** | Contract/Hire | 100% Sprints 7-9, 50% Sprint 13-14 | CFDI 4.0 implementation, PAC integration, SAT compliance |
| **QA Engineer** | Internal | 100% | All sprints -- financial accuracy testing, parallel validation |
| **DevOps Engineer** | Shared | 50% | Infrastructure, CI/CD, PAC connectivity, monitoring |
| **Frontend Developer** | Shared | 50% Sprints 3, 6 | Tariff config UI, billing dashboard |

### 9.2 Key Skills Required

| Skill | Criticality | Notes |
|-------|------------|-------|
| Mexican water utility tariff structures | Critical | Must understand CEA Queretaro's specific tariff model (tiered, seasonal, social) |
| CFDI 4.0 / SAT compliance | Critical | Hands-on experience with PAC integration, CSD management, payment complements |
| Event-driven architecture | High | Event sourcing, CQRS, message bus (Kafka/RabbitMQ) |
| Payment gateway integration | High | Conekta API, SPEI/STP, bank file formats (CSB19/43/57/58) |
| Legacy OCCAM/Agbar knowledge | High | Understanding existing tariff tables, billing batch flow, SOAP service contracts |
| PostgreSQL / database design | High | Event store design, temporal data modeling, migration scripts |
| Financial software testing | High | Penny-accurate testing, reconciliation validation, regulatory compliance testing |

### 9.3 External Dependencies

| Dependency | Provider | Lead Time | Action Required |
|-----------|----------|-----------|----------------|
| PAC provider contract | Finkok / SW sapien / Digifort | 2-4 weeks | Evaluate and sign contract by Sprint 6 |
| CSD certificate | SAT | 1-2 weeks | Verify CEA Queretaro CSD is current; renew if needed |
| Conekta merchant account | Conekta | 2-3 weeks | KYC documentation, merchant onboarding by Sprint 9 |
| OXXO Pay activation | Via Conekta | 1-2 weeks post-Conekta | Included in Conekta merchant setup |
| STP/SPEI access | STP or banking partner | 4-6 weeks | Banking relationship; may require regulatory filings |
| CoDi/DiMo registration | Banxico via banking partner | 4-8 weeks | Register through acquiring bank |
| Direct debit agreements | Banking partners | 4-6 weeks | Domiciliacion bancaria contracts with major banks |

---

## 10. Success Criteria

| Metric | Target | Measurement |
|--------|--------|------------|
| Invoice accuracy | 100% match with legacy (parallel run) | Automated comparison of every invoice |
| CFDI acceptance rate | >99.5% first-attempt PAC acceptance | PAC response monitoring |
| Payment channel coverage | 5+ channels active (cash, card, OXXO, SPEI, direct debit) | Channel transaction monitoring |
| Billing cycle time | <4 hours for full billing run (vs. current batch) | Billing run duration tracking |
| Reconciliation accuracy | 100% of payments matched within T+2 | Daily reconciliation reports |
| Tariff configuration time | <1 day for annual tariff update (vs. weeks) | Time to configure and validate new rates |
| System availability | 99.9% for billing service, 99.5% for payment processing | Uptime monitoring |
| Revenue variance | <0.01% post-cutover vs. projected | Monthly revenue comparison |
