import React from 'react'
import { Languages, Keyboard, Settings } from 'lucide-react'
import type { NavTabId } from '../../types'
import { Tooltip } from '../ui/Tooltip'

export interface SidebarProps {
  activeTab: NavTabId
  onSelectTab: (tab: NavTabId) => void
  onOpenSettings?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  className = '',
}) => {
  return (
    <aside
      aria-label="Primary navigation"
      className={`hidden md:flex flex-col items-center justify-between w-16 py-6 my-auto rounded-[32px] bg-[#111111]/90 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl h-[420px] select-none ${className}`}
    >
      {/* Top: Brand Logo / Minimal Glyph */}
      <div className="flex flex-col items-center">
        <Tooltip content="Malayalam Converter" position="right">
          <button
            type="button"
            onClick={() => onSelectTab('font')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#161616] border border-white/[0.1] text-white hover:border-[#A930BB]/50 transition-all duration-200 cursor-pointer group"
            aria-label="Malayalam Converter Home"
          >
            {/* Elegant Malayalam Unicode glyph "അ" as the logo */}
            <span className="font-semibold text-base tracking-tighter text-[#FDFDFD] group-hover:text-[#E68BF5] transition-colors">
              അ
            </span>
          </button>
        </Tooltip>
      </div>

      {/* Middle: Navigation Items */}
      <nav className="flex flex-col items-center gap-3 w-full px-2">
        {/* Font Conversion Navigation */}
        <div className="relative flex items-center justify-center w-full">
          <Tooltip content="Font Conversion" position="right">
            <button
              type="button"
              onClick={() => onSelectTab('font')}
              aria-label="Font Conversion"
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 cursor-pointer ${
                activeTab === 'font'
                  ? 'bg-[#A930BB]/20 text-white border border-[#A930BB]/40 shadow-[0_0_16px_rgba(169,48,187,0.35)]'
                  : 'text-white/45 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Languages className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </Tooltip>
        </div>

        {/* Manglish Navigation */}
        <div className="relative flex items-center justify-center w-full">
          <Tooltip content="Manglish Typing" position="right">
            <button
              type="button"
              onClick={() => onSelectTab('manglish')}
              aria-label="Manglish Typing"
              className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 cursor-pointer ${
                activeTab === 'manglish'
                  ? 'bg-[#A930BB]/20 text-white border border-[#A930BB]/40 shadow-[0_0_16px_rgba(169,48,187,0.35)]'
                  : 'text-white/45 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Keyboard className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* Bottom: Settings Icon */}
      <div className="flex flex-col items-center">
        <Tooltip content="Settings" position="right">
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="flex items-center justify-center w-10 h-10 rounded-2xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
