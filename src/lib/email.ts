/**
 * Templates de e-mail dos leads. Todas as variáveis vindas do usuário são
 * escapadas (evita HTML injection / e-mail malformado).
 */

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  )
}

type LeadData = {
  name: string
  email: string
  phone?: string | null
  subjectName?: string | null
  message: string
}

/** E-mail 1: notificação interna para a equipe. */
export function leadNotifyEmail(lead: LeadData): { subject: string; html: string } {
  const name = escapeHtml(lead.name)
  const email = escapeHtml(lead.email)
  const phone = lead.phone ? escapeHtml(lead.phone) : ''
  const subjectName = lead.subjectName ? escapeHtml(lead.subjectName) : ''
  const message = escapeHtml(lead.message)

  return {
    subject: `Novo contato via site — ${name}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a3a5c;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">Novo contato recebido</h1>
  </div>
  <div style="padding:32px;background:#f9f9f9;border:1px solid #e0e0e0">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:bold;width:110px;vertical-align:top">Nome</td><td style="padding:8px 0">${name}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">E-mail</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Telefone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
      ${subjectName ? `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Assunto</td><td style="padding:8px 0">${subjectName}</td></tr>` : ''}
      <tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">Mensagem</td><td style="padding:8px 0;white-space:pre-wrap">${message}</td></tr>
    </table>
  </div>
  <div style="padding:16px 32px;background:#eef2f7;font-size:12px;color:#666">Instituto IPI</div>
</div>`,
  }
}

/** E-mail 2: confirmação para quem enviou o contato. */
export function leadConfirmEmail(lead: Pick<LeadData, 'name' | 'message'>): {
  subject: string
  html: string
} {
  const name = escapeHtml(lead.name)
  const message = escapeHtml(lead.message)

  return {
    subject: 'Recebemos seu contato — Instituto IPI',
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <div style="background:#1a3a5c;padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">Instituto de Políticas Internacionais</h1>
  </div>
  <div style="padding:32px;background:#f9f9f9;border:1px solid #e0e0e0">
    <p style="margin:0 0 16px">Olá, <strong>${name}</strong>!</p>
    <p style="margin:0 0 16px">Recebemos sua mensagem e entraremos em contato em breve.</p>
    <p style="margin:0 0 8px;font-size:13px;color:#666">Sua mensagem:</p>
    <blockquote style="margin:0;padding:12px 16px;background:#fff;border-left:3px solid #1a3a5c;font-size:14px;color:#444;white-space:pre-wrap">${message}</blockquote>
  </div>
  <div style="padding:16px 32px;background:#eef2f7;font-size:12px;color:#666">
    IPI — Instituto de Políticas Internacionais · <a href="https://institutoipi.org" style="color:#1a3a5c">institutoipi.org</a>
  </div>
</div>`,
  }
}
