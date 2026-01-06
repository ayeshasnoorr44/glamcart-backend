import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Simple lip region detection - creates an elliptical mask for the lips
export const processLipstickOverlay = async (
  imageBuffer: Buffer,
  colorHex: string
): Promise<Buffer> => {
  try {
    console.log(`🎨 Processing lipstick overlay with color ${colorHex}`);
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions');
    }

    console.log(`📏 Image size: ${metadata.width}x${metadata.height}`);

    // Estimate lip region (typically in center-lower part of face)
    // Assuming face takes up roughly the upper-middle portion of the image
    const imgWidth = metadata.width;
    const imgHeight = metadata.height;
    
    // Lips are typically 40-60% from top, centered horizontally
    const lipCenterX = imgWidth / 2;
    const lipCenterY = (imgHeight * 2) / 3; // Lower third of image
    
    // Lip area dimensions (adjust based on typical face proportions)
    const lipWidth = imgWidth * 0.25; // ~25% of image width
    const lipHeight = imgHeight * 0.1; // ~10% of image height

    console.log(`👄 Lip region: center (${Math.round(lipCenterX)}, ${Math.round(lipCenterY)}), size ${Math.round(lipWidth)}x${Math.round(lipHeight)}`);

    // Create SVG mask for lips (elliptical)
    const svgMask = `<svg width="${imgWidth}" height="${imgHeight}">
      <defs>
        <mask id="lipMask">
          <rect width="${imgWidth}" height="${imgHeight}" fill="black"/>
          <ellipse cx="${lipCenterX}" cy="${lipCenterY}" rx="${lipWidth/2}" ry="${lipHeight/2}" fill="white"/>
        </mask>
      </defs>
      <rect width="${imgWidth}" height="${imgHeight}" fill="${colorHex}" mask="url(#lipMask)" opacity="0.7"/>
    </svg>`;

    // Convert hex to RGB for debugging
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);
    console.log(`🎨 Color RGB: (${r}, ${g}, ${b})`);

    // Create color overlay
    const overlay = await sharp({
      create: {
        width: imgWidth,
        height: imgHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: Buffer.from(svgMask),
          blend: 'multiply',
        },
      ])
      .png()
      .toBuffer();

    // Apply overlay to original image with soft blend
    const result = await sharp(imageBuffer)
      .composite([{ input: overlay, blend: 'screen' }])
      .png()
      .toBuffer();

    console.log(`✅ Lipstick overlay applied successfully`);
    return result;
  } catch (error) {
    console.error('❌ Error processing lipstick overlay:', error);
    throw error;
  }
};

export const validateImage = async (buffer: Buffer): Promise<boolean> => {
  try {
    const metadata = await sharp(buffer).metadata();
    return !!metadata.width && !!metadata.height;
  } catch {
    return false;
  }
};

export const resizeImage = async (
  buffer: Buffer,
  width: number = 800,
  height: number = 800
): Promise<Buffer> => {
  return sharp(buffer).resize(width, height, { fit: 'inside' }).png().toBuffer();
};
