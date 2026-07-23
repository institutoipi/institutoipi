import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageHeader } from '@/components/site/PageHeader'
import { frentes, accent } from '@/lib/institucional'

const description =
  'As frentes temáticas do IPI: Relações Internacionais, Meio Ambiente, Políticas Públicas, Políticas Indígenas, Recursos Humanos e Marketing e Mídias.'

export const metadata: Metadata = {
  title: 'Nossas frentes',
  description,
  alternates: { canonical: '/frentes' },
  openGraph: { title: 'Nossas frentes', description, url: '/frentes', type: 'website' },
}

export default function FrentesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Frentes' }]} />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <PageHeader
          eyebrow="Nossas frentes"
          title="Uma estrutura colaborativa, orientada a projetos."
          intro="O trabalho do IPI se organiza em departamentos temáticos que colaboram entre si — cada um com sua área de atuação, todos voltados ao protagonismo da juventude."
        />

        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {frentes.map((f) => {
            const a = accent[f.cor]
            const Icon = f.Icon
            return (
              <div key={f.sigla} className="flex flex-col gap-3 bg-surface p-7">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${a.bg} ${a.border} ${a.text}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="font-display text-[11px] font-semibold tracking-widest text-soft">
                      {f.sigla}
                    </span>
                    <h2 className="font-display text-lg leading-tight font-bold text-paper">
                      {f.nome}
                    </h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-soft">{f.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/projetos"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/5"
          >
            Ver os projetos
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
