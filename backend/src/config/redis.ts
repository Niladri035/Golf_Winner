import Redis from 'ioredis';
import { env } from './env';

let redisClient: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  }
  return redisClient;
};

/** TTL helpers */
export const CACHE_TTL = {
  DRAW_RESULT: 60 * 60,        // 1 hour
  CHARITY_LIST: 60 * 15,       // 15 minutes
  ANALYTICS: 60 * 5,           // 5 minutes
  LEADERBOARD: 60 * 60,       // 1 hour
};
