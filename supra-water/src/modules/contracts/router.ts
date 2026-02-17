import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  createContractSchema,
  updateContractSchema,
  listContractsSchema,
  terminateContractSchema,
  changeTitularSchema,
  subrogateContractSchema,
  contractIdSchema,
} from './validators.js';
import * as contractService from './service.js';

export const contractsRouter = Router();

// POST /contracts — Create a new contract
contractsRouter.post('/', async (req: Request, res: Response) => {
  const input = createContractSchema.parse(req.body);
  const contract = await contractService.createContract(req.tenantId!, input);
  res.status(201).json({ success: true, data: contract });
});

// GET /contracts — List contracts (paginated, filterable)
contractsRouter.get('/', async (req: Request, res: Response) => {
  const input = listContractsSchema.parse(req.query);
  const result = await contractService.list(req.tenantId!, input);
  res.json(result);
});

// GET /contracts/:id — Get contract detail
contractsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = contractIdSchema.parse(req.params);
  const contract = await contractService.getById(req.tenantId!, id);
  if (!contract) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: contract });
});

// PATCH /contracts/:id — Update contract
contractsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = contractIdSchema.parse(req.params);
  const input = updateContractSchema.parse(req.body);
  const contract = await contractService.update(req.tenantId!, id, input);
  if (!contract) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: contract });
});

// POST /contracts/:id/terminate — Terminate contract
contractsRouter.post('/:id/terminate', async (req: Request, res: Response) => {
  const { id } = contractIdSchema.parse(req.params);
  const input = terminateContractSchema.parse(req.body);
  const contract = await contractService.terminateContract(req.tenantId!, id, input);
  res.json({ success: true, data: contract });
});

// POST /contracts/:id/change-titular — Change titular
contractsRouter.post('/:id/change-titular', async (req: Request, res: Response) => {
  const { id } = contractIdSchema.parse(req.params);
  const input = changeTitularSchema.parse(req.body);
  const result = await contractService.changeTitular(req.tenantId!, id, input);
  res.json({ success: true, data: result });
});

// POST /contracts/:id/subrogate — Subrogation
contractsRouter.post('/:id/subrogate', async (req: Request, res: Response) => {
  const { id } = contractIdSchema.parse(req.params);
  const input = subrogateContractSchema.parse(req.body);
  const result = await contractService.subrogateContract(req.tenantId!, id, input);
  res.json({ success: true, data: result });
});
