import { describe, expect, it } from 'vitest'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'
import {
  NDA_VOWEL_COMBINATIONS,
  REAL_WORLD_NDA_WORDS,
} from '../fixtures/malayalam'

describe('ML-TT Conversion Engine', () => {
  describe('Critical Regression: ണ്ട conjunct and all vowel combinations', () => {
    it('converts base conjunct ണ്ട correctly to visible ï', () => {
      const legacy = convertUnicodeToLegacy('ണ്ട', 'ml-tt')
      expect(legacy).toBe('ï')
      const reversed = convertLegacyToUnicode(legacy, 'ml-tt')
      expect(reversed).toBe('ണ്ട')
    })

    it('converts വണ്ടൂർ with visible ണ്ട (hïqÀ) in ML-TT', () => {
      const legacyVandoor = convertUnicodeToLegacy('വണ്ടൂർ', 'ml-tt')
      expect(legacyVandoor).toBe('hïqÀ')
      expect(convertLegacyToUnicode(legacyVandoor, 'ml-tt')).toBe('വണ്ടൂർ')
    })

    it('converts each requested ണ്ട + vowel combination correctly with proper matra ordering', () => {
      // Test all combinations:
      // ണ്ട, ണ്ടു, ണ്ടി, ണ്ടീ, ണ്ടാ, ണ്ടെ, ണ്ടേ, ണ്ടൈ, ണ്ടൊ, ണ്ടോ, ണ്ടൗ
      const expectedEncodings: Record<string, string> = {
        'ണ്ട': 'ï',
        'ണ്ടാ': 'ïm',
        'ണ്ടി': 'ïn',
        'ണ്ടീ': 'ïo',
        'ണ്ടു': 'ïp',
        'ണ്ടൂ': 'ïq',
        'ണ്ടെ': 'sï',   // Prebase 's' before 'ï'
        'ണ്ടേ': 'tï',   // Prebase 't' before 'ï'
        'ണ്ടൈ': 'ssï',  // Prebase 'ss' before 'ï'
        'ണ്ടൊ': 'sïm',  // Split 's' before 'ï' and 'm' after
        'ണ്ടോ': 'tïm',  // Split 't' before 'ï' and 'm' after
        'ണ്ടൗ': 'sïu',  // Split 's' before 'ï' and 'u' after
      }

      for (const item of NDA_VOWEL_COMBINATIONS) {
        const expected = expectedEncodings[item.unicode]
        if (expected) {
          const encoded = convertUnicodeToLegacy(item.unicode, 'ml-tt')
          expect(encoded).toBe(expected)

          // Test reverse decoding
          const decoded = convertLegacyToUnicode(encoded, 'ml-tt')
          expect(decoded).toBe(item.unicode)
        }
      }
    })

    it('converts real-world Malayalam words with ണ്ട', () => {
      // Real-world words specified in prompt:
      // കണ്ടു, കണ്ടത്, കണ്ടാൽ, കണ്ടെത്തി, വണ്ടി, വണ്ടികൾ, മണ്ടൻ, പണ്ടാരം, തണ്ടുകൾ
      for (const word of REAL_WORLD_NDA_WORDS) {
        const legacy = convertUnicodeToLegacy(word, 'ml-tt')
        expect(legacy.length).toBeGreaterThan(0)
        expect(legacy).not.toBe(word) // Must be encoded into legacy ASCII

        // Verify round-trip back to Unicode
        const restored = convertLegacyToUnicode(legacy, 'ml-tt')
        expect(restored).toBe(word)
      }
    })
  })

  describe('Prebase and Split Matras', () => {
    it('correctly orders prebase matra െ (e)', () => {
      // കെ -> sI
      const encoded = convertUnicodeToLegacy('കെ', 'ml-tt')
      expect(encoded).toBe('sI')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('കെ')
    })

    it('correctly orders prebase matra േ (ee)', () => {
      // കേരളം -> tIcfw
      const encoded = convertUnicodeToLegacy('കേരളം', 'ml-tt')
      expect(encoded).toBe('tIcfw')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('കേരളം')
    })

    it('correctly orders prebase matra ൈ (ai)', () => {
      // കൈ -> ssI
      const encoded = convertUnicodeToLegacy('കൈ', 'ml-tt')
      expect(encoded).toBe('ssI')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('കൈ')
    })

    it('correctly orders split matra ൊ (o)', () => {
      // കൊ -> sIm
      const encoded = convertUnicodeToLegacy('കൊ', 'ml-tt')
      expect(encoded).toBe('sIm')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('കൊ')
    })

    it('correctly orders split matra ോ (oo)', () => {
      // കോ -> tIm
      const encoded = convertUnicodeToLegacy('കോ', 'ml-tt')
      expect(encoded).toBe('tIm')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('കോ')
    })

    it('correctly converts മലയാളം to aebmfw', () => {
      const encoded = convertUnicodeToLegacy('മലയാളം', 'ml-tt')
      expect(encoded).toBe('aebmfw')
      expect(convertLegacyToUnicode(encoded, 'ml-tt')).toBe('മലയാളം')
    })
  })

  describe('Chillus & Punctuation', () => {
    it('converts atomic chillus properly', () => {
      expect(convertUnicodeToLegacy('അവൻ', 'ml-tt')).toBe('Ah³')
      expect(convertLegacyToUnicode('Ah³', 'ml-tt')).toBe('അവൻ')
    })

    it('preserves spaces, punctuation, numbers, and Latin text', () => {
      const mixed = 'മലയാളം (Malayalam) 2026: കണ്ടു!'
      const encoded = convertUnicodeToLegacy(mixed, 'ml-tt')
      expect(encoded).toContain('Malayalam')
      expect(encoded).toContain('2026')
      expect(encoded).toContain('!')
    })
  })
})
