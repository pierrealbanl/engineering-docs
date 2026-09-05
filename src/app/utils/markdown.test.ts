import { describe, expect, it } from 'vitest'
import { createHeadingId, createTextId, extractHeadings, splitMarkdown } from './markdown'

describe('createHeadingId', () => {
  it('strips accents, markdown emphasis and punctuation', () => {
    expect(createHeadingId('1.3. Le polymorphisme : `héritage`')).toBe('1-3-le-polymorphisme-heritage')
  })

  it('never starts or ends with a separator', () => {
    expect(createHeadingId('— Préambule —')).toBe('preambule')
  })

  it('gives the same id to a heading written with or without emphasis', () => {
    expect(createHeadingId('Titre avec `du code`')).toBe(createHeadingId('Titre avec du code'))
  })
})

describe('createTextId', () => {
  it('is stable for the same input', () => {
    expect(createTextId('const a = 1')).toBe(createTextId('const a = 1'))
  })

  it('separates different inputs', () => {
    expect(createTextId('const a = 1')).not.toBe(createTextId('const a = 2'))
  })
})

describe('extractHeadings', () => {
  it('reads level 2 and level 3 headings only', () => {
    const headings = extractHeadings('# Titre\n\n## Un\n\n### Deux\n\n#### Trois')
    expect(headings).toEqual([
      { id: 'un', level: 2, label: 'Un' },
      { id: 'deux', level: 3, label: 'Deux' },
    ])
  })

  it('ignores frontmatter keys that look like headings', () => {
    expect(extractHeadings('---\ntitle: ## Faux\n---\n\n## Vrai')).toEqual([{ id: 'vrai', level: 2, label: 'Vrai' }])
  })

  it('produces the id the renderer puts on the heading element', () => {
    const [heading] = extractHeadings('## Titre avec `du code` et **du gras**')
    expect(heading?.id).toBe(createHeadingId('Titre avec du code et du gras'))
  })
})

describe('splitMarkdown', () => {
  it('returns a single markdown segment when there is no directive', () => {
    expect(splitMarkdown('Texte simple')).toEqual([{ kind: 'markdown', content: 'Texte simple' }])
  })

  it('splits a directive out of the surrounding markdown', () => {
    expect(splitMarkdown('Avant\n\n:::warning\nAttention\n:::\n\nAprès')).toEqual([
      { kind: 'markdown', content: 'Avant\n\n' },
      { kind: 'warning', content: 'Attention' },
      { kind: 'markdown', content: '\n\nAprès' },
    ])
  })

  it('keeps consecutive directives separate', () => {
    const segments = splitMarkdown(':::tip\nUn\n:::\n:::danger\nDeux\n:::')
    expect(segments.map((segment) => segment.kind)).toEqual(['tip', 'markdown', 'danger'])
  })

  it('leaves an unknown directive inside the markdown', () => {
    expect(splitMarkdown(':::unknown\nTexte\n:::')).toEqual([{ kind: 'markdown', content: ':::unknown\nTexte\n:::' }])
  })
})
