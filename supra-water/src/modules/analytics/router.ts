import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  DashboardQuerySchema,
  RevenueQuerySchema,
  DelinquencyQuerySchema,
  ConsumptionQuerySchema,
  CollectionRateQuerySchema,
  ConaguaReportQuerySchema,
} from './validators.js';
import { getDashboard } from './dashboard-service.js';
import {
  generateRevenueReport,
  generateDelinquencyReport,
  generateConsumptionReport,
  generateCollectionReport,
  generateConaguaReportForPeriod,
} from './report-generator.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

// GET /analytics/dashboard — Real-time dashboard data
router.get(
  '/dashboard',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = DashboardQuerySchema.parse(req.query);
      const dashboard = await getDashboard(req.tenantId!, input.explotacion_id);
      res.json({ success: true, data: dashboard });
    } catch (err) {
      next(err);
    }
  },
);

// GET /analytics/revenue — Revenue by period
router.get(
  '/revenue',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RevenueQuerySchema.parse(req.query);
      const report = await generateRevenueReport(
        req.tenantId!,
        input.from_date,
        input.to_date,
        input.period,
        input.explotacion_id,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
);

// GET /analytics/delinquency — Delinquency metrics
router.get(
  '/delinquency',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = DelinquencyQuerySchema.parse(req.query);
      const report = await generateDelinquencyReport(
        req.tenantId!,
        input.period,
        input.from_date,
        input.to_date,
        input.explotacion_id,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
);

// GET /analytics/consumption — Consumption patterns
router.get(
  '/consumption',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ConsumptionQuerySchema.parse(req.query);
      const report = await generateConsumptionReport(
        req.tenantId!,
        input.period,
        input.from_date,
        input.to_date,
        input.toma_type,
        input.explotacion_id,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
);

// GET /analytics/collection-rate — Collection efficiency
router.get(
  '/collection-rate',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CollectionRateQuerySchema.parse(req.query);
      const report = await generateCollectionReport(
        req.tenantId!,
        input.period,
        input.from_date,
        input.to_date,
        input.explotacion_id,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
);

// GET /reports/conagua — CONAGUA regulatory report
router.get(
  '/reports/conagua',
  requireRole('admin', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ConaguaReportQuerySchema.parse(req.query);
      const report = await generateConaguaReportForPeriod(
        req.tenantId!,
        input.year,
        input.month,
        input.report_type,
        input.explotacion_id,
      );
      res.json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
