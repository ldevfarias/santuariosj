# Comunidades DB Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar a página de comunidades de JSON estático para consulta ao banco de dados MySQL, seguindo o padrão já estabelecido no projeto.

**Architecture:** Atualizar o tipo `Comunidade` para refletir o schema real do banco, converter `getComunidades` de leitura síncrona de JSON para uma função async com `dbCache`/`query`, e adaptar o `page.tsx` para consumir o novo shape com imagem única.

**Tech Stack:** Next.js 14 (App Router), TypeScript, mysql2/promise, `dbCache` (wrapper sobre `unstable_cache`)

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `lib/types.ts` | Modificar | Reescrever tipo `Comunidade` com campos do banco |
| `lib/data.ts` | Modificar | Migrar `getComunidades` para async + dbCache |
| `app/comunidades/page.tsx` | Modificar | Tornar async, consumir novos campos, simplificar card |

---

### Task 1: Atualizar o tipo `Comunidade`

**Files:**
- Modify: `lib/types.ts:57-68`

- [ ] **Step 1: Substituir o tipo `Comunidade`**

Em [lib/types.ts](lib/types.ts), localizar o bloco atual (linhas 57–68):

```ts
export type Comunidade = {
  id: string
  slug: string
  nome: string
  bairro: string
  celebracao: string
  mapaUrl: string
  imagemPrincipal: string
  imagemPrincipalAlt: string
  imagemSecundaria: string
  imagemSecundariaAlt: string
}
```

Substituir por:

```ts
export type Comunidade = {
  id: number
  nome: string
  endereco: string
  celebracoes: string
  mapaUrl: string
  imagem: string
}
```

- [ ] **Step 2: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Esperado: erros em `lib/data.ts` e `app/comunidades/page.tsx` (campos obsoletos) — isso é esperado agora, serão corrigidos nas próximas tasks.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "refactor: update Comunidade type to match DB schema"
```

---

### Task 2: Migrar `getComunidades` para banco de dados

**Files:**
- Modify: `lib/data.ts:261-263`

- [ ] **Step 1: Substituir `getComunidades` em `lib/data.ts`**

Localizar o bloco atual (próximo à linha 261):

```ts
export function getComunidades(): Comunidade[] {
  return readJson<Comunidade[]>('comunidades.json')
}
```

Substituir por:

```ts
// ── comunidades ──────────────────────────────────────────────────────────────

type ComunidadeRow = {
  id: number; ordem: number; nome: string; endereco: string
  celebracoes: string; mapa_url: string; imagem: string
}

export const getComunidades = dbCache(
  async (): Promise<Comunidade[]> => {
    const rows = await query<ComunidadeRow>('SELECT * FROM comunidades ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      endereco: r.endereco,
      celebracoes: r.celebracoes,
      mapaUrl: r.mapa_url,
      imagem: r.imagem,
    }))
  },
  ['comunidades'],
  { revalidate: 1800, tags: ['comunidades'] }
)
```

- [ ] **Step 2: Verificar que o TypeScript compila (somente erros no page.tsx)**

```bash
npx tsc --noEmit
```

Esperado: apenas erros em `app/comunidades/page.tsx` — `data.ts` deve estar limpo.

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat: migrate getComunidades to async DB query with dbCache"
```

---

### Task 3: Atualizar a página de comunidades

**Files:**
- Modify: `app/comunidades/page.tsx`

- [ ] **Step 1: Tornar o componente async e consumir novos campos**

Substituir todo o conteúdo de [app/comunidades/page.tsx](app/comunidades/page.tsx) por:

```tsx
import { ArrowLeft, Clock3, MapPin, Navigation } from 'lucide-react'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getComunidades } from '@/lib/data'

import Ornament from '@/components/ui/Ornament'

export const metadata: Metadata = {
  title: 'Comunidades',
  description:
    'Conheca as comunidades vinculadas ao Santuário de São Jose de Ribamar, com seus bairros, horarios de celebracao e localizacao.',
}

export default async function ComunidadesPage() {
  const comunidades = await getComunidades()

  return (
    <main className="min-h-screen bg-cream">
      <div className="bg-burgundy py-6 sm:py-8">
        <div className="container-site flex flex-col gap-2 text-center sm:gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gold-bright/80 transition-colors hover:text-gold-bright"
          >
            <ArrowLeft size={15} />
            Início
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Ornament light />
            <h1 className="font-serif text-[clamp(1.75rem,4.4vw,2.8rem)] font-bold text-white">
              Comunidades
            </h1>
            <p className="max-w-2xl font-lora text-sm leading-relaxed text-gold-bright/90 sm:text-base">
              Espaços de oração, encontro e celebração que prolongam a vida pastoral do Santuário
              nas comunidades.
            </p>
          </div>
        </div>
      </div>

      <section className="container-site py-8 sm:py-10">
        <div className="mb-8 text-center reveal sm:mb-10">
          <Ornament />
          <h2 className="font-serif text-[clamp(1.7rem,4vw,2.7rem)] font-bold leading-tight text-burgundy">
            Comunidades do Santuário
          </h2>
          <p className="mx-auto mt-2 max-w-3xl font-lora text-base text-text-soft sm:text-lg">
            Cada comunidade apresenta seu endereço, horário de celebração e acesso rápido ao mapa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {comunidades.map((comunidade, index) => (
            <article
              key={comunidade.id}
              className="reveal overflow-hidden rounded-[1.75rem] border border-cream-dk bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-16/9 w-full overflow-hidden">
                <Image
                  src={comunidade.imagem}
                  alt={comunidade.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  priority={index < 2}
                />
              </div>

              <div className="p-6 sm:p-7">
                <span className="inline-flex rounded-full bg-burgundy px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Comunidade
                </span>

                <h2 className="mt-4 font-serif text-[clamp(1.5rem,2.7vw,2rem)] font-bold text-burgundy">
                  {comunidade.nome}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-text-soft">
                  <p className="flex items-start gap-3 leading-relaxed">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold text-text">Endereço:</strong> {comunidade.endereco}
                    </span>
                  </p>
                  <p className="flex items-start gap-3 leading-relaxed">
                    <Clock3 size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold text-text">Celebrações:</strong>{' '}
                      {comunidade.celebracoes}
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={comunidade.mapaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-burgundy px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-burgundy-dk"
                  >
                    Ver no mapa
                    <Navigation size={16} />
                  </a>
                  <span className="text-xs uppercase tracking-[0.16em] text-text-soft">
                    Santuário de São Jose de Ribamar
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **Step 3: Commit**

```bash
git add app/comunidades/page.tsx
git commit -m "feat: update comunidades page to consume DB data"
```

---

### Task 4: Verificação final

- [ ] **Step 1: Build de produção limpo**

```bash
npm run build
```

Esperado: build sem erros de tipo ou lint. A página `/comunidades` deve aparecer como Server Component async.

- [ ] **Step 2: Verificar no browser (dev server)**

```bash
npm run dev
```

Navegar para `http://localhost:3000/comunidades` e confirmar:
- Cards renderizando com dados reais do banco
- Imagem única por card (aspect 16/9)
- Label "Endereço:" correto
- Botão "Ver no mapa" com link funcional

- [ ] **Step 3: Commit final (se houver ajustes)**

```bash
git add -A
git commit -m "fix: address any post-build adjustments in comunidades page"
```
