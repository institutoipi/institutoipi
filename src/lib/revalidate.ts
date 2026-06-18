import { revalidatePath } from 'next/cache'
import type { Payload } from 'payload'

export function revalidateBlog(reason: string, slug?: string, payload?: Payload): void {
  try {
    revalidatePath('/blog', 'page')
    if (slug) revalidatePath(`/blog/${slug}`, 'page')
    payload?.logger?.info(`[revalidate] ${reason}`)
  } catch (err) {
    payload?.logger?.error(`[revalidate] falha (${reason}): ${(err as Error).message}`)
  }
}
