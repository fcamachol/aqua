-- =============================================================
-- SUPRA Water 2026 — Seed Data
-- First tenant: CEA Queretaro
-- =============================================================

-- Disable RLS for seeding (superuser context)
SET app.current_tenant = '00000000-0000-0000-0000-000000000001';

-- =============================================================
-- 1. TENANT
-- =============================================================

INSERT INTO tenants (id, slug, name, rfc, fiscal_name, fiscal_address, config)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'cea-queretaro',
  'CEA Queretaro',
  'CEQ920101ABC',
  'Comision Estatal de Aguas de Queretaro',
  '{
    "street": "Av. 5 de Febrero",
    "exterior_number": "35",
    "colonia": "Centro",
    "municipality": "Queretaro",
    "state": "Queretaro",
    "zip_code": "76000",
    "country": "MX"
  }'::jsonb,
  '{
    "timezone": "America/Mexico_City",
    "currency": "MXN",
    "iva_rate": 0.16,
    "billing_day": 1,
    "payment_grace_days": 15,
    "delinquency_steps": ["sms", "whatsapp", "carta", "corte"],
    "features": {
      "smart_meters": true,
      "cfdi": true,
      "whatsapp": true,
      "ai_anomaly_detection": true,
      "payment_plans": true
    }
  }'::jsonb
);

-- =============================================================
-- 2. EXPLOTACION
-- =============================================================

INSERT INTO explotaciones (id, tenant_id, code, name, municipality, state, config, billing_config, reading_config)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'QRO-CENTRO',
  'Zona Centro Queretaro',
  'Queretaro',
  'Queretaro',
  '{}'::jsonb,
  '{
    "default_billing_period": "mensual",
    "billing_cycle_day": 1,
    "late_fee_pct": 0.02,
    "iva_rate": 0.16
  }'::jsonb,
  '{
    "reading_cycle_days": 30,
    "reading_window_days": 5,
    "max_consumption_threshold_m3": 100,
    "zero_consumption_alert": true
  }'::jsonb
);

-- =============================================================
-- 3. OFFICE
-- =============================================================

INSERT INTO offices (id, tenant_id, explotacion_id, name, address, phone, office_type, config)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Oficina Central Queretaro',
  '{
    "street": "Av. 5 de Febrero",
    "exterior_number": "35",
    "colonia": "Centro",
    "municipality": "Queretaro",
    "state": "Queretaro",
    "zip_code": "76000"
  }'::jsonb,
  '442-123-4567',
  'presencial',
  '{"cashier_windows": 8, "working_hours": "08:00-16:00"}'::jsonb
);

-- =============================================================
-- 4. ADMIN USER
-- =============================================================

-- Password: 'Supra2026!' hashed with bcrypt
INSERT INTO users (id, tenant_id, email, password_hash, name, role, permissions, explotacion_ids, office_ids)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'admin@cea-queretaro.gob.mx',
  '$2a$12$LJ3m4ys7GEbN8VJQ2EV5IOMfIQlAPBkz0fGTvh4YmEPXGNnyF9Kd2',
  'Administrador SUPRA',
  'admin',
  '["*"]'::jsonb,
  ARRAY['00000000-0000-0000-0000-000000000002']::UUID[],
  ARRAY['00000000-0000-0000-0000-000000000003']::UUID[]
);

-- =============================================================
-- 5. SAMPLE TARIFF SCHEDULE
-- =============================================================

INSERT INTO tariff_schedules (id, tenant_id, explotacion_id, name, category, effective_from, active, billing_period, blocks, additional_concepts, iva_applicable, social_discount_pct, approved_by, approval_date, gazette_reference)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Tarifa Domestica 2026 - Zona Centro',
  'domestica',
  '2026-01-01',
  true,
  'mensual',
  '[
    {"from_m3": 0,  "to_m3": 10,   "price_per_m3": 5.50,  "fixed_charge": 45.00},
    {"from_m3": 10, "to_m3": 20,   "price_per_m3": 8.75,  "fixed_charge": 0},
    {"from_m3": 20, "to_m3": 40,   "price_per_m3": 15.30, "fixed_charge": 0},
    {"from_m3": 40, "to_m3": null,  "price_per_m3": 25.00, "fixed_charge": 0}
  ]'::jsonb,
  '[
    {"code": "alcantarillado", "name": "Alcantarillado", "type": "percentage", "value": 0.25, "base": "agua"},
    {"code": "saneamiento", "name": "Saneamiento", "type": "fixed", "value": 15.00}
  ]'::jsonb,
  false,
  30.00,
  'H. Congreso del Estado de Queretaro',
  '2025-12-15',
  'Periodico Oficial La Sombra de Arteaga No. 52, 2025'
);

-- =============================================================
-- 6. SAMPLE COMMERCIAL TARIFF
-- =============================================================

INSERT INTO tariff_schedules (tenant_id, explotacion_id, name, category, effective_from, active, billing_period, blocks, additional_concepts, iva_applicable)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'Tarifa Comercial 2026 - Zona Centro',
  'comercial',
  '2026-01-01',
  true,
  'mensual',
  '[
    {"from_m3": 0,  "to_m3": 20,   "price_per_m3": 12.00, "fixed_charge": 120.00},
    {"from_m3": 20, "to_m3": 50,   "price_per_m3": 18.50, "fixed_charge": 0},
    {"from_m3": 50, "to_m3": null,  "price_per_m3": 30.00, "fixed_charge": 0}
  ]'::jsonb,
  '[
    {"code": "alcantarillado", "name": "Alcantarillado", "type": "percentage", "value": 0.30, "base": "agua"},
    {"code": "saneamiento", "name": "Saneamiento", "type": "fixed", "value": 25.00}
  ]'::jsonb,
  true
);
