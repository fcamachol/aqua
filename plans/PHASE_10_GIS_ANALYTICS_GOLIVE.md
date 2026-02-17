# Phase 10: GIS Platform, Analytics, Testing & Go-Live

> **Project**: AquaCIS 2.0 -- CEA Queretaro Next-Generation Water Utility Platform
> **Phase**: 10 of 10 (Final Phase)
> **Timeline**: Months 20-36 of the 36-month program
> **Document Version**: 1.0
> **Date**: 2026-02-16

---

## 1. Phase Overview

Phase 10 is the culminating phase of the AquaCIS 2.0 program. It delivers the spatial intelligence layer (PostGIS/GeoServer/QGIS), workflow automation (Camunda), hydraulic modeling (EPANET/WNTR), the enterprise analytics and data lake platform, the CKAN open data portal, and -- most critically -- the comprehensive testing, parallel run, and production cutover that retires the legacy Aquasis system.

This phase carries the highest organizational risk of the entire program: a failed cutover or data migration error directly impacts billing accuracy, revenue collection, and public trust. Every deliverable in this phase is gated by rigorous validation before the final production switch.

### Timeline

| Period | Sprints | Focus |
|--------|:-------:|-------|
| Months 20-21 | 1-4 | GIS Platform (PostGIS, GeoServer, QGIS, network maps) |
| Months 22-23 | 5-8 | Workflow Automation (Camunda) & Hydraulic Modeling (EPANET/WNTR) |
| Months 24-27 | 9-12 | Analytics & Data Lake (CDC, BI dashboards, regulatory reporting) |
| Months 28-29 | 13-16 | CKAN & Open Data Portal (datos.gob.mx, transparency compliance) |
| Months 30-33 | 17-24 | End-to-End Testing, Data Migration, Security Audit |
| Months 34-36 | 25-28 | Parallel Run, User Acceptance, Training, Cutover & Post-Cutover |

### Dependencies from Prior Phases

- All 10 microservices deployed and functional (Customer Identity, Contract Management, Billing Engine, Metering & Readings, Payments & Collections, Work Order Management, Infrastructure/GIS, Fiscal & Compliance, Notifications & Communications, Analytics & Reporting)
- Kafka event bus operational with CDC streams from all service databases
- API Gateway (Kong / Azure API Management) routing all traffic
- Observability stack (Prometheus, Grafana, Elasticsearch, Jaeger) in production
- AKS cluster stable in dev/staging/prod namespaces
- Database modernization complete (~230 tables from original 4,114)
- REST API coverage at 100% (all 126 legacy SOAP operations migrated)
- Customer Portal v2 (PWA) live and handling digital self-service

### Team Composition

| Role | Count | Responsibility |
|------|:-----:|----------------|
| GIS Specialist | 1-2 | PostGIS schema design, GeoServer administration, QGIS configuration, spatial data migration |
| Data Engineer | 2 | Data lake architecture, CDC pipelines (Debezium), ETL/ELT, BI dashboard development |
| QA Lead | 1 | E2E test strategy, test automation framework, performance/load testing |
| QA Engineers | 2-3 | Test case development, regression testing, data validation |
| Backend Engineers | 3-4 | Camunda BPMN workflows, EPANET integration, CKAN deployment, service hardening |
| DevOps/SRE Engineer | 1 | Infrastructure hardening, cutover automation, disaster recovery |
| Project Manager | 1 | Cutover planning, stakeholder coordination, risk management, timeline governance |
| Training Coordinator | 1 | Training material development, session scheduling, user onboarding |
| Security Engineer | 1 (contract) | Penetration testing, LGPDPPP audit, vulnerability assessment |
| **Total** | **13-16** | |

---

## 2. Sprint 1-4 (Months 20-21): GIS Platform

### 2.1 PostGIS Extension on Infrastructure Database

**Objective**: Enable spatial capabilities on the Infrastructure/GIS microservice database.

| Task | Detail | Acceptance Criteria |
|------|--------|---------------------|
| Install PostGIS extension | `CREATE EXTENSION postgis;` on the Infrastructure service PostgreSQL instance | PostGIS 3.x operational, `SELECT PostGIS_Version()` returns valid version |
| Install topology extension | `CREATE EXTENSION postgis_topology;` for network analysis | Topology schema created, edge/node/face tables available |
| Configure SRID | Set default SRID to EPSG:6372 (ITRF2008 / Mexico, used by INEGI) with WGS 84 (EPSG:4326) for interoperability | Spatial reference systems registered, coordinate transformations validated |
| Spatial indexing | Create GiST indexes on all geometry columns | Query performance validated with `EXPLAIN ANALYZE` on spatial queries |

### 2.2 Migrate VARCHAR Coordinates to Geometry Types

**Objective**: Convert legacy coordinate storage (latitude/longitude as VARCHAR or DECIMAL columns) to proper PostGIS geometry types.

| Entity | Current Storage | Target Type | Record Estimate |
|--------|----------------|-------------|:---------------:|
| `ptoserv` (service points) | VARCHAR lat/lon columns | `POINT` geometry | ~400,000 |
| `acometida` (connections) | VARCHAR coordinates | `POINT` geometry | ~400,000 |
| `contador` (meters) | Derived from service point | `POINT` geometry (linked) | ~400,000 |
| Network pipes | Not currently stored | `LINESTRING` geometry | New data entry |
| Valves | Not currently stored | `POINT` geometry | New data entry |
| Tanks/reservoirs | Not currently stored | `POLYGON` geometry | New data entry |

**Migration script pattern:**
```sql
-- Add geometry column
ALTER TABLE service_points ADD COLUMN geom geometry(Point, 6372);

-- Populate from legacy coordinates
UPDATE service_points
SET geom = ST_Transform(
  ST_SetSRID(ST_MakePoint(longitude::double precision, latitude::double precision), 4326),
  6372
)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create spatial index
CREATE INDEX idx_service_points_geom ON service_points USING GIST (geom);

-- Validate
SELECT COUNT(*) FROM service_points WHERE geom IS NULL AND latitude IS NOT NULL;
-- Must return 0
```

### 2.3 GeoServer Deployment

| Task | Detail |
|------|--------|
| Deploy GeoServer 2.25+ | Kubernetes deployment on AKS, 2 replicas, 4GB heap per instance |
| Configure PostGIS data store | Connect GeoServer to Infrastructure service database |
| Publish WMS/WFS layers | Service points, connections, pipes, valves, zones, DMAs |
| Style Layer Descriptors (SLD) | Color-coded symbology: pipe diameter, material, age; meter status; valve state |
| Tile caching (GeoWebCache) | Pre-generate tiles for Queretaro metro area at zoom levels 10-18 |
| Security | Integrate with API Gateway OAuth 2.0; role-based layer access |

### 2.4 QGIS Desktop Setup for Engineers

| Task | Detail |
|------|--------|
| QGIS 3.x installation | Standard deployment for 10-15 field engineers and GIS staff |
| PostGIS direct connection | Database connection profiles for read/write access |
| WMS/WFS connection | GeoServer layer consumption for web-served data |
| Custom project templates | Pre-configured projects: network overview, DMA management, work order spatial view |
| INEGI basemap integration | Add INEGI topographic and urban basemap layers (WMS from gaia.inegi.org.mx) |
| Print layouts | Standard map templates for field crews, regulatory reports, and public meetings |

### 2.5 Network Map Visualization

**Deliverables:**

1. **Pipe network map** -- All distribution mains and service lines with attributes (material, diameter, installation year, pressure class)
2. **Meter location map** -- All active meters with status overlay (active, inactive, damaged, AMI-connected)
3. **Valve map** -- Isolation valves, control valves, PRVs with operational status
4. **Service point map** -- All service connections color-coded by customer type (residential, commercial, industrial, government)
5. **Web map application** -- Embedded in AquaCIS 2.0 portal using OpenLayers or Leaflet consuming GeoServer WMS/WFS

### 2.6 Zone and Sector Boundary Management

| Feature | Detail |
|---------|--------|
| Zone polygons | Define and store zone/sector boundaries as `POLYGON` geometries |
| DMA boundaries | District Metered Areas for NRW analysis |
| Spatial assignment | Auto-assign service points to zones via `ST_Contains()` |
| Zone statistics | Real-time aggregate queries: connections per zone, consumption per zone, NRW per DMA |
| Boundary editing | GIS staff can modify zone boundaries in QGIS with versioned history |

---

## 3. Sprint 5-8 (Months 22-23): Workflow & Hydraulic Modeling

### 3.1 Camunda Community Edition Deployment

**Objective**: Deploy Camunda Platform 8 (Zeebe + Operate + Tasklist) for BPMN workflow automation.

| Task | Detail |
|------|--------|
| Zeebe broker deployment | 3-node cluster on AKS, fault-tolerant partitioning |
| Operate dashboard | Process monitoring and incident management UI |
| Tasklist | Human task assignment and completion interface |
| Connectors | REST connector for AquaCIS microservice integration |
| Identity integration | Connect to API Gateway OIDC provider for SSO |

### 3.2 Work Order Lifecycle Migration to BPMN

**Target processes to model in BPMN 2.0:**

| Process | Current State | BPMN Model |
|---------|---------------|------------|
| New connection request | Manual workflow in Aquasis `orden` table | End-to-end: request -> field survey -> approval -> installation -> activation -> billing start |
| Meter replacement | Ad-hoc, paper-based | Request -> schedule -> field dispatch -> old meter removal -> new meter install -> final reading -> initial reading -> validation |
| Leak repair | Phone call -> manual dispatch | Report (portal/WhatsApp/phone) -> categorize -> prioritize -> dispatch -> repair -> verify -> close |
| Disconnection/reconnection | Manual with billing dependency | Overdue trigger -> warning notice -> disconnection order -> field execution -> payment received -> reconnection order -> field execution -> billing restart |
| Billing dispute | Manual review | Customer dispute -> evidence review -> recalculation -> adjustment or rejection -> notification -> resolution |

**Integration pattern**: Camunda BPMN processes invoke AquaCIS microservices via REST connectors. Service tasks call the Work Order, Billing, and Metering APIs. Human tasks appear in the Tasklist for CEA staff.

### 3.3 EPANET/WNTR Integration for Hydraulic Simulation

**Objective**: Enable hydraulic network modeling using EPA's EPANET engine and the Python WNTR (Water Network Tool for Resilience) library.

| Component | Detail |
|-----------|--------|
| WNTR Python service | Containerized Python microservice exposing REST API for simulation runs |
| EPANET model builder | Auto-generate `.inp` network model files from PostGIS pipe/node/valve data |
| Simulation types | Steady-state analysis, extended period simulation (EPS), fire flow analysis, water quality (chlorine decay) |
| Results storage | Simulation results stored in TimescaleDB for time-series analysis |
| GIS visualization | Simulation results (pressure, flow, velocity) rendered as GeoServer layers with SLD styling |

### 3.4 Pressure Zone Modeling

| Feature | Detail |
|---------|--------|
| Pressure zone definition | Define zones by elevation bands and PRV boundaries in PostGIS |
| Pressure monitoring | Ingest SCADA/IoT pressure sensor data (via ThingsBoard) |
| Simulation vs. actual comparison | Compare EPANET-predicted pressures with field measurements |
| Alert generation | Automated alerts when pressure deviates from model predictions (potential leak indicator) |

### 3.5 Water Balance Calculations

Implement IWA (International Water Association) standard water balance:

```
System Input Volume
  = Authorized Consumption (Billed + Unbilled)
  + Water Losses (Apparent Losses + Real Losses)

Key metrics:
  - NRW % = (System Input - Billed Authorized Consumption) / System Input
  - ILI (Infrastructure Leakage Index) = Real Losses / UARL
```

| Calculation | Data Sources |
|-------------|-------------|
| System input volume | SCADA bulk flow meters, production records |
| Billed authorized consumption | Billing Engine invoiced volumes |
| Unbilled authorized consumption | Fire hydrant use, flushing, estimated municipal use |
| Apparent losses | Meter under-registration (aging analysis), unauthorized consumption (theft estimates) |
| Real losses | Calculated as residual: system input - all other components |

**Reporting**: Monthly water balance by DMA, zone, and system-wide. Trend analysis dashboards in Grafana.

---

## 4. Sprint 9-12 (Months 24-27): Analytics & Data Lake

### 4.1 Azure Data Lake Architecture

**Three-layer medallion architecture:**

| Layer | Storage | Format | Purpose |
|-------|---------|--------|---------|
| **Raw (Bronze)** | Azure Blob Storage | JSON, Avro | Unmodified CDC events from all service databases |
| **Processed (Silver)** | Azure Blob Storage | Parquet, partitioned by date/domain | Cleaned, deduplicated, schema-enforced data |
| **Curated (Gold)** | Azure Blob Storage + PostgreSQL | Parquet + materialized views | Business-ready aggregates, KPI tables, report-ready datasets |

**Storage estimates:**
- Bronze: ~2TB/year (all CDC events)
- Silver: ~500GB/year (deduplicated, compressed Parquet)
- Gold: ~50GB (aggregated, refreshed daily)

### 4.2 CDC from Service Databases via Debezium

| Source Database | Kafka Topic Pattern | Key Events |
|----------------|--------------------|-----------|
| Customer Identity | `cdc.customer.*` | Customer created/updated, address changed |
| Contract Management | `cdc.contract.*` | Contract activated/suspended/terminated, ownership transfer |
| Billing Engine | `cdc.billing.*` | Invoice generated, tariff applied, adjustment posted |
| Metering & Readings | `cdc.metering.*` | Reading recorded, consumption calculated, anomaly detected |
| Payments & Collections | `cdc.payments.*` | Payment received, reconciled, dunning escalated |
| Work Order Management | `cdc.workorder.*` | Order created, dispatched, completed |
| Infrastructure/GIS | `cdc.infrastructure.*` | Asset created/modified, network topology changed |

**Debezium configuration:**
- PostgreSQL logical replication (WAL-based CDC)
- Kafka Connect cluster on AKS (3 workers)
- Avro serialization with Confluent Schema Registry
- At-least-once delivery semantics with idempotent consumers

### 4.3 BI Dashboard Platform

**Selected platform**: Apache Superset (primary) or Metabase (alternative)

| Criterion | Apache Superset | Metabase |
|-----------|:---------------:|:--------:|
| SQL-native | Yes | Yes |
| Embeddable | Yes (iframe + SDK) | Yes (iframe) |
| Row-level security | Yes | Enterprise only |
| Active directory / OIDC | Yes | Yes |
| Charting variety | Extensive | Good |
| License | Apache 2.0 | AGPL (CE) |
| **Recommendation** | **Primary** | Alternative |

**Deployment**: Kubernetes pod on AKS, connected to Gold layer PostgreSQL and direct service databases (read replicas).

### 4.4 Key Dashboards

#### 4.4.1 Revenue Dashboard
| Metric | Source | Refresh |
|--------|--------|:-------:|
| Monthly billed revenue | Billing Engine | Daily |
| Collection rate (%) | Payments service | Daily |
| Aged receivables (30/60/90/120+ days) | Payments service | Daily |
| Revenue by zone/sector | Billing + GIS | Daily |
| Revenue by customer type | Billing + Customer | Daily |
| CFDI timbrado success rate | Fiscal service | Real-time |
| Payment channel breakdown (OXXO/SPEI/CoDi/card/office) | Payments service | Daily |

#### 4.4.2 Non-Revenue Water Dashboard
| Metric | Source | Refresh |
|--------|--------|:-------:|
| System-wide NRW (%) | Water balance calculation | Monthly |
| NRW by DMA | Water balance + GIS | Monthly |
| ILI (Infrastructure Leakage Index) | Hydraulic model | Monthly |
| Apparent vs. real losses | Water balance | Monthly |
| Leak detection events | Work orders + IoT | Real-time |
| Meter age distribution | Metering service | Weekly |

#### 4.4.3 Consumption Dashboard
| Metric | Source | Refresh |
|--------|--------|:-------:|
| Total system consumption (m3) | Metering service | Daily |
| Average consumption per connection | Metering + Contract | Monthly |
| Consumption by tariff category | Metering + Billing | Monthly |
| Consumption anomalies (high/low) | Metering anomaly detection | Daily |
| AMI vs. manual read coverage | Metering service | Weekly |
| Seasonal consumption trends | Data lake (historical) | Monthly |

#### 4.4.4 Operations Dashboard
| Metric | Source | Refresh |
|--------|--------|:-------:|
| Open work orders by type | Work Order service | Real-time |
| Work order SLA compliance | Work Order service | Daily |
| Mean time to repair (MTTR) | Work Order service | Weekly |
| Field crew utilization | Work Order service | Daily |
| Pending meter installations | Work Order + Metering | Daily |
| Infrastructure incidents (breaks, leaks) | Work Order + GIS | Real-time |

#### 4.4.5 SLA & Regulatory Dashboard
| Metric | Source | Refresh |
|--------|--------|:-------:|
| CONAGUA reporting compliance | Analytics service | Monthly |
| Water quality parameters | External lab data + IoT | Daily |
| Service coverage (%) by municipality | Contract + GIS | Monthly |
| Response time to citizen complaints | Work Order service | Daily |
| Transparency law compliance status | CKAN publication log | Weekly |

### 4.5 CONAGUA Regulatory Reporting

**Automated reports for Comision Nacional del Agua:**

| Report | Frequency | Content |
|--------|:---------:|---------|
| PIGOO indicators | Quarterly | Operational and financial indicators for national benchmarking |
| Water balance | Annual | IWA standard water balance with NRW breakdown |
| Tariff application report | Annual | Tariff structure, subsidies, and revenue recovery |
| Infrastructure inventory | Annual | Network assets, condition, and investment plan |
| Water quality | Monthly | Treatment plant effluent and distribution system parameters |

Reports auto-generated from Gold layer data and submitted via CONAGUA's electronic reporting portal.

---

## 5. Sprint 13-16 (Months 28-29): CKAN & Open Data

### 5.1 CKAN Deployment

| Task | Detail |
|------|--------|
| CKAN installation | Docker deployment on AKS, PostgreSQL backend, Solr search |
| Extensions | `ckanext-spatial` (GeoJSON/WMS), `ckanext-harvest`, `ckanext-scheming`, `ckanext-xloader`, `ckanext-charts` |
| Theme | Custom CEA Queretaro branding, Spanish localization |
| Authentication | Public read access; OIDC for data publishers (CEA staff) |
| API | CKAN Action API enabled for programmatic access |

### 5.2 datos.gob.mx Integration

| Task | Detail |
|------|--------|
| Metadata alignment | Map CKAN datasets to datos.gob.mx DCAT-AP schema |
| Harvesting setup | Configure datos.gob.mx harvester to pull from CEA CKAN instance |
| Dataset registration | Register CEA Queretaro as a data publisher on the national platform |
| Automated sync | CKAN harvest extension pushes updated datasets on publication |

### 5.3 Public Datasets

| Dataset | Format | Frequency | Content |
|---------|--------|:---------:|---------|
| Water quality reports | CSV, JSON | Monthly | Treatment plant and distribution system water quality parameters |
| Tariff schedules | CSV, JSON | On change | Current and historical tariff rates by customer category |
| Service coverage maps | GeoJSON, WMS | Quarterly | Geographic coverage by municipality and zone |
| Infrastructure investment | CSV | Annual | Capital expenditure by category and zone |
| NRW performance | CSV | Quarterly | System-wide and zone-level NRW indicators |
| Service interruptions | CSV, GeoJSON | Weekly | Planned and unplanned outages with affected areas |
| Customer satisfaction surveys | CSV | Annual | Anonymized CSAT results |

### 5.4 Transparency Compliance

| Requirement | Implementation |
|-------------|---------------|
| Ley General de Transparencia | Proactive publication of operational data on CKAN |
| INAI obligations | Structured metadata for freedom-of-information request responses |
| Queretaro state transparency law | Municipal-level reporting datasets |
| LGPDPPP (data protection) | All published data anonymized/aggregated; no personal data |

### 5.5 Citizen Data Access Portal

- Public-facing CKAN instance with search and download capabilities
- Embeddable widgets for CEA Queretaro website showing key metrics
- API documentation for developers and researchers
- Feedback mechanism for data requests from citizens and civil society organizations

---

## 6. Sprint 17-24 (Months 30-33): Testing & Migration

### 6.1 End-to-End Test Suite

**Coverage target**: All 10 microservices, all critical business flows.

| Test Category | Scope | Tool |
|---------------|-------|------|
| API contract tests | All REST endpoints (126+ operations) | Pact / Dredd |
| Integration tests | Service-to-service communication via Kafka and REST | Testcontainers + JUnit/pytest |
| E2E business flow tests | Full meter-to-cash cycle, work order lifecycle, payment processing | Playwright + custom test harness |
| Data integrity tests | Cross-service data consistency (e.g., billing matches metering) | Custom validation scripts |
| Regression tests | All bug fixes and edge cases from prior phases | Automated CI suite |

**Critical E2E test scenarios:**

1. **Meter-to-cash**: Reading recorded -> consumption calculated -> tariff applied -> invoice generated -> CFDI stamped -> payment received -> account updated
2. **New connection**: Application submitted -> field survey -> approval -> physical installation -> meter activation -> first reading -> first invoice
3. **Disconnection-reconnection**: Payment overdue -> warning -> disconnection order -> field execution -> payment -> reconnection order -> field execution -> billing restart
4. **Ownership transfer**: Old owner request -> final reading -> final invoice -> new owner contract -> new account setup
5. **Billing dispute**: Customer dispute -> evidence review -> recalculation -> adjustment -> corrected CFDI -> notification
6. **AMI data flow**: Smart meter reading -> LoRaWAN -> ThingsBoard -> Kafka -> Metering service -> Billing engine
7. **Work order lifecycle**: Creation -> dispatch -> mobile app update -> completion -> customer notification
8. **Payment reconciliation**: OXXO payment -> Conekta webhook -> payment applied -> balance updated -> receipt generated
9. **Water balance**: All inputs collected -> calculation run -> NRW computed -> dashboard updated -> CONAGUA report generated
10. **Customer portal**: Login -> view bills -> make payment -> submit reading -> raise complaint -> track work order

### 6.2 Performance and Load Testing

**Target**: 1,000 concurrent users with sub-2-second response times for 95th percentile.

| Test Type | Tool | Target |
|-----------|------|--------|
| Load testing | k6 or Gatling | 1,000 concurrent users, sustained 30 minutes |
| Stress testing | k6 | Ramp to 2,500 concurrent users, identify breaking point |
| Spike testing | k6 | 0 -> 1,500 users in 30 seconds |
| Endurance testing | k6 | 500 concurrent users, sustained 8 hours (memory leak detection) |
| Database performance | pgbench + custom queries | Billing run for 400,000 contracts < 4 hours |
| Kafka throughput | Custom producer/consumer benchmark | 10,000 events/second sustained |
| GeoServer map rendering | JMeter | 200 concurrent WMS tile requests, < 500ms |

**Performance baselines (must meet or exceed):**

| Operation | Target Response Time (p95) |
|-----------|:--------------------------:|
| Customer lookup | < 200ms |
| Invoice retrieval | < 300ms |
| Payment posting | < 500ms |
| Meter reading submission | < 300ms |
| Map tile rendering | < 500ms |
| Dashboard page load | < 2s |
| Billing run (single contract) | < 100ms |
| Full billing cycle (400K contracts) | < 4 hours |

### 6.3 Data Migration Strategy

**Approach**: Phased extraction from legacy Aquasis database with validation at each step.

| Phase | Data Domain | Source (Aquasis) | Target (AquaCIS 2.0) | Record Estimate |
|-------|-------------|-----------------|---------------------|:---------------:|
| M1 | Customers & personas | `persona`, `cliente`, `personadir` | Customer Identity service | ~300,000 |
| M2 | Contracts | `contrato`, `polcontar`, `sociedad` | Contract Management service | ~400,000 |
| M3 | Service points & connections | `ptoserv`, `acometida`, `servicio` | Infrastructure/GIS service | ~400,000 |
| M4 | Meters & equipment | `contador`, `equipo` | Metering service | ~400,000 |
| M5 | Historical readings | `poldetsum`, reading history | Metering service (event store) | ~10,000,000+ |
| M6 | Billing history | `factura`, `facturable`, `linfactura`, `his*` tables | Billing Engine (event store) | ~5,000,000+ |
| M7 | Payment history | `opecargest`, `opedesglos`, `movccontrato` | Payments service (event store) | ~3,000,000+ |
| M8 | Debt records | `contratodeuda`, `gescartera` | Payments service | ~100,000+ |
| M9 | Work order history | `orden` | Work Order service | ~500,000+ |
| M10 | Spatial data | Legacy coordinates, CAD files, shapefiles | PostGIS geometry types | ~400,000+ |

### 6.4 Data Validation and Reconciliation

| Validation Type | Method | Pass Criteria |
|----------------|--------|---------------|
| **Record count** | Source vs. target count comparison | 100% match |
| **Financial totals** | Sum of balances, invoiced amounts, payments | Exact match (to centavo) |
| **Referential integrity** | All foreign key relationships preserved | 0 orphan records |
| **Business rule validation** | Active contracts have valid meters, service points have valid zones | 0 violations |
| **Sample audit** | Random sample of 1,000 accounts: full detail comparison | 100% match |
| **Billing replay** | Regenerate last 3 billing cycles on migrated data, compare with historical invoices | Invoice-by-invoice match |
| **Spatial validation** | All migrated coordinates plot within Queretaro state boundary | 100% within bounds |

### 6.5 Security Audit and Penetration Testing

| Activity | Scope | Responsible |
|----------|-------|-------------|
| OWASP Top 10 assessment | All REST APIs, Customer Portal, CKAN | Security Engineer (contract) |
| Penetration testing | External black-box test of all public-facing endpoints | Third-party security firm |
| Authentication/authorization audit | OAuth 2.0 flows, role-based access control, API key management | Security Engineer |
| Data encryption review | TLS in transit, encryption at rest (Azure), PII handling | Security Engineer |
| Dependency vulnerability scan | All container images, npm/pip/maven dependencies | Snyk / Trivy (automated in CI) |
| Infrastructure security | AKS network policies, Azure NSGs, secrets management (Key Vault) | DevOps + Security Engineer |

### 6.6 LGPDPPP Compliance Validation

| Requirement | Validation |
|-------------|-----------|
| Consent management | Verify all customer records have documented consent for data processing |
| Data minimization | Confirm only necessary PII is stored per service |
| Right to access | Test customer portal "download my data" functionality |
| Right to rectification | Test customer data correction workflow |
| Right to cancellation | Test account deletion/anonymization workflow |
| Data breach notification | Test breach notification workflow (72-hour requirement) |
| Cross-border data | Confirm all data stored in Azure Mexico Central (Queretaro) region |
| Privacy impact assessment | Document completed for each microservice handling PII |

---

## 7. Sprint 25-28 (Months 34-36): Parallel Run & Cutover

### 7.1 Parallel Run: Legacy + New System Side-by-Side

**Duration**: Minimum 3 billing cycles (approximately 3 months, overlapping with final testing).

| Activity | Detail |
|----------|--------|
| Dual write | All operational transactions processed in both Aquasis and AquaCIS 2.0 |
| Read from new, write to both | Customer-facing portal reads from AquaCIS 2.0; back-office can use either |
| Automated comparison | Nightly reconciliation job comparing key metrics between systems |
| Exception reporting | Any discrepancy flagged for immediate investigation |
| Rollback readiness | Aquasis remains fully operational as fallback at all times during parallel run |

### 7.2 Billing Comparison (Invoice-by-Invoice)

| Comparison Point | Method | Tolerance |
|-----------------|--------|:---------:|
| Invoice total amount | Exact comparison per contract | $0.00 (exact match) |
| Line item breakdown | Tariff tier, volume, unit rate, subtotal | $0.00 |
| IVA (tax) calculation | Tax amount per line item | $0.00 |
| CFDI fields | RFC, UUID, fiscal data | Exact match |
| Due dates | Payment due dates | Same day |
| Penalty calculations | Late payment penalties, interest | $0.01 (rounding tolerance) |

**Process**: After each billing run in AquaCIS 2.0, an automated reconciliation job compares every invoice with the corresponding Aquasis invoice. Discrepancies are categorized:
- **Category A (Critical)**: Amount difference > $1.00 -- blocks cutover
- **Category B (Minor)**: Amount difference $0.01-$1.00 -- must explain (rounding)
- **Category C (Cosmetic)**: Format differences, field ordering -- document but do not block

**Cutover gate**: Zero Category A discrepancies for 3 consecutive billing cycles.

### 7.3 User Acceptance Testing (UAT)

| User Group | Participants | Focus Areas |
|------------|:------------:|-------------|
| Billing clerks | 10-15 | Invoice generation, adjustments, tariff application, CFDI |
| Customer service representatives | 10-15 | Account lookup, complaint handling, payment posting |
| Field supervisors | 5-8 | Work order management, mobile app, dispatch |
| Meter readers | 10-15 | Reading entry (manual + AMI), route management |
| Collections officers | 5-8 | Debt management, dunning, payment plans |
| GIS/engineering staff | 3-5 | Maps, network analysis, hydraulic modeling |
| Management/reporting | 5-8 | Dashboards, KPI reports, regulatory reports |
| IT operations | 3-5 | System administration, monitoring, incident management |
| **Total UAT participants** | **51-79** | |

**UAT duration**: 4 weeks, structured by user group with dedicated support staff.

### 7.4 Training Program

**Target**: 200+ CEA staff across all departments.

| Training Track | Audience | Duration | Format |
|---------------|----------|:--------:|--------|
| **Track 1: Customer Service** | CSRs, front-desk staff | 3 days | Classroom + hands-on lab |
| **Track 2: Billing Operations** | Billing clerks, supervisors | 4 days | Classroom + hands-on lab |
| **Track 3: Field Operations** | Meter readers, field crews, supervisors | 2 days | Classroom + field practice with mobile app |
| **Track 4: Collections** | Collections officers, managers | 2 days | Classroom + hands-on lab |
| **Track 5: GIS & Engineering** | Engineers, GIS analysts | 3 days | Classroom + QGIS lab |
| **Track 6: Management Dashboards** | Directors, zone managers | 1 day | Demonstration + hands-on |
| **Track 7: IT Administration** | IT staff, DBAs, system admins | 5 days | Deep-dive technical training |
| **Track 8: Train-the-Trainer** | Selected power users (20 staff) | 3 days | Full system walkthrough + teaching methodology |

**Training materials:**
- Video tutorials (Spanish) for each module
- Quick-reference cards for common tasks
- Searchable knowledge base (wiki)
- Sandbox environment for practice (copy of staging with anonymized data)

### 7.5 Cutover Plan

#### Pre-Cutover (Week before)

| Day | Activity | Responsible |
|-----|----------|-------------|
| T-7 | Final go/no-go decision meeting | Project Manager, IT Director, Finance Director |
| T-7 | Confirm rollback plan tested and ready | DevOps Lead |
| T-5 | Freeze all Aquasis configuration changes | IT Operations |
| T-5 | Final data synchronization dry run | Data Engineer |
| T-3 | Pre-cutover checklist review (see Section 10) | Project Manager |
| T-2 | Notify all staff of planned cutover | Training Coordinator |
| T-1 | Notify customers of planned service window (if any) | Communications team |

#### Cutover Weekend (Friday Evening to Monday Morning)

| Time | Activity | Duration | Responsible |
|------|----------|:--------:|-------------|
| Friday 18:00 | Aquasis enters read-only mode; final transactions processed | 1 hour | DBA |
| Friday 19:00 | Final delta data extraction from Aquasis | 2 hours | Data Engineer |
| Friday 21:00 | Delta data loaded into AquaCIS 2.0 | 2 hours | Data Engineer |
| Friday 23:00 | Data validation: record counts, financial totals, referential integrity | 3 hours | QA Lead |
| Saturday 02:00 | Validation checkpoint 1: go/no-go | 30 min | Project Manager |
| Saturday 02:30 | DNS/routing switch: all traffic to AquaCIS 2.0 | 30 min | DevOps |
| Saturday 03:00 | Smoke tests: all critical paths (login, lookup, billing, payment) | 2 hours | QA Team |
| Saturday 05:00 | Validation checkpoint 2: go/no-go | 30 min | Project Manager |
| Saturday 05:30 | Customer Portal switched to AquaCIS 2.0 backend | 30 min | DevOps |
| Saturday 06:00-18:00 | Extended monitoring period | 12 hours | War Room team |
| Sunday 06:00-18:00 | Continued monitoring; process test transactions | 12 hours | War Room team |
| Monday 06:00 | Staff arrive; support team in place at all offices | -- | Training + Support |
| Monday 08:00 | First full business day on AquaCIS 2.0 | -- | All staff |

**Rollback trigger**: If any Category A data integrity failure is detected at either checkpoint, the cutover is aborted, traffic is reverted to Aquasis, and a post-mortem is conducted.

**Rollback window**: 72 hours. After 72 hours of successful operation, rollback is no longer supported (Aquasis data will have diverged).

### 7.6 Post-Cutover Support Plan

#### War Room (2 weeks)

| Aspect | Detail |
|--------|--------|
| Location | CEA headquarters, dedicated room with workstations and video wall |
| Duration | 14 calendar days, 12 hours/day (06:00-18:00), on-call 18:00-06:00 |
| Staffing | Project Manager, 2 backend engineers, 1 DBA, 1 QA, 1 customer service expert |
| Escalation tiers | L1: War room (15-min response) -> L2: Engineering team (1-hour response) -> L3: Architecture lead (2-hour response) |
| Communication | Dedicated WhatsApp group, Grafana dashboards on wall monitors, hourly status updates to management |

#### Hyper-Care Period (Weeks 3-8)

| Activity | Detail |
|----------|--------|
| Reduced war room | Core team available during business hours |
| Daily standup | 15-minute status review with stakeholders |
| Weekly report | KPI comparison: AquaCIS 2.0 vs. Aquasis historical baseline |
| Bug triage | Priority 1 (system down): 1-hour fix. Priority 2 (workflow blocked): 4-hour fix. Priority 3 (cosmetic): next sprint |

### 7.7 Legacy System Decommission Timeline

| Milestone | Timeline | Activity |
|-----------|:--------:|----------|
| Cutover complete | Month 34 | AquaCIS 2.0 is primary system |
| Aquasis read-only | Month 34 | Aquasis available for historical lookups only |
| Historical data verified | Month 35 | All historical data confirmed accessible in AquaCIS 2.0 |
| Aquasis archive | Month 36 | Aquasis database archived (cold storage) |
| Aquasis decommission | Month 36+ | Server shutdown, license termination, infrastructure deprovisioned |
| Archive retention | Month 36-96 | Archived database retained for 5 years (regulatory requirement) |

---

## 8. Data Migration Plan

### 8.1 Schema Mapping

| Legacy Domain (Aquasis) | Target Service | Mapping Complexity | Notes |
|------------------------|----------------|:------------------:|-------|
| `persona` + `cliente` + `personadir` | Customer Identity | Medium | Normalize name fields, deduplicate, validate INE/CURP |
| `contrato` + `polcontar` | Contract Management | Medium | Map status codes, link to new customer IDs |
| `ptoserv` + `acometida` + `servicio` | Infrastructure/GIS | High | Coordinate conversion (VARCHAR -> geometry), network topology construction |
| `contador` + `equipo` | Metering | Medium | Map meter types, link to service points |
| `poldetsum` + reading history | Metering (event store) | High | 10M+ records, convert to consumption events |
| `factura` + `facturable` + `linfactura` + 230 `his*` tables | Billing (event store) | Very High | Reconstruct billing events from historical invoices; map 230 history tables to unified event log |
| `opecargest` + `opedesglos` + `gescartera` | Payments | High | Reconcile payment records, map collection status codes |
| `contratodeuda` | Payments | Medium | Active debt records with aging |
| `orden` | Work Orders | Low | Direct mapping with status code translation |
| Spatial data (CAD, shapefiles, manual records) | PostGIS | High | Digitize paper records, import CAD/shapefiles, validate coordinates |

### 8.2 ETL Pipeline Architecture

```
Source (Aquasis PostgreSQL)
  |
  v
[Extract] -- pg_dump (schema) + custom SQL queries (data)
  |
  v
[Stage] -- Staging PostgreSQL database (exact copy of source tables)
  |
  v
[Transform] -- Python/dbt transformation scripts:
  |            - Data type normalization
  |            - Deduplication
  |            - Code/status mapping
  |            - Coordinate conversion
  |            - Event reconstruction (for event-sourced services)
  |            - Referential integrity repair
  v
[Validate] -- Automated validation suite:
  |            - Record counts
  |            - Financial totals
  |            - Referential integrity
  |            - Business rule compliance
  |            - Sample audit (1,000 random accounts)
  v
[Load] -- Service-specific loaders:
             - REST API calls (for transactional data)
             - Bulk INSERT (for historical/event data)
             - PostGIS spatial loader (for geometry data)
```

### 8.3 Migration Validation Gates

Each migration phase (M1-M10) must pass all gates before the next phase begins:

| Gate | Criterion | Automated |
|------|-----------|:---------:|
| G1: Record count | Source count = target count | Yes |
| G2: Financial integrity | Sum of amounts match to centavo | Yes |
| G3: Referential integrity | Zero orphan records across service boundaries | Yes |
| G4: Business rules | Zero rule violations (active contract has meter, service point has zone, etc.) | Yes |
| G5: Sample audit | 1,000 random records pass detailed comparison | Semi-auto |
| G6: Functional test | Key operations work with migrated data (lookup, billing, payment) | Manual |
| G7: Stakeholder sign-off | Domain owner reviews and approves | Manual |

---

## 9. Training Plan

### 9.1 Training Schedule

| Week | Track | Group Size | Sessions |
|------|-------|:----------:|:--------:|
| Week 1 | Train-the-Trainer | 20 | 5 (full days) |
| Week 2 | IT Administration | 8-10 | 5 (full days) |
| Week 3 | Billing Operations | 30-40 | 8 (4 days x 2 groups) |
| Week 4 | Customer Service | 30-40 | 6 (3 days x 2 groups) |
| Week 5 | Field Operations | 40-50 | 8 (2 days x 4 groups) |
| Week 6 | Collections | 15-20 | 4 (2 days x 2 groups) |
| Week 7 | GIS & Engineering | 10-15 | 3 (3 days x 1 group) |
| Week 7 | Management Dashboards | 15-20 | 2 (1 day x 2 groups) |
| Week 8 | Makeup sessions / reinforcement | As needed | Flexible |

### 9.2 Training Materials by Role

| Role | Materials |
|------|----------|
| All users | System login, navigation, personal settings, password management, help resources |
| Customer Service | Account search, customer profile, contract view, complaint entry, payment lookup, receipt printing |
| Billing | Billing run execution, invoice review, adjustments, tariff overrides, CFDI reissuance, batch operations |
| Field Operations | Mobile app installation, reading entry, work order processing, photo capture, GPS tracking, offline mode |
| Collections | Debt portfolio view, dunning workflow, payment plan creation, disconnection/reconnection orders |
| GIS | QGIS project usage, web map navigation, asset query, zone management, print layouts |
| Management | Dashboard navigation, KPI interpretation, report generation, drill-down analysis |
| IT | Kubernetes monitoring, Grafana dashboards, log analysis, incident response, database administration, backup/restore |

### 9.3 Post-Go-Live Learning Support

| Resource | Detail |
|----------|--------|
| Help desk | Dedicated AquaCIS 2.0 support line during hyper-care (weeks 1-8) |
| Knowledge base | Searchable wiki with FAQs, how-to guides, troubleshooting |
| Video library | Screen recordings of all training sessions, indexed by topic |
| Floor support | Trained power users embedded in each department for first 4 weeks |
| Feedback channel | WhatsApp group for quick questions; formal feedback form for improvement suggestions |

---

## 10. Go-Live Checklist

### 10.1 Pre-Cutover Checklist

| # | Item | Owner | Status |
|---|------|-------|:------:|
| 1 | All 10 microservices pass E2E test suite (100% pass rate) | QA Lead | [ ] |
| 2 | Performance tests meet all response time targets | QA Lead | [ ] |
| 3 | Load test: 1,000 concurrent users sustained 30 minutes | QA Lead | [ ] |
| 4 | Security penetration test: zero critical/high findings open | Security Engineer | [ ] |
| 5 | LGPDPPP compliance audit: all requirements met | Security Engineer | [ ] |
| 6 | Data migration M1-M10 complete, all gates passed | Data Engineer | [ ] |
| 7 | Billing reconciliation: 3 consecutive cycles with zero Category A discrepancies | Billing Lead | [ ] |
| 8 | UAT sign-off from all user groups | Project Manager | [ ] |
| 9 | Training completed for all 200+ staff | Training Coordinator | [ ] |
| 10 | Disaster recovery tested (failover + restore) | DevOps Lead | [ ] |
| 11 | Backup strategy validated (RPO < 1 hour, RTO < 4 hours) | DevOps Lead | [ ] |
| 12 | Monitoring dashboards configured with alerts | DevOps Lead | [ ] |
| 13 | War room logistics ready (room, equipment, staffing, catering) | Project Manager | [ ] |
| 14 | Rollback plan documented and tested | DevOps Lead | [ ] |
| 15 | Customer communication plan approved and scheduled | Communications | [ ] |
| 16 | CONAGUA notified of system change | Compliance Lead | [ ] |
| 17 | PAC (CFDI provider) integration tested in production | Fiscal Lead | [ ] |
| 18 | Conekta (payment gateway) production keys configured | Payments Lead | [ ] |
| 19 | DNS TTL reduced to 60 seconds (for quick rollback) | DevOps Lead | [ ] |
| 20 | Go/no-go decision documented with executive sign-off | IT Director | [ ] |

### 10.2 Cutover Checklist

| # | Item | Owner | Status |
|---|------|-------|:------:|
| 1 | Aquasis set to read-only mode | DBA | [ ] |
| 2 | Final delta data extraction completed | Data Engineer | [ ] |
| 3 | Delta data loaded and validated | Data Engineer | [ ] |
| 4 | Record count reconciliation passed | QA Lead | [ ] |
| 5 | Financial total reconciliation passed | QA Lead | [ ] |
| 6 | Checkpoint 1: go/no-go decision | Project Manager | [ ] |
| 7 | DNS/routing switched to AquaCIS 2.0 | DevOps Lead | [ ] |
| 8 | Smoke tests passed (all critical paths) | QA Team | [ ] |
| 9 | Checkpoint 2: go/no-go decision | Project Manager | [ ] |
| 10 | Customer Portal switched to AquaCIS 2.0 | DevOps Lead | [ ] |
| 11 | WhatsApp bot switched to AquaCIS 2.0 backend | Backend Lead | [ ] |
| 12 | Payment webhooks (Conekta) pointed to AquaCIS 2.0 | Payments Lead | [ ] |
| 13 | CFDI timbrado (PAC) pointed to AquaCIS 2.0 | Fiscal Lead | [ ] |

### 10.3 Post-Cutover Checklist

| # | Item | Owner | Timeline | Status |
|---|------|-------|:--------:|:------:|
| 1 | War room operational | Project Manager | Day 1 | [ ] |
| 2 | First business day: no critical incidents | War Room | Day 1 | [ ] |
| 3 | First billing run on AquaCIS 2.0 | Billing Lead | Week 1-2 | [ ] |
| 4 | Billing run reconciliation: matches expectations | QA Lead | Week 1-2 | [ ] |
| 5 | First CFDI batch timbrado successful | Fiscal Lead | Week 1-2 | [ ] |
| 6 | First payment batch reconciliation successful | Payments Lead | Week 1-2 | [ ] |
| 7 | All dashboards showing live data | Data Engineer | Week 1 | [ ] |
| 8 | CKAN portal publishing live datasets | Data Engineer | Week 2 | [ ] |
| 9 | War room closed (no P1/P2 issues for 3 consecutive days) | Project Manager | Week 2-3 | [ ] |
| 10 | Hyper-care exit criteria met | Project Manager | Week 8 | [ ] |
| 11 | Aquasis archived to cold storage | DBA | Month 36 | [ ] |
| 12 | Post-implementation review completed | Project Manager | Month 36 | [ ] |
| 13 | Lessons learned documented | Project Manager | Month 36 | [ ] |

---

## 11. Risk Register

This phase carries the highest risk profile of the entire AquaCIS 2.0 program. A failure at cutover directly impacts revenue collection, regulatory compliance, and public trust.

| # | Risk | Probability | Impact | Mitigation | Contingency |
|---|------|:----------:|:------:|------------|-------------|
| R1 | **Data migration corruption** -- Migrating from 4,114-table monolith with no FK constraints and inconsistent data types causes data loss or corruption | Medium | Critical | 10-phase migration with validation gates at each step; automated reconciliation; staging environment rehearsal | Rollback to Aquasis; repair migration scripts; re-run from last validated gate |
| R2 | **Billing engine discrepancy during parallel run** -- New tariff engine produces different results than legacy for edge-case contracts | Medium | Critical | Shadow billing for 3+ cycles; invoice-by-invoice automated comparison; mathematical proof testing against 5 years of historical data | Extend parallel run; isolate failing tariff scenarios; apply corrections and revalidate |
| R3 | **Cutover weekend failure** -- Critical issue discovered during cutover window that cannot be resolved in time | Low | Critical | Full dress rehearsal cutover in staging 2 weeks prior; documented rollback plan tested end-to-end; 72-hour rollback window | Abort cutover; revert DNS/routing to Aquasis; conduct post-mortem; reschedule for next available weekend |
| R4 | **User resistance / adoption failure** -- Staff unable or unwilling to use new system, reverting to manual workarounds | Medium | High | 8-week training program; train-the-trainer model; embedded power users; sandbox practice environment | Additional training sessions; one-on-one coaching; simplify workflows; extend hyper-care |
| R5 | **Performance degradation under production load** -- System meets benchmarks in test but degrades with real-world data patterns | Medium | High | Load testing with production-scale data (400K contracts, 10M+ readings); endurance testing (8 hours); database query plan review | Horizontal scaling (add AKS nodes); database query optimization; enable read replicas; add caching layers |
| R6 | **GIS data quality** -- Legacy coordinate data has errors, missing values, or inconsistent formats that prevent accurate map rendering | High | Medium | Data cleansing during M10 migration; field verification for critical assets; validation against INEGI reference data | Progressive data correction; allow approximate coordinates with quality flags; field crew GPS verification campaign |
| R7 | **CKAN/open data compliance delays** -- datos.gob.mx integration requirements change or are more complex than anticipated | Medium | Low | Early engagement with datos.gob.mx team; metadata alignment started in sprint 13; buffer time in schedule | Launch CKAN standalone first; add datos.gob.mx federation as a follow-on task |
| R8 | **Camunda workflow complexity** -- BPMN process models do not capture all edge cases in work order lifecycle | Medium | Medium | Extensive process mapping workshops with field supervisors; iterative model refinement during UAT | Simplify initial BPMN models; handle edge cases as manual exceptions; refine in post-go-live sprints |
| R9 | **Security vulnerability discovered in production** -- Penetration test or post-go-live attack reveals exploitable vulnerability | Low | High | Pre-cutover penetration test by third-party firm; OWASP Top 10 validation; WAF configuration; dependency scanning in CI | Immediate patching; WAF rule to block exploit; incident response plan activation; LGPDPPP breach notification if PII affected |
| R10 | **Vendor lock-in / data access restrictions** -- Agbar/OCCAM restricts access to Aquasis database or SOAP APIs during migration | Medium | High | CDC bridge captures events at database level (independent of SOAP layer); data migration scheduled early; legal review of data portability rights | Escalate to CEA executive team; invoke contractual data portability clauses; extract via database-level access if API access is blocked |
| R11 | **Schedule overrun in testing** -- E2E test failures require extended fixing, pushing cutover date | High | Medium | Testing starts Month 30 with 4-month buffer; defect triage prioritizes cutover-blocking issues; parallel fix-and-test sprints | Defer non-critical fixes to post-go-live; reduce scope of initial cutover (e.g., phased by municipality); extend timeline by 1-2 months |
| R12 | **Hydraulic model calibration** -- EPANET model does not match field conditions due to incomplete pipe data or unknown network configurations | High | Low | Model calibration using pressure logger data; iterative refinement; accept initial model as "planning grade" not "operational grade" | Deploy EPANET as advisory tool only (not operational); refine model over 12 months using AMI data and field verification |

### Risk Heat Map

| | Low Impact | Medium Impact | High Impact | Critical Impact |
|---|:-:|:-:|:-:|:-:|
| **High Probability** | R12 (model) | R6 (GIS data), R8 (Camunda), R11 (schedule) | | |
| **Medium Probability** | R7 (CKAN) | | R4 (adoption), R5 (performance), R10 (vendor) | R1 (migration), R2 (billing) |
| **Low Probability** | | | R9 (security) | R3 (cutover) |

---

## 12. Staffing Plan

### Core Phase 10 Team

| Role | FTE | Duration | Skills Required |
|------|:---:|:--------:|----------------|
| **GIS Specialist** | 1-2 | Months 20-27 | PostGIS, GeoServer, QGIS, spatial data modeling, INEGI data, SRID/coordinate systems |
| **Data Engineer** | 2 | Months 20-36 | Debezium/Kafka Connect, Azure Data Lake, dbt/Spark, Parquet, Apache Superset, ETL pipeline design |
| **QA Lead** | 1 | Months 20-36 | Test strategy, E2E automation (Playwright/k6), performance testing, data validation, migration testing |
| **QA Engineers** | 2-3 | Months 28-36 | Test case development, regression testing, UAT coordination, defect management |
| **Backend Engineers** | 3-4 | Months 20-33 | Go/Java, Camunda BPMN, EPANET/WNTR (Python), CKAN (Python), microservice hardening |
| **DevOps/SRE Engineer** | 1 | Months 20-36 | AKS, Terraform, ArgoCD, disaster recovery, cutover automation, monitoring |
| **Project Manager** | 1 | Months 20-36 | Cutover planning, stakeholder management, risk management, vendor coordination |
| **Training Coordinator** | 1 | Months 30-36 | Training material development, scheduling, user onboarding, knowledge base management |
| **Security Engineer** | 1 (contract) | Months 30-33 | Penetration testing, OWASP, LGPDPPP compliance, Azure security, WAF |
| **DBA** | 1 (shared) | Months 20-36 | PostgreSQL, PostGIS, data migration, backup/restore, performance tuning |

### External Resources

| Resource | Engagement | Purpose |
|----------|:----------:|---------|
| Third-party security firm | 4 weeks (Month 31) | Independent penetration test and security audit |
| Camunda consulting | 2 weeks (Month 22) | BPMN best practices, Zeebe cluster optimization |
| CKAN consulting | 1 week (Month 28) | datos.gob.mx integration, metadata schema design |
| Change management consultant | 4 weeks (Months 32-33) | Organizational readiness assessment, resistance management |

### Staffing Ramp

```
Month:  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36
FTE:     8   8  10  10  10  10  10  10  12  12  16  16  14  14  12  10   8
         GIS + Data Lake                 CKAN   Testing + Migration    Wind-down
              Camunda + EPANET                       UAT + Training
                                                          Cutover + Support
```

---

## Appendix A: Technology Stack Summary (Phase 10)

| Component | Technology | Version | License |
|-----------|-----------|:-------:|:-------:|
| Spatial database | PostGIS | 3.x | GPL v2 |
| Map server | GeoServer | 2.25+ | GPL v2 |
| Desktop GIS | QGIS | 3.x | GPL v2 |
| Web mapping | OpenLayers / Leaflet | Latest | BSD-2 / BSD-2 |
| Workflow engine | Camunda Platform 8 (Zeebe) | 8.x | Apache 2.0 (CE) |
| Hydraulic modeling | EPANET + WNTR | 2.2 / 1.x | Public Domain / BSD |
| BI dashboards | Apache Superset | 3.x | Apache 2.0 |
| Open data portal | CKAN | 2.10+ | AGPL v3 |
| CDC | Debezium | 2.x | Apache 2.0 |
| Data lake storage | Azure Blob Storage | -- | Commercial |
| Data format | Apache Parquet | -- | Apache 2.0 |
| Load testing | k6 | Latest | AGPL v3 |
| E2E testing | Playwright | Latest | Apache 2.0 |
| Security scanning | Trivy + Snyk | Latest | Apache 2.0 / Commercial |

---

## Appendix B: Key Milestones and Decision Gates

| Milestone | Target Date | Decision Gate |
|-----------|:----------:|---------------|
| GIS platform operational | Month 21 | Map layers rendering correctly with production data |
| Camunda workflows live | Month 23 | Work order lifecycle fully automated |
| EPANET model calibrated | Month 23 | Model predictions within 10% of field measurements |
| Data lake operational | Month 25 | CDC pipelines delivering to all three lake layers |
| BI dashboards live | Month 27 | All 5 key dashboards populated with live data |
| CKAN portal public | Month 29 | datos.gob.mx harvesting CEA datasets |
| E2E test suite green | Month 32 | 100% pass rate on all critical test scenarios |
| Security audit clear | Month 33 | Zero critical/high findings open |
| Data migration complete | Month 33 | All 10 migration phases pass all 7 gates |
| Parallel run approved | Month 33 | 3 billing cycles with zero Category A discrepancies |
| UAT sign-off | Month 34 | All user groups formally accept |
| Training complete | Month 35 | 200+ staff certified |
| **GO-LIVE** | **Month 35-36** | **Executive go/no-go with all checklist items passed** |
| Aquasis decommissioned | Month 36+ | All data archived, servers deprovisioned |

---

*This plan was developed based on the AquaCIS 2.0 NextGen Architecture Blueprint, the C4 Cloud-Native Architecture report, the C8 Open-Source Water Solutions research, and the 36-month migration strategy. It represents the final and most critical phase of the CEA Queretaro digital transformation program.*
