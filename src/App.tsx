import { useEffect, useState, useCallback } from 'react'
import { AppShell } from './components/layout/AppShell'
import { FontConversionPage } from './pages/FontConversionPage'
import { ManglishPage } from './pages/ManglishPage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { NavTabId } from './types'
import { updatePageSeo } from './utils/seo'

export type CurrentRoute = 'font' | 'manglish' | '404'

function resolveRouteFromLocation(): CurrentRoute {
  if (typeof window === 'undefined') return 'font'

  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase()

  if (hash === 'manglish' || path === '/manglish') {
    return 'manglish'
  }
  if (hash === 'font' || path === '/font' || path === '' || path === '/') {
    return 'font'
  }
  return '404'
}

export function App() {
  const [currentRoute, setCurrentRoute] = useState<CurrentRoute>(resolveRouteFromLocation)

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = resolveRouteFromLocation()
      setCurrentRoute(nextRoute)
      updatePageSeo(nextRoute)
    }

    // Set initial SEO
    updatePageSeo(currentRoute)

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [currentRoute])

  const navigateTo = useCallback((tab: NavTabId) => {
    const targetRoute: CurrentRoute = tab === 'manglish' ? 'manglish' : 'font'
    setCurrentRoute(targetRoute)
    updatePageSeo(targetRoute)

    const targetPath = targetRoute === 'manglish' ? '/manglish' : '/font'
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath)
    }
  }, [])

  const activeTab: NavTabId = currentRoute === 'manglish' ? 'manglish' : 'font'

  return (
    <AppShell activeTab={activeTab} onSelectTab={navigateTo}>
      {currentRoute === 'font' && <FontConversionPage />}
      {currentRoute === 'manglish' && (
        <ManglishPage onBackToFont={() => navigateTo('font')} />
      )}
      {currentRoute === '404' && <NotFoundPage onNavigate={navigateTo} />}
    </AppShell>
  )
}

export default App
