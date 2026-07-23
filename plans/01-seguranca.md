# 01 — Segurança

Achados de segurança priorizados. Cada item: problema, local, correção.

## 🔴 Alto

### S1. Rota de preview de rascunho é pública (vazamento de conteúdo)
- **Local:** `src/app/(frontend)/blog/preview/[id]/page.tsx:18`
- **Problema:** `findByID({ collection: 'posts', id, draft: true, overrideAccess: true })` **sem
  verificação de autenticação**. Qualquer anônimo pode enumerar `/blog/preview/1`, `/2`… e ler
  rascunhos/revisões (conteúdo, autor, mídia). Ao trocar `[slug]`→`[id]`, a enumeração ficou trivial.
  Está **vivo em produção**.
- **Correção:** autenticar antes do fetch —
  ```ts
  import { headers } from 'next/headers'
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) notFound()
  ```
  Só então usar `overrideAccess`. O iframe do live preview (mesma origem, com cookie do admin)
  continua funcionando. Alternativa: `draftMode()` do Next com token assinado.
- **Verificação:** `curl https://institutoipi.org/blog/preview/1` anônimo → 404; logado no admin, o
  live preview abre normalmente.

### S2. Coleção Users sem access control
- **Local:** `src/collections/Users.ts` (sem bloco `access`)
- **Problema:** só o **campo** `role` tem `access.update` de admin. A coleção usa o default
  (`Boolean(user)`) → qualquer autenticado (inclusive `author`) pode **listar todos os usuários**
  (e-mails), **criar** contas e **deletar outros usuários, incluindo admins**. Escalar o próprio role
  está bloqueado, mas apagar admins não.
- **Correção:** adicionar `access` na coleção:
  - `create`/`delete`: só admin.
  - `read`/`update`: admin **OU** o próprio (`{ id: { equals: user.id } }`).
- **Verificação:** logar como `author` → `DELETE /api/users/<admin>` negado; `GET /api/users` retorna
  só a si mesmo.

### S3. Segredos de produção reais no `prod.env`
- **Local:** `prod.env` (gitignored — confirmado não rastreado)
- **Problema:** contém segredos vivos em claro (senha do Neon, `UPLOADTHING_TOKEN`, `EMAIL_SMTP_PASSWORD`
  do Resend `re_...`) e **foram expostos no chat de trabalho** → devem ser **rotacionados**. Ainda:
  - `PAYLOAD_SECRET=370e193ab6bceddd4a40820a` tem ~96 bits (fraco).
  - O arquivo aponta pra **Neon + UploadThing** (stack antiga da Vercel), divergindo do `.env` real do
    servidor (Postgres + MinIO) → confusão.
- **Correção:** rotacionar as 3 chaves nos painéis; gerar `PAYLOAD_SECRET` com `openssl rand -hex 32`;
  atualizar/limpar o `prod.env` pra refletir a stack self-host (ou apagá-lo do repo local).

## 🟠 Médio

### S4. Formulário de Leads sem anti-spam / rate limiting
- **Local:** `src/collections/Leads.ts:11` (`create: () => true`), `src/app/(frontend)/contato/actions.ts`
- **Problema:** `create: () => true` expõe também `POST /api/leads`. A server action usa a Local API
  (`payload.create`), que **ignora o rate limiter REST** do Payload. Sem honeypot/captcha/throttle.
  Cada submit dispara **2 e-mails** → atacante estoura a cota do Resend, inunda `LEAD_NOTIFY_TO` e polui
  a tabela `leads`.
- **Correção:** honeypot oculto (validado na action) + rate-limit por IP + opcional Turnstile/hCaptcha.

### S5. HTML injection nos e-mails do lead
- **Local:** `src/collections/Leads.ts` (~linhas 40–95, templates HTML)
- **Problema:** `doc.name`, `doc.email`, `doc.message`, `subjectName` são interpolados **crus** no HTML.
  Permite injetar HTML/links no e-mail interno (`LEAD_NOTIFY_TO`) e no de confirmação (que vai pro
  endereço informado pelo atacante) → phishing/relay usando seu domínio.
- **Correção:** `escapeHtml()` em todas as variáveis antes de interpolar; considerar não enviar
  confirmação sem verificação do e-mail. Extrair templates para `src/lib/email.ts`.

## 🟢 Baixo

### S6. CORS/CSRF inclui `localhost:3000` em produção
- **Local:** `src/payload.config.ts:22-26` (`siteOrigins`)
- **Correção:** condicionar `http://localhost:3000` ao ambiente de dev (`NODE_ENV !== 'production'`).

### S7. Sem security headers / proteção de borda no Caddy
- **Local:** `Caddyfile`
- **Problema:** só `reverse_proxy`. Sem HSTS explícito, CSP, X-Frame-Options; sem rate-limit ou
  allowlist para `/admin`. Verificar que o GraphQL playground
  (`src/app/(payload)/api/graphql-playground/route.ts`) está desabilitado em prod.
- **Correção:** bloco `header` no Caddyfile (HSTS, X-Content-Type-Options, X-Frame-Options, CSP básica);
  considerar proteger `/admin` por IP/basic-auth adicional.
