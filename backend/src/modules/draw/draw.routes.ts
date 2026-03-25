import { Router } from 'express';
import { runDraw, getLatestDraw, getAllDraws } from './draw.controller';
import { authenticate } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/role';

const router = Router();

router.get('/latest', authenticate, getLatestDraw);
router.get('/', authenticate, getAllDraws);
router.post('/run', authenticate, requireAdmin, runDraw);

export default router;
