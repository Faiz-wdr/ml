import { describe, expect, it } from 'vitest'
import { getSuggestions } from '../../core/manglish/suggestions'
import { transliterateWord } from '../../core/manglish/transliterator'

describe('Manglish Sentence & Composition Simulation', () => {
  it('correctly transliterates the specification sentence: ente peru faiz aanu', () => {
    const words = ['ente', 'peru', 'faiz', 'aanu']
    const committed = words.map((w) => {
      const topSuggestion = getSuggestions(w)[0]
      return topSuggestion ? topSuggestion.text : transliterateWord(w)
    })

    expect(committed.join(' ')).toBe('എന്റെ പേര് ഫൈസ് ആണ്')
  })

  it('preserves English words in mixed sentences: ente name Faiz aanu', () => {
    const rawTokens = ['ente', 'name', 'Faiz', 'aanu']
    const processed = rawTokens.map((token) => {
      if (token === 'name' || token === 'Faiz') {
        // User opts to keep English word
        return token
      }
      return getSuggestions(token)[0]?.text || token
    })

    expect(processed.join(' ')).toBe('എന്റെ name Faiz ആണ്')
  })

  it('preserves numbers and punctuation in sentences: ente age 27 aanu', () => {
    const input = 'ente age 27 aanu'
    const tokens = input.split(' ')
    const processed = tokens.map((token) => {
      if (/^\d+$/.test(token) || token === 'age') {
        return token
      }
      return getSuggestions(token)[0]?.text || token
    })

    expect(processed.join(' ')).toBe('എന്റെ age 27 ആണ്')
  })

  it('preserves multi-line structure and punctuation', () => {
    const line1 = 'namaskaram, sukhamano?'
    const line2 = 'njan nallathayi irikkunnu.'

    const processLine = (line: string) => {
      return line
        .replace(/([a-zA-Z]+)/g, (match) => {
          const suggestions = getSuggestions(match)
          return suggestions[0]?.text || match
        })
    }

    const processedLine1 = processLine(line1)
    expect(processedLine1).toContain('നമസ്കാരം')
    expect(processedLine1).toContain('?')

    const processedLine2 = processLine(line2)
    expect(processedLine2).toContain('ഞാൻ')
    expect(processedLine2).toContain('.')
  })
})
