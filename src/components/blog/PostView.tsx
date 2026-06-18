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

  return (
    <div className="min-h-screen bg-black text-white">
      {isPreview && (
        <div className="sticky top-0 z-50 bg-yellow-400 px-6 py-2 text-center text-xs font-semibold text-black tracking-wider uppercase">
          Modo Preview — este conteúdo ainda não foi publicado
        </div>
      )}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-5">
          {!isPreview && (
            <Link href="/blog" className="text-white/50 transition hover:text-white text-sm">
              ← Blog
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {cover?.url && (
          <div className="mb-10 aspect-video w-full overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={cover.alt || post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-white/40">
          {category?.name && (
            <span className="rounded-full border border-white/15 px-3 py-1 font-medium tracking-wider uppercase text-white/60">
              {category.name}
            </span>
          )}
          {date && <span>{date}</span>}
          {author?.name && <span>por {author.name}</span>}
        </div>

        <h1 className="mb-8 text-3xl font-bold leading-tight text-white sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mb-10 text-lg leading-relaxed text-white/60 border-l-2 border-white/20 pl-4">
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div className="prose prose-invert prose-lg max-w-none">
            <RichText content={post.content} />
          </div>
        )}
      </main>
    </div>
  )
}
