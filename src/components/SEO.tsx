import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  image?: string
  url?: string
}

export function SEO({ title, description, image, url }: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title

    const updateMeta = (nameOrProperty: string, value?: string, isProperty = false) => {
      if (!value) return
      const attribute = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attribute, nameOrProperty)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    };

    // Update Meta descriptions
    updateMeta('description', description)
    updateMeta('og:description', description, true)
    updateMeta('twitter:description', description)

    // Update Open Graph & Twitter titles
    updateMeta('og:title', title, true)
    updateMeta('twitter:title', title)

    // Update Open Graph & Twitter images
    updateMeta('og:image', image, true)
    updateMeta('twitter:image', image)

    // Update Open Graph & Twitter URLs
    updateMeta('og:url', url, true)
    updateMeta('twitter:url', url)
  }, [title, description, image, url])

  return null
}
