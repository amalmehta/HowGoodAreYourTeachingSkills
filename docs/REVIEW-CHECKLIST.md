# Manual Review Checklist

These are things the automated tests can't judge. Tick each one on a real device.

**What the tests already cover:** 21 unit and content tests, and 37 browser checks. The browser checks cover the guess step (disabled until complete, survives reload, skip path), the skill label hidden until you answer, the calibration rows, scoring maths, share links, bad links, corrupt storage, resume, retake drawing unseen scenarios, ⌘, settings, dark mode, 375 px width and no page errors; and all 37 citations checked against Crossref or a loading PDF.

## Feel and smoothness
- [ ] Answering with keys 1–4 feels instant. The e2e run measured about 13 ms median and under 70 ms max, including test overhead.
- [ ] Moving between questions fades in without a flash or a jump in layout.
- [ ] Result bars grow smoothly, and scrolling a long result on a phone stays fluid.
- [ ] Reduce motion (system setting or in-app toggle) removes the fades.

## Content and tone
- [ ] Read 5 random scenarios. Is the best answer defensible, and can you avoid guessing it from wording alone?
- [ ] Do any distractors read as straw men?
- [ ] Does the "Practise next" card teach something useful in about 30 seconds?
- [ ] Does the guess step feel quick (under a minute), and does the calibration summary read as useful rather than judgmental?
- [ ] Take it once as someone who hasn't seen the answer key. Does seeing a gap change what you'd practise?
- [ ] Have someone who teaches for a living try it and dispute at least one answer key.

## Visual
- [ ] Every screen in light and dark looks quiet and warm, with readable contrast.
- [ ] On a real phone (iOS Safari and Android Chrome), the feedback button doesn't cover content.
- [ ] Equations on the method page read well in dark mode and on a phone.

## Live services
- [ ] Copy share link works in Safari, Chrome and Firefox. The fallback is a prompt if the clipboard is blocked.
- [ ] A shared link pasted into iMessage or Slack shows the title and icon preview.
- [ ] The feedback tab opens a prefilled GitHub issue.
- [ ] The site loads on GitHub Pages with fonts and KaTeX from their CDNs.
