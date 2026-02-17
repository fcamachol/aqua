import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.js';
import type { JwtPayload, UserRole } from '../types/index.js';

/**
 * JWT authentication middleware.
 * Extracts Bearer token, verifies it, and attaches user to request.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid Authorization header',
        correlationId: req.correlationId ?? 'unknown',
      },
    });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, authConfig.jwt.secret, {
      algorithms: [authConfig.jwt.algorithm],
      issuer: authConfig.jwt.issuer,
    }) as JwtPayload;

    req.user = payload;
    next();
  } catch (err) {
    const message = err instanceof jwt.TokenExpiredError
      ? 'Token expired'
      : 'Invalid token';
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
        correlationId: req.correlationId ?? 'unknown',
      },
    });
  }
}

/**
 * Role-based authorization middleware.
 * Must be used after `authenticate`.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          correlationId: req.correlationId ?? 'unknown',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          correlationId: req.correlationId ?? 'unknown',
        },
      });
      return;
    }

    next();
  };
}
