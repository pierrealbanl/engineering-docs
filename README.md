# engineering-docs

This document serves as a technical foundation designed to support progress in full-stack software development and to foster a comprehensive understanding, both practical and theoretical, of modern tools. The explanations are based on my own learning journey and reflect my personal approach to programming languages, with the goal of making the assimilation of concepts more natural and gradual.

> ⚠ The documentation is written in French.

## How to Use

To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer.
From your command line:

```bash
# Clone this repository
$ git clone https://github.com/pierrealbanl/engineering-docs.git

# Go into the repository
$ cd engineering-docs

# Install dependencies
$ npm install

# Run the development server
$ npm run dev
```

## Create or Rename a Category

A category corresponds to a directory inside `src/app/docs`. For example, the **Full Stack Development** category is created by the following directory:

```text
src/app/docs/full-stack-development/
```

Every Markdown file added to this directory automatically appears in that category:

```text
src/app/docs/
└── full-stack-development/
    ├── preambule.md
    ├── injection-dependances.md
    └── creer-et-acceder-base-de-donnees-avec-jpa.md
```

By default, the directory name is converted into a title: hyphens become spaces and each word is capitalized. Therefore, `full-stack-development` becomes **Full Stack Development**.

To define the category label and position explicitly, create a `_category.json` file inside its directory:

```json
{
  "label": "Full Stack Development",
  "position": 2
}
```

This configuration does not require any TypeScript changes. Nested categories work the same way:

```text
src/app/docs/
└── full-stack-development/
    ├── _category.json
    └── jpa/
        ├── _category.json
        └── creer-et-acceder-base-de-donnees-avec-jpa.md
```

Categories and nested categories are sorted by their `position` property, then alphabetically when that property is omitted.
