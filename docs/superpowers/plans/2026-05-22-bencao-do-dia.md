# Bênção do Dia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exibir um modal de boas-vindas com imagem do São José e texto de bênção (que varia por dia do ano) toda vez que o fiel acessa o site.

**Architecture:** Um Client Component `BencaoModal` montado no layout raiz calcula, no cliente via `useEffect`, qual texto e imagem exibir com base na data atual — texto por `diaAno % BENCAOS.length`, imagem por `diaSemana` (0–6). Os dados vivem em `data/bencaos.ts`. O modal é acessível (role=dialog, focus trap, fecha com Escape).

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, next/image

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `data/bencaos.ts` | Criar — arrays BENCAOS e IMAGENS_SANTO |
| `public/img/bencao/placeholder.jpg` | Criar — imagem placeholder (1×1 px base64 ou cópia de img existente) |
| `components/interactive/BencaoModal.tsx` | Criar — Client Component do modal |
| `app/layout.tsx` | Modificar — importar e montar `<BencaoModal />` |

---

## Task 1: Dados — `data/bencaos.ts`

**Files:**
- Create: `data/bencaos.ts`

- [ ] **Step 1: Criar o arquivo de dados**

Crie `data/bencaos.ts` com o conteúdo abaixo. Os textos são bênçãos curtas de tradição católica, adequadas ao tom litúrgico do santuário.

```ts
export type Bencao = {
  texto: string
  autor?: string
}

export const BENCAOS: Bencao[] = [
  {
    texto: 'Que São José te cubra com seu manto protetor e te guie neste dia com sabedoria e paz.',
    autor: 'Oração tradicional',
  },
  {
    texto: 'O Senhor te abençoe e te guarde. O Senhor faça resplandecer o seu rosto sobre ti e te conceda graça.',
    autor: 'Nm 6, 24-25',
  },
  {
    texto: 'Que a intercessão de São José, esposo da Virgem Maria e padroeiro do Maranhão, alcance para ti bênçãos abundantes.',
    autor: 'Oração do Santuário',
  },
  {
    texto: 'Vai em paz. Que a paz do Senhor Jesus Cristo permaneça contigo e com todos os que amas.',
    autor: 'Despedida litúrgica',
  },
  {
    texto: 'São José, modelo de fé silenciosa e trabalho fiel, interceda por ti e por tua família neste dia.',
    autor: 'Devoção popular',
  },
  {
    texto: 'Que a graça de Deus Pai, o amor de Jesus Cristo e a comunhão do Espírito Santo estejam contigo.',
    autor: '2 Cor 13, 13',
  },
  {
    texto: 'Busca primeiro o Reino de Deus e a sua justiça, e todas as demais coisas te serão dadas em acréscimo.',
    autor: 'Mt 6, 33',
  },
  {
    texto: 'Que São José, que cuidou de Jesus com amor e fidelidade, cuide também da tua família hoje e sempre.',
    autor: 'Oração dos peregrinos',
  },
  {
    texto: 'O Senhor é o teu pastor e nada te faltará. Que esta certeza te fortaleça ao longo do dia.',
    autor: 'Sl 23, 1',
  },
  {
    texto: 'Recebe esta bênção do Santuário de São José de Ribamar: que a paz, a fé e a esperança nunca te abandonem.',
    autor: 'Bênção do Santuário',
  },
]

export const IMAGENS_SANTO: string[] = [
  '/img/bencao/domingo.jpg',
  '/img/bencao/segunda.jpg',
  '/img/bencao/terca.jpg',
  '/img/bencao/quarta.jpg',
  '/img/bencao/quinta.jpg',
  '/img/bencao/sexta.jpg',
  '/img/bencao/sabado.jpg',
]

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
```

- [ ] **Step 2: Commit**

```bash
git add data/bencaos.ts
git commit -m "feat: add bencaos data — texts and image paths for BencaoModal"
```

---

## Task 2: Imagens placeholder

**Files:**
- Create: `public/img/bencao/placeholder.jpg` (será copiado para os 7 dias)

O padre vai fornecer as imagens reais. Por enquanto, use uma imagem existente do projeto como placeholder para todos os 7 dias da semana, para que o modal já funcione visualmente.

- [ ] **Step 1: Criar a pasta e os placeholders**

```bash
# Crie a pasta
mkdir -p public/img/bencao

# Copie uma imagem existente como placeholder para cada dia
# (use qualquer imagem .jpg ou .jpeg já presente em public/img/)
cp public/img/devocao.png public/img/bencao/domingo.jpg
cp public/img/devocao.png public/img/bencao/segunda.jpg
cp public/img/devocao.png public/img/bencao/terca.jpg
cp public/img/devocao.png public/img/bencao/quarta.jpg
cp public/img/devocao.png public/img/bencao/quinta.jpg
cp public/img/devocao.png public/img/bencao/sexta.jpg
cp public/img/devocao.png public/img/bencao/sabado.jpg
```

> **Nota:** Se `public/img/devocao.png` não existir, use qualquer outra imagem disponível em `public/img/`. Os nomes dos arquivos de destino devem ser exatamente os listados acima (domingo.jpg … sabado.jpg) pois são os caminhos referenciados em `data/bencaos.ts`.

- [ ] **Step 2: Commit**

```bash
git add public/img/bencao/
git commit -m "feat: add placeholder images for BencaoModal (to be replaced by padre)"
```

---

## Task 3: Componente `BencaoModal`

**Files:**
- Create: `components/interactive/BencaoModal.tsx`

- [ ] **Step 1: Criar o componente**

Crie `components/interactive/BencaoModal.tsx` com o conteúdo abaixo.

```tsx
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { BENCAOS, IMAGENS_SANTO, getDayOfYear } from '@/data/bencaos'
import Button from '@/components/ui/Button'

type ModalState = {
  imagem: string
  texto: string
  autor?: string
}

export default function BencaoModal() {
  const [aberto, setAberto] = useState(false)
  const [modal, setModal] = useState<ModalState | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const hoje = new Date()
    const diaSemana = hoje.getDay()
    const diaAno = getDayOfYear(hoje)

    setModal({
      imagem: IMAGENS_SANTO[diaSemana],
      texto: BENCAOS[diaAno % BENCAOS.length].texto,
      autor: BENCAOS[diaAno % BENCAOS.length].autor,
    })
    setAberto(true)
  }, [])

  useEffect(() => {
    if (aberto) {
      btnRef.current?.focus()
    }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aberto])

  if (!aberto || !modal) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      aria-hidden="true"
      onClick={() => setAberto(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bencao-titulo"
        className="relative w-full max-w-md bg-cream rounded-2xl shadow-2xl border border-gold/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem */}
        <div className="relative w-full h-56">
          <Image
            src={modal.imagem}
            alt="São José de Ribamar"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream/80" />
        </div>

        {/* Conteúdo */}
        <div className="px-6 pb-6 pt-2 text-center">
          <p
            id="bencao-titulo"
            className="font-serif text-gold text-lg tracking-widest uppercase mb-4"
          >
            ✝ Bênção do Dia
          </p>

          <blockquote className="font-lora italic text-burgundy-dk text-base leading-relaxed mb-2">
            &ldquo;{modal.texto}&rdquo;
          </blockquote>

          {modal.autor && (
            <p className="font-body text-xs text-text-soft mb-5">— {modal.autor}</p>
          )}

          <Button
            ref={btnRef}
            variant="primary"
            full
            onClick={() => setAberto(false)}
          >
            Amém
          </Button>
        </div>
      </div>
    </div>
  )
}
```

> **Atenção:** O componente `Button` existente em `components/ui/Button.tsx` não aceita `ref` nem `onClick` diretamente porque usa um elemento `<button>` interno sem `forwardRef`. O passo seguinte corrige isso.

- [ ] **Step 2: Adicionar `forwardRef` e `onClick` ao `Button`**

Abra `components/ui/Button.tsx` e substitua o conteúdo pelo seguinte para suportar `ref` e `onClick`:

```tsx
import Link from 'next/link'
import { forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'gold'

interface ButtonProps {
  href?: string
  variant?: Variant
  full?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

const variants: Record<Variant, string> = {
  primary:
    'bg-burgundy text-white border-2 border-burgundy hover:bg-burgundy-dk hover:border-burgundy-dk',
  outline:
    'bg-transparent text-white border-2 border-white hover:bg-white hover:text-burgundy',
  gold:
    'bg-gold text-white border-2 border-gold hover:bg-gold-light hover:border-gold-light',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { href, variant = 'primary', full = false, children, className = '', type = 'button', disabled = false, onClick },
  ref
) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded font-body font-semibold text-sm tracking-wide transition-all duration-300 active:scale-[0.97]'
  const classes = `${base} ${variants[variant]} ${full ? 'w-full justify-center' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button ref={ref} type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  )
})

export default Button
```

- [ ] **Step 3: Commit**

```bash
git add components/interactive/BencaoModal.tsx components/ui/Button.tsx
git commit -m "feat: add BencaoModal component and extend Button with ref/onClick support"
```

---

## Task 4: Montar o modal no layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Importar e adicionar `<BencaoModal />` ao layout**

Abra `app/layout.tsx`. Adicione o import após os imports existentes de componentes interativos:

```tsx
import BencaoModal from '@/components/interactive/BencaoModal'
```

Em seguida, adicione `<BencaoModal />` dentro do `<body>`, após `<HashScrollFix />`:

```tsx
<body>
  <Topbar />
  <Header />
  <main>{children}</main>
  <Footer />
  <BackToTop />
  <PixWidget />
  <ScrollReveal />
  <HashScrollFix />
  <BencaoModal />   {/* ← adicionar aqui */}
</body>
```

- [ ] **Step 2: Verificar no navegador**

```bash
npm run dev
```

Abra `http://localhost:3000`. O modal deve aparecer automaticamente ao carregar a página, com a imagem placeholder, o texto da bênção do dia e o botão "Amém". Verifique:

- [ ] Modal abre ao carregar
- [ ] Botão "Amém" fecha o modal
- [ ] Pressionar `Escape` fecha o modal
- [ ] Clicar no backdrop (área escura fora do card) fecha o modal
- [ ] Foco inicia no botão "Amém"
- [ ] Sem erros no console

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: mount BencaoModal in root layout"
```

---

## Task 5: Verificação final e instruções para o padre

- [ ] **Step 1: Testar rotação de textos e imagens**

No arquivo `data/bencaos.ts`, existe a função `getDayOfYear`. Para testar diferentes dias sem esperar, modifique temporariamente o `useEffect` em `BencaoModal.tsx` passando uma data específica:

```ts
// Teste temporário — remover após verificar
const hoje = new Date('2026-01-15') // dia 15 → texto índice 15 % 10 = 5
```

Verifique que o texto muda conforme esperado e reverta a alteração.

- [ ] **Step 2: Reverter o teste e commitar estado final**

```bash
# Certifique-se de que BencaoModal.tsx usa new Date() sem data fixa
git add .
git commit -m "feat: bencao-do-dia complete — modal with daily blessing text and image"
```

- [ ] **Step 3: Orientações para o padre (anotar no README ou passar por mensagem)**

Para substituir as imagens placeholder pelas imagens reais do santo:

1. Prepare 7 imagens JPG, uma para cada dia da semana
2. Nomeie-as exatamente: `domingo.jpg`, `segunda.jpg`, `terca.jpg`, `quarta.jpg`, `quinta.jpg`, `sexta.jpg`, `sabado.jpg`
3. Coloque-as em `public/img/bencao/`, substituindo os placeholders
4. Para adicionar novos textos de bênção, edite o array `BENCAOS` em `data/bencaos.ts`

---

## Notas de expansão futura

- **Uma vez por dia:** adicionar `localStorage` — salvar a data atual ao fechar o modal e verificar no `useEffect` antes de abrir
- **Calendário litúrgico:** substituir `getDayOfYear % BENCAOS.length` por chamada a uma API de calendário católico
- **Painel do padre:** expor `data/bencaos.ts` via rota de API com autenticação básica para edição sem código
