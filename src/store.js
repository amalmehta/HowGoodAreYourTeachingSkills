// localStorage wrapper. Every access is guarded: private windows, blocked
// storage or corrupt data fall back to defaults kept in memory.
const KEY = 'hgats.v1';

export const defaults = () => ({
  seen: [],          // scenario ids answered in any finished run
  history: [],       // [{ date, scores, overall }]
  inProgress: null,  // { items, answers, index }
  prefs: { theme: 'system', explainAfterEach: true, reduceMotion: false },
  selfChecks: {},    // { [skillId]: [bool, bool] }
});

let memory = null;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return memory ?? defaults();
    return sanitize(JSON.parse(raw));
  } catch (err) {
    console.warn('[store] load failed, using defaults:', err);
    return memory ?? defaults();
  }
}

export function save(state) {
  memory = state;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[store] save failed, keeping in memory only:', err);
  }
}

export function clear() {
  memory = null;
  try { localStorage.removeItem(KEY); } catch { /* storage blocked: nothing to clear */ }
}

// Keep only well-formed fields so one bad value can't break the app.
export function sanitize(data) {
  const d = defaults();
  if (!data || typeof data !== 'object') return d;
  if (Array.isArray(data.seen)) d.seen = data.seen.filter((x) => typeof x === 'string');
  if (Array.isArray(data.history)) {
    d.history = data.history.filter((h) => h && typeof h.overall === 'number' && h.scores && typeof h.date === 'string');
  }
  const p = data.inProgress;
  if (p && Array.isArray(p.items) && p.answers && typeof p.answers === 'object' && Number.isInteger(p.index)) d.inProgress = p;
  if (data.prefs && typeof data.prefs === 'object') d.prefs = { ...d.prefs, ...data.prefs };
  if (data.selfChecks && typeof data.selfChecks === 'object') d.selfChecks = data.selfChecks;
  return d;
}
