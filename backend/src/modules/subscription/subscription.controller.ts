import { Request, Response } from 'express';
import { subscriptionService } from './subscription.service';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';

const planSchema = z.object({ plan: z.enum(['monthly', 'yearly']) });

export const createCheckout = asyncWrapper(async (req: Request, res: Response) => {
  const { plan } = req.body as { plan: 'monthly' | 'yearly' };
  const url = await subscriptionService.createCheckoutSession(req.user!._id, plan);
  res.status(200).json({ success: true, data: { url } });
});

export const createPortal = asyncWrapper(async (req: Request, res: Response) => {
  const url = await subscriptionService.createPortalSession(req.user!._id);
  res.status(200).json({ success: true, data: { url } });
});
