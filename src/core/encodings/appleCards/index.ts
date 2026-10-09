import { MLKVEncoding } from '../mlkv'

/**
 * Apple Cards Encoding Profile
 * Common in Malayalam card and wedding invitation printing.
 * In Apple Cards, 'ണ്ട' maps to '@'.
 */
export class AppleCardsEncoding extends MLKVEncoding {
  public override id = 'apple-cards'
  public override name = 'Apple Cards'
  public override category = 'Legacy ASCII'
  public override description = 'Apple Cards & wedding invitation font encoding (@ for ണ്ട)'
}
