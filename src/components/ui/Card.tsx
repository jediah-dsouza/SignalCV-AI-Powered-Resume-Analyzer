import type { PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return <article className={`card ${className}`.trim()}>{children}</article>
}
