# 05 — UI/UX & Acessibilidade

Site institucional (tema escuro monocromático azul-ONU). **Base boa:** skip-link, `lang="pt-BR"`,
`aria-hidden` em ícones, `alt` obrigatório em Media, hierarquia de h1 correta, `focus-visible`,
`prefers-reduced-motion`, RichText rebaixa h1→h2. As sugestões **preservam a identidade visual** — são
ajustes pontuais.

## 🔴 Alto

### U1. Não existem páginas 404 / erro / loading do site público
- **Local:** `src/app/(frontend)/` (faltam `not-found.tsx`, `error.tsx`, `loading.tsx`)
- **Problema:** `/blog/slug-inexistente` (`blog/[slug]/page.tsx:53` chama `notFound()`) cai no **404
  padrão do Next** — página branca, sem header/footer, em inglês. Ruim pra credibilidade. Sem `error.tsx`,
  falha de DB mostra a tela genérica; sem `loading.tsx`, não há skeleton.
- **Correção:** criar `(frontend)/not-found.tsx` (header/footer, tom da marca, CTA "Voltar ao início" /
  "Ver nossos textos"), `error.tsx` (mensagem pt-BR + "tentar novamente") e `loading.tsx` (skeleton dos
  cards / do post).

### U2. Form de contato não anuncia feedback para leitores de tela
- **Local:** `src/app/(frontend)/contato/ContactForm.tsx:28-45`
- **Problema:** sucesso (l.28-37) e erro (l.41-45) são `<p>` estáticos, sem `role="alert"`/`aria-live` e
  sem mover foco. Usuário de leitor de tela não sabe se deu certo; no mobile o erro pode ficar fora da
  viewport.
- **Correção:** `role="alert"` no erro (announce automático); no sucesso, mover foco pro heading do card
  (`tabIndex={-1}` + `.focus()`), ou região `aria-live="polite"`.

### U3. Contraste abaixo do WCAG AA
- **Local:** `page.tsx:271` (`text-soft/70`), `ContactForm.tsx:19` (`placeholder:text-soft/50`)
- **Problema:** `text-soft/70` nas siglas dos departamentos (`text-[11px]`) → ~4,2:1 (< 4,5). Placeholders
  `text-soft/50` sobre `surface-2` → ~2,7:1 (muito baixo, e trazem exemplos de formato). `text-soft`
  cheio no corpo está OK.
- **Correção:** siglas → `text-soft` (sem /70); placeholders → mín. `text-soft/70`; considerar 11–12px nos
  micro-rótulos (ex.: `blog/page.tsx:92`, `text-[10px]`).

## 🟠 Médio

### U4. Sem anti-spam no lead + e-mail sem escape
Ver [01 — Segurança S4/S5](01-seguranca.md). (UX: honeypot é invisível pro usuário real; e-mail
malformado por HTML não escapado passa péssima impressão.)

### U5. UX do editor no admin
- **Local:** `src/collections/Posts.ts`
- **Dupla publicação confusa:** botão nativo "Publish" (`_status`) *e* campo `status` (l.117-129) na mesma
  tela → fonte de erro. Documentar via `admin.description` ("Use 'Em revisão' para enviar ao editor; a
  publicação é pelo botão Publicar") ou esconder um caminho.
- **Campos sem ajuda:** `content` (l.95-97), `cover` (l.99-102), `category` (l.104-107) sem
  `admin.description`. Orientar proporção da capa (16:9) e alt.
- **Validação prometida mas não aplicada:** `excerpt` diz "160–200 chars" e `seoDescription` "até 160"
  sem `maxLength`/contador. Adicionar `maxLength`.
- **Sem sidebar:** mover `status/publishedAt/category/cover/slug` e SEO para `admin.position: 'sidebar'`
  (como no slug do usuário) — foca o editor em título+conteúdo.
- **Sem agrupamento:** nenhuma coleção usa `admin.group`. Agrupar (ex.: "Conteúdo": Posts/Categories/
  Media; "Site": Subjects/Leads; "Equipe": Users).

### U6. Estado vazio do blog é cru
- **Local:** `blog/page.tsx:38-39` (`<p>Nenhum post publicado ainda.</p>`)
- **Problema:** site recém-lançado mostra uma linha solta — parece quebrado.
- **Correção:** empty-state com ícone/ilustração, título ("Em breve, nossos primeiros textos") e CTA
  (Instagram/YouTube ou contato).

### U7. Imagens sem dimensões/lazy
Ver [04 — Frontend F2](04-frontend-performance.md#imagens). No grid do blog, adicionar `loading="lazy"` +
`decoding="async"`; usar `next/image`/`imageSizes`.

## 🟢 Baixo / polimento

- **U8. Menu mobile** (`SiteHeader.tsx:49-78`): `Escape` não fecha, foco não entra no menu, sem focus-trap;
  retorno de foco ao botão ao fechar. Adicionar `useEffect` de `Escape`.
- **U9. `aria-current`:** nenhum link marca a página atual (`SiteHeader`/`SiteFooter`) — adicionar no item
  ativo (orientação + estilo "ativo").
- **U10. CTAs "Faça parte"/"Seja parceiro"** (`page.tsx:351-374`) caem no mesmo form sem contexto. Passar
  `?assunto=parceria`/`?assunto=voluntario`, pré-selecionar o `select` e gravar `source` granular
  (`actions.ts:53` hoje fixa `'pagina-contato'`).
- **U11. Home não mostra posts** (`page.tsx:380-400` é só CTA). Exibir os 3 posts recentes daria prova de
  atividade (NUPPA). Decisão editorial.
- **U12. Microcopy:** sucesso do form sem próximo passo ("Enviar outra" / redes); `Media.alt` sem
  `admin.description` explicando o propósito (editores tendem a preencher com o nome do arquivo);
  `phone` `required` no form/action mas sem `required` em `Leads.ts:92` (inconsistência de schema).
