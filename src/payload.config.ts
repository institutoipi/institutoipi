import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Subjects } from './collections/Subjects'
import { Users } from './collections/Users'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteOrigins = [
  process.env.PAYLOAD_PUBLIC_URL,
  process.env.SITE_URL || 'https://institutoipi.org',
  'http://localhost:3000',
].filter(Boolean) as string[]

const minioProtocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'
const minioEndpointUrl = `${minioProtocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`
const minioBucket = process.env.MINIO_BUCKET || 'institutoipi-media'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      icons: [{ url: '/favicon.ico' }],
      titleSuffix: '— Instituto IPI',
    },
    components: {
      graphics: {
        Icon: '/components/admin/Icon#AdminIcon',
        Logo: '/components/admin/Logo#AdminLogo',
      },
      providers: ['/components/admin/PreviewToolbarStyles#PreviewToolbarStyles'],
      logout: {
        Button: '/components/admin/NavFooter#NavFooter',
      },
    },
  },
  cors: siteOrigins,
  csrf: siteOrigins,
  collections: [Users, Media, Categories, Posts, Subjects, Leads],
  editor: lexicalEditor(),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM || 'contato@institutoipi.org',
    defaultFromName: 'Instituto IPI',
    skipVerify: true,
    transportOptions: {
      host: process.env.EMAIL_SMTP_HOST,
      port: Number(process.env.EMAIL_SMTP_PORT || 1025),
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth:
        process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASSWORD
          ? {
              user: process.env.EMAIL_SMTP_USER,
              pass: process.env.EMAIL_SMTP_PASSWORD,
            }
          : undefined,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Migrations são a fonte única do schema (dev e prod) — sem drizzle `push`,
    // que diverge das migrations. Mudou o schema? Gere uma migration:
    //   npm run migrate:create   →   npm run migrate
    push: false,
    // Self-hosted (1 container): roda as migrations pendentes no boot.
    prodMigrations: migrations,
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharp: sharp as any,
  plugins: [
    // Storage da coleção `media`:
    //   - UploadThing quando UPLOADTHING_TOKEN está setado.
    //   - MinIO (S3) quando MINIO_ENDPOINT está setado (prod self-hosted + dev).
    //   - Nenhum dos dois: disco local (default do Payload).
    // Em ambos os casos a URL é /media/<arquivo>, servida pela rota do Payload.
    ...(process.env.UPLOADTHING_TOKEN
      ? [
          uploadthingStorage({
            collections: {
              media: {
                // Emite a URL no nosso domínio (ex.: /media/<hash>.<ext>) em vez da
                // CDN do UploadThing. O arquivo é servido pela rota do Payload
                // (/api/media/file/<arquivo>), para onde o rewrite do next.config
                // aponta; o Payload faz stream do UploadThing por baixo.
                generateFileURL: ({ filename }) => `/media/${filename}`,
              },
            },
            options: {
              token: process.env.UPLOADTHING_TOKEN,
              acl: 'public-read',
            },
          }),
        ]
      : process.env.MINIO_ENDPOINT
        ? [
            s3Storage({
              collections: {
                media: {
                  // Mídia atrás do domínio; o MinIO é acessado só pelo servidor
                  // (stream via rota do Payload), o bucket pode ser privado.
                  generateFileURL: ({ filename: file }) => `/media/${file}`,
                },
              },
              bucket: minioBucket,
              config: {
                endpoint: minioEndpointUrl,
                region: 'us-east-1',
                credentials: {
                  accessKeyId: process.env.MINIO_ROOT_USER || '',
                  secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
                },
                forcePathStyle: true,
              },
            }),
          ]
        : []),
  ],
})
