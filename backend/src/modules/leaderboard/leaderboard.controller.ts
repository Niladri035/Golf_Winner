import { Request, Response } from 'express';
import { leaderboardService } from './leaderboard.service';
import { asyncWrapper } from '../../utils/asyncWrapper';

export const getTopDonors = asyncWrapper(async (_req: Request, res: Response) => {
  const donors = await leaderboardService.getTopDonors();
  res.status(200).json({ success: true, data: donors });
});
