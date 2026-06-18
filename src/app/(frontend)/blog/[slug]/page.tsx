import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { PostView } from '@/components/blog/PostView'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })

  const post = docs[0]
  if (!post) return {}

  const cover = post.cover && typeof post.cover === 'object' ? post.cover : null

  return {
    title: `${post.seoTitle || post.title} — IPI`,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: cover?.url
      ? { images: [{ url: cover.url, width: cover.width ?? undefined, height: cover.height ?? undefined }] }
      : undefined,
  }
}

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const post = docs[0]
  if (!post) notFound()

  return <PostView post={post} />
}
