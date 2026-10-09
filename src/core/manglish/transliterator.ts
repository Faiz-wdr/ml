import { defaultDictionary } from './dictionary'
import {
  CONSONANT_CLUSTERS,
  ENDING_CHILLUS,
  INDEPENDENT_VOWELS,
  VOWEL_MATRAS,
} from './rules'

const VIRAMA = '്'

/**
 * Transliterates a single Manglish word into Malayalam Unicode.
 * Sequence and context-aware.
 */
export function transliterateWord(rawWord: string): string {
  if (!rawWord) return ''

  // 1. Check dictionary exact match first
  const dictMatches = defaultDictionary.findExact(rawWord)
  if (dictMatches.length > 0) {
    return dictMatches[0].text
  }

  // 2. Special full word direct handling for irregular phonetic forms
  const lower = rawWord.toLowerCase()
  if (lower === 'njan' || lower === 'njaan' || lower === 'njān') return 'ഞാൻ'
  if (lower === 'ente' || lower === 'ende') return 'എന്റെ'
  if (lower === 'ninte' || lower === 'ninde') return 'നിന്റെ'
  if (lower === 'peru' || lower === 'paeru') return 'പേര്'
  if (lower === 'aanu' || lower === 'aann') return 'ആണ്'
  if (lower === 'nanni') return 'നന്ദി'
  if (lower === 'nammal') return 'നമ്മൾ'
  if (lower === 'njangal') return 'ഞങ്ങൾ'
  if (lower === 'ningal') return 'നിങ്ങൾ'
  if (lower === 'njangalkku') return 'ഞങ്ങൾക്ക്'
  if (lower === 'ningalkku') return 'നിങ്ങൾക്ക്'
  if (lower === 'achan' || lower === 'acchan') return 'അച്ഛൻ'
  if (lower === 'amma') return 'അമ്മ'
  if (lower === 'malayalam') return 'മലയാളം'
  if (lower === 'kerala') return 'കേരളം'
  if (lower === 'sukham' || lower === 'sugham') return 'സുഖം'
  if (lower === 'sukhamano' || lower === 'sughamano') return 'സുഖമാണോ'
  if (lower === 'mazha') return 'മഴ'
  if (lower === 'vellam') return 'വെള്ളം'
  if (lower === 'veedu') return 'വീട്'
  if (lower === 'faiz') return 'ഫൈസ്'

  let result = ''
  let i = 0
  const len = rawWord.length
  let isStartOfSyllable = true

  while (i < len) {
    const remaining = rawWord.slice(i).toLowerCase()

    // 1. Check special word-final suffixes
    // 'am' at end -> Anusvara 'ം' (e.g. namaskaram -> നമസ്കാരം)
    if (i > 0 && remaining === 'am') {
      result += 'ം'
      break
    }
    // 'um' at end -> 'ും'
    if (i > 0 && remaining === 'um') {
      result += 'ും'
      break
    }

    // 2. Check for independent vowels (at start or after another vowel)
    if (isStartOfSyllable) {
      let matchedVowel = ''
      let vowelLen = 0

      for (const [pattern, malayalam] of Object.entries(INDEPENDENT_VOWELS)) {
        if (remaining.startsWith(pattern) && pattern.length > vowelLen) {
          matchedVowel = malayalam
          vowelLen = pattern.length
        }
      }

      if (matchedVowel) {
        result += matchedVowel
        i += vowelLen
        isStartOfSyllable = true
        continue
      }
    }

    // 3. Match consonant or consonant cluster
    let matchedConsonant = ''
    let consonantLen = 0

    for (const [pattern, malayalam] of CONSONANT_CLUSTERS) {
      if (remaining.startsWith(pattern) && pattern.length > consonantLen) {
        matchedConsonant = malayalam
        consonantLen = pattern.length
      }
    }

    if (matchedConsonant) {
      i += consonantLen
      const nextRemaining = rawWord.slice(i).toLowerCase()

      // Look ahead for following vowel sign
      let matchedMatra: string | null = null
      let matraLen = 0

      for (const [pattern, matra] of Object.entries(VOWEL_MATRAS)) {
        if (nextRemaining.startsWith(pattern) && pattern.length > matraLen) {
          matchedMatra = matra
          matraLen = pattern.length
        }
      }

      if (matchedMatra !== null && matraLen > 0) {
        // Consonant + Vowel
        result += matchedConsonant + matchedMatra
        i += matraLen
        isStartOfSyllable = false
        // If vowel ended with 'a', the next character starts a new syllable
        if (nextRemaining.startsWith('a') && !nextRemaining.startsWith('aa')) {
          isStartOfSyllable = true
        }
        continue
      }

      // No vowel following: check if at end of word (potential chillu)
      if (i >= len) {
        const lastChar = rawWord[len - 1]
        const chillu = ENDING_CHILLUS[lastChar]
        if (chillu && consonantLen === 1) {
          result += chillu
        } else {
          result += matchedConsonant + VIRAMA
        }
        break
      }

      // Consonant followed by another consonant -> add virama
      result += matchedConsonant + VIRAMA
      isStartOfSyllable = false
      continue
    }

    // Non-Malayalam or punctuation passthrough
    result += rawWord[i]
    i++
    isStartOfSyllable = true
  }

  return result
}

/**
 * Generate multiple phonetic candidates for an input word
 */
export function generateCandidates(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const candidates: string[] = []
  const primary = transliterateWord(trimmed)
  if (primary) candidates.push(primary)

  const lower = trimmed.toLowerCase()

  // Generate alternative variants
  if (lower.endsWith('am')) {
    // namaskaram -> നമസ്കാരം / നമസ്കാരം
    const withoutAm = lower.slice(0, -2)
    candidates.push(transliterateWord(withoutAm) + 'ം')
  }

  if (lower.endsWith('n')) {
    // njan -> ഞാൻ / ഞാന് / നാൻ
    const base = lower.slice(0, -1)
    candidates.push(transliterateWord(base) + '്')
    candidates.push(transliterateWord(base) + 'ൻ')
    candidates.push(transliterateWord(base) + 'ന')
  }

  if (lower.startsWith('nj')) {
    // njan -> ഞാൻ vs നാൻ
    candidates.push(transliterateWord(lower.replace(/^nj/, 'n')))
  }

  if (lower.includes('zh')) {
    // mazha -> മഴ vs മല
    candidates.push(transliterateWord(lower.replace(/zh/g, 'l')))
  }

  if (lower.includes('th')) {
    // entha -> എന്താ
    candidates.push(transliterateWord(lower.replace(/th/g, 't')))
  }

  return Array.from(new Set(candidates.filter(Boolean)))
}
