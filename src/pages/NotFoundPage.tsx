import React from 'react'
import { AlertCircle, ArrowLeft, Languages, Keyboard } from 'lucide-react'
import { Button } from '../components/ui/Button'
import type { NavTabId } from '../types'

export interface NotFoundPageProps {
  onNavigate: (tab: NavTabId) => void
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <section aria-labelledby="not-found-title" className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center p-8 rounded-[28px] bg-[#141414]/90 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#A930BB]/15 border border-[#A930BB]/30 text-[#E68BF5] mb-5">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h1 id="not-found-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#FDFDFD] mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          The page you are looking for doesn't exist or has moved. Return to the converter or start typing Malayalam with Manglish.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigate('font')}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Languages className="w-4 h-4" />
            <span>Font Converter</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => onNavigate('manglish')}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Keyboard className="w-4 h-4" />
            <span>Manglish Typing</span>
          </Button>
        </div>

        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => onNavigate('font')}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </section>
  )
}
