import { Router } from 'express';
import { getProfile, updateProfile, getDashboard } from './user.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);

export default router;
