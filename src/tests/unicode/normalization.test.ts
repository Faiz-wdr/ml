import { describe, expect, it } from 'vitest'
import { normalizeMalayalamText } from '../../core/unicode/normalization'

describe('Malayalam Unicode Normalization', () => {
  it('normalizes legacy ZWJ sequences to atomic chillus', () => {
    // ൺ: ണ + ് + ZWJ
    const legacyNn = '\u0D23\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyNn)).toBe('ൺ')

    // ൻ: ന + ് + ZWJ
    const legacyN = '\u0D28\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyN)).toBe('ൻ')

    // ർ: ര + ് + ZWJ
    const legacyR = '\u0D30\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyR)).toBe('ർ')

    // ൽ: ല + ് + ZWJ
    const legacyL = '\u0D32\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyL)).toBe('ൽ')

    // ൾ: ള + ് + ZWJ
    const legacyLl = '\u0D33\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyLl)).toBe('ൾ')

    // ൿ: ക + ് + ZWJ
    const legacyK = '\u0D15\u0D4D\u200D'
    expect(normalizeMalayalamText(legacyK)).toBe('ൿ')
  })

  it('normalizes split vowel sign sequences', () => {
    // െ + ാ => ൊ
    const splitO = 'ക' + '\u0D46' + '\u0D3E'
    expect(normalizeMalayalamText(splitO)).toBe('കൊ')

    // േ + ാ => ോ
    const splitOo = 'ക' + '\u0D47' + '\u0D3E'
    expect(normalizeMalayalamText(splitOo)).toBe('കോ')

    // െ + ൗ => ൗ
    const splitAu = 'ക' + '\u0D46' + '\u0D57'
    expect(normalizeMalayalamText(splitAu)).toBe('കൗ')
  })

  it('cleans up zero-width spaces and BOM while preserving Malayalam text', () => {
    const dirty = '\uFEFFമലയാളം\u200B'
    expect(normalizeMalayalamText(dirty)).toBe('മലയാളം')
  })

  it('handles empty and null inputs safely', () => {
    expect(normalizeMalayalamText('')).toBe('')
  })
})
