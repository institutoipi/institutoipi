'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { PostView, type PostData } from '@/components/blog/PostView'

const serverURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export function LivePreviewClient({ initialData }: { initialData: PostData }) {
  const { data } = useLivePreview<PostData>({
    initialData,
    serverURL,
    depth: 2,
  })

  return <PostView post={data} isPreview />
}
