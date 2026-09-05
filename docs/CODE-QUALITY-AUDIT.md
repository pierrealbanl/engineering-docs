# Code Quality Audit

Defines what a code quality audit verifies. Read it before auditing the codebase.

An audit runs when it is asked for, never on an agent's own initiative. Good moments to ask for one are after a feature that touched many files, and before a release.

* Verify that the code still complies with the conventions listed in `AGENTS.md`.
* Check for the absence of unused components, dependencies, variables, functions, imports, or files.
* Remove all unused or unnecessary CSS rules.
* Verify that no colour is written as a raw value in CSS: every colour comes from a design token, never a hex code, an `rgb()` or a named colour.
* Verify that no reusable style value (spacing, radius, typography, duration) is hardcoded in a CSS file: a value used in a second file becomes a token in the root stylesheet, per `docs/css/CSS-DESIGN-TOKENS.md`.
* Verify that the code contains no `any`, no `@ts-ignore` and no type assertion; `as const` on a data literal is the only allowed cast.
* Identify any duplicated code and, where applicable, refactor it into reusable components or modules.
* Review the size and complexity of components, functions, hooks, and CSS files in order to identify elements that should be split, simplified, or consolidated into smaller and more maintainable units, while minimizing the complexity of logic and control structures as much as possible.
