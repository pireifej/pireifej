const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../attached_assets/IMG_20241009_133523_1777126063305.jpg');
const OUT_DIR = path.resolve(__dirname, '../img-new/team');
const TMP_DIR = path.resolve(__dirname, '../.local/photo-tmp');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

(async () => {
  console.log('Loading source...');
  const meta = await sharp(SRC).metadata();
  console.log(`Source: ${meta.width}x${meta.height}`);

  // -----------------------------------------------------------
  // STEP 1: Crop to remove distractions (AV equipment, audience)
  // Source is 1536x2048. Paul's full body fits in ~y=180 to y=1395.
  // Crop tightens around stage scene, drops bottom equipment.
  // -----------------------------------------------------------
  const cropLeft = 120;
  const cropTop = 140;
  const cropWidth = 1296;   // ends at x=1416
  const cropHeight = 1100;  // ends at y=1240 (above mixer stack & cables)

  // -----------------------------------------------------------
  // STEP 2: Stage version — keep background, polish colors
  // -----------------------------------------------------------
  console.log('Building stage version...');
  let stage = sharp(SRC).rotate().extract({
    left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight
  });

  // Medium polish: brightness +8%, saturation +12%, gentle gamma + sharpen.
  stage = stage
    .modulate({ brightness: 1.08, saturation: 1.12, hue: 0 })
    .gamma(1.05)                                   // mild contrast curve
    .linear(1.10, -10)                             // slight contrast lift
    .sharpen({ sigma: 0.9, m1: 0.6, m2: 2.5 });    // crisp face/details

  // First pass: render to tmp so we can do localized lint cleanup
  const stagePolishedPath = path.join(TMP_DIR, 'stage_polished.png');
  await stage.png().toFile(stagePolishedPath);

  // -----------------------------------------------------------
  // STEP 3: Localized lint removal on the lower-body region
  // White specks live on the pants below his belt. We apply a
  // gentle median filter ONLY to that region, then composite it
  // back onto the polished image. Median preserves edges while
  // crushing tiny salt-and-pepper specks (the lint flecks).
  // -----------------------------------------------------------
  console.log('Cleaning lint flecks on suit/pants...');
  const polishedMeta = await sharp(stagePolishedPath).metadata();

  // Region: from below the suit jacket down through the legs/shoes.
  // Spans across his whole figure. Median size 7 + repeated pass
  // crushes the white lint specks against dark fabric.
  const lintRegion = {
    left: 260,
    top: 600,
    width: 580,
    height: 500
  };

  // Clamp to image bounds
  lintRegion.width = Math.min(lintRegion.width, polishedMeta.width - lintRegion.left);
  lintRegion.height = Math.min(lintRegion.height, polishedMeta.height - lintRegion.top);

  // Two passes of median crush stubborn specks while preserving fabric texture
  let lintCleanBuf = await sharp(stagePolishedPath)
    .extract(lintRegion)
    .median(7)
    .median(5)
    .blur(0.5)
    .toBuffer();

  const stageFinal = await sharp(stagePolishedPath)
    .composite([{ input: lintCleanBuf, left: lintRegion.left, top: lintRegion.top }])
    .toBuffer();

  // Save final stage version as JPG (best for web hero with photo background)
  const stagePath = path.join(OUT_DIR, 'paul-stage.jpg');
  await sharp(stageFinal)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(stagePath);
  console.log(`Stage version saved: ${stagePath}`);

  // Also a webp for modern browsers
  const stageWebp = path.join(OUT_DIR, 'paul-stage.webp');
  await sharp(stageFinal).webp({ quality: 85 }).toFile(stageWebp);
  console.log(`Stage WebP saved: ${stageWebp}`);

  // Save the polished full-resolution PNG for the bg-removal step
  const stageFinalPng = path.join(TMP_DIR, 'stage_final.png');
  await sharp(stageFinal).png().toFile(stageFinalPng);

  // Tighter crop just around Paul for cutout — drops podium edges and
  // mic stand fragments so the bg-removal model has only him to work
  // with. Coords are relative to the polished (1296x1100) frame.
  const cutoutSourcePng = path.join(TMP_DIR, 'cutout_source.png');
  const cutoutSrcCrop = { left: 240, top: 60, width: 720, height: 1040 };
  // Clamp
  const polishedMeta2 = await sharp(stageFinalPng).metadata();
  cutoutSrcCrop.width = Math.min(cutoutSrcCrop.width, polishedMeta2.width - cutoutSrcCrop.left);
  cutoutSrcCrop.height = Math.min(cutoutSrcCrop.height, polishedMeta2.height - cutoutSrcCrop.top);
  await sharp(stageFinalPng).extract(cutoutSrcCrop).png().toFile(cutoutSourcePng);

  // -----------------------------------------------------------
  // STEP 4: Hero cutout — remove background
  // -----------------------------------------------------------
  console.log('Removing background for hero cutout (this may take a minute)...');
  const { removeBackground } = await import('@imgly/background-removal-node');
  const blob = await removeBackground(cutoutSourcePng, {
    output: { format: 'image/png', quality: 1.0 }
  });
  const cutoutBuf = Buffer.from(await blob.arrayBuffer());

  // Clean up: drop tiny isolated alpha specks by alpha-thresholding
  // anything below ~80/255, then trim transparent borders
  const heroTrimmedPath = path.join(OUT_DIR, 'paul-stage-removebg-trimmed.png');
  const cleanedRgba = await sharp(cutoutBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cleanedRgba;
  // Alpha threshold pass: anything < 80 -> 0 (kills floaters), > 180 -> 255 (sharpens edges)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 80) data[i] = 0;
    else if (data[i] > 180) data[i] = 255;
  }

  // Surgical alpha-erase: nuke the podium wing fragment on the right
  // and any other isolated artifact rectangles. Coords are in the
  // cutout source frame (info.width x info.height — 720x1040).
  const eraseRegions = [
    { x0: 460, y0: 500, x1: 615, y1: 660 },   // podium wing right of his hip
    { x0: 230, y0: 745, x1: 285, y1: 790 },   // small fleck below mic hand
  ];
  for (const r of eraseRegions) {
    for (let y = r.y0; y < r.y1; y++) {
      for (let x = r.x0; x < r.x1; x++) {
        const idx = (y * info.width + x) * 4 + 3;
        if (idx < data.length) data[idx] = 0;
      }
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, 'paul-stage-removebg.png'));

  // Trim the surrounding transparent space so it composites cleanly
  await sharp(path.join(OUT_DIR, 'paul-stage-removebg.png'))
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(heroTrimmedPath);

  const heroPath = path.join(OUT_DIR, 'paul-stage-removebg.png');
  console.log(`Hero cutout saved: ${heroPath}`);
  console.log(`Hero cutout (trimmed) saved: ${heroTrimmedPath}`);

  // Print final file sizes
  for (const f of [stagePath, stageWebp, heroPath, heroTrimmedPath]) {
    const s = fs.statSync(f);
    console.log(`  ${path.basename(f)} — ${(s.size / 1024).toFixed(1)} KB`);
  }
  console.log('Done.');
})().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
