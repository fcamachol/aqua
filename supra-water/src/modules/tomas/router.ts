import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  listTomasSchema,
  updateTomaSchema,
  tomaReadingsSchema,
  consumptionSummarySchema,
  tomaIdSchema,
} from './validators.js';
import * as tomaService from './service.js';

export const tomasRouter = Router();

// GET /tomas — List tomas (paginated, filterable)
tomasRouter.get('/', async (req: Request, res: Response) => {
  const input = listTomasSchema.parse(req.query);
  const result = await tomaService.list(req.tenantId!, input);
  res.json(result);
});

// GET /tomas/:id — Get toma detail
tomasRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = tomaIdSchema.parse(req.params);
  const toma = await tomaService.getById(req.tenantId!, id);
  if (!toma) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: toma });
});

// GET /tomas/:id/readings — Reading history for toma
tomasRouter.get('/:id/readings', async (req: Request, res: Response) => {
  const { id } = tomaIdSchema.parse(req.params);
  const input = tomaReadingsSchema.parse(req.query);
  const result = await tomaService.getReadings(req.tenantId!, id, input);
  res.json(result);
});

// GET /tomas/:id/consumption — Consumption summary
tomasRouter.get('/:id/consumption', async (req: Request, res: Response) => {
  const { id } = tomaIdSchema.parse(req.params);
  const input = consumptionSummarySchema.parse(req.query);
  const data = await tomaService.getConsumptionSummary(req.tenantId!, id, input);
  res.json({ success: true, data });
});

// PATCH /tomas/:id — Update toma
tomasRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = tomaIdSchema.parse(req.params);
  const input = updateTomaSchema.parse(req.body);
  const toma = await tomaService.update(req.tenantId!, id, input);
  if (!toma) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: toma });
});
