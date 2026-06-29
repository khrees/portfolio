import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Thinking } from '../components/Thinking'
import { GlobalContext } from '../components/GlobalContext'
import { SiteFooter } from '../components/SiteFooter'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'

export const Route = createFileRoute('/')({ component: Portfolio })

function Portfolio() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <Nav />

      <main id="main-content" style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <Thinking />
        <GlobalContext />

        <section
          id="about"
          style={{
            padding: '6rem 0',
            position: 'relative',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div className="container">
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '1rem',
            }}>
              ABOUT
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
            }}>
              Engineer first,
              <br />
              <span className="text-gradient">everything else second.</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-soft)',
              lineHeight: 1.7,
              maxWidth: '520px',
              marginBottom: '1.75rem',
            }}>
              Infrastructure, developer tools, and systems that need to work under real conditions.
              Payments, protocols, automation, and everything in between.
              Full bio, skills, and background on the about page.
            </p>
            <Link
              to="/about"
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
              Read full bio
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter onOpenTerminal={() => setTerminalOpen(true)} />

      <AnimatePresence>
        {terminalOpen && (
          <Terminal onClose={() => setTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <EasterEggs onOpenTerminal={() => setTerminalOpen(true)} />
    </>
  )
}
