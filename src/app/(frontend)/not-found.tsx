import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-7xl font-bold text-sol">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-paper sm:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-3 leading-relaxed text-soft">
        O conteúdo que você procura não existe ou pode ter sido movido.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-sol px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-105"
        >
          Voltar ao início
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/5"
        >
          Ver nossos textos
        </Link>
      </div>
    </main>
  )
}
