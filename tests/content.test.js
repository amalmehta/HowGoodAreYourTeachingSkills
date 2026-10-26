import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, SCENARIOS, SOURCES, FAMILIES } from '../src/content.js';

test('36 scenarios: 6 skills × 3 slots × 2 variants', () => {
  assert.equal(SCENARIOS.length, 36);
  for (const k of SKILLS) for (const slot of [1, 2, 3]) {
    assert.equal(SCENARIOS.filter((s) => s.skill === k.id && s.slot === slot).length, 2, `${k.id} slot ${slot}`);
  }
});

test('ids are unique', () => {
  assert.equal(new Set(SCENARIOS.map((s) => s.id)).size, SCENARIOS.length);
});

test('each scenario: 4 options, exactly one worth 3, others 0–2, all with notes', () => {
  for (const s of SCENARIOS) {
    assert.equal(s.options.length, 4, s.id);
    assert.equal(s.options.filter((o) => o.points === 3).length, 1, s.id);
    for (const o of s.options) {
      assert.ok([0, 1, 2, 3].includes(o.points), s.id);
      assert.ok(o.text && o.note, s.id);
    }
    assert.ok(s.prompt && s.lesson, s.id);
  }
});

test('every scenario cites at least one existing source; every source is used', () => {
  const used = new Set();
  for (const s of SCENARIOS) {
    assert.ok(s.sources.length > 0, s.id);
    for (const key of s.sources) { assert.ok(SOURCES[key], `${s.id} → ${key}`); used.add(key); }
  }
  assert.deepEqual([...Object.keys(SOURCES)].filter((k) => !used.has(k)), []);
  for (const [k, src] of Object.entries(SOURCES)) assert.ok(src.doi || src.url, k);
});

test('skills have all teaching fields and a valid family', () => {
  for (const k of SKILLS) {
    for (const f of ['name', 'short', 'idea', 'analogy', 'why', 'fails', 'principle', 'drill']) assert.ok(k[f], `${k.id}.${f}`);
    assert.equal(k.selfCheck.length, 2);
    assert.ok(FAMILIES[k.family]);
  }
});

test('the best option is not always the longest (no length giveaway)', () => {
  const longestIsBest = SCENARIOS.filter((s) => {
    const max = Math.max(...s.options.map((o) => o.text.length));
    return s.options.find((o) => o.points === 3).text.length === max;
  }).length;
  assert.ok(longestIsBest / SCENARIOS.length < 0.4, `${longestIsBest}/36 best answers are the longest`);
});
