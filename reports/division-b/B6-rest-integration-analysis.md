# B6 - REST API & AGORA Integration Layer Analysis

## Executive Summary

The AquaCIS integration architecture connects the AGORA citizen engagement platform (Vue 3 + Rails 7) to CEA Queretaro's legacy water utility system (AquaCIS/Aquasis) through a dual-protocol integration layer: a small CEA REST API for case management events and a comprehensive SOAP API surface of 126 operations across 5 service domains. Of those 126 SOAP operations, only 17 are currently integrated (13.5%), leaving significant untapped capability. The architecture employs a Rails proxy controller (`cea_proxy_controller.rb`) to forward SOAP/REST requests from the Vue frontend, avoiding CORS issues and centralizing credential management. However, the proxy pattern introduces a triple-hop latency chain (Browser -> Rails -> CEA/Aquasis), SOAP XML is constructed client-side in JavaScript (a security anti-pattern), WS-Security credentials are exposed via `VITE_` environment variables (bundled into the frontend), and error handling relies heavily on console logging with limited user-facing feedback. Active bugs in the work order flow -- missing WS-Security headers on `crearOrdenTrabajo`, incorrect `otClassID` in `refreshData`, and absent `operationalSiteID` -- confirm the integration is still maturing. The architecture is functional for its current scope but will require substantial hardening for production-grade reliability.

**Integration Architecture Score: 4/10**

---

## REST API Inventory

### CEA REST API

The REST API is minimal -- a single base endpoint at `https://appcea.ceaqueretaro.gob.mx/ceadevws/` serving as a case management event bus. All requests use the `PUT` method with an event-driven payload structure.

| # | Endpoint | Event Name | Method | Purpose |
|---|----------|------------|--------|---------|
| 1 | `/ceadevws/` | `terminar_reporte_caso` | PUT | Close/terminate a case in CEA's case management system |
| 2 | `/ceadevws/` | `asigna_orden_aquacis` | PUT | Link an Aquasis work order ID to a CEA case |
| 3 | `/ceadevws/` | `anular_reporte_caso` | PUT | Cancel/annul an existing case |

**Design Pattern:** All three operations share a single URL and HTTP method, differentiated only by the `evento` field in the JSON body. This is an event-dispatch pattern rather than a RESTful resource-oriented design.

**Payload Structure (common):**
```json
{
  "evento": "<event_name>",
  "data": {
    "caso_sn": "",
    "sn_code": "",
    "sn_notes": "",
    "sys_id": "",
    "orden_aquacis": ""
  }
}
```

Fields are selectively populated depending on the event; unused fields are sent as empty strings rather than omitted.

**Rails Proxy Path:** `/api/v1/cea/rest`

### SOAP API Surface (via Rails Proxy)

The SOAP services are proxied through Rails at `/api/v1/cea/soap/:service`. Five service endpoints are available:

| # | Service | Rails Proxy Path | Total Ops | Integrated | Domain |
|---|---------|-----------------|:---------:|:----------:|--------|
| 1 | InterfazGenericaContratacionWS | `/api/v1/cea/soap/InterfazGenericaContratacionWS` | 53 | 4 | Contracts, invoicing, customer processes |
| 2 | InterfazGenericaGestionDeudaWS | `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS` | 13 | 1 | Debt queries, payments, collection |
| 3 | InterfazGenericaContadoresWS | `/api/v1/cea/soap/InterfazGenericaContadoresWS` | 4 | 1 | Meter data, service point lookups |
| 4 | InterfazOficinaVirtualClientesWS | `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` | 47 | 8 | Readings, consumption, invoices, tariffs, customer data |
| 5 | InterfazGenericaOrdenesServicioWS | `/api/v1/cea/soap/InterfazGenericaOrdenesServicioWS` | 9 | 3 | Work order creation, visits, resolution |

**Integrated SOAP Operations (17 total):**

| Service | Operation | Auth Required | Purpose |
|---------|-----------|:------------:|---------|
| Contracts | `consultaDetalleContrato` | No | Full contract detail (meter serial extraction) |
| Contracts | `getContrato` | No | Basic contract info with options |
| Contracts | `getContratos` | Yes (WS-Security) | Search contracts with filters |
| Contracts | `getPdfFactura` | Yes (WS-Security) | Invoice PDF as base64 |
| Debt | `getDeuda` | Yes (WS-Security) | Debt summary by identifier |
| Meters | `getPuntoServicioPorContador` | No | Service point lookup by meter serial |
| Readings | `cambiarEmailNotificacionPersona` | No | Change notification email |
| Readings | `cambiarPersonaNotificacionContrato` | Yes (WS-Security) | Change notification person |
| Readings | `cambiarTipoFacturaContrato` | Yes (WS-Security) | Change invoice type |
| Readings | `getConceptos` | No | Billing concepts catalog |
| Readings | `getConsumos` | Yes (WS-Security) | Consumption data |
| Readings | `getConsumosParaGraficas` | No | Chart-formatted consumption |
| Readings | `getFacturas` | No | Invoices list |
| Readings | `getLecturas` | Yes (WS-Security) | Meter readings history |
| Readings | `getTarifaDeAguaPorContrato` | No | Water rate for contract |
| Work Orders | `crearOrdenTrabajo` | Yes (WS-Security)* | Create work order |
| Work Orders | `informarVisita` | Yes (WS-Security) | Report a visit |
| Work Orders | `resolveOT` | Yes (WS-Security) | Resolve/close work order |

*Note: WS-Security was missing from `crearOrdenTrabajo` at time of analysis and identified as a bug requiring a fix.

---

## AGORA Architecture

### Frontend (Vue 3)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Vue.js 3 (Composition API) | Reactive UI with `<script setup>` pattern |
| State Management | Pinia | Predictable state mutations |
| Build Tool | Vite | HMR, tree-shaking, dev proxy |
| Styling | Tailwind CSS | Utility-first CSS with WCAG 2.1 AA compliance |
| Real-time | Action Cable (WebSocket) | Live messaging, presence indicators |

**Key Frontend Files for CEA Integration:**

| File | Purpose |
|------|---------|
| `app/javascript/dashboard/api/cea.js` | All SOAP/REST API functions, XML envelope construction, XML-to-JSON parsing |
| `app/javascript/dashboard/routes/dashboard/tickets/GenerateOrderModal.vue` | Order creation modal with full Aquasis integration flow |
| `app/javascript/dashboard/routes/dashboard/tickets/TicketDetails.vue` | Displays Aquasis order ID badge |
| `app/javascript/dashboard/routes/dashboard/orders/OrdersList.vue` | Aquasis ID column, sync warning icons |
| `app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue` | Aquasis data display, refresh, resync button |
| `app/javascript/dashboard/api/serviceOrders.js` | Local service order CRUD + resync endpoint |

**Frontend Pattern for SOAP Calls:**
The frontend constructs raw SOAP XML envelopes as JavaScript template literals in `cea.js`, posts them through the Rails proxy, receives XML responses, and parses them client-side using `DOMParser` and a custom `xmlToJson` converter. This is the central integration module -- approximately 500+ lines of code handling all 17 integrated operations.

### Backend (Rails 7)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Ruby on Rails 7 | API-mode backend |
| Database | PostgreSQL 15+ | Primary data store, JSONB, full-text search |
| Cache | Redis 7+ | Session, real-time pub/sub, caching |
| Jobs | Sidekiq Enterprise | Async processing, webhooks, campaigns |
| Server | Puma | Multi-threaded HTTP server |
| Search | OpenSearch | Full-text search across conversations |
| AI | pgvector + LLM layer | Semantic search, response suggestions |

**Key Backend Files for CEA Integration:**

| File | Purpose |
|------|---------|
| `app/controllers/api/v1/cea_proxy_controller.rb` | SOAP/REST proxy to CEA endpoints |
| `app/controllers/api/v1/accounts/tickets_controller.rb` | `create_service_order` action, accepts `aquasis_order_id` |
| `app/controllers/api/v1/accounts/service_orders_controller.rb` | Service order CRUD with `aquasis_order_id`, `aquasis_exploitation_code` |
| `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder` | JSON serialization of service orders (includes Aquasis fields) |
| `db/migrate/20260211000001_add_aquasis_order_id_to_service_orders.rb` | Adds `aquasis_order_id` column + index |
| `db/migrate/20260213060000_add_aquasis_exploitation_code_to_service_orders.rb` | Adds `aquasis_exploitation_code` column |

### Component Interaction Diagram

```
+-------------------+     +------------------+     +------------------------+
|   Vue 3 Frontend  | --> |  Rails 7 Backend | --> |  CEA / Aquasis Servers |
|                   |     |                  |     |                        |
| cea.js            |     | cea_proxy_       |     | SOAP: aquacis-cf.      |
|  - XML builders   |     |   controller.rb  |     |   ceaqueretaro.gob.mx  |
|  - XML parsers    |     |  - HTTParty      |     |                        |
|  - xmlToJson()    |     |  - forwards body |     | REST: appcea.          |
|                   |     |  - returns resp.  |     |   ceaqueretaro.gob.mx  |
| GenerateOrder     |     |                  |     |                        |
|   Modal.vue       |     | tickets_         |     | 5 SOAP services        |
| OrderDetails.vue  |     |   controller.rb  |     | 1 REST event endpoint  |
| OrdersList.vue    |     | service_orders_  |     |                        |
|                   |     |   controller.rb  |     |                        |
+-------------------+     +------------------+     +------------------------+
```

---

## Proxy Architecture

### How REST-to-SOAP Translation Works

The translation is NOT performed by the Rails backend. Instead, the architecture uses a **passthrough proxy** pattern:

1. **Frontend builds SOAP XML:** The Vue frontend (`cea.js`) constructs complete SOAP envelopes as string templates, including all namespaces, WS-Security headers, and parameter values.

2. **Frontend POSTs to Rails proxy:** The XML is sent as the request body with `Content-Type: text/xml;charset=UTF-8` to `/api/v1/cea/soap/:service_name`.

3. **Rails proxy forwards verbatim:** The `cea_proxy_controller.rb` takes the raw XML body and forwards it using HTTParty to the actual Aquasis endpoint URL, preserving the Content-Type header.

4. **Response returned as-is:** The raw XML response from Aquasis flows back through Rails to the frontend without transformation.

5. **Frontend parses XML:** The Vue code uses `DOMParser` to parse the SOAP response XML and a custom `xmlToJson()` function to extract structured data.

For REST calls, the pattern is similar but with JSON payloads:
- Frontend builds JSON payload with `evento` and `data` fields
- PUT to `/api/v1/cea/rest`
- Rails proxy forwards to `https://appcea.ceaqueretaro.gob.mx/ceadevws/`
- Response returned to frontend

### Proxy URL Mapping

| Rails Proxy Path | Target URL |
|-----------------|------------|
| `/api/v1/cea/soap/InterfazGenericaContratacionWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS` |
| `/api/v1/cea/soap/InterfazGenericaOrdenesServicioWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS` |
| `/api/v1/cea/soap/InterfazGenericaContadoresWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS` |
| `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS` |
| `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS` |
| `/api/v1/cea/rest` | `https://appcea.ceaqueretaro.gob.mx/ceadevws/` |

### Development vs. Production Proxy

In **development**, Vite provides an additional proxy layer:

```javascript
// vite.config.ts
server: {
  proxy: {
    '/ceadevws': {
      target: 'https://appcea.ceaqueretaro.gob.mx',
      changeOrigin: true,
      secure: false,
    },
    '/aquacis-cea': {
      target: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/aquacis-cea/, ''),
    },
  },
}
```

In **production**, the Vite proxy does not exist. The documentation identifies three options:
- **Option A:** Traefik/Nginx reverse proxy
- **Option B:** Rails Proxy Controller (currently implemented)
- **Option C:** Direct URLs with CORS (requires CEA server changes)

The production deployment uses Option B -- the Rails `cea_proxy_controller.rb`.

---

## Authentication Flow

### End-to-End Auth Chain

The authentication model has three distinct layers that operate independently:

```
AGORA User        Rails Session         WS-Security
  Login    ------>  JWT/Cookie   ------> (hardcoded)
                                         Username: WSGESTIONDEUDA
                                         Password: WSGESTIONDEUDA
```

**Layer 1: AGORA User Authentication**
- Users authenticate to AGORA via standard Rails session (JWT/cookie)
- Supports SSO (SAML 2.0, OAuth 2.0), MFA, Active Directory integration
- This authenticates the human agent, NOT the SOAP service calls

**Layer 2: Rails API Authentication**
- The Rails proxy endpoint at `/api/v1/cea/soap/:service` is protected by AGORA's standard API authentication
- Only authenticated AGORA users can trigger SOAP calls through the proxy

**Layer 3: WS-Security to Aquasis**
- Operations requiring authentication use WS-Security `UsernameToken` headers
- Credentials are hardcoded: username `WSGESTIONDEUDA`, password `WSGESTIONDEUDA`
- These are shared service account credentials, NOT per-user credentials
- Exposed in frontend via `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` environment variables

**Critical Security Issue:** The WS-Security credentials are:
1. Hardcoded as the same username/password (`WSGESTIONDEUDA` / `WSGESTIONDEUDA`)
2. Exposed to the browser via `VITE_` prefixed environment variables (Vite bundles these into the client-side JavaScript)
3. Embedded directly into SOAP XML envelopes built in the frontend

**WS-Security Header Pattern (from `cea.js`):**
```xml
<wsse:Security mustUnderstand="1"
    xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <wsse:UsernameToken wsu:Id="UsernameToken-WSGESTIONDEUDA">
        <wsse:Username>WSGESTIONDEUDA</wsse:Username>
        <wsse:Password Type="...#PasswordText">WSGESTIONDEUDA</wsse:Password>
    </wsse:UsernameToken>
</wsse:Security>
```

**Operations Requiring WS-Security:**
`getContratos`, `getPdfFactura`, `getDeuda`, `getLecturas`, `getConsumos`, `cambiarPersonaNotificacionContrato`, `cambiarTipoFacturaContrato`, `resolveOT`, `informarVisita`, `crearOrdenTrabajo`

---

## Case Management

### Case Lifecycle in the Integration

CEA uses a case/ticket management system that integrates with AGORA tickets. Cases flow through these states:

```
[CEA Case Created] --> [Assigned to AGORA Ticket]
                            |
                            v
                    [Aquasis Order Linked]  <-- asigna_orden_aquacis
                            |
                            v
                    [Work in Progress]
                            |
               +------------+------------+
               |                         |
               v                         v
     [terminar_reporte_caso]    [anular_reporte_caso]
       (Close/Complete)           (Cancel/Annul)
```

### Case-Order Linking

The critical integration point is **Step 5** of the work order creation flow:

1. A ticket in AGORA has a `caso_sn` or `sys_id` in its metadata/custom_attributes
2. When an Aquasis work order is created (e.g., `O4514415`), the system calls the REST API with `evento: "asigna_orden_aquacis"` to link the order to the case
3. This allows CEA's case management to track which Aquasis work orders correspond to which reported cases

### Case Management REST API Events

| Event | Fields Used | Purpose |
|-------|------------|---------|
| `terminar_reporte_caso` | `caso_sn`, `sn_code`, `sn_notes` | Close a case with status code and notes |
| `asigna_orden_aquacis` | `sys_id`, `orden_aquacis` | Link an Aquasis order to a case |
| `anular_reporte_caso` | `caso_sn` | Cancel a case |

### Ticket Custom Attributes for Case Linking

The source of the case identifier comes from AGORA ticket metadata:
- `ticket.custom_attributes.caso_sn`
- `ticket.custom_attributes.sys_id`
- `ticket.metadata.caso_sn`
- `ticket.metadata.sys_id`

If none of these are present, the case linking step (Step 5) is silently skipped.

---

## End-to-End Flows

### Flow 1: Service Order Creation (Primary User Journey)

This is the most complex and critical integration flow, involving 5 sequential API calls across 3 different services plus the AGORA internal API.

```
User Action: Agent clicks "Create Service Order" on a ticket
                    |
                    v
Step 1: consultaDetalleContrato(contractNum)
  - Service: InterfazGenericaContratacionWS
  - Purpose: Get meter serial number (numeroContador)
  - Input: Contract number from ticket
  - Output: GenericoContratoDTO with numeroContador and explotacion
                    |
                    v
Step 2: getPuntoServicioPorContador(meterSerial)
  - Service: InterfazGenericaContadoresWS
  - Purpose: Resolve meter serial to service point ID
  - Input: Meter serial from Step 1
  - Output: PuntoServicioDTO.id (idPtoServicio = "632744")
                    |
                    v
Step 3: crearOrdenTrabajo(payload)
  - Service: InterfazGenericaOrdenesServicioWS
  - Purpose: Create work order in Aquasis
  - Input: tipoOrden, motivoOrden, numContrato, idPtoServicio (from Step 2),
           fechaCreacionOrden, fechaEstimdaFin, observaciones, etc.
  - Output: Order code string (e.g., "O4514415")
                    |
                    v
Step 4: POST /api/v1/accounts/:id/tickets/:id/create_service_order
  - Service: AGORA Rails API (internal)
  - Purpose: Persist local service order record
  - Input: order_type, order_motive_id, aquasis_order_id, aquasis_exploitation_code
  - Output: Local service order record
                    |
                    v
Step 5: PUT /api/v1/cea/rest (evento: asigna_orden_aquacis)
  - Service: CEA REST API
  - Purpose: Link Aquasis order to CEA case
  - Input: sys_id (case ID from ticket metadata), orden_aquacis (from Step 3)
  - Output: Acknowledgment (non-blocking)
```

**Total API calls per order creation: 5** (3 SOAP + 1 Rails + 1 REST)

### Flow 2: Contract Detail Lookup

```
User Action: Agent views a ticket with a contract number
                    |
                    v
consultaDetalleContrato(contractNum)
  - Returns: Full contract data (titular, address, meter info, payment data)
  - Also calls: getDeuda, getLecturas, getConsumos in parallel for dashboard display
```

### Flow 3: Work Order Status Check (refreshData)

```
User Action: Agent opens an order detail view with Aquasis ID
                    |
                    v
refreshDataJson(orderCode, exploitationCode)
  - Service: InterfazGenericaOrdenesServicioWS
  - Purpose: Get full order state from Aquasis
  - Returns: OT object with otData, clientData, otElements, otReadings,
             otCustomerUnpaidBills, otCustomerDebt, otComments
```

### Flow 4: Work Order Resolution

```
User Action: Agent resolves a work order
                    |
                    v
resolveOT(resolutionData)
  - Service: InterfazGenericaOrdenesServicioWS (WS-Security required)
  - Input: OTResolution with resolution metadata, meter elements,
           equipment changes, visit comments, geolocalization
  - Output: boolean success
                    |
                    v
PUT /api/v1/cea/rest (evento: terminar_reporte_caso)
  - Links resolution back to CEA case
```

### Flow 5: Resync Failed Order (Recovery Flow)

```
User Action: Agent clicks "Reintentar sincronizacion con Aquasis" button
                    |
                    v
Repeats Steps 1-5 of Flow 1 using stored order metadata
  - Gets contract detail for meter serial
  - Resolves service point ID
  - Creates new Aquasis order
  - Updates local record with aquasis_order_id
  - Links to CEA case
```

---

## Error Handling

### Error Propagation Through Layers

```
Aquasis SOAP Fault
  |
  v
Raw XML returned through Rails proxy (no transformation)
  |
  v
Frontend DOMParser detects <soap:Fault>
  |
  v
Error logged to console.error()
  |
  v
User sees: generic warning OR error message (depends on component)
```

### SOAP Error Patterns

| Aquasis Error | Cause | Frontend Behavior |
|---------------|-------|-------------------|
| `java.lang.NullPointerException` | Missing `idPtoServicio` in `crearOrdenTrabajo` | Local order created WITHOUT `aquasis_order_id`, console warning |
| "Parametro explotacion no informado" | Missing `operationalSiteID` in `refreshData` | `aquasisError` ref set, error banner shown |
| 401 Unauthorized | Missing or invalid WS-Security headers | Console error, operation fails silently |
| 404 Not Found | Wrong endpoint URL or proxy misconfiguration | Console error |
| 500 Internal Server Error | Various Aquasis-side issues | SOAP Fault XML parsed, error surfaced |

### Error Handling by Scenario

| Scenario | Behavior |
|----------|----------|
| No `contract_number` on ticket | Skip Aquasis entirely, create local order only |
| Contract detail fetch fails | Skip `idPtoServicio` lookup, attempt order creation anyway (will fail with NullPointerException) |
| Meter lookup fails | `idPtoServicio` will be empty, `crearOrdenTrabajo` fails |
| `crearOrdenTrabajo` SOAP fault | Local order created WITHOUT `aquasis_order_id`, user sees: "Orden local creada pero no se pudo registrar en Aquasis" |
| `referenceWorkOrderAquacis` fails | Logged to console, does NOT block the flow |
| No `caso_sn`/`sys_id` on ticket | Step 5 is silently skipped |
| `refreshData` fails | Error banner displayed in OrderDetails view |

### Critical Gaps in Error Handling

1. **No retry mechanism for transient failures** - Network timeouts, temporary Aquasis unavailability, etc. result in permanent failure until manual resync
2. **Console-only logging** - Most SOAP errors are logged to `console.error()` with no server-side audit trail
3. **Graceful degradation creates data inconsistency** - When `crearOrdenTrabajo` fails, a local order exists without an Aquasis counterpart, requiring manual resync
4. **No circuit breaker** - If Aquasis is down, every user action that triggers SOAP calls will fail and wait for timeout
5. **Silent skips** - Missing `caso_sn`/`sys_id` causes case linking to be silently skipped with no indication to the user

---

## Performance Analysis

### Proxy Chain Latency

The request path for every SOAP call involves three network hops:

```
Browser --> Rails Proxy --> Aquasis Server --> Rails Proxy --> Browser
  (1)         (2)              (3)               (4)           (5)
```

**Estimated Latency Breakdown:**

| Hop | Description | Estimated Latency |
|-----|-------------|:-----------------:|
| 1-2 | Browser to Rails (same network/server) | 5-20ms |
| 2-3 | Rails to Aquasis (external SOAP call) | 200-2000ms |
| 3-4 | Aquasis processing + response | Included above |
| 4-5 | Rails to Browser | 5-20ms |
| **Total per call** | | **210-2040ms** |

### Service Order Creation: Worst-Case Chain

The 5-step order creation flow makes 3 sequential SOAP calls + 1 internal API + 1 REST call:

| Step | Call | Estimated Time |
|------|------|:--------------:|
| 1 | `consultaDetalleContrato` | 200-800ms |
| 2 | `getPuntoServicioPorContador` | 200-800ms |
| 3 | `crearOrdenTrabajo` | 300-1000ms |
| 4 | Internal Rails API | 50-200ms |
| 5 | CEA REST API | 200-800ms |
| **Total** | | **950-3600ms** |

In the worst case, order creation takes 3.6 seconds of sequential waiting. No parallelization is possible because each step depends on the previous step's output (meter serial from Step 1, service point ID from Step 2, order ID from Step 3).

### Performance Concerns

1. **No caching** - Contract details, meter lookups, and service point IDs are fetched fresh every time, even for the same contract
2. **No connection pooling** - Each SOAP call through the Rails proxy opens a new HTTP connection to Aquasis
3. **XML parsing overhead** - Full SOAP envelopes are parsed client-side using `DOMParser`, then converted to JSON via `xmlToJson()`
4. **No request deduplication** - Multiple agents viewing the same contract will each trigger separate SOAP calls
5. **Synchronous chain** - The 5-step order creation blocks the UI for the entire duration with no background processing option

---

## Architectural Issues

### Issue 1: Client-Side SOAP XML Construction (CRITICAL)

SOAP XML envelopes are built as JavaScript template literals in `cea.js` using string interpolation:

```javascript
export const crearOrdenTrabajo = async data => {
  const xml = `<soapenv:Envelope ...>
    <soapenv:Header>
      <wsse:Security ...>
        <wsse:Username>${xmlEscape(CEA_API_USERNAME)}</wsse:Username>
        <wsse:Password ...>${xmlEscape(CEA_API_PASSWORD)}</wsse:Password>
      </wsse:Security>
    </soapenv:Header>
    <soapenv:Body>
      <int:crearOrdenTrabajo>
        <ordenTrabajo>
          <tipoOrden>${xmlEscape(data.tipoOrden)}</tipoOrden>
          ...
```

**Problems:**
- WS-Security credentials are embedded in client-side JavaScript (visible in browser DevTools)
- XML injection risk despite `xmlEscape()` -- the function must be perfect to prevent SOAP injection
- SOAP envelope logic is frontend responsibility, violating separation of concerns
- Any change to the SOAP schema requires a frontend deployment

### Issue 2: Credentials Exposed via VITE Environment Variables (CRITICAL)

```env
VITE_CEA_API_USERNAME=WSGESTIONDEUDA
VITE_CEA_API_PASSWORD=WSGESTIONDEUDA
```

All `VITE_` prefixed variables are bundled into the client-side JavaScript by Vite's build process. Anyone with browser DevTools can extract these credentials. The username and password are identical strings, suggesting weak credential management.

### Issue 3: No API Versioning (HIGH)

- The REST API has no version prefix (bare `/ceadevws/`)
- The SOAP services use fixed WSDL contracts with no versioning mechanism
- The Rails proxy path `/api/v1/cea/soap/:service` has an `v1` prefix, but the actual SOAP payloads are unversioned
- Breaking changes in Aquasis WSDL would cascade to all AGORA deployments simultaneously

### Issue 4: Passthrough Proxy Without Validation (HIGH)

The Rails `cea_proxy_controller.rb` forwards raw XML without:
- Validating the SOAP envelope structure
- Checking that the service name is in an allowlist
- Rate limiting per user/operation
- Logging the operation type for auditing
- Transforming or sanitizing the payload

### Issue 5: Tight Coupling Between Frontend and SOAP Schema (MEDIUM)

The Vue frontend directly understands Aquasis SOAP DTOs:

```javascript
contractDetail.GenericoContratoDTO.contrato.numeroContador
meterJson.puntosServicioContadorDTO.PuntosServicioContadorDTO.puntoServicioDTO.PuntoServicioDTO.id
```

These deeply nested extraction paths mean any DTO structure change in Aquasis requires frontend code changes. The Rails backend provides no data mapping or abstraction layer.

### Issue 6: Inconsistent Error Response Patterns (MEDIUM)

- Aquasis uses two different `ResultadoDTO` types (lowercase `resultadoDTO` with `int codigoError` and PascalCase `ResultadoDTO` with `string codigoError`)
- SOAP faults vs. application-level errors are handled differently
- The REST API error format is not documented
- The WSDL contains a typo (`reultado` duplicate field in `getDeuda` response)

### Issue 7: 86.5% of API Surface Unused (MEDIUM)

Only 17 of 126 available operations are integrated. High-value operations remain unused:
- **Payment processing** (`cobrarReferencia`, `avisarPago`) - could enable online payments
- **Invoice PDFs** (`getPdfDocumentoFactura`, `getDocumentoPago`) - only `getPdfFactura` is integrated
- **Meter management** (`actualizarContador`, `getCambiosContadorDeContrato`) - no meter update capability
- **Customer self-service** (`solicitudAltaSuministro`, `solicitudBajaSuministro`) - no supply management
- **Bulk operations** (`solicitudFacturasMasiva`, `multipleRefreshData`) - no batch processing

### Issue 8: Identified Active Bugs (HIGH)

Per the design document `2026-02-13-aquasis-order-fixes-design.md`:

1. **`crearOrdenTrabajo` missing WS-Security headers** - Causes `NullPointerException` (500 error)
2. **`refreshData` wrong `otClassID` (0 instead of 1)** and missing `operationalSiteID` - Causes "Parametro explotacion no informado"
3. **No resync UI** - When Aquasis order creation fails, no way to retry

---

## Recommendations

### R1: Move SOAP Construction to Rails Backend (HIGH)

**Current:** Frontend builds SOAP XML, sends through passthrough proxy.
**Recommended:** Rails controller builds SOAP XML using a library like Savon or Wash_out, accepts clean JSON from the frontend, returns transformed JSON responses.

**Benefits:**
- Credentials never leave the server
- SOAP schema changes require only backend deployment
- Server-side validation and sanitization
- Proper audit logging
- Simplified frontend code

**Effort:** High (requires rewriting `cea.js` functions as Rails service classes and updating all frontend callers)

### R2: Remove Credentials from Frontend Bundle (HIGH)

**Current:** `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` in client bundle.
**Recommended:** Store credentials in Rails `credentials.yml.enc` or environment variables without the `VITE_` prefix. Only the Rails backend should access these.

**Benefits:** Credentials no longer visible in browser DevTools or source maps.

**Effort:** Low (move env vars, update `cea_proxy_controller.rb` to inject credentials)

### R3: Implement Request Caching for Read Operations (HIGH)

**Current:** Every contract lookup, meter lookup, and consumption query hits Aquasis live.
**Recommended:** Cache read-only responses in Redis with TTLs:
- Contract details: 5-minute cache
- Service point lookups: 1-hour cache (rarely changes)
- Consumption/readings: 15-minute cache
- Catalogs (order types, repair codes): 24-hour cache

**Benefits:** Reduces Aquasis load, improves response times from 200-800ms to <10ms for cached data.

**Effort:** Medium

### R4: Add Circuit Breaker and Retry Logic (HIGH)

**Current:** No fault tolerance; every call is fire-once.
**Recommended:** Implement circuit breaker pattern (e.g., using a gem like `circuitbox` or `stoplight`) for Aquasis calls. Add automatic retries with exponential backoff for transient failures.

**Benefits:** Prevents cascade failures when Aquasis is down, enables recovery from transient errors.

**Effort:** Medium

### R5: Implement Server-Side Audit Logging (MEDIUM)

**Current:** SOAP errors logged to browser `console.error()` only.
**Recommended:** Log all SOAP operations (request type, contract number, success/failure, response time) in Rails. Use structured logging compatible with SIEM integration.

**Benefits:** Compliance audit trail, debugging capability, performance monitoring.

**Effort:** Low

### R6: Add Proxy Validation and Rate Limiting (MEDIUM)

**Current:** Passthrough proxy with no validation.
**Recommended:**
- Allowlist of valid service names
- Rate limiting per user per operation (e.g., max 10 order creations per hour per agent)
- Request size limits
- Timeout enforcement (e.g., 30-second max per SOAP call)

**Benefits:** Prevents abuse, improves reliability, limits blast radius of frontend bugs.

**Effort:** Medium

### R7: Build Data Abstraction Layer (MEDIUM)

**Current:** Frontend directly parses Aquasis DTOs like `GenericoContratoDTO.contrato.numeroContador`.
**Recommended:** Rails service classes that map Aquasis DTOs to a clean, stable internal API format. Frontend only knows the internal format.

**Benefits:** Isolates frontend from Aquasis schema changes, simplifies frontend code, enables response validation.

**Effort:** High

### R8: Parallelize Independent SOAP Calls (MEDIUM)

**Current:** Steps 1-2 of order creation (contract detail + meter lookup) are sequential but could be partially parallelized if the contract number and meter serial are already known.
**Recommended:** Cache meter serials per contract. On subsequent order creations for the same contract, skip Step 1 and go directly to Step 2.

**Benefits:** Reduces order creation time by 200-800ms for repeat contracts.

**Effort:** Low

### R9: Integrate High-Value Unused Operations (LOW)

**Priority operations to integrate next:**
1. `getImpagadosContrato` - Show unpaid invoices directly in the agent view
2. `getDocumentoPago` - Generate payment documents for citizens
3. `getCambiosContadorDeContrato` - Meter change history for field operations
4. `refreshData` / `multipleRefreshData` - Bulk work order status checks
5. `consultaHistoricoActuacionesContrato` - Contract action history for context

**Benefits:** Richer agent experience, fewer system switches.

**Effort:** Low per operation (patterns already established)

### R10: Implement API Versioning Strategy (LOW)

**Recommended:** Version the Rails proxy API and maintain backward compatibility. Document WSDL version expectations per deployment. Consider WSDL change detection (hash comparison) in CI/CD.

**Benefits:** Safe evolution of the integration layer.

**Effort:** Low

---

## Integration Architecture Score: 4/10

| Dimension | Score | Notes |
|-----------|:-----:|-------|
| **Functionality** | 5/10 | 17 of 126 operations integrated; core flows work but limited coverage |
| **Security** | 2/10 | Credentials in frontend bundle, client-side SOAP construction, no validation |
| **Reliability** | 3/10 | No retry logic, no circuit breaker, active bugs in work order flow |
| **Performance** | 4/10 | Triple-hop latency, no caching, sequential SOAP chains |
| **Maintainability** | 4/10 | Tight coupling to SOAP DTOs, XML templates in JavaScript, limited abstraction |
| **Observability** | 3/10 | Console-only error logging, no server-side operation audit trail |
| **Scalability** | 4/10 | No caching, no connection pooling, no batch operations |
| **Error Handling** | 4/10 | Graceful degradation creates data inconsistency, silent failures |
| **Documentation** | 7/10 | WSDL contracts documented, integration flows documented, fix plans detailed |
| **Architecture** | 3/10 | Passthrough proxy is minimal; SOAP logic in wrong layer; no abstraction |

**Overall: 4/10** -- The integration is functional for basic operations but has significant security, reliability, and architectural issues that must be addressed before scaling. The foundation exists (proxy controller, SOAP envelope patterns, frontend API module) but needs to evolve from a prototype-grade passthrough into a proper integration layer with server-side SOAP handling, credential protection, caching, and fault tolerance.

---

*Analysis performed: 2026-02-16*
*Source files: CEA_API_REFERENCE.md, aquasis-integration.md, AGORA_Platform_Overview.md, aquasis-api-documentation.md, aquasis-wsdl-work-orders.md, aquasis-wsdl-contracts.md, aquasis-wsdl-readings.md, aquasis-wsdl-debt.md, 2026-02-13-aquasis-order-fixes-design.md, 2026-02-13-aquasis-order-fixes.md*
