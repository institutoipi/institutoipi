import Link from 'next/link'
import React from 'react'
import type { Post } from '@/payload-types'
import { RichText } from './RichText'

type Props = {
  post: Post
  isPreview?: boolean
}

export function PostView({ post, isPreview }: Props) {
  const cover = post.cover && typeof post.cover === 'object' ? post.cover : null
  const category = post.category && typeof post.category === 'object' ? post.category : null
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    image: cover?.url ? [cover.url] : undefined,
    author: {
      '@type': author?.name ? 'Person' : 'Organization',
      name: author?.name || 'IPI — Instituto de Políticas Internacionais',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPI — Instituto de Políticas Internacionais',
      logo: { '@type': 'ImageObject', url: 'https://institutoipi.org/logo_ipi.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://institutoipi.org/blog/${post.slug}`,
    },
  }

  return (
    <>
      {!isPreview && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {isPreview && (
        <div className="sticky top-0 z-50 bg-sol px-6 py-2 text-center text-xs font-semibold tracking-wider text-ink uppercase">
          Modo Preview — este conteúdo ainda não foi publicado
        </div>
      )}

      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        {!isPreview && (
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-1.5 rounded-md text-sm text-soft transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
          >
            <span aria-hidden="true">←</span> Voltar ao blog
          </Link>
        )}

        {cover?.url && (
          <div className="mb-10 aspect-video w-full overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt || post.title}
              width={cover.width ?? undefined}
              height={cover.height ?? undefined}
              fetchPriority="high"
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-soft">
          {category?.name && (
            <span className="rounded-full border border-line px-3 py-1 font-display font-semibold tracking-wider text-sol uppercase">
              {category.name}
            </span>
          )}
          {date && <span>{date}</span>}
          {author?.name && <span>por {author.name}</span>}
        </div>

        <h1 className="mb-8 font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mb-10 border-l-2 border-sol pl-4 text-lg leading-relaxed text-soft">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-sol prose-a:no-underline hover:prose-a:underline">
            <RichText content={post.content} />
          </div>
        )}
      </main>
    </>
  )
}