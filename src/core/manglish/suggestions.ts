import { defaultDictionary } from './dictionary'
import { generateCandidates, transliterateWord } from './transliterator'
import type { Suggestion } from './types'

// Cache to ensure instant response on repeated typing
const suggestionsCache = new Map<string, Suggestion[]>()

/**
 * Generates local ranked Malayalam Unicode suggestions for Manglish input.
 * Combines dictionary lookups, phonetic rules, and frequency ranking.
 */
export function getSuggestions(manglishInput: string, maxSuggestions = 5): Suggestion[] {
  const cleanInput = manglishInput.trim()
  if (!cleanInput) return []

  const suggestionMap = new Map<string, Suggestion>()

  // 1. Exact Dictionary Match
  const exactMatches = defaultDictionary.findExact(cleanInput)
  for (const match of exactMatches) {
    suggestionMap.set(match.text, match)
  }

  // 2. Primary Rule-Based Phonetic Transliteration
  const primaryPhonetic = transliterateWord(cleanInput)
  if (primaryPhonetic && !suggestionMap.has(primaryPhonetic)) {
    suggestionMap.set(primaryPhonetic, {
      text: primaryPhonetic,
      score: 85,
      source: 'phonetic',
    })
  }

  // 3. Alternative Phonetic Candidates
  const candidates = generateCandidates(cleanInput)
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i]
    if (!suggestionMap.has(candidate)) {
      suggestionMap.set(candidate, {
        text: candidate,
        score: Math.max(50, 80 - i * 5),
        source: 'rule',
      })
    }
  }

  // 4. Prefix Dictionary Matches for progressive typing
  const prefixMatches = defaultDictionary.findPrefix(cleanInput, maxSuggestions)
  for (const prefix of prefixMatches) {
    if (!suggestionMap.has(prefix.text)) {
      suggestionMap.set(prefix.text, prefix)
    }
  }

  // Sort by score descending and return top matches
  const sorted = Array.from(suggestionMap.values()).sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  )

  return sorted.slice(0, maxSuggestions)
}

/**
 * High-accuracy live transliteration matching manglish.app / Google Input Tools.
 * Fetches accurate ML-Unicode candidates with offline local fallback.
 */
export async function fetchManglishSuggestions(
  manglishInput: string,
  limit = 6
): Promise<Suggestion[]> {
  const cleanInput = manglishInput.trim()
  if (!cleanInput) return []

  const cacheKey = cleanInput.toLowerCase()
  if (suggestionsCache.has(cacheKey)) {
    return suggestionsCache.get(cacheKey)!
  }

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(cleanInput)}&itc=ml-t-i0-und&num=${limit}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      if (data && data[0] === 'SUCCESS' && data[1]?.[0]?.[1]) {
        const rawList: string[] = data[1][0][1]
        const suggestions: Suggestion[] = rawList.map((word, idx) => ({
          text: word,
          score: 100 - idx * 5,
          source: 'exact',
        }))

        // Append raw English word at the bottom (like manglish.app and user screenshot)
        if (!suggestions.some((s) => s.text.toLowerCase() === cleanInput.toLowerCase())) {
          suggestions.push({
            text: cleanInput,
            score: 1,
            source: 'exact',
          })
        }

        suggestionsCache.set(cacheKey, suggestions)
        return suggestions
      }
    }
  } catch {
    // Network failure: fall back to local offline engine seamlessly
  }

  // Local fallback
  const local = getSuggestions(cleanInput, limit)
  if (!local.some((s) => s.text.toLowerCase() === cleanInput.toLowerCase())) {
    local.push({
      text: cleanInput,
      score: 1,
      source: 'exact',
    })
  }

  suggestionsCache.set(cacheKey, local)
  return local
}
