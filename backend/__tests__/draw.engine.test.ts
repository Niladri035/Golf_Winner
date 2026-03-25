import {
  generateRandomDraw,
  buildFrequencyMap,
  buildWeightMap,
  normalizeWeights,
  weightedSampleWithoutReplacement,
  generateWeightedDraw,
  countMatches,
  getMatchTier,
} from '../src/modules/draw/draw.engine';
import type { IScore } from '../src/models/User';
import mongoose from 'mongoose';

const makeScore = (value: number, date = new Date()): IScore => ({
  _id: new mongoose.Types.ObjectId(),
  value,
  date,
});

describe('Draw Engine — Random Mode', () => {
  test('generates exactly 5 numbers', () => {
    const nums = generateRandomDraw();
    expect(nums).toHaveLength(5);
  });

  test('all numbers are in range [1, 45]', () => {
    const nums = generateRandomDraw();
    nums.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(45);
    });
  });

  test('no duplicate numbers', () => {
    const nums = generateRandomDraw();
    const unique = new Set(nums);
    expect(unique.size).toBe(5);
  });

  test('numbers are sorted ascending', () => {
    const nums = generateRandomDraw();
    for (let i = 0; i < nums.length - 1; i++) {
      expect(nums[i]).toBeLessThan(nums[i + 1]);
    }
  });
});

describe('Draw Engine — Weighted Mode', () => {
  test('buildFrequencyMap counts correctly', () => {
    const freq = buildFrequencyMap([1, 2, 2, 3, 1, 1]);
    expect(freq.get(1)).toBe(3);
    expect(freq.get(2)).toBe(2);
    expect(freq.get(3)).toBe(1);
    expect(freq.get(4)).toBeUndefined();
  });

  test('buildWeightMap gives lower weight to more frequent numbers', () => {
    const freq = new Map([[1, 10], [2, 1]]);
    const weights = buildWeightMap(freq);
    expect(weights.get(1)!).toBeLessThan(weights.get(2)!);
  });

  test('normalizeWeights sums to ~1', () => {
    const weights = new Map([[1, 0.5], [2, 0.25], [3, 0.25]]);
    const normalized = normalizeWeights(weights);
    const total = [...normalized.values()].reduce((s, w) => s + w, 0);
    expect(total).toBeCloseTo(1, 5);
  });

  test('weightedSampleWithoutReplacement returns correct count with no duplicates', () => {
    const freq = buildFrequencyMap([1, 2, 3]);
    const weights = buildWeightMap(freq);
    const normalized = normalizeWeights(weights);
    const sample = weightedSampleWithoutReplacement(normalized, 5);

    expect(sample).toHaveLength(5);
    expect(new Set(sample).size).toBe(5);
    sample.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(45);
    });
  });

  test('generateWeightedDraw returns 5 unique numbers', () => {
    const scores = [1, 5, 10, 15, 20, 25, 30].map((v) => makeScore(v));
    const result = generateWeightedDraw(scores);
    expect(result).toHaveLength(5);
    expect(new Set(result).size).toBe(5);
  });

  test('generateWeightedDraw handles empty scores (fallback random)', () => {
    const result = generateWeightedDraw([]);
    expect(result).toHaveLength(5);
  });
});

describe('Draw Engine — Match Detection', () => {
  const drawnNumbers = [5, 10, 15, 20, 25];

  test('countMatches correctly counts intersections', () => {
    const scores = [5, 10, 15, 99, 88].map((v) => makeScore(v));
    expect(countMatches(scores, drawnNumbers)).toBe(3);
  });

  test('countMatches returns 0 for no matches', () => {
    const scores = [1, 2, 3, 4, 6].map((v) => makeScore(v));
    expect(countMatches(scores, drawnNumbers)).toBe(0);
  });

  test('countMatches returns 5 for full match', () => {
    const scores = [5, 10, 15, 20, 25].map((v) => makeScore(v));
    expect(countMatches(scores, drawnNumbers)).toBe(5);
  });

  test('getMatchTier returns correct tiers', () => {
    expect(getMatchTier(5)).toBe(5);
    expect(getMatchTier(4)).toBe(4);
    expect(getMatchTier(3)).toBe(3);
    expect(getMatchTier(2)).toBeNull();
    expect(getMatchTier(0)).toBeNull();
  });
});
