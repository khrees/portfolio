import { useRef } from 'react'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion } from 'motion/react'

const SKILLS = [
  { group: 'Languages', items: ['Go', 'Rust', 'TypeScript', 'Python', 'SQL', 'JavaScript'] },
  { group: 'Infrastructure', items: ['PostgreSQL', 'Redis', 'REST APIs', 'Docker', 'Cloudflare', 'AWS'] },
  { group: 'Domains', items: ['Payments', 'Developer Tools', 'Fintech', 'DevEx', 'Privacy', 'Automation'] },
  { group: 'Tools', items: ['React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Git', 'CI/CD', 'Open Source'] },
]

export function About() {
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

    gsap.from('.about-col', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-col',
        start: 'top 88%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="section-mobile-pad"
      style={{ padding: '8rem 0', position: 'relative' }}
      aria-label="About Christian Ndu"
    >
      <div className="container">
        <div style={{ marginBottom: '4rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
          }}>
            ABOUT
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
            }}
          >
            Engineer first,
            <br />
            <span className="text-gradient">everything else second.</span>
          </h2>
        </div>

        <div className="about-two-col">
          {/* Left: bio */}
          <div className="about-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.figure
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ margin: 0, marginBottom: '0.25rem' }}
            >
              <div
                style={{
                  padding: '2px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(45,212,168,0.45), rgba(20,184,166,0.3), rgba(6,182,212,0.2))',
                  width: 'fit-content',
                  maxWidth: '100%',
                }}
              >
                <img
                  src="/christian-portrait.png"
                  alt="Christian Ndu, software engineer — professional portrait in a navy suit against a dark background."
                  width={560}
                  height={700}
                  style={{
                    display: 'block',
                    width: 'min(280px, 100%)',
                    height: 'auto',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    verticalAlign: 'middle',
                  }}
                />
              </div>
            </motion.figure>
            {[
              `I'm Christian Ndu, a software engineer based in Lagos, Nigeria. I work on infrastructure, developer tools, and systems that need to be reliable under real conditions.`,
              `The work ranges from payment APIs at Maplerad, to on-chain protocols at Debyth, to developer experience at Mono and Port.io. I've also built privacy tools, browser extensions, AI dev tools, and CLI utilities. Whatever the problem is, I like figuring it out.`,
              `I care about systems that are correct, not just working. A bug in financial software means someone's money. A bug in a dev tool means broken trust. That shapes how I approach design decisions.`,
              `Outside of work, I build things because the problem bothers me. Mostly open source, mostly local-first. I also think good engineering includes good communication — clear docs, readable code, sharing what you've learned.`,
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.75 }}>
                {para}
              </p>
            ))}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="mailto:christiannduh@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.4rem',
                  background: 'var(--electric)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--electric-bright)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--electric)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Get in touch
              </a>
              <a
                href="https://linkedin.com/in/ndu-christian"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem 1.25rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--line-bright)',
                  color: 'var(--text-soft)',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.borderColor = 'var(--line-bright)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Right: skills */}
          <div className="about-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {SKILLS.map((group, gi) => (
              <motion.div
                key={group.group}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  marginBottom: '0.75rem',
                }}>
                  {group.group.toUpperCase()}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {group.items.map(skill => (
                    <span
                      key={skill}
                      className="chip"
                      style={{ cursor: 'default', transition: 'all 0.2s' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                        e.currentTarget.style.color = 'var(--electric-bright)'
                        e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--line-bright)'
                        e.currentTarget.style.color = 'var(--text-soft)'
                        e.currentTarget.style.background = 'var(--surface)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Education */}
            <div
              className="glass"
              style={{ borderRadius: '12px', padding: '1.25rem' }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
                EDUCATION
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                B.Tech, Computer Science
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                Ladoke Akintola University of Technology · 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
