import { describe, expect, it } from 'vitest'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'

describe('MLKV Conversion Engine', () => {
  it('converts conjunct ണ്ട using MLKV encoding profile to @', () => {
    const legacy = convertUnicodeToLegacy('ണ്ട', 'mlkv')
    expect(legacy).toBe('@') // Updated requirement: MLKV uses @ for ണ്ട
    expect(convertLegacyToUnicode(legacy, 'mlkv')).toBe('ണ്ട')
  })

  it('converts കണ്ടു in MLKV using @', () => {
    const legacyKandu = convertUnicodeToLegacy('കണ്ടു', 'mlkv')
    expect(legacyKandu).toBe('I@p') // ക (I) + ണ്ട (@) + ു (p)
    expect(convertLegacyToUnicode(legacyKandu, 'mlkv')).toBe('കണ്ടു')
  })

  it('converts ണ്ട in Apple Cards to @', () => {
    const legacy = convertUnicodeToLegacy('ണ്ട', 'apple-cards')
    expect(legacy).toBe('@')
    expect(convertLegacyToUnicode(legacy, 'apple-cards')).toBe('ണ്ട')
  })

  it('converts സൗജന്യ in MLKV to kuP\\y and decodes back', () => {
    const legacy = convertUnicodeToLegacy('സൗജന്യ', 'mlkv')
    expect(legacy).toBe('kuP\\y')
    expect(convertLegacyToUnicode(legacy, 'mlkv')).toBe('സൗജന്യ')
    // Backward compatibility for legacy text containing 'skuP\y'
    expect(convertLegacyToUnicode('skuP\\y', 'mlkv')).toBe('സൗജന്യ')
  })
})
