import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  ListDelinquencySchema,
  DelinquencyIdSchema,
  ExecuteStepSchema,
} from './validators.js';
import {
  listProcedures,
  getProcedure,
  executeNextStep,
} from './service.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

// GET /delinquency — List active procedures
router.get(
  '/',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ListDelinquencySchema.parse(req.query);
      const { data, total } = await listProcedures(req.tenantId!, input);
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

// GET /delinquency/:id — Get procedure detail
router.get(
  '/:id',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = DelinquencyIdSchema.parse(req.params);
      const procedure = await getProcedure(req.tenantId!, id);
      res.json({ success: true, data: procedure });
    } catch (err) {
      next(err);
    }
  },
);

// POST /delinquency/:id/step — Execute next step in collection sequence
router.post(
  '/:id/step',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = DelinquencyIdSchema.parse(req.params);
      const input = ExecuteStepSchema.parse(req.body);
      const procedure = await executeNextStep(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: procedure });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
