const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_PANEL = path.resolve(__dirname, '../attached_assets/IMG_6341_exported_1756000851902_1777126770712.jpg');
const SRC_SELFIE = path.resolve(__dirname, '../attached_assets/PXL_20250822_185947923_(1)_1777126730439.jpg');
const OUT_DIR = path.resolve(__dirname, '../img-new/toastmasters');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const polish = (pipeline) => pipeline
  .modulate({ brightness: 1.10, saturation: 1.12 })
  .gamma(1.05)
  .linear(1.08, -8)
  .sharpen({ sigma: 0.8, m1: 0.5, m2: 2.0 });

(async () => {
  // Panel photo: 3024x4032 portrait. Crop to focus on the 4 panelists,
  // drop some of the audience heads in the foreground.
  // Panel sits roughly y=1200 to y=2700, full width.
  console.log('Processing panel photo...');
  const panelMeta = await sharp(SRC_PANEL).rotate().metadata();
  console.log(`  source: ${panelMeta.width}x${panelMeta.height}`);

  // Crop a 16:9 banner from the panel area
  const panelCrop = { left: 100, top: 800, width: 2824, height: 1900 };
  let panel = sharp(SRC_PANEL).rotate().extract(panelCrop);
  panel = polish(panel);
  // Resize to a sensible web max-width keeping aspect
  panel = panel.resize({ width: 1600, withoutEnlargement: true });

  await panel.clone().jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'panel.jpg'));
  await panel.clone().webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'panel.webp'));

  // Selfie: 3648x2736 landscape. Polish only — composition is already great.
  console.log('Processing selfie photo...');
  const selfieMeta = await sharp(SRC_SELFIE).rotate().metadata();
  console.log(`  source: ${selfieMeta.width}x${selfieMeta.height}`);

  let selfie = sharp(SRC_SELFIE).rotate();
  selfie = polish(selfie);
  selfie = selfie.resize({ width: 1600, withoutEnlargement: true });

  await selfie.clone().jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'selfie.jpg'));
  await selfie.clone().webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'selfie.webp'));

  for (const f of fs.readdirSync(OUT_DIR)) {
    const s = fs.statSync(path.join(OUT_DIR, f));
    console.log(`  ${f} — ${(s.size / 1024).toFixed(1)} KB`);
  }
  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
