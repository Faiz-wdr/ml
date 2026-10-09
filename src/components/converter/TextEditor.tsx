import React, { useId, useState } from 'react'
import { Check, Copy, Trash2 } from 'lucide-react'
import type { TextEditorProps } from '../../types'
import { IconButton } from '../ui/IconButton'
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
  onClear,
  onCopy,
  extraHeaderContent,
  footerActions,
  ariaLabel,
  fontFamily = 'malayalam',
  className = '',
  showTopCopy = true,
}) => {
  const generatedId = useId()
  const textareaId = id || generatedId
  const [isFocused, setIsFocused] = useState(false)
  const [copied, setCopied] = useState(false)

  // Character and word calculations
  const charCount = value ? value.length : 0
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0

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
      className={`group relative flex flex-col rounded-2xl sm:rounded-[20px] transition-all duration-200 ease-out border ${isFocused
        ? 'bg-[#121212] border-[#A930BB]/50 shadow-[0_0_24px_-4px_rgba(169,48,187,0.25)]'
        : 'bg-[#111111] border-white/[0.08] hover:border-white/[0.13]'
        } ${readOnly ? 'bg-[#0E0E0E]' : ''} ${className}`}
    >
      {/* Header Toolbar */}
      <EditorToolbar
        label={label}
        formatTag={formatTag}
        charCount={showCount ? charCount : undefined}
        wordCount={showCount ? wordCount : undefined}
        leftContent={extraHeaderContent}
        rightActions={
          <div className="flex items-center gap-1">
            {/* Clear Button (only when editable and has value) */}
            {!readOnly && value.length > 0 && (
              <IconButton
                icon={<Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />}
                aria-label="Clear text"
                tooltip="Clear text"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              />
            )}

            {/* Copy Button (optional, can be disabled if bottom copy exists) */}
            {showTopCopy && (
              <IconButton
                icon={
                  copied ? (
                    <Check className="h-3.5 w-3.5 text-[#E68BF5]" strokeWidth={2} />
                  ) : (
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )
                }
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                tooltip={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                variant="ghost"
                size="sm"
                disabled={!value}
                onClick={handleCopy}
                className={copied ? 'text-[#E68BF5]' : ''}
              />
            )}
          </div>
        }
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

      {/* Optional Footer Actions */}
      {footerActions && (
        <div className="border-t border-white/[0.04] px-4 py-2.5 bg-white/[0.01] rounded-b-2xl sm:rounded-b-[20px] flex items-center justify-between">
          {footerActions}
        </div>
      )}
    </div>
  )
}
