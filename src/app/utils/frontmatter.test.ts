import { describe, expect, it } from 'vitest'
import { parseFrontmatter, removeFrontmatter } from './frontmatter'

describe('removeFrontmatter', () => {
  it('removes a leading frontmatter block', () => {
    expect(removeFrontmatter('---\ntitle: A\n---\n# B')).toBe('# B')
  })

  it('leaves a document without frontmatter untouched', () => {
    expect(removeFrontmatter('# B\n\n---\n')).toBe('# B\n\n---\n')
  })

  it('only removes the block opening the document', () => {
    expect(removeFrontmatter('# B\n\n---\ntitle: A\n---\n')).toBe('# B\n\n---\ntitle: A\n---\n')
  })
})

describe('parseFrontmatter', () => {
  it('returns nothing when the document has no frontmatter', () => {
    expect(parseFrontmatter('# Titre')).toEqual({})
  })

  it('reads the four supported keys', () => {
    expect(parseFrontmatter('---\nslug: /guide\ntitle: Guide\nsidebar_label: Le guide\nsidebar_position: 3\n---\n# Guide')).toEqual({
      slug: '/guide',
      title: 'Guide',
      sidebarLabel: 'Le guide',
      sidebarPosition: 3,
    })
  })

  it('strips surrounding quotes from a value', () => {
    expect(parseFrontmatter('---\ntitle: "1. Guide"\n---').title).toBe('1. Guide')
    expect(parseFrontmatter("---\ntitle: '1. Guide'\n---").title).toBe('1. Guide')
  })

  it('keeps quotes that are inside the value', () => {
    expect(parseFrontmatter('---\ntitle: Le "vrai" guide\n---').title).toBe('Le "vrai" guide')
  })

  it('trims trailing spaces around a value', () => {
    expect(parseFrontmatter('---\ntitle:   Guide  \n---').title).toBe('Guide')
  })

  it('ignores unknown keys and malformed lines', () => {
    expect(parseFrontmatter('---\nauthor: PA\npas une entrée\ntitle: Guide\n---')).toEqual({ title: 'Guide' })
  })

  it('reads a negative position', () => {
    expect(parseFrontmatter('---\nsidebar_position: -1\n---').sidebarPosition).toBe(-1)
  })

  it('reports a non-numeric position as not a number, for the caller to reject', () => {
    expect(Number.isNaN(parseFrontmatter('---\nsidebar_position: haut\n---').sidebarPosition)).toBe(true)
  })

  it('reads a value containing a colon', () => {
    expect(parseFrontmatter('---\ntitle: Guide : les bases\n---').title).toBe('Guide : les bases')
  })
})
