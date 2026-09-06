import ReactMarkdown from 'react-markdown'
import './InlineMarkdown.css'

interface InlineMarkdownProps {
  children: string
}

export default function InlineMarkdown({ children }: InlineMarkdownProps) {
  return (
    <span className="inline-markdown">
      <ReactMarkdown allowedElements={['code', 'em', 'strong', 'del']} unwrapDisallowed>
        {children}
      </ReactMarkdown>
    </span>
  )
}
