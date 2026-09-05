import { useEffect, useState } from 'react'
import { uiContent } from '../../../data/uiContent'
import type { DocumentHeading } from '../../../utils/markdown'
import './TableOfContents.css'

interface TableOfContentsProps {
  headings: readonly DocumentHeading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeHeadingId, setActiveHeadingId] = useState(headings[0]?.id ?? '')
  const currentHeadingId = headings.some((heading) => heading.id === activeHeadingId) ? activeHeadingId : (headings[0]?.id ?? '')
  const getLinkClassName = (heading: DocumentHeading) =>
    [heading.level === 3 ? 'table-of-contents__link--nested' : '', currentHeadingId === heading.id ? 'table-of-contents__link--active' : ''].join(' ')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting)
        if (visibleHeading) setActiveHeadingId(visibleHeading.target.id)
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  const navigateToHeading = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: 'smooth' })
    setActiveHeadingId(headingId)
  }

  return (
    <aside className="table-of-contents" aria-label={uiContent.onThisPage}>
      <h2>{uiContent.onThisPage}</h2>
      <nav>
        {headings.map((heading) => (
          <button
            className={getLinkClassName(heading)}
            type="button"
            key={heading.id}
            onClick={() => navigateToHeading(heading.id)}
            aria-current={currentHeadingId === heading.id ? 'location' : undefined}
          >
            {heading.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
