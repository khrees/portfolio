import { useRef } from 'react'
import { useGSAP, gsap } from '#/lib/gsap'
import { motion } from 'motion/react'

type Essay = {
  number: string
  title: string
  body: string
  tag: string
}

const ESSAYS: Essay[] = [
  {
    number: '01',
    title: 'Why recurring payments on-chain are fundamentally hard',
    tag: 'Blockchain · Payments',
    body: `Traditional payment mandates work because banks are trusted custodians — they hold your account and can debit it on your behalf. Blockchain flips this: you own your private keys, nothing moves without your signature.

This means "pull payments" require a new primitive entirely. You can't just trust the merchant; you need a cryptographic commitment that limits what they can pull, when, and how much. That's what a mandate protocol has to solve: authorization scoping, time constraints, revocability, and economic incentives for execution — all without a centralized party.

Most attempts either compromise self-custody or produce poor UX. The real solution requires deep protocol design, not just a smart contract wrapper.`,
  },
  {
    number: '02',
    title: 'Designing financial systems that don\'t fail',
    tag: 'Architecture · Reliability',
    body: `Financial systems have a different failure model than consumer apps. A 500 error on Twitter is annoying. A 500 error mid-transfer could mean lost funds, double charges, or inconsistent ledger state.

The patterns that matter: idempotency keys on every mutation, event sourcing for audit trails, saga patterns for distributed transactions, and pessimistic locking on balance updates. But more than any pattern — you need to model your failure modes explicitly before writing a line of code.

Ask: "What happens if this service crashes here?" for every network call. The answer tells you what you need to build.`,
  },
  {
    number: '03',
    title: 'The hidden cost of third-party integrations',
    tag: 'Systems · Scale',
    body: `Every external API you integrate is a risk surface. Payment gateways fail. Mobile money operators return inconsistent status codes. Webhooks arrive out of order, duplicated, or not at all.

After integrating 12+ financial providers at Maplerad, the pattern is clear: you need an abstraction layer that normalizes provider behavior, circuit breakers that detect degradation before it cascades, and dead letter queues for events that need human review.

The code that handles the happy path is 20% of the work. The code that handles provider failures is the other 80%.`,
  },
  {
    number: '04',
    title: 'Developer experience is a product decision',
    tag: 'DevEx · Product',
    body: `API documentation isn't a nice-to-have — it's the product. When developers can't figure out your API, they don't call support. They leave.

Good developer experience means: predictable error formats, idempotent endpoints, clear rate limiting headers, and examples that actually work. It means your SDK has TypeScript types. It means your status page shows real-time health.

At Mono, I learned that most "bugs" reported by partners were actually documentation gaps. Fixing the docs eliminated the ticket entirely. The best support is no support needed.`,
  },
]

function EssayItem({ essay, index }: { essay: Essay; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{
        borderBottom: '1px solid var(--line)',
        padding: '2.5rem 0',
        cursor: 'default',
      }}
    >
      <div className="essay-grid">
        <div className="essay-number" style={{ paddingTop: '0.25rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            {essay.number}
          </span>
        </div>

        <div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--electric-bright)',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '0.75rem',
          }}>
            {essay.tag}
          </span>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}>
            {essay.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {essay.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: 1.75, maxWidth: '640px' }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Thinking() {
  const sectionRef = useRef<HTMLElement>(null)
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
  }, { scope: sectionRef })

  return (
    <section id="thinking" ref={sectionRef} className="section-mobile-pad" style={{ padding: '8rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ marginBottom: '4rem' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
          }}>
            HOW I THINK
          </p>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '700px',
            }}
          >
            Engineering opinions
            <br />
            <span className="text-gradient">formed in production.</span>
          </h2>
        </div>

        {ESSAYS.map((essay, i) => (
          <EssayItem key={essay.number} essay={essay} index={i} />
        ))}
      </div>
    </section>
  )
}
