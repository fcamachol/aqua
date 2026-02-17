---
name: add-monitoring
description: Add Prometheus metrics and Grafana dashboard for a SUPRA Water service
---

# Add Monitoring to a SUPRA Water Service

When this skill is invoked, guide the user through adding full observability (Prometheus metrics, Grafana dashboards, and alerting rules) to a SUPRA Water microservice.

## Step 1: Identify the Service

Ask the user which service to add monitoring for. Common SUPRA Water services:

- `billing-service` - Facturacion, CFDI generation, tarifa escalonada
- `readings-service` - Lecturas, meter reading processing
- `contracts-service` - Contratacion, tomas, padron de usuarios
- `payments-service` - Cobranza, payment processing, convenios de pago
- `auth-service` - Authentication and authorization
- `gateway` - API gateway / Traefik
- `notifications-service` - SMS, email, push notifications

Identify domain-specific metrics that would be valuable for this service (covered in Step 3).

## Step 2: Add prom-client Dependency

Check if `prom-client` is already in the service's `package.json`. If not, add it:

```bash
cd services/{SERVICE_NAME}
npm install prom-client
```

Also verify these are present (add if missing):
- `prom-client` - Prometheus client for Node.js
- `response-time` - For measuring HTTP response times (optional, can use prom-client histogram directly)

## Step 3: Create Metrics Module

Create `src/metrics.ts` in the service directory with the following metrics:

```typescript
import client from 'prom-client';

// Enable default metrics (CPU, memory, event loop, GC)
client.collectDefaultMetrics({
  prefix: 'supra_',
  labels: { service: '{SERVICE_NAME}' },
});

// HTTP request duration histogram
export const httpRequestDuration = new client.Histogram({
  name: 'supra_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status_code'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// HTTP request counter
export const httpRequestsTotal = new client.Counter({
  name: 'supra_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code'] as const,
});

// Active connections gauge
export const activeConnections = new client.Gauge({
  name: 'supra_active_connections',
  help: 'Number of active connections',
  labelNames: ['service'] as const,
});

// Database query duration
export const dbQueryDuration = new client.Histogram({
  name: 'supra_db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'] as const,
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});

// Database connection pool gauge
export const dbPoolConnections = new client.Gauge({
  name: 'supra_db_pool_connections',
  help: 'Number of database pool connections',
  labelNames: ['state'] as const,  // active, idle, waiting
});
```

Then add **domain-specific metrics** based on the service:

**billing-service:**
```typescript
export const invoicesGenerated = new client.Counter({
  name: 'supra_invoices_generated_total',
  help: 'Total invoices (recibos) generated',
  labelNames: ['type', 'status'] as const,  // type: normal, complemento; status: success, error
});

export const cfdiTimbradoDuration = new client.Histogram({
  name: 'supra_cfdi_timbrado_duration_seconds',
  help: 'Duration of CFDI timbrado (stamping) via Finkok PAC',
  buckets: [0.5, 1, 2, 5, 10, 30],
});

export const tarifaCalculations = new client.Counter({
  name: 'supra_tarifa_calculations_total',
  help: 'Total tarifa escalonada calculations',
  labelNames: ['tarifa_type'] as const,  // domestica, comercial, industrial
});
```

**readings-service:**
```typescript
export const readingsProcessed = new client.Counter({
  name: 'supra_readings_processed_total',
  help: 'Total meter readings (lecturas) processed',
  labelNames: ['method', 'status'] as const,  // method: manual, automatic; status: valid, anomaly
});

export const readingAnomalies = new client.Counter({
  name: 'supra_reading_anomalies_total',
  help: 'Readings flagged as anomalous',
  labelNames: ['anomaly_type'] as const,  // high_consumption, negative, zero, meter_stopped
});
```

**contracts-service:**
```typescript
export const contractsCreated = new client.Counter({
  name: 'supra_contracts_created_total',
  help: 'Total new contracts (tomas) created',
  labelNames: ['toma_type'] as const,  // domestica, comercial, industrial, gobierno
});

export const tomaStatusChanges = new client.Counter({
  name: 'supra_toma_status_changes_total',
  help: 'Toma status changes',
  labelNames: ['from_status', 'to_status'] as const,
});
```

**payments-service:**
```typescript
export const paymentsProcessed = new client.Counter({
  name: 'supra_payments_processed_total',
  help: 'Total payments processed',
  labelNames: ['forma_pago', 'status'] as const,  // forma_pago: efectivo, tarjeta, transferencia
});

export const conveniosCreated = new client.Counter({
  name: 'supra_convenios_created_total',
  help: 'Payment plans (convenios de pago) created',
});

export const debtRecoveryAmount = new client.Gauge({
  name: 'supra_debt_recovery_amount_mxn',
  help: 'Total debt recovered in MXN',
  labelNames: ['period'] as const,
});
```

## Step 4: Add Metrics Middleware to Express

Create `src/middleware/metrics.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestsTotal, activeConnections } from '../metrics';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Skip metrics endpoint itself to avoid recursion
  if (req.path === '/metrics') {
    next();
    return;
  }

  activeConnections.inc({ service: '{SERVICE_NAME}' });
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    const normalizedPath = normalizePath(req.route?.path || req.path);
    const labels = {
      method: req.method,
      path: normalizedPath,
      status_code: res.statusCode.toString(),
    };

    end(labels);
    httpRequestsTotal.inc(labels);
    activeConnections.dec({ service: '{SERVICE_NAME}' });
  });

  next();
}

/**
 * Normalize paths to avoid high cardinality.
 * Replace dynamic segments (UUIDs, IDs) with placeholders.
 */
function normalizePath(path: string): string {
  return path
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ':id')
    .replace(/\/\d+/g, '/:id');
}
```

Register the middleware in the Express app (e.g., `src/app.ts`):

```typescript
import { metricsMiddleware } from './middleware/metrics.middleware';

// Add before route handlers
app.use(metricsMiddleware);
```

## Step 5: Expose Metrics Endpoint

Add a `/metrics` route in the Express app:

```typescript
import client from 'prom-client';

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err instanceof Error ? err.message : 'Error collecting metrics');
  }
});
```

Verify the endpoint works:
- Start the service locally
- `curl http://localhost:8080/metrics`
- Confirm Prometheus text format output is returned with the defined metrics

## Step 6: Create Grafana Dashboard

Create `monitoring/dashboards/{SERVICE_NAME}.json` with a Grafana dashboard containing:

**Row 1 - Request Overview:**
- Panel: Request Rate (queries per second) - `rate(supra_http_requests_total{service="{SERVICE_NAME}"}[5m])`
- Panel: Error Rate (4xx + 5xx) - `rate(supra_http_requests_total{service="{SERVICE_NAME}", status_code=~"[45].."}[5m])`
- Panel: Error Percentage - `(rate(...status_code=~"[45].."...)/rate(...total...))*100`

**Row 2 - Latency:**
- Panel: p50 Latency - `histogram_quantile(0.5, rate(supra_http_request_duration_seconds_bucket{service="{SERVICE_NAME}"}[5m]))`
- Panel: p95 Latency - `histogram_quantile(0.95, ...)`
- Panel: p99 Latency - `histogram_quantile(0.99, ...)`
- Panel: Latency Heatmap - using the histogram bucket data

**Row 3 - Infrastructure:**
- Panel: Active Connections - `supra_active_connections{service="{SERVICE_NAME}"}`
- Panel: Memory Usage - `process_resident_memory_bytes{service="{SERVICE_NAME}"}`
- Panel: CPU Usage - `rate(process_cpu_seconds_total{service="{SERVICE_NAME}"}[5m])`
- Panel: Event Loop Lag - `nodejs_eventloop_lag_seconds{service="{SERVICE_NAME}"}`

**Row 4 - Database:**
- Panel: Query Duration (p95) - `histogram_quantile(0.95, rate(supra_db_query_duration_seconds_bucket{...}[5m]))`
- Panel: Connection Pool - `supra_db_pool_connections` by state

**Row 5 - Domain Metrics:**
- Add panels specific to the service's domain metrics (invoices generated, readings processed, etc.)

Use the following dashboard settings:
- Templating variable for environment: `$env` with values `staging`, `production`
- Time range: last 6 hours default, with auto-refresh every 30 seconds
- UID format: `supra-{SERVICE_NAME}`

Create the `monitoring/dashboards/` directory if it does not exist.

## Step 7: Create Prometheus Alerting Rules

Create `monitoring/alerts/{SERVICE_NAME}.yml` with alerting rules:

```yaml
groups:
  - name: supra_{SERVICE_NAME}_alerts
    rules:
      # High error rate
      - alert: HighErrorRate_{SERVICE_NAME}
        expr: |
          (
            sum(rate(supra_http_requests_total{service="{SERVICE_NAME}", status_code=~"5.."}[5m]))
            /
            sum(rate(supra_http_requests_total{service="{SERVICE_NAME}"}[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
          service: {SERVICE_NAME}
          team: supra
        annotations:
          summary: "High error rate on {SERVICE_NAME}"
          description: "Error rate is above 5% for the last 5 minutes. Current value: {{ $value | humanizePercentage }}"

      # High latency
      - alert: HighLatency_{SERVICE_NAME}
        expr: |
          histogram_quantile(0.99,
            sum(rate(supra_http_request_duration_seconds_bucket{service="{SERVICE_NAME}"}[5m])) by (le)
          ) > 2
        for: 5m
        labels:
          severity: warning
          service: {SERVICE_NAME}
          team: supra
        annotations:
          summary: "High p99 latency on {SERVICE_NAME}"
          description: "p99 latency is above 2 seconds. Current value: {{ $value | humanizeDuration }}"

      # Service down
      - alert: ServiceDown_{SERVICE_NAME}
        expr: up{service="{SERVICE_NAME}"} == 0
        for: 1m
        labels:
          severity: critical
          service: {SERVICE_NAME}
          team: supra
        annotations:
          summary: "{SERVICE_NAME} is down"
          description: "{SERVICE_NAME} has been unreachable for more than 1 minute"

      # High memory usage
      - alert: HighMemoryUsage_{SERVICE_NAME}
        expr: |
          process_resident_memory_bytes{service="{SERVICE_NAME}"}
          / on() group_left() machine_memory_bytes > 0.85
        for: 10m
        labels:
          severity: warning
          service: {SERVICE_NAME}
          team: supra
        annotations:
          summary: "High memory usage on {SERVICE_NAME}"
          description: "Memory usage is above 85% for the last 10 minutes"

      # Database query slow
      - alert: SlowDatabaseQueries_{SERVICE_NAME}
        expr: |
          histogram_quantile(0.95,
            sum(rate(supra_db_query_duration_seconds_bucket{service="{SERVICE_NAME}"}[5m])) by (le)
          ) > 1
        for: 5m
        labels:
          severity: warning
          service: {SERVICE_NAME}
          team: supra
        annotations:
          summary: "Slow database queries on {SERVICE_NAME}"
          description: "p95 database query duration is above 1 second"
```

Add domain-specific alerts based on the service type (e.g., CFDI timbrado failures for billing-service, reading anomaly spikes for readings-service).

Create the `monitoring/alerts/` directory if it does not exist.

After completing all steps, verify:
- `src/metrics.ts` exports all metric objects
- Metrics middleware is registered in the Express app
- `/metrics` endpoint returns data
- Dashboard JSON is valid and importable
- Alert rules YAML is valid
