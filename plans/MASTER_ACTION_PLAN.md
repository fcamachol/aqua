# SUPRA Water 2026 -- Master Action Plan

**Version:** 1.0
**Date:** 2026-02-16
**Status:** AUTHORITATIVE -- Single source of truth for project execution
**Program:** SUPRA Water 2026 -- AI-First CIS Replacement for CEA Queretaro

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Revised Phase Timeline](#2-revised-phase-timeline)
3. [Team Composition & Allocation](#3-team-composition--allocation)
4. [Quarter-by-Quarter Execution Plan](#4-quarter-by-quarter-execution-plan)
5. [Critical Path Analysis](#5-critical-path-analysis)
6. [Risk Register](#6-risk-register)
7. [Budget Allocation](#7-budget-allocation)
8. [Vendor Selection & Procurement Timeline](#8-vendor-selection--procurement-timeline)
9. [Milestone Definitions](#9-milestone-definitions)
10. [Success Metrics Dashboard](#10-success-metrics-dashboard)
11. [Stakeholder Communication Plan](#11-stakeholder-communication-plan)
12. [References](#12-references)

---

## 1. Executive Summary

### 1.1 Vision Statement

SUPRA Water 2026 replaces CEA Queretaro's 17-year-old AquaCIS monolith (4,114 PostgreSQL tables, 5 SOAP services, 13.5% API integration) with a next-generation, AI-first Customer Information System. The new system treats AI agents as primary actors -- not bolt-on features -- enabling autonomous billing, customer service via WhatsApp and Voice AI, predictive collections, and fraud detection. The platform is designed multi-tenant from day one, targeting CEA Queretaro as the first deployment with replication capability for other Mexican water utilities (JMAPA, JAPAC).

### 1.2 Key Strategic Decisions

| Decision | Rationale |
|----------|-----------|
| **Agent-first architecture** | 8 Claude-powered AI agents are the primary system actors, not traditional CRUD UIs. Agents handle voice calls, WhatsApp queries, billing, anomaly detection, collections, field work, fraud, and compliance. Admin UI exists only for configuration and supervision. |
| **JSONB-heavy schema (~50-80 tables)** | Replaces the legacy 4,114-table monolith and the AquaCIS 2.0 target of ~230 tables. Tariff blocks, audit events, step histories, inspection data, materials, photos, and configuration all use JSONB columns, dramatically reducing join complexity. |
| **pg LISTEN/NOTIFY + BullMQ** | Replaces Kafka as the event backbone. At CEA Queretaro's scale (~400K accounts), PostgreSQL-native event signaling + Redis-backed task queues are sufficient. Kafka can be added later if throughput demands it. |
| **n8n over Camunda** | Visual workflow orchestration with faster setup. Most CIS workflows are sequential event chains, not complex BPMN processes. Covers 80% of use cases at 20% of Camunda's complexity. |
| **Multi-tenant RLS from day one** | Every table has `tenant_id`, every query filters by tenant. Row Level Security policies enforce isolation. CEA Queretaro is tenant #1, not a special case. |
| **domain_events hypertable** | Single TimescaleDB hypertable replaces both the legacy 230 `his*` tables and the proposed `audit_log`. Serves as audit trail, event sourcing store, and event-driven architecture backbone. |
| **Azure Mexico Central** | Data residency in Mexico for citizen PII (LFPDPPP compliance). GCP has no Mexico data center. Azure AKS with Mexico Central region is the production target. |
| **Strangler Fig migration** | Build new system alongside legacy, intercept flows via API gateway, sync bidirectionally, cut over module by module. Legacy DB cleanup runs in parallel -- not as a prerequisite. |
| **Node.js/TypeScript monorepo** | Single language (TypeScript) for both backend and frontend reduces skill requirements vs. Go + TypeScript. Drizzle ORM provides type-safe, SQL-first database access. |
| **Mexican-native compliance** | CFDI 4.0, SAT catalog codes, Finkok PAC, LFPDPPP/ARCO, CONAGUA reporting -- all foundational, not afterthoughts. |

### 1.3 Total Effort Estimate

| Dimension | Estimate |
|-----------|----------|
| **Duration** | 24 months (Q1 2026 -- Q4 2027) |
| **Peak team size** | 16-18 FTEs |
| **Average team size** | 12-14 FTEs |
| **Development cost (internal + contract)** | $2.0 -- 3.2M USD |
| **Cloud infrastructure (24 months)** | $84K -- 144K USD ($3,500 -- 6,000/month) |
| **Third-party services (24 months)** | $60K -- 120K USD (PAC, payments, WhatsApp, Voice, AI API) |
| **Software licenses** | $24K -- 48K USD (n8n, monitoring, security tools) |
| **Smart meter pilot (10K units)** | $1.8M USD (separate budget line, Phase 4) |
| **Total program cost (excluding smart meters)** | $2.2 -- 3.5M USD |
| **Total program cost (including pilot)** | $4.0 -- 5.3M USD |

---

## 2. Revised Phase Timeline

### 2.1 Timeline Reconciliation

The original AquaCIS 2.0 plan spans 36 months across 10 sequential-to-parallel phases. SUPRA defines 4 quarterly phases over 24 months. This master plan reconciles both into a **24-month execution timeline with 8 quarters**, organized into 4 parallel workstreams.

### 2.2 The Four Workstreams

```
WORKSTREAM A: Data Platform          (Months 1-12) -- DB schema, migration, event store
WORKSTREAM B: Core Services & APIs   (Months 1-18) -- Domain services, integrations, billing
WORKSTREAM C: AI Agents & Channels   (Months 3-21) -- Agent framework, WhatsApp, Voice, ML
WORKSTREAM D: Infrastructure & Ops   (Months 1-24) -- DevOps, security, QA, monitoring

Timeline:
Month:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
        |------ Q1 2026 ------|------ Q2 2026 ------|------ Q3 2026 ------|-- Q4 2026 --|
        |--------- Q1 2027 ---------|------ Q2 2027 ---|---- Q3 2027 ---|--- Q4 2027 ---|

WS-A:   [=== Schema + Seed ===][=== Migration Sync ==][= Cutover =]
WS-B:   [== Scaffolding ==][=== Core CRUD ==][=== Billing + CFDI ===][== Advanced ==][Ops]
WS-C:              [= Agent FW =][= WhatsApp + Voice =][== ML Agents ==][= Intelligence =]
WS-D:   [== CI/CD + Docker ==][=== Azure Setup ===][=== Monitoring ===][=== Hardening ===]

Legacy:  [============ Legacy System Running in Parallel ==================][= Retire =]
```

### 2.3 Quarterly Milestone Summary

| Quarter | Key Deliverable | Citizen-Facing? |
|---------|----------------|-----------------|
| **Q1 2026** | Foundation: scaffolding, schema, CI/CD, core CRUD APIs | No |
| **Q2 2026** | Quick Wins: billing engine, CFDI 4.0, WhatsApp bot, basic payments | **Yes -- WhatsApp + billing** |
| **Q3 2026** | Core Agents: voice AI, anomaly detection, field workforce, self-service | **Yes -- Voice + self-service** |
| **Q4 2026** | Business Intelligence: collections intelligence, fraud detection, analytics | Partially |
| **Q1 2027** | Full Platform: regulatory compliance, digital twin, consumption forecast | Yes |
| **Q2 2027** | Migration Completion: legacy cutover, data validation, staff training | Internal focus |
| **Q3 2027** | Smart Meters: pilot deployment, IoT pipeline, NRW analytics | Yes |
| **Q4 2027** | Full Autonomy: legacy retirement, multi-tenant marketplace, optimization | Yes |

### 2.4 Key Timeline Decisions

1. **Parallel construction**: Legacy DB cleanup runs concurrently with new system construction, not sequentially. The Strangler Fig pattern applies to the database layer.
2. **Citizen value in Month 6**: WhatsApp bot and digital billing/CFDI launch by end of Q2 2026, delivering immediate citizen-facing value.
3. **Voice AI in Month 9**: Twilio-powered Voice AI agent launches in Q3 2026, providing a major differentiator for elderly/non-digital customers.
4. **Legacy retirement in Month 22-24**: Complete decommission only after all modules are migrated and validated.

---

## 3. Team Composition & Allocation

### 3.1 Full Team Roster

| Role | Count | Seniority | Key Responsibilities |
|------|-------|-----------|---------------------|
| **Project Manager / Scrum Master** | 1 | Senior | Overall coordination, stakeholder management, risk management |
| **Product Owner** | 1 | Senior | Requirements, backlog prioritization, UAT coordination |
| **Database Architect** | 1 | Senior | Schema design, migration strategy, performance optimization, TimescaleDB |
| **Backend Developer (Node.js/TS)** | 3-4 | Mid-Senior | Domain services, API development, Drizzle ORM, event bus |
| **Frontend Developer (React)** | 1-2 | Mid | Admin dashboard, React/Next.js UI, component library |
| **AI/ML Engineer** | 2 | Senior | Agent framework, Claude integration, ML models (anomaly, fraud, collections) |
| **DevOps / Cloud Engineer** | 1-2 | Senior | Azure AKS, CI/CD, Docker, Traefik, monitoring, n8n deployment |
| **Integration Specialist** | 1 | Mid-Senior | Finkok PAC, Conekta, Twilio, 360dialog/Meta, SPEI, bank APIs |
| **QA / Test Engineer** | 1-2 | Mid | Test automation, performance testing, regulatory compliance testing |
| **UX/UI Designer** | 1 | Mid | Admin UI design, WhatsApp flow design, accessibility |
| **Security Architect** | 1 | Senior (part-time Q1-Q2, full-time Q3+) | LFPDPPP compliance, ARCO, penetration testing, RLS audit |
| **Regulatory / Domain Expert** | 1 | Domain (part-time) | SAT/CFDI rules, CONAGUA reporting, tariff structures, CEA business rules |

**Total: 16-18 FTEs at peak (Q3-Q4 2026)**

### 3.2 FTE Allocation Per Quarter

| Role | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 | Q1 2027 | Q2 2027 | Q3 2027 | Q4 2027 |
|------|---------|---------|---------|---------|---------|---------|---------|---------|
| PM / Scrum Master | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 0.5 |
| Product Owner | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 0.5 |
| DB Architect | 1.0 | 1.0 | 0.5 | 0.5 | 0.5 | 1.0 | 0.5 | 0.25 |
| Backend Devs | 2.0 | 3.0 | 4.0 | 4.0 | 3.0 | 3.0 | 2.0 | 2.0 |
| Frontend Devs | 0.5 | 1.0 | 1.5 | 2.0 | 1.5 | 1.0 | 1.0 | 0.5 |
| AI/ML Engineers | 0.5 | 1.0 | 2.0 | 2.0 | 2.0 | 1.0 | 1.0 | 1.0 |
| DevOps | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 1.0 | 0.5 |
| Integration Specialist | 0.5 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 0.5 | 0.25 |
| QA Engineers | 0.5 | 1.0 | 1.5 | 2.0 | 2.0 | 2.0 | 1.5 | 1.0 |
| UX/UI Designer | 1.0 | 1.0 | 1.0 | 0.5 | 0.5 | 0.5 | 0.25 | 0.25 |
| Security Architect | 0.25 | 0.5 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 0.5 |
| Regulatory Expert | 0.25 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.25 | 0.25 |
| **Total FTEs** | **10.0** | **13.0** | **16.0** | **16.5** | **15.0** | **14.0** | **9.5** | **7.5** |

### 3.3 Hiring Timeline

| Month | Action |
|-------|--------|
| Month 0 (pre-launch) | PM, Product Owner, DB Architect, 2 Backend Devs, 1 DevOps, UX Designer -- **core founding team (7)** |
| Month 1 | +1 AI/ML Engineer (agent framework), +1 Integration Specialist (vendor setup) |
| Month 2 | +1 Backend Dev, +1 QA Engineer |
| Month 3 | +1 AI/ML Engineer (full-time), +1 Frontend Dev, Security Architect (ramp to 0.5) |
| Month 4 | +1 Backend Dev (peak team), +0.5 QA |
| Month 6 | Regulatory Expert engaged (part-time consultant) |
| Month 12 | Begin team ramp-down planning |
| Month 18 | Transition 2 backend devs to maintenance/ops roles |
| Month 24 | Steady-state team: 5-6 FTEs (PM, 2 backend, 1 DevOps, 1 QA, 0.5 AI) |

### 3.4 External Vendor Needs

| Vendor | Service | Engagement Type | Duration |
|--------|---------|----------------|----------|
| **Finkok** | CFDI 4.0 PAC stamping | API subscription + sandbox | Month 3 -- ongoing |
| **Conekta** | Payment processing (OXXO, SPEI, cards) | Merchant account + API | Month 4 -- ongoing |
| **Twilio** | Voice AI, SMS | API subscription + MX phone numbers | Month 5 -- ongoing |
| **360dialog / Meta** | WhatsApp Business API | Business verification + API | Month 3 -- ongoing |
| **Microsoft Azure** | Cloud infrastructure (Mexico Central) | Enterprise subscription | Month 1 -- ongoing |
| **Anthropic** | Claude API for AI agents | API subscription | Month 3 -- ongoing |
| **OpenAI** | Embeddings for pgvector semantic search | API subscription | Month 6 -- ongoing |
| **n8n** | Workflow orchestration | Self-hosted (open source) or Cloud license | Month 2 -- ongoing |
| **Sentry** | Error tracking | SaaS subscription | Month 1 -- ongoing |
| **SendGrid / AWS SES** | Transactional email | API subscription | Month 4 -- ongoing |

---

## 4. Quarter-by-Quarter Execution Plan

### Q1 2026 (Months 1-3): Foundation

**Theme:** Build the platform skeleton. Every architectural decision is locked in. No citizen-facing features yet.

#### Objectives
- Project scaffolding: Express + Drizzle + PostgreSQL + Docker Compose monorepo
- Complete database schema creation (~50-80 tables with JSONB patterns)
- Multi-tenant auth system (JWT + RLS policies)
- Core CRUD APIs: persons, addresses, tomas, contracts, meters
- CI/CD pipeline: GitHub Actions, Docker builds, automated tests
- Azure subscription setup, Mexico Central resource provisioning
- Design system and component library for admin UI
- Agent architecture pattern definition (SUPRAAgent interface)
- Legacy DB analysis completion and bidirectional sync design

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-A: Data Platform** | DB Architect + 1 Backend | Schema DDL, Drizzle models, seed data, TimescaleDB setup, RLS policies |
| **WS-B: Core Services** | 2 Backend Devs | Express scaffolding, auth middleware, persons CRUD, tomas CRUD, contracts CRUD |
| **WS-C: AI Agents** | 0.5 AI Engineer | Agent interface pattern, Claude API integration wrapper, tool calling framework |
| **WS-D: Infrastructure** | DevOps | Docker Compose local dev, GitHub Actions CI, Azure subscription, Traefik config |
| **UX/Design** | UX Designer | Design system, admin dashboard wireframes, WhatsApp conversation flows |

#### Sprint Breakdown (2-week sprints)

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S1 | Wk 1-2 | Monorepo scaffolding, Docker Compose, PostgreSQL + TimescaleDB + Redis containers, CI pipeline shell |
| S2 | Wk 3-4 | Schema DDL (core + infrastructure tables), Drizzle ORM setup, tenants + users + auth (JWT + RLS) |
| S3 | Wk 5-6 | Persons CRUD + addresses + search (gin_trgm), tomas CRUD, contracts CRUD, GitHub Actions CI green |
| S4 | Wk 7-8 | Meters CRUD, readings ingestion (TimescaleDB), domain_events hypertable, agent framework v0.1 |
| S5 | Wk 9-10 | Integration tests, Azure sandbox provisioned, admin dashboard skeleton (React), design system v1 |
| S6 | Wk 11-12 | API documentation (OpenAPI), performance baseline, legacy DB sync design doc, security review |

#### Dependencies
- Azure subscription approval required before Month 2
- Drizzle schema must be complete before core CRUD development (S2 blocks S3)
- Agent framework design influences backend service structure

#### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Schema design takes longer than expected | Medium | High | Start with SUPRA reference schema, iterate |
| Azure Mexico Central resource availability | Low | High | Pre-provision in Month 1, have fallback region |
| Team onboarding delays | Medium | Medium | Start with 7-person core team, add incrementally |

#### Go/No-Go Gate (End of Q1)
- [ ] PostgreSQL schema deployed and tested with seed data
- [ ] All core CRUD APIs functional with integration tests
- [ ] CI/CD pipeline green (build, lint, test, Docker image)
- [ ] Azure sandbox environment accessible
- [ ] Multi-tenant RLS verified with 2 test tenants
- [ ] Design system documented and component library started

---

### Q2 2026 (Months 4-6): Quick Wins -- First Citizen-Facing Value

**Theme:** Deliver billing engine, CFDI 4.0, WhatsApp bot, and basic payment processing. Citizens interact with the new system for the first time.

#### Objectives
- Billing engine: meter reading triggers invoice generation (event-driven, not batch)
- CFDI 4.0 integration with Finkok PAC (stamping, cancellation, complemento de pago)
- WhatsApp Business API integration (360dialog/Meta) with 5 pre-approved templates
- Payment processing: SPEI, OXXO (Conekta), card payments
- Tariff schedule management with JSONB blocks
- Invoice PDF generation (Puppeteer + Handlebars)
- Basic admin dashboard: account lookup, invoice history, payment tracking
- Legacy bidirectional sync: first domain (persons + contracts) syncing between old and new DB
- pg LISTEN/NOTIFY + BullMQ event bus operational

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-A: Data Platform** | DB Architect + 1 Backend | Billing tables, tariff_schedules with JSONB blocks, bidirectional sync (persons domain) |
| **WS-B: Core Services** | 3 Backend Devs | Billing engine, invoice generation, CFDI service, payment processing, tariff calculator |
| **WS-C: AI Agents** | 1 AI Engineer | WhatsApp CX agent v1 (account inquiry, balance check, invoice delivery) |
| **WS-D: Infrastructure** | DevOps | Azure staging environment, BullMQ queues, Traefik routing, S3 for documents |
| **Integrations** | Integration Specialist | Finkok sandbox + production, Conekta merchant account, 360dialog WhatsApp setup |

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S7 | Wk 13-14 | Tariff_schedules table + JSONB blocks, tariff calculation engine, IVA rules (domestic exempt, commercial 16%) |
| S8 | Wk 15-16 | Invoice generation pipeline (reading -> invoice -> lines), invoice_lines with SAT catalog codes |
| S9 | Wk 17-18 | Finkok PAC integration (sandbox), CFDI 4.0 stamping, XML generation, PDF invoice template |
| S10 | Wk 19-20 | Conekta integration (OXXO barcode, SPEI CLABE, card), payment recording + reconciliation |
| S11 | Wk 21-22 | WhatsApp Business API (360dialog), 5 templates submitted for Meta approval, WhatsApp CX agent v1 |
| S12 | Wk 23-24 | Admin dashboard (account search, invoice view, payment view), legacy sync v1, UAT preparation |

#### Dependencies
- Finkok sandbox access required by S9 (Month 5) -- apply in Month 3
- Conekta merchant account approval takes 2-4 weeks -- apply in Month 3
- WhatsApp Business API verification by Meta takes 1-4 weeks -- apply in Month 4
- SAT catalog codes (10171500, 72151802, 72151801) must be confirmed with CEA fiscal team
- Tariff structure data must be extracted from legacy system

#### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Finkok PAC sandbox delays | Medium | High | Start integration early; have Facturapi as fallback PAC |
| WhatsApp template rejection by Meta | Medium | Medium | Submit simple templates first; iterate |
| Tariff complexity underestimated | Medium | High | Start with domestic tariff only; add commercial/industrial in S10 |
| Legacy sync data quality issues | High | Medium | Implement data quality checks and quarantine for bad records |

#### Go/No-Go Gate (End of Q2)
- [ ] Billing engine generates correct invoices for domestic tariff (verified against legacy calculations)
- [ ] CFDI 4.0 stamps successfully in Finkok sandbox
- [ ] At least 3 WhatsApp templates approved by Meta
- [ ] OXXO + SPEI payments processed successfully in Conekta sandbox
- [ ] Admin dashboard displays accounts, invoices, and payments
- [ ] Legacy sync running for persons domain without data loss
- [ ] Event bus (pg LISTEN/NOTIFY + BullMQ) processing events reliably

---

### Q3 2026 (Months 7-9): Core Agents -- Voice AI & Self-Service

**Theme:** Launch Voice AI, expand WhatsApp capabilities, deploy anomaly detection and field workforce agents. The system becomes intelligent.

#### Objectives
- Voice AI agent (Twilio Programmable Voice + Claude) handling inbound calls in Mexican Spanish
- WhatsApp CX agent v2: complaint submission, payment plan self-service, leak reporting
- Anomaly detection agent: statistical + ML analysis on meter readings
- Field workforce agent: auto-assignment, route optimization, mobile work orders
- Contract lifecycle digitization: alta, baja, cambio de titular via WhatsApp/web
- Chatwoot/AGORA integration as CRM backbone
- Real-time analytics dashboard (Grafana or custom)
- Finkok PAC production deployment
- Legacy sync: billing + payments domains added
- LFPDPPP compliance implementation (privacy notice, ARCO rights portal)

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-A: Data Platform** | DB Architect | Legacy sync (billing + payments), data quality monitoring, performance optimization |
| **WS-B: Core Services** | 4 Backend Devs | Contract lifecycle, work orders API, complaint handling, payment plans, ARCO rights API |
| **WS-C: AI Agents** | 2 AI Engineers | Voice AI agent, WhatsApp CX v2, anomaly detection agent, field workforce agent |
| **WS-D: Infrastructure** | DevOps | Azure production environment (AKS), Twilio provisioning, monitoring (Prometheus + Grafana) |
| **QA** | 2 QA Engineers | Load testing, integration testing, agent conversation testing, security testing |

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S13 | Wk 25-26 | Voice AI: Twilio setup, Mexican phone number procurement, Claude conversation flow, account lookup tools |
| S14 | Wk 27-28 | Voice AI launch (pilot group), WhatsApp CX v2 (complaints, payment plans), Chatwoot/AGORA webhook integration |
| S15 | Wk 29-30 | Anomaly detection agent (statistical model on readings), field workforce agent (auto-assignment, mobile API) |
| S16 | Wk 31-32 | Contract lifecycle (digital alta/baja/cambio titular), LFPDPPP compliance (privacy notice, ARCO portal) |
| S17 | Wk 33-34 | Azure production deployment (AKS cluster), Finkok PAC production cutover, legacy sync (billing domain) |
| S18 | Wk 35-36 | Real-time dashboard, load testing (target: 1000 concurrent users), security penetration test v1 |

#### Dependencies
- Twilio Mexican phone number procurement can take 2-4 weeks -- start in Month 6
- Finkok production approval requires sandbox testing completion + business verification
- Azure AKS production cluster needs security architecture finalized
- Anomaly detection model requires 3+ months of readings data in new schema
- Chatwoot/AGORA API documentation and access credentials from CEA IT team

#### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Voice AI quality in Mexican Spanish | Medium | High | Extensive prompt engineering; human fallback for complex queries |
| Twilio Mexican phone number delays | Medium | Medium | Apply early; consider Vonage as backup |
| Azure AKS production readiness | Low | Critical | Run production readiness checklist; staged rollout |
| Legacy sync billing discrepancies | High | High | Reconciliation reports; manual review queue for discrepancies |

#### Go/No-Go Gate (End of Q3)
- [ ] Voice AI handling inbound calls with >70% first-call resolution
- [ ] WhatsApp CX resolving >40% of queries without human escalation
- [ ] Anomaly detection flagging suspicious readings with <5% false positive rate
- [ ] Field workforce agent assigning and tracking work orders
- [ ] Azure production environment running all services
- [ ] CFDI 4.0 stamping in production via Finkok
- [ ] LFPDPPP privacy notice deployed; ARCO rights portal functional
- [ ] Legacy sync covering persons, contracts, billing, payments

---

### Q4 2026 (Months 10-12): Business Intelligence & Advanced Agents

**Theme:** Deploy predictive intelligence -- collections scoring, fraud detection, consumption forecasting. Expand payment channels.

#### Objectives
- Collections Intelligence agent: 9-feature predictive scoring, automated sequences by risk tier, vulnerability protection
- Fraud detection agent: ML pattern analysis, geospatial clustering of illegal connections
- Consumption forecast agent: predict demand by sector
- Domiciliacion bancaria (direct debit) integration
- CoDi (QR) payment channel
- Delinquency orchestrator agent: automated escalation workflows via n8n
- Advanced admin dashboard: agent supervision, KPI dashboards, user management
- Legacy sync: all remaining domains (work orders, infrastructure, fraud cases)
- WhatsApp template expansion (payment_reminder, service_cut_warning, leak_report_received)

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-A: Data Platform** | DB Architect | Legacy sync (all domains), fraud_cases table + JSONB inspections, ML feature store |
| **WS-B: Core Services** | 4 Backend Devs | Collections engine, payment plans, domiciliacion, CoDi, delinquency workflows |
| **WS-C: AI Agents** | 2 AI Engineers | Collections intelligence, fraud detection, consumption forecast, delinquency orchestrator |
| **WS-D: Infrastructure** | DevOps | n8n deployment, ML model serving, monitoring dashboards, capacity planning |
| **QA** | 2 QA Engineers | ML model validation, collections accuracy testing, fraud detection precision/recall |

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S19 | Wk 37-38 | Collections scoring model (training data prep, 9-feature model), vulnerability flags on person records |
| S20 | Wk 39-40 | Collections intelligence agent (automated sequences by risk tier: low/medium/high/vulnerable) |
| S21 | Wk 41-42 | Fraud detection agent (ML pattern analysis, geospatial clustering), n8n delinquency workflows |
| S22 | Wk 43-44 | Domiciliacion bancaria (CLABE account storage, monthly scheduling), CoDi QR code generation |
| S23 | Wk 45-46 | Consumption forecast agent, advanced admin dashboard (agent supervision, KPIs) |
| S24 | Wk 47-48 | Legacy sync completion (all domains), year-end reconciliation, performance optimization |

#### Dependencies
- Collections model requires 6+ months of billing/payment history in new schema (or import from legacy)
- Fraud detection requires geocoded toma data with PostGIS points
- Domiciliacion requires bank API agreements (STP or acquiring bank)
- n8n deployment and workflow design should start in Month 9

#### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Insufficient training data for ML models | Medium | High | Import 3+ years of legacy billing/payment data for model training |
| False positives in fraud detection | High | Medium | Start with high-confidence thresholds; human review for all flags |
| Domiciliacion bank agreement delays | Medium | Medium | Start negotiation in Month 6; manual processing as fallback |
| Year-end billing/fiscal reconciliation issues | Medium | High | Run parallel reconciliation against legacy system for December |

#### Go/No-Go Gate (End of Q4 2026)
- [ ] Collections scoring model with >75% accuracy on payment prediction
- [ ] Fraud detection flagging cases with >80% precision
- [ ] Domiciliacion pilot running with at least 100 accounts
- [ ] n8n orchestrating at least 5 delinquency workflow patterns
- [ ] All legacy domains syncing bidirectionally
- [ ] Admin dashboard with real-time agent supervision and KPI tracking
- [ ] System handling full production load for CEA Queretaro

---

### Q1 2027 (Months 13-15): Full Platform & Regulatory Compliance

**Theme:** Regulatory compliance automation, digital twin foundations, consumption intelligence. System covers 100% of CIS functions.

#### Objectives
- Regulatory compliance agent: CONAGUA monthly extraction reports, quarterly efficiency metrics
- SEMARNAT discharge reporting automation
- State-level service KPI generation
- Tariff optimizer agent: recommend tariff adjustments based on cost recovery analysis
- Vulnerability shield agent: protect vulnerable accounts from automatic disconnection
- Self-service web portal for citizens (React/Next.js)
- CFDI complemento de pago automation for partial payments
- Legacy system read-only mode preparation

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-B: Core Services** | 3 Backend Devs | Web portal, complemento de pago, tariff management UI |
| **WS-C: AI Agents** | 2 AI Engineers | Regulatory compliance agent, tariff optimizer, vulnerability shield |
| **WS-D: Infrastructure** | DevOps | Azure scaling optimization, backup strategy, DR plan |
| **QA** | 2 QA Engineers | Regulatory report validation, end-to-end testing, accessibility audit |

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S25 | Wk 49-50 | Regulatory compliance agent: CONAGUA monthly report template, data extraction pipeline |
| S26 | Wk 51-52 | SEMARNAT discharge reporting, state KPI generation, complemento de pago automation |
| S27 | Wk 53-54 | Tariff optimizer agent, vulnerability shield agent (disconnection protection rules) |
| S28 | Wk 55-56 | Self-service web portal v1 (account view, invoice download, payment history) |
| S29 | Wk 57-58 | Web portal v2 (contract management, reading submission, complaint tracking) |
| S30 | Wk 59-60 | Legacy read-only mode preparation, data freeze planning, migration validation suite |

#### Go/No-Go Gate (End of Q1 2027)
- [ ] CONAGUA monthly reports generating automatically with verified accuracy
- [ ] Vulnerability shield preventing disconnection of flagged accounts
- [ ] Self-service web portal functional with citizen authentication
- [ ] Complemento de pago generating for all partial payments
- [ ] Legacy system ready for read-only transition

---

### Q2 2027 (Months 16-18): Migration Completion

**Theme:** Cut over from legacy system. Validate all data. Train all staff. Go-live with SUPRA as primary system.

#### Objectives
- Legacy system transition to read-only
- Full data migration validation (every record reconciled)
- Staff training program (all CEA departments)
- Parallel running period (both systems, compare outputs)
- SUPRA as primary system of record
- Production hardening and performance optimization
- Disaster recovery testing

#### Workstreams

| Track | Owner | Deliverables |
|-------|-------|-------------|
| **WS-A: Data Platform** | DB Architect + 1 Backend | Final data migration, reconciliation reports, legacy read-only cutover |
| **WS-B: Core Services** | 3 Backend Devs | Edge case handling, data correction workflows, staff-facing tools |
| **WS-D: Infrastructure** | 1.5 DevOps | DR testing, Azure optimization, backup validation, capacity finalization |
| **QA** | 2 QA Engineers | Migration validation, reconciliation testing, UAT support |

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S31 | Wk 61-62 | Legacy read-only cutover, parallel running period begins, reconciliation dashboard |
| S32 | Wk 63-64 | Staff training program (operations, billing, customer service, field teams) |
| S33 | Wk 65-66 | Data reconciliation: every account, invoice, and payment verified |
| S34 | Wk 67-68 | SUPRA declared primary system of record, performance optimization |
| S35 | Wk 69-70 | DR test (full failover simulation), security audit v2, UAT sign-off |
| S36 | Wk 71-72 | Go-live celebration, lessons learned, handover documentation |

#### Go/No-Go Gate (End of Q2 2027)
- [ ] 100% of active accounts migrated and reconciled (zero data loss)
- [ ] All CEA staff trained (>90% competency assessment pass rate)
- [ ] SUPRA handling 100% of production transactions for 4+ weeks
- [ ] DR test completed successfully (RPO < 1 hour, RTO < 4 hours)
- [ ] Security audit passed with no critical findings
- [ ] Stakeholder sign-off from CEA leadership

---

### Q3 2027 (Months 19-21): Smart Metering Pilot

**Theme:** Deploy 10,000 smart meters with LoRaWAN infrastructure. Enable real-time consumption monitoring and NRW reduction.

#### Objectives
- Smart meter pilot: 10K units (Kamstrup flowIQ 2200 or equivalent)
- LoRaWAN network deployment (915 MHz ISM band for Mexico)
- ChirpStack LoRaWAN network server
- Real-time consumption dashboard
- Smart meter ingestion pipeline (TimescaleDB hypertables)
- NRW (Non-Revenue Water) analytics and leak detection
- Autolectura (self-reading) via WhatsApp photo submission

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S37 | Wk 73-74 | LoRaWAN gateway deployment (pilot area), ChirpStack configuration, meter data pipeline |
| S38 | Wk 75-76 | Smart meter installation begins (batch 1: 2,500 units), data validation |
| S39 | Wk 77-78 | Smart meter batch 2 (5,000 total), real-time consumption dashboard |
| S40 | Wk 79-80 | Smart meter batch 3 (7,500 total), NRW analytics module, leak detection alerts |
| S41 | Wk 81-82 | Smart meter batch 4 (10,000 total), autolectura via WhatsApp |
| S42 | Wk 83-84 | Pilot evaluation, NRW reduction measurement, cost-benefit analysis |

#### Go/No-Go Gate (End of Q3 2027)
- [ ] 10,000 smart meters installed and communicating
- [ ] >95% meter data reception rate
- [ ] NRW analytics identifying top 10 loss areas
- [ ] Measurable NRW reduction in pilot area (target: 5% reduction)

---

### Q4 2027 (Months 22-24): Full Autonomy & Legacy Retirement

**Theme:** Retire legacy system. Optimize for full autonomy. Prepare multi-tenant marketplace.

#### Objectives
- Legacy system full decommission
- Natural language BI: ask questions about the system in Spanish, get answers
- GeoInfra agent: autonomous infrastructure mapping with PostGIS
- Multi-tenant preparation: documentation, onboarding workflow for second utility
- Performance optimization for steady-state operations
- Knowledge transfer to CEA internal IT team
- Steady-state team handover (16 FTE -> 5-6 FTE maintenance team)

#### Sprint Breakdown

| Sprint | Dates | Key Deliverables |
|--------|-------|-----------------|
| S43 | Wk 85-86 | Legacy system decommission (archive data, shut down services) |
| S44 | Wk 87-88 | Natural language BI agent, GeoInfra agent (PostGIS integration) |
| S45 | Wk 89-90 | Multi-tenant onboarding workflow, documentation for second utility |
| S46 | Wk 91-92 | Performance optimization, steady-state runbooks, alerting tuning |
| S47 | Wk 93-94 | Knowledge transfer to CEA IT, training for internal maintenance team |
| S48 | Wk 95-96 | Program closure, final retrospective, success metrics report |

#### Go/No-Go Gate (End of Q4 2027)
- [ ] Legacy system fully decommissioned (archived, not running)
- [ ] SUPRA operating autonomously for 6+ months
- [ ] CEA internal team capable of maintaining the system
- [ ] Multi-tenant architecture validated (ready for second deployment)
- [ ] All success metrics at or above target values

---

## 5. Critical Path Analysis

### 5.1 Longest Dependency Chain

```
Schema Design (S1-S2)
  -> Core CRUD APIs (S3-S4)
    -> Billing Engine + Tariff Calculator (S7-S8)
      -> CFDI 4.0 / Finkok PAC (S9)
        -> Invoice PDF Generation (S9)
          -> WhatsApp Invoice Delivery (S11)
            -> Voice AI Agent (S13-S14)
              -> Collections Intelligence (S19-S20)
                -> Delinquency Orchestrator (S21)
                  -> Legacy Cutover (S31-S34)
                    -> Legacy Retirement (S43)
```

**Critical path duration:** 22 months (Sprint 1 through Sprint 43)

### 5.2 Bottleneck Resources

| Resource | Bottleneck Period | Impact | Mitigation |
|----------|------------------|--------|------------|
| **DB Architect** | Q1-Q2 2026 | Schema design blocks all CRUD development | Prioritize schema over other DB tasks; use SUPRA reference schema to accelerate |
| **Integration Specialist** | Q2 2026 | Finkok + Conekta + 360dialog all needed simultaneously | Start vendor onboarding in Q1; parallelize sandbox work |
| **AI/ML Engineers** | Q3-Q4 2026 | 4 agents need development concurrently | Reusable SUPRAAgent framework reduces per-agent effort; sequence by priority |
| **DevOps** | Q3 2026 | Azure production deployment while maintaining staging | Automate infrastructure-as-code early; Terraform modules |

### 5.3 Parallel Workstreams (Independent)

These workstreams can proceed independently without blocking each other:

| Workstream | Independence Level | Notes |
|------------|-------------------|-------|
| **UX/UI Design** | High | Can design ahead of implementation by 1-2 sprints |
| **Legacy DB Cleanup** | High | Runs independently; sync bridges old and new |
| **Smart Meter Procurement** | High | Hardware procurement runs independently from software (long lead times) |
| **WhatsApp Template Approval** | High | Submit early; Meta review process is independent |
| **Staff Training Curriculum** | High | Design training materials while system is being built |
| **Regulatory Report Templates** | Medium | Can define report structures before automation engine |
| **Security Policies** | Medium | Define policies early; implement alongside features |

### 5.4 Cross-Team Integration Points

| Integration Point | When | Teams Involved | Risk Level |
|-------------------|------|----------------|------------|
| Schema freeze for billing tables | End of S7 | DB Architect + Backend + Integration | High |
| CFDI XML structure agreement | S8 | Backend + Integration + Regulatory | High |
| WhatsApp agent + billing service | S11 | AI Engineers + Backend | Medium |
| Voice AI + account lookup APIs | S13 | AI Engineers + Backend | Medium |
| Collections model + billing data | S19 | AI Engineers + DB Architect | High |
| Legacy sync reconciliation format | S12 | DB Architect + QA | High |
| Azure production architecture | S17 | DevOps + Security + Backend | Critical |
| n8n workflow design | S21 | AI Engineers + DevOps + Backend | Medium |

---

## 6. Risk Register

### 6.1 Technical Risks

| # | Risk | Prob. | Impact | Mitigation | Owner |
|---|------|-------|--------|------------|-------|
| T1 | **Legacy migration data quality** -- dirty data in 4,114-table monolith causes sync failures | High | Critical | Data quality checks, quarantine queues, reconciliation reports, dedicated cleanup sprints | DB Architect |
| T2 | **JSONB schema evolution** -- changing JSONB structures post-deployment breaks existing records | Medium | High | Versioned JSONB schemas, Zod validation on read/write, migration scripts for schema changes | DB Architect |
| T3 | **pg LISTEN/NOTIFY scalability** -- event throughput exceeds PostgreSQL notification capacity | Low | High | Monitor notification queue depth; BullMQ handles heavy lifting; Kafka upgrade path documented | Backend Lead |
| T4 | **AI agent hallucination** -- Claude agents provide incorrect billing/account information to citizens | Medium | Critical | Strict tool-calling patterns (no freeform answers for financial data), human-in-the-loop for transactions, audit all agent actions | AI Lead |
| T5 | **TimescaleDB performance** -- hypertable growth with 400K accounts x monthly readings | Low | Medium | Chunk time intervals (1 month), continuous aggregates, data retention policies | DB Architect |
| T6 | **Drizzle ORM limitations** -- edge cases in complex queries not supported by ORM | Medium | Low | Fall back to raw SQL via Drizzle's `sql` template literal; ORM is SQL-first by design | Backend Lead |
| T7 | **Multi-tenant RLS performance** -- RLS policies add overhead to every query | Low | Medium | Benchmark RLS overhead; use session-level `SET app.tenant_id` for efficient policy evaluation | DB Architect |
| T8 | **WhatsApp API rate limits** -- monthly billing notification spike hits rate limits | Medium | Medium | Queue outbound messages; stagger delivery over hours; request rate limit increase from Meta | Integration Specialist |

### 6.2 Integration Risks

| # | Risk | Prob. | Impact | Mitigation | Owner |
|---|------|-------|--------|------------|-------|
| I1 | **Finkok PAC downtime** -- PAC unavailable during billing cycle | Medium | High | Implement retry queue; cache stamped CFDIs; have Facturapi as secondary PAC | Integration Specialist |
| I2 | **Conekta API changes** -- payment processor modifies API or terms | Low | Medium | Abstract payment interface; document API version pinning | Integration Specialist |
| I3 | **Twilio Mexico regulations** -- telecom regulations affect Voice AI or SMS | Low | High | Monitor Mexican telecom regulatory changes; have Vonage as backup provider | Integration Specialist |
| I4 | **360dialog/Meta WhatsApp policy changes** -- template approval rules tighten | Medium | Medium | Maintain simple templates; have SMS fallback for critical notifications | Integration Specialist |
| I5 | **STP/Bank API for domiciliacion** -- bank partner delays integration | High | Medium | Start early; manual reconciliation as interim; consider alternative banks | Integration Specialist |
| I6 | **Legacy system API instability** -- legacy SOAP services fail during sync period | Medium | High | Implement circuit breakers; batch sync during off-peak hours; direct DB access as fallback | DB Architect |

### 6.3 Business Risks

| # | Risk | Prob. | Impact | Mitigation | Owner |
|---|------|-------|--------|------------|-------|
| B1 | **Budget overrun** -- development takes longer, costs more than estimated | Medium | High | Fixed-scope quarters with go/no-go gates; descope non-critical features | PM |
| B2 | **Vendor lock-in (Claude API)** -- Anthropic pricing changes or availability issues | Low | High | Abstract agent interface; evaluate Gemini/GPT-4o as alternatives; local model fallback for simple tasks | AI Lead |
| B3 | **Regulatory changes** -- SAT modifies CFDI 4.0 rules or new regulation emerges | Medium | Medium | Regulatory specialist monitors SAT/DOF publications; modular compliance layer allows rapid updates | Regulatory Expert |
| B4 | **Scope creep** -- CEA stakeholders request additional features during development | High | Medium | Strict backlog management; quarterly scope reviews; change request process | PM + Product Owner |
| B5 | **Political risk** -- change in state/municipal government affects project sponsorship | Low | Critical | Multi-tenant value proposition reduces single-client dependency; document ROI for any successor | PM |
| B6 | **Citizen adoption resistance** -- users prefer office visits over WhatsApp/Voice | Medium | Medium | Gradual channel migration; maintain office service; track adoption metrics; incentivize digital | Product Owner |

### 6.4 People Risks

| # | Risk | Prob. | Impact | Mitigation | Owner |
|---|------|-------|--------|------------|-------|
| P1 | **Key person dependency** -- DB Architect or AI Lead leaves project | Medium | Critical | Cross-training from Q1; documentation of all architectural decisions; pair programming | PM |
| P2 | **AI/ML talent scarcity** -- difficulty hiring/retaining AI engineers in Queretaro | High | High | Remote-friendly positions; competitive compensation; Mexico City / Guadalajara talent pool | PM |
| P3 | **CEA staff resistance to change** -- internal users resist new system | Medium | High | Change management program; early involvement in UAT; champions per department | Product Owner |
| P4 | **Contractor dependency** -- over-reliance on external developers | Medium | Medium | Knowledge transfer plan; internal hire pipeline; code review by internal team | PM |
| P5 | **Training gap** -- CEA operations staff unable to use new system effectively | Medium | High | Role-based training curriculum; video tutorials in Spanish; on-site training during Q2 2027 | PM + Product Owner |

---

## 7. Budget Allocation

### 7.1 Cost by Category

| Category | Monthly | Year 1 | Year 2 | Total (24 mo.) |
|----------|---------|--------|--------|----------------|
| **Development -- Internal Team** | $80-120K | $960K-1.44M | $720K-1.08M | $1.68-2.52M |
| **Development -- Contractors** | $10-20K | $120-240K | $60-120K | $180-360K |
| **Cloud Infrastructure (Azure)** | $3.5-6K | $42-72K | $42-72K | $84-144K |
| **AI API costs (Claude + OpenAI)** | $1-3K | $12-36K | $12-36K | $24-72K |
| **Third-party Services** | | | | |
| - Finkok PAC | $0.5-1K | $6-12K | $6-12K | $12-24K |
| - Conekta (transaction fees) | $0.5-2K | $6-24K | $6-24K | $12-48K |
| - Twilio (Voice + SMS) | $1-3K | $12-36K | $12-36K | $24-72K |
| - 360dialog (WhatsApp) | $0.5-1K | $6-12K | $6-12K | $12-24K |
| - SendGrid/SES (email) | $0.1-0.3K | $1.2-3.6K | $1.2-3.6K | $2.4-7.2K |
| **Software Licenses** | | | | |
| - n8n (Cloud or self-hosted) | $0-0.5K | $0-6K | $0-6K | $0-12K |
| - Sentry | $0.1-0.5K | $1.2-6K | $1.2-6K | $2.4-12K |
| - GitHub (Team/Enterprise) | $0.1-0.5K | $1.2-6K | $1.2-6K | $2.4-12K |
| - Security tools | $0.5-1K | $6-12K | $6-12K | $12-24K |
| **Training & Change Management** | $0-5K | $0-30K | $30-60K | $30-90K |
| **Travel & On-site** | $2-5K | $24-60K | $12-30K | $36-90K |

### 7.2 Total Program Cost Summary

| Line Item | Low Estimate | High Estimate |
|-----------|-------------|---------------|
| Development (internal + contract) | $1.86M | $2.88M |
| Cloud & Infrastructure | $84K | $144K |
| Third-party services (24 months) | $62K | $175K |
| Software licenses | $17K | $60K |
| Training & change management | $30K | $90K |
| Travel & on-site | $36K | $90K |
| **Subtotal (system build)** | **$2.09M** | **$3.44M** |
| Contingency (15%) | $314K | $516K |
| **Total (excluding smart meters)** | **$2.4M** | **$3.95M** |
| Smart meter pilot (10K units) | $1.8M | $1.8M |
| **Total (including pilot)** | **$4.2M** | **$5.75M** |

### 7.3 Monthly Burn Rate by Phase

| Period | Monthly Burn Rate | Notes |
|--------|------------------|-------|
| Q1 2026 (ramp-up) | $90-130K | Founding team + infrastructure setup |
| Q2-Q3 2026 (peak dev) | $120-170K | Full team + vendor costs kicking in |
| Q4 2026 (peak dev) | $130-180K | All agents + ML models + full infra |
| Q1 2027 | $120-160K | Full team + regulatory compliance |
| Q2 2027 (migration) | $110-150K | Migration focus + training costs |
| Q3 2027 (smart meters) | $80-120K + hardware | Reduced dev team + hardware spend |
| Q4 2027 (wind-down) | $60-90K | Handover + steady-state team |

---

## 8. Vendor Selection & Procurement Timeline

### 8.1 Finkok PAC (CFDI 4.0 Stamping)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Vendor evaluation (Finkok vs Facturapi vs Digicel) | Month 1-2 | Integration Specialist |
| Sandbox account creation | Month 2 | Integration Specialist |
| Technical integration development | Month 3-5 | Backend Dev + Integration |
| Sandbox testing (100+ test CFDIs) | Month 5 | QA |
| Business verification with SAT | Month 5-6 | Regulatory Expert |
| Production account activation | Month 6 | Integration Specialist |
| Production go-live | Month 7 | PM |

**Key considerations:** Finkok is the most widely used PAC in Mexico for SaaS integrations. Their API is REST-based with XML response. Pricing is per-stamp (approximately $0.50-1.00 MXN per CFDI). Annual volume for CEA: ~4.8M stamps (400K accounts x 12 months).

### 8.2 Conekta (Payment Processing)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Merchant account application | Month 3 | PM + Finance |
| KYC documentation (INE, RFC, acta constitutiva) | Month 3 | PM |
| Sandbox API access | Month 3 (1-2 weeks after application) | Integration Specialist |
| Integration development (OXXO, SPEI, cards) | Month 4-5 | Backend Dev |
| Sandbox testing | Month 5 | QA |
| Production activation | Month 5-6 | Integration Specialist |

**Key considerations:** Conekta charges 2.9% + $2.50 MXN per card transaction, $8 MXN per OXXO reference, SPEI is free for receiving. CEA needs a government entity merchant account -- verify Conekta supports government fiscal regimes (603).

### 8.3 Twilio (Voice AI + SMS)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Account creation | Month 4 | Integration Specialist |
| Mexican phone number procurement (DID) | Month 4-5 (2-4 week lead time) | Integration Specialist |
| Programmable Voice integration | Month 5-7 | AI Engineer + Integration |
| SMS integration | Month 5 | Integration Specialist |
| Voice AI testing with native speakers | Month 7-8 | QA |
| Production launch | Month 8-9 | PM |

**Key considerations:** Mexican phone numbers (LADA format) require regulatory compliance. Twilio charges ~$1 USD/month per number + $0.013/min inbound + $0.034/min outbound for Mexico. Estimated monthly cost for 50K minutes: $650-1,700 USD. Voice AI quality depends on Twilio Media Streams + Claude API latency (should be <500ms).

### 8.4 360dialog / Meta (WhatsApp Business API)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Facebook Business Manager verification | Month 2-3 | PM |
| 360dialog partner account setup | Month 3 | Integration Specialist |
| WhatsApp Business Account (WABA) creation | Month 3 | Integration Specialist |
| Phone number registration and verification | Month 3-4 | Integration Specialist |
| Template submission (5 templates) | Month 4 | Product Owner + Integration |
| Template approval by Meta | Month 4-5 (1-4 week review) | Waiting |
| Integration development | Month 4-5 | AI Engineer |
| Sandbox testing | Month 5 | QA |
| Production launch | Month 5-6 | PM |

**Key considerations:** Meta's template review can reject templates for policy violations. Submit simple, clearly-formatted templates. The 5 initial templates should be: `invoice_ready`, `payment_confirmation`, `payment_reminder`, `leak_report_received`, `service_cut_warning`. 360dialog charges per-conversation (approximately $0.05-0.15 USD per conversation). Estimated monthly cost for 200K conversations: $10K-30K USD.

### 8.5 Microsoft Azure (Mexico Central)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Enterprise subscription agreement | Month 1 | PM + IT |
| Mexico Central resource group provisioning | Month 1 | DevOps |
| Development environment (small AKS cluster) | Month 2 | DevOps |
| Staging environment | Month 4 | DevOps |
| Production environment (AKS, PostgreSQL Flexible Server, Redis Cache) | Month 7-8 | DevOps |
| DR configuration (paired region) | Month 8-9 | DevOps |

**Key considerations:** Azure Mexico Central (Queretaro) has AKS, PostgreSQL Flexible Server, Redis Cache, and Blob Storage. Verify TimescaleDB extension availability on Azure Flexible Server -- may require self-managed PostgreSQL on AKS VMs. Azure Government pricing may apply for CEA as a state entity.

### 8.6 n8n (Workflow Orchestration)

| Activity | Timeline | Owner |
|----------|----------|-------|
| Evaluate self-hosted vs n8n Cloud | Month 1-2 | DevOps |
| Deploy n8n instance (Docker) | Month 2-3 | DevOps |
| Configure webhook integrations | Month 4+ | Backend Dev |
| Build billing workflows | Month 5-6 | Backend Dev |
| Build delinquency workflows | Month 9-10 | AI Engineer |

**Key considerations:** Self-hosted n8n is free (fair-code license). n8n Cloud starts at $20/month. For CEA's scale, self-hosted on Azure is recommended. n8n connects to PostgreSQL, Redis, webhooks, and HTTP APIs natively.

---

## 9. Milestone Definitions

### M1: Platform Foundation Complete
- **Target date:** End of Month 3 (Q1 2026)
- **Acceptance criteria:**
  - PostgreSQL schema deployed with all core tables (~50-80)
  - Multi-tenant RLS verified with 2 test tenants
  - Core CRUD APIs for persons, tomas, contracts, meters with integration tests
  - CI/CD pipeline green (build, lint, test, Docker)
  - Azure subscription active with development environment
- **Go/no-go:** Proceed to billing engine development
- **Sign-off:** Technical Lead + PM

### M2: Billing Engine + CFDI Live
- **Target date:** End of Month 6 (Q2 2026)
- **Acceptance criteria:**
  - Billing engine generates invoices matching legacy calculations (100% accuracy on test set of 1,000 accounts)
  - CFDI 4.0 stamps successfully via Finkok (sandbox minimum, production preferred)
  - Invoice PDF generation with Mexican fiscal format
  - Tariff calculator handles domestic and commercial categories
- **Go/no-go:** Proceed to citizen-facing channels
- **Sign-off:** Technical Lead + CEA Finance Director

### M3: WhatsApp + Payments Live
- **Target date:** End of Month 6 (Q2 2026)
- **Acceptance criteria:**
  - WhatsApp CX agent responding to account inquiries, balance checks, invoice delivery
  - At least 3 WhatsApp templates approved by Meta
  - OXXO and SPEI payments processing in Conekta sandbox (production preferred)
  - Payment reconciliation running automatically
- **Go/no-go:** Proceed to Voice AI development
- **Sign-off:** PM + Product Owner + CEA Customer Service Director

### M4: Voice AI Agent Live
- **Target date:** End of Month 9 (Q3 2026)
- **Acceptance criteria:**
  - Voice AI handling inbound calls in Mexican Spanish
  - First-call resolution rate >60%
  - Average call handling time <3 minutes
  - Successful handoff to human agent when needed
  - Twilio Mexican phone number active and published
- **Go/no-go:** Proceed to ML agent development
- **Sign-off:** PM + AI Lead + CEA Customer Service Director

### M5: Azure Production Environment
- **Target date:** End of Month 9 (Q3 2026)
- **Acceptance criteria:**
  - AKS cluster running in Azure Mexico Central
  - All services deployed and healthy
  - Load test passed (1,000 concurrent users)
  - Monitoring (Prometheus + Grafana) operational
  - SSL/TLS certificates active (Traefik auto-renewal)
  - Backup strategy tested (RPO < 1 hour)
- **Go/no-go:** Start migrating production traffic
- **Sign-off:** DevOps Lead + Security Architect + PM

### M6: Collections + Fraud Intelligence
- **Target date:** End of Month 12 (Q4 2026)
- **Acceptance criteria:**
  - Collections scoring model with >75% accuracy
  - Automated collection sequences running for at least 3 risk tiers
  - Vulnerability shield preventing disconnection of flagged accounts
  - Fraud detection flagging cases with >80% precision
  - n8n delinquency workflows operational
- **Go/no-go:** Proceed to regulatory compliance
- **Sign-off:** AI Lead + CEA Finance Director + PM

### M7: Full CIS Functionality
- **Target date:** End of Month 15 (Q1 2027)
- **Acceptance criteria:**
  - 100% of legacy CIS functions available in SUPRA
  - CONAGUA monthly reports generating automatically
  - Self-service web portal functional
  - All payment channels operational (OXXO, SPEI, card, CoDi, domiciliacion)
  - All 8 AI agents deployed and operational
- **Go/no-go:** Proceed to legacy migration
- **Sign-off:** Product Owner + CEA General Director

### M8: Legacy Cutover Complete
- **Target date:** End of Month 18 (Q2 2027)
- **Acceptance criteria:**
  - 100% of active accounts migrated (zero data loss verified)
  - Legacy system in read-only mode for 30+ days
  - All CEA staff trained (>90% competency pass rate)
  - SUPRA as primary system of record for 30+ days
  - No critical bugs in production for 14+ consecutive days
- **Go/no-go:** Approve legacy decommission date
- **Sign-off:** CEA General Director + Finance Director + IT Director

### M9: Smart Meter Pilot Complete
- **Target date:** End of Month 21 (Q3 2027)
- **Acceptance criteria:**
  - 10,000 smart meters installed and communicating
  - >95% data reception rate
  - NRW analytics operational
  - Measurable NRW reduction in pilot area
  - Cost-benefit analysis completed
- **Go/no-go:** Decide on full 400K deployment
- **Sign-off:** CEA General Director + CONAGUA representative

### M10: Legacy Retirement + Program Close
- **Target date:** End of Month 24 (Q4 2027)
- **Acceptance criteria:**
  - Legacy system fully decommissioned (data archived per retention policy)
  - SUPRA operating autonomously for 6+ months
  - CEA internal team maintaining system independently
  - Multi-tenant architecture validated
  - All success metrics at or above target
  - Program closure report approved
- **Go/no-go:** Program closure decision
- **Sign-off:** CEA General Director + PM + Technical Lead

### M11: Multi-Tenant Market Ready
- **Target date:** End of Month 24 (Q4 2027)
- **Acceptance criteria:**
  - Onboarding workflow documented for new utility
  - Pricing model defined
  - At least 1 expression of interest from another utility (JMAPA, JAPAC)
  - Sales materials and demo environment available
- **Sign-off:** CEA General Director + PM

---

## 10. Success Metrics Dashboard

### 10.1 Technical KPIs

| Metric | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 | Q1 2027 | Q2 2027 | Measurement |
|--------|---------|---------|---------|---------|---------|---------|-------------|
| **API uptime** | 95% | 99% | 99.5% | 99.9% | 99.9% | 99.95% | Azure Monitor |
| **API response time (p95)** | <500ms | <300ms | <200ms | <200ms | <200ms | <150ms | Prometheus |
| **CI/CD pipeline pass rate** | >80% | >90% | >95% | >95% | >95% | >95% | GitHub Actions |
| **Test coverage** | >60% | >70% | >75% | >80% | >80% | >80% | Jest + coverage |
| **Security vulnerabilities (critical)** | 0 | 0 | 0 | 0 | 0 | 0 | Snyk / Trivy |
| **Database query performance (p95)** | <100ms | <50ms | <50ms | <30ms | <30ms | <30ms | pg_stat_statements |
| **Event processing latency** | <5s | <2s | <1s | <1s | <500ms | <500ms | BullMQ metrics |

### 10.2 Business KPIs

| Metric | Baseline | Q2 2026 | Q4 2026 | Q2 2027 | Q4 2027 | Measurement |
|--------|----------|---------|---------|---------|---------|-------------|
| **Digital channel adoption** | 0% | 10% | 30% | 50% | 65% | Channel analytics |
| **WhatsApp query resolution (no human)** | N/A | 30% | 50% | 60% | 70% | Agent logs |
| **Voice AI first-call resolution** | N/A | N/A | 60% | 70% | 75% | Call analytics |
| **CFDI stamping success rate** | N/A | 95% | 99% | 99.5% | 99.9% | Finkok logs |
| **Payment collection rate** | Current | +2% | +5% | +8% | +10% | Finance reports |
| **Average days to collect** | Current | -5 days | -10 days | -15 days | -20 days | Billing analytics |
| **NRW (Non-Revenue Water)** | ~40% | 40% | 38% | 35% | 30% | Meter analytics |
| **Customer satisfaction (CSAT)** | Baseline | +5% | +10% | +15% | +20% | Survey data |
| **Office visit reduction** | Baseline | -5% | -15% | -30% | -45% | Office counters |
| **Fraud cases detected** | Current | Current | +20% | +40% | +60% | Fraud agent logs |

### 10.3 Operational KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Mean Time to Recovery (MTTR)** | <30 minutes | PagerDuty / Grafana |
| **Deployment frequency** | Weekly (minimum) | GitHub releases |
| **Change failure rate** | <10% | Post-deployment incident tracking |
| **Sprint velocity variance** | <15% | Jira / Linear |
| **Tech debt ratio** | <15% of sprint capacity | Sprint retrospective tracking |
| **Agent accuracy** | >95% for financial data | Automated audit sampling |

---

## 11. Stakeholder Communication Plan

### 11.1 Reporting Cadence

| Report | Frequency | Audience | Format | Owner |
|--------|-----------|----------|--------|-------|
| **Daily standup** | Daily | Dev team | 15-min video call | Scrum Master |
| **Sprint review** | Biweekly | Dev team + Product Owner | Demo + metrics | PM |
| **Sprint retrospective** | Biweekly | Dev team | Facilitator-led session | Scrum Master |
| **Steering committee** | Monthly | CEA leadership + PM + Tech Lead | Executive slide deck | PM |
| **Quarterly business review** | Quarterly | CEA General Director + Finance | KPI dashboard + milestone review | PM |
| **Vendor status** | Monthly | Integration specialist + vendors | Email summary + issue log | Integration Specialist |
| **Risk report** | Biweekly | PM + Tech Lead | Risk register update | PM |
| **Security bulletin** | Monthly | Security Architect + DevOps + PM | Vulnerability report | Security Architect |

### 11.2 Stakeholder Matrix

| Stakeholder | Interest | Influence | Engagement Level | Primary Contact |
|-------------|----------|-----------|-----------------|-----------------|
| **CEA General Director** | Strategic alignment, ROI, political | Very High | Quarterly review, milestone sign-off | PM |
| **CEA Finance Director** | Billing accuracy, revenue improvement, CFDI compliance | High | Monthly steering, M2/M6/M8 sign-off | PM + Product Owner |
| **CEA IT Director** | Technical architecture, integration, maintenance | High | Weekly alignment, all technical milestones | Technical Lead |
| **CEA Customer Service Director** | Channel adoption, citizen satisfaction, agent quality | High | Monthly steering, M3/M4 sign-off | Product Owner |
| **CEA Operations Director** | Field workforce, work orders, meter management | Medium | Monthly steering, M9 sign-off | Product Owner |
| **SAT / Regulatory bodies** | CFDI compliance, LFPDPPP compliance | Medium | As needed (via Regulatory Expert) | Regulatory Expert |
| **CONAGUA** | Reporting compliance, smart metering | Medium | Quarterly (via Regulatory Expert) | Regulatory Expert |
| **Vendor partners (Finkok, Conekta, Twilio)** | Integration success, SLA adherence | Low-Medium | Monthly status call | Integration Specialist |
| **CEA union / employees** | Job security, training, change management | Medium | Monthly town hall, training sessions | PM + Product Owner |
| **Citizens (end users)** | Service quality, channel availability, billing accuracy | Low (indirect) | Through adoption metrics, CSAT surveys | Product Owner |

### 11.3 Escalation Procedures

| Level | Trigger | Action | Timeline | Decision Maker |
|-------|---------|--------|----------|----------------|
| **L1 -- Team** | Sprint blocker, technical issue | Team standup discussion, pair problem-solving | Same day | Tech Lead |
| **L2 -- PM** | Cross-team dependency, resource conflict, vendor issue | PM mediation, priority call | 24 hours | PM |
| **L3 -- Steering** | Budget overrun >10%, milestone at risk, scope change request | Steering committee emergency session | 48 hours | CEA IT Director |
| **L4 -- Executive** | Program at risk, regulatory non-compliance, critical security breach | Executive briefing | Same day | CEA General Director |

---

## 12. References

### 12.1 Specialist Action Plans

| Plan | File | Status |
|------|------|--------|
| Database Architecture | `plans/ACTION_PLAN_DATABASE.md` | [pending] |
| Full Stack Development | `plans/ACTION_PLAN_FULLSTACK.md` | [pending] |
| AI Agent Architecture | `plans/ACTION_PLAN_AI_AGENTS.md` | [pending] |
| UX/UI Design | `plans/ACTION_PLAN_UX_UI.md` | [pending] |
| DevOps & Cloud Infrastructure | `plans/ACTION_PLAN_DEVOPS.md` | [pending] |
| Integration Layer | `plans/ACTION_PLAN_INTEGRATIONS.md` | [pending] |
| Mexican Regulatory Compliance | `plans/ACTION_PLAN_REGULATORY.md` | [pending] |
| QA & Testing Strategy | `plans/ACTION_PLAN_QA_TESTING.md` | [pending] |
| Security Architecture | `plans/ACTION_PLAN_SECURITY.md` | [pending] |

### 12.2 Analysis Reports

| Report | File |
|--------|------|
| Cross-Reference Insights (23 findings) | `reports/SUPRA_CROSSREF_INSIGHTS.md` |
| System Health Report (5.1/10) | `reports/SYSTEM_HEALTH_REPORT.md` |
| Integration Roadmap | `reports/INTEGRATION_ROADMAP.md` |
| Database Optimization Plan | `reports/DATABASE_OPTIMIZATION_PLAN.md` |
| Next-Gen Architecture Blueprint | `reports/NEXTGEN_ARCHITECTURE_BLUEPRINT.md` |

### 12.3 Architecture & Source Documents

| Document | File |
|----------|------|
| SUPRA Water 2026 Architecture | `SUPRA-WATER-2026.md` |
| Master Plan Index (original 36-month plan) | `plans/MASTER_PLAN_INDEX.md` |
| Database Deep Analysis (A1-A9) | `reports/A1-*.md` through `reports/A9-*.md` |
| API Deep Analysis (B1-B7) | `reports/B1-*.md` through `reports/B7-*.md` |
| Next-Gen Research (C1-C8) | `reports/C1-*.md` through `reports/C8-*.md` |
| Phase Plans (1-10) | `plans/PHASE_01_*.md` through `plans/PHASE_10_*.md` |

---

## Appendix A: Key Architectural Decisions Record (ADR)

| ADR # | Decision | Rationale | Date |
|-------|----------|-----------|------|
| ADR-001 | TypeScript monorepo (Node.js 22 LTS) over Go + TypeScript | Single language reduces hiring complexity and cross-compilation issues. Performance difference negligible at CIS scale. | 2026-02 |
| ADR-002 | ~50-80 tables with JSONB over ~230 relational tables | SUPRA insight: JSONB for tariff blocks, audit events, configurations reduces schema complexity 10x while maintaining queryability. | 2026-02 |
| ADR-003 | pg LISTEN/NOTIFY + BullMQ over Kafka | At 400K account scale, PostgreSQL notifications + Redis queues are sufficient. Eliminates ZooKeeper/KRaft operational overhead. Kafka is documented upgrade path. | 2026-02 |
| ADR-004 | n8n over Camunda 8 for workflow orchestration | CIS workflows are sequential event chains, not complex BPMN. n8n covers 80% of use cases. Camunda available if needed later. | 2026-02 |
| ADR-005 | Azure Mexico Central over GCP | Data residency requirement for citizen PII under LFPDPPP. GCP has no Mexico region. Azure has Queretaro data center. | 2026-02 |
| ADR-006 | Drizzle ORM over Prisma/TypeORM | SQL-first approach aligns with complex DB operations. Type-safe schema generation. Better raw SQL escape hatch. | 2026-02 |
| ADR-007 | domain_events hypertable over separate audit_log table | Single TimescaleDB hypertable serves audit, event sourcing, and event-driven architecture. Immutable append-only with time-based partitioning. | 2026-02 |
| ADR-008 | Multi-tenant RLS from day one | CEA Queretaro is tenant #1. RLS policies on every table enable future multi-utility deployment without schema changes. | 2026-02 |
| ADR-009 | Agent-first architecture | AI agents as primary system actors. Claude API (Sonnet for agents, Haiku for classification). Reusable SUPRAAgent interface pattern. | 2026-02 |
| ADR-010 | Strangler Fig with parallel construction | Build new system alongside legacy. Bidirectional sync during overlap. Module-by-module cutover. Legacy cleanup runs in parallel, not as prerequisite. | 2026-02 |
| ADR-011 | Finkok as primary PAC | Most widely used PAC for SaaS CFDI integration in Mexico. REST API. Per-stamp pricing. Facturapi as documented fallback. | 2026-02 |
| ADR-012 | Chatwoot/AGORA reuse for CRM | CEA already has Chatwoot (AGORA). Reuse via webhooks instead of building custom CRM. Saves months of development. | 2026-02 |

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **CFDI** | Comprobante Fiscal Digital por Internet -- Mexican electronic invoice standard (version 4.0) |
| **PAC** | Proveedor Autorizado de Certificacion -- SAT-authorized CFDI stamping provider |
| **RLS** | Row Level Security -- PostgreSQL feature for tenant isolation |
| **LFPDPPP** | Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares -- Mexican data protection law |
| **ARCO** | Acceso, Rectificacion, Cancelacion, Oposicion -- Data subject rights under LFPDPPP |
| **CONAGUA** | Comision Nacional del Agua -- National Water Commission (federal regulator) |
| **NRW** | Non-Revenue Water -- water produced but not billed (losses + theft) |
| **Toma** | Service connection point (water meter location) |
| **SPEI** | Sistema de Pagos Electronicos Interbancarios -- Mexican real-time interbank payment system |
| **CoDi** | Cobro Digital -- QR-code-based payment system by Banco de Mexico |
| **STP** | Sistema de Transferencias y Pagos -- SPEI settlement provider |
| **Strangler Fig** | Migration pattern: new system wraps legacy, gradually replacing it module by module |
| **BullMQ** | Redis-based Node.js job queue for reliable background task processing |
| **Drizzle** | TypeScript ORM that generates types from schema and writes SQL-first queries |
| **n8n** | Open-source workflow automation platform (alternative to Camunda/Zapier) |
| **TimescaleDB** | PostgreSQL extension for time-series data (used for meter readings and events) |
| **pgvector** | PostgreSQL extension for vector similarity search (used for semantic search with AI embeddings) |

---

*This Master Action Plan is a living document. It will be updated as specialist action plans are completed and as project execution reveals new information. Version history is tracked via git.*

*Next update: When all 9 specialist action plans are completed, cross-reference their detailed task breakdowns against this master timeline and resolve any conflicts.*
