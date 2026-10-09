import React, { useCallback, useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { TARGET_FONT_FORMATS } from '../../constants/fonts'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'
import { Button } from '../ui/Button'
import { Tooltip } from '../ui/Tooltip'
import { ConversionHeader } from './ConversionHeader'
import { FontSelector } from './FontSelector'
import { TextEditor } from './TextEditor'

const SAMPLE_MALAYALAM = `കേരളത്തിന്റെ തലസ്ഥാനം തിരുവനന്തപുരമാണ്. മലയാള ഭാഷ സംസാരിക്കുന്ന ജനങ്ങളാണ് ഇവിടെയുള്ളത്.`
const VIEW_MODE_STORAGE_KEY = 'malayalam_converter_view_mode'

function getSavedViewMode(): 'stacked' | 'split' {
  if (typeof window === 'undefined') return 'stacked'
  try {
    const saved = window.localStorage?.getItem(VIEW_MODE_STORAGE_KEY)
    if (saved === 'split' || saved === 'stacked') {
      return saved
    }
  } catch {
    // Ignore storage errors
  }
  return 'stacked'
}

export const ConverterWorkspace: React.FC = () => {
  const [sourceText, setSourceText] = useState('')
  const [selectedFormatId, setSelectedFormatId] = useState('ml-tt')
  const [direction, setDirection] = useState<'unicode-to-legacy' | 'legacy-to-unicode'>(
    'unicode-to-legacy'
  )
  const [viewMode, setViewModeState] = useState<'stacked' | 'split'>(getSavedViewMode)
  const [copiedTarget, setCopiedTarget] = useState(false)

  const setViewMode = useCallback((mode: 'stacked' | 'split') => {
    setViewModeState(mode)
    try {
      window.localStorage?.setItem(VIEW_MODE_STORAGE_KEY, mode)
    } catch {
      // Ignore storage errors
    }
  }, [])

  const selectedFormat =
    TARGET_FONT_FORMATS.find((f) => f.id === selectedFormatId) || TARGET_FONT_FORMATS[0]

  // Real-time sequence-aware conversion engine
  const targetText = useMemo(() => {
    if (!sourceText) return ''
    if (direction === 'unicode-to-legacy') {
      return convertUnicodeToLegacy(sourceText, selectedFormatId)
    } else {
      return convertLegacyToUnicode(sourceText, selectedFormatId)
    }
  }, [sourceText, selectedFormatId, direction])

  const handleInsertSample = () => {
    if (direction === 'unicode-to-legacy') {
      setSourceText(SAMPLE_MALAYALAM)
    } else {
      // In legacy mode, insert sample legacy text (e.g. ML-TT encoded)
      setSourceText(convertUnicodeToLegacy(SAMPLE_MALAYALAM, selectedFormatId))
    }
  }

  const handleSwapDirection = () => {
    // If there is converted target text, put it in source
    if (targetText) {
      setSourceText(targetText)
    }
    setDirection((prev) =>
      prev === 'unicode-to-legacy' ? 'legacy-to-unicode' : 'unicode-to-legacy'
    )
  }

  const handleCopyTarget = async () => {
    if (!targetText) return
    try {
      await navigator.clipboard.writeText(targetText)
      setCopiedTarget(true)
      setTimeout(() => setCopiedTarget(false), 2000)
    } catch {
      // fallback handled in editor
    }
  }

  const isSplit = viewMode === 'split'
  const isUnicodeSource = direction === 'unicode-to-legacy'

  const sourceLabel = 'Source'
  const targetLabel = 'Output'

  const fontSelectorElement = (
    <FontSelector
      selectedFormatId={selectedFormatId}
      onSelectFormat={setSelectedFormatId}
      direction="down"
    />
  )

  const sourceEditor = (
    <TextEditor
      id="source-editor"
      ariaLabel={`${sourceLabel} (${isUnicodeSource ? 'Unicode' : selectedFormat.name})`}
      label={sourceLabel}
      formatTag={isUnicodeSource ? 'Unicode' : undefined}
      extraHeaderContent={!isUnicodeSource ? fontSelectorElement : undefined}
      value={sourceText}
      onChange={setSourceText}
      placeholder={
        isUnicodeSource
          ? 'Paste or type Malayalam Unicode text...'
          : `Paste ${selectedFormat.name} legacy ASCII text...`
      }
      fontFamily={isUnicodeSource ? 'malayalam' : 'mono'}
      minHeight={isSplit ? 'min-h-[220px] sm:min-h-[280px] lg:min-h-[380px]' : 'min-h-[140px] sm:min-h-[180px]'}
      showCount={true}
      className={isSplit ? 'h-full' : ''}
    />
  )

  const targetEditor = (
    <TextEditor
      id="target-editor"
      ariaLabel={`${targetLabel} (${isUnicodeSource ? selectedFormat.name : 'Unicode'})`}
      label={targetLabel}
      formatTag={!isUnicodeSource ? 'Unicode' : undefined}
      extraHeaderContent={isUnicodeSource ? fontSelectorElement : undefined}
      value={targetText}
      readOnly={true}
      placeholder="Converted text will appear here immediately..."
      fontFamily={isUnicodeSource ? 'mono' : 'malayalam'}
      minHeight={isSplit ? 'min-h-[220px] sm:min-h-[280px] lg:min-h-[380px]' : 'min-h-[140px] sm:min-h-[180px]'}
      showCount={true}
      showTopCopy={false}
      className={isSplit ? 'h-full' : ''}
      footerActions={
        <div className="flex items-center justify-end w-full">
          {/* Primary Copy Action */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={
              copiedTarget ? (
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              ) : (
                <Copy className="h-3.5 w-3.5 text-white" strokeWidth={2} />
              )
            }
            onClick={handleCopyTarget}
            disabled={!targetText}
            className="px-3"
          >
            {copiedTarget ? 'Copied' : 'Copy'}
          </Button>
        </div>
      }
    />
  )

  const directionIndicator = (
    <Tooltip content="Click to swap conversion direction">
      <button
        type="button"
        onClick={handleSwapDirection}
        className="group flex items-center px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#1A1A1A] border border-white/[0.08] hover:border-[#A930BB]/40 shadow-sm text-white/70 hover:text-white transition-all cursor-pointer"
        aria-label="Swap conversion direction"
      >
        <span className="text-[11px] font-mono tracking-wide flex items-center gap-1.5 select-none">
          <span>{isUnicodeSource ? 'Unicode' : selectedFormat.name}</span>
          <span className="text-[#E68BF5] font-semibold transition-transform duration-300 group-hover:scale-115">
            →
          </span>
          <span>{isUnicodeSource ? selectedFormat.name : 'Unicode'}</span>
        </span>
      </button>
    </Tooltip>
  )

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
      {/* Header with Title and View Controls */}
      <ConversionHeader
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onInsertSample={handleInsertSample}
      />

      {/* Conversion Workspace Layout */}
      {isSplit ? (
        <div className="flex flex-col gap-3">
          {/* Centered Swap Flow Indicator in Side-by-Side Mode */}
          <div className="flex items-center justify-center py-0.5">
            {directionIndicator}
          </div>

          {/* Parallel 2-Column Side-by-Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <div className="flex flex-col h-full">{sourceEditor}</div>
            <div className="flex flex-col h-full">{targetEditor}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Source Box */}
          <div className="flex flex-col">{sourceEditor}</div>

          {/* Conversion Flow & Direction Swap Indicator */}
          <div className="flex items-center justify-center py-1">
            {directionIndicator}
          </div>

          {/* Target Box */}
          <div className="flex flex-col">{targetEditor}</div>
        </div>
      )}
    </div>
  )
}
