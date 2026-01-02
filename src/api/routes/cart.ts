import express, { Request, Response } from 'express';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

const router = express.Router();

// Get user cart (requires userId in headers or params)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});

// Add to cart
router.post('/:userId/add', async (req: Request, res: Response) => {
  try {
    const { productId, colorHex, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: {
          cart: { productId, colorHex, quantity },
        },
      },
      { new: true }
    ).populate('cart.productId');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

// Remove from cart
router.delete('/:userId/:productId', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { cart: { productId: req.params.productId } } },
      { new: true }
    ).populate('cart.productId');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from cart' });
  }
});

export default router;
