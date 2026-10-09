import { AppleCardsEncoding } from './encodings/appleCards'
import { FMLEncoding } from './encodings/fml'
import { MLKVEncoding } from './encodings/mlkv'
import { MLTTEncoding } from './encodings/mltt'
import { MVMEncoding } from './encodings/mvm'
import { ScribeEncoding } from './encodings/scribe'
import type { EncodingProfile } from './encodings/types'
import { tokenizeMalayalam } from './tokens/tokenizer'
import type { MalayalamToken } from './tokens/types'
import { normalizeMalayalamText } from './unicode/normalization'

export type { EncodingProfile } from './encodings/types'
export type { MalayalamToken, MalayalamTokenType } from './tokens/types'
export { AppleCardsEncoding } from './encodings/appleCards'
export { FMLEncoding } from './encodings/fml'
export { MLKVEncoding } from './encodings/mlkv'
export { MLTTEncoding } from './encodings/mltt'
export { MVMEncoding } from './encodings/mvm'
export { ScribeEncoding } from './encodings/scribe'

const appleCards = new AppleCardsEncoding()
const mvm = new MVMEncoding()
const scribe = new ScribeEncoding()
const mltt = new MLTTEncoding()
const mlkv = new MLKVEncoding()
const fml = new FMLEncoding()

// Registered encoding registry with canonical IDs and aliases
const encodingsRegistry = new Map<string, EncodingProfile>([
  ['ml-tt', mltt],
  ['mltt', mltt],
  ['karthika', mltt],
  ['mlkv', mlkv],
  ['kairali', mlkv],
  ['fml', fml],
  ['chithra', fml],
  ['indulekha', fml],
  ['apple-cards', appleCards],
  ['apple cards', appleCards],
  ['applecards', appleCards],
  ['mvm', mvm],
  ['scribe', scribe],
  ['scribe font', scribe],
  ['scribefont', scribe],
  ['ml-scribe', scribe],
])

function normalizeEncodingKey(key: string): string {
  return key.toLowerCase().trim()
}

/**
 * Check if an encoding is supported
 */
export function isSupportedEncoding(encodingId: string): boolean {
  return encodingsRegistry.has(normalizeEncodingKey(encodingId))
}

/**
 * Get encoding profile by ID
 */
export function getEncoding(encodingId: string): EncodingProfile | undefined {
  return encodingsRegistry.get(normalizeEncodingKey(encodingId))
}

/**
 * Get all canonical available encoding profiles
 */
export function getAvailableEncodings(): EncodingProfile[] {
  return [mltt, mlkv, fml, appleCards, mvm, scribe]
}

/**
 * Convert Unicode Malayalam text to a Target Legacy Encoding
 */
export function convertUnicodeToLegacy(text: string, encodingId: string): string {
  if (!text) return ''
  try {
    const encoding = getEncoding(encodingId)
    if (!encoding) {
      // Unsupported encoding, return original text safely
      return text
    }
    return encoding.unicodeToLegacy(text)
  } catch {
    return text
  }
}

/**
 * Convert Legacy encoded text back to Malayalam Unicode
 */
export function convertLegacyToUnicode(text: string, encodingId: string): string {
  if (!text) return ''
  try {
    const encoding = getEncoding(encodingId)
    if (!encoding) {
      return text
    }
    return encoding.legacyToUnicode(text)
  } catch {
    return text
  }
}

/**
 * Normalization public helper
 */
export function normalizeMalayalam(text: string): string {
  return normalizeMalayalamText(text)
}

/**
 * Tokenization public helper
 */
export function tokenizeMalayalamText(text: string): MalayalamToken[] {
  return tokenizeMalayalam(text)
}
