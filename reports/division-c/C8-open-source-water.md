# C8: Open-Source Water and Utility Management Solutions

> **Division C -- Technology Research**
> **Agent**: C8 (research-open-source)
> **Date**: 2026-02-16
> **Context**: AquaCIS / AQUASIS replacement analysis for CEA Queretaro

---

## Executive Summary

This report evaluates the open-source ecosystem for water utility Customer Information Systems (CIS) and adjacent technologies that could underpin a next-generation platform for CEA Queretaro. The current AQUASIS system is a monolithic, proprietary Java/SOAP-based platform managing 4,114 database tables (1,970 unique), 126 API operations across 5 WSDL services, and the full commercial lifecycle of a Mexican water utility -- from contracts and meter readings to CFDI electronic invoicing and OXXO/bank payment references.

**Key finding**: There is **no single open-source CIS** that replicates the full scope of AQUASIS. However, a compelling component-based architecture can be assembled from mature open-source projects spanning billing (Kill Bill, OpenMeter), GIS (PostGIS/QGIS/GeoServer), hydraulic modeling (EPANET/WNTR), IoT (ThingsBoard), workflow orchestration (Camunda/Temporal), open data portals (CKAN), and citizen engagement (Decidim). The critical gap remains in Mexico-specific regulatory compliance (CFDI, CONAGUA reporting, tariff structures), which requires custom development regardless of platform choice.

**Open-Source Viability Score for Water CIS: 6/10** -- Viable as a component architecture with significant custom integration; not viable as a drop-in replacement.

---

## 1. Open-Source CIS/Billing Platforms

### 1.1 Kill Bill (killbill.io)

| Attribute | Detail |
|-----------|--------|
| **License** | Apache 2.0 |
| **Language** | Java |
| **Maturity** | Very high -- production since 2012, used by Groupon, Zuora-alternative deployments |
| **GitHub** | github.com/killbill/killbill -- 4,500+ stars |
| **Architecture** | Plugin-based, REST API, PostgreSQL/MySQL |

**Capabilities relevant to water CIS:**
- **Subscription and recurring billing**: Maps to water service contracts with periodic billing cycles
- **Usage-based billing**: Can model metered consumption with usage records
- **Invoice generation**: Automatic invoice creation with customizable templates
- **Payment processing**: Pluggable payment gateways (Stripe, Adyen, custom)
- **Dunning management**: Automated collection workflows for overdue accounts
- **Multi-tenancy**: Supports multiple operating entities (maps to CEA's `sociedad` concept)
- **Audit trail**: Complete history of all billing events
- **Plugin architecture**: Extensible via Java/Ruby plugins for custom logic

**Gaps for AQUASIS replacement:**
- No native CFDI (Mexican electronic invoicing) support -- requires custom plugin
- No concept of physical service points (`ptoserv`), meter readings, or hydraulic infrastructure
- No native OXXO/Mexican bank reference payment generation
- No tariff schedule modeling specific to water utilities (tiered volumetric rates)
- No work order management
- No meter-to-cash workflow

**Assessment**: Kill Bill provides a solid **billing engine core** but requires substantial wrapping to become a water utility CIS. It could serve as the financial backbone in a component architecture, handling invoice lifecycle, payments, and dunning while water-specific logic lives in custom modules.

**Recommendation: MEDIUM** -- Use as billing/payments engine within a larger architecture.

### 1.2 OpenMeter (openmeter.io)

| Attribute | Detail |
|-----------|--------|
| **License** | Apache 2.0 |
| **Language** | Go |
| **Maturity** | Moderate -- launched 2023, actively developed |
| **GitHub** | github.com/openmeterio/openmeter -- 1,500+ stars |
| **Architecture** | Cloud-native, event-driven, ClickHouse for time-series |

**Capabilities relevant to water CIS:**
- **Real-time metering**: Ingests usage events via CloudEvents standard
- **Usage aggregation**: Windowed aggregation of consumption data
- **Entitlement management**: Feature/usage entitlements (maps to contract service levels)
- **API-first**: REST and streaming APIs
- **High-throughput event processing**: Designed for millions of events

**Gaps for AQUASIS replacement:**
- Designed for SaaS/cloud metering, not physical utility metering
- No concept of physical meters, reading routes, or field operations
- No invoicing or payment processing (complementary to Kill Bill, not standalone)
- No regulatory compliance features
- No customer/contract management

**Assessment**: OpenMeter is architecturally interesting for its event-driven consumption tracking model. Its time-series aggregation patterns could inspire how a next-gen CIS handles meter data ingestion, especially for AMR/AMI smart meter rollouts. However, it is not directly applicable as a utility metering system without major adaptation.

**Recommendation: LOW** -- Architectural inspiration only; not directly applicable.

### 1.3 Odoo (Community Edition)

| Attribute | Detail |
|-----------|--------|
| **License** | LGPL v3 (Community) |
| **Language** | Python |
| **Maturity** | Very high -- 20+ years, 12M+ users worldwide |
| **GitHub** | github.com/odoo/odoo -- 37,000+ stars |
| **Architecture** | Modular ERP, PostgreSQL |

**Capabilities relevant to water CIS:**
- **Full ERP**: Accounting, invoicing, CRM, inventory, HR
- **Mexican localization**: Existing CFDI module for Mexican electronic invoicing
- **Customer management**: Full contact and account management
- **Reporting**: Built-in BI and reporting
- **Workflow engine**: Basic process automation
- **REST API**: JSON-RPC and REST interfaces
- **Large Mexican partner ecosystem**: Multiple implementers in Mexico

**Gaps for AQUASIS replacement:**
- No water utility-specific modules (meters, readings, service points, tariffs)
- General-purpose ERP -- would need extensive customization
- Community edition lacks enterprise features
- Performance concerns at high transaction volumes

**Assessment**: Odoo's Mexican CFDI compliance and existing localization make it the strongest candidate for the **financial/accounting layer**. A water utility vertical module could be built on Odoo's framework, leveraging its invoicing, payments, and accounting while adding meter-to-cash logic.

**Recommendation: MEDIUM** -- Strong candidate for financial/accounting backbone, especially given CFDI compliance.

### 1.4 Other Notable Open-Source Billing

| Platform | License | Notes |
|----------|---------|-------|
| **Apache Fineract** | Apache 2.0 | Microfinance platform; loan/savings focus, not utility billing |
| **FOSSBilling** | Apache 2.0 | Web hosting billing; too niche |
| **InvoiceNinja** | AAL/Elastic | Small business invoicing; lacks utility features |
| **Crater** | AAL | Laravel-based invoicing; too simple for CIS |

None of these are directly applicable to water utility CIS but confirm the pattern: **billing is a solved problem in open source; water utility domain logic is not**.

---

## 2. Open Data Portals -- CKAN

### 2.1 CKAN Overview

| Attribute | Detail |
|-----------|--------|
| **License** | AGPL v3 |
| **Language** | Python (Flask/SQLAlchemy) |
| **Maturity** | Very high -- 10+ years, maintained by Open Knowledge Foundation |
| **GitHub** | github.com/ckan/ckan -- 4,400+ stars |
| **Deployment** | Docker, Kubernetes, bare metal |

**CKAN is the world's leading open data platform**, powering data.gov (US), data.gov.uk (UK), the European Data Portal, and critically, **datos.gob.mx** (Mexico's national open data portal).

### 2.2 Relevance to CEA Queretaro

| Use Case | CKAN Capability |
|----------|-----------------|
| **Transparency compliance** | Publish water quality reports, tariff schedules, service coverage maps |
| **CONAGUA reporting** | Structured datasets for national water authority compliance |
| **Citizen access** | Public API for consumption data, outage maps, infrastructure investments |
| **Inter-agency data sharing** | Federated data exchange with municipal, state, and federal agencies |
| **Historical data archive** | Time-series datasets for consumption trends, infrastructure aging |

### 2.3 Key CKAN Extensions for Water Utilities

| Extension | Purpose |
|-----------|---------|
| **ckanext-spatial** | GeoJSON/WMS integration for spatial datasets |
| **ckanext-harvest** | Automated data harvesting from external sources |
| **ckanext-scheming** | Custom metadata schemas (WaterML, CIM compliance) |
| **ckanext-dcat** | DCAT-AP metadata standard (EU interoperability) |
| **ckanext-xloader** | Automatic data loading into DataStore |
| **ckanext-charts** | Visualization of datasets |

### 2.4 Integration Architecture

```
AQUASIS/CIS  -->  ETL Pipeline  -->  CKAN DataStore
                                          |
                                    CKAN API (REST)
                                          |
                              +-----------+-----------+
                              |           |           |
                         datos.gob.mx   Citizen    CONAGUA
                                        Portal    Reporting
```

CKAN would not replace any CIS functionality but serves as the **transparency and open data layer**, extracting anonymized/aggregated data from the operational CIS for public consumption and regulatory compliance.

**Recommendation: HIGH** -- Deploy CKAN as the open data layer. Aligns with Mexican transparency law (Ley General de Transparencia), datos.gob.mx integration, and modern citizen engagement expectations.

---

## 3. GIS Stack -- PostGIS / QGIS / GeoServer

### 3.1 PostGIS

| Attribute | Detail |
|-----------|--------|
| **License** | GPL v2 |
| **Type** | PostgreSQL spatial extension |
| **Maturity** | Very high -- 20+ years, industry standard |
| **Capabilities** | Spatial indexing, geometry/geography types, spatial queries, raster analysis |

**Critical relevance**: CEA Queretaro's AQUASIS already runs on PostgreSQL. Adding PostGIS is a **zero-cost extension** that enables:
- Spatial indexing of all service points (`ptoserv`), connections (`acometida`), and network infrastructure
- Proximity queries (find nearest valve, identify affected customers in an outage zone)
- Network topology for pipe routing and flow analysis
- Integration with INEGI cartographic data and Mexican national geographic datasets

### 3.2 QGIS

| Attribute | Detail |
|-----------|--------|
| **License** | GPL v2 |
| **Type** | Desktop/Server GIS application |
| **Maturity** | Very high -- 20+ years, OSGeo project |
| **Users** | Millions worldwide including municipal governments |

**Water utility applications:**
- Network mapping and visualization
- Leak detection spatial analysis
- Service coverage mapping
- Reading route optimization
- Infrastructure asset management visualization
- Integration with INEGI, OpenStreetMap, and satellite imagery
- Print-quality map generation for regulatory filings

### 3.3 GeoServer

| Attribute | Detail |
|-----------|--------|
| **License** | GPL v2 |
| **Type** | OGC-compliant map server |
| **Maturity** | Very high -- 20+ years, OSGeo project |
| **Standards** | WMS, WFS, WCS, WMTS |

**Role in architecture:**
- Serves spatial data from PostGIS to web applications via OGC standards
- Enables web-based map viewers for both internal operations and citizen portals
- Provides tile caching for performance at scale
- Supports SLD styling for thematic maps (pressure zones, water quality, NRW)

### 3.4 Integrated GIS Architecture for Water CIS

```
+-----------------+     +-------------------+     +------------------+
|   PostGIS       |     |    GeoServer      |     |   Web Client     |
|   (Spatial DB)  |---->|  (OGC Services)   |---->|  (Leaflet/OL)    |
|                 |     |  WMS/WFS/WMTS     |     |                  |
+-----------------+     +-------------------+     +------------------+
        |                                                   |
        v                                                   v
+-----------------+                               +------------------+
|   QGIS Desktop  |                               |   CKAN Spatial   |
|   (Analysis)    |                               |   (Open Data)    |
+-----------------+                               +------------------+
```

### 3.5 Specific CEA Queretaro Applications

| Application | GIS Components | Priority |
|-------------|---------------|----------|
| **Service point geocoding** | PostGIS, INEGI address matching | HIGH |
| **Network infrastructure map** | PostGIS topology, QGIS, GeoServer | HIGH |
| **Reading route optimization** | PostGIS pgRouting, QGIS | MEDIUM |
| **Leak/NRW spatial analysis** | PostGIS, QGIS, EPANET integration | HIGH |
| **Pressure zone management** | PostGIS, GeoServer thematic maps | MEDIUM |
| **Outage impact analysis** | PostGIS spatial queries, GeoServer | MEDIUM |
| **Citizen service coverage map** | GeoServer WMS, Leaflet, CKAN | LOW |

**Recommendation: HIGH** -- The PostGIS/QGIS/GeoServer stack is the undisputed standard for open-source GIS. Given AQUASIS already runs on PostgreSQL, PostGIS adoption is natural and high-value. This is the most immediately actionable open-source adoption area.

---

## 4. Data Standards -- WaterML, CIM, INSPIRE

### 4.1 WaterML 2.0

| Attribute | Detail |
|-----------|--------|
| **Standard** | OGC WaterML 2.0 (ISO 19156) |
| **Maintained by** | Open Geospatial Consortium (OGC) |
| **Format** | XML/GML-based |
| **Scope** | Time-series water observation data |

**What it standardizes:**
- Water level measurements
- Flow/discharge readings
- Water quality parameters
- Meteorological observations related to water
- Temporal aggregation and interpolation types

**Relevance to CEA Queretaro:**
- Standardized format for meter reading time-series data
- Interoperability with national water monitoring systems (CONAGUA)
- Export format for CKAN open data publishing
- International best practice for water data exchange

**Adoption reality**: WaterML 2.0 is primarily used in **hydrology and environmental monitoring** rather than commercial utility metering. It is relevant for CEA's environmental reporting and CONAGUA data exchange but not for core billing operations.

**Recommendation: MEDIUM** -- Adopt for environmental/regulatory data exchange; not for core CIS operations.

### 4.2 CIM (Common Information Model)

| Attribute | Detail |
|-----------|--------|
| **Standard** | IEC 61968/61970 (CIM for Utilities) |
| **Maintained by** | IEC TC 57 |
| **Scope** | Enterprise integration for electric, gas, and water utilities |

**Relevant CIM packages for water:**
- **IEC 61968-9**: Meter reading and control
- **IEC 61968-6**: Maintenance and construction
- **IEC 61968-3**: Network extension planning
- **IEC 61968-4**: Records and asset management
- **IEC 61968-8**: Customer support (CIS integration)

**What it provides:**
- Canonical data model for utility enterprise integration
- Message exchange patterns between CIS, GIS, SCADA, and OMS
- Standard object model for meters, service points, accounts, and work orders
- Interoperability bus architecture (Enterprise Service Bus patterns)

**Relevance to CEA Queretaro:**
- The CIM data model aligns closely with AQUASIS's entity structure (contracts, service points, meters, readings, work orders)
- Adopting CIM as the **canonical data model** for a next-gen CIS would future-proof integration with SCADA, smart meter systems, and inter-utility data exchange
- Several open-source CIM parsers and model libraries exist (e.g., CIMpy for Python, CIM-tool for Java)

**Gaps:**
- CIM is primarily adopted in the **electric utility** sector; water utility adoption is limited
- Complex to implement fully; pragmatic partial adoption is common
- No complete open-source CIM implementation for water utilities

**Recommendation: MEDIUM** -- Adopt CIM entity naming conventions and data model patterns as architectural guidance; full CIM compliance is overkill for a single municipal water utility.

### 4.3 INSPIRE (EU Infrastructure for Spatial Information)

| Attribute | Detail |
|-----------|--------|
| **Standard** | EU Directive 2007/2/EC |
| **Scope** | Standardized spatial data across Europe |
| **Relevance** | Utility Networks theme, Water Distribution theme |

**Relevance to CEA Queretaro:**
- INSPIRE's data model for utility networks is a well-documented reference architecture
- While not legally binding in Mexico, INSPIRE patterns inform best practices
- The INSPIRE Utility Networks model covers pipes, nodes, valves, pumps, and service connections

**Recommendation: LOW** -- Reference only; not directly applicable in Mexico but informative for data model design.

---

## 5. Network Modeling -- EPANET / WNTR

### 5.1 EPANET

| Attribute | Detail |
|-----------|--------|
| **License** | Public domain (US EPA) |
| **Language** | C (engine), various GUIs |
| **Maturity** | Very high -- 30+ years, global standard |
| **Current** | EPANET 2.2 (2020) |
| **Maintained by** | US EPA, OpenWaterAnalytics community |

**Capabilities:**
- **Hydraulic simulation**: Extended-period simulation of pipe flow, pressures, and tank levels
- **Water quality modeling**: Chlorine decay, contaminant transport, water age
- **Network design**: Pipe sizing, pump selection, tank placement
- **Demand analysis**: Pattern-based demand modeling for different usage types
- **Fire flow analysis**: Identify capacity for fire protection
- **Energy analysis**: Pump energy costs and optimization

**CEA Queretaro applications:**
- Model the Queretaro water distribution network
- Identify low-pressure zones and capacity constraints
- Optimize pump schedules for energy cost reduction
- Simulate emergency scenarios (main breaks, contamination)
- Support infrastructure planning and expansion decisions
- Non-Revenue Water (NRW) analysis via discrepancy between modeled and actual flows

### 5.2 WNTR (Water Network Tool for Resilience)

| Attribute | Detail |
|-----------|--------|
| **License** | BSD (Sandia National Labs / US EPA) |
| **Language** | Python |
| **Maturity** | High -- active development since 2016 |
| **GitHub** | github.com/USEPA/WNTR -- 500+ stars |
| **Dependency** | Wraps EPANET engine; extends with Python API |

**Capabilities beyond EPANET:**
- **Resilience analysis**: Quantify system vulnerability to disruptions
- **Damage assessment**: Simulate earthquake, flood, and other natural disaster impacts
- **Fragility modeling**: Pipe break probability based on material, age, soil conditions
- **Pressure-dependent demand**: More realistic demand modeling under low-pressure conditions
- **Stochastic simulation**: Monte Carlo analysis for probabilistic assessments
- **Python integration**: Full Python API for scripting and integration with data science tools

**Integration with next-gen CIS:**
```
CIS Database  -->  WNTR Python  -->  Simulation Results  -->  GIS Visualization
(PostGIS)         (EPANET engine)    (pressure, flow)        (GeoServer/QGIS)
```

WNTR can read network models, run simulations, and output results that integrate with the GIS stack (PostGIS) for spatial visualization and with CKAN for public transparency reporting.

**Recommendation: HIGH** -- EPANET/WNTR is the global standard for water network modeling. Integration with the GIS stack and CIS consumption data provides powerful operational intelligence. Essential for any modern water utility platform.

---

## 6. IoT Platforms -- Open-Source Meter Data Collection

### 6.1 ThingsBoard (Community Edition)

| Attribute | Detail |
|-----------|--------|
| **License** | Apache 2.0 (Community) |
| **Language** | Java |
| **Maturity** | High -- production since 2016, large community |
| **GitHub** | github.com/thingsboard/thingsboard -- 17,000+ stars |
| **Architecture** | Microservices, multi-protocol, rule engine |

**Capabilities for water metering:**
- **Multi-protocol support**: MQTT, CoAP, HTTP, LWM2M, SNMP, OPC-UA
- **Device management**: Provision, configure, and monitor smart meters
- **Data visualization**: Real-time dashboards for meter readings and alarms
- **Rule engine**: Complex event processing for anomaly detection (leak alerts, tampering)
- **Data integration**: REST API, Kafka, RabbitMQ for downstream processing
- **Edge computing**: ThingsBoard Edge for local processing before cloud sync
- **Multi-tenancy**: Suitable for utility organizational structure

**Water utility-specific applications:**
- Collect AMR/AMI smart meter data via LoRaWAN, NB-IoT, or cellular
- Real-time consumption monitoring and leak detection
- Pressure and flow sensor data aggregation
- Water quality sensor integration (chlorine, turbidity, pH)
- Alarm management for threshold violations

### 6.2 Eclipse IoT Stack

| Component | License | Purpose |
|-----------|---------|---------|
| **Eclipse Mosquitto** | EPL/EDL | MQTT broker for meter communication |
| **Eclipse Ditto** | EPL 2.0 | Digital twin framework for meter assets |
| **Eclipse Hono** | EPL 2.0 | Device connectivity layer (multi-protocol) |
| **Eclipse Vorto** | EPL 2.0 | IoT device model repository |

The Eclipse IoT stack provides **lower-level building blocks** compared to ThingsBoard's integrated platform. It requires more assembly but offers greater architectural flexibility.

### 6.3 Comparison for Water Meter Data

| Feature | ThingsBoard CE | Eclipse IoT Stack |
|---------|---------------|-------------------|
| **Time to deploy** | Fast (integrated) | Slow (assembly required) |
| **Smart meter support** | Good (multi-protocol) | Good (Eclipse Hono) |
| **Dashboards** | Built-in | Requires Grafana/custom |
| **Rule engine** | Built-in | Requires custom logic |
| **Scalability** | Good (Kafka-based) | Excellent (microservices) |
| **Community** | Large | Fragmented per project |
| **Customization** | Plugin-based | Full control |

### 6.4 Integration with CIS

```
Smart Meters  -->  LoRaWAN/NB-IoT  -->  ThingsBoard  -->  CIS Database
                                              |
                                        Rule Engine
                                              |
                                    +----+----+----+
                                    |    |    |    |
                                  Leak  High  Tamper  Billing
                                  Alert Usage Alert   Trigger
```

**Current AQUASIS context**: The database already has `equipo` (equipment/smart meter) and `poldetsum` (reading detail) tables. A next-gen system would replace manual reading uploads with real-time IoT ingestion, which ThingsBoard handles well.

**Recommendation: HIGH** -- ThingsBoard Community Edition is the strongest open-source option for meter data collection and IoT device management. Deploy as the IoT layer feeding the CIS billing engine.

---

## 7. Workflow Engines -- Work Order and Process Management

### 7.1 Camunda Platform 8 (Community)

| Attribute | Detail |
|-----------|--------|
| **License** | Apache 2.0 (Zeebe engine); mixed for other components |
| **Language** | Java (Zeebe), multi-language workers |
| **Maturity** | Very high -- 10+ years, enterprise adoption |
| **GitHub** | github.com/camunda -- Zeebe: 3,800+ stars |
| **Architecture** | BPMN 2.0 engine, event-driven, horizontally scalable |

**Capabilities for water utility workflows:**
- **BPMN 2.0 process modeling**: Visual process design for work orders, complaints, new connections
- **DMN decision tables**: Tariff calculation, eligibility determination, approval routing
- **Human task management**: Assign field tasks, track completion, manage SLAs
- **Process monitoring**: Real-time visibility into all active processes
- **External task workers**: Language-agnostic integration with CIS, GIS, billing systems
- **Event-driven**: React to meter events, payment events, customer requests

**Water utility workflow examples:**
| Workflow | BPMN Process |
|----------|-------------|
| **New connection request** | Application --> Feasibility check (GIS) --> Approval --> Scheduling --> Field work --> Meter installation --> Contract activation --> First bill |
| **Meter reading campaign** | Route planning --> Field dispatch --> Reading entry --> Validation --> Exception handling --> Billing trigger |
| **Complaint resolution** | Registration --> Classification --> Assignment --> Investigation --> Resolution --> Customer notification --> Satisfaction survey |
| **Disconnection/Reconnection** | Debt threshold trigger --> Notice generation --> Grace period --> Field order --> Physical cutoff --> Payment --> Reconnection order |
| **Infrastructure maintenance** | Scheduled maintenance --> Work order generation --> Parts allocation --> Field dispatch --> Completion --> Asset update |

### 7.2 Temporal

| Attribute | Detail |
|-----------|--------|
| **License** | MIT |
| **Language** | Go (server), multi-language SDKs |
| **Maturity** | High -- production since 2020 (lineage from Uber Cadence) |
| **GitHub** | github.com/temporalio/temporal -- 12,000+ stars |
| **Architecture** | Durable execution engine, event-sourced |

**Capabilities:**
- **Durable workflows**: Long-running processes that survive failures (ideal for multi-day work orders)
- **Saga pattern**: Distributed transactions across microservices
- **Visibility**: Query and observe running workflows
- **Multi-language**: Go, Java, Python, TypeScript SDKs
- **Retry policies**: Configurable retry and timeout for each step
- **Signals and queries**: External interaction with running workflows

**Comparison for water CIS:**

| Feature | Camunda | Temporal |
|---------|---------|----------|
| **BPMN visual modeling** | Native | No (code-first) |
| **Business user accessibility** | High (modeler) | Low (developer-only) |
| **DMN decision tables** | Yes | No |
| **Process monitoring dashboard** | Built-in (Operate) | Basic (Web UI) |
| **Developer experience** | Good | Excellent |
| **Human task management** | Built-in (Tasklist) | Requires custom |
| **Scalability** | High | Very high |

**Assessment**: For a water utility with business process owners, field supervisors, and regulatory workflows, **Camunda is the better fit** due to its BPMN visual modeling and human task management. Temporal excels as a developer-focused orchestration engine but lacks the business user interface that a utility needs.

**Recommendation: HIGH (Camunda)** -- Replace AQUASIS's work order system (`orden` table, 44 columns) with BPMN-modeled workflows in Camunda. This provides process visibility, SLA tracking, and integration with field mobile apps.

---

## 8. Citizen Portals -- Open-Source Customer Engagement

### 8.1 Decidim

| Attribute | Detail |
|-----------|--------|
| **License** | AGPL v3 |
| **Language** | Ruby on Rails |
| **Maturity** | High -- production since 2017, Barcelona City Council origin |
| **GitHub** | github.com/decidim/decidim -- 1,500+ stars |
| **Focus** | Participatory democracy and civic engagement |

**Capabilities:**
- **Participatory processes**: Public consultations on water rate changes, infrastructure projects
- **Proposals and voting**: Citizens propose improvements, vote on priorities
- **Assemblies**: Community advisory boards for water service oversight
- **Accountability**: Track government commitments and progress
- **Multilingual**: Full Spanish support
- **Conferences**: Organize public hearings on water policy
- **Blog/News**: Communicate service updates

**Water utility applications:**
- Public consultation on tariff restructuring
- Participatory budgeting for infrastructure investment priorities
- Community reporting of leaks, water quality issues, damaged infrastructure
- Transparency dashboard for utility performance metrics

### 8.2 Consul (CONSUL Democracy)

| Attribute | Detail |
|-----------|--------|
| **License** | AGPL v3 |
| **Language** | Ruby on Rails |
| **Maturity** | High -- production since 2015, Madrid City Council origin |
| **GitHub** | github.com/consul/consul -- 1,600+ stars |
| **Focus** | Citizen participation, proposals, debates, voting |

**Similar to Decidim** with a slightly different feature emphasis. Both originate from Spanish municipal governments, making them culturally appropriate for Latin American deployment.

### 8.3 Customer Self-Service Portal

Neither Decidim nor Consul is a **customer self-service portal** for utility operations (checking balance, paying bills, viewing consumption). For that, the existing AGORA platform (already in the CEA ecosystem) is more appropriate, or a custom portal built on:

| Component | Purpose |
|-----------|---------|
| **Next.js / Nuxt.js** | Frontend framework |
| **Keycloak** | Identity and access management (open-source IAM) |
| **Strapi / Directus** | Headless CMS for content |
| **CIS API** | Backend for account, billing, consumption data |

**Recommendation: MEDIUM (Decidim/Consul)** -- Valuable for civic engagement and transparency, but not a replacement for a customer self-service portal. The AGORA platform already fills the customer communication gap.

---

## 9. Mexican Open Data -- Government Integration

### 9.1 datos.gob.mx

Mexico's national open data portal runs on **CKAN**, creating a natural integration path:

| Integration Point | Mechanism |
|--------------------|-----------|
| **Data publishing** | CKAN Harvester from CEA CKAN instance to datos.gob.mx |
| **Standard formats** | CSV, JSON, GeoJSON per datos.gob.mx guidelines |
| **Metadata schema** | DCAT-AP aligned with Mexican open data policy |
| **Update frequency** | Automated ETL from CIS to CKAN, harvested by national portal |

### 9.2 CONAGUA Data Standards

The Comision Nacional del Agua (CONAGUA) requires utilities to report:

| Reporting Area | Data Elements | Potential Standard |
|----------------|---------------|--------------------|
| **Water extraction volumes** | Source, volume, period | WaterML 2.0 |
| **Treatment plant operations** | Flow, quality parameters | WaterML 2.0 |
| **Distribution system performance** | Coverage, NRW, pressure | CIM / Custom |
| **Tariff structure** | Rate schedules, subsidies | Custom JSON/XML |
| **Customer statistics** | Accounts, consumption by type | Tabular (CSV) |
| **Infrastructure inventory** | Pipe km, treatment capacity | GIS (GeoJSON) |

### 9.3 CFDI (Comprobante Fiscal Digital por Internet)

This is the **most Mexico-specific requirement** and the one least addressed by open-source solutions:

| CFDI Requirement | Open-Source Option |
|------------------|--------------------|
| **XML generation** | Custom (cfdi-xml libraries exist in PHP, Python, Ruby, C#) |
| **PAC integration** | REST API to authorized certification provider (Finkok, Digicel, etc.) |
| **UUID timbrado** | PAC service returns fiscal UUID |
| **PDF representation** | Custom PDF generator with QR code |
| **Cancellation** | PAC cancellation API |
| **Complemento de Pagos** | Payment complement generation |

Several open-source libraries exist for CFDI generation:
- **phpcfdi/cfdi** (PHP) -- Most mature Mexican fiscal library ecosystem
- **nodecfdi** (TypeScript/Node.js) -- Growing ecosystem
- **facturapi** SDK (various) -- Commercial API with open-source SDKs

**Recommendation: HIGH** -- CFDI compliance is mandatory and must be a core requirement of any CIS. Use existing open-source CFDI libraries with PAC integration rather than building from scratch.

### 9.4 SIASAR (Sistema de Informacion de Agua y Saneamiento Rural)

SIASAR is a water and sanitation information system used across Latin America (Honduras, Nicaragua, Panama, Colombia, and increasingly Mexico for rural systems). While not directly applicable to Queretaro's urban system, it represents a regional standard for water utility data exchange.

**Recommendation: LOW** -- Monitor for regional data exchange standards.

---

## 10. Component Architecture -- Assembling a Next-Gen CIS

### 10.1 Architectural Vision

Rather than seeking a single monolithic open-source CIS, the recommended approach is a **modular component architecture** where each open-source project handles its domain of expertise, connected via APIs and event streaming.

```
                                    CITIZEN LAYER
                          +---------------------------+
                          |  AGORA (Omnichannel)      |
                          |  Decidim (Participation)  |
                          |  CKAN (Open Data)         |
                          +-------------+-------------+
                                        |
                                   API Gateway
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
            COMMERCIAL CORE        OPERATIONS          INTELLIGENCE
          +----------------+   +----------------+   +----------------+
          | Custom CIS     |   | Camunda        |   | EPANET/WNTR   |
          | Module         |   | (Workflows)    |   | (Hydraulic)    |
          | - Contracts    |   | - Work Orders  |   |                |
          | - Tariffs      |   | - Complaints   |   | PostGIS/QGIS   |
          | - Readings     |   | - Connections  |   | GeoServer      |
          | - Service Pts  |   | - Maintenance  |   | (GIS)          |
          +-------+--------+   +-------+--------+   +-------+--------+
                  |                     |                     |
          +-------+--------+   +-------+--------+   +-------+--------+
          | Kill Bill /    |   | ThingsBoard    |   | Apache Kafka / |
          | Odoo           |   | (IoT/Meters)   |   | RedPanda       |
          | (Billing)      |   |                |   | (Event Stream) |
          | + CFDI libs    |   | Smart Meters   |   |                |
          +----------------+   | Sensors        |   | TimescaleDB    |
                               +----------------+   | (Time Series)  |
                                                     +----------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                   DATA LAYER
                          +---------------------------+
                          |  PostgreSQL + PostGIS      |
                          |  TimescaleDB (readings)    |
                          |  Redis (cache/realtime)    |
                          |  OpenSearch (full-text)    |
                          +---------------------------+
```

### 10.2 Component Mapping to AQUASIS Functions

| AQUASIS Function | Current Tables | Next-Gen Component | Open-Source Base |
|------------------|---------------|-------------------|-----------------|
| **Customer management** | `persona`, `cliente`, `direccion` | Custom CIS module | PostgreSQL + Keycloak |
| **Contract management** | `contrato`, `polcontar`, `variable` | Custom CIS module | PostgreSQL + API |
| **Meter management** | `contador`, `equipo` | ThingsBoard + Custom | ThingsBoard CE |
| **Meter readings** | `poldetsum`, `lote` | ThingsBoard + TimescaleDB | ThingsBoard + TimescaleDB |
| **Billing/Invoicing** | `factura`, `facturable`, `linfactura` | Kill Bill or Odoo + CFDI | Kill Bill / Odoo CE |
| **Payments** | `opecargest`, `opedesglos`, `referencia` | Kill Bill + custom payment gateway | Kill Bill |
| **Tariff management** | `tarifa`, `concepto`, `aplictarif` | Custom CIS module | PostgreSQL |
| **Work orders** | `orden` | Camunda BPMN | Camunda CE |
| **Complaints** | `gestreclam` | Camunda + AGORA | Camunda CE |
| **GIS/Network** | `ptoserv`, `acometida`, `servicio` | PostGIS + GeoServer | PostGIS/GeoServer |
| **Fiscal compliance** | `factura`, `impufact` | CFDI libraries + PAC | phpcfdi / nodecfdi |
| **Reporting** | Various denormalized tables | Apache Superset / Metabase | Metabase CE |
| **Audit trail** | `sesion` | Custom + OpenSearch | PostgreSQL + OpenSearch |
| **Zones/Routes** | `zona`, `lote` | PostGIS + pgRouting | PostGIS |
| **Fraud investigation** | `expedsif` | Custom + GIS | PostGIS + Custom |

### 10.3 Technology Stack Summary

| Layer | Technology | License | Role |
|-------|-----------|---------|------|
| **Database** | PostgreSQL 16+ | PostgreSQL License | Primary data store |
| **Spatial** | PostGIS 3.x | GPL v2 | Spatial data and queries |
| **Time-Series** | TimescaleDB CE | Apache 2.0 | Meter reading storage |
| **Cache** | Redis / Valkey | BSD / BSD | Real-time data and caching |
| **Search** | OpenSearch | Apache 2.0 | Full-text search and analytics |
| **Event Streaming** | Apache Kafka / RedPanda | Apache 2.0 / BSL | Event bus between components |
| **Billing Engine** | Kill Bill or Odoo CE | Apache 2.0 / LGPL | Invoice and payment lifecycle |
| **Workflow** | Camunda 8 CE | Apache 2.0 | BPMN process orchestration |
| **IoT** | ThingsBoard CE | Apache 2.0 | Smart meter data collection |
| **GIS Server** | GeoServer | GPL v2 | Web map services |
| **GIS Desktop** | QGIS | GPL v2 | Network analysis and mapping |
| **Hydraulic** | EPANET / WNTR | Public domain / BSD | Network simulation |
| **Open Data** | CKAN | AGPL v3 | Transparency portal |
| **Civic Engagement** | Decidim | AGPL v3 | Citizen participation |
| **Identity** | Keycloak | Apache 2.0 | SSO, OAuth2, OIDC |
| **API Gateway** | Kong or APISIX | Apache 2.0 | API management and security |
| **BI/Reporting** | Apache Superset or Metabase | Apache 2.0 / AGPL | Dashboards and reports |
| **CFDI** | phpcfdi / nodecfdi | MIT | Mexican electronic invoicing |
| **Monitoring** | Prometheus + Grafana | Apache 2.0 / AGPL | Infrastructure monitoring |
| **Container** | Kubernetes / Docker | Apache 2.0 | Deployment orchestration |

---

## 11. Recommendations Summary

| # | Component | Recommendation | Priority | Rationale |
|---|-----------|---------------|----------|-----------|
| 1 | **PostGIS + GeoServer + QGIS** | Adopt for all spatial operations | **HIGH** | Natural extension of existing PostgreSQL; immediate value for network mapping, service point geocoding, and operational analytics |
| 2 | **EPANET + WNTR** | Adopt for hydraulic modeling | **HIGH** | Global standard; essential for NRW reduction, pressure management, and infrastructure planning |
| 3 | **ThingsBoard CE** | Adopt for smart meter/IoT data | **HIGH** | Mature IoT platform; critical for AMR/AMI smart meter rollout and real-time monitoring |
| 4 | **Camunda CE** | Adopt for workflow orchestration | **HIGH** | BPMN-based work orders, complaints, and process management with business user accessibility |
| 5 | **CKAN** | Deploy for open data and transparency | **HIGH** | Aligns with datos.gob.mx, transparency law compliance, and citizen trust building |
| 6 | **CFDI open-source libraries** | Integrate for fiscal compliance | **HIGH** | Mandatory for Mexican operations; mature libraries exist |
| 7 | **Kill Bill or Odoo CE** | Evaluate for billing engine | **MEDIUM** | Strong billing foundations but require significant water utility customization |
| 8 | **Keycloak** | Adopt for identity management | **MEDIUM** | Standard IAM for SSO, OAuth2; replaces custom authentication |
| 9 | **Apache Superset / Metabase** | Adopt for BI and reporting | **MEDIUM** | Replace denormalized report tables with dynamic dashboards |
| 10 | **WaterML 2.0 / CIM patterns** | Adopt selectively for data models | **MEDIUM** | Guide data model design; full compliance unnecessary |
| 11 | **Decidim** | Evaluate for civic engagement | **MEDIUM** | Complements AGORA for participatory processes (tariff consultations, infrastructure priorities) |
| 12 | **OpenMeter** | Monitor for architecture patterns | **LOW** | Event-driven metering concepts useful but not directly applicable |
| 13 | **INSPIRE** | Reference for data modeling | **LOW** | European standard; informative but not applicable in Mexico |
| 14 | **SIASAR** | Monitor for regional standards | **LOW** | Rural focus; limited urban utility relevance |

---

## 12. Open-Source Viability Score

### Scoring Methodology

Each dimension scored 1-10, weighted by importance to a water utility CIS.

| Dimension | Score | Weight | Weighted | Notes |
|-----------|-------|--------|----------|-------|
| **Billing/Invoicing** | 7 | 20% | 1.40 | Kill Bill/Odoo are strong but need water-specific customization |
| **Customer Management** | 5 | 15% | 0.75 | No open-source water CRM; must be custom-built |
| **Meter Management** | 8 | 15% | 1.20 | ThingsBoard excellent for IoT; reading ingestion well-covered |
| **GIS/Network** | 10 | 10% | 1.00 | PostGIS/QGIS/GeoServer is the gold standard |
| **Work Orders** | 9 | 10% | 0.90 | Camunda BPMN is excellent for workflow |
| **Regulatory Compliance** | 4 | 15% | 0.60 | CFDI libraries exist but full Mexican regulatory stack needs custom work |
| **Reporting/Analytics** | 8 | 5% | 0.40 | Superset/Metabase are excellent |
| **Citizen Engagement** | 7 | 5% | 0.35 | CKAN + Decidim + AGORA cover engagement well |
| **Integration Maturity** | 5 | 5% | 0.25 | Component integration requires significant custom glue |
| **Total** | | 100% | **6.85** | |

### Final Score: **6/10** (rounded)

**Interpretation**: Open-source components can cover approximately **60-70% of the functionality** needed for a water utility CIS. The remaining 30-40% -- primarily the **water-specific commercial core** (tariff engine, meter-to-cash workflow, Mexican regulatory compliance, and integration glue) -- requires custom development. This is a **viable but non-trivial** path that offers long-term benefits in flexibility, vendor independence, and community innovation, but demands significant upfront engineering investment.

### Comparison with Alternative Approaches

| Approach | Estimated Effort | Vendor Lock-in | Long-term Cost | Flexibility |
|----------|-----------------|----------------|----------------|-------------|
| **Keep AQUASIS** | Low (maintenance) | High | High (licensing) | Very Low |
| **Commercial CIS replacement** | Medium (implementation) | High | High (licensing) | Low |
| **Open-source component architecture** | High (development) | None | Low (no licensing) | Very High |
| **Hybrid: Commercial core + OSS periphery** | Medium | Medium | Medium | Medium |

The **recommended approach** is the **hybrid model**: use a commercial or custom-built water CIS core for the meter-to-cash commercial functions, surrounded by open-source components for GIS, IoT, workflow, analytics, and citizen engagement. This balances development effort with the flexibility and cost advantages of open-source while acknowledging that water utility commercial logic is too specialized for generic open-source solutions.

---

## Appendix A: Key Open-Source Project URLs

| Project | Repository / Site |
|---------|-------------------|
| Kill Bill | https://killbill.io / github.com/killbill/killbill |
| OpenMeter | https://openmeter.io / github.com/openmeterio/openmeter |
| Odoo CE | https://www.odoo.com / github.com/odoo/odoo |
| CKAN | https://ckan.org / github.com/ckan/ckan |
| PostGIS | https://postgis.net |
| QGIS | https://qgis.org / github.com/qgis/QGIS |
| GeoServer | https://geoserver.org |
| EPANET | https://www.epa.gov/water-research/epanet |
| WNTR | https://github.com/USEPA/WNTR |
| ThingsBoard | https://thingsboard.io / github.com/thingsboard/thingsboard |
| Camunda | https://camunda.com / github.com/camunda |
| Temporal | https://temporal.io / github.com/temporalio/temporal |
| Decidim | https://decidim.org / github.com/decidim/decidim |
| CKAN | https://ckan.org / github.com/ckan/ckan |
| Keycloak | https://www.keycloak.org / github.com/keycloak/keycloak |
| Apache Superset | https://superset.apache.org |
| Metabase | https://www.metabase.com / github.com/metabase/metabase |
| Apache Kafka | https://kafka.apache.org |
| Kong Gateway | https://konghq.com/kong / github.com/Kong/kong |
| phpcfdi | https://github.com/phpcfdi |
| nodecfdi | https://github.com/nodecfdi |
| TimescaleDB | https://www.timescale.com |

## Appendix B: Licensing Compatibility Matrix

| License | Commercial Use | Modification | Distribution | Network Use | Copyleft |
|---------|:-------------:|:------------:|:------------:|:-----------:|:--------:|
| Apache 2.0 | Yes | Yes | Yes | Yes | No |
| MIT | Yes | Yes | Yes | Yes | No |
| BSD | Yes | Yes | Yes | Yes | No |
| LGPL v3 | Yes | Yes | Yes* | Yes | Weak |
| GPL v2 | Yes | Yes | Yes* | Yes | Strong |
| AGPL v3 | Yes | Yes | Yes* | Yes* | Very Strong |
| Public Domain | Yes | Yes | Yes | Yes | No |

*Requires source code distribution under same license for derivative works.

**Key consideration**: AGPL-licensed components (CKAN, Decidim) require that any modifications be made available as source code, even when deployed as a network service. This is typically acceptable for government deployments but should be reviewed by legal counsel.

---

*Report generated: 2026-02-16*
*Agent: C8 (research-open-source)*
*Division: C -- Technology Research*
