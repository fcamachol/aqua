import type { Request, Response, NextFunction } from 'express';
import { pgClient } from '../config/database.js';

/**
 * Multi-tenant middleware.
 * Extracts tenant from JWT payload or from the :tenant_slug URL param.
 * Sets PostgreSQL session variable `app.current_tenant` for RLS policies.
 */
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Priority: JWT tenantId > URL slug
  const tenantId = req.user?.tenantId;
  const tenantSlug = req.params.tenant_slug;

  if (!tenantId && !tenantSlug) {
    res.status(400).json({
      success: false,
      error: {
        code: 'TENANT_REQUIRED',
        message: 'Tenant identification required',
        correlationId: req.correlationId ?? 'unknown',
      },
    });
    return;
  }

  try {
    // If we have a tenantId from JWT, use it directly
    if (tenantId) {
      req.tenantId = tenantId;
      await pgClient`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
      next();
      return;
    }

    // Resolve slug to tenantId
    const rows = await pgClient`
      SELECT id::text FROM tenants WHERE slug = ${tenantSlug!} LIMIT 1
    `;
    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          code: 'TENANT_NOT_FOUND',
          message: `Tenant '${tenantSlug}' not found`,
          correlationId: req.correlationId ?? 'unknown',
        },
      });
      return;
    }

    const resolvedId = rows[0].id;
    req.tenantId = resolvedId;
    await pgClient`SELECT set_config('app.current_tenant', ${resolvedId}, true)`;
    next();
  } catch (err) {
    next(err);
  }
}
