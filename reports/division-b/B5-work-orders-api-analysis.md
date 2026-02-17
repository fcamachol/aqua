# B5 - Work Orders API Deep Analysis

## Service: InterfazGenericaOrdenesServicioWS

**Agent:** B5 (api-work-orders)
**Date:** 2026-02-16
**Source Files:**
- `/Users/fernandocamacholombardo/aqua/docs/aquasis-wsdl-work-orders.md`
- `/Users/fernandocamacholombardo/aqua/docs/work-orders.wsdl`
- `/Users/fernandocamacholombardo/aqua/docs/aquasis-integration.md`
- `/Users/fernandocamacholombardo/aqua/docs/aquasis-api-documentation.md`

---

## Executive Summary

The Work Orders Service (`InterfazGenericaOrdenesServicioWS`) is the field operations backbone of AquaCIS, exposing 9 SOAP operations that manage the full lifecycle of work orders for CEA Queretaro's water utility. Of these 9 operations, **3 are integrated** into the AGORA platform (`crearOrdenTrabajo`, `informarVisita`, `resolveOT`), forming a complete Create-Visit-Resolve lifecycle chain.

The service is architecturally sophisticated -- work orders carry deep cross-domain data including meter elements, readings history, unpaid bills, customer debt, and geolocation. This makes it the primary integration point where field operations intersect with billing, metering, and customer data. However, the current integration has a critical known bug (NullPointerException on missing `idPtoServicio`), and 6 of 9 operations remain unintegrated, leaving significant capability on the table -- particularly `refreshData` and `multipleRefreshData`, which are essential for querying work order status and would be required for any mobile field worker application.

**Integration Readiness Score: 7/10** -- The core lifecycle chain works, but the absence of query operations, known bugs, and lack of catalog integrations limit the system's completeness and reliability.

---

## Operation Inventory

### All 9 Operations

| # | Operation | Category | Fault Type | Integrated | Implementation |
|---|-----------|----------|------------|:----------:|----------------|
| 1 | `crearOrdenExterna` | Creation | `AquaCISWSAplicationException` | No | Available |
| 2 | `crearOrdenTrabajo` | Creation | `AquaCISWSAplicationException` | **Yes** | `cea.js: crearOrdenTrabajo(data)` |
| 3 | `getCalibres` | Catalog | `AquaCISWSAplicationException` | No | Available |
| 4 | `getDocumentoOrdenTrabajo` | Document | `ServiceException` | No | Available |
| 5 | `getMarcasYModelos` | Catalog | `AquaCISWSAplicationException` | No | Available |
| 6 | `informarVisita` | Execution | `ServiceException` | **Yes** | `cea.js: informarVisita(data)` |
| 7 | `multipleRefreshData` | Query | `ServiceException` | No | Available |
| 8 | `refreshData` | Query | `ServiceException` | No | Available |
| 9 | `resolveOT` | Resolution | `ServiceException` | **Yes** | `cea.js: resolveOT(data)` |

### Fault Type Pattern

The service uses two distinct fault mechanisms, split by operation origin:

- **`AquaCISWSAplicationException`** (operations 1, 2, 3, 5): Used by creation and catalog operations. Fields: `code`, `message`, `variables[]`, `level`. This is the legacy Aquasis exception format.
- **`ServiceException` / `FaultInfo`** (operations 4, 6, 7, 8, 9): Used by visit, query, resolution, and document operations. Fields: `code`, `type` (enum: `PARAM_VALIDATION`, `BUSINESS`, `RUNTIME`, `TIMEOUT`, `PROCESSING`, `ERROR`, `OTHER`), `message`. This is the newer Aqualogy fault format with typed error categorization.

This dual fault system means integration code must handle two different error structures depending on which operation is being called.

---

## Operation Detail Analysis

### Operation 1: `crearOrdenExterna` (NOT INTEGRATED)

**Purpose:** Create a work order originating from an external SGO (Sistema de Gestion de Ordenes) system. Unlike `crearOrdenTrabajo`, this operation accepts a complete order package including address, resolution elements, equipment, and visit records in a single call.

**Input DTO:** `OrdenTrabajoExternaDTO`
- `datos` (`OrdenExternaDTO`): Core order data -- `explotacionSGO`, `idExplotacion`, `fechaCreacion`, `estado`, `idPtoServicio`, `numContrato`, `numContador`, `idSGO`, `tipoOrden`, `motivoNoResolucion`, `telelectura`, `suspensionLevel`, `geolocalization`, `motivoCambioContador`
- `direccion` (`DireccionOrdenExternaDTO`): Address -- `idPoblacion`, `idLocalidad`, `idCalle`, `numero`, `textoDireccion`
- `resolucion[]` (`OTResolutionElement[]`): Meter elements to install/retire
- `equipo[]` (`OTResolutionEquipment[]`): Equipment changes
- `visita[]` (`VisitaOrdenExternaDTO[]`): Visit records

**Response:** `peticionOrdenExternaDTO` (extends `genericoDTO`)
- `resultado.codigoError` (int, 0 = success)
- `resultado.descripcionError` (string)
- `idOrden` (int): Created order ID
- `ordenCreada` (boolean): Whether the order was created

**Key Difference from `crearOrdenTrabajo`:** This operation uses a numeric `idOrden` return (not a string order code like `O4514415`), takes an `idSGO` external identifier, and can bundle resolution/equipment/visit data at creation time. It is designed for bulk import scenarios where an external work order management system pushes completed or in-progress orders into AquaCIS.

---

### Operation 2: `crearOrdenTrabajo` (INTEGRATED)

**Purpose:** Create a standard work order within AquaCIS. This is the primary order creation operation used by AGORA.

**Input Parameters:**
- `idioma` (string): Language code, typically `es`
- `ordenTrabajo` (`OrdenTrabajoDTO`): The order data object
- `enCurso` (boolean): Whether the order is immediately in progress
- `visitaOrden` (`VisitaOrdenDTO`): Optional initial visit data
- `ordenRelacionada` (`OrdenRelacionadaDTO`): Optional related order link
- `idGOT` (string): Optional GOT (Grupo Operativo de Trabajo) identifier

**OrdenTrabajoDTO Required Fields:**

| Field | Type | Required | Notes |
|-------|------|:--------:|-------|
| `tipoOrden` | `short` | Yes | Order type ID (see catalog below) |
| `motivoOrden` | `short` | Yes | Order reason ID (see catalog below) |
| `fechaCreacionOrden` | `dateTime` | Yes | ISO 8601 format |
| `numContrato` | `int` | Yes | Contract number from ticket |
| `idPtoServicio` | `int` | **CRITICAL** | Service point ID -- **NullPointerException if empty** |
| `fechaEstimdaFin` | `dateTime` | Yes | Estimated end date |
| `anyoExpediente` | `short` | Yes | File year (e.g., 2026) |
| `instalaValvulaPaso` | `boolean` | Yes | Install stop valve flag |

**Optional Fields:** `observaciones`, `codigoObsCambCont`, `codigoReparacion` (default `01`), `numeroExpediente`, `geolocalization`

**Available Order Types:**

| Code | Description |
|------|-------------|
| `6` | Reposicion de suministro |
| `21` | Trabajos genericos |
| `23` | Revision de instalacion |
| `32` | Orden de Reparacion |
| `33` | Reponer contador |

**Available Order Motives:**

| Code | Description |
|------|-------------|
| `15` | Revision de instalacion |
| `41` | Reconexion de servicio |
| `50` | Suspension de servicio |
| `52` | Reparacion de fuga o averia |
| `61` | Reposicion de suministro |

**Response:** `string` -- Order code (e.g., `O4514415`)

**Integration Flow (5 steps):**
1. `consultaDetalleContrato` (Contracts WS) -- extracts `numeroContador`
2. `getPuntoServicioPorContador` (Meters WS) -- extracts `idPtoServicio`
3. `crearOrdenTrabajo` (Work Orders WS) -- returns order code
4. `createServiceOrder` (AGORA Rails API) -- persists local record with `aquasis_order_id`
5. `referenceWorkOrderAquacis` (CEA REST API) -- links order to CEA case

**Frontend:** `GenerateOrderModal.vue`
**Backend:** `cea_proxy_controller.rb`, `tickets_controller.rb#create_service_order`

---

### Operation 3: `getCalibres` (NOT INTEGRATED)

**Purpose:** Retrieve the meter caliber (diameter) catalog. Returns calibers modified since a given date.

**Input:** `idioma` (string), `fechaDesde` (dateTime, required)

**Response:** Array of `CalibreDTO`:
- `calibmm` (int): Caliber in millimeters
- `calibequpul` (string): Caliber equivalent in inches
- `calibhstusu` (string): Last modification user
- `calibhsthora` (dateTime): Last modification timestamp
- `calibbaja` (boolean): Whether deactivated
- `calibcodspde` (string): SPDE code

**Use Case:** Required for meter replacement work orders where the field worker needs to select the correct caliber for a new meter installation. The `fechaDesde` filter supports incremental sync patterns.

---

### Operation 4: `getDocumentoOrdenTrabajo` (NOT INTEGRATED)

**Purpose:** Generate a PDF document for one or more work orders. The PDF can include custom observations per order.

**Input:** `ordenes` (`arrayOfOrdenObservacionesDTO`)
- Each `ordenObservacionesDTO` contains:
  - `codOrden` (string): Order code (e.g., `O4514415`)
  - `observaciones` (`arrayOfObservacionesDTO`): Array of observation strings to print

**Response:** `DocumentoImpresionPendienteDTO`:
- `resultado` (`ResultadoDTO`): Note -- this uses PascalCase `ResultadoDTO` with `codigoError` as `string` (not `int`)
- `pdf` (base64Binary): The PDF document content

**WSDL Anomaly:** This operation uses a different `ResultadoDTO` (PascalCase) from the `resultadoDTO` (camelCase) used elsewhere. The PascalCase variant has `codigoError` as `string` type, while the camelCase variant uses `int`. This inconsistency must be handled carefully in integration code.

---

### Operation 5: `getMarcasYModelos` (NOT INTEGRATED)

**Purpose:** Retrieve the catalog of meter brands and their models. Supports incremental sync via `fechaDesde`.

**Input:** `idioma` (string), `fechaDesde` (dateTime, required)

**Response:** Array of `MarcaDTO`:
- `marcid` (int): Brand ID
- `marcdesc` (string): Brand description
- `marchstusu` / `marchsthora`: Audit fields
- `marcbaja` (boolean): Whether deactivated
- `codigosSPDE[]` (`CodigoSPDEDTO[]`): SPDE codes with validity ranges
- `modelos[]` (`ModeloDTO[]`): Nested models per brand

**ModeloDTO fields:** `modid`, `moddesc`, `modtipesf` (sphere type), `moddigit` (digits), `modtcnid`/`modtcndesc` (technology), `modbaja`, audit fields, `codigosSPDE[]`

**Use Case:** Required for meter replacement/installation work orders. The field worker needs to select the brand and model of the meter being installed. The technology field (`modtcndesc`) and digit count (`moddigit`) are important for correct meter configuration.

---

### Operation 6: `informarVisita` (INTEGRATED)

**Purpose:** Report a field visit to a work order. Records whether the visit was successful, operator details, and any incidents encountered.

**Input Parameters:**

| Parameter | Type | Required | Notes |
|-----------|------|:--------:|-------|
| `id` | `string` | No | Visit ID (for updating an existing visit) |
| `codOrden` | `string` | No | Order code (e.g., `O4514415`) |
| `fechaVisita` | `dateTime` | Yes | When the visit occurred |
| `resultado` | `boolean` | Yes | `true` = successful visit |
| `idOperario` | `string` | Yes | Operator identifier |
| `nombreOperario` | `string` | Yes | Operator name |
| `cifContratista` | `string` | Yes | Contractor tax ID |
| `nombreContratista` | `string` | Yes | Contractor name |
| `codIncidencia` | `short` | Yes | Incident code (0 = no incident) |
| `descIncidencia` | `string` | Yes | Incident description |
| `observaciones` | `string` | No | Free-text observations |
| `aResponsable` | `ContactoVisitaDTO` | No | Contact person present at visit |

**ContactoVisitaDTO / PersonaVisitaDTO:** Captures the responsible person present during the visit:
- `codVinculacion` (string): Link code
- `idDocFirma` (string): Signature document ID (supports digital signature capture)
- `personaVisita.nombre`, `.apellido1`, `.apellido2`: Full name
- `personaVisita.telefono`: Phone number
- `personaVisita.nif`: Tax ID

**Response:** `int` -- Visit ID (can be used in subsequent `id` parameter for updates)

**Key Design Notes:**
- Supports both creating new visits (`id` empty) and updating existing ones (`id` = previously returned visit ID)
- The `resultado` boolean captures pass/fail outcome
- `codIncidencia` / `descIncidencia` encode standardized incident types
- The `idDocFirma` field in `ContactoVisitaDTO` suggests the system was designed to support digital signature capture during visits

---

### Operation 7: `multipleRefreshData` (NOT INTEGRATED)

**Purpose:** Batch-query multiple work orders at once. Returns an array of results, each containing either the full order data or an error.

**Input:** Array of `OTRequest`:
- `operationalSiteID` (string)
- `installationID` (string)
- `systemOrigin` (string)
- `otClassID` (int, required): Order class ID
- `otOriginID` (string): The order code (e.g., `O4514415`)
- `otGotID` (string): GOT identifier
- `language` (string)

**Response:** Array of `OTMass`:
- `ot` (`OT`): Full order data (null if error)
- `error` (`error`): Error details with `codigoError`, `descripcionError`, `identificador` (null if success)

Each `OT` object contains the complete order data tree (see `refreshData` below for full structure).

**Use Case:** Efficient batch retrieval for dashboards, queue management, and mobile apps that need to sync multiple orders at once.

---

### Operation 8: `refreshData` (NOT INTEGRATED)

**Purpose:** Retrieve the complete data package for a single work order. This is the most data-rich operation in the service, returning the full order context.

**Input:** `OTRequest` (same as `multipleRefreshData`)

**Response:** `OT` -- The complete order object:

| Component | Type | Content |
|-----------|------|---------|
| `otData` | `OTData` | Order metadata: codes, dates, address (full breakdown with street/block/floor/door), location, customer contract, meter element, emplacement, geographical/hydraulic criteria, reading area, remote reading flags, geolocalization, suspension level, debt type |
| `clientData` | `ClientData` | Customer contact: comments, notification flag, type, appointment window (`customerCiteFrom`/`customerCiteUntil`), contact name/address/phones |
| `otElements[]` | `OTElement[]` | Meter elements: emplacement, manufacture year, serial number, brand/model/gauge, dial digits, installation date, battery position, supply connection details, valve retention, remote reading status, consumption estimates, equipment (VHF/iMeter/BusVHF/LoRaWAN/BusNBIOT technologies), supply type, integration status |
| `otReadings[]` | `OTReading[]` | Recent readings: serial number, dial, year/period, date, register value, class, consumption, observations, billed status |
| `otCustomerUnpaidBills[]` | `OTCustUnpaidBill[]` | Unpaid bills: reclaimed flag, status, period, amount |
| `otCustomerDebt` | `OTCustomerDebt` | Debt summary: reclaimed bills count, period range, total debt, replacement supply amount, amount given to account |
| `otComments[]` | `OTComment[]` | Order comments: timestamp, text, ID, creation user |

**Critical Observation:** This operation returns billing and debt data alongside the work order, meaning a field worker can see the customer's payment status before executing work. This has important business implications for service suspension/reconnection orders.

---

### Operation 9: `resolveOT` (INTEGRATED)

**Purpose:** Close and resolve a work order. This is the most complex write operation, accepting resolution metadata, meter element changes, equipment changes, and visit comments in a single call.

**Input:** `OTResolution`:

**OTResolutionData (resolution metadata):**
- `operationalSiteID`, `installationID`, `systemOrigin`: Location identifiers
- `otClass` (int): Order class
- `otOrigin` (string): Order code (e.g., `O4514415`)
- `endDateOt` / `endLastTaskOt` (dateTime): Completion timestamps
- `finalSolution` (string): Solution code
- `nonExecutionMotive` (string): Why the order was not executed (if applicable)
- `solutionDescription` (string): Free-text resolution description
- `executorIdentifier` / `executorName`: Who performed the work
- `companyExecutorIdentifier` / `companyExecutorName`: Contractor details
- `transmitterInstalled` (boolean): Whether a telemetry transmitter was installed
- `language`, `suspensionLevel`, `geolocalization`

**OTResolutionElement[] (meter changes):**
- `installedOrRetired` (boolean): `true` = installed, `false` = retired
- `serialNumber`, `meterBrandID`, `meterModel`, `meterGauge`, `meterDial`: Meter identification
- `communicationModule`, `manufacturedYear`, `installationDate`, `emplacement`
- `key`, `batteryRow`, `batteryColumn`: Position data
- `dateReading` / `readingRegister`: Reading at time of install/retire
- `executorIdentifier` / `executorName`, `companyExecutorIdentifier` / `companyExecutorName`
- `valveRetention`, `meterInPlace`, `isSPDE`, `isIntegrated`

**OTResolutionEquipment[] (telemetry equipment changes):**
- `installedOrRetired`, `equipmentType`, `initialIndexReading`, `dateInitialIndexReading`
- Technology-specific sub-objects:
  - `equipmentVHF`: `vhfPreassembled`, `vhfNumber`, `vhfEquipmentModel`, `vhfPulseWeight`, `vhfMeterPulseWeight`
  - `equipmentIMETER`: `iMeterNumber`, `iMeterOptions`, `iMeterEquipmentModel`, `iMeterPulseWeight`
  - `equipmentBusVHF`: `busVHFumberSerie` (note: typo in WSDL -- should be `busVHFNumberSerie`)
  - `equipmentLoRaWAN`: `loRaWANPreAssembled`, `loRaWANModelEmisor`, `loRaWANPulseWeight`, `loRaWANMeterPulseWeight`, `loRaWANEquipmentBrand`, `loRaWANEquipmentModel`, `loRaWANAdditionalKey`
  - `equipmentBusNBIOT`: `busNBIOTNumber`

**VisitComment[] (bundled visit comments):**
- `visitOrComment` (boolean): `true` = visit record, `false` = comment
- `dateTimeVisitComment`, `failedVisit`, `observationType`, `textComment`
- Executor fields (identifier/name, company executor identifier/name)

**Response:** `boolean` -- Whether resolution was successful

**WSDL Note:** The `otResolutionElements` element has `maxOccurs="unbounded"` but **no** `minOccurs="0"`, meaning at least one resolution element may be technically required by the schema, even for orders that do not involve meter work.

---

## Integration Status

### 3 Integrated Operations

| Operation | Function in `cea.js` | Flow Position | Direction |
|-----------|---------------------|---------------|-----------|
| `crearOrdenTrabajo` | `crearOrdenTrabajo(data)` | Step 3 of 5 in creation flow | Write |
| `informarVisita` | `informarVisita(data)` | Mid-lifecycle | Write |
| `resolveOT` | `resolveOT(data)` | End of lifecycle | Write |

### Integration Architecture

```
AGORA (Vue.js Frontend)
    |
    v
Rails Proxy: /api/v1/cea/soap/InterfazGenericaOrdenesServicioWS
    |
    v
Aquasis SOAP Endpoint:
  https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS
```

All SOAP calls are proxied through the Rails backend (`cea_proxy_controller.rb`) to avoid CORS issues. The frontend Vue components build the SOAP XML and parse the responses directly.

### Integrated Workflow

The 3 integrated operations form a complete lifecycle chain:

```
crearOrdenTrabajo   -->  informarVisita  -->  resolveOT
    (Create)              (Visit/Report)       (Close)
    |                     |                    |
    v                     v                    v
  Returns O####         Returns visit ID     Returns boolean
  Stored as             Records field         Closes order with
  aquasis_order_id      worker visit          meter/equipment data
```

---

## Work Order Lifecycle API

### Phase 1: Pre-Creation (Cross-Service Dependencies)

Before creating a work order, two operations from other services must be called:

1. **`consultaDetalleContrato`** (Contracts Service) -- Retrieves the `numeroContador` (meter serial number) for the contract
2. **`getPuntoServicioPorContador`** (Meters Service) -- Resolves the meter serial to an `idPtoServicio` (service point ID)

The `idPtoServicio` is **mandatory** for `crearOrdenTrabajo`. Without it, the server throws a `java.lang.NullPointerException`.

### Phase 2: Creation

**`crearOrdenTrabajo`** creates the order with:
- Type + motive codes (from DB catalogs)
- Contract + service point linkage
- Estimated completion date
- Optional initial visit data (`VisitaOrdenDTO`)
- Optional related order linkage (`OrdenRelacionadaDTO`)
- Optional geolocation

Returns the order code (e.g., `O4514415`) which becomes the universal identifier for all subsequent operations.

### Phase 3: Assignment (GAP)

There is **no explicit assignment operation** in the Work Orders API. Assignment of orders to field workers/crews appears to happen outside the API scope, likely within the AquaCIS GUI or through the SGO system. The `idGOT` (GOT identifier) parameter on `crearOrdenTrabajo` may serve as an implicit assignment mechanism.

### Phase 4: Execution / Field Visits

**`informarVisita`** records each field visit:
- Operator and contractor identification
- Success/failure outcome
- Incident coding
- Contact person present (with digital signature capability via `idDocFirma`)
- Observations

Multiple visits can be recorded per order. The operation returns a visit ID that can be used for updates.

### Phase 5: Resolution

**`resolveOT`** closes the order with:
- Resolution metadata (solution code, description, executor)
- Meter elements installed/retired (with readings at time of change)
- Equipment changes (VHF, iMeter, BusVHF, LoRaWAN, BusNBIOT)
- Bundled visit comments
- Geolocation at resolution
- Non-execution motive (if work was not performed)

---

## Visit Reporting

### Visit Recording Mechanism

Field visits are recorded via `informarVisita`, which captures:

1. **Outcome:** `resultado` boolean (true = successful, false = failed)
2. **Operator Identity:** `idOperario` + `nombreOperario` -- identifies the field worker
3. **Contractor:** `cifContratista` + `nombreContratista` -- identifies the contracting company
4. **Incident:** `codIncidencia` (numeric code) + `descIncidencia` (text description)
5. **Contact Person:** Full `PersonaVisitaDTO` with name, phone, NIF, and digital signature reference

### Visit Data Flow

| Data Point | Source | Destination |
|------------|--------|-------------|
| Visit timestamp | Field worker device | `fechaVisita` |
| Operator ID | Session/login | `idOperario` |
| Visit result | Field worker input | `resultado` |
| Incident code | Dropdown selection | `codIncidencia` |
| Contact name | Field worker input | `aResponsable.personaVisita.nombre` |
| Signature | Digital capture | `aResponsable.idDocFirma` |

### Visit in Order Resolution

When resolving an order via `resolveOT`, visit history can also be bundled via `vistitComments[]` (note: typo "vistit" in the WSDL field name). Each `VisitComment` can be either a visit record (`visitOrComment = true`) or a comment (`visitOrComment = false`), with `failedVisit` indicating unsuccessful attempts.

---

## Known Bugs

### BUG-1: NullPointerException on Missing `idPtoServicio`

| Attribute | Detail |
|-----------|--------|
| **Severity** | CRITICAL |
| **Operation** | `crearOrdenTrabajo` |
| **Condition** | `idPtoServicio` field is empty or missing in `OrdenTrabajoDTO` |
| **Error** | `java.lang.NullPointerException` with `faultcode: soap:Server` |
| **Root Cause** | Server-side null check missing; the service point ID is dereferenced without validation |
| **Impact** | Order creation fails with an unhelpful error message; no indication which field caused the failure |
| **Workaround** | Always call `getPuntoServicioPorContador` (Meters Service) before `crearOrdenTrabajo` to obtain the `idPtoServicio`. Validate it is non-null/non-empty before calling. |
| **Verified** | 2026-02-11 -- Confirmed in production: empty `idPtoServicio` returns `java.lang.NullPointerException` |
| **Error Response** | `<soap:Fault><faultcode>soap:Server</faultcode><faultstring>java.lang.NullPointerException</faultstring></soap:Fault>` |

**Frontend Mitigation in AGORA:**
- If meter lookup fails, `idPtoServicio` will be empty
- Order creation proceeds anyway (will fail)
- Fallback: local order is created **without** `aquasis_order_id` and a warning is displayed: "Orden local creada pero no se pudo registrar en Aquasis"
- This means orders can exist in AGORA without a corresponding AquaCIS record

### BUG-2: WSDL Typo in `busVHFumberSerie`

| Attribute | Detail |
|-----------|--------|
| **Severity** | LOW |
| **Operation** | `resolveOT` (within `EquipmentBusVHF` type) |
| **Issue** | Field name `busVHFumberSerie` is missing the "N" -- should be `busVHFNumberSerie` |
| **Impact** | Integration code must use the misspelled field name `busVHFumberSerie` in SOAP XML to match the WSDL schema |
| **Workaround** | Use the exact misspelled name in all SOAP requests |

### BUG-3: WSDL Typo in `vistitComments`

| Attribute | Detail |
|-----------|--------|
| **Severity** | LOW |
| **Operation** | `resolveOT` (within `OTResolution` type) |
| **Issue** | Field name `vistitComments` appears to be a typo for `visitComments` |
| **Impact** | Integration code must use the misspelled field name |
| **Workaround** | Use the exact misspelled name `vistitComments` in all SOAP requests |

### BUG-4: Dual `ResultadoDTO` Type Inconsistency

| Attribute | Detail |
|-----------|--------|
| **Severity** | MEDIUM |
| **Operations** | `crearOrdenExterna` vs. `getDocumentoOrdenTrabajo` |
| **Issue** | Two different `ResultadoDTO` types exist in the same WSDL schema: `resultadoDTO` (lowercase, `codigoError` as `int`) and `ResultadoDTO` (PascalCase, `codigoError` as `string`) |
| **Impact** | Response parsing code that checks `codigoError === 0` will fail for `getDocumentoOrdenTrabajo` responses where `codigoError` is a string |
| **Workaround** | Implement type-aware parsing that handles both `int` and `string` error codes depending on the operation |

### BUG-5: `otResolutionElements` May Be Required Even for Non-Meter Orders

| Attribute | Detail |
|-----------|--------|
| **Severity** | MEDIUM |
| **Operation** | `resolveOT` |
| **Issue** | In the WSDL, `otResolutionElements` has `maxOccurs="unbounded"` but lacks `minOccurs="0"`, implying at least one element is required by the XSD schema |
| **Impact** | Resolving work orders that do not involve meter work (e.g., generic repairs, inspections) may require a dummy resolution element |
| **Workaround** | Include at least one `OTResolutionElement` with minimal data, or test whether the server actually enforces this constraint |

---

## Mobile Support

### API Suitability for Field Worker Mobile Apps

| Capability | Assessment | Notes |
|------------|:----------:|-------|
| **Order retrieval** | PARTIAL | `refreshData` and `multipleRefreshData` exist but are NOT integrated |
| **Visit reporting** | YES | `informarVisita` is integrated and suitable for mobile use |
| **Order resolution** | YES | `resolveOT` is integrated with full meter/equipment data |
| **Geolocation** | YES | `Geolocalization` DTO supports lat/lon with capture date on creation and resolution |
| **PDF generation** | NO | `getDocumentoOrdenTrabajo` is not integrated; would be useful for offline reference |
| **Catalog sync** | NO | `getCalibres` and `getMarcasYModelos` not integrated; needed for meter work offline |
| **Batch query** | NO | `multipleRefreshData` not integrated; needed for efficient mobile sync |
| **Digital signatures** | PARTIAL | `idDocFirma` field exists in `ContactoVisitaDTO` but no upload mechanism visible |
| **Offline support** | POSSIBLE | The API is stateless SOAP -- mobile app could queue operations for batch sync, but there is no conflict resolution mechanism |

### Offline Architecture Assessment

The API **can** support an offline-first mobile pattern with the following architecture:

```
Mobile App (Offline Queue)
    |
    |-- [Offline] Queue: informarVisita, resolveOT calls
    |-- [Offline] Cache: refreshData results, caliber/brand catalogs
    |
    |-- [Online Sync]
    |   |-- Pull: multipleRefreshData (batch order sync)
    |   |-- Pull: getCalibres, getMarcasYModelos (catalog sync, incremental via fechaDesde)
    |   |-- Push: informarVisita (queued visits)
    |   |-- Push: resolveOT (queued resolutions)
    |   |-- Pull: getDocumentoOrdenTrabajo (PDF for field reference)
```

**Limitations for Offline:**
1. No server-side conflict detection -- if two workers try to resolve the same order, the second call may fail silently or with an undocumented error
2. No incremental sync for orders themselves -- `refreshData` does not support a "modified since" filter (unlike catalogs which have `fechaDesde`)
3. Order creation (`crearOrdenTrabajo`) requires an online `idPtoServicio` lookup first
4. The `resolveOT` response is a simple boolean -- no detailed validation feedback that would help resolve offline conflicts

---

## Cross-Service Integration

### Dependency Map

```
                    Contracts Service
                    (consultaDetalleContrato)
                           |
                           | numeroContador
                           v
                    Meters Service
                    (getPuntoServicioPorContador)
                           |
                           | idPtoServicio
                           v
  ┌────────────────────────────────────────────────┐
  │           Work Orders Service                   │
  │                                                 │
  │  crearOrdenTrabajo ──► informarVisita           │
  │         │                    │                  │
  │         │                    v                  │
  │         └────────────► resolveOT                │
  │                           │                     │
  │                    ┌──────┴──────┐              │
  │                    │             │              │
  │              OTResolution  OTResolution         │
  │              Elements     Equipment             │
  │              (meters)     (VHF/LoRaWAN/...)     │
  │                                                 │
  │  refreshData returns:                           │
  │    - otReadings[] ←── Readings Service          │
  │    - otCustomerUnpaidBills[] ←── Billing        │
  │    - otCustomerDebt ←── Debt Service            │
  │    - otElements[] ←── Meters Service            │
  └────────────────────────────────────────────────┘
                           │
                           v
                    CEA REST API
                    (referenceWorkOrderAquacis)
                    Links order to CEA case
```

### Integration Points

| Integration | Direction | Service | Data Exchanged |
|-------------|-----------|---------|----------------|
| **Contracts --> WO** | Input | Contracts WS | Contract number, meter serial |
| **Meters --> WO** | Input | Meters WS | Service point ID (`idPtoServicio`) |
| **WO --> Meters** | Output (via resolveOT) | Meters WS | Meter install/retire records with readings |
| **WO --> Readings** | Output (via resolveOT) | Implicit | Reading at time of meter change |
| **Readings --> WO** | Input (via refreshData) | Readings WS | Historical readings in `otReadings[]` |
| **Billing --> WO** | Input (via refreshData) | Billing | Unpaid bills + debt summary |
| **WO --> CEA REST** | Output | CEA REST API | Order-to-case linkage |

### Key Observation: refreshData as Data Aggregator

The `refreshData` operation is not merely a work order query -- it is a cross-domain data aggregator. A single call returns:
- Order metadata and address
- Customer contact information
- All meter elements at the service point
- Recent meter readings (with billed/unbilled status)
- Customer's unpaid bills
- Customer's total debt summary
- Order comments history

This makes `refreshData` the single most valuable unintegrated operation, as it would give field workers a complete view of the customer's situation without requiring multiple API calls across different services.

---

## Integration Priority (Remaining 6 Operations)

### Ranked by Business Value

| Priority | Operation | Rationale | Effort |
|:--------:|-----------|-----------|:------:|
| **1** | `refreshData` | Essential for viewing order status, customer context, and field worker dashboards. Required for any mobile or monitoring capability. Returns meter, billing, and debt data in one call. | Medium |
| **2** | `multipleRefreshData` | Batch version of `refreshData`. Required for efficient dashboard loading and mobile sync. | Low (once `refreshData` is done) |
| **3** | `getDocumentoOrdenTrabajo` | PDF generation for work orders. Enables printing, offline field reference, and record-keeping. | Low |
| **4** | `getCalibres` | Meter caliber catalog. Required for meter replacement workflows to validate caliber selection. | Low |
| **5** | `getMarcasYModelos` | Meter brand/model catalog. Required for meter replacement workflows to select correct equipment. | Low |
| **6** | `crearOrdenExterna` | External order creation from SGO systems. Only needed if an external work order management system is deployed. Low immediate value. | Medium |

### Effort Estimates

| Operation | Complexity | Rationale |
|-----------|:----------:|-----------|
| `refreshData` | Medium | Rich response object (`OT`) with 7 sub-objects; requires building comprehensive display UI |
| `multipleRefreshData` | Low | Same response structure as `refreshData`, just wrapped in array with error handling |
| `getDocumentoOrdenTrabajo` | Low | Simple request/response; PDF rendering is browser-native via base64 |
| `getCalibres` | Low | Simple catalog list; straightforward to cache and display |
| `getMarcasYModelos` | Low | Nested catalog (brands -> models); slightly more complex UI but simple API |
| `crearOrdenExterna` | Medium | Complex input DTO with nested resolution/equipment/visit data; requires understanding external SGO workflow |

---

## Recommendations

### HIGH Priority

1. **Integrate `refreshData` immediately** -- This is the single highest-value unintegrated operation across the entire Work Orders service. Without it, AGORA cannot display the status, details, or customer context of existing work orders. It is a prerequisite for any order management dashboard, mobile field worker app, or monitoring capability. The response also provides meter, billing, and debt data, reducing the need for multiple cross-service calls.

2. **Fix the `idPtoServicio` validation gap** -- The current error handling silently creates a local order without an AquaCIS record when the meter lookup fails. This creates data inconsistency. The fix should: (a) validate `idPtoServicio` is non-null before calling `crearOrdenTrabajo`, (b) block order creation with a clear error message if the service point cannot be resolved, (c) never create a local-only order that lacks the AquaCIS counterpart.

3. **Integrate `multipleRefreshData` alongside `refreshData`** -- Once the `OT` response parsing is implemented for `refreshData`, the batch version is trivial. This enables efficient dashboard loading (fetch all active orders in one call) and is essential for any mobile sync pattern.

### MEDIUM Priority

4. **Integrate `getDocumentoOrdenTrabajo` for PDF export** -- Field workers and back-office staff need printable work order documents. The base64 PDF response can be rendered directly in the browser. This is a low-effort, high-visibility feature.

5. **Integrate `getCalibres` and `getMarcasYModelos` catalogs** -- These are required for meter replacement work orders (types 33 "Reponer contador"). Without them, field workers cannot validate or select the correct meter specifications during resolution. Both support incremental sync via `fechaDesde`, making them suitable for local caching.

6. **Add typed error handling for dual fault mechanisms** -- The service uses `AquaCISWSAplicationException` for some operations and `ServiceException` for others. Integration code should implement a unified error handler that normalizes both fault types into a consistent error structure.

7. **Handle `ResultadoDTO` type inconsistency** -- Build parsing logic that handles both the `int`-typed and `string`-typed `codigoError` variants, since they coexist in the same service WSDL.

### LOW Priority

8. **Evaluate `crearOrdenExterna` for SGO integration** -- Only needed if an external field service management system (SGO) is deployed. The operation's ability to bundle address, resolution, equipment, and visit data in a single call makes it suitable for bulk import scenarios.

9. **Document the WSDL typos** -- The `busVHFumberSerie` and `vistitComments` typos should be documented in integration guides so future developers do not waste time debugging field name mismatches.

10. **Investigate `idGOT` parameter for crew assignment** -- The `idGOT` parameter on `crearOrdenTrabajo` may support direct assignment to field work groups. Understanding the GOT (Grupo Operativo de Trabajo) system could enable automatic dispatching from AGORA.

---

## Integration Readiness Score

**Score: 7 / 10**

| Factor | Score | Weight | Notes |
|--------|:-----:|:------:|-------|
| Core lifecycle coverage | 9/10 | 25% | Create-Visit-Resolve chain is fully integrated |
| Query capability | 3/10 | 25% | No `refreshData` or `multipleRefreshData` integration -- cannot view order status |
| Bug severity | 5/10 | 15% | Critical NullPointerException bug with workaround in place; dual ResultadoDTO issue |
| Catalog completeness | 2/10 | 10% | No caliber or brand/model catalogs -- limits meter work orders |
| Mobile readiness | 5/10 | 10% | Write operations work, but no read/query or catalog sync |
| Error handling | 6/10 | 10% | Dual fault types handled but not unified; unhelpful NPE error |
| Documentation quality | 8/10 | 5% | WSDL is well-structured; minor typos documented |

**Weighted Score: 5.65 / 10** (raw calculation)
**Adjusted Score: 7 / 10** (accounting for the fact that the critical write path works end-to-end)

**Key Gap:** The system can create, visit, and resolve orders, but it cannot *query* them. This is like having a mailbox you can put letters into but cannot open. Integrating `refreshData` would raise the score to approximately 8.5/10.
