# Instituto IPI

Site institucional + CMS do **Instituto de Políticas Internacionais**. É um **monolito
Next.js 16 + Payload 3.85** — o site público, o painel de administração (`/admin`) e a API
rodam num app só.

## Stack

| Camada | Tecnologia | Dev local | Produção (self-hosted) |
| --- | --- | --- | --- |
| App | Next.js 16 (App Router) + Payload 3.85 | `npm run dev` | Container Docker atrás do Caddy |
| Banco | PostgreSQL | Docker (`docker-compose`) | Postgres (Docker) |
| Mídia | S3-compatível (MinIO) | Docker | MinIO (Docker) |
| Email | SMTP | Mailpit (Docker) | Resend |
| TLS | — | — | Caddy (Let's Encrypt automático) |

## Pré-requisitos

- **Node 22** (ver `.nvmrc` → `nvm use`)
- **npm** (o lockfile é `package-lock.json`)
- **Docker** + Docker Compose

## Rodar localmente

```bash
cp .env.example .env      # os valores de dev já funcionam, não precisa editar
docker compose up -d      # Postgres + MinIO + Mailpit
npm install
npm run migrate           # cria o schema no Postgres
npm run dev               # http://localhost:3000
```

Depois abra **http://localhost:3000/admin** e **crie o primeiro usuário admin**.

| Serviço | URL | Credenciais |
| --- | --- | --- |
| Site | http://localhost:3000 | — |
| Admin | http://localhost:3000/admin | criado no 1º acesso |
| MinIO (console) | http://localhost:9001 | `minioadmin` / `minioadmin123` |
| Mailpit | http://localhost:8025 | — |

## Variáveis de ambiente

Copie `.env.example` → `.env`. Em produção, o `.env` fica em `/opt/institutoipi/.env` no
servidor (ver `.env.example` para a lista completa e os valores de prod).

| Variável | Para quê |
| --- | --- |
| `PAYLOAD_SECRET` | Assina tokens/sessões (`openssl rand -hex 32`) |
| `PAYLOAD_PUBLIC_URL` / `SITE_URL` | URL pública (serverURL/CORS/CSRF) |
| `APP_DOMAIN` | Domínio que o Caddy expõe com TLS (só prod) |
| `DATABASE_URL` | Postgres (em prod o compose deriva de `POSTGRES_*`) |
| `POSTGRES_*` | Credenciais do Postgres |
| `MINIO_*` | Storage de mídia (endpoint/credenciais/bucket) |
| `EMAIL_SMTP_*`, `EMAIL_FROM`, `LEAD_NOTIFY_TO` | Envio de email (dev: Mailpit; prod: Resend) |
| `UPLOADTHING_TOKEN` | *(opcional)* usa UploadThing em vez de MinIO se setado |

## Deploy em produção (self-hosted, Docker — sem k8s)

**Build no GitHub Actions → imagem no `ghcr.io` → deploy por SSH no servidor.** No servidor,
o `docker-compose.prod.yml` sobe: **`caddy`** (TLS) → **`app`** → **`postgres`** + **`minio`**.

### Setup (uma vez)
1. **Servidor** com Docker. Criar `/opt/institutoipi/.env` (baseado na seção PRODUÇÃO do
   `.env.example`). **Não** setar `UPLOADTHING_TOKEN` → usa o MinIO local.
2. **Secrets no GitHub** (Settings → Secrets → Actions):
   - `SSH_HOST`, `SSH_USER`, `SSH_KEY` — acesso SSH de deploy ao servidor.
   - `GHCR_PAT` — PAT (classic) com `read:packages`, p/ o servidor puxar a imagem do GHCR.
3. **DNS** do domínio (`APP_DOMAIN`) → IP do servidor. O Caddy emite o certificado sozinho.

### A cada deploy
`git push` na `main` dispara `.github/workflows/workflow.yml`, que:
buildar a imagem → push pro `ghcr.io/institutoipi/institutoipi` → copiar
`docker-compose.prod.yml` + `Caddyfile` pro servidor → `docker compose pull app && up -d`.

As **migrations rodam no boot** do container (`prodMigrations` no `payload.config.ts`) — é 1
instância, sem corrida. O primeiro acesso a `/admin` cria o admin.

## Migrations

Fonte única do schema (sem `push` do Drizzle):

```bash
npm run migrate:create    # gera uma migration a partir do schema atual
npm run migrate           # aplica as pendentes (dev)
```

Em produção aplicam **no boot** do container. Use **Node 22** (o loader `tsx` do `migrate`
quebra em Node 26+).

## Como funciona

- **Storage de mídia** (`src/payload.config.ts`): `MINIO_ENDPOINT` → MinIO/S3;
  `UPLOADTHING_TOKEN` → UploadThing; nenhum → disco local.
- **Mídia atrás do domínio**: a URL é `/media/<hash>.<ext>` no próprio domínio — um rewrite
  no `next.config.ts` manda `/media/*` para a rota de arquivos do Payload, que faz stream do
  storage (o bucket MinIO pode ficar privado). Nomes são hash do conteúdo → `Cache-Control:
  immutable`.
- **Coleções**: `Users` (auth/admin), `Media` (uploads), `Categories`, `Subjects`, `Posts`
  (drafts/preview), `Leads` (formulário de contato → email).

## Scripts

| Script | Faz |
| --- | --- |
| `npm run dev` | Dev server (HMR) |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build |
| `npm run migrate` / `migrate:create` | Aplica / gera migrations |
| `npm run generate:types` | Regenera `payload-types.ts` |
| `npm run generate:importmap` | Regenera o importMap do admin |
| `npm run lint` | ESLint |
| `npm test` | Testes (Vitest + Playwright) |

## Estrutura

```
src/
  app/(frontend)/   → site público
  app/(payload)/    → admin + API do Payload
  collections/      → Users, Media, Categories, Subjects, Posts, Leads
  migrations/       → schema (fonte da verdade)
  components/, lib/ → UI e helpers do site
  payload.config.ts → configuração central
Dockerfile             → imagem de produção (Next standalone)
docker-compose.prod.yml → stack do servidor (caddy + app + postgres + minio)
Caddyfile              → reverse proxy + TLS
```
