import React, { useEffect, useRef, useState } from 'react'

export interface DropdownItem {
  id: string
  label: string
  description?: string
  badge?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface DropdownProps {
  items: DropdownItem[]
  selectedId: string
  onSelect: (id: string) => void
  triggerLabel?: string
  className?: string
  align?: 'left' | 'right'
  direction?: 'up' | 'down' | 'auto'
  variant?: 'default' | 'badge'
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedId,
  onSelect,
  className = '',
  align = 'left',
  direction = 'up',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [computedDirection, setComputedDirection] = useState<'up' | 'down'>('up')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((i) => i.id === selectedId) || items[0]

  useEffect(() => {
    if (!isOpen) return

    const calculatePlacement = () => {
      if (direction === 'up') {
        setComputedDirection('up')
        return
      }
      if (direction === 'down') {
        setComputedDirection('down')
        return
      }

      // Auto placement based on viewport boundaries
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top

        // If space below is constrained (< 180px) or space above is greater, open upwards
        if (spaceBelow < 180 || spaceAbove > spaceBelow) {
          setComputedDirection('up')
        } else {
          setComputedDirection('down')
        }
      }
    }

    calculatePlacement()
  }, [isOpen, direction])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const isUp = computedDirection === 'up'

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={
          variant === 'badge'
            ? 'group inline-flex items-center gap-1.5 rounded-full bg-[#A930BB]/15 px-2.5 py-0.5 text-xs font-medium text-[#E68BF5] border border-[#A930BB]/40 hover:border-[#A930BB]/70 hover:bg-[#A930BB]/25 shadow-[0_0_10px_-2px_rgba(169,48,187,0.3)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A930BB] cursor-pointer select-none'
            : 'group inline-flex items-center gap-2 rounded-xl bg-[#151515] px-3 py-1.5 text-xs font-medium text-white/90 border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#1A1A1A] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A930BB] cursor-pointer'
        }
      >
        <span className={variant === 'badge' ? 'font-medium text-[#E68BF5]' : 'font-semibold text-white'}>
          {selectedItem?.label}
        </span>
        {selectedItem?.badge && (
          <span className="rounded-full bg-[#A930BB]/20 px-1.5 py-0.2 text-[10px] text-[#E68BF5] border border-[#A930BB]/30">
            {selectedItem.badge}
          </span>
        )}
        <svg
          className={`transition-transform duration-200 ${
            variant === 'badge'
              ? 'h-3 w-3 text-[#E68BF5]/60 group-hover:text-[#E68BF5]'
              : 'h-3.5 w-3.5 text-white/40 group-hover:text-white/70'
          } ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 min-w-[170px] max-w-xs rounded-2xl bg-[#141414] p-1.5 border border-white/[0.1] backdrop-blur-xl transition-all ${
            isUp
              ? 'bottom-full mb-2 shadow-[0_-16px_36px_rgba(0,0,0,0.7)]'
              : 'top-full mt-2 shadow-[0_16px_36px_rgba(0,0,0,0.7)]'
          } ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item) => {
            const isSelected = item.id === selectedId
            return (
              <button
                key={item.id}
                role="option"
                aria-selected={isSelected}
                disabled={item.disabled}
                onClick={() => {
                  onSelect(item.id)
                  setIsOpen(false)
                }}
                className={`group flex w-full flex-col items-start rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? 'bg-[#A930BB]/15 text-white border border-[#A930BB]/30 shadow-[0_0_12px_-2px_rgba(169,48,187,0.3)]'
                    : 'text-white/70 hover:bg-white/[0.05] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={`font-medium ${isSelected ? 'text-white font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A930BB] shadow-[0_0_6px_#A930BB]" />
                  )}
                  {item.badge && !isSelected && (
                    <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/50">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <span className="mt-0.5 text-[11px] text-white/40 group-hover:text-white/60">
                    {item.description}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
