# C4 -- Cloud-Native Architecture for AquaCIS 2.0

> **Agent**: C4 (research-cloud-native)
> **Date**: 2026-02-16
> **Classification**: Architecture Research Report
> **Scope**: Cloud-native CIS architecture patterns for CEA Queretaro next-generation water utility system

---

## Executive Summary

AquaCIS, the current Customer Information System for CEA Queretaro, is a monolithic Java EE application (branded "Aquasis" by Aqualia/Agbar) running on PostgreSQL with 4,114 tables, SOAP-based APIs, and tightly coupled domains spanning billing, metering, contracts, work orders, and debt management. The system serves 13 municipalities across Queretaro state, processing water utility operations for hundreds of thousands of service connections.

This report evaluates cloud-native architecture patterns for AquaCIS 2.0, analyzing microservices decomposition, event-driven patterns, container orchestration, data architecture, and compliance requirements specific to a Mexican water utility. The analysis is grounded in the actual AquaCIS domain model (126 SOAP operations across 5 services, 9 tier-1 critical tables, 25 tier-2 essential tables) and proposes a pragmatic migration path from the current monolith.

**Key findings:**

1. The AquaCIS domain naturally decomposes into 8-10 bounded contexts that map well to microservices, with Billing and Metering being the highest-value candidates for event-driven architecture.
2. CQRS and event sourcing provide significant advantages for billing audit trails, consumption analytics, and regulatory compliance (CFDI, LGPDPPP).
3. AWS and Azure both have direct presence in Mexico (Queretaro region), making data sovereignty compliance straightforward.
4. A strangler fig migration pattern is recommended, wrapping existing SOAP APIs with an API gateway and incrementally extracting services over 18-24 months.
5. The current database's structural problems (2,643 table-per-value anti-pattern instances, 230 history tables) actually make the case for event sourcing stronger, as the monolith has been trying to implement audit/history patterns through table proliferation.

**Cloud Readiness Score: 4/10** (current state) -- significant modernization needed, but the existing SOAP API surface and clear domain boundaries provide a viable migration path.

---

## 1. Domain Decomposition: Recommended Microservice Boundaries

### 1.1 Analysis of Current Domain Model

The existing AquaCIS system exposes 5 SOAP services with 126 operations, backed by a PostgreSQL database organized around these core entities:

| Current Service | Operations | Core Tables | Domain Concept |
|----------------|:----------:|-------------|----------------|
| Contracts (InterfazGenericaContratacionWS) | 53 | contrato, persona, cliente, ptoserv, factura, facturable | Contract lifecycle, customer identity, invoicing |
| Debt Management (InterfazGenericaGestionDeudaWS) | 13 | contratodeuda, opecargest, opedesglos, gescartera | Collections, payment processing |
| Meters (InterfazGenericaContadoresWS) | 4 | contador, servicio, acometida, equipo | Physical infrastructure, meters |
| Readings & Portal (InterfazOficinaVirtualClientesWS) | 47 | poldetsum, polcontar, lote, zona | Consumption data, self-service |
| Work Orders (InterfazGenericaOrdenesServicioWS) | 9 | orden | Field operations |

The Contracts service is severely overloaded at 53 operations, handling contract management, invoicing, customer data, and service order creation -- a clear candidate for decomposition.

### 1.2 Recommended Bounded Contexts

Applying Domain-Driven Design principles to the AquaCIS domain, the following bounded contexts are recommended:

```
+------------------------------------------------------------------+
|                    AquaCIS 2.0 Microservices                      |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  | 1. CUSTOMER      |  | 2. CONTRACT      |  | 3. BILLING       |  |
|  |    IDENTITY      |  |    MANAGEMENT    |  |    ENGINE        |  |
|  |                  |  |                  |  |                  |  |
|  | persona          |  | contrato         |  | factura          |  |
|  | cliente          |  | polcontar        |  | facturable       |  |
|  | direccion        |  | sociedad         |  | linfactura       |  |
|  | personadir       |  | ptoserv          |  | facturacio       |  |
|  |                  |  |                  |  | concepto         |  |
|  +------------------+  +------------------+  | tarifa           |  |
|                                              | impufact         |  |
|  +------------------+  +------------------+  +------------------+  |
|  | 4. METERING &    |  | 5. PAYMENTS &    |                       |
|  |    READINGS      |  |    COLLECTIONS   |  +------------------+  |
|  |                  |  |                  |  | 6. WORK ORDER    |  |
|  | contador         |  | opecargest       |  |    MANAGEMENT    |  |
|  | poldetsum        |  | opedesglos       |  |                  |  |
|  | lote             |  | gescartera       |  | orden            |  |
|  | zona             |  | referencia       |  | field dispatch   |  |
|  | equipo           |  | contratodeuda    |  | mobile workforce |  |
|  | observac         |  | movccontrato     |  +------------------+  |
|  +------------------+  +------------------+                       |
|                                                                    |
|  +------------------+  +------------------+  +------------------+  |
|  | 7. INFRASTRUC-   |  | 8. FISCAL &      |  | 9. NOTIFICATIONS |  |
|  |    TURE (GIS)    |  |    COMPLIANCE    |  |    & COMMS       |  |
|  |                  |  |                  |  |                  |  |
|  | acometida        |  | CFDI engine      |  | email / SMS      |  |
|  | servicio         |  | LGPDPPP consent  |  | WhatsApp         |  |
|  | spatial data     |  | SAT reporting    |  | push / IVR       |  |
|  +------------------+  +------------------+  +------------------+  |
|                                                                    |
|  +------------------+                                              |
|  | 10. ANALYTICS &  |                                              |
|  |     REPORTING    |                                              |
|  |                  |                                              |
|  | data warehouse   |                                              |
|  | dashboards       |                                              |
|  | regulatory rpts  |                                              |
|  +------------------+                                              |
+------------------------------------------------------------------+
```

### 1.3 Service Boundary Rationale

| # | Bounded Context | Why Separate | Data Ownership | Scale Profile |
|---|----------------|-------------|----------------|---------------|
| 1 | **Customer Identity** | Central identity shared by all services; changes infrequently; strong consistency needs | persona, cliente, direccion | Low write, high read |
| 2 | **Contract Management** | Core business entity with complex lifecycle (alta, baja, cambio titular, subrogacion); links customer to service point | contrato, polcontar, sociedad, ptoserv | Medium write, high read |
| 3 | **Billing Engine** | Computationally intensive batch processing (facturacion runs); strict consistency for financial data; CFDI compliance | factura, facturable, linfactura, tarifa, concepto | Periodic burst (billing cycles), medium read |
| 4 | **Metering & Readings** | High-volume data ingestion (meter readings); time-series data; future smart meter streams; separate scaling needs | contador, poldetsum, lote, zona, equipo | High write (reading campaigns), medium read |
| 5 | **Payments & Collections** | Financial transaction processing; bank integration; reconciliation; distinct security requirements | opecargest, opedesglos, gescartera, referencia | Medium write, high read |
| 6 | **Work Order Management** | Field operations with mobile requirements; independent lifecycle; geospatial routing | orden | Medium write/read, mobile-first |
| 7 | **Infrastructure (GIS)** | Spatial data with specialized storage needs; integration with GIS platforms; separate from commercial system | acometida, servicio, spatial data | Low write, specialized queries |
| 8 | **Fiscal & Compliance** | Mexican regulatory requirements (CFDI, SAT); changes with legislation; audit trail requirements | CFDI data, tax records | Event-driven, append-only |
| 9 | **Notifications & Comms** | Multi-channel delivery; integration with AGORA platform; rate limiting; template management | Message queues, templates | High throughput, async |
| 10 | **Analytics & Reporting** | Read-only aggregations; different query patterns; can tolerate eventual consistency | Materialized views, data warehouse | Read-heavy, batch refresh |

### 1.4 Inter-Service Communication Patterns

```
Customer Identity  <---sync query---  Contract Mgmt  ---events--->  Billing Engine
                                           |                            |
                                           |                            v
                                      events (contract               Payments &
                                       created/modified)             Collections
                                           |                            |
                                           v                            v
                                      Work Order Mgmt              Fiscal/CFDI
                                           |
                                           v
                                      Metering & Readings ---events---> Analytics

Cross-cutting: Notifications service subscribes to events from all domains
```

**Synchronous calls (gRPC or REST):**
- Contract Management --> Customer Identity (lookup persona/cliente)
- Billing Engine --> Contract Management (get active contracts for billing run)
- Billing Engine --> Metering & Readings (get latest readings)
- Payments --> Billing Engine (get outstanding invoices)

**Asynchronous events (message broker):**
- Contract created/modified --> Billing, Work Orders, Analytics
- Meter reading recorded --> Billing (trigger billing if threshold), Analytics
- Invoice generated --> Payments (create references), Notifications (send bill), Fiscal (generate CFDI)
- Payment received --> Contract Mgmt (update balance), Notifications (send receipt), Analytics
- Work order completed --> Contract Mgmt, Metering (if meter change)

---

## 2. Event-Driven Patterns: Event Sourcing and CQRS

### 2.1 Why Event-Driven for Water Utility CIS

The current AquaCIS system already exhibits patterns that suggest event-driven architecture is a natural fit:

1. **History table proliferation**: The database has 230 `his*` tables tracking changes to entities -- this is essentially a manual, table-based implementation of event sourcing.
2. **Audit requirements**: Mexican regulatory compliance (CFDI, SAT) requires complete audit trails for all financial transactions.
3. **Batch billing cycles**: Billing runs are inherently event-driven -- triggered by reading campaigns completing, producing invoices as events.
4. **Multi-system integration**: The AGORA platform, CEA REST API, and AquaCIS SOAP endpoints already communicate through event-like patterns (service order creation triggers cross-system updates).

### 2.2 CQRS Pattern for Billing Domain

The Billing Engine is the highest-value candidate for CQRS (Command Query Responsibility Segregation):

```
                         BILLING DOMAIN (CQRS)
+------------------------------------------------------------------+
|                                                                    |
|  COMMAND SIDE                        QUERY SIDE                   |
|  (Write Model)                       (Read Model)                 |
|                                                                    |
|  +-------------------+              +-------------------+          |
|  | Billing Commands  |              | Invoice Queries   |          |
|  |                   |              |                   |          |
|  | - CreateBillingRun|   events     | - GetInvoice      |          |
|  | - CalculateCharges| ----------> | - ListInvoices    |          |
|  | - ApplyTariff     |              | - GetStatement    |          |
|  | - GenerateInvoice |              | - GetCFDI         |          |
|  | - ApplyAdjustment |              | - DebtSummary     |          |
|  +-------------------+              +-------------------+          |
|          |                                   ^                     |
|          v                                   |                     |
|  +-------------------+              +-------------------+          |
|  | Event Store       |  projection  | Read Database     |          |
|  | (append-only)     | ----------> | (optimized views) |          |
|  |                   |              |                   |          |
|  | BillingRunStarted |              | invoice_summary   |          |
|  | ChargesCalculated |              | debt_by_contract  |          |
|  | TariffApplied     |              | billing_history   |          |
|  | InvoiceGenerated  |              | payment_status    |          |
|  | AdjustmentApplied |              | cfdi_records      |          |
|  +-------------------+              +-------------------+          |
|                                                                    |
+------------------------------------------------------------------+
```

**Benefits for CEA Queretaro:**
- **Complete audit trail**: Every billing calculation is traceable (replaces 230 his* tables with a unified event log)
- **Billing dispute resolution**: Replay events to prove how a specific charge was calculated
- **Regulatory compliance**: CFDI generation becomes an event handler, ensuring every invoice has its corresponding fiscal document
- **Temporal queries**: "What was this customer's tariff on date X?" is answered by replaying events up to that point
- **Billing corrections**: Adjustments are new events, not mutations -- the original calculation is preserved

### 2.3 Event Sourcing for Metering Domain

```
                      METERING DOMAIN (Event Sourced)
+------------------------------------------------------------------+
|                                                                    |
|  Events (append-only log):                                        |
|                                                                    |
|  MeterInstalled { meterId, contractId, serialNumber, date }       |
|  ReadingRecorded { meterId, value, readerId, photo, gps, date }   |
|  ReadingValidated { meterId, readingId, status, anomalyCode }     |
|  ConsumptionCalculated { meterId, period, m3, previousReading }   |
|  AnomalyDetected { meterId, type, confidence, details }           |
|  MeterReplaced { oldMeterId, newMeterId, finalReading, date }     |
|  SmartMeterTelemetry { meterId, value, batteryLevel, signal }     |
|                                                                    |
|  Projections:                                                      |
|  +-------------------+  +-------------------+  +----------------+ |
|  | Current Readings  |  | Consumption       |  | Anomaly        | |
|  | (latest per meter)|  | History           |  | Dashboard      | |
|  +-------------------+  +-------------------+  +----------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### 2.4 Event Catalog (Core Domain Events)

| Domain | Event | Producers | Consumers |
|--------|-------|-----------|-----------|
| **Contract** | ContractCreated | Contract Service | Billing, Metering, Analytics, Notifications |
| **Contract** | ContractModified | Contract Service | Billing, Analytics |
| **Contract** | ContractTerminated | Contract Service | Billing, Metering, Work Orders, Analytics |
| **Contract** | OwnershipTransferred | Contract Service | Billing, Notifications, Fiscal |
| **Metering** | ReadingRecorded | Metering Service, Mobile App | Billing, Analytics |
| **Metering** | ReadingCampaignCompleted | Metering Service | Billing (triggers billing run) |
| **Metering** | AnomalyDetected | Metering Service | Work Orders, Notifications |
| **Metering** | MeterInstalled | Work Orders | Metering, Contract Service |
| **Billing** | BillingRunStarted | Billing Service | Analytics, Notifications (internal) |
| **Billing** | InvoiceGenerated | Billing Service | Payments, Fiscal (CFDI), Notifications |
| **Billing** | InvoiceCorrected | Billing Service | Payments, Fiscal, Notifications |
| **Payments** | PaymentReceived | Payment Service | Contract Service, Notifications, Analytics |
| **Payments** | PaymentReversed | Payment Service | Contract Service, Notifications |
| **Payments** | DebtStatusChanged | Payment Service | Work Orders (cutoff), Notifications |
| **Work Orders** | WorkOrderCreated | Work Order Service, AGORA | Contract Service, Notifications |
| **Work Orders** | WorkOrderCompleted | Mobile App | Contract Service, Metering, Analytics |
| **Fiscal** | CFDIGenerated | Fiscal Service | Billing (update status), Analytics |
| **Fiscal** | CFDICancelled | Fiscal Service | Billing, Notifications |

### 2.5 Message Broker Selection

| Criteria | Apache Kafka | Amazon EventBridge | Azure Service Bus | RabbitMQ |
|----------|:---:|:---:|:---:|:---:|
| Event sourcing native | Yes | No | No | No |
| Ordered delivery | Yes (per partition) | Best effort | Yes (sessions) | Yes (per queue) |
| Replay capability | Yes (retention) | No | No (dead letter only) | No |
| Throughput (smart meters) | Excellent | Good | Good | Good |
| Managed in Mexico region | Yes (MSK) | Yes | Yes | Self-managed |
| Cost at CEA scale | Medium | Low | Low-Medium | Low |
| Operational complexity | High | Low | Low | Medium |

**Recommendation**: Apache Kafka (Amazon MSK or Confluent Cloud) for the event backbone, with event sourcing for Billing and Metering domains. Kafka's log-based architecture natively supports event replay, which replaces the current 230 his* tables with a single, unified audit mechanism.

### 2.6 Saga Patterns for Distributed Transactions

The billing cycle is the most complex workflow, requiring a saga pattern:

```
BILLING RUN SAGA:
1. BillingRunRequested
   --> Metering: GetReadingsForBillingZone
2. ReadingsRetrieved
   --> Billing: CalculateChargesForContracts
3. ChargesCalculated
   --> Billing: ApplyTariffsAndDiscounts
4. TariffsApplied
   --> Billing: GenerateInvoices
5. InvoicesGenerated
   --> Fiscal: GenerateCFDIs
6. CFDIsGenerated
   --> Payments: CreatePaymentReferences (OXXO, bank)
7. PaymentReferencesCreated
   --> Notifications: SendBillNotifications
8. NotificationsSent
   --> Billing: MarkBillingRunComplete

COMPENSATING ACTIONS:
- If CFDI generation fails --> Mark invoices as pending-fiscal, retry
- If payment reference fails --> Queue for manual reference creation
- If notification fails --> Queue for retry (non-blocking)
```

---

## 3. Container Architecture: Kubernetes Cluster Design

### 3.1 Cluster Topology

```
                    AquaCIS 2.0 Kubernetes Architecture
+====================================================================+
|                        INGRESS LAYER                                |
|  +------------------+  +------------------+  +------------------+   |
|  | AWS ALB /        |  | WAF              |  | CDN              |   |
|  | Azure Front Door |  | (rate limiting)  |  | (static assets)  |   |
|  +------------------+  +------------------+  +------------------+   |
+====================================================================+
|                        API GATEWAY                                  |
|  +------------------------------------------------------------------+
|  | Kong / AWS API Gateway / Azure APIM                              |
|  | - Authentication (OAuth2 / JWT)                                  |
|  | - Rate limiting per tenant/municipality                          |
|  | - Request routing (REST + gRPC)                                  |
|  | - Legacy SOAP proxy (strangler fig for AquaCIS SOAP endpoints)   |
|  +------------------------------------------------------------------+
+====================================================================+
|                    KUBERNETES CLUSTER                               |
|                                                                     |
|  NAMESPACE: aquacis-core                                           |
|  +---------------+ +---------------+ +---------------+              |
|  | customer-     | | contract-     | | billing-      |              |
|  | identity-svc  | | mgmt-svc     | | engine-svc    |              |
|  | replicas: 2   | | replicas: 3   | | replicas: 2-8 |              |
|  | CPU: 0.5      | | CPU: 1        | | CPU: 2-4      |              |
|  | RAM: 512Mi    | | RAM: 1Gi      | | RAM: 2-8Gi    |              |
|  +---------------+ +---------------+ +---------------+              |
|                                                                     |
|  +---------------+ +---------------+ +---------------+              |
|  | metering-     | | payments-     | | work-order-   |              |
|  | readings-svc  | | collections   | | mgmt-svc     |              |
|  | replicas: 2-6 | | replicas: 2-4 | | replicas: 2   |              |
|  | CPU: 1        | | CPU: 1        | | CPU: 0.5      |              |
|  | RAM: 1Gi      | | RAM: 1Gi      | | RAM: 512Mi    |              |
|  +---------------+ +---------------+ +---------------+              |
|                                                                     |
|  NAMESPACE: aquacis-support                                        |
|  +---------------+ +---------------+ +---------------+              |
|  | infrastructure| | fiscal-cfdi-  | | notification- |              |
|  | gis-svc       | | svc           | | svc           |              |
|  | replicas: 1-2 | | replicas: 2   | | replicas: 2-4 |              |
|  +---------------+ +---------------+ +---------------+              |
|                                                                     |
|  NAMESPACE: aquacis-data                                           |
|  +---------------+ +---------------+ +---------------+              |
|  | kafka-cluster | | redis-cluster | | elasticsearch |              |
|  | (MSK/Strimzi) | | (cache/       | | (search/logs) |              |
|  | 3 brokers     | |  sessions)    | | 3 nodes       |              |
|  +---------------+ +---------------+ +---------------+              |
|                                                                     |
|  NAMESPACE: aquacis-observability                                  |
|  +---------------+ +---------------+ +---------------+              |
|  | prometheus    | | grafana       | | jaeger        |              |
|  | (metrics)     | | (dashboards)  | | (tracing)     |              |
|  +---------------+ +---------------+ +---------------+              |
|                                                                     |
+====================================================================+
|                    DATA LAYER (Managed Services)                    |
|  +---------------+ +---------------+ +---------------+              |
|  | PostgreSQL    | | TimescaleDB / | | S3/Blob       |              |
|  | (per-service  | | InfluxDB      | | (documents,   |              |
|  |  databases)   | | (meter time-  | |  CFDI XML,    |              |
|  |               | |  series data) | |  images)      |              |
|  +---------------+ +---------------+ +---------------+              |
+====================================================================+
```

### 3.2 Namespace Strategy

| Namespace | Purpose | Resource Quotas | Network Policy |
|-----------|---------|----------------|----------------|
| `aquacis-core` | Business microservices | 16 CPU, 32Gi RAM | Allow inter-service, deny external |
| `aquacis-support` | Supporting services | 8 CPU, 16Gi RAM | Allow from core, deny external |
| `aquacis-data` | Data infrastructure | 24 CPU, 64Gi RAM | Allow from core/support only |
| `aquacis-observability` | Monitoring stack | 8 CPU, 16Gi RAM | Read from all namespaces |
| `aquacis-jobs` | Batch jobs (billing runs, reports) | 16 CPU, 32Gi RAM (burstable) | Same as core |
| `aquacis-legacy` | Strangler fig SOAP proxy | 4 CPU, 8Gi RAM | Allow from gateway, connect to legacy |

### 3.3 Auto-Scaling Configuration

| Service | Min Replicas | Max Replicas | Scale Trigger | Scale Profile |
|---------|:---:|:---:|---|---|
| billing-engine | 2 | 8 | CPU > 70% OR billing-run-queue depth > 100 | **Burst** during billing cycles (1st-5th of month) |
| metering-readings | 2 | 6 | Message lag > 1000 readings | **Burst** during reading campaigns (varies by zone) |
| payments-collections | 2 | 4 | CPU > 60% OR payment-queue depth > 50 | **Steady** with spikes on payment deadlines |
| notification-svc | 2 | 8 | Queue depth > 500 | **Burst** after billing runs (mass notifications) |
| customer-identity | 2 | 3 | CPU > 80% | **Steady** -- mostly reads |
| contract-mgmt | 2 | 4 | CPU > 70% | **Steady** with seasonal new contract surges |
| work-order-mgmt | 2 | 3 | CPU > 70% | **Steady** |

### 3.4 Kubernetes Operators and Custom Resources

```yaml
# Example: BillingRun CRD (Custom Resource Definition)
apiVersion: aquacis.ceaqueretaro.gob.mx/v1
kind: BillingRun
metadata:
  name: billing-run-2026-02-zone-a
  namespace: aquacis-jobs
spec:
  zone: "zone-a"
  billingCycle: "2026-02"
  municipalities:
    - queretaro
    - corregidora
    - marques
  parallelism: 4
  retryPolicy:
    maxRetries: 3
    backoffMultiplier: 2
  timeout: "4h"
  notifications:
    onComplete: true
    onFailure: true
    channels: ["email", "slack"]
status:
  phase: Running
  contractsProcessed: 45230
  contractsTotal: 89456
  invoicesGenerated: 44980
  errors: 3
  startTime: "2026-02-01T02:00:00Z"
```

### 3.5 Service Mesh

**Recommendation**: Istio or Linkerd for service mesh capabilities:

- **mTLS**: All inter-service communication encrypted (required for LGPDPPP personal data in transit)
- **Traffic management**: Canary deployments for billing engine updates (critical -- billing errors affect revenue)
- **Circuit breakers**: Prevent cascade failures (e.g., if CFDI/SAT service is down, billing should queue fiscal requests rather than fail)
- **Observability**: Distributed tracing across the billing saga
- **Rate limiting**: Per-municipality rate limits on API gateway

---

## 4. Data Architecture: Data Mesh and Data Lake Patterns

### 4.1 Database-Per-Service Strategy

Each microservice owns its data store, eliminating the current monolithic 4,114-table database:

| Service | Primary Store | Purpose | Migration From |
|---------|--------------|---------|----------------|
| Customer Identity | PostgreSQL | Relational customer data | persona, cliente, direccion, personadir |
| Contract Management | PostgreSQL | Contract lifecycle, service points | contrato, ptoserv, sociedad, polcontar |
| Billing Engine | PostgreSQL + Event Store | Financial transactions, event sourcing | factura, facturable, linfactura, tarifa, concepto, facturacio |
| Metering & Readings | TimescaleDB (PostgreSQL ext.) | Time-series meter readings | contador, poldetsum, lote, zona, equipo |
| Payments & Collections | PostgreSQL | Financial transactions | opecargest, opedesglos, gescartera, referencia, movccontrato |
| Work Order Management | PostgreSQL + PostGIS | Work orders with geospatial | orden |
| Infrastructure (GIS) | PostgreSQL + PostGIS | Spatial infrastructure data | acometida, servicio, all vgis_* tables |
| Fiscal & Compliance | PostgreSQL + S3 (XML storage) | CFDI records, tax documents | impufact, ingresoscfdi |
| Notifications | Redis + PostgreSQL | Template storage, delivery tracking | New service |
| Analytics | Data Lake (S3/ADLS) + Data Warehouse | Aggregated analytics | All vw_gis_*, report tables |

### 4.2 Data Lake Architecture

```
                        AquaCIS DATA LAKE
+====================================================================+
|                                                                     |
|  INGESTION LAYER                                                   |
|  +------------------+  +------------------+  +------------------+   |
|  | Kafka Connect    |  | AWS Glue /       |  | Direct S3       |   |
|  | (CDC from        |  | Azure Data       |  | upload          |   |
|  |  service DBs)    |  | Factory          |  | (CFDI XMLs)     |   |
|  +------------------+  +------------------+  +------------------+   |
|                                                                     |
|  STORAGE LAYER (S3 / Azure Data Lake Storage Gen2)                 |
|  +------------------------------------------------------------------+
|  |                                                                  |
|  |  /raw/                    /processed/            /curated/       |
|  |  - meter_readings/        - consumption_agg/     - kpis/        |
|  |  - billing_events/        - revenue_summary/     - dashboards/  |
|  |  - payment_events/        - customer_360/        - regulatory/  |
|  |  - work_orders/           - network_analysis/    - open_data/   |
|  |  - cfdi_xml/              - anomaly_scores/                     |
|  |                                                                  |
|  +------------------------------------------------------------------+
|                                                                     |
|  PROCESSING LAYER                                                  |
|  +------------------+  +------------------+  +------------------+   |
|  | Apache Spark /   |  | dbt              |  | Apache Flink    |   |
|  | AWS Glue         |  | (transformations)|  | (stream         |   |
|  | (batch ETL)      |  |                  |  |  processing)    |   |
|  +------------------+  +------------------+  +------------------+   |
|                                                                     |
|  SERVING LAYER                                                     |
|  +------------------+  +------------------+  +------------------+   |
|  | Amazon Redshift /|  | Elasticsearch    |  | Apache Superset |   |
|  | Azure Synapse    |  | (full-text       |  | / Metabase      |   |
|  | (data warehouse) |  |  search)         |  | (BI dashboards) |   |
|  +------------------+  +------------------+  +------------------+   |
|                                                                     |
+====================================================================+
```

### 4.3 Data Mesh Principles Applied

Following data mesh principles, each domain team owns their data products:

| Data Product | Owner Domain | Consumers | SLA |
|-------------|-------------|-----------|-----|
| Customer 360 Profile | Customer Identity | Analytics, Notifications, CRM | 99.9%, < 5min freshness |
| Consumption Analytics | Metering & Readings | Analytics, Billing, Customer Portal | 99.5%, hourly refresh |
| Revenue & Collections | Billing + Payments | Analytics, Finance, Regulatory | 99.9%, daily refresh |
| Network Performance | Infrastructure/GIS | Analytics, Operations, Regulatory | 99%, daily refresh |
| Non-Revenue Water (NRW) | Analytics (cross-domain) | Operations, Management | 99%, weekly calculation |
| Regulatory Reports | Fiscal & Compliance | CONAGUA, State Water Commission | 99.9%, monthly |

### 4.4 Change Data Capture (CDC) Strategy

To maintain data consistency across services without tight coupling:

```
Service Database --> Debezium (CDC) --> Kafka --> Consumers

Example: When a contract is modified in Contract Management DB:
1. PostgreSQL WAL captures the change
2. Debezium connector publishes to Kafka topic: aquacis.contracts.contrato
3. Consumers:
   - Billing Engine: Updates its local copy of contract details
   - Analytics: Updates customer 360 in data warehouse
   - Search: Updates Elasticsearch index
```

---

## 5. Serverless Opportunities

### 5.1 Where Serverless Adds Value in AquaCIS

Not all utility CIS workloads benefit from serverless. The following analysis identifies where serverless provides clear advantages versus where containers are more appropriate:

| Workload | Pattern | Serverless Fit | Recommended Approach |
|----------|---------|:---:|---|
| **Batch billing calculation** | Periodic burst (monthly per zone) | MEDIUM | Lambda/Functions for per-contract calc, orchestrated by Step Functions |
| **CFDI generation** | Event-triggered, stateless | HIGH | Lambda triggered by InvoiceGenerated event |
| **Payment reference generation** | Event-triggered, stateless | HIGH | Lambda/Functions per invoice, generates OXXO/bank references |
| **Notification dispatch** | Event-triggered, high fan-out | HIGH | Lambda + SES/SNS for email/SMS; API call for WhatsApp |
| **PDF invoice generation** | On-demand, stateless | HIGH | Lambda with headless Chrome/Puppeteer |
| **Meter reading validation** | Event-triggered, stateless | HIGH | Lambda validates each reading against historical patterns |
| **Anomaly detection scoring** | Near-real-time, ML inference | MEDIUM | Lambda for simple rules; SageMaker endpoint for ML models |
| **Report generation** | Scheduled, compute-intensive | MEDIUM | Fargate tasks for complex reports; Lambda for simple aggregations |
| **Image processing** | Event-triggered (meter photos) | HIGH | Lambda + Rekognition for OCR on meter photos |
| **Data archival** | Scheduled, low frequency | HIGH | Lambda moves old data to Glacier/Archive tier |
| **Core billing engine** | Long-running, stateful | LOW | Keep as containerized service -- too complex for Lambda |
| **API endpoints** | Steady traffic, low latency | LOW | Keep as containerized services -- cold starts unacceptable |
| **Meter data streaming** | Continuous, high throughput | LOW | Keep as Kafka consumers in containers |

### 5.2 Serverless Architecture for Billing Ancillary Functions

```
InvoiceGenerated Event (Kafka)
       |
       +---> Lambda: GenerateCFDI
       |         |
       |         +--> Call SAT PAC provider API
       |         +--> Store CFDI XML in S3
       |         +--> Publish CFDIGenerated event
       |
       +---> Lambda: GeneratePaymentReferences
       |         |
       |         +--> Generate OXXO reference barcode
       |         +--> Generate bank reference number
       |         +--> Store references in Payments DB
       |         +--> Publish PaymentReferencesCreated event
       |
       +---> Lambda: GenerateInvoicePDF
       |         |
       |         +--> Render PDF from template + data
       |         +--> Store PDF in S3
       |         +--> Publish InvoicePDFReady event
       |
       +---> Lambda: SendBillNotification
                 |
                 +--> Determine customer channel preference
                 +--> Send via SES (email) / SNS (SMS) / WhatsApp API
                 +--> Log delivery status
```

### 5.3 Cost Advantage of Serverless for Utility Workloads

For CEA Queretaro's scale (~500K contracts estimated, 13 municipalities):

| Workload | Container Cost (24/7) | Serverless Cost (on-demand) | Savings |
|----------|:---:|:---:|:---:|
| CFDI generation (~500K/month) | ~$150/mo (2 containers) | ~$25/mo (Lambda) | 83% |
| PDF generation (~500K/month) | ~$200/mo (2 containers) | ~$40/mo (Lambda) | 80% |
| Notification dispatch (~1.5M/month) | ~$100/mo (2 containers) | ~$15/mo (Lambda + SES) | 85% |
| Payment reference gen (~500K/month) | ~$100/mo (1 container) | ~$10/mo (Lambda) | 90% |
| Report generation (~100/month) | ~$150/mo (1 container) | ~$5/mo (Fargate Spot) | 97% |

**Total estimated serverless savings: ~$600/month** for ancillary functions vs. always-on containers.

---

## 6. Stream Processing: Real-Time Meter Data Pipeline

### 6.1 Current State vs. Future State

**Current State (AquaCIS):**
- Manual meter readings via mobile devices (lote/zona campaigns)
- Readings uploaded in batches through poldetsum table
- Anomaly detection is manual (observac codes entered by reader)
- Smart meters (equipo table) exist but limited integration
- No real-time streaming capability

**Future State (AquaCIS 2.0):**
- Hybrid: manual readings + AMI (Advanced Metering Infrastructure) smart meters
- Real-time streaming for smart meter data
- ML-based anomaly detection
- Near-real-time consumption dashboards for customers
- Proactive leak detection and pressure monitoring

### 6.2 Stream Processing Architecture

```
+====================================================================+
|                SMART METER DATA PIPELINE                            |
+====================================================================+
|                                                                     |
|  DATA SOURCES                                                      |
|  +------------------+  +------------------+  +------------------+   |
|  | Smart Meters     |  | Mobile Reading   |  | SCADA /          |   |
|  | (AMI/AMR)        |  | App              |  | Pressure Sensors |   |
|  | MQTT/LoRaWAN/    |  | REST API         |  | Modbus/MQTT      |   |
|  | NB-IoT           |  | upload           |  |                  |   |
|  +------------------+  +------------------+  +------------------+   |
|          |                      |                     |             |
|          v                      v                     v             |
|  +------------------------------------------------------------------+
|  | INGESTION: AWS IoT Core / Azure IoT Hub                         |
|  | - Device authentication (X.509 certificates)                    |
|  | - Protocol translation (MQTT -> Kafka)                          |
|  | - Message validation and deduplication                          |
|  | - Device shadow / digital twin state                            |
|  +------------------------------------------------------------------+
|          |                                                          |
|          v                                                          |
|  +------------------------------------------------------------------+
|  | STREAM PROCESSING: Apache Kafka + Apache Flink / Kafka Streams  |
|  |                                                                  |
|  |  Topic: meter.readings.raw                                      |
|  |    --> Flink Job: ValidateAndEnrich                              |
|  |        - Validate reading range (reject impossible values)       |
|  |        - Enrich with meter metadata (caliber, location, tariff)  |
|  |        - Calculate delta consumption                             |
|  |    --> Topic: meter.readings.validated                           |
|  |                                                                  |
|  |  Topic: meter.readings.validated                                |
|  |    --> Flink Job: AnomalyDetection                              |
|  |        - Statistical anomaly (>3 sigma from historical mean)     |
|  |        - Zero consumption detection (possible meter failure)     |
|  |        - Reverse flow detection (backflow, tampering)            |
|  |        - Sudden consumption spike (possible leak)                |
|  |    --> Topic: meter.anomalies                                   |
|  |                                                                  |
|  |  Topic: meter.readings.validated                                |
|  |    --> Flink Job: ConsumptionAggregation                        |
|  |        - Hourly, daily, monthly aggregations                     |
|  |        - Per-zone, per-municipality rollups                      |
|  |        - Non-revenue water calculation (input vs. billed)        |
|  |    --> Topic: meter.consumption.aggregated                      |
|  |                                                                  |
|  +------------------------------------------------------------------+
|          |                    |                    |                 |
|          v                    v                    v                 |
|  +---------------+  +------------------+  +------------------+      |
|  | TimescaleDB   |  | Data Lake (S3)   |  | Real-time        |      |
|  | (hot storage, |  | (cold storage,   |  | Dashboard        |      |
|  |  30-day        |  |  full history)   |  | (WebSocket push) |      |
|  |  window)       |  |                  |  |                  |      |
|  +---------------+  +------------------+  +------------------+      |
|                                                                     |
+====================================================================+
```

### 6.3 Smart Meter Telemetry Schema

```json
{
  "meterId": "SM-QRO-2026-00001",
  "serialNumber": "10005237",
  "contractId": "442761",
  "timestamp": "2026-02-16T14:30:00.000Z",
  "readings": {
    "totalizer": 1523.456,
    "unit": "m3",
    "flowRate": 0.023,
    "flowRateUnit": "m3/h"
  },
  "diagnostics": {
    "batteryLevel": 87,
    "signalStrength": -72,
    "tamperFlag": false,
    "reverseFlowFlag": false,
    "leakFlag": false
  },
  "location": {
    "latitude": 20.5931,
    "longitude": -100.3899
  },
  "protocol": "NB-IoT",
  "gatewayId": "GW-QRO-CENTRO-01"
}
```

### 6.4 Capacity Planning for Stream Processing

| Scenario | Meters | Readings/Day | Events/Second (peak) | Storage/Month |
|----------|:---:|:---:|:---:|:---:|
| **Phase 1**: Manual + pilot AMR | 500K manual, 5K smart | 5K smart | ~1 | ~500 MB |
| **Phase 2**: AMR expansion | 400K manual, 100K smart | 100K | ~5 | ~10 GB |
| **Phase 3**: Full AMI deployment | 100K manual, 400K smart | 2.4M (hourly reads) | ~30 | ~240 GB |
| **Phase 4**: High-frequency AMI | 0 manual, 500K smart | 12M (15-min reads) | ~140 | ~1.2 TB |

At full AMI deployment (Phase 3-4), the system needs to handle 30-140 events/second -- well within Kafka + Flink capabilities on modest infrastructure (3-node Kafka cluster, 2-4 Flink task managers).

---

## 7. Security and Compliance: Mexican Regulatory Requirements

### 7.1 LGPDPPP (Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados)

Since CEA Queretaro is a government entity ("sujeto obligado"), it falls under the LGPDPPP (2017), not the private-sector LFPDPPP. Key requirements:

| Requirement | Impact on Architecture | Implementation |
|------------|----------------------|----------------|
| **Data minimization** | Collect only necessary personal data | Review persona table (37 cols) -- minimize fields in Customer Identity service |
| **Purpose limitation** | Personal data used only for stated purposes | Implement purpose tagging on all personal data access |
| **Consent management** | Document basis for data processing | Consent service or consent fields in Customer Identity |
| **Right to access (ARCO)** | Customers can request their data | Build ARCO API endpoint aggregating data from all services |
| **Right to rectification** | Customers can correct their data | Customer Identity service supports update operations |
| **Right to cancellation** | Customers can request data deletion | Implement soft-delete with legal retention periods |
| **Right to opposition** | Customers can oppose processing | Consent flags per processing type |
| **Data breach notification** | 72-hour notification to INAI | Implement breach detection and notification workflow |
| **Privacy impact assessment** | Required for new data processing | Document for each microservice |
| **Data sovereignty** | Personal data must reside in Mexico | Use Mexico-based cloud regions exclusively for PII |

### 7.2 CFDI Compliance (Comprobante Fiscal Digital por Internet)

| Requirement | Architecture Impact |
|------------|-------------------|
| CFDI 4.0 format (current SAT version) | Fiscal service must generate valid XML per SAT schema |
| PAC (Proveedor Autorizado de Certificacion) integration | Fiscal service integrates with PAC API for timbrado |
| 5-year retention of CFDI XML | S3/Blob storage with lifecycle policies (Standard -> IA -> Glacier) |
| Real-time cancellation support | Event: CFDICancellationRequested -> PAC API -> CFDICancelled |
| Complement: Pagos 2.0 | Payment events trigger complement CFDI generation |
| Global CFDI for unidentified payments | Batch CFDI generation for cash payments without customer RFC |

### 7.3 Water Sector Regulatory (CONAGUA / CEA State)

| Regulation | Requirement | Architecture Impact |
|-----------|-------------|-------------------|
| NOM-012-CONAGUA | Meter accuracy standards | Metering service: calibration tracking, anomaly thresholds |
| NOM-002-CONAGUA | Water quality discharge | Infrastructure service: quality data integration |
| CONAGUA reporting | Monthly/quarterly operational reports | Analytics service: automated report generation |
| State Water Law (Queretaro) | Tariff structure compliance | Billing service: configurable tariff engine per municipality |
| Transparency obligations | Public data publication | Analytics: open data endpoints (aggregated, anonymized) |

### 7.4 Security Architecture

```
+====================================================================+
|                    SECURITY LAYERS                                   |
+====================================================================+
|                                                                     |
|  IDENTITY & ACCESS                                                 |
|  +------------------------------------------------------------------+
|  | Keycloak / Auth0 / Azure AD B2C                                 |
|  | - OAuth 2.0 + OpenID Connect                                    |
|  | - RBAC: roles per municipality, department, function             |
|  | - MFA for administrative access                                 |
|  | - Service-to-service: mTLS + JWT                                |
|  | - Customer portal: OAuth2 with Mexican-friendly login (CURP?)   |
|  +------------------------------------------------------------------+
|                                                                     |
|  NETWORK SECURITY                                                  |
|  +------------------------------------------------------------------+
|  | - VPC/VNet with private subnets for data layer                  |
|  | - Network policies: deny-all default, explicit allow            |
|  | - WAF: OWASP Top 10 protection                                  |
|  | - DDoS protection (AWS Shield / Azure DDoS)                     |
|  | - Private endpoints for managed services (no public DB access)  |
|  +------------------------------------------------------------------+
|                                                                     |
|  DATA SECURITY                                                     |
|  +------------------------------------------------------------------+
|  | - Encryption at rest: AES-256 (all databases, S3/Blob)          |
|  | - Encryption in transit: TLS 1.3 (all connections)              |
|  | - Key management: AWS KMS / Azure Key Vault (Mexico region)     |
|  | - PII tokenization: mask persona data in non-production envs    |
|  | - Database-level row security for multi-municipality access     |
|  +------------------------------------------------------------------+
|                                                                     |
|  AUDIT & MONITORING                                                |
|  +------------------------------------------------------------------+
|  | - All API calls logged with user, timestamp, IP, action         |
|  | - SIEM integration (Splunk, Sentinel, or CloudWatch)            |
|  | - Anomaly detection on access patterns                          |
|  | - Immutable audit log (event store serves double duty)          |
|  | - SOC compliance scanning (CIS benchmarks for K8s)              |
|  +------------------------------------------------------------------+
|                                                                     |
+====================================================================+
```

### 7.5 Multi-Tenancy for Municipalities

CEA Queretaro operates across 13 municipalities: Queretaro, Corregidora, El Marques, Huimilpan, Amealco, Cadereyta, Colon, Ezequiel Montes, Jalpan, Pedro Escobedo, Pinal de Amoles, Santa Rosa Jauregui, and Tequisquiapan.

| Strategy | Approach | Pros | Cons |
|----------|---------|------|------|
| **Shared DB, shared schema** (recommended) | Single DB with `municipality_id` column; row-level security | Simplest to manage; lowest cost; easy cross-municipality reporting | Risk of data leakage if RLS misconfigured |
| Shared DB, separate schemas | One schema per municipality | Stronger isolation; easier per-municipality backup | 13x schema management; harder cross-municipality queries |
| Separate databases | One database per municipality | Strongest isolation | 13x operational overhead; expensive; hard to aggregate |

**Recommendation**: Shared database with shared schema and PostgreSQL Row-Level Security (RLS) policies. The current AquaCIS uses the `explotacion` concept (with `expid`) as a multi-tenant discriminator -- this maps directly to a municipality/operational-unit tenant model.

```sql
-- Example RLS policy for multi-municipality isolation
CREATE POLICY municipality_isolation ON contrato
    USING (municipio_id = current_setting('app.current_municipality')::int);
```

---

## 8. Cloud Provider Comparison: Mexico/LATAM Deployment

### 8.1 Cloud Region Availability in Mexico

| Provider | Mexico Region | Location | Launch Date | Availability Zones |
|----------|:---:|---------|:---:|:---:|
| **AWS** | Mexico (Central) `mx-central-1` | Queretaro | 2025 | 3 AZs |
| **Azure** | Mexico Central | Queretaro | 2023 | 3 AZs |
| **Azure** | Mexico North (planned) | Monterrey area | TBD | TBD |
| **Google Cloud** | Mexico `southamerica-west2` / `us-south1` | Queretaro | 2025 | 3 AZs |
| **Oracle Cloud** | Mexico (Queretaro) | Queretaro | 2023 | 1 AD |
| **Huawei Cloud** | Mexico | Mexico City | 2022 | 2 AZs |

**Notable**: All major cloud providers have established or are establishing data centers in Queretaro state, which provides a unique advantage for CEA Queretaro -- sub-millisecond latency to cloud infrastructure in the same geographic area.

### 8.2 Provider Comparison Matrix

| Criteria | AWS | Azure | GCP | Weight |
|----------|:---:|:---:|:---:|:---:|
| **Mexico region maturity** | High | High | Medium | 20% |
| **Managed Kubernetes (EKS/AKS/GKE)** | Excellent | Excellent | Excellent | 15% |
| **Managed Kafka** | MSK (excellent) | Event Hubs (good) | Pub/Sub (different model) | 10% |
| **Managed PostgreSQL** | RDS/Aurora | Azure DB for PG | Cloud SQL | 10% |
| **Serverless (Lambda/Functions)** | Excellent | Excellent | Excellent | 10% |
| **IoT services** (smart meters) | IoT Core (excellent) | IoT Hub (excellent) | IoT Core (good) | 10% |
| **Government certifications** (Mexico) | FedRAMP, SOC2 | Govt cert, SOC2 | SOC2 | 10% |
| **Spanish-language support** | Good | Excellent | Good | 5% |
| **LATAM partner ecosystem** | Strong | Strongest | Growing | 5% |
| **Cost competitiveness** | Competitive | Competitive | Often lowest | 5% |
| **WEIGHTED SCORE** | **8.5/10** | **8.7/10** | **7.5/10** | |

### 8.3 Provider Recommendation

**Primary recommendation: Microsoft Azure** (slight edge)

Rationale:
1. **Mexico Central region in Queretaro** -- data stays in the same state as CEA operations
2. **Government relationship** -- Azure has strong Mexican government relationships (Azure Government cloud considerations)
3. **Azure DevOps** -- integrated CI/CD pipeline, familiar to enterprise teams
4. **Active Directory** -- integrates with existing government directory services
5. **Power BI** -- familiar to Mexican government agencies for reporting
6. **Spanish-language documentation and support** -- most complete

**Secondary recommendation: AWS**

Rationale:
1. **Queretaro region** -- same geographic advantage
2. **MSK (Managed Streaming for Kafka)** -- better Kafka support than Azure Event Hubs for true event sourcing
3. **Broader service catalog** -- more specialized services (IoT, ML, analytics)
4. **Stronger community** -- more architectural references and patterns available

**Hybrid consideration**: Use Azure for core infrastructure (AKS, PostgreSQL, identity) and AWS for specialized workloads (MSK for Kafka, SageMaker for ML) if needed. Multi-cloud adds complexity but can be justified for best-of-breed services.

### 8.4 Estimated Monthly Infrastructure Cost

| Component | Azure Estimate | AWS Estimate |
|-----------|:---:|:---:|
| AKS/EKS cluster (3 nodes, D4s v3 / m5.xlarge) | $550 | $500 |
| Worker nodes (6-12 nodes, scaling) | $800-$1,600 | $750-$1,500 |
| Managed PostgreSQL (3 instances, GP) | $600 | $550 |
| TimescaleDB / time-series (1 instance) | $300 | $300 |
| Kafka / Event Hubs (3 brokers) | $400 | $350 (MSK) |
| Redis Cache (2 nodes, clustered) | $200 | $180 |
| Object Storage (S3/Blob, 5TB) | $120 | $115 |
| Load Balancer + WAF | $150 | $130 |
| Serverless functions (estimated usage) | $100 | $80 |
| Monitoring (Prometheus, logs) | $200 | $180 |
| Data transfer (inter-AZ, egress) | $150 | $150 |
| DNS, certificates, secrets management | $50 | $50 |
| **TOTAL (steady state)** | **$3,620-$4,420/mo** | **$3,335-$4,085/mo** |
| **Annual estimate** | **$43,440-$53,040** | **$40,020-$49,020** |

**Notes:**
- Reserved instances (1-3 year) reduce costs by 30-50%
- Spot/preemptible instances for batch jobs (billing runs, reports) reduce burst costs by 60-80%
- These estimates are for production environment only; add ~40% for staging + development environments
- Smart meter streaming infrastructure adds $200-$500/month depending on scale (Phase 1-4)

---

## 9. Migration Path: From Monolith to Microservices

### 9.1 Migration Strategy: Strangler Fig Pattern

The strangler fig pattern is the recommended approach for migrating from the current AquaCIS monolith. This involves gradually replacing monolith functionality with microservices while keeping the system operational.

```
PHASE 0: FOUNDATION (Months 1-3)
+====================================================================+
|                                                                     |
|  Existing AquaCIS                API Gateway              New       |
|  Monolith                        (Kong/APIM)              Services  |
|  +------------------+    +------------------+                       |
|  | SOAP APIs        |<---| Route 100% to    |<--- Clients          |
|  | (126 operations) |    | monolith         |                      |
|  | PostgreSQL       |    | Translate SOAP   |                      |
|  | (4,114 tables)   |    | to REST          |                      |
|  +------------------+    +------------------+                       |
|                                                                     |
+====================================================================+

PHASE 1: EXTRACT NOTIFICATIONS (Months 3-6)
+====================================================================+
|                                                                     |
|  AquaCIS Monolith          API Gateway          notification-svc    |
|  +------------------+    +------------------+  +------------------+ |
|  | SOAP APIs        |<---| Route: billing,  |  | REST API         | |
|  | (minus notif.)   |    |  contracts, etc  |  | Event consumer   | |
|  | PostgreSQL       |    |  -> monolith     |  | Multi-channel    | |
|  |                  |    | Route: notif.    |--| (AGORA integ.)   | |
|  +------------------+    |  -> new service  |  +------------------+ |
|                          +------------------+                       |
+====================================================================+

PHASE 2: EXTRACT WORK ORDERS (Months 6-9)
+====================================================================+
|                                                                     |
|  AquaCIS Monolith          API Gateway          work-order-svc      |
|  +------------------+    +------------------+  +------------------+ |
|  | SOAP APIs        |<---|                  |  | REST/gRPC API    | |
|  | (minus notif,    |    | Routing rules    |  | Mobile app       | |
|  |  work orders)    |    | per service      |  | PostGIS          | |
|  | PostgreSQL       |    |                  |  +------------------+ |
|  +------------------+    +------------------+  notification-svc    |
|                                               +------------------+ |
|                                               | (from Phase 1)   | |
|                                               +------------------+ |
+====================================================================+

PHASE 3: EXTRACT CUSTOMER + METERING (Months 9-15)
+====================================================================+
|                                                                     |
|  AquaCIS Monolith                              customer-identity    |
|  +------------------+                         +------------------+  |
|  | Billing          |    API Gateway          | REST/gRPC API    |  |
|  | Contracts        |   +------------------+  +------------------+  |
|  | Payments         |<--|                  |   metering-readings   |
|  | (remaining)      |   | Smart routing    |  +------------------+  |
|  +------------------+   +------------------+  | TimescaleDB      |  |
|                                               | Kafka consumer   |  |
|                                               +------------------+  |
|                                                work-order-svc      |
|                                               +------------------+  |
|                                               notification-svc     |
|                                               +------------------+  |
+====================================================================+

PHASE 4: EXTRACT BILLING + PAYMENTS (Months 15-21)
+====================================================================+
|                                                                     |
|  AquaCIS Legacy                                billing-engine       |
|  +------------------+                         +------------------+  |
|  | Contract Mgmt    |    API Gateway          | Event sourced    |  |
|  | (remaining)      |   +------------------+  | CQRS             |  |
|  +------------------+   |                  |  +------------------+  |
|                         | Full routing     |   payments-svc        |
|                         +------------------+  +------------------+  |
|                                               | Bank integrations|  |
|                                               +------------------+  |
|                                                + all Phase 1-3     |
+====================================================================+

PHASE 5: COMPLETE MIGRATION (Months 21-24)
+====================================================================+
|                                                                     |
|  AquaCIS Legacy           API Gateway          ALL MICROSERVICES    |
|  +------------------+    +------------------+  +------------------+ |
|  | DECOMMISSIONED   |    | 100% routed to   |  | customer-identity| |
|  | (read-only       |    | microservices    |  | contract-mgmt   | |
|  |  archive)        |    |                  |  | billing-engine   | |
|  +------------------+    | Legacy SOAP      |  | metering         | |
|                          | endpoints        |  | payments         | |
|                          | maintained for   |  | work-orders      | |
|                          | backward compat. |  | fiscal-cfdi      | |
|                          +------------------+  | notifications    | |
|                                               | infrastructure   | |
|                                               | analytics        | |
|                                               +------------------+ |
+====================================================================+
```

### 9.2 Migration Phase Details

| Phase | Duration | Services Extracted | Risk | Key Dependencies |
|-------|:---:|---|:---:|---|
| **Phase 0: Foundation** | 3 months | API Gateway, CI/CD, K8s cluster, monitoring | LOW | Infrastructure team, cloud account setup |
| **Phase 1: Notifications** | 3 months | notification-svc | LOW | AGORA platform integration, template migration |
| **Phase 2: Work Orders** | 3 months | work-order-svc | LOW-MEDIUM | Mobile app, AGORA integration (already proxied) |
| **Phase 3: Customer + Metering** | 6 months | customer-identity-svc, metering-readings-svc | MEDIUM | Data migration, identity consolidation, reading campaign workflows |
| **Phase 4: Billing + Payments** | 6 months | billing-engine-svc, payments-collections-svc, fiscal-cfdi-svc | HIGH | Financial data migration, CFDI integration, bank interfaces, tariff engine |
| **Phase 5: Contract + Complete** | 3 months | contract-mgmt-svc, infrastructure-gis-svc, analytics-svc | MEDIUM | Final data migration, legacy decommission, full E2E testing |

### 9.3 Database Migration Strategy

The current 4,114-table PostgreSQL database must be decomposed. This is the highest-risk aspect of the migration:

1. **Phase 0**: Clean up database (execute the audit recommendations -- drop 2,880+ unnecessary tables to reach ~1,200)
2. **Phase 1-2**: Extracted services get their own databases; CDC keeps monolith in sync during transition
3. **Phase 3-4**: Core tables migrated with dual-write pattern (write to both old and new) during transition window
4. **Phase 5**: Final cutover; monolith database becomes read-only archive

```
Database Decomposition:
cf_quere_pro (4,114 tables)
  |
  |--> Phase 0 cleanup: ~1,200 tables remain
  |
  |--> customer_identity_db: persona, cliente, direccion, personadir (~4 core + ~10 lookup)
  |--> contract_mgmt_db: contrato, ptoserv, sociedad, polcontar (~8 core + ~15 lookup)
  |--> billing_engine_db: factura, facturable, linfactura, tarifa, concepto, facturacio (~12 core + event store)
  |--> metering_readings_db: contador, poldetsum, lote, zona, equipo (~8 core, TimescaleDB)
  |--> payments_collections_db: opecargest, opedesglos, gescartera, referencia, movccontrato (~8 core)
  |--> work_order_db: orden + related (~5 core)
  |--> infrastructure_gis_db: acometida, servicio + PostGIS spatial (~6 core)
  |--> fiscal_compliance_db: impufact, ingresoscfdi + S3 for XML (~4 core)
  |--> analytics_warehouse: aggregated views, data lake pointers
```

### 9.4 API Evolution Strategy

The current SOAP APIs (126 operations across 5 services) must be maintained for backward compatibility while new REST/gRPC APIs are introduced:

| Current SOAP Operation | New REST Endpoint | Phase |
|------------------------|-------------------|:---:|
| `consultaDetalleContrato` | `GET /api/v2/contracts/{id}` | 5 |
| `getContratos` | `GET /api/v2/contracts?filters` | 5 |
| `getFacturas` | `GET /api/v2/invoices?filters` | 4 |
| `getPdfFactura` | `GET /api/v2/invoices/{id}/pdf` | 4 |
| `crearOrdenTrabajo` | `POST /api/v2/work-orders` | 2 |
| `consultaDeuda` | `GET /api/v2/contracts/{id}/debt` | 4 |
| `getPuntoServicioPorContador` | `GET /api/v2/meters/{serial}/service-point` | 3 |
| `introducirLectura` | `POST /api/v2/readings` | 3 |

The API Gateway maintains both SOAP (proxied to legacy or translated) and REST endpoints during the transition period.

---

## 10. Cost Model: Cloud Cost Estimation Framework

### 10.1 Total Cost of Ownership (TCO) Framework

| Cost Category | On-Premises (Current) | Cloud (AquaCIS 2.0) | Delta |
|--------------|:---:|:---:|:---:|
| **Infrastructure** | $8,000-$12,000/mo (servers, DC, network) | $3,500-$5,000/mo (cloud services) | -40-60% |
| **Licensing** | $3,000-$5,000/mo (Aqualia/Agbar license) | $0 (custom-built) | -100% |
| **Personnel** | $15,000-$20,000/mo (2-3 ops engineers) | $20,000-$30,000/mo (4-5 DevOps/SRE + developers) | +30-50% |
| **Development** | Vendor-dependent (Aqualia changes) | In-house agile team | Variable |
| **Migration cost** | N/A | $200,000-$400,000 (one-time, 24 months) | One-time |
| **Total monthly (steady state)** | **$26,000-$37,000** | **$23,500-$35,000** | **-5-15%** |

**Key insight**: Cloud migration for a utility CIS is not primarily about infrastructure cost savings. The value proposition is:
1. **Agility**: Deploy new features in days, not months (vs. waiting for vendor)
2. **Scalability**: Handle billing bursts and smart meter data without over-provisioning
3. **Resilience**: Multi-AZ deployment vs. single-site on-premises
4. **Innovation**: ML-based anomaly detection, real-time dashboards, customer self-service

### 10.2 Cost Optimization Strategies

| Strategy | Estimated Savings | Implementation Complexity |
|----------|:---:|:---:|
| Reserved instances (1-year) | 30-35% on compute | Low |
| Reserved instances (3-year) | 45-55% on compute | Low (commitment risk) |
| Spot/preemptible for batch jobs | 60-80% on billing runs | Medium |
| Serverless for ancillary functions | $600/mo vs. always-on | Medium |
| Right-sizing after 3 months of metrics | 15-25% | Low |
| Storage tiering (S3 IA, Glacier for archives) | 40-60% on storage | Low |
| Auto-scaling (scale to zero in non-prod) | 50-70% on dev/staging | Medium |
| FinOps practice (tagging, budgets, alerts) | 10-15% ongoing | Low |

---

## 11. Disaster Recovery: Cloud DR Patterns

### 11.1 Recovery Objectives for Water Utility CIS

| System Component | RPO (Recovery Point Objective) | RTO (Recovery Time Objective) | Justification |
|-----------------|:---:|:---:|---|
| **Billing Engine** | 1 hour | 4 hours | Financial data critical; billing runs can be re-executed |
| **Payments Processing** | Near-zero (synchronous replication) | 1 hour | Active payment processing cannot lose transactions |
| **Customer Portal** | 4 hours | 2 hours | Customer-facing; affects satisfaction but not operations |
| **Metering & Readings** | 24 hours | 8 hours | Readings stored on mobile devices; can be re-uploaded |
| **Work Orders** | 4 hours | 4 hours | Field work can continue with cached data on mobile |
| **CFDI/Fiscal** | Near-zero | 2 hours | Legal requirement; SAT compliance |
| **Analytics/Reporting** | 24 hours | 24 hours | Historical data; can be regenerated |

### 11.2 DR Architecture

```
PRIMARY REGION                          DR REGION
(Mexico Central - Queretaro)            (US South or Mexico North)
+----------------------------+          +----------------------------+
|                            |          |                            |
| AKS/EKS Cluster           |          | AKS/EKS Cluster            |
| (active)                   |          | (standby / warm)           |
|                            |          |                            |
| PostgreSQL                 | async    | PostgreSQL                 |
| (primary)                  |--------->| (read replica)             |
|                            | repl.    |                            |
| Kafka                      |          | Kafka                      |
| (active)                   |--------->| (MirrorMaker 2 /           |
|                            | mirror   |  cross-region repl.)       |
| S3/Blob                    |          | S3/Blob                    |
| (primary)                  |--------->| (cross-region replication)  |
|                            | CRR      |                            |
+----------------------------+          +----------------------------+
         |                                        |
         v                                        v
+----------------------------+          +----------------------------+
| Azure Traffic Manager /    |          | Automatic failover         |
| AWS Route 53               |          | on health check failure    |
| (active-passive DNS)       |          | DNS TTL: 60 seconds        |
+----------------------------+          +----------------------------+
```

### 11.3 Backup Strategy

| Data Type | Backup Method | Frequency | Retention | Storage |
|-----------|:---:|:---:|:---:|:---:|
| PostgreSQL databases | Automated snapshots + WAL archiving | Continuous (PITR) | 35 days PITR, 1 year monthly | Cross-region |
| Kafka event store | Topic replication + S3 archival | Continuous | 90 days in Kafka, unlimited in S3 | Cross-region |
| CFDI XML documents | S3 cross-region replication | Continuous | 5 years (legal requirement) | Standard -> IA -> Glacier |
| Configuration (IaC) | Git repository | Every commit | Unlimited | GitHub/GitLab |
| Kubernetes state | Velero backups | Daily | 30 days | Cross-region S3 |
| Secrets/certificates | Key Vault/KMS backup | Daily | 90 days | Cross-region |

---

## 12. Recommendations

### 12.1 Prioritized Recommendations

| # | Recommendation | Priority | Effort | Impact | Timeframe |
|---|---------------|:---:|:---:|:---:|---|
| 1 | **Execute database cleanup** (drop 2,880+ unnecessary tables per audit) before any cloud migration | **HIGH** | Medium | HIGH | Months 1-2 |
| 2 | **Deploy API Gateway** with SOAP-to-REST translation as the first cloud component (strangler fig foundation) | **HIGH** | Medium | HIGH | Months 1-3 |
| 3 | **Select Azure Mexico Central** as primary cloud provider; set up landing zone with networking, identity, and security baselines | **HIGH** | Medium | HIGH | Months 1-3 |
| 4 | **Establish Kubernetes cluster** (AKS) with namespaces, RBAC, network policies, and monitoring stack | **HIGH** | High | HIGH | Months 2-4 |
| 5 | **Extract Notification Service** as first microservice (lowest risk, highest independence, integrates with existing AGORA) | **HIGH** | Low | MEDIUM | Months 3-6 |
| 6 | **Deploy Kafka/event backbone** (Confluent Cloud or Azure Event Hubs for Kafka) for inter-service communication | **HIGH** | High | HIGH | Months 3-6 |
| 7 | **Extract Work Order Service** as second microservice (clear bounded context, existing AGORA integration, mobile-first) | **MEDIUM** | Medium | MEDIUM | Months 6-9 |
| 8 | **Implement CQRS for Billing domain** with event sourcing -- replaces 230 his* tables with unified event log | **MEDIUM** | Very High | HIGH | Months 15-21 |
| 9 | **Deploy TimescaleDB** for meter reading time-series data; prepare for smart meter streaming | **MEDIUM** | Medium | MEDIUM | Months 9-15 |
| 10 | **Implement LGPDPPP compliance layer** -- consent management, ARCO endpoints, PII tokenization, data sovereignty controls | **HIGH** | High | HIGH | Months 3-9 (parallel) |
| 11 | **Build serverless CFDI pipeline** -- Lambda/Functions triggered by billing events for fiscal document generation | **MEDIUM** | Medium | MEDIUM | Months 15-18 |
| 12 | **Design data lake architecture** for analytics -- CDC from service databases to S3/ADLS, dbt transformations, BI dashboards | **LOW** | High | MEDIUM | Months 18-24 |
| 13 | **Deploy stream processing pipeline** (Flink/Kafka Streams) for smart meter data -- only needed when AMI deployment begins | **LOW** | High | HIGH (future) | Months 18-24 |
| 14 | **Establish DR in secondary region** with async replication, automated failover, and regular DR testing | **MEDIUM** | High | HIGH | Months 12-18 |
| 15 | **Implement service mesh** (Istio/Linkerd) for mTLS, traffic management, and observability once 3+ services are deployed | **LOW** | High | MEDIUM | Months 12-18 |
| 16 | **Adopt FinOps practice** -- cost tagging per municipality, budget alerts, reserved instance planning, right-sizing reviews | **MEDIUM** | Low | MEDIUM | Months 6+ (ongoing) |

### 12.2 Technology Stack Recommendation

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Cloud Provider** | Azure (primary), AWS (secondary for specialized services) | Mexico Central region, government relationships |
| **Container Orchestration** | Azure Kubernetes Service (AKS) | Managed K8s with Azure AD integration |
| **API Gateway** | Kong (open-source) or Azure API Management | SOAP-to-REST translation, rate limiting |
| **Service Mesh** | Linkerd (lighter than Istio) | mTLS, observability, traffic management |
| **Message Broker** | Apache Kafka (Confluent Cloud or Azure Event Hubs for Kafka) | Event sourcing, streaming, CDC |
| **Primary Database** | PostgreSQL 16+ (Azure Database for PostgreSQL Flexible Server) | Continuity with current expertise |
| **Time-Series Database** | TimescaleDB (on PostgreSQL) | Meter readings, smart meter data |
| **Spatial Database** | PostGIS (on PostgreSQL) | GIS/infrastructure data |
| **Event Store** | PostgreSQL + custom event store (or EventStoreDB) | Event sourcing for Billing/Metering |
| **Cache** | Redis (Azure Cache for Redis) | Session cache, API response cache |
| **Search** | Elasticsearch / OpenSearch | Full-text search across contracts, customers |
| **Object Storage** | Azure Blob Storage | CFDI XML, PDFs, meter photos |
| **Serverless** | Azure Functions | CFDI generation, notifications, PDF rendering |
| **CI/CD** | Azure DevOps Pipelines or GitHub Actions | GitOps deployment to AKS |
| **IaC** | Terraform + Helm charts | Infrastructure as Code |
| **Monitoring** | Prometheus + Grafana + Jaeger | Metrics, dashboards, distributed tracing |
| **Logging** | Fluentd + Elasticsearch + Kibana (EFK) | Centralized logging |
| **Identity** | Keycloak or Azure AD B2C | OAuth2/OIDC, multi-municipality RBAC |
| **Programming Language** | Go (services), TypeScript (API gateway, BFF), Python (analytics/ML) | Performance, type safety, ecosystem |

---

## 13. Cloud Readiness Score

### 13.1 Current State Assessment

| Dimension | Score (1-10) | Justification |
|-----------|:---:|---|
| **Architecture maturity** | 3 | Monolithic Java EE; SOAP APIs; single PostgreSQL database with 4,114 tables |
| **API readiness** | 5 | 126 SOAP operations well-defined via WSDL; clear domain separation into 5 services |
| **Data architecture** | 2 | Single database with severe anti-patterns (table-per-value, 230 history tables, Spain-specific tables) |
| **DevOps maturity** | 3 | No CI/CD evidence; manual deployment; no containerization |
| **Team readiness** | 4 | Team familiar with PostgreSQL and web services; cloud-native skills need development |
| **Security posture** | 4 | WS-Security authentication exists; CFDI compliance in place; needs cloud security modernization |
| **Documentation** | 6 | Good API documentation, database audit complete, WSDL contracts well-documented |
| **Domain understanding** | 7 | Clear bounded contexts visible in existing API structure; database audit provides deep domain knowledge |
| **Integration patterns** | 5 | AGORA integration exists with SOAP proxy pattern; REST + SOAP hybrid already in use |
| **Operational resilience** | 3 | Single-site deployment; no DR; no auto-scaling; manual operations |

### 13.2 Overall Cloud Readiness Score

```
+====================================================================+
|                                                                     |
|  AQUACIS CLOUD READINESS SCORE:  4.2 / 10                         |
|                                                                     |
|  [====|====|====|====|====|====|====|====|====|====]               |
|  [####|####|####|####|@@@@|    |    |    |    |    ]               |
|   1    2    3    4    5    6    7    8    9    10                    |
|                                                                     |
|  #### = Current readiness                                          |
|  @@@@ = Achievable within 6 months (with Phase 0-1)               |
|                                                                     |
|  Target after Phase 0-1 (6 months): 5.5 / 10                      |
|  Target after Phase 2-3 (15 months): 7.0 / 10                     |
|  Target after Phase 4-5 (24 months): 8.5 / 10                     |
|                                                                     |
+====================================================================+
```

### 13.3 Readiness Gap Analysis

| Gap | Current | Target | Closing Action |
|-----|:---:|:---:|---|
| Database complexity | 4,114 tables | ~300-400 tables (8-10 service DBs) | Phase 0 cleanup + progressive decomposition |
| API modernization | 126 SOAP operations | REST/gRPC + event-driven | API Gateway + strangler fig migration |
| Containerization | None | All services containerized in K8s | Dockerfile + Helm charts per service |
| CI/CD pipeline | Manual | Automated GitOps (build-test-deploy) | Azure DevOps / GitHub Actions setup |
| Observability | Minimal | Full stack (metrics, logs, traces) | Prometheus + Grafana + Jaeger + EFK |
| Cloud security | Perimeter-based | Zero-trust, mTLS, RBAC | Service mesh + identity provider + KMS |
| Data sovereignty | On-premises (implicit) | Cloud with explicit Mexico-region constraints | Azure Mexico Central + policy enforcement |
| DR capability | None | Multi-AZ + cross-region standby | Phase 2 DR setup |
| Team skills | Java EE, PostgreSQL | K8s, cloud-native, event-driven, IaC | Training program (3-6 months) |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| AMI | Advanced Metering Infrastructure -- two-way communication smart meter network |
| AMR | Automatic Meter Reading -- one-way communication from meter to reader |
| ARCO | Acceso, Rectificacion, Cancelacion, Oposicion -- Mexican data subject rights |
| CDC | Change Data Capture -- capturing database changes as events |
| CFDI | Comprobante Fiscal Digital por Internet -- Mexican electronic invoice standard |
| CIS | Customer Information System -- utility billing and customer management platform |
| CONAGUA | Comision Nacional del Agua -- Mexican federal water authority |
| CQRS | Command Query Responsibility Segregation -- separate read and write models |
| DDD | Domain-Driven Design -- software design approach based on business domains |
| INAI | Instituto Nacional de Transparencia -- Mexican data protection authority |
| LGPDPPP | Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados |
| NRW | Non-Revenue Water -- water lost through leaks, theft, or metering errors |
| PAC | Proveedor Autorizado de Certificacion -- authorized CFDI certification provider |
| RLS | Row-Level Security -- database-level access control per row |
| SAT | Servicio de Administracion Tributaria -- Mexican tax authority |

## Appendix B: Reference Architectures

Key reference patterns informing this report:

1. **Strangler Fig Pattern** (Martin Fowler) -- incremental monolith-to-microservices migration
2. **Database per Service** (microservices.io) -- data ownership in microservice architectures
3. **Event Sourcing** (Greg Young, CQRS Documents) -- append-only event store replacing mutable state
4. **Saga Pattern** (Chris Richardson) -- managing distributed transactions across services
5. **Data Mesh** (Zhamak Dehghani, Thoughtworks) -- domain-oriented data ownership and data-as-a-product
6. **12-Factor App** (Heroku) -- cloud-native application design principles
7. **Azure Well-Architected Framework** -- reliability, security, cost optimization, operational excellence, performance efficiency
8. **Kubernetes Patterns** (Bilgin Ibryam, Roland Huss) -- container orchestration design patterns

---

*Report generated by Agent C4 (research-cloud-native) on 2026-02-16.*
*Based on analysis of AquaCIS/Aquasis system documentation, database audit, WSDL contracts, and cloud-native architecture best practices.*
