import type { CollectionConfig } from 'payload'
import { uniqueSlug } from '../lib/uniqueSlug'
import { adminOnly, adminOrSelf, adminFieldOnly } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Equipe',
  },
  auth: true,
  access: {
    // Admin gerencia todos; usuário comum lê/edita só a si mesmo. Criar/deletar
    // usuário é só de admin (o cadastro do 1º admin é exceção do próprio Payload).
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) data.role = 'admin'

          if (!data.slug && data.name) {
            data.slug = await uniqueSlug(req.payload, 'users', data.name as string)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome completo',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      label: 'Perfil',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'author' },
      ],
      access: {
        update: adminFieldOnly,
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Gerado automaticamente do nome.',
        position: 'sidebar',
      },
    },
  ],
}
