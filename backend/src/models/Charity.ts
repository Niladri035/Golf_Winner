import mongoose, { Document, Schema } from 'mongoose';

export interface ICharityEvent {
  title: string;
  description: string;
  date: Date;
}

export interface ICharity extends Document {
  name: string;
  description: string;
  images: string[];
  events: ICharityEvent[];
  isFeatured: boolean;
  totalContributions: number;
  monthlyStats: { month: string; amount: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const CharityEventSchema = new Schema<ICharityEvent>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

const CharitySchema = new Schema<ICharity>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    events: { type: [CharityEventSchema], default: [] },
    isFeatured: { type: Boolean, default: false },
    totalContributions: { type: Number, default: 0, min: 0 },
    monthlyStats: {
      type: [{ month: String, amount: Number }],
      default: [],
    },
  },
  { timestamps: true }
);

CharitySchema.index({ isFeatured: 1 });
CharitySchema.index({ totalContributions: -1 });
CharitySchema.index({ name: 'text', description: 'text' });

export const Charity = mongoose.model<ICharity>('Charity', CharitySchema);
