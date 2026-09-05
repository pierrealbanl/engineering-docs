# CSS Design Tokens

Defines how design tokens are organized and named. Read it before adding a value to the root stylesheet.

## 1. Two kinds of tokens

**Generic scales** are reusable across unrelated contexts, so any component can pick a rung that fits. They're named with the `xs/sm/md/base/lg/xl/2xl/3xl/4xl` convention:

- `--font-size-*` / `--line-height-*`
- `--spacing-*` (consumed by `padding`, `margin`, and `gap` alike; it's a general-purpose space scale, not gap-specific)
- `--border-radius-sm` / `--border-radius-md`

**Specific-purpose tokens** describe one exact role. Per `docs/NAMING-CONVENTIONS.md` they still lead with the property, and the element they serve becomes the category (`--spacing-section`, `--padding-card`, `--height-navbar`, and so on). Collapsing them into a generic scale would remove information for no benefit. Each one has a single job, and a future reader should be able to tell what it's for from its name alone.

Rule of thumb: if a value is genuinely interchangeable between many unrelated components, its category is a scale step (`--spacing-lg`). If it has one specific structural job, its category is the element it belongs to (`--spacing-section`).

## 2. Word choice: spacing vs. gap vs. padding

These aren't interchangeable. Each names what the token actually does, and each one is the property half of the name:

- **spacing** for a token used across several CSS properties, whether it's a generic scale (`--spacing-*`) or a specific-purpose value (`--spacing-section` might back `gap`, `padding`, *and* `margin` depending on the component)
- **gap** for a token always consumed via the CSS `gap` property (`--gap-card-grid`)
- **padding** for one always consumed via `padding`/`padding-*` (`--padding-card`)

Pick the word that matches the property the token is actually used with, and rename it the day that stops being true.

## 3. Font-size / line-height pairing

A font-size step gets a matching line-height token (`--font-size-lg` + `--line-height-lg`) **when its text wraps**. The pair sits next to the other in the root stylesheet rather than in two separate blocks, so the relationship is visible at a glance.

Leading is a property of running text, not of every string on screen. Single-line interface text, including labels, table cells, buttons, breadcrumbs, and numbers in a card, should keep the font's natural leading. Forcing a body value like `1.6` onto it does nothing for readability and inflates every control: measured on this type scale, it adds 2px to a small label and 11px to a display number, on elements that never wrap. A dense interface can legitimately end up with almost no paired steps at all; that is the scale fitting the product, not a rule being ignored.

So: set a line-height when the text can run to a second line, and leave it alone otherwise. When a design needs a leading the scale doesn't offer, keep it as a component-local custom property rather than borrowing a mismatched rung. And a step whose line-height nobody uses should lose it. An unused token is not a promise worth keeping.

## 4. Sizing units

Sizes that belong to the design, including font sizes, spacing, radii, component widths, and heights, are declared in `rem`, so they follow the reader's browser font-size preference. The root stylesheet sets `html { font-size: 100% }`: pinning the root to `16px` would defeat the whole point, leaving every `rem` locked to a size the reader never chose.

Values that are not typographic stay in `px`, because they should not grow with the text: border widths, focus outlines, blur radii and shadow offsets, backdrop textures and the hairlines in gradients, and sentinel values such as a pill radius. Media-query breakpoints stay in `px` too. They describe the viewport, not the type.

A `rem` value carries **at most three decimals, and its last decimal is always `5`**: `0.75rem`, `1.125rem`, `2.875rem`. Whole numbers are fine too. This is a readability rule, not an arbitrary one: since 16 is a power of two, a size divides into three decimals or fewer exactly when its pixel value is even, and every such value ends in `5`. So the rule reduces to a single test: **design sizes land on even pixels**.

An odd pixel size therefore has no clean `rem` form and must move to a neighbouring even value. It sits the same distance from both, so the direction is a design decision, not arithmetic; round up unless doing so would collide with a token that is already in use. Where two steps of a scale end up on the same value, that is the scale telling you it had a redundant rung. Collapse it rather than keeping two names for one size.

## 5. Responsive tokens

Some tokens change by viewport width, typically the largest heading sizes and the major layout gaps. Each has **3 fixed steps**: mobile, tablet, and desktop, instead of a fluid formula.

The desktop value lives in the main `:root` block (it's the default/largest step). The tablet and mobile steps override the same custom properties inside two media queries, also targeting `:root`, further down the root stylesheet:

```css
:root {
    --font-size-3xl: 72px; /* desktop, the default */
}

@media (max-width: 1024px) {
    :root {
        --font-size-3xl: 56px; /* tablet / small desktop */
    }
}

@media (max-width: 600px) {
    :root {
        --font-size-3xl: 40px; /* mobile */
    }
}
```

Components never repeat this logic. They consume `var(--font-size-3xl)` once and it resizes on its own. If a new value needs to be responsive, add its steps to the root stylesheet, not as a component-local media query overriding the token. A component-local media query that redeclares a font size is the signal that a responsive token is missing.

Keep the set of breakpoints small and declare them in one place. Components that need their own breakpoint should reuse the same values rather than inventing nearby ones.

## 6. Custom properties as a component API

Beyond global tokens, a component can expose custom properties as its public styling surface:

```css
.button {
    background: var(--bg-button, #111);
    width: var(--width-button, auto);
}
```

A parent then tunes it by setting those variables, never by overriding the component's declarations from another file:

```css
@media (max-width: 560px) {
    .toolbar__action {
        --width-button: 100%;
    }
}
```

These variables are part of the component's contract: they follow the same `--[property]-[category]` format as global tokens, with the component as the category (`--bg-button`, `--width-button`). Give every one a fallback, and document them next to the rule that consumes them. A state suffix goes at the end of the category, after the component (`--bg-button-hover`).

## 7. Adding a new token

Per `docs/NAMING-CONVENTIONS.md`: a value used in more than one CSS file becomes a variable in the root stylesheet. A value used in exactly one file can stay local to that component's stylesheet. Before adding a new root token, check whether it truly belongs to an existing generic scale (extend that scale) or is genuinely single-purpose (name it after its job, following the word-choice guidance above).

Raw colors are the exception that admits no local escape hatch: every color comes from the palette in `:root`. A one-off hex buried in a component stylesheet is how a palette stops being one.
