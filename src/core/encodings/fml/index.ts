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
  FML_CHILLUS,
  FML_CONJUNCTS,
  FML_CONSONANTS,
  FML_INDEPENDENT_VOWELS,
  FML_MATRAS,
  FML_REVERSE_MAPPING,
} from './mapping'

/**
 * FML Encoding Profile (FML Indulekha / Chithra)
 */
export class FMLEncoding implements EncodingProfile {
  public id = 'fml'
  public name = 'FML'
  public category = 'Legacy ASCII'
  public description = 'FML Chithra, Indulekha, and legacy newsprint formats'

  private forwardMatcher: SequenceMatcher
  private reverseMatcher: SequenceMatcher

  constructor() {
    this.forwardMatcher = new SequenceMatcher()
    this.reverseMatcher = new SequenceMatcher()

    this.forwardMatcher.load(FML_CONJUNCTS)
    this.forwardMatcher.load(FML_CONSONANTS)
    this.forwardMatcher.load(FML_INDEPENDENT_VOWELS)
    this.forwardMatcher.load(FML_CHILLUS)

    this.reverseMatcher.load(FML_REVERSE_MAPPING)
  }

  /**
   * Convert Malayalam Unicode to FML legacy ASCII
   */
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
      if (baseMatch && (isConsonant(baseMatch.key[0]) || FML_CONJUNCTS[baseMatch.key])) {
        const baseLegacy = baseMatch.value
        let nextIdx = i + baseMatch.length

        let prebase = ''
        let postbase = ''

        if (nextIdx < len) {
          const matraChar = text[nextIdx]
          switch (matraChar) {
            case 'െ': // e
              prebase = FML_MATRAS.E
              nextIdx++
              break
            case 'േ': // ee
              prebase = FML_MATRAS.EE
              nextIdx++
              break
            case 'ൈ': // ai
              prebase = FML_MATRAS.AI
              nextIdx++
              break
            case 'ൊ': // o
              prebase = FML_MATRAS.E
              postbase = FML_MATRAS.AA
              nextIdx++
              break
            case 'ോ': // oo
              prebase = FML_MATRAS.EE
              postbase = FML_MATRAS.AA
              nextIdx++
              break
            case 'ൌ':
            case 'ൗ': // au
              prebase = FML_MATRAS.E
              postbase = FML_MATRAS.AU
              nextIdx++
              break
            case 'ാ': // aa
              postbase = FML_MATRAS.AA
              nextIdx++
              break
            case 'ി': // i
              postbase = FML_MATRAS.I
              nextIdx++
              break
            case 'ീ': // ii
              postbase = FML_MATRAS.II
              nextIdx++
              break
            case 'ു': // u
              postbase = FML_MATRAS.U
              nextIdx++
              break
            case 'ൂ': // uu
              postbase = FML_MATRAS.UU
              nextIdx++
              break
            case 'ൃ': // vocalic r
              postbase = FML_MATRAS.R
              nextIdx++
              break
            case VIRAMA: // virama
              postbase = FML_MATRAS.VIRAMA
              nextIdx++
              break
          }
        }

        if (nextIdx < len && text[nextIdx] === ANUSVARA) {
          postbase += FML_MATRAS.ANUSVARA
          nextIdx++
        } else if (nextIdx < len && text[nextIdx] === VISARGA) {
          postbase += FML_MATRAS.VISARGA
          nextIdx++
        }

        output += prebase + baseLegacy + postbase
        i = nextIdx
        continue
      }

      if (char === ANUSVARA) {
        output += FML_MATRAS.ANUSVARA
        i++
        continue
      }
      if (char === VISARGA) {
        output += FML_MATRAS.VISARGA
        i++
        continue
      }
      if (char === VIRAMA) {
        output += FML_MATRAS.VIRAMA
        i++
        continue
      }

      output += char
      i++
    }

    return output
  }

  /**
   * Convert FML legacy text to Malayalam Unicode
   */
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
      } else if (text[idx] === 't') {
        prebaseMatra = 'െ'
        markerLen = 1
      } else if (text[idx] === 'u') {
        prebaseMatra = 'േ'
        markerLen = 1
      }

      if (prebaseMatra) {
        const afterPrebaseIdx = idx + markerLen
        const match = this.reverseMatcher.findLongestMatch(text, afterPrebaseIdx)
        if (match) {
          let afterBaseIdx = afterPrebaseIdx + match.length

          // Check for right part of split signs ('n' for o/oo in FML)
          if (afterBaseIdx < len && text[afterBaseIdx] === 'n') {
            if (prebaseMatra === 'െ') {
              prebaseMatra = 'ൊ'
              afterBaseIdx++
            } else if (prebaseMatra === 'േ') {
              prebaseMatra = 'ോ'
              afterBaseIdx++
            }
          }

          decoded += match.value + prebaseMatra
          idx = afterBaseIdx
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
