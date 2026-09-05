import { useMemo } from 'react'
import type { DocumentEntry } from '../../data/documents'
import { createDocumentRoute } from '../../data/routes'
import { uiContent } from '../../data/uiContent'
import { extractHeadings } from '../../utils/markdown'
import MarkdownDocument from './components/MarkdownDocument'
import TableOfContents from './components/TableOfContents'
import './DocumentationPage.css'

interface DocumentationPageProps {
  document: DocumentEntry
}

export default function DocumentationPage({ document }: DocumentationPageProps) {
  const headings = useMemo(() => extractHeadings(document.source), [document.source])

  return (
    <>
      <main className="documentation-page" id="main-content" tabIndex={-1}>
        <nav className="documentation-page__breadcrumb" aria-label={uiContent.breadcrumbLabel}>
          {document.categories.map((category) => (
            <span key={category.id}>
              {category.landingDocumentId ? <a href={createDocumentRoute(category.landingDocumentId)}>{category.title}</a> : category.title}
              <span className="documentation-page__breadcrumb-separator" aria-hidden="true">
                /
              </span>
            </span>
          ))}
          <span aria-current="page">{document.shortTitle}</span>
        </nav>
        <MarkdownDocument source={document.source} />
      </main>
      <TableOfContents headings={headings} />
    </>
  )
}
