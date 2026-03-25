import { Router } from 'express';
import {
  listCharities, getFeatured, getCharity,
  createCharity, updateCharity, deleteCharity, getLeaderboard,
} from './charity.controller';
import { authenticate } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/role';

const router = Router();

router.get('/', listCharities);
router.get('/featured', getFeatured);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getCharity);

router.post('/', authenticate, requireAdmin, createCharity);
router.put('/:id', authenticate, requireAdmin, updateCharity);
router.delete('/:id', authenticate, requireAdmin, deleteCharity);

export default router;
