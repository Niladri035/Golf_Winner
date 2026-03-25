import { User } from '../../models/User';
import { ApiError } from '../../utils/apiError';

export class UserService {
  async getProfile(userId: string) {
    const user = await User.findById(userId)
      .populate('selectedCharity', 'name description images')
      .select('-password -refreshToken');
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateProfile(userId: string, updates: Partial<{
    name: string;
    selectedCharity: string;
    charityPercentage: number;
  }>) {
    if (updates.charityPercentage !== undefined && updates.charityPercentage < 10) {
      throw ApiError.badRequest('Charity percentage must be at least 10%');
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
      .populate('selectedCharity', 'name description')
      .select('-password -refreshToken');
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async getDashboard(userId: string) {
    const user = await User.findById(userId)
      .populate('selectedCharity', 'name images totalContributions')
      .select('-password -refreshToken');
    if (!user) throw ApiError.notFound('User not found');

    const { Subscription } = await import('../../../src/models/Subscription');
    const { Winner } = await import('../../../src/models/Winner');

    const [subscription, winnings] = await Promise.all([
      Subscription.findOne({ userId, status: 'active' }).lean(),
      Winner.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Admin override: Always show as active
    let effectiveSubscription = subscription;
    if (!subscription && user.role === 'admin') {
      effectiveSubscription = {
        userId: user._id,
        status: 'active',
        plan: 'monthly',
        currentPeriodEnd: new Date(2099, 11, 31),
        currentPeriodStart: new Date(),
      } as any;
    }

    return { user, subscription: effectiveSubscription, winnings };
  }
}

export const userService = new UserService();
