# Major principles for organizing code in a React project

Defines where a file belongs. Read it before adding a component, a hook or a stylesheet.

The front-end lives entirely under `src/app/`. Every path in this document is relative to that folder, and every rule below applies inside it.

```text
src/
├── app/        the front-end: everything this document describes
└── main.tsx    entry point, mounts app/App.tsx
```

## 1. Avoid code duplication

As soon as two parts of the codebase need the same piece of logic, TSX, or styling, a second version should not be copied: instead, create a reusable component and import it wherever needed.

The question to ask before writing code is not "where should I put this file?" but rather "who else needs what I am currently writing?". The answer to that question determines the file's location, and that is what the following sections describe.

## 2. Global components

Reserved for the application chrome: elements that frame every page and live outside the page content itself, such as the navigation bar and the footer. These live in a shared folder at the root of the front-end, outside of any specific page.

```text
app/
├── hooks/
│   └── useSession.ts
└── components/
    ├── AppHeader.tsx
    └── AppSidebar/
        ├── AppSidebar.tsx
        └── AppSidebar.css
```

## 3. Components shared between several pages

Building blocks used to compose the content of more than one page (sections, buttons, generic layouts) live in a `components/` folder at the root of `pages/`, next to the page folders. They differ from global components: they are part of the page content, not of the application chrome.

```text
app/
└── pages/
    ├── components/
    │   ├── Card.tsx
    │   └── Card.css
    └── clients/
        └── ClientsPage.tsx
```

A component only belongs in this shared folder once it is actually used by at least two different pages. The goal is not to anticipate future reuse: as long as a component is only used in one place, it remains local to that place.

## 4. Components belonging to a page or feature

Each page (or major feature) has its own folder containing:

* an entry file for the page itself (general structure and internal routing between subviews if the page contains several)
* a style file associated with this entry point
* a subfolder containing all components that only make sense for this specific page

```text
app/
└── pages/
    └── clients/
        ├── ClientsPage.tsx
        ├── ClientsPage.css
        └── components/
            └── ClientFormModal.tsx
```

A component that is only used by a single page should never live in the shared or global components folders, even if it is well designed and cleanly implemented. Its scope of use should remain visible through its location.

## 5. Subcomponents specific to a component

If a component requires a subcomponent that is only used by it, that subcomponent should be placed in a dedicated subfolder inside the parent component's folder.

```text
components/
└── ProfileCard/
    ├── ProfileCard.tsx
    └── components/
        └── ProfileAvatar.tsx
```

A component that has no private subcomponents does not need its own folder: it remains directly inside the folder that contains it, alongside its siblings.

```text
components/
├── ProfileCard/
│   ├── ProfileCard.tsx
│   └── components/
│       └── ProfileAvatar.tsx
└── SimpleBanner.tsx
```

This rule applies recursively: a subcomponent may itself have its own private subcomponents following the same logic.

## 6. Components shared between several elements of the same page

When a component, utility function, or style is used by at least two components on the same page, but neither component is its natural owner, it should be placed in a shared folder specific to that page (for example named `shared`), separate from the application's global components.

```text
pages/
└── clients/
    ├── ClientsPage.tsx
    └── components/
        ├── AssetsSection.tsx
        ├── OverviewSection.tsx
        └── shared/
            ├── StatBadge.tsx
            └── StatBadge.css
```

This shared folder may itself contain a subfolder dedicated to style files that are not associated with a component (layout classes or visual patterns reused across several different files). This avoids mixing actual components and simple stylesheets within the same folder: otherwise, one naturally expects to find a component file for every file in the folder and is surprised not to find one.

```text
shared/
├── StatBadge.tsx
├── StatBadge.css
└── styles/
    ├── layout.css
    └── table.css
```

## 7. Hooks

A hook follows the same locality rule as a component: it lives as close as possible to what consumes it.

* A hook used by a single component stays beside that component, inside its folder.
* A hook shared by several components of the same page goes in that page's `shared` folder.
* A hook that belongs to no page in particular, application state, browser APIs, anything the whole application can reuse, lives in `app/hooks/`.

```text
app/
├── hooks/
│   └── useSession.ts
└── pages/
    └── clients/
        └── components/
            └── shared/
                └── useCountUp.ts
```

A hook is not a component: it keeps its `camelCase.ts` name and never gets a `components/` subfolder of its own.

## 8. Contexts and providers

A React context and the provider that supplies it belong to the component that owns them, and live in that component's folder, split in two files: the context and its type on one side, the provider component on the other. Splitting them keeps the provider a component like any other, and lets a consumer import the context without pulling in the provider.

```text
components/
└── Session/
    ├── SessionProvider.tsx
    └── sessionContext.ts
```

The hook that reads the context follows section 7: application-wide state means the hook goes in `app/hooks/`, even though the context itself stays with its provider.

## 9. Style organization

Each component owns its own style file, imported directly by that component. A single monolithic stylesheet containing all the CSS for an entire page should be avoided.

This rule provides two benefits. First, it makes it immediately clear which class belongs to which component, without having to search through a file containing hundreds of lines. Second, it prevents dead styles from accumulating over time: when a component is removed, its style file disappears with it instead of remaining orphaned inside a global stylesheet that nobody cleans up.

Stylesheets belonging to no component in particular (layout classes, visual patterns reused across several files) live in `app/styles/`.

## 10. Example of a complete structure

```text
src/
├── main.tsx
└── app/
    ├── App.tsx
    ├── hooks/
    │   └── useSession.ts
    ├── styles/
    │   └── app.css
    ├── components/
    │   ├── StatusBadge.tsx
    │   ├── StatusBadge.css
    │   └── Session/
    │       ├── SessionProvider.tsx
    │       └── sessionContext.ts
    └── pages/
        ├── components/
        │   ├── Card.tsx
        │   └── Card.css
        └── clients/
            ├── ClientsPage.tsx
            ├── ClientsPage.css
            └── components/
                ├── AssetsSection/
                │   ├── AssetsSection.tsx
                │   ├── AssetsSection.css
                │   └── components/
                │       └── AssetRow.tsx
                ├── OverviewSection/
                │   └── OverviewSection.tsx
                └── shared/
                    ├── StatBadge.tsx
                    ├── StatBadge.css
                    └── styles/
                        └── table.css
```
