import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { asyncWrapper } from '../../utils/asyncWrapper';

export const getUsers = asyncWrapper(async (req: Request, res: Response) => {
  const { status, role, page, limit } = req.query as Record<string, string>;
  const result = await adminService.getUsers({ status, role, page: +page || 1, limit: +limit || 20 });
  res.status(200).json({ success: true, data: result });
});

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  const user = await adminService.updateUser(req.params.userId, req.body);
  res.status(200).json({ success: true, data: user });
});

export const activateUser = asyncWrapper(async (req: Request, res: Response) => {
  const user = await adminService.activateUser(req.params.userId);
  res.status(200).json({ success: true, message: 'User activated successfully', data: user });
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.userId);
  res.status(200).json({ success: true, message: 'User deleted' });
});

export const getAnalytics = asyncWrapper(async (_req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics();
  res.status(200).json({ success: true, data: analytics });
});

export const getRevenueTrend = asyncWrapper(async (_req: Request, res: Response) => {
  const trend = await adminService.getMonthlyRevenueTrend();
  res.status(200).json({ success: true, data: trend });
});
