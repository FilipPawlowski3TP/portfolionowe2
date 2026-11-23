// Fails the production build when the output contains unfinished placeholders.
// Usage: node scripts/check-placeholders.mjs (run after `astro build`)
// Scans dist/**/*.{html,xml,txt,json} per MASTERPROMPT annex D.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const EXTENSIONS = new Set(['.html', '.xml', '.txt', '.json']);
const PATTERNS = [
  { name: 'TODO_', re: /TODO_/i },
  { name: '{{', re: /\{\{|\%7B\%7B/i },
  { name: 'lorem ipsum', re: /lorem ipsum/i },
  { name: 'example.com', re: /example\.com/i },
];

const offenders = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(extname(entry))) {
      const content = readFileSync(full, 'utf8');
      for (const p of PATTERNS) {
        const m = content.match(p.re);
        if (m) {
          const line = content.slice(0, m.index).split('\n').length;
          offenders.push(`${relative(DIST, full)}:${line} — ${p.name}`);
        }
      }
    }
  }
}

try {
  walk(DIST);
} catch (e) {
  console.error(`check-placeholders: cannot read dist/ (${e.message}). Run \`astro build\` first.`);
  process.exit(1);
}

if (offenders.length > 0) {
  console.error('check-placeholders: FAILED — placeholders found in dist/:');
  for (const o of offenders) console.error('  ' + o);
  process.exit(1);
}

console.log('check-placeholders: OK — no placeholders in dist/.');
