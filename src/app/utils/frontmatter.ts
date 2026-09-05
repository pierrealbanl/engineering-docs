interface Frontmatter {
  slug?: string
  title?: string
  sidebarLabel?: string
  sidebarPosition?: number
}

const frontmatterBlockPattern = /^---\n([\s\S]*?)\n---\n?/
const frontmatterEntryPattern = /^([a-zA-Z0-9_-]+):\s*(.*?)\s*$/
const surroundingQuotesPattern = /^['"]|['"]$/g

export function removeFrontmatter(source: string): string {
  return source.replace(frontmatterBlockPattern, '')
}

export function parseFrontmatter(source: string): Frontmatter {
  const block = source.match(frontmatterBlockPattern)?.[1]
  if (!block) return {}

  const metadata: Frontmatter = {}
  for (const line of block.split('\n')) {
    const [, key, rawValue] = line.match(frontmatterEntryPattern) ?? []
    if (!key || rawValue === undefined) continue
    const value = rawValue.replace(surroundingQuotesPattern, '')
    if (key === 'slug') metadata.slug = value
    if (key === 'title') metadata.title = value
    if (key === 'sidebar_label') metadata.sidebarLabel = value
    if (key === 'sidebar_position') metadata.sidebarPosition = Number(value)
  }
  return metadata
}
