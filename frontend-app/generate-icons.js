#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Generates all required icon sizes from aicareernav-logo.png using Sharp
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, 'public', 'assets', 'aicareernav-logo.png');
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

// All icon sizes needed for PWA (manifest + shortcuts + apple touch + favicons)
const ICONS = [
  { size: 16,   name: 'icon-16x16.png' },
  { size: 32,   name: 'icon-32x32.png' },
  { size: 48,   name: 'icon-48x48.png' },
  { size: 72,   name: 'icon-72x72.png' },
  { size: 96,   name: 'icon-96x96.png' },
  { size: 128,  name: 'icon-128x128.png' },
  { size: 144,  name: 'icon-144x144.png' },
  { size: 152,  name: 'icon-152x152.png' },
  { size: 180,  name: 'icon-180x180.png' },
  { size: 192,  name: 'icon-192x192.png' },
  { size: 256,  name: 'icon-256x256.png' },
  { size: 384,  name: 'icon-384x384.png' },
  { size: 512,  name: 'icon-512x512.png' },
];

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Verify input file exists
  if (!fs.existsSync(INPUT)) {
    console.error(`❌ Logo not found at: ${INPUT}`);
    process.exit(1);
  }

  console.log(`🎨 Generating ${ICONS.length} icons from: ${INPUT}\n`);

  const results = await Promise.allSettled(
    ICONS.map(async ({ size, name }) => {
      const outputPath = path.join(OUTPUT_DIR, name);
      await sharp(INPUT)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 15, g: 17, b: 23, alpha: 1 }, // matches #0f1117 (app background)
        })
        .png({ compressionLevel: 9, quality: 100 })
        .toFile(outputPath);
      return { size, name, outputPath };
    })
  );

  let successCount = 0;
  let failCount = 0;

  results.forEach((result, i) => {
    const { size, name } = ICONS[i];
    if (result.status === 'fulfilled') {
      console.log(`  ✅ ${name.padEnd(24)} (${size}x${size})`);
      successCount++;
    } else {
      console.error(`  ❌ ${name.padEnd(24)} (${size}x${size}) — ${result.reason.message}`);
      failCount++;
    }
  });

  console.log(`\n✨ Done! ${successCount} icons generated${failCount ? `, ${failCount} failed` : ''}.`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

generateIcons().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
