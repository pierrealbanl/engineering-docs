import { ArrowRight, ArrowUpRight, Close, Search } from '@carbon/icons-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { documents } from '../../data/documents'
import { uiContent } from '../../data/uiContent'
import { removeFrontmatter } from '../../utils/frontmatter'
import './SearchDialog.css'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (documentId: string) => void
}

const searchableDocuments = documents.map((document) => ({
  document,
  haystack: `${document.title} ${removeFrontmatter(document.source)}`.toLocaleLowerCase('fr'),
}))

export default function SearchDialog({ isOpen, onClose, onNavigate }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    if (!normalizedQuery) return searchableDocuments
    return searchableDocuments.filter((entry) => entry.haystack.includes(normalizedQuery))
  }, [query])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const closeDialog = () => {
    setQuery('')
    onClose()
  }

  const clearSearch = () => setQuery('')

  return (
    <dialog className="search-dialog" ref={dialogRef} onClose={closeDialog} onCancel={onClose}>
      <div className="search-dialog__field">
        <Search size={16} aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && query) {
              event.preventDefault()
              event.stopPropagation()
              clearSearch()
            }
          }}
          placeholder={uiContent.searchPlaceholder}
          aria-label={uiContent.search}
        />
        {query && (
          <button type="button" onClick={clearSearch} aria-label={uiContent.clearSearch}>
            <Close size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="search-dialog__count" aria-live="polite">
        {results.length} {uiContent.resultCount}
      </p>
      <div className="search-dialog__results">
        {results.map(({ document }) => (
          <button
            type="button"
            key={document.id}
            onClick={() => {
              onNavigate(document.id)
              closeDialog()
            }}
          >
            <ArrowUpRight size={16} aria-hidden="true" />
            <span>
              <strong>{document.shortTitle}</strong>
              <small>{document.categories.at(-1)?.title ?? uiContent.rootCategory}</small>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ))}
        {results.length === 0 && <p className="search-dialog__empty">{uiContent.noResults}</p>}
      </div>
    </dialog>
  )
}
