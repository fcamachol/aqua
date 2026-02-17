import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { redis } from '../../config/redis.js';
import type { AuthenticatedRequest } from '../../types/index.js';

// =============================================================
// Webhook Router — register/list/remove external webhooks
// POST   /webhooks
// GET    /webhooks
// DELETE /webhooks/:id
// =============================================================

const router = Router();

const WEBHOOK_KEY_PREFIX = 'webhooks:';

interface WebhookRegistration {
  id: string;
  tenantId: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}

// ─── Register Webhook ──────────────────────────────────────────

const createWebhookSchema = z.object({
  url: z.string().url(),
  events: z
    .array(
      z.string().regex(/^[a-z_]+\.[a-z_]+$/, 'Event format: "aggregate.action"'),
    )
    .min(1),
});

router.post('/', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = createWebhookSchema.parse(req.body);

    const id = crypto.randomUUID();
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook: WebhookRegistration = {
      id,
      tenantId: authReq.tenantId,
      url: input.url,
      events: input.events,
      secret,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const key = `${WEBHOOK_KEY_PREFIX}${authReq.tenantId}`;
    await redis.hset(key, id, JSON.stringify(webhook));

    res.status(201).json({
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret,
        active: webhook.active,
        createdAt: webhook.createdAt,
      },
    });
  } catch (err) { next(err); }
});

// ─── List Webhooks ─────────────────────────────────────────────

router.get('/', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const key = `${WEBHOOK_KEY_PREFIX}${authReq.tenantId}`;
    const entries = await redis.hgetall(key);

    const webhooks = Object.values(entries).map((raw) => {
      const wh = JSON.parse(raw) as WebhookRegistration;
      return {
        id: wh.id,
        url: wh.url,
        events: wh.events,
        active: wh.active,
        createdAt: wh.createdAt,
      };
    });

    res.json({ success: true, data: webhooks });
  } catch (err) { next(err); }
});

// ─── Remove Webhook ────────────────────────────────────────────

const webhookIdSchema = z.object({ id: z.string().uuid() });

router.delete('/:id', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = webhookIdSchema.parse(req.params);
    const key = `${WEBHOOK_KEY_PREFIX}${authReq.tenantId}`;

    const removed = await redis.hdel(key, id);
    if (!removed) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Webhook not found', correlationId: authReq.correlationId },
      });
      return;
    }

    res.json({ success: true, data: { message: 'Webhook removed' } });
  } catch (err) { next(err); }
});

export { router as webhookRouter };
