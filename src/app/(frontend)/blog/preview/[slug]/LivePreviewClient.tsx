'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Post } from '@/payload-types'
import { PostView } from '@/components/blog/PostView'

const serverURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export function LivePreviewClient({ initialData }: { initialData: Post }) {
  const { data } = useLivePreview<Post>({
    initialData,
    serverURL,
    depth: 2,
  })

  return <PostView post={data} isPreview />
}
