# Naming Conventions

Defines how folders, files, CSS variables and TypeScript symbols are named. Read it before creating anything new.

## 1. Folders

* **PascalCase** for component folders: `Button/`, `Modal/`, `UserCard/`
* **kebab-case** for page and utility folders: `clients/`, `shared/`, `styles/`
* **camelCase** for data or configuration folders: `data/`, `utils/`
* A component **without subcomponents** lives directly at the root of the `components/` folder: `components/Button.tsx`
* A component **with subcomponents** lives inside a folder with the same name: `components/Modal/Modal.tsx` + `components/Modal/components/`
* Subcomponents belonging to a view are grouped inside a local `components/` folder within that view

```text
src/
├── main.tsx
└── app/
    ├── App.tsx
    ├── hooks/               # Hooks reusable across the application
    ├── styles/              # Stylesheets tied to no single component
    ├── data/                # Mock data, types, utility functions
    ├── components/          # Reusable global components
    │   ├── Button.tsx       # Simple component, no subcomponents
    │   └── Modal/           # Component with subcomponents
    │       ├── Modal.tsx
    │       ├── Modal.css
    │       └── components/
    │           └── ModalHeader.tsx
    └── pages/               # One page = one kebab-case folder
        ├── components/      # Components shared between several pages
        └── dashboard/
            ├── DashboardPage.tsx
            ├── DashboardPage.css
            └── components/
                ├── Overview/
                └── shared/  # Components shared between the page's views
                    └── styles/  # Pure utility CSS (not tied to a component)
```

## 2. Files

| Type                                  | Convention                 | Example             |
| :------------------------------------ | :------------------------- | :------------------ |
| React component                       | `PascalCase.tsx`           | `UserCard.tsx`      |
| Component CSS                         | Same name as the component | `UserCard.css`      |
| Utility CSS (not tied to a component) | `kebab-case.css`           | `chart-tooltip.css` |
| Data / utilities                      | `camelCase.ts`             | `mockData.ts`       |
| Page entry point                      | `PascalCasePage.tsx`       | `DashboardPage.tsx` |

## 3. CSS Variables

Format: `--[property]-[category]` in kebab-case. The CSS property always comes first, so every variable sharing a property groups under the same prefix.

| Property  | Category     | Variable             |
|:----------|:-------------|:---------------------|
| `color`   | `100`        | `--color-100`        |
| `spacing` | `lg`         | `--spacing-lg`       |
| `shadow`  | `popover`    | `--shadow-popover`   |
| `border`  | `surface`    | `--border-surface`   |
| `width`   | `rail`       | `--width-rail`       |
| `height`  | `table-row`  | `--height-table-row` |

The category is either a step in a scale (`lg`, `100`, `fast`) or the element the value belongs to (`card`, `rail`, `chart-area`). Never lead with the element: `--width-rail`, not `--rail-width`.

When several unrelated elements share one value, the category names what they have in common rather than any one of them. `--border-surface` draws the card outline, the rail edge and the sidebar edge: calling it `--border-card` would have described one consumer out of three, and the name would have started lying the day a second one appeared.

Reuse the vocabulary already in the stylesheet before inventing a word. `surface` was picked because `--color-surface-page`, `--color-surface-card` and `--color-surface-raised` had already established it.

### 3.1. Rule for Adding Variables

Any value used in more than one CSS file becomes a variable in the root stylesheet (`index.css`). Variables local to a single component can remain in that component's CSS file.

## 4. TypeScript: Interfaces and Types

* **PascalCase** for interfaces, types, and enums: `User`, `ApiResponse`, `Status`
* Interfaces describe a data shape: an optional suffix can be added if the name is not explicit enough (`ListItem`, `FormField`)
* Union types stay on a single line: `type Direction = 'left' | 'right' | 'center'`
* Component props use an interface named `[Component]Props` in the same file

```ts
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}
```

## 5. TypeScript: Variables and Functions

| Type                       | Convention              | Example                                     |
| :------------------------- | :---------------------- | :------------------------------------------ |
| Local variable             | `camelCase`             | `isLoading`, `activeTab`                    |
| Exported constant          | `camelCase`             | `defaultConfig`, `routes`                   |
| Utility function           | `camelCase`, verb first | `formatDate()`, `parseAmount()`             |
| React component            | `PascalCase`            | `export default function UserCard()`        |
| Event handler              | `on` or `handle` prefix | `onSubmit`, `handleClose`                   |
| Static configuration array | plural `camelCase`      | `const tabs = [...]`, `const items = [...]` |

## 6. CSS: Classes (BEM)

Format: `[block]__[element]--[modifier]`

```css
.card {}              /* block */
.card__header {}      /* element */
.card__title {}       /* element */
.card__title--large {}/* modifier */
.card--highlighted {} /* modifier applied to the block */
```

* The block corresponds to the component (`card`, `modal`, `user-list`)
* Modifiers describe a state or variant (`--active`, `--disabled`, `--large`)
* No deep CSS nesting: maximum of 2 BEM levels in a selector
