const LINKS = [
  { label: 'GitHub', href: 'https://github.com/khrees2412' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ndu-christian' },
  { label: 'Email', href: 'mailto:christiannduh@gmail.com' },
]

export function SiteFooter({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      padding: '3rem 0',
      position: 'relative',
      zIndex: 2,
    }}>
      <div className="container footer-inner">
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
            Christian Ndu
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            Financial Infrastructure Engineer · Lagos, Nigeria
          </p>
        </div>

        <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={onOpenTerminal}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-bright)',
              borderRadius: '6px',
              padding: '0.4rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--green-signal)'
              e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'
              e.currentTarget.style.background = 'rgba(16,185,129,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--line-bright)'
              e.currentTarget.style.background = 'var(--surface)'
            }}
            title="Open terminal"
          >
            &gt;_ terminal
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          © 2026 Christian Ndu
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          ↑↑↓↓←→←→BA for debug overlay
        </p>
      </div>
    </footer>
  )
}
