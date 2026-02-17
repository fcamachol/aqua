# B1 - Contracts API (InterfazGenericaContratacionWS) Deep Analysis

**Agent:** B1 (api-contracts)
**Date:** 2026-02-16
**Service:** InterfazGenericaContratacionWSService
**Endpoint:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS`
**Rails Proxy:** `/api/v1/cea/soap/InterfazGenericaContratacionWS`
**Integration Readiness Score: 6/10**

---

## Executive Summary

The Contracts service (`InterfazGenericaContratacionWS`) is the largest and most complex SOAP service in the AquaCIS platform, exposing 53 operations of which only 4 are integrated into AGORA (7.5% coverage). This service is the backbone of CEA Queretaro's water utility operations -- it manages the full contract lifecycle from new supply requests through billing, consumption tracking, and service termination.

The 4 integrated operations (`consultaDetalleContrato`, `getContrato`, `getContratos`, `getPdfFactura`) represent the minimum viable read path: look up a contract, search contracts, get details, download an invoice PDF. The remaining 49 operations represent an enormous untapped capability spanning invoice management (12 operations), consumption history (3 operations), contract lifecycle workflows (8 operations), service orders (5 operations), customer management (6 operations), and payment/banking operations (5 operations).

Key finding: 5 operations exist only as XSD schema definitions but are NOT exposed in the WSDL portType (`solicitudAcometida`, `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudSubrogacionContrato`). These represent critical contract lifecycle operations that may have been intentionally disabled or are under development server-side. They cannot be called via SOAP regardless of client integration.

The DTO model is deeply nested (up to 5 levels) with `ContratoDTO` alone having 55+ fields, including sub-DTOs like `ClienteDTO` > `PersonaDTO` > `PersonaDireccionDTO` > `DireccionDTO`. This complexity requires careful response parsing and error handling in any integration.

---

## Operation Inventory

### Complete List: 53 Operations by Category

#### A. Contract Queries (8 operations) -- Core Read Path

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 3 | `consultaDetalleContrato` | None | **YES** | `GenericoContratoDTO[]` | HIGH -- 5-level nested response |
| 17 | `getContrato` | None | **YES** | `ContratoDTO` | HIGH -- 55+ field response |
| 18 | `getContratos` | **WS-Security** | **YES** | `ContratosDTO` | MEDIUM -- requires auth header |
| 19 | `getContratosByNumFactNumContrato` | None | No | `ContratoIVRDTO` | LOW -- simple response |
| 12 | `esPSContratable` | None | No | `ResultadoDTO` | LOW -- boolean check |
| 13 | `esTitular` | None | No | `ResultadoDTO` | LOW -- boolean check |
| 26 | `getIDPersonaContrato` | None | No | `IDPersonaContratoDTO` | LOW -- ID lookup |
| 14 | `getCierresByIdsContrato` | None | No | `CortesDTO` | MEDIUM -- closure data |

#### B. Invoice/Billing Operations (12 operations) -- Largest Sub-Group

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 31 | `getPdfFactura` | **WS-Security** | **YES** | `PdfFacturaDTO` | MEDIUM -- base64 PDF payload |
| 10 | `countFacturasContrato` | None | No | `xs:int` | LOW -- returns count |
| 21 | `getFacturaE` | None | No | `XmlFacturaDTO` | MEDIUM -- base64 XML |
| 22 | `getFacturas` | None | No | `FacturasDTO` | MEDIUM -- multi-criteria |
| 23 | `getFacturasContrato` | None | No | `FacturasDTO` | MEDIUM -- paginated |
| 24 | `getFacturasContratoReferencia` | None | No | `FacturasReferenciaDTO` | MEDIUM -- paginated |
| 25 | `getFacturasPorCondiciones` | None | No | `FacturasResponseDTO` | HIGH -- complex filters |
| 30 | `getPdfDocumentoFactura` | None | No | `PdfFacturaDTO` | MEDIUM -- base64 PDF |
| 35 | `getValidacionVerFactura` | None | No | `PdfFacturaDTO` | LOW -- token validation |
| 36 | `recuperaFacturasByIds` | None | No | `FacturaIdDTO` | MEDIUM -- batch by IDs |
| 47 | `solicitudFacturaEnQuejaActiva` | None | No | `ResultadoDTO` | LOW -- complaint flag |
| 48 | `solicitudFacturasMasiva` | None | No | `ResultadoDTO` | HIGH -- bulk async job |

#### C. Consumption/History (3 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 7 | `consultaHistoricoConsumoContrato` | None | No | `HistoricoConsumoDTO` | MEDIUM -- paginated |
| 16 | `getConsumos` | None | No | `HistoricoSuministroDTO[]` | HIGH -- 10 filter params |
| 8 | `consultaHistoricoDomiciliacion` | None | No | `HistoricoDomiciliacionesDTO` | MEDIUM -- paginated |

#### D. Contract History/Audit (3 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 4 | `consultaDocumentacionContrato` | None | No | `DocumentosDTO` | LOW |
| 5 | `consultaDocumentacionTramite` | None | No | `DocumentacionDTO` | MEDIUM -- needs PuntoSuministroDTO |
| 6 | `consultaHistoricoActuacionesContrato` | None | No | `ActuacionesDTO` | MEDIUM -- paginated |

#### E. Service Orders via Contracts (5 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 11 | `crearOrdenServicio` | None | No | `OrdenServicioDTO` | MEDIUM -- write operation |
| 28 | `getMotivosOrden` | None | No | `ListaMotivosCreacionOrdenDTO` | LOW -- catalog |
| 34 | `getTiposOrden` | None | No | `ListaTiposOrdenDTO` | LOW -- catalog |
| 37 | `recuperaOrdenesServicio` | None | No | `OrdenesServicioDTO` | MEDIUM -- batch retrieve |
| 9 | `consultaLiquidacionTramite` | None | No | `DesglosesDTO` | MEDIUM -- settlement calc |

#### F. Customer/Person Management (6 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 15 | `getClienteListByExplotacion` | None | No | `PersonasDTO` | MEDIUM -- paginated |
| 20 | `getExplotacionesUsuario` | None | No | `ExplotacionesDTO` | LOW |
| 33 | `getPersonaList` | None | No | `PersonasDTO` | MEDIUM -- paginated |
| 38 | `registrarContactoManual` | None | No | `RegistrarContactoDTO` | MEDIUM -- write operation |
| 51 | `solicitudModificacionDatosPersonales` | None | No | `ResultadoDTO` | HIGH -- 17 params |
| 40 | `solicitudActivacionFacturaOnline` | None | No | `ResultadoDTO` | LOW |

#### G. Payment/Banking Operations (5 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 1 | `cambiarDomicilioNotificaciones` | None | No | `ResultadoDTO` | MEDIUM -- needs DireccionNotificacionDTO |
| 2 | `cambiarSenasCobroBancarias` | None | No | `ResultadoDTO` | HIGH -- 14 params, banking data |
| 32 | `getPdfMandato` | None | No | `PdfReferenciaMandatoDTO` | MEDIUM -- base64 PDF |
| 44 | `solicitudCambioDomiciliacionBancaria` | None | No | `ResultadoDTO` | HIGH -- 10 params, banking data |
| 45 | `solicitudCambioDomicilioNotificaciones` | None | No | `ResultadoDTO` | MEDIUM -- address change |

#### H. Meter Reading Operations (2 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 49 | `solicitudIntroduccionLectura` | None | No | `ResultadoDTO` | LOW -- 4 params |
| 50 | `solicitudIntroduccionLecturaIVR` | None | No | `ResultadoDTO` | LOW -- 4 params |

#### I. Alert/Notification Management (2 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 41 | `solicitudAltaServiAlerta` | None | No | `ResultadoDTO` | LOW -- 2 params |
| 52 | `solicitudModificacionServiAlertaMasiva` | None | No | `ResultadoDTO` | LOW -- 3 params |

#### J. Print Management (2 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 27 | `getImpresionesLocalesPendientes` | None | No | `ImpresionesPendientesDTO` | LOW |
| 29 | `getPDFImpresionLocalPendiente` | None | No | `DocumentoImpresionPendienteDTO` | MEDIUM -- base64 PDF |

#### K. Contract Lifecycle (Schema-Only -- NOT callable) (5 operations)

| # | Operation | Auth | Integrated | Response DTO | Complexity |
|---|-----------|------|------------|--------------|------------|
| 39 | `solicitudAcometida` | N/A | No | `ResultadoDTO` | HIGH -- 5 complex DTOs |
| 42 | `solicitudAltaSuministro` | N/A | No | `ResultadoDTO` | HIGH -- 5 complex DTOs |
| 43 | `solicitudBajaSuministro` | N/A | No | `ResultadoDTO` | HIGH -- BajaSuministroDTO |
| 46 | `solicitudCambioTitularContrato` | N/A | No | `ResultadoDTO` | HIGH -- 5 complex DTOs |
| 53 | `solicitudSubrogacionContrato` | N/A | No | `ResultadoDTO` | MEDIUM -- 8 params |

---

## Integration Status

### 4 Integrated Operations

| Operation | JS Function | Auth | Purpose in AGORA |
|-----------|-------------|------|------------------|
| `consultaDetalleContrato` | `consultaDetalleContrato(numeroContrato, idioma)` | None | Extract `numeroContador` (meter serial) for work order creation flow |
| `getContrato` | `getContrato(numContrato, idioma, opciones)` | None | Retrieve detailed contract data with full `ContratoDTO` response |
| `getContratos` | `getContratos(numeroContrato, actividad, ...)` | WS-Security | Search/filter contracts by multiple criteria; returns `ContratosDTO` |
| `getPdfFactura` | `getPdfFactura(numFactura, numContrato)` | WS-Security | Download invoice PDF as base64; has helper functions for blob/download |

### Why These 4 Were Prioritized

The selection follows a clear "minimum viable integration" pattern:

1. **`consultaDetalleContrato`** -- Required in the service order creation workflow. This is the entry point: given a contract number from a ticket, it extracts the meter serial (`numeroContador`) which is needed to look up the service point ID via the Meters WS. Without this operation, AGORA cannot create work orders in Aquasis.

2. **`getContrato`** -- The primary contract detail retrieval. Returns the richest `ContratoDTO` with 55+ fields including client data, payment details, addresses, contract status, and variables. This is the core data source for displaying contract information in the AGORA interface.

3. **`getContratos`** -- The only search/filter operation. Essential for finding contracts by number, activity, status, etc. This is the only operation requiring WS-Security, meaning the integration team had to solve authentication for this one operation alone.

4. **`getPdfFactura`** -- Invoice PDF download. High user-facing value (customers and agents frequently need invoice documents). Also requires WS-Security, sharing the same authentication pattern as `getContratos`.

**Selection criteria observed:**
- Read-only operations first (no write operations integrated)
- Operations needed for the service order creation flow (the first end-to-end workflow)
- Operations providing the most user-visible value (contract lookup, invoice download)
- Operations that establish the authentication pattern (WS-Security for 2 of 4)

---

## DTO Analysis

### Key Data Structures

#### Tier 1: Core Response DTOs (used by integrated operations)

**`GenericoContratoDTO`** -- Nesting depth: 4 levels
```
GenericoContratoDTO
  +-- contrato: DetalleContratoDTO
  |     +-- numeroContrato, explotacion, tipoUso, numeroContador, titular
  |     +-- tipoEnvioFacturaDetalle: TipoEnvioFacturaDetalleDTO
  |     +-- hubDetalle: HubDetalleDTO
  |     +-- fechaAlta, fechaBaja, tienePlanPago
  +-- puntoSuministro: PuntoSuministroDTO
  |     +-- provincia, municipio, calle, numero, bloque, escalera, planta, puerta, edificio
  |     +-- listaDeContadores: ArrayOfContratoContadorDTO
  |           +-- ContratoContadorDTO (numeroSerie, estadoContador, fechaInstalacion, fechaBaja)
  +-- datosPersonales: DatosPersonalesDTO
  |     +-- titular, cifNif, telefono1, telefono2, email, permitePublicidad
  |     +-- clausulaRobinson, servicioFacturaOnline, dirCorrespondencia
  +-- datosPago: DatosPagoDTO
  |     +-- formaPago, banco, sucursal, numeroCuenta, cuentaIBAN
  |     +-- referenciaMandato, cuentaProtegida, idTitularSegna
  +-- resultado: ResultadoDTO
        +-- codigoError, descripcionError
```

**`ContratoDTO`** -- Nesting depth: 5 levels, 55+ fields
```
ContratoDTO
  +-- numeroContrato, idExplotacion, idPuntoServicio
  +-- cliente: ClienteDTO
  |     +-- id, tipoCliente, usuarioWeb, passwordWeb
  |     +-- persona: PersonaDTO (19 fields)
  |     |     +-- direcciones: ArrayOfPersonaDireccionDTO
  |     |           +-- PersonaDireccionDTO
  |     |                 +-- direccion: DireccionDTO (22 fields)
  |     +-- listaContratos: ArrayOf_xsd_nillable_int
  +-- segnasDeCobro: SegnasDeCobroDTO (16 fields)
  +-- direccionFacturacion: PersonaDireccionDTO
  +-- direccionCorreo: PersonaDireccionDTO
  +-- propietario: PersonaDTO
  +-- inquilino: PersonaDTO
  +-- historicoTiposFactura: ArrayOfHistoricoTiposFacturaDTO
  +-- variables: ArrayOfVariableDTO
  +-- observaciones: ArrayOfObservacionDTO
```

#### Tier 2: Invoice DTOs

**`FacturaDTO`** -- 19 fields, flat structure
```
FacturaDTO
  +-- numeroContrato, idFactura, numeroCliente, numeroFactura
  +-- fechaEmision, fechaInicio, fechaFin
  +-- importeEuros, impuestos
  +-- tipoCobro, fechaCobro, periodo
  +-- firmada, estado, rafaga
  +-- tipoFactura, docArchivado, incluidaPlanPago
  +-- fechaVencimiento, anyo, url
```

**`FacturaResponseDTO`** -- 21 fields (superset of FacturaDTO)
- Adds: `idExplotacion`, `idCliente`, `nif`, `consumo`, `idDocumentoFactura`
- Used by `getFacturasPorCondiciones`

**`FacturaReferenciaDTO`** -- 22 fields (extends FacturaDTO)
- Adds: `origenFto`, `motivoFto`, `rafagaDeuda`

#### Tier 3: Binary Payload DTOs

**`PdfFacturaDTO`**: `resultado: ResultadoDTO` + `pdf: base64Binary`
**`PdfReferenciaMandatoDTO`**: `resultado: ResultadoDTO` + `pdf: base64Binary`
**`DocumentoImpresionPendienteDTO`**: `resultado: ResultadoDTO` + `pdf: base64Binary`
**`XmlFacturaDTO`**: `resultado: ResultadoDTO` + `xml: base64Binary`

#### Tier 4: Lifecycle DTOs (Schema-Only operations)

**`SolicitanteDTO`** -- 10 fields (requester identity)
```
SolicitanteDTO
  +-- numeroDocumentoSolicitante, resultado: ResultadoDTO
  +-- nombre, primerApellido, segundoApellido, razonSocial
  +-- direccionPostal, municipio, telefono, fax, email
```

**`NuevoTitularDTO`** extends `SolicitanteDTO` -- adds `mismoSolicitante`, `tipoCliente`

**`NuevoContratoDTO`** -- 10 fields (contract transfer)
**`NuevoContratoAltaDTO`** -- 9 fields (new contract enrollment)
**`BajaSuministroDTO`** -- 6 fields (supply termination)
**`PuntoAcometidaDTO`** -- 9 address fields

### DTO Complexity Summary

| DTO | Fields | Nesting Depth | Used By Operations |
|-----|--------|---------------|-------------------|
| `ContratoDTO` | 55+ | 5 | `getContrato`, `getContratos` |
| `GenericoContratoDTO` | ~35 (composite) | 4 | `consultaDetalleContrato` |
| `FacturaResponseDTO` | 21 | 1 | `getFacturasPorCondiciones` |
| `FacturaDTO` | 19 | 1 | `getFacturas`, `getFacturasContrato` |
| `PersonaDTO` | 19 | 3 (via DireccionDTO) | Multiple |
| `DireccionDTO` | 22 | 1 | Via PersonaDireccionDTO |
| `SegnasDeCobroDTO` | 16 | 1 | Via ContratoDTO |
| `HistoricoSuministroDTO` | 30 | 1 | `getConsumos`, `consultaHistoricoConsumoContrato` |
| `ResultadoDTO` | 2 | 1 | ALL operations |

---

## Authentication Pattern

### Dual Authentication Model

The Contracts service uses two distinct authentication patterns:

#### Pattern 1: No Authentication (47 of 48 callable operations)
- Most operations require NO authentication headers
- The SOAP request body contains only operation-specific parameters
- The Rails proxy at `/api/v1/cea/soap/InterfazGenericaContratacionWS` handles routing
- Security relies on the proxy layer and network-level controls (the Aquasis endpoint is not publicly accessible)

#### Pattern 2: WS-Security UsernameToken (2 of 48 callable operations)
- `getContratos` and `getPdfFactura` require WS-Security headers
- Uses OASIS WS-Security 1.0 with UsernameToken profile
- Password type: `PasswordText` (plain text, relies on HTTPS transport security)
- Header structure:

```xml
<soapenv:Header>
  <wsse:Security mustUnderstand="1"
    xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <wsse:UsernameToken wsu:Id="UsernameToken-USERNAME">
      <wsse:Username>USERNAME</wsse:Username>
      <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">PASSWORD</wsse:Password>
    </wsse:UsernameToken>
  </wsse:Security>
</soapenv:Header>
```

#### Session Management
- **Stateless**: There is NO session management. Each SOAP call is independent.
- No session tokens, no login/logout operations, no session expiry
- The `login` parameter in some operations (e.g., `crearOrdenServicio`, `getMotivosOrden`, `getTiposOrden`) is a user identifier for audit purposes, NOT an authentication mechanism
- The `usuario` parameter in `getExplotacionesUsuario` determines which exploitations (service areas) a user can access -- this is authorization, not authentication

#### Application Exception Handling
- All WSDL portType operations declare `AquaCISWSAplicationException` as a fault
- Exception structure: `message` (string), `level` (string), `variables` (string array), `code` (string)
- This is separate from the `ResultadoDTO` error pattern (which uses `codigoError` + `descripcionError`)
- Two error channels exist: SOAP faults for system-level errors, ResultadoDTO for business-level errors

---

## Operation Dependencies

### Sequential Call Chains

#### Chain 1: Service Order Creation (Current Integration)
```
consultaDetalleContrato(contractNo)
  --> extract numeroContador
    --> [Meters WS] getPuntoServicioPorContador(meterSerial)
      --> extract idPtoServicio
        --> [Work Orders WS] crearOrdenTrabajo(contractNo, idPtoServicio, ...)
          --> returns order number (e.g., O4514415)
```
This cross-service chain is the ONLY current end-to-end workflow.

#### Chain 2: Invoice Download Flow (Potential)
```
getFacturasContrato(contractNo, dateRange, pagination)  [or getFacturas]
  --> returns FacturaDTO[] with idFactura, numeroFactura
    --> getPdfFactura(numFactura, numContrato)  [Requires WS-Security]
      --> returns base64 PDF
```
Alternative: `countFacturasContrato` first to determine pagination needs.

#### Chain 3: Contract Lifecycle (Schema-Only -- NOT currently callable)
```
esPSContratable(puntoSuministro)
  --> check if service point available
    --> solicitudAltaSuministro(explotacion, punto, solicitante, titular, contrato)
      --> OR solicitudAcometida(...) for new connection
```

#### Chain 4: Service Order via Contracts WS (NOT through Work Orders WS)
```
getTiposOrden(explotacion, login, idioma)
  --> get available order types catalog
    --> getMotivosOrden(explotacion, tipoOrden, login, idioma)
      --> get available motives for selected type
        --> crearOrdenServicio(contractNo, tipoOrden, motivoOrden, login, idioma)
          --> returns OrdenServicioDTO with idOrdenServicio
```
NOTE: This is a DIFFERENT service order mechanism than the Work Orders WS `crearOrdenTrabajo`. The Contracts WS `crearOrdenServicio` is simpler (5 params vs many) and returns an integer ID rather than an "O" prefixed string. The relationship between these two needs investigation.

#### Chain 5: Customer Lookup Flow
```
getExplotacionesUsuario(usuario)
  --> get accessible exploitations
    --> getClienteListByExplotacion(explotacion, filters, pagination)
      --> find customer
        --> getContrato(numContrato, idioma, opciones) or consultaDetalleContrato
```

#### Independent Operations (No Dependencies)
- `esTitular(documento, numeroContrato)` -- standalone verification
- `getCierresByIdsContrato(contrato[])` -- standalone bulk query
- `solicitudIntroduccionLectura(contractNo, readings)` -- standalone write
- `registrarContactoManual(motivo, via, ids)` -- standalone write

---

## Integration Priority Matrix

### Tier 1: HIGH Priority (Immediate Business Value)

| Rank | Operation | Business Value | Effort | Rationale |
|------|-----------|---------------|--------|-----------|
| 1 | `getFacturasContrato` | **CRITICAL** | LOW | Invoice listing is the #1 requested feature. Paginated, simple params. Paired with existing `getPdfFactura` creates complete invoice management. |
| 2 | `consultaHistoricoConsumoContrato` | **CRITICAL** | LOW | Water consumption history is essential for customer service. Paginated, simple params. Enables consumption charts and trend analysis. |
| 3 | `getConsumos` | HIGH | MEDIUM | Detailed consumption records with cycle/period filtering. More granular than `consultaHistoricoConsumoContrato` but 10 params. |
| 4 | `crearOrdenServicio` | HIGH | LOW | Simpler service order creation than Work Orders WS. Only 5 params. May complement or replace the current cross-service chain. |
| 5 | `getMotivosOrden` | HIGH | LOW | Catalog operation needed by `crearOrdenServicio`. Replace hardcoded order motives in DB with live data. |
| 6 | `getTiposOrden` | HIGH | LOW | Catalog operation needed by `crearOrdenServicio`. Replace hardcoded order types in DB with live data. |

### Tier 2: HIGH-MEDIUM Priority (Customer Service Enhancement)

| Rank | Operation | Business Value | Effort | Rationale |
|------|-----------|---------------|--------|-----------|
| 7 | `esTitular` | HIGH | LOW | Identity verification before allowing contract operations. 2 params, boolean response. Security enabler. |
| 8 | `consultaHistoricoActuacionesContrato` | HIGH | LOW | Audit trail of actions on a contract. Essential for dispute resolution. Paginated. |
| 9 | `getCierresByIdsContrato` | HIGH | LOW | Contract closure/suspension data. Critical for understanding service status. Batch-capable. |
| 10 | `getFacturas` | MEDIUM | MEDIUM | Multi-criteria invoice search (by exploitation, client, invoice#, contract, dates). More flexible than `getFacturasContrato`. |
| 11 | `recuperaOrdenesServicio` | MEDIUM | LOW | Retrieve service orders by IDs. Enables order status tracking from Aquasis. |
| 12 | `getIDPersonaContrato` | MEDIUM | LOW | Resolves contract to person ID. Utility operation for cross-referencing. |

### Tier 3: MEDIUM Priority (Operational Features)

| Rank | Operation | Business Value | Effort | Rationale |
|------|-----------|---------------|--------|-----------|
| 13 | `solicitudIntroduccionLectura` | MEDIUM | LOW | Self-service meter reading submission. Simple 4-param operation. |
| 14 | `registrarContactoManual` | MEDIUM | MEDIUM | CRM integration -- log customer contacts. 7 params including relationships. |
| 15 | `countFacturasContrato` | MEDIUM | LOW | Pagination helper for invoice queries. Returns int. |
| 16 | `getFacturasPorCondiciones` | MEDIUM | HIGH | Advanced invoice search with multiple arrays. Complex but powerful. |
| 17 | `recuperaFacturasByIds` | MEDIUM | LOW | Batch invoice retrieval. Useful for bulk operations. |
| 18 | `getClienteListByExplotacion` | MEDIUM | MEDIUM | Customer search within service area. Paginated with 8 params. |
| 19 | `getPersonaList` | MEDIUM | MEDIUM | Global customer search. Paginated with page-number style pagination. |
| 20 | `getExplotacionesUsuario` | MEDIUM | LOW | Get user's accessible service areas. 1 param. Foundation for area-scoped queries. |

### Tier 4: MEDIUM-LOW Priority (Administrative/Secondary)

| Rank | Operation | Business Value | Effort | Rationale |
|------|-----------|---------------|--------|-----------|
| 21 | `getContratosByNumFactNumContrato` | LOW | LOW | IVR-focused lookup. Limited response data. |
| 22 | `getFacturasContratoReferencia` | LOW | LOW | Invoice references with extra debt fields. Niche use case. |
| 23 | `getPdfDocumentoFactura` | LOW | LOW | Alternate invoice PDF download by document ID. Redundant with `getPdfFactura`. |
| 24 | `getValidacionVerFactura` | LOW | LOW | Token-based invoice view validation. Niche security feature. |
| 25 | `getFacturaE` | LOW | MEDIUM | Electronic invoice XML. Needed only for e-invoicing compliance. |
| 26 | `solicitudActivacionFacturaOnline` | LOW | LOW | Toggle online invoicing. Batch-capable. |
| 27 | `consultaDocumentacionContrato` | LOW | LOW | Contract document list. Limited field documentation. |
| 28 | `consultaDocumentacionTramite` | LOW | MEDIUM | Process documentation. Requires PuntoSuministroDTO. |
| 29 | `consultaLiquidacionTramite` | LOW | MEDIUM | Settlement calculation. Niche financial operation. |
| 30 | `consultaHistoricoDomiciliacion` | LOW | LOW | Direct debit history. Paginated. |

### Tier 5: LOW Priority (Write Operations with Risk)

| Rank | Operation | Business Value | Effort | Rationale |
|------|-----------|---------------|--------|-----------|
| 31 | `solicitudModificacionDatosPersonales` | MEDIUM | HIGH | Personal data update. 17 params. High-risk write operation. |
| 32 | `solicitudCambioDomiciliacionBancaria` | LOW | MEDIUM | Banking details change. 10 params. Financial risk. |
| 33 | `cambiarSenasCobroBancarias` | LOW | HIGH | Direct bank details update (not a request). 14 params. Very high risk. |
| 34 | `cambiarDomicilioNotificaciones` | LOW | MEDIUM | Direct address update. Needs DireccionNotificacionDTO. |
| 35 | `solicitudCambioDomicilioNotificaciones` | LOW | LOW | Address change request. Simpler than direct update. |
| 36 | `solicitudAltaServiAlerta` | LOW | LOW | SMS alert enrollment. 2 params. |
| 37 | `solicitudModificacionServiAlertaMasiva` | LOW | LOW | Bulk alert modification. 3 params. |
| 38 | `solicitudIntroduccionLecturaIVR` | LOW | LOW | IVR meter reading. Identical params to non-IVR version. |
| 39 | `solicitudFacturaEnQuejaActiva` | LOW | LOW | Invoice complaint flag. 1 param. |
| 40 | `solicitudFacturasMasiva` | LOW | HIGH | Bulk invoice generation. Async job. |
| 41 | `getPdfMandato` | LOW | LOW | SEPA mandate PDF. Niche. |
| 42 | `getImpresionesLocalesPendientes` | LOW | LOW | Print queue. Legacy feature. |
| 43 | `getPDFImpresionLocalPendiente` | LOW | LOW | Print job PDF. Legacy feature. |

### Not Integrable (Schema-Only, NOT in WSDL portType)

| Operation | Business Value | Status |
|-----------|---------------|--------|
| `solicitudAcometida` | HIGH | **BLOCKED** -- not in portType |
| `solicitudAltaSuministro` | HIGH | **BLOCKED** -- not in portType |
| `solicitudBajaSuministro` | HIGH | **BLOCKED** -- not in portType |
| `solicitudCambioTitularContrato` | HIGH | **BLOCKED** -- not in portType |
| `solicitudSubrogacionContrato` | MEDIUM | **BLOCKED** -- not in portType |

These 5 operations would be the most valuable lifecycle operations but cannot be called. CEA should be engaged about enabling them server-side.

---

## Technical Challenges

### 1. Deep DTO Nesting (HIGH)
- `ContratoDTO` reaches 5 levels of nesting: `ContratoDTO` > `cliente: ClienteDTO` > `persona: PersonaDTO` > `direcciones: PersonaDireccionDTO[]` > `direccion: DireccionDTO`
- XML response parsing requires careful null-checking at every level
- JavaScript access paths are fragile: `response.ContratoDTO.cliente.persona.direcciones.PersonaDireccionDTO[0].direccion.DireccionDTO.texto`

### 2. Binary Payload Handling (MEDIUM)
- 4 DTOs return `base64Binary` fields (`PdfFacturaDTO`, `PdfReferenciaMandatoDTO`, `DocumentoImpresionPendienteDTO`, `XmlFacturaDTO`)
- PDF payloads can be large (multi-MB invoices)
- The Rails SOAP proxy must handle large response bodies without timeout
- Client-side must convert base64 to Blob for download (already solved for `getPdfFactura`)

### 3. Inconsistent Pagination Patterns (MEDIUM)
- **Pattern A** (record-based): `registroInicial` + `registroTotal` -- used by `consultaHistoricoActuacionesContrato`, `consultaHistoricoConsumoContrato`, `consultaHistoricoDomiciliacion`, `getFacturasContrato`, `getFacturasContratoReferencia`, `getClienteListByExplotacion`, `recuperaFacturasByIds`
- **Pattern B** (page-based): `registroPagina` + `pagina` -- used by `getPersonaList`
- **No pagination**: Many operations return unbounded arrays (`getConsumos`, `getFacturas`, `getFacturasPorCondiciones`)
- No total count in response DTOs -- `countFacturasContrato` exists only for invoices

### 4. Duplicate/Overlapping Operations (MEDIUM)
- `cambiarDomicilioNotificaciones` vs `solicitudCambioDomicilioNotificaciones` -- direct change vs request
- `cambiarSenasCobroBancarias` vs `solicitudCambioDomiciliacionBancaria` -- direct change vs request
- `solicitudIntroduccionLectura` vs `solicitudIntroduccionLecturaIVR` -- identical params, different channels
- `getFacturas` vs `getFacturasContrato` vs `getFacturasPorCondiciones` -- three invoice query paths
- `crearOrdenServicio` (Contracts WS) vs `crearOrdenTrabajo` (Work Orders WS) -- two order creation paths

### 5. WS-Security Credential Management (LOW -- already solved)
- Only 2 operations require WS-Security (`getContratos`, `getPdfFactura`)
- Already implemented in `cea.js` -- credentials presumably stored in environment/config
- Any new operations requiring WS-Security (if any) can reuse the existing pattern

### 6. Schema-Only Operations (HIGH -- blocking)
- 5 critical lifecycle operations exist in XSD but NOT in WSDL portType
- These operations (`solicitudAcometida`, `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudSubrogacionContrato`) cannot be called via SOAP
- Server-side enablement required -- external dependency on CEA/Aquasis team

### 7. Error Handling Dual Pattern (LOW)
- Business errors via `ResultadoDTO.codigoError` (0 = success) with `descripcionError`
- System errors via `AquaCISWSAplicationException` SOAP fault with `message`, `level`, `code`, `variables`
- The Work Orders WS throws raw `NullPointerException` for missing required fields -- similar behavior likely for Contracts operations
- Client code must handle both error channels

### 8. Date Format Inconsistency (LOW)
- Some operations accept `xs:string` for dates (e.g., `2023-01-01`)
- Some operations use `xs:dateTime` (e.g., `2023-06-15T00:00:00`)
- No documented format requirements -- requires empirical testing

---

## Recommendations

### HIGH Priority

1. **Integrate `getFacturasContrato` + `countFacturasContrato` immediately** -- These two operations create a complete paginated invoice listing when combined with the existing `getPdfFactura`. This is the single highest-value integration remaining. No authentication changes needed. Estimated effort: 2-3 days.

2. **Integrate `consultaHistoricoConsumoContrato`** -- Water consumption history is a core CIS feature that every customer service interaction requires. Paginated, simple parameters, no auth needed. Enables consumption trend charts in AGORA. Estimated effort: 1-2 days.

3. **Integrate the service order catalog chain: `getTiposOrden` + `getMotivosOrden` + `crearOrdenServicio`** -- This provides a simpler, self-contained service order creation path within the Contracts WS itself, potentially simplifying the current 3-service cross-WS chain. Must first verify the relationship between `crearOrdenServicio` and the Work Orders WS `crearOrdenTrabajo`. Estimated effort: 3-5 days including investigation.

4. **Engage CEA about enabling the 5 schema-only operations** -- `solicitudAltaSuministro`, `solicitudBajaSuministro`, `solicitudCambioTitularContrato`, `solicitudAcometida`, and `solicitudSubrogacionContrato` represent the complete contract lifecycle. Their absence blocks AGORA from handling new contracts, terminations, and ownership changes. This is a HIGH business impact blocker. Estimated effort: External dependency.

5. **Integrate `esTitular`** -- Simple identity verification (2 params, boolean result). Should be called before any write operation to confirm the requester's authority over the contract. Security enabler for future write operations. Estimated effort: 0.5 days.

### MEDIUM Priority

6. **Integrate `getCierresByIdsContrato`** -- Contract suspension/closure status is critical for understanding service state. Batch-capable (accepts array of contract IDs). Estimated effort: 1 day.

7. **Integrate `consultaHistoricoActuacionesContrato`** -- Audit trail of contract actions. Essential for dispute resolution and customer service context. Estimated effort: 1 day.

8. **Standardize pagination handling** -- Create a shared pagination abstraction that handles both record-based (`registroInicial`/`registroTotal`) and page-based (`registroPagina`/`pagina`) patterns. This will reduce code duplication as more paginated operations are integrated. Estimated effort: 1-2 days.

9. **Integrate `solicitudIntroduccionLectura`** -- Self-service meter reading enables customers to report readings without phone calls. Simple 4-parameter write operation with `ResultadoDTO` response. Estimated effort: 1 day.

10. **Integrate `registrarContactoManual`** -- Log customer contact events in Aquasis when interactions happen in AGORA. Ensures the CIS audit trail remains complete. Estimated effort: 1-2 days.

### LOW Priority

11. **Build a DTO mapping layer** -- Create TypeScript/JavaScript interfaces for the major DTOs (`ContratoDTO`, `GenericoContratoDTO`, `FacturaDTO`, `PersonaDTO`) to provide type safety and reduce runtime errors from deep nesting. Estimated effort: 2-3 days.

12. **Investigate `crearOrdenServicio` vs `crearOrdenTrabajo` relationship** -- Determine if these create the same or different entity types. The Contracts WS operation is simpler (5 params vs 12+) and may be sufficient for many use cases, potentially eliminating the cross-service dependency. Estimated effort: 1 day investigation.

13. **Defer all banking/payment write operations** -- `cambiarSenasCobroBancarias`, `solicitudCambioDomiciliacionBancaria` involve financial data changes and carry significant risk. These should only be integrated after thorough testing in a staging environment and with proper audit logging. Estimated effort: Deferred.

14. **Defer bulk/batch operations** -- `solicitudFacturasMasiva` triggers async background jobs. Without monitoring and status polling capabilities, these are risky to integrate. Estimated effort: Deferred pending architecture review.

---

## Data Flow Patterns

### Pattern 1: Simple Query (Contract Number In, DTO Out)
```
Client --> contractNo --> SOAP --> ContratoDTO/GenericoContratoDTO
```
Used by: `consultaDetalleContrato`, `getContrato`, `getIDPersonaContrato`, `consultaDocumentacionContrato`

### Pattern 2: Filtered Query with Pagination
```
Client --> (filters + registroInicial + registroTotal) --> SOAP --> {resultado + items[]}
```
Used by: `getFacturasContrato`, `consultaHistoricoConsumoContrato`, `consultaHistoricoActuacionesContrato`, `getClienteListByExplotacion`

### Pattern 3: Write + Result Confirmation
```
Client --> (parameters) --> SOAP --> ResultadoDTO {codigoError, descripcionError}
```
Used by: ALL `solicitud*`, `cambiar*`, `registrar*` operations

### Pattern 4: Binary Download
```
Client --> (identifiers) --> SOAP --> {resultado + pdf: base64Binary}
```
Used by: `getPdfFactura`, `getPdfDocumentoFactura`, `getPdfMandato`, `getPDFImpresionLocalPendiente`

### Pattern 5: Authenticated Query
```
Client --> [WS-Security Header + params] --> SOAP --> DTO
```
Used by: `getContratos`, `getPdfFactura` (only 2 operations)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Operations | 53 |
| Callable Operations (in portType) | 48 |
| Schema-Only Operations | 5 |
| Integrated in AGORA | 4 (7.5%) |
| Requiring WS-Security | 2 |
| No Authentication | 46 callable |
| Read-Only Operations | 30 |
| Write Operations | 18 callable |
| Operations Returning base64 | 4 |
| Operations with Pagination | 8 |
| Distinct Response DTOs | 28 |
| Max DTO Nesting Depth | 5 levels (ContratoDTO) |
| Max Parameters (single op) | 17 (solicitudModificacionDatosPersonales) |
| Integration Readiness Score | **6/10** |

**Score Justification (6/10):** The service has good WSDL documentation and established integration patterns (4 operations proven working). The main factors limiting the score are: (a) 5 critical lifecycle operations are blocked server-side, (b) deeply nested DTOs require careful parsing, (c) inconsistent pagination patterns, and (d) the relationship between Contracts WS service orders and Work Orders WS service orders is unclear. The path to expanding integration for read operations is clear and low-risk; write operations require more caution.
