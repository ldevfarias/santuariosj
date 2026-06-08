# Episcopal Dynamic Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar a seção episcopal 100% dinâmica, buscando bispo, padres e diáconos do banco de dados, sem nenhum dado hardcoded no código.

**Architecture:** Adicionar `cargo` tipado ao tipo `Sacerdote`, usar esse campo na `page.tsx` para separar os três grupos por valor de `cargo`, e exibir labels legíveis no badge do `PriestCard`. Corrigir também o CSP para permitir imagens do Cloudflare R2.

**Tech Stack:** Next.js 14 App Router, TypeScript, MySQL via `lib/data.ts`, Next.js Image

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `lib/types.ts` | Modificar | Adicionar campo `cargo` tipado ao `Sacerdote` |
| `app/episcopal/page.tsx` | Modificar | Separar grupos por `cargo`, remover array hardcoded |
| `app/episcopal/components/PriestCard.tsx` | Modificar | Exibir label legível no badge via mapa |
| `next.config.ts` | Modificar | Adicionar domínio R2 ao CSP `img-src` |

> `lib/data.ts` já mapeia `cargo: r.cargo` — nenhuma alteração necessária.

---

### Task 1: Adicionar campo `cargo` ao tipo `Sacerdote`

**Files:**
- Modify: `lib/types.ts:114-122`

- [ ] **Step 1: Atualizar o tipo `Sacerdote`**

Abrir `lib/types.ts` e substituir o bloco do tipo `Sacerdote` (linhas 114–122):

```ts
export type Sacerdote = {
  id: string
  nome: string
  titulo: string
  cargo: 'bispo' | 'reitor' | 'paroco_solidario' | 'diacono' | string
  foto: string
  bio: string
  bispo: boolean
}
```

- [ ] **Step 2: Verificar que TypeScript não aponta erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add cargo field to Sacerdote type"
```

---

### Task 2: Separar grupos por `cargo` em `page.tsx` e remover array hardcoded

**Files:**
- Modify: `app/episcopal/page.tsx`

- [ ] **Step 1: Reescrever a lógica de separação e remover diáconos hardcoded**

Substituir todo o conteúdo de `app/episcopal/page.tsx` por:

```tsx
import type { Metadata } from 'next'

import { getSacerdotes } from '@/lib/data'

import BishopHighlight from './components/BishopHighlight'
import EpiscopalHero from './components/EpiscopalHero'
import PriestsGrid from './components/PriestsGrid'

export const metadata: Metadata = {
  title: 'Corpo Episcopal | Santuário de São José de Ribamar',
  description: 'Conheça o bispo e os padres que pastoreiam o Santuário de São José de Ribamar.',
}

export default async function EpiscopalPage() {
  const sacerdotes = await getSacerdotes()

  const bispo    = sacerdotes.find(s => s.cargo === 'bispo')
  const padres   = sacerdotes.filter(s => s.cargo === 'reitor' || s.cargo === 'paroco_solidario')
  const diaconos = sacerdotes.filter(s => s.cargo === 'diacono')

  return (
    <main className="bg-cream min-h-screen">
      <EpiscopalHero />

      {bispo && <BishopHighlight bispo={bispo} />}

      <PriestsGrid title="Nossos Padres" items={padres} />

      <PriestsGrid title="Diáconos Permanentes" items={diaconos} />
    </main>
  )
}
```

- [ ] **Step 2: Verificar que TypeScript não aponta erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [ ] **Step 3: Commit**

```bash
git add app/episcopal/page.tsx
git commit -m "feat: replace hardcoded deacons with dynamic DB query"
```

---

### Task 3: Exibir label legível no badge do `PriestCard`

**Files:**
- Modify: `app/episcopal/components/PriestCard.tsx`

- [ ] **Step 1: Adicionar mapa de labels e usá-lo no badge**

Substituir todo o conteúdo de `app/episcopal/components/PriestCard.tsx` por:

```tsx
import Image from 'next/image'

import type { Sacerdote } from '@/lib/types'

const CARGO_LABEL: Record<string, string> = {
  bispo: 'Bispo',
  reitor: 'Reitor',
  paroco_solidario: 'Pároco Solidário',
  diacono: 'Diácono Permanente',
}

function getExcerpt(text: string, max = 280) {
  if (text.length <= max) return text
  const clipped = text.slice(0, max)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : max)}...`
}

type PriestCardProps = {
  padre: Sacerdote
}

export default function PriestCard({ padre }: PriestCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-3/4 w-full bg-cream-dk">
        <Image
          src={padre.foto}
          alt={`${padre.titulo} ${padre.nome}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 ring-1 ring-black/10 pointer-events-none" />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-0.5 text-xs font-body font-semibold uppercase tracking-wider text-white bg-burgundy rounded mb-3">
          {CARGO_LABEL[padre.cargo] ?? padre.cargo}
        </span>
        <h3 className="font-serif text-xl font-bold text-text mb-2">
          {padre.titulo} {padre.nome}
        </h3>
        <div className="w-12 border-b border-gold mb-4" />
        <details className="group bio-details">
          <summary className="list-none cursor-pointer outline-none">
            <div className="bio-content-wrapper">
              <div className="bio-excerpt">
                <p className="font-body text-sm text-text-soft leading-relaxed">
                  {getExcerpt(padre.bio)}
                </p>
              </div>
            </div>

            <span className="mt-2 inline-flex items-center text-sm font-semibold text-burgundy transition-colors group-hover:text-burgundy-dk">
              <span className="group-open:hidden">Ver mais</span>
              <span className="hidden group-open:inline">Ver menos</span>
            </span>
          </summary>

          <div className="bio-full">
            <div className="bio-full-inner">
              <p className="pt-4 font-body text-sm text-text-soft leading-relaxed border-t border-cream-dk mt-3">
                {padre.bio}
              </p>
            </div>
          </div>
        </details>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Verificar que TypeScript não aponta erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [ ] **Step 3: Commit**

```bash
git add app/episcopal/components/PriestCard.tsx
git commit -m "feat: show readable cargo label in priest card badge"
```

---

### Task 4: Adicionar domínio R2 ao CSP `img-src`

**Files:**
- Modify: `next.config.ts:28`

- [ ] **Step 1: Atualizar a diretiva `img-src` no CSP**

Em `next.config.ts`, localizar a linha (dentro do array do CSP):

```ts
"img-src 'self' images.unsplash.com https://placehold.co data: blob:",
```

Substituir por:

```ts
"img-src 'self' images.unsplash.com https://placehold.co https://*.r2.dev data: blob:",
```

- [ ] **Step 2: Verificar que TypeScript não aponta erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "fix: allow R2 image domain in Content-Security-Policy"
```
