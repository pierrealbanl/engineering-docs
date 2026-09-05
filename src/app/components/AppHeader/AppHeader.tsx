import { Light, Menu, Moon, Search } from '@carbon/icons-react'
import { createDocumentRoute, homeDocumentId } from '../../data/routes'
import { uiContent } from '../../data/uiContent'
import './AppHeader.css'

interface AppHeaderProps {
  isDark: boolean
  onOpenNavigation: () => void
  onOpenSearch: () => void
  onToggleTheme: () => void
}

export default function AppHeader({ isDark, onOpenNavigation, onOpenSearch, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="app-header__icon app-header__menu" type="button" onClick={onOpenNavigation} aria-label={uiContent.openNavigation}>
        <Menu size={20} aria-hidden="true" />
      </button>
      <a className="app-header__brand" href={createDocumentRoute(homeDocumentId)}>
        <span>
          <strong>{uiContent.brandEmphasis}</strong> {uiContent.brandPlain}
        </span>
      </a>
      <div className="app-header__actions">
        <button className="app-header__search" type="button" onClick={onOpenSearch} aria-haspopup="dialog">
          <Search size={16} aria-hidden="true" />
          <span>{uiContent.search}</span>
        </button>
        <button className="app-header__icon" type="button" onClick={onToggleTheme} aria-label={uiContent.changeTheme} aria-pressed={isDark}>
          {isDark ? <Light size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
