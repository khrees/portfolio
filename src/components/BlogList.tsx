import { Link } from '@tanstack/react-router'
import type { PostMeta } from '#/lib/blog'
import { formatDate } from '#/lib/blog'

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        background: 'rgba(45, 212, 168, 0.1)',
        color: 'var(--electric-bright)',
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </span>
  )
}

function BlogCardContent({ post }: { post: PostMeta }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {post.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.05rem, 2vw, 1.4rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {post.title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-soft)',
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '600px',
        }}
      >
        {post.description}
      </p>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}
      >
        {formatDate(post.date)} · {post.readingTime}
      </span>
    </div>
  )
}

export function BlogCard({ post }: { post: PostMeta; index: number }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      style={{
        display: 'block',
        textDecoration: 'none',
        padding: '2rem 0',
        borderBottom: '1px solid var(--line)',
        cursor: 'pointer',
        color: 'inherit',
        transition: 'border-color 0.2s, background 0.2s',
        borderRadius: '4px',
        margin: '0 -0.5rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--line-bright)'
        e.currentTarget.style.background = 'var(--surface)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <BlogCardContent post={post} />
    </Link>
  )
}
