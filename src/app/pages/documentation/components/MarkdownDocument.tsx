import { Children, cloneElement, Fragment, isValidElement, lazy, Suspense, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { uiContent } from '../../../data/uiContent'
import { createHeadingId, createTextId, splitMarkdown } from '../../../utils/markdown'
import Callout from './Callout'
import CodeBlock from './CodeBlock'
import './MarkdownDocument.css'

const lineBreakPattern = /<br\s*\/?>/i
const fenceTitlePattern = /title="([^"]+)"/

const MermaidDiagram = lazy(() => import('./MermaidDiagram'))

interface MarkdownDocumentProps {
  source: string
}

function flattenText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return flattenText(node.props.children)
  return ''
}

function readFenceTitle(meta: unknown): string | undefined {
  if (typeof meta !== 'string') return undefined
  return meta.match(fenceTitlePattern)?.[1]
}

function createHeadingIdFromChildren(children: ReactNode): string {
  return createHeadingId(flattenText(children))
}

function withLineBreaks(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      const lines = child.split(lineBreakPattern)
      if (lines.length === 1) return child
      return lines.map((line, index) => (
        <Fragment key={createTextId(`${index}-${line}`)}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children !== undefined) {
      return cloneElement(child, undefined, withLineBreaks(child.props.children))
    }
    return child
  })
}

const markdownComponents: Components = {
  h1: ({ children }) => <h1 id={createHeadingIdFromChildren(children)}>{children}</h1>,
  h2: ({ children }) => <h2 id={createHeadingIdFromChildren(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={createHeadingIdFromChildren(children)}>{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {children}
    </a>
  ),
  p: ({ children }) => <p>{withLineBreaks(children)}</p>,
  li: ({ children }) => <li>{withLineBreaks(children)}</li>,
  th: ({ children, style }) => <th style={style}>{withLineBreaks(children)}</th>,
  td: ({ children, style }) => <td style={style}>{withLineBreaks(children)}</td>,
  pre: ({ children, node }) => {
    const codeNode = node?.children[0]
    if (codeNode?.type !== 'element' || codeNode.tagName !== 'code') return <pre>{children}</pre>
    const classNames = codeNode.properties.className
    const languageClass = Array.isArray(classNames) ? classNames.find((value) => String(value).startsWith('language-')) : undefined
    const languageName = String(languageClass ?? '').replace('language-', '')
    const code = flattenText(children).replace(/\n$/, '')

    if (languageName === 'mermaid') {
      return (
        <Suspense fallback={<pre className="markdown-document__code-loading">{uiContent.diagramLoading}</pre>}>
          <MermaidDiagram definition={code} />
        </Suspense>
      )
    }
    return <CodeBlock code={code} languageName={languageName} title={readFenceTitle(codeNode.data?.meta)} />
  },
}

function renderMarkdown(content: string): ReactNode {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  )
}

export default function MarkdownDocument({ source }: MarkdownDocumentProps) {
  return (
    <div className="markdown-document">
      {splitMarkdown(source).map((segment, index) => {
        const key = createTextId(`${index}-${segment.content}`)
        if (segment.kind === 'markdown') return <div key={key}>{renderMarkdown(segment.content)}</div>
        return (
          <Callout key={key} kind={segment.kind}>
            {renderMarkdown(segment.content)}
          </Callout>
        )
      })}
    </div>
  )
}
