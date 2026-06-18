import type { CollectionConfig, Where } from 'payload'
import { slugify } from '../lib/slugify'
import { revalidateBlog } from '../lib/revalidate'

type UserWithRole = { id: number; role?: string } | null

function isAdminOrEditor(user: UserWithRole): boolean {
  return user?.role === 'admin' || user?.role === 'editor'
}

function ownNonPublished(userId: number): Where {
  return { and: [{ author: { equals: userId } }, { _status: { not_equals: 'published' } }] }
}

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
    // Botão "Abrir" — abre o post publicado em nova aba
    preview: (doc) => {
      const base = process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000'
      return `${base}/blog/${doc.slug}`
    },
    // Iframe de live preview ao lado do editor
    livePreview: {
      url: ({ data, req }) => {
        const base = req.payload.config.serverURL || 'http://localhost:3000'
        return `${base}/blog/preview/${data.slug}`
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } } satisfies Where
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false
      const u = user as UserWithRole
      if (isAdminOrEditor(u)) return true
      return ownNonPublished(u!.id)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      const u = user as UserWithRole
      if (isAdminOrEditor(u)) return true
      return ownNonPublished(u!.id)
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
      admin: {
        description: 'Resumo exibido na listagem (160–200 chars).',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
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
      admin: {
        description: 'Meta description (até 160 chars).',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.title && !data.slug) {
          data.slug = slugify(data.title as string)
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, req, operation }) => {
        const user = req.user as UserWithRole

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
