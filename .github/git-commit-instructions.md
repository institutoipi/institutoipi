# Convenções de Commit

Siga rigorosamente o formato **Conventional Commits** para mensagens de commit. Use a estrutura abaixo:

```
<tipo>(<escopo>): <gitmoji> <Descrição>

[corpo opcional]
```

## Diretrizes Obrigatórias

### 1. Tipo e Escopo
Escolha um tipo apropriado e escopo opcional para descrever o módulo ou funcionalidade afetada:

**Tipos permitidos:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `test` - Adição ou correção de testes
- `refactor` - Refatoração de código
- `docs` - Alterações na documentação
- `style` - Formatação, espaços em branco
- `chore` - Tarefas de manutenção, dependências

**Exemplos de escopo:** `auth`, `payment`, `api`, `database`, `config`

### 2. Gitmoji
Inclua um gitmoji relevante que melhor represente a natureza da mudança:

**Desenvolvimento:**
- ✨ `:sparkles:` - Introduzir novas funcionalidades
- 🐛 `:bug:` - Corrigir um bug
- 🚑️ `:ambulance:` - Hotfix crítico
- 🔥 `:fire:` - Remover código ou arquivos
- 🚧 `:construction:` - Trabalho em progresso
- 💡 `:bulb:` - Adicionar ou atualizar comentários no código

**Qualidade de Código:**
- 🎨 `:art:` - Melhorar estrutura/formato do código
- ♻️ `:recycle:` - Refatorar código
- ⚡️ `:zap:` - Melhorar performance
- 🩹 `:adhesive_bandage:` - Correção simples para problema não-crítico
- ⚰️ `:coffin:` - Remover código morto
- 💩 `:poop:` - Código ruim que precisa ser melhorado

**Testes:**
- ✅ `:white_check_mark:` - Adicionar, atualizar ou passar testes
- 🧪 `:test_tube:` - Adicionar teste que falha
- 🤡 `:clown_face:` - Mockar coisas
- 📸 `:camera_flash:` - Adicionar ou atualizar snapshots

**Documentação:**
- 📝 `:memo:` - Adicionar ou atualizar documentação
- 💬 `:speech_balloon:` - Adicionar ou atualizar textos e literais
- ✏️ `:pencil2:` - Corrigir typos

**Configuração e CI/CD:**
- 🔧 `:wrench:` - Adicionar ou atualizar arquivos de configuração
- 🔨 `:hammer:` - Adicionar ou atualizar scripts de desenvolvimento
- 👷 `:construction_worker:` - Adicionar ou atualizar sistema de build CI
- 💚 `:green_heart:` - Corrigir build CI
- 📌 `:pushpin:` - Fixar dependências em versões específicas
- ⬆️ `:arrow_up:` - Atualizar dependências
- ⬇️ `:arrow_down:` - Fazer downgrade de dependências
- ➕ `:heavy_plus_sign:` - Adicionar dependência
- ➖ `:heavy_minus_sign:` - Remover dependência

**Segurança:**
- 🔒️ `:lock:` - Corrigir problemas de segurança ou privacidade
- 🔐 `:closed_lock_with_key:` - Adicionar ou atualizar secrets
- 🛂 `:passport_control:` - Trabalhar em autorização e permissões
- 🦺 `:safety_vest:` - Adicionar ou atualizar código de validação

**UI/UX:**
- 💄 `:lipstick:` - Adicionar ou atualizar UI e arquivos de estilo
- 🚸 `:children_crossing:` - Melhorar experiência/usabilidade do usuário
- ♿️ `:wheelchair:` - Melhorar acessibilidade
- 💫 `:dizzy:` - Adicionar ou atualizar animações e transições
- 📱 `:iphone:` - Trabalhar em design responsivo
- 🍱 `:bento:` - Adicionar ou atualizar assets

**Database:**
- 🗃️ `:card_file_box:` - Realizar mudanças relacionadas a banco de dados
- 🌱 `:seedling:` - Adicionar ou atualizar arquivos seed

**Deploy e Releases:**
- 🚀 `:rocket:` - Deploy
- 🔖 `:bookmark:` - Release / Tags de versão
- 📦️ `:package:` - Adicionar ou atualizar arquivos compilados ou pacotes

**Arquitetura:**
- 🏗️ `:building_construction:` - Fazer mudanças arquiteturais
- 🧱 `:bricks:` - Mudanças relacionadas à infraestrutura
- 🧑‍💻 `:technologist:` - Melhorar experiência do desenvolvedor

**Logs e Monitoramento:**
- 🔊 `:loud_sound:` - Adicionar ou atualizar logs
- 🔇 `:mute:` - Remover logs
- 📈 `:chart_with_upwards_trend:` - Adicionar ou atualizar analytics
- 🩺 `:stethoscope:` - Adicionar ou atualizar healthcheck
- 🥅 `:goal_net:` - Capturar erros

**Controle de Versão:**
- ⏪️ `:rewind:` - Reverter mudanças
- 🔀 `:twisted_rightwards_arrows:` - Merge de branches
- 🙈 `:see_no_evil:` - Adicionar ou atualizar .gitignore

**Outros:**
- 🎉 `:tada:` - Começar um projeto
- 🚨 `:rotating_light:` - Corrigir avisos do compiler/linter
- 👽️ `:alien:` - Atualizar código devido a mudanças de API externa
- 🚚 `:truck:` - Mover ou renomear recursos
- 💥 `:boom:` - Introduzir breaking changes
- 📄 `:page_facing_up:` - Adicionar ou atualizar licença
- 👥 `:busts_in_silhouette:` - Adicionar ou atualizar contribuidor(es)
- 🥚 `:egg:` - Adicionar ou atualizar easter egg
- ⚗️ `:alembic:` - Realizar experimentos
- 🔍️ `:mag:` - Melhorar SEO
- 🏷️ `:label:` - Adicionar ou atualizar tipos
- 🚩 `:triangular_flag_on_post:` - Adicionar, atualizar ou remover feature flags
- 🗑️ `:wastebasket:` - Depreciar código que precisa de limpeza
- 🧐 `:monocle_face:` - Exploração/inspeção de dados
- 👔 `:necktie:` - Adicionar ou atualizar lógica de negócio
- 💸 `:money_with_wings:` - Adicionar patrocínios ou infraestrutura monetária
- 🧵 `:thread:` - Adicionar ou atualizar código multithreading
- 🌐 `:globe_with_meridians:` - Internacionalização e localização
- ✈️ `:airplane:` - Melhorar suporte offline
- 🍻 `:beers:` - Escrever código bêbado

📚 [Referência](https://gitmoji.dev/)

### 3. Descrição
- **Idioma:** Português brasileiro (pt-BR)
- **Capitalização:** Sempre inicie com letra maiúscula
- **Modo:** Imperativo ("Adicionar" não "Adicionado")
- **Tamanho:** Máximo 50 caracteres (sem contar gitmoji)
- **Referências:** Use crases ao referenciar código ou termos específicos

### 4. Corpo (Opcional)
Para detalhes adicionais, use uma seção de corpo bem estruturada:
- Máximo 72 caracteres por linha
- Use marcadores (`-`) para clareza
- Descreva motivação, contexto ou detalhes técnicos
- Explique o "porquê" da mudança, não apenas o "o quê"

## Exemplos

### Exemplo 1: Nova Funcionalidade
```bash
feat(auth): ✨ Implementar login com OAuth2

- Adicionar provider Google OAuth
- Criar middleware de autenticação
- Implementar refresh token
```

### Exemplo 2: Correção de Bug
```bash
fix(payment): 🐛 Corrigir validação de cartão de crédito

- Adicionar regex para validação de formato
- Melhorar mensagens de erro
- Adicionar testes unitários para casos extremos
```

### Exemplo 3: Testes
```bash
test(payments): ✅ Adicionar testes de snapshot para endpoints

- Criar testes de snapshot para payments
- Adicionar testes para cancellations e refunds
- Configurar fixtures compartilhados
```

### Exemplo 4: Refatoração
```bash
refactor(customer): ♻️ Simplificar lógica de criação de cliente

- Remover código duplicado
- Extrair validações para métodos separados
- Melhorar legibilidade do fluxo principal
```

## Boas Práticas

### ✅ Fazer
- Commits atômicos (uma mudança lógica por commit)
- Mensagens claras e descritivas
- Testar antes de commitar
- Adicionar arquivos específicos (`git add <arquivo>`)
- Incluir contexto no corpo quando necessário

### ❌ Evitar
- `git add .` (adicionar tudo indiscriminadamente)
- Commits muito grandes com múltiplas mudanças não relacionadas
- Mensagens vagas ("fix", "update", "changes")
- Commitar arquivos de configuração local (`.claude/`, `.env`)
- Mencionar "IA", "Claude", "assistente" nos commits

## Referências
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Git Commit Best Practices](https://chris.beams.io/posts/git-commit/)
- [Gitmoji](https://gitmoji.dev/)

---

As mensagens de commit devem ser claras, curtas, informativas e profissionais, auxiliando na legibilidade e rastreamento do projeto.