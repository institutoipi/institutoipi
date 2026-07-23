# 02 — Arquitetura & Infra

Deploy self-hosted (Docker): Caddy (TLS) → app (Next standalone) → Postgres + MinIO. Servidor 1 vCPU /
3.8 GB. Deploy por `git push` → GitHub Actions → SSH → `git pull` → `docker compose up --build` (build
**no** servidor).

> Nota: **backup foi conscientemente descartado** (os dados não são críticos). Não consta neste backlog.

## 🔴 Alto

### I1. Build no servidor pode estourar memória (OOM)
- **Local:** `package.json:8` (`--max-old-space-size=8000`), `Dockerfile`, `.github/workflows/workflow.yml`
- **Problema:** o build Next roda **no servidor** com heap de 8 GB, mas a máquina tem 3.8 GB. Com 1 vCPU
  o build compete com o app em produção durante o deploy. Há swap de 4 GB (segura), mas não é ideal.
- **Correção (uma das duas):**
  - Reduzir `--max-old-space-size` para ~3000 e manter o build no servidor (mais simples), **ou**
  - Voltar a buildar em **GitHub Actions** e publicar no **GHCR**; servidor só faz `docker pull` (elimina
    build no host, downtime e risco de OOM). Trade-off: precisa de registry + auth.

## 🟠 Médio

### I2. Deploy com downtime (single container, rebuild in-place)
- **Local:** `.github/workflows/workflow.yml` (`docker compose up -d --build`), `docker-compose.prod.yml`
- **Problema:** um único container `app` sem healthcheck; `--build` recria o container → janela de
  indisponibilidade a cada deploy. Caddy tem `depends_on: app` **sem `condition: service_healthy`** →
  pode rotear pro app ainda não pronto (502 nos primeiros segundos).
- **Correção:** criar rota `/api/health` (ou usar `/admin`), adicionar `healthcheck` no serviço `app` e
  `depends_on: app: { condition: service_healthy }` no Caddy. Ideal: build em CI + subir novo container
  saudável antes de derrubar o velho.

### I3. Migrations rodam na 1ª request, não no boot
- **Local:** `src/payload.config.ts` (`prodMigrations: migrations`)
- **Problema:** `prodMigrations` executa na primeira inicialização do Payload (1ª request), não no boot.
  Cold start lento; se a migration falhar, a 1ª request dá erro; requests concorrentes no arranque
  correm contra a migration.
- **Correção:** rodar `payload migrate` num passo dedicado antes de servir (init container no compose ou
  entrypoint que roda `payload migrate` e só então `node server.js`). Manter `prodMigrations` como rede
  de segurança. ⚠️ A imagem standalone **não** inclui o CLI do Payload — para um entrypoint com
  `payload migrate` seria preciso incluir os arquivos necessários, ou usar um init container com a
  imagem de build.

### I4. Sem CI (lint / typecheck / testes) antes do deploy
- **Local:** `.github/workflows/workflow.yml`
- **Problema:** `push` em `main` = deploy direto, sem `eslint`, `tsc --noEmit`, `vitest`, `playwright`.
  Código quebrado vai a produção e só falha no build do servidor.
- **Correção:** job de CI (lint + `tsc` + testes) como **gate** antes do job de deploy (needs:).

### I5. Observabilidade / limites de recurso / logs
- **Local:** `docker-compose.prod.yml`
- **Problema:** sem healthcheck no `app` (Docker não reinicia app travado que não caiu); sem `mem_limit`
  (um pico pode derrubar a máquina de 3.8 GB inteira); sem log rotation (logs do Docker crescem sem
  limite); sem monitoramento/alerta.
- **Correção:** `mem_limit`/reservations por serviço; `logging` com `max-size`/`max-file`; healthcheck no
  app; um uptime monitor externo (ex.: UptimeRobot) e alerta de disco.

## 🟢 Baixo

### I6. Mídia servida via Node (sem cache de borda)
- **Local:** `next.config.ts` (rewrite `/media` → `/api/media/file`), `src/collections/Media.ts`
- **Problema:** todo request de imagem faz stream pelo processo Node (bucket privado). `Cache-Control:
  immutable` ajuda no cliente, mas não há cache de borda — com tráfego, satura a CPU.
- **Correção:** cache no Caddy para `/media/*` (`header Cache-Control` + cache local), ou tornar o bucket
  público e servir direto do MinIO/CDN (nomes já são hash de conteúdo → seguro cachear pra sempre).
