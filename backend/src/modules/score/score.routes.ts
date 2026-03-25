import { Router } from 'express';
import { getScores, addScore, updateScore, deleteScore } from './score.controller';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { scoreLimiter } from '../../middlewares/rateLimiter';
import { addScoreSchema, updateScoreSchema } from './score.schema';

const router = Router();

router.use(authenticate);

router.get('/', getScores);
router.post('/', scoreLimiter, validate(addScoreSchema), addScore);
router.put('/:id', validate(updateScoreSchema), updateScore);
router.delete('/:id', deleteScore);

export default router;
