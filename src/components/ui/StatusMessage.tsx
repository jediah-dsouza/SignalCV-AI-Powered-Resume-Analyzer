import type { PropsWithChildren } from 'react'

type StatusTone = 'info' | 'success' | 'warning' | 'error'

interface StatusMessageProps extends PropsWithChildren {
  tone: StatusTone
  title: string
}

export function StatusMessage({ tone, title, children }: StatusMessageProps) {
  return (
    <div className={`status-message status-message--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  )
}
