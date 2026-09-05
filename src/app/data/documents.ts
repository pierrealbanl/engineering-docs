import { parseFrontmatter } from '../utils/frontmatter'
import { homeDocumentId } from './routes'
import { uiContent } from './uiContent'

interface CategoryConfiguration {
  label?: string
  position?: number
}

interface ParsedDocument {
  id: string
  title: string
  shortTitle: string
  categoryId: string
  fileName: string
  position: number
  source: string
}

interface DocumentCategory {
  id: string
  title: string
  landingDocumentId?: string
}

export interface DocumentEntry {
  id: string
  title: string
  shortTitle: string
  categoryId: string
  categories: readonly DocumentCategory[]
  position: number
  source: string
}

export interface DocumentGroup {
  id: string
  title: string
  position: number
  documents: readonly DocumentEntry[]
  children: readonly DocumentGroup[]
}

type NavigationItem = { kind: 'document'; document: DocumentEntry } | { kind: 'group'; group: DocumentGroup }

const rootCategoryId = 'root'
const categoryLandingFileName = 'preambule'
const defaultPosition = 100

const markdownModules = import.meta.glob<string>('../docs/**/*.md', { eager: true, import: 'default', query: '?raw' })

const categoryModules = import.meta.glob<CategoryConfiguration>('../docs/**/_category.json', { eager: true, import: 'default' })

function toRelativePath(filePath: string): string {
  return filePath.replace(/^.*\/docs\//, '')
}

const categoryConfigurations = new Map(
  Object.entries(categoryModules).map(([filePath, configuration]) => [toRelativePath(filePath).replace(/\/_category\.json$/, ''), configuration]),
)

function createCategoryTitle(categoryId: string): string {
  const configuredLabel = categoryConfigurations.get(categoryId)?.label
  if (configuredLabel) return configuredLabel

  const directoryName = categoryId.split('/').at(-1) ?? categoryId
  return directoryName
    .split('-')
    .map((word) => word.charAt(0).toLocaleUpperCase('fr') + word.slice(1))
    .join(' ')
}

function createAncestorIds(categoryId: string): readonly string[] {
  const segments = categoryId.split('/')
  return segments.map((_, index) => segments.slice(0, index + 1).join('/'))
}

function getParentId(categoryId: string): string | undefined {
  const separatorIndex = categoryId.lastIndexOf('/')
  return separatorIndex === -1 ? undefined : categoryId.slice(0, separatorIndex)
}

function createPosition(fileName: string, title: string, frontmatterPosition?: number): number {
  if (frontmatterPosition !== undefined && Number.isFinite(frontmatterPosition)) return frontmatterPosition
  if (fileName === categoryLandingFileName) return -defaultPosition
  return Number(title.match(/^(\d+)/)?.[1] ?? defaultPosition)
}

function createDocumentId(relativePath: string, slug?: string): string {
  const normalizedSlug = slug?.replace(/^\/+|\/+$/g, '')
  return normalizedSlug ? normalizedSlug.replaceAll('/', '-') : relativePath.replaceAll('/', '-')
}

function parseDocument(filePath: string, source: string): ParsedDocument {
  const relativePath = toRelativePath(filePath).replace(/\.md$/, '')
  const pathParts = relativePath.split('/')
  const fileName = pathParts.at(-1) ?? relativePath
  const metadata = parseFrontmatter(source)
  const title = metadata.title ?? source.match(/^#\s+(.+)$/m)?.[1] ?? fileName

  return {
    id: createDocumentId(relativePath, metadata.slug),
    title,
    shortTitle: metadata.sidebarLabel ?? title,
    categoryId: pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : rootCategoryId,
    fileName,
    position: createPosition(fileName, title, metadata.sidebarPosition),
    source,
  }
}

function sortByPosition<Item extends { position: number; title: string }>(first: Item, second: Item): number {
  return first.position - second.position || first.title.localeCompare(second.title, 'fr')
}

const parsedDocuments = Object.entries(markdownModules)
  .map(([filePath, source]) => parseDocument(filePath, source))
  .sort(sortByPosition)

const landingDocumentIds = new Map(
  parsedDocuments.filter((document) => document.fileName === categoryLandingFileName).map((document) => [document.categoryId, document.id]),
)

function createCategoryPath(categoryId: string): readonly DocumentCategory[] {
  if (categoryId === rootCategoryId) return []
  return createAncestorIds(categoryId).map((id) => ({
    id,
    title: createCategoryTitle(id),
    landingDocumentId: landingDocumentIds.get(id),
  }))
}

export const documents: readonly DocumentEntry[] = parsedDocuments.map((document) => ({
  id: document.id,
  title: document.title,
  shortTitle: document.shortTitle,
  categoryId: document.categoryId,
  categories: createCategoryPath(document.categoryId),
  position: document.position,
  source: document.source,
}))

const groupIds = new Set(
  [...categoryConfigurations.keys(), ...documents.map((document) => document.categoryId)].filter((id) => id !== rootCategoryId).flatMap(createAncestorIds),
)

function createGroup(groupId: string): DocumentGroup {
  return {
    id: groupId,
    title: createCategoryTitle(groupId),
    position: categoryConfigurations.get(groupId)?.position ?? defaultPosition,
    documents: documents.filter((document) => document.categoryId === groupId),
    children: [...groupIds]
      .filter((id) => getParentId(id) === groupId)
      .map(createGroup)
      .sort(sortByPosition),
  }
}

function toNavigationPosition(item: NavigationItem): number {
  return item.kind === 'document' ? item.document.position : item.group.position
}

function toNavigationTitle(item: NavigationItem): string {
  return item.kind === 'document' ? item.document.shortTitle : item.group.title
}

export const navigationItems: readonly NavigationItem[] = [
  ...documents.filter((document) => document.categoryId === rootCategoryId).map((document): NavigationItem => ({ kind: 'document', document })),
  ...[...groupIds]
    .filter((id) => getParentId(id) === undefined)
    .map(createGroup)
    .map((group): NavigationItem => ({ kind: 'group', group })),
].sort((first, second) => toNavigationPosition(first) - toNavigationPosition(second) || toNavigationTitle(first).localeCompare(toNavigationTitle(second), 'fr'))

function requireDocument(document: DocumentEntry | undefined): DocumentEntry {
  if (!document) throw new Error(uiContent.missingDocuments)
  return document
}

const fallbackDocument = requireDocument(documents.find((document) => document.id === homeDocumentId) ?? documents[0])

export function findDocument(id: string | undefined): DocumentEntry {
  return documents.find((document) => document.id === id) ?? fallbackDocument
}
