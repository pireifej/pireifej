const puppeteer = require('puppeteer-core');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const CHROMIUM = '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';
const BASE = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : 'http://127.0.0.1:5000';
const OUT_DIR = path.join(__dirname, '..', 'exports');
const TMP_DIR = path.join(__dirname, '..', '.tmp-slides');

const DECKS = [
  {
    url: '/monmouth-county/public-speaking.html',
    title: 'Paul Ireifej — Find Your Voice / Speak So Others Will Listen',
    out: 'Paul-Ireifej-Monmouth-County-Public-Speaking.pptx',
    format: 'static-print',
    slideCount: 14,
  },
  {
    url: '/monmouth-county/active-listening.html',
    title: 'Paul Ireifej — Listening First',
    out: 'Paul-Ireifej-Monmouth-County-Active-Listening.pptx',
  },
];

const W = 1920, H = 1080;
const STATIC_W = 1280, STATIC_H = 720;

async function exportDeck(browser, deck) {
  console.log(`\n=== ${deck.out} ===`);
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const page = await browser.newPage();
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error('Admin credentials must be configured in workspace Secrets to export protected decks.');
  }
  await page.authenticate({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });
  const isStatic = deck.format === 'static-print';
  const width = isStatic ? STATIC_W : W;
  const height = isStatic ? STATIC_H : H;
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const response = await page.goto(`${BASE}${deck.url}`, { waitUntil: 'networkidle0', timeout: 60000 });
  if (!response.ok()) throw new Error(`Deck request failed: HTTP ${response.status()}`);
  if (isStatic) {
    await page.addStyleTag({ content: '.deck-toolbar { display: none !important; }' });
    await page.evaluate(() => document.fonts.ready);
  }
  await new Promise(r => setTimeout(r, 2000));

  const total = isStatic
    ? deck.slideCount
    : await page.evaluate(() => document.querySelectorAll('.reveal .slides > section').length);
  console.log(`  Slides: ${total}`);

  const images = [];
  for (let i = 0; i < total; i++) {
    const file = path.join(TMP_DIR, `slide-${i}.png`);
    if (isStatic) {
      // The public-speaking deck is a print-ready static page: each slide is
      // an independent, fixed 1280x720 element rather than a Reveal section.
      const selector = `.print-slide#slide-${i + 1}`;
      const slide = await page.$(selector);
      if (!slide) throw new Error(`Missing static slide: ${selector}`);
      const box = await slide.boundingBox();
      if (!box || Math.round(box.width) !== STATIC_W || Math.round(box.height) !== STATIC_H) {
        throw new Error(`Static slide ${i + 1} must be exactly ${STATIC_W}x${STATIC_H}px`);
      }
      await slide.screenshot({ path: file, type: 'png' });
    } else {
      await page.evaluate((idx) => Reveal.slide(idx), i);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    }
    images.push(file);
    process.stdout.write(`  [${i + 1}/${total}] `);
  }
  console.log('done capturing.');

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in (16:9)
  pptx.title = deck.title;
  pptx.author = 'Paul Ireifej';
  pptx.company = 'Should Call Paul';

  for (const img of images) {
    const slide = pptx.addSlide();
    slide.background = { color: '0F0E2E' };
    slide.addImage({ path: img, x: 0, y: 0, w: 13.333, h: 7.5 });
  }

  const outPath = path.join(OUT_DIR, deck.out);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await pptx.writeFile({ fileName: outPath });
  console.log(`  Saved: ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);

  for (const img of images) fs.unlinkSync(img);
  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const selected = process.argv.includes('--public-speaking')
    ? DECKS.filter((deck) => deck.format === 'static-print')
    : DECKS;
  for (const deck of selected) await exportDeck(browser, deck);
  await browser.close();
  if (fs.existsSync(TMP_DIR)) fs.rmdirSync(TMP_DIR);
  console.log('\nAll done.');
})().catch(e => { console.error(e); process.exit(1); });
