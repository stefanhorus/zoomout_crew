import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/game', '/admin', '/checkout', '/api'],
      },
    ],
    sitemap: 'https://zoomoutcrew.com/sitemap.xml',
  }
}
