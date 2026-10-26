import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, SCENARIOS } from '../src/content.js';
import { drawRun, scoreRun, toScore, band, weakest, encodeShare, decodeShare, overall } from '../src/quiz.js';
import { sanitize, defaults } from '../src/store.js';
import { allBest, allWorst, mixed, corruptStorage, badShareCodes } from './fixtures.js';

// Small seeded RNG (mulberry32) so runs are reproducible.
const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

test('drawRun gives 18 items, 3 per skill, one per slot, options a permutation', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const run = drawRun([], rng(seed));
    assert.equal(run.length, 18);
    const s = run.map((i) => SCENARIOS.find((x) => x.id === i.id));
    for (const k of SKILLS) for (const slot of [1, 2, 3]) {
      assert.equal(s.filter((x) => x.skill === k.id && x.slot === slot).length, 1);
    }
    for (const i of run) assert.deepEqual([...i.order].sort(), [0, 1, 2, 3]);
  }
});

test('second run prefers unseen variants: two runs cover all 36', () => {
  const first = drawRun([], rng(7));
  const second = drawRun(first.map((i) => i.id), rng(8));
  assert.equal(new Set([...first, ...second].map((i) => i.id)).size, 36);
});

test('when every variant has been seen, it still draws a full run', () => {
  assert.equal(drawRun(SCENARIOS.map((s) => s.id), rng(3)).length, 18);
});

test('questions are interleaved, not grouped by skill', () => {
  const run = drawRun([], rng(11)).map((i) => i.id.split('-')[0]);
  const grouped = run.every((k, i) => i === 0 || k === run[i - 1] || !run.slice(0, i).includes(k));
  assert.equal(grouped, false);
});

test('scoring: all best = 100; worst and mixed match hand-computed points', () => {
  const run = drawRun([], rng(5));
  assert.equal(scoreRun(run, allBest).overall, 100);
  const expect = (answers) => Object.fromEntries(SKILLS.map((k) => {
    const pts = run.map((i) => SCENARIOS.find((s) => s.id === i.id))
      .filter((s) => s.skill === k.id).reduce((a, s) => a + s.options[answers[s.id]].points, 0);
    return [k.id, Math.round((100 * pts) / 9)];
  }));
  for (const answers of [allWorst, mixed]) {
    const r = scoreRun(run, answers);
    assert.deepEqual(r.scores, expect(answers));
    assert.equal(r.overall, overall(r.scores));
  }
  assert.ok(scoreRun(run, allWorst).overall <= 20, 'all-worst should score very low');
});

test('unanswered and invalid picks count as 0 points', () => {
  const run = drawRun([], rng(9));
  assert.equal(scoreRun(run, {}).overall, 0);
  assert.equal(scoreRun(run, Object.fromEntries(run.map((i) => [i.id, 9]))).overall, 0);
});

test('toScore rounds 5/9 to 56 (worked example on the method page)', () => {
  assert.equal(toScore(5), 56);
  assert.equal(toScore(9), 100);
});

test('bands: 44 Start here, 45 Solid, 77 Solid, 78 Strong', () => {
  assert.equal(band(0).name, 'Start here');
  assert.equal(band(44).name, 'Start here');
  assert.equal(band(45).name, 'Solid');
  assert.equal(band(77).name, 'Solid');
  assert.equal(band(78).name, 'Strong');
  assert.equal(band(100).name, 'Strong');
});

test('weakest: lowest score, ties go to the first skill listed', () => {
  const s = Object.fromEntries(SKILLS.map((k) => [k.id, 67]));
  assert.equal(weakest(s).id, 'explain');
  s.feedback = 33; s.practice = 33;
  assert.equal(weakest(s).id, 'feedback');
});

test('share codec round-trips and rejects bad codes', () => {
  const scores = { explain: 67, examples: 100, check: 33, feedback: 56, practice: 78, difficulty: 89 };
  const code = encodeShare(scores);
  assert.equal(code, '67-100-33-56-78-89');
  assert.deepEqual(decodeShare(code), { scores, overall: overall(scores) });
  for (const bad of badShareCodes) assert.equal(decodeShare(bad), null, `"${bad}"`);
  assert.equal(decodeShare(undefined), null);
});

test('store.sanitize survives corrupt data', () => {
  for (const raw of corruptStorage) {
    let parsed; try { parsed = JSON.parse(raw); } catch { parsed = undefined; }
    const d = sanitize(parsed);
    assert.ok(Array.isArray(d.seen) && Array.isArray(d.history));
    assert.equal(d.inProgress, null);
    assert.equal(typeof d.prefs.explainAfterEach, 'boolean');
  }
  assert.deepEqual(sanitize(defaults()), defaults());
});
