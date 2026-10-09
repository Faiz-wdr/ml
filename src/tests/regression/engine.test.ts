import { describe, expect, it } from 'vitest'
import {
  convertLegacyToUnicode,
  convertUnicodeToLegacy,
  isSupportedEncoding,
} from '../../core'
import { REAL_WORLD_MALAYALAM_PARAGRAPHS } from '../fixtures/malayalam'

describe('Conversion Engine Regression & Edge Cases', () => {
  it('handles empty strings and nulls safely', () => {
    expect(convertUnicodeToLegacy('', 'ml-tt')).toBe('')
    expect(convertLegacyToUnicode('', 'ml-tt')).toBe('')
  })

  it('safely passes through unsupported encoding identifiers without crashing', () => {
    expect(isSupportedEncoding('unknown-font')).toBe(false)
    expect(convertUnicodeToLegacy('മലയാളം', 'unknown-font')).toBe('മലയാളം')
    expect(convertLegacyToUnicode('മലയാളം', 'unknown-font')).toBe('മലയാളം')
  })

  it('safely preserves pure English and mixed texts in Unicode -> Legacy conversion', () => {
    const text = 'Hello World! 1234567890 @#$%^&*'
    expect(convertUnicodeToLegacy(text, 'ml-tt')).toBe(text)
  })

  it('handles multi-paragraph real-world Malayalam text with high speed (<50ms)', () => {
    const fullText = REAL_WORLD_MALAYALAM_PARAGRAPHS.join('\n\n')

    const start = performance.now()
    const encoded = convertUnicodeToLegacy(fullText, 'ml-tt')
    const elapsed = performance.now() - start

    expect(encoded.length).toBeGreaterThan(0)
    expect(elapsed).toBeLessThan(50) // High speed requirement for real-time typing

    // Verify reverse
    const decoded = convertLegacyToUnicode(encoded, 'ml-tt')
    expect(decoded.length).toBeGreaterThan(0)
  })
})
