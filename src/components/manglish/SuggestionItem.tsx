import React from 'react'
import type { Suggestion } from '../../core/manglish/types'

export interface SuggestionItemProps {
  id?: string
  suggestion: Suggestion
  isSelected: boolean
  onSelect: (suggestion: Suggestion) => void
}

export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  id,
  suggestion,
  isSelected,
  onSelect,
}) => {
  const isEnglish = /^[a-zA-Z0-9\s.,!?'-]+$/.test(suggestion.text)

  return (
    <button
      id={id}
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(suggestion)}
      className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left transition-colors duration-100 cursor-pointer select-none ${
        isSelected
          ? 'bg-[#A930BB]/25 text-white font-medium border border-[#A930BB]/40 shadow-[0_0_14px_rgba(169,48,187,0.25)]'
          : 'text-white/80 hover:bg-white/[0.06] hover:text-white border border-transparent'
      }`}
    >
      <span
        className={`tracking-normal leading-relaxed ${
          isEnglish ? 'font-mono text-xs text-white/50 group-hover:text-white/80' : 'text-base sm:text-[17px]'
        }`}
      >
        {suggestion.text}
      </span>

      {isSelected && (
        <span className="h-1.5 w-1.5 rounded-full bg-[#E68BF5] shadow-[0_0_6px_#A930BB]" />
      )}
    </button>
  )
}
