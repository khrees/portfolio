import { defineConfig, type Plugin, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import { Feed } from 'feed'
import { posts } from './src/lib/blog'
import { sendContactEmail, getContactEnv } from './src/lib/api/contact'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

function rssPlugin(): Plugin {
  const generateRss = () => {
    const origin = 'https://khrees.com'

    const feed = new Feed({
      title: 'khrees — Engineering Blog',
      description: 'Thoughts on fintech infrastructure, system design, and developer experience.',
      id: `${origin}/blog/`,
      link: `${origin}/blog/`,
      language: 'en',
      favicon: `${origin}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, Christian Ndu`,
      generator: 'khrees',
    })

    for (const post of posts) {
      feed.addItem({
        title: post.title,
        id: `${origin}/blog/${post.slug}`,
        link: `${origin}/blog/${post.slug}`,
        description: post.description,
        date: new Date(post.date),
        category: post.tags.map((tag) => ({ name: tag })),
      })
    }

    return feed.rss2()
  }

  return {
    name: 'rss-generator',
    configureServer(server) {
      server.middlewares.use('/blog/rss.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
        res.end(generateRss())
      })
    },
    closeBundle() {
      const rss = generateRss()
      const distBlogDir = join(__dirname, 'dist', 'blog')
      mkdirSync(distBlogDir, { recursive: true })
      writeFileSync(join(distBlogDir, 'rss.xml'), rss, 'utf-8')
      console.log('[rss-generator] Generated dist/blog/rss.xml')
    },
  }
}

function apiPlugin(): Plugin {
  return {
    name: 'api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '')
      const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY
      const contactEmail = env.CONTACT_EMAIL || process.env.CONTACT_EMAIL

      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const { name, email, message } = JSON.parse(body)

            if (!name || !email || !message) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Missing required fields' }))
              return
            }

            if (!apiKey || !contactEmail) {
              console.error('[api] Missing RESEND_API_KEY or CONTACT_EMAIL')
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Server not configured for email' }))
              return
            }

            await sendContactEmail({ name, email, message }, { apiKey, to: contactEmail })

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            console.error('[api] contact error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Failed to send message' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackRouter({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    mdx({}),
    viteReact(),
    rssPlugin(),
    apiPlugin(),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
})
