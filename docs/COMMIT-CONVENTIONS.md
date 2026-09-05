# Commit Conventions

Defines how a commit message is written and what belongs in a single commit. Read it before committing.

## 1. Subject line

A fixed vocabulary, so no time is spent choosing wording:

```
<Verb> <category>
```

Imperative mood, sentence case, no trailing period. Nothing else: no complement, no issue number, no prefix taxonomy.

### 1.1. Verbs

| Verb       | Use                                          |
|:-----------|:---------------------------------------------|
| `Add`      | something that did not exist before          |
| `Update`   | something that existed and changed           |
| `Fix`      | something that was wrong                     |
| `Remove`   | something deleted and not replaced           |
| `Refactor` | structure reworked, behaviour left identical |

A rename is an `Update`. There is no `Rename` verb.

### 1.2. Categories

| Category        | Covers                                          |
|:----------------|:------------------------------------------------|
| `features`      | What the user can do                            |
| `design`        | What the user sees                              |
| `format`        | Whitespace only, `git diff -w` comes back empty |
| `config`        | Build, lint, TypeScript, IDE, dependencies      |
| `documentation` | Files under `docs/`, `AGENTS.md`, `README.md`   |
| `assets`        | Fonts, icons, logos, images                     |

```
Add features
Update design
Fix config
Refactor features
Update format
Add documentation
Remove assets
```
