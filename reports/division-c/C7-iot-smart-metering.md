# C7 - IoT & Smart Metering Research Report

## Agent C7 (research-iot-metering) | Division C
**Date:** 2026-02-16
**Scope:** Smart metering, AMI infrastructure, IoT platforms, and real-time data pipelines for CEA Queretaro
**Status:** COMPLETE

---

## Executive Summary

CEA Queretaro (Comision Estatal de Aguas) currently operates a traditional meter reading system managed through AquaCIS/Aquasis, an Agbar/OCCAM-based commercial water management platform. The system uses SOAP APIs for meter management (`InterfazGenericaContadoresWS`), readings (`getLecturas`, `getConsumos`), and work orders (`crearOrdenTrabajo`). Meter data includes fields for `snTelelectura` (remote reading flag) and `moduloComunicacion` (communication module), indicating the data model was designed with AMR/AMI extensibility in mind. The database already contains an `equipo` table (21 columns) described as "Smart meter/AMR equipment. Remote reading management."

The transition to Advanced Metering Infrastructure (AMI) represents a transformative opportunity for CEA Queretaro. Given Queretaro's rapid urban growth (population exceeding 1.2 million in the metro area), increasing water scarcity in the Bajio region, and estimated non-revenue water (NRW) losses of 35-45%, smart metering deployment could yield 15-25% reduction in water losses and 20-30% improvement in billing accuracy. The total addressable meter base is estimated at 350,000-450,000 service points.

This report provides a comprehensive technical assessment of AMI architecture, communication protocols suitable for the Mexican regulatory and geographic context, vendor comparison, IoT platform options, data pipeline design, leak detection technologies, consumption analytics, and a phased implementation roadmap.

**Key Recommendation:** Deploy a LoRaWAN-based AMI network in phases, starting with a 10,000-meter pilot in high-NRW zones, using an MQTT-to-Kafka-to-TimescaleDB data pipeline integrated with the existing Aquasis SOAP layer through a new REST/gRPC gateway. Estimated ROI: 3-4 years with NRW reduction as the primary value driver.

---

## 1. AMI Architecture: End-to-End Smart Metering Infrastructure

### 1.1 Architecture Overview

Advanced Metering Infrastructure (AMI) for water utilities comprises four primary layers:

```
Layer 4: HEAD-END / ANALYTICS
+------------------------------------------------------------------+
| MDM (Meter Data Management) | Analytics Engine | Billing System   |
| Leak Detection AI | Customer Portal | Operational Dashboard       |
+------------------------------------------------------------------+
                              |
                         REST/gRPC API
                              |
Layer 3: DATA PLATFORM / IoT BACKBONE
+------------------------------------------------------------------+
| IoT Platform (ThingsBoard / AWS IoT Core)                         |
| MQTT Broker --> Kafka/Pulsar --> TimescaleDB/InfluxDB             |
| Device Registry | Firmware OTA | Alerting Engine                  |
+------------------------------------------------------------------+
                              |
                    MQTT / CoAP / HTTPS
                              |
Layer 2: NETWORK INFRASTRUCTURE
+------------------------------------------------------------------+
| LoRaWAN Gateways | NB-IoT Base Stations | Cellular Routers        |
| Mesh Repeaters | Network Server (ChirpStack / TTN)                 |
+------------------------------------------------------------------+
                              |
              LoRa / NB-IoT / Sigfox RF
                              |
Layer 1: FIELD DEVICES (SMART METERS)
+------------------------------------------------------------------+
| Ultrasonic/Electromagnetic Flow Meters                             |
| Communication Modules (LoRa, NB-IoT, Cellular)                    |
| Acoustic Leak Sensors | Pressure Transducers                      |
| Tamper Detection | Battery Management                             |
+------------------------------------------------------------------+
```

### 1.2 Integration with Existing Aquasis Infrastructure

The current Aquasis system already supports key integration points:

| Existing Component | Current State | AMI Integration Path |
|---|---|---|
| `ContadoresDTO.snTelelectura` | Boolean flag for remote reading | Set to `true` for AMI meters |
| `ContadoresDTO.moduloComunicacion` | Communication module identifier | Store LoRaWAN/NB-IoT module ID |
| `equipo` table (21 columns) | AMR equipment tracking | Extend for AMI device registry |
| `getLecturas` / `getConsumos` | Periodic manual readings | Supplement with real-time AMI reads |
| `crearOrdenTrabajo` | Manual work orders | Auto-generate from leak/tamper alerts |
| Service Point ID (`idPtoServicio`) | Links meter to location | GIS integration point |

### 1.3 Proposed Hybrid Architecture

```
FIELD                    NETWORK                  PLATFORM                AQUASIS
+-------------+    +----------------+    +------------------+    +----------------+
| Smart Meter |    | LoRaWAN GW     |    | MQTT Broker      |    | Aquasis SOAP   |
| (Kamstrup/  |--->| (Kerlink/      |--->| (EMQX/Mosquitto) |    | API Layer      |
|  Badger)    |    |  Multitech)    |    |       |          |    |                |
+-------------+    +----------------+    |  Kafka Streams   |    | REST Gateway   |
                                         |       |          |--->| (NEW)          |
+-------------+    +----------------+    |  TimescaleDB     |    |                |
| Pressure    |    | NB-IoT (Telcel |    |       |          |    | getLecturas    |
| Sensor      |--->|  /AT&T MX)     |--->|  IoT Platform    |    | getConsumos    |
+-------------+    +----------------+    |  (ThingsBoard)   |    | actualizarCont.|
                                         |       |          |    +----------------+
+-------------+                          |  Analytics/ML    |
| Acoustic    |                          |       |          |    +----------------+
| Leak Sensor |------------------------->|  Alert Engine    |--->| AGORA Platform |
+-------------+                          +------------------+    | (Notifications)|
                                                                 +----------------+
```

---

## 2. Communication Protocols: LoRaWAN vs NB-IoT vs Cellular

### 2.1 Protocol Comparison Matrix

| Criterion | LoRaWAN | NB-IoT | Sigfox | LTE-M / Cellular |
|---|---|---|---|---|
| **Range (urban)** | 2-5 km | 1-10 km | 3-10 km | Cell tower dependent |
| **Range (rural)** | 10-15 km | 10-15 km | 30-50 km | Cell tower dependent |
| **Penetration (basement/pit)** | Excellent | Excellent | Good | Moderate |
| **Battery life** | 10-15 years | 10+ years | 10+ years | 3-5 years |
| **Data rate** | 0.3-50 kbps | 20-250 kbps | 100 bps | 1+ Mbps |
| **Payload per msg** | 51-242 bytes | 1,600 bytes | 12 bytes | Unlimited |
| **Messages/day** | Unlimited (duty cycle) | Unlimited | 140 UL / 4 DL | Unlimited |
| **Latency** | 1-5 seconds | 1.5-10 seconds | ~30 seconds | <100 ms |
| **Bidirectional** | Yes (Class A/B/C) | Yes | Limited | Yes |
| **Firmware OTA** | Yes (fragmented) | Yes | No | Yes |
| **Network cost** | Own infrastructure | Carrier subscription | Sigfox subscription | Carrier subscription |
| **Monthly per device** | $0 (own) / $1-2 (hosted) | $0.50-2.00 | $1-2 | $3-10 |
| **Mexico availability** | Growing (private networks) | Telcel, AT&T MX | Limited/discontinued | Telcel, AT&T, Movistar |
| **Spectrum** | Unlicensed (915 MHz ISM) | Licensed (LTE bands) | Unlicensed (868/902) | Licensed (LTE) |
| **Ecosystem maturity** | Mature, open standard | Mature, 3GPP standard | Declining | Mature |

### 2.2 Mexico-Specific Protocol Assessment

#### LoRaWAN (RECOMMENDED for CEA Queretaro)

**Advantages for Queretaro:**
- Queretaro's terrain (valley surrounded by hills at ~1,800m elevation) is favorable for LoRaWAN gateway placement on high points
- ISM band 915 MHz is available in Mexico under NOM-208-SCFI (no spectrum licensing required)
- Private network eliminates dependency on telecom carriers
- CEA controls the entire infrastructure stack, ensuring long-term cost predictability
- Strong penetration for underground meter pits common in Mexican residential areas
- Growing ecosystem of LoRaWAN deployments in Latin American water utilities (SABESP Brazil, AySA Argentina)

**Challenges:**
- Requires capital investment in gateway infrastructure (estimated 80-120 gateways for metro Queretaro)
- Needs dedicated network operations team
- Duty cycle limitations in ISM band (1% in some regions, though Mexico is more permissive)

**Estimated Infrastructure Cost:**
- 100 gateways x $1,500 USD = $150,000
- Network server (ChirpStack self-hosted) = $0 (open source)
- Solar/battery backup per gateway = $500 x 100 = $50,000
- Installation and mounting = $200,000
- **Total LoRaWAN infrastructure: ~$400,000 USD**

#### NB-IoT (VIABLE ALTERNATIVE)

**Advantages:**
- No infrastructure to deploy -- uses existing Telcel/AT&T towers
- Already deployed in Queretaro metro area by Telcel
- Better for meters in deep basements or concrete-enclosed locations
- Standardized 3GPP protocol with guaranteed carrier support

**Challenges:**
- Ongoing per-device subscription cost ($0.50-2/month per meter)
- At 400,000 meters: $2.4M-9.6M USD/year in recurring connectivity costs
- Carrier dependency (coverage gaps, pricing changes, technology sunset risk)
- NB-IoT coverage in rural Queretaro municipalities (Huimilpan, Amealco, Cadereyta) may be limited

**Verdict:** NB-IoT is viable for select high-value, hard-to-reach locations but cost-prohibitive as the primary network for the entire meter base.

#### Sigfox (NOT RECOMMENDED)

Sigfox's uncertain business trajectory (multiple ownership changes, network sunset in some regions) makes it unsuitable for a 15-year metering infrastructure investment. Limited presence in Mexico.

### 2.3 Recommended Hybrid Strategy

| Deployment Zone | Protocol | Rationale |
|---|---|---|
| Urban Queretaro (70% of meters) | LoRaWAN | Dense deployment, cost-effective with private network |
| Suburban / New developments (15%) | LoRaWAN | Gateway deployment planned with new infrastructure |
| Rural municipalities (10%) | NB-IoT | Sparse meters, gateway infrastructure not justified |
| Critical infrastructure (5%) | LTE-M/Cellular | DMA inlet meters, pressure sensors requiring low latency |

---

## 3. Smart Meter Vendors: Water-Specific Comparison

### 3.1 Vendor Comparison Matrix

| Feature | Kamstrup flowIQ 2200 | Badger Meter ORION | Sensus iPERL | Itron Intelis |
|---|---|---|---|---|
| **Measurement** | Ultrasonic | Ultrasonic/Mag | Electromagnetic | Ultrasonic |
| **Accuracy class** | R800 (high) | R400-R800 | R800 | R400-R800 |
| **Low-flow detection** | 1 L/hr | 0.25 GPM | 0.015 GPM | 1 L/hr |
| **Sizes (DN)** | 15-50mm | 15-300mm | 15-150mm | 15-50mm |
| **Battery life** | 16 years | 20 years | 15 years | 16 years |
| **Communication** | LoRaWAN, NB-IoT, wM-Bus | LoRaWAN, Cellular, proprietary | Sensus FlexNet (proprietary) | LoRaWAN, NB-IoT, cellular |
| **Data logging** | 8,760 hourly values (1 year) | 96 daily intervals | Continuous | 4,320 values |
| **Leak alarm** | Yes (configurable) | Yes (continuous flow) | Yes | Yes |
| **Tamper detection** | Magnetic, tilt, reverse flow | Magnetic, cut wire | Magnetic | Magnetic, tilt |
| **Reverse flow** | Measured | Measured | Measured | Measured |
| **IP rating** | IP68 (permanently submerged) | IP68 | IP68 | IP68 |
| **Operating temp** | 0.1-50C | 0.5-50C | 1-50C | 0.1-50C |
| **Mexico presence** | Yes (offices in CDMX) | Yes (strong LATAM presence) | Via Xylem Mexico | Yes (offices in CDMX/MTY) |
| **LATAM references** | SABESP, CAESB (Brazil) | Multiple US/MX utilities | European-focused | AySA (Argentina), SEDAPAL (Peru) |
| **Estimated unit cost** | $150-250 USD (DN15-25) | $120-200 USD (DN15-25) | $200-350 USD (DN15-25) | $140-230 USD (DN15-25) |
| **Open protocol** | Yes (LoRaWAN standard) | Mixed (ORION proprietary + LoRa) | No (FlexNet lock-in) | Yes (LoRaWAN standard) |

### 3.2 Vendor Assessment for CEA Queretaro

**Tier 1 Recommendation: Kamstrup flowIQ 2200**
- Best-in-class ultrasonic accuracy (R800) critical for Mexican tiered water tariffs
- Native LoRaWAN support aligns with recommended network strategy
- Strong Latin American presence with local support in Mexico City
- Proven in similar climate conditions (semi-arid, 15-35C operating range)
- Excellent low-flow detection for identifying leaks and unauthorized connections
- Open protocol avoids vendor lock-in

**Tier 2 Recommendation: Badger Meter ORION**
- Strongest presence in the Americas with dedicated Mexico/LATAM sales teams
- Broadest size range (DN15-300) covering residential through industrial
- Competitive pricing for budget-constrained deployments
- ORION cellular endpoint is proprietary, but LoRaWAN endpoints available through partners

**Not Recommended: Sensus iPERL**
- FlexNet proprietary network creates complete vendor dependency
- Higher total cost of ownership when including FlexNet infrastructure
- Limited flexibility for multi-vendor deployments

### 3.3 Cost Estimation for Full Deployment (400,000 meters)

| Component | Unit Cost (USD) | Quantity | Total (USD) |
|---|---|---|---|
| Smart meters (DN15-25, residential) | $180 avg | 360,000 | $64,800,000 |
| Smart meters (DN50-100, commercial) | $500 avg | 35,000 | $17,500,000 |
| Smart meters (DN150+, industrial) | $2,000 avg | 5,000 | $10,000,000 |
| LoRaWAN communication modules | $25 avg | 400,000 | $10,000,000 |
| Installation labor | $30 avg | 400,000 | $12,000,000 |
| **Total field devices** | | | **$114,300,000** |

> **Note:** These are full-deployment estimates. Phased deployment over 7-10 years, starting with a 10,000-meter pilot ($3-4M), is recommended.

---

## 4. IoT Platform Comparison: Managed vs Self-Hosted

### 4.1 Platform Options

| Feature | ThingsBoard (Self-Hosted) | AWS IoT Core | Azure IoT Hub | ChirpStack + Custom |
|---|---|---|---|---|
| **Type** | Open-source / PE | Managed cloud | Managed cloud | Open-source |
| **Device management** | Yes (built-in) | Yes (IoT Device Management) | Yes (IoT Hub DPS) | Basic (LoRaWAN focused) |
| **Protocol support** | MQTT, CoAP, HTTP | MQTT, HTTP, WebSocket | MQTT, AMQP, HTTP | LoRaWAN (MQTT output) |
| **Rules engine** | Yes (visual) | Yes (IoT Rules) | Yes (Stream Analytics) | No (needs external) |
| **Dashboards** | Yes (built-in, customizable) | QuickSight (separate) | Power BI (separate) | No (needs Grafana) |
| **Alerting** | Yes (built-in) | SNS/Lambda | Event Grid/Functions | External (custom) |
| **Data storage** | PostgreSQL/Cassandra | DynamoDB/Timestream | Cosmos DB/ADX | External (TimescaleDB) |
| **Scalability** | 100K+ devices (PE) | Millions | Millions | 100K+ |
| **OTA firmware** | Yes | Yes (FreeRTOS) | Yes (IoT Hub) | Yes (LoRaWAN FUOTA) |
| **Edge computing** | ThingsBoard Edge | Greengrass | IoT Edge | No |
| **Hosting** | On-prem or cloud VM | AWS only | Azure only | On-prem or cloud VM |
| **Data sovereignty** | Full control | AWS Mexico region (pending) | Azure Mexico Central | Full control |
| **Monthly cost (100K devices)** | $500-2,000 (infra) | $15,000-30,000 | $12,000-25,000 | $300-800 (infra) |
| **Monthly cost (400K devices)** | $2,000-5,000 (infra) | $50,000-100,000 | $40,000-80,000 | $800-2,000 (infra) |
| **Mexico data residency** | Yes (self-hosted) | Limited | Yes (Mexico Central) | Yes (self-hosted) |
| **CONAGUA compliance** | Full control | Requires configuration | Requires configuration | Full control |

### 4.2 Recommendation for CEA Queretaro

**Primary: ThingsBoard Professional Edition (Self-Hosted)**

Rationale:
- **Data sovereignty**: Mexican government entities (including water utilities) increasingly require data to remain within national boundaries. Self-hosting on local infrastructure or Mexico-region cloud (Azure Mexico Central or local data center) ensures compliance.
- **Cost**: At 400K devices, ThingsBoard PE self-hosted costs ~$5,000/month vs $50,000-100,000/month for AWS IoT Core. Over 10 years, this represents $5.4M in savings.
- **Customization**: Open-source core allows custom rule chains, dashboards, and integrations tailored to Mexican water utility workflows.
- **Existing Aquasis integration**: ThingsBoard's REST API can interface with Aquasis SOAP endpoints through a middleware adapter.
- **Built-in dashboards**: Operators can monitor meter status, consumption patterns, and alerts without additional BI tools.

**Alternative: ChirpStack (LoRaWAN Network Server) + Custom Microservices**

For organizations with strong engineering teams, a ChirpStack-centered architecture provides maximum control:
- ChirpStack handles LoRaWAN device management, join server, and downlink scheduling
- Custom microservices consume MQTT events and route to Kafka/TimescaleDB
- Grafana provides dashboards; custom alerting via Prometheus/Alertmanager
- Lower licensing cost but higher development and maintenance effort

### 4.3 Aquasis Integration Pattern

```
ThingsBoard                          Aquasis Gateway (NEW)
+------------------+                +------------------------+
| Device Telemetry |   REST/gRPC    | SOAP Client            |
| Rule Engine      |--------------->| actualizarContador()   |
| Alert Engine     |                | crearOrdenTrabajo()    |
+------------------+                | getLecturas() sync     |
        |                           +------------------------+
        |                                     |
   TimescaleDB                          Aquasis SOAP
+------------------+                +------------------------+
| meter_readings   |                | InterfazGenericaCont.  |
| hourly_values    |<-- periodic -->| InterfazGenericaOrd.   |
| alerts           |    sync        | OficinaVirtualClientes |
+------------------+                +------------------------+
```

---

## 5. Data Pipeline Architecture: MQTT to Kafka to TimescaleDB

### 5.1 Reference Architecture

```
SMART METERS (400K)
       |
   LoRaWAN / NB-IoT
       |
+------v--------+
| LoRaWAN       |    Join/Decode
| Network Server|----+
| (ChirpStack)  |    |
+---------------+    |
                     v
              +------+--------+
              | MQTT Broker   |  EMQX Cluster
              | (EMQX 5.x)   |  - 400K connections
              | Port 1883/8883|  - TLS mutual auth
              +------+--------+  - QoS 1 guaranteed
                     |
         +-----------+-----------+
         |                       |
    +----v----+           +------v------+
    | Kafka   |           | Stream      |
    | Connect |           | Processor   |
    | (MQTT   |           | (Kafka      |
    |  Source) |           |  Streams /  |
    +---------+           |  Flink)     |
         |                +------+------+
    +----v--------------+        |
    | Apache Kafka      |        |
    | Cluster           |<-------+
    | Topics:           |
    |  meter.readings   |  Real-time
    |  meter.alerts     |  Processing:
    |  meter.status     |  - Validation
    |  meter.battery    |  - Unit conversion
    +----+---------+----+  - Anomaly detection
         |         |       - Leak scoring
    +----v----+  +-v-----------+
    | Timescale| | Alerting    |
    | DB      | | Engine      |
    | Tables: | | (Rules +    |
    |  readings| |  ML model)  |
    |  hourly  | +------+------+
    |  daily   |        |
    |  alerts  |  +-----v------+
    +----+-----+  | AGORA      |
         |        | Notif.     |
    +----v-----+  | (WhatsApp, |
    | Grafana  |  |  SMS, Push)|
    | Dashboards| +------------+
    +----------+
```

### 5.2 Component Specifications

#### MQTT Broker: EMQX 5.x

| Specification | Value |
|---|---|
| Deployment | 3-node cluster (HA) |
| Connections | 400,000 concurrent |
| Message throughput | ~500K msgs/hour (meters reporting hourly) |
| QoS | Level 1 (at-least-once delivery) |
| Authentication | X.509 client certificates + username/password |
| Authorization | Topic-level ACL per device |
| Protocol | MQTT 3.1.1 / 5.0 over TLS 1.3 |
| Bridge | Kafka bridge (built-in EMQX Enterprise) |

#### Apache Kafka

| Specification | Value |
|---|---|
| Deployment | 3-broker cluster + ZooKeeper (or KRaft) |
| Topics | `meter.readings.raw`, `meter.readings.validated`, `meter.alerts`, `meter.status`, `meter.battery` |
| Partitions | 12 per topic (keyed by meter_id for ordering) |
| Retention | 7 days raw, 30 days validated |
| Replication | Factor 3 |
| Throughput | ~150 MB/hour sustained |
| Consumer groups | `timescaledb-sink`, `alert-engine`, `analytics`, `aquasis-sync` |

#### TimescaleDB (PostgreSQL Extension)

| Specification | Value |
|---|---|
| Base | PostgreSQL 16 + TimescaleDB 2.x |
| Hypertables | `meter_readings`, `hourly_consumption`, `daily_consumption`, `alerts` |
| Chunk interval | 1 day for readings, 1 week for aggregates |
| Compression | After 7 days (10-20x compression ratio) |
| Retention | Raw: 90 days, Hourly: 2 years, Daily: 10 years |
| Continuous aggregates | Hourly, daily, monthly rollups |
| Estimated storage | ~2 TB/year raw, ~200 GB/year compressed |

### 5.3 Data Schema

```sql
-- Core meter readings hypertable
CREATE TABLE meter_readings (
    time         TIMESTAMPTZ NOT NULL,
    meter_id     TEXT NOT NULL,           -- maps to Aquasis numeroSerie
    reading_m3   DOUBLE PRECISION,        -- cumulative meter reading
    flow_lph     DOUBLE PRECISION,        -- instantaneous flow (liters/hour)
    temperature  DOUBLE PRECISION,        -- water temperature (C)
    battery_pct  SMALLINT,                -- battery percentage
    signal_rssi  SMALLINT,                -- signal strength (dBm)
    signal_snr   REAL,                    -- signal-to-noise ratio
    flags        JSONB,                   -- tamper, reverse_flow, leak_alarm, etc.
    raw_payload  BYTEA                    -- original LoRaWAN payload for audit
);
SELECT create_hypertable('meter_readings', 'time');

-- Continuous aggregates
CREATE MATERIALIZED VIEW hourly_consumption
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    meter_id,
    last(reading_m3, time) - first(reading_m3, time) AS consumption_m3,
    avg(flow_lph) AS avg_flow_lph,
    max(flow_lph) AS max_flow_lph,
    min(battery_pct) AS min_battery_pct,
    count(*) AS reading_count
FROM meter_readings
GROUP BY bucket, meter_id;

-- Alerts table
CREATE TABLE meter_alerts (
    time         TIMESTAMPTZ NOT NULL,
    meter_id     TEXT NOT NULL,
    alert_type   TEXT NOT NULL,           -- 'leak', 'tamper', 'battery_low', 'no_flow', 'reverse_flow'
    severity     TEXT NOT NULL,           -- 'critical', 'warning', 'info'
    details      JSONB,
    acknowledged BOOLEAN DEFAULT FALSE,
    aquasis_order_id TEXT                 -- link to work order if created
);
SELECT create_hypertable('meter_alerts', 'time');
```

### 5.4 Alternative: Apache Pulsar

Apache Pulsar offers advantages over Kafka for this use case:
- Native MQTT protocol handler (no separate broker needed)
- Built-in tiered storage (hot/warm/cold) reduces costs
- Multi-tenancy for separating meter data by zone/municipality
- Geo-replication for disaster recovery

However, Kafka has a significantly larger ecosystem, more operational expertise available in the Mexican market, and better integration with monitoring tools. **Kafka is recommended** for CEA Queretaro unless the team has specific Pulsar experience.

---

## 6. Leak Detection: Technology Options and ROI

### 6.1 Leak Detection Technology Comparison

| Technology | Method | Accuracy | Cost/Point | Best For |
|---|---|---|---|---|
| **Smart meter analytics** | Continuous flow analysis (minimum night flow) | 70-85% | $0 (uses meter data) | Customer-side leaks, post-meter losses |
| **Acoustic sensors (fixed)** | Sound analysis on pipes | 85-95% | $500-2,000/sensor | Trunk mains, critical pipelines |
| **Acoustic sensors (mobile)** | Correlator/ground microphone | 90-98% | $20,000-50,000/unit | Pinpointing leaks for repair crews |
| **Pressure monitoring (DMA)** | Pressure drop analysis | 75-90% | $2,000-5,000/DMA | Network-level leak detection |
| **Satellite/InSAR** | Ground deformation monitoring | 60-80% | $50-100/km2/year | Large-area screening |
| **AI anomaly detection** | ML on meter + pressure data | 80-92% | Software cost only | Combining multiple data sources |

### 6.2 Smart Meter-Based Leak Detection

The most cost-effective leak detection method leverages smart meter data already being collected:

**Minimum Night Flow (MNF) Analysis:**
- Smart meters report hourly consumption
- Between 2:00-4:00 AM, legitimate consumption is minimal
- Persistent flow above a threshold (e.g., >5 L/hr for residential) indicates a leak
- Aggregated MNF across a DMA (District Metered Area) reveals network leaks

**Continuous Flow Detection:**
- If a meter registers non-zero flow for 24+ consecutive hours, a customer-side leak is flagged
- Alert sent to AGORA platform via existing notification channels (WhatsApp, SMS)
- Work order auto-generated in Aquasis via `crearOrdenTrabajo`

**Step-Test Automation:**
- Progressive valve closure in a DMA while monitoring smart meter readings
- Identifies pipe segment with the leak without physical acoustic survey
- Reduces leak pinpointing time from days to hours

### 6.3 AI-Based Anomaly Detection Pipeline

```
Smart Meter Data (TimescaleDB)
        |
        v
+-------------------+
| Feature Engine    |
| - Hourly patterns |
| - Day-of-week     |
| - Seasonal adj.   |
| - Weather corr.   |
+-------------------+
        |
        v
+-------------------+
| ML Models         |
| - Isolation Forest|  Unsupervised anomaly detection
| - LSTM Autoencoder|  Temporal pattern learning
| - XGBoost         |  Supervised (trained on known leaks)
+-------------------+
        |
        v
+-------------------+
| Scoring Engine    |
| - Leak probability|
| - Severity score  |
| - Location conf.  |
+-------------------+
        |
        v
+-------------------+     +-------------------+
| Alert Generation  |---->| AGORA Notification|
| (meter_alerts)    |     | (WhatsApp/SMS)    |
+-------------------+     +-------------------+
        |
        v
+-------------------+
| Auto Work Order   |
| crearOrdenTrabajo |
| via Aquasis SOAP  |
+-------------------+
```

### 6.4 ROI Analysis for Leak Detection

| Metric | Current (Manual) | With Smart Metering | Improvement |
|---|---|---|---|
| Leak detection time | 2-4 weeks | 24-48 hours | 90% faster |
| Customer-side leak notification | None (customer discovers) | Automatic within 24 hrs | New capability |
| DMA leak localization | Manual step-test (2-3 days) | Automated (2-4 hours) | 95% faster |
| Water loss from detected leaks | ~5,000 m3/leak avg | ~500 m3/leak avg | 90% reduction |
| Repair crew efficiency | 2-3 repairs/day | 5-7 repairs/day | 100-130% increase |
| Annual water saved (est.) | Baseline | 10-15 million m3 | $3-5M USD/year value |

---

## 7. Consumption Analytics: ML Models for Water Usage Patterns

### 7.1 Analytics Use Cases

#### A. Customer Segmentation by Usage Pattern

| Segment | Pattern | Action |
|---|---|---|
| **Residential - Normal** | 150-300 L/day, morning/evening peaks | Standard tariff |
| **Residential - High** | >500 L/day, constant flow | Conservation outreach |
| **Residential - Irregular** | Sporadic, >0 at night | Leak investigation |
| **Commercial** | Business-hour peaks, weekday patterns | Commercial tariff optimization |
| **Industrial** | 24/7 constant high flow | Demand forecasting |
| **Seasonal** | Summer peaks, variable occupancy | Dynamic pricing potential |
| **Suspected unauthorized** | Abnormal patterns, meter tampering | Inspection priority |

#### B. Demand Forecasting

- **Short-term (1-24 hours):** LSTM neural networks using weather forecast, time-of-day, day-of-week
- **Medium-term (1-30 days):** ARIMA/Prophet models for operational planning
- **Long-term (1-5 years):** Regression models incorporating population growth, land use changes, climate projections

```python
# Example: Prophet-based demand forecasting
from prophet import Prophet
import pandas as pd

# Aggregate hourly consumption from TimescaleDB
query = """
    SELECT time_bucket('1 hour', time) as ds,
           SUM(consumption_m3) as y
    FROM hourly_consumption
    WHERE time > NOW() - INTERVAL '2 years'
    GROUP BY ds ORDER BY ds
"""
df = pd.read_sql(query, timescale_conn)

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=True,
    changepoint_prior_scale=0.05
)
model.add_regressor('temperature')
model.add_regressor('is_holiday')
model.fit(df)

future = model.make_future_dataframe(periods=720, freq='H')  # 30 days ahead
forecast = model.predict(future)
```

#### C. Tariff Optimization

Smart meter data enables time-of-use (TOU) pricing analysis:
- Peak hours (7-9 AM, 6-9 PM): Higher tariff to discourage peak demand
- Off-peak hours (11 PM - 5 AM): Lower tariff for irrigation/industrial
- Seasonal adjustment: Higher summer rates reflecting true scarcity cost
- Block tariff refinement: Move from bimonthly estimated to actual monthly consumption blocks

#### D. Water Balance Calculation

```
System Input Volume (production meters)
    - Authorized Consumption (sum of smart meter readings)
    - Authorized Unbilled (parks, firefighting, flushing)
    = Water Losses
        - Apparent Losses (meter under-registration, unauthorized use)
        - Real Losses (leaks, bursts, tank overflows)
```

Smart metering improves every component of this calculation by providing accurate, timely consumption data rather than bimonthly estimates.

### 7.2 Analytics Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Data warehouse | TimescaleDB (hypertables) | Time-series storage with SQL interface |
| Feature store | Redis / PostgreSQL | Pre-computed features for ML models |
| ML training | Python (scikit-learn, TensorFlow) | Model development and training |
| ML serving | MLflow + FastAPI | Model versioning and inference API |
| Visualization | Grafana + Apache Superset | Operational dashboards and exploration |
| Reporting | Apache Superset / Metabase | Business intelligence and regulatory reports |
| Orchestration | Apache Airflow | ETL and model retraining pipelines |

---

## 8. Non-Revenue Water (NRW) Reduction

### 8.1 NRW Components and Smart Metering Impact

Non-Revenue Water (NRW) represents water produced and lost before reaching the customer or water delivered but not billed. The IWA (International Water Association) standard water balance methodology breaks NRW into:

| NRW Component | Typical % in Mexico | Smart Metering Impact | Reduction Potential |
|---|---|---|---|
| **Real Losses (Leaks)** | 20-30% | MNF analysis, pressure management, rapid leak detection | 30-50% reduction |
| **Apparent Losses - Meter error** | 5-10% | Ultrasonic meters with R800 accuracy, low-flow detection | 60-80% reduction |
| **Apparent Losses - Unauthorized** | 3-8% | Tamper detection, reverse flow alerts, consumption pattern analysis | 40-60% reduction |
| **Apparent Losses - Data handling** | 2-5% | Automated meter reads eliminate estimation errors | 80-95% reduction |
| **Unbilled Authorized** | 2-3% | Better accounting of municipal/fire use | 20-30% reduction |

### 8.2 Estimated NRW Reduction for CEA Queretaro

**Assumptions:**
- Current NRW: ~40% (typical for Mexican utilities of this size)
- Annual water production: ~200 million m3
- Current NRW volume: ~80 million m3/year
- Average water cost (production + treatment): $0.30 USD/m3
- Average water revenue: $0.50 USD/m3

| Scenario | NRW % | NRW Volume (Mm3/yr) | Revenue Recovery (USD/yr) |
|---|---|---|---|
| Current state | 40% | 80 | Baseline |
| Year 1 (pilot, 10K meters) | 39% | 78 | $1M |
| Year 3 (100K meters + DMA) | 33% | 66 | $7M |
| Year 5 (250K meters) | 28% | 56 | $12M |
| Year 7 (full deployment) | 22% | 44 | $18M |
| Year 10 (optimized) | 18% | 36 | $22M |

**Cumulative revenue recovery over 10 years: ~$100-120M USD** (vs total investment of ~$60-80M phased over the same period).

### 8.3 Quick Wins with Smart Metering Data

1. **Large meter auditing**: Replace or calibrate the top 100 largest meters (representing 30-40% of billed consumption). Ultrasonic meters eliminate mechanical degradation.
2. **Zero-consumption identification**: Smart meters reveal accounts registering zero consumption for extended periods -- potential unauthorized bypasses or abandoned connections.
3. **Meter sizing optimization**: Hourly flow data reveals over-sized meters (operating below their minimum threshold, under-registering flow).
4. **Billing cycle accuracy**: Move from bimonthly estimated reads (with "estimation methods" visible in the existing `getLecturas` response) to actual monthly reads.

---

## 9. Mexican Deployment Considerations

### 9.1 Regulatory Framework

| Regulation | Authority | Relevance |
|---|---|---|
| **Ley de Aguas Nacionales (LAN)** | CONAGUA | National water law governing concessions, metering requirements |
| **NOM-012-CONAGUA** | CONAGUA | Water meter accuracy and certification standards |
| **NOM-208-SCFI** | SE (Economy Ministry) | Radio spectrum use in ISM bands (915 MHz for LoRaWAN) |
| **Ley Federal de Telecomunicaciones** | IFT | Telecom regulation for NB-IoT/cellular deployments |
| **LGPDPPSO** | INAI | Personal data protection (meter data is personal data) |
| **NMX-AA-147-SCFI** | SE | Water efficiency in buildings |
| **Ley Estatal de Aguas de Queretaro** | State Congress | State-level water utility regulation |
| **CONAGUA Registro Publico de Derechos de Agua (REPDA)** | CONAGUA | Water rights registry and concession compliance |

### 9.2 NOM-012-CONAGUA Compliance

NOM-012-CONAGUA establishes requirements for water meters installed in Mexico:
- Meters must be certified by an accredited lab (e.g., CENAM)
- Accuracy classes aligned with ISO 4064 (R values)
- Periodic verification required (every 5-8 years depending on caliber)
- Smart meters (ultrasonic/electromagnetic) generally exceed NOM-012 requirements
- Communication modules are not specifically regulated under NOM-012 (separate radio regulations apply)

**Action Required:** Confirm that selected smart meter models (Kamstrup/Badger) hold NOM-012 certification or obtain it before deployment.

### 9.3 Data Privacy (LGPDPPSO/LFPDPPP)

Smart meter data constitutes personal data under Mexican law:
- Hourly consumption patterns can reveal occupancy, lifestyle, and behavior
- CEA Queretaro, as a government entity, falls under LGPDPPSO (public sector data protection)
- Requirements: Privacy notice, consent for data collection beyond billing, data minimization
- **Recommendation:** Store granular (hourly) data for maximum 2 years, aggregate to daily for long-term retention
- Data must remain in Mexican territory (favors self-hosted IoT platform over US-hosted cloud)

### 9.4 Climate and Environmental Considerations for Queretaro

| Factor | Specification | Impact on AMI |
|---|---|---|
| **Climate** | Semi-arid (BSh), 15-32C typical | Meters rated for 0-50C are adequate |
| **Altitude** | ~1,800m above sea level | No impact on meter accuracy; slight impact on radio propagation (thinner atmosphere, better RF) |
| **Rainfall** | 500-600mm/year, concentrated Jun-Sep | Meter pits may flood during rainy season -- IP68 rating essential |
| **UV exposure** | High (latitude 20.6N, elevation) | Gateway enclosures must be UV-resistant; solar panels highly effective |
| **Seismicity** | Moderate (Zone B) | Gateway mounting must account for seismic loads |
| **Dust** | Moderate (semi-arid) | Gateway ventilation filters; solar panel cleaning schedule |
| **Temperature extremes** | 0C winter nights possible | Battery chemistry must handle cold starts |

### 9.5 Infrastructure Readiness

| Infrastructure | Status | Gap |
|---|---|---|
| **Cellular coverage** | Telcel 4G/LTE covers >95% of urban Queretaro | Rural municipalities (Pinal de Amoles, Landa, Jalpan) have limited coverage |
| **Fiber/Internet** | Available in most urban areas | Gateway backhaul via cellular (4G) in areas without fiber |
| **Electricity** | Reliable in urban areas | Solar+battery for rural gateways |
| **GIS data** | Partial (service point coordinates in Aquasis) | Needs comprehensive georeferencing of all meters |
| **DMA infrastructure** | Limited | Must be developed in parallel with AMI for full leak detection benefits |
| **Technical staff** | Traditional meter reading workforce | Requires significant retraining for IoT/data operations |

### 9.6 Workforce Transition

The transition from manual meter reading to AMI affects approximately 200-300 meter readers (lecturistas). A responsible deployment plan should include:
- **Retraining as field technicians** for meter installation, maintenance, and leak repair
- **Data analysts** for those with analytical aptitude -- monitoring dashboards, investigating alerts
- **Customer service** for handling the increased customer engagement smart metering enables
- **Gradual transition** aligned with the phased deployment (7-10 years provides adequate transition time)

---

## 10. Implementation Roadmap: Phased Smart Metering for CEA Queretaro

### Phase 0: Foundation (Months 1-6) -- $500K

| Activity | Duration | Deliverable |
|---|---|---|
| AMI program office establishment | Month 1-2 | Dedicated team, governance structure |
| RFP for smart meters and network equipment | Month 1-3 | Vendor selection (Kamstrup/Badger + LoRaWAN) |
| LoRaWAN network design for pilot zones | Month 2-4 | RF propagation study, gateway placement plan |
| IoT platform deployment (ThingsBoard PE) | Month 3-5 | Staging environment, MQTT broker, TimescaleDB |
| Aquasis integration gateway development | Month 4-6 | REST/gRPC gateway bridging IoT platform to SOAP APIs |
| GIS data cleanup and meter georeferencing | Month 1-6 | Accurate coordinates for all service points in pilot zones |
| NOM-012 certification verification | Month 1-3 | Confirmed meter compliance |
| Regulatory/privacy assessment | Month 2-4 | LGPDPPSO compliance plan, privacy notices |

### Phase 1: Pilot (Months 7-18) -- $3-4M

| Activity | Duration | Scope |
|---|---|---|
| Deploy 20 LoRaWAN gateways in pilot zone | Month 7-9 | High-NRW zone in central Queretaro |
| Install 10,000 smart meters | Month 8-15 | Mix of residential (8,000), commercial (1,500), industrial (500) |
| Commission data pipeline (MQTT->Kafka->TimescaleDB) | Month 9-11 | Production environment |
| Implement basic dashboards (Grafana) | Month 10-12 | Real-time monitoring, consumption reporting |
| Activate leak detection algorithms | Month 12-15 | MNF analysis, continuous flow alerts |
| Customer notification integration with AGORA | Month 13-16 | Leak alerts via WhatsApp/SMS |
| Measure pilot KPIs | Month 15-18 | NRW reduction, billing accuracy, customer satisfaction |

**Pilot Success Criteria:**
- >95% meter communication reliability (daily)
- >3% NRW reduction in pilot zone
- >80% customer satisfaction with leak notifications
- <5% meter failure rate
- Aquasis integration functioning for automated readings

### Phase 2: Scale-Up (Months 19-36) -- $15-20M

| Activity | Duration | Scope |
|---|---|---|
| Expand LoRaWAN to 80 gateways | Month 19-24 | Cover all urban Queretaro |
| Deploy 90,000 additional meters (total: 100K) | Month 19-36 | Priority: high-value commercial, high-NRW zones |
| Establish 20 DMAs with pressure monitoring | Month 22-30 | Pressure sensors at DMA boundaries |
| Deploy AI anomaly detection | Month 24-30 | Isolation Forest + LSTM models |
| Implement demand forecasting | Month 28-36 | Prophet/ARIMA models for operational planning |
| Integrate with billing system | Month 24-30 | Automated meter reads replace manual reads |
| Begin NB-IoT deployment for rural areas | Month 30-36 | 5,000 meters in rural municipalities |

### Phase 3: Full Deployment (Months 37-72) -- $40-50M

| Activity | Duration | Scope |
|---|---|---|
| Deploy remaining 300,000 meters | Month 37-72 | All service points |
| Expand LoRaWAN to 120+ gateways | Month 37-48 | Full metro coverage including suburban |
| Advanced analytics deployment | Month 37-48 | Customer segmentation, tariff optimization |
| DMA expansion to 60+ zones | Month 37-60 | Comprehensive pressure management |
| Acoustic sensor deployment (critical mains) | Month 42-60 | 500 sensors on trunk lines |
| Customer portal with real-time consumption | Month 40-48 | Web/mobile app for customers |
| Workforce transition completion | Month 37-72 | All meter readers retrained |

### Phase 4: Optimization (Month 73+) -- Ongoing

| Activity | Cadence | Scope |
|---|---|---|
| ML model retraining | Quarterly | Improved anomaly detection accuracy |
| Meter firmware updates (OTA) | Semi-annual | Bug fixes, feature additions |
| Network optimization | Ongoing | Gateway repositioning, capacity planning |
| Tariff reform based on smart data | Annual | Dynamic/TOU pricing evaluation |
| CONAGUA reporting automation | Monthly | Automated regulatory compliance reports |
| NRW performance benchmarking | Quarterly | IWA water balance methodology |

### Total Investment Summary

| Phase | Duration | Investment (USD) | Cumulative |
|---|---|---|---|
| Phase 0: Foundation | 6 months | $500K | $500K |
| Phase 1: Pilot | 12 months | $3.5M | $4M |
| Phase 2: Scale-Up | 18 months | $17.5M | $21.5M |
| Phase 3: Full Deployment | 36 months | $45M | $66.5M |
| Phase 4: Optimization | Ongoing | $3M/year | -- |
| **Total (7-year deployment)** | **72 months** | **~$70M** | -- |

---

## 11. Recommendations

### Technology Recommendations

| # | Recommendation | Priority | Rationale |
|---|---|---|---|
| 1 | Deploy LoRaWAN as primary AMI network with NB-IoT for rural areas | **HIGH** | Best cost-performance ratio for Queretaro's geography and scale; data sovereignty; no carrier dependency |
| 2 | Select Kamstrup flowIQ 2200 as primary smart meter (with Badger Meter as secondary) | **HIGH** | Best accuracy (R800), native LoRaWAN, strong Mexico/LATAM presence, NOM-012 compatible |
| 3 | Deploy ThingsBoard PE (self-hosted) as IoT platform | **HIGH** | Data sovereignty, cost-effective at scale, built-in dashboards, open-source flexibility |
| 4 | Implement EMQX + Kafka + TimescaleDB data pipeline | **HIGH** | Industry-standard, scalable, SQL-compatible time-series storage, strong ecosystem |
| 5 | Build Aquasis integration gateway (REST/gRPC to SOAP bridge) | **HIGH** | Essential for coexistence -- AMI data must sync with existing billing/work order system |
| 6 | Start with MNF-based leak detection, evolve to AI models | **MEDIUM** | MNF provides immediate value; ML models improve with more data over time |
| 7 | Deploy DMA pressure monitoring in parallel with AMI | **MEDIUM** | DMAs multiply the value of smart meter data for leak detection and pressure management |
| 8 | Implement customer-facing consumption portal via AGORA | **MEDIUM** | Increases customer engagement, enables conservation behavior, leverages existing platform |
| 9 | Use ChirpStack as LoRaWAN network server (open-source) | **MEDIUM** | Avoids vendor lock-in for network management; active community; production-proven |
| 10 | Deploy Grafana + Apache Superset for analytics | **LOW** | Grafana for real-time ops, Superset for business analytics -- both open-source |
| 11 | Evaluate satellite-based leak detection (InSAR) for transmission mains | **LOW** | Complementary technology for large-diameter pipes outside the AMI network |
| 12 | Plan acoustic sensor deployment for critical trunk lines | **LOW** | Phase 3 activity; depends on DMA infrastructure being in place |

### Organizational Recommendations

| # | Recommendation | Priority | Rationale |
|---|---|---|---|
| 13 | Establish dedicated AMI program office with cross-functional team | **HIGH** | Smart metering touches IT, operations, customer service, finance -- needs central coordination |
| 14 | Develop workforce transition plan for meter readers (lecturistas) | **HIGH** | Social responsibility and union considerations; 7-year transition window is adequate |
| 15 | Engage CONAGUA early for regulatory alignment | **HIGH** | Proactive engagement avoids compliance surprises; may unlock federal funding |
| 16 | Conduct privacy impact assessment under LGPDPPSO | **MEDIUM** | Smart meter data is personal data; must be addressed before deployment |
| 17 | Partner with Universidad Autonoma de Queretaro (UAQ) for analytics | **LOW** | Local talent pipeline, research collaboration, reduced ML development costs |

---

## 12. Smart Metering Readiness Score

### Assessment Criteria

| Dimension | Score (1-10) | Weight | Weighted Score | Notes |
|---|---|---|---|---|
| **Existing system maturity** | 7 | 15% | 1.05 | Aquasis already has `snTelelectura`, `moduloComunicacion`, `equipo` table |
| **Data model readiness** | 6 | 10% | 0.60 | SOAP APIs support meter management; needs REST/event-driven extension |
| **Network infrastructure** | 5 | 15% | 0.75 | Good cellular coverage; LoRaWAN must be built from scratch |
| **GIS/spatial data** | 4 | 10% | 0.40 | Partial coordinates in Aquasis; needs comprehensive georeferencing |
| **Financial capacity** | 5 | 15% | 0.75 | $70M over 7 years is significant; may require financing/PPP |
| **Regulatory alignment** | 6 | 10% | 0.60 | NOM-012 applies; no AMI-specific regulation (flexibility) |
| **Organizational readiness** | 4 | 10% | 0.40 | Requires new skills (IoT, data science); workforce transition needed |
| **Market readiness (vendor)** | 7 | 5% | 0.35 | Major vendors present in Mexico with LATAM references |
| **Water scarcity urgency** | 9 | 5% | 0.45 | Queretaro faces serious water stress; AMI is increasingly critical |
| **AGORA platform leverage** | 8 | 5% | 0.40 | Existing notification infrastructure (WhatsApp, SMS) can be reused |

### Overall Readiness Score: 5.75 / 10

**Interpretation:** CEA Queretaro has a moderate readiness level for smart metering deployment. The existing Aquasis data model and AGORA notification platform provide a solid foundation, and the urgency of water scarcity creates strong institutional motivation. However, significant investment is needed in network infrastructure, GIS data, organizational capacity, and the IoT/data platform layer. A phased approach starting with a well-scoped pilot is essential.

### Key Readiness Gaps to Address

1. **LoRaWAN network infrastructure** (does not exist today)
2. **IoT/data platform** (no time-series DB, no MQTT broker, no streaming pipeline)
3. **GIS data quality** (incomplete meter georeferencing)
4. **Technical workforce** (IoT engineering, data science skills)
5. **Financial planning** (multi-year capital program, potential PPP structure)

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **AMI** | Advanced Metering Infrastructure -- two-way communication between meters and utility |
| **AMR** | Automated Meter Reading -- one-way data collection (drive-by or walk-by) |
| **CONAGUA** | Comision Nacional del Agua -- Mexico's national water authority |
| **DMA** | District Metered Area -- a defined zone of the distribution network with measured inputs/outputs |
| **EMQX** | Open-source MQTT message broker for IoT |
| **LoRaWAN** | Long Range Wide Area Network -- LPWAN protocol for IoT devices |
| **LPWAN** | Low-Power Wide-Area Network |
| **MNF** | Minimum Night Flow -- the lowest flow in a DMA, typically 2-4 AM |
| **NB-IoT** | Narrowband Internet of Things -- 3GPP cellular IoT standard |
| **NOM** | Norma Oficial Mexicana -- mandatory Mexican national standard |
| **NRW** | Non-Revenue Water -- water produced but not billed to customers |
| **OTA** | Over-The-Air (firmware updates) |
| **PPP** | Public-Private Partnership |
| **QoS** | Quality of Service (MQTT message delivery guarantee) |
| **R800** | ISO 4064 accuracy class with ratio of maximum to minimum flow of 800 |
| **SCADA** | Supervisory Control and Data Acquisition |
| **TOU** | Time-of-Use (tariff structure) |

## Appendix B: Aquasis Data Model Integration Points

Key fields in the existing Aquasis WSDL that support AMI integration:

```
ContadoresDTO (from InterfazGenericaContadoresWS):
  - snTelelectura: string     --> Flag for remote/smart reading (set to "S")
  - moduloComunicacion: string --> LoRaWAN DevEUI or NB-IoT IMEI
  - marca: string              --> e.g., "KAMSTRUP"
  - modelo: string             --> e.g., "FLOWIQ2200"
  - calibre: short             --> Meter size (DN15, DN25, etc.)
  - estadoContador: short      --> Status (extend for AMI states)

Contrato (from InterfazOficinaVirtualClientesWS):
  - sntelelectura: boolean     --> Remote reading enabled
  - moduloComunicacion: string --> Communication module reference

LecturasDTO:
  - origen: string             --> Reading origin (extend: "AMI", "MANUAL", "ESTIMATED")
  - fechaLectura: string       --> Can be daily/hourly with AMI
  - lectura: int               --> Cumulative meter reading
  - consumo: int               --> Calculated consumption

equipo table (from database audit):
  - 21 columns for AMR/AMI equipment tracking
  - Extend for LoRaWAN device metadata (DevEUI, AppKey, join status)
```

## Appendix C: LoRaWAN Gateway Placement Strategy for Queretaro

Queretaro's geography provides natural advantages for LoRaWAN deployment:

| Location Type | Count | Height | Coverage Radius | Notes |
|---|---|---|---|---|
| CEA office buildings | 5 | 15-25m | 3-5 km | Central administration buildings |
| Water tanks/reservoirs (elevated) | 15-20 | 20-40m | 5-8 km | Excellent elevation; power available |
| Pump stations | 20-25 | 10-15m | 2-4 km | Power and connectivity available |
| Telecom tower co-location | 15-20 | 30-50m | 5-10 km | Lease agreements with Telcel/Telmex |
| Municipal buildings | 10-15 | 15-25m | 3-5 km | Government-owned; no lease cost |
| Cerro de las Campanas / high ground | 3-5 | Natural elevation | 8-15 km | Covers large urban areas |
| **Total estimated gateways** | **80-100** | | | **Full urban coverage** |

---

*Report prepared by Agent C7 (research-iot-metering) | Division C*
*Based on domain knowledge of AMI systems, IoT platforms, and water utility operations*
*Note: Web search and web fetch were unavailable during research; report draws on training data knowledge through May 2025. Live vendor pricing and availability should be verified with current RFP responses.*
