import { Request, Response } from 'express';
import { scoreService } from './score.service';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { AddScoreInput, UpdateScoreInput } from './score.schema';

export const getScores = asyncWrapper(async (req: Request, res: Response) => {
  const scores = await scoreService.getScores(req.user!._id);
  res.status(200).json({ success: true, data: scores });
});

export const addScore = asyncWrapper(async (req: Request, res: Response) => {
  const scores = await scoreService.addScore(req.user!._id, req.body as AddScoreInput);
  res.status(201).json({ success: true, data: scores });
});

export const updateScore = asyncWrapper(async (req: Request, res: Response) => {
  const scores = await scoreService.updateScore(req.user!._id, req.params.id, req.body as UpdateScoreInput);
  res.status(200).json({ success: true, data: scores });
});

export const deleteScore = asyncWrapper(async (req: Request, res: Response) => {
  await scoreService.deleteScore(req.user!._id, req.params.id);
  res.status(200).json({ success: true, message: 'Score deleted' });
});
