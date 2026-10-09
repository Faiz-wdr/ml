import React from 'react'
import { Keyboard, Languages } from 'lucide-react'
import type { NavTabId } from '../../types'

export interface MobileHeaderProps {
  activeTab: NavTabId
  onSelectTab: (tab: NavTabId) => void
  onOpenSettings?: () => void
  className?: string
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  onSelectTab,
  className = '',
}) => {
  return (
    <header
      className={`md:hidden sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0C0C0C]/90 px-3.5 sm:px-4 py-2.5 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#151515] border border-white/[0.1] text-[#FDFDFD] font-semibold text-xs font-malayalam select-none">
            അ
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#FDFDFD]">
            Malayalam Converter
          </span>
        </div>

        {/* Tab Controls (Font / Manglish) */}
        <div className="flex items-center gap-1 rounded-xl bg-[#141414] p-0.5 border border-white/[0.08] shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('font')}
            aria-label="Font Conversion"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'font'
                ? 'bg-[#A930BB]/25 text-white border border-[#A930BB]/40 shadow-[0_0_12px_rgba(169,48,187,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Font</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('manglish')}
            aria-label="Manglish Typing"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'manglish'
                ? 'bg-[#A930BB]/25 text-white border border-[#A930BB]/40 shadow-[0_0_12px_rgba(169,48,187,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Manglish</span>
          </button>
        </div>
      </div>
    </header>
  )
}
