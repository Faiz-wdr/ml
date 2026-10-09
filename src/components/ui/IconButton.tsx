import React from 'react'
import type { ButtonSize, ButtonVariant } from '../../types'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  'aria-label': string
  variant?: ButtonVariant
  size?: ButtonSize
  tooltip?: string
  active?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'secondary',
      size = 'md',
      tooltip,
      active = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'w-7 h-7 text-xs rounded-lg',
      md: 'w-9 h-9 text-sm rounded-xl',
      lg: 'w-11 h-11 text-base rounded-xl',
    }[size]

    const variantStyles = {
      primary:
        'bg-[#A930BB] text-white hover:bg-[#BF3BD3] shadow-[0_0_14px_rgba(169,48,187,0.4)] border border-[#A930BB]',
      secondary:
        'bg-[#151515] text-white/80 border border-white/[0.08] hover:bg-[#1D1D1D] hover:border-white/[0.18] hover:text-white',
      ghost:
        'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.08] border border-transparent',
      icon:
        'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent',
      danger:
        'bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 hover:text-red-200',
    }[variant]

    const activeStyles = active
      ? 'bg-[#A930BB]/20 text-white border-[#A930BB]/50 shadow-[0_0_12px_rgba(169,48,187,0.3)]'
      : ''

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        disabled={disabled}
        className={`inline-flex items-center justify-center transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A930BB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 active:scale-[0.95] ${sizeStyles} ${variantStyles} ${activeStyles} ${className}`}
        {...props}
      >
        <span className="inline-flex items-center justify-center leading-none">{icon}</span>
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
