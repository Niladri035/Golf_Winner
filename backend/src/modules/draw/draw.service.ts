import { User, IUser } from '../../models/User';
import { Draw } from '../../models/Draw';
import { Winner } from '../../models/Winner';
import { Transaction } from '../../models/Transaction';
import { Subscription } from '../../models/Subscription';
import { Charity } from '../../models/Charity';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { getRedis, CACHE_TTL } from '../../config/redis';
import {
  generateRandomDraw,
  generateWeightedDraw,
  countMatches,
  getMatchTier,
} from './draw.engine';
import {
  calculatePrizeBreakdown,
  splitPrize,
  calculatePoolContribution,
} from '../../utils/prizePool';
import type { DrawMode } from '../../models/Draw';
import mongoose from 'mongoose';

export class DrawService {
  async runDraw(mode: DrawMode = 'weighted'): Promise<InstanceType<typeof Draw>> {
    const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    // Prevent duplicate monthly draw
    const existing = await Draw.findOne({ month });
    if (existing?.status === 'completed') {
      throw ApiError.conflict(`Draw for ${month} already completed`);
    }

    // Collect active users with scores
    const activeUsers = await User.find({ subscriptionStatus: 'active' }).select('scores charityPercentage selectedCharity');

    logger.info('Draw starting', { month, mode, totalUsers: activeUsers.length });

    // Generate numbers
    const allScores = activeUsers.flatMap((u) => u.scores);
    const drawnNumbers =
      mode === 'weighted' && allScores.length > 0
        ? generateWeightedDraw(allScores)
        : generateRandomDraw();

    logger.info('Draw numbers generated', { drawnNumbers });

    // Calculate prize pool from subscription revenue
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'subscription', status: 'completed', createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const raw = (totalRevenue[0]?.total ?? 0);
    const prizePool = Math.floor(raw * 0.60);

    // Get previous jackpot rollover
    const lastDraw = await Draw.findOne({ status: 'completed' }).sort({ createdAt: -1 });
    const rollover = lastDraw?.jackpotRollover ?? 0;

    const breakdown = calculatePrizeBreakdown(prizePool, rollover);
    const logs: string[] = [
      `Month: ${month}`,
      `Mode: ${mode}`,
      `Active users: ${activeUsers.length}`,
      `Prize pool: $${(breakdown.total / 100).toFixed(2)}`,
      `Numbers: ${drawnNumbers.join(', ')}`,
    ];

    // Find winners — by match count
    const winnersByTier: Record<3 | 4 | 5, string[]> = { 3: [], 4: [], 5: [] };

    for (const user of activeUsers) {
      const matches = countMatches(user.scores, drawnNumbers);
      const tier = getMatchTier(matches);
      if (tier) {
        winnersByTier[tier].push(user._id.toString());
      }
    }

    logs.push(`5-match winners: ${winnersByTier[5].length}`);
    logs.push(`4-match winners: ${winnersByTier[4].length}`);
    logs.push(`3-match winners: ${winnersByTier[3].length}`);

    // Prize distribution
    const fiveMatchPrize = splitPrize(breakdown.jackpot, winnersByTier[5].length);
    const fourMatchPrize = splitPrize(breakdown.fourMatch, winnersByTier[4].length);
    const threeMatchPrize = splitPrize(breakdown.threeMatch, winnersByTier[3].length);

    // Jackpot rollover if no 5-match winner
    const jackpotRollover = winnersByTier[5].length === 0 ? breakdown.jackpot : 0;
    if (jackpotRollover > 0) {
      logs.push(`Jackpot rolls over: $${(jackpotRollover / 100).toFixed(2)}`);
    }

    // Build draw document
    const drawWinners = [
      ...winnersByTier[5].map((uid) => ({ userId: new mongoose.Types.ObjectId(uid), matchType: 5 as const, prizeAmount: fiveMatchPrize })),
      ...winnersByTier[4].map((uid) => ({ userId: new mongoose.Types.ObjectId(uid), matchType: 4 as const, prizeAmount: fourMatchPrize })),
      ...winnersByTier[3].map((uid) => ({ userId: new mongoose.Types.ObjectId(uid), matchType: 3 as const, prizeAmount: threeMatchPrize })),
    ];

    const draw = await Draw.findOneAndUpdate(
      { month },
      {
        drawnNumbers,
        mode,
        prizePool: breakdown.total,
        jackpotRollover,
        status: 'completed',
        winners: drawWinners,
        totalParticipants: activeUsers.length,
        logs,
      },
      { upsert: true, new: true }
    );

    // Create Winner records & Transaction records
    await Promise.all(
      drawWinners.map(async (w) => {
        await Winner.create({
          userId: w.userId,
          drawId: draw._id,
          matchType: w.matchType,
          prizeAmount: w.prizeAmount,
          status: 'awaiting_proof',
          paymentStatus: 'pending',
        });

        await Transaction.create({
          userId: w.userId,
          amount: w.prizeAmount,
          type: 'prize',
          status: 'pending',
          referenceId: draw._id.toString(),
          description: `${w.matchType}-match draw prize`,
        });
      })
    );

    // Handle charity contributions
    await this.distributeCharityContributions(activeUsers, raw);

    // Bust Redis cache
    await getRedis().del('draw:latest');
    await getRedis().del('analytics:summary');

    logs.forEach((l) => logger.info(l));

    return draw;
  }

  async getLatestDraw() {
    const redis = getRedis();
    const cached = await redis.get('draw:latest');
    if (cached) return JSON.parse(cached);

    const draw = await Draw.findOne({ status: 'completed' }).sort({ createdAt: -1 }).lean();
    if (draw) await redis.setex('draw:latest', CACHE_TTL.DRAW_RESULT, JSON.stringify(draw));

    return draw;
  }

  async getAllDraws(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [draws, total] = await Promise.all([
      Draw.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Draw.countDocuments(),
    ]);
    return { draws, total, page, totalPages: Math.ceil(total / limit) };
  }

  // ─── Private helpers ──────────────────────────────────

  private async distributeCharityContributions(
    users: (IUser & { _id: mongoose.Types.ObjectId })[],
    totalRevenue: number
  ): Promise<void> {
    for (const user of users) {
      if (!user.selectedCharity) continue;
      const { charityAmount } = calculatePoolContribution(
        Math.floor(totalRevenue / users.length),
        user.charityPercentage
      );
      if (charityAmount <= 0) continue;

      const month = new Date().toISOString().slice(0, 7);

      await Charity.findByIdAndUpdate(user.selectedCharity, {
        $inc: { totalContributions: charityAmount },
        $push: { monthlyStats: { month, amount: charityAmount } },
      });

      await Transaction.create({
        userId: user._id,
        amount: charityAmount,
        type: 'charity',
        status: 'completed',
        referenceId: user.selectedCharity.toString(),
        description: `Monthly charity contribution (${user.charityPercentage}%)`,
      });
    }
  }
}

export const drawService = new DrawService();
