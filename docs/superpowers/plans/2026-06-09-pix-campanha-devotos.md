# Pix Campanha dos Devotos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar um botão flutuante fixo na lateral direita da página inicial que abre um popover com QR Code placeholder e chave Pix copiável para a Campanha dos Devotos.

**Architecture:** Um único client component `PixCampanhaButton` com estado `open` controla o popover. O botão usa `position: fixed` para acompanhar o scroll. O componente é adicionado apenas em `app/page.tsx`, sem afetar o layout global.

**Tech Stack:** Next.js 14 App Router, React, Tailwind CSS, lucide-react (já instalado)

---

## File Map

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Criar | `components/interactive/PixCampanhaButton.tsx` | Botão flutuante + popover completo |
| Modificar | `app/page.tsx` | Importar e renderizar `<PixCampanhaButton />` |

---

## Task 1: Criar o componente `PixCampanhaButton`

**Files:**
- Create: `components/interactive/PixCampanhaButton.tsx`

- [ ] **Step 1: Criar o arquivo com estrutura base**

Criar `components/interactive/PixCampanhaButton.tsx` com o seguinte conteúdo:

```tsx
'use client'

import { Copy, Check, Heart, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PIX_KEY = '(98) 98893-0158'

export default function PixCampanhaButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — silently ignore
    }
  }

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <>
      {/* Botão flutuante */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Campanha dos Devotos — Contribuir via Pix"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-burgundy text-white rounded-l-lg shadow-lg hover:bg-burgundy-dk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        {/* Desktop: texto rotacionado */}
        <span className="hidden lg:flex items-center gap-2 px-3 py-4">
          <Heart size={14} className="shrink-0" />
          <span
            className="font-serif text-xs font-semibold tracking-wider uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            Campanha dos Devotos
          </span>
        </span>
        {/* Mobile: só ícone */}
        <span className="lg:hidden flex items-center justify-center w-10 h-16">
          <Heart size={16} />
        </span>
      </button>

      {/* Popover */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="false"
        aria-label="Campanha dos Devotos — Pix"
        className={`fixed right-[52px] lg:right-[60px] top-1/2 -translate-y-1/2 z-40
          w-72 bg-white rounded-xl shadow-2xl border border-cream-dk
          transition-all duration-200 origin-right
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="font-serif text-sm font-bold text-burgundy uppercase tracking-wide">
            Campanha dos Devotos
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="text-text-soft hover:text-burgundy transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="px-4 pb-3 font-body text-xs text-text-soft leading-relaxed">
          Contribua com o Santuário de São José de Ribamar.
        </p>

        {/* QR Code placeholder */}
        <div className="mx-4 mb-3 aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 border border-gray-200">
          <div className="w-12 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Heart size={20} className="text-gray-300" />
          </div>
          <p className="font-body text-[11px] text-gray-400 text-center leading-tight px-2">
            QR Code em breve
          </p>
        </div>

        {/* Chave Pix */}
        <div className="mx-4 mb-3 p-3 bg-cream rounded-lg">
          <p className="font-body text-[10px] text-text-soft uppercase tracking-wider mb-1">
            Chave Pix (telefone)
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-burgundy tracking-wide">
              {PIX_KEY}
            </span>
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Chave Pix copiada' : 'Copiar chave Pix'}
              aria-live="polite"
              className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors
                bg-burgundy text-white hover:bg-burgundy-dk"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <p className="px-4 pb-4 font-lora italic text-[11px] text-text-soft text-center">
          Que São José abençoe sua oferta.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verificar que não há erros de TypeScript**

```bash
npx tsc --noEmit
```

Esperado: nenhum erro relacionado ao novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add components/interactive/PixCampanhaButton.tsx
git commit -m "feat: add PixCampanhaButton floating component"
```

---

## Task 2: Integrar o componente na página inicial

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Adicionar import no topo de `app/page.tsx`**

Após a última linha de imports existente (antes de `export const metadata`), adicionar:

```tsx
import PixCampanhaButton from '@/components/interactive/PixCampanhaButton'
```

- [ ] **Step 2: Adicionar `<PixCampanhaButton />` no JSX**

No `return` de `HomePage`, adicionar `<PixCampanhaButton />` logo antes do fechamento `</>`:

```tsx
  return (
    <>
      <HeroSection />
      <NoticeBar />
      <MissasSection missas={missas} />
      <CalendarioSection agenda={agenda} />
      <SobreSection />
      {noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
      <SaoJoseSection />
      <SacramentosSection sacramentos={sacramentos} />
      <PastoralSection grupos={grupos} />
      <DevocoesSection />
      <CitacaoSection />
      <ContatoSection />
      <PixCampanhaButton />
    </>
  )
```

- [ ] **Step 3: Verificar build sem erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 4: Testar manualmente no browser**

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Verificar:
1. O botão aparece na lateral direita, verticalmente centralizado, com texto rotacionado
2. Clicar abre o popover com QR Code placeholder e chave Pix
3. Clicar "Copiar" muda para "Copiado!" por 2 segundos
4. Clicar fora do popover fecha-o
5. No mobile (< 1024px): botão mostra apenas ícone sem texto
6. O botão acompanha o scroll em todas as seções da página
7. O botão não aparece em outras páginas (ex: `/sacramentos`, `/episcopal`)

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render PixCampanhaButton on home page"
```

---

## Notas para substituição do QR Code (futuro)

Quando a imagem do QR Code estiver disponível:

1. Colocar a imagem em `public/img/pix-qrcode.png`
2. Em `components/interactive/PixCampanhaButton.tsx`, substituir o bloco do placeholder:

```tsx
{/* Substituir este bloco: */}
<div className="mx-4 mb-3 aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2 border border-gray-200">
  ...
</div>

{/* Por este: */}
<div className="mx-4 mb-3">
  <Image
    src="/img/pix-qrcode.png"
    alt="QR Code Pix — Campanha dos Devotos"
    width={224}
    height={224}
    className="w-full rounded-lg"
  />
</div>
```

Lembrar de adicionar `import Image from 'next/image'` no topo do arquivo.
