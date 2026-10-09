import React from 'react'
import { Bookmark, Check, Copy, X } from 'lucide-react'
import { Button } from '../ui/Button'

export interface TypingToolbarProps {
  charCount: number
  wordCount: number
  hasText: boolean
  copied: boolean
  saved?: boolean
  isEditing?: boolean
  onCopy: () => void
  onClear: () => void
  onSave?: () => void
  onCancelEdit?: () => void
}

export const TypingToolbar: React.FC<TypingToolbarProps> = ({
  charCount,
  wordCount,
  hasText,
  copied,
  saved = false,
  isEditing = false,
  onCopy,
  onClear,
  onSave,
  onCancelEdit,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 border-t border-white/[0.06] text-xs text-white/40 w-full min-w-0">
      {/* Counters & Hints */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-white/40 shrink-0">
        <span className="font-mono whitespace-nowrap">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <span className="h-2.5 sm:h-3 w-px bg-white/10" />
        <span className="font-mono whitespace-nowrap">
          {charCount} {charCount === 1 ? 'char' : 'chars'}
        </span>
        {isEditing && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#E68BF5] ml-1 whitespace-nowrap">
            <span>Editing saved text</span>
          </span>
        )}
      </div>

      {/* Primary Actions pinned to right-end */}
      <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {isEditing && onCancelEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            leftIcon={<X className="h-3.5 w-3.5 text-white/50" />}
            className="text-xs text-white/50 hover:text-white px-2 sm:px-2.5 h-8 whitespace-nowrap"
          >
            Cancel
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!hasText}
          className="text-xs text-white/60 hover:text-white px-2 sm:px-2.5 h-8 whitespace-nowrap"
        >
          Clear
        </Button>

        {onSave && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            disabled={!hasText}
            leftIcon={
              saved ? (
                <Check className="h-3.5 w-3.5 text-[#E68BF5]" strokeWidth={2.5} />
              ) : (
                <Bookmark className="h-3.5 w-3.5 text-white/70" />
              )
            }
            className={`px-2.5 sm:px-3 text-xs h-8 whitespace-nowrap ${isEditing ? 'border-[#A930BB]/50 text-white' : ''
              }`}
          >
            {saved ? 'Saved' : isEditing ? 'Update' : 'Save'}
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onCopy}
          disabled={!hasText}
          leftIcon={
            copied ? (
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            ) : (
              <Copy className="h-3.5 w-3.5 text-white" strokeWidth={2} />
            )
          }
          className="px-2.5 sm:px-3 text-xs h-8 whitespace-nowrap"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}
