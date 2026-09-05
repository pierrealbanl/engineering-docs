import { describe, expect, it } from 'vitest'
import { documents, findDocument, navigationItems, type DocumentGroup } from './documents'
import { homeDocumentId } from './routes'

function collectGroups(items: readonly DocumentGroup[]): readonly DocumentGroup[] {
  return items.flatMap((group) => [group, ...collectGroups(group.children)])
}

const allGroups = collectGroups(navigationItems.flatMap((item) => (item.kind === 'group' ? [item.group] : [])))

describe('documents', () => {
  it('discovers every Markdown file under src/docs', () => {
    expect(documents.length).toBeGreaterThan(0)
  })

  it('gives every document a unique id', () => {
    expect(new Set(documents.map((document) => document.id)).size).toBe(documents.length)
  })

  it('keeps the frontmatter title out of the rendered source id', () => {
    const home = findDocument(homeDocumentId)
    expect(home.source.startsWith('---')).toBe(true)
    expect(home.title).not.toContain('---')
  })

  it('builds a breadcrumb whose last entry is the document own category', () => {
    for (const document of documents.filter((entry) => entry.categoryId !== 'root')) {
      expect(document.categories.at(-1)?.id).toBe(document.categoryId)
    }
  })
})

describe('findDocument', () => {
  it('returns the requested document', () => {
    const target = documents[documents.length - 1]
    expect(findDocument(target?.id).id).toBe(target?.id)
  })

  it('falls back to the home document for an unknown id', () => {
    expect(findDocument('does-not-exist').id).toBe(homeDocumentId)
  })

  it('falls back to the home document when no id is given', () => {
    expect(findDocument(undefined).id).toBe(homeDocumentId)
  })
})

describe('navigationItems', () => {
  it('is sorted by position', () => {
    const positions = navigationItems.map((item) => (item.kind === 'document' ? item.document.position : item.group.position))
    expect(positions).toEqual([...positions].sort((first, second) => first - second))
  })

  it('starts with the home document', () => {
    expect(navigationItems[0]).toEqual({ kind: 'document', document: findDocument(homeDocumentId) })
  })

  it('lists every non-root document exactly once across the group tree', () => {
    const grouped = allGroups.flatMap((group) => group.documents.map((document) => document.id))
    const expected = documents.filter((document) => document.categoryId !== 'root').map((document) => document.id)
    expect([...grouped].sort()).toEqual([...expected].sort())
  })

  it('sorts the documents of every group by position', () => {
    for (const group of allGroups) {
      const positions = group.documents.map((document) => document.position)
      expect(positions).toEqual([...positions].sort((first, second) => first - second))
    }
  })

  it('links every category with a landing page to that page', () => {
    for (const document of documents) {
      for (const category of document.categories) {
        const landing = category.landingDocumentId
        if (landing) expect(findDocument(landing).categoryId).toBe(category.id)
      }
    }
  })
})
