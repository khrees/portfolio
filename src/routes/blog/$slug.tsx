import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Nav } from '../../components/Nav'
import { BlogPost } from '../../components/BlogPost'
import { SiteFooter } from '../../components/SiteFooter'
import { Terminal } from '../../components/Terminal'
import { EasterEggs } from '../../components/EasterEggs'
import { getPostBySlug, posts } from '#/lib/blog'
import type { PostMeta } from '#/lib/blog'

// Eagerly import all MDX files so we can look them up by slug
const mdxModules = import.meta.glob('/content/blog/*.mdx', { eager: true }) as Record<
  string,
  { default: React.ComponentType }
>

export const Route = createFileRoute('/blog/$slug')({
  component: PostPage,
  notFoundComponent: PostNotFound,
})

function PostPage() {
  const { slug } = Route.useParams()
  const [terminalOpen, setTerminalOpen] = useState(false)
  const post = getPostBySlug(slug)

  // Find and render the MDX component
  const filePath = Object.keys(mdxModules).find((p) => p.endsWith(`/${slug}.mdx`))
  const MDXContent = filePath ? mdxModules[filePath]?.default : null

  if (!post || !MDXContent) {
    return (
      <>
        <Nav />
        <PostNotFound />
        <SiteFooter onOpenTerminal={() => setTerminalOpen(true)} />
        <AnimatePresence>
          {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
        </AnimatePresence>
        <EasterEggs onOpenTerminal={() => setTerminalOpen(true)} />
      </>
    )
  }

  return (
    <>
      <Nav />

      <BlogPost post={post}>
        <MDXContent />
      </BlogPost>

      {/* Suggested posts */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ padding: '4rem 0 6rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
              marginBottom: '1.5rem',
            }}
          >
            MORE WRITING
          </motion.p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {posts
              .filter((p) => p.slug !== slug)
              .slice(0, 2)
              .map((otherPost, i) => (
                <SuggestedPostCard key={otherPost.slug} post={otherPost} index={i} />
              ))}
          </div>
        </div>
      </div>

      <SiteFooter onOpenTerminal={() => setTerminalOpen(true)} />

      <AnimatePresence>
        {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      </AnimatePresence>

      <EasterEggs onOpenTerminal={() => setTerminalOpen(true)} />
    </>
  )
}

function SuggestedPostCard({ post }: { post: PostMeta; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.random() * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={`/blog/${post.slug}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          cursor: 'pointer',
          color: 'inherit',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-bright)'
          e.currentTarget.style.background = 'var(--surface-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--line)'
          e.currentTarget.style.background = 'var(--surface)'
        }}
      >
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            lineHeight: 1.3,
            margin: '0 0 0.5rem',
          }}
        >
          {post.title}
        </h4>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-soft)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {post.description}
        </p>
      </a>
    </motion.div>
  )
}

function PostNotFound() {
  return (
    <main id="main-content" style={{ position: 'relative', zIndex: 2, paddingTop: '64px' }}>
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '1rem',
          }}
        >
          Post not found
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-soft)',
            maxWidth: '400px',
            margin: '0 auto 2rem',
          }}
        >
          This essay doesn't exist yet. Maybe it's still being written.
        </p>
        <a
          href="/blog"
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
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--electric-bright)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--electric)')}
        >
          ← Back to blog
        </a>
      </div>
    </main>
  )
}
