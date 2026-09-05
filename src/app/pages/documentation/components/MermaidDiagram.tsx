import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'
import { uiContent } from '../../../data/uiContent'
import { useTheme } from '../../../hooks/useTheme'
import './MermaidDiagram.css'

interface MermaidDiagramProps {
  definition: string
}

export default function MermaidDiagram({ definition }: MermaidDiagramProps) {
  const reactId = useId()
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`
  const theme = useTheme()
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: theme === 'dark' ? 'dark' : 'neutral' })
    mermaid
      .render(diagramId, definition)
      .then(({ svg: renderedSvg }) => {
        if (isCurrent) setSvg(renderedSvg)
      })
      .catch(() => {
        if (isCurrent) setError(uiContent.diagramError)
      })
    return () => {
      isCurrent = false
    }
  }, [definition, diagramId, theme])

  if (error) return <p className="mermaid-diagram mermaid-diagram--error">{error}</p>
  return <div className="mermaid-diagram" role="img" aria-label={uiContent.diagramLabel} dangerouslySetInnerHTML={{ __html: svg }} />
}
