import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { LivePreviewClient } from './LivePreviewClient'

type Props = { params: Promise<{ id: string }> }

// Nunca cachear páginas de preview
export const dynamic = 'force-dynamic'

export default async function PostPreviewPage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  // Só usuários autenticados veem rascunhos. O iframe do live preview roda na
  // mesma origem do admin e envia o cookie de sessão, então continua funcionando.
  // Sem isso, qualquer anônimo poderia enumerar /blog/preview/<id> e ler drafts.
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) notFound()

  // Busca por ID incluindo rascunhos (o slug pode ser nulo num rascunho novo).
  const post = await payload
    .findByID({ collection: 'posts', id, depth: 2, draft: true, overrideAccess: true })
    .catch(() => null)

  if (!post) notFound()

  return <LivePreviewClient initialData={post} />
}
