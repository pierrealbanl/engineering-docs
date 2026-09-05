export const homeDocumentId = 'preambule'

const documentRoutePattern = /^#\/docs\/([^/]+)/

export function createDocumentRoute(documentId: string): string {
  return `#/docs/${documentId}`
}

export function readDocumentIdFromHash(hash: string): string | undefined {
  return hash.match(documentRoutePattern)?.[1]
}
