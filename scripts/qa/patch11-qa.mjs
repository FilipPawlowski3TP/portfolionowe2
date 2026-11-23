// PATCH v1.1 QA — acceptance §5: 6-point desktop + mobile mosaics and the
// measurable criteria (object size, anchor alignment, ghosts, sky RGB, axe).
// Measurement points are COMPUTED from real section positions (pinned sections
// break fixed scroll fractions).
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/patch11';
const BASE = 'http://127.0.0.1:4321/';

mkdirSync(OUT, { recursive: true });

// Scroll AND scene progress must move together — anchors are live DOM rects.
async function setPos(page, f) {
  await page.evaluate((v) => {
    window.scrollTo(0, v * (document.documentElement.scrollHeight - window.innerHeight));
    if (window.__SCENE_DEBUG__) window.__SCENE_DEBUG__.setProgress(v);
  }, f);
  await page.waitForTimeout(700);
}

// Progress value where each named section holds the viewport centre.
async function computePoints(page) {
  return page.evaluate(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const targets = { hero: '.hero', oferta: '#oferta', proces: '#proces', realizacje: '#realizacje', faq: '#faq', kontakt: '#kontakt' };
    const out = {};
    for (const [name, sel] of Object.entries(targets)) {
      const el = document.querySelector(sel);
      if (!el) continue;
      let first = null;
      let last = null;
      for (let y = 0; y <= max; y += 60) {
        window.scrollTo(0, y);
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.5 && r.bottom >= window.innerHeight * 0.5) {
          if (first === null) first = y;
          last = y;
        }
      }
      out[name] = first === null ? 0 : (first + last) / 2 / max;
    }
    window.scrollTo(0, 0);
    return out;
  });
}

async function capture(page, points, tag) {
  const shots = [];
  for (const name of Object.keys(points)) {
    await setPos(page, points[name]);
    const path = `${OUT}/${tag}-${name}.png`;
    await page.screenshot({ path });
    shots.push({ name, path, f: points[name] });
  }
  return shots;
}

async function mosaic(browser, shots, tag) {
  const p = await (await browser.newContext({ viewport: { width: 1500, height: 1000 } })).newPage();
  const cells = shots
    .map((s) => {
      const b64 = readFileSync(s.path).toString('base64');
      return `<figure><figcaption>${s.name} (${(s.f * 100).toFixed(1)}%)</figcaption><img src="data:image/png;base64,${b64}" /></figure>`;
    })
    .join('');
  await p.setContent(`<style>
    body { margin: 0; background: #111; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px; font: 14px sans-serif; color: #fff; }
    figure { margin: 0; } figcaption { padding: 4px; } img { width: 100%; display: block; }
  </style>${cells}`);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/mosaic-${tag}.png`, fullPage: true });
  await p.close();
}

function meanRgb(page, path) {
  const b64 = readFileSync(path).toString('base64');
  return page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    // sample sky-only strips: left edge below nav + top strip mid-screen
    const strips = [
      [8, Math.round(img.height * 0.25), 64, Math.round(img.height * 0.5)],
      [Math.round(img.width * 0.55), Math.round(img.height * 0.08), Math.round(img.width * 0.1), 40],
    ];
    let r = 0, g = 0, b = 0, n = 0;
    for (const [x, y, w, h] of strips) {
      const d = ctx.getImageData(x, y, w, h).data;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  }, `data:image/png;base64,${b64}`);
}

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = {};

  // --- Desktop ---
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const points = await computePoints(page);
  report.points = points;

  const shots = await capture(page, points, 'd');
  await mosaic(browser, shots, 'desktop');

  // hero object size (≥45% height)
  await setPos(page, points.hero);
  const heroBox = await page.evaluate(() => window.__SCENE_DEBUG__.getObjectScreenBox());
  report.heroObject = { ...heroBox, heightPct: +(heroBox.h / 900 * 100).toFixed(1), widthPctOfViewport: +(heroBox.w / 1440 * 100).toFixed(1) };

  // case alignment (≤24 px) + width (≥40%)
  await setPos(page, points.realizacje);
  const caseBox = await page.evaluate(() => window.__SCENE_DEBUG__.getObjectScreenBox());
  const caseAnchor = await page.evaluate(() => window.__SCENE_DEBUG__.getAnchors().case);
  report.caseObject = {
    boxW: +caseBox.w.toFixed(1),
    widthPctOfViewport: +(caseBox.w / 1440 * 100).toFixed(1),
    anchorW: +caseAnchor.width.toFixed(1),
    centerDeltaX: +Math.abs(caseBox.x + caseBox.w / 2 - caseAnchor.x).toFixed(1),
    centerDeltaY: +Math.abs(caseBox.y + caseBox.h / 2 - caseAnchor.y).toFixed(1),
  };

  // process: object must be visible and lighting layers
  await setPos(page, points.proces);
  const procBox = await page.evaluate(() => window.__SCENE_DEBUG__.getObjectScreenBox());
  report.processObject = { visible: procBox.opacity, boxW: +procBox.w.toFixed(1) };
  report.renderInfo = await page.evaluate(() => window.__SCENE_DEBUG__.getRenderInfo());

  // ghosts at FAQ (must be GONE)
  await setPos(page, points.faq);
  const faqBox = await page.evaluate(() => window.__SCENE_DEBUG__.getObjectScreenBox());
  report.ghostsAtFaq = { visible: faqBox.opacity };

  // sky RGB hero vs kontakt (mean of sky-only strips)
  const heroMean = await meanRgb(page, shots[0].path);
  await setPos(page, points.kontakt);
  await page.screenshot({ path: `${OUT}/d-kontakt-rgb.png` });
  const kontaktMean = await meanRgb(page, `${OUT}/d-kontakt-rgb.png`);
  report.skyMeanRgb = { hero: heroMean, kontakt: kontaktMean };

  // axe over the 6 points
  let axeBad = 0;
  for (const name of Object.keys(points)) {
    await setPos(page, points[name]);
    const r = await new AxeBuilder({ page }).analyze();
    const sev = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    if (sev.length) { axeBad += sev.length; report['axe_' + name] = sev.map((v) => v.id + ' x' + v.nodes.length); }
  }
  report.axeSeriousCritical = axeBad;

  report.hScroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  report.consoleErrors = errors.length ? errors : 'none';
  await ctx.close();

  // --- Mobile ---
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mpage = await mctx.newPage();
  await mpage.goto(BASE, { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(3000);
  const mpoints = await computePoints(mpage);
  const mshots = await capture(mpage, mpoints, 'm');
  await mosaic(browser, mshots, 'mobile');
  await mctx.close();

  await browser.close();
  writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
};

run();
