import { Globe, Leaf, Landmark, Mountain, Users, Megaphone, type LucideIcon } from 'lucide-react'

/**
 * Conteúdo institucional compartilhado entre a home (teasers) e as páginas
 * dedicadas (/sobre, /frentes, /projetos). Fonte única — estático por ser
 * conteúdo institucional estável e para máxima performance/SEO.
 */

export const valores = [
  'Direitos Humanos',
  'Protagonismo Juvenil',
  'Inclusão e Diversidade',
  'Educação Crítica',
  'Cooperação Internacional',
  'Responsabilidade Social',
  'Ética e Democracia',
]

export type Frente = {
  sigla: string
  nome: string
  desc: string
  cor: 'sol' | 'coral' | 'mata'
  Icon: LucideIcon
}

export const frentes: Frente[] = [
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

export type Projeto = { nome: string; desc: string }

export const projetos: Projeto[] = [
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

export const impacto = [
  'Acesso a oportunidades internacionais',
  'Democratização da diplomacia juvenil',
  'Autoestima, autonomia e consciência política',
  'Redes de jovens líderes pela transformação',
  'Perspectiva decolonial e diversidade',
  'Produção de conhecimento com impacto local e global',
]

export const accent: Record<string, { text: string; bg: string; border: string }> = {
  sol: { text: 'text-sol', bg: 'bg-sol/15', border: 'border-sol/30' },
  coral: { text: 'text-coral', bg: 'bg-coral/15', border: 'border-coral/30' },
  mata: { text: 'text-mata', bg: 'bg-mata/15', border: 'border-mata/30' },
  neutral: { text: 'text-paper', bg: 'bg-paper/10', border: 'border-paper/20' },
}
