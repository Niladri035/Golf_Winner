import { Charity } from '../../models/Charity';
import { User } from '../../models/User';
import { ApiError } from '../../utils/apiError';
import { getRedis, CACHE_TTL } from '../../config/redis';
import { logger } from '../../utils/logger';

export class CharityService {
  async list(search?: string) {
    const redis = getRedis();
    const cacheKey = `charity:list:${search ?? 'all'}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query = search
      ? { $text: { $search: search } }
      : {};

    const charities = await Charity.find(query).sort({ isFeatured: -1, totalContributions: -1 }).lean();
    await redis.setex(cacheKey, CACHE_TTL.CHARITY_LIST, JSON.stringify(charities));
    return charities;
  }

  async getFeatured() {
    return Charity.find({ isFeatured: true }).lean();
  }

  async getById(id: string) {
    const charity = await Charity.findById(id).lean();
    if (!charity) throw ApiError.notFound('Charity not found');
    return charity;
  }

  async create(data: { name: string; description: string; images?: string[]; isFeatured?: boolean }) {
    const charity = await Charity.create(data);
    await this.bustCache();
    logger.info('Charity created', { charityId: charity._id.toString(), name: charity.name });
    return charity;
  }

  async update(id: string, data: Partial<{ name: string; description: string; images: string[]; isFeatured: boolean }>) {
    const charity = await Charity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!charity) throw ApiError.notFound('Charity not found');
    await this.bustCache();
    return charity;
  }

  async delete(id: string) {
    const charity = await Charity.findByIdAndDelete(id);
    if (!charity) throw ApiError.notFound('Charity not found');
    // Unlink users who had this charity selected
    await User.updateMany({ selectedCharity: id }, { $unset: { selectedCharity: 1 } });
    await this.bustCache();
  }

  async getLeaderboard() {
    return Charity.find().sort({ totalContributions: -1 }).limit(10).lean();
  }

  private async bustCache() {
    const redis = getRedis();
    const keys = await redis.keys('charity:list:*');
    if (keys.length) await redis.del(...keys);
  }
}

export const charityService = new CharityService();
