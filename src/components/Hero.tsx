import { useRef, lazy, Suspense } from 'react'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion } from 'motion/react'

const TransactionNetwork = lazy(() =>
  import('./TransactionNetwork').then(m => ({ default: m.TransactionNetwork }))
)

const TAGS = ['Rust', 'Solana', 'Go', 'Payments', 'Infrastructure', 'PostgreSQL']

function SplitTextReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split('')
  return (
    <span style={{ display: 'inline-block' }}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            type: 'spring',
            damping: 14,
            stiffness: 120,
            delay: delay + i * 0.025,
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 })

    tl.from(subRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power2.out',
    }, 0.9)
      .from(tagsRef.current?.children ?? [], {
        opacity: 0,
        y: 10,
        stagger: 0.07,
        duration: 0.4,
        ease: 'power2.out',
      }, 1.2)
      .from(ctaRef.current?.children ?? [], {
        opacity: 0,
        y: 12,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
      }, 1.5)
      .from(scrollRef.current, {
        opacity: 0,
        duration: 0.5,
      }, 2.2)
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="hero"
      className="hero-grid"
    >
      {/* Radial glow behind headline */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Left: content */}
      <div
        className="container hero-content-col"
        style={{ paddingRight: 0, gridColumn: '1', paddingTop: '2rem', paddingBottom: '2rem' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="chip chip-green" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-signal)', display: 'inline-block' }} />
            Available for new roles
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            perspective: '800px',
          }}
        >
          <div><SplitTextReveal text="Building" delay={0.3} /></div>
          <div>
            <SplitTextReveal text="systems " delay={0.5} />
            <span className="text-gradient" style={{ display: 'inline-block' }}>
              <SplitTextReveal text="for" delay={0.7} />
            </span>
          </div>
          <div>
            <span className="text-gradient" style={{ display: 'inline-block' }}>
              <SplitTextReveal text="money," delay={0.9} />
            </span>
          </div>
          <div><SplitTextReveal text="automation," delay={1.1} /></div>
          <div><SplitTextReveal text="and scale." delay={1.3} /></div>
        </h1>

        <p
          ref={subRef}
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-soft)',
            maxWidth: '480px',
            lineHeight: 1.65,
            marginBottom: '2rem',
          }}
        >
          Software engineer specializing in financial infrastructure — payments, mandates,
          and on-chain systems. 4+ years building systems that move money reliably at scale.
        </p>

        <div ref={tagsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {TAGS.map(tag => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>

        <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="#work"
            onClick={e => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              background: 'var(--electric)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--electric-bright)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--electric)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            View Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a
            href="https://github.com/khrees2412"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--line-bright)',
              color: 'var(--text-soft)',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s, border-color 0.2s, transform 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.borderColor = 'var(--line-bright)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Right: 3D Network */}
      <div className="hero-network-col" style={{ height: '100vh', position: 'relative', gridColumn: '2' }}>
        <Suspense fallback={
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--electric)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          </div>
        }>
          <TransactionNetwork />
        </Suspense>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
        }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--electric), transparent)' }}
        />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </section>
  )
}
