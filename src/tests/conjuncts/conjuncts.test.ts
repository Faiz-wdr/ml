import { describe, expect, it } from 'vitest'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'
import { MALAYALAM_CONJUNCTS_LIST } from '../fixtures/malayalam'

describe('Malayalam Conjuncts (Koottaksharangal) Engine Tests', () => {
  it('correctly maps and reverses each major Malayalam conjunct in ML-TT', () => {
    for (const conjunct of MALAYALAM_CONJUNCTS_LIST) {
      const legacy = convertUnicodeToLegacy(conjunct, 'ml-tt')
      expect(legacy).toBeDefined()
      expect(legacy.length).toBeGreaterThan(0)
      expect(legacy).not.toBe(conjunct)

      // Test round-trip reversal
      const restored = convertLegacyToUnicode(legacy, 'ml-tt')
      expect(restored).toBe(conjunct)
    }
  })

  it('correctly handles conjuncts combined with various vowel signs in ML-TT', () => {
    const testCases = [
      { input: 'പ്പു', desc: 'ppa + u' },
      { input: 'പ്പൂ', desc: 'ppa + uu' },
      { input: 'പ്പി', desc: 'ppa + i' },
      { input: 'പ്പീ', desc: 'ppa + ii' },
      { input: 'പ്പെ', desc: 'ppa + e (prebase)' },
      { input: 'പ്പേ', desc: 'ppa + ee (prebase)' },
      { input: 'പ്പൈ', desc: 'ppa + ai (prebase)' },
      { input: 'പ്പൊ', desc: 'ppa + o (split)' },
      { input: 'പ്പോ', desc: 'ppa + oo (split)' },
      { input: 'ന്താ', desc: 'nta + aa' },
      { input: 'ന്തി', desc: 'nta + i' },
      { input: 'ന്തു', desc: 'nta + u' },
      { input: 'ന്തെ', desc: 'nta + e' },
      { input: 'ന്തോ', desc: 'nta + oo' },
      { input: 'ക്ഷ്യ', desc: 'ksha + ya subscript' },
    ]

    for (const { input } of testCases) {
      const encoded = convertUnicodeToLegacy(input, 'ml-tt')
      expect(encoded).toBeDefined()
      expect(encoded).not.toBe(input)

      const decoded = convertLegacyToUnicode(encoded, 'ml-tt')
      expect(decoded).toBe(input)
    }
  })

  it('correctly handles real Malayalam words containing diverse conjuncts', () => {
    const words = [
      'അമ്മ',     // mma
      'അച്ഛൻ',    // ccha
      'ഭംഗി',     // nggi
      'കണ്ണൻ',    // nna
      'പുസ്തകം',  // sta
      'ശക്തി',    // kti
      'ഭക്തി',    // kti
      'യുദ്ധം',   // ddha
      'സന്തോഷം',  // ntho
      'പ്രകാശം',  // pra
    ]

    for (const word of words) {
      const legacy = convertUnicodeToLegacy(word, 'ml-tt')
      expect(legacy).toBeDefined()
      const restored = convertLegacyToUnicode(legacy, 'ml-tt')
      expect(restored).toBe(word)
    }
  })
})
