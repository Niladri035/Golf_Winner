import { Router } from 'express';
import { getMyWinnings, uploadProof, verifyWinner, getAllWinners } from './winner.controller';
import { authenticate } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/role';
import { uploadProof as uploadMiddleware } from '../../middlewares/upload';

const router = Router();

router.use(authenticate);

router.get('/my', getMyWinnings);
router.post('/:winnerId/proof', uploadMiddleware, uploadProof);
router.put('/:winnerId/verify', requireAdmin, verifyWinner);
router.get('/', requireAdmin, getAllWinners);

export default router;
