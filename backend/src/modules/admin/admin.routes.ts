import { Router } from 'express';
import { getUsers, updateUser, activateUser, deleteUser, getAnalytics, getRevenueTrend } from './admin.controller';
import { authenticate } from '../../middlewares/auth';
import { requireAdmin } from '../../middlewares/role';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', getUsers);
router.put('/users/:userId', updateUser);
router.patch('/users/:userId/activate', activateUser);
router.delete('/users/:userId', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/analytics/revenue-trend', getRevenueTrend);

export default router;
