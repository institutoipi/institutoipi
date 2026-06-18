'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'

const initial: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  if (state.status === 'success') {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-lg font-medium text-white">Mensagem enviada!</p>
        <p className="mt-2 text-sm text-white/50">
          Enviamos uma confirmação para o seu e-mail. Entraremos em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.status === 'error' && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-medium tracking-wider uppercase text-white/50">
          Nome <span className="text-white/30">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          placeholder="Seu nome completo"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium tracking-wider uppercase text-white/50">
          E-mail <span className="text-white/30">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          placeholder="seu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-xs font-medium tracking-wider uppercase text-white/50">
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          placeholder="+55 (00) 00000-0000"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium tracking-wider uppercase text-white/50">
          Mensagem <span className="text-white/30">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none"
          placeholder="Como podemos ajudar?"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? 'Enviando…' : 'Enviar mensagem'}
      </button>
    </form>
  )
}
