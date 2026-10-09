import React from 'react'
import type { SavedText } from '../../core/storage/savedTexts'
import { SavedTextCard } from './SavedTextCard'

export interface SavedTextsProps {
  items: SavedText[]
  activeEditingId?: string | null
  onEdit: (item: SavedText) => void
  onDelete: (id: string) => void
  className?: string
}

export const SavedTexts: React.FC<SavedTextsProps> = ({
  items,
  activeEditingId,
  onEdit,
  onDelete,
  className = '',
}) => {
  return (
    <section className={`flex flex-col space-y-3 pt-2 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-tight text-[#FDFDFD]">
          Saved Notes
        </h2>
      </div>

      {/* List or Empty State */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#111111]/40 px-6 py-8 text-center">
          <p className="text-xs text-white/40">
            No saved notes yet. Type Malayalam above and click{' '}
            <span className="text-white/70 font-medium">Save</span> to store snippets locally.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <SavedTextCard
              key={item.id}
              item={item}
              isEditing={item.id === activeEditingId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
