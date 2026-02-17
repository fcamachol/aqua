# AquaCIS 2.0: Next-Generation Architecture Blueprint

**Document Classification:** Strategic Architecture
**Version:** 1.0
**Date:** 2026-02-16
**Scope:** Full-stack modernization of CEA Queretaro's Customer Information System
**Audience:** Executive leadership, technical leadership, implementation partners

---

## Table of Contents

1. [Executive Vision](#1-executive-vision)
2. [Current State Summary](#2-current-state-summary)
3. [Architecture Principles](#3-architecture-principles)
4. [System Architecture](#4-system-architecture)
5. [Domain Services](#5-domain-services--bounded-contexts)
6. [Technology Stack](#6-technology-stack)
7. [Smart Metering Platform](#7-smart-metering-platform)
8. [Customer Engagement Platform](#8-customer-engagement-platform)
9. [Data Architecture](#9-data-architecture)
10. [Migration Strategy](#10-migration-strategy)
11. [Build vs Buy Decisions](#11-build-vs-buy-decisions)
12. [Cost Estimates](#12-cost-estimates)
13. [Success Metrics](#13-success-metrics)
14. [Risk Assessment](#14-risk-assessment)

---

## 1. Executive Vision

### Purpose

AquaCIS 2.0 is a ground-up reimagination of CEA Queretaro's commercial water management platform. It replaces a monolithic, SOAP-based Java EE system -- branded "Aquasis" by Agbar/OCCAM -- with a cloud-native, event-driven, microservices architecture purpose-built for the realities of Mexican water utility operations: complex tiered tariffs, CFDI 4.0 electronic invoicing, convenience-store payment dominance, water scarcity in the Bajio region, and a population exceeding 1.2 million across 13 municipalities.

### Value Proposition

AquaCIS 2.0 delivers three transformational outcomes:

1. **Revenue Recovery.** Smart metering and an intelligent billing engine reduce non-revenue water from an estimated 40% to 18%, recovering $100-120M USD over 10 years. Modern payment rails (SPEI, CoDi, OXXO via Conekta) and proactive debt management improve collection rates.

2. **Operational Excellence.** A 94.4% reduction in database complexity (4,114 tables to ~230), API-first integration, and event-driven workflows eliminate the manual processes, batch dependencies, and data inconsistencies that currently plague day-to-day operations.

3. **Citizen Experience.** A PWA-first customer portal, WhatsApp-integrated AI assistant, real-time consumption visibility, and digital identity verification (INE/CURP) move CEA Queretaro from reactive service delivery to proactive citizen engagement -- raising engagement maturity from 4/10 to 7.2/10 within 12 months of launch.

### Strategic Alignment

This blueprint synthesizes findings from 24 specialist research agents across three divisions: current-state audit (Division A), integration assessment (Division B), and technology research (Division C). Every recommendation is grounded in the actual Aquasis domain model (126 SOAP operations, 5 WSDL services, 9 tier-1 tables), validated against Latin American utility benchmarks, and scoped for a mid-size Mexican water utility's budget and team capacity.

---

## 2. Current State Summary

### The System We Inherit

AquaCIS 1.0 (Aquasis) is a commercial management platform built on design patterns from 2005-2010. While functional, it has accumulated severe technical debt that constrains every dimension of CEA Queretaro's operations.

### Critical Metrics

| Dimension | Current State | Severity |
|-----------|--------------|:--------:|
| **Database tables** | 4,114 (70% structural waste: 2,144 tmp_deuda_*, 477 aux_*, 230 his_*) | CRITICAL |
| **Target table count** | ~230 after consolidation (94.4% reduction) | -- |
| **SOAP services** | 5 services, 126 operations | -- |
| **Integration coverage** | Only 17 of 126 operations integrated (13.5%) | CRITICAL |
| **God table** | `explotacion` with 350 columns mixing 15 domains | CRITICAL |
| **Data integrity** | No FK constraints, 250+ char(1) booleans, VARCHAR GPS coordinates, plaintext passwords | CRITICAL |
| **Frontend coupling** | Vue.js builds SOAP XML directly -- credential exposure, no validation | HIGH |
| **Integration score** | 4/10 | HIGH |
| **Technical debt severity** | 9/10 | CRITICAL |
| **Best domain** | Collections (7/10) | -- |
| **Worst domains** | Lookup config (3/10), Gap analysis (3/10) | -- |
| **Cloud readiness** | 4.2/10 | HIGH |
| **Customer engagement maturity** | 4-5/10 | HIGH |
| **Non-revenue water** | Estimated 35-45% | CRITICAL |

### Root Causes

1. **Table-per-process anti-pattern.** The application creates a new physical table for each billing/collection execution (2,144 `tmp_deuda_*` tables, 477 `aux_varscreditored_*` tables). This bloats PostgreSQL system catalogs (`pg_class`, `pg_attribute`, `pg_statistic`) and degrades query planning for every query in the system.

2. **History-table duplication.** 230 `his*` tables mirror the schema of their base tables for audit tracking -- a manual, error-prone approximation of event sourcing that doubles schema complexity without providing the replay or temporal query capabilities of a true event store.

3. **Configuration monolith.** The 350-column `explotacion` table serves as a system-wide configuration dumping ground, mixing billing parameters, metering settings, GIS data, fiscal rules, and operational flags in a single row. Changes in one domain risk side effects in all others.

4. **Passthrough proxy.** The Rails `cea_proxy_controller.rb` exists solely to bypass browser CORS restrictions. It performs no transformation, validation, caching, or error normalization. SOAP faults (including raw `NullPointerException` messages) propagate directly to the frontend.

5. **Closed integration surface.** 109 of 126 available SOAP operations remain unused by AGORA, locking critical self-service capabilities (online payments, meter self-readings, consumption alerts, service start/stop) behind an integration wall.

---

## 3. Architecture Principles

AquaCIS 2.0 is governed by ten architecture principles. These are non-negotiable constraints that guide every design decision, technology selection, and implementation trade-off.

### P1: API-First

Every capability is exposed through a well-documented API before any UI is built. OpenAPI 3.1 specifications serve as the contract between teams. No service communicates with another through shared databases.

### P2: Event-Driven by Default

State changes are published as domain events to an event bus. Services react to events, not to synchronous calls, wherever eventual consistency is acceptable. Billing and Metering domains use full event sourcing with append-only event stores.

### P3: Domain-Driven Design

The system is decomposed into bounded contexts aligned with business capabilities, not technical layers. Each bounded context owns its data, defines its ubiquitous language, and evolves independently. Context mapping defines explicit relationships between domains.

### P4: Cloud-Native

All services are containerized, orchestrated on Kubernetes, and deployed to Azure Mexico Central (Queretaro). Infrastructure is provisioned as code (Terraform). Services are stateless; state lives in managed data stores.

### P5: Twelve-Factor Application

Every service conforms to twelve-factor methodology: config in environment, stateless processes, port binding, disposability, dev/prod parity, logs as event streams, and admin processes as one-off tasks.

### P6: Database-per-Service

Each bounded context owns a private data store. No direct cross-service database queries. Data sharing occurs through APIs (synchronous) or events (asynchronous). This eliminates the 4,114-table monolith problem by design.

### P7: Security by Design

Zero-trust networking. OAuth 2.0 / OIDC for all API access. Encryption at rest and in transit. LGPDPPP (Mexico's data protection law) compliance baked into data architecture. No plaintext passwords or exposed credentials -- ever.

### P8: Observability as a First-Class Concern

Distributed tracing (OpenTelemetry), structured logging, and metrics (Prometheus) are instrumented in every service from day one. Dashboards and alerts are deployed alongside the services they monitor.

### P9: Progressive Delivery

All changes are deployed behind feature flags. Canary releases and blue-green deployments are standard. The strangler fig pattern governs migration from legacy to new services.

### P10: Mexico-First Design

CFDI 4.0 compliance, CONAGUA reporting, tiered water tariffs, INE/CURP identity verification, OXXO/convenience store payments, SPEI bank transfers, and Spanish-language interfaces are primary requirements, not afterthoughts.

---

## 4. System Architecture

### High-Level Architecture

The AquaCIS 2.0 architecture is organized into six layers, from citizen-facing channels at the top to the IoT field layer at the bottom.

```
==========================================================================
 LAYER 1: CUSTOMER CHANNELS
==========================================================================
  PWA (Vue 3)    WhatsApp Bot    IVR System    OXXO Kiosks    Mobile App
       |              |              |              |              |
       +------+-------+------+------+------+-------+------+------+
              |              |              |              |
==========================================================================
 LAYER 2: API GATEWAY & BFF
==========================================================================
  +------------------+  +-------------------+  +--------------------+
  | API Gateway      |  | BFF - Customer    |  | BFF - Operations   |
  | (Kong / Azure    |  | (GraphQL for      |  | (REST for back-    |
  |  API Mgmt)       |  |  portal/app)      |  |  office systems)   |
  | Rate limiting    |  | Aggregation       |  | Batch endpoints    |
  | Auth (OAuth 2.0) |  | Caching           |  | Reporting APIs     |
  | TLS termination  |  | Personalization   |  | Admin APIs         |
  +------------------+  +-------------------+  +--------------------+
              |              |              |
==========================================================================
 LAYER 3: MICROSERVICES (10 Bounded Contexts)
==========================================================================
  +----------+ +----------+ +----------+ +----------+ +----------+
  | Customer | | Contract | | Billing  | | Metering | | Payments |
  | Identity | | Mgmt     | | Engine   | | Readings | | Collect. |
  +----------+ +----------+ +----------+ +----------+ +----------+
  +----------+ +----------+ +----------+ +----------+ +----------+
  | Work     | | Infra-   | | Fiscal & | | Notifi-  | | Analyt-  |
  | Orders   | | structure| | Compli-  | | cations  | | ics &    |
  |          | | (GIS)    | | ance     | | & Comms  | | Reports  |
  +----------+ +----------+ +----------+ +----------+ +----------+
              |              |              |
==========================================================================
 LAYER 4: EVENT BUS & INTEGRATION
==========================================================================
  +--------------------------------------------------------------+
  | Apache Kafka (Event Backbone)                                 |
  | - Domain events (contract.created, invoice.generated, etc.)   |
  | - Event sourcing stores (billing, metering)                   |
  | - Saga orchestration (billing run, payment reconciliation)    |
  | - CDC streams from legacy Aquasis (transition period)         |
  +--------------------------------------------------------------+
  +------------------+  +-------------------+
  | Legacy Adapter   |  | Camunda (BPMN)    |
  | (SOAP-to-Event   |  | Workflow engine    |
  |  bridge for       |  | for complex sagas |
  |  Aquasis)         |  | and human tasks   |
  +------------------+  +-------------------+
              |              |              |
==========================================================================
 LAYER 5: DATA LAYER
==========================================================================
  +-------------+ +-------------+ +-------------+ +-------------+
  | PostgreSQL  | | TimescaleDB | | Redis       | | Elastic-    |
  | (per-service| | (meter      | | (cache,     | | search      |
  |  databases, | |  time-series| |  sessions,  | | (full-text  |
  |  JSONB for  | |  data)      | |  rate limit)| |  search,    |
  |  audit/     | |             | |             | |  analytics) |
  |  config)    | |             | |             | |             |
  +-------------+ +-------------+ +-------------+ +-------------+
  +-------------+ +-------------+
  | PostGIS     | | Data Lake   |
  | (spatial/   | | (Azure Blob |
  |  GIS data)  | |  + Parquet) |
  +-------------+ +-------------+
              |
==========================================================================
 LAYER 6: IoT & FIELD LAYER
==========================================================================
  +--------------------------------------------------------------+
  | EMQX (MQTT Broker) -- Field device communication              |
  +--------------------------------------------------------------+
  +--------------------------------------------------------------+
  | ThingsBoard (IoT Platform)                                    |
  | - Device registry, firmware OTA, alerting engine              |
  | - Rule engine for leak detection and anomaly triggers         |
  +--------------------------------------------------------------+
  +--------------------------------------------------------------+
  | ChirpStack (LoRaWAN Network Server)                           |
  | - 100 LoRaWAN gateways across metro Queretaro                |
  | - 915 MHz ISM band (NOM-208-SCFI compliant)                  |
  +--------------------------------------------------------------+
  +--------------------------------------------------------------+
  | Field Devices                                                  |
  | - Kamstrup flowIQ 2200 smart meters (ultrasonic, IP68)        |
  | - Acoustic leak sensors                                        |
  | - Pressure transducers at DMA inlets                           |
  +--------------------------------------------------------------+
```

### Inter-Service Communication

Services communicate through two patterns, chosen based on consistency requirements:

**Synchronous (gRPC / REST) -- for queries requiring immediate consistency:**
- Contract Management queries Customer Identity for persona/cliente lookup
- Billing Engine queries Contract Management for active contracts during billing runs
- Billing Engine queries Metering & Readings for latest consumption data
- Payments queries Billing Engine for outstanding invoices

**Asynchronous (Kafka events) -- for state changes and workflows:**
- `contract.created` / `contract.modified` --> consumed by Billing, Work Orders, Analytics, Notifications
- `reading.recorded` --> consumed by Billing (threshold triggers), Analytics
- `reading.campaign.completed` --> consumed by Billing (triggers billing run)
- `invoice.generated` --> consumed by Payments (create references), Fiscal (generate CFDI), Notifications (send bill)
- `payment.received` --> consumed by Contract Mgmt (update balance), Notifications (receipt), Analytics
- `anomaly.detected` --> consumed by Work Orders (auto-create), Notifications (alert customer)
- `work.order.completed` --> consumed by Contract Mgmt, Metering (if meter change)

### Saga: Billing Run Orchestration

The billing cycle is the most complex distributed workflow, requiring a saga pattern:

```
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
   --> Payments: CreatePaymentReferences (OXXO, bank, SPEI)
7. PaymentReferencesCreated
   --> Notifications: SendBillNotifications (email, SMS, WhatsApp, push)
8. NotificationsSent
   --> Billing: MarkBillingRunComplete

Compensating Actions:
- CFDI generation fails --> Mark invoices as pending-fiscal, retry with backoff
- Payment reference fails --> Queue for manual reference creation
- Notification fails --> Queue for retry (non-blocking, does not halt saga)
```

---

## 5. Domain Services -- Bounded Contexts

### BC1: Customer Identity

**Purpose:** Centralized identity management for all persons and entities interacting with CEA Queretaro.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Persona, Cliente, Direccion, PersonaDir |
| **Key capabilities** | Customer 360 view, INE/CURP digital identity verification, LGPDPPP consent management, duplicate detection, address normalization |
| **Scale profile** | Low write, high read -- identity data changes infrequently but is queried by all services |
| **Data store** | PostgreSQL with encrypted PII columns |
| **Key events produced** | `customer.created`, `customer.updated`, `identity.verified`, `consent.granted` |
| **Integration** | INE validation API, CURP lookup (RENAPO), LGPDPPP consent registry |

### BC2: Contract Management

**Purpose:** Manages the lifecycle of water service contracts from application (alta) through termination (baja), including ownership transfers (subrogacion) and service point associations.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Contrato, Polcontar, Sociedad, PtoServ |
| **Key capabilities** | Contract creation/modification/termination, ownership transfer, service point linkage, contract-customer association, multi-contract management |
| **Scale profile** | Medium write, high read |
| **Data store** | PostgreSQL |
| **Key events produced** | `contract.created`, `contract.modified`, `contract.terminated`, `ownership.transferred` |
| **Current SOAP mapping** | InterfazGenericaContratacionWS (53 operations -- to be decomposed) |

### BC3: Billing Engine

**Purpose:** Calculates charges, applies tariffs, generates invoices, and manages the end-to-end billing cycle for all service contracts.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Factura, Facturable, LinFactura, Facturacion, Concepto, Tarifa, ImpuFact |
| **Key capabilities** | Declarative tariff engine with versioned rate plans, tiered/block rate calculation, seasonal multipliers, social rate adjustments, fixed charges, sewer charges, minimum consumption, simulation mode ("what-if" tariff analysis), full event-sourced audit trail |
| **Scale profile** | Periodic burst during billing cycles, medium read |
| **Data store** | PostgreSQL (event store + read projections) |
| **Architecture pattern** | CQRS + Event Sourcing -- every billing calculation stored as immutable events; current balance is a projection |
| **Key events produced** | `billing.run.started`, `charges.calculated`, `invoice.generated`, `invoice.corrected`, `adjustment.applied` |
| **Priority** | 9/10 -- revenue-generating core of the utility |

**Tariff Engine Design:** The tariff engine uses catalog-driven configuration with a lightweight rule engine (JSON-based DSL). Tariff analysts configure new rates through an admin interface without developer intervention. Every tariff plan has `effective_from` and `effective_to` dates for temporal versioning. The 10-step rating pipeline resolves applicable tariff version, determines customer classification, calculates block/tier consumption, applies seasonal multipliers, social rate adjustments, fixed charges, sewer charges, surcharges/discounts, taxes (IVA), and returns a detailed charge breakdown.

### BC4: Metering & Readings

**Purpose:** Manages physical meters, reading campaigns, consumption calculation, and serves as the ingestion point for smart meter telemetry.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Contador, PolDetSum, Lote, Zona, Equipo, Observac |
| **Key capabilities** | Meter lifecycle management, manual and AMI reading ingestion, consumption calculation, anomaly detection (AI-driven), reading validation, reading campaign orchestration |
| **Scale profile** | High write (reading campaigns, AMI telemetry), medium read |
| **Data store** | PostgreSQL (meter registry) + TimescaleDB (time-series readings) |
| **Architecture pattern** | Event Sourcing -- MeterInstalled, ReadingRecorded, ReadingValidated, ConsumptionCalculated, AnomalyDetected, MeterReplaced, SmartMeterTelemetry |
| **Key events produced** | `reading.recorded`, `reading.campaign.completed`, `anomaly.detected`, `consumption.calculated` |

### BC5: Payments & Collections

**Purpose:** Processes payments across all channels, manages debt lifecycle, generates payment references, and handles reconciliation.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | OpeCarGest, OpeDesglos, GesCartera, Referencia, ContratoDeuda, MovcContrato |
| **Key capabilities** | Multi-channel payment processing (SPEI, CoDi, OXXO/convenience stores, bank transfer, card), Conekta PSP integration, payment reference generation, automatic reconciliation, debt aging, dunning workflows, payment plan management |
| **Scale profile** | Medium write, high read |
| **Data store** | PostgreSQL |
| **Key events produced** | `payment.received`, `payment.reversed`, `debt.status.changed`, `reference.created` |
| **Mexico-specific** | OXXO handles 35-40% of all utility payments; Conekta PSP provides unified access to OXXO, SPEI, CoDi, and card payments |
| **Current SOAP mapping** | InterfazGenericaGestionDeudaWS (13 operations) |

### BC6: Work Order Management

**Purpose:** Manages field operations including meter installations, leak repairs, disconnections/reconnections, inspections, and customer service requests.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Orden, field dispatch, mobile workforce |
| **Key capabilities** | Work order creation (manual and auto-generated from anomaly events), mobile-first field app, geospatial routing, crew scheduling, photo/GPS capture, integration with AGORA service requests |
| **Scale profile** | Medium write/read, mobile-first |
| **Data store** | PostgreSQL + PostGIS (for spatial routing) |
| **Key events produced** | `work.order.created`, `work.order.assigned`, `work.order.completed` |

### BC7: Infrastructure & GIS

**Purpose:** Manages the spatial representation of the water distribution network including service connections (acometidas), pipes, valves, reservoirs, and district metered areas (DMAs).

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Acometida, Servicio, spatial network data |
| **Key capabilities** | Network topology management, DMA definition and analysis, hydraulic modeling integration (EPANET/WNTR), asset management, service point geolocation, GIS visualization |
| **Scale profile** | Low write, specialized spatial queries |
| **Data store** | PostGIS + GeoServer (OGC-compliant WMS/WFS services) |
| **Integration** | EPANET for hydraulic modeling, QGIS for desktop analysis |

### BC8: Fiscal & Compliance

**Purpose:** Handles all Mexican regulatory requirements including CFDI 4.0 electronic invoicing, SAT reporting, tax calculations, and CONAGUA regulatory submissions.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | CFDI documents, tax records, regulatory submissions |
| **Key capabilities** | CFDI 4.0 generation and timbrado (stamping via PAC), CFDI cancellation workflow, SAT reporting, IVA calculation, LGPDPPP data subject rights management, CONAGUA water usage reporting |
| **Scale profile** | Event-driven, append-only |
| **Data store** | PostgreSQL (append-only for fiscal immutability) |
| **Key events produced** | `cfdi.generated`, `cfdi.cancelled`, `cfdi.stamped` |

### BC9: Notifications & Communications

**Purpose:** Multi-channel message delivery integrated with the AGORA platform, supporting proactive and reactive citizen communication.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Message queues, templates, delivery records |
| **Key capabilities** | Email, SMS, WhatsApp (via AGORA/Maria AI), push notifications, IVR outbound calls, template management, delivery tracking, rate limiting, notification preferences |
| **Scale profile** | High throughput, fully asynchronous |
| **Data store** | Redis (queue/dedup) + PostgreSQL (delivery audit) |
| **Subscription model** | Subscribes to events from ALL other domains (invoice.generated --> send bill, payment.received --> send receipt, anomaly.detected --> alert customer, outage.declared --> notify affected area) |

### BC10: Analytics & Reporting

**Purpose:** Read-optimized aggregations, regulatory reporting, executive dashboards, and data science workloads.

| Attribute | Detail |
|-----------|--------|
| **Core entities** | Materialized views, data warehouse, OLAP cubes |
| **Key capabilities** | Real-time operational dashboards (Grafana), regulatory report generation (CONAGUA, SAT), NRW analytics, consumption pattern analysis, revenue forecasting, customer segmentation, open data portal (CKAN) |
| **Scale profile** | Read-heavy, batch refresh + near-real-time streaming |
| **Data store** | Elasticsearch (search/aggregation) + Data Lake (Azure Blob + Parquet) |
| **Architecture** | Consumes events from all domains via Kafka; builds projections optimized for each reporting use case; tolerates eventual consistency |

---

## 6. Technology Stack

### Core Platform

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Cloud Provider** | Azure Mexico Central (Queretaro) | Data sovereignty compliance, sub-5ms latency to CEA offices, LGPDPPP alignment |
| **Container Orchestration** | Azure Kubernetes Service (AKS) | Managed Kubernetes, auto-scaling, integrated monitoring |
| **Service Mesh** | Istio / Linkerd | mTLS, traffic management, observability |
| **API Gateway** | Kong Gateway / Azure API Management | Rate limiting, OAuth 2.0/OIDC, TLS termination, analytics |
| **CI/CD** | GitHub Actions + ArgoCD | GitOps-driven deployments, progressive delivery |
| **Infrastructure as Code** | Terraform + Helm | Reproducible environments, drift detection |

### Application Layer

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Backend services** | Go (primary), TypeScript (BFF/integrations) | Go for performance-critical services (billing, metering, IoT); TypeScript for BFF and integration layers where developer productivity matters |
| **Frontend** | Vue 3 + Vite (PWA) | Existing AGORA investment in Vue 3; PWA-first for offline capability and installability; Vite for modern build tooling |
| **BFF - Customer** | GraphQL (TypeScript) | Complex nested queries (contract + meters + readings + debt); client-driven data fetching for PWA |
| **BFF - Operations** | REST (TypeScript) | Standard CRUD for back-office; simpler caching and tooling |
| **Workflow Engine** | Camunda 8 (Zeebe) | BPMN 2.0 for complex sagas (billing run, onboarding), human task management, visual process modeling |
| **Rule Engine** | JSON Rules Engine (custom DSL) | Tariff calculation, anomaly detection rules, configurable by business analysts |

### Data Layer

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Relational (per service)** | PostgreSQL 16 | Proven at scale, JSONB for flexible audit/config (replaces 65+ tipo* lookup tables), strong ecosystem |
| **Time-Series** | TimescaleDB | PostgreSQL-compatible, hypertable compression, continuous aggregates for meter readings |
| **Cache / Sessions** | Redis 7 | Session management, rate limiting, real-time leaderboards, pub/sub for notifications |
| **Search / Analytics** | Elasticsearch 8 | Full-text search across contracts/customers, log aggregation, analytics queries |
| **Spatial / GIS** | PostGIS + GeoServer | Industry-standard spatial database + OGC-compliant map services (WMS/WFS) |
| **Data Lake** | Azure Blob Storage + Parquet | Long-term storage for historical data, ML training datasets, regulatory archives |

### Event & Messaging Layer

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Event Bus** | Apache Kafka (Confluent Cloud or Azure Event Hubs for Kafka) | Log-based event backbone; native event sourcing support; replay capability replaces 230 his* tables |
| **Stream Processing** | Kafka Streams / ksqlDB | Real-time aggregations, anomaly detection, CDC from legacy |
| **MQTT Broker** | EMQX | High-performance MQTT 5.0 for IoT device communication; clustering for HA |

### IoT & Smart Metering

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **IoT Platform** | ThingsBoard (Professional Edition) | Device management, rule engine, firmware OTA, dashboards; open-source core |
| **LoRaWAN Network Server** | ChirpStack | Open-source, self-hosted; full LoRaWAN 1.0.x support; no per-device licensing |
| **LoRaWAN Gateways** | Kerlink / Multitech | Industrial-grade, outdoor IP67, solar-compatible; 100 gateways for metro Queretaro |
| **Smart Meters** | Kamstrup flowIQ 2200 (primary) | Ultrasonic, R800 accuracy, 16-year battery, LoRaWAN native, IP68, Mexico office (CDMX), LATAM references (SABESP, CAESB) |

### Observability

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Metrics** | Prometheus + Grafana | Industry standard; rich dashboard ecosystem; alerting via Alertmanager |
| **Logging** | OpenTelemetry + Elasticsearch | Structured logging, distributed tracing, correlation IDs |
| **Tracing** | Jaeger / Tempo | Distributed request tracing across microservices |
| **Uptime** | Azure Monitor + PagerDuty | SLA monitoring, incident management, on-call rotation |

### Open-Source Components (from C8 Research)

| Component | Project | Role in AquaCIS 2.0 |
|-----------|---------|---------------------|
| **GIS** | PostGIS, QGIS, GeoServer | Spatial data storage, desktop analysis, map services |
| **Hydraulic Modeling** | EPANET / WNTR | Network simulation, pressure analysis, NRW detection |
| **IoT Platform** | ThingsBoard | Device management, telemetry processing, rule engine |
| **Workflow** | Camunda | BPMN process orchestration, human task management |
| **Open Data** | CKAN | Public water quality data portal, transparency compliance |
| **LoRaWAN** | ChirpStack | Network server, device activation, join server |

---

## 7. Smart Metering Platform

### Vision

Transform CEA Queretaro from manual, periodic meter reading to continuous, automated metering infrastructure covering 400,000+ service points. This is the single highest-ROI investment in the entire modernization program.

### Architecture: LoRaWAN-Primary Hybrid AMI

**Primary protocol:** LoRaWAN (915 MHz ISM band, NOM-208-SCFI compliant)

| Deployment Zone | Protocol | Coverage | Rationale |
|----------------|----------|:--------:|-----------|
| Urban Queretaro | LoRaWAN | 70% of meters | Dense deployment, private network, cost-effective |
| Suburban / New developments | LoRaWAN | 15% of meters | Gateway deployed with new infrastructure |
| Rural municipalities (Huimilpan, Amealco, Cadereyta) | NB-IoT (Telcel) | 10% of meters | Sparse meters, gateway infrastructure not justified |
| Critical infrastructure (DMA inlets) | LTE-M / Cellular | 5% of meters | Pressure sensors requiring low-latency reporting |

### Network Infrastructure

- **100 LoRaWAN gateways** (Kerlink/Multitech) across metro Queretaro
- Queretaro's terrain (valley at ~1,800m elevation surrounded by hills) is favorable for gateway placement on high points
- **ChirpStack** open-source network server (self-hosted, no per-device licensing)
- Solar/battery backup for gateway resilience
- Estimated infrastructure cost: ~$400,000 USD

### Recommended Meter Hardware

**Primary: Kamstrup flowIQ 2200**
- Ultrasonic measurement, R800 accuracy class
- 16-year battery life
- Low-flow detection: 1 L/hr
- Native LoRaWAN and NB-IoT communication
- 8,760 hourly data values (1 year on-device logging)
- IP68 rated (permanently submersible)
- Leak alarm, tamper detection (magnetic, tilt, reverse flow)
- Mexico office (CDMX), LATAM references (SABESP Brazil, CAESB Brazil)
- Estimated unit cost: $150-250 USD (DN15-25mm)

### Data Pipeline

```
Smart Meter (hourly reading)
  --> LoRaWAN Gateway (RF 915 MHz)
    --> ChirpStack Network Server (LoRaWAN protocol)
      --> EMQX MQTT Broker (device-to-cloud messaging)
        --> Kafka Topic: meter.telemetry.raw
          --> Stream Processing (validation, deduplication, unit conversion)
            --> TimescaleDB (time-series storage, continuous aggregates)
            --> Kafka Topic: reading.validated
              --> Billing Engine (consumption calculation)
              --> Analytics (NRW analysis, pattern detection)
              --> ThingsBoard (device dashboards, alerting)
              --> Anomaly Detection ML (leak detection, tamper detection)
```

### Leak Detection & NRW Reduction

| Capability | Method | Expected Impact |
|-----------|--------|----------------|
| **Continuous flow detection** | 24/7 meter data analysis; flow > 0 during expected zero-use periods | Detect customer-side leaks within hours |
| **DMA water balance** | Compare DMA inlet flow (pressure sensors) vs sum of meter readings | Identify distribution losses by zone |
| **Acoustic leak detection** | Acoustic sensors on mains; sound pattern analysis | Locate pipe leaks before surface evidence |
| **Minimum night flow analysis** | Statistical analysis of 2-5 AM flow across DMAs | Baseline real losses per zone |
| **Pressure management** | Pressure transducers at DMA boundaries; pressure-dependent leakage model | Reduce burst frequency and leakage rate |

**Target:** NRW reduction from 40% to 18% over 72 months = **$100-120M USD recovered over 10 years**

### Rollout Plan

| Phase | Timeline | Meters | Focus |
|-------|----------|:------:|-------|
| Pilot | Months 1-12 | 10,000 | High-NRW zones, proof of concept, calibrate ML models |
| Phase 1 | Months 13-30 | 50,000 | Urban core, commercial/industrial (highest revenue) |
| Phase 2 | Months 31-48 | 150,000 | Suburban expansion, remaining urban |
| Phase 3 | Months 49-60 | 100,000 | Full urban coverage, new developments |
| Phase 4 | Months 61-72 | 90,000 | Rural municipalities, remaining gaps |
| **Total** | **72 months** | **400,000** | **Full AMI coverage** |

---

## 8. Customer Engagement Platform

### Vision

Move CEA Queretaro from reactive, office-based service delivery to a proactive, digital-first citizen engagement model where 70-85% of customer interactions are resolved without human intervention.

### PWA-First Customer Portal

**Technology:** Vue 3 + Vite progressive web application (building on existing AGORA Vue 3 investment)

**Tier 1 -- Essential Features (Months 1-6):**
- Account dashboard: balance, last bill, next due date, consumption summary
- Bill view and download (PDF with CFDI XML)
- Online payment via Conekta (credit/debit card, SPEI, CoDi)
- Consumption history with monthly/weekly charts
- Service request submission (leak reports, inspections, complaints)
- Account profile management and notification preferences
- Paperless billing enrollment

**Tier 2 -- Enhanced Features (Months 7-12):**
- Custom consumption alerts (high-use thresholds)
- AI-driven leak detection alerts (from smart meter data)
- Payment plans for overdue balances
- Auto-pay enrollment (recurring SPEI/card)
- Self-report meter readings (for non-AMI meters)
- Service start/stop requests
- Multi-contract management (single login, multiple addresses)
- Water usage comparison to neighborhood averages

**Tier 3 -- Advanced Features (Months 13-18):**
- Real-time consumption monitoring (AMI meters)
- Budget billing (equalized monthly payments)
- Personalized conservation recommendations
- Predictive billing (AI-estimated next bill)
- Water footprint dashboard

### WhatsApp-First Chatbot

**Rationale:** WhatsApp has 90%+ adoption in Mexico, making it the most accessible digital channel for citizen engagement -- far surpassing web or app usage for many demographics.

**Platform:** AGORA's existing Maria AI agent extended with AquaCIS 2.0 backend integration

**Capabilities:**
- Account balance and payment status inquiry (natural language)
- Bill delivery via WhatsApp (PDF attachment)
- Payment link generation (Conekta deep link)
- Consumption alerts (proactive push when threshold exceeded)
- Leak notification (proactive push from AMI anomaly detection)
- Service request creation and status tracking
- Outage notifications for affected service areas
- Payment confirmation receipts

### Payment Ecosystem

| Channel | Provider | Coverage | Integration |
|---------|----------|----------|-------------|
| **OXXO** | Conekta | 35-40% of payments | Payment reference generation, barcode scanning |
| **SPEI** | Conekta / direct BANXICO | Bank transfers | CLABE-based references, real-time confirmation |
| **CoDi** | Conekta | QR-code mobile payments | Dynamic QR generation, instant confirmation |
| **Credit/Debit Card** | Conekta | Online/portal payments | PCI-DSS compliant tokenization |
| **Bank direct debit** | Bank partnerships | Auto-pay customers | Domiciliacion bancaria |
| **Kiosk** | Partner (existing infrastructure) | Office walk-ins | Barcode/reference-based payment |

### Digital Identity Verification

| Method | Provider | Use Case |
|--------|----------|----------|
| **INE verification** | INE electronic validation service | Contract onboarding, ownership transfer |
| **CURP lookup** | RENAPO (Registro Nacional de Poblacion) | Identity confirmation, duplicate detection |
| **Facial biometrics** | Azure Face API / third-party | High-value transactions, fraud prevention |
| **e.firma / FIEL** | SAT | CFDI-related operations (business accounts) |

### Engagement Maturity Target

| Dimension | Current (2026) | Target (2028) |
|-----------|:--------------:|:-------------:|
| Digital self-service resolution | ~10% | 70-85% |
| Online payment adoption | ~5% | 35-45% |
| Mobile/PWA active users | 0% | 25-30% of accounts |
| WhatsApp engagement | Partial (Maria AI) | 40-50% of inquiries |
| Proactive alerts (consumption, leaks) | None | 100% of AMI customers |
| Overall engagement maturity | 4/10 | 7.2/10 |

---

## 9. Data Architecture

### Database-per-Service Strategy

Each bounded context owns a private PostgreSQL database. No cross-service joins. Data sharing occurs exclusively through APIs or events.

| Service | Primary Store | Specialized Store | Estimated Tables |
|---------|--------------|-------------------|:----------------:|
| Customer Identity | PostgreSQL (encrypted PII) | -- | 15-20 |
| Contract Management | PostgreSQL | -- | 20-25 |
| Billing Engine | PostgreSQL (event store + projections) | -- | 25-35 |
| Metering & Readings | PostgreSQL (meter registry) | TimescaleDB (time-series) | 15-20 + hypertables |
| Payments & Collections | PostgreSQL | Redis (payment dedup) | 20-25 |
| Work Order Management | PostgreSQL + PostGIS | -- | 15-20 |
| Infrastructure / GIS | PostGIS | GeoServer | 15-20 |
| Fiscal & Compliance | PostgreSQL (append-only) | -- | 10-15 |
| Notifications & Comms | Redis (queues) | PostgreSQL (audit) | 10-15 |
| Analytics & Reporting | Elasticsearch | Data Lake (Parquet) | Materialized views |
| **Total** | | | **~170-230** |

This represents a reduction from 4,114 tables to approximately 170-230 tables -- a 94-96% reduction -- achieved not through compression but through proper domain modeling and elimination of anti-patterns.

### Key Database Modernization Patterns (from C3)

**1. Table consolidation with discriminator columns:**
- 2,144 `tmp_deuda_*` tables --> 1 `tmp_deuda` table with `proceso_id` column
- 477 `aux_varscreditored_*` tables --> 1 `aux_varscreditored` table with `proceso_id` column

**2. Event sourcing replaces history tables:**
- 230 `his*` tables --> Kafka event log with append-only semantics; projections rebuild current state from events. Complete audit trail with temporal query capability.

**3. JSONB for lookup/configuration tables:**
- 65+ `tipo*` tables --> JSONB columns within parent entities or a single `system_config` table with typed JSON documents. PostgreSQL's GIN indexing provides efficient querying.

**4. God table decomposition:**
- 350-column `explotacion` table --> Decomposed across bounded contexts. Each service owns its relevant configuration as typed configuration entities.

### Event Sourcing & CQRS

**Event-sourced domains:** Billing Engine, Metering & Readings

**CQRS pattern for Billing:**

| Side | Responsibility | Technology |
|------|---------------|-----------|
| **Command (Write)** | CreateBillingRun, CalculateCharges, ApplyTariff, GenerateInvoice, ApplyAdjustment | PostgreSQL event store (append-only) |
| **Event Store** | BillingRunStarted, ChargesCalculated, TariffApplied, InvoiceGenerated, AdjustmentApplied | Kafka (log retention) + PostgreSQL (event table) |
| **Query (Read)** | GetInvoice, ListInvoices, GetStatement, GetCFDI, DebtSummary | Optimized read projections (invoice_summary, debt_by_contract, billing_history, payment_status, cfdi_records) |

**Benefits replacing current architecture:**
- 230 `his*` tables replaced by a single unified event log
- Billing disputes resolved by replaying events to prove calculation
- Temporal queries ("What was this customer's tariff on date X?") answered by replaying events to that point
- Corrections stored as new events, preserving original calculation
- CFDI generation becomes an event handler ensuring every invoice gets a fiscal document

### Data Lake & Analytics Architecture

```
Service Databases (PostgreSQL per service)
  --> CDC via Kafka Connect (Debezium)
    --> Kafka Topics (change data capture streams)
      --> Kafka Streams (transformation, enrichment)
        --> Data Lake (Azure Blob + Parquet, partitioned by date/domain)
          --> Analytics Workloads:
              - Elasticsearch (operational analytics, search)
              - Grafana (operational dashboards)
              - CKAN (open data portal -- water quality, service metrics)
              - ML Pipeline (NRW prediction, consumption forecasting)
```

---

## 10. Migration Strategy

### Governing Principle: Strangler Fig

AquaCIS 2.0 is built alongside the existing Aquasis system, not as a replacement. Traffic is incrementally routed from legacy to new services, with rollback capability at every step. The legacy system remains operational until each domain is fully migrated and validated.

### Five Phases over 36 Months

#### Phase 0: Foundation (Months 1-4)

**Objective:** Establish the platform, CI/CD, observability, and API gateway infrastructure.

| Deliverable | Detail |
|------------|--------|
| Azure AKS cluster | Provisioned via Terraform, multi-AZ, dev/staging/prod namespaces |
| API Gateway | Kong or Azure API Management with OAuth 2.0 / OIDC |
| Kafka cluster | Confluent Cloud or Azure Event Hubs for Kafka |
| CI/CD pipeline | GitHub Actions + ArgoCD, GitOps workflow |
| Observability stack | Prometheus, Grafana, Elasticsearch, Jaeger |
| Database modernization (Phase 1 of C3) | Consolidate tmp_deuda_* and aux_* tables (2,600+ tables eliminated) |
| BFF REST layer | Strangler Fig: migrate first 17 SOAP-integrated operations to REST BFF |
| Legacy SOAP bridge | Kafka CDC adapter for Aquasis event capture |

**Staffing:** 4-6 engineers (2 platform/infra, 2-3 backend, 1 frontend)

#### Phase 1: Core Services (Months 5-12)

**Objective:** Launch Customer Identity, Contract Management, and Billing Engine as microservices. The billing engine is the highest-priority service (9/10).

| Deliverable | Detail |
|------------|--------|
| Customer Identity service | Persona/cliente management, INE/CURP verification, LGPDPPP consent |
| Contract Management service | Contract lifecycle, ownership transfer, service point linkage |
| Billing Engine v1 | Event-sourced, CQRS, declarative tariff engine, CFDI 4.0 integration |
| Fiscal & Compliance service | CFDI 4.0 timbrado via PAC, SAT reporting |
| Customer Portal v1 (PWA) | Account dashboard, bill view, online payment (Conekta) |
| Database modernization (Phases 2-6 of C3) | History tables --> event store, JSONB for lookups, explotacion decomposition |
| Full REST API coverage | All 126 SOAP operations available as REST endpoints |

**Key milestone:** First billing cycle runs on AquaCIS 2.0 (parallel run with Aquasis for validation)

#### Phase 2: Operations & Payments (Months 13-20)

**Objective:** Launch remaining transactional services and full payment ecosystem.

| Deliverable | Detail |
|------------|--------|
| Payments & Collections service | Conekta integration (OXXO, SPEI, CoDi, card), reconciliation, dunning |
| Work Order Management service | Field mobile app, geospatial routing, auto-generated orders from events |
| Metering & Readings service | Manual readings migrated, AMI ingestion pipeline ready |
| Notifications & Communications | Multi-channel (email, SMS, WhatsApp, push), template engine |
| Customer Portal v2 (PWA) | Consumption alerts, payment plans, self-reading, multi-contract |
| WhatsApp chatbot (full) | Balance inquiry, bill delivery, payment links, service requests |
| AMI pilot launch | 10,000 smart meters in high-NRW zones |

**Key milestone:** Aquasis SOAP services enter read-only mode (all writes go through AquaCIS 2.0)

#### Phase 3: Smart Infrastructure (Months 21-30)

**Objective:** Scale AMI deployment, launch GIS and analytics platforms, achieve full operational independence from Aquasis.

| Deliverable | Detail |
|------------|--------|
| Infrastructure / GIS service | PostGIS + GeoServer, network topology, DMA management |
| Analytics & Reporting service | Operational dashboards, regulatory reports, NRW analytics |
| AMI Phase 1 rollout | 50,000 smart meters (urban core, commercial/industrial) |
| Leak detection ML pipeline | Trained on pilot data, automated work order generation |
| Data lake | Historical data migrated from Aquasis, Parquet partitioned by domain/date |
| CKAN open data portal | Public water quality and service metrics |
| Aquasis decommissioning | Legacy system fully deprecated; all traffic on AquaCIS 2.0 |

**Key milestone:** Aquasis decommissioned. AquaCIS 2.0 is the sole system of record.

#### Phase 4: Optimization & Scale (Months 31-36)

**Objective:** Performance optimization, advanced analytics, and preparation for long-term AMI scale-up.

| Deliverable | Detail |
|------------|--------|
| Advanced tariff simulation | "What-if" analysis for proposed rate changes across customer base |
| Predictive billing | AI-estimated next bill based on consumption patterns |
| Prepaid metering pilot | Event-driven prepaid model for select customer segment |
| Customer Portal v3 | Real-time AMI consumption, budget billing, conservation recommendations |
| Performance optimization | Database tuning, cache warming strategies, CDN for static assets |
| AMI Phase 2 launch | 150,000 meters (suburban expansion) |
| Knowledge transfer | Full documentation, runbooks, training for CEA operations team |

**Key milestone:** Platform stable, team self-sufficient, AMI expanding on schedule.

*Note: AMI Phases 3-4 (100,000 + 90,000 meters) continue through months 37-72 as a separate operational program, managed by the smart metering team.*

---

## 11. Build vs Buy Decisions

| Component | Decision | Rationale |
|-----------|:--------:|-----------|
| **CIS Core (meter-to-cash)** | BUILD | No single platform (commercial or OSS) covers Mexican water utility requirements. AquaCIS has deep domain knowledge that would take 12-18 months to replicate in a commercial platform. Open Smartflex is the closest LATAM fit but still requires heavy customization. Market maturity only 6.5/10. Build with hybrid open-source components. |
| **Billing / Tariff Engine** | BUILD | Mexican water tariff complexity (tiered blocks, seasonal, social rates, fixed/sewer charges, IVA) is unique. Commercial billing platforms (Zuora, Chargebee) are SaaS-oriented. Kill Bill (OSS) viable as inspiration but requires substantial wrapping for water domain. Custom engine with declarative DSL is optimal. |
| **CFDI 4.0 Integration** | BUILD + BUY (PAC) | Custom CFDI generation logic + contracted PAC (Proveedor Autorizado de Certificacion) for timbrado/stamping. PAC is mandatory by SAT. |
| **Payment Processing** | BUY (Conekta) | Conekta provides unified access to OXXO, SPEI, CoDi, and card payments with a single integration. No reason to build payment rails. |
| **IoT Platform** | BUY (ThingsBoard PE) | ThingsBoard Professional Edition provides device management, rule engine, dashboards, and firmware OTA. Mature, cost-effective, active community. |
| **LoRaWAN Network Server** | ADOPT (ChirpStack OSS) | Open-source, no per-device licensing, full LoRaWAN spec support. Production-proven at scale. |
| **Workflow Engine** | ADOPT (Camunda 8) | BPMN 2.0 standard, visual process modeling, human task management. Saga orchestration for billing runs. Mature ecosystem. |
| **GIS Platform** | ADOPT (PostGIS + GeoServer OSS) | Industry-standard spatial stack. PostGIS is the de facto geospatial database. GeoServer provides OGC-compliant services. |
| **Hydraulic Modeling** | ADOPT (EPANET / WNTR OSS) | EPA-developed, industry standard for network simulation. WNTR (Python) provides programmable analysis. |
| **Open Data Portal** | ADOPT (CKAN OSS) | Government transparency requirement. CKAN is the global standard for open data portals. |
| **Smart Meters** | BUY (Kamstrup) | Hardware procurement; Kamstrup flowIQ 2200 offers best balance of accuracy, battery life, LoRaWAN support, and LATAM presence. |
| **LoRaWAN Gateways** | BUY (Kerlink/Multitech) | Industrial-grade hardware, outdoor IP67, solar-compatible. |
| **Customer Portal** | BUILD (Vue 3 PWA) | Extends existing AGORA Vue 3 investment. Customer-facing UX must be tailored to CEA Queretaro's citizen demographics. |
| **WhatsApp Chatbot** | BUILD (extend AGORA Maria AI) | Extends existing Maria AI agent with AquaCIS 2.0 backend integration. 90%+ WhatsApp adoption in Mexico makes this a primary channel. |
| **API Gateway** | BUY (Kong / Azure API Mgmt) | Commodity infrastructure; no competitive advantage in building custom. |
| **Observability** | ADOPT (Prometheus + Grafana OSS) | Industry standard, rich ecosystem, zero licensing cost. |

---

## 12. Cost Estimates

### Monthly Cloud Infrastructure (Steady State)

| Resource | Specification | Monthly Cost (USD) |
|----------|--------------|-------------------:|
| AKS Cluster (3 nodes prod, 2 staging) | D4s_v3 (4 vCPU, 16GB) | $800-1,000 |
| PostgreSQL (5 managed instances) | 4 vCPU, 32GB, 500GB each | $1,200-1,500 |
| TimescaleDB | 4 vCPU, 32GB, 1TB (time-series) | $400-500 |
| Redis | 6GB, HA | $200-300 |
| Kafka (Event Hubs for Kafka) | Standard tier, 10 TU | $300-500 |
| Azure Blob Storage | 5TB data lake | $100-150 |
| Elasticsearch | 3-node cluster | $300-500 |
| Networking (Load Balancer, VPN, DNS) | -- | $200-300 |
| Monitoring & Logging | Azure Monitor, Log Analytics | $100-200 |
| **Monthly Total** | | **$3,600-4,950** |

This aligns with the C4 research estimate of $3,500-5,000/month.

### Development Investment (36-Month Program)

| Phase | Duration | Team Size | Estimated Cost (USD) |
|-------|----------|:---------:|---------------------:|
| Phase 0: Foundation | 4 months | 4-6 engineers | $200,000-300,000 |
| Phase 1: Core Services | 8 months | 8-12 engineers | $500,000-750,000 |
| Phase 2: Operations & Payments | 8 months | 8-12 engineers | $500,000-750,000 |
| Phase 3: Smart Infrastructure | 10 months | 6-10 engineers | $400,000-600,000 |
| Phase 4: Optimization | 6 months | 4-6 engineers | $200,000-300,000 |
| **Software Development Total** | **36 months** | | **$1,800,000-2,700,000** |

### Smart Metering Infrastructure (72-Month Program)

| Component | Cost (USD) |
|-----------|----------:|
| LoRaWAN gateway infrastructure (100 gateways + installation) | $400,000 |
| Smart meters (400,000 x $180 avg) | $72,000,000 |
| Installation labor (400,000 x ~$15) | $6,000,000 |
| IoT platform licensing (ThingsBoard PE) | $500,000 (over 6 years) |
| Network operations (6 years) | $1,500,000 |
| **Smart Metering Total** | **~$80,400,000** |

*Note: The C7 research estimates $70M for the AMI program. The variance accounts for installation labor and multi-year platform licensing.*

### Total Program Cost Summary

| Category | Cost (USD) | Period |
|----------|----------:|--------|
| Cloud infrastructure | $170,000-215,000 | 36 months |
| Software development | $1,800,000-2,700,000 | 36 months |
| ThingsBoard PE licensing | $50,000-80,000 | 36 months |
| Conekta / PAC transaction fees | Variable (per-transaction) | Ongoing |
| **Software Platform Total** | **$2,020,000-2,995,000** | **36 months** |
| Smart metering infrastructure | ~$80,400,000 | 72 months |
| **Grand Total** | **~$82,400,000-83,400,000** | **72 months** |

### ROI Projection

| Value Driver | Annual Value (USD) | Timeline |
|-------------|-------------------:|----------|
| NRW reduction (40% to 18%) | $10,000,000-12,000,000 | Starting year 3 (at scale) |
| Billing accuracy improvement | $2,000,000-3,000,000 | Starting year 2 |
| Collection rate improvement | $1,500,000-2,500,000 | Starting year 2 |
| Operational efficiency (staff reallocation) | $500,000-800,000 | Starting year 2 |
| Reduced vendor dependency | $300,000-500,000 | Starting year 1 |
| **Annual value at maturity** | **$14,300,000-18,800,000** | **Year 4+** |
| **Payback period (including AMI)** | **5-6 years** | |
| **10-year net value** | **$60,000,000-100,000,000** | |

---

## 13. Success Metrics

### Transformation KPIs

| Category | Metric | Baseline (2026) | Year 1 Target | Year 3 Target |
|----------|--------|:---------------:|:--------------:|:--------------:|
| **Technical** | Database table count | 4,114 | 2,500 (Phase 0 cleanup) | ~230 |
| **Technical** | API integration coverage | 13.5% (17/126) | 100% REST | 100% REST + GraphQL |
| **Technical** | Cloud readiness score | 4.2/10 | 6.5/10 | 8.5/10 |
| **Technical** | Deployment frequency | Monthly (manual) | Weekly (automated) | Daily (GitOps) |
| **Technical** | Mean time to recovery (MTTR) | Hours | < 30 minutes | < 5 minutes |
| **Revenue** | Non-revenue water | 35-45% | 35% (pilot only) | 22-25% |
| **Revenue** | Billing accuracy | ~80% | 90% | 98%+ |
| **Revenue** | Collection rate | Baseline TBD | +5% | +15% |
| **Customer** | Digital self-service resolution | ~10% | 40% | 70-85% |
| **Customer** | Online payment adoption | ~5% | 20% | 35-45% |
| **Customer** | Engagement maturity score | 4/10 | 5.5/10 | 7.2/10 |
| **Customer** | Customer satisfaction (CSAT) | Baseline TBD | +10% | +25% |
| **Operational** | Meter reading cost per unit | Manual baseline | -30% (AMI zones) | -70% |
| **Operational** | Work order automation | 0% | 15% (auto-generated) | 40% |
| **Compliance** | CFDI 4.0 coverage | Partial | 100% | 100% |
| **Compliance** | LGPDPPP compliance | None | Full consent management | Full + audit |

### Smart Metering KPIs (72-Month Program)

| Metric | Pilot (12mo) | Phase 1 (30mo) | Full (72mo) |
|--------|:------------:|:--------------:|:-----------:|
| Meters deployed | 10,000 | 60,000 | 400,000 |
| AMI data availability | 95% | 97% | 99% |
| NRW rate | 38% | 30% | 18% |
| Leak detection mean time | 48 hrs | 12 hrs | 2 hrs |
| Customer-side leak alerts | Pilot | 60,000 homes | All AMI customers |
| Billing from AMI reads | 10,000 | 60,000 | 400,000 |

---

## 14. Risk Assessment

### Major Risks and Mitigations

| # | Risk | Probability | Impact | Mitigation |
|:-:|------|:----------:|:------:|-----------|
| 1 | **Vendor lock-in with Aquasis** -- Agbar/OCCAM may restrict data access or API usage during migration. Legacy SOAP services are vendor-controlled. | HIGH | HIGH | Strangler Fig pattern allows coexistence. Build CDC bridge to capture events from Aquasis database. Negotiate data portability clauses. Do NOT modify Aquasis -- build around it. |
| 2 | **Billing engine accuracy during parallel run** -- New tariff engine must produce identical results to legacy for every contract during validation. Any discrepancy in a single invoice undermines trust. | MEDIUM | CRITICAL | Shadow billing: run both engines in parallel for 3+ billing cycles. Automated reconciliation comparing every line item. Mathematical proof testing of tariff engine against historical data. |
| 3 | **Smart meter deployment delays** -- Physical infrastructure deployment (400K meters, 100 gateways) is subject to supply chain, permitting, and field logistics. | HIGH | MEDIUM | Phased rollout starting with high-value zones. Dual-vendor meter strategy (Kamstrup primary, Badger Meter backup). Gateway infrastructure deployed ahead of meter installation. |
| 4 | **Team capacity and skill gaps** -- Cloud-native, event-driven architecture requires skills (Go, Kafka, Kubernetes, event sourcing) that may not exist in the current team. | HIGH | HIGH | Invest in training from Phase 0. Engage experienced cloud-native consulting partner for first 12 months. Knowledge transfer as explicit deliverable. Hire 2-3 senior engineers with Kafka/K8s experience. |
| 5 | **Data migration integrity** -- Migrating from 4,114-table monolith with no FK constraints and inconsistent data types to a clean domain model risks data loss or corruption. | MEDIUM | HIGH | 13-phase migration plan (C3 report). Each phase has automated validation. Rollback capability at every step. Production data never deleted until new system validates 100% of records. |
| 6 | **Mexican regulatory changes** -- CFDI 4.0 rules, SAT reporting requirements, CONAGUA regulations, and water tariff structures change frequently. | MEDIUM | MEDIUM | Fiscal & Compliance service is isolated, event-driven, and configurable. Tariff engine uses declarative DSL, not hardcoded logic. Rule changes are catalog updates, not code changes. |
| 7 | **OXXO/payment ecosystem integration** -- Conekta dependency for payment processing. Payment reconciliation across multiple channels is complex. | LOW | MEDIUM | Conekta is the leading PSP in Mexico with proven OXXO integration. Payment service uses adapter pattern -- PSP can be swapped without changing business logic. |
| 8 | **LoRaWAN coverage gaps** -- Queretaro's terrain may create RF shadow zones. Meter pit installations may attenuate signal. | MEDIUM | LOW | Hybrid strategy (LoRaWAN + NB-IoT + Cellular). Pilot phase specifically tests coverage in challenging locations. External antenna options for deep-pit meters. Gateway density can be increased incrementally. |
| 9 | **Organizational resistance** -- Staff accustomed to legacy processes may resist new workflows. Union considerations for meter readers displaced by AMI. | MEDIUM | MEDIUM | Change management program from Phase 0. Meter readers retrained as field technicians (AMI installation, maintenance). Early wins (customer portal, WhatsApp bot) build momentum. |
| 10 | **Cost overrun on AMI program** -- $70-80M capital program over 72 months has significant financial risk. | MEDIUM | HIGH | Phased investment with gate reviews after each phase. Pilot ROI must be validated before Phase 1 commitment. Meter procurement in annual batches to leverage volume pricing and technology improvements. |

### Risk Heat Map Summary

| | Low Impact | Medium Impact | High Impact | Critical Impact |
|---|:-:|:-:|:-:|:-:|
| **High Probability** | | R3 (meters) | R1 (vendor), R4 (skills) | |
| **Medium Probability** | R8 (LoRaWAN) | R6 (regulatory), R9 (change) | R5 (data), R10 (cost) | R2 (billing accuracy) |
| **Low Probability** | | R7 (payments) | | |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **AMI** | Advanced Metering Infrastructure -- two-way communication between meters and utility |
| **BFF** | Backend for Frontend -- API layer tailored to specific client needs |
| **CFDI** | Comprobante Fiscal Digital por Internet -- Mexican electronic invoice standard |
| **CIS** | Customer Information System |
| **CQRS** | Command Query Responsibility Segregation |
| **CURP** | Clave Unica de Registro de Poblacion -- Mexican national ID number |
| **DDD** | Domain-Driven Design |
| **DMA** | District Metered Area -- hydraulically isolated zone for water loss monitoring |
| **INE** | Instituto Nacional Electoral -- Mexican voter ID (de facto national ID) |
| **LGPDPPP** | Ley General de Proteccion de Datos Personales en Posesion de Particulares -- Mexico's data protection law |
| **LoRaWAN** | Long Range Wide Area Network -- LPWAN protocol for IoT |
| **NRW** | Non-Revenue Water -- water produced but not billed (losses + unbilled use) |
| **PAC** | Proveedor Autorizado de Certificacion -- authorized CFDI stamping provider |
| **PSP** | Payment Service Provider |
| **PWA** | Progressive Web Application |
| **SAT** | Servicio de Administracion Tributaria -- Mexico's tax authority |
| **SPEI** | Sistema de Pagos Electronicos Interbancarios -- Mexico's real-time interbank transfer system |

---

## Appendix B: Reference Documents

| Document | Description |
|----------|-----------|
| C1: Modern CIS Platforms | Competitive landscape analysis (SAP, Oracle, Open Smartflex, Gentrack, etc.) |
| C2: API Modernization Strategy | Strangler Fig migration, BFF design, 26-week playbook |
| C3: Database Modernization | 13-phase schema reduction plan (4,114 to ~230 tables) |
| C4: Cloud-Native Architecture | Domain decomposition, event-driven patterns, Kubernetes design |
| C5: Billing Systems | Tariff engine, CFDI 4.0, payment ecosystem, revenue assurance |
| C6: Customer Portal | PWA design, WhatsApp chatbot, INE/CURP, engagement maturity |
| C7: IoT & Smart Metering | LoRaWAN AMI, Kamstrup meters, leak detection, 72-month rollout |
| C8: Open-Source Water Solutions | Component-based OSS architecture, viability assessment |

---

*This blueprint was synthesized from the findings of 24 research agents across 3 divisions. It represents the strategic technical vision for CEA Queretaro's next-generation water utility platform. Implementation details, sprint-level planning, and vendor negotiations should reference the individual division reports for depth.*

**Document version:** 1.0
**Next review:** Upon completion of Phase 0 (Month 4)
