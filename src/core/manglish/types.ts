/**
 * Core types for Malayalam Manglish Phonetic Transliteration Engine
 */

export interface Suggestion {
  text: string
  score?: number
  source?: 'dictionary' | 'rule' | 'phonetic' | 'exact'
}

export interface TransliterationCandidate {
  malayalam: string
  score: number
  matchedPattern?: string
}

export interface CompositionState {
  committedText: string
  currentManglish: string
  selectedSuggestionIndex: number
  suggestions: Suggestion[]
}
