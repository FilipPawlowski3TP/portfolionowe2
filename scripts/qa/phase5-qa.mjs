// Phase 5 QA: WebGL scene tiers, budgets, key-moment screenshots.
// Requires a PUBLIC_QA=1 build (enables ?tier= and __SCENE_DEBUG__).
// Run: node scripts/qa/phase5-qa.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.QA_URL ?? 'http://127.0.0.1:4321/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/phase5';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
let failures = 0;
const fail = (m) => {
  failures++;
  console.log('FAIL:', m);
};
const ok = (m) => console.log('ok:', m);

// --- Tier 2: full scene, budgets, key moments ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pl-PL' });
  const page = await ctx.newPage();
  const errors = [];
  const warnings = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 200));
    if (m.type() === 'warning') warnings.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));

  await page.goto(`${URL}?tier=2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // load -> idle -> import -> first frame

  const live = await page.evaluate(() => document.getElementById('scene-root')?.classList.contains('scene-live'));
  live ? ok('scene-live crossfade class set') : fail('scene never went live');

  const canvas = await page.evaluate(() => {
    const c = document.querySelector('#scene-root canvas');
    return c ? { w: c.width, h: c.height } : null;
  });
  canvas && canvas.w > 0 ? ok(`canvas present ${canvas.w}x${canvas.h}`) : fail('no canvas');

  const info = await page.evaluate(() => window.__SCENE_DEBUG__?.getRenderInfo?.());
  info
    ? info.calls <= 40 && info.triangles <= 150000 && info.particles <= 3500 && info.dpr <= 1.75
      ? ok(`budgets OK: ${JSON.stringify(info)}`)
      : fail(`budget exceeded: ${JSON.stringify(info)}`)
    : fail('no __SCENE_DEBUG__ (build without PUBLIC_QA?)');

  // Key scroll moments (via debug setter for deterministic captures)
  for (const [name, p] of [['hero', 0.02], ['offer', 0.3], ['case', 0.58], ['contact', 0.97]]) {
    await page.evaluate((v) => window.__SCENE_DEBUG__.setProgress(v), p);
    await page.waitForTimeout(1200); // let the lerp settle
    await page.screenshot({ path: `${OUT}/t2-${name}.png` });
  }
  ok('captured t2 hero/offer/case/contact');

  errors.length === 0 ? ok('no console errors (tier 2)') : fail(`errors: ${errors.join(' | ')}`);
  if (warnings.length) console.log('warnings:', warnings.slice(0, 3).join(' | '));
  await ctx.close();
}

// --- Tier 1: lighter scene ---
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  await page.goto(`${URL}?tier=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => window.__SCENE_DEBUG__?.getRenderInfo?.());
  const live = await page.evaluate(() => document.getElementById('scene-root')?.classList.contains('scene-live'));
  info && info.particles <= 600 && info.dpr === 1 && live
    ? ok(`tier 1 OK: ${JSON.stringify(info)}`)
    : fail(`tier 1: ${JSON.stringify(info)} live=${live}`);
  errors.length === 0 ? ok('no console errors (tier 1)') : fail(`tier 1 errors: ${errors.join(' | ')}`);
  await ctx.close();
}

// --- Tier 0: static fallback, no canvas ---
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${URL}?tier=0`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const state = await page.evaluate(() => ({
    canvas: !!document.querySelector('#scene-root canvas'),
    tier0: document.getElementById('scene-root')?.classList.contains('scene-tier-0'),
    fallback: !!document.querySelector('.scene-fallback'),
  }));
  !state.canvas && state.fallback
    ? ok(`tier 0 OK: ${JSON.stringify(state)}`)
    : fail(`tier 0: ${JSON.stringify(state)}`);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? 'PHASE5 QA: ALL PASS' : `PHASE5 QA: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
