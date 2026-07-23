'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rateLimit'

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const getString = (key: string) => {
    const v = formData.get(key)
    return typeof v === 'string' ? v.trim() : ''
  }

  // Honeypot: bots preenchem o campo oculto. Descarta silenciosamente (retorna
  // "sucesso" para não sinalizar ao bot que foi detectado).
  if (getString('website')) return { status: 'success' }

  // Rate limit por IP: no máx. 5 envios / 10 min. Caddy repassa X-Forwarded-For.
  const hdrs = await headers()
  const ip = (hdrs.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || 'desconhecido'
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return { status: 'error', message: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }
  }

  const name = getString('name')
  const email = getString('email')
  const phone = getString('phone')
  const subject = getString('subject')
  const subjectId = subject ? Number(subject) : undefined
  const message = getString('message')
  // Origem granular (CTAs passam um valor específico); default seguro.
  const source = getString('source') || 'pagina-contato'

  // subject é exigido no cliente quando há assuntos cadastrados; aqui fica tolerante
  // para não travar o formulário caso ainda não exista nenhum assunto no admin.
  if (!name || !email || !phone || !message) {
    return { status: 'error', message: 'Preencha todos os campos obrigatórios.' }
  }
  if (name.split(/\s+/).filter(Boolean).length < 2) {
    return { status: 'error', message: 'Informe nome e sobrenome.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Informe um e-mail válido.' }
  }
  // Telefone brasileiro: DDD + número (10 ou 11 dígitos), com ou sem +55.
  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    return { status: 'error', message: 'Informe um telefone válido com DDD.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'leads',
      // Local API com overrideAccess (o REST público está fechado em Leads.access).
      overrideAccess: true,
      data: {
        name,
        email,
        phone,
        message,
        source,
        ...(subjectId && Number.isFinite(subjectId) ? { subject: subjectId } : {}),
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', message: 'Erro ao enviar. Tente novamente em instantes.' }
  }
}
