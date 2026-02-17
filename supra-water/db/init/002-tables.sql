-- =============================================================
-- SUPRA Water 2026 — Supplementary DDL
-- Things Drizzle ORM cannot handle natively:
--   - PostGIS geography columns
--   - Generated columns (GENERATED ALWAYS AS ... STORED)
--   - TimescaleDB hypertable conversions
--   - Self-referencing FKs (circular dependencies)
--   - Partial indexes with WHERE clauses
--   - GIN/GIST indexes with operator classes
--   - CHECK constraints
--   - Row Level Security policies
-- =============================================================

-- =============================================================
-- CHECK CONSTRAINTS (applied after Drizzle creates tables)
-- =============================================================

-- offices.office_type
ALTER TABLE offices ADD CONSTRAINT chk_offices_type
  CHECK (office_type IN ('presencial', 'telefonica', 'virtual'));

-- persons.person_type
ALTER TABLE persons ADD CONSTRAINT chk_persons_type
  CHECK (person_type IN ('fisica', 'moral'));

-- users.role
ALTER TABLE users ADD CONSTRAINT chk_users_role
  CHECK (role IN (
    'admin', 'supervisor', 'operador', 'lecturista',
    'cajero', 'atencion_cliente', 'tecnico', 'auditor', 'readonly'
  ));

-- addresses.address_type
ALTER TABLE addresses ADD CONSTRAINT chk_addresses_type
  CHECK (address_type IN ('callejero', 'correspondencia', 'fiscal', 'libre'));

-- acometidas.status
ALTER TABLE acometidas ADD CONSTRAINT chk_acometidas_status
  CHECK (status IN ('activa', 'inactiva', 'clausurada'));

-- tomas.toma_type
ALTER TABLE tomas ADD CONSTRAINT chk_tomas_type
  CHECK (toma_type IN (
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal'
  ));

-- tomas.status
ALTER TABLE tomas ADD CONSTRAINT chk_tomas_status
  CHECK (status IN (
    'activa', 'cortada', 'suspendida', 'baja', 'clausurada', 'pendiente_alta'
  ));

-- tomas.billing_type
ALTER TABLE tomas ADD CONSTRAINT chk_tomas_billing_type
  CHECK (billing_type IN ('medido', 'cuota_fija', 'estimado'));

-- tomas.billing_period
ALTER TABLE tomas ADD CONSTRAINT chk_tomas_billing_period
  CHECK (billing_period IN ('mensual', 'bimestral', 'trimestral'));

-- meters.meter_type
ALTER TABLE meters ADD CONSTRAINT chk_meters_type
  CHECK (meter_type IN (
    'volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart'
  ));

-- meters.status
ALTER TABLE meters ADD CONSTRAINT chk_meters_status
  CHECK (status IN ('activo', 'inactivo', 'averiado', 'retirado', 'en_almacen'));

-- contracts.status
ALTER TABLE contracts ADD CONSTRAINT chk_contracts_status
  CHECK (status IN ('pendiente', 'activo', 'suspendido', 'baja', 'cancelado'));

-- contracts.payment_method
ALTER TABLE contracts ADD CONSTRAINT chk_contracts_payment_method
  CHECK (payment_method IN (
    'ventanilla', 'domiciliacion', 'digital', 'oxxo', 'gestor_cobro'
  ));

-- meter_readings.source
ALTER TABLE meter_readings ADD CONSTRAINT chk_readings_source
  CHECK (source IN (
    'smart_meter', 'manual_field', 'manual_office', 'autolectura',
    'telelectura', 'estimated', 'photo', 'api'
  ));

-- meter_readings.status
ALTER TABLE meter_readings ADD CONSTRAINT chk_readings_status
  CHECK (status IN ('valid', 'suspicious', 'estimated', 'rejected', 'corrected'));

-- invoices.invoice_type
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_type
  CHECK (invoice_type IN (
    'periodica', 'manual', 'abono', 'nota_credito', 'refactura'
  ));

-- invoices.origin
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_origin
  CHECK (origin IN ('lecturas', 'contratacion', 'varios', 'fraude', 'reconexion'));

-- invoices.status
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_status
  CHECK (status IN (
    'provisional', 'pendiente', 'bloqueada', 'cobrada',
    'impagada', 'abonada', 'parcial', 'descargada', 'amortizada'
  ));

-- invoices.cfdi_status
ALTER TABLE invoices ADD CONSTRAINT chk_invoices_cfdi_status
  CHECK (cfdi_status IN ('pending', 'stamped', 'cancelled', 'error'));

-- payments.payment_method
ALTER TABLE payments ADD CONSTRAINT chk_payments_method
  CHECK (payment_method IN (
    'efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia_spei',
    'codi', 'oxxo', 'domiciliacion', 'cheque', 'gestor_cobro', 'portal_web'
  ));

-- payments.status
ALTER TABLE payments ADD CONSTRAINT chk_payments_status
  CHECK (status IN ('pending', 'applied', 'reversed', 'bounced', 'cancelled'));

-- payments.channel
ALTER TABLE payments ADD CONSTRAINT chk_payments_channel
  CHECK (channel IN (
    'ventanilla', 'banco', 'portal', 'whatsapp', 'oxxo',
    'kiosko', 'domiciliacion', 'api'
  ));

-- payment_plans.status
ALTER TABLE payment_plans ADD CONSTRAINT chk_payment_plans_status
  CHECK (status IN ('activo', 'completado', 'incumplido', 'cancelado'));

-- delinquency_procedures.status
ALTER TABLE delinquency_procedures ADD CONSTRAINT chk_delinquency_status
  CHECK (status IN ('activo', 'pausado', 'resuelto', 'cerrado', 'judicial'));

-- work_orders.order_type
ALTER TABLE work_orders ADD CONSTRAINT chk_work_orders_type
  CHECK (order_type IN (
    'instalacion_medidor', 'cambio_medidor', 'reparacion',
    'corte', 'reconexion', 'inspeccion', 'lectura_especial',
    'verificacion_fraude', 'mantenimiento', 'nueva_toma'
  ));

-- work_orders.priority
ALTER TABLE work_orders ADD CONSTRAINT chk_work_orders_priority
  CHECK (priority IN ('urgente', 'alta', 'normal', 'baja'));

-- work_orders.status
ALTER TABLE work_orders ADD CONSTRAINT chk_work_orders_status
  CHECK (status IN (
    'pendiente', 'asignada', 'en_ruta', 'en_progreso',
    'completada', 'cancelada', 'reprogramada', 'fallida'
  ));

-- contacts.contact_type
ALTER TABLE contacts ADD CONSTRAINT chk_contacts_type
  CHECK (contact_type IN (
    'consulta', 'queja', 'solicitud', 'reporte_fuga',
    'felicitacion', 'sugerencia', 'reclamo', 'informacion'
  ));

-- contacts.channel
ALTER TABLE contacts ADD CONSTRAINT chk_contacts_channel
  CHECK (channel IN (
    'whatsapp', 'telefono', 'email', 'presencial',
    'portal_web', 'redes_sociales', 'chatbot', 'voice_ai'
  ));

-- contacts.status
ALTER TABLE contacts ADD CONSTRAINT chk_contacts_status
  CHECK (status IN (
    'abierto', 'en_proceso', 'pendiente_cliente', 'resuelto',
    'cerrado', 'escalado', 'transferido'
  ));

-- contacts.resolution_satisfaction
ALTER TABLE contacts ADD CONSTRAINT chk_contacts_satisfaction
  CHECK (resolution_satisfaction BETWEEN 1 AND 5);

-- fraud_cases.detection_source
ALTER TABLE fraud_cases ADD CONSTRAINT chk_fraud_detection_source
  CHECK (detection_source IN (
    'ai_anomaly', 'manual_report', 'field_inspection', 'meter_data',
    'neighbor_report', 'audit', 'gis_analysis'
  ));

-- fraud_cases.status
ALTER TABLE fraud_cases ADD CONSTRAINT chk_fraud_status
  CHECK (status IN (
    'abierto', 'en_inspeccion', 'confirmado', 'no_confirmado',
    'en_proceso_legal', 'resuelto', 'cerrado'
  ));

-- =============================================================
-- PostGIS GEOGRAPHY COLUMNS
-- =============================================================

-- addresses.geom
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS geom GEOGRAPHY(POINT, 4326);

-- addresses.normalized_text (generated column)
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS normalized_text TEXT
  GENERATED ALWAYS AS (
    LOWER(COALESCE(street, '') || ' ' || COALESCE(exterior_number, '') || ' ' ||
    COALESCE(colonia, '') || ' ' || COALESCE(zip_code, ''))
  ) STORED;

-- sectores_hidraulicos.geom
ALTER TABLE sectores_hidraulicos ADD COLUMN IF NOT EXISTS geom GEOGRAPHY(POLYGON, 4326);

-- acometidas.geom
ALTER TABLE acometidas ADD COLUMN IF NOT EXISTS geom GEOGRAPHY(POINT, 4326);

-- tomas.geom
ALTER TABLE tomas ADD COLUMN IF NOT EXISTS geom GEOGRAPHY(POINT, 4326);

-- =============================================================
-- SELF-REFERENCING & CIRCULAR FOREIGN KEYS
-- =============================================================

-- sectores_hidraulicos self-reference for subsectores
ALTER TABLE sectores_hidraulicos ADD CONSTRAINT fk_sectores_parent
  FOREIGN KEY (parent_id) REFERENCES sectores_hidraulicos(id);

-- tomas -> meters (circular: meters also references tomas)
ALTER TABLE tomas ADD CONSTRAINT fk_tomas_meter
  FOREIGN KEY (meter_id) REFERENCES meters(id);

-- contracts self-reference for subrogacion/cambio titular
ALTER TABLE contracts ADD CONSTRAINT fk_contracts_previous
  FOREIGN KEY (previous_contract_id) REFERENCES contracts(id);

-- invoices self-reference for abonos/refacturas
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_related
  FOREIGN KEY (related_invoice_id) REFERENCES invoices(id);

-- invoices -> meter_readings (DEFERRABLE for insert ordering)
-- Note: meter_readings has composite PK (id, reading_date), so this FK
-- references just the id column which may not be unique alone after
-- TimescaleDB partitioning. Use application-level integrity instead.

-- =============================================================
-- GIN / GIST INDEXES (operator classes not supported by Drizzle)
-- =============================================================

-- Full-text trigram search on person names
CREATE INDEX IF NOT EXISTS idx_persons_name
  ON persons USING gin(name gin_trgm_ops);

-- Geospatial indexes
CREATE INDEX IF NOT EXISTS idx_addresses_geo
  ON addresses USING GIST(geom);

-- Trigram search on normalized address text
CREATE INDEX IF NOT EXISTS idx_addresses_normalized
  ON addresses USING gin(normalized_text gin_trgm_ops);

-- Geospatial index on tomas
CREATE INDEX IF NOT EXISTS idx_tomas_geo
  ON tomas USING GIST(geom);

-- =============================================================
-- PARTIAL INDEXES
-- =============================================================

-- Unpaid invoices (most queried subset)
CREATE INDEX IF NOT EXISTS idx_invoices_due
  ON invoices(tenant_id, due_date)
  WHERE status IN ('pendiente', 'impagada');

-- CFDI lookup by folio fiscal
CREATE INDEX IF NOT EXISTS idx_invoices_cfdi
  ON invoices(folio_fiscal)
  WHERE folio_fiscal IS NOT NULL;

-- =============================================================
-- TIMESCALEDB HYPERTABLES
-- =============================================================

-- meter_readings: time-series partitioned by reading_date
SELECT create_hypertable('meter_readings', 'reading_date',
  chunk_time_interval => INTERVAL '1 month',
  if_not_exists => TRUE);

-- domain_events: time-series partitioned by created_at
SELECT create_hypertable('domain_events', 'created_at',
  chunk_time_interval => INTERVAL '1 month',
  if_not_exists => TRUE);

-- =============================================================
-- ROW LEVEL SECURITY (Multi-tenant isolation)
-- =============================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE explotaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectores_hidraulicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE acometidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tomas ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE delinquency_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy (applied to all tables with tenant_id)
-- Uses app.current_tenant session variable set by the application layer
CREATE POLICY tenant_isolation ON explotaciones
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON offices
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON persons
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON addresses
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON sectores_hidraulicos
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON acometidas
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON tomas
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON meters
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON contracts
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON meter_readings
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON invoice_lines
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON tariff_schedules
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON payments
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON payment_plans
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON delinquency_procedures
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON work_orders
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON contacts
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON fraud_cases
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON domain_events
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
CREATE POLICY tenant_isolation ON communications
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
