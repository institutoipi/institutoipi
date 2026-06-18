import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contato — IPI',
  description: 'Entre em contato com o Instituto de Políticas Internacionais.',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-2xl items-center gap-6 px-6 py-5">
          <Link href="/" className="text-white/50 transition hover:text-white text-sm">
            ← IPI
          </Link>
          <h1 className="text-sm font-medium tracking-[0.25em] uppercase text-white/80">
            Contato
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white">Fale conosco</h2>
          <p className="mt-2 text-sm text-white/50">
            Preencha o formulário e entraremos em contato em breve.
          </p>
        </div>

        <ContactForm />
      </main>
    </div>
  )
}
