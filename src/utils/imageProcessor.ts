import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export const processLipstickOverlay = async (
  imageBuffer: Buffer,
  colorHex: string
): Promise<Buffer> => {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions');
    }

    // Create a color overlay with transparency
    const overlay = await sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${metadata.width}" height="${metadata.height}">
              <rect width="${metadata.width}" height="${metadata.height}" fill="${colorHex}" opacity="0.6"/>
            </svg>`
          ),
          blend: 'multiply',
        },
      ])
      .png()
      .toBuffer();

    // Apply overlay to original image
    const result = await sharp(imageBuffer)
      .composite([{ input: overlay, blend: 'screen' }])
      .png()
      .toBuffer();

    return result;
  } catch (error) {
    console.error('Error processing lipstick overlay:', error);
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
