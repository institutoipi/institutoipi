import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageHeader } from '@/components/site/PageHeader'
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
    <>
      <Breadcrumbs items={[{ name: 'Início', path: '/' }, { name: 'Contato' }]} />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <PageHeader
          eyebrow="Contato"
          title="Fale conosco"
          intro="Preencha o formulário e entraremos em contato em breve — ou fale por uma das nossas redes."
        />
        <div className="max-w-xl">
          <ContactForm subjects={subjects} />
        </div>
      </main>
    </>
  )
}
