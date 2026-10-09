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
  MLTT_CHILLUS,
  MLTT_CONJUNCTS,
  MLTT_CONSONANTS,
  MLTT_INDEPENDENT_VOWELS,
  MLTT_MATRAS,
  MLTT_REVERSE_MAPPING,
} from './mapping'

/**
 * ML-TT Encoding Profile (ML-TT Karthika / Revathi)
 */
export class MLTTEncoding implements EncodingProfile {
  public id = 'ml-tt'
  public name = 'ML-TT'
  public category = 'Legacy ASCII'
  public description = 'ML-TT Karthika, Revathi, and standard bilingual DTP fonts'

  protected forwardMatcher: SequenceMatcher
  protected reverseMatcher: SequenceMatcher

  constructor() {
    this.forwardMatcher = new SequenceMatcher()
    this.reverseMatcher = new SequenceMatcher()

    // Load forward rules: Conjuncts first (multi-character sequences), then consonants, vowels, chillus
    this.forwardMatcher.load(MLTT_CONJUNCTS)
    this.forwardMatcher.load(MLTT_CONSONANTS)
    this.forwardMatcher.load(MLTT_INDEPENDENT_VOWELS)
    this.forwardMatcher.load(MLTT_CHILLUS)

    // Load reverse rules
    this.reverseMatcher.load(MLTT_REVERSE_MAPPING)
  }

  /**
   * Convert Malayalam Unicode text to ML-TT legacy ASCII
   */
  public unicodeToLegacy(input: string): string {
    if (!input) return ''
    const text = normalizeMalayalamText(input)
    let output = ''
    let i = 0
    const len = text.length

    while (i < len) {
      // 1. Check for standalone symbols / whitespace / non-Malayalam
      const char = text[i]

      // Whitespace and newlines
      if (/\s/.test(char)) {
        output += char
        i++
        continue
      }

      // Independent Vowels
      if (isIndependentVowel(char)) {
        const vowelMatch = this.forwardMatcher.findLongestMatch(text, i)
        if (vowelMatch) {
          output += vowelMatch.value
          i += vowelMatch.length
          continue
        }
      }

      // Atomic Chillus
      if (isChillu(char)) {
        const chilluMatch = this.forwardMatcher.findLongestMatch(text, i)
        if (chilluMatch) {
          output += chilluMatch.value
          i += chilluMatch.length
          continue
        }
      }

      // 2. Orthographic Base (Consonant or Conjunct)
      const baseMatch = this.forwardMatcher.findLongestMatch(text, i)
      if (baseMatch && (isConsonant(baseMatch.key[0]) || MLTT_CONJUNCTS[baseMatch.key])) {
        let baseLegacy = baseMatch.value
        let nextIdx = i + baseMatch.length

        // Check for optional subscript signs (ra, ya, va)
        let hasRaSubscript = false
        let hasYaSubscript = false
        let hasVaSubscript = false

        // Check ra-subscript (് + ര)
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

        // Check for Vowel Sign (Matra)
        let prebase = ''
        let postbase = ''

        if (nextIdx < len) {
          const matraChar = text[nextIdx]
          switch (matraChar) {
            // Pre-base matras (placed before base in visual ML-TT output)
            case 'െ': // e
              prebase = MLTT_MATRAS.E
              nextIdx++
              break
            case 'േ': // ee
              prebase = MLTT_MATRAS.EE
              nextIdx++
              break
            case 'ൈ': // ai
              prebase = MLTT_MATRAS.AI
              nextIdx++
              break

            // Split matras (left part before base, right part after base)
            case 'ൊ': // o
              prebase = MLTT_MATRAS.E
              postbase = MLTT_MATRAS.AA
              nextIdx++
              break
            case 'ോ': // oo
              prebase = MLTT_MATRAS.EE
              postbase = MLTT_MATRAS.AA
              nextIdx++
              break
            case 'ൌ':
            case 'ൗ': // au
              prebase = MLTT_MATRAS.E
              postbase = MLTT_MATRAS.AU
              nextIdx++
              break

            // Post-base matras
            case 'ാ': // aa
              postbase = MLTT_MATRAS.AA
              nextIdx++
              break
            case 'ി': // i
              postbase = MLTT_MATRAS.I
              nextIdx++
              break
            case 'ീ': // ii
              postbase = MLTT_MATRAS.II
              nextIdx++
              break
            case 'ു': // u
              postbase = MLTT_MATRAS.U
              nextIdx++
              break
            case 'ൂ': // uu
              postbase = MLTT_MATRAS.UU
              nextIdx++
              break
            case 'ൃ': // vocalic r
              postbase = MLTT_MATRAS.R
              nextIdx++
              break
            case VIRAMA: // virama / chandrakkala
              postbase = MLTT_MATRAS.VIRAMA
              nextIdx++
              break
          }
        }

        // Subscripts placement
        if (hasYaSubscript) {
          postbase = MLTT_MATRAS.YA_SUBSCRIPT + postbase
        }
        if (hasVaSubscript) {
          postbase = MLTT_MATRAS.VA_SUBSCRIPT + postbase
        }

        // Prebase ra-sign '{' in ML-TT is placed before base (and after prebase vowel sign)
        if (hasRaSubscript) {
          baseLegacy = MLTT_MATRAS.RA_SUBSCRIPT + baseLegacy
        }

        // Optional Anusvara or Visarga attached to syllable
        if (nextIdx < len && text[nextIdx] === ANUSVARA) {
          postbase += MLTT_MATRAS.ANUSVARA
          nextIdx++
        } else if (nextIdx < len && text[nextIdx] === VISARGA) {
          postbase += MLTT_MATRAS.VISARGA
          nextIdx++
        }

        output += prebase + baseLegacy + postbase
        i = nextIdx
        continue
      }

      // Standalone signs if not part of a cluster
      if (char === ANUSVARA) {
        output += MLTT_MATRAS.ANUSVARA
        i++
        continue
      }
      if (char === VISARGA) {
        output += MLTT_MATRAS.VISARGA
        i++
        continue
      }
      if (char === VIRAMA) {
        output += MLTT_MATRAS.VIRAMA
        i++
        continue
      }

      // Passthrough unknown / Latin / symbols
      output += char
      i++
    }

    return output
  }

  /**
   * Convert ML-TT legacy ASCII text back to Malayalam Unicode
   */
  public legacyToUnicode(input: string): string {
    if (!input) return ''

    // Step 1: Pre-base and split matra reordering for decoding
    // In ML-TT, 's' (െ), 't' (േ), 'ss' (ൈ), '{' (്ര) visually precede the base consonant.
    // We normalize the prebase markers relative to their following consonant/conjunct.
    const text = input

    // Handle split signs:
    // s + [Base] + m => [Base] + ൊ
    // t + [Base] + m => [Base] + ോ
    // s + [Base] + u => [Base] + ൗ
    // s + [Base] => [Base] + െ
    // t + [Base] => [Base] + േ
    // ss + [Base] => [Base] + ൈ
    // { + [Base] => [Base] + ്ര

    let decoded = ''
    let idx = 0
    const len = text.length

    while (idx < len) {
      // Check prebase markers
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
        // Look ahead for base (can have '{' for ra-subscript)
        let isRaSub = false
        let baseStart = afterPrebaseIdx
        if (baseStart < len && text[baseStart] === '{') {
          isRaSub = true
          baseStart++
        }

        const match = this.reverseMatcher.findLongestMatch(text, baseStart)
        if (match) {
          let afterBaseIdx = baseStart + match.length

          // Check for right part of split signs ('m' for o/oo, 'u' for au)
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

      // Check prebase ra-sign '{' without prebase vowel
      if (text[idx] === '{') {
        const baseStart = idx + 1
        const match = this.reverseMatcher.findLongestMatch(text, baseStart)
        if (match) {
          decoded += match.value + VIRAMA + 'ര'
          idx = baseStart + match.length
          continue
        }
      }

      // Standard longest match lookup from reverse dictionary
      const match = this.reverseMatcher.findLongestMatch(text, idx)
      if (match) {
        decoded += match.value
        idx += match.length
        continue
      }

      // Character passthrough
      decoded += text[idx]
      idx++
    }

    return normalizeMalayalamText(decoded)
  }
}
