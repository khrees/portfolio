import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

type DebugInfo = {
  fps: number
  scrollY: number
  scrollSpeed: number
  mode: string
}

export function EasterEggs({ onOpenTerminal: _onOpenTerminal }: { onOpenTerminal: () => void }) {
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({ fps: 60, scrollY: 0, scrollSpeed: 0, mode: 'normal' })
  const konamiIndex = useRef(0)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const scrollSpeedRef = useRef(0)
  const fpsFrames = useRef(0)
  const fpsLast = useRef(Date.now())

  // Konami code only — no global "first key opens terminal"
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current++
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0
          setDebugMode(d => !d)
        }
      } else {
        konamiIndex.current = 0
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Scroll speed detection + cinematic/glitch mode
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      const now = Date.now()
      const dt = now - lastScrollTime.current
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      scrollSpeedRef.current = dt > 0 ? dy / dt : 0
      lastScrollY.current = window.scrollY
      lastScrollTime.current = now

      const speed = scrollSpeedRef.current

      if (speed > 3) {
        // Fast scroll → glitch
        document.body.classList.add('glitch-active')
        clearTimeout(raf as unknown as ReturnType<typeof setTimeout>)
        raf = setTimeout(() => document.body.classList.remove('glitch-active'), 300) as unknown as number
      } else if (speed < 0.5 && speed > 0) {
        // Slow scroll → cinematic
        document.body.classList.add('cinematic-mode')
        clearTimeout(raf as unknown as ReturnType<typeof setTimeout>)
        raf = setTimeout(() => document.body.classList.remove('cinematic-mode'), 800) as unknown as number
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // FPS + debug info updater
  useEffect(() => {
    if (!debugMode) return

    let rafId = 0
    const tick = () => {
      fpsFrames.current++
      const now = Date.now()
      if (now - fpsLast.current >= 500) {
        const fps = Math.round(fpsFrames.current / ((now - fpsLast.current) / 1000))
        fpsFrames.current = 0
        fpsLast.current = now
        setDebugInfo({
          fps,
          scrollY: Math.round(window.scrollY),
          scrollSpeed: Math.round(scrollSpeedRef.current * 100) / 100,
          mode: scrollSpeedRef.current > 3 ? 'GLITCH' : scrollSpeedRef.current < 0.5 && scrollSpeedRef.current > 0 ? 'CINEMATIC' : 'NORMAL',
        })
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [debugMode])

  return (
    <AnimatePresence>
      {debugMode && (
        <motion.div
          className="debug-overlay"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ marginBottom: '0.75rem', color: 'var(--electric-bright)', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
            // DEBUG MODE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <DebugRow label="FPS" value={`${debugInfo.fps}`} good={debugInfo.fps >= 55} />
            <DebugRow label="SCROLL_Y" value={`${debugInfo.scrollY}px`} />
            <DebugRow label="SCROLL_SPEED" value={`${debugInfo.scrollSpeed}`} />
            <DebugRow label="SCROLL_MODE" value={debugInfo.mode} good={debugInfo.mode === 'CINEMATIC'} bad={debugInfo.mode === 'GLITCH'} />
          </div>
          <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.6rem' }}>
            Press ↑↑↓↓←→←→BA to toggle
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DebugRow({ label, value, good, bad }: { label: string; value: string; good?: boolean; bad?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: bad ? '#f87171' : good ? 'var(--green-signal)' : 'var(--electric-bright)' }}>
        {value}
      </span>
    </div>
  )
}
