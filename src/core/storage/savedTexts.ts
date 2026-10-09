export interface SavedText {
  id: string
  text: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'malayalam_converter_saved_manglish_texts'

// In-memory fallback if window.localStorage is not accessible (e.g. test environment or privacy restrictions)
const memoryStorage = new Map<string, string>()

function getStorageItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key)
    }
    if (typeof globalThis !== 'undefined' && (globalThis as { localStorage?: Storage }).localStorage) {
      return (globalThis as { localStorage: Storage }).localStorage.getItem(key)
    }
  } catch {
    // Fallback to memory
  }
  return memoryStorage.get(key) ?? null
}

function setStorageItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
      return
    }
    if (typeof globalThis !== 'undefined' && (globalThis as { localStorage?: Storage }).localStorage) {
      (globalThis as { localStorage: Storage }).localStorage.setItem(key, value)
      return
    }
  } catch {
    // Fallback to memory
  }
  memoryStorage.set(key, value)
}

function removeStorageItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
      return
    }
    if (typeof globalThis !== 'undefined' && (globalThis as { localStorage?: Storage }).localStorage) {
      (globalThis as { localStorage: Storage }).localStorage.removeItem(key)
      return
    }
  } catch {
    // Fallback to memory
  }
  memoryStorage.delete(key)
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `saved_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Retrieve all saved texts from localStorage, sorted by newest first.
 */
export function getSavedTexts(): SavedText[] {
  try {
    const raw = getStorageItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Validate and sanitize shape
    return parsed
      .filter((item): item is SavedText => {
        return (
          item &&
          typeof item.id === 'string' &&
          typeof item.text === 'string' &&
          typeof item.createdAt === 'number' &&
          typeof item.updatedAt === 'number'
        )
      })
      .sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  }
}

/**
 * Save a text snippet. If existingId is provided, updates that existing item in place.
 * Otherwise creates a new entry.
 */
export function saveText(text: string, existingId?: string | null): SavedText | null {
  const trimmed = text.trim()
  if (!trimmed) {
    return null
  }

  try {
    const currentList = getSavedTexts()
    const now = Date.now()

    if (existingId) {
      const existingIndex = currentList.findIndex((item) => item.id === existingId)
      if (existingIndex !== -1) {
        const updated: SavedText = {
          ...currentList[existingIndex],
          text: trimmed,
          updatedAt: now,
        }
        // Update and move to top
        currentList.splice(existingIndex, 1)
        currentList.unshift(updated)
        setStorageItem(STORAGE_KEY, JSON.stringify(currentList))
        return updated
      }
    }

    // New item
    const newItem: SavedText = {
      id: generateId(),
      text: trimmed,
      createdAt: now,
      updatedAt: now,
    }

    currentList.unshift(newItem)
    setStorageItem(STORAGE_KEY, JSON.stringify(currentList))
    return newItem
  } catch {
    return null
  }
}

/**
 * Delete a saved text by its ID.
 */
export function deleteSavedText(id: string): boolean {
  try {
    const currentList = getSavedTexts()
    const filtered = currentList.filter((item) => item.id !== id)
    if (filtered.length === currentList.length) {
      return false
    }
    setStorageItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch {
    return false
  }
}

/**
 * Clear all saved texts.
 */
export function clearAllSavedTexts(): void {
  try {
    removeStorageItem(STORAGE_KEY)
  } catch {
    // Ignore storage clear failure
  }
}
