// VISUAL RESET v2, Krok 0/2: realization screenshots from the live site.
// Desktop 1440x900 first screen + full page CROPPED to 3150px (= 3.5x vh, §6),
// mobile 390x844 first screen + full page cropped to 2800px. WebP via the
// in-page canvas encoder, saved to public/media/. Budgets (§6): thumb <= 80 KB,
// full <= 450 KB. Reported dims are checked against the intended ones.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL = 'https://koparkapawlowski.pl/';
const OUT = 'C:/Users/karolina/Desktop/PortfolioClaud/public/media';
mkdirSync(OUT, { recursive: true });

// PNG buffer -> WebP via the browser's canvas encoder; returns buffer + dims.
async function toWebp(page, png, { maxW = Infinity, maxH = Infinity, startQ = 0.82 }) {
  const b64 = png.toString('base64');
  for (let q = startQ; q >= 0.4; q -= 0.08) {
    const out = await page.evaluate(
      async ({ b64, maxW, maxH, q }) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + b64;
        await img.decode();
        const scale = Math.min(1, maxW / img.width, maxH / img.height);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return { data: c.toDataURL('image/webp', q).split(',')[1], w: c.width, h: c.height };
      },
      { b64, maxW, maxH, q },
    );
    const buf = Buffer.from(out.data, 'base64');
    if (buf.length <= 460_000 || q <= 0.4) return { buf, q, w: out.w, h: out.h };
  }
  return { buf: Buffer.alloc(0), q: 0, w: 0, h: 0 };
}

const run = async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];

  for (const dev of [
    { tag: 'desktop', viewport: { width: 1440, height: 900 }, dpr: 2, cropH: 3150 },
    { tag: 'mobile', viewport: { width: 390, height: 844 }, dpr: 2, cropH: 2800 },
  ]) {
    const ctx = await browser.newContext({ viewport: dev.viewport, deviceScaleFactor: dev.dpr });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // 1) first screen -> thumb (desktop: 900px wide per §6; mobile: native)
    const first = await page.screenshot();
    const thumbMaxW = dev.tag === 'desktop' ? 900 : Infinity;
    const thumb = await toWebp(page, first, { maxW: thumbMaxW, startQ: 0.82 });
    writeFileSync(`${OUT}/case-${dev.tag}-thumb.webp`, thumb.buf);

    // 2) full page, CROPPED to the top cropH CSS px (clip, not scale)
    const full = await page.screenshot({
      fullPage: true,
      clip: { x: 0, y: 0, width: dev.viewport.width, height: dev.cropH },
    });
    const fullWebp = await toWebp(page, full, { maxH: dev.cropH * dev.dpr, startQ: 0.75 });
    writeFileSync(`${OUT}/case-${dev.tag}-full.webp`, fullWebp.buf);

    results.push({
      dev: dev.tag,
      thumb: { bytes: thumb.buf.length, q: thumb.q, dims: `${thumb.w}x${thumb.h}` },
      full: {
        bytes: fullWebp.buf.length,
        q: fullWebp.q,
        dims: `${fullWebp.w}x${fullWebp.h}`,
        expect: `${dev.viewport.width * dev.dpr}x${dev.cropH * dev.dpr}`,
      },
    });
    await ctx.close();
  }

  await browser.close();
  writeFileSync(`C:/Users/karolina/Desktop/PortfolioClaud/docs/qa/realization-shots.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
};

run();
