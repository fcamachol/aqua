import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  createPersonSchema,
  updatePersonSchema,
  searchPersonSchema,
  personIdSchema,
} from './validators.js';
import * as personService from './service.js';

export const personsRouter = Router();

// POST /persons — Create a new person
personsRouter.post('/', async (req: Request, res: Response) => {
  const input = createPersonSchema.parse(req.body);
  const person = await personService.create(req.tenantId!, input);
  res.status(201).json({ success: true, data: person });
});

// GET /persons/search — Search persons (fuzzy name, RFC, CURP, phone)
personsRouter.get('/search', async (req: Request, res: Response) => {
  const input = searchPersonSchema.parse(req.query);
  const result = await personService.search(req.tenantId!, input);
  res.json(result);
});

// GET /persons/:id — Get person by ID
personsRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = personIdSchema.parse(req.params);
  const person = await personService.getById(req.tenantId!, id);
  if (!person) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: person });
});

// PATCH /persons/:id — Update person
personsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { id } = personIdSchema.parse(req.params);
  const input = updatePersonSchema.parse(req.body);
  const person = await personService.update(req.tenantId!, id, input);
  if (!person) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }
  res.json({ success: true, data: person });
});
