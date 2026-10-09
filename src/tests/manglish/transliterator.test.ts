import { describe, expect, it } from 'vitest'
import { transliterateWord } from '../../core/manglish/transliterator'

describe('Manglish Phonetic Transliterator', () => {
  describe('Basic Vocabulary Requested by Specification', () => {
    it('transliterates namaskaram → നമസ്കാരം', () => {
      expect(transliterateWord('namaskaram')).toBe('നമസ്കാരം')
    })

    it('transliterates nanni → നന്ദി', () => {
      expect(transliterateWord('nanni')).toBe('നന്ദി')
    })

    it('transliterates amma → അമ്മ', () => {
      expect(transliterateWord('amma')).toBe('അമ്മ')
    })

    it('transliterates achan → അച്ഛൻ', () => {
      expect(transliterateWord('achan')).toBe('അച്ഛൻ')
    })

    it('transliterates malayalam → മലയാളം', () => {
      expect(transliterateWord('malayalam')).toBe('മലയാളം')
    })

    it('transliterates kerala → കേരളം', () => {
      expect(transliterateWord('kerala')).toBe('കേരളം')
    })
  })

  describe('Pronouns & Complex Conjuncts', () => {
    it('transliterates njan → ഞാൻ', () => {
      expect(transliterateWord('njan')).toBe('ഞാൻ')
      expect(transliterateWord('njaan')).toBe('ഞാൻ')
      expect(transliterateWord('njān')).toBe('ഞാൻ')
    })

    it('transliterates nammal → നമ്മൾ', () => {
      expect(transliterateWord('nammal')).toBe('നമ്മൾ')
    })

    it('transliterates njangal → ഞങ്ങൾ', () => {
      expect(transliterateWord('njangal')).toBe('ഞങ്ങൾ')
    })

    it('transliterates ningal → നിങ്ങൾ', () => {
      expect(transliterateWord('ningal')).toBe('നിങ്ങൾ')
    })

    it('transliterates njangalkku → ഞങ്ങൾക്ക്', () => {
      expect(transliterateWord('njangalkku')).toBe('ഞങ്ങൾക്ക്')
    })
  })

  describe('Common Interrogatives & Everyday Vocabulary', () => {
    it('transliterates sukham and sukhamano', () => {
      expect(transliterateWord('sukham')).toBe('സുഖം')
      expect(transliterateWord('sugham')).toBe('സുഖം')
      expect(transliterateWord('sukhamano')).toBe('സുഖമാണോ')
    })

    it('transliterates entha, evide, engane', () => {
      expect(transliterateWord('entha')).toBe('എന്താ')
      expect(transliterateWord('evide')).toBe('എവിടെ')
      expect(transliterateWord('engane')).toBe('എങ്ങനെ')
    })

    it('transliterates ivide and avide', () => {
      expect(transliterateWord('ivide')).toBe('ഇവിടെ')
      expect(transliterateWord('avide')).toBe('അവിടെ')
    })

    it('transliterates veedu, vellam, mazha', () => {
      expect(transliterateWord('veedu')).toBe('വീട്')
      expect(transliterateWord('vellam')).toBe('വെള്ളം')
      expect(transliterateWord('mazha')).toBe('മഴ')
    })

    it('transliterates sentence elements: ente, peru, faiz, aanu', () => {
      expect(transliterateWord('ente')).toBe('എന്റെ')
      expect(transliterateWord('peru')).toBe('പേര്')
      expect(transliterateWord('faiz')).toBe('ഫൈസ്')
      expect(transliterateWord('aanu')).toBe('ആണ്')
    })
  })

  describe('Chillu, Vowels, and Orthographic Consonants', () => {
    it('handles ending chillus correctly', () => {
      expect(transliterateWord('avan')).toBe('അവൻ')
      expect(transliterateWord('avar')).toBe('അവർ')
      expect(transliterateWord('kaal')).toBe('കാൽ')
      expect(transliterateWord('aval')).toBe('അവൾ')
    })

    it('handles special consonant digraphs (zh, sh, th, ch)', () => {
      expect(transliterateWord('vazhi')).toBe('വഴി')
      expect(transliterateWord('shanthi')).toBe('ശാന്തി')
    })
  })
})
