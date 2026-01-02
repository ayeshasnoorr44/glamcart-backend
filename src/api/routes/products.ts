import express, { Request, Response } from 'express';
import Product from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, brand } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    const products = await Product.find(filter).limit(100);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// Create product (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
