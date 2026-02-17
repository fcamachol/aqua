import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import { rateLimit } from '../../middleware/rate-limit.js';
import {
  ProcessPaymentSchema,
  ListPaymentsSchema,
  ReconcileBatchSchema,
  SpeiWebhookSchema,
  OxxoWebhookSchema,
  RefundSchema,
} from './validators.js';
import {
  processPayment,
  listPayments,
  getReceipt,
  reconcileBatch,
  handleSpeiWebhook,
  handleOxxoWebhook,
  handleCardWebhook,
  refundPayment,
} from './service.js';
import { verifyWebhookSignature } from './gateways/conekta.js';

const router = Router();

// ---- Authenticated routes ----

// POST /payments -- Process payment
router.post(
  '/payments',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ProcessPaymentSchema.parse(req.body);
      const payment = await processPayment(req.tenantId!, input);
      res.status(201).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  },
);

// GET /payments -- List payments (paginated, filterable)
router.get(
  '/payments',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier', 'reader'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListPaymentsSchema.parse(req.query);
      const result = await listPayments(req.tenantId!, filters);
      res.json({ success: true, data: result.data, pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },
);

// GET /payments/:id/receipt -- Download receipt PDF
router.get(
  '/payments/:id/receipt',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator', 'cashier', 'customer'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { html, payment } = await getReceipt(req.tenantId!, req.params.id);

      const format = req.query.format as string | undefined;
      if (format === 'html') {
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
        return;
      }

      // Default: return PDF via puppeteer
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({ headless: true, args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'Letter',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      });
      await browser.close();

      const filename = `recibo-${payment.id.slice(0, 8)}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(pdf));
    } catch (err) {
      next(err);
    }
  },
);

// POST /payments/reconcile -- Bank reconciliation batch
router.post(
  '/payments/reconcile',
  authenticate,
  tenantMiddleware,
  requireRole('admin', 'operator'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ReconcileBatchSchema.parse(req.body);
      const result = await reconcileBatch(req.tenantId!, input);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// POST /payments/:id/refund -- Refund a payment
router.post(
  '/payments/:id/refund',
  authenticate,
  tenantMiddleware,
  requireRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RefundSchema.parse({ ...req.body, payment_id: req.params.id });
      const result = await refundPayment(req.tenantId!, input);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// ---- Webhook routes (no auth, signature-verified) ----

// SPEI webhook from STP
router.post(
  '/payments/spei/webhook',
  rateLimit({ max: 200, windowSec: 60, prefix: 'rl:spei-wh' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = SpeiWebhookSchema.parse(req.body);
      const result = await handleSpeiWebhook(data);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// OXXO webhook from Conekta
router.post(
  '/payments/oxxo/webhook',
  rateLimit({ max: 200, windowSec: 60, prefix: 'rl:oxxo-wh' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify Conekta signature
      const signature = req.headers['digest'] as string | undefined;
      if (signature) {
        const rawBody = JSON.stringify(req.body);
        const valid = await verifyWebhookSignature(rawBody, signature);
        if (!valid) {
          res.status(401).json({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' } });
          return;
        }
      }

      const data = OxxoWebhookSchema.parse(req.body);
      const result = await handleOxxoWebhook(data);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// Card payment webhook from Conekta
router.post(
  '/payments/card/webhook',
  rateLimit({ max: 200, windowSec: 60, prefix: 'rl:card-wh' }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signature = req.headers['digest'] as string | undefined;
      if (signature) {
        const rawBody = JSON.stringify(req.body);
        const valid = await verifyWebhookSignature(rawBody, signature);
        if (!valid) {
          res.status(401).json({ success: false, error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed' } });
          return;
        }
      }

      const order = req.body?.data?.object;
      if (!order) {
        res.status(400).json({ success: false, error: { code: 'INVALID_PAYLOAD', message: 'Missing order data' } });
        return;
      }

      const result = await handleCardWebhook({
        order_id: order.id,
        status: order.payment_status ?? order.status,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

export { router as paymentsRouter };
