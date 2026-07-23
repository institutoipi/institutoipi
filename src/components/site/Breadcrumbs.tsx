import Link from 'next/link'

export type Crumb = { name: string; path?: string }

/**
 * Trilha de navegação visível + JSON-LD BreadcrumbList (rich result do Google).
 * O último item é a página atual (sem link).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `https://institutoipi.org${c.path}` } : {}),
    })),
  }

  return (
    <nav aria-label="Trilha de navegação" className="border-b border-line bg-surface">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-3 text-sm text-soft">
        {items.map((c, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {c.path && !isLast ? (
                <Link href={c.path} className="transition-colors hover:text-paper">
                  {c.name}
                </Link>
              ) : (
                <span className={isLast ? 'text-paper' : undefined} aria-current={isLast ? 'page' : undefined}>
                  {c.name}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-soft/40">
                  ›
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  )
}
