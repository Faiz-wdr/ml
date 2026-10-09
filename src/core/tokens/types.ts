export type MalayalamTokenType =
  | 'CONJUNCT'
  | 'CONSONANT'
  | 'INDEPENDENT_VOWEL'
  | 'CHILLU'
  | 'VIRAMA'
  | 'MATRA'
  | 'ANUSVARA'
  | 'VISARGA'
  | 'NUMBER'
  | 'WHITESPACE'
  | 'PUNCTUATION'
  | 'LATIN'
  | 'OTHER'

export interface MalayalamToken {
  type: MalayalamTokenType
  value: string
  startIndex: number
  endIndex: number
}
