# Christian Ndu — Portfolio Specification

## 1. Vision

Build a visually striking, engineering-first portfolio that communicates:

- Deep expertise in financial systems and blockchain infrastructure
- Strong product and systems thinking
- Proven experience building real-world, high-scale systems
- Global relevance across US, EU, and Nigerian fintech ecosystems

This portfolio should feel like a fusion of:
- Stripe (engineering clarity)
- Vercel (design precision)
- On-chain futurism (systems + motion)

Primary goals:
- Immediate impact (≤10 seconds)
- Technical credibility (engineers stay and explore)
- Memorable design (award-level presentation)

---

## 2. Core Positioning

### Headline
**Engineer building financial infrastructure for a borderless world**

### Supporting Themes
- Payments, mandates, automation
- Reliability at scale
- On-chain + off-chain systems
- Developer experience

---

## 3. Tech Stack

- **Framework:** TanStack Start
- **Runtime:** Bun
- **Styling:** TailwindCSS
- **Animations:**
  - Framer Motion (layout + transitions)
  - GSAP (scroll + orchestration)
  - Three.js (via react-three-fiber)
  - Lottie (micro-interactions)
- **Content:** MDX

---

## 4. Design System

### 4.1 Visual Theme

**Theme:** Dark Infrastructure + Electric Signal

- Background: `#050505` / `#0A0A0A`
- Primary Accent: Electric Blue / Violet gradient
- Secondary Accent: Subtle green (financial signal)
- Surfaces: Glassmorphism + subtle noise texture

### Design Principles

- High contrast
- Cinematic depth
- Minimal but bold
- No unnecessary decoration

---

### 4.2 Typography (Critical)

#### Headline Font
- Clash Display / Satoshi Black / Neue Montreal Bold

#### Body Font
- Inter / Geist / Satoshi Regular

#### Rules
- Headlines: very large (80–140px), tight tracking
- Body: readable, spaced
- Typography drives layout hierarchy

---

### 4.3 Motion System

#### Tools
- Framer Motion → transitions
- GSAP → scroll storytelling
- Three.js → immersive visuals
- Lottie → micro details

#### Principles
- Motion must communicate meaning
- Fast and smooth (no gimmicks)
- No excessive bounce or flashy effects

---

## 5. Site Architecture

---

### 5.1 Hero Section

**Goal:** Immediate clarity + visual impact

#### Layout
- Left: Large headline
- Right: Interactive 3D system

#### Content
- Headline:
  **Building systems for money, automation, and scale.**
- Subtext:
  `Rust • Solana • Payments • Infrastructure`

#### Animations
- GSAP text reveal (staggered)
- Three.js animated transaction network
- Flowing nodes representing financial activity

#### Easter Egg
- Clicking nodes → opens mock transaction logs overlay

---

### 5.2 Selected Work (Core Section)

Focus on **3–5 high-quality projects only**

Each project = **case study, not a card**

---

#### Project 1: Debyth (Flagship)

##### Sections
- Problem: recurring payments don’t exist natively on-chain
- Solution: mandate-based pull system
- Architecture:
  - On-chain (Rust, Anchor)
  - Off-chain (TypeScript services)
- Challenges:
  - authorization model
  - gas abstraction
  - reliability

##### Animation
- Scroll builds system architecture visually
- Nodes connect dynamically

---

#### Project 2: Maplerad

Focus:
- Payment APIs
- Third-party integrations
- Reliability at scale

Visual:
- Global transaction flow (US ↔ NG ↔ EU)

---

#### Project 3: Everest

Focus:
- Full system ownership
- Backend architecture (Go + PostgreSQL)
- Early-stage complexity

---

#### Project 4: Mono

Focus:
- Debugging complex systems
- Developer experience
- Documentation impact

---

### 5.3 “How I Think” Section

Purpose: demonstrate senior-level thinking

#### Format
- 3–5 short essays

#### Example Topics
- Why recurring payments on-chain are difficult
- Designing financial systems that don’t fail
- Frontend engineers underestimate backend complexity

#### UI
- Minimal, editorial
- Strong typography
- Subtle hover interactions

---

### 5.4 Global Context Section

Purpose: show cross-region relevance

#### Visual
- Animated world map

#### Flows
- Lagos → London → New York

#### Message
- Experience building systems used across multiple regions
- Understanding of global fintech infrastructure

---

### 5.5 About Section

Short and direct:
- Focus on systems, payments, and infrastructure
- Experience across startups and fintech
- Bridge between engineering and product

---

### 5.6 Footer

- GitHub
- LinkedIn
- Email

#### Easter Egg
Typing anywhere opens hidden terminal:

Commands:
- `projects`
- `about`
- `contact`

---

## 6. Interaction & Easter Eggs

### Hidden Features

1. **Konami Code**
   - Activates “debug mode”
   - Displays system metrics overlay

2. **Project Hover**
   - Shows:
     - latency
     - throughput
     - transaction volume

3. **Scroll Speed Detection**
   - Fast scroll → glitch effect
   - Slow scroll → cinematic mode

4. **Idle Mode**
   - Background systems evolve automatically

---

## 7. Performance Requirements

- Lighthouse score ≥ 85
- Lazy-load heavy assets
- Use dynamic imports and suspense
- GPU-friendly animations

Three.js must:
- degrade gracefully on low-end devices

---

## 8. Content Structure

```bash
/content
  /projects
    debyth.mdx
    maplerad.mdx
    everest.mdx
    mono.mdx
  /essays
    payments.md
    systems.md
    scaling.md



find more projects here: https://github.com/khrees2412, find the ones with recent commits.