# SUPRA Water 2026 × AquaCIS 2.0 — Cross-Reference Analysis & New Insights

**Date:** 2026-02-16
**Purpose:** Compare the SUPRA Water 2026 architecture document against the existing AquaCIS 2.0 plans (10 phases, 28 reports, 4 synthesis documents) and extract actionable insights for plan improvement.

---

## Executive Summary

SUPRA Water 2026 is a complete system architecture for an AI-first CIS replacement, written as a single implementation-ready document. Comparing it against our 38-document AquaCIS 2.0 plan reveals **23 significant insights** that can strengthen our existing plans. The most impactful are:

1. **AI-agent-first architecture** — SUPRA designs the entire system around 8 Claude-powered agents that act autonomously, not as bolt-on features
2. **Radically leaner schema** — ~20 core tables vs our target ~230 (a 10x difference)
3. **Aggressive use of JSONB** — Tariff blocks, steps history, inspection data, materials — all stored as JSONB instead of separate tables
4. **Event bus without Kafka** — PostgreSQL LISTEN/NOTIFY + BullMQ replaces our Kafka dependency
5. **n8n replaces Camunda** — Low-code workflow orchestration with faster setup
6. **Multi-tenant from day one with RLS** — Row Level Security built into schema, not added later
7. **Concrete Mexican regulatory details** — SAT catalog codes, Finkok PAC, LFPDPPP/ARCO, CONAGUA report formats

---

## 1. Architecture Philosophy Comparison

| Dimension | AquaCIS 2.0 (Our Plan) | SUPRA Water 2026 | Verdict |
|-----------|------------------------|-------------------|---------|
| **Design paradigm** | API-first, event-driven, DDD | Agent-first, event-driven, API-first | SUPRA is more radical — agents are primary actors, not APIs |
| **User interaction** | PWA + WhatsApp chatbot | AI agents (Voice, WhatsApp, Web) + admin UI only for config | SUPRA reduces UI surface, maximizes AI autonomy |
| **Batch processing** | Migrating from batch to event-driven | "No more 'run the monthly billing process'" — batch is explicitly banned | SUPRA is philosophically cleaner |
| **Language/locale** | Mexico-first as P10 principle | Mexican-native as P4 — CFDI is core, not integration | SUPRA treats Mexican compliance as foundational, not an afterthought |
| **Multi-tenancy** | Not mentioned until Phase 6 | Day-one with RLS on every table | **INSIGHT**: Our plan should consider multi-tenancy earlier |

### NEW INSIGHT #1: Agent-First Architecture
Our plan treats AI as a feature layer (Phase 8 customer platform, Phase 10 analytics). SUPRA treats AI agents as the primary system actors — Voice AI answers calls, WhatsApp CX handles messages, Billing Engine generates invoices, Collections Intelligence predicts defaults. This is a fundamentally different architecture. **Recommendation:** Add an "AI Agent Layer" as a cross-cutting concern starting in Phase 5 (API modernization), not Phase 8.

### NEW INSIGHT #2: Multi-Tenancy Should Be Phase 1
SUPRA's `tenant_id` on every table and RLS policies are foundational. Our plan never addresses multi-tenancy until the cloud phase. If CEA Querétaro's system should eventually serve other municipal operators (JMAPA, JAPAC), this must be in the schema from the start. **Recommendation:** Add multi-tenant schema design to Phase 3 (DB Normalization) at minimum.

---

## 2. Technology Stack Comparison

| Component | AquaCIS 2.0 | SUPRA Water 2026 | Analysis |
|-----------|-------------|-------------------|----------|
| **Backend language** | Go + TypeScript | Node.js 22 LTS + TypeScript 5.x | SUPRA is simpler (one language). Go gives performance but doubles skill requirements |
| **Web framework** | Not specified | Express.js 5 | Mature, well-understood |
| **ORM** | Not specified | Drizzle ORM (type-safe, SQL-first) | **INSIGHT**: Drizzle is a strong choice — SQL-first aligns with DB complexity |
| **Frontend** | Vue 3 PWA (evolved AGORA) | React/Next.js admin + agents handle citizen UX | SUPRA minimizes frontend — agents replace most citizen-facing UI |
| **Workflow engine** | Camunda 8 (Zeebe) | n8n (self-hosted) | See Insight #3 |
| **Event bus** | Apache Kafka | PostgreSQL LISTEN/NOTIFY + BullMQ on Redis | See Insight #4 |
| **Cloud** | Azure Mexico Central (AKS) | GCP (Cloud Run) + Docker Compose | Azure has Mexico Central; GCP doesn't (nearest: us-south1). Our choice is better for data residency |
| **Container orchestration** | Kubernetes (AKS) | Docker Compose → Cloud Run | SUPRA starts simpler, scales later |
| **API Gateway** | Kong / Azure API Mgmt | Traefik v3 | Traefik is lighter, good for initial deployment |
| **Search** | Elasticsearch | PostgreSQL full-text (pg_trgm) | SUPRA avoids an extra dependency — pragmatic for initial scale |
| **AI/ML** | Not in core architecture | Claude API (Sonnet/Haiku) + pgvector + OpenAI embeddings | **INSIGHT**: AI is infrastructure in SUPRA |
| **CRM** | Custom-built | Chatwoot (AGORA) | SUPRA reuses existing Chatwoot — no custom CRM build |
| **PDF generation** | Not specified | Puppeteer HTML→PDF + Handlebars templates | Practical and proven |
| **Validation** | Not specified | Zod schemas (shared API + DB) | **INSIGHT**: Single validation layer is powerful |

### NEW INSIGHT #3: n8n vs Camunda Trade-off
Our plan specifies Camunda 8 (Zeebe) — a heavy enterprise BPMN engine requiring Java expertise, cluster management, and significant setup. SUPRA uses n8n, a visual workflow tool that connects via webhooks. For a water utility CIS, most workflows (billing pipeline, payment reconciliation, delinquency escalation) are sequential event chains, not complex BPMN processes. **Recommendation:** Evaluate n8n for Phase 5-6 instead of Camunda. If complex sagas with compensation are needed, Camunda can be added later. n8n covers 80% of use cases at 20% of the complexity.

### NEW INSIGHT #4: Kafka vs pg LISTEN/NOTIFY
Our plan deploys Kafka as the event backbone — a distributed streaming platform requiring ZooKeeper/KRaft, topic management, consumer groups, and operational expertise. SUPRA uses PostgreSQL LISTEN/NOTIFY for event signaling plus BullMQ on Redis for reliable task queues. At CEA Querétaro's scale (~400K accounts, not millions), this is likely sufficient. **Recommendation:** Start with pg LISTEN/NOTIFY + BullMQ in Phases 4-5. Add Kafka in Phase 6 (cloud) only if throughput demands it. This reduces operational complexity enormously.

### NEW INSIGHT #5: Drizzle ORM for Type Safety
Our plan doesn't specify an ORM. SUPRA uses Drizzle, which generates TypeScript types from the schema and writes SQL-first queries. For a database modernization project where schema accuracy is critical, this is a strong choice. **Recommendation:** If using TypeScript services, adopt Drizzle or a similar type-safe SQL-first ORM from Phase 5.

---

## 3. Database Schema Comparison

This is the most striking difference between the two approaches.

| Metric | AquaCIS 2.0 Target | SUPRA Water 2026 | Delta |
|--------|--------------------|--------------------|-------|
| **Total tables** | ~230 | ~20 core tables | **10x fewer** |
| **Audit/history** | Consolidated his* → JSONB audit_log | Single `domain_events` hypertable | SUPRA uses event sourcing |
| **Lookup tables** | Polymorphic domain_value table | JSONB configs + CHECK constraints | SUPRA eliminates lookup tables entirely |
| **Billing structure** | 37 tables (legacy-derived) | 3 tables: `invoices`, `invoice_lines`, `tariff_schedules` | SUPRA is dramatically simpler |
| **Tariff definition** | 4-level hierarchy (tarifa → subtarifa → aplictarif → concepto) | Single `tariff_schedules.blocks` JSONB column | See Insight #6 |
| **Payment tracking** | Multi-table collections model | 2 tables: `payments`, `payment_plans` | Flat and clear |
| **Work orders** | 3 clusters (orden, gestreclam, expedsif) | Single `work_orders` table with JSONB for materials/photos | Unified model |
| **Contacts/CRM** | Missing from schema | `contacts` table with AI classification fields | SUPRA adds this natively |
| **Fraud** | expedsif (64 cols) | `fraud_cases` with JSONB for inspections | Cleaner |
| **Infrastructure** | ptoserv + acometida + servicio | `tomas` + `acometidas` + `sectores_hidraulicos` | Similar, but SUPRA uses proper PostGIS |
| **GIS** | VARCHAR GPS → PostGIS (planned) | PostGIS `GEOGRAPHY(POINT, 4326)` from day one | SUPRA has this right from the start |
| **Time-series** | TimescaleDB (planned for smart meters) | TimescaleDB hypertables for `meter_readings` AND `domain_events` | SUPRA uses it for audit too |
| **Multi-tenancy** | Not in schema | `tenant_id UUID` on every table + RLS policies | SUPRA is multi-tenant native |
| **Primary keys** | Numeric sequences (legacy) | UUID v4 everywhere | SUPRA avoids sequence contention |
| **Money columns** | DOUBLE PRECISION (legacy) | `DECIMAL(12, 2)` | SUPRA is correct for financial data |
| **Booleans** | char(1) 'S'/'N' (legacy) | Native `BOOLEAN` | SUPRA is correct |

### NEW INSIGHT #6: JSONB for Tariff Blocks
Our plan preserves the legacy 4-level tariff hierarchy (tarifa → subtarifa → aplictarif → concepto), requiring ~15 tables. SUPRA stores the entire tariff structure as a JSONB `blocks` array:
```json
[
  {"from_m3": 0, "to_m3": 10, "price_per_m3": 5.50, "fixed_charge": 45.00},
  {"from_m3": 10, "to_m3": 20, "price_per_m3": 8.75, "fixed_charge": 0}
]
```
This is queryable, versionable (new schedule = new row), and eliminates an entire cluster of join-heavy queries. **Recommendation:** In Phase 3 (DB Normalization) and Phase 7 (Billing Modernization), adopt JSONB for tariff block definitions instead of relational decomposition. Keep the `tariff_schedules` table but store blocks as JSONB.

### NEW INSIGHT #7: Event Store Replaces History Tables
Our plan consolidates 230 `his*` tables into a JSONB `audit_log` table. SUPRA goes further — it uses a `domain_events` TimescaleDB hypertable as both audit trail AND event sourcing store. Every state change (`contract.created`, `invoice.generated`, `payment.received`) is an immutable event with JSONB payload. This gives you audit, event replay, temporal queries, AND event-driven architecture from a single table. **Recommendation:** Replace the Phase 2 `audit_log` table design with a `domain_events` hypertable. This is architecturally superior.

### NEW INSIGHT #8: Our ~230 Table Target May Be Too High
SUPRA achieves full CIS functionality with ~20 tables. Our target is ~230. While some difference is expected (our plan preserves more legacy compatibility), a 10x gap suggests we may be over-preserving legacy structure. **Recommendation:** During Phase 3, evaluate whether the target schema can be reduced to ~50-80 tables by applying SUPRA's JSONB-heavy approach to: (a) work order materials/photos, (b) delinquency step history, (c) fraud case inspections, (d) tariff definitions, (e) configuration values.

### NEW INSIGHT #9: Generated Columns for Address Normalization
SUPRA uses PostgreSQL GENERATED ALWAYS AS columns for address text normalization:
```sql
normalized_text TEXT GENERATED ALWAYS AS (
  LOWER(COALESCE(street, '') || ' ' || COALESCE(exterior_number, '') || ' ' ||
  COALESCE(colonia, '') || ' ' || COALESCE(zip_code, ''))
) STORED
```
Combined with `gin_trgm_ops` index, this enables fuzzy address search without application logic. **Recommendation:** Add generated columns for address search in Phase 3.

---

## 4. AI Agent Architecture (Major Gap in Our Plan)

SUPRA defines 8 AI agents as core system components. Our plan mentions AI only tangentially in Phase 8 (customer chatbot) and Phase 10 (analytics). This is the biggest strategic gap.

| Agent | SUPRA Definition | Our Plan Coverage | Gap |
|-------|-----------------|-------------------|-----|
| **Voice AI** | Twilio + Claude, handles inbound calls in Mexican Spanish | Not covered | **FULL GAP** |
| **WhatsApp CX** | WhatsApp Business API + Claude, resolves 60% of queries | Phase 8 (chatbot) | Partially covered, but not AI-agent-powered |
| **Billing Engine** | Claude Haiku processes readings → invoices | Phase 7 (billing modernization) | Our plan is code-first, not agent-first |
| **Anomaly Detection** | Statistical + ML on meter readings | Phase 9 (smart metering) | Covered but later in timeline |
| **Collections Intelligence** | Predictive scoring + automated sequences | Phase 7 (billing) | **Partially covered** — missing predictive model |
| **Field Workforce** | Auto-assignment, route optimization | Phase 4/5 (work orders API) | Work order API exists, but no intelligence |
| **Fraud Detection** | ML pattern analysis, geospatial clustering | Phase 10 (analytics) | Very late in our plan |
| **Regulatory Compliance** | Auto-generates CONAGUA/SEMARNAT reports | Not covered | **FULL GAP** |

### NEW INSIGHT #10: Voice AI Is a Major Differentiator
SUPRA defines a Twilio-powered Voice AI agent that handles inbound calls in natural Mexican Spanish. For a water utility where many customers are elderly or lack digital access, this is critical. Our plan has no voice channel at all. **Recommendation:** Add Voice AI to Phase 8 (Customer Platform) — Twilio integration, Claude-powered conversation, account lookup tools.

### NEW INSIGHT #11: Collections Intelligence Agent
SUPRA's collections agent has a full scoring model (9 features → probability of payment within 30 days) and differentiated collection sequences by risk level (low/medium/high/vulnerable). The vulnerable category explicitly blocks automatic service disconnection. Our plan mentions collections but lacks this predictive intelligence. **Recommendation:** Add a Collections Intelligence module to Phase 7 with: (a) scoring model, (b) automated sequence execution, (c) vulnerability protection.

### NEW INSIGHT #12: Regulatory Compliance Agent
SUPRA automates CONAGUA monthly extraction reports, quarterly efficiency metrics, SEMARNAT discharge reports, and state-level service KPIs. Our plan never addresses regulatory reporting automation. **Recommendation:** Add regulatory report automation to Phase 10 (GIS, Analytics & Go-Live).

### NEW INSIGHT #13: Agent Architecture Pattern
SUPRA defines a clean `SUPRAAgent` interface with triggers (event, schedule, webhook, whatsapp, voice, manual), tools (database functions), system prompts, and model selection. This is a reusable pattern. **Recommendation:** Define an agent architecture pattern in Phase 5 or 6, then implement individual agents in subsequent phases.

---

## 5. Integration Layer Comparison

| Integration | AquaCIS 2.0 | SUPRA Water 2026 | Insight |
|-------------|-------------|-------------------|---------|
| **CFDI 4.0** | Mentioned, no PAC specified | Finkok PAC with full SAT catalog codes | **INSIGHT #14** |
| **Payments - OXXO** | Conekta mentioned | Conekta with barcode_128 reference format, 30-day expiration | More specific |
| **Payments - SPEI** | SPEI mentioned | CLABE concentradora + unique reference per invoice, STP bank | More specific |
| **Payments - CoDi** | Mentioned | QR code generation, auto-reconciliation | Similar |
| **Payments - Cards** | Conekta | Conekta or Stripe, MXN currency | Similar |
| **Payments - Domiciliación** | Not detailed | CLABE account, monthly schedule | **INSIGHT #15** |
| **WhatsApp** | Business API mentioned | 360dialog or Meta API, 5 pre-approved templates, full flow | Much more detailed |
| **Voice** | Not covered | Twilio Programmable Voice + Claude | **FULL GAP** |
| **Email** | Not specified | AWS SES or SendGrid | Simple |
| **SMS** | Not specified | Twilio SMS | Simple |
| **CRM** | Custom | Chatwoot (existing AGORA platform) | **INSIGHT #16** |

### NEW INSIGHT #14: SAT Catalog Codes Are Critical
SUPRA specifies exact SAT catalog codes for CFDI:
- Water: `10171500`
- Alcantarillado: `72151802`
- Saneamiento: `72151801`
- Unit keys: MTQ (m³), E48 (service), H87 (piece)
- Payment methods: 01 (cash), 03 (transfer), 28 (debit), 04 (credit)
- Fiscal regimes: 603 (government), 601 (general), 616 (no obligations)
- CFDI uses: G03, S01, P01

Our Phase 7 plan mentions CFDI but lacks these specifics. **Recommendation:** Add SAT catalog mapping table to Phase 7 implementation spec.

### NEW INSIGHT #15: Domiciliación Bancaria (Bank Direct Debit)
SUPRA includes direct debit (domiciliación) as a first-class payment channel with CLABE account storage and monthly scheduling. Our plan doesn't detail this. For large commercial and government accounts, domiciliación is a primary payment method in Mexico. **Recommendation:** Add direct debit support to Phase 7 payment gateway design.

### NEW INSIGHT #16: Reuse AGORA/Chatwoot Instead of Building CRM
Our Phase 8 plans a custom customer engagement platform. SUPRA reuses the existing Chatwoot installation (which CEA Querétaro already has as AGORA) as the CRM backbone, connecting AI agents via webhooks. This saves months of CRM development. **Recommendation:** Evaluate Chatwoot/AGORA as the CRM foundation in Phase 8 instead of building custom.

---

## 6. Mexican Regulatory Compliance (Deep Gap)

SUPRA has an entire section on Mexican regulatory compliance. Our plan mentions it but lacks specifics.

| Requirement | SUPRA Coverage | Our Plan Coverage |
|-------------|---------------|-------------------|
| **CFDI 4.0 structure** | Full emisor/receptor/concepto field mapping | Mentioned but no field mapping |
| **IVA rules for water** | Domestic = exempt (tasa 0%), commercial = 16% | Not specified |
| **Complemento de pago** | Required for PPD payment form | Not mentioned |
| **LFPDPPP (data protection)** | Full ARCO rights, privacy notice, 72-hour breach notification | Not mentioned |
| **CONAGUA reporting** | Monthly extraction, quarterly efficiency | Not mentioned |
| **SEMARNAT discharge** | Wastewater discharge reporting | Not mentioned |
| **RFC público general** | XAXX010101000 for unregistered customers | Not mentioned |
| **Fiscal regime codes** | 603 (gobierno), 601 (general), 616 (sin obligaciones) | Not mentioned |

### NEW INSIGHT #17: LFPDPPP/ARCO Compliance Is Legally Required
Mexico's Federal Law for Protection of Personal Data (LFPDPPP) requires:
- Privacy notice (aviso de privacidad) on all data collection
- ARCO rights: Access, Rectification, Cancellation, Opposition
- 72-hour data breach notification
- Data retention policies

Our plan never addresses this. For a system handling RFC, CURP, addresses, and payment data of ~400K citizens, this is a legal compliance requirement, not optional. **Recommendation:** Add LFPDPPP compliance as a cross-cutting requirement starting Phase 3 (data architecture) and implemented in Phase 5 (API layer) and Phase 8 (customer platform).

### NEW INSIGHT #18: IVA Exemption Rules for Water
Domestic water service is IVA-exempt (tasa 0%) in Mexico, but commercial water service has 16% IVA. This affects invoice line calculations, CFDI generation, and reporting. Our billing phase needs this tax logic. **Recommendation:** Add IVA rules to Phase 7 billing engine specification.

---

## 7. Schema Design Patterns from SUPRA

### NEW INSIGHT #19: Mexican Address Structure
SUPRA's `addresses` table has proper Mexican address fields:
- `exterior_number` / `interior_number` (Mexican addresses split these)
- `colonia` (neighborhood — critical for Mexican addresses)
- `inegi_cve_loc` (INEGI locality key for government integration)
- `sepomex_validated` (postal code validation via SEPOMEX)

Our plan's address normalization in Phase 3 should adopt this structure.

### NEW INSIGHT #20: Vulnerability Tracking
SUPRA adds `vulnerable: boolean` and `vulnerability_type: 'adulto_mayor' | 'discapacidad' | 'pobreza'` to the person record, and the Collections Intelligence agent explicitly protects vulnerable accounts from automatic disconnection. This is both humane and often legally required for Mexican water utilities. **Recommendation:** Add vulnerability flags to the person/customer schema in Phase 3.

### NEW INSIGHT #21: Meter Reading Source Tracking
SUPRA's `meter_readings.source` field tracks: `smart_meter`, `manual_field`, `manual_office`, `autolectura`, `telelectura`, `estimated`, `photo`, `api`. Our plan combines manual and smart meter readings but doesn't distinguish sources. This matters for quality tracking and audit. **Recommendation:** Add source tracking to the meter readings schema in Phase 9.

---

## 8. Timeline & Approach Comparison

| Dimension | AquaCIS 2.0 | SUPRA Water 2026 |
|-----------|-------------|-------------------|
| **Total duration** | 36 months (10 phases) | 24 months (4 quarters) |
| **Team size** | 2.5-16 FTEs varying by phase | Not specified (implied smaller) |
| **DB approach** | Clean legacy DB first, then build | Build new, sync bidirectionally, cut over |
| **Migration** | 6-phase DB reduction + Strangler Fig APIs | Strangler Fig only — build fresh DB |
| **First value delivery** | Phase 1 (DB cleanup) — internal only | Phase 1 (billing engine + WhatsApp) — citizen-facing |

### NEW INSIGHT #22: Build New, Don't Clean Old
Our plan spends Phases 1-3 (8 months) cleaning the legacy database before building anything new. SUPRA builds a fresh schema from day one and syncs data bidirectionally during migration. This delivers citizen-facing value much faster. **Recommendation:** Consider running database cleanup (Phases 1-3) in parallel with new system construction, rather than sequentially. The Strangler Fig pattern works for the database layer too — build the new schema, set up sync, migrate domain by domain.

### NEW INSIGHT #23: WhatsApp Templates Need Pre-Approval
SUPRA specifies 5 WhatsApp Business API message templates (invoice_ready, payment_reminder, payment_confirmation, leak_report_received, service_cut_warning) that must be pre-approved by Meta. This approval process takes 1-4 weeks. **Recommendation:** Start WhatsApp template submission in Phase 4-5 (not Phase 8) to have them approved by the time the customer platform launches.

---

## 9. Recommendations Summary (Priority Ordered)

### HIGH PRIORITY (Revise Existing Plan)

| # | Insight | Affected Phases | Action |
|---|---------|----------------|--------|
| 1 | AI-agent-first architecture | 5, 6, 7, 8, 10 | Add AI Agent Layer as cross-cutting architecture, not a late feature |
| 6 | JSONB for tariff blocks | 3, 7 | Replace relational tariff decomposition with JSONB blocks |
| 7 | Event store replaces history tables | 2, 3 | Use `domain_events` hypertable instead of `audit_log` |
| 4 | pg LISTEN/NOTIFY + BullMQ instead of Kafka | 4, 5, 6 | Start with lighter event bus, add Kafka only if needed |
| 17 | LFPDPPP/ARCO compliance | 3, 5, 8 | Add data protection as cross-cutting legal requirement |
| 22 | Build new schema in parallel with cleanup | 1-3, 5-6 | Overlap new system construction with legacy cleanup |
| 8 | Target ~50-80 tables, not ~230 | 3 | Re-evaluate schema target with JSONB-heavy approach |

### MEDIUM PRIORITY (Enhance Existing Plan)

| # | Insight | Affected Phases | Action |
|---|---------|----------------|--------|
| 3 | n8n vs Camunda evaluation | 5, 6 | Evaluate n8n as lighter alternative for most workflows |
| 10 | Voice AI channel | 8 | Add Twilio Voice AI to customer platform |
| 11 | Collections Intelligence agent | 7 | Add predictive scoring + automated sequences |
| 14 | SAT catalog codes for CFDI | 7 | Add specific SAT codes to billing spec |
| 16 | Reuse Chatwoot/AGORA as CRM | 8 | Evaluate instead of custom CRM build |
| 18 | IVA exemption rules for water | 7 | Add tax logic to billing engine |
| 20 | Vulnerability tracking | 3, 7 | Add vulnerable person flags and protections |

### LOWER PRIORITY (Useful Additions)

| # | Insight | Affected Phases | Action |
|---|---------|----------------|--------|
| 2 | Multi-tenancy from Phase 1 | 3, 6 | Add tenant_id + RLS if multi-utility is in roadmap |
| 5 | Drizzle ORM for TypeScript services | 5, 6 | Evaluate for type-safe SQL in new services |
| 9 | Generated columns for address search | 3 | Add to address normalization task |
| 12 | Regulatory compliance agent | 10 | Add CONAGUA/SEMARNAT report automation |
| 13 | Agent architecture pattern | 5, 6 | Define reusable agent interface early |
| 15 | Domiciliación bancaria | 7 | Add direct debit as payment channel |
| 19 | Mexican address structure | 3 | Adopt colonia/INEGI/SEPOMEX fields |
| 21 | Meter reading source tracking | 9 | Add source field to readings schema |
| 23 | WhatsApp template pre-approval | 4-5 | Start template submission early |

---

## 10. What Our Plan Does Better Than SUPRA

SUPRA is an architecture document, not a transformation plan. Our approach has several advantages:

1. **Deep current-state analysis.** 28 reports across 9 database domains and 7 API domains give us understanding SUPRA lacks — we know exactly which 2,144 `tmp_deuda_*` tables exist, which SOAP operations have bugs, and where the security vulnerabilities are.

2. **Risk-managed migration.** Our phased approach (emergency cleanup → consolidation → normalization → API modernization → cloud) manages risk in a way SUPRA's "build new" approach doesn't. SUPRA assumes you can build in parallel with legacy running, but doesn't detail how to keep both systems consistent during the 24-month overlap.

3. **Realistic infrastructure choices.** Our plan uses Azure Mexico Central (Querétaro data center). SUPRA specifies GCP Cloud Run, but GCP has no Mexico data center — the nearest is US South. For a government water utility handling citizen PII, data residency in Mexico is likely a compliance requirement.

4. **Smart metering depth.** Our Phase 9 has detailed LoRaWAN specifications (915 MHz ISM, Kamstrup flowIQ 2200, ChirpStack), pilot sizing (10K meters), and NRW reduction projections. SUPRA mentions smart meters but doesn't spec the IoT infrastructure.

5. **GIS depth.** Our Phase 10 has PostGIS, GeoServer, QGIS, EPANET hydraulic modeling. SUPRA uses PostGIS for point geometry but doesn't address network topology, pressure zones, or hydraulic modeling.

6. **Cost modeling.** Our plan has detailed cost estimates ($3.5-5K/month cloud, $1.8-2.7M development, $1.8M pilot). SUPRA has no cost section.

7. **Effort estimation.** Our plan has hours/FTEs per phase. SUPRA has none.

---

## 11. Recommended Plan Amendments

Based on this analysis, I recommend the following amendments to the Master Plan:

### Amendment A: Add "Phase 0.5 — AI Agent Architecture & Fresh Schema Design" (Month 1, parallel with Phase 1)
- Design the agent interface pattern (triggers, tools, prompts, models)
- Design the target schema using SUPRA's JSONB-heavy approach (~50-80 tables instead of ~230)
- Define the event bus architecture (pg LISTEN/NOTIFY + BullMQ, Kafka optional)
- Set up Drizzle ORM with TypeScript type generation
- Define multi-tenancy approach (if needed)

### Amendment B: Revise Phase 3 Target Schema
- Reduce target from ~230 to ~50-80 tables
- Use JSONB for: tariff blocks, audit events, step histories, inspection data, materials, photos, configuration
- Use `domain_events` hypertable instead of `audit_log`
- Add generated columns for search
- Add vulnerability flags to person schema
- Add Mexican address structure fields

### Amendment C: Revise Phase 5 Event Architecture
- Replace Kafka with pg LISTEN/NOTIFY + BullMQ as default
- Add Kafka as optional "Phase 6 upgrade" if throughput demands it
- Evaluate n8n as workflow orchestration alternative to Camunda

### Amendment D: Revise Phase 7 Billing Integration Specifics
- Add SAT catalog codes for water utility CFDI
- Add IVA exemption rules (domestic exempt, commercial 16%)
- Add Finkok PAC as recommended PAC provider
- Add domiciliación bancaria payment channel
- Add CFDI complemento de pago for PPD

### Amendment E: Revise Phase 8 Customer Platform
- Add Voice AI (Twilio + Claude) as primary channel
- Add Chatwoot/AGORA reuse evaluation instead of custom CRM
- Add LFPDPPP/ARCO compliance implementation
- Start WhatsApp template pre-approval in Phase 5

### Amendment F: Add Collections Intelligence to Phase 7
- Predictive scoring model (9 features → payment probability)
- Automated collection sequences by risk tier
- Vulnerability protection rules (no auto-disconnection)

### Amendment G: Add Regulatory Compliance to Phase 10
- CONAGUA monthly/quarterly report automation
- SEMARNAT discharge reporting
- State-level service KPI generation

---

## Appendix: Source Mapping

| SUPRA Section | Our Report Equivalent | Key Difference |
|---------------|----------------------|----------------|
| §1 System Overview | MASTER_PLAN_INDEX.md | SUPRA is more opinionated about approach |
| §2 Architecture | NEXTGEN_ARCHITECTURE_BLUEPRINT.md | SUPRA adds AI layer; our plan has more layers |
| §3 Database Schema | DATABASE_OPTIMIZATION_PLAN.md, A1-A9 reports | SUPRA: 20 tables. Ours: 230 target. 10x gap. |
| §4 Domain Modules | Phase plans 4-10 | SUPRA has TypeScript pseudocode for each module |
| §5 AI Agents | Phase 8 (partial) | **Major gap** — SUPRA has 8 agents; we have 1 chatbot |
| §6 API Spec | INTEGRATION_ROADMAP.md, B1-B7 reports | SUPRA has complete REST spec; we have SOAP analysis |
| §7 Integration Layer | Phase 7 (billing), Phase 8 (payments) | SUPRA has more Mexican integration specifics |
| §8 Regulatory | Not covered | **Full gap** in our plan |
| §9 Infrastructure | Phase 6 (cloud) | Our plan is Azure; SUPRA is GCP |
| §10 Migration | Phase plans 1-5 | Both use Strangler Fig; SUPRA builds fresh first |
| §11 Phases | MASTER_PLAN_INDEX.md | 36 months (ours) vs 24 months (SUPRA) |
| §12 File Structure | Not in our plan | SUPRA has complete project scaffolding |
