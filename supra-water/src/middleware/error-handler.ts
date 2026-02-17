import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiError } from '../types/index.js';

/**
 * Global error handler.
 * Maps known error types to proper HTTP status codes and structured JSON.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const correlationId = req.correlationId ?? 'unknown';

  // Zod validation errors -> 400
  if (err instanceof ZodError) {
    const body: ApiError = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
        correlationId,
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof Error) {
    // Auth errors
    if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
      const body: ApiError = {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required', correlationId },
      };
      res.status(401).json(body);
      return;
    }

    if (err.name === 'ForbiddenError' || err.message === 'Forbidden') {
      const body: ApiError = {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions', correlationId },
      };
      res.status(403).json(body);
      return;
    }

    // Not found
    if (err.name === 'NotFoundError' || err.message === 'Not Found') {
      const body: ApiError = {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resource not found', correlationId },
      };
      res.status(404).json(body);
      return;
    }
  }

  // Catch-all 500
  console.error(`[${correlationId}] Unhandled error:`, err);
  const body: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      correlationId,
    },
  };
  res.status(500).json(body);
}
