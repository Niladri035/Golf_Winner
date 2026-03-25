import { stripe } from '../../config/stripe';
import { env } from '../../config/env';
import { User } from '../../models/User';
import { Subscription } from '../../models/Subscription';
import { Transaction } from '../../models/Transaction';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { calculatePoolContribution } from '../../utils/prizePool';

export class SubscriptionService {
  /** Create Stripe Checkout session */
  async createCheckoutSession(userId: string, plan: 'monthly' | 'yearly'): Promise<string> {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    if (user.subscriptionStatus === 'active') {
      throw ApiError.conflict('User already has an active subscription');
    }

    const priceId = plan === 'monthly' ? env.STRIPE_MONTHLY_PRICE_ID : env.STRIPE_YEARLY_PRICE_ID;

    // Create or reuse Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: userId },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, plan },
      success_url: `${env.CLIENT_URL}/dashboard?subscribed=true`,
      cancel_url: `${env.CLIENT_URL}/pricing?cancelled=true`,
      subscription_data: {
        metadata: { userId, plan },
      },
    });

    logger.info('Stripe checkout session created', { userId, plan, sessionId: session.id });
    return session.url!;
  }

  /** Create Stripe Customer Portal session for manage/cancel */
  async createPortalSession(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user?.stripeCustomerId) throw ApiError.badRequest('No active subscription found');

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.CLIENT_URL}/dashboard`,
    });

    return session.url;
  }

  /** Activate subscription after successful payment */
  async activateSubscription(
    stripeSubscriptionId: string,
    stripeCustomerId: string,
    priceId: string,
    plan: 'monthly' | 'yearly',
    userId: string,
    periodStart: number,
    periodEnd: number,
    amountPaid: number
  ): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'active',
      stripeCustomerId,
    });

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId },
      {
        userId,
        stripeSubscriptionId,
        stripeCustomerId,
        stripePriceId: priceId,
        plan,
        status: 'active',
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      },
      { upsert: true, new: true }
    );

    // Record financial transaction
    const user = await User.findById(userId).select('charityPercentage');
    const { prizePool, charityAmount, platformFee } = calculatePoolContribution(
      amountPaid,
      user?.charityPercentage ?? 10
    );

    await Transaction.create({
      userId,
      amount: amountPaid,
      currency: 'usd',
      type: 'subscription',
      status: 'completed',
      referenceId: stripeSubscriptionId,
      description: `${plan} subscription payment`,
      metadata: { prizePoolShare: prizePool, charityShare: charityAmount, platformFee },
    });

    logger.info('Subscription activated', { userId, plan, stripeSubscriptionId });
  }

  async handlePaymentFailed(stripeSubscriptionId: string, graceDays = 3): Promise<void> {
    const sub = await Subscription.findOne({ stripeSubscriptionId });
    if (!sub) return;

    const gracePeriodEnd = new Date(Date.now() + graceDays * 24 * 60 * 60 * 1000);
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId },
      { status: 'past_due', gracePeriodEnd }
    );
    await User.findByIdAndUpdate(sub.userId, { subscriptionStatus: 'lapsed' });

    logger.warn('Payment failed — grace period applied', {
      userId: sub.userId,
      gracePeriodEnd,
    });
  }

  async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
    const sub = await Subscription.findOneAndUpdate(
      { stripeSubscriptionId },
      { status: 'cancelled', cancelAtPeriodEnd: true }
    );
    if (sub) {
      await User.findByIdAndUpdate(sub.userId, { subscriptionStatus: 'inactive' });
      logger.info('Subscription cancelled', { stripeSubscriptionId });
    }
  }
}

export const subscriptionService = new SubscriptionService();
