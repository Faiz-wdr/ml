/**
 * FML Encoding Mapping Definition (FML Indulekha / Chithra standard)
 * Verified against SMC Payyans indulekha.map and standard FML typography specifications.
 */

export const FML_CONJUNCTS: Record<string, string> = {
  'ണ്ട': 'ï', // In FML & MVM, ണ്ട maps to 'ï'
  'ക്ക': '¡',
  'ക്ല': '¢',
  'ക്ഷ': '£',
  'ഗ്ഗ': '€',
  'ദ്ദ': '¥',
  'ങ്ക': 'Š',
  'ങ്ങ': '§',
  'ച്ച': 'š',
  'ഞ്ച': '©',
  'ദ്ധ': 'ª',
  'ട്ട': '«',
  'ണ്ണ': '®',
  'ത്ത': '¯',
  'ന്ത': 'Ž',
  'ന്ദ': 'µ',
  'ന്ന': '¶',
}

export const FML_CONSONANTS: Record<string, string> = {
  'ക': 'I',
  'ഖ': 'J',
  'ഗ': 'K',
  'ഘ': 'L',
  'ങ': 'M',
  'ച': 'N',
  'ഛ': 'O',
  'ജ': 'P',
  'ഝ': 'Q',
  'ഞ': 'R',
  'ട': 'S',
  'ഠ': 'T',
  'ഡ': 'U',
  'ഢ': 'V',
  'ണ': 'W',
  'ത': 'X',
  'ഥ': 'Y',
  'ദ': 'Z',
  'ധ': '[',
  'ന': '\\',
  'പ': ']',
  'ഫ': '^',
  'ബ': '_',
  'ഭ': '`',
  'മ': 'a',
  'യ': 'b',
  'ര': 'c',
  'ല': 'd',
  'വ': 'e',
  'ശ': 'f',
  'ഷ': 'g',
  'സ': 'h',
  'ഹ': 'i',
  'ള': 'j',
  'ഴ': 'k',
  'റ': 'l',
}

export const FML_INDEPENDENT_VOWELS: Record<string, string> = {
  'അ': 'A',
  'ആ': 'B',
  'ഇ': 'C',
  'ഈ': 'Cu',
  'ഉ': 'D',
  'ഊ': 'Du',
  'ഋ': 'E',
  'ഌ': '\\p',
  'എ': 'F',
  'ഏ': 'G',
  'ഐ': 'sF',
  'ഒ': 'H',
  'ഓ': 'Hm',
  'ഔ': 'Hu',
}

export const FML_CHILLUS: Record<string, string> = {
  'ൺ': '¬',
  'ൻ': '°',
  'ർ': '±',
  'ൽ': '²',
  'ൾ': '³',
  'ൿ': 'Im',
}

export const FML_MATRAS = {
  VIRAMA: 'm', // ്
  AA: 'n',     // ാ
  I: 'o',      // ി
  II: 'p',     // ീ
  U: 'q',      // ു
  UU: 'r',     // ൂ
  R: 's',      // ൃ
  E: 't',      // െ (prebase)
  EE: 'u',     // േ (prebase)
  AI: 'ss',    // ൈ (prebase)
  AU: 'v',     // ൗ
  ANUSVARA: 'w', // ം
  VISARGA: 'x',  // ഃ
} as const

export const FML_REVERSE_MAPPING: Record<string, string> = {
  // Conjuncts
  'ï': 'ണ്ട',
  'ï ': 'ണ്ട',
  '­': 'ണ്ട',
  '¡': 'ക്ക',
  '¢': 'ക്ല',
  '£': 'ക്ഷ',
  '€': 'ഗ്ഗ',
  '¥': 'ദ്ദ',
  'Š': 'ങ്ക',
  '§': 'ങ്ങ',
  'š': 'ച്ച',
  '©': 'ഞ്ച',
  'ª': 'ദ്ധ',
  '«': 'ട്ട',
  '®': 'ണ്ണ',
  '¯': 'ത്ത',
  'Ž': 'ന്ത',
  'µ': 'ന്ദ',
  '¶': 'ന്ന',

  // Chillus
  '¬': 'ൺ',
  '°': 'ൻ',
  '±': 'ർ',
  '²': 'ൽ',
  '³': 'ൾ',

  // Vowels
  'A': 'അ',
  'B': 'ആ',
  'C': 'ഇ',
  'D': 'ഉ',
  'E': 'ഋ',
  'F': 'എ',
  'G': 'ഏ',
  'H': 'ഒ',

  // Consonants
  'I': 'ക',
  'J': 'ഖ',
  'K': 'ഗ',
  'L': 'ഘ',
  'M': 'ങ',
  'N': 'ച',
  'O': 'ഛ',
  'P': 'ജ',
  'Q': 'ഝ',
  'R': 'ഞ',
  'S': 'ട',
  'T': 'ഠ',
  'U': 'ഡ',
  'V': 'ഢ',
  'W': 'ണ',
  'X': 'ത',
  'Y': 'ഥ',
  'Z': 'ദ',
  '[': 'ധ',
  '\\': 'ന',
  ']': 'പ',
  '^': 'ഫ',
  '_': 'ബ',
  '`': 'ഭ',
  'õ': 'ഭ',
  'a': 'മ',
  'b': 'യ',
  'c': 'ര',
  'd': 'ല',
  'e': 'വ',
  'f': 'ശ',
  'g': 'ഷ',
  'h': 'സ',
  'i': 'ഹ',
  'j': 'ള',
  'k': 'ഴ',
  'l': 'റ',

  // Matras
  'm': '്',
  'n': 'ാ',
  'o': 'ി',
  'p': 'ീ',
  'q': 'ു',
  'r': 'ൂ',
  's': 'ൃ',
  't': 'െ',
  'u': 'േ',
  'v': 'ൗ',
  'w': 'ം',
  'x': 'ഃ',
}
