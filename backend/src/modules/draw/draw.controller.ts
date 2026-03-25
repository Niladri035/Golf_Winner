import { Request, Response } from 'express';
import { drawService } from './draw.service';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { z } from 'zod';

export const runDraw = asyncWrapper(async (req: Request, res: Response) => {
  const { mode } = z.object({ mode: z.enum(['random', 'weighted']).default('weighted') }).parse(req.body);
  const draw = await drawService.runDraw(mode);
  res.status(200).json({ success: true, data: draw });
});

export const getLatestDraw = asyncWrapper(async (_req: Request, res: Response) => {
  const draw = await drawService.getLatestDraw();
  res.status(200).json({ success: true, data: draw });
});

export const getAllDraws = asyncWrapper(async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  const result = await drawService.getAllDraws(page, limit);
  res.status(200).json({ success: true, data: result });
});
