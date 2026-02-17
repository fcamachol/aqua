---
name: domain-glossary
description: Quick reference for Mexican water utility terms and their SUPRA Water code equivalents
---

# SUPRA Water Domain Glossary

When this skill is invoked, display the following reference information for Mexican water utility domain terminology used in the SUPRA Water 2026 project. This is a lookup reference, not a workflow.

---

## 1. Core Domain Terms

Spanish term, English translation, and SUPRA Water code representation:

| Spanish | English | SUPRA Code |
|---------|---------|------------|
| toma | service connection | `tomas` table |
| lectura | meter reading | `readings` table |
| medidor | water meter | `meters` table |
| factura / recibo | invoice / bill | `invoices` table |
| adeudo | outstanding debt | `debts` table |
| corte | disconnection | status `'cortada'` on `tomas` |
| reconexion | reconnection | work order type `'reconexion'` |
| convenio de pago | payment plan | `payment_plans` table |
| padron de usuarios | subscriber registry | `persons` + `contracts` tables |
| acometida | service pipe connection | `acometidas` table |
| sector hidraulico | hydraulic sector | `sectores_hidraulicos` table |
| explotacion | service area / zone | `explotaciones` table |
| cuota fija | flat rate | billing_type `'cuota_fija'` |
| tarifa escalonada | tiered rate | tariff calculation with consumption blocks |
| toma clandestina | illegal connection | fraud case in `fraud_cases` table |
| abonado / usuario | subscriber / customer | `persons` table |
| contrato | service contract | `contracts` table |
| periodo de facturacion | billing period | `billing_periods` table |
| consumo | water consumption (m3) | `readings.consumption_m3` |
| ruta de lectura | meter reading route | `reading_routes` table |
| orden de trabajo | work order | `work_orders` table |
| alcantarillado | sewerage / drainage | service type on `tomas` |
| drenaje | drainage | included in billing as surcharge |
| toma de agua potable | potable water connection | primary service type |
| subsidio | subsidy / discount | `subsidies` table |
| rezago | historical past-due debt | `debts` with old periods |
| pago parcial | partial payment | payment applied to oldest debt first |

---

## 2. Regulatory Entities

| Abbreviation | Full Name | Role |
|-------------|-----------|------|
| CONAGUA | Comision Nacional del Agua | Federal water authority, concession titles, water rights |
| CEA | Comision Estatal del Agua | State water commission, oversight and coordination |
| SEMARNAT | Secretaria de Medio Ambiente y Recursos Naturales | Environmental regulation, discharge permits |
| SAT | Servicio de Administracion Tributaria | Tax authority, CFDI requirements, RFC registry |
| PROFECO | Procuraduria Federal del Consumidor | Consumer protection, billing complaints |

---

## 3. Fiscal and Tax Terms

| Term | English | Context |
|------|---------|---------|
| RFC | Registro Federal de Contribuyentes | Tax ID number. 13 chars for persona fisica, 12 for persona moral |
| CURP | Clave Unica de Registro de Poblacion | 18-char national ID for individuals |
| CFDI | Comprobante Fiscal Digital por Internet | Electronic invoice format mandated by SAT |
| PAC | Proveedor Autorizado de Certificacion | Authorized certification provider for CFDI stamping. SUPRA uses Finkok |
| timbrado | digital stamping | Process of certifying a CFDI through a PAC |
| complemento de pago | payment complement | CFDI issued when a PPD invoice is paid |
| serie | invoice series | Letter prefix for invoice numbering (e.g., A, B) |
| folio | invoice number | Sequential number within a series |
| folio fiscal | fiscal folio / UUID | Unique identifier assigned by SAT upon timbrado |
| sello digital | digital seal | Cryptographic signature on the CFDI |
| CSD | Certificado de Sello Digital | Digital certificate used for signing CFDIs |
| IVA | Impuesto al Valor Agregado | Value-added tax, 16% standard rate |
| regimen fiscal | fiscal regime | SAT classification of taxpayer type |
| uso CFDI | CFDI usage code | Purpose of the invoice for the receiver |
| forma de pago | payment method | How the payment was made (cash, card, transfer) |
| metodo de pago | payment timing | PUE (single payment) or PPD (deferred/installments) |
| lugar de expedicion | place of issuance | ZIP code where the CFDI is issued |
| razon social | legal business name | Official registered name for persona moral |

---

## 4. Toma (Service Connection) Types

| Code | Spanish | English | Description |
|------|---------|---------|-------------|
| `domestica` | Domestica | Residential | Standard household water connection |
| `comercial` | Comercial | Commercial | Business/shop water connection |
| `industrial` | Industrial | Industrial | Factory/manufacturing water connection |
| `gobierno` | Gobierno | Government | Government building connection |
| `mixta` | Mixta | Mixed-use | Combined residential + commercial |
| `rural` | Rural | Rural | Rural area connection, often flat rate |
| `popular` | Popular | Low-income residential | Subsidized rate for low-income areas |
| `condominial` | Condominial | Condominium | Shared connection for housing complex |
| `baldio` | Baldio | Vacant lot | Undeveloped property with connection |

---

## 5. Toma Statuses

| Status | Spanish | English | Description |
|--------|---------|---------|-------------|
| `activa` | Activa | Active | Normal service, water flowing, billing active |
| `cortada` | Cortada | Disconnected | Service cut due to non-payment or violation |
| `suspendida` | Suspendida | Suspended | Temporarily suspended at customer request |
| `baja` | Baja | Deactivated | Permanently deactivated, contract terminated |
| `clausurada` | Clausurada | Sealed/Closed | Officially sealed by authority, cannot be reconnected without process |
| `en_tramite` | En tramite | Processing | New connection being processed |
| `factible` | Factible | Feasible | Feasibility approved, pending installation |

---

## 6. Common Billing Concepts

| Concept | Description |
|---------|-------------|
| Tarifa escalonada | Tiered pricing: consumption divided into blocks (e.g., 0-10 m3 at rate A, 11-20 m3 at rate B, etc.) |
| Cuota fija | Flat monthly rate regardless of consumption (used when no meter is installed) |
| Cargo fijo | Fixed service charge added to every bill |
| Cargo por alcantarillado | Sewerage surcharge, typically a percentage of the water charge |
| Cargo por drenaje | Drainage surcharge |
| Subsidio | Government subsidy applied to reduce the bill for qualifying tomas |
| Recargo por mora | Late payment surcharge, typically a percentage per month |
| Derecho de conexion | One-time connection fee for new tomas |
| Deposito en garantia | Refundable security deposit for new contracts |

---

## 7. Aquasis Legacy Terms

| Aquasis Term | SUPRA Equivalent | Notes |
|-------------|------------------|-------|
| `NumeroContrato` | `contracts.contract_number` | Legacy string format, may need zero-padding |
| `ClaveToma` | `tomas.toma_code` | Legacy alphanumeric identifier |
| `EstatusToma` | `tomas.status` | Legacy uses single-char codes: A/C/S/B |
| `NumeroMedidor` | `meters.serial_number` | Physical meter serial number |
| `LecturaAnterior` | `readings.previous_reading` | Previous period meter reading |
| `LecturaActual` | `readings.current_reading` | Current period meter reading |
| `ConsumoM3` | `readings.consumption_m3` | Calculated: current - previous |
| `ImporteTotal` | `invoices.total_amount` | Bill total in MXN |
| `SaldoPendiente` | `debts.remaining_amount` | Outstanding balance |

---

Use this glossary when writing code, naming database columns, creating API endpoints, writing documentation, or communicating with the water utility team. Consistent use of these terms across the codebase ensures clarity between the development team and domain experts.
