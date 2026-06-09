# Documentação do Banco de Dados — Santuário SJ

**Banco:** MySQL  
**ORM (CMS):** Drizzle ORM  
**Acesso (landing page):** direto ao banco MySQL

---

## Visão Geral das Tabelas

| Tabela | Finalidade |
|---|---|
| `missas` | Horários e programação das missas |
| `agenda` | Eventos e celebrações do calendário |
| `noticias` | Notícias e comunicados da paróquia |
| `sacramentos` | Informações sobre cada sacramento |
| `bencao_dia` | Bênçãos diárias exibidas na landing page |
| `episcopal` | Membros da equipe episcopal (bispo, reitor, etc.) |
| `grupos` | Grupos e movimentos paroquiais |
| `hero` | Textos do banner principal da landing page |
| `hero_slides` | Imagens do carrossel do banner principal |
| `users` | Usuários do CMS (não expor na landing page) |
| `sessions` | Sessões autenticadas do CMS (não expor na landing page) |
| `audit_log` | Log de auditoria do CMS (não expor na landing page) |

---

## Tabelas de Conteúdo

### `missas`

Cada linha representa um grupo de missas de um determinado dia/período.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `dia` | `VARCHAR(120)` | sim | Ex.: `"Domingo"`, `"Segunda-feira"` |
| `destaque` | `BOOLEAN` | sim (default false) | Se deve ser destacado na UI |
| `icone` | `VARCHAR(60)` | sim | Nome do ícone (ex.: `"church"`) |
| `horarios` | `JSON` | sim | Array de horários — ver estrutura abaixo |
| `programacao_semanal` | `JSON` | não | Array de strings com programação semanal |
| `observacao` | `TEXT` | não | Texto livre de observação |

**Estrutura de `horarios`:**
```json
[
  { "hora": "08:00", "desc": "Missa Dominical" },
  { "hora": "10:00", "desc": "Missa das Famílias" }
]
```

**Estrutura de `programacao_semanal`:**
```json
["Segunda: Terço das 19h", "Quarta: Missa votiva de N. Sra."]
```

---

### `agenda`

Eventos e celebrações do calendário litúrgico.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `dia` | `INT` | sim | Dia do mês (1–31) |
| `mes` | `VARCHAR(10)` | sim | Nome abreviado do mês, ex.: `"JAN"`, `"FEV"` |
| `titulo` | `VARCHAR(255)` | sim | Título do evento |
| `hora` | `VARCHAR(30)` | sim | Horário, ex.: `"19h00"` |
| `local` | `VARCHAR(255)` | sim | Local do evento |
| `tipo` | `VARCHAR(20)` | sim | Enum: `festivo`, `liturgico`, `padroeiro` |

---

### `noticias`

Notícias e comunicados exibidos na landing page.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `titulo` | `VARCHAR(255)` | sim | Título da notícia |
| `categoria` | `VARCHAR(120)` | sim | Ex.: `"Comunicado"`, `"Evento"` |
| `data` | `VARCHAR(60)` | sim | Data formatada como string, ex.: `"12 de março de 2025"` |
| `conteudo` | `TEXT` | sim | Corpo da notícia |
| `imagem` | `VARCHAR(500)` | sim | URL da imagem de capa |
| `destaque` | `BOOLEAN` | sim (default false) | Se deve aparecer em destaque |

---

### `sacramentos`

Informações completas sobre cada sacramento oferecido pelo santuário.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `nome` | `VARCHAR(160)` | sim | Nome do sacramento, ex.: `"Batismo"` |
| `versiculo` | `TEXT` | sim | Descrição curta / versículo exibido sob o nome |
| `descricao_italico` | `BOOLEAN` | sim (default false) | Se a descrição curta (`versiculo`) é exibida em itálico |
| `descricao_longa` | `TEXT` | sim | Descrição completa |
| `requisitos` | `JSON` | sim | Lista de requisitos — ver estrutura abaixo |
| `informacoes` | `TEXT` | sim | Texto introdutório sobre como agendar / informações de agendamento |
| `agendamento_contato` | `VARCHAR(255)` | não | Contato para agendamento (telefone, email, etc.) |

**Estrutura de `requisitos`:**
```json
["Ser batizado", "Participar do curso de preparação", "Certidão de nascimento"]
```

> **Nota — metadados de apresentação derivados no código:**
> Esta tabela **não** armazena `slug`, `href`, `cta` nem `icone`. Esses valores
> são derivados na landing page ([lib/data.ts](../lib/data.ts), `SACRAMENTO_META`),
> indexados pela coluna `ordem`:
>
> | `ordem` | `slug` | `icone` | `cta` |
> | --- | --- | --- | --- |
> | 0 | `baptism` | `Droplets` | Agendar |
> | 1 | `confirmation` | `Wind` | Saiba mais |
> | 2 | `eucharist` | `Wheat` | Saiba mais |
> | 3 | `confession` | `ShieldCheck` | Ver horários |
> | 4 | `matrimony` | `Heart` | Agendar |
> | 5 | `anointing-of-the-sick` | `HeartPulse` | Solicitar |
> | 6 | `holy-orders` | `Cross` | Saiba mais |
>
> O `href` é montado como `/sacramentos/{slug}`. Como o mapeamento depende de
> `ordem`, **a ordem dos sete sacramentos deve permanecer estável** no CMS.

---

### `bencao_dia`

Bênçãos ou reflexões diárias exibidas na landing page.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `dia` | `VARCHAR(60)` | sim | Identificador do dia, ex.: `"Domingo"`, `"01/01"` |
| `mensagem` | `TEXT` | sim | Texto da bênção ou reflexão |
| `autor` | `VARCHAR(255)` | sim (default `''`) | Autor da bênção (vazio se sem autoria) |
| `imagem` | `VARCHAR(500)` | sim (default `''`) | URL da imagem opcional |

---

### `episcopal`

Membros da equipe episcopal do santuário.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `nome` | `VARCHAR(255)` | sim | Nome completo |
| `titulo` | `VARCHAR(120)` | sim | Título honorífico, ex.: `"Dom João"` |
| `cargo` | `VARCHAR(40)` | sim | Enum: `bispo`, `reitor`, `paroco_solidario`, `diacono` |
| `biografia` | `TEXT` | sim (default `''`) | Biografia em texto livre |
| `foto` | `VARCHAR(500)` | sim | URL da foto |

---

### `grupos`

Grupos e movimentos paroquiais.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição |
| `nome` | `VARCHAR(160)` | sim | Nome do grupo |
| `descricao` | `TEXT` | sim | Descrição do grupo |
| `icone` | `VARCHAR(60)` | sim | Nome do ícone |
| `encontro` | `VARCHAR(255)` | não | Informações sobre o dia/horário de encontro |

---

### `hero`

Textos do banner principal da landing page. Espera-se apenas **uma linha** nessa tabela.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `titulo` | `VARCHAR(255)` | sim | Primeira linha do título |
| `titulo_destaque` | `VARCHAR(255)` | sim | Segunda linha do título (exibida em destaque visual) |
| `subtitulo` | `TEXT` | sim | Subtítulo abaixo do título |

---

### `hero_slides`

Imagens do carrossel do banner principal.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `INT` PK AI | — | Identificador |
| `ordem` | `INT` | sim (default 0) | Ordem de exibição no carrossel |
| `imagem` | `VARCHAR(500)` | sim | URL da imagem |
| `alt` | `VARCHAR(255)` | sim | Texto alternativo para acessibilidade |
| `position` | `VARCHAR(120)` | não | Posição CSS da imagem, ex.: `"center top"` |

---

## Tabelas do Sistema (não expor na landing page)

### `users`

Usuários do CMS interno. Não deve ser acessada pela landing page.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `INT` PK AI | Identificador |
| `nome` | `VARCHAR(120)` | Nome do usuário |
| `email` | `VARCHAR(191)` UNIQUE | E-mail de login |
| `senha_hash` | `VARCHAR(255)` | Hash bcrypt da senha |
| `criado_em` | `INT` | Unix timestamp de criação |

---

### `sessions`

Sessões autenticadas do CMS. Não deve ser acessada pela landing page.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `INT` PK AI | Identificador |
| `token` | `VARCHAR(191)` UNIQUE | Token de sessão |
| `user_id` | `INT` | FK para `users.id` |
| `expira_em` | `INT` | Unix timestamp de expiração |
| `criado_em` | `INT` | Unix timestamp de criação |

---

### `audit_log`

Log de todas as operações realizadas no CMS. Não deve ser acessada pela landing page.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `INT` PK AI | Identificador |
| `user_id` | `INT` | FK para `users.id` (nullable se usuário deletado) |
| `user_nome` | `VARCHAR(120)` | Nome do usuário no momento da ação |
| `acao` | `VARCHAR(30)` | Ex.: `"criar"`, `"editar"`, `"deletar"` |
| `entidade` | `VARCHAR(40)` | Tabela afetada, ex.: `"noticias"` |
| `entidade_id` | `VARCHAR(60)` | ID do registro afetado |
| `resumo` | `VARCHAR(500)` | Descrição legível da operação |
| `dados_antes` | `JSON` | Estado do registro antes da alteração |
| `dados_depois` | `JSON` | Estado do registro após a alteração |
| `criado_em` | `INT` | Unix timestamp da operação |

---

## Convenções Gerais

- **`ordem`**: presente em todas as tabelas de conteúdo. Use para ordenar as queries (`ORDER BY ordem ASC`).
- **`destaque`**: em `missas` e `noticias`, indica itens que devem aparecer em posição privilegiada na UI.
- **Timestamps**: campos `criado_em` e `expira_em` são Unix timestamps (inteiros em segundos).
- **URLs de imagem**: campos `imagem` e `foto` armazenam URLs completas (ex.: Cloudflare R2, S3).
- **Ícones**: campos `icone` armazenam nomes de ícones (confirmar com o CMS qual biblioteca é usada).
