import mongoose from 'mongoose';
import { User, IScore } from '../../models/User';
import { ScoreArchive } from '../../models/ScoreArchive';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { AddScoreInput, UpdateScoreInput } from './score.schema';

export class ScoreService {
  /** Return user scores in DESC date order */
  async getScores(userId: string): Promise<IScore[]> {
    const user = await User.findById(userId).select('scores');
    if (!user) throw ApiError.notFound('User not found');
    return [...user.scores].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async addScore(userId: string, input: AddScoreInput): Promise<IScore[]> {
    const user = await User.findById(userId).select('scores');
    if (!user) throw ApiError.notFound('User not found');

    // Prevent duplicate date entries
    const sameDay = user.scores.find(
      (s) => new Date(s.date).toDateString() === new Date(input.date).toDateString()
    );
    if (sameDay) throw ApiError.conflict('A score already exists for this date');

    const newScore: IScore = {
      _id: new mongoose.Types.ObjectId(),
      value: input.value,
      date: input.date,
    };

    // Rolling window: archive & remove oldest if already 5 scores
    if (user.scores.length >= 5) {
      const sorted = [...user.scores].sort((a, b) => a.date.getTime() - b.date.getTime());
      const oldest = sorted[0];

      await ScoreArchive.create({
        userId,
        value: oldest.value,
        date: oldest.date,
      });

      user.scores = user.scores.filter(
        (s) => s._id.toString() !== oldest._id.toString()
      ) as typeof user.scores;

      logger.info('Score archived (rolling window)', {
        userId,
        archivedValue: oldest.value,
        archivedDate: oldest.date,
      });
    }

    user.scores.push(newScore);
    await user.save();

    return [...user.scores].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async updateScore(userId: string, scoreId: string, input: UpdateScoreInput): Promise<IScore[]> {
    const user = await User.findById(userId).select('scores');
    if (!user) throw ApiError.notFound('User not found');

    const scoresArray = user.scores as mongoose.Types.DocumentArray<IScore>;
    const score = scoresArray.id(scoreId);
    if (!score) throw ApiError.notFound('Score not found');

    // Check duplicate date if we're changing the date
    if (input.date) {
      const conflict = user.scores.find(
        (s) =>
          s._id.toString() !== scoreId &&
          new Date(s.date).toDateString() === new Date(input.date!).toDateString()
      );
      if (conflict) throw ApiError.conflict('Another score already exists for this date');
      score.date = input.date;
    }

    if (input.value !== undefined) score.value = input.value;

    await user.save();
    return [...user.scores].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async deleteScore(userId: string, scoreId: string): Promise<void> {
    const user = await User.findById(userId).select('scores');
    if (!user) throw ApiError.notFound('User not found');

    const scoresArray = user.scores as mongoose.Types.DocumentArray<IScore>;
    const exists = scoresArray.id(scoreId);
    if (!exists) throw ApiError.notFound('Score not found');

    scoresArray.pull({ _id: scoreId });
    await user.save();
  }
}

export const scoreService = new ScoreService();
