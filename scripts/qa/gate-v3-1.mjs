// VISUAL PATCH v3 — Krok 1 gate (G1) evidence:
//   - mosaics at 1440x900, 390x844, 2560x1440 (5 scroll states each),
//   - axe serious/critical = 0 (includes colour contrast >= 4.5:1 checks),
//   - skip link invisible without focus, visible on keyboard focus (§2.1),
//   - zero page console errors.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4321/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/visual-patch-v3';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'mobile', w: 390, h: 844 },
  { name: 'wide', w: 2560, h: 1440 },
];
const SCROLLS = [0, 0.25, 0.5, 0.75, 1];

const mosaic = async (browser, name, w, h) => {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const shots = [];
  for (const f of SCROLLS) {
    await page.evaluate((v) => window.scrollTo(0, v * (document.documentElement.scrollHeight - window.innerHeight)), f);
    await page.waitForTimeout(1000); // settle: heading reveals finish in frame
    const path = `${OUT}/k1-${name}-${String(f * 100).padStart(3, '0')}.png`;
    await page.screenshot({ path });
    shots.push({ label: `${Math.round(f * 100)}%`, path });
  }

  // §2.1 skip link: hidden until keyboard focus.
  await page.evaluate(() => window.scrollTo(0, 0));
  const skipHidden = await page.evaluate(() => {
    const r = document.querySelector('.skip-link').getBoundingClientRect();
    return r.width <= 4 && r.height <= 4;
  });
  await page.keyboard.press('Tab');
  const skipFocused = await page.evaluate(() => {
    const el = document.querySelector('.skip-link');
    const r = el.getBoundingClientRect();
    return document.activeElement === el && r.width > 40;
  });

  const axeRes = await new AxeBuilder({ page }).analyze();
  const serious = axeRes.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} x${v.nodes.length}`);

  await page.context().close();
  return { shots, skipHidden, skipFocused, axeSeriousCritical: serious, consoleErrors: errors.slice(0, 5) };
};

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = {};
  let cells = '';

  for (const v of VIEWPORTS) {
    report[v.name] = await mosaic(browser, v.name, v.w, v.h);
    cells += `<figure><figcaption>${v.name} ${v.w}x${v.h}</figcaption><div class="row">`;
    cells += report[v.name].shots
      .map((s) => `<div><p>${s.label}</p><img src="data:image/png;base64,${readFileSync(s.path).toString('base64')}" /></div>`)
      .join('');
    cells += '</div></figure>';
  }

  const mp = await (await browser.newContext({ viewport: { width: 1800, height: 800 } })).newPage();
  await mp.setContent(`<style>
    body { margin: 0; background: #222; padding: 8px; font: 13px sans-serif; color: #fff; }
    figure { margin: 0 0 12px; }
    figcaption { padding: 4px 0; font-weight: 700; }
    .row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
    .row div p { margin: 2px 0; }
    .row img { width: 100%; display: block; border: 1px solid #444; }
  </style>${cells}`);
  await mp.waitForTimeout(1200);
  await mp.screenshot({ path: `${OUT}/mosaic-k1.png`, fullPage: true });
  await mp.context().close();
  await browser.close();

  writeFileSync(`${OUT}/gate1-report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
};

run();
