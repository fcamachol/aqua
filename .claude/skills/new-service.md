---
name: new-service
description: Create a new domain microservice with SUPRA Water boilerplate including Docker, routes, health checks, and monitoring
---

# New Domain Microservice

Scaffold a complete domain microservice for the SUPRA Water 2026 platform (Node.js 22 LTS, TypeScript 5.x strict, Express.js 5, Drizzle ORM, PostgreSQL 16).

## Step 1: Gather Requirements

Ask the user:
- Service name (e.g., `billing-service`, `readings-service`, `meters-service`, `collections-service`)
- Domain it belongs to (e.g., billing, field-operations, customer-management, water-network)
- Key entities the service manages (e.g., facturas, pagos, adeudos)
- Does it need BullMQ job queues? If so, for what (e.g., invoice generation, payment processing)?
- Does it connect to any Aquasis SOAP services?
- Does it need TimescaleDB hypertables?

## Step 2: Scaffold the Service Directory

Create the following file structure under `services/{name}/`:

### `services/{name}/package.json`

```json
{
  "name": "@supra/{name}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "express": "^5.0.0",
    "drizzle-orm": "^0.38.0",
    "postgres": "^3.4.0",
    "zod": "^3.24.0",
    "jsonwebtoken": "^9.0.0",
    "pino": "^9.0.0",
    "pino-http": "^10.0.0",
    "prom-client": "^15.0.0",
    "dotenv": "^16.4.0",
    "bullmq": "^5.0.0",
    "ioredis": "^5.4.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tsx": "^4.19.0",
    "vitest": "^3.0.0",
    "supertest": "^7.0.0",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/supertest": "^6.0.0",
    "drizzle-kit": "^0.30.0",
    "eslint": "^9.0.0"
  }
}
```

### `services/{name}/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2024"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### `services/{name}/src/config.ts`

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis (for BullMQ and caching)
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default('supra-water'),

  // Observability
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),

  // Service-specific config below
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
```

### `services/{name}/src/index.ts`

```typescript
import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { db } from './db';

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info({ port: config.PORT, env: config.NODE_ENV }, `{name} service started`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal, starting graceful shutdown');

  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connections
    await db.$client.end();
    logger.info('Database connections closed');

    process.exit(0);
  });

  // Force shutdown after 30s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### `services/{name}/src/app.ts`

```typescript
import express from 'express';
import pinoHttp from 'pino-http';
import { logger } from './logger';
import { healthRoutes } from './routes/health.routes';
import { metricsRoutes } from './routes/metrics.routes';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
// Import domain routes here

const app = express();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(pinoHttp({ logger }));

// Infrastructure routes (no auth required)
app.use('/', healthRoutes);
app.use('/', metricsRoutes);

// Domain routes (auth required)
// app.use('/api/v1/{resource}', authenticate, requireTenant, {resource}Routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
```

### `services/{name}/src/logger.ts`

```typescript
import pino from 'pino';
import { config } from './config';

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: config.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  base: { service: '{name}' },
});
```

### `services/{name}/src/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config';
import * as schema from './schema';

const client = postgres(config.DATABASE_URL, {
  max: config.DATABASE_POOL_MAX,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
```

### `services/{name}/src/db/schema/index.ts`

```typescript
// Export all table schemas
// Example:
// export { facturas } from './facturas';
// export { pagos } from './pagos';
```

### `services/{name}/src/routes/health.routes.ts`

```typescript
import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Liveness probe — is the process running?
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: '{name}',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness probe — can the service handle requests?
router.get('/ready', async (_req, res) => {
  try {
    // Check database connectivity
    await db.execute(sql`SELECT 1`);

    res.json({
      status: 'ready',
      service: '{name}',
      checks: {
        database: 'ok',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      service: '{name}',
      checks: {
        database: 'failed',
      },
    });
  }
});

export { router as healthRoutes };
```

### `services/{name}/src/routes/metrics.routes.ts`

```typescript
import { Router } from 'express';
import client from 'prom-client';

const router = Router();

// Collect default metrics (CPU, memory, event loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Prometheus metrics endpoint
router.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end();
  }
});

export { router as metricsRoutes, httpRequestDuration, httpRequestTotal };
```

### `services/{name}/src/middleware/auth.ts`

```typescript
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './error-handler';

interface AuthPayload {
  sub: string;       // user ID
  tenantId: string;  // tenant UUID
  role: string;      // user role
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, config.JWT_SECRET, {
      issuer: config.JWT_ISSUER,
    }) as AuthPayload;

    req.auth = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(401, 'Invalid or expired token');
  }
}
```

### `services/{name}/src/middleware/tenant.ts`

```typescript
import type { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler';

export function requireTenant(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth?.tenantId) {
    throw new AppError(403, 'Tenant context required');
  }
  next();
}
```

### `services/{name}/src/middleware/error-handler.ts`

```typescript
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      },
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code ?? 'APP_ERROR',
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Unknown errors
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
```

### `services/{name}/src/middleware/not-found.ts`

```typescript
import type { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
```

### `services/{name}/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig.json ./
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Stage 2: Production
FROM node:22-alpine AS runner

# Security: run as non-root
RUN addgroup --system --gid 1001 supra && \
    adduser --system --uid 1001 supra

WORKDIR /app

# Copy built artifacts
COPY --from=builder --chown=supra:supra /app/dist ./dist
COPY --from=builder --chown=supra:supra /app/node_modules ./node_modules
COPY --from=builder --chown=supra:supra /app/package.json ./

USER supra

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

### `services/{name}/.env.example`

```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://supra:supra@localhost:5432/supra_{name}
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change-me-to-a-32-char-or-longer-secret
JWT_ISSUER=supra-water

# Observability
LOG_LEVEL=debug
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Step 3: Verify and Remind

After generating all files:

1. Replace all `{name}` placeholders with the actual service name
2. Add domain-specific entities to `src/db/schema/`
3. Create domain routes and register them in `src/app.ts`
4. Run `npm install` in the service directory
5. Verify TypeScript compiles: `npx tsc --noEmit`
6. Test health endpoints: `curl http://localhost:{PORT}/health`
7. Add the service to the root `docker-compose.yml`
8. Add the service to the CI/CD pipeline

## SUPRA Service Naming Conventions

Use these standard service names:
- `billing-service` — facturas, pagos, adeudos
- `readings-service` — lecturas, consumos, rutas_lectura
- `meters-service` — medidores, tomas, padron_usuarios
- `collections-service` — cobranza, convenios, cortes
- `field-service` — ordenes_trabajo, cuadrillas, materiales
- `notifications-service` — SMS, email, WhatsApp, push
- `auth-service` — users, roles, permissions, tenants
- `gateway-service` — API gateway, rate limiting, routing
