import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Globe, Leaf, Landmark, Mountain, Users, Megaphone, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const INSTAGRAM = 'https://www.instagram.com/institutoipi/'
const YOUTUBE = 'https://www.youtube.com/@institutoipi'

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IPI — Instituto de Políticas Internacionais',
  url: 'https://institutoipi.org/',
  logo: 'https://institutoipi.org/logo_ipi.png',
  description:
    'Formação de jovens líderes críticos para ocupar os espaços de decisão: diplomacia, direitos humanos e protagonismo juvenil.',
  sameAs: [INSTAGRAM, YOUTUBE],
}

const valores = [
  'Direitos Humanos',
  'Protagonismo Juvenil',
  'Inclusão e Diversidade',
  'Educação Crítica',
  'Cooperação Internacional',
  'Responsabilidade Social',
  'Ética e Democracia',
]

const frentes: { sigla: string; nome: string; desc: string; cor: string; Icon: LucideIcon }[] = [
  {
    sigla: 'DRI',
    nome: 'Relações Internacionais',
    desc: 'Articulação global do Instituto: representação em fóruns, simulações diplomáticas e intercâmbio sobre política externa.',
    cor: 'sol',
    Icon: Globe,
  },
  {
    sigla: 'DMA',
    nome: 'Meio Ambiente',
    desc: 'Sustentabilidade e emergência climática: educação ambiental, acompanhamento das COPs e justiça climática.',
    cor: 'mata',
    Icon: Leaf,
  },
  {
    sigla: 'DPP',
    nome: 'Políticas Públicas',
    desc: 'Interface entre conhecimento acadêmico e prática governamental, com foco em juventude, educação e cidadania.',
    cor: 'coral',
    Icon: Landmark,
  },
  {
    sigla: 'DPI',
    nome: 'Políticas Indígenas',
    desc: 'Valorização, defesa e promoção dos direitos dos povos originários e do protagonismo de jovens lideranças indígenas.',
    cor: 'coral',
    Icon: Mountain,
  },
  {
    sigla: 'DRH',
    nome: 'Recursos Humanos',
    desc: 'Gestão de talentos e voluntariado: recrutamento, onboarding, formação de lideranças e clima organizacional.',
    cor: 'sol',
    Icon: Users,
  },
  {
    sigla: 'DMM',
    nome: 'Marketing e Mídias',
    desc: 'A voz e a vitrine do IPI: identidade visual, comunicação e conteúdos que ampliam o alcance e mobilizam a comunidade.',
    cor: 'mata',
    Icon: Megaphone,
  },
]

const projetos = [
  {
    nome: 'Delegações Acadêmicas e Diplomáticas',
    desc: 'Preparação de delegações juvenis para simulações, conferências e fóruns no Brasil e no exterior.',
  },
  {
    nome: 'Integração da Juventude Latino-Americana',
    desc: 'Diálogo regional, identidade latino-americana e cooperação acadêmica entre jovens do continente.',
  },
  {
    nome: 'NUPPA — Núcleo de Pesquisa e Produção Acadêmica',
    desc: 'Centro de produção de conhecimento e fortalecimento do pensamento crítico do Instituto.',
  },
  {
    nome: 'Jovem Político',
    desc: 'Workshops sobre a baixa participação de jovens na política e caminhos para a participação ativa.',
  },
  {
    nome: 'Línguas do Brasil',
    desc: 'Salvaguarda e democratização dos idiomas originários, combatendo a invisibilidade das culturas nativas.',
  },
  {
    nome: 'Cooperação Brasil–Angola',
    desc: 'Embaixada do IPI em Angola como polo de articulação diplomática, científica, social e ambiental.',
  },
  {
    nome: 'Radar Climático',
    desc: 'Observatório de políticas ambientais e agendas globais, com análises sobre justiça climática e racismo ambiental.',
  },
]

const impacto = [
  'Acesso a oportunidades internacionais',
  'Democratização da diplomacia juvenil',
  'Autoestima, autonomia e consciência política',
  'Redes de jovens líderes pela transformação',
  'Perspectiva decolonial e diversidade',
  'Produção de conhecimento com impacto local e global',
]

const accent: Record<string, { text: string; bg: string; border: string }> = {
  sol: { text: 'text-sol', bg: 'bg-sol/15', border: 'border-sol/30' },
  coral: { text: 'text-coral', bg: 'bg-coral/15', border: 'border-coral/30' },
  mata: { text: 'text-mata', bg: 'bg-mata/15', border: 'border-mata/30' },
  neutral: { text: 'text-paper', bg: 'bg-paper/10', border: 'border-paper/20' },
}

/* Assinatura: traço de pena desenhado à mão sob a palavra */
function Mark({ children, color = '#5B92E5' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="mark">
      {children}
      <svg viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M3 11 C 70 4, 150 3, 210 8 S 330 15, 397 6"
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
        />
      </svg>
    </span>
  )
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full opacity-[0.14] blur-3xl"
            style={{ background: 'radial-gradient(circle, #5B92E5, transparent 70%)' }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-5 font-display text-xs font-semibold tracking-[0.25em] text-soft uppercase">
                Instituto de Políticas Internacionais
              </p>
              <h1 className="font-display text-[2.7rem] leading-[1.04] font-bold tracking-tight text-paper sm:text-6xl md:text-7xl">
                A voz da <Mark color="#5B92E5">juventude</Mark>
                <br />
                escreve o <Mark color="#86B2F0">futuro</Mark>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-soft">
                Formamos jovens líderes críticos para ocupar os espaços de decisão — diplomacia,
                direitos humanos e protagonismo juvenil, com perspectiva decolonial e compromisso
                democrático.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sol px-7 py-3.5 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
                >
                  Faça parte
                  <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="#sobre"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 font-semibold text-paper transition-colors hover:bg-paper/5"
                >
                  Conheça o IPI
                </a>
              </div>
            </div>

            <div className="hidden justify-center lg:flex">
              <Image
                src="/logo_ipi.png"
                alt="Pena e tinteiro — símbolo do IPI"
                width={244}
                height={295}
                className="w-56 opacity-90 invert"
                priority
              />
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="border-t border-line bg-surface px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                  Quem somos
                </p>
                <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
                  Educação política, diplomática e cidadã para a juventude.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-soft">
                  O IPI é uma iniciativa educacional e social comprometida com a formação de jovens
                  líderes engajados — especialmente de contextos periféricos e sub-representados —
                  para atuar nos espaços de debate, decisão e transformação social.
                </p>
                <p className="mt-4 leading-relaxed text-soft">
                  Acreditamos que a juventude tem papel central na construção de sociedades mais
                  justas, democráticas e sustentáveis.
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-soft uppercase">
                  Nossos valores
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {valores.map((v) => (
                    <span
                      key={v}
                      className="rounded-full border border-line bg-surface-2 px-4 py-2 text-sm font-medium text-paper"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FRENTES / DEPARTAMENTOS */}
        <section id="frentes" className="border-t border-line px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                Nossas frentes
              </p>
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
                Uma estrutura colaborativa, orientada a projetos.
              </h2>
            </div>
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
                        <h3 className="font-display text-lg leading-tight font-bold text-paper">
                          {f.nome}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-soft">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PROJETOS */}
        <section id="projetos" className="border-t border-line bg-surface px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                Projetos em andamento
              </p>
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
                Iniciativas que projetam a juventude brasileira.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projetos.map((p, i) => (
                <article
                  key={p.nome}
                  className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface-2 p-6 transition-colors hover:border-sol/40"
                >
                  <span className="font-display text-xs font-semibold tracking-widest text-sol/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-base font-bold text-paper">{p.nome}</h3>
                  <p className="text-sm leading-relaxed text-soft">{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACTO */}
        <section id="impacto" className="border-t border-line bg-surface-2 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                Impacto social
              </p>
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
                Para que a juventude deixe de ser espectadora e ocupe os centros de decisão.
              </h2>
            </div>
            <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {impacto.map((item) => (
                <li key={item} className="flex items-start gap-3 border-t border-line pt-5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sol" aria-hidden="true" />
                  <span className="text-lg text-paper/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DOIS CAMINHOS */}
        <section id="faca-parte" className="border-t border-line px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-line bg-surface p-8 sm:p-10">
              <p className="font-display text-xs font-semibold tracking-[0.25em] text-coral uppercase">
                Para jovens
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
                Faça parte do movimento.
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-soft">
                Voluntarie-se, participe das delegações e ocupe espaços de decisão política, acadêmica
                e internacional. Não importa de onde você vem.
              </p>
              <Link
                href="/contato"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-coral px-7 py-3.5 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:brightness-105"
              >
                Quero participar <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="flex flex-col rounded-3xl border border-line bg-surface-2 p-8 sm:p-10">
              <p className="font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                Para instituições
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold text-paper sm:text-3xl">
                Seja parceiro do IPI.
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-soft">
                Somos um parceiro estratégico para organizações que acreditam no poder transformador
                da educação e do protagonismo jovem. Vamos construir juntos.
              </p>
              <Link
                href="/contato"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-sol px-7 py-3.5 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:brightness-105"
              >
                Propor parceria <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section className="border-t border-line bg-surface px-6 py-20 sm:py-24">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
                Conteúdo & pesquisa
              </p>
              <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-4xl">
                Pensamento crítico, em texto.
              </h2>
              <p className="mt-4 leading-relaxed text-soft">
                Análises, projetos e produção acadêmica do NUPPA e dos nossos departamentos.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-semibold text-paper transition-colors hover:bg-paper/5"
            >
              Ler nossos textos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}