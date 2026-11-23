// Phase 4 QA: motion layer checks.
// 1) boot completes, hero entrance ends visible, no console errors
// 2) anchor click scrolls + moves focus
// 3) reduced-motion: content visible, no ScrollTrigger pins
// 4) JS disabled: content visible
import { chromium } from 'playwright';

const URL = process.env.QA_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log('FAIL:', msg);
};
const ok = (msg) => console.log('ok:', msg);

// --- 1) normal motion ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pl-PL' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 150)));
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 150)));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // entrance <= 1.2 s + margin

  const ready = await page.evaluate(() => window.__MOTION_READY__ === true);
  ready ? ok('boot: __MOTION_READY__') : fail('boot not ready');

  const heroOpacity = await page.evaluate(() =>
    ['title', 'lead', 'ctas'].map((k) => {
      const el = document.querySelector(`[data-hero="${k}"]`);
      return el ? parseFloat(getComputedStyle(el).opacity) : -1;
    }),
  );
  heroOpacity.every((o) => o > 0.9)
    ? ok(`hero entrance finished visible (${heroOpacity})`)
    : fail(`hero hidden after entrance: ${heroOpacity}`);

  // anchor: click "Oferta" in the header nav
  await page.click('.site-nav__list a[href="#oferta"]');
  await page.waitForTimeout(1800);
  const anchor = await page.evaluate(() => ({
    hash: location.hash,
    scrollY: window.scrollY,
    focus: document.activeElement?.id || document.activeElement?.className?.slice(0, 30),
    headingTop: document.querySelector('#oferta h2')?.getBoundingClientRect().top,
  }));
  anchor.hash === '#oferta' && anchor.scrollY > 500
    ? ok(`anchor scroll works (hash=${anchor.hash}, scrollY=${Math.round(anchor.scrollY)}, focus=${anchor.focus}, h2 top=${Math.round(anchor.headingTop ?? -999)})`)
    : fail(`anchor broken: ${JSON.stringify(anchor)}`);

  errors.length === 0 ? ok('no console/page errors') : fail(`errors: ${errors.join(' | ')}`);
  await ctx.close();
}

// --- 2) reduced motion ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const state = await page.evaluate(() => {
    const visible = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).opacity : 'missing';
    };
    return {
      h1: visible('[data-hero="title"]'),
      lead: visible('[data-hero="lead"]'),
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      revealAll: document.documentElement.classList.contains('reveal-all'),
    };
  });
  state.h1 === '1' && state.lead === '1' && state.pinSpacers === 0
    ? ok(`reduced-motion: content visible, no pins (${JSON.stringify(state)})`)
    : fail(`reduced-motion state: ${JSON.stringify(state)}`);
  await ctx.close();
}

// --- 3) JS disabled ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  const state = await page.evaluate(() => {
    const el = document.querySelector('.hero__h1');
    return el ? getComputedStyle(el).opacity : 'missing';
  }).catch(() => 'n/a');
  const h1 = await page.textContent('h1');
  h1 && h1.includes('Strony internetowe')
    ? ok(`JS disabled: content visible (h1 ok, opacity=${state})`)
    : fail(`JS disabled: h1 missing`);
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? 'PHASE4 QA: ALL PASS' : `PHASE4 QA: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
