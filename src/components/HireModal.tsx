import { Fragment, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

interface HireModalProps {
  open: boolean
  onClose: () => void
}

type Status = 'idle' | 'sending' | 'success' | 'error'

// Replace with your Formspree form ID from https://formspree.io
const FORMSPREE_ID = 'xdapqkag'

export function HireModal({ open, onClose }: HireModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const nameRef = useRef<HTMLInputElement>(null)

  // Focus first field on open
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 100)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const reset = () => {
    setName('')
    setEmail('')
    setMessage('')
    setStatus('idle')
  }

  const handleClose = () => {
    onClose()
    // Delay reset so the exit animation can finish
    setTimeout(reset, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    background: 'var(--surface)',
    border: '1px solid var(--line-bright)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-soft)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.08em',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
  }

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201,
              width: 'min(480px, calc(100vw - 1.5rem))',
              maxHeight: 'calc(100dvh - 2rem)',
              overflowY: 'auto',
              background: 'var(--bg)',
              border: '1px solid var(--line-bright)',
              borderRadius: '16px',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  Let's work together
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0.35rem 0 0' }}>
                  I'll get back to you within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <X size={18} />
              </button>
            </div>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="var(--green-signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)', fontWeight: 600, margin: '0 0 0.5rem' }}>
                  Message sent!
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 1.5rem' }}>
                  Thanks, {name.split(' ')[0]}. I'll be in touch soon.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="chip chip-electric"
                  style={{ cursor: 'pointer', border: 'none', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    ref={nameRef}
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--electric)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-bright)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--electric)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-bright)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about the role or project..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--electric)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-bright)')}
                  />
                </div>

                {status === 'error' && (
                  <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>
                    Something went wrong. Try emailing me directly at christiannduh@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    padding: '0.75rem',
                    background: status === 'sending' ? 'var(--surface)' : 'var(--electric)',
                    color: status === 'sending' ? 'var(--text-soft)' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s, transform 0.15s',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--electric-bright)' }}
                  onMouseLeave={e => { if (status !== 'sending') e.currentTarget.style.background = 'var(--electric)' }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}
