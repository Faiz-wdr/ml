import {
  ANUSVARA,
  isChillu,
  isConsonant,
  isIndependentVowel,
  isMatra,
  VIRAMA,
  VISARGA,
  ZWJ,
  ZWNJ,
} from '../unicode/characterTypes'
import { normalizeMalayalamText } from '../unicode/normalization'
import type { MalayalamToken, MalayalamTokenType } from './types'

/**
 * Tokenizes normalized Malayalam text into orthographic semantic units.
 * Identifies:
 * - Multi-codepoint conjuncts (e.g., ണ + ് + ട => 'ണ്ട')
 * - Independent consonants and vowels
 * - Chillus
 * - Matras (vowel signs)
 * - Punctuation, numbers, whitespace, and Latin text
 */
export function tokenizeMalayalam(input: string, shouldNormalize = true): MalayalamToken[] {
  const text = shouldNormalize ? normalizeMalayalamText(input) : input
  const tokens: MalayalamToken[] = []
  let index = 0
  const len = text.length

  while (index < len) {
    const startIndex = index
    const char = text[index]

    // 1. Whitespace
    if (/\s/.test(char)) {
      let value = char
      index++
      while (index < len && /\s/.test(text[index])) {
        value += text[index]
        index++
      }
      tokens.push({
        type: 'WHITESPACE',
        value,
        startIndex,
        endIndex: index,
      })
      continue
    }

    // 2. Latin / ASCII alphabets
    if (/[a-zA-Z]/.test(char)) {
      let value = char
      index++
      while (index < len && /[a-zA-Z]/.test(text[index])) {
        value += text[index]
        index++
      }
      tokens.push({
        type: 'LATIN',
        value,
        startIndex,
        endIndex: index,
      })
      continue
    }

    // 3. Numbers (Western and Malayalam)
    if (/[0-9൦-൯]/.test(char)) {
      let value = char
      index++
      while (index < len && /[0-9൦-൯]/.test(text[index])) {
        value += text[index]
        index++
      }
      tokens.push({
        type: 'NUMBER',
        value,
        startIndex,
        endIndex: index,
      })
      continue
    }

    // 4. Chillu characters
    if (isChillu(char)) {
      tokens.push({
        type: 'CHILLU',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 5. Independent Vowels
    if (isIndependentVowel(char)) {
      tokens.push({
        type: 'INDEPENDENT_VOWEL',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 6. Consonant sequences: single consonant OR multi-consonant conjunct
    if (isConsonant(char)) {
      // Look ahead to check for conjunct: Consonant + Virama + Consonant (+ Virama + Consonant)*
      let conjunctValue = char
      let lookahead = index + 1
      let isConjunct = false

      while (lookahead < len) {
        // Optional ZWJ or ZWNJ
        let viramaIndex = lookahead
        if (text[viramaIndex] === ZWJ || text[viramaIndex] === ZWNJ) {
          viramaIndex++
        }

        if (viramaIndex < len && text[viramaIndex] === VIRAMA) {
          let nextConsonantIndex = viramaIndex + 1
          if (nextConsonantIndex < len && (text[nextConsonantIndex] === ZWJ || text[nextConsonantIndex] === ZWNJ)) {
            nextConsonantIndex++
          }

          if (nextConsonantIndex < len && isConsonant(text[nextConsonantIndex])) {
            // Found another consonant connected via virama!
            conjunctValue = text.substring(index, nextConsonantIndex + 1)
            lookahead = nextConsonantIndex + 1
            isConjunct = true
            continue
          }
        }
        break
      }

      if (isConjunct) {
        tokens.push({
          type: 'CONJUNCT',
          value: conjunctValue,
          startIndex,
          endIndex: index + conjunctValue.length,
        })
        index += conjunctValue.length
        continue
      }

      // Single consonant
      tokens.push({
        type: 'CONSONANT',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 7. Matras (Vowel signs)
    if (isMatra(char)) {
      tokens.push({
        type: 'MATRA',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 8. Standalone Virama
    if (char === VIRAMA) {
      tokens.push({
        type: 'VIRAMA',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 9. Anusvara
    if (char === ANUSVARA) {
      tokens.push({
        type: 'ANUSVARA',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 10. Visarga
    if (char === VISARGA) {
      tokens.push({
        type: 'VISARGA',
        value: char,
        startIndex,
        endIndex: index + 1,
      })
      index++
      continue
    }

    // 11. Punctuation & Symbols
    const type: MalayalamTokenType = /[.,!?:;"'()[\]{}—–\-_/\\@#$%^&*+=<>~`|]/.test(char)
      ? 'PUNCTUATION'
      : 'OTHER'

    tokens.push({
      type,
      value: char,
      startIndex,
      endIndex: index + 1,
    })
    index++
  }

  return tokens
}
