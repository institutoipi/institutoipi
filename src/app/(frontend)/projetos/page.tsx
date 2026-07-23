import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageHeader } from '@/components/site/PageHeader'
import { projetos } from '@/lib/institucional'

const description =
  'Projetos do IPI que projetam a juventude brasileira: delegações diplomáticas, integração latino-americana, NUPPA, Jovem Político, Línguas do Brasil, cooperação Brasil–Angola e Radar Climático.'

export const metadata: Metadata = {
  title: 'Projetos',
  description,
  alternates: { canonical: '/projetos' },
  openGraph: { title: 'Projetos', description, url: '/projetos', type: 'website' },
}

export default function ProjetosPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Projetos' }]} />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <PageHeader
          eyebrow="Projetos em andamento"
          title="Iniciativas que projetam a juventude brasileira."
          intro="Da diplomacia à justiça climática, nossos projetos abrem caminhos concretos para jovens ocuparem espaços de decisão no Brasil e no mundo."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projetos.map((p, i) => (
            <article
              key={p.nome}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-6 transition-colors hover:border-sol/40"
            >
              <span className="font-display text-xs font-semibold tracking-widest text-sol/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-base font-bold text-paper">{p.nome}</h2>
              <p className="text-sm leading-relaxed text-soft">{p.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/5"
          >
            Ler nossos textos
          </Link>
          <Link
            href="/contato"
            className="rounded-full bg-sol px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-105"
          >
            Faça parte
          </Link>
        </div>
      </main>
    </>
  )
}
