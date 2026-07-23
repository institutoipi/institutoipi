import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getPublishedPosts } from '@/lib/posts'
import { PageHeader } from '@/components/site/PageHeader'

export const metadata: Metadata = {
  title: 'Nossos textos',
  description: 'Artigos e publicações do Instituto de Políticas Internacionais.',
  alternates: { canonical: '/blog' },
}

// Dinâmica (build do Docker não tem DB), mas a query é cacheada — ver src/lib/posts.ts.
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Conteúdo & pesquisa"
        title="Nossos textos"
        intro="Análises, projetos e produção acadêmica do Instituto de Políticas Internacionais."
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface px-8 py-16 text-center">
          <p className="font-display text-xl font-bold text-paper">Em breve, nossos primeiros textos</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-soft">
            Estamos preparando análises, projetos e produção acadêmica. Enquanto isso, acompanhe o
            Instituto pelas redes ou fale com a gente.
          </p>
          <Link
            href="/contato"
            className="mt-6 inline-flex rounded-full bg-sol px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-105"
          >
            Fale conosco
          </Link>
        </div>
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
                        width={cover.width ?? undefined}
                        height={cover.height ?? undefined}
                        loading="lazy"
                        decoding="async"
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
