import { useRef, useState } from 'react'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion, AnimatePresence } from 'motion/react'

type Project = {
  id: string
  name: string
  role: string
  period: string
  problem: string
  solution: string
  stack: string[]
  highlights: string[]
  metrics: { label: string; value: string }[]
  accentColor: string
  links?: { label: string; href: string }[]
}

// ─── Experience ───────────────────────────────────────────────
const EXPERIENCE: Project[] = [
  {
    id: 'mono',
    name: 'Mono',
    role: 'Developer Experience Engineer',
    period: 'Dec 2024 – Present',
    problem: 'Fintech developer platforms accumulate invisible failure debt — bugs that only surface at integration boundaries, documentation gaps that look like bugs, and architectural issues that require cross-team context to even name. Partners churn before support tickets get resolved.',
    solution: 'Embedded at the intersection of engineering and product. Debug critical issues across application, network, and data layers — then convert those root causes into documentation and architectural recommendations that prevent recurrence at scale.',
    stack: ['API Debugging', 'TypeScript', 'Infrastructure', 'Technical Writing', 'Open Banking'],
    highlights: [
      'Debugged multi-layer system failures across network, application, and data tiers — identifying root causes that informed architectural improvements',
      'Translated complex product requirements into actionable engineering tasks, bridging business needs with technical implementation for ecosystem partners',
      'Authored technical documentation and knowledge base articles on infrastructure solutions, measurably reducing resolution time for recurring platform issues',
      'Identified documentation gaps that were misclassified as bugs — fixing the docs eliminated entire ticket categories',
    ],
    metrics: [
      { label: 'Role', value: 'DevEx Eng' },
      { label: 'Impact', value: 'Platform-wide' },
      { label: 'Domain', value: 'Open Banking' },
    ],
    accentColor: '#f59e0b',
  },
  {
    id: 'maplerad',
    name: 'Maplerad',
    role: 'Software Engineer',
    period: 'May 2022 – Oct 2024',
    problem: 'Cross-border payment infrastructure for Africa means integrating dozens of incompatible financial systems — mobile money operators, bank rails, card networks — each with different reliability guarantees, inconsistent status codes, and failure modes that cascade silently.',
    solution: 'Built and owned the core payment API layer handling payments, billing, and cross-border transfers. Designed a fault-tolerant integration architecture across 12+ third-party financial providers with circuit breakers, idempotency guarantees, and dead-letter queues for unresolved events.',
    stack: ['Go', 'PostgreSQL', 'Redis', 'Vue.js', 'REST APIs', 'Mobile Money', 'Payment Gateways'],
    highlights: [
      'Engineered high-scale RESTful APIs for payments, billing, and transfers handling significant daily transaction volumes with optimized performance',
      'Architected fault-tolerant integrations with 12+ third-party financial infrastructure providers including payment gateways and mobile money operators across Africa',
      'Optimized core business logic using Go ORM and Redis caching strategies — targeting sub-50ms p99 latency for balance reads and transfer initiation',
      'Implemented idempotency keys, saga patterns, and pessimistic locking on balance updates to ensure ledger consistency under concurrent load',
      'Built reusable Vue component library that accelerated frontend development cycles and standardized user experience across the product',
    ],
    metrics: [
      { label: 'Integrations', value: '12+' },
      { label: 'Stack', value: 'Go · Redis' },
      { label: 'Domain', value: 'Cross-border' },
    ],
    accentColor: '#10b981',
  },
  {
    id: 'port',
    name: 'Port',
    role: 'Software Engineer',
    period: '2023 – 2024',
    problem: 'Internal developer portals suffer from sprawl — too many tools, no single source of truth for service ownership, and manual processes that block self-service. Engineering teams slow down as orgs scale.',
    solution: 'Contributed to backend infrastructure for an internal developer portal platform, working on service catalog APIs, scaffolding automation, and integrations with external tooling to enable self-service engineering workflows.',
    stack: ['TypeScript', 'Node.js', 'REST APIs', 'Developer Portals', 'Backstage'],
    highlights: [
      'Built and maintained service catalog APIs enabling self-service workflows for engineering teams',
      'Developed scaffolding automation that reduced new service setup time significantly',
      'Integrated with external developer tooling to surface context directly in the portal layer',
    ],
    metrics: [
      { label: 'Domain', value: 'DevEx' },
      { label: 'Stack', value: 'TypeScript' },
      { label: 'Focus', value: 'Internal Tools' },
    ],
    accentColor: '#6366f1',
  },
]

// ─── Founding / Ownership ─────────────────────────────────────
const FOUNDING: Project[] = [
  {
    id: 'debyth',
    name: 'Debyth',
    role: 'Software Engineer — Protocol Lead',
    period: 'Mar 2025 – Present',
    problem: 'Recurring payments don\'t exist natively on-chain. Every Solana protocol requires a fresh user signature per transaction — making subscriptions, mandates, and automated billing technically impossible without reintroducing centralized intermediaries that defeat the purpose.',
    solution: 'Architected a mandate-based pull payment protocol on Solana in Rust using the Anchor framework. Users authorize a financial mandate once with defined constraints (amount, frequency, recipient, expiry). The protocol executes recurring pulls autonomously within those constraints — no further signatures required, no trusted third party.',
    stack: ['Rust', 'Anchor', 'Solana', 'TypeScript', 'SPL Token', 'PDAs'],
    highlights: [
      'Designed on-chain account structures (PDAs) for financial mandate lifecycle — creation, execution, amendment, and revocation',
      'Engineered a constrained authorization model: recipients can only pull within user-defined limits, with cryptographic enforcement at the program level',
      'Built gas abstraction layer separating execution cost from the payer — enabling seamless UX without user-side transaction signing per cycle',
      'Wrote comprehensive TypeScript test suites validating end-to-end payment flows, edge cases, and adversarial scenarios across complex payment cycles',
    ],
    metrics: [
      { label: 'Protocol', value: 'Solana' },
      { label: 'Language', value: 'Rust · Anchor' },
      { label: 'Type', value: 'DeFi Protocol' },
    ],
    accentColor: '#8b5cf6',
    links: [{ label: 'GitHub', href: 'https://github.com/debyth-inc/debyth-svm' }],
  },
  {
    id: 'everest',
    name: 'Everest',
    role: 'Software Engineer — Full Ownership',
    period: 'Sep 2021 – May 2023',
    problem: 'Early-stage fintech platforms face a critical tension: move fast enough to survive, while building financial systems accurate enough that a single bug doesn\'t destroy user trust. Transaction tracking failures and reconciliation gaps can be catastrophic at any scale.',
    solution: 'Owned the complete architecture and development of a financial management platform from blank slate to production. Designed PostgreSQL schemas with financial integrity as a hard constraint — every schema decision evaluated against consistency, auditability, and performance. Integrated multiple payment APIs with careful reconciliation logic at every boundary.',
    stack: ['Go', 'PostgreSQL', 'REST APIs', 'Payment APIs', 'Financial Reconciliation'],
    highlights: [
      'End-to-end ownership from architecture through production deployment — no handoffs, full accountability',
      'Designed PostgreSQL schemas optimized for financial data integrity: immutable transaction logs, double-entry ledger patterns, and audit trail preservation',
      'Integrated multiple third-party payment APIs, solving complex transaction tracking and reconciliation challenges unique to early-stage fintech',
      'Built reconciliation engine that caught and recovered from provider inconsistencies without data loss',
    ],
    metrics: [
      { label: 'Ownership', value: 'End-to-end' },
      { label: 'Database', value: 'PostgreSQL' },
      { label: 'Stage', value: 'Greenfield' },
    ],
    accentColor: '#3b82f6',
  },
]

// ─── Side Projects ────────────────────────────────────────────
const SIDE_PROJECTS: Project[] = [
  {
    id: 'autoply',
    name: 'Autoply',
    role: 'Author',
    period: 'Apr 2026',
    problem: 'Job applications are repetitive, high-volume work — the same form fields, the same resume uploads, the same cover letter boilerplate — across dozens of platforms with incompatible interfaces. Good candidates lose opportunities to friction, not fit.',
    solution: 'Built a local-first job application automation tool. Scrapes job postings, generates AI-tailored resumes and cover letters per application, then uses Playwright browser automation to fill and submit across 10+ platforms. All data stored locally, all AI providers configurable.',
    stack: ['TypeScript', 'Bun', 'Playwright', 'Patchright', 'SQLite', 'Anthropic', 'OpenAI', 'Vite'],
    highlights: [
      'Multi-platform automation: Greenhouse, LinkedIn, Lever, Workday, Ashby, Jobvite, and 4+ more — all from a single interface',
      'AI-tailored documents per application: resume and cover letter generated from job description context, not generic templates',
      'Flexible submission modes — manual confirmation for review, or automatic submission when the agent is confident',
      'Browser extension (Chrome + Firefox) for in-page autofill assistance without full automation',
      'Local-first architecture: all history, documents, and credentials live in ~/.autoply — never in the cloud',
    ],
    metrics: [
      { label: 'Platforms', value: '10+' },
      { label: 'Runtime', value: 'Bun' },
      { label: 'AI', value: 'Multi-provider' },
    ],
    accentColor: '#f43f5e',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/autoply' }],
  },
  {
    id: 'grepbase',
    name: 'Grepbase',
    role: 'Author',
    period: '2025 – 2026',
    problem: 'Understanding how a codebase evolved over time — why a pattern exists, when a decision changed, what the code looked like before a refactor — requires context that git log doesn\'t surface. Archaeology is slow and painful.',
    solution: 'Built an AI-powered tool to time-travel through any GitHub repository\'s commit history. Navigate commits chronologically via timeline or arrow keys, browse code as it existed at any historical point, and get AI explanations of what changed and why.',
    stack: ['TypeScript', 'Next.js', 'Bun', 'SQLite', 'Drizzle ORM', 'Framer Motion', 'Vercel AI SDK'],
    highlights: [
      'Timeline navigation — move through commits chronologically, view diffs side-by-side, or browse the full file tree at any historical point',
      'AI explanations powered by Vercel AI SDK with support for OpenAI, Anthropic, Gemini, and Ollama',
      'Privacy-first: API keys encrypted server-side per session, never stored in the browser',
      'Built with Next.js App Router, SQLite/Drizzle for session persistence, Framer Motion for timeline animations',
    ],
    metrics: [
      { label: 'Type', value: 'Dev Tool' },
      { label: 'AI', value: 'Multi-provider' },
      { label: 'License', value: 'MIT OSS' },
    ],
    accentColor: '#06b6d4',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/grepbase' }],
  },
  {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    role: 'Author',
    period: 'Feb 2026',
    problem: 'Every company runs an API gateway — AWS API Gateway, Kong, custom Redis middleware. The rules for who can call what, how often, live in a database your company controls. That\'s a trust assumption most consumers can\'t verify.',
    solution: 'Moved the API gateway control plane on-chain. Gatekeeper is a Solana program implementing API key management, role-based access control via 64-bit permission bitmasks, and fixed-window rate limiting — with every access decision creating an immutable, auditable blockchain record.',
    stack: ['Rust', 'Anchor', 'Solana', 'TypeScript', 'Express.js', 'SPL'],
    highlights: [
      'On-chain API key issuance and revocation — cryptographic credentials with permission scopes encoded as 64-bit bitmasks',
      'Fixed-window rate limiting enforced at the program level — quota modifications are cryptographically recorded and publicly verifiable',
      'TypeScript/Node.js CLI for administrative commands and an Express.js HTTP adapter for middleware integration',
      'Auditability by default: every permission check, key revocation, and rate limit change creates an immutable timestamp on devnet',
    ],
    metrics: [
      { label: 'Protocol', value: 'Solana' },
      { label: 'Language', value: 'Rust · Anchor' },
      { label: 'Type', value: 'Infra Tool' },
    ],
    accentColor: '#8b5cf6',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/gatekeeper' }],
  },
  {
    id: 'chatdump',
    name: 'Chatdump',
    role: 'Author',
    period: 'Mar 2026',
    problem: 'AI chat share links are ephemeral and platform-locked. Valuable conversations — debugging sessions, research threads, architecture discussions — disappear or can\'t be reused across different AI systems.',
    solution: 'Built a converter that takes public AI chat share links and outputs clean, portable Markdown. Supports ChatGPT, Claude, Copilot, Gemini, and Grok. Includes CLI, multiple view modes, and cross-platform continuation so you can pick up a conversation in any AI.',
    stack: ['TypeScript', 'Bun', 'Vite', 'CLI'],
    highlights: [
      'Parses share links from 5 major AI platforms into clean, syntax-highlighted Markdown',
      'CLI with customizable output options for scripting and automation workflows',
      'Cross-platform continuation — share conversations to any AI with one click',
      'URL history for quick access to recently converted links',
    ],
    metrics: [
      { label: 'Platforms', value: '5' },
      { label: 'Runtime', value: 'Bun' },
      { label: 'Output', value: 'Markdown' },
    ],
    accentColor: '#10b981',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/chatdump' }],
  },
  {
    id: 'revoka',
    name: 'Revoka',
    role: 'Author',
    period: 'Dec 2025',
    problem: 'Token delegation on Solana is powerful but opaque — once you\'ve delegated token authority, there\'s no clean user-facing tool to audit and revoke those permissions. Most users don\'t know what they\'ve approved.',
    solution: 'Built a minimal dApp for managing and revoking token delegations on Solana. Clean interface surfacing all active delegations, with single-click revocation and a straightforward confirmation flow.',
    stack: ['TypeScript', 'Next.js', 'Solana Web3.js', 'Tailwind CSS', 'Shadcn UI', 'Bun'],
    highlights: [
      'Surfaces all active token delegations for a connected wallet in a single view',
      'One-click revocation with clear confirmation — no CLI, no manual transaction construction',
      'Built with Solana Web3.js for direct on-chain interaction, Shadcn UI for accessible components',
    ],
    metrics: [
      { label: 'Chain', value: 'Solana' },
      { label: 'Type', value: 'dApp' },
      { label: 'Stack', value: 'Next.js' },
    ],
    accentColor: '#a78bfa',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/revoka' }],
  },
]

// ─── Project Card ─────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="section-reveal"
      style={{
        borderBottom: '1px solid var(--line)',
        padding: '3rem 0',
      }}
    >
      <div className="two-col-grid">
        {/* Left: project meta */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{ width: 24, height: 1, background: 'var(--line-bright)' }} />
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            marginBottom: '0.5rem',
            lineHeight: 1,
          }}>
            {project.name}
          </h3>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {project.role} · {project.period}
          </p>

          {/* Metrics */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {project.metrics.map(m => (
              <div
                key={m.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: hovered ? 'var(--surface-hover)' : 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                  {m.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: project.accentColor, fontWeight: 600 }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Stack chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
            {project.stack.map(s => (
              <span key={s} className="chip" style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>{s}</span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.links?.map(l => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: project.accentColor,
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                ↗ {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: case study */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: project.accentColor,
              letterSpacing: '0.12em',
              marginBottom: '0.5rem',
            }}>
              THE PROBLEM
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.7 }}>
              {project.problem}
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: project.accentColor,
              letterSpacing: '0.12em',
              marginBottom: '0.5rem',
            }}>
              THE SOLUTION
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.7 }}>
              {project.solution}
            </p>
          </div>

          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: project.accentColor,
              letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}>
              HIGHLIGHTS
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {project.highlights.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                >
                  <span style={{ color: project.accentColor, marginTop: '0.15rem', flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)', lineHeight: 1.6 }}>{h}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section Block ─────────────────────────────────────────────

function ProjectSection({
  label,
  heading,
  sub,
  projects,
  accentColor = 'var(--electric-bright)',
}: {
  label: string
  heading: string
  sub: string
  projects: Project[]
  accentColor?: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 85%',
      },
    })

    const cards = sectionRef.current?.querySelectorAll('.section-reveal')
    cards?.forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
        delay: i * 0.05,
      })
    })
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} style={{ marginBottom: '8rem' }}>
      {/* Section header */}
      <div className="project-section-header">
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: accentColor,
            letterSpacing: '0.15em',
            marginBottom: '1rem',
          }}>
            {label}
          </p>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
            }}
          >
            {heading}
          </h2>
        </div>
        <p className="project-section-sub" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          maxWidth: '280px',
          lineHeight: 1.6,
          textAlign: 'right',
        }}>
          {sub}
        </p>
      </div>

      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────

export function Projects() {
  return (
    <section className="section-mobile-pad" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        <ProjectSection
          label="EXPERIENCE"
          heading="Production systems."
          sub="Companies where I was embedded in the engineering team — high stakes, real scale, real consequences."
          projects={EXPERIENCE}
          accentColor="var(--green-signal)"
        />

        <ProjectSection
          label="FOUNDING WORK"
          heading="From the ground up."
          sub="Projects I architected end-to-end — full ownership from design through deployment."
          projects={FOUNDING}
          accentColor="var(--violet)"
        />

        <ProjectSection
          label="SIDE PROJECTS"
          heading="Building in public."
          sub="Tools I build because the problem bothers me. Open source, shipped, and actively maintained."
          projects={SIDE_PROJECTS}
          accentColor="var(--electric-bright)"
        />
      </div>
    </section>
  )
}
