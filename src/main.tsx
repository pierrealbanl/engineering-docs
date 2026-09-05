import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import { uiContent } from './app/data/uiContent'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error(uiContent.missingRootElement)

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
