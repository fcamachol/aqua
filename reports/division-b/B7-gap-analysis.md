# B7 - AquaCIS Cross-Service Gap Analysis

## Agent: B7 (api-gap-analysis)
## Date: 2026-02-16
## Scope: All 126 SOAP operations across 5 AquaCIS services -- priority ranking, dependency chains, business impact

---

## Executive Summary

**AquaCIS integration coverage stands at 13.5% (17 of 126 operations).** While this number appears alarming, the real impact is more nuanced than the raw percentage suggests.

The 17 integrated operations were strategically chosen to enable two critical business flows: (1) contract inquiry with consumption/billing visibility, and (2) the complete work order lifecycle (create, visit, resolve). These two flows represent the operational backbone of AGORA's interaction with AquaCIS.

However, the 109 unintegrated operations create severe gaps in three areas:

1. **Revenue Collection (CRITICAL):** The entire payment processing pipeline -- 12 debt management operations covering payment generation, collection, and cancellation -- is unintegrated. Agents cannot process payments, generate payment documents, or view detailed debt breakdowns without leaving AGORA.

2. **Contract Lifecycle Management (HIGH):** New supply requests, contract transfers, terminations, and holder changes are all manual. With 5 schema-defined operations for contract lifecycle events, there is no path from AGORA to handle the most common customer service requests.

3. **Customer Self-Service Data (MEDIUM):** 39 operations in the Readings & Client Portal service remain unintegrated. While 8 core data retrieval operations are connected, the absence of address changes, bank detail updates, customer search by NIF, and tariff queries means agents must use multiple systems for routine customer interactions.

**Overall API Coverage Health Score: 3/10**

The score reflects that while the integrated operations are well-chosen for their purpose, the platform cannot support end-to-end business processes. Every customer interaction that goes beyond "look up information" or "create a work order" requires manual intervention in AquaCIS directly.

---

## Complete Operation Matrix

### Legend

| Symbol | Meaning |
|--------|---------|
| **INT** | Integrated into AGORA |
| AVL | Available but not integrated |
| SCH | Schema defined only (not yet implemented on AquaCIS side) |

### 1. Contracts Service (InterfazGenericaContratacionWS) -- 53 operations, 4 integrated

| # | Operation | Status | Business Value | Category |
|---|-----------|--------|---------------|----------|
| 1 | `cambiarDomicilioNotificaciones` | AVL | HIGH | Customer Data Mgmt |
| 2 | `cambiarSenasCobroBancarias` | AVL | HIGH | Payment Config |
| 3 | `consultaDetalleContrato` | **INT** | CRITICAL | Contract Inquiry |
| 4 | `consultaDocumentacionContrato` | AVL | MEDIUM | Documentation |
| 5 | `consultaDocumentacionTramite` | AVL | MEDIUM | Documentation |
| 6 | `consultaHistoricoActuacionesContrato` | AVL | HIGH | Contract History |
| 7 | `consultaHistoricoConsumoContrato` | AVL | MEDIUM | Consumption History |
| 8 | `consultaHistoricoDomiciliacion` | AVL | LOW | Payment History |
| 9 | `consultaLiquidacionTramite` | AVL | MEDIUM | Process/Settlement |
| 10 | `countFacturasContrato` | AVL | LOW | Invoice Query |
| 11 | `crearOrdenServicio` | AVL | MEDIUM | Service Orders |
| 12 | `esPSContratable` | AVL | HIGH | Contract Lifecycle |
| 13 | `esTitular` | AVL | MEDIUM | Identity Verification |
| 14 | `getCierresByIdsContrato` | AVL | LOW | Contract Closures |
| 15 | `getClienteListByExplotacion` | AVL | LOW | Admin/Reporting |
| 16 | `getConsumos` | AVL | MEDIUM | Consumption Data |
| 17 | `getContrato` | **INT** | CRITICAL | Contract Inquiry |
| 18 | `getContratos` | **INT** | CRITICAL | Contract Search |
| 19 | `getContratosByNumFactNumContrato` | AVL | HIGH | Contract Lookup |
| 20 | `getExplotacionesUsuario` | AVL | LOW | Admin Config |
| 21 | `getFacturaE` | AVL | MEDIUM | E-Invoicing |
| 22 | `getFacturas` | AVL | HIGH | Invoice Query |
| 23 | `getFacturasContrato` | AVL | HIGH | Invoice Query |
| 24 | `getFacturasContratoReferencia` | AVL | MEDIUM | Invoice References |
| 25 | `getFacturasPorCondiciones` | AVL | MEDIUM | Invoice Search |
| 26 | `getIDPersonaContrato` | AVL | MEDIUM | Identity Resolution |
| 27 | `getImpresionesLocalesPendientes` | AVL | LOW | Print Queue |
| 28 | `getMotivosOrden` | AVL | HIGH | Catalog/Reference |
| 29 | `getPDFImpresionLocalPendiente` | AVL | LOW | Print Queue |
| 30 | `getPdfDocumentoFactura` | AVL | HIGH | Invoice PDF |
| 31 | `getPdfFactura` | **INT** | HIGH | Invoice PDF |
| 32 | `getPdfMandato` | AVL | MEDIUM | Document Generation |
| 33 | `getPersonaList` | AVL | MEDIUM | Customer Search |
| 34 | `getTiposOrden` | AVL | HIGH | Catalog/Reference |
| 35 | `getValidacionVerFactura` | AVL | LOW | Validation |
| 36 | `recuperaFacturasByIds` | AVL | MEDIUM | Invoice Retrieval |
| 37 | `recuperaOrdenesServicio` | AVL | HIGH | Service Order Query |
| 38 | `registrarContactoManual` | AVL | MEDIUM | Contact Management |
| 39 | `solicitudAcometida` | SCH | HIGH | Contract Lifecycle |
| 40 | `solicitudActivacionFacturaOnline` | AVL | MEDIUM | E-Invoicing |
| 41 | `solicitudAltaServiAlerta` | AVL | LOW | Alert Services |
| 42 | `solicitudAltaSuministro` | SCH | CRITICAL | Contract Lifecycle |
| 43 | `solicitudBajaSuministro` | SCH | CRITICAL | Contract Lifecycle |
| 44 | `solicitudCambioDomiciliacionBancaria` | AVL | HIGH | Payment Config |
| 45 | `solicitudCambioDomicilioNotificaciones` | AVL | HIGH | Customer Data Mgmt |
| 46 | `solicitudCambioTitularContrato` | SCH | CRITICAL | Contract Lifecycle |
| 47 | `solicitudFacturaEnQuejaActiva` | AVL | MEDIUM | Complaints |
| 48 | `solicitudFacturasMasiva` | AVL | LOW | Bulk Operations |
| 49 | `solicitudIntroduccionLectura` | AVL | HIGH | Meter Reading |
| 50 | `solicitudIntroduccionLecturaIVR` | AVL | LOW | IVR Channel |
| 51 | `solicitudModificacionDatosPersonales` | AVL | HIGH | Customer Data Mgmt |
| 52 | `solicitudModificacionServiAlertaMasiva` | AVL | LOW | Bulk Operations |
| 53 | `solicitudSubrogacionContrato` | SCH | HIGH | Contract Lifecycle |

### 2. Debt Management Service (InterfazGenericaGestionDeudaWS) -- 13 operations, 1 integrated

| # | Operation | Status | Business Value | Category |
|---|-----------|--------|---------------|----------|
| 1 | `getDeuda` | **INT** | CRITICAL | Debt Query |
| 2 | `getDeudaContrato` | AVL | HIGH | Debt Detail |
| 3 | `getDeudaContratoBloqueoCobro` | AVL | HIGH | Debt with Block Info |
| 4 | `getDeudaTotalConFacturas` | AVL | CRITICAL | Debt + Invoice Breakdown |
| 5 | `getContratoPorContratoConDeuda` | AVL | HIGH | Contract Debt View |
| 6 | `getContratosPorNifconDeuda` | AVL | HIGH | Customer Debt View |
| 7 | `getImpagadosContrato` | AVL | CRITICAL | Unpaid Invoices |
| 8 | `getDocumentoPago` | AVL | CRITICAL | Payment Document |
| 9 | `getDocumentoPagoXML` | AVL | MEDIUM | Payment Doc (XML) |
| 10 | `avisarPago` | AVL | CRITICAL | Payment Notification |
| 11 | `cobrarReferencia` | AVL | CRITICAL | Payment Collection |
| 12 | `cobrarReferenciaFrmPago` | AVL | HIGH | Payment Collection |
| 13 | `cancelarReferencia` | AVL | HIGH | Payment Cancellation |

### 3. Meters Service (InterfazGenericaContadoresWS) -- 4 operations, 1 integrated

| # | Operation | Status | Business Value | Category |
|---|-----------|--------|---------------|----------|
| 1 | `actualizarContador` | AVL | MEDIUM | Meter Management |
| 2 | `getCambiosContadorDeContrato` | AVL | HIGH | Meter History |
| 3 | `getContador` | AVL | HIGH | Meter Query |
| 4 | `getPuntoServicioPorContador` | **INT** | CRITICAL | Service Point Lookup |

### 4. Readings & Client Portal (InterfazOficinaVirtualClientesWS) -- 47 operations, 8 integrated

| # | Operation | Status | Business Value | Category |
|---|-----------|--------|---------------|----------|
| 1 | `cambiarDireccionCorrespondencia` | AVL | HIGH | Customer Data Mgmt |
| 2 | `cambiarDomiciliacionBancaria` | AVL | HIGH | Payment Config |
| 3 | `cambiarEmailNotificacionPersona` | **INT** | HIGH | Notification Config |
| 4 | `cambiarMovilNotificacionContrato` | AVL | HIGH | Notification Config |
| 5 | `cambiarPersonaNotificacionContrato` | **INT** | MEDIUM | Notification Config |
| 6 | `cambiarTipoFacturaContrato` | **INT** | MEDIUM | Invoice Config |
| 7 | `cambiarUrlOficinaVirtualExplotacion` | AVL | LOW | Admin Config |
| 8 | `cambiarUrlOficinaVirtualSociedad` | AVL | LOW | Admin Config |
| 9 | `getActuaciones` | AVL | HIGH | Action History |
| 10 | `getAgencias` | AVL | LOW | Reference Data |
| 11 | `getBanco` | AVL | LOW | Reference Data |
| 12 | `getBancosPorDescripcion` | AVL | LOW | Reference Data |
| 13 | `getBancoPorExplotacionCodigo` | AVL | LOW | Reference Data |
| 14 | `getBancosPorExplotacionDescripcion` | AVL | LOW | Reference Data |
| 15 | `getCallesPorPatron` | AVL | MEDIUM | Address Lookup |
| 16 | `getComunidadesDePais` | AVL | LOW | Geographic Catalog |
| 17 | `getConceptoConTarifasDeContrato` | AVL | HIGH | Tariff Detail |
| 18 | `getConceptoConTarifasDeFactura` | AVL | MEDIUM | Tariff Detail |
| 19 | `getConceptos` | **INT** | MEDIUM | Billing Concepts |
| 20 | `getConsumos` | **INT** | HIGH | Consumption Data |
| 21 | `getConsumosParaGraficas` | **INT** | MEDIUM | Consumption Charts |
| 22 | `getContrato` | AVL | MEDIUM | Contract Lookup |
| 23 | `getContratoPorDatosGenerales` | AVL | MEDIUM | Contract by Address |
| 24 | `getContratosPorDatosGenerales` | AVL | MEDIUM | Contracts by Address |
| 25 | `getContratosPorNif` | AVL | HIGH | Customer Contracts |
| 26 | `getContratosPorNie_crn` | AVL | MEDIUM | Customer Contracts |
| 27 | `getDomicilio` | AVL | MEDIUM | Address Query |
| 28 | `getDomiciliosContratados` | AVL | MEDIUM | Address Query |
| 29 | `getDomiciliosPendientesContratar` | AVL | MEDIUM | New Contracts |
| 30 | `getFactura` | AVL | HIGH | Invoice Detail |
| 31 | `getFacturas` | **INT** | HIGH | Invoice List |
| 32 | `getIdiomaExplotacion` | AVL | LOW | Config |
| 33 | `getLecturas` | **INT** | HIGH | Meter Readings |
| 34 | `getLecturasParaGraficas` | AVL | LOW | Readings Charts |
| 35 | `getLocalidadesDePoblacion` | AVL | LOW | Geographic Catalog |
| 36 | `getNumeroCuentaBancaria` | AVL | MEDIUM | Payment Config |
| 37 | `getPaises` | AVL | LOW | Geographic Catalog |
| 38 | `getPoblacionesDeProvincia` | AVL | LOW | Geographic Catalog |
| 39 | `getProvincia` | AVL | LOW | Geographic Catalog |
| 40 | `getProvinciasDeComunidad` | AVL | LOW | Geographic Catalog |
| 41 | `getTarifaDeAguaPorContrato` | **INT** | HIGH | Tariff Data |
| 42 | `getTarifasVigente` | AVL | MEDIUM | Tariff Catalog |
| 43 | `getTitularPorContrato` | AVL | HIGH | Customer Query |
| 44 | `getTitularPorNif` | AVL | HIGH | Customer Query |
| 45 | `getTitularPorNie_crn` | AVL | LOW | Customer Query |
| 46 | `getTitulares` | AVL | HIGH | Customer Search |
| 47 | `getUltimoMensaje` | AVL | MEDIUM | Customer Messages |

### 5. Work Orders Service (InterfazGenericaOrdenesServicioWS) -- 9 operations, 3 integrated

| # | Operation | Status | Business Value | Category |
|---|-----------|--------|---------------|----------|
| 1 | `crearOrdenExterna` | AVL | MEDIUM | WO Creation |
| 2 | `crearOrdenTrabajo` | **INT** | CRITICAL | WO Creation |
| 3 | `getCalibres` | AVL | LOW | Meter Catalog |
| 4 | `getDocumentoOrdenTrabajo` | AVL | HIGH | WO Document |
| 5 | `getMarcasYModelos` | AVL | LOW | Meter Catalog |
| 6 | `informarVisita` | **INT** | CRITICAL | WO Visits |
| 7 | `multipleRefreshData` | AVL | MEDIUM | WO Bulk Query |
| 8 | `refreshData` | AVL | HIGH | WO Detail Query |
| 9 | `resolveOT` | **INT** | CRITICAL | WO Resolution |

---

## Current Coverage Analysis

### What the 17 Integrated Operations Enable

The 17 integrated operations form two distinct business capability clusters:

#### Cluster A: Contract Information & Billing View (11 operations)

| Operation | Service | Business Role |
|-----------|---------|---------------|
| `consultaDetalleContrato` | Contracts | Full contract detail with meter serial, supply point, personal data |
| `getContrato` | Contracts | Contract lookup with configurable options |
| `getContratos` | Contracts | Multi-criteria contract search (requires auth) |
| `getPdfFactura` | Contracts | Invoice PDF generation (requires auth) |
| `getDeuda` | Debt | Debt summary by identifier |
| `cambiarEmailNotificacionPersona` | Readings | Update customer email notification |
| `cambiarPersonaNotificacionContrato` | Readings | Change notification person (requires auth) |
| `cambiarTipoFacturaContrato` | Readings | Switch invoice type (requires auth) |
| `getConceptos` | Readings | Billing concept catalog |
| `getConsumos` | Readings | Consumption data per contract |
| `getConsumosParaGraficas` | Readings | Chart-ready consumption data |
| `getFacturas` | Readings | Invoice list per contract (requires auth) |
| `getLecturas` | Readings | Meter reading history |
| `getTarifaDeAguaPorContrato` | Readings | Water tariff per contract |

**Enables:** An agent can look up any contract, view its consumption/readings/invoices, see applied tariffs, view billing concepts, check debt summary, download invoice PDFs, and update a customer's email, notification person, or invoice type.

#### Cluster B: Work Order Lifecycle (3 + 1 supporting operations)

| Operation | Service | Business Role |
|-----------|---------|---------------|
| `getPuntoServicioPorContador` | Meters | Service point ID resolution (prerequisite for WO creation) |
| `crearOrdenTrabajo` | Work Orders | Create work order in AquaCIS |
| `informarVisita` | Work Orders | Log field visit to a work order |
| `resolveOT` | Work Orders | Close/resolve a work order |

**Enables:** The complete work order lifecycle from creation through field visits to resolution. The critical cross-service dependency (Meters -> Work Orders via `idPtoServicio`) is properly handled.

### What These Clusters Cannot Do

Despite covering two important flows, the current integration has critical blind spots:

1. **Cannot collect payments** -- agents see debt but cannot act on it
2. **Cannot look up customers by NIF** -- must have the contract number already
3. **Cannot change addresses or bank details** -- common customer requests
4. **Cannot create new contracts or terminate existing ones**
5. **Cannot view work order details after creation** -- no `refreshData`
6. **Cannot generate work order PDFs** -- no `getDocumentoOrdenTrabajo`
7. **Cannot submit meter readings** -- no `solicitudIntroduccionLectura`
8. **Cannot view contract action history** -- no `consultaHistoricoActuacionesContrato`
9. **Cannot search for contracts by invoice number** -- no `getContratosByNumFactNumContrato`
10. **Cannot view detailed debt with invoice breakdown** -- only summary via `getDeuda`

---

## Gap Impact Assessment

### CRITICAL Gaps (Business-Blocking)

These missing integrations prevent core business processes from being completed in AGORA.

| Gap | Impact | Affected Operations |
|-----|--------|-------------------|
| **No payment processing** | Agents must leave AGORA to process any payment. Customers calling about paying a bill cannot be helped end-to-end. | `getImpagadosContrato`, `getDocumentoPago`, `avisarPago`, `cobrarReferencia`, `cancelarReferencia` |
| **No contract lifecycle management** | New supply requests, contract transfers, and terminations cannot be initiated from AGORA. | `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato` (all SCH) |
| **No detailed debt visibility** | `getDeuda` provides only a summary. Agents cannot see which specific invoices are unpaid or view invoice-level debt breakdown. | `getDeudaTotalConFacturas`, `getImpagadosContrato`, `getContratosPorNifconDeuda` |

### HIGH Gaps (Significant Manual Workarounds)

| Gap | Impact | Affected Operations |
|-----|--------|-------------------|
| **No customer search by NIF** | When a customer calls, agents must know the contract number. Cannot resolve "I'm Juan Perez, RFC XAXX010101000" to their contracts. | `getContratosPorNif`, `getTitularPorNif`, `getTitulares` |
| **No address/bank detail changes** | Among the most common customer requests -- changing mailing address or bank details for direct debit. | `cambiarDireccionCorrespondencia`, `cambiarDomiciliacionBancaria`, `cambiarSenasCobroBancarias` |
| **No work order query/PDF** | After creating a work order, AGORA cannot retrieve its current status or generate a PDF for the customer or field crew. | `refreshData`, `getDocumentoOrdenTrabajo` |
| **No contract action history** | Cannot see past actions taken on a contract, limiting dispute resolution and audit trails. | `consultaHistoricoActuacionesContrato`, `getActuaciones` |
| **No meter detail/history** | Cannot view meter specifications or change history, essential for meter-related complaints and work orders. | `getContador`, `getCambiosContadorDeContrato` |
| **No invoice search by number** | When a customer has an invoice number but no contract number, agents cannot find it. | `getContratosByNumFactNumContrato`, `getFacturasContrato` |

### MEDIUM Gaps (Incremental Efficiency Loss)

| Gap | Impact | Affected Operations |
|-----|--------|-------------------|
| No meter reading submission | Customers cannot submit readings through AGORA. | `solicitudIntroduccionLectura` |
| No e-invoice features | Cannot activate online invoicing or retrieve e-invoices. | `solicitudActivacionFacturaOnline`, `getFacturaE` |
| No tariff catalog | Cannot display all available tariffs (only per-contract). | `getTarifasVigente`, `getConceptoConTarifasDeContrato` |
| No mobile notification changes | Cannot update SMS notification number. | `cambiarMovilNotificacionContrato` |
| No service point contractability check | Cannot verify if a location can get service. | `esPSContratable` |
| No order type/motive catalogs | Order types and motives are hardcoded rather than fetched dynamically. | `getTiposOrden`, `getMotivosOrden` |

### LOW Gaps (Niche or Administrative)

| Gap | Impact | Affected Operations |
|-----|--------|-------------------|
| No geographic catalogs | Countries, provinces, communities, localities not dynamically loaded. | 7 geographic catalog operations |
| No bank reference data | Bank codes not dynamically validated. | 5 bank lookup operations |
| No print queue management | Cannot manage pending print jobs. | `getImpresionesLocalesPendientes`, `getPDFImpresionLocalPendiente` |
| No bulk alert management | Cannot modify alert services in bulk. | `solicitudModificacionServiAlertaMasiva` |
| No IVR reading submission | Separate channel, not needed in AGORA. | `solicitudIntroduccionLecturaIVR` |
| No virtual office URL management | Admin configuration, rarely needed. | 2 URL management operations |

---

## Dependency Chain Map

Operations do not exist in isolation. Many require data from other operations. Below are the critical dependency chains.

### Chain 1: Work Order Creation (ALREADY INTEGRATED)
```
consultaDetalleContrato (Contracts)
  |-- extracts: numeroContador (meter serial)
  v
getPuntoServicioPorContador (Meters)
  |-- extracts: idPtoServicio (service point ID)
  v
crearOrdenTrabajo (Work Orders)
  |-- returns: order code (e.g., O4514415)
  v
informarVisita (Work Orders)  -->  resolveOT (Work Orders)
```
**Status: FULLY INTEGRATED**

### Chain 2: Payment Processing (NOT INTEGRATED)
```
getDeuda (Debt) [INTEGRATED - provides summary]
  |-- need detailed view:
  v
getDeudaTotalConFacturas (Debt) [NOT INTEGRATED]
  |-- or --
getImpagadosContrato (Debt) [NOT INTEGRATED]
  |-- selects invoices to pay, then:
  v
getDocumentoPago (Debt) [NOT INTEGRATED]
  |-- returns: payment reference + PDF
  v
cobrarReferencia (Debt) [NOT INTEGRATED]
  |-- OR, if cancellation needed:
  v
cancelarReferencia (Debt) [NOT INTEGRATED]
  |-- OR, external payment notification:
  v
avisarPago (Debt) [NOT INTEGRATED]
```
**Status: BLOCKED at step 2. Only summary debt view is available.**

### Chain 3: Customer Identification (NOT INTEGRATED)
```
Customer provides NIF/tax ID
  v
getContratosPorNif (Readings) [NOT INTEGRATED]
  |-- OR --
getTitularPorNif (Readings) [NOT INTEGRATED]
  |-- returns: contract number(s)
  v
consultaDetalleContrato (Contracts) [INTEGRATED]
  |-- full contract detail
  v
(any downstream operation using contract number)
```
**Status: BLOCKED at step 1. Agents must already know the contract number.**

### Chain 4: Contract Lifecycle (SCHEMA ONLY)
```
esPSContratable (Contracts) [NOT INTEGRATED]
  |-- check if service point can be contracted
  v
solicitudAltaSuministro (Contracts) [SCHEMA ONLY]
  |-- create new supply
  |-- OR --
solicitudCambioTitularContrato (Contracts) [SCHEMA ONLY]
  |-- transfer ownership
  |-- OR --
solicitudBajaSuministro (Contracts) [SCHEMA ONLY]
  |-- terminate supply
```
**Status: NOT AVAILABLE. These operations are schema-defined but not implemented on the AquaCIS side.**

### Chain 5: Work Order Monitoring (NOT INTEGRATED)
```
crearOrdenTrabajo (Work Orders) [INTEGRATED]
  |-- returns: order code
  v
refreshData (Work Orders) [NOT INTEGRATED]
  |-- returns: full OT with client data, elements, readings, debt, comments
  v
getDocumentoOrdenTrabajo (Work Orders) [NOT INTEGRATED]
  |-- returns: PDF document
```
**Status: BLOCKED at step 2. Orders can be created but not subsequently queried.**

### Chain 6: Address Change Workflow (NOT INTEGRATED)
```
getCallesPorPatron (Readings) [NOT INTEGRATED]
  |-- validates street name/ID
  v
getLocalidadesDePoblacion (Readings) [NOT INTEGRATED]
  |-- validates locality
  v
cambiarDireccionCorrespondencia (Readings) [NOT INTEGRATED]
  |-- OR --
cambiarDomicilioNotificaciones (Contracts) [NOT INTEGRATED]
```
**Status: BLOCKED. Geographic validation catalogs and change operations both unintegrated.**

### Chain 7: Bank Details Change (NOT INTEGRATED)
```
getBanco / getBancosPorDescripcion (Readings) [NOT INTEGRATED]
  |-- validates bank code
  v
getAgencias (Readings) [NOT INTEGRATED]
  |-- validates agency
  v
cambiarDomiciliacionBancaria (Readings) [NOT INTEGRATED]
  |-- OR --
cambiarSenasCobroBancarias (Contracts) [NOT INTEGRATED]
  |-- OR --
solicitudCambioDomiciliacionBancaria (Contracts) [NOT INTEGRATED]
```
**Status: BLOCKED. Bank validation and change operations both unintegrated.**

---

## Cross-Service Dependency Matrix

The following table shows which services depend on other services' operations.

| Calling Service | Depends On | Through | Purpose |
|-----------------|------------|---------|---------|
| Work Orders (`crearOrdenTrabajo`) | Meters (`getPuntoServicioPorContador`) | `idPtoServicio` | Service point ID is mandatory for work order creation |
| Work Orders (`crearOrdenTrabajo`) | Contracts (`consultaDetalleContrato`) | `numeroContador` | Meter serial needed to look up service point |
| Debt (all operations) | Contracts (identity) | `contrato` number | All debt queries require contract number |
| Readings (all operations) | Contracts (identity) | `contrato` + `explotacion` | All reading queries require contract + exploitation |
| Contracts (lifecycle) | Readings (geographic catalogs) | locality/street IDs | Address validation for contract changes |

---

## Priority Tiers

### Tier 1: CRITICAL -- Must Integrate ASAP (19 operations)

These operations either block core business processes or would dramatically reduce manual work for the most common customer interactions.

| # | Operation | Service | Reason | Effort |
|---|-----------|---------|--------|--------|
| 1 | `getDeudaTotalConFacturas` | Debt | Detailed debt view with invoice breakdown; agents currently blind beyond summary | S |
| 2 | `getImpagadosContrato` | Debt | Lists unpaid invoices with amounts; prerequisite for payment flow | S |
| 3 | `getDocumentoPago` | Debt | Generates payment document PDF + reference; enables payment processing | M |
| 4 | `cobrarReferencia` | Debt | Processes actual payment collection; core revenue operation | M |
| 5 | `avisarPago` | Debt | Notifies system of external payment; closes payment loop | S |
| 6 | `cancelarReferencia` | Debt | Payment cancellation/reversal; essential for error handling | S |
| 7 | `getContratosPorNif` | Readings | Customer identification by tax ID; most common lookup method | S |
| 8 | `getTitularPorNif` | Readings | Customer data retrieval by tax ID | S |
| 9 | `getTitulares` | Readings | Multi-criteria customer search | S |
| 10 | `refreshData` | Work Orders | Query work order status after creation; critical visibility gap | S |
| 11 | `getDocumentoOrdenTrabajo` | Work Orders | Work order PDF for field crews and customers | S |
| 12 | `getContador` | Meters | Meter detail lookup; needed for meter-related tickets | S |
| 13 | `getCambiosContadorDeContrato` | Meters | Meter change history; essential for meter dispute resolution | S |
| 14 | `cambiarDireccionCorrespondencia` | Readings | Address change -- top-5 most common customer request | M |
| 15 | `cambiarDomiciliacionBancaria` | Readings | Bank detail change -- top-5 most common customer request | M |
| 16 | `getContratosByNumFactNumContrato` | Contracts | Find contract by invoice number; common customer scenario | S |
| 17 | `consultaHistoricoActuacionesContrato` | Contracts | Contract action audit trail; needed for dispute resolution | S |
| 18 | `getActuaciones` | Readings | Intervention history per contract | S |
| 19 | `getTitularPorContrato` | Readings | Get holder details for a contract; identity verification | S |

### Tier 2: IMPORTANT -- Significant Efficiency Gains (25 operations)

| # | Operation | Service | Reason | Effort |
|---|-----------|---------|--------|--------|
| 1 | `getDeudaContrato` | Debt | Detailed contract-level debt view | S |
| 2 | `getDeudaContratoBloqueoCobro` | Debt | Debt with collection block information | S |
| 3 | `getContratoPorContratoConDeuda` | Debt | Combined contract + debt view | S |
| 4 | `getContratosPorNifconDeuda` | Debt | All debt across all contracts for a customer | S |
| 5 | `cobrarReferenciaFrmPago` | Debt | Payment with cash/card distinction | M |
| 6 | `getDocumentoPagoXML` | Debt | XML format payment document (for integrations) | S |
| 7 | `cambiarMovilNotificacionContrato` | Readings | Update mobile notification number | S |
| 8 | `solicitudIntroduccionLectura` | Contracts | Submit meter reading from customer | M |
| 9 | `getFacturasContrato` | Contracts | Invoice list per contract (alternative to Readings.getFacturas) | S |
| 10 | `getFacturas` (Contracts) | Contracts | Invoice search by criteria | S |
| 11 | `getPdfDocumentoFactura` | Contracts | Alternative invoice PDF retrieval | S |
| 12 | `getConceptoConTarifasDeContrato` | Readings | Detailed tariff breakdown per contract | S |
| 13 | `getTarifasVigente` | Readings | Current tariff catalog | S |
| 14 | `getFactura` | Readings | Single invoice detail view | S |
| 15 | `getDomicilio` | Readings | Address data for a contract | S |
| 16 | `getNumeroCuentaBancaria` | Readings | Bank account for a contract | S |
| 17 | `esPSContratable` | Contracts | Contractability check before new supply | S |
| 18 | `esTitular` | Contracts | Holder verification | S |
| 19 | `getTiposOrden` | Contracts | Dynamic order type catalog | S |
| 20 | `getMotivosOrden` | Contracts | Dynamic order motive catalog | S |
| 21 | `recuperaOrdenesServicio` | Contracts | Service order history | S |
| 22 | `cambiarSenasCobroBancarias` | Contracts | Bank payment detail change (Contracts service version) | M |
| 23 | `cambiarDomicilioNotificaciones` | Contracts | Notification address change (Contracts service version) | M |
| 24 | `solicitudModificacionDatosPersonales` | Contracts | Personal data modification request | M |
| 25 | `multipleRefreshData` | Work Orders | Bulk work order status query | S |

### Tier 3: NICE-TO-HAVE -- Incremental Improvements (30 operations)

| # | Operation | Service | Reason | Effort |
|---|-----------|---------|--------|--------|
| 1 | `solicitudActivacionFacturaOnline` | Contracts | Online invoice activation | S |
| 2 | `getFacturaE` | Contracts | Electronic invoice retrieval | S |
| 3 | `solicitudFacturaEnQuejaActiva` | Contracts | Invoice during active complaint | S |
| 4 | `getIDPersonaContrato` | Contracts | Customer ID resolution | S |
| 5 | `getPersonaList` | Contracts | Person search | S |
| 6 | `registrarContactoManual` | Contracts | Manual contact registration | S |
| 7 | `consultaDocumentacionContrato` | Contracts | Contract documentation | S |
| 8 | `consultaDocumentacionTramite` | Contracts | Process documentation | S |
| 9 | `consultaHistoricoConsumoContrato` | Contracts | Historical consumption (alternative to Readings) | S |
| 10 | `consultaLiquidacionTramite` | Contracts | Process settlement details | M |
| 11 | `getFacturasContratoReferencia` | Contracts | Invoice reference data | S |
| 12 | `getFacturasPorCondiciones` | Contracts | Advanced invoice filtering | M |
| 13 | `recuperaFacturasByIds` | Contracts | Batch invoice retrieval | S |
| 14 | `countFacturasContrato` | Contracts | Invoice count (optimization) | S |
| 15 | `getValidacionVerFactura` | Contracts | Invoice view validation | S |
| 16 | `getPdfMandato` | Contracts | Direct debit mandate PDF | S |
| 17 | `crearOrdenServicio` | Contracts | Service order via Contracts service | M |
| 18 | `actualizarContador` | Meters | Meter data update | M |
| 19 | `getContratosPorNie_crn` | Readings | Contracts by NIE/CRN | S |
| 20 | `getTitularPorNie_crn` | Readings | Holder by NIE/CRN | S |
| 21 | `getContrato` (Readings) | Readings | Contract details (alternative) | S |
| 22 | `getContratoPorDatosGenerales` | Readings | Contract by address (single) | S |
| 23 | `getContratosPorDatosGenerales` | Readings | Contracts by address (multiple) | S |
| 24 | `getDomiciliosContratados` | Readings | Contracted addresses at a location | S |
| 25 | `getDomiciliosPendientesContratar` | Readings | Pending addresses | S |
| 26 | `getLecturasParaGraficas` | Readings | Readings for charts | S |
| 27 | `getConceptoConTarifasDeFactura` | Readings | Tariffs for a specific invoice | S |
| 28 | `getUltimoMensaje` | Readings | Last system message for a contract | S |
| 29 | `crearOrdenExterna` | Work Orders | External order creation | M |
| 30 | `getCallesPorPatron` | Readings | Street name search (for address changes) | S |

### Tier 4: LOW PRIORITY -- Rarely Needed or Niche (30 operations)

| # | Operation | Service | Reason | Effort |
|---|-----------|---------|--------|--------|
| 1 | `consultaHistoricoDomiciliacion` | Contracts | Direct debit history (niche audit) | S |
| 2 | `getCierresByIdsContrato` | Contracts | Contract closure data | S |
| 3 | `getClienteListByExplotacion` | Contracts | Client list by exploitation (admin) | S |
| 4 | `getConsumos` (Contracts) | Contracts | Consumption (duplicate of Readings.getConsumos) | S |
| 5 | `getExplotacionesUsuario` | Contracts | User exploitation list (admin) | S |
| 6 | `getImpresionesLocalesPendientes` | Contracts | Pending print jobs | S |
| 7 | `getPDFImpresionLocalPendiente` | Contracts | Pending print PDF | S |
| 8 | `solicitudAltaServiAlerta` | Contracts | Alert service enrollment | S |
| 9 | `solicitudCambioDomiciliacionBancaria` | Contracts | Bank change request (duplicate route via Contracts) | M |
| 10 | `solicitudCambioDomicilioNotificaciones` | Contracts | Notification address change request (duplicate) | M |
| 11 | `solicitudFacturasMasiva` | Contracts | Bulk invoice request | M |
| 12 | `solicitudIntroduccionLecturaIVR` | Contracts | IVR channel reading (not for AGORA) | S |
| 13 | `solicitudModificacionServiAlertaMasiva` | Contracts | Bulk alert modification | M |
| 14-18 | `solicitudAcometida`, `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudSubrogacionContrato` | Contracts | Schema-only -- cannot integrate until AquaCIS implements them | N/A |
| 19 | `cambiarUrlOficinaVirtualExplotacion` | Readings | Admin virtual office config | S |
| 20 | `cambiarUrlOficinaVirtualSociedad` | Readings | Admin virtual office config | S |
| 21 | `getAgencias` | Readings | Bank agency lookup | S |
| 22 | `getBanco` | Readings | Bank by code | S |
| 23 | `getBancosPorDescripcion` | Readings | Banks by name | S |
| 24 | `getBancoPorExplotacionCodigo` | Readings | Bank by exploitation+code | S |
| 25 | `getBancosPorExplotacionDescripcion` | Readings | Banks by exploitation+name | S |
| 26 | `getComunidadesDePais` | Readings | Geographic catalog | S |
| 27 | `getIdiomaExplotacion` | Readings | Language config | S |
| 28 | `getLocalidadesDePoblacion` | Readings | Locality catalog | S |
| 29 | `getPaises` | Readings | Countries catalog | S |
| 30 | `getPoblacionesDeProvincia` | Readings | Towns catalog | S |
| -- | `getProvincia` | Readings | Provinces catalog | S |
| -- | `getProvinciasDeComunidad` | Readings | Provinces by community | S |
| -- | `getCalibres` | Work Orders | Meter caliber catalog | S |
| -- | `getMarcasYModelos` | Work Orders | Meter brands/models catalog | S |

> **Note on Schema-Only operations:** 5 operations (`solicitudAcometida`, `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudSubrogacionContrato`) are listed in Tier 4 because they cannot be integrated until AquaCIS implements them. However, their business value is CRITICAL. Once AquaCIS makes them available, they should be prioritized as Tier 1.

---

## Quick Wins: Top 10 Easiest High-Value Integrations

These operations have simple request/response patterns, minimal parameters, no WS-Security requirement (unless noted), and high business value.

| Rank | Operation | Service | Value | Effort | Why Quick |
|------|-----------|---------|-------|--------|-----------|
| 1 | `getContratosPorNif` | Readings | CRITICAL | S | 2 params (nif, idioma), returns contract array. Unlocks customer identification flow. |
| 2 | `getTitularPorNif` | Readings | HIGH | S | 1 param (nif), returns holder data. Complements #1. |
| 3 | `getContador` | Meters | HIGH | S | 1 param (serialNumber), returns full meter data. Already have meter serial from `consultaDetalleContrato`. |
| 4 | `refreshData` | Work Orders | CRITICAL | S | Simple `OTRequest` structure, returns full order data. Closes the WO visibility gap. |
| 5 | `getDocumentoOrdenTrabajo` | Work Orders | HIGH | S | Order code + optional observations, returns PDF. Already have order codes. |
| 6 | `getDeudaTotalConFacturas` | Debt | CRITICAL | S | 4 optional params (contrato, ref, explotacion, idioma). Returns debt with invoice breakdown. |
| 7 | `getImpagadosContrato` | Debt | CRITICAL | S | 3 params (contrato, nif, idioma). Returns pending invoices + installments. |
| 8 | `getCambiosContadorDeContrato` | Meters | HIGH | S | 2 params (idContrato, idioma). Returns meter change history. |
| 9 | `consultaHistoricoActuacionesContrato` | Contracts | HIGH | S | 5 params with pagination. Returns action history. Straightforward read. |
| 10 | `getTitularPorContrato` | Readings | HIGH | S | 2 params (explotacion, contrato). Returns holder data. Immediate value for identity verification. |

**Estimated total effort for all 10 quick wins: 2-3 developer weeks.**

These 10 operations would immediately enable:
- Customer identification by NIF (eliminating the contract-number-required bottleneck)
- Detailed debt and unpaid invoice visibility
- Work order status tracking and PDF generation
- Meter detail and history lookup
- Contract action audit trail
- Holder verification

---

## Integration Roadmap

### Phase 1: Foundation (Weeks 1-3) -- Customer Identification + Debt Visibility

**Goal:** Enable agents to identify customers and see detailed debt information.

| Week | Operations | Service | Notes |
|------|-----------|---------|-------|
| 1 | `getContratosPorNif`, `getTitularPorNif`, `getTitulares` | Readings | Customer ID by NIF/search. Simple read-only. No auth needed for first two. |
| 1 | `getTitularPorContrato` | Readings | Holder details per contract. |
| 2 | `getDeudaTotalConFacturas`, `getImpagadosContrato` | Debt | Detailed debt with invoice breakdown. |
| 2 | `getDeudaContrato`, `getContratoPorContratoConDeuda` | Debt | Additional debt views. |
| 3 | `getContratosPorNifconDeuda`, `getDeudaContratoBloqueoCobro` | Debt | Cross-contract debt + block info. |

**Outcome:** Agents can identify any customer by NIF, see all their contracts, and view detailed debt including specific unpaid invoices.

### Phase 2: Payment Processing (Weeks 4-6)

**Goal:** Enable end-to-end payment collection from within AGORA.

| Week | Operations | Service | Notes |
|------|-----------|---------|-------|
| 4 | `getDocumentoPago`, `getDocumentoPagoXML` | Debt | Generate payment documents. |
| 5 | `cobrarReferencia`, `cobrarReferenciaFrmPago` | Debt | Payment collection (card/cash). Requires careful testing. |
| 5 | `avisarPago` | Debt | External payment notification. |
| 6 | `cancelarReferencia` | Debt | Payment reversal. Full payment pipeline complete. |

**Outcome:** Complete payment cycle: view debt -> generate payment doc -> collect payment -> or cancel. Revenue-critical.

### Phase 3: Work Order Enhancement + Meter Visibility (Weeks 7-9)

**Goal:** Close the work order visibility gap and enable meter management queries.

| Week | Operations | Service | Notes |
|------|-----------|---------|-------|
| 7 | `refreshData`, `multipleRefreshData` | Work Orders | WO status queries. |
| 7 | `getDocumentoOrdenTrabajo` | Work Orders | WO PDF generation. |
| 8 | `getContador`, `getCambiosContadorDeContrato` | Meters | Meter details and history. |
| 8 | `getTiposOrden`, `getMotivosOrden` | Contracts | Dynamic catalogs for WO creation. |
| 9 | `consultaHistoricoActuacionesContrato`, `getActuaciones` | Contracts/Readings | Action history for contracts. |

**Outcome:** Work orders are fully visible post-creation. Meter information is accessible. Order catalogs are dynamic.

### Phase 4: Customer Self-Service Operations (Weeks 10-13)

**Goal:** Enable agents to process common customer change requests.

| Week | Operations | Service | Notes |
|------|-----------|---------|-------|
| 10 | `cambiarDireccionCorrespondencia` | Readings | Address changes. May need geographic catalog support. |
| 10 | `cambiarMovilNotificacionContrato` | Readings | Mobile number changes. |
| 11 | `cambiarDomiciliacionBancaria` | Readings | Bank detail changes. |
| 11 | `cambiarSenasCobroBancarias` | Contracts | Bank payment details (Contracts route). |
| 12 | `solicitudIntroduccionLectura` | Contracts | Meter reading submission. |
| 12 | `solicitudModificacionDatosPersonales` | Contracts | Personal data changes. |
| 13 | `getContratosByNumFactNumContrato`, `recuperaOrdenesServicio` | Contracts | Additional search/retrieval. |

**Outcome:** Agents can process the most common customer requests (address change, bank change, meter reading, personal data update) without leaving AGORA.

### Phase 5: Advanced Features & Catalog Data (Weeks 14-18)

**Goal:** Fill in remaining gaps for completeness.

| Operations | Service | Notes |
|-----------|---------|-------|
| Invoice operations: `getFacturasContrato`, `getFactura`, `getPdfDocumentoFactura`, `getFacturaE`, `solicitudActivacionFacturaOnline` | Contracts/Readings | Complete invoice management. |
| Tariff operations: `getTarifasVigente`, `getConceptoConTarifasDeContrato`, `getConceptoConTarifasDeFactura` | Readings | Full tariff visibility. |
| Documentation: `consultaDocumentacionContrato`, `consultaDocumentacionTramite` | Contracts | Contract/process docs. |
| Remaining search: `getContratoPorDatosGenerales`, `getContratosPorDatosGenerales`, `getDomicilio`, etc. | Readings | Address-based searches. |
| Meter catalog: `getCalibres`, `getMarcasYModelos` | Work Orders | Meter reference data. |

**Outcome:** Near-complete API coverage for all non-admin, non-schema-only operations.

---

## Effort Estimates by Tier

| Tier | Operations | Estimated Total Effort | Avg per Operation | Notes |
|------|:---------:|:---------------------:|:-----------------:|-------|
| Tier 1 (Critical) | 19 | 6-8 weeks | S-M | Mostly reads; 5 payment ops need extra testing |
| Tier 2 (Important) | 25 | 5-7 weeks | S | Mostly reads + a few write operations |
| Tier 3 (Nice-to-have) | 30 | 4-6 weeks | S | Simple reads and alternative lookup paths |
| Tier 4 (Low priority) | 35 | 3-5 weeks | S | Catalogs, admin, duplicates; integrate opportunistically |
| **Total** | **109** | **18-26 weeks** | -- | Assumes 1 developer; parallelizable |

### Effort Size Definitions

| Size | Description | Typical Time |
|------|-------------|-------------|
| **S** | Read-only, simple params, no auth, existing patterns in `cea.js` | 1-2 days |
| **M** | Write operation, requires auth, complex DTO, or needs UI changes | 3-5 days |
| **L** | New workflow, cross-service coordination, significant UI, testing | 1-2 weeks |

---

## Recommendations

### HIGH Priority Recommendations

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| R1 | **Integrate the payment pipeline immediately** (`getImpagadosContrato` -> `getDocumentoPago` -> `cobrarReferencia` -> `cancelarReferencia`). This is the single highest-impact gap. Every customer payment inquiry requires agents to switch systems. | Revenue collection, agent efficiency, customer satisfaction | M (4-6 weeks for the complete chain) |
| R2 | **Add customer identification by NIF** (`getContratosPorNif`, `getTitularPorNif`, `getTitulares`). The current requirement that agents must already know the contract number is the most friction-generating gap in daily operations. | Agent efficiency, call handling time | S (1 week) |
| R3 | **Enable work order monitoring** (`refreshData`, `getDocumentoOrdenTrabajo`). Orders are created but then invisible in AGORA. Field crews and customers cannot get WO PDFs. | Operational visibility, field crew support | S (1 week) |
| R4 | **Escalate Schema-Only operations with CEA.** Five critical contract lifecycle operations (`solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudAcometida`, `solicitudSubrogacionContrato`) are only schema-defined. CEA must implement them before AGORA can integrate. This is a strategic blocker. | Contract lifecycle automation | N/A (dependency on CEA) |
| R5 | **Integrate detailed debt views** (`getDeudaTotalConFacturas`, `getDeudaContrato`, `getContratoPorContratoConDeuda`). The current `getDeuda` only provides a summary. Agents need invoice-level debt detail for dispute resolution and payment processing. | Debt visibility, dispute resolution | S (1 week) |

### MEDIUM Priority Recommendations

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| R6 | **Add address and bank detail change operations.** `cambiarDireccionCorrespondencia` and `cambiarDomiciliacionBancaria` are among the most common customer requests. | Customer service completion rate | M (2 weeks) |
| R7 | **Implement meter detail and history lookups** (`getContador`, `getCambiosContadorDeContrato`). These are essential for meter-related tickets and work order context. | Ticket resolution quality | S (1 week) |
| R8 | **Make order type/motive catalogs dynamic** (`getTiposOrden`, `getMotivosOrden`). Currently hardcoded in AGORA -- if CEA adds new order types, AGORA will not see them. | Maintainability, data accuracy | S (3 days) |
| R9 | **Add meter reading submission** (`solicitudIntroduccionLectura`). Enables customers to submit readings through AGORA chatbot or agent interface. | Customer self-service | M (1 week) |
| R10 | **Implement contract action history** (`consultaHistoricoActuacionesContrato`, `getActuaciones`). Needed for auditing and dispute resolution. | Compliance, dispute handling | S (1 week) |

### LOW Priority Recommendations

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| R11 | **Integrate geographic catalogs only as needed.** The 7+ geographic catalog operations should only be integrated when address change features are built, as validation dependencies. | Data quality for address changes | S (as part of address change feature) |
| R12 | **Integrate bank reference data only as needed.** The 5 bank lookup operations should be integrated alongside bank detail change features. | Data quality for bank changes | S (as part of bank change feature) |
| R13 | **Add invoice search alternatives** (`getContratosByNumFactNumContrato`, `getFacturasContrato`, `getFacturasPorCondiciones`). Useful but agents can work around via existing contract search. | Incremental search improvement | S (1 week total) |
| R14 | **Do not integrate print queue operations** (`getImpresionesLocalesPendientes`, `getPDFImpresionLocalPendiente`). These serve a local print management workflow that does not fit the AGORA use case. | None | N/A (skip) |
| R15 | **Do not integrate IVR reading submission** (`solicitudIntroduccionLecturaIVR`). This is for the IVR telephone channel, not the AGORA platform. | None | N/A (skip) |

---

## Strategic Blockers

These are operations or conditions that, if addressed, would unlock significant further integration.

| Blocker | What It Blocks | Resolution Path |
|---------|---------------|-----------------|
| **Schema-only contract lifecycle ops** (5 ops) | New supply, terminations, holder transfers, subrogation -- the most impactful customer service operations | CEA must implement these in AquaCIS. Recommend formal request with business case. |
| **No customer-to-contract resolution** (NIF lookup) | Every downstream operation depends on having a contract number. Without NIF lookup, agents need contract numbers from external sources. | Integrate `getContratosPorNif` (Tier 1, Week 1). |
| **No payment pipeline** | Revenue collection, the core utility business function, cannot happen in AGORA. | Integrate Debt Management chain (Phase 2, Weeks 4-6). |
| **WS-Security authentication** | Several operations require auth headers. The auth mechanism is already proven for `getContratos`, `getPdfFactura`, `getConsumos`, etc. but each new authenticated operation requires testing. | Auth pattern is established -- not a true blocker, but adds testing overhead per operation. |

---

## Business Process Coverage Assessment

| Business Process | Coverage | Key Missing Operations | Phase to Complete |
|-----------------|----------|----------------------|-------------------|
| **Contract lookup by number** | 100% | -- | Done |
| **Contract lookup by NIF** | 0% | `getContratosPorNif`, `getTitularPorNif` | Phase 1 |
| **View consumption/readings** | 100% | -- | Done |
| **View invoices + PDFs** | 90% | `getFactura` (single detail), `getPdfDocumentoFactura` | Phase 5 |
| **View tariffs** | 70% | `getTarifasVigente`, `getConceptoConTarifasDeContrato` | Phase 5 |
| **View debt summary** | 50% | `getDeudaTotalConFacturas`, `getImpagadosContrato` | Phase 1 |
| **Process payments** | 0% | Full Debt pipeline (6 operations) | Phase 2 |
| **Create work orders** | 100% | -- | Done |
| **Monitor work orders** | 0% | `refreshData`, `getDocumentoOrdenTrabajo` | Phase 3 |
| **Close work orders** | 100% | -- | Done |
| **Change customer address** | 0% | `cambiarDireccionCorrespondencia` + catalogs | Phase 4 |
| **Change bank details** | 0% | `cambiarDomiciliacionBancaria` + bank catalogs | Phase 4 |
| **Change notification prefs** | 60% | `cambiarMovilNotificacionContrato` | Phase 4 |
| **New supply request** | 0% | `solicitudAltaSuministro` (SCHEMA ONLY) | Blocked by CEA |
| **Contract transfer** | 0% | `solicitudCambioTitularContrato` (SCHEMA ONLY) | Blocked by CEA |
| **Contract termination** | 0% | `solicitudBajaSuministro` (SCHEMA ONLY) | Blocked by CEA |
| **Submit meter reading** | 0% | `solicitudIntroduccionLectura` | Phase 4 |
| **View meter details** | 0% | `getContador`, `getCambiosContadorDeContrato` | Phase 3 |
| **View contract history** | 0% | `consultaHistoricoActuacionesContrato`, `getActuaciones` | Phase 3 |
| **Customer identity verification** | 0% | `esTitular`, `getTitularPorNif` | Phase 1/2 |

---

## Overall API Coverage Health Score

| Dimension | Score (1-10) | Notes |
|-----------|:---:|-------|
| Core data retrieval (contracts, consumption, readings, invoices) | 7 | Strong. Key lookup and display operations integrated. |
| Revenue operations (debt, payments, collections) | 1 | Only summary debt query. Zero payment processing. |
| Work order lifecycle | 6 | Creation + visits + resolution integrated; monitoring missing. |
| Customer identity resolution | 2 | Contract number required; no NIF/address-based lookup. |
| Customer self-service changes | 3 | Email and invoice type changes only; no address, bank, or mobile. |
| Contract lifecycle management | 0 | No new supply, no transfers, no terminations (schema-only). |
| Meter management | 3 | Service point lookup only; no meter detail or history. |
| Reference data / catalogs | 2 | Billing concepts only; no geographic, bank, or meter catalogs. |
| **OVERALL** | **3/10** | Core read operations well-covered; write operations and end-to-end processes severely lacking. |

---

## Appendix: Operation Count Summary

| Category | Integrated | Available | Schema Only | Total |
|----------|:---------:|:---------:|:-----------:|:-----:|
| Contracts Service | 4 | 44 | 5 | 53 |
| Debt Management | 1 | 12 | 0 | 13 |
| Meters Service | 1 | 3 | 0 | 4 |
| Readings & Portal | 8 | 39 | 0 | 47 |
| Work Orders | 3 | 6 | 0 | 9 |
| **TOTAL** | **17** | **104** | **5** | **126** |

- **Integrated:** 17 (13.5%)
- **Available for integration:** 104 (82.5%)
- **Blocked (schema only):** 5 (4.0%)

---

*Report generated by Agent B7 (api-gap-analysis) on 2026-02-16*
