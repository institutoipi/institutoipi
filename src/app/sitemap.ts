import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const base = 'https://institutoipi.org'

// Regenera de hora em hora para capturar novos posts publicados.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/sobre`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/frentes`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/projetos`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contato`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    })

    const posts: MetadataRoute.Sitemap = docs
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      }))

    return [...staticRoutes, ...posts]
  } catch {
    // DB indisponível no build → ao menos as rotas estáticas.
    return staticRoutes
  }
}