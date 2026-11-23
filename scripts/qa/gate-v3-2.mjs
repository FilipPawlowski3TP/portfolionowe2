// VISUAL PATCH v3 — Krok 2 gate (G2) evidence:
//   - hero states 0/25/50/75/100% (§4 drift + curtain), two viewports,
//   - no visual jump at the pin release (hero-foot continuity probe),
//   - reduced-motion and no-JS fallbacks: H1 fully visible, nothing hidden,
//   - zero page console errors.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4321/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/visual-patch-v3';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'mobile', w: 390, h: 844 },
];
const SCROLLS = [0, 0.25, 0.5, 0.75, 1];

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { states: {} };
  let cells = '';

  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const shots = [];
    for (const f of SCROLLS) {
      await page.evaluate((val) => window.scrollTo(0, val * (document.documentElement.scrollHeight - innerHeight)), f);
      await page.waitForTimeout(1000); // settle: heading reveals finish in frame
      const path = `${OUT}/k2-${v.name}-${String(f * 100).padStart(3, '0')}.png`;
      await page.screenshot({ path });
      shots.push({ label: `${Math.round(f * 100)}%`, path });
    }
    cells += `<figure><figcaption>${v.name} ${v.w}x${v.h}</figcaption><div class="row">`;
    cells += shots.map((s) => `<div><p>${s.label}</p><img src="data:image/png;base64,${readFileSync(s.path).toString('base64')}" /></div>`).join('');
    cells += '</div></figure>';
    report.states[v.name] = { consoleErrors: errors.slice(0, 5) };
    await ctx.close();
  }

  // Pin-release continuity: the hero foot must move continuously (no jump)
  // across the unpin boundary.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const ys = [];
    for (let s = 800; s <= 1120; s += 10) {
      await page.evaluate((val) => window.scrollTo(0, val), s);
      await page.waitForTimeout(120);
      ys.push(await page.evaluate(() => Math.round(document.querySelector('.hero__latest').getBoundingClientRect().top)));
    }
    let maxStep = 0;
    for (let i = 1; i < ys.length; i++) maxStep = Math.max(maxStep, Math.abs(ys[i] - ys[i - 1]));
    report.unpin = { footTopByScroll: ys, maxStepPx: maxStep, pass: maxStep < 40 };
    await ctx.close();
  }

  // Reduced-motion fallback: H1 visible, content complete.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    report.reducedMotion = await page.evaluate(() => {
      const h1 = document.querySelector('.hero__h1');
      return { h1Opacity: getComputedStyle(h1).opacity, text: h1.textContent.trim().length > 10, htmlClass: document.documentElement.className };
    });
    await ctx.close();
  }

  // No-JS fallback: H1 visible, CTAs + phone present.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'load' });
    report.noJs = await page.evaluate(() => {
      const h1 = document.querySelector('.hero__h1');
      return {
        h1Visible: !!h1 && getComputedStyle(h1).opacity === '1',
        h1Text: h1 ? h1.textContent.trim().length > 10 : false,
        ctas: [...document.querySelectorAll('.hero__ctas a')].map((a) => a.textContent.trim()),
        bodyText: document.body.innerText.length,
      };
    });
    await ctx.close();
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
  await mp.screenshot({ path: `${OUT}/mosaic-k2.png`, fullPage: true });
  await mp.context().close();
  await browser.close();

  writeFileSync(`${OUT}/gate2-report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
};

run();
