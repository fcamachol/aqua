# AquaCIS Integration Roadmap

**Date:** 2026-02-16
**Scope:** Full integration plan for 109 unintegrated SOAP operations across 5 AquaCIS services, plus API modernization track
**Synthesized from:** Division B (API Analysis: B1-B7) and Division C (Research: C2, C4)

---

## 1. Executive Summary

### Current State

AquaCIS exposes **5 SOAP web services with 126 total operations** for CEA Queretaro's water utility management. Today, AGORA integrates only **17 operations (13.5%)** through a Rails passthrough proxy (`cea_proxy_controller.rb`). The remaining **109 operations** (104 available + 5 schema-only/blocked) represent a vast untapped integration surface.

The 17 integrated operations form two functional clusters:
- **Cluster A -- Contract Information & Billing View** (14 operations): Contract lookup, consumption/readings, invoices, tariffs, notification preferences
- **Cluster B -- Work Order Lifecycle** (3 + 1 supporting operations): Create-Visit-Resolve chain with meter-based service point resolution

**Overall API Coverage Health Score: 3/10** -- Core read operations are covered, but the platform cannot support end-to-end business processes. Every interaction beyond "look up information" or "create a work order" requires manual intervention in the legacy AquaCIS interface.

### Target State

**86.5% coverage (109 additional operations)** delivered across 5 phases over 20 weeks, with a parallel API modernization track transforming the architecture from a passthrough SOAP proxy to a proper Backend-for-Frontend (BFF) REST layer.

| Metric | Current | After Phase 5 |
|--------|:-------:|:-------------:|
| Integrated operations | 17 (13.5%) | 90+ (71%+) |
| Payment processing | 0% | 100% |
| Customer identification | Contract number only | NIF, invoice number, address |
| Work order visibility | Create only | Full lifecycle query |
| Self-service changes | Email + invoice type | Address, bank, mobile, readings |
| Architecture score | 4/10 | 7/10 |

### Timeline Overview

| Phase | Weeks | Focus | Operations Added | Cumulative |
|-------|:-----:|-------|:----------------:|:----------:|
| Phase 1: Foundation | 1-4 | Customer ID, debt visibility, critical reads | ~19 | 36 |
| Phase 2: Payments | 5-8 | Payment processing, references, CFDI | ~12 | 48 |
| Phase 3: Work Orders + Meters | 9-12 | Field operations, meter lifecycle | ~11 | 59 |
| Phase 4: Self-Service | 13-16 | Portal operations, notifications | ~15 | 74 |
| Phase 5: Advanced | 17-20 | Contract lifecycle, bulk ops, reporting | ~16+ | 90+ |
| Modernization Track | 1-20 (parallel) | SOAP-to-REST migration | -- | -- |

---

## 2. Current Integration Map

### What the 17 Integrated Operations Enable Today

#### Cluster A: Contract Information & Billing View (14 operations)

| # | Operation | Service | Purpose |
|---|-----------|---------|---------|
| 1 | `consultaDetalleContrato` | Contracts | Full contract detail; extracts `numeroContador` for work order flow |
| 2 | `getContrato` | Contracts | Contract lookup with configurable options |
| 3 | `getContratos` | Contracts | Multi-criteria contract search (WS-Security) |
| 4 | `getPdfFactura` | Contracts | Invoice PDF download as base64 (WS-Security) |
| 5 | `getDeuda` | Debt | Debt summary by identifier (aggregate only) |
| 6 | `cambiarEmailNotificacionPersona` | Readings | Update customer notification email |
| 7 | `cambiarPersonaNotificacionContrato` | Readings | Change notification contact person (WS-Security) |
| 8 | `cambiarTipoFacturaContrato` | Readings | Switch between paper/digital invoicing (WS-Security) |
| 9 | `getConceptos` | Readings | Billing concepts catalog |
| 10 | `getConsumos` | Readings | Consumption data per contract (WS-Security) |
| 11 | `getConsumosParaGraficas` | Readings | Chart-formatted consumption data |
| 12 | `getFacturas` | Readings | Invoice list per contract (WS-Security) |
| 13 | `getLecturas` | Readings | Meter readings history (WS-Security) |
| 14 | `getTarifaDeAguaPorContrato` | Readings | Water tariff for a contract |

**Enables:** Agents can look up any contract, view consumption/readings/invoices, check applied tariffs, see billing concepts, view debt summary, download invoice PDFs, and update email/notification/invoice preferences.

#### Cluster B: Work Order Lifecycle (3 + 1 supporting)

| # | Operation | Service | Purpose |
|---|-----------|---------|---------|
| 15 | `getPuntoServicioPorContador` | Meters | Service point ID resolution (mandatory for work orders) |
| 16 | `crearOrdenTrabajo` | Work Orders | Create work order in AquaCIS |
| 17 | `informarVisita` | Work Orders | Log field visit to a work order |
| 18 | `resolveOT` | Work Orders | Close/resolve a work order with meter/equipment data |

**Enables:** Complete work order lifecycle from creation through field visits to resolution. The critical cross-service dependency (Contracts -> Meters -> Work Orders via `idPtoServicio`) is handled.

---

## 3. Gap Impact Analysis

### What Is Impossible or Manual Due to Missing Integrations

#### CRITICAL Gaps (Business-Blocking)

| Gap | Impact | Missing Operations |
|-----|--------|-------------------|
| **No payment processing** | Agents must leave AGORA to process any payment. Online payment is impossible. Customers calling about paying bills cannot be helped end-to-end. | `getImpagadosContrato`, `getDocumentoPago`, `cobrarReferencia`, `cobrarReferenciaFrmPago`, `avisarPago`, `cancelarReferencia` |
| **No detailed debt visibility** | `getDeuda` provides only aggregate totals. Agents cannot see which specific invoices are unpaid, their amounts, or due dates. | `getDeudaTotalConFacturas`, `getImpagadosContrato`, `getContratosPorNifconDeuda` |
| **No contract lifecycle management** | New supply requests, contract transfers, terminations cannot be initiated from AGORA. 5 critical operations exist only as XSD schema definitions but are NOT exposed in the WSDL portType. | `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudAcometida`, `solicitudSubrogacionContrato` (all SCHEMA-ONLY) |

#### HIGH Gaps (Significant Manual Workarounds)

| Gap | Impact | Missing Operations |
|-----|--------|-------------------|
| **No customer search by NIF** | Agents must already know the contract number. Cannot resolve "I'm Juan Perez, RFC XAXX010101000" to their contracts. | `getContratosPorNif`, `getTitularPorNif`, `getTitulares` |
| **No work order query after creation** | Orders are created but then invisible in AGORA. No PDF generation for field crews or customers. | `refreshData`, `multipleRefreshData`, `getDocumentoOrdenTrabajo` |
| **No address/bank detail changes** | Among the most common customer requests. Agents must use legacy AquaCIS. | `cambiarDireccionCorrespondencia`, `cambiarDomiciliacionBancaria`, `cambiarSenasCobroBancarias` |
| **No meter detail or history** | Cannot view meter specs or change history. Essential for meter-related complaints and work order context. | `getContador`, `getCambiosContadorDeContrato` |
| **No contract action history** | Cannot see past actions on a contract, limiting dispute resolution and audit trails. | `consultaHistoricoActuacionesContrato`, `getActuaciones` |
| **No collection block awareness** | No way to detect if a contract's collection is blocked before processing payments. | `getDeudaContratoBloqueoCobro` |

#### MEDIUM Gaps (Incremental Efficiency Loss)

| Gap | Impact | Missing Operations |
|-----|--------|-------------------|
| No meter reading submission | Customers cannot submit readings through AGORA. | `solicitudIntroduccionLectura` |
| No mobile notification management | SMS notification updates not supported despite email being available. | `cambiarMovilNotificacionContrato` |
| No invoice-level tariff breakdown | Cannot answer "why is my bill this amount?" with tariff detail. | `getConceptoConTarifasDeContrato`, `getConceptoConTarifasDeFactura` |
| No dynamic order catalogs | Order types and motives are hardcoded rather than fetched from AquaCIS. | `getTiposOrden`, `getMotivosOrden` |
| No invoice search by number | Customer with invoice number but no contract number cannot be helped. | `getContratosByNumFactNumContrato` |

---

## 4. Priority Matrix

### All 109 Unintegrated Operations Ranked

#### CRITICAL Business Value (19 operations)

| Rank | Operation | Service | Effort | Dependencies | Phase |
|------|-----------|---------|:------:|-------------|:-----:|
| 1 | `getContratosPorNif` | Readings | S | None | 1 |
| 2 | `getTitularPorNif` | Readings | S | None | 1 |
| 3 | `getTitulares` | Readings | S | None | 1 |
| 4 | `getTitularPorContrato` | Readings | S | None | 1 |
| 5 | `getDeudaTotalConFacturas` | Debt | S | None | 1 |
| 6 | `getImpagadosContrato` | Debt | S | None -- but prerequisite for `getDocumentoPago` | 1 |
| 7 | `getDeudaContratoBloqueoCobro` | Debt | S | Must precede payment ops | 1 |
| 8 | `refreshData` | Work Orders | S | Needs `otClassID` + `operationalSiteID` (known bug fix) | 1 |
| 9 | `getDocumentoOrdenTrabajo` | Work Orders | S | Needs order code | 1 |
| 10 | `getContador` | Meters | S | None -- uses meter serial already available | 1 |
| 11 | `getDocumentoPago` | Debt | M | Requires `getImpagadosContrato` output | 2 |
| 12 | `cobrarReferenciaFrmPago` | Debt | M | Requires `getDocumentoPago` reference + `getDeudaContratoBloqueoCobro` check | 2 |
| 13 | `cobrarReferencia` | Debt | M | Same as above (simpler variant) | 2 |
| 14 | `avisarPago` | Debt | S | Requires `documentoPago` from `getDeuda` | 2 |
| 15 | `cancelarReferencia` | Debt | S | Requires active payment reference | 2 |
| 16 | `consultaHistoricoActuacionesContrato` | Contracts | S | None | 1 |
| 17 | `getActuaciones` | Readings | S | None | 1 |
| 18 | `getCambiosContadorDeContrato` | Meters | S | Needs contract number | 1 |
| 19 | `getContratosByNumFactNumContrato` | Contracts | S | None | 1 |

#### HIGH Business Value (25 operations)

| Rank | Operation | Service | Effort | Dependencies | Phase |
|------|-----------|---------|:------:|-------------|:-----:|
| 20 | `getDeudaContrato` | Debt | S | None | 2 |
| 21 | `getContratoPorContratoConDeuda` | Debt | S | None | 2 |
| 22 | `getContratosPorNifconDeuda` | Debt | S | None | 2 |
| 23 | `getDocumentoPagoXML` | Debt | S | Same as `getDocumentoPago` | 2 |
| 24 | `cobrarReferenciaFrmPago` | Debt | M | (if `cobrarReferencia` already done) | 2 |
| 25 | `multipleRefreshData` | Work Orders | S | Shares OT parsing with `refreshData` | 3 |
| 26 | `getFacturasContrato` | Contracts | S | None | 3 |
| 27 | `getFacturas` (Contracts) | Contracts | S | None | 3 |
| 28 | `getPdfDocumentoFactura` | Contracts | S | None | 3 |
| 29 | `cambiarDireccionCorrespondencia` | Readings | M | May need geographic catalogs | 4 |
| 30 | `cambiarDomiciliacionBancaria` | Readings | M | May need bank reference data | 4 |
| 31 | `cambiarMovilNotificacionContrato` | Readings | S | None | 4 |
| 32 | `solicitudIntroduccionLectura` | Contracts | M | Needs contract number | 4 |
| 33 | `esTitular` | Contracts | S | None -- security enabler | 3 |
| 34 | `getTiposOrden` | Contracts | S | None -- catalog operation | 3 |
| 35 | `getMotivosOrden` | Contracts | S | Needs `tipoOrden` from `getTiposOrden` | 3 |
| 36 | `recuperaOrdenesServicio` | Contracts | S | None | 3 |
| 37 | `cambiarSenasCobroBancarias` | Contracts | M | Bank data, high risk | 4 |
| 38 | `cambiarDomicilioNotificaciones` | Contracts | M | Needs address DTOs | 4 |
| 39 | `solicitudModificacionDatosPersonales` | Contracts | M | 17 parameters, high risk | 4 |
| 40 | `getConceptoConTarifasDeContrato` | Readings | S | None | 3 |
| 41 | `getTarifasVigente` | Readings | S | None | 3 |
| 42 | `getFactura` | Readings | S | None | 3 |
| 43 | `getDomicilio` | Readings | S | None | 4 |
| 44 | `getNumeroCuentaBancaria` | Readings | S | None -- read-only | 4 |

#### MEDIUM Business Value (30 operations)

| Rank | Operation | Service | Effort | Phase |
|------|-----------|---------|:------:|:-----:|
| 45 | `esPSContratable` | Contracts | S | 5 |
| 46 | `consultaHistoricoConsumoContrato` | Contracts | S | 5 |
| 47 | `getConsumos` (Contracts) | Contracts | S | 5 |
| 48 | `crearOrdenServicio` | Contracts | M | 5 |
| 49 | `registrarContactoManual` | Contracts | S | 5 |
| 50 | `getIDPersonaContrato` | Contracts | S | 5 |
| 51 | `getPersonaList` | Contracts | S | 5 |
| 52 | `solicitudActivacionFacturaOnline` | Contracts | S | 5 |
| 53 | `getFacturaE` | Contracts | S | 5 |
| 54 | `getFacturasPorCondiciones` | Contracts | M | 5 |
| 55 | `getFacturasContratoReferencia` | Contracts | S | 5 |
| 56 | `recuperaFacturasByIds` | Contracts | S | 5 |
| 57 | `countFacturasContrato` | Contracts | S | 5 |
| 58 | `consultaDocumentacionContrato` | Contracts | S | 5 |
| 59 | `consultaDocumentacionTramite` | Contracts | M | 5 |
| 60 | `consultaLiquidacionTramite` | Contracts | M | 5 |
| 61 | `solicitudFacturaEnQuejaActiva` | Contracts | S | 5 |
| 62 | `getPdfMandato` | Contracts | S | 5 |
| 63 | `actualizarContador` | Meters | M | 5 |
| 64 | `getContratosPorNie_crn` | Readings | S | 4 |
| 65 | `getTitularPorNie_crn` | Readings | S | 4 |
| 66 | `getContrato` (Readings) | Readings | S | 4 |
| 67 | `getContratoPorDatosGenerales` | Readings | S | 4 |
| 68 | `getContratosPorDatosGenerales` | Readings | M | 4 |
| 69 | `getConceptoConTarifasDeFactura` | Readings | S | 4 |
| 70 | `getUltimoMensaje` | Readings | S | 4 |
| 71 | `getLecturasParaGraficas` | Readings | S | 3 |
| 72 | `getDomiciliosContratados` | Readings | S | 5 |
| 73 | `getDomiciliosPendientesContratar` | Readings | S | 5 |
| 74 | `crearOrdenExterna` | Work Orders | M | 5 |

#### LOW Business Value (35 operations)

| Rank | Operation | Service | Effort | Phase |
|------|-----------|---------|:------:|:-----:|
| 75-79 | Geographic catalogs: `getCallesPorPatron`, `getComunidadesDePais`, `getLocalidadesDePoblacion`, `getPaises`, `getPoblacionesDeProvincia`, `getProvincia`, `getProvinciasDeComunidad` | Readings | S each | 5 |
| 80-84 | Bank reference: `getAgencias`, `getBanco`, `getBancosPorDescripcion`, `getBancoPorExplotacionCodigo`, `getBancosPorExplotacionDescripcion` | Readings | S each | 5 |
| 85-86 | Print queue: `getImpresionesLocalesPendientes`, `getPDFImpresionLocalPendiente` | Contracts | S | Skip |
| 87-88 | Admin config: `cambiarUrlOficinaVirtualExplotacion`, `cambiarUrlOficinaVirtualSociedad` | Readings | S | Skip |
| 89 | `getIdiomaExplotacion` | Readings | S | Skip |
| 90-91 | WO catalogs: `getCalibres`, `getMarcasYModelos` | Work Orders | S | 5 |
| 92 | `getValidacionVerFactura` | Contracts | S | 5 |
| 93 | `solicitudIntroduccionLecturaIVR` | Contracts | S | Skip |
| 94 | `solicitudAltaServiAlerta` | Contracts | S | 5 |
| 95 | `solicitudModificacionServiAlertaMasiva` | Contracts | S | 5 |
| 96 | `consultaHistoricoDomiciliacion` | Contracts | S | 5 |
| 97 | `getCierresByIdsContrato` | Contracts | S | 5 |
| 98 | `getClienteListByExplotacion` | Contracts | S | 5 |
| 99 | `getExplotacionesUsuario` | Contracts | S | 5 |
| 100 | `solicitudCambioDomiciliacionBancaria` | Contracts | M | 5 |
| 101 | `solicitudCambioDomicilioNotificaciones` | Contracts | M | 5 |
| 102 | `solicitudFacturasMasiva` | Contracts | M | 5 |

#### NOT INTEGRABLE -- Schema-Only (5 operations)

| Operation | Business Value | Status |
|-----------|:-------------:|--------|
| `solicitudAcometida` | CRITICAL | **BLOCKED** -- XSD schema defined but NOT in WSDL portType |
| `solicitudAltaSuministro` | CRITICAL | **BLOCKED** -- cannot be called via SOAP |
| `solicitudBajaSuministro` | CRITICAL | **BLOCKED** -- requires CEA to enable server-side |
| `solicitudCambioTitularContrato` | CRITICAL | **BLOCKED** -- requires CEA to enable server-side |
| `solicitudSubrogacionContrato` | HIGH | **BLOCKED** -- requires CEA to enable server-side |

**Action Required:** Formally engage CEA Queretaro / Aqualia/Agbar to enable these 5 operations. They represent the complete contract lifecycle (new supply, termination, ownership transfer) and are the highest-value blocked capability.

---

## 5. Phase 1: Foundation (Weeks 1-4)

### Goal
Enable agents to identify customers by NIF, see detailed debt with invoice breakdown, view work order status, and access meter details. This phase eliminates the two most painful daily friction points: (1) needing the contract number to start any interaction, and (2) zero visibility into work orders after creation.

### Week 1: Customer Identification

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `getContratosPorNif` | Readings | `nif`, `idioma` | None | **Highest-value quick win.** Returns all contracts for a NIF. Unlocks customer identification flow. |
| `getTitularPorNif` | Readings | `nif` | None | Returns holder data. Complements NIF lookup. |
| `getTitulares` | Readings | Multi-criteria | None | Search by name/NIF/address. Admin/agent use case. |
| `getTitularPorContrato` | Readings | `explotacion`, `contrato` | None | Get holder details for identity verification. |

**Dependency chain enabled:**
```
Customer provides NIF
  --> getContratosPorNif(nif) --> returns contract list
    --> getTitularPorContrato(contrato) --> verify identity
      --> consultaDetalleContrato(contrato) [EXISTING] --> full detail
        --> (any downstream operation)
```

### Week 2: Detailed Debt Visibility

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `getDeudaTotalConFacturas` | Debt | `contrato`, `referenciaCatastral`, `explotacion`, `idioma` | None | Invoice-level debt breakdown with per-invoice `referenciaPago`. **Critical** for itemized billing. |
| `getImpagadosContrato` | Debt | `contrato`, `nif`, `idioma` | None | Returns `facturasPendientesDTO[]` + `plazosPagoPendientesDTO[]` + `saldoCuentaDTO`. **Prerequisite for payment document generation in Phase 2.** |
| `getDeudaContratoBloqueoCobro` | Debt | `tipoIdentificador`, `valor`, `explotacion`, `idioma` | None | Returns `bloquearCobro` boolean. **Safety check before any payment processing.** |
| `getContratosPorNifconDeuda` | Debt | `nif`, `idioma`, `sociedadGestora` | None | All contracts with debt for a customer. Multi-property holder view. |

**Important:** Handle the `reultado` typo (missing 's') in `getDeudaContrato` and `getDeudaContratoBloqueoCobro` responses. Build a normalizer:
```javascript
function extractResultado(response) {
  return response.resultado || response.reultado || { codigoError: -1, descripcionError: 'No result found' };
}
```

### Week 3: Work Order Monitoring + Contract History

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `refreshData` | Work Orders | `OTRequest` (otOriginID, otClassID, operationalSiteID) | None | **Single most valuable unintegrated operation.** Returns full order context including meter elements, readings, unpaid bills, customer debt, and comments. Fix known bugs: set `otClassID=1` and populate `operationalSiteID`. |
| `getDocumentoOrdenTrabajo` | Work Orders | `ordenes[]` (codOrden + observaciones) | None | PDF generation for work orders. Base64 response. **Note:** Uses PascalCase `ResultadoDTO` with `codigoError` as `string`, not `int`. |
| `consultaHistoricoActuacionesContrato` | Contracts | `contrato`, `explotacion`, `idioma`, pagination | None | Contract action audit trail. Paginated. |
| `getActuaciones` | Readings | `explotacion`, `contrato`, `idioma` | None | Service intervention history per contract. |

### Week 4: Meter Details + Supplementary Reads

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `getContador` | Meters | `serialNumber` | None | Meter detail: brand, model, caliber, year, damage flag, installation/removal dates, `idPuntoServicio` (reverse lookup). Only 1 param. |
| `getCambiosContadorDeContrato` | Meters | `idContrato`, `idioma` | None | Meter change history timeline with contractor info. Essential for consumption dispute resolution after meter replacement. |
| `getContratosByNumFactNumContrato` | Contracts | Invoice or contract number | None | Find contract by invoice number. Common customer scenario. IVR-focused DTO but useful for quick lookup. |
| `getContratoPorContratoConDeuda` | Debt | `contrato`, `explotacion`, `idioma`, `sociedad` | None | Rich single-contract debt view with pending invoices, installments, and `procesoImpagadoSN` flag. |
| `getDeudaContrato` | Debt | `tipoIdentificador`, `valor`, `explotacion`, `idioma` | None | Lighter contract-level debt query. |

### Phase 1 Outcome

- Agents can identify any customer by NIF and see all their contracts
- Detailed debt visibility with per-invoice breakdown replaces summary-only view
- Work orders are queryable post-creation with full context (meter, readings, debt, comments)
- Work order PDFs can be generated for field crews and customers
- Meter details and change history are accessible
- Contract action audit trails are visible
- **Estimated effort: 2-3 developer-weeks** (all S-effort read operations with established patterns)

---

## 6. Phase 2: Payments (Weeks 5-8)

### Goal
Enable end-to-end payment collection from within AGORA. This is the single highest-impact gap: every customer payment inquiry currently requires agents to switch systems.

### Week 5: Payment Document Generation

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `getDocumentoPago` | Debt | `contrato`, `nif`, `idioma`, `docs` (documentosImpresionDTO) | None | Generates PDF payment slip with barcode reference. Returns `referencia` + `rafagaPago` + base64 PDF. The PDF is what customers take to banks/OXXO/7-Eleven. |
| `getDocumentoPagoXML` | Debt | Same as above | None | XML variant for CFDI pipeline and programmatic processing. |

**Dependency chain:**
```
getImpagadosContrato [Phase 1]
  --> returns facturasPendientesDTO[] + plazosPagoPendientesDTO[]
    --> Customer/agent selects invoices to pay
      --> getDocumentoPago(contrato, nif, idioma, selectedDocs)
        --> returns: referencia (barcode), rafagaPago, PDF
```

### Week 6: Payment Collection

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `cobrarReferenciaFrmPago` | Debt | `referencia`, `importe`, `datosCobroFrmPagoDTO`, `idioma` | None | **Primary payment collection.** Preferred over `cobrarReferencia` because it captures cash/card distinction (`efectivoTarjeta`). |
| `cobrarReferencia` | Debt | `referencia`, `importe`, `datosCobroDTO`, `idioma` | None | Standard payment collection without cash/card flag. Needed for backward compatibility. |

**CRITICAL safeguards required:**
1. **Always check `bloquearCobro`** via `getDeudaContratoBloqueoCobro` before processing
2. **Idempotency tokens** to prevent double collection
3. **Transaction logging** before AND after the SOAP call
4. **Amount validation** against reference amount
5. **Staged rollout:** Internal agents only first, then customer self-service

### Week 7: Payment Notifications + Cancellation

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `avisarPago` | Debt | `documentoPago`, `entidad`, `importe`, `idioma` | None | Soft payment notification for external channels (online gateways, bank transfers). Uses `documentoPago` reference from `getDeuda`. |
| `cancelarReferencia` | Debt | `referencia`, `idioma` | None | Invalidates a payment reference. Essential when documents expire, amounts change, or references are created in error. Without this, orphaned references accumulate. |

### Week 8: Extended Debt Views + Testing

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| Integration testing for full payment pipeline | -- | -- | -- | End-to-end testing: debt query -> document generation -> collection -> cancellation |
| Error handling hardening | -- | -- | -- | Handle `ResultadoDTO` errors, SOAP faults, network timeouts, and partial failures |

**Complete payment flow after Phase 2:**
```
1. getDeuda [EXISTING] --> summary view
2. getDeudaTotalConFacturas [Phase 1] --> invoice breakdown
3. getImpagadosContrato [Phase 1] --> selectable unpaid invoices
4. getDeudaContratoBloqueoCobro [Phase 1] --> safety check
5. getDocumentoPago [Phase 2] --> PDF + reference
6. cobrarReferenciaFrmPago [Phase 2] --> collect payment
   OR avisarPago [Phase 2] --> notify external payment
   OR cancelarReferencia [Phase 2] --> cancel reference
```

### CFDI Integration Notes

The Debt Management service provides data inputs for Mexico's mandatory CFDI (Comprobante Fiscal Digital por Internet) pipeline:

| CFDI Requirement | Source in Debt Management |
|-----------------|---------------------------|
| RFC (Tax ID) | `nif` from `datosCobroDTO` or contract data |
| Invoice Amount | `importeTotal` from `facturasPendientesDTO` |
| Tax Amount | `impuestos` from `facturasPendientesDTO` |
| Payment Date | `fechaPago` from `datosCobroDTO` |
| Payment Method | `efectivoTarjeta` from `datosCobroFrmPagoDTO` |
| Payment Reference | `referencia` from payment operations |

The `getDocumentoPagoXML` operation produces structured XML for CFDI generation. The `URL` field on `facturasPendientesDTO` may link to existing CFDI documents. Preserve all fiscal identifiers unchanged through the integration layer.

### Phase 2 Outcome

- Complete payment cycle: view debt -> generate payment slip -> collect payment -> cancel if needed
- Revenue-critical capability restored to AGORA
- CFDI data pipeline enabled via XML document generation
- **Estimated effort: 4-5 developer-weeks** (payment operations require careful error handling, idempotency, and financial safeguards)

---

## 7. Phase 3: Work Orders + Meters (Weeks 9-12)

### Goal
Close the work order visibility gap with batch queries, enable meter management, and make order catalogs dynamic.

### Week 9: Work Order Batch Queries + Catalogs

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `multipleRefreshData` | Work Orders | Array of `OTRequest` | None | Batch query for dashboard loading and mobile sync. Once `refreshData` OT parsing is done (Phase 1), this is trivial. |
| `getTiposOrden` | Contracts | `explotacion`, `login`, `idioma` | None | Dynamic order type catalog. Replace hardcoded values (6, 21, 23, 32, 33). |
| `getMotivosOrden` | Contracts | `explotacion`, `tipoOrden`, `login`, `idioma` | None | Dynamic order motive catalog. Depends on selected `tipoOrden`. |

### Week 10: Invoice Enhancement + Tariffs

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `getFacturasContrato` | Contracts | `contrato`, date range, pagination | None | Paginated invoice list. Uses `registroInicial` + `registroTotal` pagination. |
| `getFactura` | Readings | `explotacion`, invoice number, `idioma` | None | Single invoice detail drill-down. Completes billing workflow. |
| `getPdfDocumentoFactura` | Contracts | Document ID | None | Alternative invoice PDF by document ID. |
| `getConceptoConTarifasDeContrato` | Readings | `explotacion`, `contrato`, `idioma` | None | Bill explanation: "Why is my bill this amount?" Maps tariff sub-concepts to charges. |
| `getTarifasVigente` | Readings | `explotacion`, `tipoConcepto`, `idioma` | None | Full active tariff schedule for transparency. |

### Week 11: Service Order Management + Identity

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `recuperaOrdenesServicio` | Contracts | Service order IDs | None | Retrieve service orders by IDs. Status tracking. |
| `esTitular` | Contracts | `documento`, `numeroContrato` | None | Identity verification (2 params, boolean result). Security enabler for write operations. |
| `getLecturasParaGraficas` | Readings | `explotacion`, `contrato`, `idioma` | None | Completes the chart visualization pair (consumption charts already integrated). |

### Week 12: Leverage Existing Data + Meter Search

| Operation | Notes |
|-----------|-------|
| **Leverage full `getPuntoServicioPorContador` response** | Currently only `id` is extracted. The response contains 37 service point fields, geocoordinates, contract/meter/reading/order arrays. Parse and display: address, zone, sector, cut status (`snCortadoPorDeuda`, `snCortadoPorVencimientoContrato`), map coordinates. **No new API call needed -- data already returned.** |
| **Build meter-centric search** | Use `getContador` (Phase 1) to validate + `getPuntoServicioPorContador` [EXISTING] to resolve. Enables field technicians to search by meter serial number instead of contract number. |

### Phase 3 Outcome

- Work orders are fully visible with batch queries for dashboards
- Order type/motive catalogs are dynamic (no hardcoded values)
- Invoice management is comprehensive (list, detail, PDF, tariff breakdown)
- Service point data is fully utilized (address, geocoordinates, cut status)
- Meter-based search is available for field operations
- **Estimated effort: 3-4 developer-weeks**

---

## 8. Phase 4: Self-Service (Weeks 13-16)

### Goal
Enable agents to process the most common customer change requests without leaving AGORA: address changes, bank detail changes, mobile notifications, meter reading submissions.

### Week 13: Notification Management + Mobile

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `cambiarMovilNotificacionContrato` | Readings | `contrato`, `nif`, `movil`, `usuario` | WS-Security | Natural extension of existing email notification. Given mobile preference in Mexico, SMS may be more valued than email. |
| `getUltimoMensaje` | Readings | `explotacion`, `contrato`, `idioma` | None | Display latest system message to customer. Simple value-add. |
| `getContrato` (Readings) | Readings | `explotacion`, `contrato`, `idioma` | None | Contract details via Readings service (alternative view). |
| `getContratosPorNie_crn` | Readings | `nie_crn`, `idioma` | None | Contract lookup by NIE/CRN identifier. |
| `getTitularPorNie_crn` | Readings | `nie_crn` | None | Holder lookup by NIE/CRN. |

### Week 14: Address Changes

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `cambiarDireccionCorrespondencia` | Readings | 12 params (address components) | None | Correspondence address change. Complex due to address structure. |
| `getDomicilio` | Readings | `explotacion`, `contrato`, `idioma` | None | View service address (prerequisite for change forms). |
| `getContratoPorDatosGenerales` | Readings | Address params | None | Contract lookup by address (single result). |
| `getContratosPorDatosGenerales` | Readings | Address params | None | Multiple contracts at address (multi-unit buildings). |

### Week 15: Banking Changes + Meter Readings

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `cambiarDomiciliacionBancaria` | Readings | Bank details | None | Bank direct debit change. **Requires PCI-DSS considerations and additional security review.** |
| `getNumeroCuentaBancaria` | Readings | `explotacion`, `contrato` | None | View current bank account (read-only, lower risk). |
| `solicitudIntroduccionLectura` | Contracts | `contrato`, readings (4 params) | None | Self-service meter reading submission. Simple write operation with `ResultadoDTO` response. |

### Week 16: Personal Data + Supplementary

| Operation | Service | Params | Auth | Notes |
|-----------|---------|--------|:----:|-------|
| `solicitudModificacionDatosPersonales` | Contracts | 17 params | None | Personal data modification request. **High complexity** due to parameter count. Requires validation. |
| `cambiarSenasCobroBancarias` | Contracts | 14 params + banking data | None | Direct bank details update (Contracts service version). **Very high risk -- financial data.** |
| `cambiarDomicilioNotificaciones` | Contracts | `DireccionNotificacionDTO` | None | Notification address change (Contracts service version). |
| `getConceptoConTarifasDeFactura` | Readings | Invoice-specific params | None | Tariff breakdown for a specific invoice. Dispute resolution aid. |

### Phase 4 Outcome

- Agents can process address changes, bank detail changes, mobile notification updates, and meter reading submissions
- Customer self-service is significantly expanded
- Personal data modification is available (with appropriate authorization controls)
- **Estimated effort: 5-6 developer-weeks** (write operations require extra testing and security review)

---

## 9. Phase 5: Advanced (Weeks 17-20)

### Goal
Fill remaining gaps for near-complete API coverage: contract lifecycle via Contracts WS, bulk operations, catalogs, and reporting support.

### Week 17: Contract Lifecycle via Contracts Service

| Operation | Service | Notes |
|-----------|---------|-------|
| `crearOrdenServicio` | Contracts | Simpler service order creation (5 params vs 12+ for `crearOrdenTrabajo`). **Investigate relationship with Work Orders WS `crearOrdenTrabajo` first.** |
| `esPSContratable` | Contracts | Check if service point can receive a new contract. |
| `consultaHistoricoConsumoContrato` | Contracts | Historical consumption (alternative to Readings service). Paginated. |
| `registrarContactoManual` | Contracts | Log customer contacts in AquaCIS CRM. 7 params. |

### Week 18: Invoice Management Completion

| Operation | Service | Notes |
|-----------|---------|-------|
| `getFacturasPorCondiciones` | Contracts | Advanced invoice search with multiple filter arrays. Complex but powerful. |
| `recuperaFacturasByIds` | Contracts | Batch invoice retrieval by IDs. |
| `countFacturasContrato` | Contracts | Pagination helper for invoice queries. |
| `getFacturaE` | Contracts | Electronic invoice XML (CFDI compliance). |
| `solicitudActivacionFacturaOnline` | Contracts | Toggle online invoicing. Batch-capable. |
| `solicitudFacturaEnQuejaActiva` | Contracts | Invoice complaint flag. |

### Week 19: Documentation + Catalogs

| Operation | Service | Notes |
|-----------|---------|-------|
| `consultaDocumentacionContrato` | Contracts | Contract document list. |
| `consultaDocumentacionTramite` | Contracts | Process documentation. |
| `consultaLiquidacionTramite` | Contracts | Settlement calculation for processes. |
| `getCalibres` | Work Orders | Meter caliber catalog. Supports incremental sync via `fechaDesde`. |
| `getMarcasYModelos` | Work Orders | Meter brands/models catalog. Nested (brands -> models). |
| `actualizarContador` | Meters | Meter metadata correction (brand, model, caliber, year, serial). **Write operation -- requires RBAC.** |

### Week 20: Bulk Operations + Reference Data

| Operation | Service | Notes |
|-----------|---------|-------|
| `crearOrdenExterna` | Work Orders | External order creation from SGO systems. Only if SGO integration is needed. |
| Geographic catalogs (7 ops) | Readings | Bulk import to local database rather than live API calls. Static reference data. |
| Bank reference data (5 ops) | Readings | Integrate alongside banking features. |
| Remaining alert/notification ops | Contracts | `solicitudAltaServiAlerta`, `solicitudModificacionServiAlertaMasiva` |
| Remaining admin/niche ops | Various | Opportunistic integration of any remaining operations. |

### Operations to Skip

| Operation | Reason |
|-----------|--------|
| `getImpresionesLocalesPendientes` | Local print queue management -- does not fit AGORA use case |
| `getPDFImpresionLocalPendiente` | Same as above |
| `solicitudIntroduccionLecturaIVR` | IVR telephone channel, not AGORA |
| `cambiarUrlOficinaVirtualExplotacion` | Admin config with no customer-facing value |
| `cambiarUrlOficinaVirtualSociedad` | Admin config with no customer-facing value |
| `getIdiomaExplotacion` | Language config for single utility -- already known |

### Phase 5 Outcome

- Near-complete API coverage for all non-admin, non-schema-only operations
- Full invoice management suite
- Meter catalog data for field operations
- Contract documentation and settlement calculations
- **Estimated effort: 4-5 developer-weeks**

---

## 10. API Modernization Track (Parallel)

This track runs alongside Phases 1-5, transforming the integration architecture from a passthrough SOAP proxy to a proper BFF REST layer.

### 10.1 Strangler Fig Pattern Application

The recommended migration strategy is the **Strangler Fig pattern** combined with per-service **Adapter classes**:

```
Phase A (Current):     Frontend --SOAP XML--> Rails Proxy --verbatim--> Aquasis
Phase B (Transition):  Frontend --REST JSON--> Rails BFF --SOAP XML--> Aquasis
Phase C (Complete):    Frontend --REST/GQL--> Rails BFF --SOAP XML--> Aquasis
```

**Key principles:**
1. **Never modify the Aquasis SOAP services** -- they are vendor-owned (Agbar/OCCAM)
2. **Keep the v1 proxy running** throughout migration -- never break existing code
3. **Migrate one operation at a time** with feature flags
4. **Each operation can be rolled back independently**
5. **Frontend and backend teams can work in parallel**

### 10.2 REST API Design for Each Service

#### URL Path Versioning Strategy

```
# Current (v1) -- existing SOAP proxy, untouched during migration
/api/v1/cea/soap/InterfazGenericaContratacionWS    --> Raw SOAP proxy

# New (v2) -- REST BFF, migrated operations
/api/v2/aquasis/contracts/:id                       --> consultaDetalleContrato
/api/v2/aquasis/contracts/:id/detail                --> getContrato
/api/v2/aquasis/contracts/search                    --> getContratos
/api/v2/aquasis/contracts/:id/invoices              --> getFacturasContrato
/api/v2/aquasis/contracts/:id/invoices/:inv/pdf     --> getPdfFactura
/api/v2/aquasis/contracts/:id/consumption           --> consultaHistoricoConsumoContrato
/api/v2/aquasis/contracts/:id/history               --> consultaHistoricoActuacionesContrato
/api/v2/aquasis/contracts/:id/debt                  --> getDeuda
/api/v2/aquasis/contracts/:id/debt/invoices         --> getDeudaTotalConFacturas
/api/v2/aquasis/contracts/:id/debt/unpaid           --> getImpagadosContrato
/api/v2/aquasis/contracts/:id/readings              --> getLecturas
/api/v2/aquasis/contracts/:id/consumption           --> getConsumos
/api/v2/aquasis/contracts/:id/tariff                --> getTarifaDeAguaPorContrato
/api/v2/aquasis/contracts/:id/concepts              --> getConceptos
/api/v2/aquasis/customers/search?nif=...            --> getContratosPorNif
/api/v2/aquasis/customers/:nif                      --> getTitularPorNif
/api/v2/aquasis/meters/:serial                      --> getContador
/api/v2/aquasis/meters/:serial/service-point        --> getPuntoServicioPorContador
/api/v2/aquasis/meters/:serial/changes              --> getCambiosContadorDeContrato
/api/v2/aquasis/work-orders                         --> crearOrdenTrabajo (POST)
/api/v2/aquasis/work-orders/:id                     --> refreshData (GET)
/api/v2/aquasis/work-orders/:id/visits              --> informarVisita (POST)
/api/v2/aquasis/work-orders/:id/resolve             --> resolveOT (PUT)
/api/v2/aquasis/work-orders/:id/pdf                 --> getDocumentoOrdenTrabajo
/api/v2/aquasis/payments/document                   --> getDocumentoPago (POST)
/api/v2/aquasis/payments/collect                    --> cobrarReferenciaFrmPago (POST)
/api/v2/aquasis/payments/notify                     --> avisarPago (POST)
/api/v2/aquasis/payments/cancel                     --> cancelarReferencia (POST)
```

#### REST Response Envelope

```json
{
  "data": {
    "contractNumber": 442761,
    "holder": "GOMEZ FAJARDO, J. PUEBLITO",
    "exploitation": 8,
    "meter": {
      "serialNumber": "10005237",
      "status": "active"
    }
  },
  "meta": {
    "source": "aquasis",
    "cachedAt": null,
    "requestId": "req_abc123"
  }
}
```

#### REST Error Envelope

```json
{
  "error": {
    "code": "AQUASIS_SERVICE_ERROR",
    "message": "Work order creation failed: service point ID is required",
    "details": {
      "soapFaultCode": "soap:Server",
      "soapFaultString": "java.lang.NullPointerException",
      "operation": "crearOrdenTrabajo",
      "service": "InterfazGenericaOrdenesServicioWS"
    }
  }
}
```

### 10.3 Authentication Modernization

**Current state (CRITICAL security issues):**
- WS-Security credentials (`WSGESTIONDEUDA` / `WSGESTIONDEUDA`) exposed in frontend via `VITE_` environment variables
- SOAP XML with embedded credentials built in browser JavaScript
- Anyone with DevTools can extract credentials

**Target state:**
1. **Move credentials to server-side only** -- remove `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD`. Store in Rails `credentials.yml.enc` or server-only environment variables.
2. **SOAP XML construction in Rails** -- use `savon` gem for WS-Security header injection server-side.
3. **Frontend sends clean JSON** -- never touches SOAP XML or credentials.
4. **Per-operation audit logging** -- log user, operation, contract number, timestamp, result.

### 10.4 Technology Stack for BFF

| Component | Technology | Purpose |
|-----------|-----------|---------|
| SOAP Client | `savon` gem (~> 2.14) | WSDL parsing, WS-Security, complex type handling |
| REST Framework | Rails API mode (existing) | Leverage existing AGORA infrastructure |
| Serialization | `jbuilder` or `alba` gem | Response transformation (SOAP DTOs -> clean JSON) |
| API Documentation | `rswag` gem | OpenAPI 3.1 spec generation from RSpec tests |
| Caching | Redis (existing) | Cache catalogs, contract details (5-min TTL), service points (1-hour TTL) |
| Background Jobs | Sidekiq (existing) | Async: bulk invoice requests, PDF generation, payment notifications |
| HTTP Client | `faraday` gem | CEA REST API calls with connection pooling, retry, timeout |
| Circuit Breaker | `stoplight` gem | Prevent cascade failures when Aquasis is down |
| Testing | RSpec + VCR + WebMock | Record/replay SOAP interactions without hitting production |

### 10.5 Migration Priority for BFF Conversion

Start by migrating the **work order creation flow** (highest risk, highest value):

```
Current (3 sequential SOAP calls from frontend):
Vue --> SOAP(consultaDetalleContrato) --> parse XML
    --> SOAP(getPuntoServicioPorContador) --> parse XML
    --> SOAP(crearOrdenTrabajo) --> parse XML

New (1 REST call from frontend):
Vue --> POST /api/v2/aquasis/work-orders
    --> Rails orchestrates all 3 SOAP calls
    --> Returns clean JSON with order code
```

**Benefit:** Multi-step orchestration moves from fragile frontend JavaScript to robust server-side Ruby with proper error handling, retry logic, and transaction management.

---

## 11. Architecture Evolution

### 11.1 Current Architecture: Frontend -> Rails Proxy -> SOAP (Passthrough)

```
+-------------------+     +------------------+     +------------------------+
|   Vue 3 Frontend  | --> |  Rails 7 Backend | --> |  Aquasis SOAP Servers  |
|                   |     |                  |     |                        |
| cea.js            |     | cea_proxy_       |     | 5 SOAP services        |
|  - XML builders   |     |   controller.rb  |     | 126 operations         |
|  - XML parsers    |     |  - HTTParty      |     |                        |
|  - xmlToJson()    |     |  - forwards body |     |                        |
|  - WS-Security    |     |  - returns resp  |     |                        |
|    credentials    |     |  - no validation |     |                        |
+-------------------+     +------------------+     +------------------------+
```

**Problems:** Credentials in browser, SOAP XML in frontend, no validation, no caching, no circuit breaker, no audit logging, tight coupling to WSDL DTOs.

### 11.2 Phase 1 Target: Frontend -> Rails BFF -> SOAP (with validation)

```
+-------------------+     +---------------------------+     +------------------+
|   Vue 3 Frontend  | --> |  Rails 7 BFF              | --> |  Aquasis SOAP    |
|                   |     |                           |     |                  |
| aquasis.js (new)  | REST| Aquasis::BaseClient       | SOAP| 5 services       |
|  - JSON requests  | JSON|  - Savon SOAP client      | XML | 126 operations   |
|  - JSON responses |     |  - WS-Security (server)   |     |                  |
|  - Feature flags  |     |  - Error normalization    |     |                  |
|  - No credentials |     |  - Audit logging          |     |                  |
|  - No XML         |     |  - Response caching       |     |                  |
|                   |     |  - Circuit breaker        |     |                  |
|                   |     |                           |     |                  |
|                   |     | v2 Controllers:           |     |                  |
|                   |     |  contracts_controller.rb  |     |                  |
|                   |     |  work_orders_controller.rb|     |                  |
|                   |     |  meters_controller.rb     |     |                  |
|                   |     |  debt_controller.rb       |     |                  |
|                   |     |  readings_controller.rb   |     |                  |
+-------------------+     +---------------------------+     +------------------+
```

**Improvements:** Credentials server-side only, input validation, response caching, circuit breaker, structured logging, error normalization, clean JSON API contract.

### 11.3 Phase 2 Target: Frontend -> REST API -> Service Layer -> SOAP (decoupled)

```
+-------------------+     +---------------------------+     +------------------+
|   Vue 3 Frontend  | --> |  Rails REST API           | --> |  Aquasis SOAP    |
|                   |     |                           |     |                  |
| TypeScript types  | REST| OpenAPI 3.1 spec          | SOAP|                  |
| from OpenAPI spec | JSON| rswag-generated           | XML |                  |
|                   |     |                           |     |                  |
| GraphQL (optional)| GQL | graphql-ruby (composite   |     |                  |
| for Contract 360  |     |  queries across services) |     |                  |
|                   |     |                           |     |                  |
|                   |     | Service Layer:            |     |                  |
|                   |     |  Aquasis::ContractsService|     |                  |
|                   |     |  Aquasis::DebtService     |     |                  |
|                   |     |  Aquasis::MetersService   |     |                  |
|                   |     |  Aquasis::ReadingsService |     |                  |
|                   |     |  Aquasis::WorkOrdersSvc   |     |                  |
|                   |     |                           |     |                  |
|                   |     | Cross-cutting:            |     |                  |
|                   |     |  Redis caching            |     |                  |
|                   |     |  Circuit breaker          |     |                  |
|                   |     |  Rate limiting            |     |                  |
|                   |     |  APM instrumentation      |     |                  |
+-------------------+     +---------------------------+     +------------------+
```

**Improvements:** Full API contract (OpenAPI), TypeScript types generated from spec, optional GraphQL for composite queries (Contract 360 view), rate limiting, comprehensive APM, frontend fully decoupled from SOAP.

---

## 12. Known Bugs & Workarounds

### Active Bugs Requiring Resolution During Integration

| Bug ID | Severity | Operation | Description | Workaround | Fix During |
|--------|:--------:|-----------|-------------|-----------|:----------:|
| BUG-1 | **CRITICAL** | `crearOrdenTrabajo` | `NullPointerException` when `idPtoServicio` is empty/missing. Server returns unhelpful `java.lang.NullPointerException`. | Always call `getPuntoServicioPorContador` first. Validate `idPtoServicio` is non-null before calling. Block order creation with clear error if service point cannot be resolved. | Phase 1 |
| BUG-2 | **HIGH** | `crearOrdenTrabajo` | Missing WS-Security headers cause 500 error. Identified in design doc `2026-02-13-aquasis-order-fixes-design.md`. | Add WS-Security `UsernameToken` header to all `crearOrdenTrabajo` calls. | Phase 1 |
| BUG-3 | **HIGH** | `refreshData` | Wrong `otClassID` (0 instead of 1) and missing `operationalSiteID` cause "Parametro explotacion no informado" error. | Set `otClassID=1` and populate `operationalSiteID` with the exploitation code. | Phase 1 |
| BUG-4 | **MEDIUM** | Multiple Debt ops | `reultado` typo (missing 's') in `resultadoGetDeuda`, `resultadoGetDeudaContrato`, `resultadoGetDeudaContratoBloqueo` response DTOs. Duplicate result field. | Check `resultado` first, fall back to `reultado`. Never assume only one error field exists. | Phase 1 |
| BUG-5 | **MEDIUM** | `resolveOT` | `otResolutionElements` has `maxOccurs="unbounded"` but no `minOccurs="0"` -- may require at least one element even for non-meter orders. | Include a minimal `OTResolutionElement` or test whether server enforces the constraint. | Phase 3 |
| BUG-6 | **MEDIUM** | `getDocumentoOrdenTrabajo` | Dual `ResultadoDTO` types: PascalCase version has `codigoError` as `string` (not `int`). Code checking `codigoError === 0` will fail. | Type-aware parsing that handles both `int` and `string` error codes. | Phase 1 |
| BUG-7 | **LOW** | `resolveOT` | WSDL typo: `busVHFumberSerie` (missing "N" -- should be `busVHFNumberSerie`). | Use the exact misspelled field name in SOAP requests. Document permanently. | Phase 3 |
| BUG-8 | **LOW** | `resolveOT` | WSDL typo: `vistitComments` (should be `visitComments`). | Use the exact misspelled field name. Document permanently. | Phase 3 |
| BUG-9 | **LOW** | `cambiarEmailNotificacionPersona` | WSDL typo: `emailAntigo` (should be `emailAntiguo`). `cea.js` already handles this. | Use the misspelled name. Document as permanent WSDL quirk. | Phase 4 |

### Architectural Issues to Address

| Issue | Severity | Current State | Resolution | Phase |
|-------|:--------:|-------------|------------|:-----:|
| Client-side SOAP XML construction | CRITICAL | `cea.js` builds SOAP envelopes as JS template literals | Move to Rails BFF with `savon` gem | Modernization |
| Credentials in frontend bundle | CRITICAL | `VITE_CEA_API_USERNAME`/`VITE_CEA_API_PASSWORD` visible in browser | Store in Rails `credentials.yml.enc`, server-side only | Modernization |
| No retry mechanism | HIGH | Single attempt; transient failures are permanent | Circuit breaker (`stoplight` gem) + exponential backoff | Modernization |
| Console-only error logging | HIGH | SOAP errors logged to `console.error()` with no server audit | Structured server-side logging for all operations | Modernization |
| No response caching | HIGH | Every call hits Aquasis live | Redis caching with TTLs by operation type | Modernization |
| Data inconsistency on failure | HIGH | Failed `crearOrdenTrabajo` creates local order WITHOUT `aquasis_order_id` | Block creation on failure; never create local-only orders | Phase 1 |
| No request deduplication | MEDIUM | Multiple agents viewing same contract trigger separate SOAP calls | Shared Redis cache keyed on operation + params | Modernization |
| Tight DTO coupling | MEDIUM | Frontend paths like `meterJson.puntosServicioContadorDTO.PuntosServicioContadorDTO...` | Rails BFF maps DTOs to clean, stable internal format | Modernization |

---

## 13. Effort Estimates

### Per-Phase Staffing and Timeline

| Phase | Duration | Developer-Weeks | Team Size | Notes |
|-------|:--------:|:---------------:|:---------:|-------|
| **Phase 1: Foundation** | 4 weeks | 2-3 | 1-2 devs | Mostly S-effort read operations. Patterns already established. |
| **Phase 2: Payments** | 4 weeks | 4-5 | 2 devs | Payment ops need careful testing, idempotency, financial safeguards. |
| **Phase 3: Work Orders + Meters** | 4 weeks | 3-4 | 1-2 devs | Mix of reads and catalog integrations. |
| **Phase 4: Self-Service** | 4 weeks | 5-6 | 2 devs | Write operations require security review. Banking changes need PCI-DSS consideration. |
| **Phase 5: Advanced** | 4 weeks | 4-5 | 1-2 devs | Remaining operations, catalogs, bulk ops. |
| **Modernization Track** | 20 weeks (parallel) | 8-12 | 1-2 devs | BFF architecture, `savon` migration, caching, circuit breaker. |
| **TOTAL** | 20 weeks | 26-35 | 2-3 devs | Parallelizable across phases and modernization track |

### Effort Size Definitions

| Size | Description | Typical Time |
|------|-------------|:------------:|
| **S** | Read-only, simple params, no auth, existing patterns | 1-2 days |
| **M** | Write operation, requires auth, complex DTO, or needs UI changes | 3-5 days |
| **L** | New workflow, cross-service coordination, significant UI, extensive testing | 1-2 weeks |

### Staffing Recommendation

| Role | Count | Phase Alignment |
|------|:-----:|----------------|
| Senior Backend Developer (Rails) | 1 | Full duration -- BFF architecture, SOAP integration, service objects |
| Full-Stack Developer (Vue + Rails) | 1 | Full duration -- frontend migration, UI components, feature flags |
| QA Engineer (part-time) | 0.5 | Phases 2, 4 -- payment testing, write operation validation |
| DevOps (part-time) | 0.25 | Modernization -- caching setup, monitoring, deployment |

---

## 14. Success Metrics

### KPIs for Each Phase

#### Phase 1: Foundation

| KPI | Target | Measurement |
|-----|--------|-------------|
| Customer lookups by NIF | > 80% of agent lookups use NIF path | API call analytics on `getContratosPorNif` |
| Detailed debt views served | > 500/day (replacing summary-only) | API call count on `getDeudaTotalConFacturas` |
| Work order queries after creation | > 90% of orders are queried within 24h | `refreshData` call rate vs. `crearOrdenTrabajo` rate |
| Meter detail views | > 100/day | API call count on `getContador` |
| Mean time to customer identification | < 30 seconds (from > 2 minutes) | UX timing measurement |

#### Phase 2: Payments

| KPI | Target | Measurement |
|-----|--------|-------------|
| Payment documents generated in AGORA | > 200/day (currently 0) | `getDocumentoPago` call count |
| Payments processed in AGORA | > 50/day (currently 0) | `cobrarReferenciaFrmPago` success count |
| Payment error rate | < 1% | Failed collection calls / total attempts |
| Agent system switches for payments | < 10% of payment interactions (from 100%) | Agent survey / observation |
| Revenue collected through AGORA | > 10% of total collections | Financial reconciliation |

#### Phase 3: Work Orders + Meters

| KPI | Target | Measurement |
|-----|--------|-------------|
| Dynamic catalog usage | 100% (replace all hardcoded values) | Absence of hardcoded order type/motive constants |
| Batch work order queries | Dashboard loads < 3 seconds | `multipleRefreshData` response time P95 |
| Invoice detail drill-down usage | > 300/day | `getFactura` + `getConceptoConTarifasDeContrato` calls |
| Meter-based search volume | > 50/day | `getContador`-initiated search flows |

#### Phase 4: Self-Service

| KPI | Target | Measurement |
|-----|--------|-------------|
| Address changes processed in AGORA | > 80% (from 0%) | `cambiarDireccionCorrespondencia` success count |
| Bank detail changes in AGORA | > 60% (from 0%) | `cambiarDomiciliacionBancaria` success count |
| Meter readings submitted via AGORA | > 100/day | `solicitudIntroduccionLectura` calls |
| Agent system switch rate | < 20% of interactions (from ~60%) | Agent workflow analytics |
| Customer self-service completion rate | > 70% for supported operations | Chatbot completion analytics |

#### Phase 5 + Modernization

| KPI | Target | Measurement |
|-----|--------|-------------|
| API coverage | > 71% of 126 operations (90+) | Integration inventory |
| v2 REST API adoption | > 95% of frontend calls use v2 | v1 vs v2 API traffic monitoring |
| Average API response time | < 500ms P95 (from 200-2000ms) | APM instrumentation |
| Cache hit rate for catalogs | > 80% | Redis cache statistics |
| Architecture score | 7/10 (from 4/10) | Architecture assessment rubric |
| SOAP credential exposure | Zero (from browser-visible) | Security scan |

---

## 15. Risk Mitigation

### Integration Risks and Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|:----------:|:------:|-----------|
| 1 | **Aquasis endpoint downtime** | MEDIUM | HIGH | Implement circuit breaker pattern (`stoplight` gem). Return cached data for read operations. Queue mutations for retry via Sidekiq. Health check endpoint that tests authenticated SOAP call. |
| 2 | **Payment double-collection** | LOW | CRITICAL | Implement idempotency tokens. Log transaction state before and after SOAP call. Check `bloquearCobro` before every payment. Staged rollout (agents-only first). Daily reconciliation report. |
| 3 | **WSDL contract changes without notice** | MEDIUM | HIGH | Pin WSDL versions in VCR test cassettes. Run nightly schema validation tests. Maintain relationship with CEA IT team. Add `Sunset` headers to v1 endpoints. |
| 4 | **WS-Security credential rotation** | LOW | HIGH | Externalize credentials in encrypted Rails credentials. Health check endpoint that tests authenticated operations. Alert on 401 responses. |
| 5 | **Performance degradation under load** | MEDIUM | MEDIUM | Redis caching (catalogs: 24h TTL, contracts: 5min, service points: 1h). Connection pooling in Savon. Never cache debt, readings, or order status. Request deduplication for concurrent identical queries. |
| 6 | **Schema-only operations remain blocked** | HIGH | HIGH | Formal written request to CEA/Aqualia with business case quantifying revenue impact. Escalate through management. Plan alternative workflows (manual processes with AGORA forms) as interim. |
| 7 | **Data inconsistency during BFF migration** | MEDIUM | MEDIUM | Feature flags per operation. Run v1 and v2 in parallel during transition. Compare responses for regression detection. 30-day minimum overlap before v1 removal. |
| 8 | **CFDI compliance issues in REST transformation** | LOW | HIGH | Never transform or reformat fiscal identifiers (UUID, RFC, serie, folio). Pass CFDI data through unchanged. Test with SAT validation endpoints. |
| 9 | **Large base64 payloads causing timeouts** | MEDIUM | MEDIUM | Set 60-second timeout for PDF operations. Stream large responses. Consider async PDF generation with polling for bulk operations. |
| 10 | **Frontend/backend schema divergence** | MEDIUM | MEDIUM | Generate TypeScript types from OpenAPI spec via `rswag`. Automated contract tests in CI pipeline. |
| 11 | **Insufficient testing for financial operations** | MEDIUM | HIGH | VCR cassettes from real Aquasis responses. Separate test suite for payment operations. Canary deployment for Phase 2. Pre-production validation with CEA staging environment (if available). |
| 12 | **Unbounded array responses causing memory issues** | MEDIUM | LOW | Client-side pagination for operations without server pagination (Readings, Consumption). Response size limits in proxy. Consider server-side truncation with continuation tokens. |

### Risk Registry Summary

```
CRITICAL RISKS (must address before deployment):
  - Payment double-collection -> idempotency + logging + staged rollout
  - Credential exposure -> server-side only credentials (Modernization Track)

HIGH RISKS (address within first 2 phases):
  - Aquasis downtime -> circuit breaker
  - Schema-only operations blocked -> CEA engagement
  - WSDL changes -> versioned tests

MEDIUM RISKS (monitor and mitigate):
  - Performance -> caching + connection pooling
  - Data consistency -> feature flags + parallel running
  - Testing gaps -> VCR + automated contract tests
```

---

## Appendix A: Operation Count Summary

| Service | Total | Integrated | Available | Schema-Only | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|---------|:-----:|:----------:|:---------:|:-----------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| Contracts (InterfazGenericaContratacionWS) | 53 | 4 | 44 | 5 | 2 | 0 | 7 | 4 | 15+ |
| Debt Management (InterfazGenericaGestionDeudaWS) | 13 | 1 | 12 | 0 | 5 | 6 | 0 | 0 | 0 |
| Meters (InterfazGenericaContadoresWS) | 4 | 1 | 3 | 0 | 2 | 0 | 0 | 0 | 1 |
| Readings & Portal (InterfazOficinaVirtualClientesWS) | 47 | 8 | 39 | 0 | 2 | 0 | 4 | 11 | Remaining |
| Work Orders (InterfazGenericaOrdenesServicioWS) | 9 | 3 | 6 | 0 | 2 | 0 | 1 | 0 | 2 |
| **TOTAL** | **126** | **17** | **104** | **5** | **~13** | **~6** | **~12** | **~15** | **~18+** |

## Appendix B: Dependency Chain Map

### Chain 1: Work Order Creation (INTEGRATED)
```
consultaDetalleContrato (Contracts)
  |-- extracts: numeroContador
  v
getPuntoServicioPorContador (Meters)
  |-- extracts: idPtoServicio
  v
crearOrdenTrabajo (Work Orders)
  |-- returns: order code (e.g., O4514415)
  v
informarVisita (Work Orders) --> resolveOT (Work Orders)
```

### Chain 2: Payment Processing (Phase 1 + Phase 2)
```
getDeuda [EXISTING]
  |-- summary view
  v
getDeudaTotalConFacturas [Phase 1]
  |-- invoice-level breakdown
  v
getImpagadosContrato [Phase 1]
  |-- returns facturasPendientesDTO[] + plazosPagoPendientesDTO[]
  v
getDeudaContratoBloqueoCobro [Phase 1]
  |-- safety check: bloquearCobro boolean
  v
getDocumentoPago [Phase 2]
  |-- returns: referencia + rafagaPago + PDF
  v
cobrarReferenciaFrmPago [Phase 2]
  |-- OR: avisarPago [Phase 2]
  |-- OR: cancelarReferencia [Phase 2]
```

### Chain 3: Customer Identification (Phase 1)
```
Customer provides NIF
  v
getContratosPorNif [Phase 1]
  |-- returns: contract list
  v
getTitularPorContrato [Phase 1]
  |-- verify identity
  v
consultaDetalleContrato [EXISTING]
  |-- full contract detail
  v
(any downstream operation)
```

### Chain 4: Service Order via Contracts WS (Phase 3)
```
getTiposOrden [Phase 3]
  |-- get available order types
  v
getMotivosOrden [Phase 3]
  |-- get motives for selected type
  v
crearOrdenServicio [Phase 5]
  |-- returns OrdenServicioDTO
```

### Chain 5: Work Order Monitoring (Phase 1 + Phase 3)
```
crearOrdenTrabajo [EXISTING]
  |-- returns: order code
  v
refreshData [Phase 1]
  |-- returns: full OT with client, elements, readings, debt, comments
  v
multipleRefreshData [Phase 3]
  |-- batch version for dashboards
  v
getDocumentoOrdenTrabajo [Phase 1]
  |-- PDF document
```

---

*Integration Roadmap synthesized from Division B (API Analysis: B1-B7) and Division C (Research: C2, C4) reports.*
*Generated 2026-02-16.*
