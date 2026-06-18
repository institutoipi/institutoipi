import type { CollectionConfig, Where } from 'payload'
import { slugify } from '../lib/slugify'
import { revalidateBlog } from '../lib/revalidate'

type UserWithRole = { id: number; role?: string } | null

function isAdminOrEditor(user: UserWithRole): boolean {
  return user?.role === 'admin' || user?.role === 'editor'
}

function ownNonPublished(userId: number): Where {
  return { and: [{ author: { equals: userId } }, { status: { not_in: ['published'] } }] }
}

export const Posts: CollectionConfig = {
  slug: 'posts',
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
      return { status: { equals: 'published' } } satisfies Where
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

        if (user && !isAdminOrEditor(user) && data.status === 'published') {
          throw new Error('Autores não podem publicar posts. Envie para revisão.')
        }

        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        const wasPublished = previousDoc?.status === 'published'
        const isPublished = doc?.status === 'published'
        if (wasPublished || isPublished) {
          revalidateBlog(
            `post:${doc.slug} (${previousDoc?.status ?? 'novo'} → ${doc.status})`,
            doc.slug,
            req.payload,
          )
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (doc?.status === 'published') {
          revalidateBlog(`post deletado:${doc.slug}`, doc.slug, req.payload)
        }
        return doc
      },
    ],
  },
}
