import { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Pen, X, Undo2, Trash2 } from 'lucide-react'

interface Signature {
  id: string
  name: string
  message?: string
  imageData: string
  date: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

// ─── Pen cursor SVG ───────────────────────────────────────

const PEN_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M19.5 3.5a3.33 3.33 0 1 1 4.7 4.7L8 24.5 2 26l1.5-6Z" fill="white" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/></svg>',
)}") 4 22, crosshair`

// ─── Canvas signature pad ─────────────────────────────────

interface SignaturePadHandle {
  clear: () => void
  undo: () => void
  toDataURL: () => string
  isEmpty: () => boolean
  canUndo: () => boolean
}

const SignaturePad = forwardRef<SignaturePadHandle, { onStrokeEnd?: () => void }>(({ onStrokeEnd }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const hasContent = useRef(false)
  const historyRef = useRef<ImageData[]>([])
  const onStrokeEndRef = useRef(onStrokeEnd)
  onStrokeEndRef.current = onStrokeEnd // always fresh, no re-render churn

  const INK = '#ffffff'
  const GUIDE = 'rgba(255,255,255,0.12)'

  const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0]
      if (!touch) return null
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.offsetX, y: e.offsetY }
  }

  const drawGuide = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.moveTo(20, canvas.height - 24)
    ctx.lineTo(canvas.width - 20, canvas.height - 24)
    ctx.strokeStyle = GUIDE
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

  const saveSnapshot = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
  }

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = getPos(e)
    if (!pos) return
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    drawing.current = true
  }, [])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = getPos(e)
    if (!pos) return
    const ctx = canvas.getContext('2d')!
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    hasContent.current = true
  }, [])

  const stopDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (drawing.current) {
      drawing.current = false
      saveSnapshot()
      onStrokeEndRef.current?.()
    }
  }, [])

  // One-time setup: size canvas to match CSS display + attach events
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Match internal resolution to CSS display (no coordinate scaling needed)
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width)
    canvas.height = Math.round(rect.height)

    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = INK
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    drawGuide(ctx)
    saveSnapshot()

    const onMouseDown = (e: MouseEvent) => startDrawing(e)
    const onMouseMove = (e: MouseEvent) => draw(e)
    const onMouseUp = (e: MouseEvent) => stopDrawing(e)
    const onMouseLeave = (e: MouseEvent) => stopDrawing(e)
    const onTouchStart = (e: TouchEvent) => startDrawing(e)
    const onTouchMove = (e: TouchEvent) => draw(e)
    const onTouchEnd = (e: TouchEvent) => stopDrawing(e)

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      historyRef.current = []
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGuide(ctx)
      saveSnapshot()
      hasContent.current = false
    },
    undo: () => {
      const canvas = canvasRef.current
      if (!canvas) return
      if (historyRef.current.length <= 1) return
      historyRef.current.pop()
      const prev = historyRef.current[historyRef.current.length - 1]
      const ctx = canvas.getContext('2d')!
      ctx.putImageData(prev, 0, 0)
      hasContent.current = historyRef.current.length > 1
    },
    toDataURL: () => canvasRef.current?.toDataURL('image/png') || '',
    isEmpty: () => !hasContent.current,
    canUndo: () => historyRef.current.length > 1,
  }))

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        minHeight: 140,
        background: 'var(--surface)',
        border: '1px solid var(--line-bright)',
        borderRadius: '10px',
        cursor: PEN_CURSOR,
        touchAction: 'none',
      }}
    />
  )
})
SignaturePad.displayName = 'SignaturePad'

// ─── Signature card on the board ──────────────────────────

function SignatureCard({ sig }: { sig: Signature; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '0 0 auto',
        width: 140,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: '8px',
        padding: '0.65rem 0.65rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      {/* Signature image */}
      <div
        style={{
          width: '100%',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {sig.imageData ? (
          <img
            src={sig.imageData}
            alt={`${sig.name}'s signature`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              imageRendering: 'auto',
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              opacity: 0.5,
            }}
          >
            ~ {sig.name}
          </span>
        )}
      </div>

      <p
        style={{
          margin: 0,
          fontWeight: 600,
          fontSize: '0.7rem',
          color: 'var(--text)',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {sig.name}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '0.55rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {timeAgo(sig.date)}
      </p>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────

export function VisitorsBook() {
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [canUndo, setCanUndo] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const padRef = useRef<SignaturePadHandle>(null)

  // Fetch signatures with polling for real-time
  const fetchSignatures = useCallback(async () => {
    try {
      const res = await fetch('/api/signatures')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setSignatures(data)
      }
    } catch { /* silent */ }
  }, [])

  // Initial load
  useEffect(() => {
    fetchSignatures().finally(() => setLoading(false))
  }, [fetchSignatures])

  // Poll every 3s for new signatures
  useEffect(() => {
    const interval = setInterval(fetchSignatures, 3000)
    return () => clearInterval(interval)
  }, [fetchSignatures])

  // Auto-scroll board to start when new sigs arrive
  useEffect(() => {
    if (boardRef.current && signatures.length > 0) {
      boardRef.current.scrollLeft = 0
    }
  }, [signatures.length])

  // Focus name field on open
  useEffect(() => {
    if (modalOpen) setTimeout(() => nameRef.current?.focus(), 150)
  }, [modalOpen])

  // Close on Escape + focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!modalOpen) return
      if (e.key === 'Escape') { setModalOpen(false); return }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    },
    [modalOpen],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  const reset = () => {
    setName('')
    setError('')
    setSubmitting(false)
    setCanUndo(false)
  }

  const handleUndo = () => {
    padRef.current?.undo()
    setCanUndo(padRef.current?.canUndo() ?? false)
  }

  const handleClear = () => {
    padRef.current?.clear()
    setCanUndo(false)
  }

  const handleSign = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const imageData = padRef.current?.isEmpty()
      ? ''
      : padRef.current?.toDataURL() || ''

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), imageData }),
      })
      const data = await res.json()
      if (res.ok && data.entry) {
        fetchSignatures()
        setModalOpen(false)
        setTimeout(reset, 300)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to submit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── Hero ── */}
      <div style={{ padding: '6rem 0 2rem' }}>
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
            VISITORS' BOOK
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
              marginBottom: '1rem',
              maxWidth: '700px',
            }}
          >
            Leave your
            <br />
            <span className="text-gradient">mark.</span>
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
              marginBottom: '0.5rem',
            }}
          >
            Draw your signature and join the wall.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}
          >
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                background: 'var(--electric)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--electric-bright)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--electric)' }}
            >
              <Pen size={16} />
              Sign the book
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {loading ? '…' : `${signatures.length} ${signatures.length === 1 ? 'signature' : 'signatures'}`}
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Signature board ── */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container" style={{ padding: '1.5rem 0 0.5rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: '0.75rem',
          }}>
            SIGNATURE WALL
          </p>
        </div>

        {loading ? (
          <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: 28, height: 28,
                border: '2px solid var(--line-bright)',
                borderTopColor: 'var(--electric)',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 0.7s linear infinite',
              }} />
            </div>
          </div>
        ) : signatures.length === 0 ? (
          <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Pen size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-soft)' }}>
                No signatures yet
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Be the first to leave your mark.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Fade edge hint for horizontal scroll */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: 40,
                zIndex: 2,
                pointerEvents: 'none',
                background: 'linear-gradient(to right, transparent, rgba(5,5,5,0.7))',
              }}
            />

            <div
              ref={boardRef}
              style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: '4rem',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div
                className="container"
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  paddingBottom: '1rem',
                  paddingTop: '0.5rem',
                  width: 'max-content',
                  minWidth: '100%',
                }}
              >
              {signatures.map((sig) => (
                <SignatureCard key={sig.id} sig={sig} index={signatures.indexOf(sig)} />
              ))}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ── Sign Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              key="vb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModalOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              key="vb-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="sign-modal-title"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 201,
                width: 'min(480px, calc(100vw - 1.5rem))',
                maxHeight: 'calc(100dvh - 2rem)',
                overflowY: 'auto',
                background: 'var(--bg-2)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--line-bright)',
                borderRadius: '16px',
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                userSelect: 'none',
              }}
            >
              {/* Close */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setTimeout(reset, 300) }}
                  aria-label="Close"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Pen icon */}
              <div style={{
                width: 44, height: 44,
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Pen size={20} style={{ color: 'var(--electric-bright)' }} />
              </div>

              <h2 id="sign-modal-title" style={{
                fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700,
                color: 'var(--text)', textAlign: 'center', margin: '0 0 0.3rem',
              }}>
                Sign the Visitors' Book
              </h2>
              <p style={{
                textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-soft)',
                margin: '0 0 1.5rem',
              }}>
                Draw your signature below.
              </p>

              <form onSubmit={handleSign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Name */}
                <div>
                  <label htmlFor="vb-name" style={{
                    display: 'block', fontSize: '0.75rem', color: 'var(--text-soft)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                    marginBottom: '0.4rem', textTransform: 'uppercase',
                  }}>
                    Name
                  </label>
                  <input
                    id="vb-name"
                    ref={nameRef}
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.65rem 0.9rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--line-bright)',
                      borderRadius: '8px', color: 'var(--text)',
                      fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
                      outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--electric)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--line-bright)')}
                  />
                </div>

                {/* Signature pad */}
                <div>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', color: 'var(--text-soft)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                    marginBottom: '0.4rem', textTransform: 'uppercase',
                  }}>
                    Signature
                  </label>
                  <SignaturePad
                    ref={padRef}
                    onStrokeEnd={() => setCanUndo(padRef.current?.canUndo() ?? false)}
                  />
                </div>

                {/* Undo / Clear */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => { handleUndo(); setCanUndo(padRef.current?.canUndo() ?? false) }}
                    disabled={!canUndo}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      background: 'none', border: '1px solid var(--line-bright)',
                      borderRadius: '6px', padding: '0.35rem 0.75rem',
                      color: canUndo ? 'var(--text-soft)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: canUndo ? 'pointer' : 'not-allowed',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { if (canUndo) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--line-bright)' } }}
                    onMouseLeave={e => { if (canUndo) { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.borderColor = 'var(--line-bright)' } }}
                  >
                    <Undo2 size={12} />
                    Undo
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      background: 'none', border: '1px solid var(--line-bright)',
                      borderRadius: '6px', padding: '0.35rem 0.75rem',
                      color: 'var(--text-muted)', fontSize: '0.75rem',
                      cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--line-bright)' }}
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                </div>

                {error && (
                  <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  style={{
                    padding: '0.75rem',
                    background: submitting || !name.trim() ? 'var(--surface)' : 'var(--electric)',
                    color: submitting || !name.trim() ? 'var(--text-soft)' : '#fff',
                    border: 'none', borderRadius: '8px',
                    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.9rem',
                    cursor: submitting || !name.trim() ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s, transform 0.15s',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={e => { if (!submitting && name.trim()) e.currentTarget.style.background = 'var(--electric-bright)' }}
                  onMouseLeave={e => { if (!submitting && name.trim()) e.currentTarget.style.background = 'var(--electric)' }}
                >
                  {submitting ? 'Signing…' : 'Finish Signing'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
