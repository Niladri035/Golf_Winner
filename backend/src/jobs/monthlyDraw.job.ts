import cron from 'node-cron';
import { drawService } from '../modules/draw/draw.service';
import { logger } from '../utils/logger';

/**
 * Monthly draw job — runs at 00:00 on the 1st of every month.
 * cron expression: minute hour day-of-month month day-of-week
 */
export const registerCronJobs = (): void => {
  // Monthly draw: 1st of month at midnight UTC
  cron.schedule(
    '0 0 1 * *',
    async () => {
      logger.info('⏰ Monthly draw cron job started');
      try {
        const draw = await drawService.runDraw('weighted');
        logger.info('✅ Monthly draw completed', {
          month: draw.month,
          winners: draw.winners.length,
          prizePool: draw.prizePool,
        });
      } catch (err) {
        logger.error('❌ Monthly draw cron job failed', { error: String(err) });
      }
    },
    {
      scheduled: true,
      timezone: 'UTC',
    }
  );

  logger.info('✅ Cron jobs registered (Monthly draw: 1st of each month 00:00 UTC)');
};
