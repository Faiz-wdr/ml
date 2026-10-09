import { describe, expect, it } from 'vitest'
import { getSuggestions } from '../../core/manglish/suggestions'

describe('Manglish Suggestion Generation & Ranking', () => {
  it('provides accurately ranked suggestions for njan', () => {
    const suggestions = getSuggestions('njan')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].text).toBe('ഞാൻ')
  })

  it('provides accurately ranked suggestions for sukham', () => {
    const suggestions = getSuggestions('sukham')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].text).toBe('സുഖം')
  })

  it('provides progressive suggestions while typing prefixes', () => {
    // User types 'namas' -> should suggest 'നമസ്കാരം'
    const namasSuggestions = getSuggestions('namas')
    const hasNamaskaram = namasSuggestions.some((s) => s.text === 'നമസ്കാരം')
    expect(hasNamaskaram).toBe(true)

    // User types 'mala' -> should suggest 'മലയാളം'
    const malaSuggestions = getSuggestions('mala')
    const hasMalayalam = malaSuggestions.some((s) => s.text === 'മലയാളം')
    expect(hasMalayalam).toBe(true)
  })

  it('generates multiple candidates and excludes duplicates', () => {
    const suggestions = getSuggestions('ente')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].text).toBe('എന്റെ')

    // Verify all suggestions are unique
    const texts = suggestions.map((s) => s.text)
    const uniqueTexts = new Set(texts)
    expect(texts.length).toBe(uniqueTexts.size)
  })
})
