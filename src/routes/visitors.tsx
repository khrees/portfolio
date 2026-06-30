import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Nav } from '../components/Nav'
import { SiteFooter } from '../components/SiteFooter'
import { VisitorsBook } from '../components/VisitorsBook'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'

export const Route = createFileRoute('/visitors')({ component: VisitorsPage })

function VisitorsPage() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <Nav />

      <main id="main-content" style={{ position: 'relative', zIndex: 2, paddingTop: '64px' }}>
        <VisitorsBook />
      </main>

      <SiteFooter onOpenTerminal={() => setTerminalOpen(true)} />

      <AnimatePresence>
        {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      <EasterEggs onOpenTerminal={() => setTerminalOpen(true)} />
    </>
  )
}
