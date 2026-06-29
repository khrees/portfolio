# khrees

Portfolio + engineering blog. Built with React 19, TanStack Router, Vite, Tailwind CSS v4, GSAP, Motion, Three.js, and MDX.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # outputs to dist/
```

## Project structure

```
src/
├── routes/           # TanStack file-based routes
│   ├── __root.tsx    # Root layout (smooth scroll, cursor)
│   ├── index.tsx     # Homepage
│   ├── about.tsx
│   ├── blog.tsx      # Blog listing (/blog)
│   ├── blog/$slug.tsx # Individual post (/blog/:slug)
│   └── work.tsx
├── components/       # React components
├── lib/              # Utilities, blog data, GSAP config
├── styles.css        # Global styles + Tailwind
└── main.tsx          # App entry point

content/blog/         # MDX blog posts
```

## Adding a blog post

1. **Create the MDX file** at `content/blog/your-post-slug.mdx`:

```mdx
---
title: "Your Post Title"
date: "2026-07-01"
description: "A short description of the post"
tags:
  - Tag1
  - Tag2
---
Your content here...
```

2. **Register the post** in `src/lib/blog.ts` by adding an entry to the `posts` array:

```ts
{
  slug: 'your-post-slug',
  title: 'Your Post Title',
  date: '2026-07-01',
  description: 'A short description of the post',
  tags: ['Tag1', 'Tag2'],
  readingTime: '3 min read',
}
```

3. **Optionally feature it** on the homepage by adding an entry to `essayMeta` in `src/components/Thinking.tsx`.

The post is automatically available at `/blog/your-post-slug`.

## Tech stack

| | |
|---|---|
| Framework | React 19 |
| Routing | TanStack Router (file-based) |
| Build | Vite 7 |
| CSS | Tailwind CSS v4 + custom properties |
| Animation | GSAP, Motion (Framer Motion), Lenis |
| 3D | Three.js via @react-three/fiber |
| Blog | MDX via @mdx-js/rollup |
| Icons | Lucide React |
| Syntax | Shiki |
