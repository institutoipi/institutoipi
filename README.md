# Instituto IPI

Site institucional + CMS do **Instituto de Políticas Internacionais**. É um **monolito
Next.js 16 + Payload 3.85** — o site público, o painel de administração (`/admin`) e a API
rodam num app só.

## Stack

| Camada | Tecnologia                             | Dev local                 | Produção    |
|--------|----------------------------------------|---------------------------|-------------|
| App    | Next.js 16 (App Router) + Payload 3.85 | `npm run dev`             | Vercel      |
| Banco  | PostgreSQL                             | Docker (`docker-compose`) | Neon        |
| Mídia  | S3-compatível                          | MinIO (Docker)            | UploadThing |
| Email  | SMTP                                   | Mailpit (Docker)          | Resend      |

A escolha de storage/email é **automática por variável de ambiente** — não precisa mudar
código entre dev e prod (ver [Como funciona](#como-funciona)).

## Pré-requisitos

- **Node 22** (ver `.nvmrc` → `nvm use`)
- **npm** (o lockfile é `package-lock.json`)
- **Docker** + Docker Compose (sobe Postgres/MinIO/Mailpit locais)

## Rodar localmente

```bash
cp .env.example .env      # os valores de dev já funcionam, não precisa editar
docker compose up -d      # Postgres + MinIO + Mailpit
npm install
npm run migrate           # cria o schema no Postgres
npm run dev               # http://localhost:3000
```

Depois abra **http://localhost:3000/admin** e **crie o primeiro usuário admin** (a primeira
vez o Payload mostra a tela de cadastro).

Serviços locais que sobem com o `docker compose`:

| Serviço                   | URL                         | Credenciais                    |
|---------------------------|-----------------------------|--------------------------------|
| Site                      | http://localhost:3000       | —                              |
| Admin                     | http://localhost:3000/admin | criado no 1º acesso            |
| MinIO (console)           | http://localhost:9001       | `minioadmin` / `minioadmin123` |
| Mailpit (emails de teste) | http://localhost:8025       | —                              |

## Variáveis de ambiente

Copie `.env.example` → `.env`. Em produção, os **mesmos nomes** recebem os valores dos
serviços gerenciados (setados no painel da Vercel).

| Variável                     | Para quê                         | Dev                     | Produção                            |
|------------------------------|----------------------------------|-------------------------|-------------------------------------|
| `PAYLOAD_SECRET`             | Assina tokens/sessões            | qualquer string         | `openssl rand -hex 32`              |
| `DATABASE_URL`               | Postgres                         | docker-compose          | Neon (connection string **direct**) |
| `PAYLOAD_PUBLIC_URL`         | URL pública (serverURL/CORS)     | `http://localhost:3000` | `https://institutoipi.org`          |
| `SITE_URL`                   | Origem pública (CORS/CSRF)       | `http://localhost:3000` | `https://institutoipi.org`          |
| `UPLOADTHING_TOKEN`          | Storage de mídia (**prod**)      | — (usa MinIO)           | token V7 do UploadThing             |
| `MINIO_*`                    | Storage de mídia (**dev**)       | docker-compose          | — (usa UploadThing)                 |
| `EMAIL_SMTP_*`, `EMAIL_FROM` | Envio de email                   | Mailpit                 | Resend                              |
| `LEAD_NOTIFY_TO`             | Destino das notificações de lead | seu email               | email do instituto                  |

## Deploy em produção (Vercel + Neon + UploadThing + Resend)

Tudo em free tier, sem cartão. Passo a passo:

1. **Neon** (Postgres) — crie um projeto e copie a connection string (use a **direct**, não
   a *pooled*, para o `migrate` do build funcionar).
2. **UploadThing** (mídia) — crie uma app e copie o **token V7** (API Keys). 2GB grátis.
3. **Resend** (email) — crie a conta, verifique o domínio de envio e gere uma **API key**.
4. **Vercel** — importe o repo do GitHub e cole as variáveis (Settings → Environment
   Variables):

   ```
   PAYLOAD_SECRET=<openssl rand -hex 32>
   PAYLOAD_PUBLIC_URL=https://institutoipi.org
   SITE_URL=https://institutoipi.org
   DATABASE_URL=<Neon direct>
   UPLOADTHING_TOKEN=<token V7>
   EMAIL_FROM=contato@institutoipi.org
   EMAIL_SMTP_HOST=smtp.resend.com
   EMAIL_SMTP_PORT=465
   EMAIL_SMTP_SECURE=true
   EMAIL_SMTP_USER=resend
   EMAIL_SMTP_PASSWORD=<Resend API key>
   LEAD_NOTIFY_TO=contato@institutoipi.org
   ```

   O `vercel.json` já roda as **migrations no build** (`npm run migrate && npm run build`) —
   não precisa configurar build command.
5. Aponte o **DNS** do domínio para a Vercel.
6. Abra `https://<seu-domínio>/admin` e **crie o primeiro admin**.

> Trocar de provedor? Só mexer nas envs: sem `UPLOADTHING_TOKEN` mas com `MINIO_ENDPOINT`,
> o app usa qualquer storage S3-compatível (R2, Supabase, MinIO self-hosted, etc.).

## Migrations

As migrations são a **fonte única do schema** (sem `push` do Drizzle).

```bash
npm run migrate:create    # gera uma migration a partir do schema atual
npm run migrate           # aplica as pendentes
```

- Em **produção** rodam no build da Vercel (`vercel.json`), não no boot.
- Use **Node 22** — o loader `tsx` usado pelo `migrate` quebra em Node 26+.

## Como funciona

- **Storage de mídia** (`src/payload.config.ts`): `UPLOADTHING_TOKEN` presente → UploadThing;
  senão `MINIO_ENDPOINT` presente → S3/MinIO; senão disco local.
- **Mídia atrás do domínio**: em prod a URL é `/media/<hash>.<ext>` no próprio domínio — um
  rewrite no `next.config.ts` manda `/media/*` para a rota de arquivos do Payload, que faz
  stream do storage. Nomes são hash do conteúdo → `Cache-Control: immutable`.
- **Coleções**: `Users` (auth/admin), `Media` (uploads), `Categories`, `Subjects`, `Posts`
  (com drafts/preview), `Leads` (formulário de contato → email).

## Scripts

| Script                               | Faz                           |
|--------------------------------------|-------------------------------|
| `npm run dev`                        | Dev server (HMR)              |
| `npm run build`                      | Build de produção             |
| `npm start`                          | Sobe o build                  |
| `npm run migrate` / `migrate:create` | Aplica / gera migrations      |
| `npm run generate:types`             | Regenera `payload-types.ts`   |
| `npm run generate:importmap`         | Regenera o importMap do admin |
| `npm run lint`                       | ESLint                        |
| `npm test`                           | Testes (Vitest + Playwright)  |

## Estrutura

```
src/
  app/(frontend)/   → site público
  app/(payload)/    → admin + API do Payload
  collections/      → Users, Media, Categories, Subjects, Posts, Leads
  migrations/       → schema (fonte da verdade)
  components/, lib/ → UI e helpers do site
  payload.config.ts → configuração central
```