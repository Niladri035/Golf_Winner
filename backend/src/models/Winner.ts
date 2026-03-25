import mongoose, { Document, Schema } from 'mongoose';

export type WinnerStatus = 'awaiting_proof' | 'pending_review' | 'verified' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IWinner extends Document {
  userId: mongoose.Types.ObjectId;
  drawId: mongoose.Types.ObjectId;
  matchType: 3 | 4 | 5;
  prizeAmount: number;
  proofImage?: string;
  proofPublicId?: string;
  status: WinnerStatus;
  paymentStatus: PaymentStatus;
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WinnerSchema = new Schema<IWinner>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    drawId: { type: Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
    matchType: { type: Number, enum: [3, 4, 5], required: true },
    prizeAmount: { type: Number, required: true, min: 0 },
    proofImage: { type: String },
    proofPublicId: { type: String },
    status: {
      type: String,
      enum: ['awaiting_proof', 'pending_review', 'verified', 'rejected'],
      default: 'awaiting_proof',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    rejectionReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

WinnerSchema.index({ userId: 1, drawId: 1 }, { unique: true });

export const Winner = mongoose.model<IWinner>('Winner', WinnerSchema);
