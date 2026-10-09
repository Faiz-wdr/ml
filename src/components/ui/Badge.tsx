import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'subtle' | 'outline'
  size?: 'xs' | 'sm' | 'md'
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }[size]

  const variantStyles = {
    default: 'bg-white/[0.04] text-white/80 border border-white/[0.08]',
    accent:
      'bg-[#A930BB]/15 text-[#E68BF5] border border-[#A930BB]/35 shadow-[0_0_10px_-2px_rgba(169,48,187,0.3)]',
    subtle: 'bg-white/[0.02] text-white/50 border border-white/[0.04]',
    outline: 'bg-transparent text-white/70 border border-white/[0.12]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide select-none ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
      {children}
    </span>
  )
}
