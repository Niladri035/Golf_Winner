import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'subscription' | 'prize' | 'charity';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number; // in cents
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  referenceId?: string; // drawId, stripeInvoiceId, etc.
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    type: {
      type: String,
      enum: ['subscription', 'prize', 'charity'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    referenceId: { type: String },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, type: 1, createdAt: -1 });
TransactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
