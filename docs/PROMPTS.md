# Prompt Log

## 2026-10-26: Build the project from the spec

1. "HowGoodAreYourTeachingSkills?: build this project. Read HowGoodAreYourTeachingSkills?.md in this folder and build what it describes, following its META-INSTRUCTIONS exactly."
   → Three rounds of questions, with answers recorded in the spec under DECISIONS FROM Q&A. Settled on a static scenario-quiz site with a bank of 36 cited scenarios, 6 skills, share links and local history, published on GitHub Pages.

## 2026-10-26: Re-scope the spec, then build the self-guess into v1

1. "Work only in `HowGoodAreYourTeachingSkills?.md`, the only file in the project. Follow its META-INSTRUCTIONS: use the question widget (AskUserQuestion) and put your recommended option first. Push back on the idea by asking why, several levels down. Settle: (1) one specific person who would take this survey and the decision it helps them make; (2) self-assessment versus observer or student ratings versus scenario-based questions, and name self-report bias as the main risk; (3) whether it should be a website at all, or a Google Form or an existing tool; (4) where it's hosted, whether answers are stored or stay in the browser, and the repo name and visibility. Then rewrite CONTEXT as a short paragraph, fill DELIVERABLES with one item per line, and record every guess under OPEN QUESTIONS / ASSUMPTIONS. Add a dated CHANGELOG line. Done means a stranger could read CONTEXT and DELIVERABLES and know what to build and for whom. Don't write any code. (…plus a request to explain the reasoning and a check question.)"
   → Three rounds of questions. Re-scoped the spec around one mentor (Amal) choosing one skill to practise, with scenarios plus a self-guess and a calibration gap in bands; hosting unchanged.
2. "Build the self-guess, calibration view and hidden skill label into v1, per the updated spec."
   → Added the guess step (skippable, saved as you go), the skill label hidden until each answer, a calibration table and summary on the result page, a calibration section on the method page, 4 unit tests, 9 browser checks and new screenshots.
