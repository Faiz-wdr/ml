import { describe, it, expect } from 'vitest'
import { TARGET_FONT_FORMATS } from '../../constants/fonts'
import { convertUnicodeToLegacy, convertLegacyToUnicode } from '../../core'
import { SEO_CONFIGS } from '../../utils/seo'
import { getSavedTexts, saveText, deleteSavedText } from '../../core/storage/savedTexts'

describe('Production Readiness Verification', () => {
  it('includes all primary font formats in TARGET_FONT_FORMATS', () => {
    const ids = TARGET_FONT_FORMATS.map((f) => f.id)
    expect(ids).toContain('ml-tt')
    expect(ids).toContain('scribe')
    expect(ids).toContain('mlkv')
    expect(ids).toContain('fml')
  })

  it('performs FML bidirectional conversion without error', () => {
    const sample = 'മലയാളം'
    const legacy = convertUnicodeToLegacy(sample, 'fml')
    expect(legacy).toBeDefined()
    expect(typeof legacy).toBe('string')
    expect(legacy.length).toBeGreaterThan(0)

    const unicode = convertLegacyToUnicode(legacy, 'fml')
    expect(unicode).toBeDefined()
    expect(unicode).toContain('മലയാളം')
  })

  it('gracefully handles invalid encoding IDs without throwing', () => {
    expect(() => convertUnicodeToLegacy('മലയാളം', 'non-existent-font')).not.toThrow()
    expect(convertUnicodeToLegacy('മലയാളം', 'non-existent-font')).toBe('മലയാളം')
    expect(convertLegacyToUnicode('some text', 'non-existent-font')).toBe('some text')
  })

  it('provides comprehensive SEO metadata for each page route', () => {
    expect(SEO_CONFIGS.font.title).toContain('Malayalam Font Converter')
    expect(SEO_CONFIGS.font.description).toBeTruthy()
    expect(SEO_CONFIGS.manglish.title).toContain('Malayalam Manglish Typing')
    expect(SEO_CONFIGS.manglish.description).toBeTruthy()
    expect(SEO_CONFIGS['404'].title).toContain('Page Not Found')
  })

  it('uses the verified production domain https://ml.faizrahim.online', async () => {
    const { SITE_DOMAIN } = await import('../../utils/seo')
    expect(SITE_DOMAIN).toBe('https://ml.faizrahim.online')
  })

  it('handles storage operations safely without throwing', () => {
    // Empty text should return null
    expect(saveText('   ')).toBeNull()

    // Valid save
    const saved = saveText('ടെസ്റ്റ് സേവ്')
    expect(saved).not.toBeNull()
    if (saved) {
      expect(saved.text).toBe('ടെസ്റ്റ് സേവ്')

      // Deletion
      const deleted = deleteSavedText(saved.id)
      expect(deleted).toBe(true)
    }

    // Reading should always return array
    const all = getSavedTexts()
    expect(Array.isArray(all)).toBe(true)
  })
})
