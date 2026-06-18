'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const getString = (key: string) => { const v = formData.get(key); return typeof v === 'string' ? v.trim() : '' }
  const name = getString('name')
  const email = getString('email')
  const phone = getString('phone') || undefined
  const message = getString('message')

  if (!name || !email || !message) {
    return { status: 'error', message: 'Preencha todos os campos obrigatórios.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'leads',
      data: { name, email, phone, message, source: 'pagina-contato' },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error', message: 'Erro ao enviar. Tente novamente em instantes.' }
  }
}
