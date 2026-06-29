import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { SmoothScroll } from '../components/SmoothScroll'
import { CustomCursor } from '../components/CustomCursor'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <SmoothScroll>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CustomCursor />
      <Outlet />
    </SmoothScroll>
  )
}

function NotFound() {
  return (
    <main style={{ position: 'relative', zIndex: 2, paddingTop: '64px' }}>
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
          Page not found
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-soft)',
            maxWidth: '400px',
            margin: '0 auto 2rem',
          }}
        >
          This page doesn't exist yet.
        </p>
        <Link
          to="/"
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
          ← Go home
        </Link>
      </div>
    </main>
  )
}
