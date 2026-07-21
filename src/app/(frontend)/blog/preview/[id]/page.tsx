import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { LivePreviewClient } from './LivePreviewClient'

type Props = { params: Promise<{ id: string }> }

// Nunca cachear páginas de preview
export const dynamic = 'force-dynamic'

export default async function PostPreviewPage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  // Busca por ID incluindo rascunhos (o slug pode ser nulo num rascunho novo).
  // overrideAccess pois a rota é interna do admin.
  const post = await payload
    .findByID({ collection: 'posts', id, depth: 2, draft: true, overrideAccess: true })
    .catch(() => null)

  if (!post) notFound()

  return <LivePreviewClient initialData={post} />
}
