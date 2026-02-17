# ACTION PLAN: DevOps & Cloud Infrastructure

**Role:** DevOps/Cloud Engineer
**Project:** SUPRA Water 2026 — AI-First CIS for CEA Queretaro
**Date:** 2026-02-16
**Status:** Draft v1.0

---

## Table of Contents

1. [Development Environment](#1-development-environment)
2. [Cloud Architecture Decision](#2-cloud-architecture-decision)
3. [CI/CD Pipeline](#3-cicd-pipeline)
4. [Production Infrastructure](#4-production-infrastructure)
5. [Monitoring & Observability](#5-monitoring--observability)
6. [Security Infrastructure](#6-security-infrastructure)
7. [Backup & Disaster Recovery](#7-backup--disaster-recovery)
8. [Cost Projections](#8-cost-projections)
9. [Sprint-by-Sprint Infrastructure Delivery](#9-sprint-by-sprint-infrastructure-delivery)

---

## 1. Development Environment

### 1.1 Docker Compose — Full Local Stack

The development environment mirrors production as closely as possible. Every service the application depends on runs locally via Docker Compose.

```yaml
# docker-compose.yml
# SUPRA Water 2026 — Local Development Stack

services:
  # ─────────────────────────────────────────────
  # REVERSE PROXY
  # ─────────────────────────────────────────────
  traefik:
    image: traefik:v3.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedByDefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--log.level=DEBUG"
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"   # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./infra/traefik:/etc/traefik
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # APPLICATION
  # ─────────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
      - "9229:9229"   # Node.js debugger
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://supra:supra_dev@db:5432/supra_water
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
      S3_ACCESS_KEY: minioadmin
      S3_SECRET_KEY: minioadmin
      S3_BUCKET: supra-water-files
      N8N_WEBHOOK_BASE_URL: http://n8n:5678
      SENTRY_DSN: ""
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_started
    volumes:
      - ./src:/app/src
      - ./db:/app/db
      - ./package.json:/app/package.json
    command: npx tsx watch --inspect=0.0.0.0:9229 src/index.ts
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.supra.localhost`)"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # DATABASE — PostgreSQL 16 + TimescaleDB + PostGIS + pgvector
  # ─────────────────────────────────────────────
  db:
    image: timescale/timescaledb-ha:pg16-latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: supra
      POSTGRES_PASSWORD: supra_dev
      POSTGRES_DB: supra_water
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U supra -d supra_water"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # CACHE / QUEUES / SESSIONS — Redis 7
  # ─────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # WORKFLOW ORCHESTRATION — n8n
  # ─────────────────────────────────────────────
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: ${N8N_PASSWORD:-n8n_dev_password}
      WEBHOOK_URL: http://n8n:5678
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: db
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: supra
      DB_POSTGRESDB_PASSWORD: supra_dev
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY:-dev-encryption-key}
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - n8n_data:/home/node/.n8n
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.n8n.rule=Host(`n8n.supra.localhost`)"
      - "traefik.http.services.n8n.loadbalancer.server.port=5678"
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # CRM — Chatwoot (AGORA)
  # ─────────────────────────────────────────────
  agora:
    image: chatwoot/chatwoot:latest
    ports:
      - "3001:3000"
    environment:
      RAILS_ENV: development
      SECRET_KEY_BASE: ${CHATWOOT_SECRET:-chatwoot_dev_secret_key_base_placeholder}
      FRONTEND_URL: http://agora.supra.localhost
      POSTGRES_HOST: db
      POSTGRES_PORT: 5432
      POSTGRES_DATABASE: chatwoot
      POSTGRES_USERNAME: supra
      POSTGRES_PASSWORD: supra_dev
      REDIS_URL: redis://redis:6379/1
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.agora.rule=Host(`agora.supra.localhost`)"
      - "traefik.http.services.agora.loadbalancer.server.port=3000"
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # OBJECT STORAGE — MinIO (S3-compatible)
  # ─────────────────────────────────────────────
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"   # MinIO console
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.minio.rule=Host(`minio.supra.localhost`)"
      - "traefik.http.services.minio.loadbalancer.server.port=9001"
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # MONITORING (optional in dev, always-on in staging)
  # ─────────────────────────────────────────────
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./infra/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheusdata:/prometheus
    profiles: ["monitoring"]
    networks:
      - supra-net

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafanadata:/var/lib/grafana
      - ./infra/grafana/provisioning:/etc/grafana/provisioning
    profiles: ["monitoring"]
    networks:
      - supra-net

  # ─────────────────────────────────────────────
  # REDIS UI (optional dev tool)
  # ─────────────────────────────────────────────
  redis-commander:
    image: rediscommander/redis-commander:latest
    ports:
      - "8081:8081"
    environment:
      REDIS_HOSTS: local:redis:6379
    profiles: ["tools"]
    networks:
      - supra-net

# ─────────────────────────────────────────────
# VOLUMES
# ─────────────────────────────────────────────
volumes:
  pgdata:
  redisdata:
  n8n_data:
  miniodata:
  prometheusdata:
  grafanadata:

# ─────────────────────────────────────────────
# NETWORKS
# ─────────────────────────────────────────────
networks:
  supra-net:
    driver: bridge
```

### 1.2 Multi-Stage Dockerfile

```dockerfile
# Dockerfile
# Multi-stage build for SUPRA Water 2026 API

# ─── Base ───────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ─── Dependencies ───────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ─── Development ────────────────────────────
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000 9229
CMD ["npx", "tsx", "watch", "--inspect=0.0.0.0:9229", "src/index.ts"]

# ─── Builder ────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── Production ─────────────────────────────
FROM base AS production
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 supra
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
USER supra
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/index.js"]
```

### 1.3 Database Init Scripts

The `db/init/` directory runs in alphabetical order on first container startup:

| Script | Purpose |
|--------|---------|
| `001-extensions.sql` | `CREATE EXTENSION IF NOT EXISTS` for postgis, timescaledb, pgvector, pg_trgm, uuid-ossp |
| `002-databases.sql` | Create `n8n` and `chatwoot` databases for companion services |
| `003-core-tables.sql` | Tenants, persons, addresses (with RLS policies) |
| `004-infrastructure-tables.sql` | Tomas, acometidas, sectores_hidraulicos |
| `005-billing-tables.sql` | Invoices, invoice_lines, tariff_schedules |
| `006-payments-tables.sql` | Payments, payment_plans |
| `007-operations-tables.sql` | Work orders, contacts, fraud_cases |
| `008-events-tables.sql` | domain_events hypertable, meter_readings hypertable |
| `009-seed-data.sql` | Tenant "cea-queretaro", test users, sample tariffs, test tomas |

### 1.4 Local Development Workflow

**First-time setup:**
```bash
# 1. Clone and configure
git clone git@github.com:cea-queretaro/supra-water.git
cd supra-water
cp .env.example .env.local

# 2. Start all services
docker compose up -d

# 3. Wait for health checks, then verify
docker compose ps      # All services "healthy" or "running"
curl http://api.supra.localhost/health

# 4. Install local dependencies (for IDE support)
npm install

# 5. Run migrations (if using Drizzle)
npx drizzle-kit push
```

**Daily workflow:**
```bash
# Start the full stack
docker compose up -d

# Start with monitoring dashboards
docker compose --profile monitoring up -d

# View API logs in real time
docker compose logs -f api

# Restart only the API after dependency changes
docker compose restart api

# Run tests against local stack
npm test

# Reset database to seed state
docker compose down -v && docker compose up -d
```

**Host aliases (add to /etc/hosts):**
```
127.0.0.1 api.supra.localhost
127.0.0.1 n8n.supra.localhost
127.0.0.1 agora.supra.localhost
127.0.0.1 minio.supra.localhost
127.0.0.1 grafana.supra.localhost
```

### 1.5 Seed Data Scripts

Seed data ensures every developer starts with a functional local environment:

```sql
-- db/init/009-seed-data.sql

-- Tenant
INSERT INTO tenants (id, slug, name, rfc, fiscal_name, config)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'cea-queretaro',
  'CEA Queretaro',
  'CEQ850101AAA',
  'Comision Estatal de Aguas de Queretaro',
  '{"timezone": "America/Mexico_City", "currency": "MXN", "default_tariff_type": "domestico"}'
);

-- Sample tariff schedule
INSERT INTO tariff_schedules (tenant_id, name, type, effective_from, blocks)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Domestico 2026',
  'domestico',
  '2026-01-01',
  '[
    {"from_m3": 0, "to_m3": 10, "price_per_m3": 5.50, "fixed_charge": 45.00},
    {"from_m3": 10, "to_m3": 20, "price_per_m3": 8.75, "fixed_charge": 0},
    {"from_m3": 20, "to_m3": 40, "price_per_m3": 14.50, "fixed_charge": 0},
    {"from_m3": 40, "to_m3": null, "price_per_m3": 22.00, "fixed_charge": 0}
  ]'::jsonb
);

-- Test persons (10 sample accounts)
INSERT INTO persons (tenant_id, first_name, paternal_surname, maternal_surname, rfc, curp, email, phone)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Maria', 'Garcia', 'Lopez', 'GALM800101AAA', 'GALM800101MQRRPR01', 'maria.garcia@test.com', '+524421234567'),
  ('00000000-0000-0000-0000-000000000001', 'Juan', 'Martinez', 'Hernandez', 'MAHJ750515BBB', 'MAHJ750515HQRRRT02', 'juan.martinez@test.com', '+524429876543');
-- ... additional seed records for tomas, meters, contracts, readings
```

---

## 2. Cloud Architecture Decision

### 2.1 Azure Mexico Central vs GCP — Comparative Analysis

| Criterion | Azure Mexico Central | GCP (nearest: us-south1 Dallas) | Winner |
|-----------|---------------------|-------------------------------|--------|
| **Data center in Mexico** | Yes — Queretaro, QRO | No — nearest is Dallas, TX, USA | **Azure** |
| **Data residency (LFPDPPP)** | Full compliance — data stays in Mexico | Fails — PII crosses international border | **Azure** |
| **Latency to CEA offices** | < 5 ms (same city) | 30-50 ms (cross-border) | **Azure** |
| **Managed PostgreSQL** | Azure Database for PostgreSQL Flexible Server | Cloud SQL for PostgreSQL | Tie |
| **Kubernetes** | AKS (Azure Kubernetes Service) | GKE (Google Kubernetes Engine) | Tie (both mature) |
| **Container Apps (serverless)** | Azure Container Apps | Cloud Run | Tie |
| **Redis** | Azure Cache for Redis | Memorystore for Redis | Tie |
| **Object storage** | Azure Blob Storage | Cloud Storage | Tie |
| **Government certifications** | INAI compliant, SOC 2, ISO 27001 | SOC 2, ISO 27001, but no Mexico-specific | **Azure** |
| **Pricing (comparable config)** | ~$3,600-4,950/month | ~$3,200-4,500/month | GCP slightly cheaper |
| **Mexico support** | Spanish-language support, CDMX office | Limited Mexico presence | **Azure** |
| **Government experience in Mexico** | SAT, IMSS, various state governments | Limited Mexican gov references | **Azure** |

### 2.2 Data Residency Requirements

CEA Queretaro is a Mexican state government entity handling personal data of ~400,000 citizens. Applicable regulations:

1. **LFPDPPP (Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares)**: Mexico's data protection law requires that cross-border transfers of personal data to countries without adequate protection receive explicit consent. Storing PII in the US creates legal risk.

2. **LGPDPPSO (for public entities)**: As a state commission, CEA Queretaro may also be subject to the public sector variant, which has stricter requirements on where government data resides.

3. **SAT/CFDI data**: Fiscal records (RFC, CFDI) should remain in national territory.

4. **CONAGUA reporting**: Water usage data for ~400K accounts is government infrastructure data with implicit residency expectations.

### 2.3 Recommendation: Azure Mexico Central

**Azure Mexico Central is the only viable choice.** The decision is not close.

GCP does not have a Mexican data center. For a state government utility handling citizen PII, RFC, CURP, addresses, consumption data, and payment information, moving data to the US introduces legal risk that no cost saving can justify. Azure's Queretaro data center is physically in the same city as CEA's offices.

### 2.4 Azure Service Mapping

| SUPRA Component | Azure Service | SKU / Tier |
|-----------------|---------------|------------|
| **Application containers** | Azure Container Apps | Consumption plan (auto-scale 0-10) |
| **PostgreSQL 16 + TimescaleDB + PostGIS + pgvector** | Azure Database for PostgreSQL Flexible Server | General Purpose, 4 vCPU, 32 GB, 512 GB storage |
| **Redis 7** | Azure Cache for Redis | Standard C1 (6 GB), HA |
| **Object storage (files, PDFs, photos)** | Azure Blob Storage | Hot tier, LRS |
| **Container registry** | Azure Container Registry | Basic tier |
| **Secrets** | Azure Key Vault | Standard |
| **DNS** | Azure DNS | — |
| **CDN** | Azure Front Door | Standard |
| **WAF** | Azure Front Door WAF | Standard |
| **Monitoring** | Azure Monitor + Log Analytics | Pay-per-GB |
| **n8n** | Container App (dedicated) | Min 1 instance |
| **Chatwoot (AGORA)** | Container App (dedicated) | Min 1 instance |
| **Traefik** | Not needed — Azure Front Door replaces it | — |

**Why Container Apps instead of AKS:** For the initial deployment with ~10 services, Azure Container Apps provides Kubernetes-grade scaling without the operational overhead of managing an AKS cluster. Container Apps supports Dapr, KEDA-based auto-scaling, and revision-based deployments. If complexity grows beyond 20+ services, migration to AKS is straightforward since Container Apps runs on AKS under the hood.

**Upgrade path:** Container Apps (Phase 1-2) --> AKS (Phase 3+ if needed)

---

## 3. CI/CD Pipeline

### 3.1 Branch Strategy

```
main              (production — protected, requires PR + 1 approval + passing CI)
  └─ develop       (staging — integration branch, auto-deploys to staging)
      └─ feature/* (feature branches — auto-deploys to dev on PR creation)
      └─ fix/*     (bugfix branches — same flow as feature/*)
      └─ hotfix/*  (emergency fixes — can PR directly to main)
```

**Rules:**
- `main` is protected: no direct pushes, requires passing CI + code review
- `develop` auto-deploys to staging environment on merge
- Feature branches auto-deploy to a shared dev environment on PR creation
- Hotfix branches can target `main` directly for emergencies
- All PRs require at least 1 approval
- Semantic versioning tags (`v1.0.0`) trigger production deployment from `main`

### 3.2 CI Pipeline — Build, Test, Lint, Security

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [develop]

env:
  NODE_VERSION: "22"
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ─── Lint & Type Check ──────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # ─── Unit & Integration Tests ───────────────
  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: timescale/timescaledb-ha:pg16-latest
        env:
          POSTGRES_USER: supra
          POSTGRES_PASSWORD: supra_test
          POSTGRES_DB: supra_water_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U supra"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - name: Run database migrations
        env:
          DATABASE_URL: postgresql://supra:supra_test@localhost:5432/supra_water_test
        run: npx drizzle-kit push
      - name: Run tests
        env:
          DATABASE_URL: postgresql://supra:supra_test@localhost:5432/supra_water_test
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
        run: npm test -- --coverage
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  # ─── Security Scan ──────────────────────────
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
      - run: npm ci
      - name: npm audit
        run: npm audit --audit-level=high
      - name: Trivy vulnerability scan (filesystem)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: "fs"
          scan-ref: "."
          severity: "HIGH,CRITICAL"
          exit-code: "1"

  # ─── Build Docker Image ─────────────────────
  build:
    name: Build Image
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=ref,event=branch
            type=semver,pattern={{version}}
      - uses: docker/build-push-action@v5
        with:
          context: .
          target: production
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      - name: Trivy image scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          severity: "HIGH,CRITICAL"
          exit-code: "1"
```

### 3.3 CD Pipeline — Deploy to Environments

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [develop]
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options:
          - dev
          - staging
          - production

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ─── Deploy to Staging (auto on develop push) ─
  deploy-staging:
    if: github.ref == 'refs/heads/develop' || github.event.inputs.environment == 'staging'
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS_STAGING }}

      - name: Run database migrations
        run: |
          az containerapp exec \
            --name supra-api-staging \
            --resource-group supra-staging-rg \
            --command "npx drizzle-kit push"

      - name: Deploy to Container Apps
        uses: azure/container-apps-deploy-action@v1
        with:
          resourceGroup: supra-staging-rg
          containerAppName: supra-api-staging
          imageToDeploy: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

      - name: Smoke test
        run: |
          sleep 30
          curl --fail --retry 5 --retry-delay 10 \
            https://staging-api.supra.ceaqueretaro.gob.mx/health

  # ─── Deploy to Production (manual, tag-based) ─
  deploy-production:
    if: github.event.inputs.environment == 'production'
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production    # Requires manual approval in GitHub
    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS_PRODUCTION }}

      - name: Run database migrations
        run: |
          az containerapp exec \
            --name supra-api-prod \
            --resource-group supra-prod-rg \
            --command "npx drizzle-kit push"

      - name: Deploy new revision (blue-green)
        run: |
          az containerapp revision copy \
            --name supra-api-prod \
            --resource-group supra-prod-rg \
            --image ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            --revision-suffix ${{ github.sha }}

      - name: Traffic split (canary 10%)
        run: |
          az containerapp ingress traffic set \
            --name supra-api-prod \
            --resource-group supra-prod-rg \
            --revision-weight \
              supra-api-prod--${{ github.sha }}=10 \
              supra-api-prod--current=90

      - name: Monitor canary (5 min)
        run: |
          echo "Monitoring error rates for 5 minutes..."
          sleep 300
          # Check error rate via Azure Monitor or Prometheus
          # If > 1% error rate, fail and trigger rollback

      - name: Promote to 100%
        run: |
          az containerapp ingress traffic set \
            --name supra-api-prod \
            --resource-group supra-prod-rg \
            --revision-weight \
              supra-api-prod--${{ github.sha }}=100

      - name: Smoke test production
        run: |
          curl --fail --retry 5 --retry-delay 10 \
            https://api.supra.ceaqueretaro.gob.mx/health
```

### 3.4 Database Migration Automation

Drizzle ORM handles schema migrations:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations (dev/staging — auto in CI)
npx drizzle-kit push

# Apply migrations (production — explicit)
npx drizzle-kit migrate
```

**CI/CD migration rules:**
- Staging: migrations run automatically before deployment
- Production: migrations run automatically but are preceded by a backup snapshot
- Breaking migrations (column drops, type changes) require manual approval via GitHub environment protection rules
- All migrations are forward-only. Rollbacks require a new forward migration.

### 3.5 Rollback Procedures

| Scenario | Rollback Method | RTO |
|----------|----------------|-----|
| Bad code deployment | Revert to previous Container App revision | < 2 min |
| Failed migration (no data loss) | Deploy previous image + forward-fix migration | < 15 min |
| Failed migration (data corruption) | Restore PostgreSQL from point-in-time backup | < 30 min |
| Full environment failure | Redeploy from Terraform + restore backups | < 2 hours |

**Rollback command (Container Apps):**
```bash
# List revisions
az containerapp revision list --name supra-api-prod --resource-group supra-prod-rg

# Route 100% traffic to previous revision
az containerapp ingress traffic set \
  --name supra-api-prod \
  --resource-group supra-prod-rg \
  --revision-weight supra-api-prod--<previous-sha>=100
```

---

## 4. Production Infrastructure

### 4.1 Infrastructure as Code — Terraform

All infrastructure is provisioned via Terraform. No manual Azure portal changes.

```hcl
# infra/terraform/main.tf

terraform {
  required_version = ">= 1.7"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
  backend "azurerm" {
    resource_group_name  = "supra-tfstate-rg"
    storage_account_name = "supratfstate"
    container_name       = "tfstate"
    key                  = "supra-water.terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# ─── Resource Group ───────────────────────────
resource "azurerm_resource_group" "main" {
  name     = "supra-${var.environment}-rg"
  location = "Mexico Central"
  tags = {
    project     = "supra-water"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ─── Virtual Network ─────────────────────────
resource "azurerm_virtual_network" "main" {
  name                = "supra-${var.environment}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "apps" {
  name                 = "apps-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
  delegation {
    name = "container-apps"
    service_delegation {
      name = "Microsoft.App/environments"
    }
  }
}

resource "azurerm_subnet" "data" {
  name                 = "data-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
  service_endpoints    = ["Microsoft.Sql", "Microsoft.Storage"]
}

# ─── PostgreSQL Flexible Server ───────────────
resource "azurerm_postgresql_flexible_server" "main" {
  name                          = "supra-${var.environment}-pg"
  resource_group_name           = azurerm_resource_group.main.name
  location                      = azurerm_resource_group.main.location
  version                       = "16"
  delegated_subnet_id           = azurerm_subnet.data.id
  private_dns_zone_id           = azurerm_private_dns_zone.postgres.id
  administrator_login           = "supraadmin"
  administrator_password        = var.pg_admin_password
  sku_name                      = var.environment == "production" ? "GP_Standard_D4s_v3" : "B_Standard_B2s"
  storage_mb                    = var.environment == "production" ? 524288 : 65536
  backup_retention_days         = var.environment == "production" ? 35 : 7
  geo_redundant_backup_enabled  = var.environment == "production" ? true : false
  zone                          = "1"
  high_availability {
    mode                      = var.environment == "production" ? "ZoneRedundant" : "Disabled"
    standby_availability_zone = "2"
  }
}

# Enable required extensions
resource "azurerm_postgresql_flexible_server_configuration" "extensions" {
  name      = "azure.extensions"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "POSTGIS,TIMESCALEDB,VECTOR,PG_TRGM,UUID-OSSP"
}

# ─── Redis ────────────────────────────────────
resource "azurerm_redis_cache" "main" {
  name                = "supra-${var.environment}-redis"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  capacity            = var.environment == "production" ? 1 : 0
  family              = "C"
  sku_name            = var.environment == "production" ? "Standard" : "Basic"
  minimum_tls_version = "1.2"
  redis_configuration {
    maxmemory_policy = "allkeys-lru"
  }
}

# ─── Container Apps Environment ───────────────
resource "azurerm_container_app_environment" "main" {
  name                       = "supra-${var.environment}-env"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  infrastructure_subnet_id   = azurerm_subnet.apps.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
}

# ─── Container App: API ───────────────────────
resource "azurerm_container_app" "api" {
  name                         = "supra-api-${var.environment}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Multiple"

  template {
    min_replicas = var.environment == "production" ? 2 : 1
    max_replicas = var.environment == "production" ? 10 : 3

    container {
      name   = "api"
      image  = "${var.container_registry}/supra-water:${var.image_tag}"
      cpu    = 1.0
      memory = "2Gi"

      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
      env {
        name        = "REDIS_URL"
        secret_name = "redis-url"
      }
      env {
        name  = "NODE_ENV"
        value = var.environment
      }

      liveness_probe {
        transport = "HTTP"
        path      = "/health"
        port      = 3000
      }
      readiness_probe {
        transport = "HTTP"
        path      = "/health/ready"
        port      = 3000
      }
    }

    custom_scale_rule {
      name             = "http-scaling"
      custom_rule_type = "http"
      metadata = {
        concurrentRequests = "50"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    transport        = "http"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  secret {
    name  = "database-url"
    value = "postgresql://supraadmin:${var.pg_admin_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/supra_water?sslmode=require"
  }
  secret {
    name  = "redis-url"
    value = "rediss://:${azurerm_redis_cache.main.primary_access_key}@${azurerm_redis_cache.main.hostname}:6380"
  }
}

# ─── Blob Storage ─────────────────────────────
resource "azurerm_storage_account" "main" {
  name                     = "supra${var.environment}files"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = var.environment == "production" ? "GRS" : "LRS"
  min_tls_version          = "TLS1_2"
  blob_properties {
    versioning_enabled = true
    delete_retention_policy {
      days = 30
    }
  }
}

# ─── Key Vault ────────────────────────────────
resource "azurerm_key_vault" "main" {
  name                = "supra-${var.environment}-kv"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_name            = "standard"
  tenant_id           = data.azurerm_client_config.current.tenant_id
  purge_protection_enabled = true
}

# ─── Log Analytics ────────────────────────────
resource "azurerm_log_analytics_workspace" "main" {
  name                = "supra-${var.environment}-logs"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = var.environment == "production" ? 90 : 30
}
```

```hcl
# infra/terraform/variables.tf

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, production)"
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "pg_admin_password" {
  type      = string
  sensitive = true
}

variable "container_registry" {
  type    = string
  default = "ghcr.io/cea-queretaro"
}

variable "image_tag" {
  type    = string
  default = "latest"
}
```

### 4.2 Auto-Scaling Policies

| Service | Min Replicas | Max Replicas | Scale Trigger |
|---------|:-----------:|:-----------:|---------------|
| API (production) | 2 | 10 | 50 concurrent HTTP requests per replica |
| API (staging) | 1 | 3 | 30 concurrent HTTP requests |
| n8n | 1 | 1 | Fixed (workflow engine is stateful) |
| Chatwoot (AGORA) | 1 | 3 | 50 concurrent HTTP requests |
| BullMQ Workers | 1 | 5 | Queue depth > 100 messages |

### 4.3 CDN and SSL

Azure Front Door provides CDN, WAF, and SSL termination in a single service:

- **Custom domain:** `api.supra.ceaqueretaro.gob.mx` with managed SSL certificate
- **CDN caching:** Static assets (JS, CSS, images) cached at edge PoPs
- **Compression:** Gzip/Brotli for all text responses
- **HTTP/2:** Enabled by default

---

## 5. Monitoring & Observability

### 5.1 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SUPRA Services                           │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌──────┐            │
│  │ API │  │ n8n │  │AGORA│  │Worker│  │BullMQ│            │
│  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬───┘            │
│     │        │        │        │         │                  │
│     └────────┴────────┴────────┴─────────┘                  │
│                       │                                      │
│              ┌────────┴────────┐                             │
│              │ OpenTelemetry   │                             │
│              │ SDK (auto-instr)│                             │
│              └────────┬────────┘                             │
└───────────────────────┼─────────────────────────────────────┘
                        │
            ┌───────────┼───────────┐
            ▼           ▼           ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐
     │Prometheus│ │  Sentry  │ │Azure Log │
     │ (metrics)│ │ (errors) │ │Analytics │
     └────┬─────┘ └──────────┘ │(logs)    │
          │                     └──────────┘
          ▼
     ┌──────────┐
     │ Grafana  │
     │(dashbds) │
     └──────────┘
```

### 5.2 Prometheus Metrics Collection

```yaml
# infra/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts/*.yml"

scrape_configs:
  - job_name: "supra-api"
    metrics_path: "/metrics"
    static_configs:
      - targets: ["api:3000"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  - job_name: "redis"
    static_configs:
      - targets: ["redis-exporter:9121"]

  - job_name: "postgres"
    static_configs:
      - targets: ["postgres-exporter:9187"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]
```

**Application metrics (exposed by the API via prom-client):**

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests by method, path, status |
| `http_request_duration_seconds` | Histogram | Request latency distribution |
| `db_query_duration_seconds` | Histogram | Database query latency |
| `bullmq_jobs_active` | Gauge | Active BullMQ jobs by queue |
| `bullmq_jobs_waiting` | Gauge | Waiting BullMQ jobs by queue |
| `bullmq_jobs_completed_total` | Counter | Completed jobs by queue |
| `bullmq_jobs_failed_total` | Counter | Failed jobs by queue |
| `billing_invoices_generated_total` | Counter | Invoices generated |
| `payments_processed_total` | Counter | Payments processed by channel |
| `whatsapp_messages_sent_total` | Counter | WhatsApp messages sent |
| `ai_agent_calls_total` | Counter | Claude API calls by agent |
| `ai_agent_latency_seconds` | Histogram | Claude API latency |

### 5.3 Grafana Dashboards

| Dashboard | Panels | Purpose |
|-----------|--------|---------|
| **System Overview** | Request rate, error rate (4xx/5xx), P50/P95/P99 latency, active connections | Team-wide health at a glance |
| **API Performance** | Per-endpoint latency, slow queries, throughput by module | Backend team |
| **Database Health** | Active connections, query duration, table sizes, replication lag, cache hit ratio | DBA / DevOps |
| **Redis Health** | Memory usage, hit/miss ratio, connected clients, keys by DB | DevOps |
| **BullMQ Queues** | Queue depths, processing rates, failure rates, retry counts | Backend team |
| **Billing KPIs** | Invoices/day, billing run duration, CFDI success rate, average invoice value | Business |
| **Payment KPIs** | Payments by channel (OXXO/SPEI/card), reconciliation status, daily revenue | Business |
| **AI Agents** | API calls, latency, token usage, cost per agent, success rates | AI team |
| **Infrastructure** | CPU, memory, disk I/O, network, container restarts | DevOps |

### 5.4 Sentry Error Tracking

```typescript
// src/config/sentry.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.postgresIntegration(),
  ],
  beforeSend(event) {
    // Strip PII from error reports
    if (event.request?.data) {
      delete event.request.data.rfc;
      delete event.request.data.curp;
      delete event.request.data.password;
    }
    return event;
  },
});
```

### 5.5 Structured Logging

All services emit JSON-structured logs with correlation IDs:

```typescript
// Example log output
{
  "timestamp": "2026-06-15T14:30:22.123Z",
  "level": "info",
  "service": "supra-api",
  "correlationId": "req-abc123-def456",
  "tenantId": "cea-queretaro",
  "userId": "usr-789",
  "module": "billing",
  "action": "invoice.generated",
  "invoiceId": "inv-001",
  "amount": 245.50,
  "duration_ms": 342
}
```

**Correlation ID flow:** Every inbound HTTP request gets a `X-Correlation-ID` header (generated if not present). This ID propagates through all internal service calls, BullMQ jobs, and database queries, enabling end-to-end request tracing.

### 5.6 Alert Rules

```yaml
# infra/prometheus/alerts/supra.yml
groups:
  - name: supra-critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error rate above 5% for 5 minutes"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency above 2s for 5 minutes"

      - alert: DatabaseConnectionPoolExhausted
        expr: pg_stat_activity_count / pg_settings_max_connections > 0.85
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool above 85%"

      - alert: RedisMemoryHigh
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Redis memory usage above 90%"

      - alert: BullMQQueueBacklog
        expr: bullmq_jobs_waiting > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "BullMQ queue has > 1000 waiting jobs for 10 minutes"

      - alert: ContainerRestarting
        expr: increase(kube_pod_container_status_restarts_total[1h]) > 3
        labels:
          severity: warning
        annotations:
          summary: "Container restarted more than 3 times in 1 hour"

      - alert: CFDIStampingFailure
        expr: rate(cfdi_stamping_failures_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "CFDI stamping failures detected — revenue impact"

  - name: supra-business
    rules:
      - alert: NoInvoicesGenerated
        expr: increase(billing_invoices_generated_total[24h]) == 0
        labels:
          severity: warning
        annotations:
          summary: "No invoices generated in 24 hours — check billing pipeline"

      - alert: PaymentReconciliationStalled
        expr: increase(payments_reconciled_total[6h]) == 0
        labels:
          severity: warning
        annotations:
          summary: "No payments reconciled in 6 hours"
```

### 5.7 Uptime Monitoring

External uptime monitoring via Azure Monitor availability tests:

| Endpoint | Check Interval | Failure Threshold | Alert Channel |
|----------|:-----------:|:-----------:|---------------|
| `https://api.supra.ceaqueretaro.gob.mx/health` | 1 min | 3 consecutive | Slack + PagerDuty |
| `https://agora.supra.ceaqueretaro.gob.mx` | 5 min | 2 consecutive | Slack |
| `https://n8n.supra.ceaqueretaro.gob.mx` | 5 min | 2 consecutive | Slack |

---

## 6. Security Infrastructure

### 6.1 Secrets Management — Azure Key Vault

All secrets are stored in Azure Key Vault and injected into Container Apps as environment variables. No secrets in code, no secrets in CI/CD logs.

**Secrets inventory:**

| Secret | Service | Rotation Policy |
|--------|---------|:--------------:|
| `pg-admin-password` | PostgreSQL | 90 days |
| `redis-access-key` | Redis | Managed by Azure |
| `jwt-secret` | API authentication | 180 days |
| `anthropic-api-key` | Claude AI agents | On demand |
| `openai-api-key` | Embeddings | On demand |
| `finkok-username` / `finkok-password` | CFDI stamping | Annually |
| `whatsapp-api-key` | WhatsApp Business | On demand |
| `twilio-account-sid` / `twilio-auth-token` | Voice AI | Annually |
| `conekta-api-key` / `conekta-private-key` | Payments | Annually |
| `chatwoot-secret-key-base` | AGORA CRM | 180 days |
| `n8n-encryption-key` | n8n workflows | On setup only |
| `sentry-dsn` | Error tracking | Static |

**Access pattern:** Container Apps reference Key Vault secrets via managed identity. No secret values pass through CI/CD.

### 6.2 Network Security

```
┌──────────────────────────────────────────────────────┐
│                    INTERNET                            │
└──────────────────────┬───────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Azure Front    │  WAF + DDoS Protection
              │  Door (CDN/WAF) │  SSL Termination
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  VNet            │  10.0.0.0/16
              │  ┌─────────────┐│
              │  │ Apps Subnet ││  10.0.1.0/24
              │  │ (Container  ││  NSG: Allow 443 from Front Door only
              │  │  Apps)      ││
              │  └──────┬──────┘│
              │         │       │
              │  ┌──────▼──────┐│
              │  │ Data Subnet ││  10.0.2.0/24
              │  │ (PostgreSQL ││  NSG: Allow 5432 from Apps Subnet only
              │  │  + Redis)   ││  Private Endpoints (no public IP)
              │  └─────────────┘│
              └─────────────────┘
```

**Network Security Groups (NSGs):**

| NSG | Rule | Source | Destination | Port | Action |
|-----|------|--------|-------------|:----:|:------:|
| apps-nsg | Allow Front Door | AzureFrontDoor.Backend | Apps Subnet | 443 | Allow |
| apps-nsg | Deny all other inbound | * | Apps Subnet | * | Deny |
| data-nsg | Allow PostgreSQL from Apps | Apps Subnet | Data Subnet | 5432 | Allow |
| data-nsg | Allow Redis from Apps | Apps Subnet | Data Subnet | 6380 | Allow |
| data-nsg | Deny all other inbound | * | Data Subnet | * | Deny |

**Private Endpoints:** PostgreSQL and Redis are accessible only through private endpoints within the VNet. No public IP addresses are assigned to data services.

### 6.3 SSL/TLS Management

| Component | Certificate Source | Renewal |
|-----------|-------------------|---------|
| `api.supra.ceaqueretaro.gob.mx` | Azure Front Door managed cert | Auto-renew |
| `agora.supra.ceaqueretaro.gob.mx` | Azure Front Door managed cert | Auto-renew |
| `n8n.supra.ceaqueretaro.gob.mx` | Azure Front Door managed cert | Auto-renew |
| PostgreSQL connections | Azure managed cert (require SSL) | Auto-renew |
| Redis connections | Azure managed cert (TLS 1.2+) | Auto-renew |

All internal service-to-service communication within the VNet uses TLS. PostgreSQL connections require `sslmode=require`.

### 6.4 WAF (Web Application Firewall)

Azure Front Door WAF is configured with:

- **OWASP Core Rule Set 3.2**: SQL injection, XSS, path traversal, command injection
- **Rate limiting**: 1,000 requests/minute per IP (API), 100 requests/minute per IP (auth endpoints)
- **Geo-filtering**: Optional — allow only Mexico + configured countries
- **Bot protection**: Block known bad bots, allow search engine bots
- **Custom rules**: Block requests with suspicious payloads targeting Mexican PII patterns

### 6.5 DDoS Protection

Azure DDoS Protection Standard is enabled at the VNet level, providing:
- Automatic traffic profiling and anomaly detection
- Real-time mitigation of volumetric, protocol, and application-layer attacks
- Azure Monitor integration for DDoS telemetry

---

## 7. Backup & Disaster Recovery

### 7.1 Database Backup Strategy

| Backup Type | Frequency | Retention | Storage |
|-------------|-----------|-----------|---------|
| **Continuous WAL archiving** | Real-time (point-in-time recovery) | 35 days | Azure-managed |
| **Automated snapshots** | Daily at 02:00 CST | 35 days | Azure-managed |
| **Geo-redundant backup** | Real-time replication | 35 days | Azure paired region |
| **Manual pre-migration snapshots** | Before each schema migration | 90 days | Azure Blob Storage |
| **Monthly export** | 1st of each month | 1 year | Azure Blob Storage (Cool tier) |

**Point-in-time recovery (PITR):** Azure Database for PostgreSQL Flexible Server supports PITR to any second within the 35-day retention window. This is the primary recovery mechanism for data corruption or accidental deletion.

### 7.2 Application State Backup

| Component | What | Backup Method | Frequency |
|-----------|------|--------------|-----------|
| **Redis** | Cache + BullMQ queue state | AOF persistence + Azure managed backup | Continuous + Daily |
| **Blob Storage** | PDFs, photos, documents | GRS replication (automatic) | Real-time |
| **n8n workflows** | Workflow definitions | Git export + Blob Storage | Daily |
| **Key Vault secrets** | All secrets | Azure managed + soft delete | Automatic |
| **Terraform state** | Infrastructure definition | Azure Blob with versioning | On every apply |

### 7.3 RTO/RPO Targets

| Scenario | RPO (data loss) | RTO (downtime) |
|----------|:--------------:|:--------------:|
| **Single container failure** | 0 (auto-restart) | < 30 seconds |
| **Database failover (HA)** | 0 (synchronous replication) | < 2 minutes |
| **Application bug (rollback)** | 0 | < 5 minutes |
| **Data corruption (PITR)** | < 5 minutes | < 30 minutes |
| **Azure zone failure** | 0 (zone-redundant HA) | < 5 minutes |
| **Azure region failure** | < 1 hour (geo-redundant) | < 4 hours |
| **Full disaster (rebuild)** | < 1 hour | < 8 hours |

### 7.4 Disaster Recovery Runbook

**Severity 1: Application failure (single service)**
1. Azure Container Apps auto-restarts the failed container
2. If restart loops > 3x, alert fires
3. DevOps investigates logs in Azure Log Analytics
4. If code issue: rollback to previous revision
5. Post-incident: root cause analysis within 24 hours

**Severity 2: Database failure**
1. Azure auto-failover to zone-redundant standby (< 2 min)
2. Application reconnects automatically (connection pool retry)
3. Verify data integrity via health check endpoint
4. If auto-failover fails: manual failover via Azure portal

**Severity 3: Region failure**
1. DNS failover to recovery region (if configured)
2. Restore PostgreSQL from geo-redundant backup in paired region
3. Deploy Container Apps from container registry (images replicated)
4. Restore Blob Storage from GRS
5. Update Key Vault references to new region
6. Verify all services via smoke tests
7. Communicate status to stakeholders

---

## 8. Cost Projections

### 8.1 Monthly Infrastructure Cost by Phase

All prices in USD, Azure Mexico Central region.

#### Phase 1 (Q1-Q2 2026) — Foundation + Quick Wins

| Resource | Spec | Monthly Cost |
|----------|------|:-----------:|
| Container Apps (API, n8n, AGORA, workers) | 4 apps, 1-2 replicas each, 1 vCPU / 2 GB | $150-250 |
| PostgreSQL Flexible Server | GP B2s, 2 vCPU, 8 GB, 128 GB storage | $120-150 |
| Redis | Basic C0 (250 MB) | $15-25 |
| Blob Storage | 50 GB, LRS, Hot | $5-10 |
| Container Registry | Basic | $5 |
| Key Vault | Standard, < 10K operations | $5 |
| Log Analytics | 5 GB/day ingestion | $75-100 |
| Azure DNS | 1 zone | $1 |
| **Phase 1 Monthly Total** | | **$376-546** |

#### Phase 2 (Q3-Q4 2026) — Core Business

| Resource | Spec | Monthly Cost |
|----------|------|:-----------:|
| Container Apps | 6 apps, 2-4 replicas, 1-2 vCPU / 2-4 GB | $400-600 |
| PostgreSQL Flexible Server | GP D2s_v3, 2 vCPU, 16 GB, 256 GB storage | $250-350 |
| Redis | Standard C1 (6 GB), HA | $200-300 |
| Blob Storage | 200 GB, LRS, Hot | $10-20 |
| Azure Front Door + WAF | Standard tier | $150-200 |
| Container Registry | Standard | $20 |
| Log Analytics | 10 GB/day | $150-200 |
| **Phase 2 Monthly Total** | | **$1,180-1,690** |

#### Phase 3-4 (2027) — Full Production

| Resource | Spec | Monthly Cost |
|----------|------|:-----------:|
| Container Apps | 10 apps, 2-10 replicas, 2 vCPU / 4 GB | $800-1,200 |
| PostgreSQL Flexible Server | GP D4s_v3, 4 vCPU, 32 GB, 512 GB, zone-redundant HA | $600-800 |
| TimescaleDB (meter readings) | GP D4s_v3, 4 vCPU, 32 GB, 1 TB | $400-500 |
| Redis | Standard C1 (6 GB), HA | $200-300 |
| Blob Storage | 1 TB, GRS, Hot + Cool | $50-80 |
| Azure Front Door + WAF + DDoS | Standard + DDoS Protection | $250-350 |
| Container Registry | Standard | $20 |
| Key Vault | Standard | $10 |
| Log Analytics + Monitor | 20 GB/day, 90-day retention | $300-400 |
| Azure DNS | 2 zones | $2 |
| Networking (VNet, private endpoints) | — | $50-100 |
| **Phase 3-4 Monthly Total** | | **$2,682-3,762** |

### 8.2 Cost Summary

| Phase | Duration | Monthly Range | Total Range |
|-------|:--------:|:------------:|:-----------:|
| Phase 1 (Foundation) | 6 months | $376-546 | $2,256-3,276 |
| Phase 2 (Core Business) | 6 months | $1,180-1,690 | $7,080-10,140 |
| Phase 3 (Intelligence) | 6 months | $2,682-3,762 | $16,092-22,572 |
| Phase 4 (Full Production) | 6+ months | $2,682-3,762 | $16,092-22,572 |
| **24-Month Total** | | | **$41,520-58,560** |

### 8.3 Cost Optimization Strategies

1. **Azure Reserved Instances (1-year):** 30-40% savings on PostgreSQL and Redis. Recommended from Phase 2 onward when workload patterns stabilize.

2. **Container Apps consumption plan:** Pay only for active CPU/memory seconds. Services that handle intermittent traffic (n8n, workers) scale to zero when idle.

3. **Blob Storage lifecycle policies:** Move documents older than 90 days from Hot to Cool tier (50% cheaper). Archive after 1 year (90% cheaper).

4. **Log Analytics data cap:** Set daily ingestion cap to prevent cost surprises from logging bugs.

5. **Azure Dev/Test pricing:** Use dev/test subscription for staging environment (up to 55% discount on many services).

6. **Right-sizing reviews:** Monthly review of container CPU/memory utilization. Downsize over-provisioned containers.

### 8.4 Reserved Instance Recommendations

| Resource | Current SKU | RI Term | Monthly Savings |
|----------|-------------|:-------:|:--------------:|
| PostgreSQL (production) | GP D4s_v3 | 1-year | ~$200/month |
| Redis (production) | Standard C1 | 1-year | ~$60/month |
| **Total RI savings** | | | **~$260/month** |

Reserve from Phase 3 onward. Phase 1-2 usage is too variable to commit.

---

## 9. Sprint-by-Sprint Infrastructure Delivery

SUPRA follows 2-week sprints. Infrastructure work is aligned with development team needs.

### Sprint 1-2 (Weeks 1-4) — Local Dev Environment

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| Docker Compose stack | All services in `docker-compose.yml` running | `docker compose up` starts all services, health checks pass |
| Dockerfile (multi-stage) | Dev and production targets | Image builds in < 2 minutes |
| Database init scripts | Extensions, tables, seed data | Fresh `docker compose up` yields functional database |
| `.env.example` | All environment variables documented | New developer can start in < 30 minutes |
| `Makefile` or npm scripts | Common commands (`make dev`, `make test`, `make seed`) | Team agrees on workflow |
| Git repository setup | Branch protection, PR templates, CODEOWNERS | `main` and `develop` branches protected |

**Dependencies on dev team:** Database schema files (Drizzle schemas or SQL init scripts).

### Sprint 3-4 (Weeks 5-8) — CI Pipeline + Azure Foundation

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| GitHub Actions CI workflow | Lint, test, security scan, Docker build | Every PR runs full CI in < 10 minutes |
| Trivy container scanning | Scan Docker images for CVEs | HIGH/CRITICAL vulnerabilities block merge |
| npm audit in CI | Check dependencies for known vulnerabilities | High-severity issues block merge |
| Azure subscription + resource groups | `supra-dev-rg`, `supra-staging-rg`, `supra-prod-rg` | Azure portal accessible by team |
| Terraform state backend | Azure Storage Account for tfstate | `terraform init` connects to remote state |
| Azure Container Registry | Push images from GitHub Actions | CI builds push to ACR |
| Azure Key Vault (dev) | Store development secrets | Secrets accessible from Container Apps |

**Dependencies on dev team:** Working test suite, lint configuration.

### Sprint 5-6 (Weeks 9-12) — Staging Environment

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| Terraform: VNet + subnets | Network foundation for staging | `terraform apply` creates networking |
| Terraform: PostgreSQL Flexible Server | Managed database with extensions | Application connects, extensions enabled |
| Terraform: Redis | Managed cache | Application connects via private endpoint |
| Terraform: Container Apps Environment | App hosting platform | Container Apps deploy and run |
| CD pipeline (staging) | Auto-deploy `develop` branch to staging | Merge to `develop` triggers deployment |
| DNS setup (staging) | `staging-api.supra.ceaqueretaro.gob.mx` | HTTPS endpoint accessible |
| Database migration in CI | Drizzle migrations run before deployment | Schema changes auto-apply |

**Dependencies on dev team:** Application health check endpoint (`/health`), database connection handling.

### Sprint 7-8 (Weeks 13-16) — Monitoring + Security Hardening

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| Prometheus + Grafana on staging | Metrics collection and dashboards | System Overview dashboard shows live data |
| Sentry integration | Error tracking configured | Errors from staging appear in Sentry |
| Structured logging | JSON logs with correlation IDs | Logs queryable in Log Analytics |
| Alert rules (basic) | Error rate, latency, container health | Test alert fires and reaches Slack |
| NSGs and private endpoints | Network hardening | PostgreSQL/Redis accessible only from VNet |
| WAF rules (basic) | OWASP CRS on Front Door | SQL injection attempts blocked |

**Dependencies on dev team:** Application metrics endpoint (`/metrics`), prom-client integration.

### Sprint 9-10 (Weeks 17-20) — Production Environment

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| Terraform: Production environment | Full production infrastructure | `terraform apply` on production workspace |
| PostgreSQL HA (zone-redundant) | Production database with automatic failover | Failover test passes |
| Azure Front Door + WAF + SSL | CDN, WAF, managed SSL | Production domain accessible via HTTPS |
| CD pipeline (production) | Manual approval + canary deployment | Production deploy with 10% canary, then promote |
| Backup verification | Test PITR restore | Restore to a test server succeeds |
| DDoS Protection | Azure DDoS Standard on VNet | Protection active, telemetry visible |
| Runbook v1 | Incident response procedures | Team has reviewed and practiced |

**Dependencies on dev team:** Application stable enough for production traffic.

### Sprint 11-12 (Weeks 21-24) — Optimization + DR

| Deliverable | Description | Done When |
|-------------|-------------|-----------|
| Grafana dashboards (full set) | All 9 dashboards from Section 5.3 | Business KPIs visible to stakeholders |
| Alert escalation | PagerDuty or equivalent for on-call | Critical alerts wake up on-call engineer |
| Load testing | k6 or similar against staging | Know capacity limits, scaling works |
| DR drill | Simulate database failover + container rollback | Team completes drill successfully |
| Cost monitoring | Azure Cost Management alerts | Alert at 80% of monthly budget |
| Reserved Instances evaluation | Analyze usage patterns | Decision on 1-year RIs for Phase 2 |

**Dependencies on dev team:** Stable production workload for load testing.

### Sprint 13+ (Ongoing) — Operations & Scaling

| Deliverable | Cadence |
|-------------|---------|
| Infrastructure cost review | Monthly |
| Security patching (OS, dependencies) | Bi-weekly |
| Grafana dashboard updates | As new features ship |
| Alert rule tuning | Bi-weekly (reduce noise, add new alerts) |
| Backup restore test | Quarterly |
| DR drill | Semi-annually |
| Terraform module updates | Monthly |
| SSL certificate review | Monthly (should be zero-touch) |
| Capacity planning review | Quarterly |

---

## Appendix A: Environment Variable Reference

```bash
# .env.example — SUPRA Water 2026
# Copy to .env.local for development

# ── Database ──────────────────────────────────
DATABASE_URL=postgresql://supra:supra_dev@localhost:5432/supra_water
REDIS_URL=redis://localhost:6379

# ── Authentication ────────────────────────────
JWT_SECRET=change-me-in-production
JWT_EXPIRATION=24h

# ── AI Services ───────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...                    # For embeddings only

# ── CFDI / Fiscal ─────────────────────────────
FINKOK_USERNAME=
FINKOK_PASSWORD=
FINKOK_ENVIRONMENT=sandbox               # sandbox | production

# ── WhatsApp ──────────────────────────────────
WHATSAPP_API_URL=https://waba.360dialog.io/v1
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER_ID=

# ── Voice (Twilio) ────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+52...

# ── Payments ──────────────────────────────────
CONEKTA_API_KEY=key_...
CONEKTA_PRIVATE_KEY=
SPEI_CLABE=

# ── Storage ───────────────────────────────────
S3_ENDPOINT=http://localhost:9000        # MinIO for dev, Azure Blob for prod
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=supra-water-files

# ── Monitoring ────────────────────────────────
SENTRY_DSN=

# ── n8n ───────────────────────────────────────
N8N_WEBHOOK_BASE_URL=http://localhost:5678
N8N_API_KEY=
N8N_PASSWORD=n8n_dev_password
N8N_ENCRYPTION_KEY=dev-encryption-key

# ── Chatwoot (AGORA) ─────────────────────────
CHATWOOT_SECRET=chatwoot_dev_secret

# ── Application ───────────────────────────────
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug                          # debug | info | warn | error
CORS_ORIGIN=http://localhost:3000
```

---

## Appendix B: Key Architecture Decisions Record

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Azure Mexico Central over GCP | GCP has no Mexico data center. Data residency for government PII is non-negotiable. |
| ADR-002 | Container Apps over AKS (initially) | Fewer than 15 services; Container Apps provides K8s-grade scaling without cluster ops. Migrate to AKS if/when needed. |
| ADR-003 | Traefik for dev, Azure Front Door for prod | Traefik in Docker Compose for local dev parity. Azure Front Door for production CDN/WAF/SSL. |
| ADR-004 | Managed PostgreSQL over self-hosted | HA, automated backups, patching, and PITR included. Team focuses on application, not database ops. |
| ADR-005 | GitHub Actions over Azure DevOps / ArgoCD | Simpler setup, native GitHub integration, sufficient for current team size. ArgoCD can be added later for GitOps if needed. |
| ADR-006 | Terraform over Bicep/ARM templates | Multi-cloud portable (future-proof), larger ecosystem, team familiarity. |
| ADR-007 | PostgreSQL LISTEN/NOTIFY + BullMQ over Kafka | At ~400K accounts, Kafka is overengineered. pg LISTEN/NOTIFY + BullMQ covers event-driven needs at a fraction of the complexity. Kafka is a Phase 3+ option if throughput demands it. |
| ADR-008 | Prometheus + Grafana over Azure Monitor alone | Open-source, portable, richer dashboard ecosystem, no per-query cost. Azure Monitor for uptime checks and native integrations. |
| ADR-009 | MinIO for dev, Azure Blob for prod | S3-compatible API in both environments. Application code does not change between environments. |
| ADR-010 | Single PostgreSQL instance (not database-per-service) for Phase 1-2 | At current scale, multiple managed databases add cost and operational overhead without proportional benefit. Schema isolation via Drizzle schemas. Migrate to database-per-service if bounded contexts diverge significantly. |

---

## Appendix C: Terraform Workspace Structure

```
infra/
├── terraform/
│   ├── environments/
│   │   ├── dev.tfvars
│   │   ├── staging.tfvars
│   │   └── production.tfvars
│   ├── modules/
│   │   ├── networking/        # VNet, subnets, NSGs, private endpoints
│   │   ├── database/          # PostgreSQL Flexible Server
│   │   ├── redis/             # Azure Cache for Redis
│   │   ├── container-apps/    # Container Apps Environment + apps
│   │   ├── storage/           # Blob Storage
│   │   ├── keyvault/          # Key Vault
│   │   ├── monitoring/        # Log Analytics, alerts
│   │   └── frontdoor/         # Azure Front Door + WAF
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
├── prometheus/
│   ├── prometheus.yml
│   └── alerts/
│       └── supra.yml
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       └── datasources/
└── traefik/
    └── traefik.yml
```

**Usage:**
```bash
# Initialize
cd infra/terraform
terraform init

# Plan for staging
terraform plan -var-file=environments/staging.tfvars

# Apply to staging
terraform apply -var-file=environments/staging.tfvars

# Apply to production (requires manual approval)
terraform apply -var-file=environments/production.tfvars
```
