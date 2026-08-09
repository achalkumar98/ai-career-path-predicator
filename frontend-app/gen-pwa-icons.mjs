/**
 * Generates square PWA icons from the actual aicareernav-logo.png
 * Places the logo centered on the brand blue background for maskable icons
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src       = path.join(__dirname, 'public', 'assets', 'aicareernav-logo.png');
const outDir    = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const BRAND = { r: 34, g: 85, b: 236 }; // #2255ec

for (const size of SIZES) {
  // Logo fits inside 80% of the icon canvas (safe zone for maskable)
  const logoSize = Math.round(size * 0.72);
  const padding  = Math.round((size - logoSize) / 2);

  // 1. Resize the logo to fit within logoSize×logoSize, keeping aspect ratio
  const logoResized = await sharp(src)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 34, g: 85, b: 236, alpha: 1 } })
    .png()
    .toBuffer();

  // 2. Composite onto a brand-blue square canvas
  const outFile = path.join(outDir, `icon-${size}x${size}.png`);
  await sharp({
    create: {
      width:      size,
      height:     size,
      channels:   4,
      background: { ...BRAND, alpha: 1 },
    },
  })
    .composite([{ input: logoResized, top: padding, left: padding }])
    .png()
    .toFile(outFile);

  console.log(`✓ icon-${size}x${size}.png`);
}

// Also write a dedicated maskable version (logo fills more canvas = 90%)
for (const size of [192, 512]) {
  const logoSize = Math.round(size * 0.82);
  const padding  = Math.round((size - logoSize) / 2);

  const logoResized = await sharp(src)
    .resize(logoSize, logoSize, { fit: 'contain', background: { ...BRAND, alpha: 1 } })
    .png()
    .toBuffer();

  const outFile = path.join(outDir, `icon-${size}x${size}-maskable.png`);
  await sharp({
    create: { width: size, height: size, channels: 4, background: { ...BRAND, alpha: 1 } },
  })
    .composite([{ input: logoResized, top: padding, left: padding }])
    .png()
    .toFile(outFile);

  console.log(`✓ icon-${size}x${size}-maskable.png`);
}

console.log('\nAll PWA icons generated from aicareernav-logo.png');
