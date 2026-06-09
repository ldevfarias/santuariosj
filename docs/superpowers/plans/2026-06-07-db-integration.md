# Integração MariaDB — Landing Page Santuário SJ

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Substituir leitura de arquivos `data/*.json` por queries diretas ao MariaDB, mantendo alta performance via cache ISR do Next.js com revalidação por entidade.

**Architecture:** Pool de conexão singleton (`lib/db.ts`) com `mysql2/promise`. Cada função de `lib/data.ts` passa a fazer query SQL e retorna resultado via `unstable_cache` com TTL específico por entidade. Script de seed único (`scripts/seed.ts`) migra os dados dos JSONs para o banco.

**Tech Stack:** `mysql2`, Next.js `unstable_cache`, MariaDB, `tsx` (para rodar o seed)

---

## Mapa de arquivos

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `lib/db.ts` | Pool singleton + função `query<T>()` tipada |
| Modificar | `lib/data.ts` | Substituir `readFileSync` por queries SQL com `unstable_cache` |
| Criar | `scripts/seed.ts` | Migração dos JSONs para o banco (descartável após uso) |
| Modificar | `.env.local.example` | Documentar variáveis `DB_*` |
| Modificar | `app/page.tsx` | Remover `export const dynamic = 'force-static'` |
| Remover | `data/missas.json` | Após seed confirmado |
| Remover | `data/agenda.json` | Após seed confirmado |
| Remover | `data/noticias.json` | Após seed confirmado |
| Remover | `data/sacramentos.json` | Após seed confirmado |
| Remover | `data/grupos.json` | Após seed confirmado |
| Remover | `data/devocoes.json` | Após seed confirmado |
| Remover | `data/sacerdotes.json` | Após seed confirmado |
| Manter | `data/historia.json` | Sem tabela no schema — continua como JSON |
| Manter | `data/comunidades.json` | Sem tabela no schema — continua como JSON |
| Manter | `data/devocoes-pages.json` | Sem tabela no schema — continua como JSON |

---

## Task 1: Instalar mysql2 e configurar variáveis de ambiente

**Files:**
- Modificar: `package.json`
- Modificar: `.env.local.example`
- Criar: `.env.local` (não commitado)

- [x] **Step 1: Instalar mysql2**

```bash
npm install mysql2
npm install -D @types/node
```

Esperado: `mysql2` aparece em `dependencies` do `package.json`.

- [x] **Step 2: Atualizar `.env.local.example`**

Adicionar ao final do arquivo (não substituir o conteúdo existente):

```bash
# MariaDB
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=santuario
DB_PASSWORD=senha_aqui
DB_NAME=santuario_db
```

- [x] **Step 3: Criar `.env.local` com valores reais**

Criar o arquivo `.env.local` na raiz do projeto com as credenciais reais do banco MariaDB local (Docker). Exemplo:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senha_do_docker
DB_NAME=santuario_db
```

> **Atenção:** `.env.local` já está no `.gitignore` do Next.js — nunca commitar esse arquivo.

- [x] **Step 4: Verificar que o banco está acessível**

```bash
npx tsx -e "
const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log('Conexão OK');
  await conn.end();
}
main().catch(console.error);
" 
```

Esperado: `Conexão OK` no terminal. Se falhar, verificar credenciais e se o container Docker está rodando.

- [x] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.local.example
git commit -m "chore: install mysql2 and document DB env vars"
```

---

## Task 2: Criar `lib/db.ts` — pool de conexão

**Files:**
- Criar: `lib/db.ts`

- [x] **Step 1: Criar `lib/db.ts`**

```typescript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (err) {
    console.error('[db] query failed:', sql, err)
    return []
  }
}
```

- [x] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [x] **Step 3: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add MariaDB connection pool (lib/db.ts)"
```

---

## Task 3: Criar `scripts/seed.ts` — migrar dados dos JSONs para o banco

**Files:**
- Criar: `scripts/seed.ts`

O script lê cada JSON e faz `INSERT` nas tabelas correspondentes. Campos JSON (`horarios`, `requisitos`, etc.) são serializados com `JSON.stringify()`. Roda uma única vez para popular o banco.

- [x] **Step 1: Criar `scripts/seed.ts`**

```typescript
import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), 'data', filename), 'utf-8')) as T
}

// ── missas ──────────────────────────────────────────────────────────────────
type MissaJson = { dia: string; icone: string; horarios: object[]; destaque?: boolean; programacao_semanal?: string[]; observacao?: string }
const missas = readJson<MissaJson[]>('missas.json')
for (const [i, m] of missas.entries()) {
  await conn.execute(
    'INSERT INTO missas (ordem, dia, destaque, icone, horarios, programacao_semanal, observacao) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, m.dia, m.destaque ?? false, m.icone, JSON.stringify(m.horarios), m.programacao_semanal ? JSON.stringify(m.programacao_semanal) : null, m.observacao ?? null]
  )
}
console.log('missas: OK')

// ── agenda ───────────────────────────────────────────────────────────────────
type AgendaJson = { dia: number; mes: string; titulo: string; hora: string; local: string; tipo: string }
const agenda = readJson<AgendaJson[]>('agenda.json')
for (const [i, a] of agenda.entries()) {
  await conn.execute(
    'INSERT INTO agenda (ordem, dia, mes, titulo, hora, local, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, a.dia, a.mes, a.titulo, a.hora, a.local, a.tipo]
  )
}
console.log('agenda: OK')

// ── noticias ─────────────────────────────────────────────────────────────────
type NoticiaJson = { titulo: string; categoria: string; data: string; resumo: string; imagem: string; destaque?: boolean }
const noticias = readJson<NoticiaJson[]>('noticias.json')
for (const [i, n] of noticias.entries()) {
  await conn.execute(
    'INSERT INTO noticias (ordem, titulo, categoria, data, conteudo, imagem, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [i, n.titulo, n.categoria, n.data, n.resumo, n.imagem, n.destaque ?? false]
  )
}
console.log('noticias: OK')

// ── sacramentos ──────────────────────────────────────────────────────────────
type SacramentoJson = {
  slug: string; nome: string; descricao: string; descricaoItalico?: boolean
  descricaoLonga: string; requisitos: string[]; agendamento: string
  agendamentoItens?: string[]; agendamentoContato?: string; cta?: string; href: string; icone: string
}
const sacramentos = readJson<SacramentoJson[]>('sacramentos.json')
for (const [i, s] of sacramentos.entries()) {
  await conn.execute(
    `INSERT INTO sacramentos
      (ordem, slug, nome, descricao, descricao_italico, descricao_longa, requisitos, agendamento, agendamento_itens, agendamento_contato, cta, href, icone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      i, s.slug, s.nome, s.descricao, s.descricaoItalico ?? false,
      s.descricaoLonga, JSON.stringify(s.requisitos), s.agendamento,
      s.agendamentoItens ? JSON.stringify(s.agendamentoItens) : null,
      s.agendamentoContato ?? null, s.cta ?? null, s.href, s.icone,
    ]
  )
}
console.log('sacramentos: OK')

// ── grupos ───────────────────────────────────────────────────────────────────
type GrupoJson = { nome: string; descricao: string; icone: string; encontro?: string }
const grupos = readJson<GrupoJson[]>('grupos.json')
for (const [i, g] of grupos.entries()) {
  await conn.execute(
    'INSERT INTO grupos (ordem, nome, descricao, icone, encontro) VALUES (?, ?, ?, ?, ?)',
    [i, g.nome, g.descricao, g.icone, g.encontro ?? null]
  )
}
console.log('grupos: OK')

// ── bencao_dia (somente lista de devocoes) ───────────────────────────────────
type DevocaoJson = { lista: string[] }
const devocoes = readJson<DevocaoJson>('devocoes.json')
for (const [i, item] of devocoes.lista.entries()) {
  await conn.execute(
    'INSERT INTO bencao_dia (ordem, dia, mensagem, autor, imagem) VALUES (?, ?, ?, ?, ?)',
    [i, String(i + 1), item, '', '']
  )
}
console.log('bencao_dia: OK')

// ── episcopal ────────────────────────────────────────────────────────────────
type SacerdoteJson = { id: string; nome: string; titulo: string; cargo: string; foto: string; bio: string; bispo: boolean }
const sacerdotes = readJson<SacerdoteJson[]>('sacerdotes.json')
for (const [i, s] of sacerdotes.entries()) {
  const cargo = s.bispo ? 'bispo' : (s.cargo.toLowerCase().includes('reitor') ? 'reitor' : 'paroco_solidario')
  await conn.execute(
    'INSERT INTO episcopal (ordem, nome, titulo, cargo, biografia, foto) VALUES (?, ?, ?, ?, ?, ?)',
    [i, s.nome, s.titulo, cargo, s.bio, s.foto]
  )
}
console.log('episcopal: OK')

await conn.end()
console.log('\nSeed concluído com sucesso.')
```

- [x] **Step 2: Rodar o seed**

```bash
npx tsx scripts/seed.ts
```

Esperado:
```
missas: OK
agenda: OK
noticias: OK
sacramentos: OK
grupos: OK
bencao_dia: OK
episcopal: OK

Seed concluído com sucesso.
```

Se alguma tabela já tiver dados e houver erro de duplicate key, limpe a tabela antes:

```sql
TRUNCATE TABLE missas;
-- repita para cada tabela necessária
```

- [x] **Step 3: Verificar dados no banco**

Conecte ao banco e confirme que as linhas foram inseridas:

```sql
SELECT COUNT(*) FROM missas;      -- esperado: 3
SELECT COUNT(*) FROM agenda;      -- esperado: 5
SELECT COUNT(*) FROM noticias;    -- esperado: 3
SELECT COUNT(*) FROM sacramentos; -- esperado: 7
SELECT COUNT(*) FROM grupos;      -- esperado: 6
SELECT COUNT(*) FROM bencao_dia;  -- esperado: 6
SELECT COUNT(*) FROM episcopal;   -- esperado: 4
```

- [x] **Step 4: Commit**

```bash
git add scripts/seed.ts
git commit -m "feat: add seed script to migrate JSON data to MariaDB"
```

---

## Task 4: Reescrever `lib/data.ts` — queries SQL com `unstable_cache`

**Files:**
- Modificar: `lib/data.ts`

Cada função passa a:
1. Fazer query SQL com `query()` de `lib/db.ts`
2. Parsear campos JSON retornados como string pelo `mysql2`
3. Retornar resultado via `unstable_cache` com tag e TTL específico

As funções que ainda leem JSONs (`getHistoria`, `getComunidades`, `getDevocoesPages`, `getDevocaoPage`, `getDevocaoGalleryImages`) permanecem inalteradas — continuam lendo `data/*.json`.

- [x] **Step 1: Reescrever `lib/data.ts`**

```typescript
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { unstable_cache } from 'next/cache'

import { query } from './db'
import type {
  AgendaItem,
  Comunidade,
  DevocaoPage,
  DevoItem,
  Grupo,
  Historia,
  Missa,
  Noticia,
  Sacerdote,
  Sacramento,
} from './types'

function readJson<T>(filename: string): T {
  const filepath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T
}

// ── missas ───────────────────────────────────────────────────────────────────

type MissaRow = {
  id: number; ordem: number; dia: string; destaque: number; icone: string
  horarios: string; programacao_semanal: string | null; observacao: string | null
}

export const getMissas = unstable_cache(
  async (): Promise<Missa[]> => {
    const rows = await query<MissaRow>('SELECT * FROM missas ORDER BY ordem ASC')
    return rows.map((r) => ({
      dia: r.dia,
      destaque: Boolean(r.destaque),
      icone: r.icone,
      horarios: JSON.parse(r.horarios) as Missa['horarios'],
    }))
  },
  ['missas'],
  { revalidate: 600, tags: ['missas'] }
)

// ── agenda ───────────────────────────────────────────────────────────────────

type AgendaRow = {
  id: number; ordem: number; dia: number; mes: string
  titulo: string; hora: string; local: string; tipo: string
}

export const getAgenda = unstable_cache(
  async (): Promise<AgendaItem[]> => {
    const rows = await query<AgendaRow>('SELECT * FROM agenda ORDER BY ordem ASC')
    return rows.map((r) => ({
      dia: r.dia,
      mes: r.mes,
      titulo: r.titulo,
      hora: r.hora,
      local: r.local,
      tipo: r.tipo as AgendaItem['tipo'],
    }))
  },
  ['agenda'],
  { revalidate: 300, tags: ['agenda'] }
)

// ── noticias ─────────────────────────────────────────────────────────────────

type NoticiaRow = {
  id: number; ordem: number; titulo: string; categoria: string
  data: string; conteudo: string; imagem: string; destaque: number
}

export const getNoticias = unstable_cache(
  async (): Promise<Noticia[]> => {
    const rows = await query<NoticiaRow>('SELECT * FROM noticias ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: String(r.id),
      titulo: r.titulo,
      categoria: r.categoria,
      data: r.data,
      resumo: r.conteudo,
      imagem: r.imagem,
      destaque: Boolean(r.destaque),
    }))
  },
  ['noticias'],
  { revalidate: 300, tags: ['noticias'] }
)

// ── sacramentos ──────────────────────────────────────────────────────────────

type SacramentoRow = {
  id: number; ordem: number; slug: string; nome: string; descricao: string
  descricao_italico: number; descricao_longa: string; requisitos: string
  agendamento: string; agendamento_itens: string | null
  agendamento_contato: string | null; cta: string | null; href: string; icone: string
}

export const getSacramentos = unstable_cache(
  async (): Promise<Sacramento[]> => {
    const rows = await query<SacramentoRow>('SELECT * FROM sacramentos ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: r.slug,
      slug: r.slug,
      nome: r.nome,
      descricao: r.descricao,
      descricaoItalico: Boolean(r.descricao_italico),
      descricaoLonga: r.descricao_longa,
      requisitos: JSON.parse(r.requisitos) as string[],
      agendamento: r.agendamento,
      agendamentoItens: r.agendamento_itens ? (JSON.parse(r.agendamento_itens) as string[]) : undefined,
      agendamentoContato: r.agendamento_contato ?? undefined,
      cta: r.cta ?? undefined,
      href: r.href,
      icone: r.icone,
    }))
  },
  ['sacramentos'],
  { revalidate: 1800, tags: ['sacramentos'] }
)

export async function getSacramento(slug: string): Promise<Sacramento | undefined> {
  const all = await getSacramentos()
  return all.find((s) => s.slug === slug)
}

// ── grupos ───────────────────────────────────────────────────────────────────

type GrupoRow = {
  id: number; ordem: number; nome: string; descricao: string
  icone: string; encontro: string | null
}

export const getGrupos = unstable_cache(
  async (): Promise<Grupo[]> => {
    const rows = await query<GrupoRow>('SELECT * FROM grupos ORDER BY ordem ASC')
    return rows.map((r) => ({
      nome: r.nome,
      descricao: r.descricao,
      icone: r.icone,
      encontro: r.encontro ?? undefined,
    }))
  },
  ['grupos'],
  { revalidate: 1800, tags: ['grupos'] }
)

// ── episcopal ────────────────────────────────────────────────────────────────

type EpiscopalRow = {
  id: number; ordem: number; nome: string; titulo: string
  cargo: string; biografia: string; foto: string
}

export const getSacerdotes = unstable_cache(
  async (): Promise<Sacerdote[]> => {
    const rows = await query<EpiscopalRow>('SELECT * FROM episcopal ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: String(r.id),
      nome: r.nome,
      titulo: r.titulo,
      cargo: r.cargo,
      foto: r.foto,
      bio: r.biografia,
      bispo: r.cargo === 'bispo',
    }))
  },
  ['episcopal'],
  { revalidate: 1800, tags: ['episcopal'] }
)

// ── bencao_dia ───────────────────────────────────────────────────────────────

type BencaoDiaRow = {
  id: number; ordem: number; dia: string; mensagem: string; autor: string; imagem: string
}

export const getBencaoDia = unstable_cache(
  async (): Promise<BencaoDiaRow[]> => {
    return query<BencaoDiaRow>('SELECT * FROM bencao_dia ORDER BY ordem ASC')
  },
  ['bencao_dia'],
  { revalidate: 3600, tags: ['bencao_dia'] }
)

// ── devocoes (cards permanecem hardcoded no componente) ──────────────────────

export async function getDevocoes(): Promise<{ lista: string[]; cards: DevoItem[] }> {
  const rows = await getBencaoDia()
  const cards: DevoItem[] = [
    { titulo: 'Romaria Anual', descricao: 'Todo mês de março, milhares de peregrinos percorrem o caminho até o Santuário.', icone: 'Church' },
    { titulo: 'Pagamento de Promessas', descricao: 'Espaço dedicado para os fiéis cumprirem as promessas feitas ao Santo Padroeiro.', icone: 'Flame' },
    { titulo: 'Ex-Votos', descricao: 'Sala dos Milagres com os testemunhos de graças alcançadas pelos devotos.', icone: 'Heart' },
    { titulo: 'Óleo Bento', descricao: 'Distribuição de óleo bento em honra a São José, tradição centenária do Santuário.', icone: 'Droplets' },
  ]
  return { lista: rows.map((r) => r.mensagem), cards }
}

// ── mantidos como JSON (sem tabela no schema) ────────────────────────────────

export function getComunidades(): Comunidade[] {
  return readJson<Comunidade[]>('comunidades.json')
}

export function getDevocoesPages(): DevocaoPage[] {
  return readJson<DevocaoPage[]>('devocoes-pages.json')
}

export function getDevocaoPage(slug: string): DevocaoPage | undefined {
  return getDevocoesPages().find((item) => item.slug === slug)
}

export function getDevocaoGalleryImages(slug: string): string[] {
  if (slug !== 'ex-voto-museum') return []
  const imagesDir = join(process.cwd(), 'public', 'img')
  return readdirSync(imagesDir)
    .filter((file) => /^museu_\d+\.(png|jpe?g|webp|avif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
    .map((file) => `/img/${file}`)
}

export function getHistoria(): Historia {
  return readJson<Historia>('historia.json')
}
```

- [x] **Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [x] **Step 3: Commit**

```bash
git add lib/data.ts lib/db.ts
git commit -m "feat: replace JSON reads with MariaDB queries and unstable_cache"
```

---

## Task 5: Atualizar `app/page.tsx` — remover `force-static`

**Files:**
- Modificar: `app/page.tsx`

A página não pode mais ser estática em build time — os dados vêm do banco em runtime com cache ISR.

- [x] **Step 1: Remover `export const dynamic = 'force-static'`**

Em [app/page.tsx](app/page.tsx), remover a linha:

```typescript
export const dynamic = 'force-static'
```

Não adicionar nenhum substituto — sem `dynamic`, o Next.js usa o comportamento padrão (cache automático controlado pelo `unstable_cache`).

- [x] **Step 2: Verificar build**

```bash
npm run build
```

Esperado: build sem erros. A rota `/` deve aparecer como dinâmica (sem o ícone `○` estático) no output do build.

- [x] **Step 3: Testar em desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000` e confirmar que todas as seções carregam com dados reais do banco (missas, agenda, notícias, sacramentos, grupos).

- [x] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: remove force-static, page now uses ISR via unstable_cache"
```

---

## Task 6: Remover arquivos JSON migrados

**Files:**
- Remover: `data/missas.json`, `data/agenda.json`, `data/noticias.json`, `data/sacramentos.json`, `data/grupos.json`, `data/devocoes.json`, `data/sacerdotes.json`

Só executar após confirmar que o banco está populado (Task 3, Step 3) e a aplicação carrega corretamente (Task 5, Step 3).

- [ ] **Step 1: Remover os JSONs migrados**

```bash
git rm data/missas.json data/agenda.json data/noticias.json data/sacramentos.json data/grupos.json data/devocoes.json data/sacerdotes.json
```

- [ ] **Step 2: Verificar build após remoção**

```bash
npm run build
```

Esperado: build sem erros. Se aparecer algum erro de "file not found", alguma função ainda está lendo o JSON — rastrear e corrigir antes de continuar.

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove migrated JSON files (data now served from MariaDB)"
```

---

## Self-review do plano

**Cobertura da spec:**
- ✓ Pool singleton com `mysql2` — Task 2
- ✓ `unstable_cache` com TTL por entidade — Task 4
- ✓ Parse explícito de campos JSON — Task 4 (cada função)
- ✓ Variáveis de ambiente `DB_*` — Task 1
- ✓ Script de seed com mapeamento completo — Task 3
- ✓ Remoção dos JSONs migrados — Task 6
- ✓ `force-static` removido da home — Task 5
- ✓ `historia.json`, `comunidades.json`, `devocoes-pages.json` mantidos — Task 4 (seção "mantidos como JSON")
- ✓ Cards de devoções hardcoded em `getDevocoes()` — Task 4

**Consistência de tipos:**
- `query<T>()` retorna `T[]` — usado com `MissaRow`, `AgendaRow`, etc. em cada função
- `getSacramento(slug)` chama `getSacramentos()` (agora async) com `await` — correto
- `getDevocoes()` usa `getBencaoDia()` com `await` — correto
- `Sacerdote.id` é `string` — mapeado como `String(r.id)` — correto

**Sem placeholders:** nenhum TBD, TODO ou "implementar depois".
