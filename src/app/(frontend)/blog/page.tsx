import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const metadata: Metadata = {
  title: 'Nossos textos',
  description: 'Artigos e publicações do Instituto de Políticas Internacionais.',
  alternates: { canonical: '/blog' },
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 2,
    limit: 50,
  })

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
          Conteúdo &amp; pesquisa
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">Nossos textos</h1>
        <p className="mt-4 leading-relaxed text-soft">
          Análises, projetos e produção acadêmica do Instituto de Políticas Internacionais.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-soft">Nenhum post publicado ainda.</p>
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
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-line bg-surface-2">
                    {cover?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.url}
                        alt={cover.alt || post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(circle at 50% 45%, rgba(244,177,75,0.12), transparent 70%)',
                          }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/logo_ipi.png"
                          alt=""
                          aria-hidden="true"
                          className="h-20 w-auto opacity-30 blur-[2px] invert transition duration-300 group-hover:opacity-45"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {category && (
                      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-soft">
                        {category.name}
                      </span>
                    )}
                    <h2 className="font-display text-base font-bold leading-snug text-paper transition group-hover:text-sol">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm leading-relaxed text-soft line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {date && (
                      <p className="text-xs text-soft">{date}</p>
                    )}
                  </div>
                </Link>
              )
            })}
        </div>
      )}
    </main>
  )
}
