import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion } from 'motion/react'
import { posts } from '#/lib/blog'

function EssayItem({ slug, number, title, description, tag, index }: {
  slug: string
  number: string
  title: string
  description: string
  tag: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{
        borderBottom: '1px solid var(--line)',
        padding: '2.5rem 0',
        cursor: 'default',
      }}
    >
      <div className="essay-grid">
        <div className="essay-number" style={{ paddingTop: '0.25rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            {number}
          </span>
        </div>

        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--electric-bright)',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '0.75rem',
          }}>
            {tag}
          </span>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {title}
          </h3>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-soft)',
            lineHeight: 1.7,
            maxWidth: '600px',
            marginBottom: '1.25rem',
          }}>
            {description}
          </p>

          <Link
            to="/blog/$slug"
            params={{ slug }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--electric-bright)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            Read full essay →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

const essayMeta = [
  { number: '01', slug: posts[0].slug, title: posts[0].title, description: posts[0].description, tag: 'Blockchain · Payments' },
  { number: '02', slug: posts[1].slug, title: posts[1].title, description: posts[1].description, tag: 'Architecture · Reliability' },
  { number: '03', slug: posts[2].slug, title: posts[2].title, description: posts[2].description, tag: 'Systems · Scale' },
  { number: '04', slug: posts[3].slug, title: posts[3].title, description: posts[3].description, tag: 'DevEx · Product' },
]

export function Thinking() {
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
  }, { scope: sectionRef })

  return (
    <section id="thinking" ref={sectionRef} className="section-mobile-pad" style={{ padding: '8rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ marginBottom: '4rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
          }}>
            HOW I THINK
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
              maxWidth: '700px',
            }}
          >
            Engineering opinions
            <br />
            <span className="text-gradient">formed in production.</span>
          </h2>
        </div>

        {essayMeta.map((essay, i) => (
          <EssayItem key={essay.number} {...essay} index={i} />
        ))}

        <div style={{ marginTop: '2.5rem' }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.65rem 1.4rem',
              background: 'var(--electric)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--electric-bright)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--electric)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Read all essays →
          </Link>
        </div>
      </div>
    </section>
  )
}
