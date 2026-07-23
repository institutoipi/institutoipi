# 03 — Backend & Dados

Modelo de dados (coleções), hooks/lógica de negócio, migrations e qualidade do código backend.

## 🟠 Médio

### B1. Esquema dual `status` (custom) vs `_status` (drafts nativo)
- **Local:** `src/collections/Posts.ts` (campo `status` + `beforeChange`), `src/migrations/20260618_043950_drafts.ts`
- **Problema:** solução engenhosa (enumName `enum_posts_editorial_status`, sync no `beforeChange`) mas
  frágil: dois campos mantidos em sincronia manual; `review` não tem par em `_status` (vira `draft`); o
  campo `status` é editável livre no admin, podendo conflitar com o botão nativo "Publish". Superfície de
  bug e manutenção.
- **Correção:** avaliar colapsar num conceito — usar só `_status` nativo (draft/published) + um estado
  `review` separado, **ou** tornar `status` read-only/derivado na UI. Cobrir os invariantes com testes.

### B2. Slugs gerados sem tratamento de colisão
- **Local:** `src/lib/slugify.ts` usado em `Users.ts`, `Categories.ts`, `Posts.ts` (beforeValidate)
- **Problema:** slug vem de `slugify(nome/título)` e o campo é `unique`. Dois títulos/nomes iguais →
  **violação de constraint unique** como erro cru pro usuário. Slug de Users/Categories só gera no
  `create` (renomear não atualiza — pode ser intencional, mas sem sufixo de unicidade).
- **Correção:** função `uniqueSlug()` que checa existência e adiciona sufixo (`-2`, `-3`), reutilizável
  nas 3 coleções.

### B3. Media sem restrição de tipo/tamanho nem variantes responsivas
- **Local:** `src/collections/Media.ts`
- **Problema:** `upload` não define `mimeTypes`, `filesize` máximo, nem `imageSizes`. Qualquer autenticado
  sobe qualquer arquivo de qualquer tamanho; o site serve sempre o **original em resolução cheia** (sem
  thumbnails) — streamado pelo Node no 1 vCPU.
- **Correção:** `upload: { mimeTypes: ['image/*'], filesize: <limite>, imageSizes: [...], formatOptions
  (webp), adminThumbnail }`. O sharp roda uma vez no upload (offline). Ver também
  [04 — Frontend](04-frontend-performance.md#imagens).

### B4. E-mails fire-and-forget dentro do `afterChange`
- **Local:** `src/collections/Leads.ts` (`void req.payload.sendEmail(...)`)
- **Problema:** envios `void` (não aguardados) rodam dentro da transação do `afterChange`; se a transação
  der rollback depois, o e-mail já foi. O `findByID` do subject **não recebe `req`** → lê fora da
  transação (ok por ser leitura, mas inconsistente).
- **Correção:** passar `req` nas operações aninhadas; mover o envio para pós-commit confiável (ou aceitar
  e documentar o trade-off). Extrair templates para `src/lib/email.ts` (com `escapeHtml`, ver
  [01 — Segurança S5](01-seguranca.md)).

## 🟢 Baixo

### B5. Helpers de access control duplicados / casts `as any`
- **Local:** `Posts.ts`, `Categories.ts`, `Subjects.ts`, `Leads.ts`, `Media.ts`, `Users.ts`; `payload.config.ts` (`sharp as any`)
- **Problema:** `isAdminOrEditor` e o cast `user as { role?: string }` / `UserWithRole` reimplementados
  em 5+ arquivos. O tipo gerado `User` (`src/payload-types.ts`) já tipa `role` e deveria ser usado.
- **Correção:** centralizar em `src/lib/access.ts` — `isAdmin`, `isAdminOrEditor`, `isAuthenticated`,
  `ownNonPublished`, tipados com `User`. Elimina os casts.

### B6. Testes são stubs e um está quebrado
- **Local:** `tests/`
- **Problema:** `tests/e2e/frontend.e2e.spec.ts` ainda espera título "Payload Blank Template" e heading
  "Welcome to your new project." → **vai falhar**. `tests/int/api.int.spec.ts` só faz um `find` e checa
  `toBeDefined()` (cobertura nula). Sem testes de access control, sync de status, slug, lead.
- **Correção:** consertar/remover o teste stale; adicionar integração para: anônimo não lê draft (S1),
  autor não deleta users (S2), geração de slug, sync de status.

### B7. Bootstrap do primeiro admin com race condition
- **Local:** `src/collections/Users.ts:11-14`
- **Problema:** `count()` + `if (totalDocs === 0) role='admin'` não é atômico; dois signups simultâneos
  poderiam ambos virar admin. Risco baixíssimo (evento único de setup).

### B8. Leads sem metadados de origem
- **Local:** `src/collections/Leads.ts`
- **Problema:** não armazena IP/user-agent (úteis pra triagem de spam/auditoria); `source` é fixo
  `'pagina-contato'`.
- **Correção:** capturar IP/UA na server action; `source` granular por CTA (ver [05 UI/UX](05-ui-ux-acessibilidade.md)).

### B9. Migration inicial — verificar integridade do `up`/`down`
- **Local:** `src/migrations/20260618_042013_initial.ts`
- **Nota:** confirmar que o `up` está íntegro (parecia truncado num bloco) e que toda migration tem `down`
  testado. `add_subjects` down tem um `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` (resíduo do gerador,
  inócuo). A estratégia geral (migrations como fonte única, `push: false`) está correta.
