import { SequenceMatcher } from '../../converter/matcher'
import {
  ANUSVARA,
  isChillu,
  isConsonant,
  isIndependentVowel,
  VIRAMA,
  VISARGA,
} from '../../unicode/characterTypes'
import { normalizeMalayalamText } from '../../unicode/normalization'
import type { EncodingProfile } from '../types'
import {
  MLKV_CHILLUS,
  MLKV_CONJUNCTS,
  MLKV_CONSONANTS,
  MLKV_INDEPENDENT_VOWELS,
  MLKV_MATRAS,
  MLKV_REVERSE_MAPPING,
} from './mapping'

/**
 * MLKV Encoding Profile (ML-Kairali, MLKV Panchami, ML-Nandi)
 */
export class MLKVEncoding implements EncodingProfile {
  public id = 'mlkv'
  public name = 'MLKV'
  public category = 'Legacy ASCII'
  public description = 'MLKV Kairali, Panchami, and ML-Nandi encoding'

  private forwardMatcher: SequenceMatcher
  private reverseMatcher: SequenceMatcher

  constructor() {
    this.forwardMatcher = new SequenceMatcher()
    this.reverseMatcher = new SequenceMatcher()

    this.forwardMatcher.load(MLKV_CONJUNCTS)
    this.forwardMatcher.load(MLKV_CONSONANTS)
    this.forwardMatcher.load(MLKV_INDEPENDENT_VOWELS)
    this.forwardMatcher.load(MLKV_CHILLUS)

    this.reverseMatcher.load(MLKV_REVERSE_MAPPING)
  }

  public unicodeToLegacy(input: string): string {
    if (!input) return ''
    const text = normalizeMalayalamText(input)
    let output = ''
    let i = 0
    const len = text.length

    while (i < len) {
      const char = text[i]

      if (/\s/.test(char)) {
        output += char
        i++
        continue
      }

      if (isIndependentVowel(char)) {
        const match = this.forwardMatcher.findLongestMatch(text, i)
        if (match) {
          output += match.value
          i += match.length
          continue
        }
      }

      if (isChillu(char)) {
        const match = this.forwardMatcher.findLongestMatch(text, i)
        if (match) {
          output += match.value
          i += match.length
          continue
        }
      }

      const baseMatch = this.forwardMatcher.findLongestMatch(text, i)
      if (baseMatch && (isConsonant(baseMatch.key[0]) || MLKV_CONJUNCTS[baseMatch.key])) {
        let baseLegacy = baseMatch.value
        let nextIdx = i + baseMatch.length

        let hasRaSubscript = false
        let hasYaSubscript = false
        let hasVaSubscript = false

        if (
          nextIdx + 1 < len &&
          text[nextIdx] === VIRAMA &&
          text[nextIdx + 1] === 'ര'
        ) {
          hasRaSubscript = true
          nextIdx += 2
        } else if (
          nextIdx + 1 < len &&
          text[nextIdx] === VIRAMA &&
          text[nextIdx + 1] === 'യ'
        ) {
          hasYaSubscript = true
          nextIdx += 2
        } else if (
          nextIdx + 1 < len &&
          text[nextIdx] === VIRAMA &&
          text[nextIdx + 1] === 'വ'
        ) {
          hasVaSubscript = true
          nextIdx += 2
        }

        let prebase = ''
        let postbase = ''

        if (nextIdx < len) {
          const matraChar = text[nextIdx]
          switch (matraChar) {
            case 'െ': // e
              prebase = MLKV_MATRAS.E
              nextIdx++
              break
            case 'േ': // ee
              prebase = MLKV_MATRAS.EE
              nextIdx++
              break
            case 'ൈ': // ai
              prebase = MLKV_MATRAS.AI
              nextIdx++
              break
            case 'ൊ': // o
              prebase = MLKV_MATRAS.E
              postbase = MLKV_MATRAS.AA
              nextIdx++
              break
            case 'ോ': // oo
              prebase = MLKV_MATRAS.EE
              postbase = MLKV_MATRAS.AA
              nextIdx++
              break
            case 'ൌ':
            case 'ൗ': // au
              prebase = MLKV_MATRAS.E
              postbase = MLKV_MATRAS.AU
              nextIdx++
              break
            case 'ാ': // aa
              postbase = MLKV_MATRAS.AA
              nextIdx++
              break
            case 'ി': // i
              postbase = MLKV_MATRAS.I
              nextIdx++
              break
            case 'ീ': // ii
              postbase = MLKV_MATRAS.II
              nextIdx++
              break
            case 'ു': // u
              postbase = MLKV_MATRAS.U
              nextIdx++
              break
            case 'ൂ': // uu
              postbase = MLKV_MATRAS.UU
              nextIdx++
              break
            case 'ൃ': // vocalic r
              postbase = MLKV_MATRAS.R
              nextIdx++
              break
            case VIRAMA:
              postbase = MLKV_MATRAS.VIRAMA
              nextIdx++
              break
          }
        }

        if (hasYaSubscript) {
          postbase = MLKV_MATRAS.YA_SUBSCRIPT + postbase
        }
        if (hasVaSubscript) {
          postbase = MLKV_MATRAS.VA_SUBSCRIPT + postbase
        }
        if (hasRaSubscript) {
          baseLegacy = MLKV_MATRAS.RA_SUBSCRIPT + baseLegacy
        }

        if (nextIdx < len && text[nextIdx] === ANUSVARA) {
          postbase += MLKV_MATRAS.ANUSVARA
          nextIdx++
        } else if (nextIdx < len && text[nextIdx] === VISARGA) {
          postbase += MLKV_MATRAS.VISARGA
          nextIdx++
        }

        output += prebase + baseLegacy + postbase
        i = nextIdx
        continue
      }

      if (char === ANUSVARA) {
        output += MLKV_MATRAS.ANUSVARA
        i++
        continue
      }
      if (char === VISARGA) {
        output += MLKV_MATRAS.VISARGA
        i++
        continue
      }
      if (char === VIRAMA) {
        output += MLKV_MATRAS.VIRAMA
        i++
        continue
      }

      output += char
      i++
    }

    return output
  }

  public legacyToUnicode(input: string): string {
    if (!input) return ''
    const text = input
    let decoded = ''
    let idx = 0
    const len = text.length

    while (idx < len) {
      let prebaseMatra: string | null = null
      let markerLen = 0

      if (text.startsWith('ss', idx)) {
        prebaseMatra = 'ൈ'
        markerLen = 2
      } else if (text[idx] === 's') {
        prebaseMatra = 'െ'
        markerLen = 1
      } else if (text[idx] === 't') {
        prebaseMatra = 'േ'
        markerLen = 1
      }

      if (prebaseMatra) {
        const afterPrebaseIdx = idx + markerLen
        let isRaSub = false
        let baseStart = afterPrebaseIdx
        if (baseStart < len && text[baseStart] === '{') {
          isRaSub = true
          baseStart++
        }

        const match = this.reverseMatcher.findLongestMatch(text, baseStart)
        if (match) {
          let afterBaseIdx = baseStart + match.length

          if (afterBaseIdx < len && text[afterBaseIdx] === 'm') {
            if (prebaseMatra === 'െ') {
              prebaseMatra = 'ൊ'
              afterBaseIdx++
            } else if (prebaseMatra === 'േ') {
              prebaseMatra = 'ോ'
              afterBaseIdx++
            }
          } else if (afterBaseIdx < len && text[afterBaseIdx] === 'u') {
            if (prebaseMatra === 'െ') {
              prebaseMatra = 'ൗ'
              afterBaseIdx++
            }
          }

          decoded += match.value
          if (isRaSub) {
            decoded += VIRAMA + 'ര'
          }
          decoded += prebaseMatra

          idx = afterBaseIdx
          continue
        }
      }

      if (text[idx] === '{') {
        const baseStart = idx + 1
        const match = this.reverseMatcher.findLongestMatch(text, baseStart)
        if (match) {
          decoded += match.value + VIRAMA + 'ര'
          idx = baseStart + match.length
          continue
        }
      }

      const match = this.reverseMatcher.findLongestMatch(text, idx)
      if (match) {
        decoded += match.value
        idx += match.length
        continue
      }

      decoded += text[idx]
      idx++
    }

    return normalizeMalayalamText(decoded)
  }
}
