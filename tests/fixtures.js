// Sample answer sets: normal, edge and failure cases.
import { SCENARIOS } from '../src/content.js';

const pickBy = (fn) => Object.fromEntries(SCENARIOS.map((s) => [s.id, s.options.findIndex(fn)]));

export const allBest = pickBy((o) => o.points === 3);
export const allWorst = Object.fromEntries(SCENARIOS.map((s) => {
  const min = Math.min(...s.options.map((o) => o.points));
  return [s.id, s.options.findIndex((o) => o.points === min)];
}));
// Mixed: best on even-numbered slots, worst elsewhere.
export const mixed = Object.fromEntries(SCENARIOS.map((s) => [s.id, s.slot % 2 === 0 ? allBest[s.id] : allWorst[s.id]]));

export const corruptStorage = [
  'not json{{',
  'null',
  '[]',
  JSON.stringify({ seen: 'oops', history: [{ bogus: 1 }, null], inProgress: { items: 3 }, prefs: 7 }),
];

export const badShareCodes = ['', '1-2-3', '100-100-100-100-100-101', '50-50-50-50-50-50', 'a-b-c-d-e-f', '-1-0-0-0-0-0', '100-100-100-100-100-100-100'];
