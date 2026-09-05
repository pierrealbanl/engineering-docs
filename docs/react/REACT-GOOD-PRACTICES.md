# React Good Practices

Defines how React, TypeScript, CSS and accessibility are written. Read it before implementing a feature.

## 1. Components

* **Favor composition.** Generic components receive their content through `children` (or slots via props) instead of accumulating configuration props. A section wrapper, a button, or a split layout should not know what it contains.
* **Variants live inside the component.** A visual variant is a prop mapped to a BEM modifier (`ghost` → `.button--ghost`), declared in the component's own CSS. Never restyle a shared component from the outside by overriding its classes in another file.
* **One component, one responsibility.** When a component grows a distinct concern (a decorative background, a scroll-driven panel), extract it into a subcomponent rather than letting the parent grow.
* **Stable keys.** Use a meaningful identifier as `key` (an `id` field, a title, a question), never the array index.
* **Presentation follows data, not position.** A component must not branch on an item's index to decide how to render it (`index === 2`). The variant belongs to the item in the data.

## 2. State and logic

* **Store the minimum, derive the rest.** Anything computable from props or existing state is computed at render time, not duplicated in another `useState`.
* **Reusable browser logic goes into custom hooks** (`useMediaQuery`, `useScrollProgress`). A hook owns its listeners and always removes them in the effect cleanup.
* **Scroll and resize work is throttled** with `requestAnimationFrame` (one pending frame at a time) and listeners are registered with `{ passive: true }` when they never call `preventDefault`.
* **Guard state updates.** Setters called from high-frequency events bail out early when the value has not meaningfully changed, to avoid useless re-renders.
* **Measure defensively.** Code that reads layout (`getBoundingClientRect`, `innerHeight`) runs before styles settle and on viewport sizes you did not anticipate. Clamp derived values so a degenerate measurement cannot produce an invalid argument.

## 3. Content and configuration

* **No copy in JSX.** All user-facing text lives in content modules exported `as const`; components only consume it. Renaming a sentence never touches a component.
* **No assets in JSX either.** Image and icon paths belong in the same content or configuration modules, next to the text they illustrate.
* **Routes are declared once** in a dedicated module and imported everywhere. No hardcoded URL strings in components. A typo becomes a compile-time error instead of a dead link.
* **No parallel arrays coupled by index.** When an item needs both content and assets (icon, image, href), they live together in one object. Never put them in two arrays that must stay aligned by position, and never in a lookup array read as `icons[0]`, `icons[1]`. Give the entries names.
* **Bind columns to fields.** When a table header list and a row shape must line up, express the binding in the data (`{ key: 'amount', label: 'Amount' }`) instead of relying on two lists staying in the same order.

## 4. TypeScript

* **Zero escape hatches.** No `any`, no `@ts-ignore`, no type assertions (`as X`); `as const` on data literals is the only allowed cast. If the types fight you, fix the model. A user-defined type guard (`value is Language`) replaces most assertions.
* **Props are typed with an interface named `[Component]Props`** in the same file. Optional props get defaults in the destructuring.
* **Accept `readonly` collections** (`readonly string[]`) so components work with `as const` data without copying.
* **Type custom properties by extending `CSSProperties`** rather than casting an object literal:

```ts
interface ProgressStyle extends CSSProperties {
  '--progress': number
}
```

## 5. CSS

* **Design tokens first.** Colors, spacing, radii, typography, and animation timings are CSS variables in `:root`. A raw value appearing in two files becomes a token (see `docs/NAMING-CONVENTIONS.md`).
* **One unique BEM block per component.** Two components must never share a block name, even across pages. All CSS is bundled globally, so `.card` defined twice is a silent collision. Prefix when in doubt (`product-card`, `profile-card`).
* **Animations are utilities, not copies.** When several components share an animation, it lives once as a utility class or shared keyframes that components parameterize; never duplicate keyframes or opacity/transform boilerplate.
* **Custom properties as a styling API.** Parents tune a child's behavior by setting a custom property (e.g. a `--delay` or `--progress` value), not by overriding its declarations.
* **One shared rule beats N component copies.** When several components declare the same block of typography, extract it into a shared class with modifiers for the differences rather than repeating the declarations.

## 6. Accessibility

* **Respect `prefers-reduced-motion` globally.** One rule in the root stylesheet neutralizes all animations and transitions; components never re-implement it locally.
* **Meaningful `alt` or empty `alt`.** Informative images get a real description; decorative ones get `alt=""`. Never a filename.
* **State is announced.** Expandable widgets carry `aria-expanded` and `aria-controls`; icon-only controls carry a descriptive `aria-label`, never a bare number; the active item in a set carries `aria-current`; dynamic visuals use `aria-live` when their change matters.
* **Heading levels follow the document outline.** A heading nested inside a titled section steps down a level; never pick a level for its size.
* **Buttons are `type="button"`** unless they submit a form, and every interactive element remains focusable with a visible `:focus-visible` style.

## 7. Quality gates

* **`tsc`, `eslint`, and the production build must pass at all times.** A change is not done until all three are green.
* **Green gates are not proof it works.** A change that alters what the user sees is verified by running the app and looking at the result, not by the type-checker alone.
* **Dead code is removed immediately**: unused exports, variables, CSS rules, assets, and props are deleted in the same change that orphans them, not "later". A prop no caller passes is dead code, even when it has a default.
