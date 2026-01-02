import express, { Request, Response } from 'express';
import multer from 'multer';
import { processLipstickOverlay, validateImage, resizeImage } from '../../utils/imageProcessor.js';
import Product from '../../models/Product.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE || '10485760'),
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Apply lipstick to uploaded image
router.post('/apply', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const { productId, colorHex } = req.body;

    // Validate image
    const isValidImage = await validateImage(req.file.buffer);
    if (!isValidImage) {
      return res.status(400).json({ success: false, message: 'Invalid image' });
    }

    // Resize image for consistency
    const resizedImage = await resizeImage(req.file.buffer);

    // Apply lipstick color
    const processedImage = await processLipstickOverlay(resizedImage, colorHex);

    // Convert to base64
    const base64Image = processedImage.toString('base64');

    res.status(200).json({
      success: true,
      data: {
        originalImage: `data:image/png;base64,${req.file.buffer.toString('base64')}`,
        processedImage: `data:image/png;base64,${base64Image}`,
        appliedColor: colorHex,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
