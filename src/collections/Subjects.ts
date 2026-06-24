import type { CollectionConfig } from 'payload'

function isAdminOrEditor(user: { role?: string } | null): boolean {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  labels: {
    singular: 'Assunto',
    plural: 'Assuntos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'active'],
    description: 'Assuntos exibidos no select do formulário de contato.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
    update: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
    delete: ({ req: { user } }) => isAdminOrEditor(user as { role?: string } | null),
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Assunto',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Ordem',
      admin: { description: 'Ordem de exibição (menor aparece primeiro).' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Ativo',
      admin: { description: 'Desmarque para ocultar do formulário sem apagar.' },
    },
  ],
}