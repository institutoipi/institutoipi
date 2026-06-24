import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const WHATSAPP = 'https://wa.me/5566999186206'
const INSTAGRAM = 'https://www.instagram.com/institutoipi/'
const YOUTUBE = 'https://www.youtube.com/@institutoipi'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 1 1.51 5.26l.6.952-1 3.648 3.379-.559zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}

const socials = [
  { href: INSTAGRAM, label: 'Instagram', Icon: InstagramIcon },
  { href: YOUTUBE, label: 'YouTube', Icon: YouTubeIcon },
  { href: WHATSAPP, label: 'WhatsApp', Icon: WhatsAppIcon },
]

const colInstituto = [
  ['Sobre', '/#sobre'],
  ['Frentes', '/#frentes'],
  ['Projetos', '/#projetos'],
  ['Impacto', '/#impacto'],
]

const colParticipe = [
  ['Faça parte', '/contato'],
  ['Seja parceiro', '/contato'],
  ['Blog', '/blog'],
]

const linkClass =
  'rounded-sm text-sm text-soft transition-colors hover:text-sol focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink px-6 pt-16 pb-10 text-paper">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo_ipi.png" alt="IPI" width={244} height={295} className="h-9 w-auto invert" />
              <span className="font-display text-lg font-bold tracking-tight text-paper">IPI</span>
            </Link>
            <p className="mt-4 max-w-[240px] text-sm leading-relaxed text-soft">
              Instituto de Políticas Internacionais — a voz da juventude escreve o futuro.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-soft transition-colors hover:border-sol hover:bg-sol hover:text-ink focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Instituto */}
          <nav aria-label="Instituto">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide text-paper">Instituto</h3>
            <ul className="space-y-3">
              {colInstituto.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Participe */}
          <nav aria-label="Participe">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide text-paper">Participe</h3>
            <ul className="space-y-3">
              {colParticipe.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide text-paper">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  +55 (66) 99918-6206
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  @institutoipi
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 rounded-full border border-sol/40 px-4 py-2 font-mono text-xs text-sol transition-colors hover:bg-sol/10 focus-visible:ring-2 focus-visible:ring-sol focus-visible:outline-none"
                >
                  Fale conosco →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-xs tracking-wide text-soft">
            © {new Date().getFullYear()} IPI · Instituto de Políticas Internacionais
          </p>
          <span className="font-mono text-xs text-soft">
            Educação política, diplomática e cidadã.
          </span>
        </div>
      </div>
    </footer>
  )
}