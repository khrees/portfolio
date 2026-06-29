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
    role: 'Technical Product Specialist',
    period: 'Dec 2024 – Present',
    problem: 'Developer platforms accumulate invisible failure debt. Bugs surface at integration boundaries, docs get misclassified as bugs, and architectural problems need cross-team context to even understand. Partners churn before tickets get resolved.',
    solution: 'Sit between engineering and product. Debug issues across application, network, and data layers, then turn those findings into documentation and architecture changes that prevent the same problems from coming back.',
    stack: ['API Debugging', 'TypeScript', 'Infrastructure', 'Technical Writing', 'Open Banking'],
    highlights: [
      'Debugged system failures across network, application, and data tiers to find root causes for architectural improvements',
      'Turned complex product requirements into engineering tasks that both business and technical teams could act on',
      'Wrote documentation and knowledge base articles that reduced resolution time for recurring issues',
      'Found documentation gaps that were being filed as bugs. Fixing the docs removed entire ticket categories',
    ],
    metrics: [
      { label: 'Role', value: 'Tech Product' },
      { label: 'Impact', value: 'Platform-wide' },
      { label: 'Domain', value: 'Developer Tools' },
    ],
    accentColor: '#f59e0b',
  },
  {
    id: 'maplerad',
    name: 'Maplerad',
    role: 'Lead Technical Product Specialist',
    period: 'May 2022 – Oct 2024',
    problem: 'Cross-border payments in Africa means wiring together dozens of incompatible systems. Mobile money operators, bank rails, card networks, all with different status codes, reliability, and failure modes.',
    solution: 'Started as a Backend Engineer, grew into Lead. Built payment APIs in Go, integrated 12+ providers, shipped SDKs in Node.js and Go, and ran developer experience for 100+ business partners.',
    stack: ['Go', 'PostgreSQL', 'Redis', 'Node.js', 'Vue.js', 'REST APIs', 'SDK Development'],
    highlights: [
      'Built RESTful APIs for payments, billing, and transfers handling daily transaction volumes at scale',
      'Integrated 12+ third-party providers across payment gateways and mobile money operators in Africa',
      'Built and maintained SDKs in Node.js and Go for 100+ business partners',
      'Led the website rebrand using Nuxt.js with a focus on performance and UI consistency',
      'Managed a team of two while working across customer needs and internal product/engineering',
    ],
    metrics: [
      { label: 'Integrations', value: '12+' },
      { label: 'Growth', value: 'Backend → Lead' },
      { label: 'Partners', value: '100+' },
    ],
    accentColor: '#10b981',
  },
  {
    id: 'port',
    name: 'Port.io',
    role: 'Technical Support Engineer',
    period: 'Jul 2024 – Dec 2024',
    problem: 'Internal developer portals tend to sprawl. Too many tools, no single source of truth for service ownership, and manual processes that slow teams down as they scale.',
    solution: 'Provided technical guidance for an Internal Developer Portal across 100+ enterprise companies. Built automation scripts, found onboarding friction, and helped bridge customers and internal engineering.',
    stack: ['TypeScript', 'Node.js', 'Python', 'REST APIs', 'Developer Portals', 'Backstage'],
    highlights: [
      'Gave technical guidance for an IdP tool across 100+ enterprise companies, contributing to >$2M in revenue impact',
      'Wrote JavaScript and Python scripts to automate common support workflows',
      'Spotted onboarding friction and built fixes that reduced the support load',
      'Picked up a lot of enterprise DevOps and infrastructure knowledge along the way',
    ],
    metrics: [
      { label: 'Impact', value: '>$2M rev' },
      { label: 'Scale', value: '100+ companies' },
      { label: 'Stack', value: 'TypeScript' },
    ],
    accentColor: '#3b82f6',
  },
  {
    id: 'bcs',
    name: 'BCS Africa',
    role: 'Frontend Engineer',
    period: 'Apr 2022 – May 2022',
    problem: 'Needed a fast, responsive marketing site that actually performs well and doesn\'t take weeks to ship.',
    solution: 'Built the marketing website with Tailwind CSS, Next.js, and Contentful. Set up SSR, image optimization, and a CI/CD pipeline on Netlify.',
    stack: ['Next.js', 'Tailwind CSS', 'Contentful CMS', 'Netlify', 'CI/CD'],
    highlights: [
      'Built a responsive marketing site with Tailwind CSS and Next.js',
      'Implemented SSR and static site generation for performance and SEO',
      'Set up deployment on Netlify with image optimization and lazy loading',
    ],
    metrics: [
      { label: 'Stack', value: 'Next.js' },
      { label: 'CMS', value: 'Contentful' },
      { label: 'Deploy', value: 'Netlify' },
    ],
    accentColor: '#06b6d4',
  },
]

// ─── Founding / Ownership ─────────────────────────────────────
const FOUNDING: Project[] = [
  {
    id: 'debyth',
    name: 'Debyth',
    role: 'Protocol Lead',
    period: 'Mar 2025 – Present',
    problem: 'Recurring payments don\'t exist natively on-chain. Every Solana protocol needs a fresh signature per transaction, which makes subscriptions and automated billing basically impossible without a middleman.',
    solution: 'Built a mandate-based pull payment protocol on Solana in Rust with Anchor. Users set up a mandate once with constraints, and the protocol executes recurring pulls on its own. No extra signatures, no third party.',
    stack: ['Rust', 'Anchor', 'Solana', 'TypeScript', 'SPL Token', 'PDAs'],
    highlights: [
      'Designed on-chain account structures for mandate lifecycle: create, execute, amend, revoke',
      'Built a constrained authorization model where recipients can only pull within user-defined limits',
      'Created a gas abstraction layer so execution costs are separated from the payer',
      'Wrote TypeScript test suites covering full payment flows and edge cases',
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
    role: 'Founder & Engineer',
    period: 'Sep 2021 – Present',
    problem: 'Personal finance is scattered across a bunch of apps. Banking, subscriptions, crypto, budgets, news. Nothing gives you one clear picture.',
    solution: 'Built a financial management platform from scratch. Go backend, PostgreSQL, React frontend. Handles subscription tracking, multi-provider balance aggregation, budgeting, and alerts.',
    stack: ['Go', 'PostgreSQL', 'React', 'Tailwind CSS', 'Redis', 'REST APIs'],
    highlights: [
      'Owned the full stack from architecture to production, no handoffs',
      'Designed PostgreSQL schemas for financial data integrity with immutable logs and audit trails',
      'Integrated multiple payment APIs and crypto providers for unified balance views',
      'Built subscription monitoring for services like Netflix and Spotify with alerting',
      'Added multi-channel notifications (SMS, email, push) for financial activity',
    ],
    metrics: [
      { label: 'Ownership', value: 'End-to-end' },
      { label: 'Stack', value: 'Go · React' },
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
    period: 'Jan 2026',
    problem: 'Job applications are the same form fields, resume uploads, and cover letter boilerplate repeated across dozens of platforms. Friction kills more good candidates than lack of fit.',
    solution: 'Local-first job automation tool. Scrapes postings, generates AI-tailored resumes and cover letters per application, then uses Playwright to fill and submit across 10+ platforms. Everything stays on your machine.',
    stack: ['TypeScript', 'Bun', 'Playwright', 'Patchright', 'SQLite', 'Anthropic', 'OpenAI', 'Vite'],
    highlights: [
      'Supports Greenhouse, LinkedIn, Lever, Workday, Ashby, Jobvite, and more from one interface',
      'Generates a tailored resume and cover letter per application from the job description',
      'Manual review mode or automatic submission depending on confidence',
      'Browser extension for Chrome and Firefox that does in-page autofill',
      'All data stored locally in ~/.autoply, nothing sent to the cloud',
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
    period: 'Dec 2025',
    problem: 'Git log tells you what changed, not why. Understanding codebase evolution usually means reading hundreds of commits by hand.',
    solution: 'AI-powered time-travel through any GitHub repo. Navigate commits chronologically, browse code at any historical point, and get AI explanations of what changed and why.',
    stack: ['TypeScript', 'Next.js', 'Bun', 'SQLite', 'Drizzle ORM', 'Framer Motion', 'Vercel AI SDK'],
    highlights: [
      'Navigate commits on a timeline, view diffs side-by-side, or browse the full file tree at any point in history',
      'AI explanations via Vercel AI SDK, supports OpenAI, Anthropic, Gemini, and Ollama',
      'API keys encrypted server-side per session, never stored in the browser',
      'Next.js App Router, SQLite/Drizzle for persistence, Framer Motion for animations',
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
    id: 'veilo',
    name: 'Veilo',
    role: 'Author',
    period: 'Jun 2026',
    problem: 'You give out your real email everywhere and then deal with spam and trackers forever. Existing alias services are clunky, provider-locked, and you can\'t reply without exposing yourself.',
    solution: 'Self-hosted email alias engine. Create disposable aliases that forward to your real inbox, reply from the alias without exposing your address, strip tracking pixels, and auto-disable after a set time or email count.',
    stack: ['Go', 'Fiber', 'PostgreSQL', 'Resend', 'Cloudflare', 'Docker'],
    highlights: [
      'Forward and reply from aliases without exposing your real email address',
      'Auto-DNS setup via Cloudflare for custom domains (MX, SPF, verification records)',
      'Strips tracking pixels from incoming email and shows a blocked count',
      'Aliases can self-destruct after a time limit or number of emails',
      'Full CLI and REST API for managing domains and aliases',
    ],
    metrics: [
      { label: 'Language', value: 'Go' },
      { label: 'Deploy', value: 'Docker' },
      { label: 'DNS', value: 'Cloudflare' },
    ],
    accentColor: '#2dd4a8',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/veilo' }],
  },
  {
    id: 'pontis',
    name: 'Pontis',
    role: 'Author',
    period: 'Jun 2026',
    problem: 'AI coding CLIs like Claude Code and OpenAI Codex expect specific API formats. If you want to use free-tier or local models, there\'s no easy way to make that work.',
    solution: 'Bidirectional translation proxy that bridges Anthropic, OpenAI, and legacy completion formats. Run any AI coding CLI with Ollama, LM Studio, or free-tier models. Single curl install.',
    stack: ['TypeScript', 'Node.js', 'Cloudflare Workers'],
    highlights: [
      'Translates between Anthropic, OpenAI chat, and legacy completions in real-time',
      'One-command install, works with Claude Code, Codex CLI, and other terminal tools',
      'Auto-discovers models from Ollama, LM Studio, or local servers',
      'Handles vision format translation between Anthropic and OpenAI image formats',
      'Can be deployed as a Cloudflare Worker',
    ],
    metrics: [
      { label: 'Type', value: 'Proxy' },
      { label: 'Runtime', value: 'Node.js' },
      { label: 'Deploy', value: 'CF Workers' },
    ],
    accentColor: '#a78bfa',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/pontis' }],
  },
  {
    id: 'tabclose',
    name: 'Tabclose',
    role: 'Author',
    period: 'Oct 2025',
    problem: 'Too many open tabs slow everything down. Most tab managers are either too aggressive or just count tabs without doing anything useful.',
    solution: 'Chromium extension that closes tabs after a configurable period of inactivity. Pinned tabs, active tabs, and audio-playing tabs are always safe. Supports domain whitelists.',
    stack: ['JavaScript', 'Chrome Extensions MV3', 'chrome.storage', 'chrome.alarms'],
    highlights: [
      'Inactivity timer with configurable threshold (default 6 hours), checked every minute',
      'Scheduled daily cleanup to close stale tabs in bulk',
      'Domain whitelist to protect sites that should never auto-close',
      'Pinned, active, and audio-playing tabs are always preserved',
      'All data stays in the browser. No servers, no tracking',
    ],
    metrics: [
      { label: 'Platform', value: 'Chrome' },
      { label: 'Manifest', value: 'MV3' },
      { label: 'Privacy', value: 'Local-only' },
    ],
    accentColor: '#f59e0b',
    links: [{ label: 'GitHub', href: 'https://github.com/khrees2412/tabclose' }],
  },
  {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    role: 'Author',
    period: 'Feb 2026',
    problem: 'API gateways store access rules in a database the company controls. There\'s no way for consumers to verify those rules independently.',
    solution: 'On-chain API gateway on Solana. API key management, RBAC with 64-bit permission bitmasks, and fixed-window rate limiting. Every access decision is recorded on-chain.',
    stack: ['Rust', 'Anchor', 'Solana', 'TypeScript', 'Express.js', 'SPL'],
    highlights: [
      'On-chain API key issuance and revocation with permission scopes as 64-bit bitmasks',
      'Rate limiting enforced at the program level with publicly verifiable records',
      'CLI for admin commands and an Express.js adapter for middleware integration',
      'Every permission check and key change creates an immutable record on devnet',
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
    problem: 'AI chat share links disappear or are locked to one platform. Useful conversations get lost when you want to reference them later or continue in a different tool.',
    solution: 'Converter that takes public AI chat share links and outputs clean Markdown. Works with ChatGPT, Claude, Copilot, Gemini, and Grok. Has a CLI and supports cross-platform continuation.',
    stack: ['TypeScript', 'Bun', 'Vite', 'CLI'],
    highlights: [
      'Parses share links from 5 AI platforms into clean, syntax-highlighted Markdown',
      'CLI with customizable output for scripting',
      'Cross-platform continuation to pick up a conversation in any AI',
      'URL history for recently converted links',
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
    problem: 'Token delegation on Solana is powerful but hard to track. Once you\'ve approved something, there\'s no easy way to see or revoke those permissions.',
    solution: 'Minimal dApp for viewing and revoking token delegations on Solana. Shows all active delegations in one view with single-click revocation.',
    stack: ['TypeScript', 'Next.js', 'Solana Web3.js', 'Tailwind CSS', 'Shadcn UI', 'Bun'],
    highlights: [
      'Shows all active token delegations for a connected wallet',
      'One-click revocation with a confirmation step',
      'Built with Solana Web3.js for direct on-chain interaction',
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
                  transition: 'background 0.2s',
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
          heading="Systems I've shipped."
          sub="Where I was part of the engineering team, working on real products at real scale."
          projects={EXPERIENCE}
          accentColor="var(--green-signal)"
        />

        <ProjectSection
          label="OPEN SOURCE & FOUNDING"
          heading="Built from scratch."
          sub="Projects I built from scratch, end to end."
          projects={FOUNDING}
          accentColor="var(--violet)"
        />

        <ProjectSection
          label="SIDE PROJECTS"
          heading="Tools I build because the problem bothers me."
          sub="Open source, shipped, and actively maintained."
          projects={SIDE_PROJECTS}
          accentColor="var(--electric-bright)"
        />
      </div>
    </section>
  )
}
