# Agents

Defines where the project's conventions live and what must pass before a change is done. Read it at the start of every session.

## 1. Conventions

Read these before writing code. Each one states when it applies.

| Document                                    | Scope                                                                  |
|:--------------------------------------------|:-----------------------------------------------------------------------|
| `docs/CODE-GUIDELINES.md`                   | Formatting: whitespace, punctuation and braces, in TypeScript and CSS  |
| `docs/NAMING-CONVENTIONS.md`                | Naming: folders, files, CSS variables, BEM classes, TypeScript symbols |
| `docs/react/REACT-STRUCTURE-APPLICATION.md` | Where a new file belongs, in the front-end                             |
| `docs/react/REACT-GOOD-PRACTICES.md`        | React, TypeScript, CSS and accessibility rules                         |
| `docs/css/CSS-DESIGN-TOKENS.md`             | Design tokens in the root stylesheet                                   |
| `docs/CODE-QUALITY-AUDIT.md`                | What an audit verifies                                                 |
| `docs/COMMIT-CONVENTIONS.md`                | How a commit message is written and what belongs in one commit         |

These documents are copies. Their source of truth is the `binkce-design-system` repository, which also holds `react-structure-library.md` for its packages; a convention changes there and is copied here, never the reverse.

Never run a code quality audit unless it is explicitly asked for.

## 2. Quality gates

All three must pass before a change is done:

```bash
npx tsc --noEmit -p tsconfig.app.json
npx eslint src --max-warnings=0
npm run build
```

The `-p tsconfig.app.json` is not optional. The root `tsconfig.json` is a solution file with `"files": []` and project references, so `npx tsc --noEmit` on its own type-checks nothing and passes whatever the state of the code.

`npm run build` runs `tsc -b`, which builds every referenced project and does not use the same configuration as the command above. A filename-casing error passes the first and fails the second, so run both.

Green gates are not proof the change works. Anything the user can see is verified by running the app and looking at the result.
