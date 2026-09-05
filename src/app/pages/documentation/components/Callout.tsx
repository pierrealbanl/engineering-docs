import { Checkmark, Error, Idea, Information, WarningAlt } from '@carbon/icons-react'
import type { ReactNode } from 'react'
import { uiContent } from '../../../data/uiContent'
import type { CalloutKind } from '../../../utils/markdown'
import './Callout.css'

interface CalloutProps {
  children: ReactNode
  kind: CalloutKind
}

const calloutIcons: Record<CalloutKind, typeof Information> = {
  info: Information,
  warning: WarningAlt,
  success: Checkmark,
  danger: Error,
  tip: Idea,
  note: Information,
}

export default function Callout({ children, kind }: CalloutProps) {
  const Icon = calloutIcons[kind]

  return (
    <aside className={`callout callout--${kind}`} aria-label={uiContent.calloutLabels[kind]}>
      <span className="callout__symbol" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div className="callout__body">
        <strong className="callout__title">{uiContent.calloutLabels[kind]}</strong>
        {children}
      </div>
    </aside>
  )
}
