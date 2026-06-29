import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '#/lib/gsap'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(lenis.raf)
    }
  }, [lenis])

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: !prefersReducedMotion }}>
      {children}
    </ReactLenis>
  )
}
