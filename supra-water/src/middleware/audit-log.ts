import type { Request, Response, NextFunction } from 'express';

// PII-sensitive path patterns for LFPDPPP compliance logging
const PII_PATTERNS = ['/persons', '/contracts', '/contacts'];

/**
 * Audit logging middleware.
 * Logs userId, tenantId, method, path, statusCode, duration, and IP.
 * For PII endpoints, logs access for LFPDPPP compliance.
 */
export function auditLog(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const isPii = PII_PATTERNS.some((p) => req.path.includes(p));

    const entry = {
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
      userId: req.user?.userId ?? null,
      tenantId: req.tenantId ?? null,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...(isPii && { piiAccess: true, compliance: 'LFPDPPP' }),
    };

    // In production this would write to a persistent audit store.
    // For now, structured JSON to stdout (captured by log aggregator).
    if (req.method !== 'OPTIONS') {
      console.log(JSON.stringify(entry));
    }
  });

  next();
}
