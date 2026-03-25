import { Request, Response } from 'express';
import { winnerService } from './winner.service';
import { asyncWrapper } from '../../utils/asyncWrapper';

export const getMyWinnings = asyncWrapper(async (req: Request, res: Response) => {
  const winnings = await winnerService.getMyWinnings(req.user!._id);
  res.status(200).json({ success: true, data: winnings });
});

export const uploadProof = asyncWrapper(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }
  const winner = await winnerService.uploadProof(
    req.params.winnerId,
    req.user!._id,
    req.file.buffer,
    req.file.mimetype
  );
  res.status(200).json({ success: true, data: winner });
});

export const verifyWinner = asyncWrapper(async (req: Request, res: Response) => {
  const { approve, rejectionReason } = req.body as { approve: boolean; rejectionReason?: string };
  const winner = await winnerService.verifyWinner(req.params.winnerId, req.user!._id, approve, rejectionReason);
  res.status(200).json({ success: true, data: winner });
});

export const getAllWinners = asyncWrapper(async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 20;
  const status = req.query['status'] as string | undefined;
  const result = await winnerService.getAllWinners({ status, page, limit });
  res.status(200).json({ success: true, data: result });
});
