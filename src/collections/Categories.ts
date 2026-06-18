import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { revalidateBlog } from '../lib/revalidate'

function isAdminOrEditor(user: { role?: string } | null): boolean {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
    update: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
    delete: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Gerado automaticamente do nome.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.name && !data.slug) {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, req }) => {
        revalidateBlog(`categoria:${doc.slug}`, undefined, req.payload)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        revalidateBlog(`categoria deletada:${doc.slug}`, undefined, req.payload)
        return doc
      },
    ],
  },
}
