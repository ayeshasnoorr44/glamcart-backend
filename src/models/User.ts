import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  photoUrl?: string;
  cart: Array<{
    productId: mongoose.Types.ObjectId;
    colorHex: string;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    photoUrl: String,
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

export default mongoose.model<IUser>('User', userSchema);
