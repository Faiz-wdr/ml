import { describe, expect, it } from 'vitest'
import { convertLegacyToUnicode, convertUnicodeToLegacy } from '../../core'

describe('FML Conversion Engine', () => {
  it('converts basic text to FML using verified FML mappings', () => {
    // In FML, 'd' is ല, 'e' is വ, virama is 'm', 'n' is ാ
    const legacy = convertUnicodeToLegacy('മലയാളം', 'fml')
    expect(legacy).toBeDefined()
    expect(legacy.length).toBeGreaterThan(0)

    // FML uses 't' for െ and 'u' for േ
    const ke = convertUnicodeToLegacy('കെ', 'fml')
    expect(ke).toBe('tI') // t + I
    expect(convertLegacyToUnicode('tI', 'fml')).toBe('കെ')
  })

  it('converts conjunct ണ്ട in FML and MVM to ï', () => {
    const legacyNda = convertUnicodeToLegacy('ണ്ട', 'fml')
    expect(legacyNda).toBe('ï')
    expect(convertLegacyToUnicode(legacyNda, 'fml')).toBe('ണ്ട')

    // Also decodes legacy texts with trailing space or alternate
    expect(convertLegacyToUnicode('ï ', 'fml')).toBe('ണ്ട')

    // MVM profile
    const mvmNda = convertUnicodeToLegacy('ണ്ട', 'mvm')
    expect(mvmNda).toBe('ï')
    expect(convertLegacyToUnicode(mvmNda, 'mvm')).toBe('ണ്ട')
  })
})
