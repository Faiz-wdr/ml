import { describe, expect, it } from 'vitest'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'

describe('Scribe Font Conversion Engine', () => {
  it('converts conjunct ണ്ട in Scribe font to > as specified', () => {
    const legacy = convertUnicodeToLegacy('ണ്ട', 'scribe')
    expect(legacy).toBe('>')
    expect(convertLegacyToUnicode(legacy, 'scribe')).toBe('ണ്ട')
  })

  it('converts കണ്ടു in Scribe font with > for ണ്ട', () => {
    const legacy = convertUnicodeToLegacy('കണ്ടു', 'scribe')
    expect(legacy).toBe('I>p') // ക (I) + ണ്ട (>) + ു (p)
    expect(convertLegacyToUnicode(legacy, 'scribe')).toBe('കണ്ടു')
  })

  it('converts real-world words with ണ്ട in Scribe font', () => {
    const vandi = convertUnicodeToLegacy('വണ്ടി', 'scribe')
    expect(vandi).toBe('h>n') // h (വ) + > (ണ്ട) + n (ി)
    expect(convertLegacyToUnicode(vandi, 'scribe')).toBe('വണ്ടി')
  })

  it('verifies all ണ്ട mapping rules across MLKV, Apple Cards, FML, MVM, and Scribe', () => {
    // 1. In MLKV & Apple cards use "@"
    expect(convertUnicodeToLegacy('ണ്ട', 'mlkv')).toBe('@')
    expect(convertUnicodeToLegacy('ണ്ട', 'apple-cards')).toBe('@')

    // 2. In FML & MVM use "ï"
    expect(convertUnicodeToLegacy('ണ്ട', 'fml')).toBe('ï')
    expect(convertUnicodeToLegacy('ണ്ട', 'mvm')).toBe('ï')

    // 3. In scribe font use ">"
    expect(convertUnicodeToLegacy('ണ്ട', 'scribe')).toBe('>')

    // 4. ML-TT uses visible ï
    expect(convertUnicodeToLegacy('ണ്ട', 'ml-tt')).toBe('ï')
  })
})
