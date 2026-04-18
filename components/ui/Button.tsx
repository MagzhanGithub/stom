import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0d1a2b] hover:bg-[#2a2b3d] !text-white hover:shadow-lg ' +
    'active:scale-95 transition-all duration-150 ' +
    'disabled:!bg-slate-200 disabled:!text-slate-400 disabled:shadow-none',
  secondary:
    'bg-transparent border-2 border-brand text-brand-dark hover:bg-brand-lighter ' +
    'transition-colors duration-150',
  ghost:
    'bg-white/10 border border-white/25 text-white hover:bg-white/20 ' +
    'transition-colors duration-150',
  link:
    'bg-transparent text-text-brand hover:underline underline-offset-4 ' +
    'transition-colors duration-150 p-0',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-body',
  lg: 'px-9 py-4 text-body-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold',
        'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:hover:scale-100',
        variantClasses[variant],
        variant !== 'link' && sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
