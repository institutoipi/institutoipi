import type { CollectionConfig } from 'payload'
import { uniqueSlug } from '../lib/uniqueSlug'
import { adminOrEditor } from '../lib/access'
import { revalidateBlog } from '../lib/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
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
      async ({ data, req, operation }) => {
        if (operation === 'create' && data?.name && !data.slug) {
          data.slug = await uniqueSlug(req.payload, 'categories', data.name)
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
