# C2: API Modernization Strategy — SOAP-to-REST/GraphQL Migration for AquaCIS

**Agent:** C2 (research-api-modernization)
**Date:** 2026-02-16
**Classification:** Technical Strategy Report
**Scope:** AquaCIS SOAP service modernization for AGORA platform integration

---

## Executive Summary

AquaCIS (Aquasis) exposes **5 SOAP web services with 126 total operations** supporting water utility management for CEA Queretaro. Today, AGORA integrates only **17 of these 126 operations (13.5%)** through a Rails proxy layer at `/api/v1/cea/soap/:service`. The remaining 109 operations represent a significant untapped integration surface that will be required as AGORA expands its citizen-facing and back-office capabilities.

The current architecture has several structural weaknesses:

- **Frontend XML construction**: The Vue.js frontend directly builds SOAP XML envelopes and parses XML responses, creating tight coupling to WSDL contracts.
- **Passthrough proxy**: The Rails `cea_proxy_controller.rb` is a transparent relay with no transformation, validation, caching, or error normalization.
- **CORS-only justification**: The proxy exists solely to avoid browser CORS restrictions, adding latency without adding value.
- **Fragile error handling**: SOAP faults (e.g., `NullPointerException` for missing `idPtoServicio`) propagate raw to the frontend.
- **No API contract**: There is no OpenAPI or typed contract between the AGORA frontend and the Rails backend.

This report recommends a **Strangler Fig migration strategy** using a **Backend-for-Frontend (BFF) REST API layer** built in Rails, with **selective GraphQL adoption** for complex query scenarios (contract details with nested meters, readings, and debt). The migration should be phased over 4 stages across approximately 6-9 months, starting with the 17 already-integrated operations and expanding to cover the full 126-operation surface.

**Key recommendation**: Do NOT attempt to replace or modify the Aquasis SOAP services themselves. They are owned and operated by CEA Queretaro's vendor (Agbar/OCCAM). The modernization strategy focuses entirely on the **integration layer** between AGORA and Aquasis.

---

## 1. Migration Strategy Comparison

### 1.1 Strangler Fig Pattern — RECOMMENDED

The Strangler Fig pattern incrementally replaces legacy integration points by building new functionality alongside the old system, gradually routing traffic from old to new until the legacy layer can be removed entirely.

**How it applies to AquaCIS:**

```
Phase 1: Current State              Phase 2: Strangler Fig in Progress
┌──────────┐                        ┌──────────┐
│  Vue.js  │──SOAP XML──►Rails──►   │  Vue.js  │──REST JSON──►Rails BFF──►
│ Frontend │  (direct)   Proxy      │ Frontend │              (transforms)
└──────────┘             ║          └──────────┘              ║
                         ▼                                    ▼
                    Aquasis SOAP                         Aquasis SOAP

Phase 3: Migration Complete
┌──────────┐
│  Vue.js  │──REST/GQL──►Rails BFF──►Aquasis SOAP
│ Frontend │  (clean)    (all logic)
└──────────┘
```

| Aspect | Assessment |
|--------|------------|
| **Risk** | LOW — Old and new run in parallel; rollback is trivial |
| **Speed** | MODERATE — Can deliver incremental value in 2-week sprints |
| **Complexity** | MODERATE — Requires routing logic and feature flags |
| **Team size** | 1-2 developers can execute |
| **Best for** | Systems where you cannot modify the backend (Aquasis) |

**Pros:**
- Zero downtime during migration
- Each operation can be migrated independently
- Immediate value from first converted endpoint
- Natural prioritization: migrate the 17 integrated operations first
- Easy rollback per endpoint if issues arise
- Frontend and backend teams can work in parallel

**Cons:**
- Temporary duplication of integration logic
- Need to maintain two paths during transition
- Requires feature flags or routing configuration

### 1.2 Facade Pattern

The Facade pattern places a unified API layer in front of multiple SOAP services, providing a simplified interface without necessarily changing the underlying integration.

| Aspect | Assessment |
|--------|------------|
| **Risk** | LOW — Additive, does not change existing flows |
| **Speed** | FAST — Can be implemented quickly |
| **Complexity** | LOW — Straightforward wrapping |
| **Best for** | When you need quick API simplification |

**Pros:**
- Simplest to implement — just wrap existing SOAP calls
- Can normalize error responses immediately
- Provides single entry point for all Aquasis operations
- Natural starting point before deeper refactoring

**Cons:**
- Does not fundamentally improve the integration
- SOAP complexity leaks through unless carefully designed
- Can become a "big ball of mud" if not well-structured
- Still XML under the hood

### 1.3 Adapter Pattern

Creates service-specific adapters that translate between REST/JSON and SOAP/XML, one per Aquasis service.

| Aspect | Assessment |
|--------|------------|
| **Risk** | LOW |
| **Speed** | MODERATE |
| **Complexity** | MODERATE — One adapter per service |
| **Best for** | Well-structured SOAP services with clear domain boundaries |

**Pros:**
- Clean separation: one adapter per Aquasis service
- Each adapter encapsulates all SOAP/XML complexity
- Testable in isolation
- Maps well to Aquasis's 5-service architecture

**Cons:**
- Requires upfront design of adapter interfaces
- Cross-service operations (e.g., contract -> meter -> work order chain) need orchestration layer
- Can lead to over-abstraction

### 1.4 Wholesale Rewrite — NOT RECOMMENDED

Replace the entire integration layer at once with a new REST API.

| Aspect | Assessment |
|--------|------------|
| **Risk** | HIGH — Big bang deployment |
| **Speed** | SLOW — Months before any delivery |
| **Complexity** | HIGH — All-or-nothing |
| **Best for** | When the legacy system is being decommissioned |

**Pros:**
- Clean architecture from day one
- No maintenance of dual systems

**Cons:**
- High risk of introducing regressions across all 17 integrated operations
- No incremental value delivery
- Difficult to test comprehensively before launch
- Aquasis is NOT being decommissioned — this approach is inappropriate

### 1.5 Recommendation

**Use Strangler Fig with Adapter internals.** Build a Rails BFF (Backend-for-Frontend) that:
1. Exposes clean REST endpoints to the Vue.js frontend
2. Uses per-service Adapter classes internally (one per Aquasis WSDL)
3. Migrates one operation at a time, using feature flags
4. Eventually replaces the transparent proxy entirely

---

## 2. REST vs GraphQL Analysis for Utility CIS

### 2.1 When REST Makes Sense

REST is the right choice for **most** AquaCIS operations because:

- **CRUD-oriented operations** dominate: create work orders, get contract, submit readings
- **Simple request/response patterns**: Most operations take 2-5 parameters and return a single DTO
- **Cacheable**: Contract details, catalogs (order types, calibers, brands) are highly cacheable with HTTP caching headers
- **Team familiarity**: The AGORA team already works with Rails REST APIs
- **Tooling maturity**: OpenAPI, Swagger UI, Postman — all REST-native

**Operations best served by REST (examples):**

| REST Endpoint | Maps to SOAP Operation |
|---------------|----------------------|
| `GET /api/v2/aquasis/contracts/:id` | `consultaDetalleContrato` |
| `POST /api/v2/aquasis/work-orders` | `crearOrdenTrabajo` |
| `GET /api/v2/aquasis/meters/:serial/service-point` | `getPuntoServicioPorContador` |
| `GET /api/v2/aquasis/contracts/:id/debt` | `getDeuda` |
| `POST /api/v2/aquasis/work-orders/:id/visits` | `informarVisita` |
| `PUT /api/v2/aquasis/work-orders/:id/resolve` | `resolveOT` |
| `GET /api/v2/aquasis/contracts/:id/invoices` | `getFacturas` |
| `GET /api/v2/aquasis/contracts/:id/readings` | `getLecturas` |

### 2.2 When GraphQL Makes Sense

GraphQL is the right choice when the frontend needs to **compose data from multiple SOAP services in a single request** — which is a real scenario in utility CIS.

**The "Contract 360" problem:**

To display a full contract view in AGORA, the frontend currently makes **separate sequential calls** across 3+ SOAP services:

```
1. consultaDetalleContrato     → Contract + meter serial
2. getPuntoServicioPorContador → Service point ID + address
3. getConsumos                 → Consumption history
4. getLecturas                 → Meter readings
5. getDeuda                    → Debt summary
6. getFacturas                 → Invoice list
```

With GraphQL, this becomes a single query:

```graphql
query ContractDetail($contractNumber: Int!) {
  contract(number: $contractNumber) {
    numero
    titular
    explotacion
    meter {
      serialNumber
      brand
      model
      caliber
      servicePoint {
        id
        address
        status
        geoLocation
      }
    }
    consumption(last: 12) {
      period
      cubicMeters
      averageDaily
    }
    readings(last: 6) {
      date
      value
      type
    }
    debt {
      totalAmount
      pendingInvoices
      lastPaymentDate
    }
    invoices(last: 5) {
      number
      date
      amount
      status
      pdfUrl
    }
  }
}
```

**Operations best served by GraphQL:**

| Use Case | Why GraphQL Wins |
|----------|-----------------|
| Contract 360 view | Aggregates 5+ SOAP services in one request |
| Customer lookup (by NIF) | Contracts + debt + meters across services |
| Service point detail | Meter + readings + orders + contract at one point |
| Dashboard aggregations | Agent needs summary stats from multiple domains |
| Mobile app (future) | Bandwidth optimization via field selection |

### 2.3 Hybrid Recommendation

| Layer | Protocol | Rationale |
|-------|----------|-----------|
| **CRUD operations** | REST | Simple, cacheable, well-understood |
| **Complex queries** | GraphQL | Cross-service aggregation, frontend flexibility |
| **Mutations** | REST | Clearer error handling, simpler audit trails |
| **Catalogs/lookups** | REST | Highly cacheable with ETags |
| **Real-time updates** | WebSocket/SSE | Work order status changes (future) |

**Pragmatic approach**: Start with REST for all operations. Add a GraphQL layer on top of the REST services for composite queries once the REST foundation is stable. Libraries like `graphql-ruby` integrate cleanly with Rails and can delegate to existing REST service objects.

---

## 3. WSDL-to-OpenAPI Tools Comparison

### 3.1 Tool Overview

| Tool | Type | Quality | Notes |
|------|------|---------|-------|
| **APImatic** | SaaS | HIGH | Best automated WSDL-to-OpenAPI converter; handles complex types well. Produces OpenAPI 3.0 with proper schemas. Commercial ($). |
| **wsdl-trest (Red Hat)** | Open Source | MEDIUM | Part of Fuse/Camel ecosystem. Generates JAX-RS stubs from WSDL. Java-centric; not ideal for Rails shop. |
| **SoapUI / ReadyAPI** | Commercial | MEDIUM-HIGH | Can import WSDL and export to OpenAPI via Swagger plugin. Good for testing but export quality varies. |
| **OAS WSDL Converter** | npm package | LOW-MEDIUM | Basic conversion. Struggles with complex nested types like Aquasis DTOs. |
| **Manual conversion** | N/A | HIGHEST | Full control. Time-intensive but produces the best result for complex WSDLs. |
| **Postman** | SaaS + Desktop | MEDIUM | Can import WSDL, create collections, and export OpenAPI. Good intermediate step. |

### 3.2 Aquasis-Specific Challenges

The Aquasis WSDLs present several conversion challenges:

1. **Deep nesting**: `GenericoContratoDTO` contains `puntoSuministro` > `listaDeContadores` > `ContratoContadorDTO` — 4+ levels deep
2. **Mixed namespaces**: Operations use different XML namespaces (`occamWS.ejb.negocio.occam.agbar.com`, `interfazgenericacontadores.occamcxf.occam.agbar.com`)
3. **Overloaded types**: `ResultadoDTO` is reused across all services but with varying semantics
4. **Array encoding**: Uses both `ArrayOf_xsd_nillable_int` and inline arrays — automated tools handle these inconsistently
5. **WS-Security**: Some operations require OASIS WS-Security headers, which have no direct OpenAPI equivalent

### 3.3 Recommended Approach

**Do NOT attempt fully automated WSDL-to-OpenAPI conversion.** Instead:

1. **Use APImatic or Postman** to generate a first-pass OpenAPI spec from each WSDL
2. **Manually refine** the output, especially:
   - Flatten deeply nested DTOs into REST-friendly response schemas
   - Rename fields to English camelCase (e.g., `numeroContrato` -> `contractNumber`)
   - Add proper validation constraints (`required`, `minimum`, `pattern`)
   - Define error response schemas (standardize `ResultadoDTO` variants)
3. **Design REST resources** independently of the WSDL structure — the REST API should model the business domain, not mirror SOAP operations
4. **Document the mapping** between REST endpoints and SOAP operations for maintainability

### 3.4 Quality Ratings for Aquasis WSDLs

| Service WSDL | Auto-Convert Quality | Manual Effort | Priority |
|-------------|---------------------|---------------|----------|
| Contracts (53 ops) | LOW — Complex nested types | HIGH | Phase 1 (4 ops integrated) |
| Work Orders (9 ops) | MEDIUM — Simpler structures | MEDIUM | Phase 1 (3 ops integrated) |
| Meters (4 ops) | HIGH — Simple types | LOW | Phase 1 (1 op integrated) |
| Debt Management (13 ops) | MEDIUM — Moderate complexity | MEDIUM | Phase 2 (1 op integrated) |
| Readings/Portal (47 ops) | LOW — Large, diverse surface | HIGH | Phase 2 (8 ops integrated) |

---

## 4. API Gateway Options for SOAP Translation

### 4.1 Platform Comparison

| Feature | Kong Gateway | AWS API Gateway | Azure APIM | Apigee (Google) | Custom Rails BFF |
|---------|-------------|-----------------|------------|-----------------|-----------------|
| **SOAP-to-REST** | Via plugin (enterprise) | Limited (Lambda transform) | Native WSDL import | Native WSDL passthrough | Full control |
| **WSDL Import** | No native support | No | Yes — auto-generates REST ops | Yes — creates proxy | N/A |
| **Cost** | $$ (Enterprise) | $ (pay-per-request) | $$ (tier-based) | $$$ (premium) | Developer time only |
| **Hosting** | Self-hosted or Cloud | AWS only | Azure only | Google Cloud / hybrid | Existing Rails infra |
| **WS-Security** | Plugin required | Custom Lambda | Built-in policies | Built-in policies | Custom middleware |
| **Caching** | Built-in | Built-in (TTL) | Built-in (policies) | Built-in (policies) | Redis/Rails cache |
| **Rate Limiting** | Built-in | Built-in | Built-in | Built-in | Rack middleware |
| **Monitoring** | Vitals dashboard | CloudWatch | Azure Monitor | Analytics dashboard | APM (NewRelic, etc.) |
| **Learning Curve** | MEDIUM | LOW (if on AWS) | MEDIUM | HIGH | LOW (existing stack) |
| **Mexico Data Residency** | Self-hosted: Yes | Mexico region: limited | Mexico region: No | Google Mexico: limited | Self-hosted: Yes |

### 4.2 Evaluation for AquaCIS

**Critical considerations:**

1. **Data sovereignty**: CEA Queretaro is a government agency. Data must remain in Mexico or comply with Mexican data protection laws (Ley Federal de Proteccion de Datos Personales). Self-hosted or Mexico-region hosting is strongly preferred.

2. **Existing infrastructure**: AGORA runs on Rails with Docker containers. Adding a separate API gateway introduces operational complexity that may not be justified for the current scale.

3. **SOAP-to-REST complexity**: The Aquasis SOAP services use WS-Security, deep DTO nesting, and cross-service orchestration. No gateway handles this transparently — custom transformation logic is always needed.

4. **Team capabilities**: The team is already proficient in Rails. A Rails BFF leverages existing skills.

### 4.3 Gateway Recommendation

**Phase 1-2: Custom Rails BFF** (priority: HIGH)

Build the transformation layer directly in Rails. This is the pragmatic choice because:
- Zero additional infrastructure cost
- Full control over SOAP XML construction and response parsing
- Can handle WS-Security natively with `savon` or `wash_out` gems
- Existing deployment pipeline (Docker)
- No vendor lock-in
- Data stays on-premise

**Phase 3+ (future, if needed): Kong Gateway** (priority: LOW)

If AGORA scales to serve multiple municipalities or needs to expose public APIs, add Kong Gateway in front of the Rails BFF for:
- Rate limiting
- API key management
- Analytics
- Multi-tenant routing

Kong can be self-hosted (critical for data residency) and has a free open-source tier.

---

## 5. gRPC Consideration for Internal Communication

### 5.1 Assessment

gRPC is a high-performance RPC framework using Protocol Buffers and HTTP/2. It excels for **internal microservice-to-microservice communication** but is less suitable for browser-to-server communication.

| Criterion | gRPC Fit for AquaCIS |
|-----------|---------------------|
| Browser support | POOR — requires gRPC-Web proxy (Envoy) |
| Ruby ecosystem | FAIR — `grpc` gem exists but less mature than REST tooling |
| Performance need | NOT CRITICAL — Aquasis calls are network-bound (external SOAP), not CPU-bound |
| Team expertise | LOW — No existing gRPC experience |
| Interop with SOAP | NONE — would add a third protocol layer (SOAP -> gRPC -> REST) |

### 5.2 Recommendation: NOT RECOMMENDED for AquaCIS

gRPC does not solve any problem that REST does not already solve in this architecture. The primary bottleneck is the external SOAP call to Aquasis servers, not internal communication latency. Adding gRPC would:
- Introduce Protocol Buffers schema management alongside WSDL and OpenAPI
- Require gRPC-Web proxy for browser clients
- Add complexity without measurable performance benefit

**When gRPC would make sense**: If AGORA evolves into a microservices architecture with multiple internal services needing high-throughput, low-latency communication (e.g., a separate billing microservice communicating with a notifications microservice at high volume).

---

## 6. API Versioning Strategies

### 6.1 Options for AquaCIS Migration

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL Path Versioning** | `/api/v2/aquasis/contracts` | Simple, explicit, easy to route | URL pollution, harder to deprecate |
| **Header Versioning** | `Accept: application/vnd.aquacis.v2+json` | Clean URLs | Less visible, harder to debug |
| **Query Parameter** | `/api/aquasis/contracts?version=2` | Simple to implement | Pollutes query string |
| **No versioning (evolution)** | Additive changes only | Simplest | Requires strict backward compatibility |

### 6.2 Recommended Strategy: URL Path Versioning

```
# Current (v1) — existing SOAP proxy, untouched during migration
/api/v1/cea/soap/InterfazGenericaContratacionWS    → Raw SOAP proxy

# New (v2) — REST BFF, migrated operations
/api/v2/aquasis/contracts/:id                       → consultaDetalleContrato
/api/v2/aquasis/contracts/:id/detail                → getContrato
/api/v2/aquasis/contracts/search                    → getContratos
/api/v2/aquasis/work-orders                         → crearOrdenTrabajo (POST)
/api/v2/aquasis/work-orders/:id/visits              → informarVisita (POST)
/api/v2/aquasis/work-orders/:id/resolve             → resolveOT (PUT)
/api/v2/aquasis/meters/:serial/service-point        → getPuntoServicioPorContador
/api/v2/aquasis/contracts/:id/debt                  → getDeuda
/api/v2/aquasis/contracts/:id/readings              → getLecturas
/api/v2/aquasis/contracts/:id/consumption           → getConsumos
/api/v2/aquasis/contracts/:id/consumption/chart     → getConsumosParaGraficas
/api/v2/aquasis/contracts/:id/invoices              → getFacturas
/api/v2/aquasis/contracts/:id/concepts              → getConceptos
/api/v2/aquasis/contracts/:id/tariff                → getTarifaDeAguaPorContrato
```

### 6.3 Backward Compatibility Plan

1. **Keep v1 proxy running** throughout the entire migration — never break existing frontend code
2. **Feature flags** in Vue.js to toggle between v1 (SOAP) and v2 (REST) per operation
3. **Deprecation headers** on v1 endpoints once v2 equivalent is stable: `Deprecation: true`, `Sunset: 2026-12-31`
4. **Monitoring**: Track v1 vs v2 usage to know when v1 can be safely removed
5. **Minimum transition period**: 30 days between v2 GA and v1 removal per endpoint

---

## 7. Migration Playbook: Step-by-Step for AquaCIS

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Establish the BFF architecture and migrate the critical work order creation flow.

#### Step 1.1: Create Rails Service Objects

```ruby
# app/services/aquasis/base_client.rb
# - Savon SOAP client configuration
# - WS-Security header injection
# - Error normalization (SOAP faults -> structured errors)
# - Response XML-to-Hash transformation
# - Logging and instrumentation

# app/services/aquasis/contracts_service.rb
# - consultaDetalleContrato
# - getContrato
# - getContratos (with WS-Security)
# - getPdfFactura (with WS-Security)

# app/services/aquasis/meters_service.rb
# - getPuntoServicioPorContador

# app/services/aquasis/work_orders_service.rb
# - crearOrdenTrabajo
# - informarVisita
# - resolveOT

# app/services/aquasis/debt_service.rb
# - getDeuda

# app/services/aquasis/readings_service.rb
# - getConsumos, getConsumosParaGraficas
# - getLecturas, getFacturas
# - getConceptos, getTarifaDeAguaPorContrato
# - cambiarEmailNotificacionPersona
# - cambiarPersonaNotificacionContrato
# - cambiarTipoFacturaContrato
```

#### Step 1.2: Create REST Controllers

```ruby
# app/controllers/api/v2/aquasis/contracts_controller.rb
# app/controllers/api/v2/aquasis/work_orders_controller.rb
# app/controllers/api/v2/aquasis/meters_controller.rb
# app/controllers/api/v2/aquasis/debt_controller.rb
# app/controllers/api/v2/aquasis/readings_controller.rb
```

#### Step 1.3: Migrate the Work Order Creation Flow First

This is the most critical flow (documented in `aquasis-integration.md`):

```
Current (3 sequential SOAP calls from frontend):
Vue → SOAP(consultaDetalleContrato) → parse XML → SOAP(getPuntoServicioPorContador) → parse XML → SOAP(crearOrdenTrabajo) → parse XML

New (1 REST call from frontend):
Vue → POST /api/v2/aquasis/work-orders → Rails orchestrates all 3 SOAP calls → JSON response
```

**Critical benefit**: The multi-step orchestration (contract -> meter -> service point -> work order) moves from fragile frontend JavaScript to robust server-side Ruby with proper error handling, retry logic, and transaction management.

#### Step 1.4: Update Frontend with Feature Flag

```javascript
// app/javascript/dashboard/api/aquasis.js (new)
const USE_V2_API = window.featureFlags?.aquasisV2 ?? false;

export async function createWorkOrder(params) {
  if (USE_V2_API) {
    // Single REST call — server handles orchestration
    return axios.post('/api/v2/aquasis/work-orders', {
      contractNumber: params.numContrato,
      orderType: params.tipoOrden,
      orderReason: params.motivoOrden,
      // ... clean JSON params
    });
  } else {
    // Legacy: 3 sequential SOAP calls from frontend
    return legacyCreateWorkOrder(params);
  }
}
```

### Phase 2: Core Operations (Weeks 5-10)

**Goal**: Migrate all 17 currently integrated operations to REST.

| Priority | Operation | REST Endpoint | Service |
|----------|-----------|--------------|---------|
| P0 | `crearOrdenTrabajo` | `POST /work-orders` | Work Orders |
| P0 | `consultaDetalleContrato` | `GET /contracts/:id` | Contracts |
| P0 | `getPuntoServicioPorContador` | `GET /meters/:serial/service-point` | Meters |
| P1 | `informarVisita` | `POST /work-orders/:id/visits` | Work Orders |
| P1 | `resolveOT` | `PUT /work-orders/:id/resolve` | Work Orders |
| P1 | `getDeuda` | `GET /contracts/:id/debt` | Debt |
| P1 | `getContratos` | `GET /contracts/search` | Contracts |
| P1 | `getContrato` | `GET /contracts/:id/detail` | Contracts |
| P2 | `getLecturas` | `GET /contracts/:id/readings` | Readings |
| P2 | `getConsumos` | `GET /contracts/:id/consumption` | Readings |
| P2 | `getConsumosParaGraficas` | `GET /contracts/:id/consumption/chart` | Readings |
| P2 | `getFacturas` | `GET /contracts/:id/invoices` | Readings |
| P2 | `getConceptos` | `GET /contracts/:id/concepts` | Readings |
| P2 | `getTarifaDeAguaPorContrato` | `GET /contracts/:id/tariff` | Readings |
| P2 | `getPdfFactura` | `GET /contracts/:id/invoices/:inv/pdf` | Contracts |
| P3 | `cambiarEmailNotificacionPersona` | `PUT /customers/:nif/email` | Readings |
| P3 | `cambiarPersonaNotificacionContrato` | `PUT /contracts/:id/notification-person` | Readings |
| P3 | `cambiarTipoFacturaContrato` | `PUT /contracts/:id/invoice-type` | Readings |

### Phase 3: Expansion (Weeks 11-18)

**Goal**: Expose additional high-value operations not yet integrated.

Priority operations to add:

| Domain | Operations | Business Value |
|--------|-----------|----------------|
| **Payments** | `cobrarReferencia`, `avisarPago`, `getDocumentoPago` | Enable in-app payments |
| **Customer self-service** | `solicitudIntroduccionLectura`, `solicitudCambioTitularContrato` | Citizen portal features |
| **Invoice management** | `getFacturasContrato`, `getFacturaE`, `solicitudFacturasMasiva` | Billing visibility |
| **Meter management** | `getContador`, `getCambiosContadorDeContrato`, `actualizarContador` | Field operations |
| **Work order queries** | `refreshData`, `multipleRefreshData`, `getDocumentoOrdenTrabajo` | Work order tracking |

### Phase 4: Advanced Features (Weeks 19-26)

**Goal**: Add GraphQL layer, caching, and advanced integration patterns.

- GraphQL schema for "Contract 360" composite queries
- Redis caching for catalog data (order types, calibers, brands/models)
- Webhook/SSE for work order status changes
- OpenAPI 3.1 spec publication with Swagger UI
- Rate limiting and request throttling
- Comprehensive API analytics

---

## 8. Technology Recommendations

### 8.1 Core Stack

| Component | Technology | Rationale | Priority |
|-----------|-----------|-----------|----------|
| **SOAP Client** | `savon` gem (Ruby) | Mature, well-maintained Ruby SOAP client. Handles WSDL parsing, WS-Security, and complex types. Already compatible with Rails. | HIGH |
| **REST Framework** | Rails API mode (existing) | Leverage existing AGORA Rails application. No new infrastructure needed. | HIGH |
| **Response Serialization** | `jbuilder` or `alba` gem | `jbuilder` is already used in AGORA. `alba` is faster and more flexible for complex transformations. | HIGH |
| **API Documentation** | `rswag` gem (Swagger/OpenAPI) | Generates OpenAPI 3.0 specs from RSpec tests. Documentation stays in sync with implementation. | HIGH |
| **Caching** | Redis (via `redis-rails`) | Cache catalog responses (order types, meter brands, calibers). TTL-based invalidation. | MEDIUM |
| **Background Jobs** | Sidekiq (existing in AGORA) | For async operations: bulk invoice requests, PDF generation, payment notifications. | MEDIUM |
| **GraphQL** | `graphql-ruby` gem | When composite queries are needed. Delegates to REST service objects. | LOW |
| **HTTP Client** (for CEA REST) | `faraday` gem | For CEA REST API calls (`appcea.ceaqueretaro.gob.mx`). Connection pooling, retry logic, timeout management. | HIGH |
| **Monitoring** | Existing APM + structured logging | Log all SOAP request/response pairs for debugging. Redact sensitive data (credentials, NIF). | HIGH |
| **Testing** | RSpec + VCR + WebMock | Record and replay SOAP interactions. Essential for testing without hitting production Aquasis. | HIGH |

### 8.2 Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        AGORA Platform                               │
│                                                                      │
│  ┌─────────────┐     ┌──────────────────────────────────────────┐   │
│  │  Vue.js SPA  │────►│            Rails API (BFF)                │   │
│  │  (Frontend)  │ REST│                                           │   │
│  └─────────────┘ JSON │  ┌──────────────────────────────────┐    │   │
│                       │  │    API v2 Controllers              │    │   │
│                       │  │  /api/v2/aquasis/*                 │    │   │
│                       │  └──────────┬───────────────────────┘    │   │
│                       │             │                              │   │
│                       │  ┌──────────▼───────────────────────┐    │   │
│                       │  │    Service Objects (Adapters)      │    │   │
│                       │  │  Aquasis::ContractsService         │    │   │
│                       │  │  Aquasis::WorkOrdersService        │    │   │
│                       │  │  Aquasis::MetersService            │    │   │
│                       │  │  Aquasis::DebtService              │    │   │
│                       │  │  Aquasis::ReadingsService          │    │   │
│                       │  └──────────┬───────────────────────┘    │   │
│                       │             │                              │   │
│                       │  ┌──────────▼───────────────────────┐    │   │
│                       │  │    Aquasis::BaseClient             │    │   │
│                       │  │  - Savon SOAP client               │    │   │
│                       │  │  - WS-Security injection           │    │   │
│                       │  │  - XML↔Hash transformation         │    │   │
│                       │  │  - Error normalization              │    │   │
│                       │  │  - Logging & instrumentation       │    │   │
│                       │  │  - Response caching (Redis)        │    │   │
│                       │  └──────────┬───────────────────────┘    │   │
│                       └─────────────┼────────────────────────────┘   │
│                                     │ SOAP/XML                        │
└─────────────────────────────────────┼────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Aquasis (CEA Queretaro)                             │
│          aquacis-cf.ceaqueretaro.gob.mx/Comercial/services           │
│                                                                        │
│  ┌──────────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Contracts    │ │  Debt    │ │ Meters │ │ Readings │ │  Work    │ │
│  │  53 ops       │ │  13 ops  │ │  4 ops │ │  47 ops  │ │ Orders   │ │
│  │               │ │          │ │        │ │          │ │  9 ops   │ │
│  └──────────────┘ └──────────┘ └────────┘ └──────────┘ └──────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. CFDI / Mexican Regulatory Integration

### 9.1 CFDI (Comprobante Fiscal Digital por Internet)

CFDI is Mexico's mandatory electronic invoicing standard administered by the SAT (Servicio de Administracion Tributaria). Water utility billing must comply with CFDI requirements.

**Relevance to AquaCIS migration:**

| Aspect | Impact |
|--------|--------|
| **Invoice generation** | Aquasis `getFacturaE` and `getPdfFactura` likely already generate CFDI-compliant invoices. The REST API must preserve this compliance. |
| **PAC integration** | Timbrado (stamping) of invoices requires interaction with a PAC (Proveedor Autorizado de Certificacion). This may be handled internally by Aquasis or by CEA's billing system. |
| **Data formats** | CFDI requires specific XML schema (version 4.0 as of 2022). REST API responses should include CFDI-relevant fields: `UUID` (folio fiscal), `RFC` (tax ID), `serie`, `folio`. |
| **Retention requirements** | CFDI records must be stored for 5 years. REST API design should not alter storage behavior. |

### 9.2 SAT Web Services

The SAT provides SOAP-based web services for CFDI validation and cancellation. If AGORA needs to interact with SAT directly:

- **CFDI validation**: `https://consultaqr.facturaelectronica.sat.gob.mx/` (REST)
- **CFDI cancellation**: SOAP service requiring e.firma (electronic signature)
- **RFC validation**: SOAP/REST services for taxpayer registry lookup

**Recommendation**: Do NOT build direct SAT integration into the REST BFF unless AGORA needs to perform invoice stamping or cancellation independently of Aquasis. The current Aquasis system likely handles CFDI compliance internally.

### 9.3 Mexican Government API Standards

| Standard | Description | Relevance |
|----------|-------------|-----------|
| **DGEMM interoperability guidelines** | Federal guidelines for government system interoperability | Follow for any citizen-facing APIs |
| **Datos Abiertos** (Open Data) | Mexico's open data initiative requires certain government data to be published in machine-readable formats | Water consumption and billing aggregates may need to be published |
| **NOM-151-SCFI-2002** | Standard for electronic message conservation | Relevant for SOAP message archiving |
| **Ley Federal de Proteccion de Datos** | Personal data protection law | Governs handling of customer NIF, RFC, addresses in API responses |

### 9.4 CFDI Integration Architecture

```
┌──────────────────────────────────────────────────────┐
│                  AGORA REST BFF                        │
│                                                        │
│  Invoice endpoint: GET /contracts/:id/invoices/:inv   │
│  ├── Calls Aquasis SOAP: getPdfFactura / getFacturaE  │
│  ├── Returns: { cfdiUuid, pdf, xml, ... }             │
│  └── CFDI compliance handled by Aquasis               │
│                                                        │
│  Payment endpoint: POST /payments                      │
│  ├── Calls Aquasis SOAP: cobrarReferencia             │
│  ├── May trigger CFDI generation in Aquasis           │
│  └── Returns payment confirmation with folio fiscal   │
└──────────────────────────────────────────────────────┘
```

### 9.5 Recommendations for Mexican Context

| Recommendation | Priority |
|---------------|----------|
| Preserve all CFDI-related fields (UUID, RFC, serie, folio) in REST API responses | HIGH |
| Ensure REST API timestamps use Mexico City timezone (CST/CDT, UTC-6/-5) or UTC with proper offset | HIGH |
| Support Spanish-language error messages from Aquasis (pass `idioma: 'es'` consistently) | HIGH |
| Log all payment-related API calls for SAT audit compliance | HIGH |
| Do NOT strip or transform NIF/RFC fields — pass through exactly as received from Aquasis | MEDIUM |
| Consider CURP (Clave Unica de Registro de Poblacion) support for citizen identification | LOW |
| Evaluate Datos Abiertos requirements for publishing anonymized consumption data | LOW |

---

## 10. Risk Mitigation

### 10.1 Common Pitfalls in SOAP-to-REST Migration

| # | Pitfall | Description | Mitigation |
|---|---------|-------------|------------|
| 1 | **Mapping SOAP operations 1:1 to REST** | Creating `POST /consultaDetalleContrato` instead of `GET /contracts/:id` defeats the purpose of REST | Design REST resources around business entities (contracts, meters, orders), not SOAP operations |
| 2 | **Losing SOAP error semantics** | SOAP faults carry structured error codes; naive REST conversion loses this information | Define a standard error envelope: `{ error: { code, message, details, soapFault? } }` |
| 3 | **Breaking WS-Security** | Incorrectly implementing WS-Security in the BFF can lock out authenticated operations | Use `savon`'s built-in WSSE support; test against production endpoints early |
| 4 | **XML namespace issues** | Aquasis uses multiple namespaces; incorrect namespace handling causes silent failures | Build comprehensive integration tests with VCR cassettes from real Aquasis responses |
| 5 | **Timeout mismanagement** | Aquasis SOAP calls can be slow (especially bulk operations); frontend expects fast REST responses | Set appropriate timeouts (30s for queries, 60s for mutations); implement async patterns for bulk ops |
| 6 | **Over-engineering** | Building a full API gateway, GraphQL, gRPC, and event sourcing when simple REST suffices | Start with REST BFF only. Add complexity only when proven necessary. |
| 7 | **Ignoring the "happy path" bias** | Testing only successful responses; ignoring `NullPointerException` and other Aquasis error modes | Document and test all known error scenarios (see `aquasis-integration.md` error table) |
| 8 | **Data mapping drift** | Aquasis DTOs evolve over time (new fields, changed types); REST API falls out of sync | Version-pin WSDL contracts; add schema validation tests; monitor for unexpected XML elements |
| 9 | **Caching stale data** | Caching contract or debt data that changes frequently leads to user-facing inconsistencies | Cache only catalogs (order types, meter brands). Never cache debt, readings, or order status. |
| 10 | **Premature decommission** | Removing the v1 SOAP proxy before all consumers have migrated | Keep v1 running with deprecation warnings; monitor traffic; require zero v1 traffic for 30 days before removal |

### 10.2 AquaCIS-Specific Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Aquasis SOAP endpoint downtime | MEDIUM | HIGH | Implement circuit breaker pattern; return cached data for read operations; queue mutations for retry |
| Aquasis WSDL contract changes without notice | MEDIUM | HIGH | Pin WSDL versions; run nightly schema validation tests; maintain relationship with CEA IT team |
| WS-Security credential rotation | LOW | HIGH | Externalize credentials in environment variables; implement health check that tests authenticated operations |
| Performance degradation under load | MEDIUM | MEDIUM | Implement connection pooling in Savon; add request queuing for burst traffic; cache catalog data |
| Frontend/backend schema divergence | MEDIUM | MEDIUM | Generate TypeScript types from OpenAPI spec; use `rswag` to keep spec in sync with implementation |
| CFDI compliance issues in REST transformation | LOW | HIGH | Pass CFDI data through unchanged; never transform or reformat fiscal identifiers |

---

## 11. Timeline Framework

### Phase 1: Foundation (Weeks 1-4) — HIGH Priority

| Week | Deliverable | Details |
|------|------------|---------|
| 1 | Architecture setup | Create `Aquasis::BaseClient`, Savon configuration, WS-Security support, error handling |
| 1 | Testing infrastructure | Set up VCR cassettes from real Aquasis responses; WebMock for isolation |
| 2 | Work order flow (critical path) | `POST /api/v2/aquasis/work-orders` — orchestrates `consultaDetalleContrato` + `getPuntoServicioPorContador` + `crearOrdenTrabajo` |
| 3 | Contract and meter endpoints | `GET /contracts/:id`, `GET /meters/:serial/service-point` |
| 4 | Frontend migration for work orders | Feature flag toggle; update `GenerateOrderModal.vue` to use v2 API |

**Milestone**: Work order creation uses REST API end-to-end.

### Phase 2: Core Integration (Weeks 5-10) — HIGH Priority

| Week | Deliverable | Details |
|------|------------|---------|
| 5-6 | Remaining work order ops | `informarVisita`, `resolveOT` endpoints + frontend migration |
| 7 | Debt and contract search | `getDeuda`, `getContratos` endpoints |
| 8-9 | Readings and consumption | `getLecturas`, `getConsumos`, `getConsumosParaGraficas`, `getFacturas`, `getConceptos`, `getTarifaDeAguaPorContrato` |
| 10 | Customer management | `cambiarEmailNotificacionPersona`, `cambiarPersonaNotificacionContrato`, `cambiarTipoFacturaContrato`, `getPdfFactura` |

**Milestone**: All 17 integrated operations available as REST APIs. Frontend fully migrated off SOAP.

### Phase 3: Expansion (Weeks 11-18) — MEDIUM Priority

| Week | Deliverable | Details |
|------|------------|---------|
| 11-12 | Payment operations | `cobrarReferencia`, `avisarPago`, `getDocumentoPago`, `cancelarReferencia` |
| 13-14 | Extended contract ops | `consultaHistoricoConsumoContrato`, `consultaHistoricoActuacionesContrato`, `countFacturasContrato`, additional invoice operations |
| 15-16 | Meter and work order queries | `getContador`, `getCambiosContadorDeContrato`, `refreshData`, `multipleRefreshData`, `getDocumentoOrdenTrabajo` |
| 17-18 | OpenAPI spec + documentation | Full OpenAPI 3.1 spec, Swagger UI, developer documentation |

**Milestone**: 50+ operations available. OpenAPI spec published.

### Phase 4: Advanced (Weeks 19-26) — LOW Priority

| Week | Deliverable | Details |
|------|------------|---------|
| 19-20 | GraphQL layer | `graphql-ruby` schema for composite queries (Contract 360) |
| 21-22 | Caching and performance | Redis caching for catalogs; connection pooling optimization |
| 23-24 | Customer self-service operations | `solicitudIntroduccionLectura`, `solicitudCambioTitularContrato`, etc. |
| 25-26 | v1 proxy deprecation | Monitor v1 traffic; sunset plan; remove proxy |

**Milestone**: Full modernized API layer. v1 SOAP proxy decommissioned.

---

## 12. Recommendations Summary

| # | Recommendation | Priority | Effort | Impact |
|---|---------------|----------|--------|--------|
| 1 | **Adopt Strangler Fig pattern** for incremental migration | HIGH | LOW | HIGH |
| 2 | **Build Rails BFF** with service object adapters per Aquasis service | HIGH | MEDIUM | HIGH |
| 3 | **Migrate work order creation flow first** (highest-risk, highest-value) | HIGH | MEDIUM | HIGH |
| 4 | **Use URL path versioning** (`/api/v2/aquasis/*`) alongside existing v1 proxy | HIGH | LOW | MEDIUM |
| 5 | **Use `savon` gem** for SOAP client with WS-Security support | HIGH | LOW | HIGH |
| 6 | **Design REST resources around business entities**, not SOAP operations | HIGH | MEDIUM | HIGH |
| 7 | **Build comprehensive VCR test suite** from real Aquasis responses | HIGH | MEDIUM | HIGH |
| 8 | **Implement circuit breaker** for Aquasis service failures | HIGH | LOW | MEDIUM |
| 9 | **Preserve CFDI fields unchanged** in REST API responses | HIGH | LOW | HIGH |
| 10 | **Generate OpenAPI 3.1 spec** using `rswag` from RSpec tests | MEDIUM | MEDIUM | MEDIUM |
| 11 | **Cache catalog data in Redis** (order types, calibers, meter brands) | MEDIUM | LOW | MEDIUM |
| 12 | **Start REST-only**; add GraphQL for composite queries in Phase 4 | MEDIUM | LOW | LOW |
| 13 | **Do NOT introduce gRPC** — no performance justification | MEDIUM | N/A | N/A |
| 14 | **Do NOT deploy a separate API gateway** (Kong/Apigee) until multi-tenant is needed | MEDIUM | N/A | N/A |
| 15 | **Manual OpenAPI design** over automated WSDL conversion for quality | MEDIUM | HIGH | HIGH |
| 16 | **Feature flags** for per-operation frontend migration toggle | MEDIUM | LOW | MEDIUM |
| 17 | **Normalize error responses** with structured error envelope | MEDIUM | LOW | MEDIUM |
| 18 | **Generate TypeScript types** from OpenAPI spec for frontend type safety | LOW | LOW | MEDIUM |
| 19 | **Evaluate Kong Gateway** for multi-municipality expansion (future) | LOW | LOW | LOW |
| 20 | **Evaluate Datos Abiertos** compliance for open data publication | LOW | LOW | LOW |

---

## Appendix A: Current Integration Map

### Operations Currently Integrated (17 of 126)

| # | Service | Operation | Rails Proxy | Frontend File |
|---|---------|-----------|-------------|---------------|
| 1 | Contracts | `consultaDetalleContrato` | `/api/v1/cea/soap/InterfazGenericaContratacionWS` | `cea.js` |
| 2 | Contracts | `getContrato` | Same | `cea.js` |
| 3 | Contracts | `getContratos` (WS-Security) | Same | `cea.js` |
| 4 | Contracts | `getPdfFactura` (WS-Security) | Same | `cea.js` |
| 5 | Meters | `getPuntoServicioPorContador` | `/api/v1/cea/soap/InterfazGenericaContadoresWS` | `cea.js` |
| 6 | Work Orders | `crearOrdenTrabajo` | `/api/v1/cea/soap/InterfazGenericaOrdenesServicioWS` | `GenerateOrderModal.vue` |
| 7 | Work Orders | `informarVisita` | Same | (TBD) |
| 8 | Work Orders | `resolveOT` | Same | (TBD) |
| 9 | Debt | `getDeuda` | `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS` | `cea.js` |
| 10 | Readings | `cambiarEmailNotificacionPersona` | `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` | `cea.js` |
| 11 | Readings | `cambiarPersonaNotificacionContrato` (WS-Security) | Same | `cea.js` |
| 12 | Readings | `cambiarTipoFacturaContrato` (WS-Security) | Same | `cea.js` |
| 13 | Readings | `getConceptos` | Same | `cea.js` |
| 14 | Readings | `getConsumos` | Same | `cea.js` |
| 15 | Readings | `getConsumosParaGraficas` | Same | `cea.js` |
| 16 | Readings | `getFacturas` | Same | `cea.js` |
| 17 | Readings | `getLecturas` | Same | `cea.js` |

### Operations NOT Yet Integrated (109 of 126)

- Contracts Service: 49 remaining operations
- Debt Management: 12 remaining operations
- Meters Service: 3 remaining operations
- Readings/Portal: 39 remaining operations
- Work Orders: 6 remaining operations

---

## Appendix B: REST Resource Design Principles

### Naming Conventions

| SOAP Pattern | REST Pattern | Example |
|-------------|-------------|---------|
| `consultaDetalleContrato(442761)` | `GET /contracts/442761` | Query by ID -> resource path |
| `getContratos(filters)` | `GET /contracts?nif=XAXX...&explotacion=8` | Search -> query parameters |
| `crearOrdenTrabajo(data)` | `POST /work-orders` | Create -> POST to collection |
| `informarVisita(orderId, data)` | `POST /work-orders/O4514415/visits` | Sub-resource creation |
| `resolveOT(orderId, data)` | `PUT /work-orders/O4514415/resolve` | Action -> verb on resource |
| `getPdfFactura(invoiceId)` | `GET /contracts/442761/invoices/123/pdf` | Binary resource |

### Response Envelope

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

### Error Envelope

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

---

## Appendix C: Key Ruby Gems for Implementation

| Gem | Version | Purpose |
|-----|---------|---------|
| `savon` | ~> 2.14 | SOAP client with WSDL support and WS-Security |
| `nori` | ~> 2.7 | XML-to-Hash parsing (Savon dependency) |
| `gyoku` | ~> 1.4 | Hash-to-XML conversion (Savon dependency) |
| `faraday` | ~> 2.9 | HTTP client for CEA REST API |
| `faraday-retry` | ~> 2.2 | Retry middleware for transient failures |
| `rswag` | ~> 2.13 | OpenAPI spec generation from RSpec |
| `graphql-ruby` | ~> 2.3 | GraphQL server (Phase 4) |
| `vcr` | ~> 6.2 | Record/replay HTTP interactions for testing |
| `webmock` | ~> 3.23 | HTTP request stubbing for tests |
| `redis` | ~> 5.1 | Caching layer for catalog data |
| `stoplight` | ~> 4.1 | Circuit breaker pattern implementation |

---

*Report generated by Agent C2 (research-api-modernization) on 2026-02-16.*
*Based on analysis of AquaCIS WSDL contracts (5 services, 126 operations) and current AGORA integration architecture.*
