# Code Guidelines

Defines how TypeScript, TSX and CSS are formatted. Read it before reformatting a file or setting up a new machine.

Nothing in the repository enforces this style automatically. It is set up once in the IDE (section 6).

## 1. Whitespace

Same values in both languages.

| Rule                | Value    |
|:--------------------|:---------|
| Indent              | 2 spaces |
| Continuation indent | 2 spaces |
| Tabs                | never    |
| Max line length     | 160      |
| Trailing whitespace | trimmed  |
| Final newline       | required |

The continuation indent is 2, not the JetBrains default of 8. In JSX every wrapped attribute, `return (` and `{cond && (` adds a level, and those levels stack.

In CSS, one blank line between two rules, none just inside a block.

## 2. Comments

No comments, in TypeScript as in CSS. A comment explains what the code failed to say: rename the thing, or split it, until the code says it on its own.

## 3. TypeScript punctuation

* **No semicolon** at the end of a statement. It stays where the syntax requires it, between members of a type literal.
* **Single quotes**, except JSX attributes which keep double quotes.
* **Trailing comma** on a multi-line literal, none on a single-line one.

```tsx
import { useState } from 'react'

const status: { id: string; label: string } = { id: 'draft', label: 'Brouillon' }

const tabs = [
  'clients',
  'assets',
]

const badge = <StatusBadge status="pending" label={status.label}/>
```

## 4. TypeScript braces and brackets

Spaces inside braces, never inside brackets.

```ts
import { useEffect } from 'react'
const style = { backgroundColor: accent }
const sections: { id: string; label: string }[] = []

const pair = [first, second]
const label = `${month} ${year}`
```

Braces are spaced in the three first lines: imports, object literal, type literal. Brackets and interpolations are not.

## 5. CSS punctuation and selectors

* **A semicolon after every declaration**, including the last of a block. The opposite of the TypeScript rule: here the parser requires it, and omitting it breaks the next declaration added.
* **One declaration per line**, however short.
* **A space after the colon**, none before. **A space after a comma** inside a function.
* **One selector per line** when a rule groups several, each line but the last ending with a comma.
* **Opening brace on the selector line**, closing brace on its own line.
* **Two BEM levels maximum** in a selector, no deep nesting.

```css
.conversation-list__item,
.conversation-list__item--selected {
  display: flex;
  padding: var(--padding-badge);
  background-color: color-mix(in srgb, var(--color-green) 14%, transparent);
}
```

## 6. Configuring WebStorm

**Settings → Editor → Code Style**, on the IDE-level *Default* scheme rather than a project one, so every project inherits it.

| Page                                  | Setting                                 | Value     |
|:--------------------------------------|:----------------------------------------|:----------|
| Code Style → General                  | Hard wrap at                            | 160       |
| Code Style → General                  | Visual guides                           | 160       |
| TypeScript → Tabs and Indents         | Tab size / Indent / Continuation indent | 2 / 2 / 2 |
| TypeScript → Punctuation              | Semicolon                               | Don't use |
| TypeScript → Punctuation              | Quotes                                  | single    |
| TypeScript → Spaces → Within          | Object literal braces                   | on        |
| TypeScript → Spaces → Within          | Object literal type braces              | on        |
| TypeScript → Spaces → Within          | ES6 import/export braces                | on        |
| Style Sheets → CSS → Tabs and Indents | Tab size / Indent / Continuation indent | 2 / 2 / 2 |

`Object literal braces` and `Object literal type braces` are two separate checkboxes. Setting only one gives object values and object types different styles.

### 6.1. Pitfalls

* **Disable Indents Detection.** While the banner *"Settings may be overridden by Indents Detection"* shows, WebStorm keeps each file's existing indentation and ignores the scheme. The setting is stored per scheme, so switching schemes brings it back.
* **Reformat Code, never Cleanup Code, for a formatting commit.** Cleanup also applies inspection quick-fixes, which change code and, in a stylesheet, can drop declarations it believes redundant.
* **Invalidate caches after changing the scheme** (File → Invalidate Caches → *Invalidate and Restart*) if existing files keep the old values.
