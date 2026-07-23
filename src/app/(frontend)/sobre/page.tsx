import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageHeader } from '@/components/site/PageHeader'
import { valores, impacto } from '@/lib/institucional'

const description =
  'O Instituto de Políticas Internacionais (IPI) forma jovens líderes críticos — especialmente de contextos periféricos — para ocupar os espaços de decisão: diplomacia, direitos humanos e protagonismo juvenil.'

export const metadata: Metadata = {
  title: 'Sobre o IPI',
  description,
  alternates: { canonical: '/sobre' },
  openGraph: { title: 'Sobre o IPI', description, url: '/sobre', type: 'website' },
}

export default function SobrePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Sobre' }]} />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <PageHeader
          eyebrow="Quem somos"
          title="Educação política, diplomática e cidadã para a juventude."
        />

        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-soft">
          <p>
            O IPI é uma iniciativa educacional e social comprometida com a formação de jovens
            líderes engajados — especialmente de contextos periféricos e sub-representados — para
            atuar nos espaços de debate, decisão e transformação social.
          </p>
          <p>
            Acreditamos que a juventude tem papel central na construção de sociedades mais justas,
            democráticas e sustentáveis. Por isso, nossa atuação combina formação crítica, prática
            diplomática e produção de conhecimento, sempre com perspectiva decolonial e compromisso
            democrático.
          </p>
          <p>
            Organizamo-nos em frentes temáticas colaborativas e projetos que projetam a juventude
            brasileira no Brasil e no mundo — das simulações diplomáticas à cooperação internacional,
            das políticas indígenas à justiça climática.
          </p>
        </div>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-xs font-semibold tracking-[0.25em] text-soft uppercase">
            Nossos valores
          </h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {valores.map((v) => (
              <span
                key={v}
                className="rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-paper"
              >
                {v}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-paper sm:text-3xl">
            Nosso impacto
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-soft">
            Para que a juventude deixe de ser espectadora e ocupe os centros de decisão.
          </p>
          <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {impacto.map((item) => (
              <li key={item} className="flex items-start gap-3 border-t border-line pt-5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sol" aria-hidden="true" />
                <span className="text-lg text-paper/90">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-line pt-10">
          <Link
            href="/frentes"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/5"
          >
            Conheça nossas frentes
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
