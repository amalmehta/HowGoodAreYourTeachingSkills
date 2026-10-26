// Checks every source in src/content.js against a primary record:
// DOIs via the Crossref API (title words + year must match), URLs must load.
import { SOURCES } from '../src/content.js';

const norm = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
let failed = 0;

for (const [key, s] of Object.entries(SOURCES)) {
  try {
    if (s.doi) {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(s.doi)}`, { headers: { 'User-Agent': 'HowGoodAreYourTeachingSkills citation check (mailto:none)' } });
      if (!res.ok) throw new Error(`Crossref HTTP ${res.status}`);
      const w = (await res.json()).message;
      const title = (w.title || [''])[0];
      const year = (w.issued?.['date-parts']?.[0] || w['published-print']?.['date-parts']?.[0] || [])[0];
      const words = norm(title).slice(0, 5);
      const citeWords = new Set(norm(s.cite));
      const overlap = words.filter((x) => citeWords.has(x)).length / Math.max(words.length, 1);
      // Crossref sometimes dates a paper by its online date; allow ±1 year.
      if (overlap < 0.6 || Math.abs(year - s.year) > 1) throw new Error(`mismatch: "${title}" (${year})`);
      console.log(`✔ ${key}  ${year}  ${title.slice(0, 70)}`);
    } else {
      const res = await fetch(s.url, { method: 'GET', redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log(`✔ ${key}  URL loads (${res.headers.get('content-type')})`);
    }
  } catch (err) {
    failed++;
    console.log(`✖ ${key}  ${err.message}`);
  }
}
console.log(failed ? `\n${failed} source(s) failed` : `\nAll ${Object.keys(SOURCES).length} sources verified`);
process.exit(failed ? 1 : 0);
