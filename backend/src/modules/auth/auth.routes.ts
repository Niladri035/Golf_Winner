import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { authLimiter } from '../../middlewares/rateLimiter';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
