import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl?: string;
  colors: {
    name: string;
    hex: string;
    imageUrl?: string;
  }[];
  category: 'lipstick' | 'eyeshadow' | 'blush';
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: null },
    colors: [
      {
        name: String,
        hex: String,
        imageUrl: String,
      },
    ],
    category: {
      type: String,
      enum: ['lipstick', 'eyeshadow', 'blush'],
      default: 'lipstick',
    },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
