# Instituto IPI — Auditoria técnica (sumário executivo)

Análise apurada do projeto por 4 perspectivas (arquitetura, backend, frontend/performance, UI/UX),
feita por subagentes read-only varrendo todo o código. Este é o índice; os detalhes estão nos
documentos por área.

- [01 — Segurança](01-seguranca.md)
- [02 — Arquitetura & Infra](02-arquitetura-infra.md)
- [03 — Backend & Dados](03-backend-dados.md)
- [04 — Frontend & Performance](04-frontend-performance.md)
- [05 — UI/UX & Acessibilidade](05-ui-ux-acessibilidade.md)

Stack: monolito **Next.js 16 + Payload 3.85** (Postgres), self-hosted em Docker (Caddy + app +
Postgres + MinIO) num servidor de **1 vCPU / 3.8 GB**. Deploy: `git push` → GitHub Actions → SSH →
`git pull` → `docker compose up --build` (build **no** servidor).

## Diagnóstico geral

A base é **sólida e bem pensada** — drafts+preview, migrations como fonte do schema, mídia atrás do
domínio, SEO (sitemap/robots/JSON-LD), fontes self-hosted, skip-link e a11y básica. Os problemas são
**pontuais** e de alto retorno. Dois temas se repetem:

1. **Infra de cache construída e depois desligada.** Os hooks já chamam `revalidatePath`, mas todas as
   rotas usam `force-dynamic` → o cache nunca existe e todo request bate no Postgres. É o maior
   gargalo no 1 vCPU e some só removendo o `force-dynamic`.
2. **Access control incompleto em pontos críticos.** A rota de preview vaza rascunhos publicamente e a
   coleção Users não tem `access` — um autor pode deletar admins.

## Top prioridades (ordem sugerida)

### 🔴 Fase 0 — Críticos (fazer já)
| # | Item | Impacto |
|---|------|---------|
| 0.1 | Preview de rascunho **público** (`blog/preview/[id]`) | Vazamento de conteúdo não publicado — **vivo em prod** |
| 0.2 | Coleção **Users sem access control** | Autor pode listar e-mails, criar e deletar admins |
| 0.3 | **Segredos reais** no `prod.env` (expostos) | Rotacionar Resend/UploadThing/Neon; `PAYLOAD_SECRET` forte |
| 0.4 | Build no servidor com heap 8 GB em 3.8 GB | Risco de OOM no deploy |

### 🟠 Fase 1 — Alto retorno (perf & robustez)
- Remover `force-dynamic` → **ISR** (blog/contato). Maior ganho de performance.
- Leads: honeypot + rate-limit + **escape de HTML** nos e-mails.
- Deploy: healthcheck no app + Caddy `service_healthy`; migrations em passo dedicado.
- CI (lint/tsc/testes) como gate; consertar e2e stale.
- Observabilidade: `mem_limit`, log rotation, uptime monitor.
- `imageSizes`/`mimeTypes`/`filesize` na coleção Media.

### 🟡 Fase 2 — Qualidade & manutenção
LCP/CLS das imagens, dedup de query com `cache()`, helpers de acesso centralizados, slug único,
esquema `status` dual, e-mails fora da transação, testes reais.

### 🎨 Fase 3 — UI/UX & acessibilidade
Páginas 404/erro/loading do site, feedback acessível no form, contraste WCAG AA, UX do editor
(sidebar/grupos/descrições), estado vazio do blog, menu mobile.

## Roadmap enxuto

- **Sprint 0 (horas):** Fase 0 — 0.1 e 0.2 são poucas linhas; 0.3 e 0.4 são operacionais.
- **Sprint 1 (1–2 dias):** ISR + Leads + healthcheck/CI + Media imageSizes.
- **Sprint 2 (2–3 dias):** Fase 2 + Fase 3 (qualidade e UX).

Nenhum item exige reescrita ou over-engineering. O maior retorno vem de **parar de desligar o cache**
e **fechar os buracos de access control**.
