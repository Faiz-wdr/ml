/**
 * Malayalam Phonetic Transliteration Rules & Orthographic Definitions
 */

export interface VowelDefinition {
  independent: string
  matra: string
}

export const INDEPENDENT_VOWELS: Record<string, string> = {
  aa: 'ആ',
  a: 'അ',
  ii: 'ഈ',
  ee: 'ഈ',
  i: 'ഇ',
  uu: 'ഊ',
  oo: 'ഊ',
  u: 'ഉ',
  e: 'എ',
  ea: 'ഏ',
  ai: 'ഐ',
  ei: 'ഐ',
  o: 'ഒ',
  oa: 'ഓ',
  au: 'ഔ',
  ou: 'ഔ',
}

export const VOWEL_MATRAS: Record<string, string> = {
  aa: 'ാ',
  a: '', // Inherent 'a' suppresses virama
  ii: 'ീ',
  ee: 'ീ',
  i: 'ി',
  uu: 'ൂ',
  oo: 'ൂ',
  u: 'ു',
  e: 'െ',
  ea: 'േ',
  ai: 'ൈ',
  ei: 'ൈ',
  o: 'ൊ',
  oa: 'ോ',
  au: 'ൗ',
  ou: 'ൗ',
}

/**
 * Phonetic Clusters (ordered by longest prefix first for greedy matching)
 */
export const CONSONANT_CLUSTERS: [string, string][] = [
  // Special full word stems or complex ligatures
  ['njangalkku', 'ഞങ്ങൾക്ക്'],
  ['njangal', 'ഞങ്ങൾ'],
  ['nammal', 'നമ്മൾ'],
  ['ningal', 'നിങ്ങൾ'],
  ['njan', 'ഞാൻ'],
  ['njaan', 'ഞാൻ'],
  ['njān', 'ഞാൻ'],
  ['ksha', 'ക്ഷ'],
  ['thra', 'ത്ര'],
  ['shra', 'ശ്ര'],
  ['sree', 'ശ്രീ'],
  ['shree', 'ശ്രീ'],

  // Triple/Subscript consonants
  ['pra', 'പ്ര'],
  ['gra', 'ഗ്ര'],
  ['kra', 'ക്ര'],
  ['tra', 'ട്ര'],
  ['bra', 'ബ്ര'],
  ['dra', 'ദ്ര'],
  ['mbra', 'മ്പ്ര'],
  ['ndra', 'ണ്ട്ര'],
  ['ntra', 'ന്ത്ര'],

  // Double and conjunct consonants
  ['chcha', 'ച്ച'],
  ['ccha', 'ച്ച'],
  ['ncha', 'ഞ്ച'],
  ['njha', 'ഞ്ഞ'],
  ['nja', 'ഞ്ഞ'],
  ['ntha', 'ന്ത'],
  ['nda', 'ണ്ട'],
  ['nta', 'ന്റ'],
  ['nka', 'ങ്ക'],
  ['nga', 'ങ്ങ'],
  ['mma', 'മ്മ'],
  ['mpa', 'മ്പ'],
  ['mba', 'മ്പ'],
  ['kka', 'ക്ക'],
  ['gga', 'ഗ്ഗ'],
  ['jja', 'ജ്ജ'],
  ['tta', 'ട്ട'],
  ['ddha', 'ദ്ധ'],
  ['dda', 'ഡ്ഡ'],
  ['nna', 'ന്ന'],
  ['NNa', 'ണ്ണ'],
  ['ththa', 'ത്ത'],
  ['ttha', 'ത്ത'],
  ['ppa', 'പ്പ'],
  ['bba', 'ബ്ബ'],
  ['yya', 'യ്യ'],
  ['rra', 'റ്റ'],
  ['lla', 'ല്ല'],
  ['LLa', 'ള്ള'],
  ['vva', 'വ്വ'],
  ['shsha', 'ശ്ശ'],
  ['ssa', 'സ്സ'],
  ['hha', 'ഹ്ഹ'],

  // Sibilant clusters
  ['sth', 'സ്ഥ'],
  ['st', 'സ്റ്റ'],
  ['sk', 'സ്ക'],
  ['sp', 'സ്പ'],
  ['sm', 'സ്മ'],
  ['sn', 'സ്ന'],
  ['sw', 'സ്വ'],

  // Digraphs
  ['zh', 'ഴ'],
  ['kh', 'ഖ'],
  ['gh', 'ഘ'],
  ['jh', 'ഝ'],
  ['ph', 'ഫ'],
  ['bh', 'ഭ'],
  ['th', 'ത'],
  ['dh', 'ധ'],
  ['ch', 'ച'],
  ['sh', 'ശ'],
  ['Sh', 'ഷ'],
  ['ng', 'ങ്ങ'],
  ['nj', 'ഞ'],

  // Single consonants
  ['k', 'ക'],
  ['g', 'ഗ'],
  ['j', 'ജ'],
  ['t', 'ട'],
  ['d', 'ദ'],
  ['T', 'ത'],
  ['D', 'ഡ'],
  ['n', 'ന'],
  ['N', 'ണ'],
  ['p', 'പ'],
  ['b', 'ബ'],
  ['m', 'മ'],
  ['y', 'യ'],
  ['r', 'ര'],
  ['R', 'റ'],
  ['l', 'ല'],
  ['L', 'ള'],
  ['v', 'വ'],
  ['w', 'വ'],
  ['s', 'സ'],
  ['h', 'ഹ'],
  ['f', 'ഫ'],
]

/**
 * End-of-word chillu characters
 */
export const ENDING_CHILLUS: Record<string, string> = {
  n: 'ൻ',
  N: 'ൺ',
  r: 'ർ',
  R: 'ർ',
  l: 'ൽ',
  L: 'ൾ',
  k: 'ൿ',
  m: 'ം', // Word-ending 'm' commonly turns into Anusvara (സുഖം, മലയാളം, നമസ്കാരം)
}
