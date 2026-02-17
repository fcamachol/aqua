# SUPRA Water 2026 — Complete System Architecture & Implementation Guide

> **Purpose:** This document is the single source of truth for building SUPRA Water 2026, a next-generation AI-first Customer Information System (CIS) for Mexican water utilities. It replaces the legacy AquaCIS system (AGBAR, 2009, 333-page monolith).
>
> **Target:** CEA Querétaro (Comisión Estatal de Aguas) as first deployment, with multi-tenant architecture for replication to other Mexican water utilities.
>
> **Stack:** Node.js/TypeScript backend, PostgreSQL + TimescaleDB, n8n workflow orchestration, Claude AI agents, Docker/GCP deployment, Traefik reverse proxy.

---

## Table of Contents

1. [System Overview & Philosophy](#1-system-overview--philosophy)
2. [Architecture Layers](#2-architecture-layers)
3. [Database Schema](#3-database-schema)
4. [Domain Module Specifications](#4-domain-module-specifications)
5. [AI Agent Definitions](#5-ai-agent-definitions)
6. [API Specifications](#6-api-specifications)
7. [Integration Layer](#7-integration-layer)
8. [Mexican Regulatory Compliance](#8-mexican-regulatory-compliance)
9. [Infrastructure & Deployment](#9-infrastructure--deployment)
10. [Migration Strategy (Strangler Fig)](#10-migration-strategy)
11. [Implementation Phases](#11-implementation-phases)
12. [File & Folder Structure](#12-file--folder-structure)

---

## 1. System Overview & Philosophy

### 1.1 What We're Replacing

AquaCIS is a monolithic Java CIS built in 2005-2009 for Spanish water utility AGBAR. Its functional documentation spans 333 pages covering 10 modules:

| Legacy Module | Pages | Core Problem |
|---|---|---|
| Oficina Técnica | 35-55 | Manual tree structures, no native GIS, paper asset tracking |
| Contratación | 56-79 | Sequential paper processes, no digital signatures, no self-service |
| Gestión de Lecturas | 80-120 | PDA/TPL manual reading, batch lote processing, flat estimation |
| Facturación | 121-152 | Rigid tarifa, batch billing, StreamServe FTP for docs, no CFDI |
| Gestión de Cartera | 153-187 | Office-only cobro, basic remesa bancaria, no digital payments |
| Gestión de Impagados | 188-208 | Linear step-by-step reclamación, no predictive analytics |
| Gestión de Órdenes | 209-216 | Basic lifecycle, no field mobility, paper-based |
| Gestión de Contactos | 217-245 | Manual registry, no omnichannel, office-hours only |
| Interfaces | 246-262 | SOAP web services, FTP file exchange, point-to-point |
| Funcionalidad Varia | 263-312 | Basic SIF fraud, monthly DWH, SQL consultas, Excel exports |

### 1.2 Design Principles

```
PRINCIPLE 1: EVENT-DRIVEN, NOT BATCH
  Every state change emits a domain event.
  No more "run the monthly billing process."
  A meter reading triggers billing immediately.

PRINCIPLE 2: AGENT-FIRST, NOT MENU-DRIVEN
  Users interact through AI agents (voice, chat, web).
  The system acts, the human supervises.
  Menu-driven UIs are for admin/config only.

PRINCIPLE 3: API-FIRST, NOT FILE EXCHANGE
  Every capability is an API endpoint.
  No FTP. No file drops. No batch imports.
  Real-time webhooks replace all polling.

PRINCIPLE 4: MEXICAN-NATIVE
  CFDI 4.0 is not an integration — it's core.
  RFC/CURP validation is built into every person record.
  SPEI/CoDi/OXXO are first-class payment channels.
  Spanish (MX) is the only UI language needed.

PRINCIPLE 5: MULTI-TENANT FROM DAY ONE
  Every table has tenant_id.
  Every query filters by tenant.
  CEA Querétaro is tenant #1, not a special case.
```

### 1.3 Glossary of Mexican Water Utility Terms

| Term | Definition |
|---|---|
| Toma | Service connection point (equivalent to AquaCIS "punto de servicio") |
| Padrón de Usuarios | Registry of all water service subscribers |
| Cuenta | Customer account number |
| Lectura | Meter reading |
| Medidor | Water meter |
| Recibo | Bill/invoice |
| Adeudo | Outstanding debt |
| Convenio de Pago | Payment agreement/plan |
| Corte | Service disconnection for non-payment |
| Reconexión | Service reconnection |
| Toma clandestina | Illegal/unauthorized water connection (fraud) |
| CONAGUA | National Water Commission (federal regulator) |
| CEA | State Water Commission (Comisión Estatal de Aguas) |
| JMAPA/JAPAC | Municipal water utility operators |
| Alcantarillado | Sewer/drainage service |
| Cuota fija | Flat-rate billing (no meter) |
| Tarifa escalonada | Tiered/block rate tariff |

---

## 2. Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CITIZEN LAYER                         │
│  WhatsApp Business API · Web Portal · Voice AI (Twilio) │
│  Mobile App (React Native) · Kiosks · AGORA (Chatwoot)  │
├─────────────────────────────────────────────────────────┤
│                 AI AGENT ORCHESTRATION                   │
│  n8n Workflows · Claude API Agents · Event Bus          │
│  Task Queue (BullMQ) · Agent Registry · Memory Store    │
├─────────────────────────────────────────────────────────┤
│                   DOMAIN SERVICES                        │
│  Contracts · Billing · Meters · Payments · Orders · CRM │
│  Each service: Express router + Drizzle ORM + Events    │
├─────────────────────────────────────────────────────────┤
│                    DATA PLATFORM                         │
│  PostgreSQL 16 · TimescaleDB · Redis · S3-compatible    │
│  Vector DB (pgvector) · Audit Log · Event Store         │
├─────────────────────────────────────────────────────────┤
│                  INTEGRATION LAYER                       │
│  API Gateway (Express) · Event Bus (pg LISTEN/NOTIFY)   │
│  CFDI (Finkok PAC) · SAP/CONTPAQi · GIS · SCADA/IoT    │
├─────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE                         │
│  Docker Compose · GCP (Cloud Run) · Traefik · Grafana   │
│  GitHub Actions CI/CD · Sentry · Prometheus             │
└─────────────────────────────────────────────────────────┘
```

### 2.1 Technology Stack

```yaml
# Runtime
runtime: Node.js 22 LTS (TypeScript 5.x strict mode)
framework: Express.js 5 with async error handling
orm: Drizzle ORM (type-safe, SQL-first)
validation: Zod schemas (shared between API and DB)
queue: BullMQ on Redis
websocket: Socket.io for real-time dashboard updates

# Data
primary_db: PostgreSQL 16 with pgvector extension
timeseries: TimescaleDB (PostgreSQL extension for meter data)
cache: Redis 7 (sessions, queues, rate limiting)
storage: S3-compatible (GCS or MinIO for local dev)
search: PostgreSQL full-text search (pg_trgm)

# AI
llm: Claude API (claude-sonnet-4-20250514 for agents, claude-haiku-4-5-20251001 for classification)
embeddings: pgvector with OpenAI embeddings for semantic search
orchestration: n8n (self-hosted, connected via webhook triggers)

# Communication
whatsapp: WhatsApp Business API (via 360dialog or official Meta API)
voice: Twilio Programmable Voice + Claude for conversation
email: AWS SES or SendGrid
sms: Twilio SMS

# Documents
cfdi: Finkok PAC API for CFDI 4.0 stamping
pdf: Puppeteer for HTML→PDF invoice generation
templates: Handlebars.js for invoice/letter templates

# Infrastructure
containers: Docker Compose (dev) / Cloud Run (prod)
proxy: Traefik v3 with auto-SSL
monitoring: Prometheus + Grafana + Sentry
ci_cd: GitHub Actions
```

---

## 3. Database Schema

### 3.1 Core Tables

```sql
-- =============================================================
-- TENANT & ORGANIZATION
-- =============================================================

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,         -- 'cea-queretaro'
  name VARCHAR(200) NOT NULL,                -- 'CEA Querétaro'
  rfc VARCHAR(13),                           -- RFC de la entidad
  fiscal_name VARCHAR(300),                  -- Razón social
  fiscal_address JSONB,                      -- Domicilio fiscal completo
  config JSONB NOT NULL DEFAULT '{}',        -- Tenant-level configuration
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE explotaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  code VARCHAR(20) NOT NULL,                 -- 'QRO-CENTRO'
  name VARCHAR(200) NOT NULL,                -- 'Zona Centro Querétaro'
  municipality VARCHAR(100),
  state VARCHAR(50) DEFAULT 'Querétaro',
  config JSONB NOT NULL DEFAULT '{}',        -- Explotación-level config
  billing_config JSONB NOT NULL DEFAULT '{}', -- Tariff parameters
  reading_config JSONB NOT NULL DEFAULT '{}', -- Reading schedules
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID REFERENCES explotaciones(id),
  name VARCHAR(200) NOT NULL,
  address JSONB,
  phone VARCHAR(20),
  office_type VARCHAR(20) CHECK (office_type IN ('presencial', 'telefonica', 'virtual')),
  config JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- USERS & AUTH
-- =============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'admin', 'supervisor', 'operador', 'lecturista',
    'cajero', 'atencion_cliente', 'tecnico', 'auditor', 'readonly'
  )),
  permissions JSONB NOT NULL DEFAULT '[]',
  explotacion_ids UUID[] NOT NULL DEFAULT '{}',
  office_ids UUID[] NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- PERSONS (CUSTOMERS / CONTACTS)
-- =============================================================

CREATE TABLE persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Identity
  person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('fisica', 'moral')),
  rfc VARCHAR(13),                           -- RFC with homoclave
  curp VARCHAR(18),                          -- CURP for persona física
  name VARCHAR(200) NOT NULL,                -- Full name or razón social
  first_name VARCHAR(100),
  last_name_paterno VARCHAR(100),
  last_name_materno VARCHAR(100),

  -- Contact
  email VARCHAR(255),
  phone VARCHAR(20),
  phone_secondary VARCHAR(20),
  whatsapp VARCHAR(20),                      -- WhatsApp number if different

  -- Fiscal
  fiscal_regime VARCHAR(3),                  -- SAT regime code (601, 612, 616, etc.)
  fiscal_use VARCHAR(4),                     -- Uso CFDI (G01, G03, P01, etc.)
  fiscal_address JSONB,                      -- Domicilio fiscal for CFDI
  zip_code VARCHAR(5),                       -- CP for CFDI

  -- Flags
  vulnerable BOOLEAN DEFAULT false,          -- Social tariff eligibility
  vulnerability_type VARCHAR(50),            -- 'adulto_mayor', 'discapacidad', 'pobreza'
  digital_access BOOLEAN DEFAULT false,      -- Has web portal access
  preferred_channel VARCHAR(20) DEFAULT 'whatsapp',
  language VARCHAR(5) DEFAULT 'es-MX',

  -- Metadata
  notes TEXT,
  tags VARCHAR(50)[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, rfc)
);

CREATE INDEX idx_persons_tenant ON persons(tenant_id);
CREATE INDEX idx_persons_rfc ON persons(tenant_id, rfc);
CREATE INDEX idx_persons_curp ON persons(tenant_id, curp);
CREATE INDEX idx_persons_name ON persons USING gin(name gin_trgm_ops);
CREATE INDEX idx_persons_phone ON persons(tenant_id, phone);

-- =============================================================
-- ADDRESSES (CALLEJERO)
-- =============================================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID REFERENCES explotaciones(id),

  -- Mexican address structure
  street VARCHAR(200) NOT NULL,
  exterior_number VARCHAR(20),
  interior_number VARCHAR(20),
  colonia VARCHAR(200),
  municipality VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(50) DEFAULT 'Querétaro',
  zip_code VARCHAR(5),
  country VARCHAR(2) DEFAULT 'MX',

  -- Geolocation
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  geom GEOGRAPHY(POINT, 4326),               -- PostGIS point

  -- Normalization
  normalized_text TEXT GENERATED ALWAYS AS (
    LOWER(COALESCE(street, '') || ' ' || COALESCE(exterior_number, '') || ' ' ||
    COALESCE(colonia, '') || ' ' || COALESCE(zip_code, ''))
  ) STORED,

  -- Metadata
  address_type VARCHAR(20) DEFAULT 'callejero'
    CHECK (address_type IN ('callejero', 'correspondencia', 'fiscal', 'libre')),
  validated BOOLEAN DEFAULT false,
  inegi_cve_loc VARCHAR(20),                 -- INEGI locality key
  sepomex_validated BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_addresses_geo ON addresses USING GIST(geom);
CREATE INDEX idx_addresses_normalized ON addresses USING gin(normalized_text gin_trgm_ops);

-- =============================================================
-- INFRASTRUCTURE (ESTRUCTURA TÉCNICA)
-- =============================================================

CREATE TABLE sectores_hidraulicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),
  parent_id UUID REFERENCES sectores_hidraulicos(id),  -- For subsectores
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,          -- 1=sector, 2=subsector
  geom GEOGRAPHY(POLYGON, 4326),             -- Boundary polygon
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, explotacion_id, code)
);

CREATE TABLE acometidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  sector_id UUID NOT NULL REFERENCES sectores_hidraulicos(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  code VARCHAR(30) NOT NULL,
  diameter_mm INTEGER,                       -- Pipe diameter
  material VARCHAR(50),                      -- PVC, HDPE, copper, etc.
  installation_date DATE,
  status VARCHAR(20) DEFAULT 'activa'
    CHECK (status IN ('activa', 'inactiva', 'clausurada')),
  geom GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

-- =============================================================
-- TOMAS (PUNTOS DE SERVICIO)
-- =============================================================

CREATE TABLE tomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),
  acometida_id UUID REFERENCES acometidas(id),
  address_id UUID NOT NULL REFERENCES addresses(id),

  -- Identification
  toma_number VARCHAR(20) NOT NULL,          -- Unique toma ID within tenant
  toma_type VARCHAR(30) NOT NULL CHECK (toma_type IN (
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal'
  )),

  -- Service status
  status VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (status IN (
    'activa', 'cortada', 'suspendida', 'baja', 'clausurada', 'pendiente_alta'
  )),
  cut_date TIMESTAMPTZ,
  cut_reason VARCHAR(50),

  -- Meter info
  has_meter BOOLEAN DEFAULT true,
  meter_id UUID,                             -- Current meter (FK added after meters table)

  -- Billing
  billing_type VARCHAR(20) DEFAULT 'medido'
    CHECK (billing_type IN ('medido', 'cuota_fija', 'estimado')),
  tariff_category VARCHAR(30),               -- Links to tariff schedule
  billing_period VARCHAR(10) DEFAULT 'mensual'
    CHECK (billing_period IN ('mensual', 'bimestral', 'trimestral')),

  -- GIS
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  geom GEOGRAPHY(POINT, 4326),

  -- Metadata
  inhabitants INTEGER,
  property_type VARCHAR(30),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, toma_number)
);

CREATE INDEX idx_tomas_tenant_status ON tomas(tenant_id, status);
CREATE INDEX idx_tomas_explotacion ON tomas(tenant_id, explotacion_id);
CREATE INDEX idx_tomas_geo ON tomas USING GIST(geom);

-- =============================================================
-- METERS (MEDIDORES)
-- =============================================================

CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  toma_id UUID REFERENCES tomas(id),

  serial_number VARCHAR(50) NOT NULL,
  brand VARCHAR(50),
  model VARCHAR(50),
  diameter_inches DECIMAL(4, 2),             -- 1/2", 3/4", 1", etc.
  meter_type VARCHAR(30) CHECK (meter_type IN (
    'volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart'
  )),

  -- Smart meter fields
  is_smart BOOLEAN DEFAULT false,
  communication_protocol VARCHAR(20),        -- 'lorawan', 'nbiot', 'sigfox', 'wifi'
  device_eui VARCHAR(50),                    -- LoRaWAN DevEUI
  last_communication TIMESTAMPTZ,

  -- Lifecycle
  installation_date DATE,
  last_calibration_date DATE,
  expected_replacement_date DATE,
  status VARCHAR(20) DEFAULT 'activo'
    CHECK (status IN ('activo', 'inactivo', 'averiado', 'retirado', 'en_almacen')),
  initial_reading DECIMAL(12, 3) DEFAULT 0,

  -- Metadata
  location_description VARCHAR(200),         -- 'Interior, sótano', 'Banqueta'
  accessible BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, serial_number)
);

ALTER TABLE tomas ADD CONSTRAINT fk_tomas_meter
  FOREIGN KEY (meter_id) REFERENCES meters(id);

-- =============================================================
-- CONTRACTS (CONTRATOS)
-- =============================================================

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),

  -- Parties
  contract_number VARCHAR(30) NOT NULL,
  person_id UUID NOT NULL REFERENCES persons(id),        -- Titular
  toma_id UUID NOT NULL REFERENCES tomas(id),

  -- Lifecycle
  status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN (
    'pendiente', 'activo', 'suspendido', 'baja', 'cancelado'
  )),
  start_date DATE NOT NULL,
  end_date DATE,
  termination_reason VARCHAR(50),

  -- Billing preferences
  billing_address_id UUID REFERENCES addresses(id),      -- Dirección de correspondencia
  payment_method VARCHAR(30) DEFAULT 'ventanilla'
    CHECK (payment_method IN (
      'ventanilla', 'domiciliacion', 'digital', 'oxxo', 'gestor_cobro'
    )),
  bank_account JSONB,                        -- CLABE, bank name for domiciliación
  digital_invoice BOOLEAN DEFAULT false,     -- Receive CFDI by email

  -- Tariff
  tariff_category VARCHAR(30) NOT NULL,
  social_tariff BOOLEAN DEFAULT false,
  special_conditions JSONB,                  -- Custom pricing overrides

  -- Communication
  preferred_contact_method VARCHAR(20) DEFAULT 'whatsapp',
  notification_channels VARCHAR(20)[] DEFAULT '{whatsapp}',

  -- Metadata
  previous_contract_id UUID REFERENCES contracts(id),    -- For subrogación/cambio titular
  documents JSONB DEFAULT '[]',              -- Required documents checklist
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, contract_number)
);

CREATE INDEX idx_contracts_person ON contracts(tenant_id, person_id);
CREATE INDEX idx_contracts_toma ON contracts(tenant_id, toma_id);
CREATE INDEX idx_contracts_status ON contracts(tenant_id, status);

-- =============================================================
-- METER READINGS (LECTURAS) — TimescaleDB Hypertable
-- =============================================================

CREATE TABLE meter_readings (
  id UUID DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  meter_id UUID NOT NULL REFERENCES meters(id),
  toma_id UUID NOT NULL REFERENCES tomas(id),
  contract_id UUID REFERENCES contracts(id),

  -- Reading data
  reading_value DECIMAL(12, 3) NOT NULL,
  previous_reading DECIMAL(12, 3),
  consumption DECIMAL(12, 3),                -- Calculated: reading - previous
  reading_date TIMESTAMPTZ NOT NULL,
  period_start DATE,
  period_end DATE,

  -- Source
  source VARCHAR(20) NOT NULL CHECK (source IN (
    'smart_meter', 'manual_field', 'manual_office', 'autolectura',
    'telelectura', 'estimated', 'photo', 'api'
  )),
  reader_user_id UUID,
  device_id VARCHAR(50),                     -- Smart meter device ID

  -- Quality
  status VARCHAR(20) DEFAULT 'valid' CHECK (status IN (
    'valid', 'suspicious', 'estimated', 'rejected', 'corrected'
  )),
  anomaly_type VARCHAR(30),                  -- 'high_consumption', 'zero', 'negative', 'meter_stopped'
  anomaly_score DECIMAL(5, 3),               -- ML confidence 0-1
  observations TEXT,

  -- Photo evidence (for field readers)
  photo_url VARCHAR(500),
  gps_latitude DECIMAL(10, 7),
  gps_longitude DECIMAL(10, 7),

  created_at TIMESTAMPTZ DEFAULT now(),

  PRIMARY KEY (id, reading_date)             -- Required for TimescaleDB
);

-- Convert to TimescaleDB hypertable for time-series optimization
SELECT create_hypertable('meter_readings', 'reading_date',
  chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_readings_meter ON meter_readings(tenant_id, meter_id, reading_date DESC);
CREATE INDEX idx_readings_toma ON meter_readings(tenant_id, toma_id, reading_date DESC);

-- =============================================================
-- INVOICES (FACTURAS / RECIBOS)
-- =============================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  person_id UUID NOT NULL REFERENCES persons(id),
  toma_id UUID NOT NULL REFERENCES tomas(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),

  -- Invoice identification
  invoice_number VARCHAR(30),                -- Internal sequential number
  folio_fiscal UUID,                         -- CFDI UUID from SAT
  serie VARCHAR(10),

  -- Type & origin
  invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN (
    'periodica', 'manual', 'abono', 'nota_credito', 'refactura'
  )),
  origin VARCHAR(20) NOT NULL CHECK (origin IN (
    'lecturas', 'contratacion', 'varios', 'fraude', 'reconexion'
  )),

  -- Billing period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,

  -- Amounts
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  iva_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'MXN',

  -- Consumption data (for periodic invoices)
  reading_id UUID,
  consumption_m3 DECIMAL(10, 3),
  previous_reading DECIMAL(12, 3),
  current_reading DECIMAL(12, 3),

  -- Status lifecycle
  status VARCHAR(20) NOT NULL DEFAULT 'provisional' CHECK (status IN (
    'provisional', 'pendiente', 'bloqueada', 'cobrada',
    'impagada', 'abonada', 'parcial', 'descargada', 'amortizada'
  )),

  -- CFDI fields
  cfdi_status VARCHAR(20) CHECK (cfdi_status IN (
    'pending', 'stamped', 'cancelled', 'error'
  )),
  cfdi_xml TEXT,                             -- Full CFDI XML
  cfdi_pdf_url VARCHAR(500),
  cfdi_stamp_date TIMESTAMPTZ,
  cfdi_cancellation_date TIMESTAMPTZ,
  pac_response JSONB,                        -- PAC response data

  -- Payment reference
  payment_reference VARCHAR(30),             -- Barcode/QR reference for OXXO, bank
  spei_reference VARCHAR(20),                -- CLABE reference for SPEI

  -- Links
  related_invoice_id UUID REFERENCES invoices(id), -- For abonos/refacturas
  reading_id_fk UUID REFERENCES meter_readings(id) DEFERRABLE,

  -- Delivery
  delivered BOOLEAN DEFAULT false,
  delivery_channel VARCHAR(20),              -- 'whatsapp', 'email', 'print', 'portal'
  delivered_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_contract ON invoices(tenant_id, contract_id);
CREATE INDEX idx_invoices_person ON invoices(tenant_id, person_id);
CREATE INDEX idx_invoices_status ON invoices(tenant_id, status);
CREATE INDEX idx_invoices_due ON invoices(tenant_id, due_date) WHERE status IN ('pendiente', 'impagada');
CREATE INDEX idx_invoices_cfdi ON invoices(folio_fiscal) WHERE folio_fiscal IS NOT NULL;

-- =============================================================
-- INVOICE LINE ITEMS (CONCEPTOS)
-- =============================================================

CREATE TABLE invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,

  -- Concept identification
  concept_code VARCHAR(20) NOT NULL,         -- 'agua', 'alcantarillado', 'saneamiento', 'reconexion'
  concept_name VARCHAR(200) NOT NULL,
  subconcept_code VARCHAR(20),
  subconcept_name VARCHAR(200),

  -- Owner (for multi-owner invoices like AquaCIS)
  owner_entity VARCHAR(50),                  -- 'cea', 'municipio', 'conagua'

  -- Amounts
  quantity DECIMAL(12, 3) DEFAULT 1,
  unit_price DECIMAL(12, 4) DEFAULT 0,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  iva_rate DECIMAL(5, 4) DEFAULT 0,          -- 0.16 for 16% IVA, 0 for exempt
  iva_amount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,

  -- Tariff calculation detail
  tariff_detail JSONB,                       -- Full calculation breakdown (blocks, rates, etc.)

  -- SAT catalog codes (for CFDI)
  clave_prod_serv VARCHAR(10),               -- SAT product/service key
  clave_unidad VARCHAR(5),                   -- SAT unit key

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- TARIFF STRUCTURE (ESTRUCTURA TARIFARIA)
-- =============================================================

CREATE TABLE tariff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID REFERENCES explotaciones(id),

  name VARCHAR(200) NOT NULL,
  category VARCHAR(30) NOT NULL,             -- 'domestica', 'comercial', etc.
  effective_from DATE NOT NULL,
  effective_until DATE,
  active BOOLEAN DEFAULT true,

  -- Structure
  billing_period VARCHAR(10) NOT NULL,       -- 'mensual', 'bimestral'
  blocks JSONB NOT NULL,                     -- Consumption blocks definition
  -- Example blocks:
  -- [
  --   {"from_m3": 0, "to_m3": 10, "price_per_m3": 5.50, "fixed_charge": 45.00},
  --   {"from_m3": 10, "to_m3": 20, "price_per_m3": 8.75, "fixed_charge": 0},
  --   {"from_m3": 20, "to_m3": 40, "price_per_m3": 15.30, "fixed_charge": 0},
  --   {"from_m3": 40, "to_m3": null, "price_per_m3": 25.00, "fixed_charge": 0}
  -- ]

  additional_concepts JSONB DEFAULT '[]',    -- Alcantarillado, saneamiento, etc.
  -- Example:
  -- [
  --   {"code": "alcantarillado", "name": "Alcantarillado", "type": "percentage", "value": 0.25, "base": "agua"},
  --   {"code": "saneamiento", "name": "Saneamiento", "type": "fixed", "value": 15.00}
  -- ]

  iva_applicable BOOLEAN DEFAULT false,
  social_discount_pct DECIMAL(5, 2),         -- Discount % for social tariff

  approved_by VARCHAR(200),
  approval_date DATE,
  gazette_reference VARCHAR(100),            -- Periódico Oficial reference

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- PAYMENTS (PAGOS)
-- =============================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- What is being paid
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  person_id UUID NOT NULL REFERENCES persons(id),

  -- Payment details
  amount DECIMAL(12, 2) NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL,
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN (
    'efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia_spei',
    'codi', 'oxxo', 'domiciliacion', 'cheque', 'gestor_cobro', 'portal_web'
  )),

  -- Transaction details
  transaction_reference VARCHAR(100),
  authorization_code VARCHAR(50),
  bank_name VARCHAR(100),
  terminal_id VARCHAR(50),

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'applied' CHECK (status IN (
    'pending', 'applied', 'reversed', 'bounced', 'cancelled'
  )),
  reversal_date TIMESTAMPTZ,
  reversal_reason VARCHAR(200),

  -- Reconciliation
  reconciled BOOLEAN DEFAULT false,
  reconciliation_date DATE,
  batch_id VARCHAR(50),                      -- For remesa/batch payments

  -- Receipt
  receipt_number VARCHAR(30),
  receipt_url VARCHAR(500),

  -- Source
  channel VARCHAR(20) NOT NULL CHECK (channel IN (
    'ventanilla', 'banco', 'portal', 'whatsapp', 'oxxo',
    'kiosko', 'domiciliacion', 'api'
  )),
  cashier_user_id UUID REFERENCES users(id),
  office_id UUID REFERENCES offices(id),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(tenant_id, invoice_id);
CREATE INDEX idx_payments_contract ON payments(tenant_id, contract_id);
CREATE INDEX idx_payments_date ON payments(tenant_id, payment_date);

-- =============================================================
-- PAYMENT PLANS (CONVENIOS DE PAGO)
-- =============================================================

CREATE TABLE payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  person_id UUID NOT NULL REFERENCES persons(id),

  total_debt DECIMAL(12, 2) NOT NULL,
  down_payment DECIMAL(12, 2) DEFAULT 0,
  remaining_balance DECIMAL(12, 2) NOT NULL,
  number_of_installments INTEGER NOT NULL,
  interest_rate DECIMAL(5, 4) DEFAULT 0,     -- Monthly rate
  installment_amount DECIMAL(12, 2) NOT NULL,

  status VARCHAR(20) DEFAULT 'activo' CHECK (status IN (
    'activo', 'completado', 'incumplido', 'cancelado'
  )),

  start_date DATE NOT NULL,
  next_payment_date DATE,
  agreement_document_url VARCHAR(500),

  invoice_ids UUID[] NOT NULL,               -- Invoices covered by this plan
  installments JSONB NOT NULL,               -- Scheduled installments detail
  -- Example: [{"number": 1, "due_date": "2026-03-15", "amount": 450.00, "paid": true, "payment_id": "uuid"}]

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- DELINQUENCY MANAGEMENT (GESTIÓN DE IMPAGADOS)
-- =============================================================

CREATE TABLE delinquency_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  person_id UUID NOT NULL REFERENCES persons(id),

  total_debt DECIMAL(12, 2) NOT NULL,
  oldest_unpaid_date DATE NOT NULL,
  invoice_count INTEGER NOT NULL,

  -- Procedure tracking
  procedure_type VARCHAR(30) NOT NULL,       -- 'standard', 'commercial', 'government'
  current_step INTEGER DEFAULT 0,
  current_step_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'activo' CHECK (status IN (
    'activo', 'pausado', 'resuelto', 'cerrado', 'judicial'
  )),

  -- Steps executed
  steps_history JSONB DEFAULT '[]',
  -- Example: [
  --   {"step": 1, "action": "sms_reminder", "date": "2026-01-15", "result": "delivered"},
  --   {"step": 2, "action": "whatsapp_warning", "date": "2026-01-22", "result": "read"},
  --   {"step": 3, "action": "corte_order", "date": "2026-02-01", "result": "executed"}
  -- ]

  next_step_date DATE,
  vulnerability_flag BOOLEAN DEFAULT false,
  vulnerability_reason VARCHAR(200),

  -- Resolution
  resolved_date TIMESTAMPTZ,
  resolution_type VARCHAR(30),               -- 'paid', 'plan', 'pardoned', 'judicial', 'write_off'

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================
-- WORK ORDERS (ÓRDENES DE SERVICIO)
-- =============================================================

CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),

  order_number VARCHAR(20) NOT NULL,
  order_type VARCHAR(30) NOT NULL CHECK (order_type IN (
    'instalacion_medidor', 'cambio_medidor', 'reparacion',
    'corte', 'reconexion', 'inspeccion', 'lectura_especial',
    'verificacion_fraude', 'mantenimiento', 'nueva_toma'
  )),

  -- Related entities
  contract_id UUID REFERENCES contracts(id),
  toma_id UUID REFERENCES tomas(id),
  meter_id UUID REFERENCES meters(id),
  address_id UUID REFERENCES addresses(id),
  delinquency_id UUID REFERENCES delinquency_procedures(id),

  -- Assignment
  assigned_to UUID REFERENCES users(id),
  team VARCHAR(50),
  priority VARCHAR(10) DEFAULT 'normal'
    CHECK (priority IN ('urgente', 'alta', 'normal', 'baja')),

  -- Scheduling
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  estimated_duration_minutes INTEGER,

  -- Status
  status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN (
    'pendiente', 'asignada', 'en_ruta', 'en_progreso',
    'completada', 'cancelada', 'reprogramada', 'fallida'
  )),

  -- Execution
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result TEXT,
  result_code VARCHAR(20),

  -- Field data
  field_notes TEXT,
  photos JSONB DEFAULT '[]',                 -- [{url, description, taken_at}]
  gps_arrival JSONB,                         -- {lat, lng, timestamp}
  gps_departure JSONB,
  technician_signature_url VARCHAR(500),
  customer_signature_url VARCHAR(500),

  -- Materials used
  materials JSONB DEFAULT '[]',              -- [{item, quantity, unit_cost}]

  -- Metadata
  source VARCHAR(20) DEFAULT 'system',       -- 'system', 'manual', 'api', 'chatbot'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, order_number)
);

CREATE INDEX idx_orders_assigned ON work_orders(tenant_id, assigned_to, status);
CREATE INDEX idx_orders_scheduled ON work_orders(tenant_id, scheduled_date, status);

-- =============================================================
-- CONTACTS & COMPLAINTS (CONTACTOS Y QUEJAS)
-- =============================================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Who
  person_id UUID REFERENCES persons(id),
  contract_id UUID REFERENCES contracts(id),
  toma_id UUID REFERENCES tomas(id),

  -- What
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN (
    'consulta', 'queja', 'solicitud', 'reporte_fuga',
    'felicitacion', 'sugerencia', 'reclamo', 'informacion'
  )),
  category VARCHAR(50),                      -- 'facturacion', 'servicio', 'medidor', etc.
  subcategory VARCHAR(50),
  subject VARCHAR(300),
  description TEXT,

  -- Channel
  channel VARCHAR(20) NOT NULL CHECK (channel IN (
    'whatsapp', 'telefono', 'email', 'presencial',
    'portal_web', 'redes_sociales', 'chatbot', 'voice_ai'
  )),
  channel_conversation_id VARCHAR(200),      -- External conversation ID

  -- Assignment & Resolution
  assigned_to UUID REFERENCES users(id),
  department VARCHAR(50),
  priority VARCHAR(10) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'abierto' CHECK (status IN (
    'abierto', 'en_proceso', 'pendiente_cliente', 'resuelto',
    'cerrado', 'escalado', 'transferido'
  )),
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolution_satisfaction INTEGER CHECK (resolution_satisfaction BETWEEN 1 AND 5),

  -- AI processing
  ai_classification JSONB,                   -- {category, confidence, suggested_action}
  ai_auto_resolved BOOLEAN DEFAULT false,
  sentiment_score DECIMAL(3, 2),             -- -1 to 1

  -- SLA
  sla_due_at TIMESTAMPTZ,
  sla_breached BOOLEAN DEFAULT false,

  -- Linked work orders
  work_order_ids UUID[] DEFAULT '{}',

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contacts_person ON contacts(tenant_id, person_id);
CREATE INDEX idx_contacts_status ON contacts(tenant_id, status, created_at DESC);

-- =============================================================
-- FRAUD CASES (EXPEDIENTES SIF)
-- =============================================================

CREATE TABLE fraud_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  case_number VARCHAR(20) NOT NULL,
  contract_id UUID REFERENCES contracts(id),
  toma_id UUID REFERENCES tomas(id),
  address_id UUID NOT NULL REFERENCES addresses(id),

  -- Detection
  detection_source VARCHAR(30) NOT NULL CHECK (detection_source IN (
    'ai_anomaly', 'manual_report', 'field_inspection', 'meter_data',
    'neighbor_report', 'audit', 'gis_analysis'
  )),
  detection_date DATE NOT NULL,
  anomaly_data JSONB,                        -- ML model output data

  -- Case management
  status VARCHAR(20) DEFAULT 'abierto' CHECK (status IN (
    'abierto', 'en_inspeccion', 'confirmado', 'no_confirmado',
    'en_proceso_legal', 'resuelto', 'cerrado'
  )),
  fraud_type VARCHAR(30),                    -- 'toma_clandestina', 'medidor_alterado', 'bypass'
  estimated_volume_m3 DECIMAL(12, 3),
  estimated_value DECIMAL(12, 2),

  -- Inspections
  inspections JSONB DEFAULT '[]',
  -- [{date, inspector_id, findings, photos[], result}]

  -- Resolution
  resolution_type VARCHAR(30),               -- 'regularization', 'legal', 'closed_no_fraud'
  resolution_date DATE,
  invoice_id UUID REFERENCES invoices(id),   -- Fraud billing invoice
  legal_case_reference VARCHAR(50),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(tenant_id, case_number)
);

-- =============================================================
-- EVENT STORE (AUDIT + EVENT SOURCING)
-- =============================================================

CREATE TABLE domain_events (
  id UUID DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,          -- 'contract.created', 'invoice.generated', etc.
  aggregate_type VARCHAR(50) NOT NULL,       -- 'contract', 'invoice', 'payment', etc.
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',               -- {user_id, ip, source, correlation_id}
  created_at TIMESTAMPTZ DEFAULT now(),

  PRIMARY KEY (id, created_at)
);

SELECT create_hypertable('domain_events', 'created_at',
  chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_events_aggregate ON domain_events(aggregate_type, aggregate_id, created_at DESC);
CREATE INDEX idx_events_type ON domain_events(event_type, created_at DESC);

-- =============================================================
-- COMMUNICATION LOG
-- =============================================================

CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  person_id UUID REFERENCES persons(id),
  contract_id UUID REFERENCES contracts(id),

  channel VARCHAR(20) NOT NULL,              -- 'whatsapp', 'sms', 'email', 'voice', 'letter'
  direction VARCHAR(10) NOT NULL,            -- 'inbound', 'outbound'
  comm_type VARCHAR(30),                     -- 'invoice_delivery', 'payment_reminder', etc.

  -- Content
  subject VARCHAR(300),
  body TEXT,
  template_id VARCHAR(50),

  -- Status
  status VARCHAR(20) DEFAULT 'sent',         -- 'sent', 'delivered', 'read', 'failed', 'bounced'
  external_id VARCHAR(200),                  -- WhatsApp/SMS message ID
  error_message TEXT,

  -- Response tracking
  response_received BOOLEAN DEFAULT false,
  response_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 Key Database Extensions & Configuration

```sql
-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis";         -- Geospatial
CREATE EXTENSION IF NOT EXISTS "vector";          -- pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS "timescaledb";     -- Time-series

-- Row Level Security for multi-tenancy
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON contracts
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
-- Repeat for ALL tables with tenant_id
```

---

## 4. Domain Module Specifications

### 4.1 Contratación (Contract Lifecycle)

```typescript
// Contract lifecycle events
type ContractEvent =
  | { type: 'contract.requested'; data: ContractRequest }
  | { type: 'contract.documents_pending'; data: { missing: string[] } }
  | { type: 'contract.approved'; data: { approved_by: string } }
  | { type: 'contract.activated'; data: { contract_number: string } }
  | { type: 'contract.titular_changed'; data: { old_person_id: string; new_person_id: string } }
  | { type: 'contract.subrogated'; data: { new_person_id: string; reason: string } }
  | { type: 'contract.suspended'; data: { reason: string } }
  | { type: 'contract.terminated'; data: { reason: string; final_reading: number } }

// Alta de contrato (new contract)
async function createContract(input: {
  tenant_id: string;
  toma_id: string;
  person_id: string;
  tariff_category: string;
  billing_period: string;
  payment_method: string;
  documents: { type: string; url: string; verified: boolean }[];
}): Promise<Contract> {
  // 1. Validate toma exists and has no active contract
  // 2. Validate person RFC/CURP
  // 3. Assign contract number (sequential per explotación)
  // 4. Create contract record
  // 5. Update toma status to 'activa'
  // 6. Emit 'contract.created' event
  // 7. Trigger work order for meter installation if needed
  // 8. Send welcome WhatsApp message
  // 9. Generate initial invoice if deposit required
}

// Baja de contrato (termination)
async function terminateContract(input: {
  contract_id: string;
  reason: string;
  final_reading?: number;
}): Promise<void> {
  // 1. Take final meter reading
  // 2. Generate final invoice (liquidación)
  // 3. If debt exists, handle via payment plan or delinquency
  // 4. Generate work order for meter removal
  // 5. Update toma status to 'baja'
  // 6. Emit 'contract.terminated' event
}

// Cambio de titular
async function changeTitular(input: {
  contract_id: string;
  new_person_id: string;
  transfer_debt: boolean;
}): Promise<{ old_contract: Contract; new_contract: Contract }> {
  // 1. Terminate old contract (baja)
  // 2. Create new contract with new titular (alta)
  // 3. If transfer_debt: move unpaid invoices to new contract
  // 4. Maintain toma and meter — only person changes
  // 5. Emit 'contract.titular_changed' event
}
```

### 4.2 Gestión de Lecturas (Meter Reading)

```typescript
// Smart meter ingestion pipeline
async function ingestSmartMeterReading(payload: {
  device_eui: string;
  reading_value: number;
  timestamp: string;
  battery_level?: number;
  signal_strength?: number;
}): Promise<MeterReading> {
  // 1. Lookup meter by device_eui
  // 2. Get previous reading
  // 3. Calculate consumption
  // 4. Run anomaly detection (ML model)
  //    - Compare with historical average (±3σ)
  //    - Compare with neighbors in same sector
  //    - Check for zero/negative/impossibly high readings
  //    - Check meter age and calibration status
  // 5. If anomaly detected:
  //    a. Flag reading as 'suspicious'
  //    b. If high confidence: auto-create fraud case
  //    c. If medium confidence: create work order for verification
  //    d. If low confidence: log and use reading
  // 6. Store reading in TimescaleDB
  // 7. Emit 'reading.received' event
  // 8. If billing trigger conditions met → emit 'reading.billing_ready'
}

// Manual field reading with photo
async function submitFieldReading(input: {
  meter_id: string;
  reading_value: number;
  photo_base64: string;
  gps: { lat: number; lng: number };
  observations?: string;
  reader_user_id: string;
}): Promise<MeterReading> {
  // 1. Validate reading against previous (sanity check)
  // 2. Upload photo to S3
  // 3. OCR photo to verify reading matches value entered
  // 4. Store reading
  // 5. Update route progress
  // 6. Emit event
}

// Consumption estimation (when no reading available)
async function estimateConsumption(input: {
  toma_id: string;
  period_start: Date;
  period_end: Date;
}): Promise<MeterReading> {
  // Estimation methods (in priority order):
  // 1. ML model using: historical consumption, weather, seasonality, neighbor data
  // 2. Average of last 6 valid readings for same period (seasonal)
  // 3. Average of last 3 valid readings
  // 4. Sector average for same toma_type
  // 5. Minimum consumption for tariff category (fallback)
}
```

### 4.3 Facturación (Billing Engine)

```typescript
// Event-driven billing: triggered by reading.billing_ready event
async function generateInvoice(input: {
  contract_id: string;
  reading_id: string;
  period_start: Date;
  period_end: Date;
}): Promise<Invoice> {
  // 1. Load contract, toma, person, tariff schedule
  // 2. Get consumption from reading
  // 3. Calculate line items:

  const lines = [];

  // a. Water consumption (tarifa escalonada)
  const waterCharge = calculateBlockTariff(consumption, tariff.blocks);
  lines.push({ concept: 'agua', ...waterCharge });

  // b. Alcantarillado (typically % of water charge)
  if (tariff.additional_concepts.find(c => c.code === 'alcantarillado')) {
    lines.push(calculateAlcantarillado(waterCharge, tariff));
  }

  // c. Saneamiento
  // d. Cuota fija (if applicable)
  // e. Special charges (reconexion surcharge, etc.)
  // f. Social tariff discount (if eligible)
  // g. Regularization adjustments (bonificaciones/recargos)

  // 4. Calculate totals (subtotal, IVA where applicable, total)
  // 5. Generate payment references (OXXO barcode, SPEI CLABE reference)
  // 6. Create invoice record with status 'provisional'
  // 7. Emit 'invoice.generated' event

  // 8. If auto-approve enabled:
  //    a. Stamp CFDI via Finkok PAC
  //    b. Generate PDF from HTML template
  //    c. Update status to 'pendiente'
  //    d. Deliver via preferred channel (WhatsApp/email)
  //    e. Emit 'invoice.stamped' event
}

// Block tariff calculation (tarifa escalonada)
function calculateBlockTariff(
  consumption_m3: number,
  blocks: TariffBlock[]
): { quantity: number; unit_price: number; subtotal: number; detail: object } {
  let total = 0;
  const detail = [];

  for (const block of blocks) {
    const blockMax = block.to_m3 ?? Infinity;
    const blockConsumption = Math.min(
      Math.max(consumption_m3 - block.from_m3, 0),
      blockMax - block.from_m3
    );

    if (blockConsumption > 0) {
      const blockCharge = (block.fixed_charge || 0) + (blockConsumption * block.price_per_m3);
      total += blockCharge;
      detail.push({
        from: block.from_m3,
        to: block.to_m3,
        m3: blockConsumption,
        rate: block.price_per_m3,
        fixed: block.fixed_charge || 0,
        charge: blockCharge,
      });
    }
  }

  return { quantity: consumption_m3, unit_price: total / consumption_m3, subtotal: total, detail };
}
```

### 4.4 Gestión de Cartera (Payment Processing)

```typescript
// Payment channels configuration
const PAYMENT_CHANNELS = {
  ventanilla: { requires: 'cashier_user_id', generates_receipt: true },
  spei: { requires: 'clabe_reference', reconciliation: 'auto' },
  codi: { requires: 'qr_code', reconciliation: 'auto' },
  oxxo: { requires: 'barcode_reference', reconciliation: 'batch_daily' },
  tarjeta: { requires: 'terminal_id', gateway: 'conekta_or_stripe' },
  domiciliacion: { requires: 'clabe_account', schedule: 'monthly' },
  portal_web: { requires: 'session', gateway: 'conekta_or_stripe' },
  whatsapp_pay: { requires: 'wa_payment_id', reconciliation: 'auto' },
};

async function processPayment(input: {
  invoice_id: string;
  amount: number;
  payment_method: string;
  channel: string;
  transaction_data: Record<string, any>;
}): Promise<Payment> {
  // 1. Validate invoice exists and amount is correct
  // 2. Process payment through appropriate gateway
  // 3. Create payment record
  // 4. Update invoice status:
  //    - If amount >= total → 'cobrada'
  //    - If amount < total → 'parcial'
  // 5. Check if person has delinquency procedure:
  //    - If all debt paid → resolve procedure
  //    - If partial → update procedure debt amount
  // 6. Generate receipt (PDF)
  // 7. Send receipt via preferred channel
  // 8. Emit 'payment.received' event
  // 9. If CFDI complemento de pago needed → stamp
}
```

---

## 5. AI Agent Definitions

### 5.1 Agent Architecture

```typescript
// Base agent interface — all agents implement this
interface SUPRAAgent {
  name: string;
  description: string;
  triggers: AgentTrigger[];           // Events or conditions that activate this agent
  tools: AgentTool[];                 // Functions the agent can call
  systemPrompt: string;              // Claude system prompt
  model: 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001';
  maxTokens: number;
  temperature: number;
}

// Agent trigger types
type AgentTrigger =
  | { type: 'event'; eventType: string }            // Domain event
  | { type: 'schedule'; cron: string }               // Scheduled
  | { type: 'webhook'; path: string }                // HTTP webhook
  | { type: 'whatsapp'; pattern?: RegExp }           // WhatsApp message
  | { type: 'voice'; intent?: string }               // Voice call
  | { type: 'manual'; ui_button: string }            // User-triggered

// n8n workflow integration
interface N8NWorkflow {
  name: string;
  trigger: AgentTrigger;
  steps: N8NStep[];
}
```

### 5.2 Agent Catalog

```yaml
# ============================================================
# AGENT: Voice AI (CEA Call Center)
# ============================================================
agent: voice_ai
description: |
  Handles inbound phone calls to CEA Querétaro.
  Powered by Twilio + Claude. Speaks natural Mexican Spanish.
  Can look up accounts, provide balances, take payments,
  report leaks/issues, and transfer to human agents.

model: claude-sonnet-4-20250514
triggers:
  - type: webhook
    path: /api/v1/voice/incoming

system_prompt: |
  Eres el asistente telefónico de CEA Querétaro (Comisión Estatal de Aguas).
  Hablas español mexicano natural y profesional.
  Tu objetivo es resolver la llamada del ciudadano sin transferir a un humano.

  PUEDES:
  - Consultar saldo y adeudos con el número de cuenta o dirección
  - Informar fechas de corte y reconexión
  - Registrar reportes de fugas con ubicación
  - Tomar datos para convenios de pago
  - Proporcionar información sobre tarifas y servicios
  - Transferir a un agente humano si no puedes resolver

  NUNCA:
  - Inventar información sobre saldos o estados de cuenta
  - Prometer descuentos o condonaciones sin autorización
  - Proporcionar datos personales de otros usuarios
  - Dar información técnica sobre la red de distribución

  Siempre confirma la identidad del llamante antes de dar información de cuenta.
  Pide nombre completo y número de cuenta o dirección de la toma.

tools:
  - lookup_account_by_number    # Buscar cuenta por número
  - lookup_account_by_address   # Buscar cuenta por dirección
  - get_account_balance         # Obtener saldo/adeudo
  - get_payment_history         # Historial de pagos
  - get_consumption_history     # Historial de consumos
  - report_leak                 # Reportar fuga
  - create_contact              # Registrar contacto/queja
  - create_work_order           # Crear orden de servicio
  - transfer_to_human           # Transferir a agente humano
  - get_tariff_info             # Información de tarifas

# ============================================================
# AGENT: WhatsApp Customer Service
# ============================================================
agent: whatsapp_cx
description: |
  Handles WhatsApp messages from citizens.
  Integrated with AGORA (Chatwoot) for conversation management.
  Can resolve ~60% of queries without human intervention.

model: claude-sonnet-4-20250514
triggers:
  - type: whatsapp
  - type: event
    eventType: agora.message.received

system_prompt: |
  Eres el asistente de WhatsApp de CEA Querétaro.
  Respondes mensajes de ciudadanos sobre su servicio de agua.

  FLUJO PRINCIPAL:
  1. Saluda y pregunta en qué puedes ayudar
  2. Identifica al usuario (pide número de cuenta)
  3. Consulta su información en el sistema
  4. Resuelve o escala según el caso

  PUEDES RESOLVER DIRECTAMENTE:
  - Consulta de saldo → enviar resumen con botón de pago
  - Estado de recibo → enviar PDF del último recibo
  - Historial de consumo → gráfica de últimos 12 meses
  - Reporte de fuga → crear orden de servicio + dar folio
  - Horarios de oficina → información general
  - Requisitos para trámites → lista de documentos

  DEBES ESCALAR A HUMANO:
  - Solicitudes de condonación o descuento
  - Quejas sobre calidad del agua
  - Disputas de facturación complejas
  - Solicitudes de alta/baja de contrato
  - Temas legales

  FORMATO:
  - Usa emojis moderadamente (💧✅📋)
  - Mensajes cortos y claros
  - Ofrece opciones numeradas cuando hay múltiples paths
  - Siempre termina preguntando si necesita algo más

tools:
  - lookup_account
  - get_balance
  - get_last_invoice_pdf
  - get_consumption_chart
  - report_leak
  - create_contact
  - get_office_hours
  - get_requirements      # Requisitos para trámites
  - send_payment_link     # Enviar link de pago
  - escalate_to_human     # Transferir a agente AGORA

# ============================================================
# AGENT: Billing Engine
# ============================================================
agent: billing_engine
description: |
  Event-driven billing agent. Generates invoices when
  meter readings are ready. Handles CFDI stamping,
  PDF generation, and multi-channel delivery.

model: claude-haiku-4-5-20251001
triggers:
  - type: event
    eventType: reading.billing_ready
  - type: schedule
    cron: "0 2 * * *"    # Daily at 2 AM for batch catch-up
  - type: manual
    ui_button: "Generar Factura Manual"

tools:
  - calculate_tariff
  - generate_invoice
  - stamp_cfdi           # Finkok PAC
  - generate_pdf          # Puppeteer HTML→PDF
  - deliver_whatsapp
  - deliver_email
  - deliver_print_queue
  - apply_regularization  # Bonificaciones/recargos

# ============================================================
# AGENT: Anomaly Detection
# ============================================================
agent: anomaly_detection
description: |
  Monitors all incoming meter readings for anomalies.
  Uses statistical analysis + ML to detect leaks,
  fraud, meter malfunction, and data quality issues.

model: claude-haiku-4-5-20251001
triggers:
  - type: event
    eventType: reading.received

detection_rules:
  - name: high_consumption
    condition: "consumption > avg_6_months * 3"
    action: flag_suspicious
    confidence_threshold: 0.7

  - name: zero_consumption
    condition: "consumption == 0 AND prev_consumption > 0"
    action: check_meter_status
    after_n_consecutive: 2

  - name: negative_consumption
    condition: "consumption < 0"
    action: reject_and_alert
    confidence_threshold: 0.95

  - name: meter_stopped
    condition: "same_reading_for >= 3_periods"
    action: create_work_order_meter_check

  - name: seasonal_anomaly
    condition: "consumption deviates > 2σ from same_month_historical"
    action: flag_for_review

  - name: neighbor_comparison
    condition: "consumption > sector_avg * 5 AND similar_toma_type"
    action: create_fraud_case

# ============================================================
# AGENT: Collections Intelligence
# ============================================================
agent: collections_intelligence
description: |
  Predicts which accounts will become delinquent.
  Selects optimal collection strategy per account.
  Automates reminder sequences via preferred channel.

model: claude-sonnet-4-20250514
triggers:
  - type: event
    eventType: invoice.past_due
  - type: schedule
    cron: "0 8 * * 1-5"  # Weekdays at 8 AM

scoring_model:
  features:
    - payment_history_last_12_months
    - days_past_due
    - total_debt_amount
    - number_of_unpaid_invoices
    - account_age_years
    - toma_type
    - previous_payment_plans
    - vulnerability_flag
    - sector_delinquency_rate
  output: probability_of_payment_within_30_days  # 0-1

collection_sequences:
  low_risk:   # Score > 0.7
    - day_1: sms_reminder
    - day_5: whatsapp_reminder_with_payment_link
    - day_15: email_formal_notice
  medium_risk: # Score 0.3-0.7
    - day_1: whatsapp_reminder_with_payment_link
    - day_3: phone_call_ai
    - day_7: whatsapp_warning_corte
    - day_14: formal_letter
    - day_21: schedule_corte_order
  high_risk:  # Score < 0.3
    - day_1: phone_call_ai
    - day_3: whatsapp_warning_corte
    - day_7: formal_letter
    - day_10: schedule_corte_order
  vulnerable: # vulnerability_flag = true
    - day_1: whatsapp_social_tariff_offer
    - day_7: phone_call_human_agent
    - day_14: in_person_visit
    # NEVER auto-schedule corte for vulnerable accounts

# ============================================================
# AGENT: Field Workforce
# ============================================================
agent: field_workforce
description: |
  Mobile-first work order management.
  Auto-assigns orders based on technician location/skills.
  Optimizes routes. Captures field data.

model: claude-haiku-4-5-20251001
triggers:
  - type: event
    eventType: work_order.created
  - type: schedule
    cron: "0 6 * * 1-6"  # Route optimization at 6 AM

tools:
  - get_available_technicians
  - get_technician_location
  - assign_work_order
  - optimize_route          # Google Maps Directions API
  - update_order_status
  - capture_field_data
  - upload_photos

# ============================================================
# AGENT: Fraud Detection
# ============================================================
agent: fraud_detection
description: |
  ML-powered fraud detection. Analyzes consumption patterns,
  meter data, and geospatial clusters to identify illegal
  connections and meter tampering.

model: claude-sonnet-4-20250514
triggers:
  - type: event
    eventType: anomaly.high_confidence
  - type: schedule
    cron: "0 3 * * 0"    # Weekly deep scan on Sunday 3 AM

analysis_methods:
  - consumption_pattern_analysis    # Sudden drops, impossible reductions
  - meter_data_integrity           # Tampered readings, reversed meters
  - geospatial_clustering          # Clusters of anomalies in same area
  - billing_gap_analysis           # Periods without billing
  - new_connection_audit           # Recently created tomas with no meter

# ============================================================
# AGENT: Regulatory Compliance
# ============================================================
agent: regulatory_compliance
description: |
  Auto-generates regulatory reports for CONAGUA, SEMARNAT,
  and state-level entities. Monitors compliance deadlines.

model: claude-haiku-4-5-20251001
triggers:
  - type: schedule
    cron: "0 7 1 * *"    # Monthly on the 1st

reports:
  - conagua_monthly_extraction      # Monthly water extraction volumes
  - conagua_quarterly_efficiency    # Quarterly efficiency metrics
  - semarnat_discharge              # Wastewater discharge report
  - state_service_indicators        # State-level service KPIs
  - financial_summary               # Revenue, collection rates
```

---

## 6. API Specifications

### 6.1 REST API Structure

```
Base URL: https://api.supra.water/{tenant_slug}/v1

Authentication: Bearer JWT (OAuth2)
Rate Limiting: 100 req/min per API key
Content-Type: application/json

# ---- Contracts ----
POST   /contracts                        # Create new contract
GET    /contracts                        # List contracts (paginated, filterable)
GET    /contracts/:id                    # Get contract detail
PATCH  /contracts/:id                    # Update contract
POST   /contracts/:id/terminate          # Terminate contract
POST   /contracts/:id/change-titular     # Change titular
POST   /contracts/:id/subrogate          # Subrogation

# ---- Tomas ----
GET    /tomas                            # List tomas
GET    /tomas/:id                        # Get toma detail
GET    /tomas/:id/readings               # Reading history
GET    /tomas/:id/consumption            # Consumption summary
PATCH  /tomas/:id                        # Update toma

# ---- Meters ----
POST   /meters                           # Register new meter
GET    /meters/:id                       # Get meter detail
POST   /meters/:id/readings              # Submit manual reading
POST   /meters/smart/ingest              # Smart meter data ingestion (bulk)
POST   /meters/:id/replace               # Meter replacement

# ---- Invoices ----
POST   /invoices/generate                # Generate invoice
GET    /invoices                          # List invoices
GET    /invoices/:id                      # Get invoice detail
GET    /invoices/:id/pdf                  # Download PDF
GET    /invoices/:id/xml                  # Download CFDI XML
POST   /invoices/:id/cancel              # Cancel CFDI
POST   /invoices/:id/credit-note         # Generate credit note

# ---- Payments ----
POST   /payments                         # Process payment
GET    /payments                          # List payments
GET    /payments/:id/receipt              # Download receipt
POST   /payments/reconcile               # Bank reconciliation batch

# ---- Payment Plans ----
POST   /payment-plans                    # Create payment plan
GET    /payment-plans/:id                # Get plan detail
POST   /payment-plans/:id/installment    # Record installment payment

# ---- Work Orders ----
POST   /work-orders                      # Create work order
GET    /work-orders                       # List (filterable by status, type, assigned)
PATCH  /work-orders/:id                  # Update status, assign
POST   /work-orders/:id/complete         # Complete with field data
GET    /work-orders/route/:user_id       # Get optimized route for technician

# ---- Contacts ----
POST   /contacts                         # Create contact/complaint
GET    /contacts                          # List contacts
PATCH  /contacts/:id                     # Update/resolve
POST   /contacts/:id/escalate            # Escalate to department

# ---- Persons ----
POST   /persons                          # Create person
GET    /persons/:id                      # Get person detail
GET    /persons/search                    # Search by name/RFC/CURP/phone
PATCH  /persons/:id                      # Update person

# ---- Reports & Analytics ----
GET    /analytics/dashboard              # Real-time dashboard data
GET    /analytics/revenue                 # Revenue by period
GET    /analytics/delinquency            # Delinquency metrics
GET    /analytics/consumption            # Consumption patterns
GET    /analytics/collection-rate        # Collection efficiency
GET    /reports/conagua                   # CONAGUA regulatory report

# ---- Webhooks (for external systems) ----
POST   /webhooks                         # Register webhook
GET    /webhooks                          # List registered webhooks
DELETE /webhooks/:id                     # Remove webhook

# ---- CFDI ----
POST   /cfdi/stamp                       # Stamp CFDI
POST   /cfdi/cancel                      # Cancel CFDI
GET    /cfdi/status/:uuid                # Check CFDI status at SAT

# ---- Communication ----
POST   /notifications/send               # Send notification (any channel)
POST   /notifications/broadcast          # Broadcast to segment
GET    /notifications/templates          # List message templates
```

### 6.2 Event Bus (PostgreSQL LISTEN/NOTIFY + n8n)

```typescript
// Domain events emitted by the system
const DOMAIN_EVENTS = {
  // Contract events
  'contract.requested': { contract_id, person_id, toma_id },
  'contract.created': { contract_id, contract_number },
  'contract.activated': { contract_id },
  'contract.terminated': { contract_id, reason },
  'contract.titular_changed': { contract_id, old_person_id, new_person_id },

  // Reading events
  'reading.received': { reading_id, meter_id, toma_id, consumption },
  'reading.anomaly_detected': { reading_id, anomaly_type, confidence },
  'reading.billing_ready': { reading_id, contract_id },

  // Billing events
  'invoice.generated': { invoice_id, contract_id, total },
  'invoice.stamped': { invoice_id, folio_fiscal },
  'invoice.delivered': { invoice_id, channel },
  'invoice.past_due': { invoice_id, days_past_due },

  // Payment events
  'payment.received': { payment_id, invoice_id, amount },
  'payment.bounced': { payment_id, reason },
  'payment.reconciled': { payment_ids: string[] },

  // Delinquency events
  'delinquency.started': { procedure_id, contract_id, total_debt },
  'delinquency.step_executed': { procedure_id, step, action },
  'delinquency.resolved': { procedure_id, resolution_type },

  // Work order events
  'work_order.created': { order_id, order_type, toma_id },
  'work_order.assigned': { order_id, assigned_to },
  'work_order.completed': { order_id, result },

  // Contact events
  'contact.created': { contact_id, contact_type, channel },
  'contact.resolved': { contact_id, resolution },

  // Fraud events
  'fraud.case_opened': { case_id, toma_id, detection_source },
  'fraud.confirmed': { case_id, fraud_type },

  // Communication events
  'notification.sent': { communication_id, channel, person_id },
  'notification.delivered': { communication_id },
  'notification.failed': { communication_id, error },
};

// Event emission utility
async function emitEvent(event: {
  type: string;
  aggregate_type: string;
  aggregate_id: string;
  tenant_id: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
}): Promise<void> {
  // 1. Store in domain_events table
  await db.insert(domainEvents).values({
    tenant_id: event.tenant_id,
    event_type: event.type,
    aggregate_type: event.aggregate_type,
    aggregate_id: event.aggregate_id,
    payload: event.payload,
    metadata: {
      ...event.metadata,
      timestamp: new Date().toISOString(),
    },
  });

  // 2. Notify via PostgreSQL
  await db.execute(sql`
    NOTIFY domain_events, ${JSON.stringify({
      type: event.type,
      aggregate_id: event.aggregate_id,
      tenant_id: event.tenant_id,
    })}
  `);

  // 3. Push to Redis for BullMQ workers
  await eventQueue.add(event.type, event);
}
```

---

## 7. Integration Layer

### 7.1 CFDI 4.0 Integration (Finkok PAC)

```typescript
// CFDI 4.0 stamping via Finkok
interface CFDIService {
  stamp(invoice: Invoice, person: Person): Promise<CFDIResult>;
  cancel(uuid: string, reason: string): Promise<CancelResult>;
  getStatus(uuid: string): Promise<CFDIStatus>;
}

// Required SAT catalog codes for water services
const SAT_CATALOGS = {
  product_service_keys: {
    agua: '10171500',              // Agua
    alcantarillado: '72151802',    // Servicios de alcantarillado
    saneamiento: '72151801',       // Tratamiento de aguas residuales
    reconexion: '72151800',        // Servicios de agua/alcantarillado
  },
  unit_keys: {
    m3: 'MTQ',                     // Metro cúbico
    servicio: 'E48',               // Unidad de servicio
    pieza: 'H87',                  // Pieza
  },
  payment_methods: {
    efectivo: '01',
    transferencia: '03',
    tarjeta_debito: '28',
    tarjeta_credito: '04',
    por_definir: '99',
  },
  payment_forms: {
    pago_unico: 'PUE',
    parcialidades: 'PPD',
  },
  fiscal_regimes: {
    gobierno: '603',               // Personas Morales - Gobierno
    general: '601',                // General de Ley
    sin_obligaciones: '616',       // Sin obligaciones fiscales
  },
  cfdi_uses: {
    gastos_general: 'G03',
    sin_efectos: 'S01',
    por_definir: 'P01',
  },
};
```

### 7.2 Payment Gateway Integrations

```typescript
// SPEI real-time payment reconciliation
// CEA gets a CLABE concentradora. Each invoice gets a unique reference.
const SPEI_CONFIG = {
  clabe_concentradora: process.env.SPEI_CLABE,
  bank: 'STP',  // Sistema de Transferencias y Pagos
  reference_format: '{contract_number}-{invoice_seq}',
  webhook_url: '/api/v1/payments/spei/webhook',
};

// OXXO payment reference generation
// Uses Conekta or direct OXXO Pay integration
const OXXO_CONFIG = {
  provider: 'conekta',  // or 'oxxo_pay_direct'
  reference_format: 'barcode_128',
  expiration_days: 30,
  webhook_url: '/api/v1/payments/oxxo/webhook',
};

// Card payments via Conekta or Stripe
const CARD_CONFIG = {
  provider: process.env.PAYMENT_PROVIDER, // 'conekta' or 'stripe'
  currency: 'MXN',
  webhook_url: '/api/v1/payments/card/webhook',
};
```

### 7.3 WhatsApp Business API

```typescript
// WhatsApp message templates (pre-approved by Meta)
const WHATSAPP_TEMPLATES = {
  invoice_ready: {
    name: 'recibo_listo',
    language: 'es_MX',
    components: [
      { type: 'body', parameters: ['{{customer_name}}', '{{total}}', '{{due_date}}'] },
      { type: 'button', sub_type: 'url', parameters: ['{{payment_url}}'] },
    ],
  },
  payment_reminder: {
    name: 'recordatorio_pago',
    language: 'es_MX',
    components: [
      { type: 'body', parameters: ['{{customer_name}}', '{{debt_amount}}', '{{days_past_due}}'] },
      { type: 'button', sub_type: 'url', parameters: ['{{payment_url}}'] },
    ],
  },
  payment_confirmation: {
    name: 'pago_confirmado',
    language: 'es_MX',
    components: [
      { type: 'body', parameters: ['{{customer_name}}', '{{amount}}', '{{receipt_number}}'] },
    ],
  },
  leak_report_received: {
    name: 'reporte_fuga_recibido',
    language: 'es_MX',
    components: [
      { type: 'body', parameters: ['{{customer_name}}', '{{folio}}', '{{estimated_response}}'] },
    ],
  },
  service_cut_warning: {
    name: 'aviso_corte',
    language: 'es_MX',
    components: [
      { type: 'body', parameters: ['{{customer_name}}', '{{debt_amount}}', '{{cut_date}}'] },
      { type: 'button', sub_type: 'url', parameters: ['{{payment_url}}'] },
    ],
  },
};
```

---

## 8. Mexican Regulatory Compliance

### 8.1 CFDI Requirements

```yaml
cfdi_version: "4.0"
required_fields:
  emisor:
    - Rfc           # RFC de CEA
    - Nombre        # Razón social
    - RegimenFiscal # 603 para gobierno
  receptor:
    - Rfc           # RFC del usuario (XAXX010101000 for público general)
    - Nombre
    - DomicilioFiscalReceptor  # CP del usuario
    - RegimenFiscalReceptor
    - UsoCFDI       # G03 or S01
  conceptos:
    - ClaveProdServ  # SAT product key
    - ClaveUnidad    # SAT unit key
    - Cantidad
    - Descripcion
    - ValorUnitario
    - Importe

special_rules:
  - Water service for domestic use is IVA exempt (tasa 0%)
  - Commercial water service may have 16% IVA
  - Government entities use RFC genérico for público general
  - Complemento de pago required for PPD payment form
```

### 8.2 Data Protection (LFPDPPP)

```yaml
# Mexican Federal Law for Protection of Personal Data
requirements:
  - Privacy notice (aviso de privacidad) on all data collection forms
  - Explicit consent for data processing
  - Right of access, rectification, cancellation, opposition (ARCO)
  - Data minimization — collect only what's needed
  - Secure storage with encryption at rest
  - Data breach notification within 72 hours
  - Data retention policies per type of data

implementation:
  - All PII encrypted at rest (pgcrypto)
  - Audit log for all PII access
  - ARCO request handling API endpoint
  - Privacy notice integration in WhatsApp flow and web portal
  - Data anonymization for analytics/reporting
```

---

## 9. Infrastructure & Deployment

### 9.1 Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://supra:supra@db:5432/supra_water
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src

  db:
    image: timescale/timescaledb-ha:pg16-latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: supra
      POSTGRES_PASSWORD: supra
      POSTGRES_DB: supra_water
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: ${N8N_PASSWORD}
      WEBHOOK_URL: http://n8n:5678
    volumes:
      - n8n_data:/home/node/.n8n

  agora:
    image: chatwoot/chatwoot:latest
    ports:
      - "3001:3000"
    environment:
      RAILS_ENV: production
      SECRET_KEY_BASE: ${CHATWOOT_SECRET}
    depends_on:
      - db
      - redis

  traefik:
    image: traefik:v3.0
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik:/etc/traefik

volumes:
  pgdata:
  n8n_data:
```

### 9.2 Environment Variables

```bash
# .env.example
# ---- Database ----
DATABASE_URL=postgresql://supra:password@localhost:5432/supra_water
REDIS_URL=redis://localhost:6379

# ---- Auth ----
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=24h

# ---- AI ----
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...            # For embeddings only

# ---- CFDI / PAC ----
FINKOK_USERNAME=your-finkok-user
FINKOK_PASSWORD=your-finkok-pass
FINKOK_ENVIRONMENT=sandbox       # sandbox or production

# ---- WhatsApp ----
WHATSAPP_API_URL=https://waba.360dialog.io/v1
WHATSAPP_API_KEY=your-api-key
WHATSAPP_PHONE_NUMBER_ID=your-phone-id

# ---- Voice (Twilio) ----
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+52...

# ---- Payments ----
CONEKTA_API_KEY=key_...
CONEKTA_PRIVATE_KEY=...
SPEI_CLABE=...

# ---- Storage ----
S3_BUCKET=supra-water-files
S3_ENDPOINT=https://storage.googleapis.com
GCS_KEY_FILE=./gcs-key.json

# ---- Monitoring ----
SENTRY_DSN=https://...@sentry.io/...

# ---- n8n ----
N8N_WEBHOOK_BASE_URL=https://n8n.yourdomain.com
N8N_API_KEY=...
```

---

## 10. Migration Strategy (Strangler Fig)

```
Phase 1: Build SUPRA alongside legacy. New features in SUPRA, old features still in legacy.
Phase 2: Intercept flows — API gateway routes some requests to SUPRA, some to legacy.
Phase 3: Data sync — bidirectional sync between legacy DB and SUPRA DB.
Phase 4: Cutover module by module — once agents validated in production, cut legacy connection.
Phase 5: Retire legacy — when last module migrated, decommission legacy system.

                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (Traefik)     │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────┴─────┐   ┌──────┴──────┐
              │  SUPRA    │   │   Legacy    │
              │  (new)    │   │   (old)     │
              └─────┬─────┘   └──────┬──────┘
                    │                │
              ┌─────┴─────┐   ┌──────┴──────┐
              │ PostgreSQL│◄──│  Legacy DB  │
              │ + Timescl │   │             │
              └───────────┘   └─────────────┘
                     ▲
                     │ bidirectional sync
                     │ (during migration only)
```

---

## 11. Implementation Phases

### Phase 1: Q1-Q2 2026 — Foundation + Quick Wins

```
PRIORITY ORDER:
1. Project scaffolding (Express + Drizzle + PostgreSQL + Docker)
2. Database schema creation (all tables above)
3. Multi-tenant auth (JWT + tenant isolation)
4. Core CRUD APIs (persons, tomas, contracts, meters)
5. Smart meter ingestion pipeline (TimescaleDB)
6. CFDI 4.0 billing engine (Finkok integration)
7. WhatsApp Business API integration
8. Voice AI agent (Twilio + Claude)
9. Payment processing (SPEI, OXXO, card)
10. AGORA (Chatwoot) integration for CRM
11. Basic admin dashboard (React)
12. Event bus (pg LISTEN/NOTIFY + BullMQ)
```

### Phase 2: Q3-Q4 2026 — Core Business Agents

```
1. Contract lifecycle agent (digital alta/baja/cambio titular)
2. Self-service onboarding via WhatsApp
3. Anomaly detection agent (ML on meter data)
4. Complaint resolution agent (auto-triage 60%)
5. Field workforce agent (mobile work orders)
6. Real-time analytics dashboard
7. Payment plan self-service
8. Delinquency orchestrator agent
```

### Phase 3: Q1-Q2 2027 — Intelligence Layer

```
1. Fraud detection agent (ML pattern analysis)
2. Collections intelligence agent (predictive)
3. Consumption forecast agent
4. Tariff optimizer agent
5. Vulnerability shield agent
6. Regulatory compliance agent (CONAGUA auto-reports)
```

### Phase 4: Q3-Q4 2027 — Full Autonomy

```
1. Digital twin integration
2. GeoInfra agent (autonomous infrastructure mapping)
3. Natural language BI
4. Legacy system full retirement
5. Multi-tenant marketplace
```

---

## 12. File & Folder Structure

```
supra-water/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── .env.example
│
├── db/
│   ├── init/
│   │   ├── 001-extensions.sql
│   │   ├── 002-core-tables.sql
│   │   ├── 003-infrastructure-tables.sql
│   │   ├── 004-billing-tables.sql
│   │   ├── 005-payments-tables.sql
│   │   ├── 006-operations-tables.sql
│   │   ├── 007-events-tables.sql
│   │   └── 008-seed-data.sql
│   ├── migrations/
│   └── schema/                      # Drizzle schema files
│       ├── tenants.ts
│       ├── persons.ts
│       ├── addresses.ts
│       ├── tomas.ts
│       ├── meters.ts
│       ├── contracts.ts
│       ├── readings.ts
│       ├── invoices.ts
│       ├── payments.ts
│       ├── work-orders.ts
│       ├── contacts.ts
│       ├── fraud-cases.ts
│       └── events.ts
│
├── src/
│   ├── index.ts                     # Express app entry point
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── auth.ts
│   │   └── env.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT validation
│   │   ├── tenant.ts                # Tenant extraction & RLS
│   │   ├── rate-limit.ts
│   │   ├── error-handler.ts
│   │   └── audit-log.ts
│   │
│   ├── modules/
│   │   ├── contracts/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── validators.ts        # Zod schemas
│   │   │   └── events.ts
│   │   │
│   │   ├── billing/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── tariff-calculator.ts
│   │   │   ├── cfdi-service.ts      # Finkok PAC integration
│   │   │   ├── pdf-generator.ts     # Puppeteer HTML→PDF
│   │   │   ├── templates/
│   │   │   │   ├── invoice.hbs
│   │   │   │   ├── credit-note.hbs
│   │   │   │   └── receipt.hbs
│   │   │   └── events.ts
│   │   │
│   │   ├── meters/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── smart-meter-ingestion.ts
│   │   │   ├── anomaly-detector.ts
│   │   │   └── events.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── gateways/
│   │   │   │   ├── spei.ts
│   │   │   │   ├── oxxo.ts
│   │   │   │   ├── conekta.ts
│   │   │   │   └── bank-domiciliation.ts
│   │   │   └── reconciliation.ts
│   │   │
│   │   ├── work-orders/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── route-optimizer.ts
│   │   │   └── events.ts
│   │   │
│   │   ├── contacts/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── ai-classifier.ts
│   │   │   └── events.ts
│   │   │
│   │   ├── delinquency/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── collection-scorer.ts
│   │   │   └── events.ts
│   │   │
│   │   ├── fraud/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   ├── ml-detector.ts
│   │   │   └── events.ts
│   │   │
│   │   ├── persons/
│   │   │   ├── router.ts
│   │   │   ├── service.ts
│   │   │   └── rfc-validator.ts
│   │   │
│   │   ├── tomas/
│   │   │   ├── router.ts
│   │   │   └── service.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── router.ts
│   │   │   ├── dashboard-service.ts
│   │   │   └── report-generator.ts
│   │   │
│   │   └── admin/
│   │       ├── router.ts
│   │       ├── tenant-service.ts
│   │       ├── user-service.ts
│   │       └── tariff-service.ts
│   │
│   ├── agents/
│   │   ├── base-agent.ts            # Base agent class
│   │   ├── registry.ts              # Agent discovery & management
│   │   ├── voice-ai/
│   │   │   ├── agent.ts
│   │   │   ├── twilio-handler.ts
│   │   │   └── tools.ts
│   │   ├── whatsapp-cx/
│   │   │   ├── agent.ts
│   │   │   ├── message-handler.ts
│   │   │   └── tools.ts
│   │   ├── billing-engine/
│   │   │   ├── agent.ts
│   │   │   └── tools.ts
│   │   ├── anomaly-detection/
│   │   │   ├── agent.ts
│   │   │   └── rules.ts
│   │   ├── collections/
│   │   │   ├── agent.ts
│   │   │   ├── scoring-model.ts
│   │   │   └── sequences.ts
│   │   ├── field-workforce/
│   │   │   ├── agent.ts
│   │   │   └── route-optimizer.ts
│   │   ├── fraud-detection/
│   │   │   ├── agent.ts
│   │   │   └── ml-pipeline.ts
│   │   └── regulatory/
│   │       ├── agent.ts
│   │       └── report-templates.ts
│   │
│   ├── events/
│   │   ├── bus.ts                   # PostgreSQL LISTEN/NOTIFY wrapper
│   │   ├── publisher.ts
│   │   ├── subscriber.ts
│   │   └── handlers/
│   │       ├── on-reading-received.ts
│   │       ├── on-invoice-generated.ts
│   │       ├── on-payment-received.ts
│   │       ├── on-invoice-past-due.ts
│   │       └── on-work-order-created.ts
│   │
│   ├── integrations/
│   │   ├── finkok/                  # CFDI PAC
│   │   │   ├── client.ts
│   │   │   ├── stamp.ts
│   │   │   └── cancel.ts
│   │   ├── whatsapp/
│   │   │   ├── client.ts
│   │   │   ├── templates.ts
│   │   │   └── webhook.ts
│   │   ├── twilio/
│   │   │   ├── client.ts
│   │   │   └── voice-handler.ts
│   │   ├── conekta/
│   │   │   └── client.ts
│   │   ├── chatwoot/                # AGORA
│   │   │   ├── client.ts
│   │   │   └── webhook.ts
│   │   └── google-maps/
│   │       └── directions.ts
│   │
│   ├── utils/
│   │   ├── rfc-validator.ts         # Mexican RFC validation
│   │   ├── curp-validator.ts        # CURP validation
│   │   ├── clabe-validator.ts       # CLABE bank account validation
│   │   ├── mexican-states.ts        # State codes
│   │   └── sat-catalogs.ts          # SAT fiscal catalogs
│   │
│   └── types/
│       ├── index.ts
│       ├── contracts.ts
│       ├── billing.ts
│       ├── payments.ts
│       └── agents.ts
│
├── n8n/
│   └── workflows/
│       ├── smart-meter-ingestion.json
│       ├── billing-pipeline.json
│       ├── payment-reconciliation.json
│       ├── delinquency-orchestration.json
│       ├── whatsapp-handler.json
│       └── daily-reports.json
│
├── web/                             # Admin dashboard (React/Next.js)
│   ├── package.json
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
│
├── traefik/
│   ├── traefik.yml
│   └── dynamic/
│       └── routes.yml
│
├── scripts/
│   ├── seed-tenant.ts               # Create first tenant (CEA Querétaro)
│   ├── import-padron.ts             # Import existing padrón from CSV/Excel
│   ├── generate-tariffs.ts          # Create tariff schedules
│   └── test-cfdi.ts                 # Test CFDI stamping
│
└── tests/
    ├── modules/
    │   ├── billing.test.ts
    │   ├── contracts.test.ts
    │   └── payments.test.ts
    ├── agents/
    │   └── anomaly-detection.test.ts
    └── integration/
        ├── cfdi.test.ts
        └── whatsapp.test.ts
```

---

## Quick Start for Claude Code

```bash
# 1. Initialize project
mkdir supra-water && cd supra-water
npm init -y
npm install express drizzle-orm postgres zod bullmq ioredis jsonwebtoken bcryptjs
npm install -D typescript @types/express @types/node tsx drizzle-kit vitest

# 2. Start infrastructure
docker compose up -d db redis

# 3. Run migrations
npx drizzle-kit push

# 4. Seed first tenant
npx tsx scripts/seed-tenant.ts

# 5. Start dev server
npx tsx watch src/index.ts
```

**Start with Phase 1, Priority 1: Project scaffolding.**
Build the Express app, Drizzle schema, multi-tenant auth, and core CRUD APIs first.
Then add the billing engine and CFDI integration.
Then WhatsApp and Voice AI agents.
Everything else builds on these foundations.
