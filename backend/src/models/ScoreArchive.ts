import mongoose, { Document, Schema } from 'mongoose';

/** Archived scores that were pushed out of the user's active 5-score window */
export interface IScoreArchive extends Document {
  userId: mongoose.Types.ObjectId;
  value: number;
  date: Date;
  archivedAt: Date;
}

const ScoreArchiveSchema = new Schema<IScoreArchive>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    value: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, required: true },
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

ScoreArchiveSchema.index({ userId: 1, archivedAt: -1 });

export const ScoreArchive = mongoose.model<IScoreArchive>('ScoreArchive', ScoreArchiveSchema);
