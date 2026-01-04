import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'Ruby Romance',
    brand: 'MAC',
    description: 'Deep red lipstick with a luxurious matte finish. Perfect for a timeless, classic look.',
    price: 45.99,
    colors: [
      { name: 'Deep Red', hex: '#C41E3A', imageUrl: 'https://via.placeholder.com/100?text=Deep+Red' },
    ],
    category: 'lipstick',
    stock: 50,
    rating: 4.8,
    reviews: 128,
  },
  {
    name: 'Pink Bliss',
    brand: 'Charlotte Tilbury',
    description: 'Soft pink lipstick that complements all skin tones. Creamy and comfortable.',
    price: 52.00,
    colors: [
      { name: 'Soft Pink', hex: '#FFB6C1', imageUrl: 'https://via.placeholder.com/100?text=Soft+Pink' },
    ],
    category: 'lipstick',
    stock: 45,
    rating: 4.7,
    reviews: 95,
  },
  {
    name: 'Berry Bold',
    brand: 'Nars',
    description: 'Rich berry tone with a semi-gloss finish. Stunning and versatile.',
    price: 39.99,
    colors: [
      { name: 'Berry', hex: '#6F2E4E', imageUrl: 'https://via.placeholder.com/100?text=Berry' },
    ],
    category: 'lipstick',
    stock: 60,
    rating: 4.6,
    reviews: 112,
  },
  {
    name: 'Nude Perfection',
    brand: 'Bobbi Brown',
    description: 'Universally flattering nude shade with a natural finish.',
    price: 42.50,
    colors: [
      { name: 'Nude', hex: '#D4A574', imageUrl: 'https://via.placeholder.com/100?text=Nude' },
    ],
    category: 'lipstick',
    stock: 55,
    rating: 4.9,
    reviews: 156,
  },
  {
    name: 'Sunset Shimmer',
    brand: 'Urban Decay',
    description: 'Golden eyeshadow with a shimmering finish. Creates a warm, glowing eye look.',
    price: 28.00,
    colors: [
      { name: 'Gold', hex: '#FFD700', imageUrl: 'https://via.placeholder.com/100?text=Gold' },
      { name: 'Bronze', hex: '#CD7F32', imageUrl: 'https://via.placeholder.com/100?text=Bronze' },
    ],
    category: 'eyeshadow',
    stock: 75,
    rating: 4.7,
    reviews: 203,
  },
  {
    name: 'Night Sky',
    brand: 'Anastasia Beverly Hills',
    description: 'Deep navy and black eyeshadow palette for dramatic looks.',
    price: 35.00,
    colors: [
      { name: 'Navy', hex: '#000080', imageUrl: 'https://via.placeholder.com/100?text=Navy' },
      { name: 'Black', hex: '#000000', imageUrl: 'https://via.placeholder.com/100?text=Black' },
    ],
    category: 'eyeshadow',
    stock: 40,
    rating: 4.8,
    reviews: 189,
  },
  {
    name: 'Rosy Glow',
    brand: 'Tarte',
    description: 'Peachy-rose blush that adds a natural flush to cheeks.',
    price: 32.00,
    colors: [
      { name: 'Peachy Rose', hex: '#FFB6B9', imageUrl: 'https://via.placeholder.com/100?text=Peachy+Rose' },
    ],
    category: 'blush',
    stock: 65,
    rating: 4.6,
    reviews: 141,
  },
  {
    name: 'Coral Dream',
    brand: 'Benefit',
    description: 'Vibrant coral blush that brightens the complexion instantly.',
    price: 29.50,
    colors: [
      { name: 'Coral', hex: '#FF7F50', imageUrl: 'https://via.placeholder.com/100?text=Coral' },
    ],
    category: 'blush',
    stock: 70,
    rating: 4.5,
    reviews: 118,
  },
  {
    name: 'Plum Perfection',
    brand: 'Too Faced',
    description: 'Rich plum blush for a sophisticated, elevated look.',
    price: 36.00,
    colors: [
      { name: 'Plum', hex: '#8B4789', imageUrl: 'https://via.placeholder.com/100?text=Plum' },
    ],
    category: 'blush',
    stock: 50,
    rating: 4.7,
    reviews: 167,
  },
  {
    name: 'Mauve Sophistication',
    brand: 'Dior',
    description: 'Elegant mauve eyeshadow for a chic, timeless appearance.',
    price: 44.00,
    colors: [
      { name: 'Mauve', hex: '#E0B0FF', imageUrl: 'https://via.placeholder.com/100?text=Mauve' },
    ],
    category: 'eyeshadow',
    stock: 35,
    rating: 4.9,
    reviews: 201,
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/glamcart';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} sample products`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
