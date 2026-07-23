# 04 — Frontend & Performance

Next.js 16 (App Router) + React 19 + Tailwind v4. Foco: o custo do `force-dynamic` no servidor de 1 vCPU.

## Achado central

O projeto **construiu a infra de ISR on-demand e depois a desativou**. Os hooks `afterChange`/`afterDelete`
chamam `revalidateBlog` → `revalidatePath('/blog')` / `('/blog/[slug]')` (`src/lib/revalidate.ts`,
`Posts.ts:193-214`, `Categories.ts:53-59`). Mas **todas** as rotas de dados usam
`export const dynamic = 'force-dynamic'` → esses `revalidatePath` viram **código morto** e cada request
renderiza do zero batendo no Postgres. **A correção de maior retorno é simplesmente remover o `force-dynamic`.**

## 🔴 Alto

### F1. Estratégia de renderização & cache
| Rota | Atual | Recomendação |
|---|---|---|
| `blog/page.tsx:13` | `force-dynamic` | Remover. Estático + ISR on-demand (hooks já revalidam `/blog`). Opcional `export const revalidate = 3600` de rede de segurança. |
| `blog/[slug]/page.tsx:39` | `force-dynamic` | Remover + adicionar `generateStaticParams` (posts publicados). Vira ISR; hooks revalidam por slug. |
| `contato/page.tsx:13` | `force-dynamic` | Trocar por `export const revalidate = 3600` (só lê `subjects`, mudam raro). Form já é client component isolado. |
| `blog/preview/[id]` | `force-dynamic` | **Manter** (preview nunca cacheia). |
| `page.tsx` (home) | estático | **Manter**. |

Efeito: `/blog` e cada post passam a servir HTML de cache (ms) e o DB só é tocado quando um editor
publica/edita. **Bônus:** `blog/page.tsx:18-24` usa `depth:2, limit:50` sem `select` — reduzir para
`depth:1` + `select` dos campos usados (title, slug, excerpt, publishedAt, cover, category).

### F2. Imagens
- **Capas via `<img>` cru** (`blog/page.tsx:64,80`, `PostView.tsx:70`, `RichText.tsx:78`) — sem
  `srcset`/formato/otimização.
- **`Media.ts` sem `imageSizes`** → guarda só o original; capa de 2000px é streamada full-res pelo Node em
  todo card do grid. **Correção:** definir `imageSizes` (ex.: `thumbnail` 320w, `card` 640w, `cover`
  1280w) — resize offline no upload; servir a size apropriada com `<img srcset>` ou `next/image`. (Ver
  [03 B3](03-backend-dados.md).) Preferir geração no upload a `/_next/image` on-request no 1 vCPU.
- **LCP do post não priorizado:** a capa (`PostView.tsx:70`) é o LCP provável — adicionar
  `fetchPriority="high"` / `loading="eager"` (e `priority` se migrar pra `next/image`).
- **CLS:** grid e capa do post já têm wrapper `aspect-video` (ok). **Imagens inline do corpo**
  (`RichText.tsx:78`) estão sem width/height → risco real de CLS. O node lexical `upload` fornece
  `value.width/height` (ampliar o type em `RichText.tsx:13` e passá-los).
- `next.config.ts:27-35`: `localPatterns`/`remotePatterns` já cobrem `/media/**` — pronto p/ `next/image`.

## 🟠 Médio

### F3. SEO & metadata
- **2 hits no DB por post:** `generateMetadata` (`blog/[slug]/page.tsx:10-37`) e a página (`:41-56`) fazem
  `payload.find` separados. Envolver num helper com React `cache()` para deduplicar na mesma request.
- **OG do post incompleto** (`blog/[slug]/page.tsx:30-35`): só `type`/`images`. Setar `openGraph.title/
  description/url` por post.
- **JSON-LD BlogPosting** (`PostView.tsx:23-40`): adicionar `mainEntityOfPage` e `author.url`.
- Bom no geral: `metadataBase`, template de title, `sitemap.ts`, `robots.ts`, canonicals, `lang="pt-BR"`.

### F4. Core Web Vitals — `<a>` vs `<Link>` (perde prefetch)
- `SiteHeader.tsx:35` usa `<a href="/blog">` (full reload). Trocar por `<Link>`.
- `SiteFooter.tsx:94` (`colInstituto`) usa `<a>` enquanto `:108` (`colParticipe`) usa `<Link>` —
  inconsistente. Links internos (`/blog`, `/contato`) → `<Link>`. Âncoras de hash (`/#sobre`) podem seguir `<a>`.
- INP e bundle estão bons: `RichText.tsx` é **server component** (não manda o parser lexical pro cliente);
  só Header, ContactForm e LivePreviewClient são `'use client'`, todos justificados.

## 🟢 Baixo

### F5. Polimento
- **Fontes:** `layout.tsx:8-20` usa `next/font/google` (self-hosted, `display:swap`, `variable`) — ótimo.
  Revisar pesos carregados (Manrope 400-800, Space Grotesk 3 pesos); cortar os não usados.
- **Duplicação:** normalização de post (`cover typeof === 'object' ? ...`) repetida em `blog/page.tsx:43-53`,
  `blog/[slug]/page.tsx:24`, `PostView.tsx:12-21` → extrair `normalizePost()` em `src/lib`.
- **Navegação:** `nav`/`colInstituto`/`colParticipe` declaradas separadas em Header/Footer com sobreposição
  → fonte única em `src/lib`.
- `contato/page.tsx:28` engole erro (`catch { subjects = [] }`) — degrada gracioso, mas logar ajudaria.
