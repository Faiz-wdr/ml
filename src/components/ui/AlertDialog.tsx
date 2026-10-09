import React, { useEffect } from 'react'
import { Trash2, X } from 'lucide-react'
import { Button } from './Button'

export interface AlertDialogProps {
  isOpen: boolean
  title: string
  description?: string
  content?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'purple' | 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Design system alert dialog modal.
 * Follows the dark minimal theme with brand purple accent (#A930BB, #E68BF5)
 * with accessible focus handling, keyboard navigation, and backdrop blur.
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  description,
  content,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  // Listen for Escape key to close dialog
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby={description ? 'alert-dialog-desc' : undefined}
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-[24px] bg-[#141414] border border-white/[0.1] p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.85)] animate-in zoom-in-95 duration-150"
      >
        {/* Top-right Close Button */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-4.5 right-4.5 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Centered Icon Badge in Theme Purple */}
        <div className="flex justify-center mb-3.5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-[#A930BB]/35 bg-[#A930BB]/15 text-[#E68BF5] shadow-[0_0_18px_rgba(169,48,187,0.25)]">
            <Trash2 className="w-5 h-5" strokeWidth={1.75} />
          </div>
        </div>

        {/* Centered Title & Description */}
        <h2
          id="alert-dialog-title"
          className="text-center text-base font-semibold tracking-tight text-[#FDFDFD] mb-1.5"
        >
          {title}
        </h2>

        {description && (
          <p id="alert-dialog-desc" className="text-center text-xs text-white/60 leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Left-Aligned Preview Snippet in Theme Box */}
        {content && (
          <div className="text-left mb-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] px-4 py-3 text-xs sm:text-[13px] text-white/80 font-malayalam line-clamp-3 select-text leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
        )}

        {/* Action Buttons: Left-aligned Cancel and Right-aligned Theme Purple Confirm */}
        <div className="flex items-center justify-between w-full pt-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            className="px-4"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className="px-4"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
