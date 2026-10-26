// End-to-end run in headless Chromium: plays full quizzes on sample answers,
// checks the numbers, failure cases, both themes and phone width, and saves
// screenshots for the README. Run: node tests/e2e.mjs
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { SCENARIOS, SKILLS } from '../src/content.js';
import { toScore, overall, encodeShare } from '../src/quiz.js';

const PORT = 8765;
const BASE = `http://localhost:${PORT}/`;
const SHOTS = 'docs/screenshots';
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));

let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? '✔' : '✖'} ${msg}`); if (!ok) failures++; };
const byPrompt = new Map(SCENARIOS.map((s) => [s.prompt, s]));

const browser = await chromium.launch();

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 860 }, deviceScaleFactor: 2, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errors.push(m.text()); });
  return page;
}

// The guess step: pick one band for every skill, or skip with null.
async function guessStep(page, b) {
  await page.waitForSelector('.guess-list');
  if (b === null) return page.click('[data-act="skip-guess"]');
  for (const k of SKILLS) await page.click(`[data-guess="${k.id}"][data-band="${b}"]`);
  await page.keyboard.press('Enter');
}

// Plays a run. strategy(scenario) → original option index to pick.
async function playRun(page, strategy, { shotAt = -1, shotName } = {}) {
  const picks = [];
  const latencies = [];
  for (let q = 0; q < 18; q++) {
    await page.waitForSelector('.prompt');
    const prompt = await page.textContent('.prompt');
    const s = byPrompt.get(prompt.trim());
    if (!s) throw new Error(`Unknown prompt: ${prompt}`);
    const want = strategy(s);
    const texts = await page.$$eval('.opt .txt', (els) => els.map((e) => e.firstChild.textContent));
    const pos = texts.indexOf(s.options[want].text);
    if (q === 0) check(await page.isVisible('.chip.concealed') && !(await page.textContent('#skill-chip')).includes(SKILLS.find((k) => k.id === s.skill).name), 'skill label is hidden before answering');
    const t0 = Date.now();
    await page.keyboard.press(String(pos + 1));
    await page.waitForSelector('#opts.answered');
    latencies.push(Date.now() - t0);
    if (q === 0) check((await page.textContent('#skill-chip')).includes(SKILLS.find((k) => k.id === s.skill).name), 'skill label appears after answering');
    if (q === shotAt) await page.waitForTimeout(300);
    if (q === shotAt) await page.screenshot({ path: `${SHOTS}/${shotName}.png` });
    picks.push(s);
    await page.keyboard.press('Enter');
  }
  await page.waitForSelector('.score-head');
  return { picks, latencies };
}

function expected(picks, strategy) {
  const scores = Object.fromEntries(SKILLS.map((k) => [k.id,
    toScore(picks.filter((s) => s.skill === k.id).reduce((a, s) => a + s.options[strategy(s)].points, 0))]));
  return { scores, overall: overall(scores) };
}

const best = (s) => s.options.findIndex((o) => o.points === 3);
const worst = (s) => s.options.findIndex((o) => o.points === Math.min(...s.options.map((x) => x.points)));
const weakCheck = (s) => (s.skill === 'check' ? worst(s) : best(s));

// ── Light mode, desktop ──────────────────────────────────────
{
  const page = await newPage({ colorScheme: 'light' });
  await page.goto(BASE);
  await page.waitForSelector('.hero');
  await page.waitForTimeout(300);
  check(await page.isVisible('text=The six skills'), 'home renders with skills grid');
  await page.screenshot({ path: `${SHOTS}/home-light.png` });

  await page.keyboard.press('Enter');
  await page.waitForSelector('.guess-list');
  check(await page.isDisabled('[data-act="guess-done"]'), 'guess step: Start is disabled until all six are picked');
  await page.click('[data-guess="explain"][data-band="Solid"]');
  await page.reload();
  await page.waitForSelector('.guess-list');
  check(await page.getAttribute('[data-guess="explain"][data-band="Solid"]', 'aria-checked') === 'true', 'a guess survives reload');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/guess-light.png` });
  await guessStep(page, 'Strong');
  const { picks, latencies } = await playRun(page, weakCheck, { shotAt: 2, shotName: 'quiz-light' });
  const exp = expected(picks, weakCheck);
  const shown = Number((await page.textContent('.big')).match(/\d+/)[0]);
  check(shown === exp.overall, `result shows overall ${shown}, expected ${exp.overall}`);
  check((await page.textContent('.focus-card .chip')).includes('Checking understanding'), 'weakest skill is Checking understanding');
  check(new Set(picks.map((s) => s.id)).size === 18, '18 distinct scenarios in run 1');
  const checkRow = await page.textContent('.calib-row.over');
  check(checkRow.includes('Checking understanding') && checkRow.includes('Over-confident · 2 bands'), 'calibration: guessed Strong on Checking, scored Start here → over-confident by 2 bands');
  check((await page.$$('.calib-row.even')).length === 5, 'calibration: the five all-best skills are calibrated');
  const maxLat = Math.max(...latencies);
  check(maxLat < 100, `answer feedback appears in under 100 ms (max ${maxLat} ms, median ${latencies.sort((a, b) => a - b)[9]} ms, incl. test overhead)`);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${SHOTS}/result-light.png`, fullPage: true });

  // Self-check persists
  await page.check('[data-check="check:0"]');
  await page.reload();
  check(await page.isChecked('[data-check="check:0"]'), 'self-check tick survives reload');

  // Review list
  await page.click('details.review summary');
  check((await page.$$('.review-item')).length === 18, 'review lists all 18 answers');

  // Share link round-trip
  await page.goto(`${BASE}#/r/${encodeShare(exp.scores)}`);
  await page.waitForSelector('.score-head');
  check((await page.textContent('.big')).includes(String(exp.overall)), 'share link shows the same overall score');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${SHOTS}/shared-light.png` });

  // Bad share link
  await page.goto(`${BASE}#/r/50-50-oops`);
  check(await page.isVisible('text=doesn\'t hold a valid result'), 'bad share link shows a friendly error');

  // Retake prefers unseen scenarios
  await page.goto(`${BASE}#/result`);
  await page.click('[data-act="start"]');
  const run2 = await page.evaluate(() => JSON.parse(localStorage.getItem('hgats.v1')).inProgress.items.map((i) => i.id));
  check(run2.every((id) => !picks.some((s) => s.id === id)), 'retake draws 18 unseen scenarios');

  // Resume after leaving mid-quiz
  await guessStep(page, null);
  await page.waitForSelector('.prompt');
  await page.keyboard.press('1'); await page.keyboard.press('Enter');
  await page.keyboard.press('2'); await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await page.reload();
  check(await page.isVisible('text=Resume, question 3 of 18'), 'progress resumes at question 3 after reload');

  // Method page with KaTeX
  await page.goto(`${BASE}#/method`);
  await page.waitForSelector('.katex', { timeout: 5000 }).catch(() => {});
  check((await page.$$('.eq .katex')).length === 4, 'four equations typeset by KaTeX');
  await page.screenshot({ path: `${SHOTS}/method-light.png` });

  // Settings via ⌘,
  await page.keyboard.press('Meta+Comma');
  check(await page.isVisible('#settings[open]'), '⌘, opens settings');
  await page.click('[data-theme-set="dark"]');
  check(await page.getAttribute('html', 'data-theme') === 'dark', 'theme switch applies dark');
  await page.screenshot({ path: `${SHOTS}/settings-dark.png` });
  await page.click('[data-theme-set="system"]');
  await page.keyboard.press('Escape');

  // Feedback tab
  await page.click('#open-feedback');
  check(await page.isVisible('#feedback[open] textarea'), 'feedback tab opens its form');
  await page.keyboard.press('Escape');

  // Explain-after-each off: auto-advance
  await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('hgats.v1')); d.prefs.explainAfterEach = false; d.inProgress = null; localStorage.setItem('hgats.v1', JSON.stringify(d)); });
  await page.goto(`${BASE}#/quiz`); await page.reload();
  await guessStep(page, null);
  await page.waitForSelector('.prompt');
  await page.keyboard.press('1');
  await page.waitForFunction(() => document.querySelector('.progress span')?.textContent.startsWith('2 /'));
  check(true, 'with explanations off, answering advances on its own');

  // Corrupt storage
  for (const bad of ['not json{{', '[]', '{"history":[null],"inProgress":{"items":3}}']) {
    await page.evaluate((v) => localStorage.setItem('hgats.v1', v), bad);
    await page.goto(BASE); await page.reload();
    check(await page.isVisible('.hero'), `home survives corrupt storage: ${bad}`);
  }
  check(page.errors.length === 0, `no page errors in light run${page.errors.length ? ': ' + page.errors.join(' | ') : ''}`);
}

// ── Dark mode ────────────────────────────────────────────────
{
  const page = await newPage({ colorScheme: 'dark' });
  await page.goto(BASE);
  await page.waitForSelector('.hero');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check(bg === 'rgb(23, 21, 19)', `dark background applied (${bg})`);
  await page.screenshot({ path: `${SHOTS}/home-dark.png` });
  await page.keyboard.press('Enter');
  await page.waitForSelector('.guess-list');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/guess-dark.png` });
  await guessStep(page, null);
  const { picks } = await playRun(page, best, { shotAt: 4, shotName: 'quiz-dark' });
  check((await page.textContent('.big')).startsWith('100'), 'all-best run scores 100');
  check(await page.isVisible('text=You skipped the guess'), 'skipped guess: result explains there is nothing to compare');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${SHOTS}/result-dark.png`, fullPage: true });
  await page.goto(`${BASE}#/method`);
  await page.waitForSelector('.katex');
  await page.screenshot({ path: `${SHOTS}/method-dark.png` });
  check(page.errors.length === 0, 'no page errors in dark run');
  void picks;
}

// ── Phone width ──────────────────────────────────────────────
{
  const page = await newPage({ viewport: { width: 375, height: 812 }, colorScheme: 'light', isMobile: true, hasTouch: true });
  for (const route of ['', '#/quiz', '#/method', '#/r/67-100-33-56-78-89']) {
    await page.goto(BASE + route);
    await page.waitForTimeout(300);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(over <= 0, `no horizontal scroll at 375px on ${route || 'home'} (${over}px)`);
  }
  await page.goto(BASE + '#/quiz');
  await page.waitForSelector('.guess-list');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/guess-phone.png` });
  await guessStep(page, 'Solid');
  await page.waitForSelector('.opt');
  await page.tap('.opt');
  await page.waitForSelector('#opts.answered');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/quiz-phone.png` });
  await page.goto(BASE + '#/r/67-100-33-56-78-89');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${SHOTS}/shared-phone.png` });
  check(page.errors.length === 0, 'no page errors on phone');
}

await browser.close();
server.kill();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll end-to-end checks passed');
process.exit(failures ? 1 : 0);
