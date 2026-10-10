import React, { useState } from 'react'
import { Check, Copy, Pencil, Trash2 } from 'lucide-react'
import { trackEvent } from '../../core/analytics/analytics'
import type { SavedText } from '../../core/storage/savedTexts'
import { IconButton } from '../ui/IconButton'
import { AlertDialog } from '../ui/AlertDialog'

export interface SavedTextCardProps {
  item: SavedText
  isEditing?: boolean
  onEdit: (item: SavedText) => void
  onDelete: (id: string) => void
}

export const SavedTextCard: React.FC<SavedTextCardProps> = ({
  item,
  isEditing = false,
  onEdit,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.text)
      setCopied(true)
      trackEvent('manglish_text_copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  // Format relative/readable date
  const formattedDate = new Date(item.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl p-3.5 sm:p-4 transition-all duration-200 border ${isEditing
        ? 'bg-[#151218] border-[#A930BB]/60 shadow-[0_0_20px_rgba(169,48,187,0.15)] ring-1 ring-[#A930BB]/30'
        : 'bg-[#121212] border-white/[0.08] hover:border-white/[0.14] hover:bg-[#141414]'
        }`}
    >
      {/* Malayalam Text Preview */}
      <div className="font-malayalam text-base sm:text-[17px] text-[#FDFDFD] leading-relaxed whitespace-pre-wrap break-words line-clamp-4">
        {item.text}
      </div>

      {/* Card Footer: Metadata and Actions */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2 text-xs text-white/40">
        <span className="font-mono text-[11px] text-white/30 truncate">
          {formattedDate}
          {isEditing && (
            <span className="ml-2 inline-flex items-center text-[10px] font-mono text-[#E68BF5] bg-[#A930BB]/15 px-1.5 py-0.2 rounded border border-[#A930BB]/30">
              Editing
            </span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Copy Icon Button */}
          <IconButton
            icon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-[#E68BF5]" strokeWidth={2.5} />
              ) : (
                <Copy className="h-3.5 w-3.5 text-white/50 group-hover:text-white" strokeWidth={1.75} />
              )
            }
            aria-label={copied ? 'Copied' : 'Copy note'}
            tooltip={copied ? 'Copied' : 'Copy note'}
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={copied ? 'text-[#E68BF5]' : 'hover:bg-white/[0.06]'}
          />

          {/* Edit Icon Button */}
          <IconButton
            icon={<Pencil className="h-3.5 w-3.5 text-white/60 hover:text-white" strokeWidth={1.75} />}
            aria-label="Edit note"
            tooltip="Edit note"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="hover:bg-white/[0.06]"
          />

          {/* Delete Icon Button - Triggers Design System Alert Dialog */}
          <IconButton
            icon={<Trash2 className="h-3.5 w-3.5 text-white/40 hover:text-red-400" strokeWidth={1.75} />}
            aria-label="Delete note"
            tooltip="Delete note"
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="hover:bg-white/[0.06] hover:text-red-400"
          />
        </div>
      </div>

      {/* Design System Alert Dialog Box for Delete Confirmation */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        title="Delete This Saved Note?"
        description="This action cannot be undone."
        content={item.text}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="purple"
        onConfirm={() => {
          onDelete(item.id)
          setDeleteDialogOpen(false)
        }}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  )
}
