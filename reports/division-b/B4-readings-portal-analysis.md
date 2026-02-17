# B4 - Readings & Customer Portal SOAP Service Analysis

## Executive Summary

The `InterfazOficinaVirtualClientesWS` (Virtual Office / Customer Portal) service is the second-largest SOAP endpoint in the AquaCIS ecosystem, exposing **47 operations** through a single WSDL at `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS`. Of these, **8 are currently integrated** into the AGORA platform via `cea.js`, yielding a 17% integration rate.

Despite the service name suggesting a customer-facing "virtual office," the operations span five distinct functional domains: meter readings and consumption data, billing and invoicing, tariff and rate queries, customer/contract management, and geographic reference data. The integrated operations were clearly selected to power the AGORA chatbot's most-requested customer self-service workflows: checking consumption, viewing invoices, reviewing tariff rates, and updating notification preferences.

The remaining 39 unintegrated operations include critical capabilities for a full customer portal -- contract lookup, holder identification, geographic address resolution, banking/payment management, and service intervention history. Integrating these would enable AGORA to support complete digital self-service without requiring users to visit CEA offices.

**Integration Readiness Score: 5/10** -- The 8 integrated operations demonstrate a working proxy pattern and WS-Security implementation, but the 83% gap means customer self-service remains severely limited. The service's flat, non-paginated array returns and lack of date-range filters on readings/consumption queries present scalability concerns for production portal use.

---

## Operation Inventory

All 47 operations organized by functional domain. Operations marked with **[INTEGRATED]** are implemented in `cea.js`.

### Category A: Meter Readings & Consumption (6 operations, 4 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 20 | `getConsumos` | `Consumo[]` | **[INTEGRATED]** | Consumption records for a contract (WS-Security) |
| 21 | `getConsumosParaGraficas` | `Consumo[]` | **[INTEGRATED]** | Consumption data formatted for chart visualization |
| 33 | `getLecturas` | `Lectura[]` | **[INTEGRATED]** | Meter readings history for a contract (WS-Security) |
| 34 | `getLecturasParaGraficas` | `Lectura[]` | Not implemented | Readings formatted for chart display |
| 19 | `getConceptos` | `Concepto[]` | **[INTEGRATED]** | Billing concepts for an exploitation |
| 47 | `getUltimoMensaje` | `string` | Not implemented | Last notification message for a contract |

### Category B: Billing & Invoicing (4 operations, 1 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 31 | `getFacturas` | `Factura[]` | **[INTEGRATED]** | Invoice list for a contract (WS-Security) |
| 30 | `getFactura` | `Factura` | Not implemented | Single invoice detail by number |
| 17 | `getConceptoConTarifasDeContrato` | `ConceptoConTarifasFacturadas[]` | Not implemented | Billing concepts with tariffs for a contract |
| 18 | `getConceptoConTarifasDeFactura` | `ConceptoConTarifasFacturadas[]` | Not implemented | Billing concepts with tariffs for a specific invoice |

### Category C: Tariff & Rate Queries (2 operations, 1 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 41 | `getTarifaDeAguaPorContrato` | `Tarifa` | **[INTEGRATED]** | Water tariff for a specific contract |
| 42 | `getTarifasVigente` | `Tarifa[]` | Not implemented | Currently active tariffs by exploitation and concept type |

### Category D: Contract & Customer Management (11 operations, 0 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 22 | `getContrato` | `Contrato` | Not implemented | Full contract details |
| 23 | `getContratoPorDatosGenerales` | `Contrato` | Not implemented | Contract lookup by address (single) |
| 24 | `getContratosPorDatosGenerales` | `Contrato[]` | Not implemented | Contract lookup by address (multiple) |
| 25 | `getContratosPorNif` | `Contrato[]` | Not implemented | Contracts by tax ID (NIF) |
| 26 | `getContratosPorNie_crn` | `Contrato[]` | Not implemented | Contracts by NIE/CRN identifier |
| 43 | `getTitularPorContrato` | `Titular` | Not implemented | Account holder by contract |
| 44 | `getTitularPorNif` | `Titular` | Not implemented | Account holder by NIF |
| 45 | `getTitularPorNie_crn` | `Titular` | Not implemented | Account holder by NIE/CRN |
| 46 | `getTitulares` | `Titular[]` | Not implemented | Multi-criteria holder search |
| 27 | `getDomicilio` | `Domicilio` | Not implemented | Supply address for a contract |
| 9 | `getActuaciones` | `Actuacion[]` | Not implemented | Service interventions/actions on a contract |

### Category E: Notification & Preference Management (6 operations, 2 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 3 | `cambiarEmailNotificacionPersona` | `int` | **[INTEGRATED]** | Change notification email (hardcodes `atencionDe=ChatBot`) |
| 5 | `cambiarPersonaNotificacionContrato` | `short` | **[INTEGRATED]** | Change notification person for contract (WS-Security) |
| 6 | `cambiarTipoFacturaContrato` | `short` | **[INTEGRATED]** | Change invoice type for contract (WS-Security) |
| 4 | `cambiarMovilNotificacionContrato` | `short` | Not implemented | Change mobile notification number |
| 1 | `cambiarDireccionCorrespondencia` | `string` | Not implemented | Change correspondence address |
| 2 | `cambiarDomiciliacionBancaria` | `string` | Not implemented | Change bank direct debit details |

### Category F: System/Portal Configuration (3 operations, 0 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 7 | `cambiarUrlOficinaVirtualExplotacion` | `short` | Not implemented | Change virtual office URL for exploitation |
| 8 | `cambiarUrlOficinaVirtualSociedad` | `short` | Not implemented | Change virtual office URL for company |
| 32 | `getIdiomaExplotacion` | `string` | Not implemented | Get configured language for exploitation |

### Category G: Banking & Payment (6 operations, 0 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 10 | `getAgencias` | `Agencia[]` | Not implemented | Bank agencies by bank code |
| 11 | `getBanco` | `Banco` | Not implemented | Bank details by code |
| 12 | `getBancosPorDescripcion` | `Banco[]` | Not implemented | Banks by name search |
| 13 | `getBancoPorExplotacionCodigo` | `Banco` | Not implemented | Bank by exploitation and code |
| 14 | `getBancosPorExplotacionDescripcion` | `Banco[]` | Not implemented | Banks by exploitation and description |
| 36 | `getNumeroCuentaBancaria` | `NumeroCuentaBancaria[]` | Not implemented | Bank account number for a contract |

### Category H: Geographic Reference Data (9 operations, 0 integrated)

| # | Operation | Returns | Status | Description |
|---|-----------|---------|--------|-------------|
| 15 | `getCallesPorPatron` | `Calle[]` | Not implemented | Streets by name pattern |
| 16 | `getComunidadesDePais` | `Comunidad[]` | Not implemented | Communities/regions by country |
| 28 | `getDomiciliosContratados` | `Domicilio[]` | Not implemented | Contracted domiciles at address |
| 29 | `getDomiciliosPendientesContratar` | `Domicilio[]` | Not implemented | Domiciles pending contract at address |
| 35 | `getLocalidadesDePoblacion` | `Localidad[]` | Not implemented | Localities by town |
| 37 | `getPaises` | `Pais[]` | Not implemented | Countries list (no params) |
| 38 | `getPoblacionesDeProvincia` | `Poblacion[]` | Not implemented | Towns by province |
| 39 | `getProvincia` | `Provincia[]` | Not implemented | Provinces by country |
| 40 | `getProvinciasDeComunidad` | `Provincia[]` | Not implemented | Provinces by community |

---

## Integration Status: 8 Integrated Operations

### Summary Table

| Operation | cea.js Function | Auth | Key Parameters |
|-----------|----------------|------|----------------|
| `getConsumos` | `getConsumos(explotacion, contrato, idioma)` | WS-Security | exploitation (zero-padded), contract, language |
| `getConsumosParaGraficas` | `getConsumosParaGraficas(explotacion, contrato, idioma)` | None | exploitation, contract, language |
| `getLecturas` | `getLecturas(explotacion, contrato, idioma)` | WS-Security | exploitation, contract, language |
| `getFacturas` | `getFacturas(explotacion, contrato, idioma)` + `getFacturasJson()` | WS-Security | exploitation, contract, language |
| `getConceptos` | `getConceptos(explotacion, idioma)` | None | exploitation (zero-padded), language |
| `getTarifaDeAguaPorContrato` | `getTarifaDeAguaPorContrato(explotacion, contrato, idioma)` + `getTarifaDeAguaPorContratoJson()` | None | exploitation (zero-padded), contract, language |
| `cambiarEmailNotificacionPersona` | `cambiarEmailNotificacionPersona(nif, nombre, apellido1, apellido2, contrato, emailAntiguo, emailNuevo, codigoOficina, usuario)` | None | NIF, name, contract, old/new email; hardcodes `atencionDe=ChatBot` |
| `cambiarPersonaNotificacionContrato` | `cambiarPersonaNotificacionContrato(contrato, nif, email1, email2, usuario)` | WS-Security | contract, NIF, emails |
| `cambiarTipoFacturaContrato` | `cambiarTipoFacturaContrato(contrato, nif, tipoFactura, usuario)` | WS-Security | contract, NIF, invoice type; default user `0000004874` |

### Pattern of Selection

The 8 integrated operations follow a clear pattern: **chatbot-driven customer self-service**. They were chosen to enable the AGORA chatbot to answer the most frequent customer inquiries without human agent intervention:

1. **"How much water did I use?"** -- `getConsumos`, `getConsumosParaGraficas`
2. **"What are my meter readings?"** -- `getLecturas`
3. **"Show me my bills"** -- `getFacturas`
4. **"What is my water rate?"** -- `getTarifaDeAguaPorContrato`, `getConceptos`
5. **"Update my email"** -- `cambiarEmailNotificacionPersona`, `cambiarPersonaNotificacionContrato`
6. **"Change my invoice type"** -- `cambiarTipoFacturaContrato`

The selection prioritizes **read-heavy, contract-scoped queries** and the **two most common self-service mutations** (email update, invoice type change). Write operations that touch financial data (banking, address changes) were deliberately excluded, likely due to security/audit concerns.

### Authentication Pattern

Four of the 8 integrated operations require **WS-Security (UsernameToken)**: `getConsumos`, `getLecturas`, `getFacturas`, and `cambiarPersonaNotificacionContrato`. These are the operations that expose sensitive financial or personal data. The remaining four (`getConsumosParaGraficas`, `getConceptos`, `getTarifaDeAguaPorContrato`, `cambiarEmailNotificacionPersona`) operate without WS-Security headers.

All calls are proxied through Rails at `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` to avoid CORS issues, with the proxy handling credential injection.

---

## Reading Workflow

### How Meter Readings Flow Through the API

The readings subsystem exposes a **read-only retrieval pattern** -- there is no "submit reading" operation in this WSDL. Readings are captured externally (field readers, telelectura/AMR systems) and flow into AquaCIS. The API only provides historical query access.

```
External Reading Sources                 AquaCIS Database
  (Field readers, AMR/telelectura)  -->  [Lectura records]
                                              |
                                    SOAP API Query Layer
                                              |
                    +-------------------------+-------------------------+
                    |                                                   |
            getLecturas()                                getLecturasParaGraficas()
            (raw data)                                   (chart-formatted)
                    |                                                   |
            Returns Lectura[]                                Returns Lectura[]
            - ano, periodo, periodicidad                   (same DTO, different
            - metrosCubicos                                 aggregation/format)
            - estimado (boolean)
            - fechaLectura
            - ElementoLectura[] (sub-readings)
            - Variable[] (cycle variables)
```

### Key DTO Structures

**`Lectura`** contains:
- `ano` (year) + `periodo` (period) + `periodicidad` (frequency) -- temporal positioning
- `metrosCubicos` -- the actual reading in cubic meters
- `estimado` -- whether the reading was estimated (no actual meter read)
- `fechaLectura` -- the date the reading was taken
- `lecturas` (`ElementoLectura[]`) -- sub-elements with `observacion`, `origen` (source), `tipo` (type), `fecha`, and `m3`
- `variablesDeCiclo` (`Variable[]`) -- billing cycle metadata

**Consumption vs. Reading distinction:**
- `getLecturas` returns raw **meter readings** (what the meter showed at a point in time)
- `getConsumos` returns **consumption calculations** (the difference between consecutive readings, representing actual water usage)
- Both share similar DTO structures (`Lectura` vs `Consumo`) but serve different analytical purposes

### Reading Quality Indicators

The `estimado` boolean flag on both `Lectura` and `ElementoConsumo` objects is critical for data quality. Estimated readings occur when:
- The meter was inaccessible
- Telelectura data was unavailable
- The reading was interpolated by the billing system

The `origen` field on `ElementoLectura`/`ElementoConsumo` indicates the source: field reader, AMR system, or system estimate.

### Telelectura (Remote Reading) Support

The `Contrato` DTO includes `sntelelectura` (boolean) and `moduloComunicacion` (string), indicating whether a contract's meter supports remote/automatic reading. This is relevant for data freshness -- telelectura-enabled meters may have more frequent, higher-quality readings.

---

## Portal Operations: Customer Self-Service Capabilities

### Currently Enabled (via AGORA chatbot)

| Capability | Operations Used | User Action |
|-----------|----------------|-------------|
| View consumption history | `getConsumos`, `getConsumosParaGraficas` | Customer asks chatbot about usage |
| View meter readings | `getLecturas` | Customer inquires about readings |
| View invoice list | `getFacturas` | Customer requests bill information |
| Check water tariff | `getTarifaDeAguaPorContrato` | Customer asks about rate |
| View billing concepts | `getConceptos` | Customer asks what charges mean |
| Update email | `cambiarEmailNotificacionPersona` | Customer requests email change |
| Change notification contact | `cambiarPersonaNotificacionContrato` | Customer updates contact person |
| Change invoice format | `cambiarTipoFacturaContrato` | Customer switches paper/digital |

### Not Yet Enabled (39 operations)

**High-value portal capabilities currently missing:**

1. **Contract Lookup** (`getContrato`, `getContratosPorNif`, `getContratosPorNie_crn`) -- Customers cannot look up their own contracts by ID or tax number. This is a fundamental self-service gap.

2. **Account Holder Verification** (`getTitularPorContrato`, `getTitularPorNif`, `getTitulares`) -- No ability to verify identity or look up holder information, which is a prerequisite for many transactions.

3. **Invoice Detail** (`getFactura`, `getConceptoConTarifasDeContrato`, `getConceptoConTarifasDeFactura`) -- While `getFacturas` returns the list, there is no drill-down into individual invoice detail or tariff breakdowns.

4. **Address/Domicile Information** (`getDomicilio`, `getDomiciliosContratados`) -- Customers cannot view their service address or check contracted locations.

5. **Mobile Notification** (`cambiarMovilNotificacionContrato`) -- SMS notification updates are not supported despite email being available.

6. **Service History** (`getActuaciones`) -- Customers cannot view past interventions or actions on their contract.

7. **Banking Changes** (`cambiarDomiciliacionBancaria`, `getNumeroCuentaBancaria`) -- No direct debit management.

---

## Tariff Operations: Rate Query and Calculation APIs

### Integrated

**`getTarifaDeAguaPorContrato`** -- Returns a single `Tarifa` object containing:
- `codigo` (`IDShortShortShort`) -- Three-level tariff classification code
- `descripcion` -- Human-readable tariff name
- `publicacion` (`Publicacion`) -- Official publication date and text
- `subconceptos` (`Subconcepto[]`) -- Tariff sub-items, each with:
  - `descripcion` -- Sub-concept name
  - `variables` (`Variable[]`) -- Rate tiers, thresholds, prices
  - `correctoresAplicables` (`Corrector[]`) -- Adjustment factors
- `variablesContratos` (`Variable[]`) -- Contract-level rate parameters
- `variablesPuntoServicio` (`Variable[]`) -- Service point-level parameters

This is the most deeply nested DTO in the service. The `Tarifa` hierarchy (Tarifa -> Subconcepto -> Variable/Corrector) models Mexico's tiered water rate structure with volume-based blocks, fixed charges, and regional adjustments.

### Not Integrated

**`getTarifasVigente`** -- Returns all currently active tariffs for a given exploitation and concept type (`IDShortShort`). This would enable:
- Displaying a full rate schedule (not just one contract's rate)
- Comparing rates across usage tiers
- Proactive notification of rate changes (via `Publicacion.fechaPublicacion`)

**`getConceptoConTarifasDeContrato`** and **`getConceptoConTarifasDeFactura`** -- Return `ConceptoConTarifasFacturadas[]`, joining billing concepts with their applied tariffs. These are essential for bill explanation features ("Why is my bill this amount?").

### Tariff Data Model

```
Tarifa
  +-- codigo: IDShortShortShort (3-level classification)
  +-- descripcion: string
  +-- publicacion: Publicacion
  |     +-- fechaPublicacion: string
  |     +-- textoPublicacion: string
  +-- subconceptos: Subconcepto[]
  |     +-- descripcion: string
  |     +-- variables: Variable[] (rate tiers/values)
  |     +-- correctoresAplicables: Corrector[] (adjustments)
  +-- variablesContratos: Variable[] (contract-level params)
  +-- variablesPuntoServicio: Variable[] (service point params)
```

---

## Consumption Analytics: Historical Data Access Patterns

### Query Model

All consumption/reading queries follow the same pattern:
- **Input**: `explotacion` (short, zero-padded) + `contrato` (int) + `idioma` (string)
- **Output**: Unbounded array of records sorted by period
- **No pagination**: Returns ALL historical records in a single response
- **No date filtering**: Cannot request a specific date range

This is a significant limitation for analytics. A contract with 10 years of bimonthly readings would return ~60 `Lectura` objects in a single SOAP response, with nested `ElementoLectura[]` arrays multiplying the payload size.

### Data Access Patterns

| Pattern | Standard Query | Chart Query | Difference |
|---------|---------------|-------------|------------|
| Readings | `getLecturas` | `getLecturasParaGraficas` | Chart variant likely pre-aggregates or limits data |
| Consumption | `getConsumos` | `getConsumosParaGraficas` | Chart variant may include additional visualization metadata |

Both chart variants (`*ParaGraficas`) return the same DTO types (`Lectura[]`, `Consumo[]`) as their standard counterparts. The differentiation happens server-side in the AquaCIS business logic -- likely different sort orders, aggregation levels, or record limits optimized for chart rendering.

### Estimation Tracking

The `estimado` flag enables analytics features:
- **Reading quality dashboard**: Percentage of actual vs estimated readings
- **Anomaly detection**: Estimated readings followed by large consumption jumps
- **Billing dispute support**: Identifying when estimates may have been inaccurate

### Temporal Model

Readings and consumption are organized by:
- `ano` (year, `short`)
- `periodo` (period identifier, `string`)
- `periodicidad` (frequency descriptor, `string`)
- `fechaLectura` (specific reading date, `string`)

CEA uses bimonthly billing cycles for most residential contracts, which means the `periodo` typically represents a 2-month window.

---

## Batch Operations: Bulk Data Handling Capabilities

### Batch vs. Single-Record Analysis

The service contains no explicit batch-input operations. All operations accept single-entity parameters (one contract, one NIF, one invoice number). However, several operations return **arrays** that function as implicit batch-output queries:

| Operation | Input | Output | Batch Nature |
|-----------|-------|--------|-------------|
| `getConsumos` | Single contract | `Consumo[]` | All consumption history (unbounded) |
| `getLecturas` | Single contract | `Lectura[]` | All reading history (unbounded) |
| `getFacturas` | Single contract | `Factura[]` | All invoices (unbounded) |
| `getContratosPorNif` | Single NIF | `Contrato[]` | All contracts for a person |
| `getContratosPorDatosGenerales` | Address params | `Contrato[]` | All contracts at address |
| `getTitulares` | Search criteria | `Titular[]` | Multi-result search |
| `getDomiciliosContratados` | Address | `Domicilio[]` | All contracted units |
| `getTarifasVigente` | Exploitation + type | `Tarifa[]` | All active tariffs |
| `getConceptos` | Exploitation | `Concepto[]` | All billing concepts |

### Scalability Concerns

1. **No pagination**: Array responses have no `maxResults`, `offset`, or `page` parameters. Every call returns the complete dataset.
2. **No date-range filtering**: Historical queries (`getConsumos`, `getLecturas`, `getFacturas`) cannot be scoped to a time window.
3. **Nested arrays**: `Consumo.consumos[]` and `Lectura.lecturas[]` add nested unbounded arrays within each parent record.
4. **No bulk-contract queries**: Cannot query readings/consumption for multiple contracts in a single call -- each requires a separate SOAP request.

### Caching Implications

Given the lack of pagination and date filtering, the AGORA proxy should implement:
- **Response caching** for reference data (`getConceptos`, `getPaises`, geographic lookups)
- **TTL-based caching** for relatively static data (`getTarifaDeAguaPorContrato` -- tariffs change infrequently)
- **No caching** for transactional data (`getFacturas`, `getLecturas` -- must reflect latest state)

---

## Integration Priority Matrix: Remaining 39 Operations

### Priority 1 -- CRITICAL (Should integrate next)

| Operation | Category | Rationale | Effort |
|-----------|----------|-----------|--------|
| `getContrato` | Contract | Essential for full contract visibility; foundation for other operations | Low |
| `getContratosPorNif` | Contract | Enables customer self-identification by tax ID (most common lookup) | Low |
| `getFactura` | Billing | Single invoice drill-down completes the billing workflow started by `getFacturas` | Low |
| `getTitularPorContrato` | Customer | Identity verification needed for secure transactions | Low |
| `getConceptoConTarifasDeContrato` | Tariff | Bill explanation ("why is my bill X?") is a top customer question | Medium |
| `getLecturasParaGraficas` | Readings | Completes the chart visualization pair (consumption charts already integrated) | Low |

### Priority 2 -- HIGH (Enable key self-service workflows)

| Operation | Category | Rationale | Effort |
|-----------|----------|-----------|--------|
| `cambiarMovilNotificacionContrato` | Notification | Natural extension of existing email notification change | Low |
| `getConceptoConTarifasDeFactura` | Billing | Invoice-specific tariff breakdown for dispute resolution | Medium |
| `getTarifasVigente` | Tariff | General rate schedule display for transparency | Low |
| `getDomicilio` | Address | Show service address -- basic contract information | Low |
| `getActuaciones` | Service | Service history enables customer tracking of past interventions | Low |
| `getTitularPorNif` | Customer | Alternative holder lookup path for identity verification | Low |
| `getUltimoMensaje` | Communication | Display latest message to customer -- simple value-add | Low |

### Priority 3 -- MEDIUM (Expand portal functionality)

| Operation | Category | Rationale | Effort |
|-----------|----------|-----------|--------|
| `getContratosPorNie_crn` | Contract | Alternative contract lookup for customers using NIE/CRN | Low |
| `getContratosPorDatosGenerales` | Contract | Address-based contract search (multi-unit buildings) | Medium |
| `getContratoPorDatosGenerales` | Contract | Single-result version of above | Medium |
| `cambiarDireccionCorrespondencia` | Notification | Correspondence address update (12 parameters, complex) | High |
| `getTitularPorNie_crn` | Customer | Holder lookup by NIE/CRN identifier | Low |
| `getTitulares` | Customer | Multi-criteria search (admin/support use case) | Medium |
| `getNumeroCuentaBancaria` | Banking | View payment information (read-only, lower security risk) | Medium |

### Priority 4 -- LOW (Reference data and admin operations)

| Operation | Category | Rationale | Effort |
|-----------|----------|-----------|--------|
| `cambiarDomiciliacionBancaria` | Banking | Bank detail changes -- high security requirements, regulatory concerns | High |
| `getDomiciliosContratados` | Address | Contracted units at address (niche use case) | Low |
| `getDomiciliosPendientesContratar` | Address | Pending contract domiciles (internal operations) | Low |
| `getCallesPorPatron` | Geographic | Street search (needed if address change is implemented) | Low |
| `getAgencias` | Banking | Bank agency lookup (needed for banking features) | Low |
| `getBanco` | Banking | Bank details (needed for banking features) | Low |
| `getBancosPorDescripcion` | Banking | Bank search (needed for banking features) | Low |
| `getBancoPorExplotacionCodigo` | Banking | Exploitation-scoped bank lookup | Low |
| `getBancosPorExplotacionDescripcion` | Banking | Exploitation-scoped bank search | Low |
| `getLocalidadesDePoblacion` | Geographic | Locality reference data | Low |
| `getPaises` | Geographic | Countries list -- static reference | Low |
| `getPoblacionesDeProvincia` | Geographic | Towns by province -- reference data | Low |
| `getProvincia` | Geographic | Provinces by country -- reference data | Low |
| `getProvinciasDeComunidad` | Geographic | Provinces by community -- reference data | Low |
| `getComunidadesDePais` | Geographic | Communities by country -- reference data | Low |
| `getIdiomaExplotacion` | Config | Language config (single utility, already known) | Low |
| `cambiarUrlOficinaVirtualExplotacion` | Config | Admin-only URL configuration | Low |
| `cambiarUrlOficinaVirtualSociedad` | Config | Admin-only URL configuration | Low |

---

## Recommendations

### HIGH Priority

1. **Integrate the "Contract Core" operations (`getContrato`, `getContratosPorNif`, `getTitularPorContrato`)** -- These three operations are the foundation for all customer self-service. Without contract lookup and holder verification, the chatbot cannot authenticate users or display basic account information. The WSDL shows they follow the same `(explotacion, contrato, idioma)` parameter pattern as already-integrated operations, making integration straightforward. **HIGH**

2. **Add invoice detail drill-down (`getFactura`, `getConceptoConTarifasDeContrato`)** -- The current integration retrieves the invoice list but cannot explain individual invoices. "Why is my bill this amount?" is among the top customer inquiries at any water utility. The `ConceptoConTarifasFacturadas` DTO provides the full tariff-to-concept mapping needed for automated bill explanation. **HIGH**

3. **Implement response caching for reference data** -- Operations like `getConceptos`, `getTarifasVigente`, and all geographic lookups return data that changes infrequently (monthly at most). Caching these responses in Rails with a 24-hour TTL would reduce SOAP call volume by an estimated 40-60% and improve response times. **HIGH**

4. **Complete the chart data pair by integrating `getLecturasParaGraficas`** -- `getConsumosParaGraficas` is already integrated but its counterpart for readings is not. Adding it provides symmetrical chart capabilities for both consumption and raw readings, which are distinct data points customers need to understand their usage. **HIGH**

### MEDIUM Priority

5. **Integrate `cambiarMovilNotificacionContrato` for SMS notification management** -- This is the natural extension of the already-integrated email notification change. The operation is simple (4 parameters: contrato, nif, movil, usuario) and follows the same mutation pattern. Given mobile preference in Mexico, SMS notifications may be more valued than email. **MEDIUM**

6. **Add service intervention history via `getActuaciones`** -- Returns `Actuacion[]` with `fechaActuacion`, `motivoActuacion`, and `tipoActuacion`. This enables customers to track past service visits and interventions, reducing "what happened with my service request?" inquiries to human agents. **MEDIUM**

7. **Build a contract identification flow using `getContratosPorNif` + `getTitularPorNif`** -- Before customers can access consumption or billing data, they need to identify which contract they are asking about. Currently this identification happens outside the API. A proper flow would: (1) look up contracts by NIF, (2) verify holder identity, (3) let the customer select their contract, then (4) proceed to consumption/billing queries. **MEDIUM**

8. **Expose `getTarifasVigente` for rate schedule transparency** -- Publishing the full active tariff schedule builds customer trust and reduces rate-related inquiries. The operation takes `explotacion` + `tipoConcepto` (IDShortShort) + `idioma` and returns all active tariffs. This is a good candidate for a public (non-authenticated) display. **MEDIUM**

9. **Address the "emailAntigo" typo in WSDL** -- The `cambiarEmailNotificacionPersona` operation has a known typo in the parameter name: `emailAntigo` instead of `emailAntiguo`. The `cea.js` implementation already handles this correctly, but it should be documented as a permanent WSDL quirk that all future clients must respect. **MEDIUM**

### LOW Priority

10. **Defer banking operations until regulatory review** -- `cambiarDomiciliacionBancaria` and `getNumeroCuentaBancaria` touch financial payment data. These require PCI-DSS considerations, additional authentication layers, and possibly regulatory approval before exposing through a chatbot or self-service portal. **LOW**

11. **Geographic reference data can be bulk-imported rather than queried live** -- The 9 geographic operations (`getPaises`, `getProvincia`, `getComunidadesDePais`, `getPoblacionesDeProvincia`, `getLocalidadesDePoblacion`, `getCallesPorPatron`, `getProvinciasDeComunidad`) return relatively static data. Rather than integrating each as a live API call, consider a periodic sync job that imports this data into AGORA's local database. **LOW**

12. **Admin/config operations should remain internal** -- `cambiarUrlOficinaVirtualExplotacion`, `cambiarUrlOficinaVirtualSociedad`, and `getIdiomaExplotacion` are system administration operations with no customer-facing value. These should only be integrated if an admin panel is built. **LOW**

---

## Integration Readiness Score: 5/10

### Scoring Breakdown

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Current Integration Coverage** | 3/10 | Only 8 of 47 operations (17%) are integrated |
| **Proxy Infrastructure** | 8/10 | Rails SOAP proxy is proven, WS-Security works, `cea.js` patterns are established |
| **DTO Complexity** | 6/10 | Most DTOs are flat; `Tarifa` hierarchy is deeply nested but manageable |
| **Authentication** | 7/10 | WS-Security pattern is solved for 4 operations; extension is straightforward |
| **Scalability** | 3/10 | No pagination, no date filtering, unbounded arrays -- requires client-side mitigation |
| **Data Model Documentation** | 7/10 | WSDL is well-structured; 24 complex types are fully defined with clear field semantics |
| **Error Handling** | 4/10 | No fault definitions in WSDL; error behavior is undocumented beyond simple return codes |
| **Test Coverage** | 4/10 | Integration tested manually (Feb 2026); no automated test suite |

### Key Risks

1. **Scalability**: The complete absence of pagination means response sizes grow unbounded with contract history length
2. **Error opacity**: Return codes from mutation operations (`short`, `int`, `string`) lack documented semantics -- what does return code `0` vs `1` vs `-1` mean?
3. **No schema versioning**: The WSDL has no version attribute; breaking changes would require coordinated updates
4. **Single-threaded access**: All 47 operations share one endpoint, creating a potential bottleneck under load
