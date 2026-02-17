# SUPRA Water 2026 -- Database Architecture Action Plan

> **Role:** Database Architect
> **Date:** 2026-02-16
> **Scope:** Complete database layer for SUPRA Water 2026 CIS
> **Target:** CEA Queretaro (~400K accounts, 13 municipalities)
> **Stack:** PostgreSQL 16 + TimescaleDB + PostGIS + pgvector + Drizzle ORM
> **Source Documents:** SUPRA-WATER-2026.md (SS3), DATABASE_OPTIMIZATION_PLAN.md, SUPRA_CROSSREF_INSIGHTS.md, SYSTEM_HEALTH_REPORT.md

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Target Schema Design](#2-target-schema-design)
3. [Migration Strategy (Legacy to Target)](#3-migration-strategy-legacy-to-target)
4. [Drizzle ORM Schema Files](#4-drizzle-orm-schema-files)
5. [Performance Considerations](#5-performance-considerations)
6. [Sprint Breakdown](#6-sprint-breakdown)
7. [Risk Matrix](#7-risk-matrix)
8. [Appendices](#8-appendices)

---

## 1. Executive Summary

### The Problem

The legacy AquaCIS database (`cf_quere_pro`) has **4,114 tables** with a composite health score of **4.2/10**. Seventy percent of all tables are structural waste. There are zero foreign key constraints, plaintext passwords, GPS stored as VARCHAR, and a 350-column god table (`explotacion`). The current optimization plan targets ~230 tables through 6 phases over 10 months.

### The Target

SUPRA Water 2026 defines a **JSONB-heavy, event-sourced, multi-tenant schema** with ~20 core tables. Cross-referencing both plans (Insight #8), the realistic target is **50-80 production tables** -- dramatically leaner than the legacy-preserving ~230 target but more operationally robust than SUPRA's aggressive ~20.

### The Strategy

We execute two parallel tracks:

| Track | Description | Timeline |
|-------|-------------|----------|
| **Track A: Legacy Cleanup** | Emergency table drops, security fixes, critical FK constraints | Months 1-3 (from existing optimization plan Phases 1-2) |
| **Track B: New Schema Build** | Build the SUPRA target schema, Drizzle ORM, bidirectional sync | Months 1-6 (parallel with Track A, then continuing) |

This follows Insight #22: **Build new, don't just clean old**. The Strangler Fig pattern applies to the database layer -- build the new schema, set up sync, migrate domain by domain.

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary keys | UUID v4 (`gen_random_uuid()`) | No sequence contention; safe for distributed/multi-tenant |
| Money columns | `DECIMAL(12,2)` | Never floating-point for money |
| Booleans | Native `BOOLEAN` | Not char(1) 'S'/'N' |
| Multi-tenancy | `tenant_id UUID` + RLS on every table | Day-one multi-tenant (Insight #2) |
| Audit/events | `domain_events` TimescaleDB hypertable | Replaces 230 `his*` tables (Insight #7) |
| Tariffs | JSONB `blocks` array | Replaces 15-table relational hierarchy (Insight #6) |
| Work order materials/photos | JSONB arrays | Eliminates separate material/photo tables |
| Delinquency steps | JSONB `steps_history` | Eliminates step-tracking junction tables |
| Lookup values | `domain_values` table + JSONB config | Replaces 95 `tipo*` tables (Insight #8) |
| Address search | Generated columns + `gin_trgm_ops` | Instant fuzzy search (Insight #9) |
| Spatial data | PostGIS `GEOGRAPHY(POINT, 4326)` | Native from day one (not VARCHAR) |
| Time-series | TimescaleDB hypertables | `meter_readings` and `domain_events` |
| ORM | Drizzle ORM (TypeScript, SQL-first) | Type-safe, generates TS types from schema (Insight #5) |
| Passwords | bcrypt via `pgcrypto` | Never plaintext |

---

## 2. Target Schema Design

### 2.1 Complete Table Inventory

The target schema contains **62 tables** organized into 10 domains. Below is every table with column counts, JSONB usage, and domain classification.

#### Domain 1: Tenant and Organization (4 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 1 | `tenants` | 9 | `fiscal_address`, `config` | Root multi-tenant entity |
| 2 | `explotaciones` | 12 | `config`, `billing_config`, `reading_config` | Operating unit (replaces 350-col god table) |
| 3 | `offices` | 10 | `address`, `config` | Service offices |
| 4 | `explotacion_configs` | 14 | `billing`, `collections`, `estimation`, `notifications`, `cutoff`, `digital`, `fiscal`, `quality` | All explotacion config in one JSONB-per-domain table (replaces 14 extension tables from optimization plan) |

**JSONB Justification -- explotacion_configs:** The legacy `explotacion` has 350 columns across 15 domains. The optimization plan decomposes into 14 extension tables. We go further: one `explotacion_configs` table with typed JSONB columns per domain. This is queryable (`config->'billing'->>'cycle_days'`), versionable, and reduces the extension table proliferation. Each JSONB column has a Zod schema enforcing structure at the application layer.

```sql
CREATE TABLE explotacion_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id) UNIQUE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),

  -- Each domain gets a typed JSONB column
  billing JSONB NOT NULL DEFAULT '{}',        -- cycle_days, max_months, simulation_mode, etc.
  collections JSONB NOT NULL DEFAULT '{}',    -- grace_days, surcharge_rate, interest_rate, etc.
  estimation JSONB NOT NULL DEFAULT '{}',     -- tolerance_pct, methods[], fallback_m3, etc.
  notifications JSONB NOT NULL DEFAULT '{}',  -- sms_enabled, email_enabled, channels[], etc.
  cutoff JSONB NOT NULL DEFAULT '{}',         -- min_debt, seasonal_block, valve_management, etc.
  digital JSONB NOT NULL DEFAULT '{}',        -- portal_url, biometric_enabled, etc.
  fiscal JSONB NOT NULL DEFAULT '{}',         -- vat_rules, cfdi_defaults, etc.
  quality JSONB NOT NULL DEFAULT '{}',        -- complaint_threshold, inspection_rules, etc.

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Domain 2: Users and Auth (3 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 5 | `users` | 14 | `permissions` | System users with role-based access |
| 6 | `sessions` | 8 | `metadata` | Active sessions for audit context |
| 7 | `api_keys` | 9 | `scopes` | External API access (PAC, payment gateways) |

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,       -- bcrypt, never plaintext
  name VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'admin', 'supervisor', 'operador', 'lecturista',
    'cajero', 'atencion_cliente', 'tecnico', 'auditor', 'readonly'
  )),
  permissions JSONB NOT NULL DEFAULT '[]',   -- Fine-grained permissions array
  explotacion_ids UUID[] NOT NULL DEFAULT '{}',
  office_ids UUID[] NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  token_hash VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  scopes JSONB NOT NULL DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Domain 3: Persons and Addresses (3 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 8 | `persons` | 27 | `fiscal_address`, `tags` | Unified person entity (fisica/moral) |
| 9 | `addresses` | 21 | (none, uses generated column) | Mexican address structure with PostGIS |
| 10 | `person_contacts` | 10 | `metadata` | Consolidated contacts (phone, email, WhatsApp) |

**JSONB Justification -- `fiscal_address`:** CFDI fiscal addresses have varying structures (domestic vs. foreign, with/without interior number). JSONB avoids nullable column proliferation while remaining fully queryable for SAT compliance.

```sql
CREATE TABLE persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('fisica', 'moral')),
  rfc VARCHAR(13),
  curp VARCHAR(18),
  name VARCHAR(200) NOT NULL,
  first_name VARCHAR(100),
  last_name_paterno VARCHAR(100),
  last_name_materno VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  phone_secondary VARCHAR(20),
  whatsapp VARCHAR(20),
  fiscal_regime VARCHAR(3),
  fiscal_use VARCHAR(4),
  fiscal_address JSONB,
  zip_code VARCHAR(5),
  vulnerable BOOLEAN DEFAULT false,
  vulnerability_type VARCHAR(50),
  digital_access BOOLEAN DEFAULT false,
  preferred_channel VARCHAR(20) DEFAULT 'whatsapp',
  language VARCHAR(5) DEFAULT 'es-MX',
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

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID REFERENCES explotaciones(id),
  street VARCHAR(200) NOT NULL,
  exterior_number VARCHAR(20),
  interior_number VARCHAR(20),
  colonia VARCHAR(200),
  municipality VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(50) DEFAULT 'Queretaro',
  zip_code VARCHAR(5),
  country VARCHAR(2) DEFAULT 'MX',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  geom GEOGRAPHY(POINT, 4326),
  normalized_text TEXT GENERATED ALWAYS AS (
    LOWER(COALESCE(street, '') || ' ' || COALESCE(exterior_number, '') || ' ' ||
    COALESCE(colonia, '') || ' ' || COALESCE(zip_code, ''))
  ) STORED,
  address_type VARCHAR(20) DEFAULT 'callejero'
    CHECK (address_type IN ('callejero', 'correspondencia', 'fiscal', 'libre')),
  validated BOOLEAN DEFAULT false,
  inegi_cve_loc VARCHAR(20),
  sepomex_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_addresses_geo ON addresses USING GIST(geom);
CREATE INDEX idx_addresses_normalized ON addresses USING gin(normalized_text gin_trgm_ops);
CREATE INDEX idx_addresses_tenant ON addresses(tenant_id);

CREATE TABLE person_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES persons(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN (
    'telefono_fijo', 'telefono_movil', 'email', 'whatsapp'
  )),
  value VARCHAR(255) NOT NULL,
  label VARCHAR(50),                          -- 'personal', 'trabajo', 'facturacion'
  verified BOOLEAN DEFAULT false,
  primary_contact BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Domain 4: Infrastructure (4 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 11 | `sectores_hidraulicos` | 10 | (none) | Hierarchical hydraulic sectors with PostGIS |
| 12 | `acometidas` | 11 | (none) | Water service connections |
| 13 | `tomas` | 24 | (none) | Service points (puntos de servicio) |
| 14 | `meters` | 20 | (none) | Water meters with smart meter fields |

```sql
CREATE TABLE sectores_hidraulicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),
  parent_id UUID REFERENCES sectores_hidraulicos(id),
  code VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  geom GEOGRAPHY(POLYGON, 4326),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, explotacion_id, code)
);

CREATE INDEX idx_sectores_geo ON sectores_hidraulicos USING GIST(geom);

CREATE TABLE acometidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  sector_id UUID NOT NULL REFERENCES sectores_hidraulicos(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  code VARCHAR(30) NOT NULL,
  diameter_mm INTEGER,
  material VARCHAR(50),
  installation_date DATE,
  status VARCHAR(20) DEFAULT 'activa'
    CHECK (status IN ('activa', 'inactiva', 'clausurada')),
  geom GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);

CREATE TABLE tomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),
  acometida_id UUID REFERENCES acometidas(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  toma_number VARCHAR(20) NOT NULL,
  toma_type VARCHAR(30) NOT NULL CHECK (toma_type IN (
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal'
  )),
  status VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (status IN (
    'activa', 'cortada', 'suspendida', 'baja', 'clausurada', 'pendiente_alta'
  )),
  cut_date TIMESTAMPTZ,
  cut_reason VARCHAR(50),
  has_meter BOOLEAN DEFAULT true,
  meter_id UUID,
  billing_type VARCHAR(20) DEFAULT 'medido'
    CHECK (billing_type IN ('medido', 'cuota_fija', 'estimado')),
  tariff_category VARCHAR(30),
  billing_period VARCHAR(10) DEFAULT 'mensual'
    CHECK (billing_period IN ('mensual', 'bimestral', 'trimestral')),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  geom GEOGRAPHY(POINT, 4326),
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

CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  toma_id UUID REFERENCES tomas(id),
  serial_number VARCHAR(50) NOT NULL,
  brand VARCHAR(50),
  model VARCHAR(50),
  diameter_inches DECIMAL(4, 2),
  meter_type VARCHAR(30) CHECK (meter_type IN (
    'volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart'
  )),
  is_smart BOOLEAN DEFAULT false,
  communication_protocol VARCHAR(20),
  device_eui VARCHAR(50),
  last_communication TIMESTAMPTZ,
  installation_date DATE,
  last_calibration_date DATE,
  expected_replacement_date DATE,
  status VARCHAR(20) DEFAULT 'activo'
    CHECK (status IN ('activo', 'inactivo', 'averiado', 'retirado', 'en_almacen')),
  initial_reading DECIMAL(12, 3) DEFAULT 0,
  location_description VARCHAR(200),
  accessible BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, serial_number)
);

ALTER TABLE tomas ADD CONSTRAINT fk_tomas_meter
  FOREIGN KEY (meter_id) REFERENCES meters(id);
```

#### Domain 5: Contracts (2 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 15 | `contracts` | 24 | `bank_account`, `special_conditions`, `documents` | Service contracts (replaces 104-col contrato) |
| 16 | `contract_notifications` | 8 | (none) | Notification recipients per contract |

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID NOT NULL REFERENCES explotaciones(id),
  contract_number VARCHAR(30) NOT NULL,
  person_id UUID NOT NULL REFERENCES persons(id),
  toma_id UUID NOT NULL REFERENCES tomas(id),
  status VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (status IN (
    'pendiente', 'activo', 'suspendido', 'baja', 'cancelado'
  )),
  start_date DATE NOT NULL,
  end_date DATE,
  termination_reason VARCHAR(50),
  billing_address_id UUID REFERENCES addresses(id),
  payment_method VARCHAR(30) DEFAULT 'ventanilla'
    CHECK (payment_method IN (
      'ventanilla', 'domiciliacion', 'digital', 'oxxo', 'gestor_cobro'
    )),
  bank_account JSONB,
  digital_invoice BOOLEAN DEFAULT false,
  tariff_category VARCHAR(30) NOT NULL,
  social_tariff BOOLEAN DEFAULT false,
  special_conditions JSONB,
  preferred_contact_method VARCHAR(20) DEFAULT 'whatsapp',
  notification_channels VARCHAR(20)[] DEFAULT '{whatsapp}',
  previous_contract_id UUID REFERENCES contracts(id),
  documents JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, contract_number)
);

CREATE INDEX idx_contracts_person ON contracts(tenant_id, person_id);
CREATE INDEX idx_contracts_toma ON contracts(tenant_id, toma_id);
CREATE INDEX idx_contracts_status ON contracts(tenant_id, status);

CREATE TABLE contract_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  person_id UUID NOT NULL REFERENCES persons(id),
  notification_type VARCHAR(20) DEFAULT 'secundario',
  channel VARCHAR(20) DEFAULT 'whatsapp',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**JSONB Justification -- `bank_account`:** Domiciliacion bancaria data (CLABE, bank name, holder name) is needed only for the ~5% of accounts using direct debit. JSONB avoids 4-5 nullable columns on every contract row. Validated by Zod at the application layer when `payment_method = 'domiciliacion'`.

**JSONB Justification -- `special_conditions`:** Custom pricing overrides are rare (government, large commercial). Storing as JSONB avoids a separate conditions table for <1% of contracts.

**JSONB Justification -- `documents`:** A checklist of required/submitted documents (`[{type, url, verified, date}]`). These are write-once-read-many with variable structure per contract type.

#### Domain 6: Meter Readings (1 table -- TimescaleDB hypertable)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 17 | `meter_readings` | 22 | (none) | TimescaleDB hypertable, 1-month chunks |

```sql
CREATE TABLE meter_readings (
  id UUID DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  meter_id UUID NOT NULL REFERENCES meters(id),
  toma_id UUID NOT NULL REFERENCES tomas(id),
  contract_id UUID REFERENCES contracts(id),
  reading_value DECIMAL(12, 3) NOT NULL,
  previous_reading DECIMAL(12, 3),
  consumption DECIMAL(12, 3),
  reading_date TIMESTAMPTZ NOT NULL,
  period_start DATE,
  period_end DATE,
  source VARCHAR(20) NOT NULL CHECK (source IN (
    'smart_meter', 'manual_field', 'manual_office', 'autolectura',
    'telelectura', 'estimated', 'photo', 'api'
  )),
  reader_user_id UUID,
  device_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'valid' CHECK (status IN (
    'valid', 'suspicious', 'estimated', 'rejected', 'corrected'
  )),
  anomaly_type VARCHAR(30),
  anomaly_score DECIMAL(5, 3),
  observations TEXT,
  photo_url VARCHAR(500),
  gps_latitude DECIMAL(10, 7),
  gps_longitude DECIMAL(10, 7),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, reading_date)
);

SELECT create_hypertable('meter_readings', 'reading_date',
  chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_readings_meter ON meter_readings(tenant_id, meter_id, reading_date DESC);
CREATE INDEX idx_readings_toma ON meter_readings(tenant_id, toma_id, reading_date DESC);
CREATE INDEX idx_readings_status ON meter_readings(tenant_id, status, reading_date DESC);
```

#### Domain 7: Billing (3 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 18 | `tariff_schedules` | 17 | `blocks`, `additional_concepts` | Tariff definitions with JSONB blocks |
| 19 | `invoices` | 36 | `pac_response` | CFDI-ready invoices |
| 20 | `invoice_lines` | 16 | `tariff_detail` | Invoice line items with SAT codes |

**JSONB Justification -- `tariff_schedules.blocks`:** This is the key insight from SUPRA (Insight #6). The legacy system uses a 4-level hierarchy (tarifa -> subtarifa -> aplictarif -> concepto) requiring ~15 tables and complex multi-join queries. SUPRA stores blocks as:

```json
[
  {"from_m3": 0,  "to_m3": 10,   "price_per_m3": 5.50,  "fixed_charge": 45.00},
  {"from_m3": 10, "to_m3": 20,   "price_per_m3": 8.75,  "fixed_charge": 0},
  {"from_m3": 20, "to_m3": 40,   "price_per_m3": 15.30, "fixed_charge": 0},
  {"from_m3": 40, "to_m3": null,  "price_per_m3": 25.00, "fixed_charge": 0}
]
```

A new tariff schedule = a new row. Versioning is trivial. The JSONB is queryable via GIN index. Block calculation is a simple loop in application code. No joins needed.

**JSONB Justification -- `additional_concepts`:** Alcantarillado, saneamiento, and other charges vary by municipality and change infrequently. Storing as JSONB alongside tariff blocks keeps the entire tariff definition in one row.

**JSONB Justification -- `tariff_detail` (on `invoice_lines`):** Full breakdown of the calculation (which blocks applied, rates, quantities) stored for audit trail. Read-only after invoice generation. No querying needed beyond the invoice context.

```sql
CREATE TABLE tariff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  explotacion_id UUID REFERENCES explotaciones(id),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(30) NOT NULL,
  effective_from DATE NOT NULL,
  effective_until DATE,
  active BOOLEAN DEFAULT true,
  billing_period VARCHAR(10) NOT NULL,
  blocks JSONB NOT NULL,
  additional_concepts JSONB DEFAULT '[]',
  iva_applicable BOOLEAN DEFAULT false,
  social_discount_pct DECIMAL(5, 2),
  approved_by VARCHAR(200),
  approval_date DATE,
  gazette_reference VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tariffs_active ON tariff_schedules(tenant_id, category, active)
  WHERE active = true;

-- Prevent overlapping tariff validity periods
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE tariff_schedules ADD CONSTRAINT excl_tariff_validity
  EXCLUDE USING gist (
    tenant_id WITH =,
    category WITH =,
    daterange(effective_from, effective_until, '[)') WITH &&
  ) WHERE (active = true);

-- invoices and invoice_lines as defined in SUPRA SS3 (lines 585-700)
-- See full DDL in SUPRA-WATER-2026.md SS3
```

#### Domain 8: Payments and Collections (4 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 21 | `payments` | 22 | (none) | Payment records across all channels |
| 22 | `payment_plans` | 14 | `installments` | Convenios de pago |
| 23 | `delinquency_procedures` | 18 | `steps_history` | Collection procedures with JSONB step tracking |
| 24 | `payment_reconciliations` | 10 | `batch_data` | Batch reconciliation (banks, OXXO) |

**JSONB Justification -- `payment_plans.installments`:** Each installment has a due date, amount, paid status, and linked payment_id. The number of installments varies (3-48). JSONB array avoids a separate `installment` table and keeps the entire plan readable in one query.

**JSONB Justification -- `delinquency_procedures.steps_history`:** Collection procedures have varying step sequences (SMS reminder -> WhatsApp warning -> corte order -> etc.). Each step has different data (delivery status, read receipt, work order ID). JSONB captures this heterogeneous, append-only history naturally.

```sql
CREATE TABLE payment_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  channel VARCHAR(30) NOT NULL,               -- 'spei', 'oxxo', 'banco', 'domiciliacion'
  batch_date DATE NOT NULL,
  batch_reference VARCHAR(100),
  total_amount DECIMAL(14, 2) NOT NULL,
  transaction_count INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'partial', 'failed'
  )),
  batch_data JSONB NOT NULL,                  -- Raw batch file data for audit
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);
```

#### Domain 9: Operations (4 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 25 | `work_orders` | 30 | `photos`, `gps_arrival`, `gps_departure`, `materials` | Unified work orders |
| 26 | `contacts` | 22 | `ai_classification`, `work_order_ids` | CRM contacts and complaints |
| 27 | `fraud_cases` | 19 | `anomaly_data`, `inspections` | Fraud investigation cases |
| 28 | `sla_definitions` | 10 | `escalation_rules` | SLA rules per contact/order type |

**JSONB Justification -- work_orders `photos`, `materials`:** Photos are `[{url, description, taken_at}]` -- variable count, append-only. Materials are `[{item, quantity, unit_cost}]` -- variable per order type. Both are read with the parent record, never queried independently. Separate tables would add complexity for no benefit.

**JSONB Justification -- fraud_cases `inspections`:** Each inspection has date, inspector, findings, photos, result. Variable count per case. Append-only. Queried only in the context of the parent fraud case.

```sql
CREATE TABLE sla_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  entity_type VARCHAR(30) NOT NULL,           -- 'contact', 'work_order', 'fraud_case'
  category VARCHAR(50) NOT NULL,              -- 'consulta', 'queja', 'corte', etc.
  priority VARCHAR(10) NOT NULL,              -- 'urgente', 'alta', 'normal', 'baja'
  response_hours INTEGER NOT NULL,
  resolution_hours INTEGER NOT NULL,
  escalation_rules JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Domain 10: Events and Communications (3 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 29 | `domain_events` | 7 | `payload`, `metadata` | TimescaleDB hypertable -- event store + audit |
| 30 | `communications` | 14 | (none) | Multi-channel communication log |
| 31 | `notification_templates` | 9 | `variables` | Message templates for WhatsApp, email, SMS |

```sql
CREATE TABLE domain_events (
  id UUID DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  aggregate_type VARCHAR(50) NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (id, created_at)
);

SELECT create_hypertable('domain_events', 'created_at',
  chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_events_aggregate ON domain_events(aggregate_type, aggregate_id, created_at DESC);
CREATE INDEX idx_events_type ON domain_events(event_type, created_at DESC);
CREATE INDEX idx_events_tenant ON domain_events(tenant_id, created_at DESC);

CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  channel VARCHAR(20) NOT NULL,               -- 'whatsapp', 'sms', 'email'
  template_key VARCHAR(50) NOT NULL,          -- 'invoice_ready', 'payment_reminder', etc.
  template_name VARCHAR(200) NOT NULL,
  body_template TEXT NOT NULL,                -- Handlebars template
  variables JSONB DEFAULT '[]',               -- Expected variables for template
  whatsapp_template_id VARCHAR(100),          -- Meta-approved template ID
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, channel, template_key)
);
```

#### Domain 11: Configuration and Lookups (3 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 32 | `domain_values` | 10 | `extra` | Polymorphic lookup table (replaces 95 tipo* tables) |
| 33 | `domain_value_links` | 5 | (none) | Many-to-many links between domain values |
| 34 | `sat_catalogs` | 7 | `metadata` | SAT fiscal catalog codes |

```sql
CREATE TABLE domain_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),      -- NULL = global
  domain VARCHAR(50) NOT NULL,                -- 'TIPO_TOMA', 'ESTADO_ORDEN', etc.
  code VARCHAR(30) NOT NULL,
  description VARCHAR(200) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  extra JSONB DEFAULT '{}',                   -- Domain-specific extra attributes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, domain, code)
);

CREATE INDEX idx_domain_values_lookup ON domain_values(domain, code, active);
CREATE INDEX idx_domain_values_extra ON domain_values USING GIN(extra);

CREATE TABLE domain_value_links (
  link_type VARCHAR(50) NOT NULL,
  source_domain VARCHAR(50) NOT NULL,
  source_code VARCHAR(30) NOT NULL,
  target_domain VARCHAR(50) NOT NULL,
  target_code VARCHAR(30) NOT NULL,
  PRIMARY KEY (link_type, source_domain, source_code, target_domain, target_code)
);

CREATE TABLE sat_catalogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_type VARCHAR(30) NOT NULL,          -- 'producto_servicio', 'unidad', 'forma_pago', 'regimen_fiscal'
  code VARCHAR(20) NOT NULL,
  description VARCHAR(300) NOT NULL,
  valid_from DATE,
  valid_until DATE,
  metadata JSONB DEFAULT '{}',
  UNIQUE(catalog_type, code)
);

-- Seed SAT catalog codes for water utilities
INSERT INTO sat_catalogs (catalog_type, code, description) VALUES
  ('producto_servicio', '10171500', 'Suministro de agua'),
  ('producto_servicio', '72151802', 'Servicio de alcantarillado'),
  ('producto_servicio', '72151801', 'Servicio de saneamiento'),
  ('unidad', 'MTQ', 'Metro cubico'),
  ('unidad', 'E48', 'Unidad de servicio'),
  ('unidad', 'H87', 'Pieza'),
  ('forma_pago', '01', 'Efectivo'),
  ('forma_pago', '03', 'Transferencia electronica de fondos'),
  ('forma_pago', '28', 'Tarjeta de debito'),
  ('forma_pago', '04', 'Tarjeta de credito'),
  ('regimen_fiscal', '603', 'Personas morales con fines no lucrativos'),
  ('regimen_fiscal', '601', 'General de ley personas morales'),
  ('regimen_fiscal', '616', 'Sin obligaciones fiscales');
```

#### Domain 12: AI and Analytics (4 tables)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 35 | `ai_embeddings` | 7 | `metadata` | pgvector embeddings for semantic search |
| 36 | `ai_agent_executions` | 12 | `input`, `output`, `tools_used` | Agent execution log |
| 37 | `collection_scores` | 12 | `features` | Predictive collection scoring |
| 38 | `anomaly_models` | 8 | `parameters`, `metrics` | ML model metadata |

```sql
CREATE TABLE ai_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type VARCHAR(50) NOT NULL,           -- 'person', 'contact', 'work_order'
  source_id UUID NOT NULL,
  embedding vector(1536),                     -- OpenAI embedding dimension
  content_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_embeddings_vector ON ai_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE ai_agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_name VARCHAR(50) NOT NULL,
  trigger_type VARCHAR(20) NOT NULL,
  trigger_event_id UUID,
  model VARCHAR(50) NOT NULL,
  input JSONB NOT NULL,
  output JSONB,
  tools_used JSONB DEFAULT '[]',
  tokens_used INTEGER,
  duration_ms INTEGER,
  status VARCHAR(20) DEFAULT 'running',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collection_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  person_id UUID NOT NULL REFERENCES persons(id),
  score DECIMAL(5, 4) NOT NULL,               -- 0-1 probability of payment within 30 days
  risk_tier VARCHAR(20) NOT NULL,             -- 'low', 'medium', 'high', 'vulnerable'
  features JSONB NOT NULL,                    -- Input features for explainability
  total_debt DECIMAL(12, 2) NOT NULL,
  days_overdue INTEGER NOT NULL,
  model_version VARCHAR(20) NOT NULL,
  recommended_action VARCHAR(50),
  scored_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_collection_scores_contract ON collection_scores(tenant_id, contract_id, scored_at DESC);
```

#### Domain 13: Data Sync (3 tables -- migration period only)

| # | Table | Columns | JSONB Columns | Notes |
|---|-------|---------|---------------|-------|
| 39 | `sync_mappings` | 8 | `column_map` | Legacy-to-SUPRA ID mappings |
| 40 | `sync_log` | 9 | `diff` | Bidirectional sync audit log |
| 41 | `sync_conflicts` | 10 | `legacy_data`, `supra_data` | Sync conflict resolution queue |

```sql
CREATE TABLE sync_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,           -- 'persona', 'contrato', 'factura'
  legacy_table VARCHAR(63) NOT NULL,
  legacy_id VARCHAR(50) NOT NULL,             -- Legacy numeric ID as string
  supra_id UUID NOT NULL,
  column_map JSONB,                           -- Detailed column mapping
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(entity_type, legacy_id)
);

CREATE INDEX idx_sync_supra ON sync_mappings(entity_type, supra_id);

CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  direction VARCHAR(10) NOT NULL,             -- 'legacy_to_supra', 'supra_to_legacy'
  operation VARCHAR(10) NOT NULL,             -- 'insert', 'update', 'delete'
  diff JSONB,
  status VARCHAR(20) DEFAULT 'applied',
  error_message TEXT,
  synced_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  legacy_data JSONB NOT NULL,
  supra_data JSONB NOT NULL,
  conflict_type VARCHAR(30) NOT NULL,         -- 'concurrent_update', 'schema_mismatch', 'data_loss'
  resolution VARCHAR(20),                     -- 'legacy_wins', 'supra_wins', 'merged', 'manual'
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ DEFAULT now()
);
```

#### Additional Supporting Tables (21 tables)

| # | Table | Domain | Columns | Notes |
|---|-------|--------|---------|-------|
| 42 | `reading_routes` | Meters | 10 | Route definitions for manual reading |
| 43 | `reading_route_stops` | Meters | 8 | Ordered stops within a route |
| 44 | `invoice_batches` | Billing | 10 | Billing batch (replaces facturacio) |
| 45 | `credit_notes` | Billing | 14 | Nota de credito linked to original invoice |
| 46 | `payment_channels` | Payments | 10 | Payment channel configuration per tenant |
| 47 | `surcharges` | Collections | 10 | Recargo rules per explotacion |
| 48 | `write_offs` | Collections | 10 | Debt write-off records |
| 49 | `work_order_types` | Operations | 8 | Work order type configuration |
| 50 | `crews` | Operations | 8 | Field crew definitions |
| 51 | `crew_members` | Operations | 6 | Crew membership |
| 52 | `inventory_items` | Operations | 10 | Material/parts inventory |
| 53 | `inventory_movements` | Operations | 8 | Stock in/out tracking |
| 54 | `cfdi_cancellations` | Billing | 10 | CFDI cancellation requests and tracking |
| 55 | `regulatory_reports` | Compliance | 10 | CONAGUA/SEMARNAT report tracking |
| 56 | `data_retention_policies` | Compliance | 8 | LFPDPPP retention rules |
| 57 | `arco_requests` | Compliance | 12 | ARCO rights requests (Access, Rectification, Cancellation, Opposition) |
| 58 | `file_attachments` | System | 10 | S3 file references for documents, photos |
| 59 | `webhooks` | System | 10 | Outbound webhook configuration |
| 60 | `webhook_deliveries` | System | 10 | Webhook delivery log |
| 61 | `feature_flags` | System | 8 | Feature flag configuration per tenant |
| 62 | `migrations_legacy` | Sync | 8 | Legacy migration tracking (which entities migrated) |

### 2.2 TimescaleDB Hypertables

Two tables use TimescaleDB hypertables for time-series optimization:

| Hypertable | Chunk Interval | Compression | Retention | Expected Volume |
|------------|---------------|-------------|-----------|-----------------|
| `meter_readings` | 1 month | After 6 months (compress older chunks) | 10 years | ~4.8M rows/year (400K accounts x 12 months) |
| `domain_events` | 1 month | After 12 months | 5 years (then archive) | ~20-50M rows/year (all state changes) |

```sql
-- Compression policies
ALTER TABLE meter_readings SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'tenant_id, meter_id',
  timescaledb.compress_orderby = 'reading_date DESC'
);
SELECT add_compression_policy('meter_readings', INTERVAL '6 months');

ALTER TABLE domain_events SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'tenant_id, aggregate_type',
  timescaledb.compress_orderby = 'created_at DESC'
);
SELECT add_compression_policy('domain_events', INTERVAL '12 months');

-- Retention policies
SELECT add_retention_policy('meter_readings', INTERVAL '10 years');
SELECT add_retention_policy('domain_events', INTERVAL '5 years');

-- Continuous aggregates for dashboards
CREATE MATERIALIZED VIEW daily_consumption
WITH (timescaledb.continuous) AS
SELECT
  tenant_id,
  toma_id,
  time_bucket('1 day', reading_date) AS day,
  AVG(consumption) AS avg_consumption,
  MAX(consumption) AS max_consumption,
  COUNT(*) AS reading_count
FROM meter_readings
WHERE status = 'valid'
GROUP BY tenant_id, toma_id, time_bucket('1 day', reading_date);

SELECT add_continuous_aggregate_policy('daily_consumption',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');
```

### 2.3 PostGIS Columns and Spatial Indexes

| Table | Column | Type | Index | Use Case |
|-------|--------|------|-------|----------|
| `addresses` | `geom` | `GEOGRAPHY(POINT, 4326)` | GIST | Address geocoding, proximity search |
| `sectores_hidraulicos` | `geom` | `GEOGRAPHY(POLYGON, 4326)` | GIST | Sector boundary, point-in-polygon |
| `acometidas` | `geom` | `GEOGRAPHY(POINT, 4326)` | GIST | Connection location |
| `tomas` | `geom` | `GEOGRAPHY(POINT, 4326)` | GIST | Service point mapping, clustering |

```sql
-- Common spatial queries
-- Find all tomas within 500m of a reported leak
SELECT t.toma_number, t.status,
       ST_Distance(t.geom, ST_MakePoint(-100.3899, 20.5888)::geography) AS distance_m
FROM tomas t
WHERE ST_DWithin(t.geom, ST_MakePoint(-100.3899, 20.5888)::geography, 500)
  AND t.tenant_id = current_setting('app.current_tenant')::uuid
ORDER BY distance_m;

-- Find which sector a toma belongs to
SELECT sh.name, sh.code
FROM sectores_hidraulicos sh
WHERE ST_Contains(sh.geom::geometry, (SELECT geom::geometry FROM tomas WHERE id = $1));

-- Cluster fraud cases for geospatial pattern analysis
SELECT ST_ClusterDBSCAN(geom::geometry, eps := 0.001, minpoints := 3) OVER () AS cluster_id,
       fc.*
FROM fraud_cases fc
JOIN addresses a ON fc.address_id = a.id
WHERE fc.tenant_id = current_setting('app.current_tenant')::uuid
  AND fc.status IN ('abierto', 'confirmado');
```

### 2.4 Multi-Tenant RLS Policies

Every table with `tenant_id` gets Row Level Security:

```sql
-- Enable RLS on all tenant-scoped tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'tenant_id'
      AND table_schema = 'public'
    GROUP BY table_name
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);

    -- Tenant isolation policy
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%I ON %I
        USING (tenant_id = current_setting(''app.current_tenant'')::uuid)',
      t, t
    );

    -- Admin bypass policy
    EXECUTE format(
      'CREATE POLICY admin_bypass_%I ON %I
        USING (current_setting(''app.is_admin'', true)::boolean = true)',
      t, t
    );
  END LOOP;
END $$;

-- Middleware sets tenant context on every request
-- SET LOCAL app.current_tenant = '<tenant-uuid>';
-- SET LOCAL app.current_user = '<user-uuid>';
-- SET LOCAL app.is_admin = 'false';
```

### 2.5 Required PostgreSQL Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";         -- bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- Fuzzy text search (trigrams)
CREATE EXTENSION IF NOT EXISTS "postgis";          -- Geospatial
CREATE EXTENSION IF NOT EXISTS "vector";           -- pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS "timescaledb";      -- Time-series
CREATE EXTENSION IF NOT EXISTS "btree_gist";       -- Exclusion constraints for tariff validity
CREATE EXTENSION IF NOT EXISTS "pg_cron";          -- Scheduled jobs (materialized view refresh)
```

---

## 3. Migration Strategy (Legacy to Target)

### 3.1 Two-Track Approach

```
Month:  1     2     3     4     5     6     7     8     9     10
        |-----|-----|-----|-----|-----|-----|-----|-----|-----|
Track A: [Emergency Cleanup] [Security+FK] [Continue cleanup]
         Phase 1: Drop 2643  Phase 4     (as needed)
         Phase 2: Audit       Phase 4b
         consolidation

Track B: [Schema Build]  [Sync Setup] [Domain Migration ------]  [Cutover-]
         Create all 62    Bidirectional Contracts  Billing  Payments  Legacy
         tables + indexes sync engine   + Persons  + Readings         retire

Shared:  [Drizzle ORM setup]  [Data transformation scripts run]
```

### 3.2 Track A: Legacy Emergency Cleanup (Months 1-3)

Preserve the existing DATABASE_OPTIMIZATION_PLAN phases 1-2 exactly as specified, with corrections.

#### Phase A1: Emergency Table Drop (Month 1)

Execute exactly as specified in DATABASE_OPTIMIZATION_PLAN Section 3, with the critical tmpbb fix from Section 3.3:

1. Drop 2,144 `tmp_deuda_*` tables (batch of 500 with CHECKPOINT)
2. Drop 477 `aux_varscreditored_*` tables
3. Drop 22 `tmpbb_*` tables (using CORRECTED schema from Section 3.3)
4. Drop 30 persistent staging/artifact tables
5. Create 3 consolidated replacement tables (`tmp_deuda`, `aux_varscreditored`, `tmpbb`)
6. VACUUM FULL on `pg_class`, `pg_attribute`, `pg_statistic`, `pg_depend`
7. Patch AQUASIS application code: `INSERT INTO tmp_deuda (proceso_id, ...)` instead of `CREATE TABLE tmp_deuda_<ID>`

**Result: 4,114 -> ~1,474 tables**

#### Phase A2: History Consolidation (Month 2)

Execute DATABASE_OPTIMIZATION_PLAN Section 4:

1. Create unified `audit_log` table (partitioned by month)
2. Attach audit triggers to base tables
3. Migrate 120-150 low-value `his*` tables into `audit_log`
4. Keep 18-25 high-value history tables as dedicated tables

**Result: ~1,474 -> ~1,324 tables**

#### Phase A3: Critical Security Fixes (Month 3)

From DATABASE_OPTIMIZATION_PLAN Section 6.4:

1. Hash plaintext passwords (`cliente.cliwebpass`, `persona.prspassweb`) using bcrypt
2. Move `sociedad` credentials to encrypted `sociedad_credentials` table
3. Add `NOT VALID` FK constraints to critical relationships (50-80 constraints)
4. Validate FK constraints in maintenance window

### 3.3 Track B: New Schema Build (Months 1-6)

#### Phase B1: Schema Creation (Month 1, parallel with A1)

```bash
# Create all database init scripts
db/init/
  001-extensions.sql          # All CREATE EXTENSION statements
  002-tenant-org.sql          # tenants, explotaciones, offices, explotacion_configs
  003-auth.sql                # users, sessions, api_keys
  004-persons-addresses.sql   # persons, addresses, person_contacts
  005-infrastructure.sql      # sectores_hidraulicos, acometidas, tomas, meters
  006-contracts.sql           # contracts, contract_notifications
  007-readings.sql            # meter_readings (hypertable)
  008-billing.sql             # tariff_schedules, invoices, invoice_lines, invoice_batches
  009-payments.sql            # payments, payment_plans, payment_reconciliations
  010-collections.sql         # delinquency_procedures, surcharges, write_offs, collection_scores
  011-operations.sql          # work_orders, contacts, fraud_cases, sla_definitions, crews
  012-events.sql              # domain_events (hypertable), communications, notification_templates
  013-config.sql              # domain_values, domain_value_links, sat_catalogs
  014-ai.sql                  # ai_embeddings, ai_agent_executions, anomaly_models
  015-compliance.sql          # regulatory_reports, data_retention_policies, arco_requests
  016-system.sql              # file_attachments, webhooks, webhook_deliveries, feature_flags
  017-sync.sql                # sync_mappings, sync_log, sync_conflicts, migrations_legacy
  018-rls-policies.sql        # RLS policies for all tables
  019-seed-data.sql           # CEA Queretaro tenant, SAT catalogs, domain values
```

#### Phase B2: Sync Engine Setup (Months 2-3)

Build bidirectional sync between legacy `cf_quere_pro` and the new SUPRA schema:

```sql
-- Legacy-side: trigger on persona table to sync to SUPRA persons
CREATE OR REPLACE FUNCTION fn_sync_persona_to_supra()
RETURNS TRIGGER AS $$
DECLARE
  v_supra_id UUID;
BEGIN
  -- Lookup existing mapping
  SELECT supra_id INTO v_supra_id
  FROM sync_mappings
  WHERE entity_type = 'persona' AND legacy_id = NEW.prsid::text;

  IF v_supra_id IS NULL THEN
    -- New record: create in SUPRA
    INSERT INTO persons (tenant_id, person_type, rfc, curp, name,
      first_name, last_name_paterno, last_name_materno,
      phone, created_at)
    VALUES (
      current_setting('app.default_tenant')::uuid,
      CASE WHEN NEW.prstipo = 'F' THEN 'fisica' ELSE 'moral' END,
      NULLIF(trim(NEW.prsnif), ''),
      NULLIF(trim(NEW.prscurp), ''),
      trim(COALESCE(NEW.prsnomape, '') || ' ' || COALESCE(NEW.prsnombre, '')),
      NULLIF(trim(NEW.prsnombre), ''),
      NULLIF(trim(NEW.prsape1), ''),
      NULLIF(trim(NEW.prsape2), ''),
      NULLIF(trim(NEW.prstelef), ''),
      COALESCE(NEW.prsfecreg, now())
    )
    RETURNING id INTO v_supra_id;

    INSERT INTO sync_mappings (entity_type, legacy_table, legacy_id, supra_id)
    VALUES ('persona', 'persona', NEW.prsid::text, v_supra_id);
  ELSE
    -- Existing record: update in SUPRA
    UPDATE persons SET
      rfc = NULLIF(trim(NEW.prsnif), ''),
      name = trim(COALESCE(NEW.prsnomape, '') || ' ' || COALESCE(NEW.prsnombre, '')),
      phone = NULLIF(trim(NEW.prstelef), ''),
      updated_at = now()
    WHERE id = v_supra_id;
  END IF;

  -- Log sync
  INSERT INTO sync_log (entity_type, entity_id, direction, operation)
  VALUES ('persona', NEW.prsid::text, 'legacy_to_supra',
    CASE WHEN TG_OP = 'INSERT' THEN 'insert' ELSE 'update' END);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Entity sync priority order:**

| Priority | Entity | Legacy Table | SUPRA Table | Sync Direction |
|----------|--------|-------------|-------------|----------------|
| 1 | Persons | `persona` | `persons` | Bidirectional |
| 2 | Addresses | `direccion` | `addresses` | Legacy -> SUPRA (with PostGIS conversion) |
| 3 | Service Points | `ptoserv` | `tomas` | Bidirectional |
| 4 | Meters | `contado` | `meters` | Bidirectional |
| 5 | Contracts | `contrato` | `contracts` | Bidirectional |
| 6 | Readings | `lectura` | `meter_readings` | Legacy -> SUPRA |
| 7 | Invoices | `factura` + `linfactura` | `invoices` + `invoice_lines` | Legacy -> SUPRA |
| 8 | Payments | `opecargest` + `opedesglos` | `payments` | Legacy -> SUPRA |
| 9 | Work Orders | `orden` | `work_orders` | Bidirectional |

#### Phase B3: Data Transformation Scripts (Months 3-4)

```sql
-- Transform char(1) S/N to boolean during sync
CREATE OR REPLACE FUNCTION legacy_bool(val CHAR) RETURNS BOOLEAN AS $$
  SELECT CASE WHEN val IN ('S', 'Y', 'X') THEN true ELSE false END;
$$ LANGUAGE sql IMMUTABLE;

-- Transform VARCHAR GPS to PostGIS GEOGRAPHY
CREATE OR REPLACE FUNCTION legacy_gps_to_geom(lat VARCHAR, lng VARCHAR)
RETURNS GEOGRAPHY AS $$
  SELECT CASE
    WHEN lat IS NOT NULL AND lng IS NOT NULL
      AND lat ~ '^-?\d+\.?\d*$' AND lng ~ '^-?\d+\.?\d*$'
    THEN ST_SetSRID(ST_MakePoint(lng::double precision, lat::double precision), 4326)::geography
    ELSE NULL
  END;
$$ LANGUAGE sql IMMUTABLE;

-- Transform numeric money to DECIMAL
-- (double precision -> decimal(12,2) with rounding)
CREATE OR REPLACE FUNCTION legacy_money(val DOUBLE PRECISION) RETURNS DECIMAL(12,2) AS $$
  SELECT ROUND(val::numeric, 2)::DECIMAL(12,2);
$$ LANGUAGE sql IMMUTABLE;

-- Bulk initial data load (run once per entity, then sync triggers take over)
-- Example: Load all personas
INSERT INTO persons (tenant_id, person_type, rfc, curp, name,
  first_name, last_name_paterno, last_name_materno,
  phone, vulnerable, created_at)
SELECT
  (SELECT id FROM tenants WHERE slug = 'cea-queretaro'),
  CASE WHEN p.prstipo = 'F' THEN 'fisica' ELSE 'moral' END,
  NULLIF(trim(p.prsnif), ''),
  NULLIF(trim(p.prscurp), ''),
  trim(COALESCE(p.prsnomape, '') || ' ' || COALESCE(p.prsnombre, '')),
  NULLIF(trim(p.prsnombre), ''),
  NULLIF(trim(p.prsape1), ''),
  NULLIF(trim(p.prsape2), ''),
  NULLIF(trim(p.prstelef), ''),
  false,
  COALESCE(p.prsfecreg, now())
FROM cf_quere_pro.persona p;

-- Load addresses with PostGIS conversion
INSERT INTO addresses (tenant_id, street, exterior_number, colonia,
  municipality, zip_code, geom, created_at)
SELECT
  (SELECT id FROM tenants WHERE slug = 'cea-queretaro'),
  COALESCE(d.dirtexto, ''),
  NULLIF(trim(d.dirnum), ''),
  NULLIF(trim(d.dirbarrio), ''),
  NULLIF(trim(d.dirpob), ''),
  NULLIF(trim(d.dircp), ''),
  legacy_gps_to_geom(g.geoloclat, g.geoloclong),
  COALESCE(d.dirhsthora, now())
FROM cf_quere_pro.direccion d
LEFT JOIN cf_quere_pro.geolocalizacion g ON d.dirid = g.geolocdirid;
```

#### Phase B4: Domain-by-Domain Migration (Months 4-8)

Each domain follows the Strangler Fig pattern:

```
1. Build SUPRA service module (Drizzle + Express router)
2. Set up bidirectional sync for domain entities
3. Run initial bulk data load
4. Validate data consistency (counts, checksums)
5. Route new writes through SUPRA (reads still from legacy)
6. After 1-2 billing cycles: route reads to SUPRA
7. After another cycle: disable sync, legacy becomes read-only
8. Archive and eventually drop legacy tables
```

| Month | Domain | Legacy Tables Affected | SUPRA Tables | Validation |
|-------|--------|----------------------|-------------|------------|
| 4 | Persons + Addresses | `persona`, `cliente`, `direccion`, `personatel`, `personadir` | `persons`, `addresses`, `person_contacts` | Row count match, RFC validation |
| 5 | Infrastructure + Meters | `ptoserv`, `servicio`, `acometida`, `contado` | `tomas`, `acometidas`, `meters`, `sectores_hidraulicos` | GPS -> PostGIS validation, meter serial match |
| 5 | Contracts | `contrato` (104 cols) | `contracts` | Status mapping, tariff category match |
| 6 | Readings | `lectura`, `leclote` | `meter_readings` | TimescaleDB ingestion, consumption calc verification |
| 6 | Billing | `facturacio`, `facturable`, `factura`, `linfactura` | `invoices`, `invoice_lines`, `tariff_schedules`, `invoice_batches` | Invoice total reconciliation |
| 7 | Payments | `opecargest`, `opedesglos`, `remesa`, `cobrobancario` | `payments`, `payment_plans`, `payment_reconciliations` | Payment total reconciliation per period |
| 7 | Collections | `gestreclam`, `pasoproced`, `recargo` | `delinquency_procedures`, `surcharges` | Debt balance match |
| 8 | Work Orders | `orden`, `expedsif` | `work_orders`, `fraud_cases`, `contacts` | Order count, status mapping |

### 3.4 Lookup Table Consolidation

The 95 `tipo*` tables consolidate into `domain_values`:

```sql
-- Automated migration script for simple tipo* tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT 'tipocatcalle' AS table_name, 'tpctcid' AS pk_col, 'tpctctxtid' AS txt_col, 'TIPO_CATCALLE' AS domain
    UNION ALL SELECT 'tipocorreo', 'tpcorid', 'tcortxtid', 'TIPO_CORREO'
    UNION ALL SELECT 'tipooperacion', 'topeid', 'topetxtid', 'TIPO_OPERACION'
    UNION ALL SELECT 'tipositcalle', 'tsitid', 'tsittxtid', 'TIPO_SITCALLE'
    -- ... (41 total)
  LOOP
    EXECUTE format(
      'INSERT INTO domain_values (domain, code, description, active)
       SELECT %L, %I::text, COALESCE(td.tddescri, %I::text), true
       FROM cf_quere_pro.%I t
       LEFT JOIN cf_quere_pro.tabladesc td ON td.tddtddid = %I
       ON CONFLICT (tenant_id, domain, code) DO NOTHING',
      r.domain, r.pk_col, r.pk_col, r.table_name, r.txt_col
    );
  END LOOP;
END $$;
```

### 3.5 God Table Decomposition

The `explotacion` (350 columns) maps to `explotaciones` (12 columns) + `explotacion_configs` (14 JSONB columns):

```sql
-- Extract billing config as JSONB
INSERT INTO explotacion_configs (explotacion_id, tenant_id, billing)
SELECT
  sm.supra_id,
  (SELECT id FROM tenants WHERE slug = 'cea-queretaro'),
  jsonb_build_object(
    'cycle_days', e.expdiasvencfact,
    'max_months', e.expmaxmensfact,
    'auto_create', legacy_bool(e.expsncrearfact),
    'simulation_mode', legacy_bool(e.expsnsimulacion),
    'require_approval', legacy_bool(e.expsnrevision),
    'billing_group_size', e.expnumfactgrupo,
    'invoice_copies', e.expnumcopias
    -- ... all 45 billing columns as JSONB keys
  )
FROM cf_quere_pro.explotacion e
JOIN sync_mappings sm ON sm.entity_type = 'explotacion' AND sm.legacy_id = e.expid::text;
```

The `contrato` (104 columns) maps to `contracts` (24 columns), with billing config in `explotacion_configs`, fiscal data in `persons`, and notification preferences in `contract_notifications`.

---

## 4. Drizzle ORM Schema Files

### 4.1 File Structure

```
db/schema/
  index.ts               # Re-exports all schemas
  tenants.ts             # tenants, explotaciones, offices, explotacion_configs
  auth.ts                # users, sessions, api_keys
  persons.ts             # persons, addresses, person_contacts
  infrastructure.ts      # sectores_hidraulicos, acometidas, tomas, meters
  contracts.ts           # contracts, contract_notifications
  readings.ts            # meter_readings
  billing.ts             # tariff_schedules, invoices, invoice_lines, invoice_batches
  payments.ts            # payments, payment_plans, payment_reconciliations
  collections.ts         # delinquency_procedures, surcharges, write_offs, collection_scores
  operations.ts          # work_orders, contacts, fraud_cases, sla_definitions, crews
  events.ts              # domain_events, communications, notification_templates
  config.ts              # domain_values, domain_value_links, sat_catalogs
  ai.ts                  # ai_embeddings, ai_agent_executions, anomaly_models
  compliance.ts          # regulatory_reports, data_retention_policies, arco_requests
  system.ts              # file_attachments, webhooks, webhook_deliveries, feature_flags
  sync.ts                # sync_mappings, sync_log, sync_conflicts
  relations.ts           # All table relations for Drizzle relational queries
```

### 4.2 Example Schema File: `db/schema/persons.ts`

```typescript
import {
  pgTable, uuid, varchar, text, boolean, decimal,
  timestamp, jsonb, index, uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { contracts } from './contracts';

// ============================================================
// PERSONS
// ============================================================

export const persons = pgTable('persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),

  // Identity
  personType: varchar('person_type', { length: 10 }).notNull(),
  rfc: varchar('rfc', { length: 13 }),
  curp: varchar('curp', { length: 18 }),
  name: varchar('name', { length: 200 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastNamePaterno: varchar('last_name_paterno', { length: 100 }),
  lastNameMaterno: varchar('last_name_materno', { length: 100 }),

  // Contact
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  phoneSecondary: varchar('phone_secondary', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),

  // Fiscal
  fiscalRegime: varchar('fiscal_regime', { length: 3 }),
  fiscalUse: varchar('fiscal_use', { length: 4 }),
  fiscalAddress: jsonb('fiscal_address'),
  zipCode: varchar('zip_code', { length: 5 }),

  // Flags
  vulnerable: boolean('vulnerable').default(false),
  vulnerabilityType: varchar('vulnerability_type', { length: 50 }),
  digitalAccess: boolean('digital_access').default(false),
  preferredChannel: varchar('preferred_channel', { length: 20 }).default('whatsapp'),
  language: varchar('language', { length: 5 }).default('es-MX'),

  // Metadata
  notes: text('notes'),
  tags: varchar('tags', { length: 50 }).array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_persons_tenant').on(table.tenantId),
  index('idx_persons_rfc').on(table.tenantId, table.rfc),
  index('idx_persons_curp').on(table.tenantId, table.curp),
  index('idx_persons_phone').on(table.tenantId, table.phone),
  uniqueIndex('uq_persons_tenant_rfc').on(table.tenantId, table.rfc),
  // Note: GIN index on name requires raw SQL migration
]);

export const personsRelations = relations(persons, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [persons.tenantId],
    references: [tenants.id],
  }),
  contracts: many(contracts),
  contacts: many(personContacts),
}));

// ============================================================
// ADDRESSES
// ============================================================

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  explotacionId: uuid('explotacion_id'),

  // Mexican address structure
  street: varchar('street', { length: 200 }).notNull(),
  exteriorNumber: varchar('exterior_number', { length: 20 }),
  interiorNumber: varchar('interior_number', { length: 20 }),
  colonia: varchar('colonia', { length: 200 }),
  municipality: varchar('municipality', { length: 100 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }).default('Queretaro'),
  zipCode: varchar('zip_code', { length: 5 }),
  country: varchar('country', { length: 2 }).default('MX'),

  // Geolocation (lat/lng stored separately for app convenience;
  // geom column requires raw SQL migration for PostGIS type)
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  // Metadata
  addressType: varchar('address_type', { length: 20 }).default('callejero'),
  validated: boolean('validated').default(false),
  inegiCveLoc: varchar('inegi_cve_loc', { length: 20 }),
  sepomexValidated: boolean('sepomex_validated').default(false),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_addresses_tenant').on(table.tenantId),
  // Note: GIST and GIN indexes require raw SQL migration
]);

// ============================================================
// PERSON CONTACTS
// ============================================================

export const personContacts = pgTable('person_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id').notNull().references(() => persons.id),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  contactType: varchar('contact_type', { length: 20 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  label: varchar('label', { length: 50 }),
  verified: boolean('verified').default(false),
  primaryContact: boolean('primary_contact').default(false),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const personContactsRelations = relations(personContacts, ({ one }) => ({
  person: one(persons, {
    fields: [personContacts.personId],
    references: [persons.id],
  }),
}));
```

### 4.3 Example Schema File: `db/schema/billing.ts`

```typescript
import {
  pgTable, uuid, varchar, text, boolean, decimal, date,
  timestamp, jsonb, integer, index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { contracts } from './contracts';

export const tariffSchedules = pgTable('tariff_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  explotacionId: uuid('explotacion_id'),
  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 30 }).notNull(),
  effectiveFrom: date('effective_from').notNull(),
  effectiveUntil: date('effective_until'),
  active: boolean('active').default(true),
  billingPeriod: varchar('billing_period', { length: 10 }).notNull(),
  blocks: jsonb('blocks').notNull(),
  additionalConcepts: jsonb('additional_concepts').default([]),
  ivaApplicable: boolean('iva_applicable').default(false),
  socialDiscountPct: decimal('social_discount_pct', { precision: 5, scale: 2 }),
  approvedBy: varchar('approved_by', { length: 200 }),
  approvalDate: date('approval_date'),
  gazetteReference: varchar('gazette_reference', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_tariffs_active').on(table.tenantId, table.category, table.active),
]);

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  contractId: uuid('contract_id').notNull().references(() => contracts.id),
  personId: uuid('person_id').notNull(),
  tomaId: uuid('toma_id').notNull(),
  explotacionId: uuid('explotacion_id').notNull(),
  invoiceNumber: varchar('invoice_number', { length: 30 }),
  folioFiscal: uuid('folio_fiscal'),
  serie: varchar('serie', { length: 10 }),
  invoiceType: varchar('invoice_type', { length: 20 }).notNull(),
  origin: varchar('origin', { length: 20 }).notNull(),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  billingDate: date('billing_date').notNull(),
  dueDate: date('due_date').notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  ivaAmount: decimal('iva_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull().default('0'),
  currency: varchar('currency', { length: 3 }).default('MXN'),
  readingId: uuid('reading_id'),
  consumptionM3: decimal('consumption_m3', { precision: 10, scale: 3 }),
  previousReading: decimal('previous_reading', { precision: 12, scale: 3 }),
  currentReading: decimal('current_reading', { precision: 12, scale: 3 }),
  status: varchar('status', { length: 20 }).notNull().default('provisional'),
  cfdiStatus: varchar('cfdi_status', { length: 20 }),
  cfdiXml: text('cfdi_xml'),
  cfdiPdfUrl: varchar('cfdi_pdf_url', { length: 500 }),
  cfdiStampDate: timestamp('cfdi_stamp_date', { withTimezone: true }),
  cfdiCancellationDate: timestamp('cfdi_cancellation_date', { withTimezone: true }),
  pacResponse: jsonb('pac_response'),
  paymentReference: varchar('payment_reference', { length: 30 }),
  speiReference: varchar('spei_reference', { length: 20 }),
  relatedInvoiceId: uuid('related_invoice_id'),
  delivered: boolean('delivered').default(false),
  deliveryChannel: varchar('delivery_channel', { length: 20 }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  index('idx_invoices_contract').on(table.tenantId, table.contractId),
  index('idx_invoices_person').on(table.tenantId, table.personId),
  index('idx_invoices_status').on(table.tenantId, table.status),
]);

export const invoiceLines = pgTable('invoice_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id').notNull(),
  conceptCode: varchar('concept_code', { length: 20 }).notNull(),
  conceptName: varchar('concept_name', { length: 200 }).notNull(),
  subconceptCode: varchar('subconcept_code', { length: 20 }),
  subconceptName: varchar('subconcept_name', { length: 200 }),
  ownerEntity: varchar('owner_entity', { length: 50 }),
  quantity: decimal('quantity', { precision: 12, scale: 3 }).default('1'),
  unitPrice: decimal('unit_price', { precision: 12, scale: 4 }).default('0'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  ivaRate: decimal('iva_rate', { precision: 5, scale: 4 }).default('0'),
  ivaAmount: decimal('iva_amount', { precision: 12, scale: 2 }).default('0'),
  total: decimal('total', { precision: 12, scale: 2 }).notNull().default('0'),
  tariffDetail: jsonb('tariff_detail'),
  claveProdServ: varchar('clave_prod_serv', { length: 10 }),
  claveUnidad: varchar('clave_unidad', { length: 5 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

### 4.4 TypeScript Type Generation

Drizzle ORM generates types directly from the schema:

```typescript
// src/types/database.ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '../../db/schema';

// Select types (for reading from DB)
export type Person = InferSelectModel<typeof schema.persons>;
export type Address = InferSelectModel<typeof schema.addresses>;
export type Contract = InferSelectModel<typeof schema.contracts>;
export type Invoice = InferSelectModel<typeof schema.invoices>;
export type InvoiceLine = InferSelectModel<typeof schema.invoiceLines>;
export type Payment = InferSelectModel<typeof schema.payments>;
export type MeterReading = InferSelectModel<typeof schema.meterReadings>;
export type TariffSchedule = InferSelectModel<typeof schema.tariffSchedules>;
export type WorkOrder = InferSelectModel<typeof schema.workOrders>;
export type DomainEvent = InferSelectModel<typeof schema.domainEvents>;

// Insert types (for writing to DB)
export type NewPerson = InferInsertModel<typeof schema.persons>;
export type NewContract = InferInsertModel<typeof schema.contracts>;
export type NewInvoice = InferInsertModel<typeof schema.invoices>;
export type NewPayment = InferInsertModel<typeof schema.payments>;
export type NewMeterReading = InferInsertModel<typeof schema.meterReadings>;
```

### 4.5 Zod Validation Integration

```typescript
// src/modules/billing/validators.ts
import { z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { tariffSchedules, invoices } from '../../db/schema/billing';

// Auto-generated from Drizzle schema
export const insertTariffSchema = createInsertSchema(tariffSchedules, {
  // Override with stricter validation
  blocks: z.array(z.object({
    from_m3: z.number().min(0),
    to_m3: z.number().nullable(),
    price_per_m3: z.number().min(0),
    fixed_charge: z.number().min(0).default(0),
  })).min(1),
  additionalConcepts: z.array(z.object({
    code: z.string(),
    name: z.string(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0),
    base: z.string().optional(),
  })).default([]),
  category: z.enum([
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'social'
  ]),
  billingPeriod: z.enum(['mensual', 'bimestral', 'trimestral']),
});

export const selectTariffSchema = createSelectSchema(tariffSchedules);

// Explotacion configs Zod schema (validates JSONB structure)
export const billingConfigSchema = z.object({
  cycle_days: z.number().int().min(1).max(90).default(30),
  max_months: z.number().int().min(1).max(24).default(12),
  auto_create: z.boolean().default(false),
  simulation_mode: z.boolean().default(false),
  require_approval: z.boolean().default(true),
  billing_group_size: z.number().int().min(1).default(1000),
  invoice_copies: z.number().int().min(1).max(5).default(1),
});

export const collectionsConfigSchema = z.object({
  grace_days: z.number().int().min(0).max(90).default(15),
  surcharge_rate: z.number().min(0).max(1).default(0.02),
  interest_rate: z.number().min(0).max(1).default(0),
  min_debt_for_cut: z.number().min(0).default(500),
  max_payment_plan_months: z.number().int().min(1).max(48).default(24),
  vulnerability_protection: z.boolean().default(true),
});

// Fiscal address schema (validates JSONB in persons.fiscal_address)
export const fiscalAddressSchema = z.object({
  calle: z.string().max(200),
  numero_exterior: z.string().max(20).optional(),
  numero_interior: z.string().max(20).optional(),
  colonia: z.string().max(200),
  municipio: z.string().max(100),
  estado: z.string().max(50),
  pais: z.string().max(2).default('MEX'),
  codigo_postal: z.string().length(5),
});
```

### 4.6 Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

---

## 5. Performance Considerations

### 5.1 Indexing Strategy

| Index Type | Use Case | Tables | Example |
|------------|----------|--------|---------|
| **B-tree** (default) | Equality and range queries on FKs, status columns | All tables | `idx_contracts_person ON contracts(tenant_id, person_id)` |
| **GIN** | JSONB containment queries, array operators | `tariff_schedules`, `domain_values`, `explotacion_configs` | `idx_domain_values_extra ON domain_values USING GIN(extra)` |
| **GIN (pg_trgm)** | Fuzzy text search | `persons`, `addresses` | `idx_persons_name ON persons USING gin(name gin_trgm_ops)` |
| **GIST** | PostGIS spatial queries, exclusion constraints | `addresses`, `tomas`, `sectores_hidraulicos`, `tariff_schedules` | `idx_addresses_geo ON addresses USING GIST(geom)` |
| **IVFFlat** | pgvector similarity search | `ai_embeddings` | `idx_embeddings_vector USING ivfflat (embedding vector_cosine_ops)` |
| **Partial** | Filter out inactive/irrelevant rows | `invoices`, `tariff_schedules` | `idx_invoices_due ON invoices(tenant_id, due_date) WHERE status IN ('pendiente', 'impagada')` |
| **Composite** | Multi-column lookups with tenant isolation | All tenant-scoped tables | `idx_readings_meter ON meter_readings(tenant_id, meter_id, reading_date DESC)` |

**Indexing rules:**
1. Every `tenant_id` column is the leading column in every composite index (for RLS performance).
2. Every foreign key gets a B-tree index (for JOIN performance and cascade deletes).
3. Every `status` column gets a composite index with `tenant_id`.
4. JSONB columns used in WHERE clauses get GIN indexes.
5. TimescaleDB hypertables get automatically partitioned indexes.

### 5.2 Partitioning Strategy

| Table | Strategy | Partition Key | Interval | Rationale |
|-------|----------|--------------|----------|-----------|
| `meter_readings` | TimescaleDB hypertable | `reading_date` | 1 month | Time-series queries always filter by date range |
| `domain_events` | TimescaleDB hypertable | `created_at` | 1 month | Event queries always filter by time window |
| `communications` | Range partitioning | `created_at` | 3 months | High volume, queried by date range |
| `ai_agent_executions` | Range partitioning | `created_at` | 1 month | High volume, retention-managed |

No additional partitioning is needed beyond TimescaleDB for `meter_readings` and `domain_events`. The core transactional tables (`contracts`, `invoices`, `payments`) have volumes manageable by standard PostgreSQL indexes at ~400K accounts.

### 5.3 Connection Pooling

```yaml
# PgBouncer configuration
[pgbouncer]
listen_port = 6432
listen_addr = 0.0.0.0
auth_type = md5
pool_mode = transaction              # Transaction pooling for Drizzle ORM
max_client_conn = 200
default_pool_size = 25               # Per database/user pair
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
server_lifetime = 3600
server_idle_timeout = 600
server_connect_timeout = 5
query_timeout = 30
```

**Application-side:**
```typescript
// src/config/database.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../db/schema';

const connectionString = process.env.DATABASE_URL!;

const queryClient = postgres(connectionString, {
  max: 25,                            // Match PgBouncer pool
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,                     // Required for PgBouncer transaction mode
});

export const db = drizzle(queryClient, { schema });

// Tenant context middleware
export async function withTenant(tenantId: string, fn: () => Promise<any>) {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SET LOCAL app.current_tenant = ${tenantId}`
    );
    await tx.execute(
      sql`SET LOCAL app.current_user = ${getCurrentUserId()}`
    );
    return fn();
  });
}
```

### 5.4 Query Optimization for Common Patterns

#### Pattern 1: Account Lookup (most frequent query)

```typescript
// Find account by toma_number, contract_number, or RFC
const account = await db
  .select({
    contract: contracts,
    person: persons,
    toma: tomas,
    lastReading: meter_readings,
  })
  .from(contracts)
  .innerJoin(persons, eq(contracts.personId, persons.id))
  .innerJoin(tomas, eq(contracts.tomaId, tomas.id))
  .leftJoin(meter_readings, and(
    eq(meter_readings.tomaId, tomas.id),
    eq(meter_readings.status, 'valid')
  ))
  .where(and(
    eq(contracts.tenantId, tenantId),
    or(
      eq(contracts.contractNumber, searchTerm),
      eq(tomas.tomaNumber, searchTerm),
      eq(persons.rfc, searchTerm)
    )
  ))
  .orderBy(desc(meter_readings.readingDate))
  .limit(1);
```

Indexes used: `idx_contracts_status`, `idx_persons_rfc`, `uq_tomas_tenant_number`.

#### Pattern 2: Billing Query (run during billing cycle)

```typescript
// Get all billable contracts with tariff and latest reading
const billable = await db
  .select()
  .from(contracts)
  .innerJoin(tomas, eq(contracts.tomaId, tomas.id))
  .innerJoin(tariffSchedules, and(
    eq(tariffSchedules.category, tomas.tariffCategory),
    eq(tariffSchedules.active, true),
    lte(tariffSchedules.effectiveFrom, sql`CURRENT_DATE`),
    or(
      isNull(tariffSchedules.effectiveUntil),
      gte(tariffSchedules.effectiveUntil, sql`CURRENT_DATE`)
    )
  ))
  .where(and(
    eq(contracts.tenantId, tenantId),
    eq(contracts.status, 'activo'),
    eq(tomas.status, 'activa')
  ));
```

#### Pattern 3: Debt Summary (agent/portal query)

```sql
-- Optimized debt summary for a contract
SELECT
  c.contract_number,
  COUNT(i.id) AS unpaid_invoices,
  SUM(i.total) AS total_debt,
  MIN(i.due_date) AS oldest_due_date,
  MAX(i.due_date) AS newest_due_date
FROM invoices i
JOIN contracts c ON i.contract_id = c.id
WHERE i.tenant_id = current_setting('app.current_tenant')::uuid
  AND i.status IN ('pendiente', 'impagada')
  AND c.id = $1
GROUP BY c.contract_number;

-- Uses: idx_invoices_status (partial index on pending/unpaid)
```

### 5.5 Estimated Storage and Growth

| Table | Initial Rows | Annual Growth | Row Size (avg) | Year 1 Size |
|-------|-------------|---------------|---------------|-------------|
| `persons` | ~400K | ~20K/year | 500 bytes | ~200 MB |
| `contracts` | ~400K | ~20K/year | 400 bytes | ~160 MB |
| `tomas` | ~400K | ~5K/year | 350 bytes | ~140 MB |
| `meters` | ~350K | ~15K/year | 300 bytes | ~105 MB |
| `meter_readings` | ~4.8M backload | ~4.8M/year | 200 bytes | ~2 GB |
| `invoices` | ~4.8M backload | ~4.8M/year | 600 bytes | ~3 GB |
| `invoice_lines` | ~15M backload | ~15M/year | 250 bytes | ~4 GB |
| `payments` | ~3M backload | ~3M/year | 300 bytes | ~1 GB |
| `domain_events` | 0 | ~20-50M/year | 500 bytes | ~10-25 GB |
| **Total estimated** | | | | **~25-40 GB** |

This is well within single-server PostgreSQL capabilities. Compression on TimescaleDB hypertables will reduce `meter_readings` and `domain_events` storage by 80-90% for data older than 6-12 months.

---

## 6. Sprint Breakdown

### Overview: 20-Week Plan (5 Months)

```
Sprint  Weeks    Focus
------  ------   ----------------------------------------
  1     1-2      Schema DDL + Extensions + Docker + Drizzle setup
  2     3-4      Legacy cleanup Phase A1 + Sync engine foundation
  3     5-6      Persons/Addresses migration + RLS policies
  4     7-8      Infrastructure/Meters migration + PostGIS
  5     9-10     Contracts migration + Billing schema
  6     11-12    Readings migration (TimescaleDB) + Tariff import
  7     13-14    Invoices/Billing migration + CFDI tables
  8     15-16    Payments migration + Collections schema
  9     17-18    Work Orders/Fraud/Contacts migration
 10     19-20    Validation, performance tuning, cutover preparation
```

### Sprint 1: Foundation (Weeks 1-2)

**Deliverables:**
- All 62 tables created in SUPRA PostgreSQL instance
- All extensions installed (TimescaleDB, PostGIS, pgvector, pg_trgm, pgcrypto)
- TimescaleDB hypertables configured (meter_readings, domain_events)
- RLS policies applied to all tenant-scoped tables
- Drizzle ORM schema files for all 16 domains
- Zod validation schemas for all JSONB columns
- Docker Compose for local dev (PostgreSQL 16 + TimescaleDB + Redis)
- Seed script for CEA Queretaro tenant + SAT catalogs + domain values
- drizzle.config.ts + initial migration

**Dependencies:** DevOps team provides Docker base images, CI pipeline.

**SQL deliverables:**
```
db/init/001-extensions.sql through 019-seed-data.sql
db/schema/*.ts (16 files)
drizzle.config.ts
docker-compose.yml (database services)
scripts/seed-tenant.ts
```

### Sprint 2: Legacy Cleanup + Sync Foundation (Weeks 3-4)

**Deliverables:**
- Track A: Execute Phase A1 emergency cleanup (drop 2,643 tables)
- Track A: VACUUM catalog tables
- Track A: Verify legacy app patched for tmp_deuda pattern
- Track B: Sync engine tables created (sync_mappings, sync_log, sync_conflicts)
- Track B: Sync utility functions (legacy_bool, legacy_gps_to_geom, legacy_money)
- Track B: Sync trigger template for legacy-to-SUPRA direction

**Dependencies:** Application team patches AQUASIS tmp_deuda code. DBA access to legacy database for DROP operations.

### Sprint 3: Persons and Addresses (Weeks 5-6)

**Deliverables:**
- Bulk load all persona -> persons (with RFC/CURP normalization)
- Bulk load all direccion -> addresses (with PostGIS geom conversion)
- Bulk load personatel + persona.prstelef* -> person_contacts
- Sync triggers on legacy persona table
- ID mapping in sync_mappings for all loaded entities
- Drizzle persons module (CRUD + validators)
- Address fuzzy search working (normalized_text + gin_trgm_ops)

**Validation:**
- Row count match between legacy and SUPRA
- RFC format validation (100% valid or logged as exceptions)
- PostGIS geom populated for all addresses with valid GPS
- Fuzzy search returns correct results for sample addresses

### Sprint 4: Infrastructure and Meters (Weeks 7-8)

**Deliverables:**
- Load sectores_hidraulicos from legacy sector/population data
- Load acometidas from legacy acometida table
- Load tomas from legacy ptoserv (with status mapping, PostGIS)
- Load meters from legacy contado (with smart meter flag detection)
- Sync triggers on ptoserv, contado
- Drizzle infrastructure module

**Dependencies:** GIS team provides sector boundary polygons for sectores_hidraulicos.geom.

### Sprint 5: Contracts and Billing Schema (Weeks 9-10)

**Deliverables:**
- Load contracts from legacy contrato (104 cols -> 24 cols + JSONB)
- Load contract_notifications from legacy contrato notification columns
- Tariff schedule import (legacy 4-level hierarchy -> JSONB blocks)
- SAT catalog codes seeded
- Domain values loaded from legacy tipo* tables (41+ tables -> domain_values)
- Sync triggers on contrato

**Key transformation:**
```sql
-- Transform legacy tariff hierarchy to JSONB blocks
INSERT INTO tariff_schedules (tenant_id, name, category, effective_from, blocks, additional_concepts)
SELECT
  (SELECT id FROM tenants WHERE slug = 'cea-queretaro'),
  t.tardesc,
  CASE t.tartipo
    WHEN 1 THEN 'domestica' WHEN 2 THEN 'comercial'
    WHEN 3 THEN 'industrial' WHEN 4 THEN 'gobierno'
    ELSE 'domestica'
  END,
  t.tarfecini,
  (SELECT jsonb_agg(jsonb_build_object(
    'from_m3', at.aptlimi,
    'to_m3', at.aptlimf,
    'price_per_m3', at.aptprecio,
    'fixed_charge', COALESCE(at.aptcuotafija, 0)
  ) ORDER BY at.aptlimi)
  FROM cf_quere_pro.aplictarif at
  WHERE at.apttarid = t.tarid AND at.aptfecapl = t.tarfecini),
  '[]'::jsonb
FROM cf_quere_pro.tarifa t
WHERE t.tarfecfin IS NULL OR t.tarfecfin > CURRENT_DATE;
```

### Sprint 6: Readings Migration (Weeks 11-12)

**Deliverables:**
- Historical readings loaded into TimescaleDB hypertable (backload ~4.8M rows)
- Compression policy configured for data > 6 months
- Continuous aggregate `daily_consumption` created
- Reading ingestion pipeline tested (smart meter + manual)
- Anomaly detection score column populated for historical readings

**Performance validation:**
- Query: last 12 readings for a meter < 10ms
- Query: daily consumption aggregate for a sector < 50ms
- Compression ratio for historical data > 80%

### Sprint 7: Invoices and Billing (Weeks 13-14)

**Deliverables:**
- Historical invoices loaded (~4.8M) with invoice_lines (~15M)
- Invoice batch system operational
- CFDI-related columns and cfdi_cancellations table functional
- Tariff calculation verified against legacy billing for 100 sample contracts
- Invoice generation from reading -> invoice pipeline tested end-to-end

**Critical validation:**
```sql
-- Reconcile invoice totals between legacy and SUPRA
SELECT
  'legacy' AS source,
  COUNT(*) AS invoice_count,
  SUM(factotal) AS total_billed
FROM cf_quere_pro.factura
WHERE facfecfact >= '2025-01-01'
UNION ALL
SELECT
  'supra',
  COUNT(*),
  SUM(total)
FROM invoices
WHERE billing_date >= '2025-01-01';
-- Totals must match within 0.01%
```

### Sprint 8: Payments and Collections (Weeks 15-16)

**Deliverables:**
- Historical payments loaded (~3M)
- Payment reconciliation system operational
- Delinquency procedures migrated with steps_history JSONB
- Collection scoring model initial run
- Payment plan migration

**Dependencies:** Backend team provides payment gateway integration (Conekta, SPEI).

### Sprint 9: Operations and CRM (Weeks 17-18)

**Deliverables:**
- Work orders migrated from legacy orden + expedsif
- Fraud cases created from legacy expedsif (fraud type)
- Contacts/complaints system operational
- SLA definitions configured per work order type
- Crews and crew_members populated

### Sprint 10: Validation and Cutover Preparation (Weeks 19-20)

**Deliverables:**
- Full data consistency validation across all domains
- Performance benchmark suite (target: all queries < 100ms p95)
- Sync conflict resolution queue cleared (zero open conflicts)
- Runbook for legacy cutover (per-domain switch plan)
- Load testing: simulate 1 billing cycle (400K invoices)
- Disaster recovery test: restore from backup within 1 hour
- Documentation: schema diagrams, Drizzle API reference, migration runbook

**Cutover criteria (all must pass):**
- Zero data discrepancies in reconciliation queries
- All billing calculations match within 0.01%
- Payment totals reconcile 100%
- All 62 tables have RLS policies active
- p95 query latency < 100ms for top 20 queries
- TimescaleDB compression working for historical data
- Backup/restore tested and documented

---

## 7. Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Bidirectional sync conflicts during parallel operation | HIGH | MEDIUM | Conflict resolution queue with manual review; "SUPRA wins" default for new-module domains |
| AQUASIS tmp_deuda patch not applied, tables re-accumulate | HIGH | MEDIUM | Block Phase A1 execution until patch confirmed; set `tredroptablastemporales = 1` as interim |
| Legacy tariff structure doesn't map cleanly to JSONB blocks | MEDIUM | HIGH | Manual review of all active tariff schedules; keep legacy tariff tables as read-only reference during migration |
| TimescaleDB chunk management overhead | LOW | MEDIUM | Standard chunk interval (1 month); compression policy; retention policy; monitor with `timescaledb_information.chunks` |
| PostGIS conversion fails for dirty GPS data | MEDIUM | LOW | `legacy_gps_to_geom` function handles NULL/malformed gracefully; log exceptions; geocode from address as fallback |
| JSONB schema drift (blocks structure changes without validation) | MEDIUM | HIGH | Zod validation at every write path; database CHECK constraints on critical JSONB; CI tests for JSONB shape |
| RLS policy performance overhead | LOW | MEDIUM | `tenant_id` is leading column in all indexes; RLS uses simple equality check; benchmark shows <5% overhead |
| Drizzle ORM limitations with PostGIS/TimescaleDB types | MEDIUM | LOW | Use raw SQL via `db.execute()` for spatial queries and hypertable DDL; Drizzle handles all standard CRUD |
| pgvector index rebuild time for large embedding sets | LOW | LOW | IVFFlat index with appropriate list count; rebuild during maintenance window |
| Legacy data quality issues (orphaned records, inconsistent states) | HIGH | MEDIUM | Pre-migration data quality scripts; orphan detection before FK constraint validation; quarantine table for unresolvable records |

### Rollback Strategy

Every migration sprint produces a rollback script:

1. **Schema rollback:** `drizzle-kit` generates down migrations.
2. **Data rollback:** Sync mappings allow reverse-direction data flow (SUPRA -> legacy).
3. **Cutover rollback:** Legacy database maintained in read-only mode for 3 months post-cutover. Reconnecting the legacy app requires changing a connection string, not a data restore.

---

## 8. Appendices

### Appendix A: Table Count Summary

| Domain | Tables | JSONB-heavy | Hypertable | PostGIS |
|--------|--------|-------------|------------|---------|
| Tenant/Org | 4 | 3 | - | - |
| Auth | 3 | 2 | - | - |
| Persons/Addresses | 3 | 2 | - | 1 |
| Infrastructure | 4 | - | - | 3 |
| Contracts | 2 | 3 | - | - |
| Readings | 1 | - | 1 | - |
| Billing | 3+1 | 3 | - | - |
| Payments/Collections | 4 | 2 | - | - |
| Operations | 4 | 5 | - | - |
| Events/Comms | 3 | 2 | 1 | - |
| Config/Lookups | 3 | 2 | - | - |
| AI/Analytics | 4 | 5 | - | - |
| Sync (temporary) | 3 | 3 | - | - |
| Supporting | 21 | ~5 | - | - |
| **TOTAL** | **62** | **~37** | **2** | **4** |

### Appendix B: JSONB vs Relational Decision Matrix

| Data | JSONB? | Rationale |
|------|--------|-----------|
| Tariff blocks | YES | Eliminates 15-table hierarchy; versionable; queryable; calculated in app |
| Work order photos | YES | Variable count; append-only; never queried independently |
| Work order materials | YES | Variable count; read with parent; never aggregated across orders |
| Delinquency steps | YES | Heterogeneous step data; append-only; read with parent |
| Fraud inspections | YES | Variable count; append-only; read with parent |
| Payment plan installments | YES | Known count but variable; status tracking per installment |
| Explotacion config (per domain) | YES | 350 legacy columns -> 8 typed JSONB columns; Zod-validated |
| Person fiscal address | YES | Variable structure; needed only for CFDI generation |
| Invoice line tariff detail | YES | Audit trail of calculation; write-once; read with invoice |
| Person contacts (phone, email) | NO | Need independent queries (find by phone); normalized table |
| Invoice lines | NO | Need SUM/GROUP BY aggregation across invoices; financial data |
| Payments | NO | Need reconciliation queries, aggregation, joins |
| Contracts | NO | Core transactional entity; heavy WHERE/JOIN usage |
| Meter readings | NO | Time-series; need TimescaleDB aggregation functions |

### Appendix C: Migration Checkpoint Queries

Run after every sprint to validate migration progress:

```sql
-- Entity count reconciliation
SELECT
  entity_type,
  COUNT(*) AS mapped_count,
  (SELECT COUNT(*) FROM sync_log WHERE entity_type = sm.entity_type AND status = 'applied') AS synced_ops,
  (SELECT COUNT(*) FROM sync_conflicts WHERE entity_type = sm.entity_type AND resolution IS NULL) AS open_conflicts
FROM sync_mappings sm
GROUP BY entity_type
ORDER BY entity_type;

-- Financial reconciliation (run monthly)
WITH legacy_totals AS (
  SELECT
    'invoices' AS entity,
    COUNT(*) AS count,
    SUM(factotal) AS total
  FROM cf_quere_pro.factura
  WHERE facfecfact >= '2025-01-01'
),
supra_totals AS (
  SELECT
    'invoices',
    COUNT(*),
    SUM(total)
  FROM invoices
  WHERE billing_date >= '2025-01-01'
)
SELECT
  l.entity,
  l.count AS legacy_count,
  s.count AS supra_count,
  l.total AS legacy_total,
  s.total AS supra_total,
  ABS(l.total - s.total) AS diff,
  CASE WHEN ABS(l.total - s.total) / NULLIF(l.total, 0) < 0.0001
    THEN 'PASS' ELSE 'FAIL' END AS status
FROM legacy_totals l
CROSS JOIN supra_totals s;
```

### Appendix D: Key File References

| File | Purpose |
|------|---------|
| `/Users/fernandocamacholombardo/aqua/SUPRA-WATER-2026.md` SS3 (lines 174-1131) | Target schema DDL |
| `/Users/fernandocamacholombardo/aqua/reports/DATABASE_OPTIMIZATION_PLAN.md` | Legacy cleanup phases |
| `/Users/fernandocamacholombardo/aqua/reports/SUPRA_CROSSREF_INSIGHTS.md` | 23 cross-reference insights |
| `/Users/fernandocamacholombardo/aqua/reports/SYSTEM_HEALTH_REPORT.md` | Current health scores |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A1-core-schema-analysis.md` | God table analysis |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A2-billing-domain-analysis.md` | Billing pipeline |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A7-lookup-config-analysis.md` | 95 lookup tables |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A8-history-audit-analysis.md` | 231 history tables |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A9-antipatterns-analysis.md` | Anti-patterns, tmpbb bug |

---

*ACTION_PLAN_DATABASE.md generated 2026-02-16*
*Database Architect -- SUPRA Water 2026*
*62 target tables | 2-track migration | 20-week sprint plan*
