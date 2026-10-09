import React from 'react'
import { Columns2, Rows2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Tooltip } from '../ui/Tooltip'

export interface ConversionHeaderProps {
  viewMode: 'stacked' | 'split'
  onToggleViewMode: (mode: 'stacked' | 'split') => void
  onInsertSample: () => void
  className?: string
}

export const ConversionHeader: React.FC<ConversionHeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onInsertSample,
  className = '',
}) => {
  return (
    <header className={`flex items-center justify-between gap-3 pb-3 sm:pb-4 ${className}`}>
      <div>
        <h1 className="text-base sm:text-xl font-medium tracking-tight text-[#FDFDFD]">
          Font Conversion
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onInsertSample}
          className="text-xs text-white/70 hover:text-white px-2.5 h-8"
        >
          Sample Text
        </Button>

        {/* View Layout Switcher (Stacked vs Split - desktop/tablet) */}
        <div className="hidden md:flex items-center rounded-xl bg-[#141414] p-0.5 border border-white/[0.08]">
          <Tooltip content="Stacked view">
            <button
              type="button"
              onClick={() => onToggleViewMode('stacked')}
              aria-pressed={viewMode === 'stacked'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'stacked'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/80'
              }`}
              aria-label="Stacked view"
            >
              <Rows2 className="h-3.5 w-3.5" />
            </button>
          </Tooltip>

          <Tooltip content="Side-by-side view">
            <button
              type="button"
              onClick={() => onToggleViewMode('split')}
              aria-pressed={viewMode === 'split'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/80'
              }`}
              aria-label="Side-by-side view"
            >
              <Columns2 className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
