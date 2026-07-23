import type { CollectionConfig, Where } from 'payload'
import type { User } from '@/payload-types'
import { uniqueSlug } from '../lib/uniqueSlug'
import { isAdminOrEditor, ownNonPublished } from '../lib/access'
import { revalidateBlog } from '../lib/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  // Drafts + autosave: cria o rascunho ao começar a editar, liberando o preview
  // já na criação. O `status` custom segue como fonte de verdade (ver beforeChange
  // que sincroniza o `_status` nativo a partir dele).
  versions: {
    drafts: {
      autosave: { interval: 800 },
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'category', 'publishedAt'],
    group: 'Conteúdo',
    // Botão "Preview" — abre o post publicado em nova aba. Só faz sentido quando
    // publicado (a página pública dá 404 em rascunho); retornar null esconde o botão.
    // Para rascunhos use o "Open in new window" do live preview (/blog/preview/...).
    preview: (doc) => {
      if (doc._status !== 'published') return null
      const base = process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000'
      return `${base}/blog/${doc.slug}`
    },
    // Iframe de live preview ao lado do editor. URL RELATIVA (resolve contra a
    // origem do admin — localhost em dev, domínio em prod) e por ID (sempre
    // existe; o slug pode ser nulo num rascunho recém-criado sem título).
    livePreview: {
      url: ({ data }) => `/blog/preview/${data.id}`,
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } } satisfies Where
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      const u = user as User | null
      if (!u) return false
      if (isAdminOrEditor(u)) return true
      return ownNonPublished(u.id)
    },
    delete: ({ req: { user } }) => {
      const u = user as User | null
      if (!u) return false
      if (isAdminOrEditor(u)) return true
      return ownNonPublished(u.id)
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: {
        // Bloqueia alteração via API quando publicado (exceto admins)
        update: ({ req: { user }, doc }) => {
          if ((user as { role?: string } | null)?.role === 'admin') return true
          return doc?.status !== 'published'
        },
      },
      admin: {
        components: {
          Field: '/components/admin/SlugField#SlugField',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Resumo exibido na listagem (160–200 caracteres).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Corpo do texto. Imagens inline aparecem no site e no preview.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Capa em 16:9. Aparece na listagem e no topo do post.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Preenchido automaticamente. Editável só por administradores.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description:
          'Use "Em revisão" para enviar ao editor. A publicação efetiva é feita pelo botão "Publicar".',
      },
      // enumName próprio para não colidir com o `_status` nativo dos drafts
      // (ambos derivariam `enum_posts_status` e o `review` seria perdido).
      enumName: 'enum_posts_editorial_status',
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Em revisão', value: 'review' },
        { label: 'Publicado', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Preenchido automaticamente ao publicar.',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'Título SEO (deixe vazio para usar o título do post).',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      maxLength: 160,
      admin: {
        description: 'Meta description (até 160 caracteres).',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        // Gera o slug ÚNICO sempre que estiver vazio e houver título (qualquer op).
        // Com drafts/autosave o post nasce sem título; ao digitar, o próximo autosave
        // preenche o slug. `uniqueSlug` evita colisão de títulos iguais.
        if (data && !data.slug && data.title) {
          data.slug = await uniqueSlug(req.payload, 'posts', data.title as string)
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, req, operation }) => {
        const user = req.user as User | null

        if (operation === 'create' && user && !data.author) {
          data.author = user.id
        }

        // Publicado se QUALQUER um dos dois disser: o botão nativo "Publish"
        // (_status) ou o campo editorial `status`. Mantém os dois sincronizados
        // para que a visibilidade no site nunca divirja do que o admin mostra.
        const isPublished = data._status === 'published' || data.status === 'published'

        if (isPublished && user && !isAdminOrEditor(user)) {
          throw new Error('Autores não podem publicar posts. Envie para revisão.')
        }

        if (isPublished && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        data._status = isPublished ? 'published' : 'draft'
        data.status = isPublished ? 'published' : data.status === 'review' ? 'review' : 'draft'

        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        const wasPublished = previousDoc?._status === 'published'
        const isPublished = doc?._status === 'published'
        if (wasPublished || isPublished) {
          revalidateBlog(
            `post:${doc.slug} (${previousDoc?._status ?? 'novo'} → ${doc._status})`,
            doc.slug,
            req.payload,
          )
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (doc?._status === 'published') {
          revalidateBlog(`post deletado:${doc.slug}`, doc.slug, req.payload)
        }
        return doc
      },
    ],
  },
}
