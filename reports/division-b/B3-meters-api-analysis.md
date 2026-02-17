# B3 - Meters SOAP API Deep Analysis

**Service:** InterfazGenericaContadoresWS (AquaCIS Meters Service)
**Date:** 2026-02-16
**Analyst:** Agent B3 (api-meters)
**Status:** 4 operations total, 1 integrated

---

## Executive Summary

The Meters service (`InterfazGenericaContadoresWS`) is a compact but critically positioned SOAP API that serves as the **bridge between meter hardware and the commercial system**. With only 4 operations, it covers meter lookup, meter update, meter change history, and -- most importantly -- the service point resolution that is a mandatory prerequisite for work order creation. The single integrated operation (`getPuntoServicioPorContador`) is the linchpin of the entire AGORA-to-AquaCIS work order flow. Despite having only 4 operations, the WSDL weighs 62KB because it imports the entire Contracts namespace schema, dragging in 68 complex types that the Meters service itself never directly uses. The remaining 3 unintegrated operations represent valuable capabilities for meter asset management, lifecycle tracking, and data correction that could significantly enhance AGORA's operational depth.

---

## Operation Inventory

### Operation 1: `getPuntoServicioPorContador` -- INTEGRATED

| Property | Value |
|----------|-------|
| **SOAPAction** | `getPuntoServicioPorContador` |
| **Purpose** | Resolve one or more meter serial numbers to their full service point data |
| **Integration Status** | Implemented in `cea.js` |
| **Criticality** | BLOCKING -- work order creation fails without it |

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `listaNumSerieContador` | `string[]` (unbounded) | One or more meter serial numbers |
| `usuario` | `string` | User identifier (e.g., `WSGESTIONDEUDA`) |
| `idioma` | `string` | Language code (`es`) |
| `opciones` | `string` | Options string (currently sent empty) |

**Response Type Chain:**
```
getPuntoServicioPorContadorResponse
  └─ ListaPuntosServicioContadorDTO
       ├─ ArrayOfPuntosServicioContadorDTO
       │    └─ PuntosServicioContadorDTO[]
       │         ├─ numSerieContador (string)
       │         ├─ codigoResultado (string)
       │         └─ ArrayOfPuntoServicioDTO
       │              └─ PuntoServicioDTO[]  ← 37 fields each
       │                   ├─ id (int) ← THIS IS idPtoServicio
       │                   ├─ direccionPS (DireccionPSDTO) ← 12 fields
       │                   ├─ observaciones (ArrayOfObservacionesDTO)
       │                   ├─ contratos (ArrayOfContratoAcometidaDTO)
       │                   ├─ contadores (ArrayOfContadoresDTO) ← 18 fields each
       │                   ├─ lecturas (ArrayOfLecturasDTO) ← 17 fields each
       │                   └─ ordenes (ArrayOfOrdenesDTO) ← 4 fields each
       └─ ResultadoDTO (from Contracts namespace)
            ├─ codigoError (int)
            └─ descripcionError (string)
```

**Why it was integrated first:** This operation is Step 2 in the 5-step service order creation flow documented in `aquasis-integration.md`. Without the `idPtoServicio` returned by this call, the `crearOrdenTrabajo` operation throws a `NullPointerException`. It is the only way to resolve a meter serial number (obtained from `consultaDetalleContrato`) into the service point ID required by the Work Orders service. This makes it a **hard dependency** in the integration chain.

**Current extraction path in AGORA (JS):**
```javascript
meterJson.puntosServicioContadorDTO
  .PuntosServicioContadorDTO
  .puntoServicioDTO
  .PuntoServicioDTO
  .id  // e.g., "632744"
```

**Data richness:** This is the richest operation in the entire Meters service. A single call for one meter serial returns:
- Full service point details (37 fields including sector, zone, supply type, cut status)
- Full address with geocoordinates (`coordenadaX`, `coordenadaY`)
- All contracts at the service point (11 fields each)
- All meters at the service point (18 fields each, including AMI fields)
- All readings at the service point (17 fields each)
- All work orders at the service point (4 fields each)
- All observations (4 fields each)

---

### Operation 2: `getContador`

| Property | Value |
|----------|-------|
| **SOAPAction** | `getContador` |
| **Purpose** | Retrieve full details of a single meter by serial number |
| **Integration Status** | Not implemented |
| **Criticality** | HIGH for meter asset management |

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `serialNumber` | `string` | Meter serial number |

**Response Type Chain:**
```
getContadorResponse
  └─ resultadoContadorDTO
       ├─ contadorDTO (14 fields)
       │    ├─ idContador (int)
       │    ├─ numeroSerie (string)
       │    ├─ marca (string) ← Brand
       │    ├─ modelo (string) ← Model
       │    ├─ calibre (short) ← Caliber in mm
       │    ├─ anoFabricacion (short) ← Manufacturing year
       │    ├─ esfera (short) ← Dial digits
       │    ├─ estadoContador (short) ← Status code
       │    ├─ averiado (string) ← Damaged flag
       │    ├─ fechaInstalacion (string) ← Installation date
       │    ├─ fechaRetirada (string) ← Removal date
       │    ├─ idPuntoServicio (int) ← Service point link
       │    ├─ idSegundaEsfera (int) ← Second dial (dual-register)
       │    └─ propiedadCliente (string) ← Customer-owned flag
       └─ resultadoDTO
            ├─ mensajes[] (mensajeError[])
            └─ resultado (string)
```

**Analysis:** This is the canonical meter lookup. The `contadorDTO` type is lean (14 fields) and focuses on physical meter attributes. It differs from the `ContadoresDTO` returned inside `getPuntoServicioPorContador` (which has 18 fields including seal and telemetry data). Notably, `contadorDTO` includes `idPuntoServicio` which provides a reverse lookup from meter to service point. The `idSegundaEsfera` field indicates support for dual-register meters (common in industrial water metering with separate hot/cold registers).

---

### Operation 3: `getCambiosContadorDeContrato`

| Property | Value |
|----------|-------|
| **SOAPAction** | `getCambiosContadorDeContrato` |
| **Purpose** | Retrieve the full history of meter installations and removals for a contract |
| **Integration Status** | Not implemented |
| **Criticality** | MEDIUM for audit trail and meter lifecycle |

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `idContrato` | `int` | Contract number |
| `idioma` | `string` | Language code (`es`) |

**Response Type Chain:**
```
getCambiosContadorDeContratoResponse
  └─ cambiosContadorDTO
       ├─ cambiosContador[] (cambioContadorDTO[])
       │    ├─ contador (string) ← Meter serial number
       │    ├─ contrato (int)
       │    ├─ calibre (int)
       │    ├─ contratista (string) ← Contractor who did the work
       │    ├─ direccionPuntoServicio (string) ← Service point address
       │    ├─ emplazamiento (string) ← Location/emplacement
       │    ├─ externo (string) ← External indicator
       │    ├─ fechaCambioContador (dateTime) ← Change date
       │    ├─ fechaInstalContador (dateTime) ← Installation date
       │    ├─ horaCambioContador (string) ← Change time
       │    ├─ localidad (string) ← City/town
       │    ├─ observacion (string) ← Notes
       │    ├─ telefonoContrato (string) ← Contact phone
       │    └─ zona (string) ← Zone
       └─ resultadoDTO
            ├─ mensajes[] (mensajeError[])
            └─ resultado (string)
```

**Analysis:** This operation provides the meter change audit trail per contract. Each `cambioContadorDTO` record captures both the installation date and the change/removal date, plus the contractor who performed the work. This is critical for regulatory compliance (Mexican water regulation requires meter change records) and for diagnosing consumption anomalies (e.g., high consumption after meter replacement may indicate a calibration issue). The presence of `contratista` (contractor) suggests that meter changes are often performed by third-party service providers.

---

### Operation 4: `actualizarContador`

| Property | Value |
|----------|-------|
| **SOAPAction** | `actualizarContador` |
| **Purpose** | Update meter metadata (brand, model, caliber, manufacturing year) |
| **Integration Status** | Not implemented |
| **Criticality** | LOW-MEDIUM (write operation, requires careful governance) |

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `serialNumber` | `string` | Meter serial number to update |
| `contadorDTO` | `actualizarContadorDTO` | Updated meter data |

**`actualizarContadorDTO` fields (5 fields):**

| Field | Type | Description |
|-------|------|-------------|
| `anoFabricacion` | `short` | Manufacturing year |
| `calibre` | `short` | Caliber in mm |
| `marca` | `string` | Brand name |
| `modelo` | `string` | Model name |
| `numeroSerie` | `string` | New serial number (for corrections) |

**Response:** `resultadoDTO` with `mensajes[]` error array and `resultado` status.

**Analysis:** This is the only **write operation** in the Meters service. It is deliberately limited to physical attribute corrections (brand, model, caliber, year) and serial number corrections. It does NOT handle meter installation, removal, or status changes -- those are managed through the Work Orders service (order types like `33 - Reponer contador`). The ability to update `numeroSerie` suggests this is used for data correction scenarios, not meter swaps. This operation should be integrated with caution and with proper authorization controls.

---

## Integration Status

### Currently Integrated (1 of 4)

| Operation | Status | Used In | Called By |
|-----------|--------|---------|-----------|
| `getPuntoServicioPorContador` | Implemented | Service order creation flow | `cea.js` via SOAP proxy |

### Integration Chain Context

```
Step 1: consultaDetalleContrato ──► extracts: numeroContador
Step 2: getPuntoServicioPorContador ──► extracts: idPtoServicio  ← THIS SERVICE
Step 3: crearOrdenTrabajo ──► uses: idPtoServicio
Step 4: createServiceOrder ──► stores locally
Step 5: referenceWorkOrderAquacis ──► links to CEA case
```

The Meters service is positioned as the **critical bridge** in this chain. The Contracts service provides the meter serial number; the Meters service resolves it to a physical location (service point); and the Work Orders service creates an order at that location.

### Not Integrated (3 of 4)

| Operation | Reason Not Integrated | Value If Integrated |
|-----------|-----------------------|---------------------|
| `getContador` | Not needed for current work order flow | Meter detail panels, asset lookup |
| `getCambiosContadorDeContrato` | Not needed for current work order flow | Meter history timeline, audit |
| `actualizarContador` | Write operation, governance concerns | Data correction workflows |

---

## Complex Type Analysis: Why 62KB for 4 Operations

### The WSDL Bloat Problem

The WSDL file is **62,157 bytes** for a service with only 4 operations. Here is why:

**Schema 1 -- Meters Namespace** (lines 3-319, ~27 complex types)
These are the types actually used by the 4 operations:

| Category | Types | Fields Total |
|----------|-------|-------------|
| Operation request/response wrappers | 4 | ~10 |
| Meter-specific DTOs | 5 (`contadorDTO`, `actualizarContadorDTO`, `cambioContadorDTO`, `resultadoContadorDTO`, `cambiosContadorDTO`) | ~33 |
| Service point aggregate | 12 (`PuntoServicioDTO`, `DireccionPSDTO`, `ContadoresDTO`, `LecturasDTO`, `OrdenesDTO`, `ContratoAcometidaDTO`, `ObservacionesDTO`, + Array wrappers) | ~103 |
| Result/error types | 3 (`resultadoDTO`, `mensajeError`, `ListaPuntosServicioContadorDTO`) | ~6 |
| Array wrapper types | 7 | 0 (structural only) |
| **Subtotal** | **27 types** | **~152 fields** |

**Schema 2 -- Contracts Namespace (IMPORTED)** (lines 320-1026, ~68 complex types)
These types belong to the Contracts service and are pulled in via the `xs:import` because `getPuntoServicioPorContador` uses `ResultadoDTO` from the Contracts namespace:

| Category | Types | Relevance to Meters |
|----------|-------|---------------------|
| `ResultadoDTO` | 1 | **Used** -- error response for `getPuntoServicioPorContador` |
| Contract types (`ContratoDTO`, `GenericoContratoDTO`, `DetalleContratoDTO`, etc.) | 12 | NOT USED by Meters operations |
| Person/Client types (`PersonaDTO`, `ClienteDTO`, `SolicitanteDTO`, etc.) | 8 | NOT USED |
| Invoice/Billing types (`FacturaDTO`, `FacturasDTO`, `PdfFacturaDTO`, `DesglosesDTO`, etc.) | 12 | NOT USED |
| Address types (`DireccionDTO`, `PersonaDireccionDTO`) | 3 | NOT USED |
| Payment types (`DatosPagoDTO`, `SegnasDeCobroDTO`, `DomiciliacionDTO`, etc.) | 5 | NOT USED |
| Work order types (`OrdenServicioDTO`, `OrdenesServicioDTO`, `TipoOrdenDTO`, etc.) | 6 | NOT USED |
| History types (`HistoricoSuministroDTO`, `HistoricoConsumoDTO`, etc.) | 5 | NOT USED |
| Misc types (`VariableDTO`, `DocumentoDTO`, `BajaSuministroDTO`, etc.) | 10 | NOT USED |
| Array wrapper types | 15 | NOT USED |
| **Subtotal** | **68 types** | **Only 1 actually used** |

### Size Breakdown

| Component | Approximate Size | % of WSDL |
|-----------|-----------------|-----------|
| Meters schema (27 types) | ~16KB | 26% |
| Imported Contracts schema (68 types) | ~39KB | 63% |
| WSDL messages, portType, binding, service | ~5KB | 8% |
| XML overhead (namespaces, headers) | ~2KB | 3% |

**Conclusion:** 63% of the WSDL is dead weight from the Contracts namespace import. The Meters service only needs `ResultadoDTO` (2 fields) from that namespace, but the entire schema of 68 types with hundreds of fields comes along. This is a common anti-pattern in Occam/Agbar WSDL generation -- shared schemas are included wholesale rather than selectively.

---

## Service Point Resolution

### How the API Resolves Meter -> Location -> Contract

The `getPuntoServicioPorContador` operation is essentially a **graph traversal** that starts from a meter serial number and returns the complete service point subgraph:

```
Meter Serial Number (input)
    │
    ▼
PuntoServicioDTO (service point = physical location)
    ├─ id ──────────────────────► Used as idPtoServicio in work orders
    ├─ direccionPS ─────────────► Physical address with geocoordinates
    ├─ codigoExplotacion ───────► Exploitation/district (e.g., "8" = HUIMILPAN)
    ├─ codigoZona ──────────────► Zone within exploitation
    ├─ idSector / idSubSector ──► Hydraulic sector mapping
    │
    ├─ contratos[] ─────────────► All contracts at this service point
    │    ├─ cnttnum ────────────► Contract number
    │    ├─ nombre ─────────────► Contract holder
    │    ├─ cnttestado ─────────► Contract status (active/inactive)
    │    └─ descUso ────────────► Water usage type
    │
    ├─ contadores[] ────────────► All meters at this service point
    │    ├─ numeroSerie ────────► Serial number
    │    ├─ estadoContador ─────► Active/removed/damaged
    │    ├─ snTelelectura ──────► Remote reading capable
    │    └─ moduloComunicacion ─► Communication module type
    │
    ├─ lecturas[] ──────────────► Recent readings at this point
    │    ├─ lectura / consumo ──► Reading value and consumption
    │    ├─ origen ─────────────► Source (manual, estimated, remote)
    │    └─ metodoEst ──────────► Estimation method if applicable
    │
    └─ ordenes[] ───────────────► Work orders at this point
         ├─ tipo ───────────────► Order type
         └─ estado ─────────────► Order status
```

### Key Relationships

1. **One meter can map to one service point** (the `PuntoServicioDTO.id` is the service point ID)
2. **One service point can have multiple contracts** (e.g., residential subdivided into apartments)
3. **One service point can have multiple meters** (current + historical, or multi-register)
4. **The API supports batch lookup** (`listaNumSerieContador` is `maxOccurs="unbounded"`)

### Service Point as Central Entity

The service point (`PuntoServicioDTO`) is the **central entity** in AquaCIS's domain model. It represents a physical connection to the water network. Everything else is related to it:
- Contracts are commercial agreements AT a service point
- Meters are physical devices INSTALLED at a service point
- Readings are measurements TAKEN at a service point
- Orders are work PERFORMED at a service point

This is why the Meters service returns such rich data -- the service point is the nexus.

---

## Meter Lifecycle

### Available Lifecycle Information

The Meters API reveals the following lifecycle stages:

| Stage | API Evidence | Source |
|-------|-------------|--------|
| **Manufacturing** | `anoFabricacion` (year), `marca` (brand), `modelo` (model), `calibre` (mm) | `contadorDTO`, `ContadoresDTO` |
| **Installation** | `fechaInstalacion` / `fechaInstalacionContador`, `fechaInstalContador` | All meter types |
| **Active service** | `estadoContador` status code, `esfera` (dial digits) | `contadorDTO` |
| **Reading** | `lecturas[]` array with `lectura`, `consumo`, `origen` | `PuntoServicioDTO` |
| **Damage** | `averiado` flag | `contadorDTO` |
| **Seal management** | `tienePrecintoSuspension`, `fechaPrecintoSuspension`, `fechaDesprecintoSuspension`, `tienePrecintoSeguridad` | `ContadoresDTO` |
| **Replacement** | `cambioContadorDTO` records with install/change dates, contractor | `getCambiosContadorDeContrato` |
| **Removal** | `fechaRetirada` / `fechaBajaContador` | `contadorDTO`, `ContadoresDTO` |
| **Data correction** | `actualizarContador` operation | Write operation |

### Lifecycle Operations NOT in This Service

The Meters API is read-heavy by design. The following lifecycle actions are handled by the **Work Orders service** instead:

| Action | Mechanism |
|--------|-----------|
| Install new meter | Work order type `33 - Reponer contador` |
| Replace meter | Work order type `33 - Reponer contador` |
| Suspend service (seal) | Work order motive `50 - Suspension de servicio` |
| Reconnect service | Work order motive `41 - Reconexion de servicio` |

This separation follows the Occam/Agbar pattern where the Meters service manages **data/state** while the Work Orders service manages **physical actions**.

---

## Data Model Richness

### Per-Meter Metadata Available

**Via `getContador` (contadorDTO) -- 14 fields:**

| Field | Type | Category |
|-------|------|----------|
| `idContador` | `int` | Identity |
| `numeroSerie` | `string` | Identity |
| `marca` | `string` | Physical |
| `modelo` | `string` | Physical |
| `calibre` | `short` | Physical |
| `anoFabricacion` | `short` | Physical |
| `esfera` | `short` | Physical |
| `estadoContador` | `short` | Status |
| `averiado` | `string` | Status |
| `fechaInstalacion` | `string` | Lifecycle |
| `fechaRetirada` | `string` | Lifecycle |
| `idPuntoServicio` | `int` | Relationship |
| `idSegundaEsfera` | `int` | Dual-register |
| `propiedadCliente` | `string` | Ownership |

**Via `getPuntoServicioPorContador` (ContadoresDTO) -- 18 fields:**

All 14 fields above, plus:

| Additional Field | Type | Category |
|-----------------|------|----------|
| `idMarca` / `idModelo` | `short` | Coded identity |
| `tienePrecintoSuspension` | `string` | Seal status |
| `fechaPrecintoSuspension` | `string` | Seal date |
| `fechaDesprecintoSuspension` | `string` | Unseal date |
| `tienePrecintoSeguridad` | `string` | Security seal |
| `snTelelectura` | `string` | AMI/remote reading |
| `moduloComunicacion` | `string` | Comm module type |

### What Is Missing

| Data Point | Present? | Impact |
|-----------|----------|--------|
| GPS coordinates of meter | No (only service point has coordinates) | Cannot locate individual meters in multi-meter installations |
| Meter accuracy/calibration data | No | Cannot assess measurement accuracy |
| Last test date | No | No predictive maintenance data |
| Flow rate capacity | Partially (via `calibre`) | Caliber implies flow rate but not exact |
| Battery level (for AMI) | No | Cannot monitor remote meter health |
| Signal strength (for AMI) | No | Cannot assess communication quality |
| Firmware version | No | Cannot manage smart meter updates |

---

## Smart Meter / AMI Readiness

### Existing AMI Fields

The `ContadoresDTO` type (returned within `getPuntoServicioPorContador`) contains two AMI-relevant fields:

1. **`snTelelectura`** (`string`) -- "Telelectura" flag indicating whether the meter supports remote reading. This is a yes/no indicator.
2. **`moduloComunicacion`** (`string`) -- Communication module identifier, which would specify the type of AMI module (e.g., LoRaWAN, NB-IoT, etc.).

### AMI Readiness Assessment

| Capability | Supported? | Details |
|-----------|-----------|---------|
| Identify AMI-enabled meters | YES | `snTelelectura` flag |
| Identify communication technology | PARTIAL | `moduloComunicacion` exists but unclear what values are used |
| Receive automated readings | NO | No push/webhook mechanism; readings via `lecturas[]` are periodic |
| High-frequency reading data | NO | `lecturas[]` is period-based, not time-series |
| Meter alarms/alerts | NO | No alarm fields in any DTO |
| Two-way communication | NO | No command/control operations |
| Battery/signal monitoring | NO | No hardware health fields |
| Firmware management | NO | No firmware-related fields |

### Assessment

The Meters API has **minimal AMI readiness**. It can identify which meters are AMI-capable, but it cannot:
- Ingest high-frequency reading data (sub-daily intervals)
- Handle meter alarms or tamper detection
- Support two-way communication with smart meters
- Monitor communication module health

For a full AMI/IoT integration, a separate service or API extension would be needed. The current architecture is designed for **walk-by/drive-by reading** workflows where readings are collected periodically and uploaded in batches, not for real-time telemetry.

---

## Integration with Readings Service

The Meters API provides reading data embedded within `getPuntoServicioPorContador`, via the `lecturas[]` array in `PuntoServicioDTO`. Each `LecturasDTO` contains:

| Field | Purpose |
|-------|---------|
| `periodo` | Billing period |
| `periodicidad` | Reading frequency |
| `contrato` | Associated contract |
| `esfera` | Dial number |
| `fechaLectura` | Date of reading |
| `lectura` | Absolute meter reading |
| `consumo` | Calculated consumption for the period |
| `origen` | Reading source (manual, estimated, remote) |
| `estado` | Reading status |
| `dias` | Days in the period |
| `ajusteEstimado` / `ajuste` | Consumption adjustments |
| `saldoBolsa` | Bag balance (estimation pool) |
| `metodoEst` | Estimation method used |

This means the Meters API already provides reading history as part of the service point response, making a separate readings service call unnecessary for basic consumption review. However, the `lecturas[]` data is pre-aggregated at period level -- raw interval data for AMI meters is not available through this API.

The `origen` field is particularly valuable for integration, as it distinguishes between:
- Manual readings (field technician)
- Estimated readings (system-calculated)
- Remote readings (telelectura/AMI)

---

## Integration Priority: Remaining 3 Operations

### Ranked by Business Value

| Rank | Operation | Priority | Justification |
|------|-----------|----------|---------------|
| **1** | `getContador` | **HIGH** | Enables meter detail panels in AGORA. Simple read operation with no governance risk. Provides `idPuntoServicio` for reverse lookups and `averiado` (damaged) flag for triage. Could be used to validate meter existence before work order creation. Single input (serial number), clean response. |
| **2** | `getCambiosContadorDeContrato` | **MEDIUM** | Enables meter change history timeline per contract. Valuable for customer service (explaining consumption changes after meter replacement) and regulatory compliance. Input is `idContrato` which is already available in AGORA tickets. |
| **3** | `actualizarContador` | **LOW** | Write operation requiring authorization controls, audit logging, and validation. Limited to metadata corrections (brand, model, caliber, year, serial). Should only be integrated when AGORA has role-based access control for field operations. |

---

## Recommendations

### 1. Integrate `getContador` for Meter Detail Panel -- HIGH

**Rationale:** AGORA already has the meter serial number from the contract detail. Adding a meter detail panel (showing brand, model, caliber, year, status, damage flag, installation/removal dates) would give agents instant visibility into the physical asset. The `averiado` flag is particularly useful for pre-screening before dispatching a technician.

**Effort:** Low. Single-input, single-output operation. Same SOAP proxy pattern already established.

**Dependencies:** None. Can be developed independently.

### 2. Integrate `getCambiosContadorDeContrato` for Contract Timeline -- MEDIUM

**Rationale:** Meter change history helps explain consumption anomalies and provides audit trail data that agents currently must look up in AquaCIS directly. Especially valuable when customers dispute bills after a meter change.

**Effort:** Low-Medium. Simple request/response, but requires a UI component (timeline or table) to display the change history.

**Dependencies:** None beyond having contract number (already available).

### 3. Leverage Full Service Point Data from `getPuntoServicioPorContador` -- HIGH

**Rationale:** The current integration only extracts `id` (service point ID). The response contains 37 service point fields, plus arrays of contracts, meters, readings, and orders. This data is already being returned and could populate:
- Service point dashboard (address, zone, sector, supply type)
- Cut/disconnection status indicators (`snCortadoPorDeuda`, `snCortadoPorVencimientoContrato`, `snCortadoPeticionManual`)
- Geocoordinates for map display (`coordenadaX`, `coordenadaY`)
- Reading history without a separate API call
- Active work orders at the location

**Effort:** Low (data is already being fetched; only parsing/display work needed).

### 4. Validate `opciones` Parameter -- LOW

**Rationale:** The `getPuntoServicioPorContador` operation accepts an `opciones` parameter that is currently sent empty. This parameter may control which nested arrays are returned (contracts, meters, readings, orders). If it supports selective loading, performance could be improved by requesting only the `id` when that is all that is needed, and requesting the full payload only for detail views.

**Effort:** Requires testing against the production API with different `opciones` values.

### 5. Build Meter-Centric Search -- MEDIUM

**Rationale:** Currently, AGORA searches by contract number. Adding meter serial number as a search entry point (using `getContador` to validate + `getPuntoServicioPorContador` to resolve) would enable field technicians to look up information by scanning/reading the physical meter, rather than needing to know the contract number.

**Effort:** Medium. Requires a new search flow and UI, but reuses existing operations.

### 6. Defer `actualizarContador` Until RBAC Is Ready -- LOW

**Rationale:** This write operation modifies meter records in the system of record. It should only be exposed when AGORA has role-based access control that restricts it to authorized meter management personnel. Incorrect meter data (wrong caliber, wrong model) can cascade into billing errors.

**Effort:** The integration itself is low effort, but the governance framework is medium-high effort.

---

## Integration Readiness Score

**Score: 7 / 10**

| Dimension | Score | Notes |
|-----------|-------|-------|
| API Stability | 9/10 | Mature Occam/Agbar WSDL, unlikely to change |
| Documentation | 8/10 | WSDL is self-documenting, analyzed documentation is thorough |
| Current Integration | 6/10 | Only 1 of 4 operations (25%), but the critical one is done |
| Data Richness | 8/10 | Rich service point model, good meter metadata |
| Ease of Integration | 8/10 | SOAP proxy pattern established, operations are simple |
| AMI/Smart Readiness | 3/10 | Minimal -- only identification flags, no telemetry |
| Write Safety | 5/10 | `actualizarContador` has no authorization model visible in WSDL |
| Batch Support | 7/10 | `getPuntoServicioPorContador` accepts multiple serials |
| **Overall** | **7/10** | Strong foundation, low-hanging fruit available |

### Key Risks

1. **WSDL bloat from imported schema**: The 68 imported types increase parsing time and memory usage for SOAP client libraries. Consider using a trimmed WSDL for code generation.
2. **String-typed dates**: Many date fields are `xs:string` instead of `xs:dateTime`, requiring manual date parsing in the integration layer.
3. **No pagination on `lecturas[]`**: Reading history arrays may be large for long-lived service points, with no pagination control visible.
4. **Single point of failure**: `getPuntoServicioPorContador` is the only way to get `idPtoServicio`; if this service is down, work order creation is completely blocked.

---

## Appendix: Complete Type Inventory

### Meters Namespace Types (27)

| # | Type Name | Used By Operation | Fields |
|---|-----------|-------------------|--------|
| 1 | `getContadorResponse` | `getContador` | 1 |
| 2 | `resultadoContadorDTO` | `getContador` | 2 |
| 3 | `contadorDTO` | `getContador` | 14 |
| 4 | `resultadoDTO` | `actualizarContador`, `getCambiosContadorDeContrato` | 2 |
| 5 | `mensajeError` | Error responses | 2 |
| 6 | `getCambiosContadorDeContratoResponse` | `getCambiosContadorDeContrato` | 1 |
| 7 | `cambiosContadorDTO` | `getCambiosContadorDeContrato` | 2 |
| 8 | `cambioContadorDTO` | `getCambiosContadorDeContrato` | 14 |
| 9 | `getPuntoServicioPorContadorResponse` | `getPuntoServicioPorContador` | 1 |
| 10 | `ListaPuntosServicioContadorDTO` | `getPuntoServicioPorContador` | 2 |
| 11 | `ArrayOfPuntosServicioContadorDTO` | Wrapper | 1 |
| 12 | `PuntosServicioContadorDTO` | `getPuntoServicioPorContador` | 3 |
| 13 | `ArrayOfPuntoServicioDTO` | Wrapper | 1 |
| 14 | `PuntoServicioDTO` | `getPuntoServicioPorContador` | 37 |
| 15 | `DireccionPSDTO` | `getPuntoServicioPorContador` | 12 |
| 16 | `ArrayOfObservacionesDTO` | Wrapper | 1 |
| 17 | `ObservacionesDTO` | `getPuntoServicioPorContador` | 4 |
| 18 | `ArrayOfContratoAcometidaDTO` | Wrapper | 1 |
| 19 | `ContratoAcometidaDTO` | `getPuntoServicioPorContador` | 11 |
| 20 | `ArrayOfContadoresDTO` | Wrapper | 1 |
| 21 | `ContadoresDTO` | `getPuntoServicioPorContador` | 18 |
| 22 | `ArrayOfLecturasDTO` | Wrapper | 1 |
| 23 | `LecturasDTO` | `getPuntoServicioPorContador` | 17 |
| 24 | `ArrayOfOrdenesDTO` | Wrapper | 1 |
| 25 | `OrdenesDTO` | `getPuntoServicioPorContador` | 4 |
| 26 | `actualizarContadorDTO` | `actualizarContador` | 5 |
| 27 | `actualizarContadorResponse` | `actualizarContador` | 1 |

### Imported Contracts Namespace Types (68) -- Only `ResultadoDTO` Used

Types include: `ResultadoDTO`, `FacturaDTO`, `ArrayOf_xsd_nillable_int`, `ArrayOf_xsd_nillable_string`, `ListaMotivosCreacionOrdenDTO`, `ArrayOfMotivoCreacionOrdenDTO`, `MotivoCreacionOrdenDTO`, `ArrayOfTipoOrdenDTO`, `TipoOrdenDTO`, `DocumentacionDTO`, `DireccionDTO`, `ArrayOfVariableDTO`, `VariableDTO`, `DatosPagoDTO`, `ListaTiposOrdenDTO`, `NuevoContratoAltaDTO`, `DesglosesDTO`, `ArrayOfDesgloseDTO`, `DesgloseDTO`, `DocumentoDTO`, `ArrayOfHistoricoSuministroDTO`, `HistoricoSuministroDTO`, `RegistrarContactoDTO`, `ActuacionDTO`, `ArrayOfActuacionDTO`, `PuntoSuministroDTO`, `ArrayOfContratoContadorDTO`, `ContratoContadorDTO`, `ArrayOfFacturaDTO`, `FacturasIdDTO`, `PersonaDireccionDTO`, `OrdenesServicioDTO`, `ArrayOfOrdenesServiciosDTO`, `OrdenesServiciosDTO`, `ArrayOfDocumentoDTO`, `ArrayOfPersonaDireccionDTO`, `ObservacionDTO`, `BajaSuministroDTO`, `ArrayOfDomiciliacionDTO`, `DomiciliacionDTO`, `FacturasDTO`, `ArrayOfHistoricoTiposFacturaDTO`, `HistoricoTiposFacturaDTO`, `ArrayOfFacturasIdDTO`, `ArrayOfObservacionDTO`, `HistoricoConsumoDTO`, `DatosPersonalesDTO`, `ContratosDTO`, `ArrayOfContratoDTO`, `ContratoDTO`, `ClienteDTO`, `PersonaDTO`, `SegnasDeCobroDTO`, `PersonasDTO`, `ArrayOfPersonaDTO`, `NuevoContratoDTO`, `GenericoContratoDTO`, `DetalleContratoDTO`, `TipoEnvioFacturaDetalleDTO`, `HubDetalleDTO`, `SolicitanteDTO`, `NuevoTitularDTO`, `ActuacionesDTO`, `FacturaIdDTO`, `DocumentosDTO`, `HistoricoDomiciliacionesDTO`, `OrdenServicioDTO`, `PuntoAcometidaDTO`, `PdfFacturaDTO`, `IDPersonaContratoDTO`.
