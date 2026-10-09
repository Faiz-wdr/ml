import React, { useId, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { TextEditorProps } from '../../types'
import { Button } from '../ui/Button'
import { EditorToolbar } from './EditorToolbar'

export const TextEditor: React.FC<TextEditorProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Type or paste text...',
  label,
  formatTag,
  readOnly = false,
  minHeight = 'min-h-[160px] sm:min-h-[190px]',
  showCount = true,
  showClear,
  showCopy = true,
  showBottomBar = true,
  onClear,
  onCopy,
  extraHeaderContent,
  footerActions,
  ariaLabel,
  fontFamily = 'malayalam',
  className = '',
}) => {
  const generatedId = useId()
  const textareaId = id || generatedId
  const [isFocused, setIsFocused] = useState(false)
  const [copied, setCopied] = useState(false)

  // Character and word calculations
  const charCount = value ? value.length : 0
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

  const canClear = showClear ?? (!readOnly || Boolean(onClear))

  const handleCopy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (onCopy) onCopy()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea')
      textarea.value = value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      if (onCopy) onCopy()
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    if (onChange) onChange('')
    if (onClear) onClear()
  }

  const fontClass =
    fontFamily === 'mono'
      ? 'font-mono'
      : fontFamily === 'malayalam'
        ? 'font-malayalam'
        : 'font-sans'

  return (
    <div
      className={`group relative flex flex-col rounded-2xl sm:rounded-[20px] transition-all duration-200 ease-out border ${
        isFocused
          ? 'bg-[#121212] border-[#A930BB]/50 shadow-[0_0_24px_-4px_rgba(169,48,187,0.25)]'
          : 'bg-[#111111] border-white/[0.08] hover:border-white/[0.13]'
      } ${readOnly ? 'bg-[#0E0E0E]' : ''} ${className}`}
    >
      {/* Header Toolbar */}
      <EditorToolbar
        label={label}
        formatTag={formatTag}
        leftContent={extraHeaderContent}
      />

      {/* Editor Body */}
      <div className="relative flex-1 flex flex-col p-3.5 sm:p-4">
        <textarea
          id={textareaId}
          aria-label={ariaLabel || label || 'Text Editor'}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={`w-full flex-1 resize-y bg-transparent text-[15px] sm:text-base leading-relaxed text-[#FDFDFD] placeholder:text-white/25 focus:outline-none disabled:cursor-not-allowed ${minHeight} ${fontClass}`}
        />
      </div>

      {/* Bottom Footer Toolbar */}
      {showBottomBar && (
        <div className="border-t border-white/[0.04] px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white/[0.01] rounded-b-2xl sm:rounded-b-[20px] flex items-center justify-between gap-2 min-w-0">
          {/* Counters & Stats on bottom left */}
          {showCount ? (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-white/40 select-none shrink-0">
              <span>
                {charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}
              </span>
              <span className="opacity-40">•</span>
              <span>
                {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Actions on bottom right */}
          {footerActions ? (
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ml-auto">
              {footerActions}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ml-auto">
              {canClear && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={!value || value.length === 0}
                  className="text-xs text-white/60 hover:text-white px-2 sm:px-2.5 h-8 whitespace-nowrap"
                >
                  Clear
                </Button>
              )}

              {showCopy && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!value || value.length === 0}
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
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
