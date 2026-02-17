import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  registerMeterSchema,
  submitReadingSchema,
  smartIngestSchema,
  replaceMeterSchema,
  meterIdSchema,
} from './validators.js';
import * as meterService from './service.js';

export const metersRouter = Router();

// POST /meters — Register a new meter
metersRouter.post('/', async (req: Request, res: Response) => {
  const input = registerMeterSchema.parse(req.body);
  const meter = await meterService.registerMeter(req.tenantId!, input);
  res.status(201).json({ success: true, data: meter });
});

// GET /meters/:id — Get meter detail
metersRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = meterIdSchema.parse(req.params);
  const meter = await meterService.getById(req.tenantId!, id);
  if (!meter) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: meter });
});

// POST /meters/:id/readings — Submit a manual reading
metersRouter.post('/:id/readings', async (req: Request, res: Response) => {
  const { id } = meterIdSchema.parse(req.params);
  const input = submitReadingSchema.parse(req.body);
  const result = await meterService.submitReading(req.tenantId!, id, input);
  res.status(201).json({ success: true, data: result });
});

// POST /meters/smart/ingest — Smart meter bulk ingestion
metersRouter.post('/smart/ingest', async (req: Request, res: Response) => {
  const input = smartIngestSchema.parse(req.body);
  const result = await meterService.smartIngest(req.tenantId!, input);
  res.json({ success: true, data: result });
});

// POST /meters/:id/replace — Replace a meter
metersRouter.post('/:id/replace', async (req: Request, res: Response) => {
  const { id } = meterIdSchema.parse(req.params);
  const input = replaceMeterSchema.parse(req.body);
  const result = await meterService.replaceMeter(req.tenantId!, id, input);
  res.json({ success: true, data: result });
});
