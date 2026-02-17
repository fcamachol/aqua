# Phase 6: Cloud & Microservices Foundation

**Timeline:** Months 8-16 (Weeks 1-28)
**Classification:** Implementation Plan
**Version:** 1.0
**Date:** 2026-02-16
**Status:** Draft
**Prerequisites:** Phases 1-5 (DB stabilization, API modernization) substantially complete
**Target:** Azure infrastructure operational + first 4 microservices extracted from monolith

---

## 1. Phase Overview

### Purpose

Phase 6 begins the cloud-native transformation of AquaCIS. It provisions the Azure Mexico Central infrastructure, establishes the event backbone (Apache Kafka), and extracts the first four microservices from the monolithic Aquasis system using the strangler fig pattern. By the end of this phase, Customer Identity, Notification, and Work Order services run independently on AKS, communicating through domain events, while the legacy system continues operating behind an API gateway.

### Strategic Context

The current Aquasis monolith (4,114 tables, 126 SOAP operations, Java EE) cannot evolve incrementally. Phase 6 creates the platform on which all subsequent bounded contexts (Billing, Metering, Payments, Fiscal, GIS, Analytics) will be deployed in Phases 7-10. Infrastructure decisions made here -- Kubernetes namespace strategy, event topic design, CI/CD pipelines, security policies -- become the foundation for the entire AquaCIS 2.0 ecosystem.

### Architecture Principles Governing This Phase

- **P4: Cloud-Native** -- All services containerized on AKS, Azure Mexico Central (Queretaro)
- **P5: Twelve-Factor** -- Config in environment, stateless processes, dev/prod parity
- **P6: Database-per-Service** -- Each extracted service owns its private data store
- **P7: Security by Design** -- Zero-trust networking, OAuth 2.0/OIDC, LGPDPPP compliance
- **P8: Observability First** -- OpenTelemetry, Prometheus, Grafana from day one
- **P9: Progressive Delivery** -- Strangler fig pattern, canary releases, feature flags

### Team

| Role | Count | Responsibilities |
|------|:-----:|-----------------|
| Cloud/DevOps Engineer | 1 | Azure provisioning, Terraform, AKS management, CI/CD pipelines |
| Backend Developer (Go) | 1 | Customer Identity Service, Work Order Service |
| Backend Developer (TypeScript) | 1 | Notification Service, API Gateway configuration, BFF layer |
| Cloud Architect (part-time, advisory) | 1 | Architecture decisions, security review, cost optimization |

### Key Milestones

| Milestone | Target Week | Deliverable |
|-----------|:-----------:|-------------|
| Azure infrastructure operational | Week 6 | AKS cluster, ACR, networking, monitoring, CI/CD |
| Event backbone operational | Week 12 | Kafka cluster, 18 core topics, CDC from PostgreSQL |
| First microservice in production | Week 16 | Customer Identity Service on AKS |
| Three services + API Gateway | Week 20 | Customer Identity, Notification, Work Order services |
| Stabilized hybrid operation | Week 28 | Strangler fig routing, dual-write consistency, load tested |

---

## 2. Sprint 1-3 (Weeks 1-6): Azure Infrastructure

### Objective

Provision the foundational Azure infrastructure in the Mexico Central region (Queretaro) with a production-grade AKS cluster, container registry, networking, monitoring stack, and CI/CD pipelines. All infrastructure provisioned as code with Terraform.

### Tasks

| ID | Task | Azure Service | Effort | Dependencies | Acceptance Criteria |
|----|------|--------------|:------:|:------------:|-------------------|
| P6-001 | Create Azure subscription and resource group hierarchy for AquaCIS 2.0. Three resource groups: `aquacis-infra`, `aquacis-services`, `aquacis-data`. Configure Azure Policy for Mexico Central region lock and required tags. | Azure Subscription, Azure Policy | 3 days | Azure EA agreement signed | Subscription active in Mexico Central; policy prevents resource creation outside region; cost alerts configured at $500, $1000, $2000 thresholds |
| P6-002 | Provision AKS cluster with 3 system node pools (Standard_D4s_v3) and 2 user node pools (Standard_D8s_v3, autoscale 2-8 nodes). Enable Azure AD integration, RBAC, pod identity, and Azure CNI networking. | AKS, Azure AD | 5 days | P6-001 | AKS cluster responding; kubectl access via Azure AD; autoscaler functional; node pools labeled for workload separation |
| P6-003 | Create Kubernetes namespace strategy: `aquacis-dev`, `aquacis-staging`, `aquacis-prod`, `aquacis-monitoring`, `aquacis-infra`. Apply resource quotas, network policies (deny-all default + explicit allow), and limit ranges per namespace. | AKS (Namespaces) | 3 days | P6-002 | Namespaces created; resource quotas enforced; network policies block cross-namespace traffic by default; limit ranges prevent unbounded resource consumption |
| P6-004 | Provision Azure Container Registry (ACR) with Premium SKU for geo-replication readiness. Configure ACR integration with AKS (managed identity pull). Set up vulnerability scanning (Microsoft Defender for Containers). | ACR, Defender for Cloud | 2 days | P6-001, P6-002 | ACR accessible from AKS via managed identity; vulnerability scanning active; retention policy set (keep last 30 tagged images per repo) |
| P6-005 | Configure hybrid networking: Azure VNet with /16 CIDR, AKS subnet (/20), data subnet (/22), gateway subnet (/27). Provision VPN Gateway (VpnGw1) with site-to-site tunnel to CEA Queretaro on-premises network for PostgreSQL access during migration. | VNet, VPN Gateway | 5 days | P6-001 | VPN tunnel established; on-premises PostgreSQL reachable from AKS pods; latency < 10ms; DNS resolution for on-prem hostnames |
| P6-006 | Deploy monitoring stack: Prometheus (via kube-prometheus-stack Helm chart) + Grafana into `aquacis-monitoring` namespace. Configure Azure Monitor Container Insights as secondary. Pre-build dashboards: cluster health, node utilization, pod restart rates, namespace resource usage. | AKS, Azure Monitor | 4 days | P6-002, P6-003 | Prometheus scraping all AKS metrics; Grafana dashboards accessible; Alertmanager routing to Teams/email for critical alerts (node down, pod crash loop, disk > 80%) |
| P6-007 | Deploy centralized logging: OpenTelemetry Collector (DaemonSet) forwarding to Elasticsearch (Azure-managed or self-hosted on AKS). Configure structured log format (JSON), correlation IDs, and log retention (30 days hot, 90 days warm). | AKS, Elasticsearch | 4 days | P6-002, P6-003 | All pod logs captured by OTel Collector; searchable in Kibana; correlation ID propagation validated end-to-end |
| P6-008 | Deploy distributed tracing: Jaeger or Grafana Tempo in `aquacis-monitoring` namespace. Configure OpenTelemetry SDK auto-instrumentation for Go and TypeScript. | AKS | 3 days | P6-007 | Traces visible in Jaeger/Tempo UI; span propagation across services validated with test workload |
| P6-009 | Build CI/CD pipeline with GitHub Actions. Stages: lint, unit test, build container image, push to ACR, deploy to dev (auto), staging (manual gate), prod (manual gate + approval). Helm chart per service. ArgoCD for GitOps sync. | GitHub Actions, ACR, AKS | 5 days | P6-002, P6-004 | Pipeline triggers on PR merge to main; images tagged with git SHA + semver; ArgoCD syncs Helm releases to AKS namespaces; rollback via git revert |
| P6-010 | Provision Azure Key Vault for secrets management. Integrate with AKS via CSI Secrets Store Driver. Migrate all hardcoded credentials (DB passwords, API keys) to Key Vault references. | Azure Key Vault | 3 days | P6-002 | Secrets injected into pods as mounted volumes; no plaintext secrets in Helm values or environment variables; rotation policy defined (90-day for DB passwords) |
| P6-011 | Configure TLS: Azure-managed certificates for public endpoints via cert-manager + Let's Encrypt. Internal mTLS via service mesh (Istio/Linkerd evaluation). Install ingress controller (NGINX Ingress or Azure Application Gateway Ingress Controller). | cert-manager, Ingress Controller | 3 days | P6-002, P6-003 | HTTPS enforced on all public endpoints; internal service-to-service traffic encrypted; certificate auto-renewal validated |
| P6-012 | Infrastructure as Code repository: create `aquacis-infra` repo with Terraform modules for all Azure resources. State stored in Azure Storage Account with state locking. Terraform plan runs on PR, apply on merge to main. | Terraform, Azure Storage | 4 days | P6-001 through P6-011 | All Azure resources reproducible from Terraform; `terraform plan` shows no drift; state locked during applies; PR-based review workflow |

### Sprint 1-3 Total Effort: ~44 days (across 4 team members over 6 weeks)

---

## 3. Sprint 4-6 (Weeks 7-12): Event Infrastructure

### Objective

Deploy the event backbone that all microservices will use for asynchronous communication. Establish Apache Kafka with the 18 core domain event topics identified in the architecture blueprint, configure dead letter queues and retry policies, deploy a schema registry for event contract governance, and set up Debezium CDC to stream changes from the legacy PostgreSQL database into the event bus.

### Tasks

| ID | Task | Azure Service / Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|---------------------------|:------:|:------------:|-------------------|
| P6-013 | Deploy Apache Kafka cluster. Evaluate Azure Event Hubs for Kafka vs. Confluent Cloud vs. self-managed (Strimzi operator on AKS). Decision criteria: cost, operational overhead, Kafka Streams compatibility, event sourcing support, Mexico Central availability. | Azure Event Hubs / Confluent Cloud / Strimzi | 3 days (eval) + 5 days (deploy) | P6-002, P6-003 | Kafka cluster operational with 3+ brokers; Kafka protocol endpoint accessible from AKS; produce/consume test validated; replication factor 3 for prod topics |
| P6-014 | Create 18 core domain event topics with appropriate partitioning and retention. Partition strategy: contract ID for contract events, meter ID for metering events, invoice ID for billing events. Retention: 7 days for operational events, 30 days for financial events, indefinite for event-sourced domains. | Kafka | 3 days | P6-013 | Topics created per event catalog (see below); partition counts set based on expected throughput; retention policies applied; topic ACLs restricting produce/consume by service identity |
| P6-015 | Deploy Confluent Schema Registry (or Apicurio Registry if self-managed Kafka). Define Avro schemas for all 18 core domain events. Configure schema compatibility mode (BACKWARD for evolving events, FULL for financial events). | Schema Registry | 5 days | P6-013 | Registry operational; all 18 event schemas registered; compatibility checks enforced on schema evolution; consumer/producer integration validated with schema validation |
| P6-016 | Configure dead letter queue (DLQ) topics for each consumer group. Implement retry policy: 3 retries with exponential backoff (1s, 5s, 30s), then route to DLQ. Build DLQ monitoring dashboard in Grafana showing message count, age, and error classification. | Kafka | 4 days | P6-013, P6-006 | DLQ topic per consumer group; retry logic validated with intentional failures; Grafana dashboard showing DLQ depth and age; alert when DLQ depth > 100 messages |
| P6-017 | Deploy Debezium CDC connector for legacy PostgreSQL. Configure connectors for the 9 tier-1 tables: `contrato`, `persona`, `cliente`, `factura`, `facturable`, `contratodeuda`, `orden`, `contador`, `poldetsum`. Outbox pattern for clean event emission. | Debezium, Kafka Connect | 5 days | P6-005 (VPN to on-prem PG), P6-013 | Debezium connectors running; changes to tier-1 tables appear as events in corresponding Kafka topics within 5 seconds; schema changes handled gracefully; connector monitoring in Grafana |
| P6-018 | Build event consumer/producer libraries for Go and TypeScript. Standardize event envelope: `{eventId, eventType, aggregateId, aggregateType, timestamp, version, source, correlationId, payload}`. Include OpenTelemetry trace context propagation. | Go, TypeScript | 5 days | P6-013, P6-015 | Shared libraries published to internal package registry; produce/consume validated in both languages; trace context propagated through events; dead letter routing built-in |
| P6-019 | Deploy Kafka monitoring: JMX exporter for broker metrics, consumer lag monitoring (Burrow or built-in), topic throughput dashboards. Alert on consumer lag > 10,000 messages, under-replicated partitions, broker offline. | Prometheus, Grafana | 3 days | P6-006, P6-013 | Kafka metrics in Prometheus; Grafana dashboards for broker health, topic throughput, consumer lag; alerts firing for defined thresholds |
| P6-020 | Event catalog documentation and developer onboarding. Document all 18 events with schema, producers, consumers, retry policy, and DLQ handling. Create AsyncAPI specification for event contracts. | Documentation | 3 days | P6-014, P6-015 | AsyncAPI specification published; developer guide with code samples in Go and TypeScript; event catalog accessible to all team members |

### Core Domain Event Topics

| # | Topic Name | Source Domain | Key Consumers | Partition Key |
|---|-----------|--------------|---------------|---------------|
| 1 | `contract.created` | Contract Mgmt | Billing, Metering, Analytics, Notifications | contractId |
| 2 | `contract.modified` | Contract Mgmt | Billing, Analytics | contractId |
| 3 | `contract.terminated` | Contract Mgmt | Billing, Metering, Work Orders, Analytics | contractId |
| 4 | `ownership.transferred` | Contract Mgmt | Billing, Notifications, Fiscal | contractId |
| 5 | `reading.recorded` | Metering | Billing, Analytics | meterId |
| 6 | `reading.campaign.completed` | Metering | Billing (triggers run) | campaignId |
| 7 | `anomaly.detected` | Metering | Work Orders, Notifications | meterId |
| 8 | `meter.installed` | Work Orders | Metering, Contract Mgmt | meterId |
| 9 | `billing.run.started` | Billing | Analytics, Notifications | billingRunId |
| 10 | `invoice.generated` | Billing | Payments, Fiscal, Notifications | invoiceId |
| 11 | `invoice.corrected` | Billing | Payments, Fiscal, Notifications | invoiceId |
| 12 | `payment.received` | Payments | Contract Mgmt, Notifications, Analytics | paymentId |
| 13 | `payment.reversed` | Payments | Contract Mgmt, Notifications | paymentId |
| 14 | `debt.status.changed` | Payments | Work Orders, Notifications | contractId |
| 15 | `work.order.created` | Work Orders | Contract Mgmt, Notifications | orderId |
| 16 | `work.order.completed` | Work Orders | Contract Mgmt, Metering, Analytics | orderId |
| 17 | `cfdi.generated` | Fiscal | Billing, Analytics | cfdiId |
| 18 | `cfdi.cancelled` | Fiscal | Billing, Notifications | cfdiId |

### Sprint 4-6 Total Effort: ~36 days (across 3 team members over 6 weeks)

---

## 4. Sprint 7-10 (Weeks 13-20): First Microservices Extraction

### Objective

Extract three microservices from the Aquasis monolith: Customer Identity Service (Go), Notification Service (TypeScript), and Work Order Service (Go + Camunda). Each service owns its database, communicates through the Kafka event bus, and is deployed to AKS behind the API Gateway. The strangler fig pattern ensures the legacy system continues operating during extraction.

### 4.1 Customer Identity Service (Go)

**Bounded Context:** BC1 -- Customer Identity
**Source tables:** `persona`, `cliente`, `direccion`, `personadir`
**Scale profile:** Low write, high read -- identity data queried by all services

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-021 | Design Customer Identity Service API: OpenAPI 3.1 spec with endpoints for CRUD on personas/clientes, address management, customer 360 view, duplicate detection, INE/CURP verification integration. | OpenAPI 3.1 | 3 days | None | OpenAPI spec reviewed and approved; endpoint naming follows REST conventions; includes pagination, filtering, HATEOAS links |
| P6-022 | Provision dedicated PostgreSQL database (`customeridentity_db`) on Azure Database for PostgreSQL Flexible Server. Migrate schema: 4 source tables mapped to normalized target schema with encrypted PII columns (AES-256 for RFC, CURP, email, phone). | Azure Database for PostgreSQL | 3 days | P6-005 | Database provisioned in Mexico Central; schema applied; PII columns encrypted at application level; connection via managed identity; automated backups (7-day retention) |
| P6-023 | Implement Customer Identity Service in Go. Hexagonal architecture: domain layer (entities, value objects, repository interfaces), application layer (use cases), infrastructure layer (PostgreSQL adapter, Kafka producer, HTTP handlers). | Go, PostgreSQL | 8 days | P6-021, P6-022, P6-018 | Service compiles and passes unit tests (>80% coverage on domain layer); produces `customer.created`, `customer.updated`, `identity.verified`, `consent.granted` events; health check endpoint responds |
| P6-024 | Data migration: ETL pipeline to extract customer data from legacy `persona`, `cliente`, `direccion`, `personadir` tables, transform (normalize addresses, deduplicate, encrypt PII), and load into `customeridentity_db`. Dual-write adapter for transition period. | Go, SQL | 5 days | P6-022, P6-017 (CDC) | Historical data migrated with validation checksums; dual-write adapter captures new legacy writes via CDC and applies to new service; zero data loss verified by row count reconciliation |
| P6-025 | LGPDPPP compliance: implement consent management (opt-in/opt-out tracking), data subject rights (access, rectification, deletion, portability), and PII audit logging. | Go | 3 days | P6-023 | Consent endpoints functional; data export generates JSON/CSV of all customer PII; deletion anonymizes records; audit log captures all PII access with accessor identity and purpose |
| P6-026 | Deploy Customer Identity Service to AKS. Helm chart with configurable replicas, resource limits, HPA (target 70% CPU), readiness/liveness probes, pod disruption budget. | AKS, Helm | 2 days | P6-009, P6-023 | Service running in `aquacis-dev` namespace; HPA scales from 2-6 replicas; health checks passing; Prometheus metrics exposed; traces visible in Jaeger |

### 4.2 Notification Service (TypeScript)

**Bounded Context:** BC9 -- Notifications & Communications
**Scale profile:** High throughput, fully asynchronous
**Key feature:** Subscribes to events from all other domains

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-027 | Design Notification Service: event-driven, multi-channel delivery (email via SES/SendGrid, SMS via Twilio, WhatsApp via AGORA integration, push notifications). Template engine with variable substitution. Notification preferences per customer. | OpenAPI 3.1, AsyncAPI | 3 days | None | API spec and AsyncAPI event subscription spec reviewed; template schema defined; channel priority matrix documented |
| P6-028 | Provision dedicated PostgreSQL database (`notifications_db`) for delivery tracking, template storage, and notification preferences. Redis instance for deduplication and rate limiting. | Azure Database for PostgreSQL, Azure Cache for Redis | 2 days | P6-005 | Database and Redis provisioned; schema applied; connection tested from AKS |
| P6-029 | Implement Notification Service in TypeScript (Node.js). Event consumers for: `invoice.generated` (send bill), `payment.received` (send receipt), `anomaly.detected` (alert customer), `work.order.created` (notify schedule), `debt.status.changed` (dunning notice). Channel adapters: email, SMS, WhatsApp, push. | TypeScript, Node.js | 8 days | P6-027, P6-028, P6-018 | Service consumes events from Kafka; renders templates per channel; delivers via configured adapters; tracks delivery status; respects customer notification preferences and quiet hours |
| P6-030 | Template management: admin API for creating/updating notification templates. Support Spanish localization with Handlebars-style variable substitution. Pre-build templates for 10 core notification types (bill ready, payment received, anomaly alert, work order scheduled, debt warning, service disruption, meter reading reminder, welcome, consent confirmation, account update). | TypeScript | 4 days | P6-029 | 10 templates created; admin API allows CRUD on templates; template preview endpoint renders sample output; variable validation prevents missing substitutions |
| P6-031 | Rate limiting and deduplication: Redis-based deduplication (event ID + channel, 24-hour window), per-customer rate limiting (max 5 SMS/day, 10 email/day), circuit breaker per channel provider. | TypeScript, Redis | 3 days | P6-028, P6-029 | Duplicate events do not produce duplicate notifications; rate limits enforced; circuit breaker opens after 5 consecutive failures per provider; fallback to next-priority channel |
| P6-032 | Deploy Notification Service to AKS. | AKS, Helm | 2 days | P6-009, P6-029 | Service running in `aquacis-dev`; consuming events; email delivery validated end-to-end; metrics and traces visible |

### 4.3 Work Order Service (Go + Camunda)

**Bounded Context:** BC6 -- Work Order Management
**Source tables:** `orden` and related dispatch/assignment tables
**Key feature:** BPMN workflow orchestration via Camunda Zeebe

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-033 | Design Work Order Service API and BPMN process models. Define work order types: meter installation, meter replacement, leak repair, disconnection, reconnection, inspection, customer complaint. Map each to a Camunda BPMN process with human tasks and automated steps. | OpenAPI 3.1, BPMN 2.0 | 4 days | None | OpenAPI spec reviewed; 7 BPMN process models designed in Camunda Modeler; process models cover happy path and compensation flows |
| P6-034 | Deploy Camunda 8 (Zeebe) to AKS. Helm chart with Zeebe broker (3 replicas for partition distribution), Operate dashboard, Tasklist for human tasks. Configure Elasticsearch for Zeebe event export. | Camunda 8, AKS | 4 days | P6-002, P6-003 | Zeebe cluster operational; Operate dashboard accessible; BPMN deployment via API validated; worker connection established |
| P6-035 | Provision dedicated PostgreSQL database (`workorders_db`). Migrate schema from legacy `orden` table and related entities. Include PostGIS extension for spatial routing of field crews. | Azure Database for PostgreSQL | 3 days | P6-005 | Database provisioned with PostGIS; schema normalized from legacy `orden` structure; spatial indexes created |
| P6-036 | Implement Work Order Service in Go. Domain model: WorkOrder aggregate with lifecycle states (Created, Assigned, InProgress, Completed, Cancelled). Zeebe job workers for automated steps (assign nearest crew, notify customer, update contract status). Event producers for `work.order.created`, `work.order.completed`. | Go, Zeebe client | 8 days | P6-033, P6-034, P6-035, P6-018 | Service handles work order CRUD; BPMN processes execute end-to-end; Zeebe workers process jobs; events published to Kafka; unit test coverage >80% on domain layer |
| P6-037 | Data migration: ETL from legacy `orden` tables to `workorders_db`. Map legacy status codes to new lifecycle states. Preserve historical work orders for reference (read-only archive). | Go, SQL | 3 days | P6-035, P6-017 | Historical work orders migrated; status mapping validated; row count reconciliation passes; legacy references (order numbers) preserved as external IDs |
| P6-038 | Event-driven work order creation: consume `anomaly.detected` events from Metering to auto-create inspection work orders. Consume `debt.status.changed` events from Payments to auto-create disconnection/reconnection work orders. | Go, Kafka | 3 days | P6-036 | Anomaly events trigger inspection work orders with correct type, priority, and location; debt threshold events trigger disconnection orders; idempotent processing (same event does not create duplicate orders) |
| P6-039 | Deploy Work Order Service to AKS. | AKS, Helm | 2 days | P6-009, P6-036 | Service running in `aquacis-dev`; BPMN processes deployable; API accessible; Camunda Operate shows running instances; metrics and traces visible |

### 4.4 API Gateway

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-040 | Evaluate and deploy API Gateway: Kong Gateway (open-source) vs. Azure API Management. Decision criteria: cost, plugin ecosystem, OAuth 2.0/OIDC support, rate limiting granularity, developer portal, Kubernetes-native operation. | Kong / Azure API Mgmt | 2 days (eval) + 3 days (deploy) | P6-002, P6-011 | API Gateway operational in AKS; routes configured for Customer Identity, Notification, and Work Order services; OAuth 2.0 token validation enabled; rate limiting per consumer; developer portal accessible |
| P6-041 | Configure strangler fig routing: API Gateway routes requests to new microservices for migrated endpoints, proxies remaining requests to legacy Aquasis SOAP services (via SOAP-to-REST adapter). Gradual traffic shifting capability (10%, 50%, 100%). | Kong / Azure API Mgmt | 4 days | P6-040, P6-026, P6-032, P6-039 | Routing rules direct traffic to new services for migrated endpoints; legacy endpoints still accessible; traffic split configurable without redeployment; health-check-based failover to legacy if new service is unhealthy |
| P6-042 | OAuth 2.0 / OIDC integration: configure Azure AD B2C (or Keycloak) as identity provider. Issue JWT tokens for API consumers. Define scopes per bounded context (e.g., `customer.read`, `customer.write`, `workorder.create`). | Azure AD B2C / Keycloak | 4 days | P6-040 | Token issuance validated; API Gateway validates JWT on every request; scopes enforced per endpoint; token refresh flow functional; service-to-service authentication via client credentials grant |

### 4.5 Service Mesh Evaluation

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-043 | Evaluate service mesh: Istio vs. Linkerd. Deploy both in a test namespace with the 3 microservices. Compare: mTLS setup complexity, resource overhead (sidecar memory/CPU), observability features, traffic management, learning curve. Produce recommendation document. | Istio, Linkerd | 5 days | P6-026, P6-032, P6-039 | Evaluation document with benchmarks; recommended service mesh selected; mTLS validated between all 3 services; traffic management (canary, circuit breaking) demonstrated |

### Sprint 7-10 Total Effort: ~82 days (across 3 developers over 8 weeks)

---

## 5. Sprint 11-14 (Weeks 21-28): Integration & Stabilization

### Objective

Stabilize the hybrid architecture where new microservices and the legacy monolith operate in parallel. Validate data consistency during the dual-write period, load test under realistic conditions, introduce chaos engineering basics, and produce comprehensive documentation for ongoing operations.

### Tasks

| ID | Task | Technology | Effort | Dependencies | Acceptance Criteria |
|----|------|-----------|:------:|:------------:|-------------------|
| P6-044 | Strangler fig validation: route 100% of Customer Identity reads to new service while legacy handles writes (Phase 1). Monitor error rates, latency, and data consistency for 2 weeks. Then enable write routing to new service with dual-write to legacy (Phase 2). | API Gateway | 5 days + 2 weeks monitoring | P6-041 | Read routing: <1% error rate, p99 latency <200ms; write routing: dual-write consistency validated by nightly reconciliation job; zero data loss during transition |
| P6-045 | Dual-write consistency monitor: build reconciliation service that compares records between legacy PostgreSQL and new service databases. Runs nightly, reports discrepancies, auto-heals where safe (e.g., missing CDC event replay). Alerts on irreconcilable differences. | Go, SQL | 5 days | P6-024, P6-037, P6-017 | Reconciliation runs nightly; report shows match percentage (target: 99.99%); auto-heal resolves transient CDC gaps; alert fires for genuine data divergence |
| P6-046 | Performance testing: use k6 or Locust to simulate realistic load patterns. Scenarios: (1) normal operation (100 req/s), (2) billing day peak (500 req/s), (3) payment deadline surge (1000 req/s). Test each microservice independently and the full request path through API Gateway. | k6 / Locust | 5 days | P6-041 | Load test reports for all 3 scenarios; p99 latency <500ms at 500 req/s; no errors at 100 req/s; HPA responds appropriately to load; bottlenecks identified and documented |
| P6-047 | Kafka consumer lag testing: simulate slow consumers and verify DLQ routing, backpressure handling, and consumer group rebalancing. Validate that a consumer outage does not lose events (Kafka retention + replay). | Kafka | 3 days | P6-016, P6-019 | Consumer lag scenario: events buffered in Kafka during 30-min consumer outage; all events processed on recovery; DLQ routing validated for poison messages; no data loss |
| P6-048 | Chaos engineering basics: use Chaos Mesh or LitmusChaos on AKS. Scenarios: (1) pod failure -- verify restart and request routing, (2) network partition between services -- verify circuit breaker activation, (3) Kafka broker failure -- verify producer retries and consumer failover, (4) database connection pool exhaustion -- verify graceful degradation. | Chaos Mesh / LitmusChaos | 5 days | P6-026, P6-032, P6-039 | Each chaos scenario executed in staging; system recovers within SLA (pod restart <30s, circuit breaker opens <5s, Kafka failover <10s); no data loss or corruption in any scenario; runbook documented per scenario |
| P6-049 | Security hardening: penetration test on API Gateway and all 3 microservices. Validate: no OWASP Top 10 vulnerabilities, no credential exposure, network policies block unauthorized pod-to-pod communication, PII encryption verified end-to-end. | Security tooling | 5 days | P6-042, P6-043 | Pen test report with zero critical/high findings; network policies validated (unauthorized pod cannot reach service); PII encrypted in transit (mTLS) and at rest (AES-256); LGPDPPP consent flow validated |
| P6-050 | Operational runbooks: document procedures for common operational scenarios -- service restart, Kafka topic operations, database failover, certificate renewal, scaling, incident response. On-call playbook with escalation paths. | Documentation | 4 days | All previous tasks | Runbooks cover 15+ operational scenarios; each runbook tested by a team member other than the author; runbooks stored in repo alongside infrastructure code |
| P6-051 | Architecture Decision Records (ADRs): document key decisions made during Phase 6 -- Kafka deployment model, API Gateway selection, service mesh choice, database provisioning strategy, authentication approach. Format: context, decision, consequences. | Documentation | 3 days | All previous tasks | 8+ ADRs documented; each reviewed by cloud architect; stored in `docs/adr/` directory |
| P6-052 | Developer onboarding guide: document local development setup (Docker Compose for dependencies, Tilt/Skaffold for AKS dev loop), service creation template (Go and TypeScript), event publishing/consuming patterns, testing strategy, deployment workflow. | Documentation | 3 days | All previous tasks | New developer can set up local environment and deploy a test service within 1 day; guide validated by a team member unfamiliar with the stack |

### Sprint 11-14 Total Effort: ~38 days (across 4 team members over 8 weeks)

---

## 6. Infrastructure as Code

### Terraform Module Structure

All Azure infrastructure is defined in Terraform with the following module hierarchy:

```
aquacis-infra/
  terraform/
    modules/
      aks/              # AKS cluster, node pools, RBAC
      networking/        # VNet, subnets, VPN Gateway, NSGs
      database/          # Azure DB for PostgreSQL Flexible Server instances
      registry/          # ACR with vulnerability scanning
      keyvault/          # Azure Key Vault, access policies
      monitoring/        # Azure Monitor, Log Analytics workspace
      kafka/             # Event Hubs for Kafka / Strimzi operator config
      identity/          # Azure AD B2C / Keycloak
    environments/
      dev/               # Dev-specific variable overrides
      staging/           # Staging with production-like sizing
      prod/              # Production configuration
    main.tf             # Root module composing all modules
    variables.tf        # Input variables with validation
    outputs.tf          # Cluster endpoints, connection strings
    backend.tf          # Azure Storage Account state backend
  helm/
    charts/
      customer-identity/ # Helm chart for Customer Identity Service
      notification/      # Helm chart for Notification Service
      work-order/        # Helm chart for Work Order Service
      api-gateway/       # Kong / APIM Helm chart
      monitoring-stack/  # Prometheus + Grafana + Alertmanager
      kafka/             # Kafka / Strimzi operator chart
```

### Terraform Workflow

| Step | Trigger | Action |
|------|---------|--------|
| `terraform fmt` | Pre-commit hook | Format check |
| `terraform validate` | PR created | Syntax and provider validation |
| `terraform plan` | PR created | Generate plan, post as PR comment |
| `terraform apply` | PR merged to main | Apply changes with approval gate |
| Drift detection | Daily cron | `terraform plan` in CI, alert if drift detected |

### Bicep Alternative

If the team has stronger Azure-native skills, Azure Bicep can replace Terraform for Azure-specific resources. Terraform remains preferred for its multi-cloud portability and mature state management. Hybrid approach: Terraform for core infrastructure, Bicep for Azure-specific features (Azure Policy, Azure AD B2C) via `azurerm` provider.

---

## 7. Security

### LGPDPPP Compliance (Ley General de Proteccion de Datos Personales en Posesion de Sujetos Obligados)

CEA Queretaro is a sujeto obligado (public entity) under LGPDPPP. The following requirements are addressed in Phase 6:

| Requirement | Implementation | Service Owner |
|-------------|---------------|---------------|
| **Aviso de privacidad** (Privacy notice) | Served via Customer Identity API; versioned; consent recorded per customer | Customer Identity |
| **Consentimiento** (Consent) | Granular consent management: data processing, marketing, third-party sharing | Customer Identity |
| **Derechos ARCO** (Access, Rectification, Cancellation, Opposition) | API endpoints for data subject rights; 20-business-day SLA | Customer Identity |
| **Data minimization** | Services only store PII they need; Customer Identity is the PII authority | All services |
| **Encryption** | PII encrypted at rest (AES-256) and in transit (TLS 1.3 / mTLS) | All services |
| **Access logging** | All PII access logged with accessor identity, timestamp, purpose | Customer Identity |
| **Data sovereignty** | All data stored in Azure Mexico Central (Queretaro); Azure Policy enforces region lock | Infrastructure |
| **Breach notification** | Incident response playbook includes INAI notification within 72 hours | Operations |

### Network Security

| Control | Implementation |
|---------|---------------|
| **Network policies** | Calico/Cilium CNI with deny-all default; explicit allow rules per service pair |
| **Pod security** | Pod Security Standards (restricted profile); no root containers; read-only root filesystem |
| **Image security** | ACR vulnerability scanning (Microsoft Defender); only signed images deployed; no `latest` tags |
| **Secrets** | Azure Key Vault via CSI driver; no secrets in environment variables or config maps |
| **Ingress** | WAF (Azure Front Door or ModSecurity) for SQL injection, XSS protection |
| **Service-to-service** | mTLS via service mesh; mutual certificate validation |
| **Database** | Private endpoints (no public IP); Azure AD authentication; SSL enforced |
| **Audit** | Azure Activity Log + AKS audit logs forwarded to Elasticsearch; 1-year retention |

---

## 8. Cost Management

### Estimated Monthly Azure Costs

| Resource | SKU / Configuration | Est. Monthly Cost (USD) |
|----------|-------------------|:----------------------:|
| AKS cluster (system nodes) | 3x Standard_D4s_v3 (4 vCPU, 16 GB) | $440 |
| AKS cluster (user nodes) | 4x Standard_D8s_v3 (8 vCPU, 32 GB), avg. usage | $1,180 |
| Azure DB for PostgreSQL | 3 instances, GP_Standard_D4ds_v4 (4 vCPU, 16 GB) | $900 |
| Azure Cache for Redis | Standard C2 (6 GB) | $170 |
| Azure Event Hubs for Kafka | Standard tier, 10 TUs | $700 |
| ACR | Premium SKU | $170 |
| VPN Gateway | VpnGw1 | $140 |
| Azure Key Vault | Standard | $10 |
| Azure Storage (Terraform state, logs) | LRS, ~100 GB | $20 |
| Azure Monitor / Log Analytics | 50 GB/day ingestion | $250 |
| Networking (bandwidth, DNS) | Estimated | $100 |
| **Total (without reserved instances)** | | **~$4,080/mo** |
| **Total (with 1-year reserved instances for VMs)** | | **~$3,050/mo** |

### Cost Optimization Strategy

| Strategy | Savings Estimate | When to Apply |
|----------|:---------------:|---------------|
| 1-year reserved instances for AKS nodes | 25-35% | After 3 months of stable baseline |
| 3-year reserved instances for PostgreSQL | 40-50% | After production workload validated |
| Spot instances for dev/staging node pools | 60-80% | Immediately for non-prod |
| Autoscaler tuning (scale-to-zero for dev) | 30-40% on dev | After initial deployment |
| Azure Cost Management alerts | Prevention | Immediately (P6-001) |
| Monthly cost review meeting | Accountability | Monthly, starting Week 4 |

---

## 9. Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|----|------|:-----------:|:------:|-----------|-------|
| R6-01 | VPN latency to on-premises PostgreSQL exceeds acceptable thresholds during dual-write period | Medium | High | Provision Azure ExpressRoute as backup; optimize CDC batch sizes; cache frequently-read legacy data in Redis | Cloud Architect |
| R6-02 | Kafka operational complexity overwhelms team (if self-managed via Strimzi) | Medium | High | Prefer Azure Event Hubs for Kafka or Confluent Cloud managed service to reduce operational burden; invest in Kafka training | DevOps Engineer |
| R6-03 | Data inconsistency during dual-write period causes billing errors | Medium | Critical | Nightly reconciliation job (P6-045); shadow-mode writes before cutover; rollback plan to legacy for each service; financial data validated by domain expert | Backend Developer (Go) |
| R6-04 | AKS cluster misconfiguration leads to security vulnerability | Low | Critical | CIS Kubernetes Benchmark compliance scan; Azure Policy for AKS; peer review of all Terraform changes; quarterly pen test | DevOps Engineer |
| R6-05 | Team lacks Azure/Kubernetes experience, causing delays | Medium | Medium | Cloud architect advisory role; Azure training budget; pair programming on infrastructure tasks; use managed services to reduce K8s surface area | Cloud Architect |
| R6-06 | Service mesh adds excessive latency or resource overhead | Low | Medium | Evaluate both Istio and Linkerd (P6-043); Linkerd has lower overhead; start without mesh and add incrementally; measure latency delta | DevOps Engineer |
| R6-07 | Azure Mexico Central capacity constraints for specific SKUs | Low | Medium | Pre-provision reserved instances; identify fallback SKUs; Azure support escalation path established | Cloud Architect |
| R6-08 | Debezium CDC connector fails silently, causing data divergence | Medium | High | Monitor connector status in Grafana (P6-017); heartbeat table for liveness detection; alerting on connector lag; automated restart on failure | DevOps Engineer |
| R6-09 | Scope creep: pressure to extract more than 3 microservices in this phase | Medium | Medium | Strict adherence to 3-service scope; additional services deferred to Phase 7-10; sprint reviews with stakeholder alignment | Cloud Architect |
| R6-10 | LGPDPPP compliance audit finds gaps in PII handling | Low | High | Privacy-by-design review at service design stage (P6-021, P6-025); INAI compliance checklist; legal review of privacy notice | Backend Developer (Go) |

---

## 10. Staffing

### Core Team

| Role | Allocation | Skills Required | Hiring Priority |
|------|:----------:|----------------|:--------------:|
| **Cloud/DevOps Engineer** | 100% (Months 8-16) | Azure (AKS, VNet, Key Vault), Terraform, GitHub Actions, Kubernetes, Helm, Prometheus/Grafana, Kafka operations | P0 -- Must be onboard by Month 8 |
| **Backend Developer (Go)** | 100% (Months 8-16) | Go, PostgreSQL, hexagonal architecture, domain-driven design, Kafka, gRPC, Camunda/Zeebe | P0 -- Must be onboard by Month 8 |
| **Backend Developer (TypeScript)** | 100% (Months 8-16) | TypeScript, Node.js, event-driven architecture, Kafka, Redis, template engines, REST API design | P0 -- Must be onboard by Month 8 |
| **Cloud Architect** | 25% advisory (Months 8-16) | Azure architecture, security, cost optimization, microservices patterns, event-driven design, LGPDPPP compliance | P1 -- Can be external consultant |

### Extended Team (Part-Time Support)

| Role | Allocation | Contribution |
|------|:----------:|-------------|
| Database Engineer | 10% | Schema migration support, PostgreSQL tuning for per-service databases |
| Security Engineer | 10% | Pen testing (P6-049), network policy review, LGPDPPP compliance validation |
| QA Engineer | 20% (Weeks 13-28) | Performance testing, chaos engineering, integration test suites |
| Product Owner | 10% | Sprint reviews, acceptance criteria validation, stakeholder communication |

### Training Budget

| Topic | Format | Duration | Budget |
|-------|--------|:--------:|:------:|
| Azure Kubernetes Service | Microsoft Learn + hands-on lab | 3 days | $2,000 |
| Apache Kafka for Developers | Confluent training | 2 days | $1,500 |
| Go microservices patterns | Workshop | 2 days | $1,500 |
| Camunda 8 / Zeebe | Camunda Academy | 2 days | $1,000 |
| Chaos Engineering | Workshop | 1 day | $500 |
| **Total Training** | | | **$6,500** |

---

## Appendix A: Task Summary

| Sprint | Tasks | Total Effort (days) |
|--------|:-----:|:-------------------:|
| Sprint 1-3 (Weeks 1-6): Azure Infrastructure | P6-001 through P6-012 | 44 |
| Sprint 4-6 (Weeks 7-12): Event Infrastructure | P6-013 through P6-020 | 36 |
| Sprint 7-10 (Weeks 13-20): First Microservices | P6-021 through P6-043 | 82 |
| Sprint 11-14 (Weeks 21-28): Integration & Stabilization | P6-044 through P6-052 | 38 |
| **Total** | **52 tasks** | **200 days** |

### Critical Path

```
P6-001 (Azure sub)
  --> P6-002 (AKS cluster)
    --> P6-003 (Namespaces) + P6-004 (ACR) + P6-005 (VPN)
      --> P6-013 (Kafka)
        --> P6-014 (Topics) + P6-015 (Schema Registry) + P6-017 (Debezium CDC)
          --> P6-018 (Event libraries)
            --> P6-023 (Customer Identity Service)
              --> P6-026 (Deploy to AKS)
                --> P6-041 (Strangler fig routing)
                  --> P6-044 (Validation & stabilization)
```

### Phase Exit Criteria

- [ ] AKS cluster operational with 3 namespaces (dev, staging, prod)
- [ ] Kafka cluster with 18 domain event topics and schema registry
- [ ] Debezium CDC streaming changes from 9 tier-1 legacy tables
- [ ] Customer Identity Service deployed and serving 100% of identity reads
- [ ] Notification Service deployed and delivering multi-channel notifications
- [ ] Work Order Service deployed with Camunda BPMN process orchestration
- [ ] API Gateway routing traffic to new services with strangler fig pattern
- [ ] OAuth 2.0 / OIDC authentication enforced on all API endpoints
- [ ] Service mesh providing mTLS between all microservices
- [ ] Monitoring, logging, and tracing operational for all services
- [ ] Performance tested at 500 req/s with p99 < 500ms
- [ ] Chaos engineering scenarios validated with documented recovery
- [ ] LGPDPPP compliance validated for Customer Identity Service
- [ ] All infrastructure reproducible from Terraform
- [ ] Operational runbooks and ADRs documented
- [ ] Dual-write reconciliation showing 99.99% consistency
