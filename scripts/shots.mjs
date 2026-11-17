// Screenshot helper for visual review.
//   node scripts/shots.mjs <path without leading slash, e.g. dev/hero or index> <name> [--w 1440] [--h 900] [--full] [--motion] [--scroll <px>] [--wait <ms>] [--sel <css>]
// Output: .shots/<name>.png   (also prints console errors from the page)
// By default the page is captured with reduced motion so scroll-triggered content is in its final state.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
// Git Bash rewrites a leading '/' into a Windows path, so accept 'dev/hero' or 'index' and normalise.
let path = (args[0] ?? '').replace(/^[A-Za-z]:[\/].*?Git[\/]?/, '').replace(/^\/+/, '');
if (path === 'index') path = '';
path = '/' + path;
const name = args[1] ?? 'shot';
const flag = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i === -1 ? d : args[i + 1];
};
const has = (k) => args.includes(`--${k}`);

const width = Number(flag('w', 1440));
const height = Number(flag('h', 900));
const base = process.env.SHOT_BASE ?? 'http://localhost:3000';

mkdirSync('.shots', { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: has('motion') ? 'no-preference' : 'reduce',
  isMobile: width < 600,
  hasTouch: width < 600,
});
const page = await context.newPage();
const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error') problems.push(`console.error: ${m.text()}`);
});
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));

await page.goto(base + path, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const scroll = Number(flag('scroll', 0));
if (scroll) await page.evaluate((y) => window.scrollTo(0, y), scroll);
await page.waitForTimeout(Number(flag('wait', 900)));

const sel = flag('sel', null);
const file = `.shots/${name}.png`;
if (sel) await page.locator(sel).first().screenshot({ path: file });
else await page.screenshot({ path: file, fullPage: has('full') });

const overflow = await page.evaluate(() => {
  const w = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > w + 1 || r.left < -1)) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed') continue;
      bad.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} [${Math.round(r.left)}..${Math.round(r.right)}]`);
    }
    if (bad.length >= 8) break;
  }
  return { scrollW: document.documentElement.scrollWidth, clientW: w, bad };
});

console.log(`saved ${file} (${width}x${height})`);
if (overflow.scrollW > overflow.clientW) console.log(`HORIZONTAL SCROLL: ${overflow.scrollW} > ${overflow.clientW}`);
if (overflow.bad.length) console.log('elements past viewport edge (may be intentional if clipped):\n  ' + overflow.bad.join('\n  '));
if (problems.length) console.log(problems.join('\n'));
await browser.close();
