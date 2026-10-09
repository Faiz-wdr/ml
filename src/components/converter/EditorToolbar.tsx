import React from 'react'
import { Badge } from '../ui/Badge'

export interface EditorToolbarProps {
  label?: string
  formatTag?: string
  charCount?: number
  wordCount?: number
  leftContent?: React.ReactNode
  rightActions?: React.ReactNode
  className?: string
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  label,
  formatTag,
  charCount,
  wordCount,
  leftContent,
  rightActions,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 sm:px-5 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
            {label}
          </span>
        )}
        {formatTag && (
          <Badge variant="accent" size="xs">
            {formatTag}
          </Badge>
        )}
        {leftContent}
      </div>

      {(rightActions || charCount !== undefined) && (
        <div className="flex items-center gap-2">
          {charCount !== undefined && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-white/35 mr-1 select-none">
              <span>{charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}</span>
              {wordCount !== undefined && (
                <>
                  <span className="opacity-40">•</span>
                  <span>{wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}</span>
                </>
              )}
            </div>
          )}
          {rightActions}
        </div>
      )}
    </div>
  )
}
