import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <button type="button" className={`icon-button ${className}`.trim()} aria-label={label} {...props}>
      {children}
    </button>
  )
}
