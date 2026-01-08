import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  photoUrl?: string;
  role: 'user' | 'admin';
  cart: Array<{
    productId: mongoose.Types.ObjectId;
    colorHex: string;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, minlength: 6 },
    name: { type: String, required: true },
    photoUrl: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        colorHex: String,
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
