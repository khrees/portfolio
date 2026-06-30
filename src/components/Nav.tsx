import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { HireModal } from './HireModal'

const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontSize: '0.85rem',
  color: 'var(--text-soft)',
  letterSpacing: '0.02em',
  transition: 'color 0.2s',
  textDecoration: 'none',
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = useRouterState({ select: s => s.location.pathname })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className="nav-blur"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.3s',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textDecoration: 'none',
          }}
          onClick={e => {
            if (pathname === '/') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            setMobileOpen(false)
          }}
        >
          CN<span style={{ color: 'var(--electric-bright)' }}>.</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/work"
            style={navLinkStyle}
            activeProps={{ style: { ...navLinkStyle, color: 'var(--text)' } }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            Work
          </Link>

          <Link
            to="/blog"
            style={navLinkStyle}
            activeProps={{ style: { ...navLinkStyle, color: 'var(--text)' } }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            Blog
          </Link>

          <Link
            to="/about"
            style={navLinkStyle}
            activeProps={{ style: { ...navLinkStyle, color: 'var(--text)' } }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            About
          </Link>

          <Link
            to="/visitors"
            style={navLinkStyle}
            activeProps={{ style: { ...navLinkStyle, color: 'var(--text)' } }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-soft)')}
          >
            Visitors
          </Link>

          <button
            type="button"
            onClick={() => setHireOpen(true)}
            className="chip chip-electric"
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Hire me
          </button>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          type="button"
          className="nav-mobile-menu"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: '1px solid var(--line-bright)',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '0.45rem 0.6rem',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            display: 'block',
            width: 18,
            height: 1.5,
            background: 'var(--text)',
            borderRadius: 2,
            transition: 'transform 0.2s, opacity 0.2s',
            transform: mobileOpen ? 'translateY(5.5px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: 18,
            height: 1.5,
            background: 'var(--text)',
            borderRadius: 2,
            transition: 'opacity 0.2s',
            opacity: mobileOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block',
            width: 18,
            height: 1.5,
            background: 'var(--text)',
            borderRadius: 2,
            transition: 'transform 0.2s, opacity 0.2s',
            transform: mobileOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <Link to="/work" style={{ ...navLinkStyle, display: 'block', padding: '0.85rem 0', borderBottom: '1px solid var(--line)', fontSize: '1rem' }} onClick={() => setMobileOpen(false)}>
            Work
          </Link>

          <Link to="/blog" style={{ ...navLinkStyle, display: 'block', padding: '0.85rem 0', borderBottom: '1px solid var(--line)', fontSize: '1rem' }} onClick={() => setMobileOpen(false)}>
            Blog
          </Link>

          <Link to="/about" style={{ ...navLinkStyle, display: 'block', padding: '0.85rem 0', borderBottom: '1px solid var(--line)', fontSize: '1rem' }} onClick={() => setMobileOpen(false)}>
            About
          </Link>

          <Link to="/visitors" style={{ ...navLinkStyle, display: 'block', padding: '0.85rem 0', borderBottom: '1px solid var(--line)', fontSize: '1rem' }} onClick={() => setMobileOpen(false)}>
            Visitors
          </Link>

          <button
            type="button"
            onClick={() => { setMobileOpen(false); setHireOpen(true) }}
            style={{ ...navLinkStyle, display: 'block', width: '100%', textAlign: 'left', padding: '0.85rem 0', fontSize: '1rem', color: 'var(--electric-bright)' }}
          >
            Hire me ↗
          </button>
        </div>
      )}

      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  )
}
