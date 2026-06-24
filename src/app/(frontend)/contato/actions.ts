'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
  const name = getString('name')
  const email = getString('email')
  const phone = getString('phone')
  const subject = getString('subject')
  const subjectId = subject ? Number(subject) : undefined
  const message = getString('message')

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
      data: {
        name,
        email,
        phone,
        message,
        source: 'pagina-contato',
        ...(subjectId && Number.isFinite(subjectId) ? { subject: subjectId } : {}),
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', message: 'Erro ao enviar. Tente novamente em instantes.' }
  }
}
