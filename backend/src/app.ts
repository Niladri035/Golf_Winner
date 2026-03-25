import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';

// ─── Route imports ────────────────────────────────────────
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import scoreRoutes from './modules/score/score.routes';
import subscriptionRoutes from './modules/subscription/subscription.routes';
import drawRoutes from './modules/draw/draw.routes';
import charityRoutes from './modules/charity/charity.routes';
import winnerRoutes from './modules/winner/winner.routes';
import adminRoutes from './modules/admin/admin.routes';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes';

const createApp = (): Application => {
  const app = express();

  // ─── Security ─────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL || true, 
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  // ─── Stripe webhook — MUST come BEFORE json parser ────
  app.use(
    '/api/subscriptions/webhook',
    express.raw({ type: 'application/json' })
  );

  // ─── Body parsers ──────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ─── NoSQL injection sanitization ─────────────────────
  app.use(mongoSanitize());

  // ─── Rate limiting ─────────────────────────────────────
  app.use('/api', apiLimiter);

  // ─── Health check ──────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV });
  });

  // ─── Routes ───────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/scores', scoreRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/draws', drawRoutes);
  app.use('/api/charities', charityRoutes);
  app.use('/api/winners', winnerRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);

  // ─── 404 handler ──────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // ─── Global error handler (must be last) ──────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
