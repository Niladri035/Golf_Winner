import { IScore } from '../../models/User';

/** ─── Types ──────────────────────────────────────────────── */

export interface DrawResult {
  numbers: number[];
  mode: 'random' | 'weighted';
}

/** ─── Random Mode ──────────────────────────────────────────── */

/**
 * Pure function: generates 5 unique random numbers in [1, 45]
 */
export const generateRandomDraw = (): number[] => {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const drawn: number[] = [];

  while (drawn.length < 5) {
    const idx = Math.floor(Math.random() * pool.length);
    drawn.push(pool.splice(idx, 1)[0]);
  }

  return drawn.sort((a, b) => a - b);
};

/** ─── Weighted Mode ──────────────────────────────────────────── */

/**
 * Build a frequency map from all user scores.
 * Less-frequent numbers will get higher probability.
 */
export const buildFrequencyMap = (allScores: number[]): Map<number, number> => {
  const freq = new Map<number, number>();
  for (const n of allScores) {
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }
  return freq;
};

/**
 * Convert frequency map to weight map:
 * weight[n] = 1 / (frequency[n] + 1)
 */
export const buildWeightMap = (freqMap: Map<number, number>): Map<number, number> => {
  const weights = new Map<number, number>();
  for (let n = 1; n <= 45; n++) {
    const freq = freqMap.get(n) ?? 0;
    weights.set(n, 1 / (freq + 1));
  }
  return weights;
};

/**
 * Normalize weights so they sum to 1.
 */
export const normalizeWeights = (weightMap: Map<number, number>): Map<number, number> => {
  const total = [...weightMap.values()].reduce((sum, w) => sum + w, 0);
  const normalized = new Map<number, number>();
  for (const [k, w] of weightMap) {
    normalized.set(k, w / total);
  }
  return normalized;
};

/**
 * Weighted random selection WITHOUT replacement — picks 5 unique numbers.
 */
export const weightedSampleWithoutReplacement = (
  normalizedWeights: Map<number, number>,
  count: number
): number[] => {
  const remaining = new Map(normalizedWeights);
  const selected: number[] = [];

  while (selected.length < count) {
    // Re-normalize after each pick
    const total = [...remaining.values()].reduce((s, w) => s + w, 0);
    let rand = Math.random() * total;

    for (const [num, weight] of remaining) {
      rand -= weight;
      if (rand <= 0) {
        selected.push(num);
        remaining.delete(num);
        break;
      }
    }
  }

  return selected.sort((a, b) => a - b);
};

/**
 * Full weighted draw pipeline — pure function (easily testable).
 */
export const generateWeightedDraw = (allUserScores: IScore[]): number[] => {
  const values = allUserScores.map((s) => s.value);
  const freq = buildFrequencyMap(values);
  const weights = buildWeightMap(freq);
  const normalized = normalizeWeights(weights);
  return weightedSampleWithoutReplacement(normalized, 5);
};

/** ─── Match Detection ──────────────────────────────────────── */

/**
 * Count how many of a user's scores match the drawn numbers (by value).
 */
export const countMatches = (userScores: IScore[], drawnNumbers: number[]): number => {
  const drawnSet = new Set(drawnNumbers);
  return userScores.filter((s) => drawnSet.has(s.value)).length;
};

/**
 * Returns 3, 4, 5, or null depending on qualifying matches.
 */
export const getMatchTier = (matches: number): 3 | 4 | 5 | null => {
  if (matches >= 5) return 5;
  if (matches === 4) return 4;
  if (matches === 3) return 3;
  return null;
};
