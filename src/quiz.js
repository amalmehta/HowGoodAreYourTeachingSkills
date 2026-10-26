// Pure quiz logic: no DOM, no storage. Everything here is unit-tested.
import { SKILLS, SCENARIOS, BANDS } from './content.js';

export const SLOTS_PER_SKILL = 3;
export const MAX_POINTS = 3;
const SKILL_MAX = SLOTS_PER_SKILL * MAX_POINTS; // 9

const byId = new Map(SCENARIOS.map((s) => [s.id, s]));
export const scenario = (id) => byId.get(id);

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One variant per (skill, slot), preferring ones not seen before.
// Questions are shuffled so skills interleave; options are shuffled per question.
export function drawRun(seen = [], rng = Math.random) {
  const seenSet = new Set(seen);
  const picks = [];
  for (const skill of SKILLS) {
    for (let slot = 1; slot <= SLOTS_PER_SKILL; slot++) {
      const variants = SCENARIOS.filter((s) => s.skill === skill.id && s.slot === slot);
      const unseen = variants.filter((s) => !seenSet.has(s.id));
      const pool = unseen.length ? unseen : variants;
      picks.push(pool[Math.floor(rng() * pool.length)]);
    }
  }
  return shuffle(picks, rng).map((s) => ({ id: s.id, order: shuffle([0, 1, 2, 3], rng) }));
}

// answers: { [scenarioId]: originalOptionIndex }. Unanswered counts as 0 points.
export function scoreRun(items, answers) {
  const sums = Object.fromEntries(SKILLS.map((k) => [k.id, 0]));
  for (const { id } of items) {
    const s = scenario(id);
    const pick = answers[id];
    if (s && pick != null && s.options[pick]) sums[s.skill] += s.options[pick].points;
  }
  const scores = Object.fromEntries(SKILLS.map((k) => [k.id, toScore(sums[k.id])]));
  return { scores, overall: overall(scores) };
}

export const toScore = (points) => Math.round((100 * points) / SKILL_MAX);

export function overall(scores) {
  const vals = SKILLS.map((k) => scores[k.id]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function band(score) {
  return BANDS.find((b) => score >= b.min);
}

// Lowest score; ties go to the skill listed first.
export function weakest(scores) {
  return SKILLS.reduce((low, k) => (scores[k.id] < scores[low.id] ? k : low), SKILLS[0]);
}

// Share links carry only the 6 skill scores, in skill order: "67-100-33-56-78-89".
const VALID = new Set(Array.from({ length: SKILL_MAX + 1 }, (_, p) => toScore(p)));

export function encodeShare(scores) {
  return SKILLS.map((k) => scores[k.id]).join('-');
}

export function decodeShare(code) {
  if (typeof code !== 'string') return null;
  const parts = code.split('-');
  if (parts.length !== SKILLS.length || !parts.every((p) => /^\d{1,3}$/.test(p))) return null;
  const nums = parts.map(Number);
  if (!nums.every((n) => VALID.has(n))) return null;
  const scores = Object.fromEntries(SKILLS.map((k, i) => [k.id, nums[i]]));
  return { scores, overall: overall(scores) };
}
