import { ATOMIC_CHILLUS } from './characterTypes'

/**
 * Normalizes Malayalam Unicode text:
 * 1. Converts to NFC (Canonical Composition).
 * 2. Unifies legacy Chillu sequences (Consonant + Virama + ZWJ/ZWNJ) to canonical atomic Chillus.
 * 3. Normalizes composite split vowel signs (e.g. െ + ാ => ൊ, േ + ാ => ോ).
 * 4. Normalizes Au length mark variations (\u0D4C vs \u0D57).
 * 5. Cleans up non-rendering zero-width artifacts (\u200B, \uFEFF).
 */
export function normalizeMalayalamText(input: string): string {
  if (!input) return ''

  // Step 1: Standard NFC decomposition/recomposition
  let text = input.normalize('NFC')

  // Step 2: Remove byte order mark and zero-width non-visible space
  text = text.replace(/[\uFEFF\u200B]/g, '')

  // Step 3: Normalize legacy Chillu sequences (Consonant + Virama + ZWJ) to atomic Unicode chillus
  // ൺ: ണ + ് + ZWJ (U+0D23 + U+0D4D + U+200D)
  text = text.replace(/\u0D23\u0D4D\u200D/g, ATOMIC_CHILLUS.NN)
  // ൻ: ന + ് + ZWJ (U+0D28 + U+0D4D + U+200D)
  text = text.replace(/\u0D28\u0D4D\u200D/g, ATOMIC_CHILLUS.N)
  // ർ: ര + ് + ZWJ (U+0D30 + U+0D4D + U+200D)
  text = text.replace(/\u0D30\u0D4D\u200D/g, ATOMIC_CHILLUS.RR)
  // ൽ: ല + ് + ZWJ (U+0D32 + U+0D4D + U+200D)
  text = text.replace(/\u0D32\u0D4D\u200D/g, ATOMIC_CHILLUS.L)
  // ൾ: ള + ് + ZWJ (U+0D33 + U+0D4D + U+200D)
  text = text.replace(/\u0D33\u0D4D\u200D/g, ATOMIC_CHILLUS.LL)
  // ൿ: ക + ് + ZWJ (U+0D15 + U+0D4D + U+200D)
  text = text.replace(/\u0D15\u0D4D\u200D/g, ATOMIC_CHILLUS.K)

  // Also handle legacy chillu sequences ending in ZWNJ or archaic typing
  text = text.replace(/\u0D23\u0D4D\u200C/g, ATOMIC_CHILLUS.NN)
  text = text.replace(/\u0D28\u0D4D\u200C/g, ATOMIC_CHILLUS.N)
  text = text.replace(/\u0D30\u0D4D\u200C/g, ATOMIC_CHILLUS.RR)
  text = text.replace(/\u0D32\u0D4D\u200C/g, ATOMIC_CHILLUS.L)
  text = text.replace(/\u0D33\u0D4D\u200C/g, ATOMIC_CHILLUS.LL)

  // Step 4: Normalize split vowel sign sequences
  // െ + ാ -> ൊ
  text = text.replace(/\u0D46\u0D3E/g, 'ൊ')
  // േ + ാ -> ോ
  text = text.replace(/\u0D47\u0D3E/g, 'ോ')
  // െ + ൗ / െ + ൌ -> ൗ
  text = text.replace(/\u0D46[\u0D4C\u0D57]/g, 'ൗ')

  // Step 5: Normalize Au sign representations (U+0D4C vs U+0D57)
  text = text.replace(/\u0D4C/g, 'ൗ')

  return text
}
