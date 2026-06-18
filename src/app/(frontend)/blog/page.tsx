import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Blog — IPI',
  description: 'Artigos e publicações do Instituto de Políticas Internacionais.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 2,
    limit: 50,
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-5">
          <Link href="/" className="text-white/50 transition hover:text-white text-sm">
            ← IPI
          </Link>
          <h1 className="text-sm font-medium tracking-[0.25em] uppercase text-white/80">Blog</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-white/40">Nenhum post publicado ainda.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover =
                post.cover && typeof post.cover === 'object' ? post.cover : null
              const category =
                post.category && typeof post.category === 'object' ? post.category : null
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : null

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-white/5">
                    {cover?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.url}
                        alt={cover.alt || post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-white/5" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {category && (
                      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/50">
                        {category.name}
                      </span>
                    )}
                    <h2 className="text-base font-semibold leading-snug text-white group-hover:text-white/80 transition">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed text-white/50 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {date && (
                      <p className="text-xs text-white/30">{date}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
