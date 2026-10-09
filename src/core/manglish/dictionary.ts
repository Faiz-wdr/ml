import { COMMON_MALAYALAM_DICTIONARY, type DictionaryEntry } from './data/malayalamWords'
import type { Suggestion } from './types'

export class ManglishDictionary {
  private exactMap = new Map<string, DictionaryEntry[]>()
  private entries: DictionaryEntry[] = []

  constructor() {
    this.entries = COMMON_MALAYALAM_DICTIONARY
    this.buildIndex()
  }

  private buildIndex() {
    for (const entry of this.entries) {
      for (const rawKey of entry.keys) {
        const key = rawKey.toLowerCase()
        const existing = this.exactMap.get(key) || []
        existing.push(entry)
        this.exactMap.set(key, existing)
      }
    }
  }

  /**
   * Look up exact dictionary matches
   */
  public findExact(manglish: string): Suggestion[] {
    const key = manglish.toLowerCase().trim()
    const found = this.exactMap.get(key)
    if (!found) return []

    return found.map((entry) => ({
      text: entry.word,
      score: entry.freq + 50, // High boost for exact dictionary matches
      source: 'dictionary' as const,
    }))
  }

  /**
   * Find prefix dictionary matches for progressive typing
   */
  public findPrefix(manglish: string, limit = 5): Suggestion[] {
    const key = manglish.toLowerCase().trim()
    if (key.length < 2) return []

    const results: Suggestion[] = []
    const seenWords = new Set<string>()

    for (const entry of this.entries) {
      for (const k of entry.keys) {
        if (k.startsWith(key) && !seenWords.has(entry.word)) {
          seenWords.add(entry.word)
          const lengthDiff = k.length - key.length
          const score = Math.max(10, entry.freq - lengthDiff * 5)
          results.push({
            text: entry.word,
            score,
            source: 'dictionary',
          })
          break
        }
      }
      if (results.length >= limit) break
    }

    return results
  }
}

export const defaultDictionary = new ManglishDictionary()
