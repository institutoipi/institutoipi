import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import { LivePreviewClient } from './LivePreviewClient'

type Props = { params: Promise<{ slug: string }> }

// Nunca cachear páginas de preview
export const dynamic = 'force-dynamic'

export default async function PostPreviewPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Busca incluindo rascunhos (overrideAccess pois a rota é interna do admin)
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
  })

  const post = docs[0]
  if (!post) notFound()

  return <LivePreviewClient initialData={post} />
}
