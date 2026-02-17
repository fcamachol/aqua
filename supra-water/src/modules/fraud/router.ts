import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  CreateFraudCaseSchema,
  ListFraudCasesSchema,
  UpdateFraudCaseSchema,
  FraudCaseIdSchema,
} from './validators.js';
import {
  createFraudCase,
  listFraudCases,
  getFraudCase,
  updateFraudCase,
} from './service.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

// GET /fraud-cases — List fraud cases
router.get(
  '/',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ListFraudCasesSchema.parse(req.query);
      const { data, total } = await listFraudCases(req.tenantId!, input);
      res.json({
        success: true,
        data,
        pagination: {
          page: input.page,
          pageSize: input.page_size,
          total,
          totalPages: Math.ceil(total / input.page_size),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /fraud-cases/:id — Get fraud case detail
router.get(
  '/:id',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = FraudCaseIdSchema.parse(req.params);
      const fraudCase = await getFraudCase(req.tenantId!, id);
      res.json({ success: true, data: fraudCase });
    } catch (err) {
      next(err);
    }
  },
);

// POST /fraud-cases — Create fraud case
router.post(
  '/',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateFraudCaseSchema.parse(req.body);
      const fraudCase = await createFraudCase(req.tenantId!, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.status(201).json({ success: true, data: fraudCase });
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /fraud-cases/:id — Update fraud case
router.patch(
  '/:id',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = FraudCaseIdSchema.parse(req.params);
      const input = UpdateFraudCaseSchema.parse(req.body);
      const fraudCase = await updateFraudCase(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: fraudCase });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
