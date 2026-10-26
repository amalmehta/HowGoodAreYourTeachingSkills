# File Structure

```
index.html                 Page shell: header, view container, dialogs, font and KaTeX links
assets/
  style.css                Light/dark tokens, layout, components
  icon.svg                 App icon (favicon); PNGs for touch icon and link previews
src/
  content.js               Skills, 36 scenarios, points, explanations, drills, sources (pure data)
  quiz.js                  Draw, score, bands, calibration gap, weakest skill, share-link codec (pure functions)
  store.js                 localStorage wrapper with fallbacks and sanitising
  app.js                   Views, routing (#/, #/quiz, #/result, #/r/<code>, #/method), keys, settings, feedback
tests/
  fixtures.js              Sample answer sets, self-guess sets, corrupt storage, bad share codes
  content.test.js          Content validation
  quiz.test.js             Logic tests
  e2e.mjs                  Headless browser run + README screenshots
scripts/check-citations.mjs  Verifies every source against Crossref
docs/                      Design, instructions, checklist, prompt log, screenshots
HowGoodAreYourTeachingSkills?.md   Project spec and decisions
```
