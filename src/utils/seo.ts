export interface PageSeoConfig {
  title: string
  description: string
  canonicalPath: string
}

export const SEO_CONFIGS: Record<'font' | 'manglish' | '404', PageSeoConfig> = {
  font: {
    title: 'Malayalam Font Converter | Unicode, ML-TT, MLKV & FML',
    description: 'Convert Malayalam text between Unicode and legacy font encodings quickly and accurately.',
    canonicalPath: '/font',
  },
  manglish: {
    title: 'Malayalam Manglish Typing | Type Malayalam Easily',
    description: 'Type Malayalam using Manglish with smart suggestions and fast Unicode transliteration.',
    canonicalPath: '/manglish',
  },
  '404': {
    title: 'Page Not Found | Malayalam Converter',
    description: 'The requested page could not be found.',
    canonicalPath: '',
  },
}

export function updatePageSeo(pageKey: 'font' | 'manglish' | '404'): void {
  if (typeof document === 'undefined') return

  const config = SEO_CONFIGS[pageKey]
  if (!config) return

  // Update title
  document.title = config.title

  // Update meta description
  const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (metaDesc) {
    metaDesc.content = config.description
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.content = config.title
  }

  const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  if (ogDesc) {
    ogDesc.content = config.description
  }

  // Update Twitter tags
  const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
  if (twitterTitle) {
    twitterTitle.content = config.title
  }

  const twitterDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
  if (twitterDesc) {
    twitterDesc.content = config.description
  }

  // Update canonical link
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical && config.canonicalPath) {
    try {
      const baseUrl = window.location.origin
      canonical.href = `${baseUrl}${config.canonicalPath}`
    } catch {
      // Safe fallback
    }
  }
}
