/**
 * Malayalam words, phrases, and sentences test corpus
 */

export const MALAYALAM_BASIC_CONSONANTS = [
  'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ',
  'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ',
  'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ',
  'ത', 'ഥ', 'ദ', 'ധ', 'ന',
  'പ', 'ഫ', 'ബ', 'ഭ', 'മ',
  'യ', 'ര', 'റ', 'ല', 'ള', 'ഴ',
  'വ', 'ശ', 'ഷ', 'സ', 'ഹ'
]

export const MALAYALAM_BASIC_VOWELS = [
  'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ'
]

export const MALAYALAM_CHILLUS = [
  'ൺ', 'ൻ', 'ർ', 'ൽ', 'ൾ', 'ൿ'
]

export const MALAYALAM_CONJUNCTS_LIST = [
  'ക്ക', 'ങ്ങ', 'ച്ച', 'ഞ്ഞ', 'ട്ട', 'ണ്ണ', 'ത്ത', 'ന്ന',
  'പ്പ', 'മ്മ', 'മ്പ', 'ണ്ട', 'ന്ത', 'ങ്ക', 'ക്ഷ', 'ത്ര'
]

export const NDA_VOWEL_COMBINATIONS = [
  { unicode: 'ണ്ട', desc: 'base conjunct' },
  { unicode: 'ണ്ടാ', desc: 'aa matra' },
  { unicode: 'ണ്ടി', desc: 'i matra' },
  { unicode: 'ണ്ടീ', desc: 'ii matra' },
  { unicode: 'ണ്ടു', desc: 'u matra' },
  { unicode: 'ണ്ടൂ', desc: 'uu matra' },
  { unicode: 'ണ്ടെ', desc: 'e matra (prebase)' },
  { unicode: 'ണ്ടേ', desc: 'ee matra (prebase)' },
  { unicode: 'ണ്ടൈ', desc: 'ai matra (prebase)' },
  { unicode: 'ണ്ടൊ', desc: 'o matra (split)' },
  { unicode: 'ണ്ടോ', desc: 'oo matra (split)' },
  { unicode: 'ണ്ടൗ', desc: 'au matra (split)' },
]

export const REAL_WORLD_NDA_WORDS = [
  'കണ്ടു',
  'കണ്ടത്',
  'കണ്ടാൽ',
  'കണ്ടെത്തി',
  'വണ്ടി',
  'വണ്ടികൾ',
  'മണ്ടൻ',
  'പണ്ടാരം',
  'തണ്ടുകൾ'
]

export const REAL_WORLD_MALAYALAM_PARAGRAPHS = [
  'കേരളത്തിന്റെ തനതായ ഭാഷയാണ് മലയാളം. ദ്രാവിഡ ഭാഷാ കുടുംബത്തിൽപ്പെടുന്ന ഒരു പ്രധാന ഭാഷയാണിത്.',
  'മലയാള മനോരമ, മാതൃഭൂമി തുടങ്ങിയ ദിനപത്രങ്ങൾ കേരളത്തിൽ പ്രചാരത്തിലുള്ള പ്രമുഖ മാധ്യമങ്ങളാണ്.',
  'കംപ്യൂട്ടറിലും മൊബൈലിലും മലയാളം യൂണികോഡ് വ്യാപകമാകുന്നതിനു മുൻപ് ഡിടിപി ആവശ്യങ്ങൾക്കായി ഇത്തരം ലെഗസി ഫോണ്ടുകളാണ് ഉപയോഗിച്ചിരുന്നത്.'
]
