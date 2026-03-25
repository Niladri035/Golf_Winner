import { User } from '../../models/User';
import { Subscription } from '../../models/Subscription';
import { Transaction } from '../../models/Transaction';
import { Draw } from '../../models/Draw';
import { Winner } from '../../models/Winner';
import { Charity } from '../../models/Charity';
import { ApiError } from '../../utils/apiError';
import { getRedis, CACHE_TTL } from '../../config/redis';

export class AdminService {
  /** Paginated user list with filters */
  async getUsers(filters: { status?: string; role?: string; page?: number; limit?: number }) {
    const { status, role, page = 1, limit = 20 } = filters;
    const query: Record<string, unknown> = {};
    if (status) query['subscriptionStatus'] = status;
    if (role) query['role'] = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateUser(userId: string, updates: Partial<{ role: string; subscriptionStatus: string }>) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password -refreshToken');
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw ApiError.notFound('User not found');
  }

  /** Manually activate a user by admin */
  async activateUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    // 1. Update user's subscriptionStatus
    user.subscriptionStatus = 'active';
    await user.save();

    // 2. Create/Update a "lifetime" subscription document
    const distantFuture = new Date(2099, 11, 31);
    await Subscription.findOneAndUpdate(
      { userId },
      {
        userId,
        status: 'active',
        plan: 'monthly',
        currentPeriodStart: new Date(),
        currentPeriodEnd: distantFuture,
        stripeSubscriptionId: `admin_manual_${Date.now()}`,
        stripePriceId: 'manual',
      },
      { upsert: true, new: true }
    );

    return user;
  }

  /** Analytics with MongoDB aggregation pipelines */
  async getAnalytics() {
    const redis = getRedis();
    const cached = await redis.get('analytics:summary');
    if (cached) return JSON.parse(cached);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeSubscribers,
      churnedThisMonth,
      monthlyRevenue,
      totalPrizePool,
      totalCharityContributions,
      drawParticipation,
      recentDraws,
      charityDistribution,
      pendingVerifications,
      newUsersThisMonth,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'active' }),
      User.countDocuments({ subscriptionStatus: 'lapsed', updatedAt: { $gte: monthStart } }),
      Transaction.aggregate([
        { $match: { type: 'subscription', status: 'completed', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { type: 'prize', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { type: 'charity', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Draw.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        { $project: { totalParticipants: 1, month: 1 } },
      ]),
      Draw.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(6).select('month prizePool jackpotRollover winners').lean(),
      Transaction.aggregate([
        { $match: { type: 'charity', status: 'completed' } },
        { $group: { _id: '$referenceId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]),
      Winner.countDocuments({ status: 'pending_review' }),
      User.countDocuments({ createdAt: { $gte: monthStart } }),
    ]);

    const analytics = {
      revenueMetrics: {
        totalRevenue: monthlyRevenue[0]?.total ?? 0,
        monthlyExpectedPool: Math.floor((monthlyRevenue[0]?.total ?? 0) * 0.6),
      },
      subscriptionMetrics: {
        activeSubscribers,
        churnedThisMonth,
        churnRate: totalUsers > 0 ? ((churnedThisMonth / totalUsers) * 100).toFixed(1) : '0',
      },
      winnerMetrics: {
        pendingVerifications,
        totalPrizePoolDistributed: totalPrizePool[0]?.total ?? 0,
      },
      charityMetrics: {
        totalDonated: totalCharityContributions[0]?.total ?? 0,
        distribution: charityDistribution,
      },
      userMetrics: {
        totalUsers,
        newUsersThisMonth,
      },
      drawParticipationRate: drawParticipation[0]?.totalParticipants ?? 0,
      recentDraws,
      computedAt: new Date().toISOString(),
    };

    await redis.setex('analytics:summary', CACHE_TTL.ANALYTICS, JSON.stringify(analytics));
    return analytics;
  }

  async getMonthlyRevenueTrend() {
    return Transaction.aggregate([
      { $match: { type: 'subscription', status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);
  }
}

export const adminService = new AdminService();
