import { Router } from 'express';
import { getTopDonors } from './leaderboard.controller';

const router = Router();

router.get('/top-donors', getTopDonors);

export default router;
