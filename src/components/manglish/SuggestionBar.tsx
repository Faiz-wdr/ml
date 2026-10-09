import React, { useEffect, useRef } from 'react'
import type { Suggestion } from '../../core/manglish/types'
import { SuggestionItem } from './SuggestionItem'

export interface SuggestionBarProps {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelectSuggestion: (suggestion: Suggestion) => void
  position?: { top: number; left: number } | null
  className?: string
}

export const SuggestionBar: React.FC<SuggestionBarProps> = ({
  suggestions,
  selectedIndex,
  onSelectSuggestion,
  position,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into view if list is long
  useEffect(() => {
    if (!containerRef.current) return
    const selectedEl = containerRef.current.children[selectedIndex] as HTMLElement
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (suggestions.length === 0) return null

  const style: React.CSSProperties = position
    ? {
        top: `${position.top}px`,
        left: `${position.left}px`,
      }
    : {}

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Malayalam transliteration suggestions"
      style={style}
      className={`absolute z-40 min-w-[160px] sm:min-w-[180px] max-w-[240px] rounded-2xl bg-[#161616] border border-white/[0.14] shadow-[0_18px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl p-1.5 flex flex-col gap-0.5 transition-all duration-75 animate-in fade-in zoom-in-95 ${className}`}
    >
      {suggestions.map((item, idx) => (
        <SuggestionItem
          key={`${item.text}-${idx}`}
          id={`suggestion-item-${idx}`}
          suggestion={item}
          isSelected={idx === selectedIndex}
          onSelect={onSelectSuggestion}
        />
      ))}
    </div>
  )
}
