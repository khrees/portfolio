import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Nav } from '../components/Nav'
import { BlogCard } from '../components/BlogList'
import { SiteFooter } from '../components/SiteFooter'
import { Terminal } from '../components/Terminal'
import { EasterEggs } from '../components/EasterEggs'
import { posts } from '#/lib/blog'

export const Route = createFileRoute('/blog')({ component: BlogPage })

function BlogPage() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <>
      <Nav />

      <main id="main-content" style={{ position: 'relative', zIndex: 2, paddingTop: '64px' }}>
        {/* Page hero */}
        <div
          style={{
            padding: '6rem 0 2rem',
          }}
        >
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
              BLOG
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text)',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
                maxWidth: '700px',
              }}
            >
              Writing on
              <br />
              <span className="text-gradient">engineering & systems.</span>
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
              Thoughts on fintech infrastructure, system design, and developer experience.
            </motion.p>
          </div>
        </div>

        {/* Post list */}
        <div
          style={{
            borderTop: '1px solid var(--line)',
          }}
        >
          <div className="container" style={{ paddingTop: '1rem', paddingBottom: '6rem' }}>
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter onOpenTerminal={() => setTerminalOpen(true)} />

      <AnimatePresence>
        {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      <EasterEggs onOpenTerminal={() => setTerminalOpen(true)} />
    </>
  )
}
