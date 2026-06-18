import Image from 'next/image'
import React from 'react'

const socials = [
  { href: 'https://www.instagram.com/institutoipi/', label: 'Instagram' },
  { href: 'https://www.youtube.com/@institutoipi', label: 'YouTube' },
  { href: 'https://wa.me/5566999186206', label: 'WhatsApp' },
]

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IPI — Instituto de Políticas Internacionais',
  url: 'https://institutoipi.org/',
  logo: 'https://institutoipi.org/logo_ipi.png',
  description:
    'Divulgar a diplomacia e o protagonismo juvenil através de políticas públicas e sociais.',
  sameAs: [
    'https://www.instagram.com/institutoipi/',
    'https://www.youtube.com/@institutoipi',
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 py-16 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]"
        />

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
          <Image
            src="/logo_ipi.png"
            alt="IPI — Instituto de Políticas Internacionais"
            width={244}
            height={295}
            className="w-44 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] sm:w-52"
            priority
          />

          <h1 className="mt-4 text-xs tracking-[0.35em] text-white/60 uppercase">
            IPI — Instituto de Políticas Internacionais
          </h1>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-medium tracking-[0.35em] text-white/70 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Site em construção
          </div>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/85 sm:text-xl">
            Divulgar a diplomacia e o protagonismo juvenil através de políticas públicas e sociais.
          </p>

          <div className="mt-12 h-px w-24 bg-white/20" />

          <div className="mt-10 flex items-center gap-5">
            {socials.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white hover:text-black"
              >
                {label === 'Instagram' && <InstagramIcon />}
                {label === 'YouTube' && <YouTubeIcon />}
                {label === 'WhatsApp' && <WhatsAppIcon />}
              </a>
            ))}
          </div>

          <p className="mt-16 text-xs tracking-widest text-white/40">
            © {new Date().getFullYear()} IPI · INSTITUTO DE POLÍTICAS INTERNACIONAIS
          </p>
        </div>
      </main>
    </>
  )
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.89-11.893 11.89a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 1 1.51 5.26l.6.952-1 3.648 3.379-.559zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  )
}
