import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Extrai hostname e porta do MINIO_PUBLIC_URL para remotePatterns
const minioRemotePattern = (() => {
  const raw = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000'
  try {
    const url = new URL(raw)
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: '/**',
    }
  } catch {
    return { protocol: 'http' as const, hostname: 'localhost', port: '9000', pathname: '/**' }
  }
})()

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    localPatterns: [
      { pathname: '/media/**' },
      { pathname: '/api/media/file/**' },
      { pathname: '/*.png' },
      { pathname: '/*.ico' },
    ],
    remotePatterns: [minioRemotePattern],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // Mídia atrás do domínio: /media/<arquivo> → rota de arquivos do Payload,
  // que faz stream do storage (UploadThing em prod). O Cache-Control vem do
  // `modifyResponseHeaders` da coleção Media (nomes são hash → imutável).
  async rewrites() {
    return [{ source: '/media/:filename*', destination: '/api/media/file/:filename*' }]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
