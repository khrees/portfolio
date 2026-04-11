import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Nav } from '../components/Nav'
import { Projects } from '../components/Projects'
import { SiteFooter } from '../components/SiteFooter'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'

export const Route = createFileRoute('/work')({ component: WorkPage })

function WorkPage() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <Nav />

      <main style={{ position: 'relative', zIndex: 2, paddingTop: '64px' }}>
        {/* Page hero */}
        <div className="work-page-hero" style={{
          padding: '6rem 0 4rem',
          borderBottom: '1px solid var(--line)',
        }}>
          <div className="container">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                marginBottom: '1.25rem',
              }}
            >
              WORK
            </motion.p>

            <motion.h1
              className="work-hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 7vw, 5.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1,
                marginBottom: '1.5rem',
              }}
            >
              Systems I've built
              <br />
              <span className="text-gradient">that move money.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: '1rem',
                color: 'var(--text-soft)',
                lineHeight: 1.7,
                maxWidth: '540px',
              }}
            >
              Experience at production scale, founding-level ownership, and side projects built because the problem bothered me.
            </motion.p>
          </div>
        </div>

        <Projects />
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
