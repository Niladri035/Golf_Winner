import { Transaction } from '../../models/Transaction';
import { User } from '../../models/User';
import { getRedis, CACHE_TTL } from '../../config/redis';

export class LeaderboardService {
  async getTopDonors(limit = 10) {
    const redis = getRedis();
    const cacheKey = `leaderboard:top-donors:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const donors = await Transaction.aggregate([
      { 
        $match: { 
          type: 'charity', 
          status: 'completed' 
        } 
      },
      { 
        $group: { 
          _id: '$userId', 
          totalDonated: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        } 
      },
      { $sort: { totalDonated: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          totalDonated: 1,
          donationCount: 1,
          name: '$userDetails.name',
          email: '$userDetails.email' // Or just name for privacy
        }
      }
    ]);

    await redis.setex(cacheKey, CACHE_TTL.LEADERBOARD || 3600, JSON.stringify(donors));
    return donors;
  }
}

export const leaderboardService = new LeaderboardService();
