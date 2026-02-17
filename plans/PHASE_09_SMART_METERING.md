# Phase 9: Smart Metering & IoT Platform

**Timeline:** Months 18-36+ (12-month core build + ongoing scale-out)
**Target:** IoT platform operational, 10,000-meter pilot deployed, NRW reduction measurably started
**Dependency:** Phase 6 (Microservices & Cloud) substantially complete; Phase 8 (Customer Portal) API layer available for consumption alerts
**Capital Budget:** $4.2M USD (pilot phase); $60-80M USD full deployment over 72 months
**Operating Budget:** $180K/year IoT platform infrastructure; $0 per-device connectivity (LoRaWAN private network)

---

## 1. Phase Overview

### 1.1 Strategic Objective

CEA Queretaro operates approximately 400,000 water meters, nearly all read manually on bimonthly cycles by 200-300 field readers (lecturistas). Non-revenue water (NRW) is estimated at 40% of the 200 million m3 produced annually -- 80 million m3 lost to leaks, meter error, unauthorized connections, and data handling errors. Smart metering with Advanced Metering Infrastructure (AMI) can reduce NRW to 18% over 10 years, recovering an estimated $100-120M USD in cumulative revenue against a total investment of $60-80M phased over the same period.

Phase 9 delivers the foundational IoT platform, LoRaWAN network infrastructure, and a 10,000-meter pilot deployment in Queretaro's highest-NRW district. The pilot validates the technology stack, measures actual NRW reduction, and builds the operational muscle for the 400,000-meter full deployment that follows.

### 1.2 Key Outcomes

| Outcome | Metric | Target |
|---|---|---|
| IoT platform operational | Uptime | 99.5% availability |
| LoRaWAN pilot network | Coverage | 95% of pilot zone |
| Smart meters commissioned | Count | 10,000 units active |
| Automated readings | Frequency | Hourly readings validated end-to-end |
| NRW baseline established | Measurement | Pilot zone NRW quantified to +/- 2% |
| Leak detection active | Mean time to detect | < 48 hours (vs 2-4 weeks manual) |
| Billing integration | Pipeline | Automated meter reading to billing invoice |

### 1.3 Core Team

| Role | Count | Responsibility |
|---|---|---|
| IoT/AMI Program Manager | 1 | Overall delivery, vendor coordination, stakeholder management |
| IoT Platform Architect | 1 | ThingsBoard, EMQX, Kafka, TimescaleDB architecture |
| Embedded/IoT Developers | 2 | Device integration, LoRaWAN payload codecs, firmware management |
| Data Engineer | 1 | Data pipeline (MQTT to Kafka to TimescaleDB), ETL, Aquasis sync |
| Data Scientist | 1 | Anomaly detection models, consumption analytics, NRW analysis |
| LoRaWAN/RF Network Engineer | 1 | ChirpStack, gateway deployment, RF coverage optimization |
| Field Installation Supervisor | 1 | Meter installation logistics, workforce coordination |
| Field Technicians | 8-12 | Physical meter installation, gateway mounting (drawn from retrained lecturistas) |

**Total headcount:** 16-19 (6-7 engineering, 1 management, 9-12 field)

### 1.4 Capital Requirements Summary

| Category | Amount (USD) | Timing |
|---|---|---|
| Smart meters (10K Kamstrup flowIQ 2200) | $1,800,000 | Months 5-6 procurement |
| LoRaWAN gateways (25 units + solar/backup) | $50,000 | Months 3-4 procurement |
| Gateway installation and mounting | $50,000 | Months 3-5 |
| IoT platform infrastructure (servers/cloud) | $120,000 | Months 1-2 |
| EMQX Enterprise license (3-node cluster) | $30,000/yr | Month 1 |
| ThingsBoard PE license | $18,000/yr | Month 1 |
| Meter installation labor (10K units) | $300,000 | Months 5-8 |
| RF propagation study and site surveys | $40,000 | Month 3 |
| Training and certification | $60,000 | Throughout |
| Contingency (15%) | $350,000 | Reserve |
| **Total pilot phase** | **~$4,200,000** | Months 1-12 |

---

## 2. Sprint 1-4 (Months 1-2): IoT Platform Foundation

### 2.1 Objectives

Stand up the complete IoT data platform -- from MQTT message ingestion through stream processing to time-series storage. All components deployed, integrated, tested, and ready to receive real device telemetry before any field hardware is installed.

### 2.2 Sprint Breakdown

#### Sprint 1 (Weeks 1-2): Infrastructure Provisioning

| Task | Owner | Details | Done When |
|---|---|---|---|
| Provision IoT cluster infrastructure | IoT Architect | 3 application servers (16 vCPU, 64GB RAM each), 3 Kafka brokers (8 vCPU, 32GB, NVMe SSD), 1 TimescaleDB primary + 1 replica (16 vCPU, 128GB RAM, 2TB NVMe). Deploy on Azure Mexico Central or on-premises data center for data sovereignty. | Servers accessible, OS hardened |
| Deploy TimescaleDB | Data Engineer | PostgreSQL 16 + TimescaleDB 2.x. Create hypertables: `meter_readings` (1-day chunks), `meter_alerts`, continuous aggregates for `hourly_consumption`, `daily_consumption`. Enable compression after 7 days (10-20x ratio). Retention: raw 90 days, hourly 2 years, daily 10 years. | Schema deployed, test inserts succeed |
| Deploy EMQX MQTT broker cluster | IoT Developer | 3-node EMQX 5.x cluster. TLS 1.3 on port 8883, mutual X.509 authentication. Topic ACL per device (`meter/{meter_id}/telemetry`). QoS 1. Target: 400K concurrent connections at scale. | Cluster healthy, test pub/sub over TLS |
| Network and security configuration | IoT Architect | VPC/network segmentation, firewall rules (MQTT 8883, Kafka 9092, PostgreSQL 5432 internal only). TLS certificates via internal CA. VPN for management access. | Security review passed |

#### Sprint 2 (Weeks 3-4): Kafka and Stream Processing

| Task | Owner | Details | Done When |
|---|---|---|---|
| Deploy Apache Kafka cluster | Data Engineer | 3-broker cluster with KRaft (no ZooKeeper). Topics: `meter.readings.raw` (12 partitions, keyed by meter_id), `meter.readings.validated`, `meter.alerts`, `meter.status`, `meter.battery`. Replication factor 3. Retention: 7 days raw, 30 days validated. | Topics created, produce/consume test passes |
| Configure EMQX-to-Kafka bridge | IoT Developer | EMQX Enterprise built-in Kafka bridge. Route `meter/+/telemetry` to `meter.readings.raw`. Route `meter/+/alert` to `meter.alerts`. | Messages flow MQTT to Kafka end-to-end |
| Build Kafka Streams validation processor | Data Engineer | Kafka Streams application (Java/Kotlin). Consumes `meter.readings.raw`, validates: range checks (reading_m3 >= 0, battery 0-100%), deduplication (meter_id + timestamp), unit conversion. Produces to `meter.readings.validated`. Dead-letter queue for invalid payloads. | Validation pipeline processing test messages |
| TimescaleDB Kafka sink connector | Data Engineer | Kafka Connect JDBC sink connector. Consumes `meter.readings.validated`, writes to `meter_readings` hypertable. Batch size 1000, flush interval 5 seconds. | Readings appearing in TimescaleDB within 10s of MQTT publish |

#### Sprint 3 (Weeks 5-6): ThingsBoard IoT Platform

| Task | Owner | Details | Done When |
|---|---|---|---|
| Deploy ThingsBoard Professional Edition | IoT Architect | Self-hosted deployment (Docker Compose or Kubernetes). PostgreSQL backend for entities, TimescaleDB for telemetry (external). Configure ThingsBoard to use EMQX as external MQTT broker via integration. | ThingsBoard UI accessible, admin configured |
| Device management framework | IoT Developer | Define device profiles: `smart_meter_lorawan`, `smart_meter_nbiot`, `pressure_sensor`, `gateway`. Attributes: meter serial, firmware version, installation date, caliber, Aquasis `idPtoServicio` mapping. | Device profiles created, test device registered |
| ThingsBoard rule chains | IoT Developer | Rule chains for: (1) telemetry routing to TimescaleDB, (2) alert generation (battery < 20%, tamper flag, reverse flow), (3) device connectivity monitoring (no data > 4 hours = offline alert), (4) Aquasis sync trigger. | Rule chains deployed and tested with simulated data |
| Grafana dashboards (operational) | Data Engineer | Connect Grafana to TimescaleDB. Dashboards: fleet overview (online/offline/error), readings per hour heatmap, battery level distribution, signal strength map. | Dashboards rendering with test data |

#### Sprint 4 (Weeks 7-8): Integration Layer and Testing

| Task | Owner | Details | Done When |
|---|---|---|---|
| Aquasis REST/gRPC gateway adapter | IoT Developer | Microservice that translates IoT platform REST calls to Aquasis SOAP: `actualizarContador()` for meter status, `crearOrdenTrabajo()` for auto-generated work orders from alerts, periodic `getLecturas()` sync for reconciliation. Maps `meter_id` to Aquasis `idPtoServicio` via `getPuntoServicioPorContador`. | Gateway deployed, SOAP calls succeed in staging |
| End-to-end integration test | IoT Architect | Simulate 1,000 meters publishing hourly readings for 48 hours. Verify: MQTT to EMQX to Kafka to TimescaleDB pipeline, ThingsBoard device status updates, Grafana dashboard rendering, alert generation for simulated anomalies. | Full pipeline validated at 1K device scale |
| Load testing | Data Engineer | Simulate 50,000 concurrent MQTT connections publishing every 15 minutes (200K msgs/hour). Measure: EMQX throughput, Kafka consumer lag, TimescaleDB write latency, end-to-end latency P95/P99. | P99 latency < 30 seconds, zero message loss |
| Platform documentation | IoT Architect | Architecture decision records, runbooks for common operations (broker restart, Kafka rebalance, TimescaleDB chunk management), monitoring alert thresholds. | Documentation in internal wiki/repo |

### 2.3 Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| MQTT broker | EMQX 5.x Enterprise | Built-in Kafka bridge eliminates Kafka Connect complexity; proven at 100M+ connection scale; MQTT 5.0 support for shared subscriptions |
| Stream processing | Kafka Streams | Lightweight (no separate cluster like Flink), sufficient for validation/routing workload, operational simplicity |
| Time-series DB | TimescaleDB (PostgreSQL 16) | SQL interface familiar to existing DB team, hypertable compression (10-20x), continuous aggregates for rollups, same PostgreSQL ecosystem as Aquasis |
| IoT platform | ThingsBoard PE (self-hosted) | Built-in dashboards reduce development, device management included, $5K/month vs $50-100K/month for AWS IoT Core at scale, full data sovereignty |
| Hosting | Azure Mexico Central or on-premises | LGPDPPSO compliance (data residency in Mexico), CONAGUA data sovereignty requirements |

---

## 3. Sprint 5-8 (Months 3-4): LoRaWAN Network

### 3.1 Objectives

Deploy a LoRaWAN network covering the selected pilot zone with 95%+ coverage. Install and commission ChirpStack Network Server. Validate RF coverage with field measurements. Prepare the network to accept 10,000 smart meter registrations.

### 3.2 Sprint Breakdown

#### Sprint 5 (Weeks 9-10): ChirpStack and Network Planning

| Task | Owner | Details | Done When |
|---|---|---|---|
| Deploy ChirpStack LoRaWAN Network Server | RF Engineer | ChirpStack v4 (open source). Components: Network Server, Application Server, Gateway Bridge. Deploy on same infrastructure cluster. Configure for US915 frequency plan (915 MHz ISM band per NOM-208-SCFI). | ChirpStack UI accessible, US915 configured |
| ChirpStack-to-EMQX integration | IoT Developer | Configure ChirpStack MQTT integration to publish decoded uplinks to EMQX broker on topic `meter/{dev_eui}/telemetry`. Configure downlink path for firmware OTA and configuration changes. | Decoded payloads arriving in EMQX from ChirpStack |
| Pilot zone RF propagation study | RF Engineer | Commission RF propagation study for selected pilot zone. Inputs: zone topology, building density, meter pit locations (underground vs surface). Tool: CloudRF or field measurements with LoRa test transmitters. Output: optimal gateway placement map. | Propagation report with gateway placement plan |
| Device profile and codec development | IoT Developer | Create ChirpStack device profiles for Kamstrup flowIQ 2200 LoRaWAN. Implement payload codec (JavaScript) to decode proprietary Kamstrup payload into standardized JSON: `{reading_m3, flow_lph, temperature, battery_pct, flags}`. | Codec decoding test payloads correctly |

#### Sprint 6 (Weeks 11-12): Gateway Procurement and Installation

| Task | Owner | Details | Done When |
|---|---|---|---|
| Gateway procurement | Program Manager | 25 outdoor LoRaWAN gateways (Kerlink Wirnet iStation or Multitech Conduit IP67). 8-channel, US915, IP67 rated, GPS, 4G cellular backhaul. Solar panel + battery backup kit per gateway. Estimated $2,000/gateway fully equipped = $50,000. | Purchase orders placed, delivery scheduled |
| Gateway site preparation | Field Supervisor | Coordinate with municipal authorities for mounting permissions (rooftops, water towers, elevated infrastructure). Prepare mounting hardware, grounding, solar panel orientation. 25 sites prepared. | All 25 sites permitted and prepared |
| Gateway installation (first batch) | Field Technicians | Install first 10 gateways at highest-priority locations (center of pilot zone outward). Connect to ChirpStack via 4G backhaul. Verify connectivity and GPS lock. | 10 gateways online in ChirpStack |
| NOM-208-SCFI compliance verification | RF Engineer | Document compliance with NOM-208-SCFI for ISM band operation: transmit power limits, duty cycle adherence, frequency hopping configuration. File with IFT if required. | Compliance documentation complete |

#### Sprint 7 (Weeks 13-14): Network Completion and Coverage Validation

| Task | Owner | Details | Done When |
|---|---|---|---|
| Gateway installation (remaining) | Field Technicians | Install remaining 15 gateways. Priority: coverage gaps identified during first batch testing. | All 25 gateways online |
| RF coverage field testing | RF Engineer | Walk-test with LoRa test devices at meter height (ground level, meter pits). Map coverage: RSSI > -120 dBm and SNR > -10 dB at 95% of planned meter locations. Identify dead spots. | Coverage map with 95%+ target achieved |
| Gateway-to-server redundancy | RF Engineer | Configure multi-gateway reception (same uplink received by 2+ gateways). Verify automatic failover if a gateway goes offline. Configure alerting for gateway downtime > 30 minutes. | Redundancy verified, alerts firing |
| Network capacity testing | IoT Developer | Simulate 10,000 Class A devices transmitting hourly on the 25-gateway network. Measure: join success rate, uplink delivery rate, downlink scheduling capacity. Target: > 99% uplink delivery. | Load test report with > 99% delivery |

#### Sprint 8 (Weeks 15-16): Network Optimization

| Task | Owner | Details | Done When |
|---|---|---|---|
| ADR (Adaptive Data Rate) tuning | RF Engineer | Enable ADR on ChirpStack. Monitor spreading factor distribution across devices. Optimize for balanced coverage vs capacity. Target: majority of devices on SF7-SF9 for throughput. | ADR active, SF distribution documented |
| Downlink optimization | IoT Developer | Test firmware OTA (FUOTA) delivery to a batch of 10 test meters. Test downlink configuration changes (reporting interval, alarm thresholds). Measure success rate and time-to-complete. | OTA update delivered to 10 test devices |
| Network monitoring dashboard | RF Engineer | Grafana dashboard: gateway status (online/offline), packets received per gateway per hour, RSSI/SNR heatmap, duty cycle utilization, backhaul connectivity. | Dashboard operational |
| Network operations runbook | RF Engineer | Standard operating procedures: gateway reboot, antenna replacement, SIM card replacement, ChirpStack device decommission, coverage gap response. | Runbook reviewed and approved |

### 3.3 LoRaWAN Network Architecture

```
PILOT ZONE (Selected High-NRW District)
+------------------------------------------------------------------+
|                                                                    |
|  [GW-01]    [GW-02]    [GW-03]    [GW-04]    [GW-05]            |
|    |           |           |           |           |              |
|    +-----+-----+-----+-----+-----+-----+-----+-----+            |
|          |                 |                 |                     |
|  [GW-06] [GW-07]    [GW-08]    [GW-09]    [GW-10]              |
|                                                                    |
|  ... (25 gateways total, 2-3 km spacing urban)                    |
|                                                                    |
|  10,000 smart meters (Kamstrup flowIQ 2200 with LoRaWAN module)  |
+------------------------------------------------------------------+
          |  LoRa 915 MHz (US915)
          v
+-----------------+     4G Cellular Backhaul
| Gateway         |---------------------------+
| (Kerlink/MTech) |     (Telcel LTE M2M SIM) |
+-----------------+                           |
                                              v
                                   +-------------------+
                                   | ChirpStack NS     |
                                   | (Network Server)  |
                                   | - Join Server      |
                                   | - ADR Engine       |
                                   | - Payload Decode   |
                                   +--------+----------+
                                            | MQTT
                                            v
                                   +-------------------+
                                   | EMQX Broker       |
                                   | --> Kafka          |
                                   | --> TimescaleDB    |
                                   | --> ThingsBoard    |
                                   +-------------------+
```

### 3.4 Frequency Plan: US915

| Parameter | Value |
|---|---|
| Band | 915 MHz ISM (NOM-208-SCFI compliant) |
| Uplink channels | 64 (125 kHz) + 8 (500 kHz) |
| Sub-band | Sub-band 2 (channels 8-15, 903.9-905.3 MHz) -- typical for Kerlink/Multitech |
| Downlink | RX1: same as uplink, RX2: 923.3 MHz SF12 |
| Max EIRP | 30 dBm (1W) per FCC/NOM-208 |
| Duty cycle | No regulatory duty cycle in US915 (dwell time limits apply) |

---

## 4. Sprint 9-12 (Months 5-6): Meter Pilot Phase 1

### 4.1 Objectives

Procure, install, commission, and validate 10,000 Kamstrup flowIQ 2200 smart meters in the selected pilot zone. Achieve automated hourly readings flowing through the full pipeline. Replace manual bimonthly readings with continuous automated data.

### 4.2 Pilot Zone Selection Criteria

| Criterion | Weight | Selection Method |
|---|---|---|
| Highest estimated NRW | 30% | Aquasis data: discrepancy between production meter input and billed consumption |
| Meter age and condition | 20% | Aquasis `contador` table: meters > 10 years old or flagged `ptosnmalest = 'S'` |
| DMA infrastructure | 15% | Zones with existing or planned district metered area boundaries |
| Geographic compactness | 15% | Minimize LoRaWAN gateway count; contiguous zone preferred |
| Customer density | 10% | Higher density = more meters per gateway = better economics |
| Access feasibility | 10% | Avoid zones with high `ptosnnoaccess = 'S'` (no access flag) |

**Recommended pilot zone:** The district with the highest NRW in urban Queretaro, likely a zone with aging infrastructure and older mechanical meters. Final selection requires analysis of Aquasis zone-level billing data (`ptoszonid` aggregation).

### 4.3 Sprint Breakdown

#### Sprint 9 (Weeks 17-18): Procurement and Logistics

| Task | Owner | Details | Done When |
|---|---|---|---|
| Kamstrup flowIQ 2200 procurement | Program Manager | 10,000 units DN15-DN25 (residential) with integrated LoRaWAN module. Negotiate volume pricing targeting $180/unit average. Include 500 spares (5%). Delivery in 2 tranches: 5,000 at week 20, 5,000 at week 22. | Purchase order signed, delivery confirmed |
| Installation materials procurement | Field Supervisor | 10,000 meter connection kits, seals, pit covers (if needed), installation tools. Coordinate with CEA warehouse. | Materials staged at field depot |
| Pilot zone meter census | Data Engineer | Extract from Aquasis: all meters in pilot zone via `getPuntoServicioPorContador`. Map meter serial to `idPtoServicio`, address, coordinates (`coordenadaX`, `coordenadaY`), current meter caliber, age. Generate installation schedule by route. | Census spreadsheet with 10K meter records |
| Installer workforce training | Field Supervisor | Train 8-12 field technicians (retrained lecturistas) on: Kamstrup meter installation procedure, LoRaWAN activation (QR code scan for DevEUI), Aquasis meter swap work order creation, safety procedures. 3-day training program. | Technicians certified, test installations completed |

#### Sprint 10 (Weeks 19-20): First Installation Wave (5,000 meters)

| Task | Owner | Details | Done When |
|---|---|---|---|
| Batch 1 meter registration in ChirpStack | IoT Developer | Pre-register 5,000 meters: DevEUI, AppKey (OTAA join credentials). Import from Kamstrup shipping manifest CSV. Assign to application and device profile. | 5,000 devices in ChirpStack, OTAA keys loaded |
| Batch 1 installation (5,000 meters) | Field Technicians | Install at 80-100 meters/day per 2-person team (4-5 teams). Process: close valve, remove old meter, record old reading, install Kamstrup, open valve, verify no leaks, scan DevEUI QR code, confirm join in mobile app. | 5,000 meters physically installed |
| Join verification | IoT Developer | Monitor ChirpStack join requests. Target: > 98% successful OTAA join within 24 hours of installation. Investigate and resolve join failures (coverage gaps, key mismatch). | > 4,900 meters joined and transmitting |
| Old meter reading reconciliation | Data Engineer | Record final manual reading from each replaced meter. Enter into Aquasis via `actualizarContador()`. Calculate any consumption gap between old final reading and first smart meter reading. | All 5,000 old meters reconciled in Aquasis |

#### Sprint 11 (Weeks 21-22): Second Installation Wave (5,000 meters)

| Task | Owner | Details | Done When |
|---|---|---|---|
| Batch 2 meter registration | IoT Developer | Pre-register remaining 5,000 meters in ChirpStack. | 10,000 total devices registered |
| Batch 2 installation | Field Technicians | Install remaining 5,000 meters using same process. Apply lessons learned from batch 1 (coverage gaps addressed, installation process refined). | All 10,000 meters physically installed |
| Coverage gap remediation | RF Engineer | For meters not joining (typically 1-3%), options: install additional gateway, adjust antenna orientation on nearest gateway, or switch specific meters to NB-IoT fallback. | > 99% of 10,000 meters online |
| Aquasis meter swap records | Data Engineer | Update Aquasis for all 10,000 meters: `actualizarContador()` with new serial number, set `snTelelectura = true`, populate `moduloComunicacion` with LoRaWAN DevEUI. | Aquasis records updated for all meters |

#### Sprint 12 (Weeks 23-24): Commissioning and Validation

| Task | Owner | Details | Done When |
|---|---|---|---|
| 48-hour full fleet validation | IoT Architect | Monitor all 10,000 meters over 48 hours. Verify: every meter transmits at least 1 reading per hour, readings are physically plausible (0-50 m3/day residential), no persistent communication failures. | 48-hour report: > 99% meters reporting |
| Data quality audit | Data Engineer | Compare first 2 weeks of smart meter readings against historical Aquasis consumption patterns for same accounts. Flag outliers > 3 standard deviations for field investigation. | Audit report with < 2% outlier rate |
| Customer notification | Program Manager | Notify all 10,000 pilot zone customers of meter upgrade via CEA communication channels (letter, SMS, WhatsApp via AGORA). Explain: improved billing accuracy, leak detection benefit, no action required from customer. | Notifications sent, FAQ published |
| First automated reading cycle | Data Engineer | Execute first automated billing read: extract monthly consumption from TimescaleDB `hourly_consumption` aggregate, push to Aquasis billing via REST/SOAP gateway, compare against what manual reading would have produced. | Automated reading matches expected range |

---

## 5. Sprint 13-16 (Months 7-8): Analytics and Leak Detection

### 5.1 Objectives

Build the analytics layer that transforms raw meter data into actionable intelligence: consumption pattern dashboards, anomaly detection for leaks, Minimum Night Flow analysis for network losses, and automated alert generation with work order creation.

### 5.2 Sprint Breakdown

#### Sprint 13 (Weeks 25-26): Consumption Analytics Dashboard

| Task | Owner | Details | Done When |
|---|---|---|---|
| Customer consumption dashboard | Data Engineer | Grafana/Superset dashboards: per-customer daily/weekly/monthly consumption trends, comparison to zone average, historical comparison (same period previous year once data exists). | Dashboard rendering for all 10K accounts |
| Zone-level analytics | Data Engineer | Aggregate dashboards by Aquasis zone (`ptoszonid`): total zone consumption, average per-customer, peak hour analysis, DMA water balance (input meter vs sum of smart meters). | Zone dashboard with DMA balance |
| Customer segmentation model | Data Scientist | K-means clustering on hourly consumption profiles. Segments: normal residential, high consumption, irregular/suspicious, commercial pattern, seasonal. Label all 10K pilot customers. | Segmentation model trained, labels assigned |
| Consumption reports for customer portal | IoT Developer | API endpoint exposing customer consumption data for Phase 8 customer portal integration. Endpoint: `GET /api/v1/meters/{meter_id}/consumption?period=daily&from=&to=`. | API deployed, returning data for portal |

#### Sprint 14 (Weeks 27-28): Anomaly Detection Models

| Task | Owner | Details | Done When |
|---|---|---|---|
| Feature engineering pipeline | Data Scientist | Apache Airflow DAG computing daily features per meter: hourly consumption vector (24 values), day-of-week pattern, rolling 7-day average, min night flow (2-4 AM), max/min ratio, zero-flow hours, consecutive flow hours. Store in feature table. | Feature pipeline running daily |
| Isolation Forest anomaly model | Data Scientist | Train Isolation Forest on 4+ weeks of pilot data. Features: hourly profile deviation, MNF deviation, consumption trend change. Contamination parameter: 5% (expected anomaly rate). Evaluate with labeled data from field investigations. | Model trained, precision > 70% on known anomalies |
| LSTM autoencoder model | Data Scientist | Train LSTM autoencoder on per-meter hourly sequences (7-day sliding window). Reconstruction error above threshold flags anomaly. Better at detecting gradual leaks than Isolation Forest. | Model trained, complementary to IF |
| ML model serving | Data Scientist | Deploy models via MLflow + FastAPI. Kafka Streams consumer calls scoring endpoint for each meter daily. Scores written to `meter_alerts` table with `alert_type = 'anomaly'`, severity based on score. | Daily scoring running for all 10K meters |

#### Sprint 15 (Weeks 29-30): Leak Detection System

| Task | Owner | Details | Done When |
|---|---|---|---|
| Minimum Night Flow (MNF) analysis | Data Scientist | Automated MNF calculation: for each DMA, sum all meter readings between 2:00-4:00 AM. Subtract expected legitimate night use (estimated 2-5 L/hr per account). Remaining flow = network leakage estimate. Track MNF trend daily. | MNF dashboard with daily trend |
| Continuous flow detection | IoT Developer | ThingsBoard rule chain: if a meter reports flow > 0 for 24+ consecutive hours, generate `leak_suspect_customer` alert. Severity escalation: warning at 24h, critical at 72h. | Alert rule active, test alerts generated |
| Leak detection alert pipeline | IoT Developer | Alert flow: `meter_alerts` table --> ThingsBoard alert engine --> AGORA notification service (WhatsApp/SMS to customer for customer-side leaks) --> Aquasis `crearOrdenTrabajo()` for network-side leaks requiring crew dispatch. | End-to-end alert-to-work-order pipeline tested |
| NRW baseline measurement | Data Scientist | Calculate pilot zone NRW: (DMA input volume - sum of all smart meter readings - estimated unbilled authorized) / DMA input volume * 100. Establish baseline for comparison over coming months. | NRW baseline report published |

#### Sprint 16 (Weeks 31-32): Reporting and Refinement

| Task | Owner | Details | Done When |
|---|---|---|---|
| Customer consumption pattern reports | Data Scientist | Weekly PDF/email reports for high-consumption customers: usage vs zone average, peak usage times, leak risk indicator. Templates in Spanish. | Reports generating and distributable |
| Leak investigation feedback loop | Data Scientist | Field verification of top 50 leak alerts. Record: confirmed leak (true positive), no leak found (false positive), other issue. Retrain models with labeled data. Target: precision > 75% after first feedback cycle. | Model retrained, precision measured |
| Operational KPI dashboard | Data Engineer | Executive dashboard: meters online %, average readings/day, alerts generated, alerts resolved, confirmed leaks found, estimated water saved (m3), NRW trend. | KPI dashboard live |
| Monthly NRW progress report | Program Manager | First monthly report: pilot zone NRW change vs baseline, leak detection success rate, customer impact stories, lessons learned, recommendations for scale-up. | Report delivered to CEA leadership |

---

## 6. Sprint 17-20 (Months 9-12): Integration and Scaling Plan

### 6.1 Objectives

Fully integrate the IoT platform with the billing microservice, automate the meter-reading-to-invoice pipeline, deliver real-time consumption alerts to the customer portal, and produce the detailed scale-up plan for 100K meters (Phase 2) and the full 400K AMI deployment roadmap.

### 6.2 Sprint Breakdown

#### Sprint 17 (Weeks 33-34): Billing Integration

| Task | Owner | Details | Done When |
|---|---|---|---|
| Automated meter reading export | Data Engineer | Scheduled job (monthly, aligned with billing cycles): extract consumption from TimescaleDB `daily_consumption` aggregate for each meter, compute billing-period total, format as Aquasis-compatible reading record. | Monthly export job running |
| Billing microservice integration | IoT Developer | If Phase 7 billing microservice is available: direct API integration via REST. If not: push readings to Aquasis via SOAP `actualizarContador()` and existing billing workflow. Validate: reading value matches meter register, period aligns with billing cycle, no gaps. | 10K meters billed from automated readings |
| Reading validation and exception handling | Data Engineer | Handle edge cases: meter replaced mid-cycle (prorate consumption), communication outage (interpolate from last known reading, flag for manual verification), negative consumption (tamper alert). | Exception handlers tested with real scenarios |
| Billing accuracy comparison | Data Engineer | Compare automated billing amounts vs what manual reading would have produced (for accounts with historical data). Measure: average deviation, over-reading %, under-reading %. Target: < 3% deviation. | Comparison report showing improvement |

#### Sprint 18 (Weeks 35-36): Customer-Facing Features

| Task | Owner | Details | Done When |
|---|---|---|---|
| Real-time consumption alerts | IoT Developer | Integration with Phase 8 customer portal: push near-real-time consumption data via WebSocket or polling API. Customer sees daily usage chart, current month projection, comparison to budget. | Customer portal showing live meter data |
| Leak notification to customers | IoT Developer | When `leak_suspect_customer` alert fires: send WhatsApp/SMS to account holder via AGORA notification service. Message: "Possible water leak detected at your property. Current flow: X L/hr. Check for running taps, toilets, or hidden leaks. Call CEA at [number] for assistance." | Notifications sent for real leak alerts |
| High consumption early warning | Data Scientist | Predict end-of-month consumption based on daily trend. If projected to exceed customer's historical average by > 50%, send proactive alert at mid-month. Reduces bill shock and encourages conservation. | Predictions running, alerts sent for projected overages |
| Customer self-service meter data | IoT Developer | API for customer portal: hourly/daily consumption history, download CSV, peak usage times. Respects LGPDPPSO: only account holder can access their data, consent recorded. | API serving data to authenticated customers |

#### Sprint 19 (Weeks 37-38): Performance Optimization and Hardening

| Task | Owner | Details | Done When |
|---|---|---|---|
| 6-month operational review | IoT Architect | Comprehensive review: platform uptime, data completeness (% hours with readings), alert accuracy (precision/recall), gateway reliability, battery consumption trend. Identify and resolve recurring issues. | Review document with action items |
| TimescaleDB optimization | Data Engineer | Review chunk sizes, compression ratios, query performance. Optimize continuous aggregate refresh policies. Implement partition pruning for common query patterns. | Query P95 < 500ms for dashboard queries |
| EMQX and Kafka scaling assessment | IoT Architect | Current resource utilization at 10K meters. Project resource needs for 100K meters (10x). Plan horizontal scaling: additional Kafka brokers, EMQX nodes, TimescaleDB read replicas. | Scaling plan with resource estimates |
| Security audit | IoT Architect | Penetration test on IoT platform. Review: MQTT authentication, API security, data encryption at rest and in transit, access controls, audit logging. LGPDPPSO compliance verification. | Audit report with no critical findings |

#### Sprint 20 (Weeks 39-40): Scale-Up Planning

| Task | Owner | Details | Done When |
|---|---|---|---|
| 100K meter scale-up plan (Phase 2) | Program Manager | Detailed plan for next 90,000 meters: zone prioritization (next highest NRW districts), gateway deployment plan (additional 75 gateways), procurement timeline, installation workforce scaling (30-40 technicians), budget ($15-20M). Timeline: 18 months. | Plan document approved by CEA leadership |
| Full AMI deployment roadmap (400K meters) | Program Manager | 72-month roadmap for full 400K meter deployment. Milestones: 10K (complete), 100K (month 30), 250K (month 48), 400K (month 72). Annual budget projections. Workforce transition plan for 200+ lecturistas. NRW reduction milestones: 33% at 100K, 28% at 250K, 18% at 400K. | Roadmap document |
| Vendor negotiation for volume pricing | Program Manager | Using 10K pilot results as leverage, negotiate Kamstrup/Badger volume pricing for 100K+ order. Target: < $160/unit at volume. Explore multi-year supply agreement with price protection. | Negotiation strategy and preliminary quotes |
| Lessons learned and process improvement | IoT Architect | Document: what worked, what did not, installation rate achieved vs planned, technology issues resolved, team training gaps. Feed into Phase 2 planning. | Lessons learned document published |

---

## 7. Hardware Specifications

### 7.1 Smart Meter: Kamstrup flowIQ 2200 (Primary)

| Specification | Value |
|---|---|
| Measurement principle | Ultrasonic (transit time) |
| Accuracy class | R800 (exceeds NOM-012-CONAGUA) |
| Sizes | DN15, DN20, DN25 (residential), DN40, DN50 (commercial) |
| Flow range (DN15) | 1 L/hr to 3,125 L/hr |
| Low-flow detection | 1 L/hr (detects slow leaks) |
| Battery life | 16 years |
| Data logging | 8,760 hourly values (1 full year) |
| Communication | Integrated LoRaWAN module (Class A) |
| Frequency | 915 MHz (US915 plan) |
| Tamper detection | Magnetic field, tilt, reverse flow |
| IP rating | IP68 (permanently submerged) |
| Operating temperature | 0.1 - 50 C |
| Certifications | ISO 4064, OIML R49, NOM-012-CONAGUA (verify) |
| Estimated unit cost | $150-250 USD (DN15-DN25) |

### 7.2 Alternative Meter: Badger Meter ORION (Tier 2)

| Specification | Value |
|---|---|
| Measurement principle | Ultrasonic |
| Accuracy class | R400-R800 |
| Sizes | DN15-DN300 (broadest range) |
| Battery life | 20 years |
| Communication | LoRaWAN endpoint (via partner), ORION cellular (proprietary) |
| IP rating | IP68 |
| Estimated unit cost | $120-200 USD (DN15-DN25) |

Use case: Badger Meter for larger commercial/industrial meters (DN50+) where their size range advantage applies.

### 7.3 LoRaWAN Gateways

| Specification | Kerlink Wirnet iStation | Multitech Conduit IP67 |
|---|---|---|
| Channels | 8 (US915 sub-band) | 8 (US915 sub-band) |
| Sensitivity | -141 dBm | -139 dBm |
| Backhaul | Ethernet, 4G cellular | Ethernet, 4G cellular |
| Power | PoE, DC, solar | PoE, DC, solar |
| Enclosure | IP67 outdoor | IP67 outdoor |
| GPS | Yes | Yes |
| Operating temp | -40 to +60 C | -40 to +60 C |
| Estimated cost | $1,200-1,500 | $1,000-1,300 |

### 7.4 Supplementary Sensors (Future Phases)

| Sensor | Purpose | Protocol | Estimated Cost |
|---|---|---|---|
| Pressure transducer (DMA inlet) | DMA pressure monitoring, pressure management | LTE-M/Cellular (low latency) | $2,000-5,000/unit |
| Acoustic leak sensor (fixed) | Trunk main leak detection | LoRaWAN | $500-2,000/unit |
| Tank level sensor | Reservoir monitoring | LoRaWAN | $300-800/unit |
| Water quality sensor (Cl2, turbidity) | Distribution water quality | Cellular (high data rate) | $3,000-8,000/unit |

---

## 8. Network Architecture

### 8.1 Coverage Design

| Parameter | Pilot (10K meters) | Phase 2 (100K meters) | Full Deployment (400K meters) |
|---|---|---|---|
| Gateways | 25 | 100 | 120 (with redundancy) |
| Coverage area | ~15 km2 | ~80 km2 | ~120 km2 (metro Queretaro) |
| Gateway spacing (urban) | 2-3 km | 2-3 km | 2-3 km |
| Backhaul | 4G cellular (all) | 4G primary, fiber where available | Fiber primary, 4G backup |
| Redundancy | 1.5x gateway overlap | 2x overlap in critical areas | 2x standard, 3x critical |

### 8.2 Network Redundancy

- **Gateway-level:** Each meter should be within range of at least 2 gateways. ChirpStack deduplicates uplinks received by multiple gateways.
- **Backhaul-level:** Primary 4G SIM (Telcel) + secondary SIM (AT&T Mexico) for automatic failover. Fiber backhaul where available.
- **Server-level:** ChirpStack and EMQX deployed on separate servers with health monitoring. Automatic restart via systemd/Kubernetes.
- **Power-level:** Solar panel + battery backup on every gateway. Minimum 48 hours autonomous operation during power outage.

### 8.3 Rural/Suburban Extension (NB-IoT Fallback)

For the estimated 10% of meters outside LoRaWAN coverage (rural municipalities), NB-IoT provides coverage via existing Telcel LTE infrastructure. The ChirpStack/ThingsBoard platform is protocol-agnostic -- NB-IoT devices publish to the same MQTT broker via a different transport. Monthly cost per NB-IoT device: $0.50-2.00 (acceptable for sparse deployments).

---

## 9. Data Pipeline Architecture

### 9.1 End-to-End Data Flow

```
Smart Meter (Kamstrup)
  | LoRa radio (915 MHz, SF7-SF12)
  v
LoRaWAN Gateway (Kerlink/Multitech)
  | 4G cellular backhaul (Telcel LTE)
  v
ChirpStack Network Server
  | MQTT publish: application/{app_id}/device/{dev_eui}/event/up
  | Payload decoded by JavaScript codec
  v
EMQX MQTT Broker (3-node cluster, TLS 1.3)
  | Built-in Kafka bridge
  v
Apache Kafka (3-broker KRaft cluster)
  | Topic: meter.readings.raw (12 partitions, key=meter_id)
  v
Kafka Streams Validation Processor
  | - Range validation (reading_m3 >= 0, battery 0-100%)
  | - Deduplication (meter_id + timestamp)
  | - Unit conversion (if needed)
  | - Dead-letter queue for invalid payloads
  | Topic: meter.readings.validated
  v
+-------------------+-------------------+-------------------+
|                   |                   |                   |
v                   v                   v                   v
TimescaleDB         Alert Engine        Analytics           Aquasis Sync
(Kafka Connect      (Kafka Streams)     (Daily batch via    (REST/SOAP
 JDBC Sink)         - MNF threshold     Apache Airflow)     Gateway)
                    - Continuous flow   - ML scoring        - actualizarContador
meter_readings      - Battery low       - Segmentation      - crearOrdenTrabajo
hourly_consumption  - Tamper flag       - Demand forecast   - getLecturas (recon)
daily_consumption       |                   |
meter_alerts <----------+                   |
    |                                       |
    v                                       v
Grafana Dashboards                   MLflow Model Registry
Apache Superset                      FastAPI Inference API
```

### 9.2 Topic Design

| Kafka Topic | Partitions | Key | Retention | Consumers |
|---|---|---|---|---|
| `meter.readings.raw` | 12 | meter_id | 7 days | validation-processor |
| `meter.readings.validated` | 12 | meter_id | 30 days | timescaledb-sink, alert-engine, analytics, aquasis-sync |
| `meter.alerts` | 6 | meter_id | 30 days | alert-dispatcher, work-order-creator |
| `meter.status` | 6 | meter_id | 7 days | thingsboard-sync, monitoring |
| `meter.battery` | 3 | meter_id | 90 days | battery-tracker |
| `meter.readings.dlq` | 3 | meter_id | 90 days | manual-review |

### 9.3 Data Retention Policy

| Data Tier | Storage | Retention | Compression |
|---|---|---|---|
| Raw readings (per-message) | TimescaleDB hypertable | 90 days | After 7 days (10-20x) |
| Hourly aggregates | TimescaleDB continuous aggregate | 2 years | Native |
| Daily aggregates | TimescaleDB continuous aggregate | 10 years | Native |
| Monthly aggregates | TimescaleDB continuous aggregate | Indefinite | Native |
| Raw Kafka messages | Kafka log | 7-30 days | Kafka native |
| Alerts | TimescaleDB hypertable | 2 years | After 30 days |
| ML features | PostgreSQL table | 1 year rolling | None |
| Audit trail (raw LoRa payload) | Object storage (S3/MinIO) | 5 years | Compressed |

### 9.4 Estimated Data Volumes

| Metric | Pilot (10K meters) | Full (400K meters) |
|---|---|---|
| MQTT messages/hour | 10,000 | 400,000 |
| Kafka throughput | ~4 MB/hour | ~150 MB/hour |
| TimescaleDB raw writes/day | 240,000 | 9,600,000 |
| TimescaleDB storage/year (raw) | ~50 GB | ~2 TB |
| TimescaleDB storage/year (compressed) | ~5 GB | ~200 GB |

---

## 10. Procurement Strategy

### 10.1 Phased Procurement Approach

| Phase | Meters | Gateways | Timeline | Budget |
|---|---|---|---|---|
| Pilot (Phase 9) | 10,000 + 500 spares | 25 | Months 5-6 | $4.2M |
| Scale-up Phase 2 | 90,000 + 4,500 spares | 75 | Months 12-30 | $18-22M |
| Scale-up Phase 3 | 150,000 + 7,500 spares | 20 (infill) | Months 30-48 | $28-32M |
| Final Phase 4 | 150,000 + 7,500 spares | 0 (existing) | Months 48-72 | $25-28M |
| **Total** | **400,000 + 20,000 spares** | **120** | **72 months** | **$75-86M** |

### 10.2 Vendor Negotiation Strategy

1. **Pilot as proof point:** Use pilot success metrics (NRW reduction, billing accuracy improvement) to justify scale-up budget to CEA board and state government.
2. **Volume pricing tiers:** Negotiate pricing tiers: 10K ($180/unit), 100K ($160/unit), 250K+ ($140/unit). Savings of $8-16M over full deployment.
3. **Multi-vendor strategy:** Primary vendor (Kamstrup) for 80% of residential meters. Secondary vendor (Badger) for commercial/industrial (DN50+) and as competitive pressure on pricing.
4. **Local assembly:** Explore with Kamstrup/Badger whether final assembly or communication module integration could be done in Queretaro (IMMEX/maquiladora model) for cost reduction and local content requirements.
5. **Payment terms:** Negotiate extended payment terms (90-120 days) or milestone-based payments aligned with installation progress.
6. **Warranty:** Minimum 5-year warranty on meter body, 3-year on communication module. Battery replacement program after year 12.

### 10.3 Procurement Compliance

- Mexican public procurement law (Ley de Adquisiciones, Arrendamientos y Servicios del Sector Publico) applies to CEA as a government entity.
- International competitive bidding required for contracts above federal threshold (~$5M USD for goods).
- USMCA trade agreement may facilitate duty-free import of meters from US/European manufacturers with North American presence.
- NOM-012-CONAGUA certification required for all meters before installation.

---

## 11. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Hardware supply chain delays** -- Kamstrup factory lead times exceed 12 weeks, delaying pilot | Medium | High | Place orders 16 weeks ahead. Badger Meter as backup supplier. Maintain 5% spare inventory. |
| R2 | **RF coverage gaps in meter pits** -- Underground meter pits attenuate LoRa signal beyond usable range | Medium | Medium | RF propagation study in Sprint 5. Pit-level testing before mass deployment. External antenna option for deep pits. NB-IoT fallback for worst cases. |
| R3 | **NOM-012-CONAGUA certification delay** -- Selected meter not yet certified for Mexico | Low | High | Confirm certification status during vendor selection. Begin certification process 6 months before procurement. Kamstrup has Mexico office for regulatory support. |
| R4 | **Aquasis integration complexity** -- SOAP API limitations prevent real-time meter data sync | Medium | Medium | Aquasis gateway adapter (Sprint 4) abstracts SOAP complexity. Accept batch sync (hourly/daily) rather than requiring real-time. Phase 6 REST APIs will eventually replace SOAP. |
| R5 | **Gateway theft/vandalism** -- Outdoor gateways on rooftops/towers may be targets | Low | Medium | Tamper-proof enclosures, elevated mounting (>4m), GPS tracking, cellular connectivity monitoring. Insurance coverage. |
| R6 | **Customer resistance to meter replacement** -- Customers refuse access for installation | Medium | Low | Customer communication campaign before installation wave. Emphasize benefits (leak detection, billing accuracy). CEA has legal authority to require metering under state water law. |
| R7 | **Battery life shorter than specified** -- Environmental conditions (heat, humidity) reduce battery life below 16 years | Low | High | Monitor battery levels via telemetry. Manufacturer warranty. Select chemistry rated for 50C+ operation. Plan battery replacement program for year 12+. |
| R8 | **Platform scalability at 400K devices** -- IoT platform performance degrades beyond pilot scale | Low | High | Load testing at Sprint 4 simulates 50K devices. Horizontal scaling plan in Sprint 19. ThingsBoard PE rated for 100K+ devices. Architecture designed for component-level scaling. |
| R9 | **LoRaWAN ISM band interference** -- Other ISM band users (industrial, agricultural IoT) cause interference in 915 MHz | Low | Medium | US915 has 64 uplink channels with frequency hopping. ADR optimizes spreading factors. Monitor packet error rate per gateway. |
| R10 | **Data privacy complaint (LGPDPPSO)** -- Customers challenge smart meter data collection as privacy violation | Low | Medium | Privacy impact assessment before pilot. Updated privacy notice for all customers. Data minimization: hourly for 90 days, then aggregate. Data stays in Mexico (self-hosted). |
| R11 | **Workforce resistance from lecturistas** -- Manual meter readers resist transition to new roles | Medium | Medium | Early communication and training program. Prioritize retrained lecturistas for field technician roles (higher skill, better pay). 7-10 year gradual transition aligned with phased deployment. Union/labor relations engagement. |
| R12 | **Kafka/EMQX infrastructure failure** -- Message loss during platform outage | Low | High | 3-node clusters with replication factor 3. Meters store 8,760 hourly values locally -- missed readings can be recovered via downlink request. Automated monitoring and restart. |

---

## 12. Staffing Plan

### 12.1 Core IoT Engineering Team (Hired/Assigned Months 1-2)

| Role | Count | Skills Required | Monthly Cost (USD) | Source |
|---|---|---|---|---|
| IoT/AMI Program Manager | 1 | AMI project delivery, vendor management, Mexican utility experience, PMP/PRINCE2 | $6,000-8,000 | External hire or promoted CEA manager |
| IoT Platform Architect | 1 | ThingsBoard, MQTT, Kafka, TimescaleDB, Kubernetes, IoT security | $7,000-9,000 | External hire |
| Embedded/IoT Developer | 2 | LoRaWAN, MQTT, device codecs, ChirpStack, embedded C/Python | $5,000-7,000 each | External hire |
| Data Engineer | 1 | Kafka Streams, TimescaleDB, Apache Airflow, SQL, Python | $5,000-7,000 | Internal transfer or hire |
| Data Scientist | 1 | Time-series analysis, anomaly detection (Isolation Forest, LSTM), Python, scikit-learn, TensorFlow | $6,000-8,000 | External hire |
| RF/LoRaWAN Network Engineer | 1 | LoRaWAN protocol, RF propagation, ChirpStack, antenna systems, NOM-208 compliance | $5,000-7,000 | External hire (may be contract for first 6 months) |

**Engineering subtotal:** 7 people, ~$44,000-55,000/month

### 12.2 Field Operations Team (Hired/Trained Months 3-4)

| Role | Count | Skills Required | Monthly Cost (USD) | Source |
|---|---|---|---|---|
| Field Installation Supervisor | 1 | Plumbing, meter installation, team management, fleet logistics | $3,000-4,000 | Promoted CEA field supervisor |
| Field Technicians | 8-12 | Meter installation, LoRaWAN activation, basic troubleshooting, physical fitness | $1,500-2,000 each | Retrained lecturistas (meter readers) |

**Field subtotal:** 9-13 people, ~$15,000-28,000/month

### 12.3 Total Monthly Staffing Cost

| Team | Headcount | Monthly Cost (USD) |
|---|---|---|
| Engineering | 7 | $44,000-55,000 |
| Field operations | 9-13 | $15,000-28,000 |
| **Total** | **16-20** | **$59,000-83,000** |
| **Annual staffing** | | **$708,000-996,000** |

### 12.4 Staffing Timeline

| Month | Action |
|---|---|
| Month 1 | Hire IoT Architect, 1 IoT Developer, Data Engineer. Assign Program Manager. |
| Month 2 | Hire 2nd IoT Developer, Data Scientist, RF Engineer. |
| Month 3 | Hire Field Supervisor. Begin lecturista retraining (8-12 candidates). |
| Month 4 | Field technicians complete training and certification. |
| Month 5 | Full team operational for meter installation wave. |
| Month 9+ | Evaluate team size for Phase 2 scale-up (30-40 technicians needed). |

### 12.5 Knowledge Transfer and Training

| Training | Audience | Duration | Provider |
|---|---|---|---|
| Kamstrup flowIQ 2200 installation certification | Field technicians | 3 days | Kamstrup Mexico |
| ThingsBoard PE administration | IoT Architect, Developers | 5 days | ThingsBoard Inc. (online) |
| ChirpStack LoRaWAN operations | RF Engineer, IoT Developers | 3 days | Self-study + community |
| Apache Kafka administration | Data Engineer, IoT Architect | 3 days | Confluent training (online) |
| LGPDPPSO data protection compliance | All team | 1 day | CEA legal department |
| Workplace safety (field installation) | Field technicians | 2 days | CEA safety department |

---

## Appendix A: Integration Points with Other Phases

| Phase | Integration | Direction | Timing |
|---|---|---|---|
| Phase 4 (API Integration) | Aquasis SOAP APIs for meter management | Phase 9 consumes | Available before Phase 9 starts |
| Phase 5 (API Modernization) | New REST APIs replacing SOAP | Phase 9 migrates to | When available (reduces SOAP dependency) |
| Phase 6 (Microservices) | Kubernetes/cloud infrastructure shared | Phase 9 deploys on | Must be ready by Month 1 |
| Phase 7 (Billing Engine) | Automated meter reading to billing pipeline | Phase 9 produces, Phase 7 consumes | Sprint 17 (Month 9) |
| Phase 8 (Customer Portal) | Real-time consumption data and leak alerts | Phase 9 produces, Phase 8 displays | Sprint 18 (Month 10) |
| Phase 10 (GIS) | Meter location georeferencing, coverage maps | Bidirectional | Ongoing |

## Appendix B: Key Aquasis Data Model Integration Points

| Aquasis Component | Current Use | AMI Integration |
|---|---|---|
| `ContadoresDTO.snTelelectura` | Boolean flag (mostly false) | Set to `true` for all smart meters |
| `ContadoresDTO.moduloComunicacion` | Empty for manual meters | Store LoRaWAN DevEUI |
| `equipo` table (21 columns) | Minimal use | Extend for full AMI device registry |
| `getLecturas` / `getConsumos` | Periodic manual readings | Supplement/replace with automated IoT reads |
| `crearOrdenTrabajo` | Manual work orders | Auto-generate from leak/tamper alerts |
| `getPuntoServicioPorContador` | Meter-to-service-point lookup | Map IoT meter_id to Aquasis idPtoServicio |
| `ptoszonid` (zone) | Billing/route zone | DMA zone mapping for NRW analysis |

## Appendix C: Success Criteria for Pilot Approval to Scale

Before approving the 100K meter Phase 2 scale-up, the following criteria must be met from the 10K pilot:

| Criterion | Threshold |
|---|---|
| Meter online rate (after 3 months) | > 98% of installed meters reporting hourly |
| Data completeness | > 99% of expected hourly readings received |
| Billing integration | Automated readings accepted by billing for 100% of pilot meters |
| NRW measurement | Pilot zone NRW quantified with confidence interval < +/- 3% |
| NRW reduction trend | Measurable downward trend in pilot zone NRW after 6 months |
| Leak detection precision | > 70% of flagged anomalies confirmed as real issues |
| Customer complaints | < 1% of pilot customers file billing complaints related to new meters |
| Gateway uptime | > 99% average across all 25 gateways |
| Total cost of ownership | Actual costs within 15% of pilot budget |
| Workforce readiness | Field technicians achieving > 80 installations/day per 2-person team |
