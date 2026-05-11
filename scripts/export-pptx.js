const puppeteer = require('puppeteer-core');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const CHROMIUM = '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';
const BASE = 'http://localhost:5000';
const OUT_DIR = path.join(__dirname, '..', 'exports');
const TMP_DIR = path.join(__dirname, '..', '.tmp-slides');

const DECKS = [
  {
    url: '/monmouth-county/public-speaking.html',
    title: 'Paul Ireifej — Finding Your Voice',
    out: 'Paul-Ireifej-Monmouth-County-Public-Speaking.pptx',
  },
  {
    url: '/monmouth-county/active-listening.html',
    title: 'Paul Ireifej — Listening First',
    out: 'Paul-Ireifej-Monmouth-County-Active-Listening.pptx',
  },
];

const W = 1920, H = 1080;

async function exportDeck(browser, deck) {
  console.log(`\n=== ${deck.out} ===`);
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${deck.url}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const total = await page.evaluate(() => document.querySelectorAll('.reveal .slides > section').length);
  console.log(`  Slides: ${total}`);

  const images = [];
  for (let i = 0; i < total; i++) {
    await page.evaluate((idx) => Reveal.slide(idx), i);
    await new Promise(r => setTimeout(r, 600));
    const file = path.join(TMP_DIR, `slide-${i}.png`);
    await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
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
  for (const deck of DECKS) await exportDeck(browser, deck);
  await browser.close();
  if (fs.existsSync(TMP_DIR)) fs.rmdirSync(TMP_DIR);
  console.log('\nAll done.');
})().catch(e => { console.error(e); process.exit(1); });
