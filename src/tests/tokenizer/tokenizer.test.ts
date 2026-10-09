import { describe, expect, it } from 'vitest'
import { tokenizeMalayalam } from '../../core/tokens/tokenizer'

describe('Malayalam Tokenizer', () => {
  it('correctly tokenizes conjunct sequence കണ്ടു into ക, ണ്ട, ു as specified', () => {
    // User requirement: "Input: കണ്ടു -> The tokenizer should conceptually identify: ക, ണ്ട, ു"
    const tokens = tokenizeMalayalam('കണ്ടു')
    expect(tokens.length).toBe(3)

    expect(tokens[0].value).toBe('ക')
    expect(tokens[0].type).toBe('CONSONANT')

    expect(tokens[1].value).toBe('ണ്ട')
    expect(tokens[1].type).toBe('CONJUNCT')

    expect(tokens[2].value).toBe('ു')
    expect(tokens[2].type).toBe('MATRA')
  })

  it('tokenizes independent vowels and consonants', () => {
    const tokens = tokenizeMalayalam('അമ്മ')
    expect(tokens.map((t) => t.value)).toEqual(['അ', 'മ്മ'])
    expect(tokens[0].type).toBe('INDEPENDENT_VOWEL')
    expect(tokens[1].type).toBe('CONJUNCT')
  })

  it('tokenizes atomic chillus and punctuation', () => {
    const tokens = tokenizeMalayalam('അവൻ വന്നു.')
    const values = tokens.map((t) => t.value)
    expect(values).toContain('ൻ')
    expect(values).toContain('ന്ന')
    expect(values).toContain('ു')
    expect(values).toContain('.')
  })

  it('preserves Latin words, numbers, and whitespace segments', () => {
    const tokens = tokenizeMalayalam('Unicode 2026 മലയാളം')
    expect(tokens.some((t) => t.type === 'LATIN' && t.value === 'Unicode')).toBe(true)
    expect(tokens.some((t) => t.type === 'NUMBER' && t.value === '2026')).toBe(true)
    expect(tokens.some((t) => t.type === 'WHITESPACE')).toBe(true)
  })
})
