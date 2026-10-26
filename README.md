# How Good Are Your Teaching Skills?

You guess how good you are at six teaching skills, then answer 18 short teaching scenarios, in about 9 minutes. The result shows how your guess compared with your score, and which skill to practise next. Every answer cites the research behind it.

**[Take it →](https://amalmehta.github.io/HowGoodAreYourTeachingSkills/)**

| First, a quick guess | Pick a move, see the research | Guess vs result, and one drill |
|---|---|---|
| ![Self-guess screen](docs/screenshots/guess-light.png) | ![Quiz screen](docs/screenshots/quiz-light.png) | ![Result screen](docs/screenshots/result-light.png) |

| Home | Scoring, explained | On a phone |
|---|---|---|
| ![Home](docs/screenshots/home-dark.png) | ![How it's scored](docs/screenshots/method-dark.png) | ![Phone](docs/screenshots/quiz-phone.png) |

```mermaid
flowchart LR
  G[Self-guess: a band per skill] --> B
  A[36 cited scenarios] -->|draw 18, unseen first| B[Quiz]
  B -->|0–3 points each| C[6 skill scores]
  C --> D[Weakest skill + live drill]
  C --> F[Calibration: guessed band vs scored band]
  G --> F
  C --> E[Share link: 6 numbers only]
```

It measures teaching **judgment** (knowing the right move), not performance, and it has had no psychometric validation. The site says so on the result and method pages.

- [Instructions](docs/INSTRUCTIONS.md): run, test, deploy
- [System design](docs/SYSTEM-DESIGN.md)
- [File structure](docs/FILE-STRUCTURE.md)
- [Manual review checklist](docs/REVIEW-CHECKLIST.md)
- [Prompt log](docs/PROMPTS.md)
