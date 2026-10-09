import { FMLEncoding } from '../fml'

/**
 * MVM Encoding Profile (Mathrubhumi / Manorama MVM newsprint)
 * In FML & MVM, 'ണ്ട' maps to 'ï'.
 */
export class MVMEncoding extends FMLEncoding {
  public override id = 'mvm'
  public override name = 'MVM'
  public override category = 'Legacy ASCII'
  public override description = 'Mathrubhumi / Manorama MVM newsprint encoding (ï for ണ്ട)'
}
