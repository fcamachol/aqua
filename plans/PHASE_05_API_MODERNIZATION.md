# Phase 5: API Modernization -- SOAP-to-REST (Months 4-10)

**Target:** Replace the SOAP passthrough proxy with a proper RESTful BFF (Backend-for-Frontend) API layer using the Strangler Fig pattern.

**Timeline:** 24 weeks (6 sprints of 2 weeks each, plus frontend migration and optional GraphQL)

**Status:** Planning

---

## 1. Phase Overview

### 1.1 Problem Statement

AGORA currently integrates with Aquasis (AquaCIS) through a deeply flawed architecture:

- **Frontend XML construction**: The Vue.js frontend (`cea.js`) builds SOAP XML envelopes as JavaScript template literals and parses XML responses directly.
- **Transparent proxy**: The Rails `cea_proxy_controller.rb` is a passthrough relay with no transformation, validation, caching, or error normalization. It exists solely to bypass CORS restrictions.
- **Credential exposure**: WS-Security credentials (`WSGESTIONDEUDA`/`WSGESTIONDEUDA`) are exposed in the browser via `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` environment variables. Anyone with DevTools can extract them.
- **No API contract**: There is no OpenAPI or typed contract between the AGORA frontend and the Rails backend.
- **Fragile error handling**: SOAP faults (e.g., `NullPointerException` for missing `idPtoServicio`) propagate raw to the frontend.
- **No caching, no circuit breaker, no retry**: Every call hits Aquasis live with a single attempt.
- **Tight DTO coupling**: Frontend references deep paths like `meterJson.puntosServicioContadorDTO.PuntosServicioContadorDTO...`.

### 1.2 Strategy: Strangler Fig with Adapter Internals

The Strangler Fig pattern incrementally replaces legacy integration points by building new REST endpoints alongside the old SOAP proxy. Traffic is gradually routed from old to new via feature flags until the legacy proxy is decommissioned.

```
Phase A (Current):     Frontend --SOAP XML--> Rails Proxy --verbatim--> Aquasis
Phase B (Transition):  Frontend --REST JSON--> Rails BFF --SOAP XML--> Aquasis
                       Frontend --SOAP XML--> Rails Proxy --verbatim--> Aquasis  (feature-flagged)
Phase C (Complete):    Frontend --REST/GQL--> Rails BFF --SOAP XML--> Aquasis
```

**Key Principles:**
1. Never modify the Aquasis SOAP services -- they are vendor-owned (Agbar/OCCAM)
2. Keep the v1 proxy running throughout migration -- never break existing code
3. Migrate one operation at a time with feature flags
4. Each operation can be rolled back independently
5. Frontend and backend teams can work in parallel

### 1.3 Timeline Summary

| Sprint | Weeks | Focus |
|--------|-------|-------|
| Sprint 1-2 | 1-4 | Architecture foundation, BFF layer, credential fix |
| Sprint 3-4 | 5-8 | Core resources: Contracts, Debt, Meters |
| Sprint 5-6 | 9-12 | Operations: Work Orders, Readings |
| Sprint 7-8 | 13-16 | Payments, Customer Portal |
| Sprint 9-10 | 17-20 | Frontend migration, performance testing |
| Sprint 11-12 | 21-24 | GraphQL layer (optional), documentation, cleanup |

### 1.4 Team

| Role | Count | Responsibility |
|------|:-----:|----------------|
| Senior Backend Developer (Rails) | 1 | BFF architecture, savon SOAP client, service objects, caching, circuit breaker |
| Full-Stack Developer (Vue + Rails) | 1 | Frontend migration, feature flags, API client, TypeScript types |
| API Architect (part-time, 0.25 FTE) | 1 | OpenAPI spec design, REST resource modeling, review |
| QA Engineer (part-time, 0.5 FTE) | 1 | Integration testing, VCR cassette management, performance benchmarks |

---

## 2. Sprint 1-2 (Weeks 1-4): Architecture Foundation

**Goal:** Establish the BFF architecture, fix the critical credential exposure, and design the REST API resource model.

### Task P5-001: Design REST API Resource Model (OpenAPI 3.0)

| Field | Value |
|-------|-------|
| **ID** | P5-001 |
| **Description** | Create an OpenAPI 3.0 specification defining all v2 REST resources. Model the business domain (contracts, meters, work orders, payments, customers) independently from SOAP operation structure. Define request/response schemas, error envelope, pagination, and authentication. |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | L (1 week) |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) OpenAPI 3.0 YAML spec covers all 17 currently-integrated operations as REST endpoints. (2) Spec validates with `swagger-cli validate`. (3) Response schemas flatten nested SOAP DTOs into REST-friendly structures. (4) Error envelope defined with `code`, `message`, `details`. (5) Pagination schema defined for list endpoints. (6) Spec reviewed and approved by team. |

### Task P5-002: Map SOAP Operations to REST Endpoints

| Field | Value |
|-------|-------|
| **ID** | P5-002 |
| **Description** | Create a comprehensive mapping table between each of the 126 SOAP operations and their corresponding REST endpoint, HTTP method, URL path, and request/response transformation rules. Prioritize the 17 currently-integrated operations. |
| **REST Endpoints** | All (mapping document) |
| **Effort** | M (3 days) |
| **Dependencies** | P5-001 |
| **Acceptance Criteria** | (1) All 17 integrated operations mapped to REST endpoints with HTTP method, path params, query params, and body schema. (2) SOAP field names mapped to English camelCase REST equivalents. (3) Auth requirements (WS-Security) documented per operation. (4) Remaining 109 operations mapped at high level for future sprints. |

### Task P5-003: Set Up Rails BFF Layer (Base Infrastructure)

| Field | Value |
|-------|-------|
| **ID** | P5-003 |
| **Description** | Create the foundational Rails BFF infrastructure: `Aquasis::BaseClient` service object with savon SOAP client configuration, WS-Security header injection, error normalization, response XML-to-Hash transformation, logging, and instrumentation. Set up v2 API namespace routing. |
| **REST Endpoints** | `/api/v2/aquasis/*` (routing namespace) |
| **Effort** | L (1 week) |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) `Aquasis::BaseClient` class created with savon configuration for all 5 WSDL endpoints. (2) WS-Security `UsernameToken` injection works server-side. (3) SOAP faults normalized to structured Ruby error objects. (4) XML response parsing to Hash with configurable key transformation. (5) Rails routes configured for `/api/v2/aquasis/` namespace. (6) Request/response logging with `ActiveSupport::Notifications`. (7) Unit tests with WebMock/VCR for all BaseClient methods. |

**Implementation details for `Aquasis::BaseClient`:**

```ruby
# app/services/aquasis/base_client.rb
# - Savon SOAP client with per-service WSDL configuration
# - WS-Security UsernameToken from Rails credentials.yml.enc
# - Error normalization: SOAP faults -> Aquasis::ServiceError
# - Response transformation: XML -> Hash with camelCase keys
# - Logging via ActiveSupport::Notifications
# - Circuit breaker via stoplight gem
# - Timeout configuration (open: 10s, read: 30s)
```

### Task P5-004: Move SOAP XML Construction from Frontend to Backend

| Field | Value |
|-------|-------|
| **ID** | P5-004 |
| **Description** | Create per-service Adapter classes that encapsulate all SOAP XML construction using savon. Replace the JavaScript template literal XML building in `cea.js` with server-side savon calls. This is the core transformation that moves SOAP complexity behind the BFF. |
| **REST Endpoints** | All (backend infrastructure) |
| **Effort** | L (1.5 weeks) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) `Aquasis::ContractsService` handles all 4 integrated Contracts operations. (2) `Aquasis::DebtService` handles `getDeuda`. (3) `Aquasis::MetersService` handles `getPuntoServicioPorContador`. (4) `Aquasis::ReadingsService` handles all 8 integrated Readings operations. (5) `Aquasis::WorkOrdersService` handles all 3 integrated Work Orders operations. (6) Each service class tested with VCR cassettes recorded against real Aquasis responses. (7) No XML template literals remain for migrated operations. |

**Service classes to create:**

```ruby
# app/services/aquasis/contracts_service.rb
#   - consultaDetalleContrato
#   - getContrato
#   - getContratos (with WS-Security)
#   - getPdfFactura (with WS-Security)

# app/services/aquasis/debt_service.rb
#   - getDeuda (with WS-Security)

# app/services/aquasis/meters_service.rb
#   - getPuntoServicioPorContador

# app/services/aquasis/readings_service.rb
#   - cambiarEmailNotificacionPersona
#   - cambiarPersonaNotificacionContrato (with WS-Security)
#   - cambiarTipoFacturaContrato (with WS-Security)
#   - getConceptos
#   - getConsumos (with WS-Security)
#   - getConsumosParaGraficas
#   - getFacturas
#   - getLecturas (with WS-Security)
#   - getTarifaDeAguaPorContrato

# app/services/aquasis/work_orders_service.rb
#   - crearOrdenTrabajo (with WS-Security)
#   - informarVisita (with WS-Security)
#   - resolveOT (with WS-Security)
```

### Task P5-005: Implement REST Error Handling Envelope

| Field | Value |
|-------|-------|
| **ID** | P5-005 |
| **Description** | Implement standardized error handling that transforms raw SOAP faults into structured JSON error responses. Handle the known Aquasis quirks: `reultado` typo (BUG-4), dual `ResultadoDTO` types with mixed `codigoError` string/int (BUG-6), and `NullPointerException` faults (BUG-1). |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | M (3 days) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) All SOAP faults return HTTP 502 with structured error JSON: `{ error: { code, message, details: { soapFaultCode, soapFaultString, operation, service } } }`. (2) Known `NullPointerException` faults mapped to HTTP 422 with descriptive message. (3) `reultado`/`resultado` dual-field handled transparently. (4) `codigoError` string/int dual-type handled. (5) Timeout errors return HTTP 504. (6) Circuit breaker open returns HTTP 503 with `Retry-After` header. (7) All error responses include `requestId` for correlation. |

**Error envelope format:**

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
    },
    "requestId": "req_abc123"
  }
}
```

### Task P5-006: Fix Credential Exposure (Move WS-Security to Server-Side)

| Field | Value |
|-------|-------|
| **ID** | P5-006 |
| **Description** | Remove `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` from the frontend environment. Store Aquasis credentials in Rails `credentials.yml.enc` (or server-only environment variables). Configure savon to inject WS-Security `UsernameToken` headers server-side. Ensure no credentials are ever sent to or accessible from the browser. |
| **REST Endpoints** | All (security infrastructure) |
| **Effort** | M (2 days) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` removed from all `.env` files and Vite config. (2) Credentials stored in `credentials.yml.enc` under `aquasis.username` and `aquasis.password`. (3) savon configured to inject WS-Security from server-side credentials. (4) Frontend bundle verified to contain zero Aquasis credentials. (5) All operations requiring WS-Security continue to work through v2 endpoints. (6) Audit logging records which user triggered each authenticated SOAP operation. |

### Task P5-007: Set Up Testing Infrastructure (VCR + WebMock)

| Field | Value |
|-------|-------|
| **ID** | P5-007 |
| **Description** | Set up VCR and WebMock for recording and replaying SOAP interactions without hitting production Aquasis servers. Record cassettes for all 17 integrated operations including both success and error scenarios. Configure RSpec helpers for Aquasis service tests. |
| **REST Endpoints** | All (test infrastructure) |
| **Effort** | M (3 days) |
| **Dependencies** | P5-003, P5-004 |
| **Acceptance Criteria** | (1) VCR configured with cassette directory and Aquasis SOAP endpoint filtering. (2) At least 2 cassettes per integrated operation: success path and error path. (3) WebMock configured to block all real HTTP requests in test mode. (4) RSpec shared contexts for `with_aquasis_service` that set up common test fixtures. (5) CI pipeline runs all Aquasis service tests without external network access. |

### Task P5-008: Set Up Redis Caching Layer

| Field | Value |
|-------|-------|
| **ID** | P5-008 |
| **Description** | Configure Redis caching for Aquasis responses with operation-specific TTLs. Cache keys composed of operation name + parameters. Read-only operations are cacheable; write operations invalidate related caches. |
| **REST Endpoints** | All GET endpoints |
| **Effort** | M (2 days) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) Cacheable operations defined with TTLs: catalogs (1 hour), contract details (5 min), service points (1 hour), readings (10 min). (2) Cache keys include operation name + normalized params. (3) Write operations (POST/PUT) invalidate related cache entries. (4) Cache hit/miss metrics logged. (5) `Cache-Control` and `ETag` headers on cached REST responses. (6) Manual cache invalidation endpoint for admin use. |

### Task P5-009: Set Up Circuit Breaker (stoplight gem)

| Field | Value |
|-------|-------|
| **ID** | P5-009 |
| **Description** | Implement circuit breaker pattern using the `stoplight` gem to prevent cascade failures when Aquasis SOAP services are down. One circuit per Aquasis service (5 total). Configure thresholds, cool-down periods, and fallback behavior. |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | S (1 day) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) Circuit breaker configured per Aquasis service with failure threshold of 5 within 60 seconds. (2) Cool-down period of 30 seconds before half-open state. (3) Open circuit returns HTTP 503 with `Retry-After` header. (4) Circuit state changes logged and alerted. (5) Health check endpoint reports circuit state for all 5 services. |

---

## 3. Sprint 3-4 (Weeks 5-8): Core Resources

**Goal:** Implement REST endpoints for the most frequently used resources: Contracts, Debt, and Meters.

### Task P5-010: REST Endpoints for Contracts

| Field | Value |
|-------|-------|
| **ID** | P5-010 |
| **Description** | Create `Api::V2::Aquasis::ContractsController` with REST endpoints for contract operations. Transform nested SOAP DTOs (`GenericoContratoDTO`) into flat, English-named JSON responses. |
| **REST Endpoints** | `GET /api/v2/aquasis/contracts/:id` -- `consultaDetalleContrato`; `GET /api/v2/aquasis/contracts/:id/detail` -- `getContrato`; `POST /api/v2/aquasis/contracts/search` -- `getContratos`; `GET /api/v2/aquasis/contracts/:id/invoices/:inv/pdf` -- `getPdfFactura` |
| **Effort** | L (1 week) |
| **Dependencies** | P5-003, P5-004, P5-005 |
| **Acceptance Criteria** | (1) `GET /contracts/:id` returns flattened contract JSON with meter, service point, and holder details. (2) `GET /contracts/:id/detail` returns extended contract info. (3) `POST /contracts/search` accepts JSON body with NIF, name, or address filters; returns paginated results. (4) `GET /contracts/:id/invoices/:inv/pdf` returns base64 PDF. (5) All SOAP field names mapped to English camelCase. (6) Response envelope with `data` and `meta` sections. (7) RSpec request specs for all endpoints with VCR cassettes. |

**Response example for `GET /api/v2/aquasis/contracts/442761`:**

```json
{
  "data": {
    "contractNumber": 442761,
    "holder": "GOMEZ FAJARDO, J. PUEBLITO",
    "exploitation": 8,
    "status": "active",
    "meter": {
      "serialNumber": "10005237",
      "brand": "ZENNER",
      "model": "ETK-D",
      "caliber": 15,
      "status": "active"
    },
    "servicePoint": {
      "id": 12345,
      "address": "Calle Reforma 123, Col. Centro",
      "zone": "CENTRO",
      "geoLocation": { "lat": 20.5888, "lng": -100.3899 }
    }
  },
  "meta": {
    "source": "aquasis",
    "cachedAt": null,
    "requestId": "req_abc123"
  }
}
```

### Task P5-011: REST Endpoints for Debt

| Field | Value |
|-------|-------|
| **ID** | P5-011 |
| **Description** | Create `Api::V2::Aquasis::DebtController` with REST endpoints for debt queries. Handle the known `reultado`/`resultado` typo (BUG-4) transparently in the service layer. |
| **REST Endpoints** | `GET /api/v2/aquasis/contracts/:id/debt` -- `getDeuda` |
| **Effort** | M (3 days) |
| **Dependencies** | P5-003, P5-004, P5-005 |
| **Acceptance Criteria** | (1) `GET /contracts/:id/debt` returns debt summary with totalAmount, pendingInvoices, lastPaymentDate. (2) `reultado`/`resultado` dual-field handled transparently. (3) WS-Security injected server-side. (4) Response cached with 5-minute TTL. (5) RSpec request specs with VCR cassettes for success and error paths. |

### Task P5-012: REST Endpoints for Meters

| Field | Value |
|-------|-------|
| **ID** | P5-012 |
| **Description** | Create `Api::V2::Aquasis::MetersController` with REST endpoints for meter and service point queries. Parse the full `getPuntoServicioPorContador` response (currently only `id` is extracted; the response contains 37 fields including geocoordinates, address, zone, sector, cut status). |
| **REST Endpoints** | `GET /api/v2/aquasis/meters/:serial` -- future `getContador`; `GET /api/v2/aquasis/meters/:serial/service-point` -- `getPuntoServicioPorContador` |
| **Effort** | M (3 days) |
| **Dependencies** | P5-003, P5-004, P5-005 |
| **Acceptance Criteria** | (1) `GET /meters/:serial/service-point` returns full service point: id, address, zone, sector, geoLocation (lat/lng), cut status (`cutForDebt`, `cutForExpiredContract`), contract arrays, meter arrays, reading arrays. (2) All 37 service point fields parsed and mapped to English camelCase. (3) Response cached with 1-hour TTL. (4) RSpec request specs with VCR cassettes. |

### Task P5-013: Request Validation Layer

| Field | Value |
|-------|-------|
| **ID** | P5-013 |
| **Description** | Implement request validation for all v2 endpoints using strong parameters and custom validators. Validate before calling Aquasis to catch errors early (e.g., missing `idPtoServicio` that causes BUG-1 NullPointerException). |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | M (2 days) |
| **Dependencies** | P5-010, P5-011, P5-012 |
| **Acceptance Criteria** | (1) All POST/PUT endpoints validate required params and return HTTP 422 with descriptive errors before calling Aquasis. (2) Contract ID validated as positive integer. (3) Meter serial validated as alphanumeric. (4) Search endpoints validate at least one filter is present. (5) Validation errors follow the standard error envelope format. |

### Task P5-014: Response Transformation Layer (Serializers)

| Field | Value |
|-------|-------|
| **ID** | P5-014 |
| **Description** | Implement response serializers (using `alba` or `jbuilder` gem) that transform internal service objects into the REST response envelope format. Map Spanish SOAP field names to English camelCase. Flatten deeply nested DTO structures. |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | M (3 days) |
| **Dependencies** | P5-010, P5-011, P5-012 |
| **Acceptance Criteria** | (1) Serializer per resource type: ContractSerializer, DebtSerializer, MeterSerializer, ServicePointSerializer. (2) All Spanish SOAP fields mapped to English camelCase (e.g., `numeroContrato` -> `contractNumber`). (3) Nested DTOs flattened to max 2 levels. (4) `data` + `meta` envelope applied consistently. (5) Null SOAP fields omitted from JSON responses. |

### Task P5-015: API Versioning Infrastructure

| Field | Value |
|-------|-------|
| **ID** | P5-015 |
| **Description** | Implement URL-based API versioning. v1 remains the existing SOAP proxy (untouched). v2 is the new REST BFF. Configure Rails routing, controller namespacing, and deprecation headers. |
| **REST Endpoints** | `/api/v1/*` (existing), `/api/v2/*` (new) |
| **Effort** | S (1 day) |
| **Dependencies** | P5-003 |
| **Acceptance Criteria** | (1) `/api/v1/cea/soap/*` routes unchanged and functional. (2) `/api/v2/aquasis/*` routes configured with proper controller namespacing. (3) v1 endpoints return `Deprecation: true` and `Sunset: <date>` headers. (4) API version extractable from URL path. (5) Routing tests verify both v1 and v2 namespaces coexist. |

---

## 4. Sprint 5-6 (Weeks 9-12): Operations and Readings

**Goal:** Implement REST endpoints for Work Orders and Readings, including the critical multi-step work order creation orchestration.

### Task P5-016: REST Endpoints for Work Orders

| Field | Value |
|-------|-------|
| **ID** | P5-016 |
| **Description** | Create `Api::V2::Aquasis::WorkOrdersController`. The critical improvement: `POST /work-orders` orchestrates the 3-step flow server-side (consultaDetalleContrato -> getPuntoServicioPorContador -> crearOrdenTrabajo) instead of requiring 3 sequential SOAP calls from the frontend. |
| **REST Endpoints** | `POST /api/v2/aquasis/work-orders` -- orchestrates contract lookup + service point + `crearOrdenTrabajo`; `GET /api/v2/aquasis/work-orders/:id` -- `refreshData`; `POST /api/v2/aquasis/work-orders/:id/visits` -- `informarVisita`; `PUT /api/v2/aquasis/work-orders/:id/resolve` -- `resolveOT`; `GET /api/v2/aquasis/work-orders/:id/pdf` -- `getDocumentoOrdenTrabajo` |
| **Effort** | L (1.5 weeks) |
| **Dependencies** | P5-004, P5-005, P5-010, P5-012 |
| **Acceptance Criteria** | (1) `POST /work-orders` accepts `{ contractNumber, orderType, orderMotive, description }` and orchestrates 3 SOAP calls server-side. (2) Returns created work order with Aquasis order code. (3) If service point resolution fails, returns HTTP 422 with descriptive error (prevents BUG-1). (4) `GET /work-orders/:id` returns order status with correct `otClassID=1` and `operationalSiteID` (fixes BUG-3). (5) `POST /work-orders/:id/visits` records visit with proper WS-Security (fixes BUG-2). (6) `PUT /work-orders/:id/resolve` handles WSDL typos (`busVHFumberSerie`, `vistitComments`) internally (BUG-7, BUG-8). (7) All operations have WS-Security injected server-side. (8) Request specs with VCR cassettes for full orchestration flow. |

**Work order creation flow (server-side orchestration):**

```
Frontend: POST /api/v2/aquasis/work-orders
  { contractNumber: 442761, orderType: 6, orderMotive: 1, description: "..." }

Backend (Rails BFF):
  1. ContractsService.detail(442761) -> extract meterSerial
  2. MetersService.service_point(meterSerial) -> extract idPtoServicio
  3. WorkOrdersService.create(contractNumber, idPtoServicio, orderType, ...) -> orderCode
  4. Return { data: { orderCode, status, ... } }
```

### Task P5-017: REST Endpoints for Readings

| Field | Value |
|-------|-------|
| **ID** | P5-017 |
| **Description** | Create `Api::V2::Aquasis::ReadingsController` with REST endpoints for consumption data, meter readings, billing concepts, and tariffs. |
| **REST Endpoints** | `GET /api/v2/aquasis/contracts/:id/readings` -- `getLecturas`; `GET /api/v2/aquasis/contracts/:id/consumption` -- `getConsumos`; `GET /api/v2/aquasis/contracts/:id/consumption/chart` -- `getConsumosParaGraficas`; `GET /api/v2/aquasis/contracts/:id/concepts` -- `getConceptos`; `GET /api/v2/aquasis/contracts/:id/tariff` -- `getTarifaDeAguaPorContrato`; `GET /api/v2/aquasis/contracts/:id/invoices` -- `getFacturas` |
| **Effort** | L (1 week) |
| **Dependencies** | P5-004, P5-005, P5-014 |
| **Acceptance Criteria** | (1) All 6 GET endpoints return properly serialized JSON. (2) `getLecturas` and `getConsumos` responses include WS-Security server-side. (3) Consumption chart endpoint returns data formatted for frontend charting libraries. (4) Concepts and tariffs cached with 1-hour TTL. (5) RSpec request specs for all endpoints. |

### Task P5-018: Implement Pagination for List Endpoints

| Field | Value |
|-------|-------|
| **ID** | P5-018 |
| **Description** | Add pagination support to all list endpoints. SOAP responses do not natively paginate (or use `registroInicial` + `registroTotal`), so the BFF must translate between REST pagination parameters and SOAP pagination fields where available, or implement server-side pagination for non-paginated SOAP responses. |
| **REST Endpoints** | All list endpoints: `/contracts/search`, `/contracts/:id/invoices`, `/contracts/:id/readings`, `/contracts/:id/consumption` |
| **Effort** | M (3 days) |
| **Dependencies** | P5-010, P5-017 |
| **Acceptance Criteria** | (1) All list endpoints accept `page` and `per_page` query parameters (default: page=1, per_page=25). (2) Responses include pagination metadata: `{ meta: { pagination: { page, perPage, totalCount, totalPages } } }`. (3) SOAP `registroInicial`/`registroTotal` mapped to page/perPage where supported. (4) Endpoints without SOAP pagination support implement server-side slicing with appropriate warnings. (5) `Link` headers with `first`, `prev`, `next`, `last` URLs. |

### Task P5-019: Add Caching Headers to REST Responses

| Field | Value |
|-------|-------|
| **ID** | P5-019 |
| **Description** | Add HTTP caching headers (`Cache-Control`, `ETag`, `Last-Modified`) to all GET endpoints. Configure TTLs based on data volatility: catalogs are long-lived, readings change daily, debt changes on payment. |
| **REST Endpoints** | All GET endpoints |
| **Effort** | S (1 day) |
| **Dependencies** | P5-008, P5-010, P5-017 |
| **Acceptance Criteria** | (1) Catalog endpoints (concepts, tariffs): `Cache-Control: public, max-age=3600`. (2) Contract detail: `Cache-Control: private, max-age=300`. (3) Debt: `Cache-Control: private, max-age=300`. (4) Service points: `Cache-Control: public, max-age=3600`. (5) Write responses: `Cache-Control: no-store`. (6) `ETag` headers on all GET responses for conditional requests. |

---

## 5. Sprint 7-8 (Weeks 13-16): Payments and Self-Service

**Goal:** Implement REST endpoints for payment operations and customer portal functions (notification changes, invoice type changes).

### Task P5-020: REST Endpoints for Payments

| Field | Value |
|-------|-------|
| **ID** | P5-020 |
| **Description** | Create `Api::V2::Aquasis::PaymentsController` with REST endpoints for payment document generation, collection, notification, and cancellation. Payment operations require strict idempotency, financial safeguards, and comprehensive audit logging. |
| **REST Endpoints** | `POST /api/v2/aquasis/payments/document` -- `getDocumentoPago`; `POST /api/v2/aquasis/payments/collect` -- `cobrarReferenciaFrmPago`; `POST /api/v2/aquasis/payments/notify` -- `avisarPago`; `POST /api/v2/aquasis/payments/cancel` -- `cancelarReferencia` |
| **Effort** | L (1.5 weeks) |
| **Dependencies** | P5-004, P5-005, P5-006 |
| **Acceptance Criteria** | (1) All 4 payment endpoints functional with WS-Security. (2) Idempotency keys on `collect` and `cancel` operations (via `Idempotency-Key` header). (3) All payment operations logged with user, contract, amount, timestamp, and result. (4) Failed collections never create orphaned local payment records. (5) Payment cancellation requires reason field. (6) RSpec request specs with VCR cassettes for success, failure, and duplicate scenarios. (7) Financial amounts returned as strings to avoid floating-point issues. |

### Task P5-021: REST Endpoints for Customer Portal Operations

| Field | Value |
|-------|-------|
| **ID** | P5-021 |
| **Description** | Create `Api::V2::Aquasis::CustomersController` with REST endpoints for customer notification management and contract search by NIF. |
| **REST Endpoints** | `GET /api/v2/aquasis/customers/search?nif=...` -- `getContratosPorNif`; `PUT /api/v2/aquasis/contracts/:id/notifications/email` -- `cambiarEmailNotificacionPersona`; `PUT /api/v2/aquasis/contracts/:id/notifications/contact` -- `cambiarPersonaNotificacionContrato`; `PUT /api/v2/aquasis/contracts/:id/invoice-type` -- `cambiarTipoFacturaContrato` |
| **Effort** | M (4 days) |
| **Dependencies** | P5-004, P5-005 |
| **Acceptance Criteria** | (1) Customer search by NIF returns list of associated contracts. (2) Email notification change handles `emailAntigo` WSDL typo (BUG-9) internally. (3) Contact person change requires WS-Security (injected server-side). (4) Invoice type change requires WS-Security (injected server-side). (5) All write operations return the updated resource state. (6) Input validation on email format, phone format. (7) RSpec request specs with VCR cassettes. |

### Task P5-022: Implement OAuth2/JWT Authentication for Frontend

| Field | Value |
|-------|-------|
| **ID** | P5-022 |
| **Description** | Replace the WS-Security frontend authentication model with OAuth2/JWT for the v2 API. The frontend authenticates to Rails with JWT tokens; Rails handles WS-Security to Aquasis server-side. This cleanly separates frontend auth (JWT) from backend-to-Aquasis auth (WS-Security). |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | L (1 week) |
| **Dependencies** | P5-006 |
| **Acceptance Criteria** | (1) v2 endpoints require valid JWT in `Authorization: Bearer <token>` header. (2) JWT contains user identity (agent ID, role, permissions). (3) Per-operation authorization: payment operations require `payments:write` permission. (4) JWT issued by existing AGORA auth system (extend, not replace). (5) Token refresh mechanism prevents session interruption. (6) Unauthorized requests return HTTP 401 with clear error message. (7) Forbidden operations return HTTP 403. (8) Audit log includes JWT subject (agent) for each Aquasis operation. |

### Task P5-023: Per-Operation Audit Logging

| Field | Value |
|-------|-------|
| **ID** | P5-023 |
| **Description** | Implement comprehensive audit logging for all Aquasis operations through the BFF. Log user identity, operation, parameters (sanitized), contract number, timestamp, response status, and latency. Critical for compliance with Mexican data protection laws and financial operation tracking. |
| **REST Endpoints** | All `/api/v2/aquasis/*` endpoints |
| **Effort** | M (2 days) |
| **Dependencies** | P5-003, P5-022 |
| **Acceptance Criteria** | (1) Every Aquasis operation logged with: agent_id, operation, contract_number, timestamp, response_status, latency_ms. (2) Sensitive parameters (bank details, NIF) redacted in logs. (3) Payment operations logged with amount and reference number. (4) Logs stored in structured format (JSON) for searchability. (5) Log retention configured per regulatory requirements. (6) Admin dashboard query for audit trail by agent, contract, or date range. |

---

## 6. Sprint 9-10 (Weeks 17-20): Frontend Migration

**Goal:** Migrate all AGORA Vue components from direct SOAP calls to REST API calls. Remove all frontend SOAP XML construction.

### Task P5-024: Create Frontend API Client (`aquasis.js`)

| Field | Value |
|-------|-------|
| **ID** | P5-024 |
| **Description** | Create a new `aquasis.js` (or `aquasis.ts`) API client that replaces `cea.js` for all Aquasis interactions. Uses clean JSON requests to v2 REST endpoints instead of building SOAP XML. Include TypeScript type definitions generated from the OpenAPI spec. |
| **REST Endpoints** | All v2 endpoints (client-side) |
| **Effort** | M (4 days) |
| **Dependencies** | P5-010, P5-011, P5-012, P5-016, P5-017, P5-020, P5-021 |
| **Acceptance Criteria** | (1) New `aquasis.js` module with functions for all v2 endpoints. (2) No SOAP XML construction in the new module. (3) Proper error handling: maps HTTP status codes to user-facing error messages. (4) TypeScript type definitions for all request/response shapes. (5) Automatic JWT token injection via interceptor. (6) Feature flag support: can fall back to v1 SOAP calls per operation. |

### Task P5-025: Migrate Vue Components -- Contracts and Debt

| Field | Value |
|-------|-------|
| **ID** | P5-025 |
| **Description** | Migrate Vue components that display contract details, debt summaries, and invoice lists from SOAP calls (`cea.js`) to REST calls (`aquasis.js`). Use feature flags to toggle per component. |
| **REST Endpoints** | `/api/v2/aquasis/contracts/*`, `/api/v2/aquasis/contracts/:id/debt` |
| **Effort** | M (4 days) |
| **Dependencies** | P5-024, P5-010, P5-011 |
| **Acceptance Criteria** | (1) Contract detail views use REST endpoint. (2) Debt summary views use REST endpoint. (3) Invoice list views use REST endpoint. (4) Feature flag `USE_V2_CONTRACTS` toggles between v1 and v2. (5) No `xmlToJson()` calls for migrated components. (6) Visual parity: UI looks identical before and after migration. (7) Error states display user-friendly messages from error envelope. |

### Task P5-026: Migrate Vue Components -- Work Orders

| Field | Value |
|-------|-------|
| **ID** | P5-026 |
| **Description** | Migrate `GenerateOrderModal.vue` and related work order components from the 3-step SOAP flow to a single REST POST. This is the highest-value migration: eliminates the fragile multi-step frontend orchestration. |
| **REST Endpoints** | `/api/v2/aquasis/work-orders`, `/api/v2/aquasis/work-orders/:id`, `/api/v2/aquasis/work-orders/:id/visits`, `/api/v2/aquasis/work-orders/:id/resolve` |
| **Effort** | L (1 week) |
| **Dependencies** | P5-024, P5-016 |
| **Acceptance Criteria** | (1) `GenerateOrderModal.vue` sends single POST to `/work-orders` instead of 3 sequential SOAP calls. (2) Work order status display uses `GET /work-orders/:id`. (3) Visit reporting uses `POST /work-orders/:id/visits`. (4) Order resolution uses `PUT /work-orders/:id/resolve`. (5) Feature flag `USE_V2_WORK_ORDERS`. (6) Error handling shows descriptive messages (no raw SOAP faults). (7) Loading state simplified (one request instead of three). |

### Task P5-027: Migrate Vue Components -- Readings and Consumption

| Field | Value |
|-------|-------|
| **ID** | P5-027 |
| **Description** | Migrate Vue components that display meter readings, consumption data, and consumption charts from SOAP calls to REST calls. |
| **REST Endpoints** | `/api/v2/aquasis/contracts/:id/readings`, `/api/v2/aquasis/contracts/:id/consumption`, `/api/v2/aquasis/contracts/:id/consumption/chart` |
| **Effort** | M (3 days) |
| **Dependencies** | P5-024, P5-017 |
| **Acceptance Criteria** | (1) Readings history views use REST endpoint. (2) Consumption data views use REST endpoint. (3) Consumption chart views use REST endpoint with chart-formatted data. (4) Feature flag `USE_V2_READINGS`. (5) No XML parsing in migrated components. |

### Task P5-028: Migrate Vue Components -- Payments and Customer Operations

| Field | Value |
|-------|-------|
| **ID** | P5-028 |
| **Description** | Migrate payment and customer operation components from SOAP to REST. |
| **REST Endpoints** | `/api/v2/aquasis/payments/*`, `/api/v2/aquasis/customers/*`, notification endpoints |
| **Effort** | M (4 days) |
| **Dependencies** | P5-024, P5-020, P5-021 |
| **Acceptance Criteria** | (1) Payment document generation uses REST endpoint. (2) Payment collection uses REST endpoint with idempotency keys. (3) Customer search by NIF uses REST endpoint. (4) Notification changes use REST endpoints. (5) Feature flags for each domain. (6) No SOAP XML construction in migrated components. |

### Task P5-029: Remove Frontend SOAP XML Construction

| Field | Value |
|-------|-------|
| **ID** | P5-029 |
| **Description** | After all components are migrated and feature flags are stable on v2, remove the legacy SOAP code from the frontend: delete XML template literal builders, XML-to-JSON parsers, `VITE_CEA_API_*` environment variables, and the old `cea.js` SOAP functions. |
| **REST Endpoints** | N/A (cleanup) |
| **Effort** | M (2 days) |
| **Dependencies** | P5-025, P5-026, P5-027, P5-028 |
| **Acceptance Criteria** | (1) `cea.js` SOAP functions removed (or file deleted if fully replaced). (2) No `xmlToJson()` calls in frontend codebase. (3) No SOAP XML template literals in frontend codebase. (4) `VITE_CEA_API_USERNAME` and `VITE_CEA_API_PASSWORD` removed from all configs. (5) Frontend bundle size reduced (no XML parsing library). (6) All integration tests pass on v2 endpoints only. |

### Task P5-030: Performance Testing (REST vs SOAP)

| Field | Value |
|-------|-------|
| **ID** | P5-030 |
| **Description** | Benchmark REST v2 endpoints against the direct SOAP v1 proxy to quantify performance improvements. Focus on the work order creation flow (1 REST call vs 3 SOAP calls) and the Contract 360 view (aggregated REST vs sequential SOAP). |
| **REST Endpoints** | All v2 endpoints |
| **Effort** | M (3 days) |
| **Dependencies** | P5-025, P5-026, P5-027 |
| **Acceptance Criteria** | (1) Benchmark report comparing v1 vs v2 for: work order creation (expect > 40% faster due to server-side orchestration), contract detail (expect similar latency but cleaner response), cached endpoints (expect > 80% faster on cache hit). (2) P95 latency documented for all v2 endpoints. (3) Cache hit ratio measured for typical agent workflows. (4) Concurrent user load test with 50 simultaneous agents. (5) Results inform cache TTL tuning. |

### Task P5-031: API Documentation (Swagger UI)

| Field | Value |
|-------|-------|
| **ID** | P5-031 |
| **Description** | Generate interactive API documentation using `rswag` gem. Documentation auto-generated from RSpec request specs and OpenAPI annotations. Deploy Swagger UI at `/api/v2/docs`. |
| **REST Endpoints** | `/api/v2/docs` (Swagger UI) |
| **Effort** | M (3 days) |
| **Dependencies** | P5-001, P5-010, P5-016, P5-017, P5-020, P5-021 |
| **Acceptance Criteria** | (1) Swagger UI accessible at `/api/v2/docs`. (2) All v2 endpoints documented with request/response examples. (3) Authentication documented (JWT Bearer token). (4) Error responses documented for each endpoint. (5) "Try it out" functionality works for authenticated users. (6) OpenAPI spec downloadable in YAML and JSON formats. |

---

## 7. Sprint 11-12 (Weeks 21-24): GraphQL Layer (Optional)

**Goal:** Evaluate and optionally implement a GraphQL layer for composite queries that aggregate data from multiple SOAP services.

### Task P5-032: Evaluate GraphQL Justification

| Field | Value |
|-------|-------|
| **ID** | P5-032 |
| **Description** | Analyze frontend data fetching patterns to determine if GraphQL is justified. The primary candidate is the "Contract 360" view which currently requires 5+ sequential REST calls. Measure actual usage patterns against the REST API to quantify the benefit of GraphQL's field selection and query composition. |
| **REST Endpoints** | N/A (analysis) |
| **Effort** | M (2 days) |
| **Dependencies** | P5-030 (performance data needed) |
| **Acceptance Criteria** | (1) Report documenting: number of multi-endpoint frontend views, average number of REST calls per page load, data overfetching ratio, latency of sequential calls vs projected GraphQL single call. (2) Go/no-go recommendation with quantified justification. (3) If go: identified subset of queries to implement. (4) If no-go: documented reasons and conditions for future reconsideration. |

### Task P5-033: Implement GraphQL Schema (if justified)

| Field | Value |
|-------|-------|
| **ID** | P5-033 |
| **Description** | If P5-032 recommends proceeding, implement a GraphQL layer using `graphql-ruby` gem. The GraphQL resolvers delegate to existing REST service objects (not direct SOAP calls). Focus on the Contract 360 query and Customer lookup. |
| **REST Endpoints** | `POST /api/v2/aquasis/graphql` |
| **Effort** | L (2 weeks) |
| **Dependencies** | P5-032 (go decision), P5-010, P5-011, P5-012, P5-017 |
| **Acceptance Criteria** | (1) GraphQL endpoint at `/api/v2/aquasis/graphql`. (2) `Contract` type with nested `meter`, `servicePoint`, `consumption`, `readings`, `debt`, `invoices` fields. (3) `Customer` type queryable by NIF with nested contracts. (4) Resolvers use existing `Aquasis::*Service` classes (no direct SOAP). (5) N+1 query prevention with `graphql-batch` or `dataloader`. (6) Query depth limit of 5 levels. (7) Complexity analysis to prevent expensive queries. (8) GraphiQL or Playground UI for development. |

**Target GraphQL query (Contract 360):**

```graphql
query ContractDetail($contractNumber: Int!) {
  contract(number: $contractNumber) {
    contractNumber
    holder
    exploitation
    status
    meter {
      serialNumber
      brand
      model
      servicePoint {
        id
        address
        geoLocation { lat, lng }
      }
    }
    consumption(last: 12) {
      period
      cubicMeters
    }
    readings(last: 6) {
      date
      value
      type
    }
    debt {
      totalAmount
      pendingInvoices
    }
    invoices(last: 5) {
      number
      date
      amount
      status
    }
  }
}
```

### Task P5-034: Decommission v1 SOAP Proxy

| Field | Value |
|-------|-------|
| **ID** | P5-034 |
| **Description** | After confirming all frontend traffic has migrated to v2 (via monitoring), decommission the v1 SOAP proxy. Follow the 30-day minimum transition period. |
| **REST Endpoints** | `/api/v1/cea/soap/*` (removal) |
| **Effort** | S (2 days) |
| **Dependencies** | P5-029, P5-030 |
| **Acceptance Criteria** | (1) Monitoring confirms zero v1 traffic for 30+ consecutive days. (2) v1 proxy routes removed from Rails routes. (3) `cea_proxy_controller.rb` deleted. (4) Frontend SOAP-related code confirmed absent. (5) `VITE_CEA_API_*` variables confirmed absent from all environments. (6) Rollback plan documented in case of unforeseen v1 dependency. |

---

## 8. OpenAPI Specification -- Resource Model Overview

The REST API is organized around 5 primary resources that map to the 5 Aquasis SOAP services:

### Resource Model

```
/api/v2/aquasis/
  contracts/
    GET    /:id                      -> consultaDetalleContrato
    GET    /:id/detail               -> getContrato
    POST   /search                   -> getContratos
    GET    /:id/debt                 -> getDeuda
    GET    /:id/readings             -> getLecturas
    GET    /:id/consumption          -> getConsumos
    GET    /:id/consumption/chart    -> getConsumosParaGraficas
    GET    /:id/invoices             -> getFacturas
    GET    /:id/invoices/:inv/pdf    -> getPdfFactura
    GET    /:id/concepts             -> getConceptos
    GET    /:id/tariff               -> getTarifaDeAguaPorContrato
    PUT    /:id/notifications/email  -> cambiarEmailNotificacionPersona
    PUT    /:id/notifications/contact-> cambiarPersonaNotificacionContrato
    PUT    /:id/invoice-type         -> cambiarTipoFacturaContrato
  customers/
    GET    /search?nif=...           -> getContratosPorNif
  meters/
    GET    /:serial/service-point    -> getPuntoServicioPorContador
  work-orders/
    POST   /                         -> crearOrdenTrabajo (orchestrated)
    GET    /:id                      -> refreshData
    POST   /:id/visits               -> informarVisita
    PUT    /:id/resolve              -> resolveOT
    GET    /:id/pdf                  -> getDocumentoOrdenTrabajo
  payments/
    POST   /document                 -> getDocumentoPago
    POST   /collect                  -> cobrarReferenciaFrmPago
    POST   /notify                   -> avisarPago
    POST   /cancel                   -> cancelarReferencia
  graphql (optional)
    POST   /                         -> Composite queries
```

### Response Envelope (Standard)

```json
{
  "data": { ... },
  "meta": {
    "source": "aquasis",
    "cachedAt": "2026-03-15T10:30:00Z",
    "requestId": "req_abc123",
    "pagination": {
      "page": 1,
      "perPage": 25,
      "totalCount": 142,
      "totalPages": 6
    }
  }
}
```

### Key Schema Transformations (SOAP -> REST)

| SOAP Field (Spanish) | REST Field (English camelCase) | Type |
|----------------------|-------------------------------|------|
| `numeroContrato` | `contractNumber` | integer |
| `nombreTitular` | `holder` | string |
| `explotacion` | `exploitation` | integer |
| `puntoSuministro` | `servicePoint` | object |
| `listaDeContadores` | `meters` | array |
| `snCortadoPorDeuda` | `cutForDebt` | boolean |
| `snCortadoPorVencimientoContrato` | `cutForExpiredContract` | boolean |
| `importeTotal` | `totalAmount` | string (monetary) |
| `fechaUltimoPago` | `lastPaymentDate` | ISO 8601 date |

---

## 9. Authentication Migration -- WS-Security to OAuth2/JWT

### Current State (Critical Security Issues)

```
[Vue Frontend]
  |-- VITE_CEA_API_USERNAME = "WSGESTIONDEUDA"  (visible in browser DevTools)
  |-- VITE_CEA_API_PASSWORD = "WSGESTIONDEUDA"  (visible in browser DevTools)
  |-- Builds SOAP XML with WS-Security UsernameToken in JavaScript
  |-- Sends SOAP XML through Rails proxy to Aquasis
```

**Risks:**
- Any user can extract Aquasis API credentials from the browser bundle
- Credentials are shared (not per-user) -- no individual accountability
- No audit trail linking Aquasis operations to specific agents
- Credential rotation requires redeploying the frontend

### Target State

```
[Vue Frontend]                    [Rails BFF]                        [Aquasis]
  |                                 |                                  |
  |-- JWT token (per-agent) ------> |                                  |
  |                                 |-- Validates JWT                  |
  |                                 |-- Extracts agent identity        |
  |                                 |-- Injects WS-Security from       |
  |                                 |   credentials.yml.enc            |
  |                                 |-- Calls SOAP with WS-Security -> |
  |                                 |-- Logs: agent + operation        |
  | <--- JSON response ------------ |                                  |
```

### Migration Steps

| Step | Action | Sprint |
|------|--------|--------|
| 1 | Store Aquasis credentials in `credentials.yml.enc` | Sprint 1-2 (P5-006) |
| 2 | Configure savon for server-side WS-Security injection | Sprint 1-2 (P5-003) |
| 3 | Extend AGORA JWT to include Aquasis operation permissions | Sprint 7-8 (P5-022) |
| 4 | Add `Authorization: Bearer` requirement to v2 endpoints | Sprint 7-8 (P5-022) |
| 5 | Remove `VITE_CEA_API_*` variables from frontend | Sprint 9-10 (P5-029) |
| 6 | Implement per-agent audit logging | Sprint 7-8 (P5-023) |

### JWT Claims Structure

```json
{
  "sub": "agent_12345",
  "name": "Maria Garcia",
  "role": "agent",
  "permissions": [
    "aquasis:contracts:read",
    "aquasis:work_orders:write",
    "aquasis:payments:write",
    "aquasis:customers:read"
  ],
  "iat": 1710500000,
  "exp": 1710536000
}
```

---

## 10. Risk Register

| ID | Risk | Probability | Impact | Mitigation |
|----|------|:-----------:|:------:|------------|
| R1 | **Aquasis WSDL changes** break savon client mappings | MEDIUM | HIGH | Pin savon to specific WSDL versions. VCR cassettes detect regressions. Notification alert on WSDL checksum change. |
| R2 | **Performance degradation** from extra Rails processing layer | LOW | MEDIUM | BFF adds ~5-10ms processing overhead, offset by caching (>80% faster on cache hit) and reduced round trips (work order: 1 call vs 3). Benchmark in Sprint 9-10. |
| R3 | **Feature flag complexity** causes inconsistent behavior during transition | MEDIUM | MEDIUM | Strict per-operation flags (not per-page). Default to v2 for new code. Weekly flag cleanup reviews. |
| R4 | **savon gem incompatibility** with Aquasis WSDL quirks (mixed namespaces, deep nesting) | MEDIUM | HIGH | Spike savon integration in Sprint 1 before committing. Fallback: raw Faraday HTTP with hand-crafted XML if savon fails. |
| R5 | **Credential exposure window** between v2 backend migration and v1 frontend removal | LOW | HIGH | P5-006 (credential server-side) is Sprint 1-2 priority. Even v1 proxy can be hardened to read credentials server-side before full BFF migration. |
| R6 | **Data sovereignty concerns** with caching customer data in Redis | LOW | HIGH | Redis deployed on-premise (same infrastructure as AGORA). No cloud caching. TTLs ensure data is not retained beyond operational need. |
| R7 | **Team bandwidth** insufficient for 24-week timeline | MEDIUM | MEDIUM | Phases are independent and can be rescheduled. Sprint 11-12 (GraphQL) is explicitly optional. Core migration (Sprints 1-10) can complete in 20 weeks with 2 developers. |
| R8 | **SOAP fault mapping** misses edge cases, returning generic errors | MEDIUM | LOW | Catalog known faults from VCR cassettes. Monitor production error logs for unmapped faults. Add mappings iteratively. |
| R9 | **Frontend regression** during Vue component migration | MEDIUM | MEDIUM | Feature flags enable instant rollback per operation. Visual regression testing with Playwright screenshots. |
| R10 | **Payment operation errors** with financial consequences | LOW | CRITICAL | Idempotency keys mandatory. Double-entry logging (request + response). Manual reconciliation process documented. Payment endpoints behind additional RBAC check. |

---

## 11. Staffing and Resource Plan

### Core Team

| Role | Person-Months | Sprint Allocation | Key Deliverables |
|------|:------------:|-------------------|------------------|
| **Senior Backend Developer (Rails)** | 6 | Sprints 1-12 (full time) | BaseClient, service objects, controllers, caching, circuit breaker, savon integration |
| **Full-Stack Developer (Vue + Rails)** | 5 | Sprints 1-2 (backend support), 3-8 (serializers + frontend prep), 9-10 (frontend migration lead) | OpenAPI spec, serializers, aquasis.js client, Vue component migration, feature flags |
| **QA Engineer (0.5 FTE)** | 3 | Sprints 3-4, 7-8, 9-10 | VCR cassette management, integration tests, performance benchmarks, payment validation |
| **API Architect (0.25 FTE)** | 1.5 | Sprints 1-2 (design), 5-6 (review), 11-12 (GraphQL) | Resource model design, OpenAPI review, GraphQL schema design |

### Skill Requirements

| Skill | Required For | Priority |
|-------|-------------|----------|
| Rails API development (controllers, serializers, routing) | All sprints | CRITICAL |
| savon gem (or equivalent SOAP client in Ruby) | Sprint 1-2 foundation | CRITICAL |
| OpenAPI 3.0 specification authoring | Sprint 1-2 design | HIGH |
| Redis caching patterns | Sprint 1-2 infrastructure | HIGH |
| Vue 3 Composition API | Sprint 9-10 frontend migration | HIGH |
| GraphQL (graphql-ruby) | Sprint 11-12 (optional) | LOW |
| WS-Security / OASIS standards | Sprint 1-2 credential fix | MEDIUM |
| RSpec + VCR + WebMock | All sprints (testing) | HIGH |

### Budget Estimate

| Item | Cost | Notes |
|------|------|-------|
| Senior Backend Developer (6 months) | Internal staffing | Existing team or new hire |
| Full-Stack Developer (5 months) | Internal staffing | Existing team or new hire |
| QA Engineer (3 months at 0.5 FTE) | Internal staffing | Can be shared with other projects |
| API Architect (1.5 months at 0.25 FTE) | Internal staffing or consultant | Design review role |
| APImatic license (optional) | ~$200/month | WSDL-to-OpenAPI first-pass generation |
| **Total additional infrastructure cost** | **$0** | All tools (Rails, Redis, savon) are free/existing |

---

## Appendix A: Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| SOAP Client | `savon` gem (~> 2.14) | WSDL parsing, WS-Security, complex type handling |
| REST Framework | Rails 7 API mode (existing) | Leverage existing AGORA infrastructure |
| Serialization | `alba` gem (preferred) or `jbuilder` | Response transformation (SOAP DTOs -> clean JSON) |
| API Documentation | `rswag` gem | OpenAPI 3.1 spec generation from RSpec tests |
| Caching | Redis (existing) | Cache catalogs, contract details, service points |
| Background Jobs | Sidekiq (existing) | Async: bulk invoice requests, PDF generation |
| HTTP Client | `faraday` gem | CEA REST API calls with connection pooling, retry |
| Circuit Breaker | `stoplight` gem | Prevent cascade failures when Aquasis is down |
| Testing | RSpec + VCR + WebMock | Record/replay SOAP interactions |
| Feature Flags | `flipper` gem | Per-operation v1/v2 toggle |
| JWT Auth | `jwt` gem + existing AGORA auth | Frontend-to-BFF authentication |
| GraphQL (optional) | `graphql-ruby` gem | Composite queries for Contract 360 |

## Appendix B: SOAP Operation to REST Endpoint Mapping (17 Integrated Operations)

| # | SOAP Operation | Service | REST Endpoint | Method | Auth |
|---|---------------|---------|---------------|--------|------|
| 1 | `consultaDetalleContrato` | Contracts | `/api/v2/aquasis/contracts/:id` | GET | None |
| 2 | `getContrato` | Contracts | `/api/v2/aquasis/contracts/:id/detail` | GET | None |
| 3 | `getContratos` | Contracts | `/api/v2/aquasis/contracts/search` | POST | JWT |
| 4 | `getPdfFactura` | Contracts | `/api/v2/aquasis/contracts/:id/invoices/:inv/pdf` | GET | JWT |
| 5 | `getDeuda` | Debt | `/api/v2/aquasis/contracts/:id/debt` | GET | JWT |
| 6 | `getPuntoServicioPorContador` | Meters | `/api/v2/aquasis/meters/:serial/service-point` | GET | None |
| 7 | `cambiarEmailNotificacionPersona` | Readings | `/api/v2/aquasis/contracts/:id/notifications/email` | PUT | JWT |
| 8 | `cambiarPersonaNotificacionContrato` | Readings | `/api/v2/aquasis/contracts/:id/notifications/contact` | PUT | JWT |
| 9 | `cambiarTipoFacturaContrato` | Readings | `/api/v2/aquasis/contracts/:id/invoice-type` | PUT | JWT |
| 10 | `getConceptos` | Readings | `/api/v2/aquasis/contracts/:id/concepts` | GET | None |
| 11 | `getConsumos` | Readings | `/api/v2/aquasis/contracts/:id/consumption` | GET | JWT |
| 12 | `getConsumosParaGraficas` | Readings | `/api/v2/aquasis/contracts/:id/consumption/chart` | GET | None |
| 13 | `getFacturas` | Readings | `/api/v2/aquasis/contracts/:id/invoices` | GET | None |
| 14 | `getLecturas` | Readings | `/api/v2/aquasis/contracts/:id/readings` | GET | JWT |
| 15 | `getTarifaDeAguaPorContrato` | Readings | `/api/v2/aquasis/contracts/:id/tariff` | GET | None |
| 16 | `crearOrdenTrabajo` | Work Orders | `/api/v2/aquasis/work-orders` | POST | JWT |
| 17 | `informarVisita` | Work Orders | `/api/v2/aquasis/work-orders/:id/visits` | POST | JWT |
| 18 | `resolveOT` | Work Orders | `/api/v2/aquasis/work-orders/:id/resolve` | PUT | JWT |

## Appendix C: Known WSDL Bugs Handled by BFF

| Bug ID | Operation | Issue | BFF Handling |
|--------|-----------|-------|-------------|
| BUG-1 | `crearOrdenTrabajo` | `NullPointerException` on missing `idPtoServicio` | Validate before SOAP call; return HTTP 422 |
| BUG-2 | `crearOrdenTrabajo` | Missing WS-Security causes 500 | Inject WS-Security server-side |
| BUG-3 | `refreshData` | Wrong `otClassID` and missing `operationalSiteID` | Set `otClassID=1`, populate `operationalSiteID` |
| BUG-4 | Debt operations | `reultado` typo in response DTOs | Check both `resultado` and `reultado` |
| BUG-6 | `getDocumentoOrdenTrabajo` | Dual `ResultadoDTO` with mixed `codigoError` types | Type-aware parsing for string and int |
| BUG-7 | `resolveOT` | `busVHFumberSerie` WSDL typo | Use misspelled field name internally |
| BUG-8 | `resolveOT` | `vistitComments` WSDL typo | Use misspelled field name internally |
| BUG-9 | `cambiarEmailNotificacionPersona` | `emailAntigo` WSDL typo | Use misspelled field name internally |
