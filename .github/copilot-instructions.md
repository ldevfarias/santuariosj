# Copilot Instructions — Santuário de São José de Ribamar

## Sobre o projeto

Site institucional do **Santuário de São José de Ribamar**, localizado em São José de Ribamar, Maranhão. Desenvolvido em **Next.js 16** com App Router, React 19, TypeScript e Tailwind CSS v4.

## Stack

- **Framework:** Next.js 16.2.4 (App Router) — leia `node_modules/next/dist/docs/` antes de usar APIs novas
- **UI:** React 19 com Server Components por padrão; Client Components apenas quando necessário (`'use client'`)
- **Linguagem:** TypeScript estrito — sem `any`, sem asserções desnecessárias
- **Estilos:** Tailwind CSS v4 com tokens customizados definidos em `app/globals.css` via `@theme`
- **Ícones:** Lucide React (`lucide-react`) — **não usar Font Awesome**
- **Fontes:** Next.js Font (`next/font/google`) — Cinzel, Lora, Open Sans
- **E-mail:** Resend via Server Action em `app/actions/contato.ts`
- **Validação:** Zod — usar em Server Actions e em qualquer boundary de entrada externa
- **Formatação:** Prettier com `@trivago/prettier-plugin-sort-imports`

## Estrutura de arquivos

```
santuarioSJ/
├── app/
│   ├── actions/contato.ts   # Server Action de envio de formulário
│   ├── globals.css          # Tokens Tailwind (@theme) + estilos base
│   ├── layout.tsx           # Root layout: fontes, metadata, JSON-LD
│   └── page.tsx             # Página principal (composição de seções)
├── components/
│   ├── interactive/         # Client Components ('use client')
│   │   ├── BackToTop.tsx
│   │   ├── ContatoForm.tsx
│   │   ├── HeroSlider.tsx
│   │   └── MobileNav.tsx
│   ├── layout/              # Header, Footer, Topbar
│   ├── sections/            # Uma section por arquivo (Server Components)
│   └── ui/                  # Button, Ornament, SectionHeader, NoticeBar
├── data/                    # JSON estático (missas, agenda, noticias…)
├── lib/
│   ├── data.ts              # Leitores de JSON (readFileSync no servidor)
│   └── types.ts             # Tipos compartilhados
├── public/                  # Assets estáticos servidos pelo Next
└── _legacy/                 # Site anterior em HTML/CSS/JS puro — não editar
```

## Design system

### Tokens de cor (Tailwind CSS v4 — `@theme` em `globals.css`)

| Token Tailwind | Valor | Uso |
|---|---|---|
| `burgundy` | `#6b1a1a` | Cor primária — botões, títulos, destaques |
| `burgundy-dk` | `#4a0f0f` | Variante escura — hover, topbar, footer |
| `gold` | `#b8860b` | Acento — ornamentos, links, datas |
| `gold-light` | `#d4a017` | Hover de dourado |
| `gold-pale` | `#f5e6b8` | Fundo suave dourado |
| `gold-bright` | `#f0c040` | Dourado claro — hero, elementos sobre escuro |
| `cream` | `#faf6ef` | Fundo principal claro |
| `cream-dk` | `#f0e8d8` | Fundo alternativo, bordas suaves |
| `text` | `#2a2218` | Texto principal |
| `text-soft` | `#5a4a3a` | Texto secundário |

Usar as classes Tailwind diretamente: `bg-burgundy`, `text-gold`, `border-cream-dk`, etc.

### Tipografia

| Classe Tailwind | Fonte | Uso |
|---|---|---|
| `font-serif` | Cinzel | Títulos, marca, elementos litúrgicos |
| `font-lora` | Lora | Subtítulos, citações, texto lead |
| `font-body` | Open Sans | Corpo de texto geral |

### Componentes utilitários

- `<Button href variant full>` — renderiza `<Link>` ou `<button>`; variantes: `primary`, `outline`, `gold`
- `<Ornament light?>` — separador decorativo com cruz (Lucide `Cross`)
- `<SectionHeader title subtitle light?>` — cabeçalho padronizado de seção
- `<NoticeBar>` — faixa de aviso/destaque

## Padrões de componentes

### Server Component (padrão)

```tsx
// components/sections/MinhaSection.tsx
import { getData } from '@/lib/data'

export default function MinhaSection() {
  const items = getData()
  return <section id="minha-secao" className="py-20 bg-cream">...</section>
}
```

### Client Component (somente quando necessário)

```tsx
'use client'
// components/interactive/MeuComponente.tsx
```

Usar `'use client'` apenas para: eventos do browser, hooks de estado/efeito, APIs de DOM.

### Server Action

```ts
'use server'
// app/actions/minha-action.ts
import { z } from 'zod'
// Validar com Zod, retornar estado tipado — nunca lançar exceção para o cliente
```

## Dados

Dados estáticos vivem em `data/*.json`. Para ler, usar as funções de `lib/data.ts` — **nunca** chamar `readFileSync` diretamente nos componentes. Para adicionar um novo conjunto de dados:
1. Criar o arquivo JSON em `data/`
2. Adicionar tipo em `lib/types.ts`
3. Adicionar função de leitura em `lib/data.ts`

## Convenções de código

- Imports ordenados pelo Prettier: `react|next` → `@/` → relativos
- Nomes de componentes: PascalCase; arquivos: `NomeDoComponente.tsx`
- IDs de seção em português, minúsculas, hífen: `#horarios`, `#sao-jose`
- Sem `!important` no CSS
- Sem classes Tailwind geradas dinamicamente (interpolação de string) — usar mapeamentos estáticos (`Record<Variant, string>`)
- Textos visíveis ao usuário: linguagem pastoral, respeitosa, sem gírias ou emojis

## Contexto religioso e editorial

- Site católico, voltado para fiéis e peregrinos do Maranhão
- **Padroeiro:** São José de Ribamar — padroeiro do Estado do Maranhão
- **Festa principal:** 19 de março
- Linguagem: respeitosa, acolhedora, litúrgica — nunca informal ou comercial
- Referências litúrgicas seguem o calendário romano (CNBB / Arquidiocese de São Luís)

## Segurança

- Server Actions validam com Zod antes de qualquer operação
- `app/actions/contato.ts` aplica rate-limit por IP (3 req/min)
- `next.config.ts` define headers de segurança (CSP, X-Frame-Options, etc.)
- Nunca expor variáveis de ambiente sem prefixo `NEXT_PUBLIC_` ao cliente
- Variáveis sensíveis (`RESEND_API_KEY`, etc.) ficam em `.env.local` — nunca commitar

## O que NÃO fazer

- Não usar `'use client'` sem necessidade — preferir Server Components
- Não chamar `readFileSync` fora de `lib/data.ts`
- Não usar Font Awesome — usar Lucide React
- Não adicionar CSS global além de `app/globals.css`
- Não usar `any` em TypeScript
- Não editar nada em `_legacy/` — é código histórico, apenas para referência
- Não introduzir dependências sem aprovação explícita
