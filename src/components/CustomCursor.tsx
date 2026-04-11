import { useEffect, useRef } from 'react'
import { gsap } from '#/lib/gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    const ticker = () => {
      const p = pos.current
      p.rx += (p.x - p.rx) * 0.12
      p.ry += (p.y - p.ry) * 0.12
      gsap.set(ring, { x: p.rx, y: p.ry })
    }

    window.addEventListener('mousemove', onMove)
    gsap.ticker.add(ticker)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
