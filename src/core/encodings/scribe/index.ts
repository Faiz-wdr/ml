import { SequenceMatcher } from '../../converter/matcher'
import { MLTTEncoding } from '../mltt'
import {
  MLTT_CHILLUS,
  MLTT_CONSONANTS,
  MLTT_INDEPENDENT_VOWELS,
} from '../mltt/mapping'
import { SCRIBE_CONJUNCTS, SCRIBE_REVERSE_MAPPING } from './mapping'

/**
 * Scribe Encoding Profile (ML-Scribe, Scribe fonts)
 * Used in Malayalam DTP & invitation printing.
 * In Scribe font, 'ണ്ട' maps to '>'.
 */
export class ScribeEncoding extends MLTTEncoding {
  public override id = 'scribe'
  public override name = 'Scribe'
  public override category = 'Legacy ASCII'
  public override description = 'Scribe Malayalam display & DTP font encoding (> for ണ്ട)'

  constructor() {
    super()
    this.forwardMatcher = new SequenceMatcher()
    this.reverseMatcher = new SequenceMatcher()

    // Load Scribe conjuncts first (including ണ്ട -> '>')
    this.forwardMatcher.load(SCRIBE_CONJUNCTS)
    this.forwardMatcher.load(MLTT_CONSONANTS)
    this.forwardMatcher.load(MLTT_INDEPENDENT_VOWELS)
    this.forwardMatcher.load(MLTT_CHILLUS)

    // Load Scribe reverse mapping ('>' -> 'ണ്ട')
    this.reverseMatcher.load(SCRIBE_REVERSE_MAPPING)
  }
}
