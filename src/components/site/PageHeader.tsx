/**
 * Cabeçalho padrão das páginas internas: eyebrow + H1 + intro, alinhado à
 * esquerda dentro de um container `max-w-6xl`. Garante consistência visual
 * entre /sobre, /frentes, /projetos, etc.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-paper sm:text-5xl">
        {title}
      </h1>
      {intro && <p className="mt-5 text-lg leading-relaxed text-soft">{intro}</p>}
    </div>
  )
}
