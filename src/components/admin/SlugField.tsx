'use client'

import { TextInput, useField, useFormFields } from '@payloadcms/ui'
import { useEffect } from 'react'
import { slugify } from '@/lib/slugify'

export function SlugField({ path }: { path: string }) {
  const { value: slug, setValue } = useField<string>({ path })

  const title = useFormFields(([fields]) => fields['title']?.value as string | undefined)
  const status = useFormFields(([fields]) => fields['status']?.value as string | undefined)

  const isPublished = status === 'published'

  // Gera o slug automaticamente quando o título muda (só se ainda não publicado)
  useEffect(() => {
    if (title && !isPublished) {
      setValue(slugify(title))
    }
  }, [title]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TextInput
      path={path}
      value={slug ?? ''}
      onChange={(e) => {
        if (!isPublished) setValue(e.target.value)
      }}
      readOnly={isPublished}
      label="Slug"
      required
      description={
        isPublished
          ? 'Slug travado — o post está publicado.'
          : 'URL do post. Gerado do título; estável após publicação.'
      }
    />
  )
}
