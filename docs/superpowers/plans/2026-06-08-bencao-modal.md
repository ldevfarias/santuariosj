# Modal de Bênção do Dia — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o componente `BencaoModal` que exibe a bênção do dia atual (pelo dia da semana) em um modal ao carregar qualquer página do site.

**Architecture:** Server Component (`layout.tsx`) busca os dados via `getBencaoDia()` e passa o array para `BencaoModal`, um Client Component que calcula `new Date().getDay()` para selecionar a bênção do dia e gerencia o estado de abertura/fechamento com `useState`.

**Tech Stack:** Next.js 15 App Router, React `useState`/`useEffect`, Tailwind CSS v4, `next/image`.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `components/interactive/BencaoModal.tsx` | Criar | UI e lógica do modal (client-only) |
| `app/layout.tsx` | Modificar | Buscar dados e renderizar `<BencaoModal>` |

---

### Task 1: Criar o componente `BencaoModal`

**Files:**
- Create: `components/interactive/BencaoModal.tsx`

- [ ] **Step 1: Criar o arquivo com o componente completo**

```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

type BencaoDiaRow = {
  id: number
  ordem: number
  dia: string
  mensagem: string
  autor: string
  imagem: string
}

export default function BencaoModal({ bencaos }: { bencaos: BencaoDiaRow[] }) {
  const [open, setOpen] = useState(true)

  const idx = new Date().getDay() // 0 = domingo … 6 = sábado
  const bencao = bencaos[idx]

  if (!open || !bencao) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="bencao-titulo"
    >
      <div className="bg-cream rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transition-opacity duration-300">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={bencao.imagem}
            alt="Bênção do Santuário de São José de Ribamar"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <h2
            id="bencao-titulo"
            className="font-serif text-lg font-bold text-gold tracking-widest uppercase"
          >
            † Bênção do Dia
          </h2>

          <p className="font-lora italic text-text text-base leading-relaxed">
            "{bencao.mensagem}"
          </p>

          <button
            onClick={() => setOpen(false)}
            autoFocus
            className="mt-2 w-full py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
          >
            Amém
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar que o arquivo foi criado sem erros de TypeScript**

```bash
cd c:\Users\luka\workspace\santuario\santuarioSJ
npx tsc --noEmit
```

Esperado: sem erros (ou apenas erros pré-existentes não relacionados ao novo arquivo).

- [ ] **Step 3: Commit**

```bash
git add components/interactive/BencaoModal.tsx
git commit -m "feat: add BencaoModal client component"
```

---

### Task 2: Integrar `BencaoModal` no `layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Adicionar import de `getBencaoDia` e do componente**

No topo de `app/layout.tsx`, adicionar após as importações existentes de componentes:

```tsx
import BencaoModal from '@/components/interactive/BencaoModal'
import { getBencaoDia } from '@/lib/data'
```

- [ ] **Step 2: Tornar `RootLayout` async e buscar os dados**

Substituir a assinatura da função:

```tsx
// antes
export default function RootLayout({ children }: { children: React.ReactNode }) {

// depois
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const bencaos = await getBencaoDia()
```

- [ ] **Step 3: Renderizar `<BencaoModal>` dentro do `<body>`**

Dentro do `<body>`, após `<HashScrollFix />`, adicionar:

```tsx
<BencaoModal bencaos={bencaos} />
```

O `<body>` completo deve ficar assim:

```tsx
<body>
  <ProgressBar />
  <Topbar />
  <Header />
  <main>{children}</main>
  <Footer />
  <BackToTop />
  <ScrollReveal />
  <HashScrollFix />
  <BencaoModal bencaos={bencaos} />
</body>
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sem novos erros.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: integrate BencaoModal into root layout"
```

---

### Task 3: Verificar no browser

- [ ] **Step 1: Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000` no browser.

- [ ] **Step 2: Verificar comportamento esperado**

- [ ] Modal aparece imediatamente ao carregar a página
- [ ] A imagem exibe corretamente no topo do card
- [ ] O título "† BÊNÇÃO DO DIA" aparece em dourado
- [ ] A mensagem da bênção aparece em itálico
- [ ] O botão "Amém" está em fundo bordô e tem foco automático
- [ ] Clicar "Amém" fecha o modal
- [ ] Navegar para outra rota (ex.: `/sacramentos`) e voltar — modal reaparece (é por page load, não por sessão)
- [ ] A bênção exibida corresponde ao dia da semana atual

- [ ] **Step 3: Verificar console do browser**

Abrir DevTools → Console. Nenhum erro de React ou Next.js deve aparecer.

- [ ] **Step 4: Commit final se tudo OK**

```bash
git add -A
git commit -m "chore: verify BencaoModal integration"
```

> Se o banco não tiver dados em `bencao_dia` para o dia atual, o modal simplesmente não aparece — comportamento de fallback correto conforme spec. Nesse caso, verifique os registros no banco com `SELECT * FROM bencao_dia ORDER BY ordem ASC`.
