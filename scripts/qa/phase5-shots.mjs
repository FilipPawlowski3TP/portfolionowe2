// Phase 5 G2 capture: key scroll moments at REAL scroll positions + axe over
// the live scene + mobile tier budget. Run: node scripts/qa/phase5-shots.mjs
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.QA_URL ?? 'http://127.0.0.1:4321/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/phase5';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// --- Desktop key moments ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pl-PL' });
  const page = await ctx.newPage();
  await page.goto(`${URL}?tier=2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const stops = [
    ['hero', 0],
    ['oferta', null, '#oferta'],
    ['proces', null, '#proces'],
    ['case', null, '#realizacje'],
    ['kontakt', null, '#kontakt'],
  ];

  for (const [name, y, selector] of stops) {
    await page.evaluate(
      ({ y, selector }) => {
        const target = selector ? document.querySelector(selector) : null;
        window.scrollTo(0, target ? target.getBoundingClientRect().top + window.scrollY - 80 : y);
      },
      { y, selector },
    );
    await page.waitForTimeout(1600); // scene lerp settle
    await page.screenshot({ path: `${OUT}/g2-${name}.png` });

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const bad = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    console.log(`axe @${name}: serious/critical=${bad.length} ${bad.map((v) => v.id).join(',')}`);
  }
  await ctx.close();
}

// --- Mobile tier 2 budgets ---
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: 'pl-PL',
  });
  const page = await ctx.newPage();
  await page.goto(`${URL}?tier=2`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  const info = await page.evaluate(() => window.__SCENE_DEBUG__?.getRenderInfo?.());
  const coarse = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
  console.log(
    `mobile tier2: ${JSON.stringify(info)} (pointer:coarse=${coarse})`,
    info && info.particles <= 1500 && info.dpr <= 1.25 ? '-> BUDGET OK' : '-> BUDGET FAIL',
  );
  await page.screenshot({ path: `${OUT}/g2-mobile-hero.png` });
  await ctx.close();
}

await browser.close();
console.log('done');
