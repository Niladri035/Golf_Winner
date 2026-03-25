import createApp from '../src/app';
import { connectDB } from '../src/config/db';
import { getRedis } from '../src/config/redis';
import { logger } from '../src/utils/logger';

// Vercel Serverless Function entry point
export default async (req: any, res: any) => {
  try {
    // 1. Ensure DB is connected
    await connectDB();

    // 2. Initialize Redis (optional, based on your logic)
    const redis = getRedis();
    if (!redis.isOpen) {
      await redis.connect().catch(() => {
        logger.warn('Redis connection failed in serverless context');
      });
    }

    // 3. Create and return the app instance
    const app = createApp();
    
    // 4. Handle the request
    return app(req, res);
  } catch (error) {
    logger.error('Serverless execution error', { error });
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
