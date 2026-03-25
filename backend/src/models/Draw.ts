import mongoose, { Document, Schema } from 'mongoose';

export type DrawMode = 'random' | 'weighted';
export type DrawStatus = 'pending' | 'completed' | 'cancelled';

export interface IDrawWinnerEntry {
  userId: mongoose.Types.ObjectId;
  matchType: 3 | 4 | 5;
  prizeAmount: number;
}

export interface IDraw extends Document {
  drawnNumbers: number[];
  mode: DrawMode;
  prizePool: number;
  jackpotRollover: number;
  status: DrawStatus;
  winners: IDrawWinnerEntry[];
  month: string; // "YYYY-MM"
  totalParticipants: number;
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DrawWinnerSchema = new Schema<IDrawWinnerEntry>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  matchType: { type: Number, enum: [3, 4, 5], required: true },
  prizeAmount: { type: Number, required: true, min: 0 },
});

const DrawSchema = new Schema<IDraw>(
  {
    drawnNumbers: {
      type: [Number],
      required: true,
      validate: [(v: number[]) => v.length === 5, 'Draw must have exactly 5 numbers'],
    },
    mode: { type: String, enum: ['random', 'weighted'], required: true },
    prizePool: { type: Number, required: true, min: 0 },
    jackpotRollover: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    winners: { type: [DrawWinnerSchema], default: [] },
    month: { type: String, required: true, unique: true },
    totalParticipants: { type: Number, default: 0 },
    logs: { type: [String], default: [] },
  },
  { timestamps: true }
);

DrawSchema.index({ month: -1 });
DrawSchema.index({ status: 1 });

export const Draw = mongoose.model<IDraw>('Draw', DrawSchema);
