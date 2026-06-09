# Notícias — Visibilidade Condicional e Collapse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Exibir a seção de notícias apenas quando houver ≥ 2 notícias no banco, e permitir expandir notícias além das 3 iniciais via botão inline com animação CSS.

**Architecture:** `app/page.tsx` guarda a condição de renderização (`noticias.length >= 2`). `NoticiasSection` vira client component, divide o array em dois grupos (slice 0-3 sempre visível, slice 3+ colapsável), e usa `useState` + classes Tailwind para a transição `max-height`.

**Tech Stack:** Next.js 14 App Router, React `useState`, Tailwind CSS, TypeScript.

---

### Task 1: Condicionar renderização em `app/page.tsx`

**Files:**
- Modify: `app/page.tsx:48`

- [x] **Step 1: Abrir `app/page.tsx` e localizar a linha de `<NoticiasSection>`**

A linha atual (48) é:
```tsx
<NoticiasSection noticias={noticias} />
```

- [x] **Step 2: Envolver com condicional**

Substituir por:
```tsx
{noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
```

- [x] **Step 3: Verificar que o arquivo ainda compila**

```bash
npx tsc --noEmit
```
Esperado: zero erros.

- [x] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: hide noticias section when fewer than 2 entries"
```

---

### Task 2: Converter `NoticiasSection` em client component com collapse

**Files:**
- Modify: `components/sections/NoticiasSection.tsx`

- [x] **Step 1: Adicionar `'use client'` e importar `useState`**

No topo do arquivo, antes das demais importações:
```tsx
'use client'

import { useState } from 'react'
```

- [x] **Step 2: Adicionar estado de expansão dentro do componente**

Logo após a abertura da função:
```tsx
const [expanded, setExpanded] = useState(false)
```

- [x] **Step 3: Dividir o array de notícias em dois grupos**

Logo após o `useState`:
```tsx
const visiveis = noticias.slice(0, 3)
const extras = noticias.slice(3)
```

- [x] **Step 4: Substituir o grid único pelos dois grupos**

Substituir o bloco do grid atual:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {noticias.map((noticia, i) => (
    ...
  ))}
</div>
```

Por:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {visiveis.map((noticia, i) => (
    <article
      key={noticia.id}
      className={`reveal bg-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${noticia.destaque ? 'md:col-span-1 md:row-span-1' : ''}`}
      style={{ transitionDelay: `${i * 120}ms` }}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={noticia.imagem}
          alt={noticia.titulo}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-burgundy text-white text-xs font-semibold px-3 py-1 rounded-full">
          {noticia.categoria}
        </span>
      </div>
      <div className="p-5">
        <span className="flex items-center gap-1.5 text-xs text-text-soft mb-2">
          <Calendar size={12} />
          {noticia.data}
        </span>
        <h3 className="font-serif text-base font-bold text-burgundy mb-2 leading-snug">
          {noticia.titulo}
        </h3>
        <p className="text-sm text-text-soft mb-4 leading-relaxed">{noticia.resumo}</p>
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:gap-2.5 transition-all"
        >
          Leia mais <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  ))}
</div>

{extras.length > 0 && (
  <div
    className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
  >
    {extras.map((noticia, i) => (
      <article
        key={noticia.id}
        className={`reveal bg-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${noticia.destaque ? 'md:col-span-1 md:row-span-1' : ''}`}
        style={{ transitionDelay: `${i * 120}ms` }}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={noticia.imagem}
            alt={noticia.titulo}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 bg-burgundy text-white text-xs font-semibold px-3 py-1 rounded-full">
            {noticia.categoria}
          </span>
        </div>
        <div className="p-5">
          <span className="flex items-center gap-1.5 text-xs text-text-soft mb-2">
            <Calendar size={12} />
            {noticia.data}
          </span>
          <h3 className="font-serif text-base font-bold text-burgundy mb-2 leading-snug">
            {noticia.titulo}
          </h3>
          <p className="text-sm text-text-soft mb-4 leading-relaxed">{noticia.resumo}</p>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:gap-2.5 transition-all"
          >
            Leia mais <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    ))}
  </div>
)}
```

- [x] **Step 5: Substituir o botão "Ver todas as notícias"**

Substituir o bloco `<div className="text-center mt-10">` atual por:
```tsx
{extras.length > 0 && (
  <div className="text-center mt-10">
    <button
      onClick={() => setExpanded((prev) => !prev)}
      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-burgundy text-burgundy font-semibold rounded hover:bg-burgundy hover:text-white transition-colors"
    >
      {expanded ? 'Ver menos' : 'Ver todas as notícias'}
    </button>
  </div>
)}
```

- [x] **Step 6: Verificar que o arquivo compila sem erros**

```bash
npx tsc --noEmit
```
Esperado: zero erros.

- [x] **Step 7: Commit**

```bash
git add components/sections/NoticiasSection.tsx
git commit -m "feat: add collapse/expand to noticias section with 3-item initial view"
```
