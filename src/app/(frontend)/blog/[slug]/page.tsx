import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { PostView } from '@/components/blog/PostView'
import { getPostBySlug } from '@/lib/posts'

type Props = { params: Promise<{ slug: string }> }

// Dinâmica (build do Docker não tem DB), mas a query é cacheada e o mesmo getter
// serve metadata + página → 1 hit no DB por request (e cacheado). Ver src/lib/posts.ts.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const cover = post.cover && typeof post.cover === 'object' ? post.cover : null
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || undefined

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      ...(cover?.url
        ? { images: [{ url: cover.url, width: cover.width ?? undefined, height: cover.height ?? undefined }] }
        : {}),
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <PostView post={post} />
}
