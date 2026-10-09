import React, { useCallback, useState } from 'react'
import { ManglishEditor } from '../components/manglish/ManglishEditor'
import { SavedTexts } from '../components/manglish/SavedTexts'
import {
  deleteSavedText,
  getSavedTexts,
  saveText,
  type SavedText,
} from '../core/storage/savedTexts'

export interface ManglishPageProps {
  onBackToFont?: () => void
}

export const ManglishPage: React.FC<ManglishPageProps> = () => {
  const [savedTexts, setSavedTexts] = useState<SavedText[]>(() => getSavedTexts())
  const [editingItem, setEditingItem] = useState<SavedText | null>(null)

  // Save or update an item in localStorage
  const handleSave = useCallback(
    (text: string) => {
      saveText(text, editingItem?.id)
      setSavedTexts(getSavedTexts())
      setEditingItem(null)
    },
    [editingItem]
  )

  // Load a saved item into the editor for editing
  const handleEdit = useCallback((item: SavedText) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Cancel active editing session
  const handleCancelEdit = useCallback(() => {
    setEditingItem(null)
  }, [])

  // Delete an item from storage
  const handleDelete = useCallback(
    (id: string) => {
      deleteSavedText(id)
      setSavedTexts(getSavedTexts())
      if (editingItem?.id === id) {
        setEditingItem(null)
      }
    },
    [editingItem]
  )

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Clean Minimal Header */}
      <header className="flex items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-xl font-medium tracking-tight text-[#FDFDFD]">
              Manglish Typing
            </h1>
          </div>
        </div>
      </header>

      {/* Primary Unified Typing Workspace */}
      <ManglishEditor
        editingItem={editingItem}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
      />

      {/* Saved Texts Section */}
      <SavedTexts
        items={savedTexts}
        activeEditingId={editingItem?.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
