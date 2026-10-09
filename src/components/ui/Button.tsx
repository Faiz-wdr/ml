import React from 'react'
import type { ButtonSize, ButtonVariant } from '../../types'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      leftIcon,
      rightIcon,
      children,
      className = '',
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A930BB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C] select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]'

    // Size variants
    const sizeStyles = {
      sm: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
      md: 'h-9 px-3.5 text-xs sm:text-sm rounded-xl gap-2',
      lg: 'h-11 px-4 text-sm rounded-xl gap-2.5',
    }[size]

    // Style variants following Black + White + Purple direction
    const variantStyles = {
      primary:
        'bg-[#A930BB] text-[#FDFDFD] hover:bg-[#BF3BD3] active:bg-[#9528A6] shadow-[0_0_16px_rgba(169,48,187,0.35)] hover:shadow-[0_0_22px_rgba(169,48,187,0.5)] border border-[#A930BB]/40',
      secondary:
        'bg-[#151515] text-[#FDFDFD] border border-white/[0.08] hover:bg-[#1C1C1C] hover:border-white/[0.16] hover:text-white',
      ghost:
        'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent',
      icon:
        'bg-[#151515] text-white/80 border border-white/[0.08] hover:bg-[#1C1C1C] hover:text-white p-0',
    }[variant]

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0 items-center justify-center">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {rightIcon && <span className="inline-flex shrink-0 items-center justify-center">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
