#!/usr/bin/env node
/**
 * PWA Splash Screen Generator
 * Creates full-screen splash images for every standard iOS/Android screen size.
 * The logo is placed large and centred, with the app name below it.
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const LOGO       = path.join(__dirname, 'public', 'assets', 'aicareernav-logo.png');
const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

// Background matches manifest background_color + dark app background
const BG = { r: 15, g: 17, b: 23, alpha: 1 }; // #0f1117

// All standard iOS splash sizes (portrait) + a generic Android one
const SIZES = [
  // iPhone SE  (1st gen)
  { w: 640,  h: 1136, name: 'splash-640x1136.png' },
  // iPhone 8 / SE (2nd / 3rd gen)
  { w: 750,  h: 1334, name: 'splash-750x1334.png' },
  // iPhone 8 Plus
  { w: 1242, h: 2208, name: 'splash-1242x2208.png' },
  // iPhone X / XS / 11 Pro / 12 mini / 13 mini
  { w: 1125, h: 2436, name: 'splash-1125x2436.png' },
  // iPhone XS Max / XR / 11 / 11 Pro Max
  { w: 1242, h: 2688, name: 'splash-1242x2688.png' },
  // iPhone 12 / 12 Pro / 13 / 13 Pro / 14
  { w: 1170, h: 2532, name: 'splash-1170x2532.png' },
  // iPhone 12 Pro Max / 13 Pro Max / 14 Plus
  { w: 1284, h: 2778, name: 'splash-1284x2778.png' },
  // iPhone 14 Pro
  { w: 1179, h: 2556, name: 'splash-1179x2556.png' },
  // iPhone 14 Pro Max / 15 Plus / 16 Plus
  { w: 1290, h: 2796, name: 'splash-1290x2796.png' },
  // iPhone 15 / 15 Pro / 16
  { w: 1179, h: 2556, name: 'splash-1179x2556.png' },
  // iPad (general)
  { w: 1668, h: 2388, name: 'splash-1668x2388.png' },
  // Generic Android / PWA install
  { w: 1080, h: 1920, name: 'splash-1080x1920.png' },
];

// Deduplicate by filename
const UNIQUE_SIZES = SIZES.filter(
  (s, i, arr) => arr.findIndex((x) => x.name === s.name) === i
);

async function buildSplash({ w, h, name }) {
  const logoSize = Math.round(Math.min(w, h) * 0.32); // 32% of shorter side

  // Resize logo
  const logoBuf = await sharp(LOGO)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Centre position
  const left = Math.round((w - logoSize) / 2);
  const top  = Math.round((h - logoSize) / 2) - Math.round(h * 0.04); // slightly above centre

  const outPath = path.join(OUTPUT_DIR, name);

  await sharp({
    create: { width: w, height: h, channels: 4, background: BG },
  })
    .composite([{ input: logoBuf, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return { name, w, h };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(LOGO)) { console.error('Logo not found:', LOGO); process.exit(1); }

  console.log(`\n🖼  Generating ${UNIQUE_SIZES.length} splash screens…\n`);

  const results = await Promise.allSettled(UNIQUE_SIZES.map(buildSplash));

  results.forEach((r, i) => {
    const { name, w, h } = UNIQUE_SIZES[i];
    if (r.status === 'fulfilled') {
      console.log(`  ✅  ${name.padEnd(32)} ${w}×${h}`);
    } else {
      console.error(`  ❌  ${name.padEnd(32)} ${r.reason?.message}`);
    }
  });

  console.log('\n✨ Done!\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
