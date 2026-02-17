-- =============================================================
-- SUPRA Water 2026 — Required PostgreSQL Extensions
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";        -- UUID generation (gen_random_uuid fallback)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";          -- Cryptographic functions (gen_random_uuid, password hashing)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";           -- Trigram-based fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis";           -- Geospatial types and functions
CREATE EXTENSION IF NOT EXISTS "vector";            -- pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS "timescaledb";       -- Time-series optimization (hypertables)
