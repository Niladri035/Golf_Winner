import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IScore {
  _id: mongoose.Types.ObjectId;
  value: number;
  date: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'active' | 'inactive' | 'lapsed' | 'trialing';
  stripeCustomerId?: string;
  selectedCharity?: mongoose.Types.ObjectId;
  charityPercentage: number;
  scores: IScore[];
  totalContributions: number;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ScoreSchema = new Schema<IScore>(
  {
    value: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, required: true },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'lapsed', 'trialing'],
      default: 'inactive',
      index: true,
    },
    stripeCustomerId: { type: String, sparse: true },
    selectedCharity: { type: Schema.Types.ObjectId, ref: 'Charity' },
    charityPercentage: { type: Number, default: 10, min: 10, max: 100 },
    scores: { type: [ScoreSchema], default: [], validate: [(v: IScore[]) => v.length <= 5, 'Maximum 5 scores allowed'] },
    totalContributions: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

/** Hash password before save */
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/** Instance method: compare passwords */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/** Indexes */
UserSchema.index({ stripeCustomerId: 1 }, { sparse: true });
UserSchema.index({ selectedCharity: 1 });
UserSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
