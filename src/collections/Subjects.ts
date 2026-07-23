import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../lib/access'

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
    group: 'Site',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
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