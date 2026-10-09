import React, { useState } from 'react'
import type { NavTabId } from '../../types'
import { MobileHeader } from './MobileHeader'
import { PageContainer } from './PageContainer'
import { Sidebar } from './Sidebar'
import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { DotCanvasBackground } from '../ui/DotCanvasBackground'

export interface AppShellProps {
  activeTab: NavTabId
  onSelectTab: (tab: NavTabId) => void
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#FDFDFD] flex flex-col md:flex-row relative selection:bg-[#A930BB]/30">
      {/* Google Stitch Canvas dot grid background with lightweight hover animation */}
      <DotCanvasBackground />

      {/* Mobile Header */}
      <MobileHeader
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenSettings={() => setSettingsOpen(true)}
        className="relative z-20"
      />

      {/* Desktop Floating Sidebar container */}
      <div className="hidden md:flex items-center pl-6 lg:pl-8 py-6 sticky top-0 h-screen z-30">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <PageContainer>{children}</PageContainer>
      </div>

      {/* Minimal Settings Modal */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm rounded-[24px] bg-[#141414] border border-white/[0.1] p-6 shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-sm font-semibold tracking-wide text-white">Settings & Preferences</h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-white/70">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <span className="text-white/40 font-mono">Dark (Default)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Typography</span>
                <span className="text-white/40 font-mono">Geist Sans</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Local Execution</span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <CheckCircle2 className="h-3 w-3" /> Client-only
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Privacy</span>
                <span className="text-emerald-400 font-mono text-[11px]">Zero Telemetry</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setSettingsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
