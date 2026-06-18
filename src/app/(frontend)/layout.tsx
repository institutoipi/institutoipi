import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

const siteUrl = 'https://institutoipi.org'
const title = 'IPI — Instituto de Políticas Internacionais'
const description =
  'Divulgar a diplomacia e o protagonismo juvenil através de políticas públicas e sociais.'

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: 'IPI — Instituto de Políticas Internacionais' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title,
    description,
    type: 'website',
    url: siteUrl,
    images: [{ url: '/logo_ipi.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/logo_ipi.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
