import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

/**
 * Healthcheck do container. Inicializa o Payload (o que dispara `prodMigrations`
 * no 1º boot) e faz uma consulta trivial ao Postgres. O Caddy só roteia tráfego
 * quando este endpoint fica saudável → migrations rodam ANTES de servir requests
 * e evita 502 durante o deploy.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    await payload.count({ collection: 'users' })
    return Response.json({ status: 'ok' })
  } catch {
    return new Response('unhealthy', { status: 503 })
  }
}
