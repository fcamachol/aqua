import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { authConfig } from '../../config/auth.js';
import { redis } from '../../config/redis.js';
import { getUserByEmail, updateLastLogin } from './user-service.js';
import type { JwtPayload } from '../../types/index.js';

// =============================================================
// Auth Router — public (no auth middleware required)
// POST /auth/login
// POST /auth/refresh
// POST /auth/logout
// =============================================================

const router = Router();

const REFRESH_TOKEN_PREFIX = 'refresh:';
const REFRESH_TOKEN_BYTES = 48;

// ─── Login ──────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await getUserByEmail(email);
    if (!user || !user.active) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', correlationId: req.correlationId ?? 'unknown' },
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', correlationId: req.correlationId ?? 'unknown' },
      });
      return;
    }

    // Build JWT payload
    const payload: JwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role as JwtPayload['role'],
      email: user.email,
    };

    const accessToken = jwt.sign(payload, authConfig.jwt.secret, {
      algorithm: authConfig.jwt.algorithm,
      expiresIn: authConfig.jwt.expiration,
      issuer: authConfig.jwt.issuer,
    });

    // Generate refresh token and store in Redis
    const refreshToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const refreshKey = `${REFRESH_TOKEN_PREFIX}${refreshToken}`;
    // Parse refresh expiration string (e.g. "7d") into seconds
    const refreshTtl = parseDuration(authConfig.jwt.refreshExpiration);
    await redis.set(refreshKey, JSON.stringify(payload), 'EX', refreshTtl);

    await updateLastLogin(user.id);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: authConfig.jwt.expiration,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (err) { next(err); }
});

// ─── Refresh ────────────────────────────────────────────────────

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const refreshKey = `${REFRESH_TOKEN_PREFIX}${refreshToken}`;

    const stored = await redis.get(refreshKey);
    if (!stored) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token', correlationId: req.correlationId ?? 'unknown' },
      });
      return;
    }

    const payload = JSON.parse(stored) as JwtPayload;

    const accessToken = jwt.sign(payload, authConfig.jwt.secret, {
      algorithm: authConfig.jwt.algorithm,
      expiresIn: authConfig.jwt.expiration,
      issuer: authConfig.jwt.issuer,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        expiresIn: authConfig.jwt.expiration,
      },
    });
  } catch (err) { next(err); }
});

// ─── Logout ─────────────────────────────────────────────────────

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = logoutSchema.parse(req.body);
    const refreshKey = `${REFRESH_TOKEN_PREFIX}${refreshToken}`;
    await redis.del(refreshKey);
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (err) { next(err); }
});

export { router as authRouter };

// =============================================================
// Helpers
// =============================================================

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)\s*(s|m|h|d)$/);
  if (!match) return 7 * 24 * 3600; // default 7 days
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 7 * 86400;
  }
}
