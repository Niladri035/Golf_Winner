/**
 * Prize pool distribution constants
 */
export const PRIZE_DISTRIBUTION = {
  FIVE_MATCH: 0.40,   // 40% – jackpot
  FOUR_MATCH: 0.35,   // 35%
  THREE_MATCH: 0.25,  // 25%
} as const;

export type MatchType = 3 | 4 | 5;

export interface PrizeBreakdown {
  jackpot: number;
  fourMatch: number;
  threeMatch: number;
  total: number;
}

/**
 * Calculate prize pool split from a total amount (in cents)
 */
export const calculatePrizeBreakdown = (totalPool: number, rollover = 0): PrizeBreakdown => {
  const effective = totalPool + rollover;
  return {
    jackpot: Math.floor(effective * PRIZE_DISTRIBUTION.FIVE_MATCH),
    fourMatch: Math.floor(effective * PRIZE_DISTRIBUTION.FOUR_MATCH),
    threeMatch: Math.floor(effective * PRIZE_DISTRIBUTION.THREE_MATCH),
    total: effective,
  };
};

/**
 * Split a prize tier equally among winners (in cents)
 */
export const splitPrize = (tierAmount: number, winnerCount: number): number => {
  if (winnerCount === 0) return 0;
  return Math.floor(tierAmount / winnerCount);
};

/**
 * Calculate what % of a subscription goes to the prize pool
 * Default: 60% to prize pool, (charityPercentage)% to charity, rest retained
 */
export const calculatePoolContribution = (subscriptionAmount: number, charityPercentage: number): {
  prizePool: number;
  charityAmount: number;
  platformFee: number;
} => {
  const charity = Math.floor(subscriptionAmount * (charityPercentage / 100));
  const prize = Math.floor(subscriptionAmount * 0.60);
  const platform = subscriptionAmount - charity - prize;
  return { prizePool: prize, charityAmount: charity, platformFee: Math.max(platform, 0) };
};
