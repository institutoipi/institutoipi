import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import path from 'path'
import { authenticated, adminOrEditor } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: adminOrEditor,
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
      admin: {
        description: 'Descreva a imagem para leitores de tela e SEO (não use o nome do arquivo).',
      },
    },
  ],
  upload: {
    // Só imagens — evita upload de arquivos arbitrários (PDF, etc.).
    mimeTypes: ['image/*'],
    // Nome do arquivo é hash do conteúdo → seguro cachear "para sempre".
    // Vale para a resposta servida pela rota do Payload (/api/media/file/…,
    // atrás de /media/… via rewrite), que faz stream do storage.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
      return headers
    },
  },
}
