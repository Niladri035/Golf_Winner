import {
  calculatePrizeBreakdown,
  splitPrize,
  calculatePoolContribution,
} from '../src/utils/prizePool';

describe('Prize Pool Utilities', () => {
  describe('calculatePrizeBreakdown', () => {
    test('correctly splits pool into 40/35/25', () => {
      const pool = 10000; // $100.00 in cents
      const breakdown = calculatePrizeBreakdown(pool);
      expect(breakdown.jackpot).toBe(4000);
      expect(breakdown.fourMatch).toBe(3500);
      expect(breakdown.threeMatch).toBe(2500);
      expect(breakdown.total).toBe(10000);
    });

    test('adds rollover to jackpot pool', () => {
      const pool = 10000;
      const rollover = 5000;
      const breakdown = calculatePrizeBreakdown(pool, rollover);
      expect(breakdown.total).toBe(15000);
      expect(breakdown.jackpot).toBe(6000); // 40% of 15000
    });

    test('handles zero pool', () => {
      const breakdown = calculatePrizeBreakdown(0);
      expect(breakdown.jackpot).toBe(0);
      expect(breakdown.fourMatch).toBe(0);
      expect(breakdown.threeMatch).toBe(0);
    });
  });

  describe('splitPrize', () => {
    test('splits evenly among winners', () => {
      expect(splitPrize(10000, 4)).toBe(2500);
    });

    test('floors fractional splits', () => {
      expect(splitPrize(10000, 3)).toBe(3333); // 10000 / 3 = 3333.33 → floor to 3333
    });

    test('returns 0 if no winners', () => {
      expect(splitPrize(10000, 0)).toBe(0);
    });
  });

  describe('calculatePoolContribution', () => {
    test('calculates correct prize/charity/platform split', () => {
      const amount = 10000; // $100
      const charityPct = 10;
      const result = calculatePoolContribution(amount, charityPct);
      expect(result.charityAmount).toBe(1000);   // 10%
      expect(result.prizePool).toBe(6000);       // 60%
      expect(result.platformFee).toBe(3000);     // 30%
      expect(result.charityAmount + result.prizePool + result.platformFee).toBe(amount);
    });

    test('enforces minimum 10% charity contribution', () => {
      const result = calculatePoolContribution(10000, 10);
      expect(result.charityAmount).toBe(1000);
    });

    test('handles 100% charity correctly', () => {
      const result = calculatePoolContribution(10000, 100);
      expect(result.charityAmount).toBe(10000);
      expect(result.platformFee).toBe(0);
    });
  });
});
