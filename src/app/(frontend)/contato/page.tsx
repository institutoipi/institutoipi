import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com o Instituto de Políticas Internacionais.',
  alternates: { canonical: '/contato' },
}

export const dynamic = 'force-dynamic'

export default async function ContatoPage() {
  let subjects: { id: string; name: string }[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'subjects',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 100,
      depth: 0,
      select: { name: true },
    })
    subjects = docs.map((d) => ({ id: String(d.id), name: d.name }))
  } catch {
    subjects = []
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <div className="mb-10">
        <p className="mb-4 font-display text-xs font-semibold tracking-[0.25em] text-sol uppercase">
          Contato
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Fale conosco
        </h1>
        <p className="mt-4 leading-relaxed text-soft">
          Preencha o formulário e entraremos em contato em breve — ou fale por uma das nossas redes.
        </p>
      </div>

      <ContactForm subjects={subjects} />
    </main>
  )
}
