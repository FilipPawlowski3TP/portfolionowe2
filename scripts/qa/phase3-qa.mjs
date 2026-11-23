// Phase 3 QA: responsive screenshots, horizontal-scroll check, axe-core scan.
// Run: node scripts/qa/phase3-qa.mjs (expects `npx astro preview` on :4321)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.QA_URL ?? 'http://127.0.0.1:4321/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/phase3';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 360, h: 800 },
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 800 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, locale: 'pl-PL' });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 150));
  });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Force lazy images to load before the full-page screenshot (otherwise
  // below-the-fold images render as empty frames in stitched captures).
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.documentElement.scrollHeight) setTimeout(step, 120);
        else {
          window.scrollTo(0, 0);
          resolve();
        }
      };
      step();
    });
  });
  await page.waitForLoadState('networkidle');
  const brokenImgs = await page.evaluate(() =>
    [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc),
  );

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    docHeight: document.documentElement.scrollHeight,
    h1: document.querySelectorAll('h1').length,
    title: document.title,
  }));

  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const bad = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact));

  await page.screenshot({ path: `${OUT}/w${vp.w}.png`, fullPage: true });

  report.push({
    viewport: vp,
    horizontalScroll: metrics.scrollWidth > metrics.innerWidth,
    ...metrics,
    brokenImgs,
    seriousViolations: bad.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
    consoleErrors,
  });
  console.log(
    `w${vp.w}: hScroll=${metrics.scrollWidth > metrics.innerWidth} (${metrics.scrollWidth}>${metrics.innerWidth}) axe-serious/critical=${bad.length} console-errors=${consoleErrors.length} broken-imgs=${brokenImgs.length} h1=${metrics.h1}`,
  );
  await context.close();
}

const { writeFileSync } = await import('node:fs');
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log('QA saved to', OUT);
