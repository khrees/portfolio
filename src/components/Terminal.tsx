import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'

type TerminalLine = {
  type: 'output' | 'command' | 'error' | 'system'
  text: string
}

const COMMANDS: Record<string, string[]> = {
  help: [
    '  projects   → list selected work',
    '  about      → who am I',
    '  contact    → reach me',
    '  skills     → tech stack',
    '  clear      → clear terminal',
    '  exit       → close terminal',
  ],
  projects: [
    '  [1] Debyth      → mandate-based recurring payments on Solana (Rust)',
    '  [2] Maplerad    → cross-border payment APIs, 12+ integrations (Go)',
    '  [3] Everest     → financial management platform, full ownership (Go)',
    '  [4] Mono        → developer experience & API infrastructure',
    '  [5] Grepbase    → time-travel codebase search (TypeScript)',
    '',
    '  scroll to #work for case studies',
  ],
  about: [
    '  Christian Ndu — Software Engineer',
    '  Lagos, Nigeria',
    '',
    '  Building financial infrastructure at the intersection of',
    '  traditional payments and on-chain systems.',
    '',
    '  4+ years · Fintech · Blockchain · Open Source',
  ],
  contact: [
    '  email   → christiannduh@gmail.com',
    '  github  → github.com/khrees2412',
    '  linkedin → linkedin.com/in/ndu-christian',
  ],
  skills: [
    '  Languages    → Go, Rust, TypeScript, Python',
    '  Databases    → PostgreSQL, Redis, MongoDB',
    '  Blockchain   → Solana, Anchor, SPL Token',
    '  APIs         → REST, payment gateways, mobile money',
    '  Frontend     → React, Vue.js, TailwindCSS',
  ],
}

const BOOT_LINES: TerminalLine[] = [
  { type: 'system', text: 'christian.ndu/portfolio v1.0.0' },
  { type: 'system', text: 'Type "help" for available commands.' },
]

export function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines: TerminalLine[] = [
      { type: 'command', text: `$ ${cmd}` },
    ]

    if (trimmed === 'clear') {
      setLines(BOOT_LINES)
      return
    }
    if (trimmed === 'exit' || trimmed === 'quit') {
      onClose()
      return
    }
    if (!trimmed) {
      setLines(prev => [...prev, { type: 'command', text: '$ ' }])
      return
    }

    const output = COMMANDS[trimmed]
    if (output) {
      newLines.push(...output.map(t => ({ type: 'output' as const, text: t })))
    } else {
      newLines.push({ type: 'error', text: `  command not found: ${trimmed}. Type "help".` })
    }

    setLines(prev => [...prev, ...newLines])
    setHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
  }, [onClose])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = historyIndex + 1
      if (next < history.length) {
        setHistoryIndex(next)
        setInput(history[next] ?? '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIndex - 1
      if (next < 0) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(history[next] ?? '')
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="terminal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div
        className="terminal-window"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="terminal-titlebar">
          <button
            className="terminal-dot"
            style={{ background: '#ff5f57', cursor: 'pointer', border: 'none' }}
            onClick={onClose}
            title="Close"
          />
          <div className="terminal-dot" style={{ background: '#febc2e' }} />
          <div className="terminal-dot" style={{ background: '#28c840' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem', letterSpacing: '0.05em' }}>
            christian.ndu — terminal
          </span>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="terminal-body">
          {lines.map((line, i) => (
            <div
              key={i}
              className="terminal-line"
              style={{
                color: line.type === 'command'
                  ? 'var(--electric-bright)'
                  : line.type === 'error'
                  ? '#f87171'
                  : line.type === 'system'
                  ? 'var(--text-muted)'
                  : 'var(--green-signal)',
              }}
            >
              {line.text || '\u00A0'}
            </div>
          ))}

          <div className="terminal-input-row">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal input"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
