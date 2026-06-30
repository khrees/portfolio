export type PostMeta = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: string
}

export const posts: PostMeta[] = [
  {
    slug: 'why-recurring-payments-are-hard',
    title: 'Why recurring payments on-chain are fundamentally hard',
    date: '2026-04-10',
    description:
      'Traditional payment mandates work because banks are trusted custodians: they hold your account and can debit it on your behalf. Blockchain flips this.',
    tags: ['Blockchain', 'Payments'],
    readingTime: '3 min read',
  },
  {
    slug: 'designing-financial-systems-that-dont-fail',
    title: "Designing financial systems that don't fail",
    date: '2026-03-22',
    description:
      'Financial systems have a different failure model than consumer apps. A 500 error on Twitter is annoying. A 500 error mid-transfer could mean lost funds.',
    tags: ['Architecture', 'Reliability'],
    readingTime: '3 min read',
  },
  {
    slug: 'the-hidden-cost-of-third-party-integrations',
    title: 'The hidden cost of third-party integrations',
    date: '2026-02-15',
    description:
      'Every external API you integrate is a risk surface. Payment gateways fail. Mobile money operators return inconsistent status codes.',
    tags: ['Systems', 'Scale'],
    readingTime: '3 min read',
  },
  {
    slug: 'developer-experience-is-a-product-decision',
    title: 'Developer experience is a product decision',
    date: '2026-01-28',
    description:
      "API documentation isn't a nice-to-have: it's the product. When developers can't figure out your API, they don't call support. They leave.",
    tags: ['DevEx', 'Product'],
    readingTime: '3 min read',
  },
]

export function getPostBySlug(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function readingTime(text: string): string {
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}
