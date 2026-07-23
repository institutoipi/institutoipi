import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Getters da coleção de posts. As páginas do blog são `force-dynamic` (o build do
 * Docker não tem DB, então não dá pra prerenderizar). O ganho aqui é: query enxuta
 * (`select` + `depth:1`) e **dedup por request** via React `cache()` — assim
 * `generateMetadata` + a página do post compartilham 1 única query ao Postgres.
 *
 * Cache persistente/edge foi deixado de fora de propósito: a API de cache do Next 16
 * (`revalidateTag`/`use cache`) está em transição; a query indexada e leve por request
 * é adequada ao tráfego de um site institucional em 1 vCPU.
 */

export const getPublishedPosts = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 50,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      cover: true,
      category: true,
    },
  })
  return docs
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
})
