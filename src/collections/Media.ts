import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => {
      const role = (user as { role?: string } | null)?.role
      return role === 'admin' || role === 'editor'
    },
  },
  hooks: {
    // Armazena o arquivo com um hash do conteúdo em vez do nome original
    // (evita espaços/acentos na URL e não vaza o nome do arquivo enviado).
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const ext = path.extname(req.file.name).toLowerCase()
          const hash = crypto.createHash('sha256').update(req.file.data).digest('hex').slice(0, 32)
          req.file.name = `${hash}${ext}`
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Nome do arquivo é hash do conteúdo → seguro cachear "para sempre".
    // Vale para a resposta servida pela rota do Payload (/api/media/file/…,
    // atrás de /media/… via rewrite), que faz stream do storage.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
      return headers
    },
  },
}
