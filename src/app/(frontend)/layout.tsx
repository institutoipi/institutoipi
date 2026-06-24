import type { Metadata, Viewport } from 'next'
import React from 'react'
import { Space_Grotesk, Manrope } from 'next/font/google'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import './styles.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--ff-display',
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--ff-body',
  display: 'swap',
})

const siteUrl = 'https://institutoipi.org'
const title = 'IPI — Instituto de Políticas Internacionais'
const description =
  'Formação de jovens líderes críticos para ocupar os espaços de decisão: diplomacia, direitos humanos e protagonismo juvenil. A voz da juventude escreve o futuro.'

export const metadata: Metadata = {
  title: { default: title, template: '%s · IPI' },
  description,
  authors: [{ name: 'IPI — Instituto de Políticas Internacionais' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title,
    description,
    type: 'website',
    url: siteUrl,
    locale: 'pt_BR',
    siteName: 'IPI — Instituto de Políticas Internacionais',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0C1626',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-sol focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <div id="conteudo" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  )
}