import { Request, Response } from 'express';
import { userService } from './user.service';
import { asyncWrapper } from '../../utils/asyncWrapper';

export const getProfile = asyncWrapper(async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user!._id);
  res.status(200).json({ success: true, data: user });
});

export const updateProfile = asyncWrapper(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!._id, req.body);
  res.status(200).json({ success: true, data: user });
});

export const getDashboard = asyncWrapper(async (req: Request, res: Response) => {
  const data = await userService.getDashboard(req.user!._id);
  res.status(200).json({ success: true, data });
});
