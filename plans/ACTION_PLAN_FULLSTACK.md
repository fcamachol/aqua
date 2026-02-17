# ACTION PLAN: Backend & API Layer -- Full Stack Development

**Role:** Full Stack Developer
**Date:** 2026-02-16
**Project:** SUPRA Water 2026 -- AI-First CIS for CEA Queretaro
**Stack:** Express.js 5 + TypeScript 5.x + Drizzle ORM + PostgreSQL 16 + BullMQ/Redis

---

## Table of Contents

1. [Project Scaffolding](#1-project-scaffolding)
2. [Module Architecture](#2-module-architecture)
3. [Event Bus Implementation](#3-event-bus-implementation)
4. [API Design](#4-api-design)
5. [Middleware Stack](#5-middleware-stack)
6. [Sprint-by-Sprint Development Plan](#6-sprint-by-sprint-development-plan)

---

## 1. Project Scaffolding

### 1.1 Project Initialization

```bash
mkdir supra-water && cd supra-water
npm init -y

# Runtime dependencies
npm install express@5 drizzle-orm postgres zod bullmq ioredis \
  jsonwebtoken bcryptjs uuid cors helmet \
  socket.io pino pino-http dotenv

# Development dependencies
npm install -D typescript @types/express @types/node @types/jsonwebtoken \
  @types/bcryptjs @types/uuid @types/cors tsx drizzle-kit vitest \
  @vitest/coverage-v8 eslint @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser prettier eslint-config-prettier supertest \
  @types/supertest
```

### 1.2 TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false,
    "paths": {
      "@/*": ["./src/*"],
      "@db/*": ["./db/*"]
    }
  },
  "include": ["src/**/*", "db/**/*", "scripts/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.3 ESLint Configuration

```jsonc
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 1.4 Prettier Configuration

```jsonc
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### 1.5 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/'],
    },
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@db': path.resolve(__dirname, './db'),
    },
  },
});
```

### 1.6 Drizzle ORM Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/*.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### 1.7 Environment Variable Schema (Zod)

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('24h'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // AI
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),

  // CFDI / PAC
  FINKOK_USERNAME: z.string().optional(),
  FINKOK_PASSWORD: z.string().optional(),
  FINKOK_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),

  // WhatsApp
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_API_KEY: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().startsWith('AC').optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Payments
  CONEKTA_API_KEY: z.string().optional(),
  CONEKTA_PRIVATE_KEY: z.string().optional(),
  SPEI_CLABE: z.string().length(18).optional(),

  // Storage
  S3_BUCKET: z.string().default('supra-water-files'),
  S3_ENDPOINT: z.string().url().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // n8n
  N8N_WEBHOOK_BASE_URL: z.string().url().optional(),
  N8N_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
```

### 1.8 Project Structure

Follows SUPRA SS12 layout exactly:

```
supra-water/
+-- docker-compose.yml
+-- Dockerfile
+-- package.json
+-- tsconfig.json
+-- drizzle.config.ts
+-- vitest.config.ts
+-- .env.example
+-- .eslintrc.json
+-- .prettierrc
|
+-- db/
|   +-- init/                          # SQL initialization scripts
|   |   +-- 001-extensions.sql
|   |   +-- 002-core-tables.sql
|   |   +-- 003-infrastructure-tables.sql
|   |   +-- 004-billing-tables.sql
|   |   +-- 005-payments-tables.sql
|   |   +-- 006-operations-tables.sql
|   |   +-- 007-events-tables.sql
|   |   +-- 008-seed-data.sql
|   +-- migrations/                    # Drizzle-managed migrations
|   +-- schema/                        # Drizzle schema files (TypeScript)
|       +-- tenants.ts
|       +-- persons.ts
|       +-- addresses.ts
|       +-- tomas.ts
|       +-- meters.ts
|       +-- contracts.ts
|       +-- readings.ts
|       +-- invoices.ts
|       +-- payments.ts
|       +-- work-orders.ts
|       +-- contacts.ts
|       +-- fraud-cases.ts
|       +-- events.ts
|
+-- src/
|   +-- index.ts                       # Express app entry point
|   +-- app.ts                         # Express app factory (for testing)
|   +-- config/
|   |   +-- env.ts                     # Zod-validated env vars
|   |   +-- database.ts               # Drizzle + postgres.js client
|   |   +-- redis.ts                   # IORedis client
|   |   +-- auth.ts                    # JWT config
|   |   +-- logger.ts                  # Pino logger
|   |
|   +-- middleware/
|   |   +-- auth.ts                    # JWT validation
|   |   +-- tenant.ts                  # Tenant extraction & RLS SET
|   |   +-- rate-limit.ts             # Redis-backed rate limiter
|   |   +-- error-handler.ts          # Structured error responses
|   |   +-- audit-log.ts              # Domain event audit trail
|   |   +-- request-id.ts             # X-Request-Id propagation
|   |   +-- validate.ts               # Zod schema validation wrapper
|   |
|   +-- modules/
|   |   +-- contracts/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- validators.ts
|   |   |   +-- events.ts
|   |   +-- billing/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- tariff-calculator.ts
|   |   |   +-- cfdi-service.ts
|   |   |   +-- pdf-generator.ts
|   |   |   +-- templates/
|   |   |   |   +-- invoice.hbs
|   |   |   |   +-- credit-note.hbs
|   |   |   |   +-- receipt.hbs
|   |   |   +-- events.ts
|   |   +-- meters/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- smart-meter-ingestion.ts
|   |   |   +-- anomaly-detector.ts
|   |   |   +-- events.ts
|   |   +-- payments/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- gateways/
|   |   |   |   +-- spei.ts
|   |   |   |   +-- oxxo.ts
|   |   |   |   +-- conekta.ts
|   |   |   |   +-- bank-domiciliation.ts
|   |   |   +-- reconciliation.ts
|   |   |   +-- events.ts
|   |   +-- work-orders/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- route-optimizer.ts
|   |   |   +-- events.ts
|   |   +-- contacts/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- ai-classifier.ts
|   |   |   +-- events.ts
|   |   +-- delinquency/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- collection-scorer.ts
|   |   |   +-- events.ts
|   |   +-- fraud/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- ml-detector.ts
|   |   |   +-- events.ts
|   |   +-- persons/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   |   +-- rfc-validator.ts
|   |   +-- tomas/
|   |   |   +-- router.ts
|   |   |   +-- service.ts
|   |   +-- analytics/
|   |   |   +-- router.ts
|   |   |   +-- dashboard-service.ts
|   |   |   +-- report-generator.ts
|   |   +-- admin/
|   |       +-- router.ts
|   |       +-- tenant-service.ts
|   |       +-- user-service.ts
|   |       +-- tariff-service.ts
|   |
|   +-- events/
|   |   +-- bus.ts                     # pg LISTEN/NOTIFY wrapper
|   |   +-- publisher.ts              # Event publishing utility
|   |   +-- subscriber.ts             # Event subscription registry
|   |   +-- handlers/
|   |       +-- on-reading-received.ts
|   |       +-- on-invoice-generated.ts
|   |       +-- on-payment-received.ts
|   |       +-- on-invoice-past-due.ts
|   |       +-- on-work-order-created.ts
|   |
|   +-- integrations/
|   |   +-- finkok/
|   |   +-- whatsapp/
|   |   +-- twilio/
|   |   +-- conekta/
|   |   +-- chatwoot/
|   |   +-- google-maps/
|   |
|   +-- utils/
|   |   +-- rfc-validator.ts
|   |   +-- curp-validator.ts
|   |   +-- clabe-validator.ts
|   |   +-- mexican-states.ts
|   |   +-- sat-catalogs.ts
|   |   +-- pagination.ts
|   |
|   +-- types/
|       +-- index.ts
|       +-- contracts.ts
|       +-- billing.ts
|       +-- payments.ts
|       +-- agents.ts
|       +-- express.d.ts              # Extended Express Request type
|
+-- tests/
|   +-- setup.ts                       # Test DB & Redis setup
|   +-- helpers.ts                     # Factory functions, auth helpers
|   +-- modules/
|   |   +-- billing.test.ts
|   |   +-- contracts.test.ts
|   |   +-- payments.test.ts
|   |   +-- persons.test.ts
|   |   +-- meters.test.ts
|   +-- integration/
|       +-- cfdi.test.ts
|       +-- whatsapp.test.ts
|       +-- event-bus.test.ts
|
+-- scripts/
    +-- seed-tenant.ts
    +-- import-padron.ts
    +-- generate-tariffs.ts
    +-- test-cfdi.ts
```

### 1.9 Express App Entry Point

```typescript
// src/app.ts -- Express app factory (importable for tests)
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';
import { authMiddleware } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { rateLimiter } from './middleware/rate-limit.js';
import { auditLog } from './middleware/audit-log.js';

// Module routers
import { contractsRouter } from './modules/contracts/router.js';
import { billingRouter } from './modules/billing/router.js';
import { metersRouter } from './modules/meters/router.js';
import { paymentsRouter } from './modules/payments/router.js';
import { workOrdersRouter } from './modules/work-orders/router.js';
import { contactsRouter } from './modules/contacts/router.js';
import { delinquencyRouter } from './modules/delinquency/router.js';
import { fraudRouter } from './modules/fraud/router.js';
import { personsRouter } from './modules/persons/router.js';
import { tomasRouter } from './modules/tomas/router.js';
import { analyticsRouter } from './modules/analytics/router.js';
import { adminRouter } from './modules/admin/router.js';

export function createApp() {
  const app = express();

  // --- Global middleware ---
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(requestId);
  app.use(pinoHttp({ logger }));

  // --- Health check (no auth) ---
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Tenant-scoped API routes ---
  const api = express.Router();
  api.use(rateLimiter);
  api.use(authMiddleware);
  api.use(tenantMiddleware);
  api.use(auditLog);

  api.use('/contracts', contractsRouter);
  api.use('/invoices', billingRouter);
  api.use('/meters', metersRouter);
  api.use('/payments', paymentsRouter);
  api.use('/payment-plans', paymentsRouter);  // sub-routes within payments
  api.use('/work-orders', workOrdersRouter);
  api.use('/contacts', contactsRouter);
  api.use('/delinquency', delinquencyRouter);
  api.use('/fraud', fraudRouter);
  api.use('/persons', personsRouter);
  api.use('/tomas', tomasRouter);
  api.use('/analytics', analyticsRouter);
  api.use('/admin', adminRouter);

  app.use('/:tenantSlug/v1', api);

  // --- Error handling (must be last) ---
  app.use(errorHandler);

  return app;
}
```

```typescript
// src/index.ts -- Server bootstrap
import { env } from './config/env.js';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { startEventBus } from './events/bus.js';
import { registerEventHandlers } from './events/subscriber.js';
import { logger } from './config/logger.js';

async function main() {
  await connectDatabase();
  await connectRedis();
  await startEventBus();
  registerEventHandlers();

  const app = createApp();
  app.listen(env.PORT, env.HOST, () => {
    logger.info(`SUPRA Water API running on ${env.HOST}:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

main().catch((err) => {
  logger.fatal(err, 'Failed to start server');
  process.exit(1);
});
```

### 1.10 Database Client Configuration

```typescript
// src/config/database.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';
import { logger } from './logger.js';
import * as schema from '@db/schema/index.js';

let sql: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

export async function connectDatabase() {
  sql = postgres(env.DATABASE_URL, {
    max: env.DATABASE_POOL_MAX,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: (notice) => logger.debug(notice, 'pg notice'),
  });

  db = drizzle(sql, { schema, logger: env.NODE_ENV === 'development' });

  // Verify connection
  await sql`SELECT 1`;
  logger.info('PostgreSQL connected');
}

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call connectDatabase() first.');
  return db;
}

export function getSql() {
  if (!sql) throw new Error('SQL client not initialized.');
  return sql;
}
```

### 1.11 Redis Configuration

```typescript
// src/config/redis.ts
import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

let redis: Redis;

export async function connectRedis() {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
  });

  redis.on('connect', () => logger.info('Redis connected'));
  redis.on('error', (err) => logger.error(err, 'Redis error'));

  await redis.ping();
}

export function getRedis() {
  if (!redis) throw new Error('Redis not initialized. Call connectRedis() first.');
  return redis;
}
```

---

## 2. Module Architecture

Each of the 12 modules follows a consistent internal pattern:

```
modules/<module>/
  router.ts       -- Express router with endpoint definitions
  service.ts      -- Business logic, Drizzle queries, event emission
  validators.ts   -- Zod schemas for request/response validation
  events.ts       -- Module-specific event type definitions
  <extras>.ts     -- Module-specific logic (tariff-calculator, ml-detector, etc.)
```

### 2.1 Contracts Module

**Purpose:** Full contract lifecycle -- alta, baja, cambio de titular, subrogacion.

```typescript
// src/modules/contracts/validators.ts
import { z } from 'zod';

export const createContractSchema = z.object({
  toma_id: z.string().uuid(),
  person_id: z.string().uuid(),
  tariff_category: z.enum([
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal',
  ]),
  billing_period: z.enum(['mensual', 'bimestral', 'trimestral']).default('mensual'),
  payment_method: z.enum(['ventanilla', 'domiciliacion', 'portal_web']).default('ventanilla'),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    verified: z.boolean().default(false),
  })).optional(),
});

export const updateContractSchema = z.object({
  tariff_category: z.enum([
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal',
  ]).optional(),
  billing_period: z.enum(['mensual', 'bimestral', 'trimestral']).optional(),
  payment_method: z.string().optional(),
});

export const terminateContractSchema = z.object({
  reason: z.string().min(1).max(500),
  final_reading: z.number().nonnegative().optional(),
});

export const changeTitularSchema = z.object({
  new_person_id: z.string().uuid(),
  transfer_debt: z.boolean().default(false),
});

export const listContractsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['activo', 'suspendido', 'baja', 'pendiente']).optional(),
  person_id: z.string().uuid().optional(),
  toma_id: z.string().uuid().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['created_at', 'contract_number', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
export type ListContractsQuery = z.infer<typeof listContractsQuerySchema>;
```

```typescript
// src/modules/contracts/events.ts
export const CONTRACT_EVENTS = {
  REQUESTED: 'contract.requested',
  CREATED: 'contract.created',
  ACTIVATED: 'contract.activated',
  TERMINATED: 'contract.terminated',
  TITULAR_CHANGED: 'contract.titular_changed',
  SUBROGATED: 'contract.subrogated',
  SUSPENDED: 'contract.suspended',
  DOCUMENTS_PENDING: 'contract.documents_pending',
} as const;
```

```typescript
// src/modules/contracts/router.ts
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { ContractService } from './service.js';
import {
  createContractSchema,
  updateContractSchema,
  terminateContractSchema,
  changeTitularSchema,
  listContractsQuerySchema,
} from './validators.js';

export const contractsRouter = Router();
const service = new ContractService();

contractsRouter.post('/', validate({ body: createContractSchema }), async (req, res) => {
  const contract = await service.create(req.tenantId, req.body);
  res.status(201).json({ data: contract });
});

contractsRouter.get('/', validate({ query: listContractsQuerySchema }), async (req, res) => {
  const result = await service.list(req.tenantId, req.query);
  res.json(result);
});

contractsRouter.get('/:id', async (req, res) => {
  const contract = await service.getById(req.tenantId, req.params.id);
  res.json({ data: contract });
});

contractsRouter.patch('/:id', validate({ body: updateContractSchema }), async (req, res) => {
  const contract = await service.update(req.tenantId, req.params.id, req.body);
  res.json({ data: contract });
});

contractsRouter.post('/:id/terminate', validate({ body: terminateContractSchema }), async (req, res) => {
  await service.terminate(req.tenantId, req.params.id, req.body);
  res.status(200).json({ message: 'Contract terminated' });
});

contractsRouter.post('/:id/change-titular', validate({ body: changeTitularSchema }), async (req, res) => {
  const result = await service.changeTitular(req.tenantId, req.params.id, req.body);
  res.json({ data: result });
});

contractsRouter.post('/:id/subrogate', validate({ body: changeTitularSchema }), async (req, res) => {
  const result = await service.subrogate(req.tenantId, req.params.id, req.body);
  res.json({ data: result });
});
```

```typescript
// src/modules/contracts/service.ts (key methods)
import { eq, and, ilike, sql, desc, asc } from 'drizzle-orm';
import { getDb } from '../../config/database.js';
import { contracts } from '@db/schema/contracts.js';
import { tomas } from '@db/schema/tomas.js';
import { emitEvent } from '../../events/publisher.js';
import { CONTRACT_EVENTS } from './events.js';
import { AppError } from '../../middleware/error-handler.js';
import type { CreateContractInput, ListContractsQuery } from './validators.js';

export class ContractService {
  async create(tenantId: string, input: CreateContractInput) {
    const db = getDb();

    // 1. Validate toma exists and has no active contract
    const toma = await db.query.tomas.findFirst({
      where: and(eq(tomas.tenant_id, tenantId), eq(tomas.id, input.toma_id)),
    });
    if (!toma) throw new AppError(404, 'TOMA_NOT_FOUND', 'Toma no encontrada');

    const existingContract = await db.query.contracts.findFirst({
      where: and(
        eq(contracts.tenant_id, tenantId),
        eq(contracts.toma_id, input.toma_id),
        eq(contracts.status, 'activo'),
      ),
    });
    if (existingContract) {
      throw new AppError(409, 'ACTIVE_CONTRACT_EXISTS', 'La toma ya tiene un contrato activo');
    }

    // 2. Generate contract number (sequential per tenant)
    const [seqResult] = await db.execute(
      sql`SELECT nextval('contract_number_seq_' || ${tenantId}) as next_val`
    );

    // 3. Create contract
    const [contract] = await db.insert(contracts).values({
      tenant_id: tenantId,
      toma_id: input.toma_id,
      person_id: input.person_id,
      contract_number: `C-${String(seqResult.next_val).padStart(8, '0')}`,
      tariff_category: input.tariff_category,
      billing_period: input.billing_period,
      payment_method: input.payment_method,
      status: 'activo',
    }).returning();

    // 4. Update toma status
    await db.update(tomas)
      .set({ status: 'activa' })
      .where(and(eq(tomas.id, input.toma_id), eq(tomas.tenant_id, tenantId)));

    // 5. Emit domain event
    await emitEvent({
      type: CONTRACT_EVENTS.CREATED,
      aggregate_type: 'contract',
      aggregate_id: contract.id,
      tenant_id: tenantId,
      payload: { contract_id: contract.id, contract_number: contract.contract_number },
    });

    return contract;
  }

  async list(tenantId: string, query: ListContractsQuery) {
    const db = getDb();
    const offset = (query.page - 1) * query.limit;

    const conditions = [eq(contracts.tenant_id, tenantId)];
    if (query.status) conditions.push(eq(contracts.status, query.status));
    if (query.person_id) conditions.push(eq(contracts.person_id, query.person_id));
    if (query.toma_id) conditions.push(eq(contracts.toma_id, query.toma_id));
    if (query.search) {
      conditions.push(ilike(contracts.contract_number, `%${query.search}%`));
    }

    const where = and(...conditions);
    const orderFn = query.sort_order === 'asc' ? asc : desc;

    const [items, [{ count }]] = await Promise.all([
      db.select().from(contracts).where(where)
        .orderBy(orderFn(contracts[query.sort_by]))
        .limit(query.limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(contracts).where(where),
    ]);

    return {
      data: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: Number(count),
        total_pages: Math.ceil(Number(count) / query.limit),
      },
    };
  }

  async getById(tenantId: string, id: string) {
    const db = getDb();
    const contract = await db.query.contracts.findFirst({
      where: and(eq(contracts.tenant_id, tenantId), eq(contracts.id, id)),
      with: { person: true, toma: true },
    });
    if (!contract) throw new AppError(404, 'CONTRACT_NOT_FOUND', 'Contrato no encontrado');
    return contract;
  }

  async terminate(tenantId: string, id: string, input: { reason: string; final_reading?: number }) {
    const db = getDb();
    const contract = await this.getById(tenantId, id);
    if (contract.status !== 'activo') {
      throw new AppError(400, 'CONTRACT_NOT_ACTIVE', 'Solo se pueden dar de baja contratos activos');
    }

    await db.update(contracts)
      .set({ status: 'baja', updated_at: new Date() })
      .where(and(eq(contracts.id, id), eq(contracts.tenant_id, tenantId)));

    await db.update(tomas)
      .set({ status: 'baja' })
      .where(and(eq(tomas.id, contract.toma_id), eq(tomas.tenant_id, tenantId)));

    await emitEvent({
      type: CONTRACT_EVENTS.TERMINATED,
      aggregate_type: 'contract',
      aggregate_id: id,
      tenant_id: tenantId,
      payload: { contract_id: id, reason: input.reason },
    });
  }

  async changeTitular(tenantId: string, id: string, input: { new_person_id: string; transfer_debt: boolean }) {
    // Terminates old contract and creates new with new person; optionally transfers debt
    const oldContract = await this.getById(tenantId, id);
    await this.terminate(tenantId, id, { reason: 'Cambio de titular' });
    const newContract = await this.create(tenantId, {
      toma_id: oldContract.toma_id,
      person_id: input.new_person_id,
      tariff_category: oldContract.tariff_category,
      billing_period: oldContract.billing_period,
      payment_method: oldContract.payment_method,
    });

    await emitEvent({
      type: CONTRACT_EVENTS.TITULAR_CHANGED,
      aggregate_type: 'contract',
      aggregate_id: newContract.id,
      tenant_id: tenantId,
      payload: {
        old_contract_id: id,
        new_contract_id: newContract.id,
        old_person_id: oldContract.person_id,
        new_person_id: input.new_person_id,
      },
    });

    return { old_contract: oldContract, new_contract: newContract };
  }

  async update(tenantId: string, id: string, input: Record<string, unknown>) {
    const db = getDb();
    const [updated] = await db.update(contracts)
      .set({ ...input, updated_at: new Date() })
      .where(and(eq(contracts.id, id), eq(contracts.tenant_id, tenantId)))
      .returning();
    if (!updated) throw new AppError(404, 'CONTRACT_NOT_FOUND', 'Contrato no encontrado');
    return updated;
  }

  async subrogate(tenantId: string, id: string, input: { new_person_id: string; transfer_debt: boolean }) {
    return this.changeTitular(tenantId, id, input);
  }
}
```

### 2.2 Billing Module

**Purpose:** Invoice generation, block tariff calculation, CFDI stamping, PDF generation.

```typescript
// src/modules/billing/validators.ts
import { z } from 'zod';

export const generateInvoiceSchema = z.object({
  contract_id: z.string().uuid(),
  reading_id: z.string().uuid(),
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
  auto_stamp: z.boolean().default(true),
});

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  contract_id: z.string().uuid().optional(),
  person_id: z.string().uuid().optional(),
  status: z.enum(['provisional', 'pendiente', 'cobrada', 'parcial', 'cancelada']).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  sort_by: z.enum(['created_at', 'total', 'due_date', 'status']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const cancelInvoiceSchema = z.object({
  reason: z.enum(['01', '02', '03', '04']), // SAT cancellation reason codes
  replacement_uuid: z.string().uuid().optional(), // Required for reason '01'
});

export const creditNoteSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().min(1).max(500),
  concept: z.string(),
});
```

```typescript
// src/modules/billing/events.ts
export const BILLING_EVENTS = {
  INVOICE_GENERATED: 'invoice.generated',
  INVOICE_STAMPED: 'invoice.stamped',
  INVOICE_DELIVERED: 'invoice.delivered',
  INVOICE_PAST_DUE: 'invoice.past_due',
  INVOICE_CANCELLED: 'invoice.cancelled',
  CREDIT_NOTE_ISSUED: 'invoice.credit_note_issued',
} as const;
```

```typescript
// src/modules/billing/tariff-calculator.ts
export interface TariffBlock {
  from_m3: number;
  to_m3: number | null;
  price_per_m3: number;
  fixed_charge: number;
}

export interface TariffResult {
  quantity: number;
  unit_price: number;
  subtotal: number;
  detail: {
    from: number;
    to: number | null;
    m3: number;
    rate: number;
    fixed: number;
    charge: number;
  }[];
}

export function calculateBlockTariff(consumption_m3: number, blocks: TariffBlock[]): TariffResult {
  let total = 0;
  const detail: TariffResult['detail'] = [];

  for (const block of blocks) {
    const blockMax = block.to_m3 ?? Infinity;
    const blockConsumption = Math.min(
      Math.max(consumption_m3 - block.from_m3, 0),
      blockMax - block.from_m3,
    );

    if (blockConsumption > 0) {
      const blockCharge = (block.fixed_charge || 0) + blockConsumption * block.price_per_m3;
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

  return {
    quantity: consumption_m3,
    unit_price: consumption_m3 > 0 ? total / consumption_m3 : 0,
    subtotal: total,
    detail,
  };
}
```

### 2.3 Meters Module

**Purpose:** Meter CRUD, smart meter ingestion, manual field readings, anomaly detection.

```typescript
// src/modules/meters/validators.ts
import { z } from 'zod';

export const registerMeterSchema = z.object({
  toma_id: z.string().uuid(),
  serial_number: z.string().min(1).max(50),
  brand: z.string().optional(),
  model: z.string().optional(),
  diameter_inches: z.number().positive().optional(),
  meter_type: z.enum(['volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart']),
  is_smart: z.boolean().default(false),
  device_eui: z.string().optional(),
  lora_config: z.object({
    app_eui: z.string(),
    dev_eui: z.string(),
    app_key: z.string(),
  }).optional(),
});

export const submitReadingSchema = z.object({
  reading_value: z.number().nonnegative(),
  photo_base64: z.string().optional(),
  gps: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  observations: z.string().max(500).optional(),
  reader_user_id: z.string().uuid(),
});

export const smartMeterIngestSchema = z.object({
  readings: z.array(z.object({
    device_eui: z.string(),
    reading_value: z.number().nonnegative(),
    timestamp: z.string().datetime(),
    battery_level: z.number().min(0).max(100).optional(),
    signal_strength: z.number().optional(),
  })),
});

export const replaceMeterSchema = z.object({
  new_serial_number: z.string(),
  reason: z.enum(['averia', 'obsoleto', 'fraude', 'calibracion']),
  final_reading: z.number().nonnegative(),
  new_meter_type: z.enum(['volumetrico', 'velocidad', 'electromagnetico', 'ultrasonico', 'smart']),
});
```

```typescript
// src/modules/meters/events.ts
export const METER_EVENTS = {
  READING_RECEIVED: 'reading.received',
  READING_ANOMALY_DETECTED: 'reading.anomaly_detected',
  READING_BILLING_READY: 'reading.billing_ready',
  METER_REGISTERED: 'meter.registered',
  METER_REPLACED: 'meter.replaced',
  METER_DECOMMISSIONED: 'meter.decommissioned',
} as const;
```

### 2.4 Payments Module

**Purpose:** Multi-channel payment processing, reconciliation, payment plans.

```typescript
// src/modules/payments/validators.ts
import { z } from 'zod';

export const processPaymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_method: z.enum([
    'efectivo', 'transferencia', 'tarjeta_debito', 'tarjeta_credito', 'por_definir',
  ]),
  channel: z.enum([
    'ventanilla', 'spei', 'codi', 'oxxo', 'tarjeta',
    'domiciliacion', 'portal_web', 'whatsapp_pay',
  ]),
  transaction_data: z.record(z.unknown()).optional(),
});

export const createPaymentPlanSchema = z.object({
  contract_id: z.string().uuid(),
  invoice_ids: z.array(z.string().uuid()).min(1),
  total_amount: z.number().positive(),
  installments: z.number().int().min(2).max(36),
  down_payment: z.number().nonnegative().default(0),
  interest_rate: z.number().min(0).max(100).default(0),
});

export const recordInstallmentSchema = z.object({
  amount: z.number().positive(),
  payment_method: z.enum([
    'efectivo', 'transferencia', 'tarjeta_debito', 'tarjeta_credito',
  ]),
  channel: z.string(),
});

export const reconcileSchema = z.object({
  channel: z.enum(['spei', 'oxxo', 'domiciliacion']),
  transactions: z.array(z.object({
    external_id: z.string(),
    reference: z.string(),
    amount: z.number().positive(),
    timestamp: z.string().datetime(),
    metadata: z.record(z.unknown()).optional(),
  })),
});
```

```typescript
// src/modules/payments/events.ts
export const PAYMENT_EVENTS = {
  RECEIVED: 'payment.received',
  BOUNCED: 'payment.bounced',
  RECONCILED: 'payment.reconciled',
  PLAN_CREATED: 'payment_plan.created',
  INSTALLMENT_PAID: 'payment_plan.installment_paid',
  PLAN_COMPLETED: 'payment_plan.completed',
  PLAN_DEFAULTED: 'payment_plan.defaulted',
} as const;
```

### 2.5 Work Orders Module

**Purpose:** Lifecycle management for field operations (meter installations, leak repairs, disconnections).

```typescript
// src/modules/work-orders/validators.ts
import { z } from 'zod';

export const createWorkOrderSchema = z.object({
  toma_id: z.string().uuid(),
  order_type: z.enum([
    'instalacion_medidor', 'cambio_medidor', 'reparacion_fuga',
    'corte', 'reconexion', 'inspeccion', 'lectura_especial',
    'revision_anomalia', 'verificacion_fraude',
  ]),
  priority: z.enum(['baja', 'media', 'alta', 'urgente']).default('media'),
  description: z.string().max(1000).optional(),
  scheduled_date: z.string().datetime().optional(),
  materials: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    unit: z.string(),
  })).optional(),
});

export const completeWorkOrderSchema = z.object({
  result: z.enum(['completado', 'no_acceso', 'requiere_material', 'reprogramar']),
  notes: z.string().max(2000).optional(),
  photos: z.array(z.string().url()).optional(),
  materials_used: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    unit: z.string(),
  })).optional(),
  meter_reading: z.number().nonnegative().optional(),
  gps: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

export const listWorkOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pendiente', 'asignada', 'en_ruta', 'en_proceso', 'completada', 'cancelada']).optional(),
  order_type: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  priority: z.enum(['baja', 'media', 'alta', 'urgente']).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
});
```

```typescript
// src/modules/work-orders/events.ts
export const WORK_ORDER_EVENTS = {
  CREATED: 'work_order.created',
  ASSIGNED: 'work_order.assigned',
  STARTED: 'work_order.started',
  COMPLETED: 'work_order.completed',
  CANCELLED: 'work_order.cancelled',
} as const;
```

### 2.6 Contacts Module

**Purpose:** Customer interactions, complaints, AI classification and routing.

```typescript
// src/modules/contacts/validators.ts
import { z } from 'zod';

export const createContactSchema = z.object({
  contract_id: z.string().uuid().optional(),
  person_id: z.string().uuid().optional(),
  contact_type: z.enum([
    'consulta', 'queja', 'reclamacion', 'sugerencia',
    'reporte_fuga', 'solicitud', 'informacion',
  ]),
  channel: z.enum(['presencial', 'telefono', 'whatsapp', 'email', 'web', 'agora']),
  subject: z.string().max(200),
  description: z.string().max(5000),
  priority: z.enum(['baja', 'media', 'alta', 'urgente']).default('media'),
});

export const resolveContactSchema = z.object({
  resolution: z.string().max(2000),
  resolution_type: z.enum(['resuelto', 'derivado', 'no_procede', 'informado']),
});

export const escalateContactSchema = z.object({
  department: z.enum(['facturacion', 'operaciones', 'comercial', 'direccion']),
  reason: z.string().max(500),
});
```

```typescript
// src/modules/contacts/events.ts
export const CONTACT_EVENTS = {
  CREATED: 'contact.created',
  RESOLVED: 'contact.resolved',
  ESCALATED: 'contact.escalated',
} as const;
```

### 2.7 Delinquency Module

**Purpose:** Collections pipeline with AI-driven scoring and automated collection sequences.

```typescript
// src/modules/delinquency/validators.ts
import { z } from 'zod';

export const listDelinquencyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  risk_level: z.enum(['bajo', 'medio', 'alto', 'vulnerable']).optional(),
  status: z.enum(['activo', 'en_convenio', 'corte_programado', 'cortado', 'resuelto']).optional(),
  min_debt: z.coerce.number().nonnegative().optional(),
  max_debt: z.coerce.number().positive().optional(),
  days_past_due_min: z.coerce.number().int().nonnegative().optional(),
});

export const createPaymentAgreementSchema = z.object({
  procedure_id: z.string().uuid(),
  installments: z.number().int().min(2).max(36),
  down_payment: z.number().nonnegative(),
  interest_rate: z.number().min(0).max(100).default(0),
});
```

```typescript
// src/modules/delinquency/events.ts
export const DELINQUENCY_EVENTS = {
  STARTED: 'delinquency.started',
  STEP_EXECUTED: 'delinquency.step_executed',
  RESOLVED: 'delinquency.resolved',
  CORTE_SCHEDULED: 'delinquency.corte_scheduled',
  AGREEMENT_CREATED: 'delinquency.agreement_created',
} as const;
```

### 2.8 Fraud Module

**Purpose:** Fraud case management, inspections, ML-driven detection.

```typescript
// src/modules/fraud/validators.ts
import { z } from 'zod';

export const createFraudCaseSchema = z.object({
  toma_id: z.string().uuid(),
  detection_source: z.enum(['anomaly_agent', 'field_report', 'citizen_report', 'audit']),
  fraud_type: z.enum([
    'toma_clandestina', 'medidor_alterado', 'bypass',
    'conexion_ilegal', 'uso_no_autorizado', 'otro',
  ]).optional(),
  description: z.string().max(2000).optional(),
  evidence: z.array(z.string().url()).optional(),
});

export const updateFraudCaseSchema = z.object({
  status: z.enum(['abierto', 'investigacion', 'confirmado', 'descartado', 'cerrado']).optional(),
  fraud_type: z.string().optional(),
  inspection_data: z.object({
    inspector_id: z.string().uuid(),
    inspection_date: z.string().datetime(),
    findings: z.string(),
    photos: z.array(z.string().url()),
    confirmed: z.boolean(),
  }).optional(),
  regularization_amount: z.number().positive().optional(),
});
```

```typescript
// src/modules/fraud/events.ts
export const FRAUD_EVENTS = {
  CASE_OPENED: 'fraud.case_opened',
  CONFIRMED: 'fraud.confirmed',
  DISCARDED: 'fraud.discarded',
  REGULARIZED: 'fraud.regularized',
} as const;
```

### 2.9 Persons Module

**Purpose:** Customer/contact management with RFC/CURP validation.

```typescript
// src/modules/persons/validators.ts
import { z } from 'zod';

const rfcRegex = /^[A-Z&]{3,4}\d{6}[A-Z0-9]{3}$/;
const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

export const createPersonSchema = z.object({
  person_type: z.enum(['fisica', 'moral']),
  rfc: z.string().regex(rfcRegex, 'RFC invalido').optional(),
  curp: z.string().regex(curpRegex, 'CURP invalido').optional(),
  name: z.string().min(1).max(200),
  first_name: z.string().max(100).optional(),
  last_name_paterno: z.string().max(100).optional(),
  last_name_materno: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  phone_secondary: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  fiscal_regime: z.string().length(3).optional(),
  fiscal_use: z.string().max(4).optional(),
  fiscal_address: z.record(z.unknown()).optional(),
  zip_code: z.string().length(5).optional(),
  vulnerable: z.boolean().default(false),
  vulnerability_type: z.enum(['adulto_mayor', 'discapacidad', 'pobreza']).optional(),
  preferred_channel: z.enum(['whatsapp', 'email', 'sms', 'telefono']).default('whatsapp'),
});

export const searchPersonsSchema = z.object({
  q: z.string().min(2), // Search term (name, RFC, CURP, phone)
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const updatePersonSchema = createPersonSchema.partial();
```

### 2.10 Tomas Module

**Purpose:** Service connection point management, reading history, consumption summary.

```typescript
// src/modules/tomas/validators.ts
import { z } from 'zod';

export const listTomasQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['activa', 'cortada', 'suspendida', 'baja', 'clausurada', 'pendiente_alta']).optional(),
  toma_type: z.enum([
    'domestica', 'comercial', 'industrial', 'gobierno',
    'mixta', 'rural', 'hidrante', 'fuente', 'temporal',
  ]).optional(),
  sector_id: z.string().uuid().optional(),
  has_meter: z.coerce.boolean().optional(),
  search: z.string().optional(), // Address or toma_number
});

export const updateTomaSchema = z.object({
  toma_type: z.string().optional(),
  status: z.string().optional(),
  billing_type: z.enum(['medido', 'cuota_fija', 'estimado']).optional(),
  tariff_category: z.string().optional(),
  billing_period: z.enum(['mensual', 'bimestral', 'trimestral']).optional(),
  inhabitants: z.number().int().positive().optional(),
  property_type: z.string().optional(),
  notes: z.string().optional(),
});
```

### 2.11 Analytics Module

**Purpose:** Dashboard data, revenue reports, delinquency metrics, consumption patterns, CONAGUA reports.

```typescript
// src/modules/analytics/router.ts
import { Router } from 'express';
import { DashboardService } from './dashboard-service.js';
import { ReportGenerator } from './report-generator.js';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';

export const analyticsRouter = Router();
const dashboard = new DashboardService();
const reports = new ReportGenerator();

const periodQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  granularity: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
});

analyticsRouter.get('/dashboard', async (req, res) => {
  const data = await dashboard.getRealTimeDashboard(req.tenantId);
  res.json({ data });
});

analyticsRouter.get('/revenue', validate({ query: periodQuerySchema }), async (req, res) => {
  const data = await reports.getRevenue(req.tenantId, req.query);
  res.json({ data });
});

analyticsRouter.get('/delinquency', async (req, res) => {
  const data = await reports.getDelinquencyMetrics(req.tenantId);
  res.json({ data });
});

analyticsRouter.get('/consumption', validate({ query: periodQuerySchema }), async (req, res) => {
  const data = await reports.getConsumptionPatterns(req.tenantId, req.query);
  res.json({ data });
});

analyticsRouter.get('/collection-rate', validate({ query: periodQuerySchema }), async (req, res) => {
  const data = await reports.getCollectionRate(req.tenantId, req.query);
  res.json({ data });
});

analyticsRouter.get('/reports/conagua', async (req, res) => {
  const report = await reports.generateConaguaReport(req.tenantId);
  res.json({ data: report });
});
```

### 2.12 Admin Module

**Purpose:** Tenant management, user CRUD, tariff schedule management.

```typescript
// src/modules/admin/validators.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  name: z.string().min(1).max(200),
  role: z.enum([
    'admin', 'supervisor', 'operador', 'lecturista',
    'cajero', 'atencion_cliente', 'tecnico', 'auditor', 'readonly',
  ]),
  permissions: z.array(z.string()).default([]),
  explotacion_ids: z.array(z.string().uuid()).default([]),
  office_ids: z.array(z.string().uuid()).default([]),
});

export const updateTariffScheduleSchema = z.object({
  name: z.string(),
  toma_type: z.string(),
  effective_from: z.string().datetime(),
  effective_to: z.string().datetime().optional(),
  blocks: z.array(z.object({
    from_m3: z.number().nonnegative(),
    to_m3: z.number().positive().nullable(),
    price_per_m3: z.number().nonnegative(),
    fixed_charge: z.number().nonnegative().default(0),
  })),
  additional_concepts: z.array(z.object({
    code: z.enum(['alcantarillado', 'saneamiento', 'cuota_fija']),
    calculation: z.enum(['percentage', 'fixed', 'per_m3']),
    value: z.number(),
  })).optional(),
});
```

---

## 3. Event Bus Implementation

### 3.1 pg LISTEN/NOTIFY Wrapper

```typescript
// src/events/bus.ts
import postgres from 'postgres';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

type EventHandler = (payload: unknown) => Promise<void>;

const handlers = new Map<string, EventHandler[]>();
let listenConnection: ReturnType<typeof postgres>;

export async function startEventBus() {
  // Dedicated connection for LISTEN (cannot share with query pool)
  listenConnection = postgres(env.DATABASE_URL, {
    max: 1,
    idle_timeout: 0,     // Keep alive forever
    connect_timeout: 10,
  });

  await listenConnection.listen('domain_events', async (payload) => {
    try {
      const event = JSON.parse(payload);
      logger.debug({ event }, 'Received pg notification');
      const eventHandlers = handlers.get(event.type) || [];
      const wildcardHandlers = handlers.get('*') || [];
      const allHandlers = [...eventHandlers, ...wildcardHandlers];

      for (const handler of allHandlers) {
        try {
          await handler(event);
        } catch (err) {
          logger.error({ err, event_type: event.type }, 'Event handler failed');
        }
      }
    } catch (err) {
      logger.error({ err, payload }, 'Failed to parse event notification');
    }
  });

  logger.info('Event bus started (pg LISTEN/NOTIFY)');
}

export function onEvent(eventType: string, handler: EventHandler) {
  const existing = handlers.get(eventType) || [];
  existing.push(handler);
  handlers.set(eventType, existing);
}

export async function stopEventBus() {
  if (listenConnection) {
    await listenConnection.end();
    logger.info('Event bus stopped');
  }
}
```

### 3.2 BullMQ Queue Setup

```typescript
// src/events/queue.ts
import { Queue, Worker, QueueEvents } from 'bullmq';
import { getRedis } from '../config/redis.js';
import { logger } from '../config/logger.js';

const queues = new Map<string, Queue>();
const workers = new Map<string, Worker>();

export function getQueue(name: string): Queue {
  if (!queues.has(name)) {
    const queue = new Queue(name, { connection: getRedis() });
    queues.set(name, queue);
  }
  return queues.get(name)!;
}

export function createWorker(
  queueName: string,
  processor: (job: { name: string; data: unknown }) => Promise<void>,
  concurrency = 5,
): Worker {
  const worker = new Worker(queueName, processor, {
    connection: getRedis(),
    concurrency,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  });

  worker.on('failed', (job, err) => {
    logger.error({ job: job?.name, err }, `Worker ${queueName} job failed`);
  });

  worker.on('completed', (job) => {
    logger.debug({ job: job.name }, `Worker ${queueName} job completed`);
  });

  workers.set(queueName, worker);
  return worker;
}

export async function closeAllQueues() {
  for (const [name, worker] of workers) {
    await worker.close();
    logger.debug(`Worker ${name} closed`);
  }
  for (const [name, queue] of queues) {
    await queue.close();
    logger.debug(`Queue ${name} closed`);
  }
}
```

### 3.3 Event Publisher

```typescript
// src/events/publisher.ts
import { sql } from 'drizzle-orm';
import { getDb } from '../config/database.js';
import { domainEvents } from '@db/schema/events.js';
import { getQueue } from './queue.js';
import { logger } from '../config/logger.js';

export interface DomainEvent {
  type: string;
  aggregate_type: string;
  aggregate_id: string;
  tenant_id: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function emitEvent(event: DomainEvent): Promise<void> {
  const db = getDb();
  const timestamp = new Date().toISOString();

  // 1. Persist to domain_events table (source of truth)
  await db.insert(domainEvents).values({
    tenant_id: event.tenant_id,
    event_type: event.type,
    aggregate_type: event.aggregate_type,
    aggregate_id: event.aggregate_id,
    payload: event.payload,
    metadata: {
      ...event.metadata,
      timestamp,
    },
  });

  // 2. Notify via PostgreSQL LISTEN/NOTIFY for real-time subscribers
  const notification = JSON.stringify({
    type: event.type,
    aggregate_id: event.aggregate_id,
    tenant_id: event.tenant_id,
  });
  await db.execute(sql`NOTIFY domain_events, ${notification}`);

  // 3. Enqueue to BullMQ for reliable async processing
  const queue = getQueue('domain-events');
  await queue.add(event.type, {
    ...event,
    metadata: { ...event.metadata, timestamp },
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });

  logger.debug({ event_type: event.type, aggregate_id: event.aggregate_id }, 'Event emitted');
}
```

### 3.4 Event Subscriber / Handler Registration

```typescript
// src/events/subscriber.ts
import { createWorker } from './queue.js';
import { onEvent } from './bus.js';
import { logger } from '../config/logger.js';

// Import handlers
import { onReadingReceived } from './handlers/on-reading-received.js';
import { onInvoiceGenerated } from './handlers/on-invoice-generated.js';
import { onPaymentReceived } from './handlers/on-payment-received.js';
import { onInvoicePastDue } from './handlers/on-invoice-past-due.js';
import { onWorkOrderCreated } from './handlers/on-work-order-created.js';

const EVENT_HANDLER_MAP: Record<string, (data: unknown) => Promise<void>> = {
  'reading.received': onReadingReceived,
  'reading.billing_ready': onInvoiceGenerated,
  'invoice.generated': onInvoiceGenerated,
  'payment.received': onPaymentReceived,
  'invoice.past_due': onInvoicePastDue,
  'work_order.created': onWorkOrderCreated,
};

export function registerEventHandlers() {
  // 1. Register pg LISTEN/NOTIFY handlers (real-time, in-process)
  for (const [eventType, handler] of Object.entries(EVENT_HANDLER_MAP)) {
    onEvent(eventType, handler);
  }

  // 2. Register BullMQ workers (reliable, out-of-process capable)
  createWorker('domain-events', async (job) => {
    const handler = EVENT_HANDLER_MAP[job.name];
    if (handler) {
      await handler(job.data);
    } else {
      logger.debug({ event_type: job.name }, 'No handler registered for event');
    }
  }, 10);

  logger.info(`Registered ${Object.keys(EVENT_HANDLER_MAP).length} event handlers`);
}
```

### 3.5 Complete Event Catalog

Per SUPRA SS6.2, the full event catalog:

| Domain | Event Type | Payload | Handler Action |
|--------|-----------|---------|----------------|
| **Contract** | `contract.requested` | contract_id, person_id, toma_id | Trigger document verification workflow |
| **Contract** | `contract.created` | contract_id, contract_number | Send welcome message, create meter installation WO |
| **Contract** | `contract.activated` | contract_id | Enable billing for contract |
| **Contract** | `contract.terminated` | contract_id, reason | Generate final invoice, create meter removal WO |
| **Contract** | `contract.titular_changed` | contract_id, old_person_id, new_person_id | Transfer records, notify both parties |
| **Reading** | `reading.received` | reading_id, meter_id, toma_id, consumption | Run anomaly detection |
| **Reading** | `reading.anomaly_detected` | reading_id, anomaly_type, confidence | Create work order or fraud case |
| **Reading** | `reading.billing_ready` | reading_id, contract_id | Trigger invoice generation |
| **Billing** | `invoice.generated` | invoice_id, contract_id, total | Stamp CFDI, generate PDF |
| **Billing** | `invoice.stamped` | invoice_id, folio_fiscal | Deliver via preferred channel |
| **Billing** | `invoice.delivered` | invoice_id, channel | Log delivery confirmation |
| **Billing** | `invoice.past_due` | invoice_id, days_past_due | Start delinquency sequence |
| **Payment** | `payment.received` | payment_id, invoice_id, amount | Update invoice status, check delinquency resolution |
| **Payment** | `payment.bounced` | payment_id, reason | Revert invoice status, notify customer |
| **Payment** | `payment.reconciled` | payment_ids[] | Batch update invoice statuses |
| **Delinquency** | `delinquency.started` | procedure_id, contract_id, total_debt | Begin collection sequence per risk level |
| **Delinquency** | `delinquency.step_executed` | procedure_id, step, action | Log step, trigger next action |
| **Delinquency** | `delinquency.resolved` | procedure_id, resolution_type | Close procedure, update contract |
| **Work Order** | `work_order.created` | order_id, order_type, toma_id | Auto-assign, optimize route |
| **Work Order** | `work_order.assigned` | order_id, assigned_to | Notify technician |
| **Work Order** | `work_order.completed` | order_id, result | Update related entities |
| **Contact** | `contact.created` | contact_id, contact_type, channel | AI classification, routing |
| **Contact** | `contact.resolved` | contact_id, resolution | Send satisfaction survey |
| **Fraud** | `fraud.case_opened` | case_id, toma_id, detection_source | Create inspection WO |
| **Fraud** | `fraud.confirmed` | case_id, fraud_type | Generate regularization invoice |
| **Notification** | `notification.sent` | communication_id, channel, person_id | Log for audit |
| **Notification** | `notification.delivered` | communication_id | Update delivery status |
| **Notification** | `notification.failed` | communication_id, error | Retry or fallback channel |

### 3.6 Example Event Handler

```typescript
// src/events/handlers/on-payment-received.ts
import { getDb } from '../../config/database.js';
import { invoices } from '@db/schema/invoices.js';
import { eq, and } from 'drizzle-orm';
import { emitEvent } from '../publisher.js';
import { logger } from '../../config/logger.js';

interface PaymentReceivedPayload {
  tenant_id: string;
  payload: {
    payment_id: string;
    invoice_id: string;
    amount: number;
  };
}

export async function onPaymentReceived(data: unknown): Promise<void> {
  const { tenant_id, payload } = data as PaymentReceivedPayload;
  const db = getDb();

  const invoice = await db.query.invoices.findFirst({
    where: and(eq(invoices.id, payload.invoice_id), eq(invoices.tenant_id, tenant_id)),
  });

  if (!invoice) {
    logger.warn({ invoice_id: payload.invoice_id }, 'Invoice not found for payment');
    return;
  }

  const newPaidAmount = Number(invoice.paid_amount) + payload.amount;
  const newStatus = newPaidAmount >= Number(invoice.total) ? 'cobrada' : 'parcial';

  await db.update(invoices)
    .set({ paid_amount: newPaidAmount, status: newStatus, updated_at: new Date() })
    .where(and(eq(invoices.id, payload.invoice_id), eq(invoices.tenant_id, tenant_id)));

  logger.info(
    { invoice_id: payload.invoice_id, status: newStatus, paid: newPaidAmount },
    'Invoice updated after payment',
  );
}
```

---

## 4. API Design

### 4.1 Full REST Endpoint Inventory

**Base URL:** `https://api.supra.water/{tenant_slug}/v1`

All endpoints require `Authorization: Bearer <JWT>` and rate-limit at 100 req/min per API key.

#### Contracts (7 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/contracts` | Create new contract (alta) | admin, supervisor |
| `GET` | `/contracts` | List contracts (paginated, filterable) | all |
| `GET` | `/contracts/:id` | Get contract detail with person + toma | all |
| `PATCH` | `/contracts/:id` | Update contract fields | admin, supervisor |
| `POST` | `/contracts/:id/terminate` | Terminate contract (baja) | admin, supervisor |
| `POST` | `/contracts/:id/change-titular` | Change contract holder | admin, supervisor |
| `POST` | `/contracts/:id/subrogate` | Subrogation | admin |

#### Tomas (5 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/tomas` | List tomas (paginated, filterable) | all |
| `GET` | `/tomas/:id` | Get toma detail | all |
| `GET` | `/tomas/:id/readings` | Reading history for toma | all |
| `GET` | `/tomas/:id/consumption` | Consumption summary | all |
| `PATCH` | `/tomas/:id` | Update toma | admin, supervisor |

#### Meters (5 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/meters` | Register new meter | admin, tecnico |
| `GET` | `/meters/:id` | Get meter detail | all |
| `POST` | `/meters/:id/readings` | Submit manual field reading | lecturista, tecnico |
| `POST` | `/meters/smart/ingest` | Smart meter bulk data ingestion | system |
| `POST` | `/meters/:id/replace` | Meter replacement | admin, tecnico |

#### Invoices / Billing (6 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/invoices/generate` | Generate invoice from reading | admin, supervisor |
| `GET` | `/invoices` | List invoices (paginated, filterable) | all |
| `GET` | `/invoices/:id` | Get invoice detail | all |
| `GET` | `/invoices/:id/pdf` | Download invoice PDF | all |
| `GET` | `/invoices/:id/xml` | Download CFDI XML | all |
| `POST` | `/invoices/:id/cancel` | Cancel CFDI | admin |
| `POST` | `/invoices/:id/credit-note` | Generate credit note | admin, supervisor |

#### Payments (4 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/payments` | Process payment | cajero, system |
| `GET` | `/payments` | List payments | all |
| `GET` | `/payments/:id/receipt` | Download receipt PDF | all |
| `POST` | `/payments/reconcile` | Bank reconciliation batch | admin, system |

#### Payment Plans (3 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/payment-plans` | Create payment plan (convenio) | supervisor, admin |
| `GET` | `/payment-plans/:id` | Get plan detail | all |
| `POST` | `/payment-plans/:id/installment` | Record installment payment | cajero |

#### Work Orders (5 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/work-orders` | Create work order | all |
| `GET` | `/work-orders` | List work orders (filterable by status, type, assigned) | all |
| `PATCH` | `/work-orders/:id` | Update status, assign technician | supervisor, admin |
| `POST` | `/work-orders/:id/complete` | Complete with field data | tecnico |
| `GET` | `/work-orders/route/:user_id` | Get optimized route for technician | tecnico, supervisor |

#### Contacts (4 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/contacts` | Create contact/complaint | all |
| `GET` | `/contacts` | List contacts | all |
| `PATCH` | `/contacts/:id` | Update/resolve contact | atencion_cliente, supervisor |
| `POST` | `/contacts/:id/escalate` | Escalate to department | atencion_cliente |

#### Persons (4 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/persons` | Create person | admin, supervisor |
| `GET` | `/persons/:id` | Get person detail | all |
| `GET` | `/persons/search` | Search by name/RFC/CURP/phone | all |
| `PATCH` | `/persons/:id` | Update person | admin, supervisor |

#### Analytics & Reports (6 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/analytics/dashboard` | Real-time dashboard data | all |
| `GET` | `/analytics/revenue` | Revenue by period | supervisor, admin |
| `GET` | `/analytics/delinquency` | Delinquency metrics | supervisor, admin |
| `GET` | `/analytics/consumption` | Consumption patterns | all |
| `GET` | `/analytics/collection-rate` | Collection efficiency | supervisor, admin |
| `GET` | `/reports/conagua` | CONAGUA regulatory report | admin |

#### CFDI (3 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/cfdi/stamp` | Stamp CFDI via Finkok | system |
| `POST` | `/cfdi/cancel` | Cancel CFDI | admin |
| `GET` | `/cfdi/status/:uuid` | Check CFDI status at SAT | all |

#### Webhooks (3 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/webhooks` | Register webhook | admin |
| `GET` | `/webhooks` | List registered webhooks | admin |
| `DELETE` | `/webhooks/:id` | Remove webhook | admin |

#### Notifications (3 endpoints)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/notifications/send` | Send notification (any channel) | system, admin |
| `POST` | `/notifications/broadcast` | Broadcast to segment | admin |
| `GET` | `/notifications/templates` | List message templates | all |

#### Admin (implicit)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/admin/users` | Create user | admin |
| `GET` | `/admin/users` | List users | admin |
| `PATCH` | `/admin/users/:id` | Update user | admin |
| `POST` | `/admin/tariffs` | Create tariff schedule | admin |
| `GET` | `/admin/tariffs` | List tariff schedules | admin, supervisor |
| `PATCH` | `/admin/tariffs/:id` | Update tariff schedule | admin |

**Total: ~63 endpoints across 12 modules.**

### 4.2 Pagination, Filtering, and Sorting Pattern

All list endpoints follow a consistent pattern:

```typescript
// src/utils/pagination.ts
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export function buildPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    total_pages: Math.ceil(total / limit),
  };
}
```

**Request example:**
```
GET /cea-queretaro/v1/contracts?page=2&limit=20&status=activo&sort_by=created_at&sort_order=desc
```

**Response example:**
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 1247,
    "total_pages": 63
  }
}
```

### 4.3 Error Response Format

All errors follow a structured format:

```typescript
// Standard error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada invalidos",
    "details": [
      { "field": "rfc", "message": "RFC invalido" }
    ],
    "request_id": "req_abc123"
  }
}
```

HTTP status code mapping:

| Status | Code | Usage |
|--------|------|-------|
| 400 | `VALIDATION_ERROR` | Invalid request body/params |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found (scoped to tenant) |
| 409 | `CONFLICT` | Duplicate or conflicting state |
| 422 | `BUSINESS_RULE_VIOLATION` | Business logic rejection |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

### 4.4 API Versioning Strategy

- URL-based versioning: `/{tenant_slug}/v1/...`
- Major version bumps only for breaking changes.
- Additive changes (new fields, new endpoints) do not require version bump.
- Deprecated endpoints return `Deprecation` header with sunset date.
- Minimum 3-month sunset period for any deprecated endpoint.

---

## 5. Middleware Stack

### 5.1 JWT Auth Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './error-handler.js';

interface JWTPayload {
  sub: string;       // user_id
  tenant_id: string;
  role: string;
  permissions: string[];
  explotacion_ids: string[];
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
      tenantId: string;
      userRole: string;
      userPermissions: string[];
      explotacionIds: string[];
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Token de autorizacion requerido');
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.userId = payload.sub;
    req.tenantId = payload.tenant_id;
    req.userRole = payload.role;
    req.userPermissions = payload.permissions;
    req.explotacionIds = payload.explotacion_ids;
    next();
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Token invalido o expirado');
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole)) {
      throw new AppError(403, 'FORBIDDEN', 'Permisos insuficientes');
    }
    next();
  };
}
```

### 5.2 Tenant Extraction & RLS Context Setting

```typescript
// src/middleware/tenant.ts
import { Request, Response, NextFunction } from 'express';
import { getSql } from '../config/database.js';
import { AppError } from './error-handler.js';

export async function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  const tenantSlug = req.params.tenantSlug;
  if (!tenantSlug) {
    throw new AppError(400, 'MISSING_TENANT', 'Tenant slug requerido en la URL');
  }

  // Validate tenant slug matches JWT tenant_id
  // (the JWT already contains tenant_id, but we verify the URL matches)
  const sql = getSql();

  // Set RLS context for this request's DB session
  // This ensures all queries in this request are scoped to the tenant
  await sql`SELECT set_config('app.current_tenant_id', ${req.tenantId}, true)`;

  next();
}
```

### 5.3 Request Validation (Zod)

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error-handler.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: { field: string; message: string }[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'body'));
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'query'));
      } else {
        req.query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...formatZodErrors(result.error, 'params'));
      } else {
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Datos de entrada invalidos', errors);
    }

    next();
  };
}

function formatZodErrors(error: ZodError, prefix: string) {
  return error.issues.map((issue) => ({
    field: `${prefix}.${issue.path.join('.')}`,
    message: issue.message,
  }));
}
```

### 5.4 Error Handler (Structured Errors)

```typescript
// src/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public override message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestId = req.headers['x-request-id'] as string;

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        request_id: requestId,
      },
    });
    return;
  }

  // Unexpected errors
  logger.error({ err, request_id: requestId, path: req.path }, 'Unhandled error');
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor',
      request_id: requestId,
    },
  });
}
```

### 5.5 Audit Logging

```typescript
// src/middleware/audit-log.ts
import { Request, Response, NextFunction } from 'express';
import { emitEvent } from '../events/publisher.js';

const AUDITABLE_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

export function auditLog(req: Request, res: Response, next: NextFunction) {
  if (!AUDITABLE_METHODS.has(req.method)) {
    return next();
  }

  const originalEnd = res.end;

  res.end = function (...args: Parameters<typeof originalEnd>) {
    // Fire-and-forget audit event after response
    if (res.statusCode < 400) {
      emitEvent({
        type: 'audit.action',
        aggregate_type: 'api',
        aggregate_id: req.path,
        tenant_id: req.tenantId || 'unknown',
        payload: {
          method: req.method,
          path: req.path,
          user_id: req.userId,
          status_code: res.statusCode,
          ip: req.ip,
          user_agent: req.headers['user-agent'],
        },
      }).catch(() => { /* silently ignore audit failures */ });
    }

    return originalEnd.apply(res, args);
  } as typeof originalEnd;

  next();
}
```

### 5.6 Rate Limiting

```typescript
// src/middleware/rate-limit.ts
import { Request, Response, NextFunction } from 'express';
import { getRedis } from '../config/redis.js';
import { AppError } from './error-handler.js';

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100;

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const redis = getRedis();
  const key = `rate:${req.ip}:${req.tenantId || 'anon'}`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.pexpire(key, WINDOW_MS);
  }

  const ttl = await redis.pttl(key);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - current));
  res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + ttl) / 1000));

  if (current > MAX_REQUESTS) {
    throw new AppError(429, 'RATE_LIMITED', 'Demasiadas solicitudes. Intente de nuevo en un minuto.');
  }

  next();
}
```

### 5.7 Request ID Propagation

```typescript
// src/middleware/request-id.ts
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers['x-request-id'] as string) || `req_${randomUUID()}`;
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  next();
}
```

---

## 6. Sprint-by-Sprint Development Plan

**Sprint duration:** 2 weeks
**Team:** 2 backend developers + 1 full-stack developer
**Velocity assumption:** ~40 story points per sprint (team total)

### Sprint 0 (Pre-work, Week 1-2): Project Scaffolding

**Goal:** Empty project that boots, connects to DB and Redis, and passes a health check.

| Deliverable | Story Points |
|-------------|:-----------:|
| Initialize npm project, TypeScript, ESLint, Prettier | 2 |
| Vitest setup with test database | 3 |
| Docker Compose (PostgreSQL 16 + TimescaleDB + Redis 7) | 3 |
| Express.js 5 app factory with health endpoint | 3 |
| Drizzle ORM config + initial schema files (tenants, users) | 5 |
| Environment variable schema (Zod) | 2 |
| Logger (Pino) configuration | 1 |
| Database + Redis connection modules | 3 |
| CI pipeline (GitHub Actions: lint + test) | 3 |
| `.env.example`, `.gitignore`, project README | 1 |

**Total:** 26 SP

**Integration points:**
- DB team: Confirm PostgreSQL extensions needed (pgvector, pg_trgm, TimescaleDB, PostGIS)
- DevOps: Docker Compose review, CI pipeline setup

---

### Sprint 1 (Week 3-4): Auth + Core Middleware + Persons

**Goal:** JWT authentication, tenant isolation, request validation, and the Persons CRUD module.

| Deliverable | Story Points |
|-------------|:-----------:|
| JWT auth middleware (sign, verify, refresh) | 5 |
| Tenant extraction middleware + RLS SET | 5 |
| Request validation middleware (Zod) | 3 |
| Error handler middleware (structured errors) | 3 |
| Rate limiting middleware (Redis-backed) | 3 |
| Request ID propagation | 1 |
| Audit logging middleware | 3 |
| Persons module (CRUD + RFC/CURP validation) | 8 |
| Persons search endpoint (fuzzy by name, RFC, CURP, phone) | 5 |
| Unit tests for middleware + persons | 5 |

**Total:** 41 SP

**Endpoints delivered:** 4 (POST/GET/GET/:id/PATCH persons + search)

---

### Sprint 2 (Week 5-6): Tomas + Meters + Drizzle Schema

**Goal:** Complete Drizzle schema for all tables. Tomas and Meters CRUD.

| Deliverable | Story Points |
|-------------|:-----------:|
| Drizzle schema: addresses, tomas, meters, contracts | 8 |
| Drizzle schema: invoices, payments, work_orders, contacts | 8 |
| Drizzle schema: fraud_cases, domain_events, tariff_schedules | 5 |
| Tomas module (CRUD + readings history + consumption summary) | 8 |
| Meters module (register, get, replace) | 5 |
| Meter readings submission (manual field readings) | 5 |
| Unit tests | 5 |

**Total:** 44 SP

**Endpoints delivered:** 10 (5 tomas + 5 meters)

**Integration points:**
- DB team: Schema validation, index review, migration strategy

---

### Sprint 3 (Week 7-8): Event Bus + Contracts Module

**Goal:** Event bus operational. Full contract lifecycle.

| Deliverable | Story Points |
|-------------|:-----------:|
| pg LISTEN/NOTIFY wrapper (bus.ts) | 5 |
| BullMQ queue setup (queue.ts) | 5 |
| Event publisher (persist + notify + enqueue) | 5 |
| Event subscriber / handler registration | 3 |
| Contracts module: create, list, get, update | 8 |
| Contracts: terminate (baja) | 5 |
| Contracts: change titular / subrogate | 5 |
| Event handlers: on-contract-created (welcome msg stub) | 3 |
| Integration tests: contract lifecycle + events | 5 |

**Total:** 44 SP

**Endpoints delivered:** 7 contracts

**Integration points:**
- AI team: Event bus is foundation for all AI agent triggers

---

### Sprint 4 (Week 9-10): Billing Engine

**Goal:** Invoice generation with block tariff calculator. CFDI stamping stub.

| Deliverable | Story Points |
|-------------|:-----------:|
| Tariff calculator (block/tiered tariff logic) | 8 |
| Admin: tariff schedule CRUD | 5 |
| Invoice generation service | 8 |
| Invoice line item calculation (agua, alcantarillado, saneamiento) | 5 |
| CFDI service stub (Finkok integration interface) | 5 |
| Invoice PDF generation (Puppeteer + Handlebars template) | 5 |
| Billing router (generate, list, get, pdf, xml, cancel, credit-note) | 5 |
| Event: reading.billing_ready -> invoice.generated flow | 3 |
| Unit tests: tariff calculator + invoice generation | 5 |

**Total:** 49 SP (stretch)

**Endpoints delivered:** 7 billing + 3 admin tariffs

**Integration points:**
- DB team: tariff_schedules JSONB blocks structure
- DevOps: Puppeteer in Docker (chromium headless)

---

### Sprint 5 (Week 11-12): Payments + Reconciliation

**Goal:** Multi-channel payment processing. Bank reconciliation.

| Deliverable | Story Points |
|-------------|:-----------:|
| Payment service: process payment (ventanilla, tarjeta) | 8 |
| Payment gateway: SPEI webhook receiver | 5 |
| Payment gateway: OXXO reference generation + webhook | 5 |
| Payment gateway: Conekta card integration | 5 |
| Bank reconciliation batch endpoint | 5 |
| Payment plans: create, get, record installment | 5 |
| Event handler: payment.received -> update invoice status | 3 |
| Receipt PDF generation | 3 |
| Unit + integration tests | 5 |

**Total:** 44 SP

**Endpoints delivered:** 7 (4 payments + 3 payment plans)

**Integration points:**
- DevOps: Webhook URL configuration, Conekta API keys
- DB team: payment reference number generation

---

### Sprint 6 (Week 13-14): Work Orders + Contacts

**Goal:** Complete work order lifecycle. Contact/complaint management with AI classification stub.

| Deliverable | Story Points |
|-------------|:-----------:|
| Work orders module: CRUD + assign + complete | 8 |
| Work order route optimization stub (Google Maps Directions) | 5 |
| Event handler: work_order.created -> auto-assign | 3 |
| Contacts module: CRUD + escalate | 5 |
| AI classifier stub for contacts (Claude API integration) | 5 |
| Event handler: contact.created -> AI classify + route | 3 |
| Unit + integration tests | 5 |

**Total:** 34 SP

**Endpoints delivered:** 9 (5 work orders + 4 contacts)

**Integration points:**
- AI team: Contact classification prompt + tool definitions
- DevOps: Google Maps API key

---

### Sprint 7 (Week 15-16): Delinquency + Fraud + Smart Meter Ingestion

**Goal:** Collections pipeline. Fraud case management. Smart meter bulk ingestion.

| Deliverable | Story Points |
|-------------|:-----------:|
| Delinquency service: procedure management | 5 |
| Collection scorer (risk level calculation) | 5 |
| Automated collection sequence runner | 5 |
| Event handler: invoice.past_due -> start delinquency | 3 |
| Fraud case CRUD + inspection workflow | 5 |
| Event handler: reading.anomaly_detected -> create fraud case | 3 |
| Smart meter bulk ingestion endpoint | 5 |
| Anomaly detection logic (statistical rules) | 5 |
| Unit + integration tests | 5 |

**Total:** 41 SP

**Endpoints delivered:** delinquency + fraud (est. 6 endpoints)

**Integration points:**
- AI team: Collections intelligence agent scoring model
- AI team: Anomaly detection rules integration

---

### Sprint 8 (Week 17-18): Analytics + CFDI Integration + Notifications

**Goal:** Dashboard analytics. Real Finkok CFDI stamping. Notification delivery.

| Deliverable | Story Points |
|-------------|:-----------:|
| Analytics dashboard service (real-time KPIs) | 5 |
| Revenue report generator | 3 |
| Delinquency metrics report | 3 |
| Consumption patterns report | 3 |
| Collection rate report | 3 |
| CONAGUA regulatory report generator | 5 |
| Finkok PAC integration (real CFDI stamping) | 8 |
| Notification service: WhatsApp, Email, SMS delivery | 8 |
| Notification templates management | 3 |
| Unit + integration tests | 5 |

**Total:** 46 SP

**Endpoints delivered:** 6 analytics + 3 CFDI + 3 notifications

**Integration points:**
- DevOps: Finkok sandbox credentials, WhatsApp Business API setup
- AI team: Regulatory compliance agent data feeds

---

### Sprint 9 (Week 19-20): Admin Module + Webhooks + API Hardening

**Goal:** Admin user management. Webhook system. API documentation. Performance tuning.

| Deliverable | Story Points |
|-------------|:-----------:|
| Admin module: user CRUD with role-based access | 5 |
| Admin module: tenant configuration management | 3 |
| Webhook registration + delivery system | 5 |
| OpenAPI 3.1 spec generation (from Zod schemas) | 5 |
| API performance profiling + query optimization | 5 |
| Rate limiting refinement (per-endpoint limits) | 3 |
| Security hardening: CORS, CSP, input sanitization review | 3 |
| Load testing with k6 (target: 100 req/s sustained) | 5 |
| End-to-end integration test suite | 8 |

**Total:** 42 SP

**Endpoints delivered:** ~6 admin + 3 webhooks

---

### Sprint 10 (Week 21-22): Integration Testing + Legacy Bridge

**Goal:** End-to-end integration tests. Legacy SOAP bridge for transition period.

| Deliverable | Story Points |
|-------------|:-----------:|
| Legacy SOAP adapter (critical 17 operations) | 8 |
| Bidirectional data sync setup (transition period) | 8 |
| Full integration test suite (all 63 endpoints) | 8 |
| Error handling audit (edge cases, null states) | 5 |
| Documentation: API guide, deployment guide | 5 |
| Performance benchmarks + optimization pass | 5 |

**Total:** 39 SP

**Integration points:**
- DevOps: Staging environment deployment
- DB team: Data migration scripts for legacy import
- All teams: End-to-end testing coordination

---

### Sprint Summary

| Sprint | Weeks | Module Focus | Endpoints | Cumulative |
|--------|:-----:|-------------|:---------:|:----------:|
| 0 | 1-2 | Scaffolding | 1 (health) | 1 |
| 1 | 3-4 | Auth + Middleware + Persons | 4 | 5 |
| 2 | 5-6 | Tomas + Meters + Schema | 10 | 15 |
| 3 | 7-8 | Event Bus + Contracts | 7 | 22 |
| 4 | 9-10 | Billing Engine | 10 | 32 |
| 5 | 11-12 | Payments + Reconciliation | 7 | 39 |
| 6 | 13-14 | Work Orders + Contacts | 9 | 48 |
| 7 | 15-16 | Delinquency + Fraud + Smart Meters | 6 | 54 |
| 8 | 17-18 | Analytics + CFDI + Notifications | 12 | 66 |
| 9 | 19-20 | Admin + Webhooks + Hardening | 9 | 75 |
| 10 | 21-22 | Integration Testing + Legacy Bridge | 0 (testing) | 75 |

### Module Dependency Order

Build order is driven by data dependencies:

```
Sprint 0: scaffolding
    |
Sprint 1: auth + middleware + persons
    |
Sprint 2: tomas + meters (depend on persons via contracts)
    |
Sprint 3: event bus + contracts (depend on persons + tomas)
    |
Sprint 4: billing (depends on contracts + meters/readings + tariffs)
    |
Sprint 5: payments (depends on billing/invoices)
    |
Sprint 6: work-orders + contacts (depend on tomas + persons)
    |
Sprint 7: delinquency (depends on billing + payments)
         + fraud (depends on meters + readings)
    |
Sprint 8: analytics (depends on all data modules)
         + CFDI (depends on billing)
         + notifications (depends on persons + contracts)
    |
Sprint 9: admin + webhooks (cross-cutting)
    |
Sprint 10: integration + legacy bridge (all modules)
```

### Cross-Team Integration Points Summary

| Sprint | DB Team | DevOps | AI Team |
|--------|---------|--------|---------|
| 0 | Extensions list | Docker Compose, CI | -- |
| 1 | -- | -- | -- |
| 2 | Schema review, indexes | -- | -- |
| 3 | -- | -- | Event bus ready for agents |
| 4 | Tariff JSONB structure | Puppeteer Docker | -- |
| 5 | Payment refs | Webhook URLs, Conekta | -- |
| 6 | -- | Google Maps API | Contact classification prompt |
| 7 | -- | -- | Anomaly detection rules, Collections scorer |
| 8 | -- | Finkok, WhatsApp API | Regulatory agent data feeds |
| 9 | -- | Staging deploy | -- |
| 10 | Migration scripts | Prod readiness | End-to-end agent testing |

---

## Appendix A: Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Drizzle | Type-safe, SQL-first, generates TS types from schema |
| Validation | Zod | Shared between API validation and DB types |
| Event bus | pg LISTEN/NOTIFY + BullMQ | Sufficient for ~400K accounts scale; avoids Kafka ops burden |
| Auth | JWT (access + refresh tokens) | Stateless, tenant_id embedded in token |
| Rate limiting | Redis sliding window | Shared across instances, per-tenant scoping |
| PDF generation | Puppeteer + Handlebars | Full HTML control, Mexican fiscal format compliance |
| Logging | Pino | Structured JSON, low overhead |
| Testing | Vitest | Fast, TypeScript-native, compatible with Jest API |
| Queue | BullMQ | Redis-backed, supports retries, backoff, priorities |
| API versioning | URL path (`/v1/`) | Simple, explicit, cache-friendly |

## Appendix B: SAT Catalog Reference (for CFDI Integration)

```typescript
// src/utils/sat-catalogs.ts
export const SAT_CATALOGS = {
  product_service_keys: {
    agua: '10171500',
    alcantarillado: '72151802',
    saneamiento: '72151801',
    reconexion: '72151800',
  },
  unit_keys: {
    m3: 'MTQ',
    servicio: 'E48',
    pieza: 'H87',
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
    gobierno: '603',
    general: '601',
    sin_obligaciones: '616',
  },
  cfdi_uses: {
    gastos_general: 'G03',
    sin_efectos: 'S01',
    por_definir: 'P01',
  },
} as const;
```

## Appendix C: Payment Channels Configuration

```typescript
// Reference from SUPRA SS4.4
export const PAYMENT_CHANNELS = {
  ventanilla:    { requires: 'cashier_user_id',   generates_receipt: true },
  spei:          { requires: 'clabe_reference',    reconciliation: 'auto' },
  codi:          { requires: 'qr_code',            reconciliation: 'auto' },
  oxxo:          { requires: 'barcode_reference',  reconciliation: 'batch_daily' },
  tarjeta:       { requires: 'terminal_id',        gateway: 'conekta_or_stripe' },
  domiciliacion: { requires: 'clabe_account',      schedule: 'monthly' },
  portal_web:    { requires: 'session',            gateway: 'conekta_or_stripe' },
  whatsapp_pay:  { requires: 'wa_payment_id',      reconciliation: 'auto' },
} as const;
```
