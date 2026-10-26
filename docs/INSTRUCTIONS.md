# Instructions

## Use it
Open the site and press **Start the quiz** (or Enter). First guess a band (Start here, Solid or Strong) for each of the six skills, or press **Skip the guess**. Then answer with keys **1–4**. Each scenario's skill is named only after you answer. Press **Enter** for the next question and **Esc** to save and exit.
**⌘,** (Ctrl+, on Windows/Linux) opens Settings: theme, explanations on or off, reduce motion, and clear history.
Your answers stay in your browser (localStorage). **Copy share link** shares only your six scores.

## Run locally
ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Test
```bash
npm install
npm test            # unit + content validation (node --test)
npm run e2e         # headless Chromium run: plays full quizzes, light/dark/phone, saves docs/screenshots
npm run citations   # checks every DOI on Crossref and every URL loads
```
`npm run e2e` uses `playwright-core` 1.48.2 with its Chromium build. If it's missing, run `npx playwright@1.48.2 install chromium`.

## Edit content
All scenarios, skills and sources live in `src/content.js`. Each scenario needs 4 options, exactly one worth 3 points, and at least one source key. `npm test` enforces this, and also checks that the best option isn't usually the longest. After editing, run `npm run citations`.

## Deploy
GitHub Pages serves the `main` branch root. Pushing to `main` deploys.
