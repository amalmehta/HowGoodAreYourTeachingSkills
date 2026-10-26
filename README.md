# How Good Are Your Teaching Skills?

You answer 18 short teaching scenarios in about 8 minutes. The result shows which of six teaching skills to practise next, and every answer cites the research behind it.

**[Take it →](https://amalmehta.github.io/HowGoodAreYourTeachingSkills/)**

| Pick a move, see the research | Your profile and one drill to practise |
|---|---|
| ![Quiz screen](docs/screenshots/quiz-light.png) | ![Result screen, dark mode](docs/screenshots/result-dark.png) |

| Home | Scoring, explained | On a phone |
|---|---|---|
| ![Home](docs/screenshots/home-light.png) | ![How it's scored](docs/screenshots/method-dark.png) | ![Phone](docs/screenshots/quiz-phone.png) |

```mermaid
flowchart LR
  A[36 cited scenarios] -->|draw 18, unseen first| B[Quiz]
  B -->|0–3 points each| C[6 skill scores]
  C --> D[Weakest skill + live drill]
  C --> E[Share link: 6 numbers only]
```

It measures teaching **judgment** (knowing the right move), not performance, and it has had no psychometric validation. The site says so on the result and method pages.

- [Instructions](docs/INSTRUCTIONS.md): run, test, deploy
- [System design](docs/SYSTEM-DESIGN.md)
- [File structure](docs/FILE-STRUCTURE.md)
- [Manual review checklist](docs/REVIEW-CHECKLIST.md)
- [Prompt log](docs/PROMPTS.md)
