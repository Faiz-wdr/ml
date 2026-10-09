import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fetchManglishSuggestions, getSuggestions } from '../../core/manglish/suggestions'
import type { Suggestion } from '../../core/manglish/types'
import type { SavedText } from '../../core/storage/savedTexts'
import { getCaretCoordinates } from './caretPosition'
import { SuggestionBar } from './SuggestionBar'
import { TypingToolbar } from './TypingToolbar'

export interface ManglishEditorProps {
  className?: string
  placeholder?: string
  editingItem?: SavedText | null
  onSave?: (text: string) => void
  onCancelEdit?: () => void
}

export const ManglishEditor: React.FC<ManglishEditorProps> = ({
  className = '',
  placeholder = 'Type Manglish here...',
  editingItem = null,
  onSave,
  onCancelEdit,
}) => {
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeWordRange, setActiveWordRange] = useState<{ start: number; end: number } | null>(null)
  const [caretPosition, setCaretPosition] = useState<{ top: number; left: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const suggestionBarRef = useRef<HTMLDivElement>(null)
  const latestWordRef = useRef<string>('')

  // Dismiss and hide suggestions
  const dismissSuggestions = useCallback(() => {
    setSuggestions([])
    setActiveWordRange(null)
    setSelectedIndex(0)
    setCaretPosition(null)
    latestWordRef.current = ''
  }, [])

  // Hide suggestions when clicking anywhere outside the suggestion box
  useEffect(() => {
    if (suggestions.length === 0) return

    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      if (suggestionBarRef.current && suggestionBarRef.current.contains(e.target as Node)) {
        return
      }
      dismissSuggestions()
    }

    document.addEventListener('mousedown', handleGlobalClick)
    document.addEventListener('touchstart', handleGlobalClick)

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick)
      document.removeEventListener('touchstart', handleGlobalClick)
    }
  }, [suggestions.length, dismissSuggestions])

  // Find the current English/Manglish word being typed before the cursor
  const detectActiveWord = useCallback((content: string, cursorPos: number) => {
    // Scan backwards from cursorPos to find word boundary (space, newline, punctuation)
    let start = cursorPos
    while (start > 0) {
      const char = content[start - 1]
      if (/[\s\n.,!?;:()/\-₹0-9]/.test(char)) {
        break
      }
      start--
    }

    const currentWord = content.slice(start, cursorPos).trim()

    // Only generate suggestions if word contains Latin letters
    if (currentWord && /[a-zA-Z]/.test(currentWord)) {
      setActiveWordRange({ start, end: cursorPos })
      latestWordRef.current = currentWord

      // 1. Immediate local suggestions for 0ms responsiveness
      const localSuggestions = getSuggestions(currentWord, 5)
      if (!localSuggestions.some((s) => s.text.toLowerCase() === currentWord.toLowerCase())) {
        localSuggestions.push({ text: currentWord, score: 1, source: 'exact' as const })
      }
      setSuggestions(localSuggestions)
      setSelectedIndex(0)

      // Calculate caret position for vertical floating menu
      if (textareaRef.current) {
        const coords = getCaretCoordinates(textareaRef.current, cursorPos)
        const containerWidth = textareaRef.current.clientWidth || 300
        const left = Math.max(16, Math.min(coords.left, containerWidth - 220))
        const top = coords.top + coords.height + 8
        setCaretPosition({ top, left })
      }

      // 2. Fetch high-accuracy online suggestions matching manglish.app
      fetchManglishSuggestions(currentWord, 6)
        .then((accurateList) => {
          if (latestWordRef.current === currentWord && accurateList.length > 0) {
            setSuggestions(accurateList)
          }
        })
        .catch(() => {
          // Keep local suggestions
        })
    } else {
      dismissSuggestions()
    }
  }, [dismissSuggestions])

  // Handle textarea content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    detectActiveWord(newText, e.target.selectionStart)
  }

  // Commit a suggestion replacing the active word
  const commitSuggestion = useCallback(
    (suggestionText: string, appendSpace = true) => {
      if (!activeWordRange || !textareaRef.current) return

      const { start, end } = activeWordRange
      const replacement = suggestionText + (appendSpace ? ' ' : '')

      const before = text.slice(0, start)
      const after = text.slice(end)
      const updatedText = before + replacement + after

      setText(updatedText)
      dismissSuggestions()

      // Reposition cursor immediately after committed word
      const newCursorPos = start + replacement.length
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    },
    [activeWordRange, text, dismissSuggestions]
  )

  // Keyboard navigation & actions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const hasSuggestions = suggestions.length > 0 && activeWordRange !== null

    if (hasSuggestions) {
      // Arrow Down: move to next suggestion in vertical list
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        return
      }

      // Arrow Up: move to previous suggestion in vertical list
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        return
      }

      // Space: accept selected suggestion and append space
      if (e.key === ' ') {
        e.preventDefault()
        const selected = suggestions[selectedIndex] || suggestions[0]
        if (selected) {
          commitSuggestion(selected.text, true)
        }
        return
      }

      // Enter or Tab: accept selected suggestion without newline
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        const selected = suggestions[selectedIndex] || suggestions[0]
        if (selected) {
          commitSuggestion(selected.text, false)
        }
        return
      }

      // Escape, ArrowLeft, or ArrowRight: dismiss suggestions
      if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        dismissSuggestions()
        return
      }
    }
  }

  // Copy action
  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  // Clear action
  const handleClear = () => {
    setText('')
    dismissSuggestions()
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  // Track previous editing ID to adjust state during render when a saved item is selected for editing
  const [prevEditingId, setPrevEditingId] = useState<string | null>(null)
  const currentEditingId = editingItem?.id ?? null

  if (currentEditingId !== prevEditingId) {
    setPrevEditingId(currentEditingId)
    if (editingItem) {
      setText(editingItem.text)
      setSuggestions([])
      setActiveWordRange(null)
      setCaretPosition(null)
    }
  }

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Position caret at end of loaded text when editingItem changes
  useEffect(() => {
    if (editingItem && textareaRef.current) {
      textareaRef.current.focus()
      const len = editingItem.text.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [editingItem])

  const handleSave = () => {
    if (!text.trim()) return
    if (onSave) {
      onSave(text)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div
      ref={containerRef}
      className={`group relative flex flex-col rounded-2xl bg-[#141414] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-200 focus-within:border-[#A930BB]/50 focus-within:ring-2 focus-within:ring-[#A930BB]/20 ${className}`}
    >
      {/* Primary Workspace Textarea with floating cursor-anchored vertical popup */}
      <div className="relative p-3.5 sm:p-5 flex-1 flex flex-col min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onClick={dismissSuggestions}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Manglish Malayalam typing editor"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={suggestions.length > 0 && activeWordRange !== null}
          aria-activedescendant={
            suggestions.length > 0 && activeWordRange !== null
              ? `suggestion-item-${selectedIndex}`
              : undefined
          }
          className="w-full flex-1 resize-y bg-transparent text-[#FDFDFD] placeholder-white/20 text-base sm:text-lg lg:text-xl leading-relaxed focus:outline-none scrollbar-thin scrollbar-thumb-white/10 font-malayalam"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />

        {/* Floating Vertical Suggestion Popup (Positioned directly under caret/word) */}
        {suggestions.length > 0 && activeWordRange && (
          <SuggestionBar
            ref={suggestionBarRef}
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            position={caretPosition}
            onSelectSuggestion={(s) => commitSuggestion(s.text, true)}
          />
        )}
      </div>

      {/* Editor Toolbar with Stats and Actions */}
      <div className="px-4 pb-3">
        <TypingToolbar
          charCount={charCount}
          wordCount={wordCount}
          hasText={text.length > 0}
          copied={copied}
          saved={saved}
          isEditing={Boolean(editingItem)}
          onCopy={handleCopy}
          onClear={handleClear}
          onSave={onSave ? handleSave : undefined}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </div>
  )
}
