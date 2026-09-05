import { Checkmark, Copy } from '@carbon/icons-react'
import { useEffect, useState } from 'react'
import { uiContent } from '../../../data/uiContent'
import './CodeBlock.css'

interface CodeBlockProps {
  code: string
  languageName: string
  title?: string
}

const copyFeedbackDuration = 1800

export default function CodeBlock({ code, languageName, title }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timeout = window.setTimeout(() => setIsCopied(false), copyFeedbackDuration)
    return () => window.clearTimeout(timeout)
  }, [isCopied])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        {title ? (
          <span className="code-block__name">{title}</span>
        ) : (
          <span className="code-block__name code-block__name--language">{languageName || uiContent.defaultLanguage}</span>
        )}
        <button type="button" onClick={copyCode}>
          {isCopied ? <Checkmark size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {isCopied ? uiContent.copiedCode : uiContent.copyCode}
        </button>
        <span className="code-block__status" role="status">
          {isCopied ? uiContent.copiedCode : ''}
        </span>
      </div>
      <pre className="code-block__pre" tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
