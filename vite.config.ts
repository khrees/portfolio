import { defineConfig, type Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import { Feed } from 'feed'
import { posts } from './src/lib/blog'
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

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackRouter({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    mdx({}),
    viteReact(),
    rssPlugin(),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
})
