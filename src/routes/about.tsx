import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Nav } from '../components/Nav'
import { About } from '../components/About'
import { SiteFooter } from '../components/SiteFooter'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <Nav />

      <main style={{ position: 'relative', zIndex: 2 }}>
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
