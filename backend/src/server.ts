import createApp from './app';
import { connectDB } from './config/db';
import { getRedis } from './config/redis';
import { registerCronJobs } from './jobs/monthlyDraw.job';
import { env } from './config/env';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDB();

  // Connect Redis (lazy, but trigger early)
  const redis = getRedis();
  await redis.connect().catch(() => {
    logger.warn('Redis connection delayed — will retry on first use');
  });

  // Register cron jobs
  registerCronJobs();

  // Start HTTP server
  const app = createApp();
  const PORT = parseInt(env.PORT, 10);

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await redis.quit();
      logger.info('✅ HTTP server and Redis closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason: String(reason) });
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { error: err.message });
    process.exit(1);
  });
};

bootstrap();
