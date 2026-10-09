/**
 * Malayalam Unicode character definitions, code ranges, and categories.
 * Unicode range: U+0D00 - U+0D7F
 */

export const MALAYALAM_INDEPENDENT_VOWELS = [
  'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'ഌ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'
] as const

export const MALAYALAM_CONSONANTS = [
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ',
  'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ',
  'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
  'ത', 'ഥ', 'ദ', 'ധ', 'ന',
  'പ', 'ഫ', 'ബ', 'ഭ', 'മ',
  'യ', 'ര', 'റ', 'ല', 'ള', 'ഴ',
  'വ', 'ശ', 'ഷ', 'സ', 'ഹ'
] as const

export const VIRAMA = '്' // U+0D4D
export const ANUSVARA = 'ം' // U+0D02
export const VISARGA = 'ഃ' // U+0D03
export const ZWJ = '\u200D' // Zero Width Joiner
export const ZWNJ = '\u200C' // Zero Width Non-Joiner

/**
 * Atomic Chillus (Unicode 5.1+)
 */
export const ATOMIC_CHILLUS = {
  NN: 'ൺ', // U+0D7A
  N: 'ൻ',  // U+0D7B
  RR: 'ർ', // U+0D7C
  L: 'ൽ',  // U+0D7D
  LL: 'ൾ', // U+0D7E
  K: 'ൿ',  // U+0D7F
} as const

/**
 * Pre-base (left-positioned) vowel signs that visually precede the base consonant
 * in legacy ASCII typefaces:
 * െ (U+0D46 - e)
 * േ (U+0D47 - ee)
 * ൈ (U+0D48 - ai)
 */
export const PREBASE_MATRAS = ['െ', 'േ', 'ൈ'] as const

/**
 * Split (two-part) vowel signs:
 * ൊ (U+0D4A) = െ + ാ
 * ോ (U+0D4B) = േ + ാ
 * ൌ (U+0D4C) / ൗ (U+0D57) = െ + ൗ
 */
export const SPLIT_MATRAS = ['ൊ', 'ോ', 'ൌ', 'ൗ'] as const

/**
 * Post-base vowel signs:
 * ാ, ി, ീ, ു, ൂ, ൃ, ൄ
 */
export const POSTBASE_MATRAS = ['ാ', 'ി', 'ീ', 'ു', 'ൂ', 'ൃ', 'ൄ'] as const

/**
 * Check if a character is within the Malayalam Unicode block (U+0D00 to U+0D7F)
 */
export function isMalayalamChar(char: string): boolean {
  if (!char) return false
  const code = char.charCodeAt(0)
  return code >= 0x0D00 && code <= 0x0D7F
}

/**
 * Check if a character is a consonant
 */
export function isConsonant(char: string): boolean {
  return (MALAYALAM_CONSONANTS as readonly string[]).includes(char)
}

/**
 * Check if a character is an independent vowel
 */
export function isIndependentVowel(char: string): boolean {
  return (MALAYALAM_INDEPENDENT_VOWELS as readonly string[]).includes(char)
}

/**
 * Check if a character is a vowel sign (matra)
 */
export function isMatra(char: string): boolean {
  return (
    (PREBASE_MATRAS as readonly string[]).includes(char) ||
    (SPLIT_MATRAS as readonly string[]).includes(char) ||
    (POSTBASE_MATRAS as readonly string[]).includes(char)
  )
}

/**
 * Check if a character is an atomic chillu
 */
export function isChillu(char: string): boolean {
  return Object.values(ATOMIC_CHILLUS).includes(char as (typeof ATOMIC_CHILLUS)[keyof typeof ATOMIC_CHILLUS])
}
