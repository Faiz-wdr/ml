import type { FontFormat } from '../types'

/**
 * Supported Target Font Formats
 * Production-ready sequence-aware legacy font profiles.
 */
export const TARGET_FONT_FORMATS: FontFormat[] = [
  {
    id: 'ml-tt',
    name: 'ML-TT',
    category: 'Legacy ASCII',
    description: 'ML-TT Karthika, Revathi, and standard bilingual DTP fonts',
    sampleFonts: ['ML-TT Karthika', 'ML-TT Revathi', 'ML-TT Haritha'],
    isPopular: false,
  },
  {
    id: 'scribe',
    name: 'Scribe',
    category: 'Legacy ASCII',
    description: 'Scribe Malayalam display and DTP typography (> for ണ്ട)',
    sampleFonts: ['ML-Scribe', 'Scribe Malayalam'],
    isPopular: false,
  },
  {
    id: 'mlkv',
    name: 'MLKV',
    category: 'Legacy ASCII',
    description: 'MLKV Kairali, Panchami, and ML-Nandi encoding (@ for ണ്ട)',
    sampleFonts: ['ML-Kairali', 'MLKV Panchami', 'ML-Nandi'],
    isPopular: false,
  },
  {
    id: 'fml',
    name: 'FML',
    category: 'Legacy ASCII',
    description: 'FML Chithra, Indulekha, and classic Malayalam DTP fonts',
    sampleFonts: ['FML-Chithra', 'FML-Indulekha'],
    isPopular: false,
  },
]

export const DEFAULT_SOURCE_FORMAT = {
  id: 'unicode',
  name: 'Unicode Malayalam',
  description: 'Standard modern Malayalam (UTF-8) script',
}
