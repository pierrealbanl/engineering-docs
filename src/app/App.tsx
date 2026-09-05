import { useEffect, useState } from 'react'
import AppHeader from './components/AppHeader/AppHeader'
import SearchDialog from './components/SearchDialog/SearchDialog'
import Sidebar from './components/Sidebar/Sidebar'
import { findDocument } from './data/documents'
import { createDocumentRoute, readDocumentIdFromHash } from './data/routes'
import { uiContent } from './data/uiContent'
import { readStoredTheme, storeTheme, themeContext } from './hooks/useTheme'
import DocumentationPage from './pages/documentation/DocumentationPage'
import './App.css'

export default function App() {
  const [activeDocument, setActiveDocument] = useState(() => findDocument(readDocumentIdFromHash(window.location.hash)))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    const updateDocumentFromHash = () => {
      setActiveDocument(findDocument(readDocumentIdFromHash(window.location.hash)))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', updateDocumentFromHash)
    return () => window.removeEventListener('hashchange', updateDocumentFromHash)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    storeTheme(theme)
  }, [theme])

  useEffect(() => {
    document.title = `${activeDocument.shortTitle} — ${uiContent.siteName}`
  }, [activeDocument])

  useEffect(() => {
    const openSearchWithShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', openSearchWithShortcut)
    return () => window.removeEventListener('keydown', openSearchWithShortcut)
  }, [])

  const navigateToDocument = (documentId: string) => {
    window.location.hash = createDocumentRoute(documentId)
    setIsSidebarOpen(false)
  }

  return (
    <themeContext.Provider value={theme}>
      <div className="app-shell">
        <a className="app-shell__skip-link" href="#main-content">
          {uiContent.skipToContent}
        </a>
        <AppHeader
          isDark={theme === 'dark'}
          onOpenNavigation={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <div className="app-shell__layout">
          <Sidebar activeDocumentId={activeDocument.id} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={navigateToDocument} />
          <DocumentationPage document={activeDocument} />
        </div>
        <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={navigateToDocument} />
      </div>
    </themeContext.Provider>
  )
}
