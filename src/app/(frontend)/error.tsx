'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-bold text-paper sm:text-3xl">Algo deu errado</h1>
      <p className="mt-3 leading-relaxed text-soft">
        Tivemos um problema ao carregar esta página. Tente novamente em instantes.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-sol px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-105"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/5"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
