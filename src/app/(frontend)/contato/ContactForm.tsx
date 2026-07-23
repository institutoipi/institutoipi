'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { submitContact, type ContactState } from './actions'

const initial: ContactState = { status: 'idle' }

// Máscara de telefone BR: (xx)xxxx-xxxx (fixo) ou (xx)xxxxx-xxxx (celular).
function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)})${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)})${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)})${d.slice(2, 7)}-${d.slice(7)}`
}

const fieldClass =
  'rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-paper placeholder:text-soft/70 focus:border-sol focus:ring-2 focus:ring-sol/30 focus:outline-none'
const labelClass = 'text-xs font-medium tracking-wider uppercase text-soft'

type Subject = { id: string; name: string }

export function ContactForm({ subjects = [] }: { subjects?: Subject[] }) {
  const [state, action, pending] = useActionState(submitContact, initial)
  const [phone, setPhone] = useState('')
  const successRef = useRef<HTMLParagraphElement>(null)

  // Move o foco para a confirmação (leitores de tela anunciam; teclado segue dali).
  useEffect(() => {
    if (state.status === 'success') successRef.current?.focus()
  }, [state.status])

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p
          ref={successRef}
          tabIndex={-1}
          className="font-display text-lg font-bold text-paper outline-none"
        >
          Mensagem enviada!
        </p>
        <p className="mt-2 text-sm text-soft">
          Enviamos uma confirmação para o seu e-mail. Entraremos em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Honeypot anti-spam: invisível a humanos e leitores de tela; bots preenchem. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {state.status === 'error' && (
        <p
          role="alert"
          className="rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Nome <span className="text-sol">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          pattern="^\s*\S+(\s+\S+)+\s*$"
          title="Informe nome e sobrenome"
          className={fieldClass}
          placeholder="Nome e sobrenome"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          E-mail <span className="text-sol">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="seu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className={labelClass}>
          Telefone <span className="text-sol">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          maxLength={15}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          autoComplete="tel"
          className={fieldClass}
          placeholder="(00)00000-0000"
        />
      </div>

      {subjects.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className={labelClass}>
            Assunto <span className="text-sol">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className={`${fieldClass} cursor-pointer`}
          >
            <option value="" disabled>
              Selecione um assunto
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-surface-2 text-paper">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Mensagem <span className="text-sol">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-none`}
          placeholder="Como podemos ajudar?"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-sol px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:brightness-105 focus-visible:ring-2 focus-visible:ring-sol focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Enviando…' : 'Enviar mensagem'}
      </button>
    </form>
  )
}