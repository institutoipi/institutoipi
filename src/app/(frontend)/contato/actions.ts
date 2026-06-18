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
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || undefined
  const message = (formData.get('message') as string)?.trim()

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
