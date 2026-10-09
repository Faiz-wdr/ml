/**
 * Scribe Encoding Mapping Definition
 * Popular in Kerala DTP and wedding/invitation typography.
 * Distinctive rule: ണ്ട is mapped to '>'
 */

import { MLTT_CONJUNCTS, MLTT_REVERSE_MAPPING } from '../mltt/mapping'

export const SCRIBE_CONJUNCTS: Record<string, string> = {
  ...MLTT_CONJUNCTS,
  'ണ്ട': '>', // In Scribe font, ണ്ട maps to '>'
}

export const SCRIBE_REVERSE_MAPPING: Record<string, string> = {
  ...MLTT_REVERSE_MAPPING,
  '>': 'ണ്ട',
}
