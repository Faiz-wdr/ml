export interface EncodingProfile {
  id: string
  name: string
  category: string
  description: string
  unicodeToLegacy: (text: string) => string
  legacyToUnicode: (text: string) => string
}
