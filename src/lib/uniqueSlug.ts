import type { Payload, CollectionSlug, Where } from 'payload'
import { slugify } from './slugify'

/**
 * Gera um slug único: parte de `slugify(base)` e, se já existir, adiciona sufixo
 * incremental (`-2`, `-3`…). Evita a violação crua do índice `unique` quando dois
 * títulos/nomes geram o mesmo slug.
 */
export async function uniqueSlug(
  payload: Payload,
  collection: CollectionSlug,
  base: string,
  currentId?: string | number,
): Promise<string> {
  const root = slugify(base)
  let candidate = root
  let n = 2
  for (let i = 0; i < 100; i++) {
    const where: Where = currentId
      ? { and: [{ slug: { equals: candidate } }, { id: { not_equals: currentId } }] }
      : { slug: { equals: candidate } }
    const { totalDocs } = await payload.count({ collection, where, overrideAccess: true })
    if (totalDocs === 0) return candidate
    candidate = `${root}-${n++}`
  }
  return `${root}-${n}`
}
