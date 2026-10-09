import React, { useEffect, useRef } from 'react'

export interface DotCanvasBackgroundProps {
  className?: string
  dotSize?: number
  gridSpacing?: number
}

/**
 * High-performance, lightweight Google Stitch / Canvas style dot grid background.
 * Features:
 *  - High-density dot matrix canvas
 *  - Ambient drifting aurora nodes illuminating dot clusters (Google Stitch hero vibe)
 *  - Smooth ambient wave shimmer rippling across dots
 *  - Interactive cursor spotlight with reactive dot illumination
 *  - 100% GPU-accelerated CSS animations, 0 JS compute overhead
 */
export const DotCanvasBackground: React.FC<DotCanvasBackgroundProps> = ({
  className = '',
  dotSize = 0.65,
  gridSpacing = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let rafId: number | null = null
    let latestX = -9999
    let latestY = -9999
    let isVisible = false

    const updatePosition = () => {
      if (el) {
        el.style.setProperty('--mouse-x', `${latestX}px`)
        el.style.setProperty('--mouse-y', `${latestY}px`)
        el.style.setProperty('--spotlight-opacity', isVisible ? '1' : '0')
      }
      rafId = null
    }

    const handlePointerMove = (e: PointerEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      isVisible = true

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition)
      }
    }

    const handlePointerLeave = () => {
      isVisible = false
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ${className}`}
      style={
        {
          '--mouse-x': '-9999px',
          '--mouse-y': '-9999px',
          '--spotlight-opacity': '0',
        } as React.CSSProperties
      }
    >
      {/* Layer 1: Ambient Drifting Aurora Glow Orbs (Google Stitch hero lighting) */}
      <div className="absolute top-[10%] left-[15%] w-[520px] h-[520px] rounded-full blur-[110px] bg-gradient-to-tr from-[#A930BB]/18 to-[#D04CE6]/10 animate-stitch-float-1 pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[580px] h-[580px] rounded-full blur-[120px] bg-gradient-to-br from-[#7C3AED]/15 to-[#A930BB]/08 animate-stitch-float-2 pointer-events-none" />

      {/* Layer 2: Base high-density dot matrix (with subtle organic breathing pulse) */}
      <div
        className="absolute inset-0 animate-stitch-breathe"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.09) ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
        }}
      />

      {/* Layer 3: Ambient flowing wave shimmer across dots (Google Stitch hero effect) */}
      <div
        className="absolute inset-[-50%] animate-stitch-wave pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(230, 139, 245, 0.5) ${dotSize + 0.15}px, transparent ${dotSize + 0.15}px)`,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 40% at 50% 50%, black 0%, transparent 70%)',
          maskImage:
            'radial-gradient(ellipse 60% 40% at 50% 50%, black 0%, transparent 70%)',
        }}
      />

      {/* Layer 4: Interactive Hover Spotlight - Glowing dots directly tracking cursor */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: 'var(--spotlight-opacity, 0)',
          backgroundImage: `radial-gradient(rgba(230, 139, 245, 0.9) ${dotSize + 0.25}px, transparent ${dotSize + 0.25}px)`,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          WebkitMaskImage:
            'radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
          maskImage:
            'radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), black 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        }}
      />

      {/* Layer 5: Soft ambient radial spotlight glow trailing the pointer */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: 'var(--spotlight-opacity, 0)',
          background:
            'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(169, 48, 187, 0.09) 0%, transparent 75%)',
        }}
      />

      {/* Layer 6: Vignette around screen edges to focus attention on workspace */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(12, 12, 12, 0.65) 100%)',
        }}
      />
    </div>
  )
}
