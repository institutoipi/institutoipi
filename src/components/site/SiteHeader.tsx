'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

const nav = [
  ['Sobre', '/#sobre'],
  ['Frentes', '/#frentes'],
  ['Projetos', '/#projetos'],
  ['Nossos textos', '/blog'],
] as const

const linkClass =
  'rounded-lg px-3.5 py-2 text-sm font-medium text-soft transition-colors hover:bg-paper/5 hover:text-paper focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
        >
          <Image src="/logo_ipi.png" alt="IPI" width={244} height={295} className="h-9 w-auto invert" priority />
          <span className="font-display text-lg font-bold tracking-tight text-paper">IPI</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <li key={label}>
              <a href={href} className={linkClass}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/contato"
            className="rounded-full bg-sol px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-105 focus-visible:ring-2 focus-visible:ring-sol focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
          >
            Faça parte
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-paper transition-colors hover:bg-paper/5 focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-line bg-ink px-6 py-3 md:hidden">
          <ul className="flex flex-col">
            {nav.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base font-medium text-soft transition-colors hover:bg-paper/5 hover:text-paper focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
