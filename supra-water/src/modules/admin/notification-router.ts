import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../../types/index.js';

// =============================================================
// Notification Router
// POST /:tenant_slug/v1/notifications/send
// POST /:tenant_slug/v1/notifications/broadcast
// GET  /:tenant_slug/v1/notifications/templates
// =============================================================

const router = Router();

// ─── Send Notification ──────────────────────────────────────────

const sendNotificationSchema = z.object({
  personId: z.string().uuid(),
  channel: z.enum(['whatsapp', 'sms', 'email']),
  templateId: z.string().optional(),
  subject: z.string().max(300).optional(),
  body: z.string().max(5000),
  variables: z.record(z.string()).optional(),
});

router.post('/send', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = sendNotificationSchema.parse(req.body);

    // In a full implementation, this would dispatch through the integration layer
    // (WhatsApp Business API, Twilio SMS, or SES/SendGrid email).
    // For now, we log and return a confirmation stub.

    const notificationId = crypto.randomUUID();

    const result = {
      id: notificationId,
      tenantId: authReq.tenantId,
      personId: input.personId,
      channel: input.channel,
      status: 'queued' as const,
      queuedAt: new Date().toISOString(),
    };

    console.log(`[notification] Queued ${input.channel} notification ${notificationId} for person ${input.personId}`);

    res.status(202).json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Broadcast ──────────────────────────────────────────────────

const broadcastSchema = z.object({
  channel: z.enum(['whatsapp', 'sms', 'email']),
  segment: z.enum([
    'all_active',
    'delinquent',
    'domestica',
    'comercial',
    'industrial',
    'gobierno',
    'custom',
  ]),
  customFilter: z.record(z.unknown()).optional(),
  templateId: z.string().optional(),
  subject: z.string().max(300).optional(),
  body: z.string().max(5000),
  variables: z.record(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
});

router.post('/broadcast', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = broadcastSchema.parse(req.body);

    const broadcastId = crypto.randomUUID();

    const result = {
      id: broadcastId,
      tenantId: authReq.tenantId,
      channel: input.channel,
      segment: input.segment,
      status: input.scheduledAt ? 'scheduled' : 'queued',
      scheduledAt: input.scheduledAt ?? null,
      queuedAt: new Date().toISOString(),
    };

    console.log(`[notification] Broadcast ${broadcastId} queued for segment "${input.segment}" via ${input.channel}`);

    res.status(202).json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Templates ──────────────────────────────────────────────────

router.get('/templates', async (req, res, next) => {
  try {
    // Template definitions; in production, stored in DB or fetched from WhatsApp Business API
    const templates = [
      {
        id: 'bill_ready',
        name: 'Recibo listo',
        channel: 'whatsapp',
        body: 'Estimado/a {{name}}, su recibo de agua del periodo {{period}} por ${{total}} MXN esta listo. Puede consultarlo en: {{link}}',
        variables: ['name', 'period', 'total', 'link'],
      },
      {
        id: 'payment_confirmation',
        name: 'Confirmacion de pago',
        channel: 'whatsapp',
        body: 'Gracias {{name}}, su pago de ${{amount}} MXN ha sido registrado. Folio: {{folio}}.',
        variables: ['name', 'amount', 'folio'],
      },
      {
        id: 'payment_reminder',
        name: 'Recordatorio de pago',
        channel: 'whatsapp',
        body: 'Estimado/a {{name}}, le recordamos que su recibo del periodo {{period}} por ${{total}} MXN vence el {{due_date}}.',
        variables: ['name', 'period', 'total', 'due_date'],
      },
      {
        id: 'cut_warning',
        name: 'Aviso de corte',
        channel: 'whatsapp',
        body: 'Estimado/a {{name}}, su servicio de agua sera suspendido el {{cut_date}} por adeudo de ${{debt}} MXN. Comuniquese al {{phone}} para evitar la suspension.',
        variables: ['name', 'cut_date', 'debt', 'phone'],
      },
      {
        id: 'reconnection_confirm',
        name: 'Reconexion confirmada',
        channel: 'whatsapp',
        body: 'Estimado/a {{name}}, su servicio de agua ha sido reconectado exitosamente. Gracias por su pago.',
        variables: ['name'],
      },
      {
        id: 'work_order_scheduled',
        name: 'Orden de servicio programada',
        channel: 'sms',
        body: 'CEA: Orden de servicio #{{order_number}} programada para el {{date}}. Tipo: {{type}}.',
        variables: ['order_number', 'date', 'type'],
      },
    ];

    res.json({ success: true, data: templates });
  } catch (err) { next(err); }
});

export { router as notificationRouter };
