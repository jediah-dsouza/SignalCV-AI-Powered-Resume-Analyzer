import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'small' | 'medium'
}

export function Button({ variant = 'primary', size = 'medium', className = '', ...props }: ButtonProps) {
  return <button className={`button button--${variant} button--${size} ${className}`.trim()} {...props} />
}
