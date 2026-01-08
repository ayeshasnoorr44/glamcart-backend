import express, { Request, Response } from 'express';
import Product from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, authorize } from '../../middleware/authorize.js';

const router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('📦 GET /api/products request received');
    const { category, brand, search } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    
    // Add search by product name
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(filter).limit(100);
    console.log(`✅ Found ${products.length} products`);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
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
router.post('/', authenticate, authorize, async (req: Request, res: Response) => {
  try {
    console.log(`👑 Admin ${req.user?.email} creating product`);
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update product (admin)
router.put('/:id', authenticate, authorize, async (req: Request, res: Response) => {
  try {
    console.log(`👑 Admin ${req.user?.email} updating product ${req.params.id}`);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete product (admin)
router.delete('/:id', authenticate, authorize, async (req: Request, res: Response) => {
  try {
    console.log(`👑 Admin ${req.user?.email} deleting product ${req.params.id}`);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
