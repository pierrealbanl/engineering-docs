import { removeFrontmatter } from './frontmatter'

const calloutKinds = ['info', 'warning', 'success', 'danger', 'tip', 'note'] as const

export type CalloutKind = (typeof calloutKinds)[number]

export interface DocumentHeading {
  id: string
  level: number
  label: string
}

interface MarkdownSegment {
  kind: 'markdown' | CalloutKind
  content: string
}

const headingPattern = /^(#{2,3})\s+(.+)$/
const markdownEmphasisPattern = /[`*_]/g

function isCalloutKind(value: string): value is CalloutKind {
  return calloutKinds.some((kind) => kind === value)
}

export function createHeadingId(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(markdownEmphasisPattern, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createTextId(value: string): string {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash).toString(36)
}

function toHeading(line: string): DocumentHeading | undefined {
  const [, levelMarker, label] = line.match(headingPattern) ?? []
  if (!levelMarker || !label) return undefined
  return { id: createHeadingId(label), level: levelMarker.length, label: label.replace(markdownEmphasisPattern, '') }
}

export function extractHeadings(source: string): readonly DocumentHeading[] {
  return removeFrontmatter(source)
    .split('\n')
    .flatMap((line) => toHeading(line) ?? [])
}

export function splitMarkdown(source: string): readonly MarkdownSegment[] {
  const content = removeFrontmatter(source)
  const directive = new RegExp(`^:::(${calloutKinds.join('|')})\\s*\\n([\\s\\S]*?)\\n:::`, 'gm')
  const segments: MarkdownSegment[] = []
  let cursor = 0
  let match = directive.exec(content)

  while (match) {
    const [directiveText, kind, calloutContent] = match
    if (match.index > cursor) {
      segments.push({ kind: 'markdown', content: content.slice(cursor, match.index) })
    }
    segments.push({ kind: kind && isCalloutKind(kind) ? kind : 'note', content: calloutContent ?? '' })
    cursor = match.index + directiveText.length
    match = directive.exec(content)
  }

  if (cursor < content.length) {
    segments.push({ kind: 'markdown', content: content.slice(cursor) })
  }
  return segments
}
