import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import MarkdownDocument from './MarkdownDocument'

describe('MarkdownDocument code blocks', () => {
  it.each(['', 'text', 'js'])('preserves lines and indentation in a fenced block with language "%s"', (language) => {
    const html = renderToStaticMarkup(<MarkdownDocument source={'```' + language + '\nfirst line\n  second line\n\nlast line\n```'} />)
    expect(html).toContain('<pre class="code-block__pre" tabindex="0"><code>first line\n  second line\n\nlast line</code></pre>')
  })

  it('keeps inline code inside its paragraph', () => {
    const html = renderToStaticMarkup(<MarkdownDocument source="Use `some code` here." />)
    expect(html).toContain('<p>Use <code>some code</code> here.</p>')
    expect(html).not.toContain('<pre')
  })

  it('preserves fence titles', () => {
    const html = renderToStaticMarkup(<MarkdownDocument source={'```js title="example.js"\nconst value = 1\n```'} />)
    expect(html).toContain('<span class="code-block__name">example.js</span>')
  })
})
