import { useRef } from 'react'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion } from 'motion/react'

type Region = {
  name: string
  x: string
  y: string
  label: string
  color: string
}

const REGIONS: Region[] = [
  { name: 'Lagos', x: '49%', y: '56%', label: 'NG', color: '#10b981' },
  { name: 'London', x: '48%', y: '30%', label: 'UK', color: '#6366f1' },
  { name: 'New York', x: '26%', y: '38%', label: 'US', color: '#8b5cf6' },
  { name: 'Nairobi', x: '56%', y: '57%', label: 'KE', color: '#06b6d4' },
]

const CONNECTIONS = [
  { from: 'Lagos', to: 'London' },
  { from: 'London', to: 'New York' },
  { from: 'Lagos', to: 'New York' },
  { from: 'Lagos', to: 'Nairobi' },
]

function AnimatedDot({ delay = 0, accentColor }: { delay?: number; accentColor: string }) {
  return (
    <motion.div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: accentColor,
        position: 'absolute',
      }}
      animate={{
        scale: [1, 1.8, 1],
        opacity: [0.8, 0.3, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

function PulseNode({ region }: { region: Region }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: region.x,
        top: region.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
    >
      {/* Outer pulse */}
      <motion.div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1px solid ${region.color}`,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Node dot */}
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: region.color,
        boxShadow: `0 0 12px ${region.color}`,
        position: 'relative',
        zIndex: 3,
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '0.4rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: region.color,
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
        background: 'rgba(5,5,5,0.8)',
        padding: '0.1rem 0.35rem',
        borderRadius: '3px',
      }}>
        {region.name}
      </div>
    </div>
  )
}

function FlowLine({ from, to, regions, delay = 0 }: { from: string; to: string; regions: Region[]; delay?: number }) {
  const fromRegion = regions.find(r => r.name === from)
  const toRegion = regions.find(r => r.name === to)
  if (!fromRegion || !toRegion) return null

  const x1 = parseFloat(fromRegion.x)
  const y1 = parseFloat(fromRegion.y)
  const x2 = parseFloat(toRegion.x)
  const y2 = parseFloat(toRegion.y)

  return (
    <g>
      {/* Static line */}
      <line
        x1={`${x1}%`} y1={`${y1}%`}
        x2={`${x2}%`} y2={`${y2}%`}
        stroke="rgba(99,102,241,0.15)"
        strokeWidth="1"
      />
      {/* Animated pulse along line */}
      <motion.circle
        r="2"
        fill={fromRegion.color}
        opacity={0.8}
        animate={{
          cx: [`${x1}%`, `${x2}%`],
          cy: [`${y1}%`, `${y2}%`],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay,
          ease: 'linear',
        }}
      />
    </g>
  )
}

const STATS = [
  { value: '4+', label: 'Years in fintech' },
  { value: '12+', label: 'Provider integrations' },
  { value: '3', label: 'Active regions' },
  { value: '∞', label: 'Transactions processed' },
]

export function GlobalContext() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 85%',
      },
    })

    gsap.from('.global-stat', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.global-stat',
        start: 'top 85%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="section-mobile-pad" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        <div style={{ marginBottom: '4rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
          }}>
            GLOBAL CONTEXT
          </p>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}
          >
            Infrastructure built for
            <br />
            <span className="text-gradient">a borderless world.</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="global-stat glass"
              style={{
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.35rem',
              }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* World map */}
        <div
          className="glass world-map-wrap"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '16/7',
          }}
        >
          {/* Simplified SVG world map outline */}
          <svg
            viewBox="0 0 100 44"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          >
            {/* Simplified continent shapes as paths */}
            {/* North America */}
            <path d="M5,10 Q8,8 14,9 L18,12 Q20,16 18,20 L14,22 Q10,24 8,22 Q4,18 5,10Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {/* South America */}
            <path d="M16,25 Q20,23 22,26 L23,32 Q22,36 20,38 Q16,38 15,34 Q13,30 16,25Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {/* Europe */}
            <path d="M44,8 Q48,7 50,9 L51,13 Q49,15 47,14 Q44,13 44,8Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {/* Africa */}
            <path d="M45,16 Q50,14 53,16 L55,22 Q54,30 51,33 Q47,34 45,30 Q42,24 45,16Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {/* Asia */}
            <path d="M54,6 Q65,4 72,7 L76,12 Q74,18 68,19 Q60,20 55,16 Q52,12 54,6Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
            {/* Australia */}
            <path d="M72,26 Q78,24 82,27 L83,32 Q80,35 75,34 Q70,32 72,26Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />

            {/* Connection lines */}
            {CONNECTIONS.map((conn, i) => (
              <FlowLine key={i} from={conn.from} to={conn.to} regions={REGIONS} delay={i * 0.8} />
            ))}
          </svg>

          {/* Node pins */}
          {REGIONS.map(region => (
            <PulseNode key={region.name} region={region} />
          ))}

          {/* Caption */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            ACTIVE PAYMENT CORRIDORS
          </div>
        </div>

        {/* Region detail row */}
        <div className="regions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {REGIONS.map(region => (
            <div
              key={region.name}
              className="glass"
              style={{
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: region.color, boxShadow: `0 0 8px ${region.color}`, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                  {region.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  {region.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
