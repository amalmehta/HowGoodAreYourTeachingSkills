# System Design

How Good Are Your Teaching Skills? is a static website. You answer 18 teaching scenarios and get a profile across 6 skills, your weakest skill, and one drill to practise. There is no server code: everything runs in the visitor's browser.

## Architecture

```mermaid
flowchart LR
  subgraph Browser
    UI["app.js<br/>views + routing"] --> Quiz["quiz.js<br/>draw, score, bands, share codec"]
    Quiz --> Content["content.js<br/>skills, 36 scenarios, sources"]
    UI --> Store["store.js<br/>localStorage wrapper"]
    UI --> KaTeX["KaTeX (CDN)<br/>scoring formula"]
  end
  Pages["GitHub Pages<br/>static files"] --> Browser
  UI -. "feedback tab opens" .-> Issue["GitHub new-issue page"]
  Check["scripts/check-citations.mjs"] -. "build-time check" .-> Crossref["Crossref API"]
```

| Piece | Job | Interface |
|---|---|---|
| `src/content.js` | All words the quiz says: skills, families, scenarios, options with points, explanations, drills, sources. Pure data. | `SKILLS`, `SCENARIOS`, `SOURCES` |
| `src/quiz.js` | Pure functions with no DOM or storage. Draws a run from the bank, scores it, assigns bands, picks the weakest skill, and encodes/decodes share links. | `drawRun(seen, rng)`, `scoreRun(run, answers)`, `band(score)`, `weakest(scores)`, `encodeShare`/`decodeShare` |
| `src/store.js` | Reads and writes localStorage. Every access is in try/catch, so a private window or blocked storage falls back to in-memory storage. | `load()`, `save(state)`, `clear()` |
| `src/app.js` | Renders views by hash route (`#/`, `#/quiz`, `#/result`, `#/r/<code>`, `#/method`). Handles keyboard shortcuts, settings and the feedback tab. | — |
| `assets/style.css` | Tokens for light and dark mode, plus layout. | CSS custom properties |

Each piece can be replaced on its own. For example, content could move to JSON, or storage could move to a server, without touching the other modules.

## Main flows

1. **Take the quiz.** On Home, Start calls `drawRun`, which picks 1 of 2 variants for each of the 18 slots and prefers variants not seen before. Each answer shows the why and its source at once. After the 18th answer, `scoreRun` → the Result view, and the run is appended to history.
2. **Share.** `encodeShare(scores)` → `#/r/<6 numbers>`. The fragment after `#` is never sent to the server. Opening the link shows a read-only card with a "Take it yourself" button. Bad codes show a friendly error with the same button.
3. **Return visit.** Home shows the last result and a history line with each past overall score, labelled "rises partly reflect seeing questions before".

## Where data lives

- **localStorage key `hgats.v1`**: `{ seen: [scenarioIds], history: [{date, scores, overall}], inProgress, prefs, selfChecks }`. A version prefix means a future schema can migrate or ignore old data.
- Nothing is sent anywhere. There are no analytics or cookies. The share link holds only 6 integers.
- No backups. Clearing site data wipes history, and the settings page says so.

## Key decisions and trade-offs

| Decision | Why | Cost |
|---|---|---|
| Scenario quiz (situational judgment test) over self-rating | Self-ratings track confidence, not skill. | Measures knowing, not doing. The site says so and gives live drills. |
| Deterministic points, no AI | Reproducible, free, explainable, and every point is backed by a source. | Can't grade free-form answers. |
| Static site, no build step, ES modules | Fewest moving parts. Pages hosts it for free. | Must be served over http, because modules don't load from `file://`. |
| 2 variants per slot | Retakes stay meaningful for longer. | Twice the content to write and check. |
| 3 questions per skill | Keeps the quiz to about 8 minutes. | Skill scores are coarse (steps of about 11 points), so we show bands, not precision. |
| KaTeX from jsDelivr, pinned 0.16.11 | Proper math typesetting for the scoring formula. | One CDN dependency. The formula falls back to plain text if it is offline. |

## Testing

- `node --test tests/`: logic (draw, score, bands, ties, share codec, corrupt input) and content validation (ids unique, 4 options, exactly one 3-point option, sources exist, every slot has 2 variants).
- `node tests/e2e.mjs`: headless Chromium (Playwright) plays a full run with fixed answers in light and dark, checks the result numbers, the share link round-trip, a bad share link, corrupted storage, and keyboard-only play. It saves screenshots to `docs/screenshots/`.
- `node scripts/check-citations.mjs`: resolves every DOI on Crossref and compares title and year.
- Profiling: the e2e run times each answer from keypress to visible feedback (about 13 ms median). Answering updates the DOM in place, with no re-render and no network.
- Manual: `docs/REVIEW-CHECKLIST.md`.

## Scale and what would change

Today: a few hundred visitors at most, each holding a few KB of local data. A static host covers that indefinitely.
- **Population comparison ("you're in the top 30%")** would need a backend and consent, at any traffic level. A serverless function plus SQLite or Postgres would do.
- **More content (>200 scenarios or translations)** would mean moving content to JSON files loaded lazily per language.
- **Learner-rating mode** would need shared state per teacher (server and auth). It is out of scope for now.

## Known limits

- The questions have had no psychometric validation, so the scores are a structured self-check.
- The best answers reflect the cited research consensus, and some are contested. Each explanation names its source so you can judge for yourself.
- Three questions per skill means a single question can move a skill score a lot.
