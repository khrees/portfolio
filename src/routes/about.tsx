import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Nav } from '../components/Nav'
import { About } from '../components/About'
import { SiteFooter } from '../components/SiteFooter'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'
import { SEO } from '../components/SEO'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <SEO
        title="About | Christian Ndu"
        description="Biography, background, and tech stack of Christian Ndu. Architecting distributed banking networks, on-chain payments, and backend systems."
        image="https://khrees.com/og-about.jpg"
        url="https://khrees.com/about"
      />
      <Nav />

      <main id="main-content" style={{ position: 'relative', zIndex: 2 }}>
        <About />
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
