# C5 - Modern Utility Billing Systems Research Report

**Agent:** C5 (research-billing-systems)
**Date:** 2026-02-16
**Scope:** Modern billing engine architectures, tariff engines, real-time rating, prepaid metering, CFDI 4.0 compliance, Mexican payment ecosystem, and revenue assurance for water utility modernization.

---

## Executive Summary

AquaCIS (built on the Agbar/OCCAM platform) currently operates a monolithic SOAP-based billing system for CEA Queretaro with 126 total API operations across 5 services, of which only 17 are currently integrated. The billing subsystem relies on batch-oriented processes with tightly coupled tariff tables, billing concepts, invoice generation, and debt management -- all exposed through heavyweight XML web services.

The next-generation billing engine must address seven critical gaps: (1) inflexible tariff configuration that cannot adapt to Mexico's evolving water pricing policies, (2) batch-only billing that prevents real-time consumption visibility, (3) no prepaid metering capability despite growing demand, (4) incomplete CFDI 4.0 compliance for SAT electronic invoicing, (5) limited payment channel integration in a country where 40%+ of payments happen at convenience stores, (6) no automated revenue assurance, and (7) a SOAP-only architecture that is difficult to extend, test, and maintain.

This report recommends a phased modernization approach centered on an event-driven billing microservice architecture, a rule-based tariff engine, event-sourced rating pipeline, and native integration with Mexico's payment rails (SPEI, CoDi, OXXO/convenience store payments). The overall Billing Modernization Priority Score is **9/10** -- billing is the revenue-generating core of the utility and its modernization is essential to the next-generation platform.

---

## 1. Modern Billing Architecture

### 1.1 Industry Landscape

Modern billing systems have evolved from monolithic, batch-oriented platforms to distributed, event-driven architectures. The key players and patterns include:

**Commercial Billing Platforms:**
- **Zuora** -- Subscription-first billing platform. Architecture: multi-tenant SaaS with a central Billing Engine, Product Catalog, Rating Engine, Payment Gateway Orchestrator, and Revenue Recognition module. Uses an event-driven pipeline where usage events flow through rating rules to produce invoice line items.
- **Chargebee** -- Subscription and metered billing. Features a catalog-driven approach where products, plans, and add-ons are configured declaratively. Supports metered billing where usage records are collected and rated at billing cycle end.
- **Open Smartflex** -- Utility-specific CIS (Customer Information System) used by water, gas, and electric utilities in Latin America. Monolithic but modular, with configurable tariff engines.
- **SAP IS-U / S/4HANA Utilities** -- Enterprise utility billing with Device Management, Meter Data Management, and Billing & Invoicing modules.
- **Oracle Utilities Customer Cloud Service (CC&B)** -- Cloud-native utility CIS with configurable rating and billing.

**Open-Source / Custom:**
- **Kill Bill** -- Open-source subscription billing and payments platform (Java). Plugin architecture for custom rating, payment gateways, and invoicing.
- **Lago** -- Open-source usage-based billing engine with event ingestion, real-time metering, and flexible plan configuration.
- **Custom microservice architectures** -- Many utilities build domain-specific billing engines as microservices, particularly when tariff structures are unique to the regulatory environment.

### 1.2 Architectural Patterns

The dominant architecture for a modern utility billing engine follows these patterns:

```
                    +-------------------+
                    |   API Gateway     |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                  |                  |
  +-------v------+  +-------v------+  +--------v-----+
  | Product &    |  | Metering &   |  | Customer     |
  | Tariff       |  | Rating       |  | Account      |
  | Catalog      |  | Engine       |  | Management   |
  +-------+------+  +-------+------+  +--------+-----+
          |                  |                  |
          +------------------+------------------+
                             |
                    +--------v----------+
                    | Billing Engine     |
                    | (Invoice Gen)      |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                  |                  |
  +-------v------+  +-------v------+  +--------v-----+
  | Tax &        |  | Payment      |  | Dunning &    |
  | Compliance   |  | Processing   |  | Collections  |
  | (CFDI)       |  | Orchestrator |  |              |
  +-------+------+  +-------+------+  +--------+-----+
          |                  |                  |
          +------------------+------------------+
                             |
                    +--------v----------+
                    | Event Bus          |
                    | (Kafka/RabbitMQ)   |
                    +--------------------+
```

**Key Architectural Principles:**

1. **Event-Driven Architecture (EDA):** Meter readings, consumption events, payments, and billing triggers flow as events through a message bus. This decouples producers from consumers and enables real-time processing.

2. **Event Sourcing for Billing State:** Every state change (reading received, charge calculated, invoice generated, payment applied) is stored as an immutable event. The current account balance is a projection of all events. This provides a complete audit trail essential for regulated utilities.

3. **CQRS (Command Query Responsibility Segregation):** Write operations (apply charge, record payment) go through command handlers that emit events. Read operations (view balance, view invoice) query pre-built projections optimized for each use case.

4. **Catalog-Driven Configuration:** Tariffs, billing concepts, tax rules, and payment methods are configured through a product/tariff catalog rather than hardcoded. Changes to tariff structures require catalog updates, not code changes.

5. **Idempotent Processing:** Every billing operation is idempotent -- re-processing a meter reading or payment event produces the same result. This is critical for reliability in distributed systems.

6. **Temporal Modeling:** All entities (tariffs, contracts, rates) have effective date ranges. The system can compute what the correct tariff was for any historical period, essential for back-billing and adjustments.

### 1.3 AquaCIS Current State Analysis

Based on analysis of the WSDL contracts, the current AquaCIS billing architecture reveals:

| Aspect | Current State | Gap |
|--------|--------------|-----|
| **API Style** | SOAP/XML with DTOs | No REST/GraphQL, heavy payloads |
| **Tariff Access** | `getTarifaDeAguaPorContrato`, `getTarifasVigente` | Read-only, no configuration API |
| **Billing Concepts** | `getConceptos` returns concept list per exploitation | Flat structure, no hierarchical rules |
| **Invoice Generation** | `getFacturas`, `getFacturaE` | Batch-generated, no real-time |
| **Debt Management** | 13 operations in debt WSDL | Separate service, tightly coupled |
| **Payment Processing** | `cobrarReferencia`, `avisarPago` | Reference-based, limited channels |
| **Invoice Documents** | `getPdfFactura`, `getDocumentoPago` | PDF/XML generation, no CFDI native |
| **Collection Types** | `efectivoTarjeta` (cash/card only) | No SPEI, CoDi, OXXO integration |

---

## 2. Tariff Engine Design

### 2.1 Water Tariff Complexity in Mexico

Mexican water utilities operate under some of the most complex tariff structures in the utility industry. Key characteristics include:

- **Tiered/Block Rates (Tarifas Escalonadas):** Consumption is divided into blocks (e.g., 0-10 m3, 11-30 m3, 31-60 m3, 60+ m3) with increasing per-unit prices. This is the dominant structure in Mexico.
- **Seasonal Rates:** Higher rates during dry season (March-June) to incentivize conservation.
- **Social/Subsidized Rates (Tarifa Social):** Reduced rates for low-income households, often determined by cadastral zone, property value, or social program enrollment.
- **Usage Categories:** Domestic, commercial, industrial, government, and mixed-use, each with different rate tables.
- **Fixed Charges (Cargo Fijo):** Monthly base charge regardless of consumption, often varying by meter size (caliber).
- **Sewer/Drainage Charges (Alcantarillado):** Typically a percentage of the water charge or a separate tiered structure.
- **Connection Fees (Derechos de Conexion):** One-time charges at various points in the contract lifecycle.
- **Infrastructure Surcharges:** Temporary surcharges for infrastructure projects, applied by zone.
- **Minimum Consumption Charges:** Even with zero consumption, a minimum billing amount applies.
- **Penalty/Reconnection Rates:** Surcharges after service disconnection for non-payment.
- **Multi-dwelling Discounts/Surcharges:** Properties with multiple dwelling units may have adjusted per-unit rates.

### 2.2 Tariff Engine Architecture

A modern tariff engine must be **declarative, versioned, and testable**:

```
+------------------------------------------+
|           Tariff Catalog                  |
|  +------+  +--------+  +-------------+  |
|  | Rate |  | Rule   |  | Effective   |  |
|  | Plans|  | Engine |  | Date Ranges |  |
|  +------+  +--------+  +-------------+  |
+------------------------------------------+
         |
         v
+------------------------------------------+
|           Rating Pipeline                 |
|                                          |
|  Input: {contract, reading, period}      |
|                                          |
|  1. Resolve applicable tariff version    |
|  2. Determine customer classification    |
|  3. Calculate block/tier consumption     |
|  4. Apply seasonal multipliers           |
|  5. Apply social rate adjustments        |
|  6. Calculate fixed charges              |
|  7. Calculate sewer charges              |
|  8. Apply surcharges/discounts           |
|  9. Calculate taxes (IVA)                |
|  10. Return rated charge breakdown       |
|                                          |
|  Output: ChargeBreakdown[]               |
+------------------------------------------+
```

**Data Model for Tariff Engine:**

```
TariffPlan
  ├── id, name, version, effective_from, effective_to
  ├── usage_category (domestic, commercial, industrial, etc.)
  ├── meter_size_category (13mm, 19mm, 25mm, 38mm, etc.)
  └── RateBlocks[]
       ├── lower_bound_m3, upper_bound_m3
       ├── rate_per_m3
       └── season_multipliers[]
            ├── season (dry, rainy, normal)
            └── multiplier

TariffModifier
  ├── type (social_discount, surcharge, penalty, zone_adjustment)
  ├── condition_expression (JSON/DSL rule)
  ├── adjustment_type (percentage, fixed_amount, rate_override)
  └── value

BillingConcept
  ├── code, name, type (water, sewer, fixed, tax, surcharge)
  ├── calculation_method (tiered, flat, percentage_of, formula)
  ├── formula_expression (for complex calculations)
  └── applicable_to[] (usage categories)
```

**Key Design Decisions:**

1. **Rule Engine vs. Code:** Use a lightweight rule engine (e.g., JSON Rules Engine, Drools-like DSL, or custom expression evaluator) rather than hardcoding tariff logic. Tariff analysts should be able to configure new rates without developer intervention.

2. **Temporal Versioning:** Every tariff plan has `effective_from` and `effective_to` dates. When rates change (often annually per municipal decree), a new version is created. Historical invoices always reference the tariff version that was active during their period.

3. **Simulation Mode:** The tariff engine should support "what-if" calculations -- given a proposed tariff change, what would the revenue impact be across the customer base?

4. **Audit Trail:** Every rating calculation produces a detailed breakdown showing which rules were applied, which blocks were consumed, and how the final amount was derived.

### 2.3 AquaCIS Current Tariff Structure

The current system uses:
- `Tarifa` objects with `codigo`, `descripcion`, `publicacion`, `subconceptos[]`, `variablesContratos[]`, `variablesPuntoServicio[]`
- `Subconcepto` objects with `correctoresAplicables[]` and `variables[]`
- `Concepto` objects with `codigoConcepto`, `conceptoPeriodico`, and `importe`
- `ConceptoConTarifasFacturadas` linking concepts to their rated tariffs

This structure shows a concept-and-subconcept hierarchy with correctors (modifiers) -- a reasonably sophisticated model but one that is opaque (black-box calculation inside OCCAM) and not configurable through the API.

---

## 3. Real-Time vs. Batch Rating

### 3.1 Batch Rating (Current Model)

**How it works in AquaCIS:**
1. Meter readings are collected (monthly/bimonthly routes)
2. Readings are loaded into the billing system in batch
3. The billing engine runs a batch process to rate all readings against current tariffs
4. Invoices are generated in bulk
5. Payment references are created
6. Invoices are distributed (print/electronic)

**Advantages:**
- Simple to implement and debug
- Predictable system load (billing runs at scheduled times)
- Mature, well-understood process
- Suitable for traditional manual meter reading

**Disadvantages:**
- Customers only see consumption after invoice generation (30-60 day lag)
- No ability to alert on unusual consumption patterns in real-time
- Billing errors discovered late in the cycle
- Cannot support prepaid metering
- No real-time balance visibility for customer self-service

### 3.2 Real-Time Rating

**How it works:**
1. Smart meters transmit readings at configurable intervals (hourly, daily)
2. Each reading event is immediately rated against the applicable tariff
3. Running balance is updated in real-time
4. Customers can see current-period charges at any time
5. At billing cycle end, the accumulated rated charges are consolidated into an invoice

**Advantages:**
- Immediate consumption visibility for customers and utility
- Anomaly detection (leak alerts, meter tampering, unusual patterns)
- Supports prepaid metering with real-time credit deduction
- Better customer experience (no billing surprises)
- Faster revenue recognition

**Disadvantages:**
- Higher computational requirements
- Requires smart meter infrastructure (AMI)
- More complex error handling (what if a reading is corrected?)
- Requires event-sourcing architecture for consistency
- Smart meter deployment is gradual -- must coexist with manual readings

### 3.3 Hybrid Recommendation

For CEA Queretaro, the recommended approach is a **hybrid model**:

| Customer Segment | Rating Model | Rationale |
|-----------------|-------------|-----------|
| Smart meter customers (telelectura) | Real-time rating | Already have `sntelelectura` flag in contract data |
| Manual reading customers | Batch rating at reading capture | Continue existing process |
| Prepaid customers | Real-time with credit deduction | New capability |
| Large commercial/industrial | Real-time with daily settlement | Revenue optimization |

**Implementation:** Build a single rating engine that processes events (whether from smart meter streams or batch reading imports). The engine is the same; only the event source differs. This ensures rating consistency regardless of the input channel.

```
Smart Meter Stream  ──┐
                      ├──> Rating Engine ──> Charge Events ──> Invoice Generator
Manual Reading Batch ─┘
```

---

## 4. Prepaid Metering

### 4.1 Overview

Prepaid water metering allows customers to pay for water in advance, with consumption deducted from their credit balance in real-time. The meter restricts flow when credit is exhausted (with configurable emergency credits and minimum-flow provisions for health/safety).

### 4.2 Architecture

```
+------------------+       +-------------------+
| Customer         |       | Prepaid Account   |
| Top-up           |------>| Service           |
| (OXXO, SPEI,    |       | - Credit balance  |
| mobile app)      |       | - Emergency credit|
+------------------+       | - Minimum flow    |
                           +--------+----------+
                                    |
                           +--------v----------+
                           | Rating Engine      |
                           | (real-time)        |
                           +--------+----------+
                                    |
                           +--------v----------+
                           | Meter Command      |
                           | Service            |
                           | - Open valve       |
                           | - Restrict flow    |
                           | - Close valve      |
                           +--------+----------+
                                    |
                           +--------v----------+
                           | Smart Meter        |
                           | (with valve)       |
                           +-------------------+
```

**Key Components:**

1. **Prepaid Account Ledger:** Event-sourced account tracking credits, debits, top-ups, and adjustments. Balance is a projection of all events.

2. **Top-Up Channels:**
   - Mobile app (credit/debit card, SPEI transfer)
   - OXXO/convenience store (barcode/reference number)
   - Bank transfer (SPEI with reference)
   - CoDi (QR-based instant payment)
   - Utility office (cash/card)

3. **Credit Management:**
   - Real-time balance tracking
   - Low-credit alerts (SMS, push notification, email)
   - Emergency credit (configurable amount available after zero balance)
   - Friendly-hours policy (no disconnection during nighttime or holidays)
   - Minimum flow mode (reduced pressure rather than full cutoff for humanitarian compliance)

4. **Meter Integration:**
   - Smart meters with remotely controllable valves
   - Two-way communication (reading up, commands down)
   - Offline mode (meter stores credit locally, syncs when connected)
   - Tamper detection

### 4.3 Benefits

- **For the Utility:** Eliminates accounts receivable risk, reduces billing cost, improves cash flow, reduces disconnection/reconnection costs
- **For Customers:** Budget control, no surprise bills, pay-as-you-go flexibility
- **For Conservation:** Direct link between payment and consumption drives water conservation behavior

### 4.4 Implementation Challenges

| Challenge | Mitigation |
|-----------|-----------|
| Smart meter infrastructure cost | Phased rollout starting with high-default areas |
| Regulatory requirements (cannot deny water for public health) | Emergency credit and minimum flow provisions |
| Customer resistance | Voluntary program with incentives (discounted rates) |
| Offline meter operation | Local credit storage with periodic sync |
| Tariff complexity with prepaid | Simplified prepaid tariff or daily block calculation |
| Social equity concerns | Social tariff integration, automatic subsidies |

### 4.5 Relevance to AquaCIS

The current contract data model includes `sntelelectura` (remote reading flag) and `moduloComunicacion` (communication module), indicating some smart meter infrastructure exists. The prepaid capability would be a new module layered on top of the real-time rating engine.

---

## 5. CFDI 4.0 Compliance

### 5.1 What is CFDI?

CFDI (Comprobante Fiscal Digital por Internet) is Mexico's mandatory electronic invoicing standard administered by the SAT (Servicio de Administracion Tributaria). Since January 2022, CFDI 4.0 is the required version, with the transition period having ended on April 1, 2023.

### 5.2 CFDI 4.0 Technical Requirements

**XML Structure:**
```xml
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
                  Version="4.0"
                  Serie="A"
                  Folio="12345"
                  Fecha="2026-02-16T12:00:00"
                  FormaPago="03"
                  SubTotal="500.00"
                  Moneda="MXN"
                  Total="580.00"
                  TipoDeComprobante="I"
                  MetodoPago="PUE"
                  LugarExpedicion="76000"
                  Exportacion="01">
  <cfdi:Emisor Rfc="CEA860101XXX"
               Nombre="COMISION ESTATAL DE AGUAS"
               RegimenFiscal="603"/>
  <cfdi:Receptor Rfc="XAXX010101000"
                 Nombre="PUBLICO EN GENERAL"
                 DomicilioFiscalReceptor="76000"
                 RegimenFiscalReceptor="616"
                 UsoCFDI="S01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="80141600"
                   Cantidad="30"
                   ClaveUnidad="LTR"
                   Descripcion="Servicio de agua potable"
                   ValorUnitario="15.00"
                   Importe="450.00"
                   ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="450.00"
                         Impuesto="002"
                         TipoFactor="Tasa"
                         TasaOCuota="0.160000"
                         Importe="72.00"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="72.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="450.00"
                     Impuesto="002"
                     TipoFactor="Tasa"
                     TasaOCuota="0.160000"
                     Importe="72.00"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
</cfdi:Comprobante>
```

**Key CFDI 4.0 Requirements:**

| Requirement | Detail |
|-------------|--------|
| **Receptor RFC validation** | Mandatory validation of customer RFC against SAT registry |
| **Receptor name matching** | Must match SAT-registered name exactly |
| **Fiscal domicile** | Recipient's fiscal postal code is mandatory |
| **Fiscal regime** | Both issuer and receiver fiscal regime codes required |
| **CFDI usage code** | `UsoCFDI` field indicating purpose of the invoice |
| **Product/service catalog** | Must use SAT's `ClaveProdServ` catalog (e.g., `80141600` for water service) |
| **Unit of measure catalog** | SAT's `ClaveUnidad` catalog |
| **Tax breakdown** | Itemized tax calculation per concept |
| **Digital seal** | CSD (Certificado de Sello Digital) signing |
| **PAC stamping** | Must be stamped by an authorized PAC (Proveedor Autorizado de Certificacion) |
| **Cancellation rules** | Cancellation requires recipient acceptance if invoice > 1,000 MXN and > 24 hours old |
| **Global invoicing** | For public-in-general sales, special global CFDI rules apply |
| **Payment complement** | For deferred payments (`MetodoPago=PPD`), a separate Complemento de Pago is required when payment is received |

### 5.3 Water Utility CFDI Specifics

Water utilities have special considerations:

- **ClaveProdServ:** `80141600` (Water utilities) or `80141601` (Drinking water distribution)
- **Tax treatment:** Water service for domestic use in Mexico is generally VAT-exempt (0% rate) or subject to special treatment depending on the state. Commercial/industrial may be taxed at 16%.
- **Government entity issuing:** CEA Queretaro as a state commission has specific fiscal regime codes
- **Bulk invoicing:** Utilities need to generate thousands of CFDIs per billing cycle
- **Complemento de Pago:** When customers pay after the invoice date (common with OXXO/bank payments), a payment complement must be generated

### 5.4 CFDI Integration Architecture

```
+-------------------+     +-------------------+     +-------------------+
| Billing Engine    |---->| CFDI Generator    |---->| PAC Service       |
| (Invoice data)    |     | - XML construction|     | (Stamp & certify) |
+-------------------+     | - CSD signing     |     +--------+----------+
                          | - Validation      |              |
                          +-------------------+     +--------v----------+
                                                    | SAT               |
                                                    | (Regulatory)      |
                                                    +-------------------+

+-------------------+     +-------------------+
| Payment Event     |---->| Payment Complement|
| (from any channel)|     | Generator         |
+-------------------+     | (CFDI Pago)       |
                          +-------------------+
```

**Recommended PAC Providers for High-Volume Utility:**
- Edicom (strong in utilities sector)
- Finkok (cost-effective, good API)
- SW SmarterWeb (modern REST API)
- Soluciones Inteligentes (established in government sector)

### 5.5 Current AquaCIS Gap

The current system has `getFacturaE` (electronic invoice) and `getDocumentoPagoXML` operations, suggesting some electronic invoicing capability exists within OCCAM. However, the WSDL contracts do not expose CFDI-specific fields (RFC validation, fiscal regime, PAC stamping status, UUID timbrado). A modern system needs native CFDI generation as a first-class billing output, not an afterthought.

---

## 6. Payment Processing in Mexico

### 6.1 Mexican Payment Ecosystem Overview

Mexico has a diverse payment ecosystem driven by a large unbanked population (estimated 47% of adults without a bank account) and strong cash culture, combined with rapid digital payment adoption:

| Channel | Market Share (est.) | Settlement Time | Fee Range |
|---------|-------------------|-----------------|-----------|
| **Cash at OXXO/convenience stores** | ~35-40% of utility payments | T+1 to T+3 | 1-2% or $8-15 MXN flat |
| **Bank transfer (SPEI)** | ~25-30% | Near real-time (seconds) | $0-3.50 MXN per transfer |
| **Direct debit (Domiciliacion)** | ~10-15% | T+1 | Varies by bank agreement |
| **CoDi (QR payments)** | ~3-5% (growing) | Real-time | Free (Banxico subsidized) |
| **Credit/Debit card** | ~10-15% | T+1 to T+2 | 1.5-3.5% |
| **Utility office (cash/card)** | ~10-15% | Immediate | Internal cost only |
| **Digital wallets (Mercado Pago, etc.)** | ~3-5% (growing) | T+1 | 1.5-3% |

### 6.2 Payment Channel Integration

#### 6.2.1 OXXO / Convenience Store Payments

OXXO has 21,000+ stores in Mexico and is the dominant payment point for utility bills. Integration options:

- **Openpay (BBVA):** Payment reference (barcode) generation. Customer presents reference at OXXO. Webhook notification upon payment. Most common integration path.
- **Conekta:** Similar to Openpay with OXXO Cash reference generation.
- **Direct agreement with FEMSA/OXXO:** Higher volume, lower fees, but requires complex integration.

**Technical Flow:**
```
1. Billing engine generates invoice with payment reference (referencia de pago)
2. Reference encoded as barcode on invoice (PDF/printed)
3. Customer presents barcode at OXXO
4. OXXO POS reads barcode, collects cash
5. OXXO settlement batch sends payment notification
6. Payment gateway receives webhook/batch file
7. Billing system applies payment to account
8. CFDI payment complement generated if applicable
```

**Current AquaCIS Support:** The `cobrarReferencia` operation accepts `banco`, `cajero`, `comercio`, `terminal`, `ticket` fields in `datosCobroDTO`, suggesting the reference-based payment model is already in use but the integration may be limited to specific channels.

#### 6.2.2 SPEI (Sistema de Pagos Electronicos Interbancarios)

SPEI is Mexico's real-time gross settlement system operated by Banxico (central bank). It processes inter-bank transfers in seconds, 24/7.

**Integration approach:**
- **CLABE generation:** Generate a unique CLABE (Cuenta Bancaria Estandarizada) reference per customer or per invoice
- **STP (Sistema de Transferencias y Pagos):** Most fintechs and payment processors use STP as their SPEI gateway. REST APIs available for CLABE management and payment notifications.
- **Direct bank integration:** Banks like BBVA, Banorte, Santander offer SPEI integration for corporate clients

**Technical Flow:**
```
1. Assign dedicated CLABE per customer account (or generate per invoice)
2. Customer initiates SPEI transfer from their bank to the CLABE
3. SPEI settlement occurs in seconds
4. STP/Bank sends webhook notification with payment details
5. Billing system matches CLABE to customer/invoice
6. Payment applied, receipt generated
```

#### 6.2.3 CoDi (Cobros Digitales)

CoDi is Banxico's QR-code payment system, designed to promote digital payments with zero fees. It uses the SPEI infrastructure.

**Integration approach:**
- Generate CoDi QR codes on invoices (printed and digital)
- Customer scans QR with their banking app
- Payment confirmed in real-time
- Particularly valuable for utility office and field collection

#### 6.2.4 Direct Debit (Domiciliacion Bancaria)

Automated bank debit on billing dates. The current AquaCIS system already supports this through `cambiarDomiciliacionBancaria` and `cambiarSenasCobroBancarias`.

**Modernization needs:**
- SEPA-style mandate management (electronic mandates vs. paper)
- Failed payment retry logic
- Customer notification before debit
- Integration with more banks

#### 6.2.5 Digital Wallets and Online Payments

Emerging channels:
- **Mercado Pago:** Dominant digital wallet in Latin America
- **PayPal Mexico:** Growing in online payments
- **Apple Pay / Google Pay:** For card-on-file in mobile apps
- **BNPL (Buy Now Pay Later):** Emerging for large outstanding balances

### 6.3 Payment Orchestration Architecture

```
+-------------------+
| Payment Request   |
| (from any source) |
+--------+----------+
         |
+--------v----------+
| Payment           |
| Orchestrator      |
| - Route to channel|
| - Retry logic     |
| - Reconciliation  |
+--------+----------+
         |
    +----+----+----+----+----+----+
    |    |    |    |    |    |    |
  OXXO SPEI CoDi Card D.D. Cash Wallet
    |    |    |    |    |    |    |
    +----+----+----+----+----+----+
         |
+--------v----------+
| Reconciliation     |
| Engine             |
| - Match payments   |
| - Handle partial   |
| - Generate CFDI    |
|   payment compl.   |
+-------------------+
```

**Key Design Considerations:**
- Payment reference uniqueness and expiration
- Partial payment handling (allow or reject?)
- Overpayment handling (credit to account or refund?)
- Multi-invoice payment (single payment covering multiple invoices)
- Payment reversal / chargeback handling
- Reconciliation with bank statements (automated matching)
- Cash handling for office payments (cash register integration)

---

## 7. Revenue Assurance

### 7.1 Revenue Leakage in Water Utilities

Revenue leakage is a significant problem in Mexican water utilities, with some estimates suggesting 30-50% of produced water is not billed (combining physical losses and commercial losses). Commercial losses (revenue leakage) include:

| Leakage Type | Description | Typical Impact |
|-------------|-------------|----------------|
| **Unbilled consumption** | Active connections without billing records | 5-15% |
| **Meter under-registration** | Aging meters measuring less than actual | 3-8% |
| **Illegal connections** | Unauthorized taps into the network | 5-20% |
| **Billing errors** | Incorrect tariff application, wrong readings | 1-3% |
| **Estimated readings abuse** | Chronic estimated readings hiding actual consumption | 2-5% |
| **Collection failures** | Billed but not collected (bad debt) | 5-15% |
| **Tariff classification errors** | Commercial use billed at domestic rates | 1-3% |

### 7.2 Revenue Assurance Architecture

```
+-------------------+     +-------------------+
| Data Sources      |     | Revenue Assurance  |
| - Meter readings  |---->| Engine             |
| - Billing records |     |                    |
| - GIS/Network     |     | Anomaly Detection  |
| - Customer data   |     | Rules Engine       |
| - Payment records |     | ML Models          |
+-------------------+     +--------+----------+
                                   |
                          +--------v----------+
                          | Alert & Case      |
                          | Management        |
                          | - Priority queue  |
                          | - Field dispatch  |
                          | - Resolution track|
                          +-------------------+
```

**Detection Rules:**

1. **Consumption Anomaly Detection:**
   - Sudden drop in consumption (meter failure or bypass)
   - Zero consumption for extended periods (vacant or illegal bypass)
   - Consumption significantly below neighborhood average
   - Seasonal pattern breaks

2. **Billing Integrity Checks:**
   - Invoices with zero amount for active accounts
   - Tariff rate applied vs. expected rate for customer category
   - Missing billing cycles (gaps in invoice sequence)
   - Pro-rating calculations validation

3. **Payment Reconciliation:**
   - Payments received but not applied
   - Applied payments not matching invoice amounts
   - Duplicate payment detection
   - Missing CFDI complements for received payments

4. **Network vs. Billing Reconciliation:**
   - Total water produced vs. total water billed (NRW - Non-Revenue Water)
   - DMA (District Metered Area) analysis: inflow vs. sum of customer meters
   - GIS connections vs. billing system active accounts

5. **Machine Learning Models:**
   - Clustering customers by consumption patterns to identify outliers
   - Predictive models for meter degradation
   - Classification models for fraud probability scoring

### 7.3 Implementation Technology

- **Stream Processing:** Apache Kafka + Apache Flink/Spark Streaming for real-time anomaly detection
- **Rule Engine:** Drools or custom DSL for configurable business rules
- **ML Pipeline:** Python scikit-learn or TensorFlow for consumption pattern analysis
- **Dashboard:** Real-time revenue assurance dashboards with KPIs (NRW %, billing efficiency, collection rate)
- **Case Management:** Integration with work order system for field verification dispatch

### 7.4 AquaCIS Revenue Assurance Gaps

The current system provides raw data (readings via `getLecturas`, consumption via `getConsumos`, invoices via `getFacturas`, debt via `getDeuda`) but has no automated cross-validation or anomaly detection layer. Revenue assurance is likely a manual process, if it exists at all.

---

## 8. Billing Cycle Management

### 8.1 Flexible Billing Periods

The current AquaCIS system uses a fixed billing cycle model with `ciclo` (billing cycle), `periodo` (period), and `periodicidad` (periodicity) fields. Modern billing engines support:

- **Configurable billing frequencies:** Monthly, bimonthly, quarterly, custom
- **Staggered billing:** Different billing groups (already hinted by `codigoGrupoFacturacion`) processed on different dates to spread system load and printing/distribution costs
- **Mid-cycle changes:** Handle tariff changes, meter replacements, and contract modifications mid-cycle
- **Pro-rating:** Automatic calculation when a period is shorter or longer than standard (new connection, disconnection, meter change)
- **Back-billing / Re-billing:** Ability to recalculate and re-issue invoices for past periods when errors are discovered or estimated readings are corrected
- **Credit notes:** Formal credit issuance when overbilling is identified, with CFDI nota de credito generation

### 8.2 Adjustment Engine

```
+-------------------+
| Adjustment        |
| Request           |
| (manual or auto)  |
+--------+----------+
         |
+--------v----------+
| Adjustment Engine  |
| 1. Validate period|
| 2. Recalculate    |
|    original rating|
| 3. Calculate delta|
| 4. Generate credit|
|    or debit note  |
| 5. Update balance |
| 6. Generate CFDI  |
+-------------------+
```

**Key scenarios:**
- Corrected meter reading (actual vs. estimated)
- Tariff reclassification (domestic to commercial)
- Meter replacement with reading gap
- Social tariff approval/revocation
- Billing dispute resolution
- Leaked meter compensation

---

## 9. Billing Engine Recommendations: Build vs. Buy

### 9.1 Option Analysis

| Option | Pros | Cons | Cost Estimate |
|--------|------|------|---------------|
| **Keep AquaCIS (OCCAM)** | No migration cost, familiar | Inflexible, SOAP-only, vendor locked to Agbar | Ongoing license + maintenance |
| **Buy: SAP IS-U** | Industry standard, comprehensive | Extremely expensive, complex implementation, overkill for a single utility | $2-5M+ implementation |
| **Buy: Open Smartflex** | LatAm focus, utility-specific | Still monolithic, limited customization | $500K-1.5M |
| **Buy: Oracle CC&B** | Cloud-native option available | Expensive, complex, US-centric | $1-3M |
| **Buy: Zuora/Chargebee** | Modern API-first, strong metered billing | Not utility-specific, no CFDI native, no water tariff models | $200-500K/year + customization |
| **Build: Custom microservices** | Perfect fit for requirements, full control, modern stack | Development time, requires strong team | $300K-800K development + ongoing |
| **Hybrid: Custom + OSS** | Leverage Kill Bill/Lago for core billing, customize for utility | Best balance of speed and fit | $200-500K + ongoing |

### 9.2 Recommendation

**Recommended approach: Hybrid Build with OSS Foundation**

Build a custom billing engine using modern microservice patterns, leveraging open-source components where appropriate:

| Component | Approach | Technology |
|-----------|----------|------------|
| **Tariff Engine** | Build custom | TypeScript/Rust, rule-based, version-controlled tariff definitions |
| **Rating Engine** | Build custom | Event-driven, processes readings into charges |
| **Invoice Generator** | Build custom | Assembles charges into invoices with CFDI output |
| **CFDI Module** | Build custom + PAC SDK | Direct SAT/PAC integration using established SDKs |
| **Payment Orchestrator** | Build on top of payment processor SDK | Conekta/Openpay SDKs for OXXO/SPEI/Card |
| **Account Ledger** | Adapt from Lago/Kill Bill | Event-sourced double-entry ledger |
| **Revenue Assurance** | Build custom | Stream processing with configurable rules |
| **Billing Cycle Manager** | Build custom | Scheduler with flexible period configuration |

**Technology Stack Recommendation:**

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Language** | TypeScript (Node.js) or Go | Team familiarity (AGORA uses Node.js), async event processing |
| **API** | REST + GraphQL | REST for integrations, GraphQL for flexible querying |
| **Event Bus** | Apache Kafka or NATS | Event sourcing backbone, high throughput |
| **Database** | PostgreSQL (primary) + TimescaleDB (readings) | JSONB for flexible tariff storage, time-series for consumption |
| **Cache** | Redis | Real-time balance lookups, rate limiting |
| **CFDI** | PAC SDK (Finkok/SW) + custom XML builder | Proven stamping service + custom builder for control |
| **Payments** | Conekta / Openpay SDK | Native OXXO, SPEI, CoDi, card support |
| **Monitoring** | Prometheus + Grafana | Billing pipeline observability |
| **Queue** | BullMQ (Redis-backed) | Job scheduling for batch billing runs |

---

## 10. AquaCIS Billing Modernization Path

### Phase 1: Foundation (Months 1-4)

**Objective:** Establish the core billing microservices and data model without disrupting current operations.

| Task | Priority | Description |
|------|----------|-------------|
| Design billing domain model | HIGH | Define entities: Account, Contract, TariffPlan, BillingCycle, Charge, Invoice, Payment |
| Build tariff engine | HIGH | Rule-based engine with temporal versioning, configure current CEA tariffs |
| Build rating engine | HIGH | Event-driven rating pipeline processing readings into charges |
| Set up event infrastructure | HIGH | Kafka/NATS cluster for billing events |
| Design account ledger | HIGH | Event-sourced double-entry ledger for all financial transactions |
| Build AquaCIS adapter | MEDIUM | SOAP client that reads data from current system during transition |

### Phase 2: Invoice & CFDI (Months 3-6)

**Objective:** Generate invoices and CFDI-compliant electronic documents.

| Task | Priority | Description |
|------|----------|-------------|
| Build invoice generator | HIGH | Consolidate rated charges into invoices |
| Implement CFDI 4.0 builder | HIGH | XML construction per SAT specification |
| PAC integration | HIGH | Connect to PAC for stamping (Finkok or SW) |
| Payment complement generator | HIGH | CFDI Pago for deferred payment scenarios |
| Cancellation workflow | MEDIUM | CFDI cancellation with recipient acceptance flow |
| Global CFDI for public | MEDIUM | Consolidated invoicing for general public |
| Invoice PDF renderer | MEDIUM | PDF generation from invoice data + CFDI XML |

### Phase 3: Payment Integration (Months 5-8)

**Objective:** Modern multi-channel payment processing.

| Task | Priority | Description |
|------|----------|-------------|
| Payment orchestrator | HIGH | Central payment routing and reconciliation |
| OXXO integration | HIGH | Via Conekta/Openpay for reference-based payments |
| SPEI integration | HIGH | CLABE-based payments via STP or bank API |
| CoDi integration | MEDIUM | QR code generation on invoices |
| Card payments | MEDIUM | Online card payments for self-service portal |
| Direct debit modernization | MEDIUM | Electronic mandate management |
| Reconciliation engine | HIGH | Automated payment-invoice matching |

### Phase 4: Advanced Capabilities (Months 7-12)

**Objective:** Prepaid metering, revenue assurance, and real-time billing.

| Task | Priority | Description |
|------|----------|-------------|
| Real-time rating pipeline | MEDIUM | Process smart meter readings in real-time |
| Prepaid account module | MEDIUM | Credit management, top-up, valve control integration |
| Revenue assurance engine | HIGH | Anomaly detection, cross-validation rules |
| Billing analytics dashboard | MEDIUM | KPIs, NRW tracking, collection rates |
| Customer self-service billing | MEDIUM | Real-time balance, payment history, invoice download |
| Adjustment and credit engine | MEDIUM | Back-billing, re-rating, credit note generation |

### Phase 5: Migration & Cutover (Months 10-14)

**Objective:** Migrate from AquaCIS billing to new system.

| Task | Priority | Description |
|------|----------|-------------|
| Historical data migration | HIGH | Migrate billing history, balances, payment records |
| Parallel run | HIGH | Run both systems in parallel, compare outputs |
| Reconciliation verification | HIGH | Validate new system produces identical results |
| Gradual cutover by billing group | HIGH | Migrate one billing group at a time |
| AquaCIS decommission (billing) | MEDIUM | Retire billing operations from legacy system |
| Staff training | HIGH | Train billing, customer service, and finance teams |

---

## 11. Recommendations

| # | Recommendation | Priority | Rationale |
|---|---------------|----------|-----------|
| 1 | Build a custom tariff engine with rule-based configuration and temporal versioning | **HIGH** | Core revenue capability; current system is opaque and inflexible |
| 2 | Implement event-driven rating engine that supports both batch and real-time processing | **HIGH** | Foundation for all billing scenarios including prepaid |
| 3 | Develop native CFDI 4.0 generation with PAC integration | **HIGH** | Legal compliance requirement; current integration is unclear |
| 4 | Integrate multi-channel payment processing (OXXO, SPEI, CoDi, cards) through a payment orchestrator | **HIGH** | 40%+ of customers pay at convenience stores; modern channels reduce collection cost |
| 5 | Implement an event-sourced account ledger for all financial transactions | **HIGH** | Audit trail, consistency, and foundation for prepaid and revenue assurance |
| 6 | Build automated revenue assurance with anomaly detection | **HIGH** | Commercial losses in Mexican water utilities can exceed 20% |
| 7 | Design the billing engine as independent microservices communicating via events | **HIGH** | Enables independent deployment, scaling, and testing |
| 8 | Adopt hybrid real-time/batch rating model based on meter type | **MEDIUM** | Smart meter penetration is partial; must support both modes |
| 9 | Implement prepaid metering module as a phased addition | **MEDIUM** | Valuable for high-default areas and conservation; requires smart meter infrastructure |
| 10 | Build billing cycle manager with pro-rating, adjustments, and re-billing | **MEDIUM** | Eliminates manual billing corrections |
| 11 | Create CFDI payment complement automation | **MEDIUM** | Required for OXXO and delayed payments; currently manual |
| 12 | Implement CoDi QR codes on all invoices (printed and digital) | **MEDIUM** | Zero-fee payment channel, Banxico-backed, growing adoption |
| 13 | Build billing simulation capability for tariff impact analysis | **LOW** | Enables data-driven tariff policy decisions |
| 14 | Implement digital wallet integrations (Mercado Pago) | **LOW** | Growing channel but still small market share |
| 15 | Deploy ML-based consumption anomaly detection | **LOW** | Sophisticated but requires historical data and team capability |

---

## 12. Billing Modernization Priority Score

### Score: 9 / 10

**Justification:**

Billing is the revenue engine of the water utility. Every operational improvement (smart meters, better readings, customer self-service) ultimately flows through the billing system to generate revenue. The current AquaCIS billing subsystem has fundamental limitations:

1. **Revenue at Risk (Score: 10/10):** Without modern revenue assurance, the utility is likely losing significant revenue to commercial losses. A modern billing engine with automated detection could recover 5-15% of unbilled revenue.

2. **Regulatory Compliance (Score: 9/10):** CFDI 4.0 compliance is a legal requirement. The current system's CFDI capability is opaque and may not fully comply with evolving SAT requirements. Non-compliance carries significant penalties.

3. **Customer Experience (Score: 8/10):** Modern customers expect real-time balance visibility, multiple payment channels, and digital invoicing. The current batch model with limited payment channels creates friction.

4. **Operational Efficiency (Score: 9/10):** Manual billing adjustments, limited payment reconciliation, and batch-only processing create significant operational overhead.

5. **Strategic Enablement (Score: 9/10):** Prepaid metering, real-time rating, and flexible tariffs are strategic capabilities that cannot be built on the current platform.

6. **Technical Debt (Score: 8/10):** SOAP-only APIs, monolithic architecture, and opaque tariff logic create a significant maintenance burden and limit innovation velocity.

The only reason this is not a 10/10 is that the current system is functional -- invoices are generated and payments are collected. This is not a broken system but rather a system that has reached its architectural ceiling and cannot support the next generation of utility operations.

---

## Appendix A: Key Data Model Entities (Current AquaCIS)

Derived from WSDL analysis:

| Entity | Key Fields | Service |
|--------|-----------|---------|
| `Tarifa` | codigo, descripcion, publicacion, subconceptos[], variablesContratos[] | Readings WS |
| `Concepto` | codigoConcepto, descripcionConcepto, conceptoPeriodico, importe | Readings WS |
| `Factura` | numero, contrato, conceptosCobrados[], importeTotal, fechaEmision, periodo | Readings WS |
| `deuda` | deuda, deudaComision, deudaTotal, ciclosAnteriores, ciclosTotales | Debt WS |
| `facturasPendientesDTO` | factura, contrato, importe, impuestos, recargo, referencia | Debt WS |
| `datosCobroDTO` | banco, cajero, comercio, fechaPago, nif, tarjeta, terminal | Debt WS |
| `saldoCuentaDTO` | saldoBloqueado, saldoCompensar, saldoDisponible, saldoTotal | Debt WS |
| `Contrato` | numero, codigoGrupoFacturacion, periodicidad, tipoCobro, uso, zona | Readings WS |

## Appendix B: SAT Catalogs Required for Water Utility CFDI

| Catalog | Key Values for Water Utility |
|---------|------------------------------|
| `c_ClaveProdServ` | 80141600 (Water utilities), 80141601 (Drinking water distribution) |
| `c_ClaveUnidad` | LTR (Liter), M3 (Cubic meter), E48 (Service unit) |
| `c_FormaPago` | 01 (Cash), 02 (Check), 03 (Transfer), 04 (Card), 28 (Debit card), 99 (Other) |
| `c_MetodoPago` | PUE (Pago en Una Exhibicion), PPD (Pago en Parcialidades o Diferido) |
| `c_UsoCFDI` | S01 (Sin efectos fiscales), G03 (Gastos en general), P01 (Por definir) |
| `c_RegimenFiscal` | 603 (Personas morales con fines no lucrativos - for government utility) |
| `c_Impuesto` | 002 (IVA) |
| `c_TipoFactor` | Tasa, Cuota, Exento |

## Appendix C: Payment Reference Format Design

For multi-channel payment support, the payment reference should encode:

```
Format: CEA-{contract_id}-{invoice_sequence}-{check_digit}
Example: CEA-442761-202602-7

Barcode: Code 128 for OXXO compatibility
QR: CoDi-compatible format with amount and CLABE
CLABE: Dedicated virtual CLABE per customer (18-digit format)
```

This enables automatic routing regardless of payment channel while maintaining reconciliation traceability.
