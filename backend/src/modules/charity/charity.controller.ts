import { Request, Response } from 'express';
import { charityService } from './charity.service';
import { asyncWrapper } from '../../utils/asyncWrapper';

export const listCharities = asyncWrapper(async (req: Request, res: Response) => {
  const search = req.query['search'] as string | undefined;
  const charities = await charityService.list(search);
  res.status(200).json({ success: true, data: charities });
});

export const getFeatured = asyncWrapper(async (_req: Request, res: Response) => {
  const charities = await charityService.getFeatured();
  res.status(200).json({ success: true, data: charities });
});

export const getCharity = asyncWrapper(async (req: Request, res: Response) => {
  const charity = await charityService.getById(req.params.id);
  res.status(200).json({ success: true, data: charity });
});

export const createCharity = asyncWrapper(async (req: Request, res: Response) => {
  const charity = await charityService.create(req.body);
  res.status(201).json({ success: true, data: charity });
});

export const updateCharity = asyncWrapper(async (req: Request, res: Response) => {
  const charity = await charityService.update(req.params.id, req.body);
  res.status(200).json({ success: true, data: charity });
});

export const deleteCharity = asyncWrapper(async (req: Request, res: Response) => {
  await charityService.delete(req.params.id);
  res.status(200).json({ success: true, message: 'Charity deleted' });
});

export const getLeaderboard = asyncWrapper(async (_req: Request, res: Response) => {
  const leaderboard = await charityService.getLeaderboard();
  res.status(200).json({ success: true, data: leaderboard });
});
