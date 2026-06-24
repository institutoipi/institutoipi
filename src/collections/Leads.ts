import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'subject', 'source', 'createdAt'],
    description: 'Contatos recebidos pelo formulário do site.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
    update: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
    delete: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const subjectName = doc.subject
          ? await req.payload
              .findByID({ collection: 'subjects', id: doc.subject, depth: 0 })
              .then((s) => s?.name)
              .catch(() => null)
          : null

        const notifyTo = process.env.LEAD_NOTIFY_TO

        // Email 1: notificação interna (para a equipe do IPI)
        if (notifyTo) {
          void req.payload
            .sendEmail({
              to: notifyTo,
              subject: `Novo contato via site — ${doc.name}`,
              html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a3a5c;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">Novo contato recebido</h1>
  </div>
  <div style="padding:32px;background:#f9f9f9;border:1px solid #e0e0e0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:bold;width:110px;vertical-align:top">Nome</td><td style="padding:8px 0">${doc.name}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">E-mail</td><td style="padding:8px 0"><a href="mailto:${doc.email}">${doc.email}</a></td></tr>
      ${doc.phone ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Telefone</td><td style="padding:8px 0">${doc.phone}</td></tr>` : ''}
      ${subjectName ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Assunto</td><td style="padding:8px 0">${subjectName}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Mensagem</td><td style="padding:8px 0;white-space:pre-wrap">${doc.message}</td></tr>
    </table>
  </div>
  <div style="padding:16px 32px;background:#eef2f7;font-size:12px;color:#666">Instituto IPI</div>
</div>`,
            })
            .catch((err) => {
              req.payload.logger.error(
                `Falha ao enviar notificação do lead ${doc.id}: ${err?.message ?? err}`,
              )
            })
        }

        // Email 2: confirmação para quem enviou o contato
        void req.payload
          .sendEmail({
            to: doc.email,
            subject: 'Recebemos seu contato — Instituto IPI',
            html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a3a5c;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">Instituto de Políticas Internacionais</h1>
  </div>
  <div style="padding:32px;background:#f9f9f9;border:1px solid #e0e0e0">
    <p style="margin:0 0 16px">Olá, <strong>${doc.name}</strong>!</p>
    <p style="margin:0 0 16px">Recebemos sua mensagem e entraremos em contato em breve.</p>
    <p style="margin:0 0 8px;font-size:13px;color:#666">Sua mensagem:</p>
    <blockquote style="margin:0;padding:12px 16px;background:#fff;border-left:3px solid #1a3a5c;font-size:14px;color:#444;white-space:pre-wrap">${doc.message}</blockquote>
  </div>
  <div style="padding:16px 32px;background:#eef2f7;font-size:12px;color:#666">
    IPI — Instituto de Políticas Internacionais · <a href="https://institutoipi.org" style="color:#1a3a5c">institutoipi.org</a>
  </div>
</div>`,
          })
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
