import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import productRoutes from './api/routes/products.js';
import authRoutes from './api/routes/auth.js';
import tryOnRoutes from './api/routes/tryOn.js';
import cartRoutes from './api/routes/cart.js';

dotenv.config();

const app = express();

// 1. Convert Port to a Number (Fixes the Docker error)
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: "https://clownfish-app-pn8ie.ondigitalocean.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/cart', cartRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
