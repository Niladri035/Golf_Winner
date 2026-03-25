import { Request, Response } from 'express';
import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { subscriptionService } from './subscription.service';
import { Subscription } from '../../models/Subscription';
import { logger } from '../../utils/logger';
import Stripe from 'stripe';

export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    // req.body must be the raw buffer (configured in app.ts)
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Stripe webhook signature verification failed', { error: String(err) });
    res.status(400).json({ success: false, message: 'Webhook signature invalid' });
    return;
  }

  // ─── Idempotency guard ──────────────────────────────────
  const alreadyProcessed = await Subscription.findOne({ processedEventIds: event.id });
  if (alreadyProcessed) {
    logger.info('Webhook event already processed (idempotency)', { eventId: event.id });
    res.status(200).json({ received: true });
    return;
  }

  logger.info('Stripe webhook received', { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const { userId, plan } = session.metadata as { userId: string; plan: 'monthly' | 'yearly' };
        const subscriptionId = session.subscription as string;

        // Fetch full subscription details
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
        await subscriptionService.activateSubscription(
          subscriptionId,
          session.customer as string,
          stripeSub.items.data[0].price.id,
          plan,
          userId,
          stripeSub.current_period_start,
          stripeSub.current_period_end,
          session.amount_total ?? 0
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Renewal payment — re-activate subscription if lapsed
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (!stripeSubId) break;

        const sub = await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: stripeSubId },
          { status: 'active' },
          { new: true }
        );
        if (sub) {
          const { User } = await import('../../models/User');
          await User.findByIdAndUpdate(sub.userId, { subscriptionStatus: 'active' });
          logger.info('Subscription renewed', { stripeSubscriptionId: stripeSubId });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;
        if (stripeSubId) await subscriptionService.handlePaymentFailed(stripeSubId);
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSubId = (event.data.object as Stripe.Subscription).id;
        await subscriptionService.cancelSubscription(stripeSubId);
        break;
      }

      default:
        logger.info('Unhandled Stripe event', { type: event.type });
    }

    // Mark event as processed for idempotency
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: (event.data.object as { subscription?: string }).subscription ?? '' },
      { $addToSet: { processedEventIds: event.id } }
    );

    res.status(200).json({ received: true });
  } catch (err) {
    logger.error('Webhook handler error', { eventType: event.type, error: String(err) });
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};
