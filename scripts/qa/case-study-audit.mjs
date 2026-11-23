// Case-study audit script — koparkapawlowski.pl (Phase 0 of MASTERPROMPT)
// Uses system Edge via playwright-core channel 'msedge'.
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const PROJECT = 'C:/Users/karolina/Desktop/PortfolioClaud';
const MEDIA = `${PROJECT}/public/media`;
const OUT = `${PROJECT}/docs/audit`;
mkdirSync(MEDIA, { recursive: true });
mkdirSync(OUT, { recursive: true });

const URL = 'https://koparkapawlowski.pl/';

const collectPageData = async (page) => page.evaluate(() => {
  const meta = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) ?? null;
  const metas = {};
  for (const m of document.querySelectorAll('meta')) {
    const key = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('http-equiv');
    if (key) metas[key] = m.getAttribute('content');
  }
  const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({
    level: h.tagName, text: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
  }));
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => { try { return JSON.parse(s.textContent); } catch { return s.textContent.slice(0, 300); } });
  const links = [...document.querySelectorAll('a[href]')].map(a => a.href);
  const imgs = [...document.querySelectorAll('img')].map(i => ({
    src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight,
    lazy: i.loading === 'lazy',
  }));
  const sections = [...document.querySelectorAll('section, header, footer, nav, main')].map(s => ({
    tag: s.tagName.toLowerCase(), id: s.id || null,
    heading: s.querySelector('h1,h2,h3')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || null,
  }));
  const resources = performance.getEntriesByType('resource').map(r => ({
    name: r.name.split('?')[0], type: r.initiatorType,
    transferSize: r.transferSize, decodedBodySize: r.decodedBodySize,
  }));
  return {
    url: location.href,
    lang: document.documentElement.lang,
    title: document.title,
    titleLen: document.title.length,
    description: meta('meta[name="description"]'),
    descLen: (meta('meta[name="description"]') || '').length,
    canonical: meta('link[rel="canonical"]', 'href'),
    robots: meta('meta[name="robots"]'),
    metas, headings, jsonld, imgs, sections,
    linksTotal: links.length,
    internalLinks: links.filter(l => l.includes('koparkapawlowski.pl')),
    externalLinks: [...new Set(links.filter(l => !l.includes('koparkapawlowski.pl') && l.startsWith('http')))],
    telLinks: links.filter(l => l.startsWith('tel:')),
    mailLinks: links.filter(l => l.startsWith('mailto:')),
    resourcesCount: resources.length,
    resourcesByType: resources.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {}),
    externalRequestDomains: [...new Set(resources.filter(r => !r.name.includes('koparkapawlowski.pl')).map(r => new URL(r.name).hostname))],
    totalTransfer: resources.reduce((s, r) => s + (r.transferSize || 0), 0),
    resources: resources.slice(0, 100),
    viewport: { w: innerWidth, h: innerHeight },
    docHeight: document.documentElement.scrollHeight,
    fonts: [...new Set(performance.getEntriesByType('resource').filter(r => /\.(woff2?|ttf|otf)/.test(r.name)).map(r => r.name.split('/').pop()))],
  };
});

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = { url: URL, auditedAt: new Date().toISOString(), runs: {} };

  for (const cfg of [
    { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, dsf: 1 },
    { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, dsf: 2 },
  ]) {
    const context = await browser.newContext({
      viewport: cfg.viewport, isMobile: cfg.isMobile, hasTouch: cfg.hasTouch, deviceScaleFactor: cfg.dsf,
      locale: 'pl-PL',
    });
    const page = await context.newPage();
    const consoleMsgs = [];
    const failedReqs = [];
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
    page.on('requestfailed', r => failedReqs.push(`${r.url().slice(0, 120)} — ${r.failure()?.errorText}`));

    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);

    const data = await collectPageData(page);
    // hero screenshot (viewport only)
    await page.screenshot({ path: `${MEDIA}/case-${cfg.name}-hero.png` });
    // full-page screenshot
    await page.screenshot({ path: `${MEDIA}/case-${cfg.name}-full.png`, fullPage: true });

    const cookies = await context.cookies();
    report.runs[cfg.name] = {
      ...data,
      consoleErrors: consoleMsgs,
      failedRequests: failedReqs,
      cookies: cookies.map(c => ({ name: c.name, domain: c.domain, expires: c.expires, session: c.session })),
    };
    await context.close();
    console.log(`[${cfg.name}] done — ${data.resourcesCount} resources, ${data.docHeight}px doc height`);
  }

  // www vs apex canonical check (lightweight fetch of the HTML)
  const check = await browser.newContext();
  const p = await check.newPage();
  const variants = {};
  for (const u of ['https://koparkapawlowski.pl/', 'https://www.koparkapawlowski.pl/', 'http://koparkapawlowski.pl/']) {
    try {
      const resp = await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 });
      variants[u] = {
        status: resp.status(),
        finalUrl: p.url(),
        canonical: await p.evaluate(() => document.querySelector('link[rel="canonical"]')?.href ?? null),
      };
    } catch (e) { variants[u] = { error: String(e).slice(0, 150) }; }
  }
  report.urlVariants = variants;
  await check.close();
  await browser.close();

  writeFileSync(`${OUT}/case-study-audit.json`, JSON.stringify(report, null, 2));
  console.log('AUDIT SAVED:', `${OUT}/case-study-audit.json`);
};

run().catch(e => { console.error('FATAL', e); process.exit(1); });
