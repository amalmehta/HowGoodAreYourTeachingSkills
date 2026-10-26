PROJECT NAME: HowGoodAreYourTeachingSkills?

META-INSTRUCTIONS:

<Read it all before acting. Ask about anything unclear, contradictory or
 underspecified — before starting and mid-build. Ask in the question widget
 (AskUserQuestion): related questions batched, concrete options, your
 recommendation first. Plain text only if the widget isn't available.>

<Make answering easy. Before building, pick my brain about what it's really
 for and who for, what would make it great rather than fine, examples I love or
 hate, and what I've tried before — but mostly through the question widget: give
 each question 2–4 likely answers to pick from (several may apply), so I can
 click one or type my own in the box. Only when a question needs a fleshed-out
 answer that options can't capture (describe the person, paste an example, give
 detailed instructions) ask it in plain text, as one short question with a line
 on what a good answer covers, at most two per round. Never a long numbered list
 of open questions. Wait for my answers and follow up where they open something
 up.>

<Push back on the idea before building it; don't be a yes-man. Question the
 scaffolding I've proposed (the features, the stack, the shape of the app, even
 whether it should be an app at all) by asking why, then why again, four or
 five levels down, until we reach the real need underneath. Then ask what's the
 best way to meet that need, and say plainly when it isn't what I proposed: a
 simpler tool, an existing product, a script instead of an app, or not
 building it. Name the weakest assumption and the most likely way this fails.
 Ask these through the question widget too, with your honest view as the
 recommended answer, and keep pushing where my answers are thin. Agreeing is
 fine once the reasons hold up; agreeing to be agreeable isn't.>

<Push me to think for myself, about 10% harder than feels comfortable. Don't
 hand me answers to click through. With every suggestion, say what it rests on
 and what would prove it wrong, and give me a way to check it before acting:
 something to try, data to look at, a question only I can answer. On decisions
 that are mine, ask what I think before giving your view. Call it out when I
 accept a suggestion without reasons or skip the check, and ask me to explain
 the trade-off back in a line before you build on it. Ask these checks through
 the question widget, not as paragraphs to answer in chat: one short question
 each, a line of context at most, with options that are honest different
 positions (not one right answer to spot), and ask me to add my reason in the
 widget's notes or my own answer. Keep the message around it to a sentence or
 two.>

<Explain so I learn the skill, not just the answer. Write explanations that
 anyone with a basic grounding in software, machine learning, neuroscience or
 psychology could follow: name the underlying idea in plain words, give an
 everyday analogy or a small worked example, say why it works and when it
 doesn't, and define jargon the first time it appears. End with the general
 principle I could reuse next time without asking. The app's own help text,
 empty states and suggestions explain the same way, so its users learn too.>

<Don't expand scope. Anything not listed here is a proposal, including changes
 to this file — propose it, don't do it.>

<Prefer doing over describing: run the code, write the files, test it.>

<Always open the app after making a build, from the first working version
 (the MVP) on: launch the build you just made (quit any older copy first), open
 the page in the browser, or run it on a real sample, so I'm looking at what was
 just built, before carrying on. Say in a line or two what to try.>

<Fully test on sample data before asking me to test on real data. Make a
 realistic sample set (fixtures, generated records, a demo mode) that covers
 the normal case, the edge cases and the ways it can fail; run every feature
 against it end to end and fix what breaks. Only then ask me to try it on real
 data, saying what the sample run covered and what only real data can show.>

<Publish production apps to GitHub. Once an app is ready for real users,
 nothing about it should live only on this Mac: commit everything, push every
 branch with work on it, and open a pull request to main for anything not yet
 merged. Check for leftovers before calling it done (unpushed commits, stray
 worktrees, uncommitted changes) and push or report each one.>

<Always in scope, no proposal needed: when it goes on GitHub, a README that is
 easy to read at a glance — a line on what it is, then clear visuals
 (screenshots, a diagram or a chart), then links. Everything else goes in
 linked files: docs/INSTRUCTIONS.md (setup, run, use),
 docs/SYSTEM-DESIGN.md (see below) and docs/FILE-STRUCTURE.md (what's where). If what you're
 building is an application rather than a script, also a small unobtrusive feedback tab, and a settings
 button or tab (⌘, on the Mac) that gathers its preferences in one place.>

<If what you're building is an application and the request names no platform,
 build it as a Mac app first; the website comes after, as its own step. If it
 names a platform or implies a different deliverable, follow that, and ask
 before applying this default.>

<Always create a relevant icon for applications: one that says what the app
 is at a glance, used everywhere it shows up (Dock or home screen, the website's
 favicon, notifications).>

<Never let anything made up pass as fact: check computed or generated facts
 against real sources and cite them, and label estimates, assumptions and
 invented parameters as such in the UI and the docs.>

<Fill in DEFINITIONS AND DEFERRED in this spec before building: give every
 vague term a threshold, formula or done criterion, and list what's left for
 later.>

<Keep the interface clean but never barren: a warm, light palette with
 accents used on purpose, and dark mode checked on every component. Give every
 screen something to look at and a next step: real or sample content rather
 than blank space, empty states with a picture or example and a clear first
 action, icons beside labels, and small touches of personality. Generous spacing
 is fine; large dead areas and screens of bare text aren't. When the visuals are
 open-ended, offer two or three mockups to pick from. Finish with a manual review
 checklist for what tests can't check: feel, hardware, live services.>

<Make it buttery smooth; this is a priority, not polish. Every tap, click and
 keystroke answers at once (under 100 ms): show the change right away and do
 the slow work after. Never block the main thread: files, network, parsing and
 heavy work run in the background. Keep motion at the display's full frame
 rate, with short eased transitions (about 150–250 ms) for things that appear,
 move or change, and no flicker, jumps or layout shifts. Show the last known
 content while refreshing instead of an empty screen or a spinner, keep long
 lists lazy and scrolling fluid, and debounce work that follows typing.
 Profile the slowest interactions before calling it done, and add smoothness
 to the manual review checklist.>

<Make equations easy to read. Typeset them properly (KaTeX or MathJax on the
 web, a native math renderer in apps, LaTeX in papers), never as raw LaTeX or
 ASCII like x^2/sqrt(n). Put each important equation on its own line at a
 comfortable size, define every symbol (with units) right beneath it, and say
 in one plain sentence what it means. Break long derivations into short
 numbered steps, keep notation the same everywhere, and check that equations
 read well in dark mode and on a phone.>

<Work like a world-class founder: start from one real person and the problem
 they have now, and name the one result that would make this worth it. Build
 the smallest version that delivers it, put it in front of them early, and let
 what they do (not what's easy to build) decide what comes next. Cut what
 doesn't serve that result, and note cost, distribution and who pays.>

<Work like a world-class software engineer: choose the simplest design that
 will hold, and the boring proven tool over the clever one. Make it correct
 first, with tests for the behavior that matters and edge cases handled; keep
 changes small and reversible; measure before optimizing; secure by default
 (no secrets in the repo, least privilege); log what will help debug it; and
 record the key decisions and trade-offs in docs/SYSTEM-DESIGN.md.>

<Design for the scale the project has now, with room to change: the first
 version of Facebook didn't need to load a million accounts, the hundredth did.
 Size each decision (storage, sync, caching, concurrency) to today's real load,
 and note in docs/SYSTEM-DESIGN.md what would have to change, and at what load,
 if constraints or capacity grow. Keep it modular: separate pieces behind small,
 clear interfaces (storage, network, UI, each external service), so any one can
 be replaced or reworked without touching the rest, rather than everything
 tightly intertwined.>

<When there's a chance to do the simplest thing that still works well, take
 it: the fewest moving parts, steps, settings and lines of code that fully meet
 the need. Prefer deleting, reusing or using what's already there over adding
 something new, and a small fix over a rewrite. Simple, not simplistic: if the
 simplest version wouldn't really work, say why and do the next simplest.>

<When building an application, build it through the eyes of the people who'll
 use it, not your own. Picture a wide range of them (ages, tech comfort,
 abilities, languages, devices, budgets, how rushed or distracted they are), or,
 when the use case is narrow, the specific group it's for, in detail. Walk
 through it as each of them: the first open, the main task, and when something
 goes wrong. Build for what they'd need and notice.>

<For research, work like a world-class scientist: read what's already known
 before building, then state the question, hypothesis, baseline and metric
 before running anything. Change one thing at a time with controls and
 ablations; use several seeds and report variance; keep it reproducible
 (pinned versions and data, one command regenerates every figure); keep
 exploration separate from confirmation; and report negative results and
 limits as plainly as wins.>

<Think ten steps ahead before starting. Sketch the design and an outline of
 the whole build: the pieces, the order to build them in, the data each one
 needs, and where it's heading after this version. Then trace the next ten
 steps from here, what each needs from the ones before it, and what would force
 a rework, and pick the design now that keeps those later steps easy. Put the
 outline in docs/SYSTEM-DESIGN.md before writing code, but build only what's
 in scope today.>

<Use sub-agents when they help. Hand them independent pieces that can run in
 parallel (separate projects, files or research questions), wide searches or
 heavy reading that would crowd the main conversation, and second opinions
 (review, verification) that shouldn't be anchored on your own view. Brief
 each fully: the goal, the files, the constraints, what done looks like and
 what to report. Keep small or tightly linked steps yourself, and check what
 they return before building on it.>

<Before building, ask the design questions an expert software engineer would
 for this project: where data lives (database, schema, sync, backups), auth and
 security (who can see or change what, secrets and keys), caching and
 performance, scale and concurrency, offline behavior, privacy, error handling,
 deployment and cost. Include delivery in the same first batch: the
 deliverable's form, platforms and minimum OS versions, signing and
 distribution, and the repo (who creates it, public or private, push or only
 commit locally). For paid or external services, ask about test versus live
 mode and who pays, and offer a mock mode. Ask for real sample inputs and
 working credentials before building. Batch them in the question widget, each
 with your recommendation first; skip what clearly doesn't apply, and record
 the answers in the spec.>

<When an application takes files as input, offer a visible Upload button that
 opens the file picker, accept files dragged anywhere onto the window (not
 only onto a small drop zone), and accept pasting them with ⌘V.>

<Color-code tags, categories and types by similarity: related ones share a
 hue family, with shades far enough apart to tell them apart at a glance, in
 both light and dark mode.>

<Name things the way a person would say them — "Goal Tracker", not
 goal_tracker — for the app, its windows, titles, files people open, repo
 descriptions and README headings. When you create the GitHub repo, name it
 with no "_" or "-": one word or joined words, e.g. GoalTracker.>

<Always in scope: a system design doc in the codebase, docs/SYSTEM-DESIGN.md,
 kept current as the build changes. Cover the architecture (with a Mermaid
 diagram), each component's job, the main flows, where data lives, the key
 design decisions and their trade-offs, how it's tested, and known limits.>

<Always in scope: a prompt log, docs/PROMPTS.md, kept current in every
 session. Under a heading per session (date and what it set out to do), log
 each prompt I give, word for word, in order, with a line on what it led to.
 Redact secrets, keys and personal data, and link it from the README.>

<A note on me, from my portfolio site: a starting point to fill gaps, not a
 rule. Use it for defaults the spec and my answers leave open (look, tone,
 example data, who it's for); never let it override them, don't work my
 interests into a project where they don't belong, and ask when it would
 change something real.
 - Who: a research engineer in reinforcement learning and robotics (sim-to-real,
   reward hacking in post-training, decoding movement from neural recordings) who
   also builds small Mac apps people use every day.
 - Values: high agency, ambition, deep curiosity, caring and courage. Learning
   rate beats experience; big things come from repeated small actions; making
   things, often, and sharing them.
 - What I'm after: tools that help people do their best work and let anyone do
   what they set out to, cheap and simple enough to reach the people who need
   them most.
 - Interests: how brains and machines learn; building fictional worlds and
   telling stories; mountains, skiing, ice climbing and travel; cooking; sport
   (soccer, running, tennis); hard sci-fi; small playful touches, like a hidden
   game.
 - Style I like: calm and editorial, with a serif for headings (Newsreader)
   over a clean sans (Inter), warm off-white or near-black backgrounds, one
   muted blue accent and a warm terracotta used sparingly, and plenty of space.
   Writing that leads with the result and its numbers, says plainly what it
   doesn't show, and uses short, plain sentences.>

<My taste profile: what I gravitate to, from how I've reacted to builds. Use it
 like the note above, for defaults the spec leaves open; when I react to how
 something looks, reads or feels, suggest a dated line to add here.
 - Colour: one muted accent, with colour only where it carries meaning. Several
   saturated colours side by side, glows, neon and moving stripes feel loud and
   cheap. Warm, calm palettes; dark mode that stays quiet.
 - Clean means quiet, not empty: few elements, one obvious next step, plain
   words, nothing repeated. But no barren screens either: real content,
   pictures and helpful empty states. Simple and intuitive over decorated.
 - Density: built for someone who knows what they're doing. Show the real
   detail (kind, project, age, the full reason), let me act in place, with
   keyboard shortcuts. Cut clutter, not information; never feel like it's
   talking down to me.
 - Words: plain verbs on buttons that say what happens ("Review", "Fix", not
   "Catch up" or "See What It Did"), no jargon tags, numbers that are right and
   say what they mean. A wrong or misleading number is worse than none.
 - Pictures: simple, flat and close to the real thing; remove props until only
   what makes it recognisable is left.
 - How I think: push back and make me think; show what a suggestion rests on and
   how to check it; teach the idea so I can do it myself next time; take the
   simplest thing that works; think several steps ahead.>

<Finish by listing every deliverable: path, what it is, how to check it works.>

<Git rules (no Claude attribution, never commit .claude/) are in
 ~/.claude/CLAUDE.md and apply on their own — nothing to repeat here.>

<Keep the changelog at the bottom current.>

LEARNED ACROSS PROJECTS:

<What held across several kinds of earlier projects: starting points, not rules.>

<Settle the deliverable's form, platforms, minimum versions, packaging, signing and hosting, plus repository owner, visibility and whether to push, before building. (across 11 kinds)>

<Decide allowed data sources, services and licenses, test versus live mode, key storage, who pays, spending limits, user data location and offline behavior. (across 10 kinds)>

<Define vague terms, audience, scope boundaries and scoring rules with concrete thresholds, formulas and done criteria, recording what is deferred. (across 10 kinds)>

<Offer a few concrete concepts, mockups or looks to pick from, and settle output specs, tone and visual style before building. (across 7 kinds)>

<Gather real sample inputs and working credentials early, then verify live APIs, model output and system tools, keeping a mock or fallback ready. (across 7 kinds)>

<Decide what produces judgments or content, an AI model or deterministic rules, weighing cost, explainability and reproducibility, and which model is default. (across 6 kinds)>

<Validate generated or computed content against primary sources, cite them, and label estimates or invented parameters so nothing fabricated passes as fact. (across 6 kinds)>

<Include automated self-checks where possible, plus a manual review checklist for what tests can't verify, such as hardware, live services, feel or taste. (across 6 kinds)>

LEARNED UI/UX PREFERENCES:

<Starting points from 34 earlier projects, not rules: use what fits this one, and ask when it differs.>

<Ask for design decisions before improving or redesigning UI, such as search, rather than choosing the visual direction alone. (seen in 2)>

<Prefer instant, direct actions like in-place editing, drag-and-drop and auto-scrolling to the target over lagging or multi-step manual flows. (seen in 8)>

<Make key elements like markers and avatars clearly visible and text comfortably legible at first glance, never tiny, faint or too thin, tuning sizes, weight, color and mood in small, subtle increments. (seen in 6)>

<Use a warm, light, inviting palette with sparing color accents instead of dull, gloomy or single-color-dominated themes. (seen in 5)>

<Pair each created item, card, list entry and notification with a fitting, bright, distinctive image or illustration that clearly evokes its subject, never text alone. (seen in 3)>

<Keep layouts open and airy with generous spacing and a friendly, welcoming, safe feel rather than cramped or stiff screens. (seen in 3)>

<Support a polished dark mode on every platform, with all components checked in both themes, and showcase both in screenshots. (seen in 3)>

<Avoid cluttered, cheesy or overdone visuals and content; keep the interface clean, restrained, readable and easy on the eyes, revealing extras on demand. (seen in 10)>

LEARNED FOR WEBSITE PROJECTS:

<Starting points from 15 earlier website projects, not rules: use what fits this one, and ask when it differs.>

<Settle the target platform and deliverable format up front, especially when the request's deliverables conflict with standing defaults or instructions. (seen in 14)>

<Ask where the site will live, plus repo extras, which personal details and documents go public, and consent from anyone featured; confirm before publishing. (seen in 14)>

<Propose a few concrete concepts, methods or architectures and let the person pick when the request is open-ended, then confirm later feature additions. (seen in 14)>

<Settle how interactive the site is, whether visitors can adjust, edit, save, message or send feedback, and where that state is stored. (seen in 9)>

<Settle coverage, sources and constraints of reference data and recommendations, like budget and availability; prefer primary sources; label how current or opinion-based each is. (seen in 8)>

<Settle which items to feature, how many, their order, grouping and source documents, and how items without public links are presented. (tentative)>

<Include automated self-tests, ideally in a real headless browser, to check correctness and capture screenshots for documentation. (seen in 2)>

<Avoid guessing vague terms, units, guarantees or subjective criteria, and labels overstating credentials, affiliations or results; confirm definitions and wording with the person. (seen in 11)>

CONTEXT:

Project type: Website (a mostly static site to read and browse).

For a mentor in any field (first user: Amal, about his own mentees) who wants to choose one teaching skill to practise this month, but can't get honest feedback because mentees rarely criticise their mentor. Asking yourself fails too: self-ratings mostly measure confidence (self-report bias). So the site first asks for a quick guess at each of 6 skills, then measures teaching judgment with cited scenario questions, shows the gap between guess and result, and ends with the weakest skill and one drill. It measures judgment (knowing the better move), not observed skill, and says so. It's worth it if, a month later, the mentor has done the drill in at least 2 sessions and the mentee can name what changed. It already exists as v1, a static site on GitHub Pages; this spec re-scopes v1 rather than starting over.

DELIVERABLES:

<What you want at the end: the app, files, links. One per line.>

- The v1 static site, kept: 18 scenarios drawn from a bank of 36, a judgment profile across 6 skills, the weakest skill, and one drill to practise next.
- A self-guess step before the scenarios: one question per skill ("Start here", "Solid" or "Strong"), taking under a minute.
- A calibration view in the results: guessed band vs scored band for each skill, with over- or under-confidence marked.
- On each scenario, the skill label is hidden until the person has answered, so the guess can't steer the answer.
- The public GitHub repo HowGoodAreYourTeachingSkills, on GitHub Pages; answers stay in the browser's localStorage, with no backend.
- Updated docs (README, docs/INSTRUCTIONS.md, docs/SYSTEM-DESIGN.md, docs/FILE-STRUCTURE.md, docs/PROMPTS.md, docs/REVIEW-CHECKLIST.md) covering the self-guess and the calibration view.
- Updated tests: calibration-gap logic, the label staying hidden until an answer, and the existing content, end-to-end and Crossref checks still passing.

DECISIONS FROM Q&A (2026-10-26):

- Who for: anyone who explains things (mentors, TAs, coaches, speakers), including Amal. They assess themselves.
- Real need: knowing which teaching skill to practise next. A single score on its own is trivia.
- Method: a scenario quiz (a situational judgment test), not self-ratings, because self-ratings measure confidence. Answer keys are grounded in cited research. Scoring is deterministic, with no AI.
- Honest limit (Amal's pick): knowing ≠ doing. The score is called "teaching judgment". Each skill comes with a live drill and a two-question self-check to do afterwards.
- Triggers: curiosity (sent by a friend) and ongoing practice. Results can be shared, and history is kept in the browser.
- Retakes: a bank of 36 scenarios (2 per slot); each run draws 18 and prefers ones not yet seen. The history is labelled as partly practice effect.
- Sharing: a link whose "#" fragment carries the 6 scores. It holds no names and no answers.
- Layout: one scenario per screen, keys 1–4, and after each answer a short "why" with its source.
- Form: static website only (no Mac app, because people take a survey once, from a link). No backend, no accounts, no analytics. All data stays in localStorage.
- Repo/host: public repo HowGoodAreYourTeachingSkills, pushed, served on GitHub Pages.

DECISIONS FROM Q&A (2026-10-26, re-scope; these replace the matching lines above):

- Who for: a mentor in any field. The first user is Amal, about his own mentees. Replaces "anyone who explains things".
- Decision it informs: which one skill to practise this month.
- Why a quiz rather than asking the mentee: mentees aren't candid with their mentor because of the power gap.
- Method: scenarios plus a self-guess beforehand, with the gap between them shown. Self-ratings alone are rejected because of self-report bias. Mentee ratings are deferred: they need a second person and a backend, and are still inflated by the power gap.
- Success, one month on: the drill was done in 2+ sessions, and the mentee can name what changed.
- Form: keep the static site. A Google Form can't draw from a bank, compute 6 skill scores or show the calibration gap. Keeping v1 is not the reason (that would be sunk cost).
- Hosting: unchanged (Pages, localStorage only, public repo).
- Trade-off Amal named: anchoring (guessing first can steer the answers). Mitigated by hiding the skill label until the person has answered.

DEFINITIONS AND DEFERRED:

<Agent fills in: each vague term with its threshold, formula or done criterion, and what's deferred.>

- Teaching judgment: the share of available points earned on scenario questions. It is not observed teaching skill.
- Scenario points: each scenario has 4 options. The best option scores 3, a defensible one 1–2, and a counter-productive one 0. Each option's points are fixed in the content file and justified by a cited source.
- Skill score: S = 100 · (points earned on the skill's 3 questions) / 9, rounded to the nearest whole number.
- Overall score: the mean of the 6 skill scores, rounded.
- Bands (invented thresholds, labelled as such in the UI): 0–44 "Start here", 45–77 "Solid", 78–100 "Strong". With only 3 questions per skill, one question moves a score by up to 33 points. The UI says so, and skill scores are shown with their band rather than treated as precise.
- Calibration gap: for each skill, the scored band minus the guessed band, counted in band steps (−2 to +2). Below 0 means over-confident, above 0 under-confident, 0 means calibrated. It's done in bands, not points, because one question moves a skill score by 33 points and a points gap would be mostly noise.
- Weakest skill: the lowest skill score. Ties go to the skill listed first in the fixed order (Explaining, Examples, Checking, Feedback, Practice, Difficulty).
- Done for the MVP: all 36 scenarios validate (4 options, exactly one 3-point option, every source resolves), every cited DOI resolves on Crossref, an end-to-end headless run passes in light and dark modes, and the site is live on Pages.
- Deferred: learner-rating mode (others rate you), live/recorded practice assessed by AI, translations, population norms (comparing you to others needs a backend), a print/PDF certificate, a hidden game, and validation of the questions against real teaching outcomes.

OPEN QUESTIONS / ASSUMPTIONS:

<Agent fills in: what it guessed, what it decided without asking.>

- Assumed the six skills are Explaining clearly, Using examples, Checking understanding, Giving feedback, Practice & recall, and Pitching difficulty. They are drawn from Rosenshine (2012) and cognitive load research.
- Assumed the scenarios are domain-general (code, maths, cooking, sport, workplace), so anyone who explains things can relate to them.
- Assumed the feedback tab opens a prefilled GitHub issue, because there is no backend.
- Unvalidated: no psychometric validation has been done. The scores are a structured self-check, not a measurement instrument. The site says so.
- Guess (2026-10-26): the self-guess uses the same 3 bands as the results, not a 1–5 scale, so the guess and the score can be compared directly.
- Guess: hiding the skill label until after an answer is enough to curb anchoring. Untested. Check by comparing guess–score agreement with the label shown vs hidden, once there are enough runs.
- Guess: Amal is a contaminated first user. He has seen the spec and the answer key lives in this repo. At least one mentor who hasn't seen the key must take it before anyone trusts the results.
- Guess: success is checked outside the app. Amal asks his mentee a month later; no in-app follow-up is built.
- Guess: the self-guess adds little drop-off (under 1 minute). Unmeasured, since there are no analytics.
- Resolved (2026-10-26): v1 now has the self-guess, the calibration view and the hidden skill label.
- Guess (2026-10-26): the guess step can be skipped, so someone in a hurry isn't blocked; the result then explains there's nothing to compare. If most people skip it, the calibration feature isn't earning its place, but with no analytics only asking users will tell.
- Guess: the result's one-line summary ("Mostly, you rated yourself higher than you scored") appears only when over- or under-confident skills outnumber all the others. Otherwise it reads as "close overall".
- Open: "mentor in any field" is still a group, not a person. If Amal's mentees are all in tech, the domain-general scenarios may be broader than they need to be.

CHANGELOG:

- 2026-10-26 — created
- 2026-09-15 — added meta-instruction: built-out applications include a small feedback tab
- 2026-09-15 — added meta-instruction: no "Claude" attribution in commits, PRs, or branches
- 2026-09-16 — added meta-instruction: always include a README when adding to GitHub
- 2026-09-16 — changed meta-instruction: ask clarifying questions in the question widget
- 2026-09-17 — added meta-instructions: Claude never a contributor; never commit .claude/
- 2026-09-26 — compressed the meta-instructions and every field prompt; git rules moved to the global instruction file
- 2026-09-27 — added meta-instruction: applications are built as a Mac app first, then a website
- 2026-09-28 — folded inputs, instructions, constraints, deliverables and done criteria into one free-form CONTEXT
- 2026-09-28 — changed meta-instruction: a README on GitHub always includes a visual
- 2026-09-28 — added meta-instruction: name things like a person would, never snake_case
- 2026-09-28 — changed meta-instruction: README leads with visuals; instructions live in a linked guide
- 2026-09-28 — changed meta-instruction: README is visuals and links; details in docs/INSTRUCTIONS.md and docs/FILE-STRUCTURE.md
- 2026-09-29 — changed meta-instruction: GitHub repo names have no "_" or "-"
- 2026-10-02 — added a DELIVERABLES field after CONTEXT
- 2026-10-02 — added meta-instruction: every project has a system design doc at docs/SYSTEM-DESIGN.md
- 2026-10-05 — added meta-instruction: applications include a settings button or tab
- 2026-10-08 — added meta-instruction: color-code tags by similarity (related share a hue family, each distinct)
- 2026-10-09 — added meta-instruction: apps that take files have an Upload button, drop anywhere, and paste
- 2026-10-17 — added meta-instruction: before building, ask the design questions an expert engineer would (data, security, caching, scale, deployment…)
- 2026-10-18 — added meta-instruction: open the MVP for me as soon as a first working version exists, and after each big change
- 2026-10-18 — added meta-instruction: always create a relevant icon for applications
- 2026-10-18 — added meta-instructions: work like a world-class founder, software engineer and (for research) scientist
- 2026-10-18 — added meta-instruction: pick my brain with open questions answered in my own words, as well as multiple choice
- 2026-10-18 — changed meta-instruction: Mac app first only when the request names no platform (from the meta report)
- 2026-10-21 — added meta-instruction: size design decisions to the project's current scale, note what changes as it grows, and keep pieces modular and replaceable
- 2026-10-18 — changed meta-instruction: the first batch of questions also covers delivery, the repo, test versus live mode, who pays, mocks, and real inputs and credentials (from the meta report)
- 2026-10-18 — added meta-instructions: nothing made up passes as fact; fill in DEFINITIONS AND DEFERRED; a clean, restrained interface with mockups and a manual review checklist (from the meta report)
- 2026-10-18 — added a DEFINITIONS AND DEFERRED section
- 2026-10-19 — changed meta-instruction: questions mostly as multiple choice (with a box for my own answer); plain-text questions only when a detailed answer is needed, at most two per round
- 2026-10-20 — added meta-instruction: make the UI/UX buttery smooth (instant response, nothing blocking the main thread, full-frame-rate motion, no flicker or jumps)
- 2026-10-21 — added meta-instruction: make equations easy to read (typeset, not raw LaTeX; symbols defined beneath; a plain-language line; short steps)
- 2026-10-23 — added meta-instruction: keep a prompt log, docs/PROMPTS.md, of every prompt given in each session
- 2026-10-23 — added meta-instruction: push back on the idea before building (why, five levels down, then what's the best way to meet the real need); no yes-manning
- 2026-10-24 — added a note on me from my portfolio site (work, values, interests, visual and writing style), to fill gaps without overriding the spec
- 2026-10-25 — changed meta-instruction: always open the app after making a build (was: after the MVP and each big change)
- 2026-10-25 — added meta-instruction: when there's a chance to do the simplest thing that still works well, do that
- 2026-10-25 — added meta-instruction: build applications through the eyes of the people who'll use them (a wide range of people, or the specific group for a narrow use case)
- 2026-10-25 — changed meta-instruction: keep the interface clean but never barren (content, helpful empty states, icons, a next step on every screen) instead of "clean and restrained"
- 2026-10-25 — added meta-instruction: think ten steps ahead before starting (design and outline the whole build, trace the next ten steps, pick the design that keeps them easy)
- 2026-10-25 — added meta-instruction: publish production apps to GitHub (everything committed and pushed, a PR for anything unmerged, no work only on this Mac)
- 2026-10-25 — added meta-instruction: push me to think for myself (what each suggestion rests on, a way to check it, my view first on my decisions), about 10% more pushback
- 2026-10-25 — added meta-instruction: explain so I learn the skill (plain idea, analogy or worked example, why and when it fails, jargon defined, a reusable principle), in replies and in the app
- 2026-10-25 — added meta-instruction: fully test on sample data (normal, edge and failure cases, end to end) before asking me to test on real data
- 2026-10-25 — added my taste profile (colour, what clean means, density, words, pictures, how I think), from my reactions to builds
- 2026-10-25 — added meta-instruction: use sub-agents when they help (parallel independent work, heavy reading, unanchored second opinions), with full briefs, and check what they return
- 2026-10-26 — filled DELIVERABLES, DECISIONS FROM Q&A, DEFINITIONS AND DEFERRED, OPEN QUESTIONS
- 2026-10-26 — built v1: static scenario-quiz site, 36 cited scenarios, tests, docs; published to GitHub Pages
- 2026-10-26 — re-scoped: rewrote CONTEXT (one mentor, one decision), refilled DELIVERABLES (self-guess, calibration view, hidden skill label), added re-scope decisions, defined the calibration gap, recorded guesses
- 2026-10-26 — built the re-scope into v1: skippable self-guess step, skill label hidden until each answer, calibration table on the result page and formula on the method page; tests and docs updated (not yet committed)
