import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import crypto from 'node:crypto';
import { env } from './config/env.js';
import { pgClient } from './config/database.js';
import { redis } from './config/redis.js';
import { authenticate } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';
import { errorHandler } from './middleware/error-handler.js';
import { rateLimit } from './middleware/rate-limit.js';
import { auditLog } from './middleware/audit-log.js';
import { personsRouter } from './modules/persons/router.js';
import { tomasRouter } from './modules/tomas/router.js';
import { contractsRouter } from './modules/contracts/router.js';
import { metersRouter } from './modules/meters/router.js';
import { authRouter } from './modules/admin/auth-router.js';
import { adminRouter } from './modules/admin/router.js';
import { notificationRouter } from './modules/admin/notification-router.js';
import { webhookRouter } from './modules/admin/webhook-router.js';

const app = express();

// --------------- Global middleware ---------------
app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));

// Assign a correlation ID to every request
app.use((req, _res, next) => {
  req.correlationId = (req.headers['x-correlation-id'] as string) ?? crypto.randomUUID();
  next();
});

// Rate limiting (global default: 100 req/min)
app.use(rateLimit());

// Audit logging
app.use(auditLog);

// --------------- Health check ---------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Public auth routes (no JWT required) ---------------
app.use('/auth', authRouter);

// --------------- Tenant-scoped API routes ---------------
// All module routers mount under /:tenant_slug/v1/
const tenantRouter = express.Router({ mergeParams: true });

// Auth + tenant resolution for all tenant-scoped routes
tenantRouter.use(authenticate);
tenantRouter.use(tenantMiddleware);

// Module routers
tenantRouter.use('/persons', personsRouter);
tenantRouter.use('/contracts', contractsRouter);
tenantRouter.use('/tomas', tomasRouter);
tenantRouter.use('/meters', metersRouter);
tenantRouter.use('/admin', adminRouter);
tenantRouter.use('/notifications', notificationRouter);
tenantRouter.use('/webhooks', webhookRouter);
// tenantRouter.use('/billing', billingRouter);
// tenantRouter.use('/payments', paymentsRouter);
// tenantRouter.use('/work-orders', workOrdersRouter);
// tenantRouter.use('/contacts', contactsRouter);
// tenantRouter.use('/delinquency', delinquencyRouter);
// tenantRouter.use('/fraud', fraudRouter);
// tenantRouter.use('/analytics', analyticsRouter);

app.use('/:tenant_slug/v1', tenantRouter);

// --------------- 404 catch-all ---------------
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      correlationId: 'unknown',
    },
  });
});

// --------------- Error handler ---------------
app.use(errorHandler);

// --------------- Start server ---------------
const server = app.listen(env.PORT, () => {
  console.log(`SUPRA Water API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// --------------- Graceful shutdown ---------------
function shutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await pgClient.end();
      redis.disconnect();
      console.log('All connections closed. Exiting.');
    } catch (err) {
      console.error('Error during shutdown:', err);
    }
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
