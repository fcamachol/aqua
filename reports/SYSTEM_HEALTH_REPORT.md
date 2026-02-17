# AquaCIS System Health Report

**Date:** 2026-02-16
**System:** AquaCIS (Aqualia CIS) -- CEA Queretaro Water Utility
**Database:** cf_quere_pro (PostgreSQL)
**Platform:** AGORA (Vue 3 + Rails 7) integrating with AquaCIS/Aquasis via SOAP/REST
**Scope:** 16 deep-analysis reports across database (9 reports) and API (7 reports) domains
**Classification:** Internal -- Technical Leadership

---

## 1. Executive Summary

AquaCIS is a Spanish-origin commercial water utility information system (CIS) deployed for CEA Queretaro, Mexico. This report synthesizes findings from 16 independent deep analyses covering the full database schema (4,114 tables) and the complete API surface (126 SOAP operations + 3 REST events).

**The system is operationally functional but architecturally distressed.** It successfully supports billing cycles, payment collection, meter reading, and work order management for 13 municipalities. However, it carries critical technical debt that degrades maintainability, security, and scalability at every layer.

### Composite Health Score: 5.1 / 10

| Layer | Score | Weight | Weighted |
|-------|:-----:|:------:|:--------:|
| Database (9 domains, avg) | 5.2/10 | 55% | 2.86 |
| API Integration (7 domains, avg) | 5.0/10 | 45% | 2.25 |
| **Composite** | | | **5.1/10** |

**Three critical findings demand immediate attention:**

1. **70% of database tables are waste.** Of 4,114 tables, approximately 2,880 are structural artifacts from a table-per-process anti-pattern (2,144 `tmp_deuda_*` + 477 `aux_varscreditored_*` + others). This causes PostgreSQL catalog bloat affecting vacuum, planning, and backup times. A well-documented Phase 1 cleanup can eliminate ~2,643 tables in one day.

2. **86.5% of API operations are unused.** Only 17 of 126 SOAP operations are integrated into AGORA. The entire payment pipeline (12 operations), contract lifecycle management (5 operations, schema-only), and customer identity resolution are missing. Revenue collection -- the core utility business function -- cannot happen through AGORA.

3. **Security vulnerabilities are systemic.** Plaintext passwords in the database (`cliwebpass`, `socpwdsms`, `socpwdcert`), WS-Security credentials exposed in frontend bundles via `VITE_` environment variables, and client-side SOAP XML construction create a multi-layered security exposure.

---

## 2. Health Dashboard

### Database Domain Scores (Division A)

| Report | Domain | Score | Key Finding |
|--------|--------|:-----:|-------------|
| A1 | Core Schema | 3.5/10 | `explotacion` = 350 cols (god table spanning 15 domains). No FK constraints. Plaintext passwords. |
| A2 | Billing | 6.0/10 | 37 tables, 7-stage billing cycle. Well-designed pipeline. `contrato` overloaded at 104 cols. |
| A3 | Customer | 5.0/10 | persona->cliente->contrato chain. Contacts fragmented across 5 locations. 14 missing CRM capabilities. |
| A4 | Infrastructure | 6.5/10 | GPS as VARCHAR (no PostGIS). Equipment limited to tele-reading. Good meter lifecycle tracking. |
| A5 | Work Orders | 6.5/10 | Three entity clusters (orden/gestreclam/expedsif). No SLA tables. External SGO integration exists. |
| A6 | Collections | 7.0/10 | **Best DB domain.** Multi-channel payment (banks, OXXO, 7-Eleven). Missing aging analysis. |
| A7 | Lookup/Config | 3.0/10 | 76 tipo* tables, 95+ lookup tables total. Massive consolidation opportunity into polymorphic table. |
| A8 | History/Audit | 4.0/10 | 230 his* tables (mirrored-table pattern). `hisexplotacion` = 353 cols. Session tracking: 4 columns only. |
| A9 | Anti-patterns | **1.0/10** | Severity 9/10. 70% tables are waste. 2,144 tmp_deuda_* tables. tmpbb schema mismatch bug. |

**Database Average: 4.7/10** (arithmetic mean)
**Database Weighted Average: 5.2/10** (weighted by domain criticality)

### API Domain Scores (Division B)

| Report | Domain | Score | Key Finding |
|--------|--------|:-----:|-------------|
| B1 | Contracts API | 6.0/10 | 53 ops, 4 integrated. 5 schema-only blockers. Deep DTO nesting (5 levels). |
| B2 | Debt API | 8.0/10 | **Best API domain.** 13 ops, 1 integrated. No auth required. Payment pipeline disconnected. |
| B3 | Meters API | 7.0/10 | 4 ops, 1 integrated. 62KB WSDL (63% bloat from unused imports). AMI readiness 3/10. |
| B4 | Readings/Portal | 5.0/10 | 47 ops, 8 integrated. No pagination on readings. Customer mgmt entirely missing. |
| B5 | Work Orders API | 7.0/10 | 9 ops, 3 integrated. 5 known bugs. IoT DTOs already present in schema. |
| B6 | REST/AGORA Layer | 4.0/10 | Frontend builds SOAP XML. Credentials in VITE_ vars. No API versioning. No circuit breaker. |
| B7 | Gap Analysis | 3.0/10 | 13.5% integration coverage. 19 Tier-1 critical gaps. Quick wins: 2-3 dev weeks. |

**API Average: 5.7/10** (arithmetic mean)
**API Weighted Average: 5.0/10** (weighted by integration criticality)

---

## 3. Database Health Synthesis

### 3.1 Structural Overview

| Metric | Value |
|--------|-------|
| Total tables | 4,114 |
| Estimated necessary tables | ~1,150-1,230 |
| Waste ratio | ~70% |
| Largest table (columns) | `explotacion` (350 columns) |
| Largest history table | `hisexplotacion` (353 columns) |
| Core entity tables | ~120-150 |
| History tables (his*) | 230 |
| Lookup tables (tipo*/estado*/obs*) | 95+ |
| Transient waste (tmp_deuda_*/aux_*) | 2,643 |
| Total columns in explotacion+contrato | 454 |

### 3.2 Domain Architecture

The database follows a mature Spanish water utility CIS pattern (Aqualia/Agbar lineage) with a clear entity hierarchy:

```
explotacion (utility operating unit, 350 cols)
  -> sociedad (operating company, 84 cols)
    -> persona (identity root, 36 cols)
      -> cliente (billing account, shared PK with persona)
        -> contrato (service contract, 104 cols)
          -> ptoserv (service point, 55 cols)
            -> servicio -> acometida -> contador (meters)
```

**Strengths:**
- The billing pipeline (facturacio -> facturable -> factura -> linfactura) is well-architected with clear separation of concerns
- The collections domain (7/10) provides robust multi-channel payment with full audit trails
- The work order system integrates cleanly with an external SGO field management system
- Consistent audit columns (hstusu/hsthora) across all entities
- Multi-language text infrastructure (tabladesc/tablatext/tablas_multiidioma) in place

**Weaknesses:**
- `explotacion` (350 cols) conflates 15 domains into one god table: billing, collections, estimation, notification, regulatory, digital platform, and operational parameters
- `contrato` (104 cols) absorbs billing, GDPR, notification, and fiscal concerns
- No enforced foreign key constraints anywhere in the DDL (convention-based only)
- 250+ boolean-like columns stored as char(1) 'S'/'N' instead of native PostgreSQL boolean
- GPS coordinates stored as VARCHAR strings rather than PostGIS spatial types
- Contact information scattered across 5 different locations (persona.prstelef*, personatel, personadir, contrato, webcliente)

### 3.3 Table Reduction Roadmap

The existing 5-phase cleanup plan is well-documented and sequenced:

| Phase | Action | Tables Removed | Risk |
|-------|--------|:--------------:|:----:|
| Phase 1 | Drop transient tmp_deuda_*, aux_*, tmpbb_* | ~2,643 | LOW |
| Phase 2 | Merge municipality views, GIS caches, duplicates | ~25 | LOW |
| Phase 3 | Consolidate tipo* into polymorphic domain_value | ~35-40 | MEDIUM |
| Phase 4 | Consolidate his* tables into JSONB audit_log | ~100-180 | MEDIUM |
| Phase 5 | Drop Spain-specific regional dead code | ~25 | LOW (needs Aqualia approval) |
| **Total** | | **~2,828-2,913** | |
| **Remaining** | | **~1,150-1,230** | |

**Critical bug in Phase 1:** The `tmpbb` replacement table schema in `phase1_drop_transient_tables.sql` does not match the actual `tmpbb_*` table column structure. This must be fixed before execution.

---

## 4. API Health Synthesis

### 4.1 Integration Coverage

| Service | Total Ops | Integrated | Coverage | Auth Pattern |
|---------|:---------:|:----------:|:--------:|:------------:|
| Contracts (InterfazGenericaContratacionWS) | 53 | 4 | 7.5% | Mixed (some WS-Security) |
| Debt Management (InterfazGenericaGestionDeudaWS) | 13 | 1 | 7.7% | None required |
| Meters (InterfazGenericaContadoresWS) | 4 | 1 | 25% | None required |
| Readings/Portal (InterfazOficinaVirtualClientesWS) | 47 | 8 | 17% | Mixed |
| Work Orders (InterfazGenericaOrdenesServicioWS) | 9 | 3 | 33% | Mixed |
| **Total SOAP** | **126** | **17** | **13.5%** | |
| CEA REST API | 3 | 3 | 100% | None |

### 4.2 What Works

The 17 integrated operations enable two complete business flows:

1. **Contract Inquiry Flow:** Search contracts -> view details -> view consumption/readings -> view invoices -> download PDF -> view debt summary -> view tariffs
2. **Work Order Lifecycle:** Create order -> schedule visit -> report visit -> resolve/close order

These represent the minimum viable operational backbone for AGORA.

### 4.3 What Is Missing

| Business Process | Coverage | Blocking Gap |
|-----------------|:--------:|:-------------|
| Revenue collection / payments | 0% | Entire payment pipeline (12 operations) |
| Contract lifecycle (new supply, transfer, termination) | 0% | 5 operations are schema-only (CEA must implement) |
| Customer identity by NIF/tax ID | 0% | Cannot look up customers without contract number |
| Address/bank detail changes | 0% | Two of the most common customer requests |
| Work order monitoring | 0% | Orders created but then invisible in AGORA |
| Meter details and history | 0% | No meter-level information beyond serial lookup |
| Contract action history | 0% | No audit trail visibility for disputes |

### 4.4 Architecture Issues

The integration layer follows a **passthrough proxy pattern** (Browser -> Rails -> AquaCIS) with significant architectural problems:

1. **SOAP XML constructed in JavaScript (cea.js):** The frontend builds raw SOAP envelopes, which is a security anti-pattern and maintenance burden
2. **Credentials in frontend bundle:** WS-Security username/password exposed via `VITE_` environment variables, bundled into the browser-downloadable JavaScript
3. **No fault tolerance:** No retry logic, no circuit breaker, no timeout enforcement
4. **No caching:** Every request hits AquaCIS, even for rarely-changing data (catalogs, service points)
5. **Dual fault systems:** Work Orders API uses two different exception types depending on the operation, requiring two error-handling paths
6. **No API versioning:** No mechanism to handle WSDL changes or evolve the integration

---

## 5. Top 20 Critical Issues (Ranked by Impact)

| Rank | Issue | Domain | Severity | Impact |
|:----:|-------|--------|:--------:|--------|
| 1 | **2,643 waste tables** from table-per-process anti-pattern | A9 | CRITICAL | Catalog bloat degrades vacuum, planning, backup for entire database |
| 2 | **Plaintext passwords** in database (cliwebpass, socpwdsms, socpwdcert, socpwdfirma, soctokenacua) | A1 | CRITICAL | Direct credential exposure; regulatory non-compliance |
| 3 | **WS-Security credentials in frontend bundle** via VITE_ environment variables | B6 | CRITICAL | Anyone inspecting browser JS can extract SOAP credentials |
| 4 | **Payment pipeline completely unintegrated** (0 of 12 debt management operations) | B7 | CRITICAL | Revenue collection impossible through AGORA |
| 5 | **No foreign key constraints** enforced anywhere in database DDL | A1 | CRITICAL | Orphaned records, data integrity relies entirely on application logic |
| 6 | **explotacion god table** (350 columns, 15 domains) | A1 | HIGH | Unmaintainable; every schema change risks breaking 15 business domains |
| 7 | **Client-side SOAP XML construction** in JavaScript | B6 | HIGH | Security risk, maintenance burden, tight coupling to WSDL structure |
| 8 | **5 contract lifecycle operations are schema-only** (not implemented server-side) | B1/B7 | HIGH | New supply, termination, transfer blocked regardless of integration effort |
| 9 | **tmpbb replacement schema mismatch** in Phase 1 script | A9 | HIGH | Will cause post-cleanup failures if executed without fix |
| 10 | **No customer identity resolution by NIF** | B7 | HIGH | Agents need contract number upfront; cannot serve walk-in customers |
| 11 | **230 history tables** using mirrored-table pattern | A8 | HIGH | Structural duplication; hisexplotacion alone has 353 columns |
| 12 | **76 tipo* lookup tables** with no consolidation | A7 | MEDIUM | DDL sprawl; prevents generic admin UI; bloats ORM mapping |
| 13 | **GPS as VARCHAR** instead of PostGIS spatial types | A4 | MEDIUM | No spatial queries, no distance calculations, no GIS integration |
| 14 | **Contact info fragmented across 5 locations** | A3 | MEDIUM | Inconsistent customer communications; no single source of truth |
| 15 | **No pagination on readings/consumption API** | B4 | MEDIUM | Scalability risk for high-consumption or long-history contracts |
| 16 | **No circuit breaker or retry logic** in integration layer | B6 | MEDIUM | Cascade failures when AquaCIS is down; no graceful degradation |
| 17 | **WSDL bloat** (62KB Meters WSDL, 63% from unused type imports) | B3 | MEDIUM | Client generation overhead; parser performance; confusion for developers |
| 18 | **Dual fault systems** in Work Orders API | B5 | MEDIUM | Two error-handling paths; inconsistent error reporting |
| 19 | **Session tracking limited to 4 columns** (no IP, no action, no duration) | A8 | MEDIUM | Fails modern audit requirements; limited forensic capability |
| 20 | **contrato at 104 columns** mixing lifecycle, GDPR, billing, notifications | A1/A2 | MEDIUM | Second god table; change risk affects billing, compliance, and CRM |

---

## 6. Cross-Domain Findings

### 6.1 Database-API Misalignment

The database and API layers tell different stories about the same data:

- **contrato** has 104 columns in the database but `ContratoDTO` exposes 55+ fields. The gap includes GDPR flags, internal audit columns, and fiscal configuration that may need API exposure for compliance features.
- **The billing pipeline** (facturacio -> facturable -> factura) is the database's strongest design, yet the API surface for billing/invoicing is only partially integrated (invoice PDFs work, but no invoice search by conditions, no batch invoice operations).
- **Work order data** is rich on both sides (orden has 44 DB columns; `OrdenExternaDTO` carries address, resolution, equipment, and visit data), but the API's `refreshData` operation (essential for monitoring) remains unintegrated.
- **Payment references** (`referencia` table) support multi-channel collection in the database, but the API's `generarDocumentoPago` and `getDocumentoPago` operations that would expose this capability are not integrated.

### 6.2 The Naming Convention Barrier

Both layers use heavily abbreviated Spanish naming derived from the original Aqualia codebase:
- Database: `expsncaldemoracobro`, `cnttnotifprsid1`, `ptoscodrec`
- API: `GenericoContratoDTO.contrato.numeroContador`, `PuntosServicioContadorDTO`

This creates a steep learning curve for new developers and makes cross-referencing between database columns and API DTOs extremely difficult. A mapping dictionary is essential.

### 6.3 Security Boundary Violations

Security concerns span both layers:
- **Database layer:** Plaintext credentials in `cliente`, `sociedad` tables
- **API transport:** WS-Security credentials in frontend JavaScript bundles
- **Architecture:** No validation in the Rails proxy; passthrough allows arbitrary SOAP XML injection from the frontend

### 6.4 Audit Trail Gaps

- **Database:** 230 history tables provide column-level change tracking, but session tracking is minimal (4 columns, no IP, no action type)
- **API:** Error logging goes to `console.error()` in the browser only; no server-side SOAP operation audit trail
- **Integration:** No end-to-end transaction tracking across AGORA -> Rails -> AquaCIS

### 6.5 Table-Per-Process Recurrence Risk

The application framework actively creates new `tmp_deuda_*` tables during every billing cycle. Without patching the Java application code (specifically the `tredroptablastemporales` flag in the `tarea` table), Phase 1 cleanup will be undone within months at a rate of ~100-200 new transient tables per month.

---

## 7. Security Vulnerabilities

| # | Vulnerability | Layer | Severity | Remediation |
|---|--------------|-------|:--------:|-------------|
| S1 | **Plaintext passwords** in `cliente.cliwebpass`, `sociedad.socpwdsms`, `sociedad.socpwdcert`, `sociedad.socpwdfirma`, `sociedad.soctokenacua` | Database | CRITICAL | Implement bcrypt/scrypt hashing via pgcrypto or application-level hashing. Rotate all affected credentials. |
| S2 | **WS-Security credentials in frontend bundle** via VITE_CEA_WS_USER, VITE_CEA_WS_PASS | Frontend | CRITICAL | Move SOAP construction to Rails backend. Credentials must never reach the browser. |
| S3 | **Client-side SOAP XML construction** allows injection of arbitrary SOAP content | Frontend | HIGH | Move all SOAP envelope building to Rails service classes with parameterized templates. |
| S4 | **No proxy validation** -- Rails controller forwards any request body to AquaCIS | Backend | HIGH | Implement allowlist of valid service names, operation names, and parameter validation. |
| S5 | **No foreign key constraints** -- application bugs can create orphaned records, including orphaned financial records | Database | HIGH | Add FK constraints incrementally, starting with financial tables (factura, movccontrato, contratodeuda). |
| S6 | **Session tracking insufficient** for audit compliance (no IP, no action type, no duration) | Database | MEDIUM | Extend `sesion` table with `ip_address`, `action_type`, `user_agent`, `duration_ms` columns. |
| S7 | **No rate limiting** on proxy controller | Backend | MEDIUM | Add per-user, per-operation rate limits (e.g., max 10 order creations/hour/agent). |
| S8 | **WSDL typo** (`reultado` instead of `resultado`) in Debt API responses | API | LOW | Defensive parsing required; both field names must be checked in all Debt API responses. |

---

## 8. Quick Wins (Top 10)

Actionable improvements ranked by impact-to-effort ratio:

| # | Action | Effort | Impact | Domain |
|---|--------|:------:|:------:|--------|
| QW1 | **Execute Phase 1 table cleanup** -- drop 2,643 transient tables (after fixing tmpbb schema) | 1 day | Eliminates 70% of catalog bloat immediately | A9 |
| QW2 | **Move SOAP construction to Rails** -- eliminate credential exposure in frontend bundle | 3-5 days | Closes the most critical security vulnerability | B6 |
| QW3 | **Integrate `getDeudaTotalConFacturas`** -- show invoice-level debt detail | 2-3 days | Agents can resolve payment disputes without leaving AGORA | B2/B7 |
| QW4 | **Integrate `getContratosPorNif`** -- customer lookup by tax ID | 3-5 days | Removes dependency on pre-known contract numbers | B7 |
| QW5 | **Integrate `refreshData`** -- work order status monitoring | 2-3 days | Orders no longer invisible after creation | B5/B7 |
| QW6 | **VACUUM FULL on catalog tables** after Phase 1 cleanup | 1 hour | Recover catalog performance degradation | A9 |
| QW7 | **Add circuit breaker to Rails proxy** (e.g., stoplight/circuitbox gem) | 2-3 days | Prevents cascade failures when AquaCIS is down | B6 |
| QW8 | **Hash plaintext passwords** in cliente and sociedad tables | 2-3 days | Closes critical database security vulnerability | A1 |
| QW9 | **Integrate `getDocumentoPago`** -- generate payment documents | 2-3 days | Enables basic payment document generation for customers | B2 |
| QW10 | **Add server-side SOAP audit logging** in Rails | 1-2 days | Replaces browser-only console.error() with structured audit trail | B6 |

**Total quick-win effort: 2-3 developer weeks**
**Combined impact: Addresses issues #1, #2, #3, #4, #10 from the Top 20 Critical Issues**

---

## 9. Risk Assessment

### 9.1 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Table-per-process recurrence** -- new tmp_deuda_* tables accumulate after cleanup | HIGH | HIGH | Patch Java application to use consolidated tables; set `tredroptablastemporales=1`; implement daily table count monitoring |
| **AquaCIS outage cascading to AGORA** -- no circuit breaker | MEDIUM | HIGH | Implement circuit breaker pattern in Rails proxy; add cached fallback for read operations |
| **Data integrity violation** -- orphaned financial records from missing FK constraints | MEDIUM | HIGH | Add FK constraints to financial tables (factura, movccontrato, contratodeuda) as first priority |
| **WSDL version change breaks integration** -- no version detection | MEDIUM | MEDIUM | Implement WSDL hash comparison in CI/CD pipeline; pin WSDL versions in source control |
| **Credential compromise** -- plaintext passwords or exposed WS-Security tokens | MEDIUM | CRITICAL | Immediate remediation: hash DB passwords, move SOAP construction server-side |

### 9.2 Strategic Risks

| Risk | Probability | Impact | Mitigation |
|------|:----------:|:------:|------------|
| **Schema-only operations never implemented by CEA** -- contract lifecycle permanently blocked | MEDIUM | HIGH | Escalate with formal business case; explore alternative workflows using existing operations |
| **Technical debt compounds** -- cost of change increases over time | HIGH | HIGH | Execute Phase 1-2 cleanup within 30 days; establish table count baseline monitoring |
| **Integration ceiling** -- SOAP architecture limits throughput and real-time capability | HIGH | MEDIUM | Plan for eventual API modernization (REST/GraphQL facade over SOAP); IoT DTOs in Work Orders suggest Aqualia roadmap includes this |
| **Knowledge concentration** -- system requires deep Aqualia domain expertise | HIGH | MEDIUM | Build comprehensive mapping dictionary (DB column <-> API DTO field); document all integration flows end-to-end |
| **AMI/Smart meter readiness gap** -- infrastructure model cannot support IoT telemetry at scale | MEDIUM | MEDIUM | Equipment model limited to tele-reading; plan PostGIS migration and AMI data model extensions |

### 9.3 Compliance Risks

| Risk | Area | Status |
|------|------|--------|
| GDPR/data protection | Partially addressed (rgpd_* shadow tables exist but bolted on post-hoc) |
| Financial audit trail | Weak (session tracking has only 4 columns; no server-side SOAP logging) |
| Password storage regulations | Non-compliant (plaintext passwords in production) |
| Data retention | No automated retention/archival policies visible |

---

## 10. Recommended Action Plan

### Immediate (Week 1-2)

1. Fix tmpbb replacement schema in Phase 1 script (2 hours)
2. Execute Phase 1 table cleanup + VACUUM FULL (1 day)
3. Move SOAP construction from frontend to Rails backend (3-5 days)
4. Hash all plaintext passwords in database (2-3 days)

### Short-term (Week 3-6)

5. Integrate Tier-1 API operations: `getContratosPorNif`, `getDeudaTotalConFacturas`, `refreshData`, `getDocumentoPago` (2-3 weeks)
6. Add circuit breaker and server-side audit logging to Rails proxy (1 week)
7. Execute Phase 2 table cleanup (municipality views, GIS caches) (2 days)
8. Add proxy validation and rate limiting (1 week)

### Medium-term (Month 2-3)

9. Integrate payment processing pipeline (6 debt management operations) (3-4 weeks)
10. Execute Phase 3 tipo* consolidation (4-6 weeks)
11. Begin decomposition of explotacion god table (design phase) (2-3 weeks)
12. Escalate schema-only contract lifecycle operations with CEA (formal request)

### Long-term (Month 4-6)

13. Execute Phase 4 history table consolidation (6-8 weeks)
14. Add FK constraints to financial and core entity tables (4-6 weeks)
15. Plan PostGIS migration for spatial data (design + pilot)
16. Build data abstraction layer in Rails to decouple frontend from SOAP DTOs

---

## Appendix A: Score Methodology

Each domain score was independently assessed by a specialized analysis agent using domain-specific criteria. Scores use a 1-10 scale where:
- **1-3:** Critical deficiencies; immediate remediation required
- **4-5:** Significant issues; functional but fragile
- **6-7:** Adequate; room for improvement
- **8-9:** Good; minor issues only
- **10:** Excellent; industry best practice

The composite score (5.1/10) weights database health at 55% (as the foundational layer) and API health at 45% (as the integration/operational layer). Within each division, scores are weighted by domain criticality: core schema/security/anti-patterns carry higher weight than lookup tables or individual API endpoints.

## Appendix B: Report Inventory

| Report | File | Agent |
|--------|------|-------|
| A1 - Core Schema | `/Users/fernandocamacholombardo/aqua/reports/division-a/A1-core-schema-analysis.md` | db-core-schema |
| A2 - Billing Domain | `/Users/fernandocamacholombardo/aqua/reports/division-a/A2-billing-domain-analysis.md` | db-billing-domain |
| A3 - Customer Domain | `/Users/fernandocamacholombardo/aqua/reports/division-a/A3-customer-domain-analysis.md` | db-customer-domain |
| A4 - Infrastructure | `/Users/fernandocamacholombardo/aqua/reports/division-a/A4-infrastructure-domain-analysis.md` | db-infrastructure |
| A5 - Work Orders | `/Users/fernandocamacholombardo/aqua/reports/division-a/A5-work-orders-analysis.md` | db-work-orders |
| A6 - Collections | `/Users/fernandocamacholombardo/aqua/reports/division-a/A6-collections-domain-analysis.md` | db-collections |
| A7 - Lookup/Config | `/Users/fernandocamacholombardo/aqua/reports/division-a/A7-lookup-config-analysis.md` | db-lookup-config |
| A8 - History/Audit | `/Users/fernandocamacholombardo/aqua/reports/division-a/A8-history-audit-analysis.md` | db-history-audit |
| A9 - Anti-patterns | `/Users/fernandocamacholombardo/aqua/reports/division-a/A9-antipatterns-analysis.md` | db-antipatterns |
| B1 - Contracts API | `/Users/fernandocamacholombardo/aqua/reports/division-b/B1-contracts-api-analysis.md` | api-contracts |
| B2 - Debt API | `/Users/fernandocamacholombardo/aqua/reports/division-b/B2-debt-api-analysis.md` | api-debt |
| B3 - Meters API | `/Users/fernandocamacholombardo/aqua/reports/division-b/B3-meters-api-analysis.md` | api-meters |
| B4 - Readings/Portal | `/Users/fernandocamacholombardo/aqua/reports/division-b/B4-readings-portal-analysis.md` | api-readings |
| B5 - Work Orders API | `/Users/fernandocamacholombardo/aqua/reports/division-b/B5-work-orders-api-analysis.md` | api-work-orders |
| B6 - REST/Integration | `/Users/fernandocamacholombardo/aqua/reports/division-b/B6-rest-integration-analysis.md` | api-rest-integration |
| B7 - Gap Analysis | `/Users/fernandocamacholombardo/aqua/reports/division-b/B7-gap-analysis.md` | api-gap-analysis |

---

*System Health Report generated: 2026-02-16*
*Sources: 16 independent deep-analysis reports across Division A (Database) and Division B (API)*
