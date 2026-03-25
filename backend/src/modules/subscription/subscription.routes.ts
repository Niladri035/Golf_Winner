import { Router } from 'express';
import { createCheckout, createPortal } from './subscription.controller';
import { handleStripeWebhook } from './webhook.controller';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { z } from 'zod';

const router = Router();

// Webhook MUST use raw body — registered before bodyParser in app.ts
router.post(
  '/webhook',
  // Raw body handled in app.ts via express.raw()
  handleStripeWebhook
);

router.post(
  '/checkout',
  authenticate,
  validate(z.object({ plan: z.enum(['monthly', 'yearly']) })),
  createCheckout
);

router.post('/portal', authenticate, createPortal);

export default router;
