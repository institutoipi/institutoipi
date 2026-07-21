'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Post } from '@/payload-types'
import { PostView } from '@/components/blog/PostView'

export function LivePreviewClient({ initialData }: { initialData: Post }) {
  // O iframe de preview roda na mesma origem do admin, então a origem da própria
  // janela é sempre a correta para validar os postMessages do live preview.
  // Evita depender de NEXT_PUBLIC_PAYLOAD_URL (que precisaria ser inlinado no build).
  const serverURL = typeof window !== 'undefined' ? window.location.origin : ''

  const { data } = useLivePreview<Post>({
    initialData,
    serverURL,
    depth: 2,
  })

  return <PostView post={data} isPreview />
}
