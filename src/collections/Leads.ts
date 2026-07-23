import type { CollectionConfig } from 'payload'
import { adminOnly } from '../lib/access'
import { leadNotifyEmail, leadConfirmEmail } from '../lib/email'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'subject', 'source', 'createdAt'],
    description: 'Contatos recebidos pelo formulário do site.',
    group: 'Site',
  },
  access: {
    // A criação vem da server action (Local API, overrideAccess) — o endpoint
    // REST público fica fechado para evitar spam direto na API.
    create: () => false,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const subjectName = doc.subject
          ? await req.payload
              .findByID({ collection: 'subjects', id: doc.subject, depth: 0, req })
              .then((s) => s?.name)
              .catch(() => null)
          : null

        const notifyTo = process.env.LEAD_NOTIFY_TO

        // Email 1: notificação interna (templates com escape em src/lib/email.ts)
        if (notifyTo) {
          void req.payload
            .sendEmail({
              to: notifyTo,
              ...leadNotifyEmail({
                name: doc.name,
                email: doc.email,
                phone: doc.phone,
                subjectName,
                message: doc.message,
              }),
            })
            .catch((err) => {
              req.payload.logger.error(
                `Falha ao enviar notificação do lead ${doc.id}: ${err?.message ?? err}`,
              )
            })
        }

        // Email 2: confirmação para quem enviou o contato
        void req.payload
          .sendEmail({ to: doc.email, ...leadConfirmEmail({ name: doc.name, message: doc.message }) })
          .catch((err) => {
            req.payload.logger.error(
              `Falha ao enviar confirmação ao lead ${doc.id}: ${err?.message ?? err}`,
            )
          })
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nome' },
    { name: 'email', type: 'email', required: true, label: 'E-mail' },
    { name: 'phone', type: 'text', label: 'Telefone' },
    { name: 'subject', type: 'relationship', relationTo: 'subjects', label: 'Assunto' },
    { name: 'message', type: 'textarea', required: true, label: 'Mensagem' },
    {
      name: 'source',
      type: 'text',
      label: 'Origem',
      admin: { description: 'Página ou campanha de onde o contato veio.' },
    },
  ],
}
