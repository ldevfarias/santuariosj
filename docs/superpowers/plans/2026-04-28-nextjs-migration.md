# Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o site estático do Santuário de São José de Ribamar para Next.js 14+ com App Router, TypeScript strict, Tailwind CSS, lucide-react, Server Components, e Server Action para formulário de contato.

**Architecture:** Single-page (`/`) com componentes separados por responsabilidade. Server Components lêem JSONs locais via `lib/data.ts` e passam dados como props. Apenas 4 componentes são `'use client'`: `Header`, `HeroSlider`, `ContatoForm`, `BackToTop`. Server Action com `zod` trata o formulário de contato via Resend.

**Tech Stack:** Next.js 14+, TypeScript 5 (strict), Tailwind CSS 3, next/font/google, lucide-react, zod, Resend

> **Note on TDD:** Projeto frontend sem framework de testes. Verificação via `tsc --noEmit`, `next lint`, e checagem manual no browser.

---

## Mapa de arquivos

| Ação | Arquivo | Responsabilidade |
|---|---|---|
| Criar | `app/layout.tsx` | RootLayout: fontes, metadata global, Topbar, Header, Footer |
| Criar | `app/page.tsx` | Server Component: lê JSONs, monta seções, metadata da home |
| Criar | `app/globals.css` | Tailwind base + custom properties mínimas |
| Criar | `app/sitemap.ts` | Sitemap automático |
| Criar | `app/robots.ts` | Controle de crawlers |
| Criar | `app/actions/contato.ts` | Server Action: validação zod + Resend |
| Criar | `lib/types.ts` | Todos os tipos TypeScript do domínio |
| Criar | `lib/data.ts` | Funções de leitura dos JSONs (fs.readFileSync) |
| Criar | `data/*.json` | 6 arquivos de conteúdo editáveis |
| Criar | `components/layout/Topbar.tsx` | Server Component: barra superior |
| Criar | `components/layout/Header.tsx` | `'use client'`: sticky + hamburger |
| Criar | `components/layout/Footer.tsx` | Server Component: rodapé |
| Criar | `components/interactive/MobileNav.tsx` | `'use client'`: menu mobile |
| Criar | `components/interactive/HeroSlider.tsx` | `'use client'`: slideshow |
| Criar | `components/interactive/ContatoForm.tsx` | `'use client'`: formulário |
| Criar | `components/interactive/BackToTop.tsx` | `'use client'`: botão voltar ao topo |
| Criar | `components/ui/Ornament.tsx` | Separador decorativo com cruz |
| Criar | `components/ui/SectionHeader.tsx` | Cabeçalho padrão de seção |
| Criar | `components/ui/Button.tsx` | Componente de botão reutilizável |
| Criar | `components/ui/NoticeBar.tsx` | Faixa de aviso |
| Criar | `components/sections/HeroSection.tsx` | Seção hero |
| Criar | `components/sections/MissasSection.tsx` | Horários das missas |
| Criar | `components/sections/CalendarioSection.tsx` | Agenda litúrgica |
| Criar | `components/sections/SobreSection.tsx` | História do Santuário |
| Criar | `components/sections/NoticiasSection.tsx` | Cards de notícias |
| Criar | `components/sections/SaoJoseSection.tsx` | Seção São José |
| Criar | `components/sections/SacramentosSection.tsx` | Os 7 sacramentos |
| Criar | `components/sections/PastoralSection.tsx` | Grupos e movimentos |
| Criar | `components/sections/DevocoesSection.tsx` | Devoções tradicionais |
| Criar | `components/sections/CitacaoSection.tsx` | Citação bíblica |
| Criar | `components/sections/ContatoSection.tsx` | Contato: info + mapa + formulário |
| Criar | `next.config.ts` | Headers de segurança, image domains |
| Criar | `tailwind.config.ts` | Design tokens: cores, fontes, breakpoints |
| Criar | `.env.local.example` | Variáveis de ambiente documentadas |

---

## Task 1: Scaffold do projeto Next.js

**Files:**
- Criar: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.eslintrc.json`, `.prettierrc`
- Mover legado: `index.html`, `css/`, `js/` → `_legacy/`

- [ ] **Step 1: Arquivar arquivos legados**

```bash
mkdir _legacy
mv index.html css js img _legacy/
```

- [ ] **Step 2: Scaffold Next.js com Tailwind**

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

Quando perguntar "The directory ... contains files that could conflict. Continue?", responda `y`.

- [ ] **Step 3: Instalar dependências**

```bash
npm install lucide-react zod resend
npm install -D prettier eslint-config-prettier @trivago/prettier-plugin-sort-imports
```

- [ ] **Step 4: Criar `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^(react|next)", "^@/", "^\\."],
  "importOrderSeparation": true
}
```

- [ ] **Step 5: Atualizar `.eslintrc.json`**

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

- [ ] **Step 6: Verificar TypeScript strict em `tsconfig.json`**

Confirmar que `"strict": true` está presente (create-next-app já inclui por padrão). O arquivo deve conter:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

Adicionar `"noUncheckedIndexedAccess": true` se não estiver presente.

- [ ] **Step 7: Criar estrutura de diretórios**

```bash
mkdir -p components/layout components/sections components/ui components/interactive
mkdir -p data lib app/actions public/img
```

- [ ] **Step 8: Copiar imagens do legado**

```bash
cp _legacy/img/* public/img/ 2>/dev/null || true
```

- [ ] **Step 9: Verificar que Next.js roda**

```bash
npm run dev
```

Esperado: servidor em `http://localhost:3000` sem erros no terminal.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 project with TypeScript, Tailwind, ESLint, Prettier"
```

---

## Task 2: Tipos TypeScript + Data Layer

**Files:**
- Criar: `lib/types.ts`
- Criar: `lib/data.ts`
- Criar: `data/missas.json`
- Criar: `data/agenda.json`
- Criar: `data/noticias.json`
- Criar: `data/sacramentos.json`
- Criar: `data/grupos.json`
- Criar: `data/devocoes.json`

- [ ] **Step 1: Criar `lib/types.ts`**

```typescript
export type Horario = {
  hora: string
  desc: string
}

export type Missa = {
  dia: string
  destaque?: boolean
  icone: string
  horarios: Horario[]
}

export type AgendaItem = {
  dia: number
  mes: string
  titulo: string
  hora: string
  local: string
  tipo: 'festivo' | 'liturgico' | 'padroeiro'
}

export type Noticia = {
  id: string
  titulo: string
  categoria: string
  data: string
  resumo: string
  imagem: string
  destaque?: boolean
}

export type Sacramento = {
  id: string
  nome: string
  descricao: string
  cta: string
  href: string
  icone: string
}

export type Grupo = {
  nome: string
  descricao: string
  icone: string
}

export type Devocao = {
  nome: string
  descricao: string
  icone: string
}

export type DevoItem = {
  titulo: string
  descricao: string
  icone: string
}

export type ContactFormState = {
  success: boolean
  message: string
} | null
```

- [ ] **Step 2: Criar `data/missas.json`**

```json
[
  {
    "dia": "Segunda a Sexta",
    "icone": "Sun",
    "horarios": [
      { "hora": "07h00", "desc": "Missa Matinal" },
      { "hora": "12h00", "desc": "Missa do Meio-Dia" },
      { "hora": "19h00", "desc": "Missa Vespertina" }
    ]
  },
  {
    "dia": "Sábado",
    "destaque": true,
    "icone": "Star",
    "horarios": [
      { "hora": "07h00", "desc": "Missa Matinal" },
      { "hora": "16h00", "desc": "Missa das Crianças" },
      { "hora": "19h00", "desc": "Missa Vigília" }
    ]
  },
  {
    "dia": "Domingo",
    "icone": "Bird",
    "horarios": [
      { "hora": "07h00", "desc": "1ª Missa" },
      { "hora": "09h00", "desc": "2ª Missa" },
      { "hora": "11h00", "desc": "Missa das Famílias" },
      { "hora": "18h00", "desc": "Missa Solene" }
    ]
  }
]
```

- [ ] **Step 3: Criar `data/agenda.json`**

```json
[
  {
    "dia": 10,
    "mes": "MAR",
    "titulo": "Início da Novena de São José",
    "hora": "19h00",
    "local": "Igreja do Santuário",
    "tipo": "festivo"
  },
  {
    "dia": 19,
    "mes": "MAR",
    "titulo": "Festa de São José de Ribamar — Missa Solene e Procissão",
    "hora": "09h00",
    "local": "Praça do Santuário",
    "tipo": "padroeiro"
  },
  {
    "dia": 25,
    "mes": "MAR",
    "titulo": "Solenidade da Anunciação do Senhor",
    "hora": "19h00",
    "local": "Igreja do Santuário",
    "tipo": "liturgico"
  },
  {
    "dia": 17,
    "mes": "ABR",
    "titulo": "Semana Santa — Quinta-Feira Santa: Missa da Ceia do Senhor",
    "hora": "19h00",
    "local": "Igreja do Santuário",
    "tipo": "liturgico"
  },
  {
    "dia": 20,
    "mes": "ABR",
    "titulo": "Vigília Pascal e Missa da Ressurreição",
    "hora": "21h00",
    "local": "Igreja do Santuário",
    "tipo": "festivo"
  }
]
```

- [ ] **Step 4: Criar `data/noticias.json`**

```json
[
  {
    "id": "festa-2025",
    "titulo": "Programação completa da Festa de São José de Ribamar 2025",
    "categoria": "Festa do Padroeiro",
    "data": "15 de março de 2025",
    "resumo": "Confira todos os detalhes da programação da maior festa do Maranhão, com novena, missas solenes, procissão e shows culturais.",
    "imagem": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    "destaque": true
  },
  {
    "id": "romaria-2025",
    "titulo": "Mais de 50 mil peregrinos esperados para a Romaria de 2025",
    "categoria": "Peregrinação",
    "data": "08 de março de 2025",
    "resumo": "O Santuário se prepara para receber um número recorde de peregrinos na festividade do padroeiro.",
    "imagem": "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80"
  },
  {
    "id": "novena-2025",
    "titulo": "Novena de São José: rezar em família é a proposta deste ano",
    "categoria": "Liturgia",
    "data": "01 de março de 2025",
    "resumo": "A novena em homenagem ao padroeiro começa dia 10 de março e reúne famílias em oração durante 9 dias.",
    "imagem": "https://images.unsplash.com/photo-1548625149-720754bc3916?w=600&q=80"
  }
]
```

- [ ] **Step 5: Criar `data/sacramentos.json`**

```json
[
  { "id": "batismo", "nome": "Batismo", "icone": "Droplets", "descricao": "O sacramento do nascimento para a vida nova em Cristo. Agende o batismo do seu filho.", "cta": "Agendar", "href": "#contato" },
  { "id": "crisma", "nome": "Crisma", "icone": "Feather", "descricao": "A confirmação da fé. Inscrições abertas para os grupos de crisma do Santuário.", "cta": "Inscrever-se", "href": "#contato" },
  { "id": "eucaristia", "nome": "Eucaristia", "icone": "Wheat", "descricao": "O centro da vida cristã. Participe das missas diárias e dominicais no Santuário.", "cta": "Ver horários", "href": "#horarios" },
  { "id": "confissao", "nome": "Confissão", "icone": "HandHeart", "descricao": "O sacramento da reconciliação e do perdão. Confissões disponíveis antes de cada missa.", "cta": "Horários", "href": "#horarios" },
  { "id": "matrimonio", "nome": "Matrimônio", "icone": "Heart", "descricao": "A aliança sagrada entre duas pessoas diante de Deus. Agende sua preparação.", "cta": "Agendar", "href": "#contato" },
  { "id": "uncao", "nome": "Unção dos Enfermos", "icone": "Flame", "descricao": "Graça de conforto e cura para os que sofrem. Atendimento sob solicitação.", "cta": "Solicitar", "href": "#contato" },
  { "id": "ordem", "nome": "Ordem", "icone": "Cross", "descricao": "O sacramento pelo qual homens são consagrados ao serviço sagrado de Deus e da Igreja.", "cta": "Saiba mais", "href": "#contato" }
]
```

- [ ] **Step 6: Criar `data/grupos.json`**

```json
[
  { "nome": "Apostolado da Oração", "icone": "Heart", "descricao": "Grupo dedicado à oração diária, unindo os corações dos fiéis ao Sagrado Coração de Jesus." },
  { "nome": "Pastoral da Criança", "icone": "Baby", "descricao": "Ação solidária em favor das crianças carentes, promovendo saúde, educação e fé." },
  { "nome": "Grupo de Oração", "icone": "HandHeart", "descricao": "Encontros semanais de oração, adoração e louvor ao Espírito Santo." },
  { "nome": "Círculo Bíblico", "icone": "BookOpen", "descricao": "Estudo e meditação da Palavra de Deus em pequenos grupos comunitários." },
  { "nome": "Coral Litúrgico", "icone": "Music", "descricao": "Animação das celebrações litúrgicas através do canto sagrado e da música." },
  { "nome": "Caritas Paroquial", "icone": "Users", "descricao": "Serviço de caridade e solidariedade às famílias em situação de vulnerabilidade." }
]
```

- [ ] **Step 7: Criar `data/devocoes.json`**

```json
{
  "lista": [
    "Novena de São José (10 a 19 de março)",
    "Terço dos Homens — todo domingo após a missa",
    "Rosário de Nossa Senhora — todas as sextas",
    "Adoração ao Santíssimo Sacramento — quintas",
    "Via-Sacra — todas as sextas da Quaresma",
    "Procissão mensal ao redor do Santuário"
  ],
  "cards": [
    { "titulo": "Romaria Anual", "descricao": "Todo mês de março, milhares de peregrinos percorrem o caminho até o Santuário.", "icone": "Church" },
    { "titulo": "Pagamento de Promessas", "descricao": "Espaço dedicado para os fiéis cumprirem as promessas feitas ao Santo Padroeiro.", "icone": "Flame" },
    { "titulo": "Ex-Votos", "descricao": "Sala dos Milagres com os testemunhos de graças alcançadas pelos devotos.", "icone": "Heart" },
    { "titulo": "Óleo Bento", "descricao": "Distribuição de óleo bento em honra a São José, tradição centenária do Santuário.", "icone": "Droplets" }
  ]
}
```

- [ ] **Step 8: Criar `lib/data.ts`**

```typescript
import { readFileSync } from 'fs'
import { join } from 'path'

import type {
  AgendaItem,
  DevoItem,
  Grupo,
  Missa,
  Noticia,
  Sacramento,
} from './types'

function readJson<T>(filename: string): T {
  const filepath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T
}

export function getMissas(): Missa[] {
  return readJson<Missa[]>('missas.json')
}

export function getAgenda(): AgendaItem[] {
  return readJson<AgendaItem[]>('agenda.json')
}

export function getNoticias(): Noticia[] {
  return readJson<Noticia[]>('noticias.json')
}

export function getSacramentos(): Sacramento[] {
  return readJson<Sacramento[]>('sacramentos.json')
}

export function getGrupos(): Grupo[] {
  return readJson<Grupo[]>('grupos.json')
}

export function getDevocoes(): { lista: string[]; cards: DevoItem[] } {
  return readJson<{ lista: string[]; cards: DevoItem[] }>('devocoes.json')
}
```

- [ ] **Step 9: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros de tipo.

- [ ] **Step 10: Commit**

```bash
git add lib/ data/
git commit -m "feat: add TypeScript types and JSON data layer"
```

---

## Task 3: Tailwind config + globals.css

**Files:**
- Modificar: `tailwind.config.ts`
- Modificar: `app/globals.css`

- [ ] **Step 1: Atualizar `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6b1a1a',
          dk: '#4a0f0f',
        },
        gold: {
          DEFAULT: '#b8860b',
          light: '#d4a017',
          pale: '#f5e6b8',
          bright: '#f0c040',
        },
        cream: {
          DEFAULT: '#faf6ef',
          dk: '#f0e8d8',
        },
        text: {
          DEFAULT: '#2a2218',
          soft: '#5a4a3a',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'serif'],
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        body: ['var(--font-open-sans)', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Criar `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    @apply font-body text-text bg-cream overflow-x-hidden;
    line-height: 1.7;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }
}

@layer utilities {
  .container-site {
    width: min(1200px, 100%);
    margin-inline: auto;
    padding-inline: clamp(1rem, 4vw, 2rem);
  }
}

/* Scroll reveal animations */
.reveal,
.reveal-left,
.reveal-right {
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal { transform: translateY(24px); }
.reveal-left { transform: translateX(-32px); }
.reveal-right { transform: translateX(32px); }

.reveal.visible,
.reveal-left.visible,
.reveal-right.visible {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 3: Verificar compilação**

```bash
npm run build 2>&1 | head -30
```

Esperado: sem erros de CSS ou config. Pode haver erros de "module not found" nos arquivos de app ainda vazios — normal neste ponto.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind design tokens and global CSS base"
```

---

## Task 4: Componentes UI reutilizáveis

**Files:**
- Criar: `components/ui/Ornament.tsx`
- Criar: `components/ui/SectionHeader.tsx`
- Criar: `components/ui/Button.tsx`
- Criar: `components/ui/NoticeBar.tsx`

- [ ] **Step 1: Criar `components/ui/Ornament.tsx`**

```tsx
import { Cross } from 'lucide-react'

interface OrnamentProps {
  light?: boolean
}

export default function Ornament({ light = false }: OrnamentProps) {
  const color = light ? 'text-gold-bright' : 'text-gold'
  return (
    <div className={`flex items-center justify-center gap-3 mb-4 ${color}`}>
      <span className="block h-px w-16 bg-current opacity-40" />
      <Cross size={16} className="shrink-0" />
      <span className="block h-px w-16 bg-current opacity-40" />
    </div>
  )
}
```

- [ ] **Step 2: Criar `components/ui/SectionHeader.tsx`**

```tsx
import Ornament from './Ornament'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  light?: boolean
}

export default function SectionHeader({ title, subtitle, light = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <Ornament light={light} />
      <h2
        className={`font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight mb-3 ${
          light ? 'text-white' : 'text-burgundy'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`font-lora text-lg ${light ? 'text-white/80' : 'text-text-soft'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Criar `components/ui/Button.tsx`**

```tsx
import Link from 'next/link'

type Variant = 'primary' | 'outline' | 'gold'

interface ButtonProps {
  href?: string
  variant?: Variant
  full?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-burgundy text-white border-2 border-burgundy hover:bg-burgundy-dk hover:border-burgundy-dk',
  outline:
    'bg-transparent text-white border-2 border-white hover:bg-white hover:text-burgundy',
  gold:
    'bg-gold text-white border-2 border-gold hover:bg-gold-light hover:border-gold-light',
}

export default function Button({
  href,
  variant = 'primary',
  full = false,
  children,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded font-body font-semibold text-sm tracking-wide transition-all duration-300'
  const classes = `${base} ${variants[variant]} ${full ? 'w-full justify-center' : ''} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Criar `components/ui/NoticeBar.tsx`**

```tsx
import { Star } from 'lucide-react'

import Link from 'next/link'

export default function NoticeBar() {
  return (
    <div className="bg-burgundy-dk text-white py-3">
      <div className="container-site flex items-center justify-center gap-3 text-sm text-center">
        <Star size={14} className="text-gold-bright shrink-0" />
        <p>
          <strong>Festa de São José de Ribamar — 19 de março.</strong>{' '}
          Programação especial com novena, procissão e missas solenes.{' '}
          <Link href="#calendario" className="text-gold-bright underline hover:no-underline">
            Ver programação completa
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add reusable UI components (Ornament, SectionHeader, Button, NoticeBar)"
```

---

## Task 5: Layout — Topbar e Footer

**Files:**
- Criar: `components/layout/Topbar.tsx`
- Criar: `components/layout/Footer.tsx`

- [ ] **Step 1: Criar `components/layout/Topbar.tsx`**

```tsx
import { Instagram, Facebook, Youtube, Phone, Mail } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="bg-burgundy-dk text-white text-xs py-2">
      <div className="container-site flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <a
            href="tel:+5598322700000"
            className="flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <Phone size={12} />
            <span>(98) 3227-0000</span>
          </a>
          <a
            href="mailto:contato@santuariosjoser.org.br"
            className="hidden sm:flex items-center gap-1.5 hover:text-gold-bright transition-colors"
          >
            <Mail size={12} />
            <span>contato@santuariosjoser.org.br</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-gold-bright transition-colors"
          >
            <Instagram size={14} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-gold-bright transition-colors"
          >
            <Facebook size={14} />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-gold-bright transition-colors"
          >
            <Youtube size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Criar `components/layout/Footer.tsx`**

```tsx
import { Church, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-burgundy-dk text-white">
      <div className="py-16">
        <div className="container-site grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center">
                <Church size={20} className="text-gold-bright" />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-gold-bright">Santuário</p>
                <p className="text-xs text-white/70">São José de Ribamar</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-5 leading-relaxed">
              Um lugar sagrado de fé, esperança e encontro com Deus, no coração do Maranhão.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', icon: Instagram, label: 'Instagram' },
                { href: '#', icon: Facebook, label: 'Facebook' },
                { href: '#', icon: Youtube, label: 'YouTube' },
                { href: '#', icon: MessageCircle, label: 'WhatsApp' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-burgundy-dk transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'O Santuário',
              links: [
                { label: 'História', href: '#historia' },
                { label: 'São José de Ribamar', href: '#sao-jose' },
                { label: 'Estrutura', href: '#sobre' },
              ],
            },
            {
              title: 'Liturgia',
              links: [
                { label: 'Horários das Missas', href: '#horarios' },
                { label: 'Sacramentos', href: '#sacramentos' },
                { label: 'Agenda Litúrgica', href: '#calendario' },
                { label: 'Devoções', href: '#devocoes' },
              ],
            },
            {
              title: 'Pastoral',
              links: [
                { label: 'Grupos e Movimentos', href: '#pastoral' },
                { label: 'Peregrinações', href: '#devocoes' },
                { label: 'Notícias', href: '#noticias' },
                { label: 'Contato', href: '#contato' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-sm font-bold text-gold-bright mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-gold-bright transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© 2025 Santuário de São José de Ribamar. Todos os direitos reservados.</p>
          <p>Desenvolvido com ♥ para a glória de Deus.</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/Topbar.tsx components/layout/Footer.tsx
git commit -m "feat: add Topbar and Footer server components"
```

---

## Task 6: Layout — Header + MobileNav (Client)

**Files:**
- Criar: `components/interactive/MobileNav.tsx`
- Criar: `components/layout/Header.tsx`

- [ ] **Step 1: Criar `components/interactive/MobileNav.tsx`**

```tsx
'use client'

import { ChevronDown } from 'lucide-react'

import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: 'Início', href: '#hero' },
  {
    label: 'O Santuário',
    href: '#sobre',
    children: [
      { label: 'História', href: '#historia' },
      { label: 'São José de Ribamar', href: '#sao-jose' },
      { label: 'Estrutura', href: '#sobre' },
    ],
  },
  {
    label: 'Liturgia',
    href: '#horarios',
    children: [
      { label: 'Horários das Missas', href: '#horarios' },
      { label: 'Sacramentos', href: '#sacramentos' },
      { label: 'Calendário Litúrgico', href: '#calendario' },
    ],
  },
  { label: 'Notícias', href: '#noticias' },
  {
    label: 'Pastoral',
    href: '#pastoral',
    children: [
      { label: 'Grupos e Movimentos', href: '#pastoral' },
      { label: 'Devoções', href: '#devocoes' },
    ],
  },
  { label: 'Contato', href: '#contato' },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <nav
      id="main-nav"
      aria-label="Navegação principal"
      className={`
        fixed inset-0 top-[120px] bg-white z-40 overflow-y-auto
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:static lg:translate-x-0 lg:bg-transparent lg:overflow-visible lg:top-0
      `}
    >
      <ul className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-1 p-6 lg:p-0">
        {navItems.map((item) => (
          <li key={item.label} className="group relative">
            {item.children ? (
              <>
                <button
                  className="flex items-center gap-1 w-full text-left px-4 py-3 lg:py-2 font-body text-sm font-semibold text-text hover:text-burgundy transition-colors"
                  onClick={(e) => {
                    const parent = (e.currentTarget as HTMLElement).closest('li')
                    parent?.classList.toggle('open')
                  }}
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-[.open]:rotate-180 lg:group-hover:rotate-180" />
                </button>
                <ul className="hidden group-[.open]:block lg:group-hover:block lg:absolute lg:top-full lg:left-0 lg:bg-white lg:shadow-md lg:rounded lg:min-w-[200px] lg:py-2">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="block px-6 lg:px-4 py-2 text-sm text-text-soft hover:text-burgundy hover:bg-cream transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-4 py-3 lg:py-2 font-body text-sm font-semibold text-text hover:text-burgundy transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Criar `components/layout/Header.tsx`**

```tsx
'use client'

import { Church, Menu, X } from 'lucide-react'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import MobileNav from '../interactive/MobileNav'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container-site flex items-center justify-between h-20">
        {/* Brand */}
        <Link
          href="#hero"
          className="flex items-center gap-3"
          aria-label="Santuário de São José de Ribamar"
          onClick={closeMenu}
        >
          <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center">
            <Church size={20} className="text-gold-bright" />
          </div>
          <div>
            <span className="block font-serif text-sm font-bold text-burgundy leading-tight">
              Santuário
            </span>
            <span className="block font-body text-xs text-text-soft leading-tight">
              São José de Ribamar
            </span>
          </div>
        </Link>

        {/* Desktop nav via MobileNav (visible lg+) */}
        <div className="hidden lg:block">
          <MobileNav isOpen={true} onClose={closeMenu} />
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-burgundy"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      <div className="lg:hidden">
        <MobileNav isOpen={menuOpen} onClose={closeMenu} />
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx components/interactive/MobileNav.tsx
git commit -m "feat: add Header and MobileNav client components"
```

---

## Task 7: Componentes interativos — HeroSlider e BackToTop

**Files:**
- Criar: `components/interactive/HeroSlider.tsx`
- Criar: `components/interactive/BackToTop.tsx`

- [ ] **Step 1: Criar `components/interactive/HeroSlider.tsx`**

```tsx
'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

const slides = [
  { src: '/img/foto_2.jpeg', alt: 'Santuário de São José de Ribamar' },
  { src: '/img/foto_3.jpeg', alt: 'Igreja do Santuário' },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }, [])

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5500)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  return (
    <>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => { goTo(i); resetTimer() }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: Criar `components/interactive/BackToTop.tsx`**

```tsx
'use client'

import { ChevronUp } from 'lucide-react'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-burgundy text-white flex items-center justify-center shadow-lg hover:bg-burgundy-dk transition-colors"
    >
      <ChevronUp size={20} />
    </button>
  )
}
```

- [ ] **Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/interactive/HeroSlider.tsx components/interactive/BackToTop.tsx
git commit -m "feat: add HeroSlider and BackToTop interactive components"
```

---

## Task 8: Sections — Hero, Missas, Calendário

**Files:**
- Criar: `components/sections/HeroSection.tsx`
- Criar: `components/sections/MissasSection.tsx`
- Criar: `components/sections/CalendarioSection.tsx`

- [ ] **Step 1: Criar `components/sections/HeroSection.tsx`**

```tsx
import { Church, ChevronDown } from 'lucide-react'

import Link from 'next/link'

import HeroSlider from '../interactive/HeroSlider'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Slides (client) */}
      <HeroSlider />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-[2] text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] font-bold leading-tight mb-4">
          Santuário de{' '}
          <span className="text-gold-bright">São José de Ribamar</span>
        </h1>
        <p className="font-lora text-[clamp(1rem,2.5vw,1.3rem)] text-white/90 mb-8 max-w-xl mx-auto">
          Um lugar sagrado de fé, esperança e encontro com Deus.
          <br />
          Venha orar, peregrinar e renovar sua vida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#horarios"
            className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
          >
            <Church size={18} />
            Horários das Missas
          </Link>
          <Link
            href="#sobre"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-white font-semibold rounded hover:bg-white hover:text-burgundy transition-colors"
          >
            Conheça o Santuário
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-1 text-white/70 text-xs">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
        </div>
        <span>Role para baixo</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar `components/sections/MissasSection.tsx`**

```tsx
import * as Icons from 'lucide-react'

import type { Missa } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface MissasSectionProps {
  missas: Missa[]
}

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = Icons[name as LucideIconName] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon) return null
  return <Icon size={size} />
}

export default function MissasSection({ missas }: MissasSectionProps) {
  return (
    <section id="horarios" className="py-20 bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Horários das Missas"
          subtitle="Venha participar da Eucaristia e encontrar-se com Jesus"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missas.map((missa) => (
            <div
              key={missa.dia}
              className={`rounded-xl p-8 text-center shadow-md transition-transform hover:-translate-y-1 ${
                missa.destaque
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-text'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  missa.destaque ? 'bg-white/20 text-gold-bright' : 'bg-burgundy/10 text-burgundy'
                }`}
              >
                <DynamicIcon name={missa.icone} size={28} />
              </div>
              <h3
                className={`font-serif text-xl font-bold mb-4 ${
                  missa.destaque ? 'text-white' : 'text-burgundy'
                }`}
              >
                {missa.dia}
              </h3>
              <ul className="space-y-2">
                {missa.horarios.map((h) => (
                  <li
                    key={h.hora}
                    className={`flex items-center justify-between text-sm ${
                      missa.destaque ? 'text-white/90' : 'text-text-soft'
                    }`}
                  >
                    <span
                      className={`font-bold ${
                        missa.destaque ? 'text-gold-bright' : 'text-burgundy'
                      }`}
                    >
                      {h.hora}
                    </span>
                    <span>{h.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Criar `components/sections/CalendarioSection.tsx`**

```tsx
import { Clock, MapPin } from 'lucide-react'

import type { AgendaItem } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface CalendarioSectionProps {
  agenda: AgendaItem[]
}

const tipoColors: Record<AgendaItem['tipo'], string> = {
  festivo: 'bg-gold text-white',
  padroeiro: 'bg-burgundy text-white',
  liturgico: 'bg-text-soft/20 text-text',
}

const tipoLabels: Record<AgendaItem['tipo'], string> = {
  festivo: 'Festivo',
  padroeiro: 'Padroeiro',
  liturgico: 'Litúrgico',
}

export default function CalendarioSection({ agenda }: CalendarioSectionProps) {
  return (
    <section id="calendario" className="py-20 bg-burgundy">
      <div className="container-site">
        <SectionHeader
          title="Agenda Litúrgica"
          subtitle="Próximas celebrações e eventos do Santuário"
          light
        />
        <div className="space-y-4 max-w-3xl mx-auto">
          {agenda.map((item) => (
            <div
              key={`${item.dia}-${item.mes}`}
              className="flex items-center gap-5 bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-colors"
            >
              <div className="shrink-0 w-16 h-16 rounded-xl bg-gold/20 flex flex-col items-center justify-center text-white">
                <span className="font-serif text-2xl font-bold leading-none">{item.dia}</span>
                <span className="text-xs font-semibold text-gold-bright">{item.mes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base font-bold text-white mb-1 leading-snug">
                  {item.titulo}
                </h4>
                <p className="text-sm text-white/70 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.hora}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {item.local}
                  </span>
                </p>
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${tipoColors[item.tipo]}`}
              >
                {tipoLabels[item.tipo]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/sections/HeroSection.tsx components/sections/MissasSection.tsx components/sections/CalendarioSection.tsx
git commit -m "feat: add Hero, Missas, and Calendario section components"
```

---

## Task 9: Sections — Sobre, Notícias, São José

**Files:**
- Criar: `components/sections/SobreSection.tsx`
- Criar: `components/sections/NoticiasSection.tsx`
- Criar: `components/sections/SaoJoseSection.tsx`

- [ ] **Step 1: Criar `components/sections/SobreSection.tsx`**

```tsx
import { Church } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SobreSection() {
  return (
    <section id="sobre" className="py-20 bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/img/foto_1.jpeg"
                alt="Santuário de São José de Ribamar"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-burgundy text-white rounded-xl px-5 py-3 flex items-center gap-2 shadow-lg">
              <Church size={20} className="text-gold-bright" />
              <span className="font-serif text-sm font-bold">Desde 1615</span>
            </div>
          </div>

          {/* Content */}
          <div id="historia">
            <Ornament />
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy mb-4">
              História do Santuário
            </h2>
            <p className="font-lora text-lg text-text-soft mb-4 leading-relaxed">
              O Santuário de São José de Ribamar é um dos mais antigos e venerados lugares de
              peregrinação do Maranhão, dedicado ao padroeiro do Estado.
            </p>
            <p className="text-text-soft mb-4 leading-relaxed">
              Fundado no século XVII pelos colonizadores portugueses, o santuário guarda séculos
              de devoção ao glorioso São José de Ribamar, cujo nome foi dado à cidade homônima no
              litoral maranhense. Ao longo dos séculos, milhares de fiéis percorreram esse caminho
              sagrado em busca de graças, curas e renovação espiritual.
            </p>
            <p className="text-text-soft mb-6 leading-relaxed">
              A imagem de São José de Ribamar, de origem portuguesa, é considerada milagrosa pelos
              devotos e é o centro da veneração no santuário.
            </p>
            <Link
              href="#sao-jose"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
            >
              Conheça mais a história
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar `components/sections/NoticiasSection.tsx`**

```tsx
import { Calendar, ArrowRight } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'

import type { Noticia } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface NoticiasSectionProps {
  noticias: Noticia[]
}

export default function NoticiasSection({ noticias }: NoticiasSectionProps) {
  return (
    <section id="noticias" className="py-20 bg-white">
      <div className="container-site">
        <SectionHeader
          title="Notícias"
          subtitle="Fique por dentro das novidades do Santuário"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className={`bg-cream rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${
                noticia.destaque ? 'md:col-span-1 md:row-span-1' : ''
              }`}
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
        <div className="text-center mt-10">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-burgundy text-burgundy font-semibold rounded hover:bg-burgundy hover:text-white transition-colors"
          >
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Criar `components/sections/SaoJoseSection.tsx`**

```tsx
import { Quote } from 'lucide-react'

import Link from 'next/link'

import Ornament from '../ui/Ornament'

export default function SaoJoseSection() {
  return (
    <section
      id="sao-jose"
      className="relative py-24 bg-burgundy-dk overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/img/foto_2.jpeg')] bg-cover bg-center opacity-10" />
      <div className="relative z-[1] container-site max-w-2xl">
        <Ornament light />
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white mb-4 text-center">
          São José de Ribamar
        </h2>
        <p className="font-lora text-lg text-white/80 text-center mb-6">
          Padroeiro do Maranhão, protetor das famílias e dos trabalhadores.
        </p>
        <p className="text-white/80 mb-6 leading-relaxed text-center">
          São José é o esposo da Virgem Maria e pai adotivo de Jesus Cristo. Homem justo,
          trabalhador e fiel, é invocado como protetor dos trabalhadores, das famílias e da Igreja
          universal. Sua devoção no Maranhão remonta aos primeiros séculos da colonização.
        </p>
        <blockquote className="border-l-4 border-gold pl-6 my-8">
          <Quote size={24} className="text-gold mb-2" />
          <p className="font-lora italic text-white/90 text-lg mb-2">
            "São José, modelo de virtude e de obediência à vontade de Deus, guia-nos pelo caminho
            da santidade."
          </p>
          <cite className="text-sm text-gold-bright not-italic">— Oração ao Padroeiro</cite>
        </blockquote>
        <div className="text-center">
          <Link
            href="#devocoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-white font-semibold rounded hover:bg-gold-light transition-colors"
          >
            Devoções ao Santo
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/sections/SobreSection.tsx components/sections/NoticiasSection.tsx components/sections/SaoJoseSection.tsx
git commit -m "feat: add Sobre, Noticias, and SaoJose section components"
```

---

## Task 10: Sections — Sacramentos, Pastoral, Devoções, Citação

**Files:**
- Criar: `components/sections/SacramentosSection.tsx`
- Criar: `components/sections/PastoralSection.tsx`
- Criar: `components/sections/DevocoesSection.tsx`
- Criar: `components/sections/CitacaoSection.tsx`

- [ ] **Step 1: Criar `components/sections/SacramentosSection.tsx`**

```tsx
import * as Icons from 'lucide-react'

import Link from 'next/link'

import type { Sacramento } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface SacramentosSectionProps {
  sacramentos: Sacramento[]
}

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = Icons[name as LucideIconName] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon) return null
  return <Icon size={size} />
}

export default function SacramentosSection({ sacramentos }: SacramentosSectionProps) {
  return (
    <section id="sacramentos" className="py-20 bg-cream-dk">
      <div className="container-site">
        <SectionHeader
          title="Sacramentos"
          subtitle="Os sete sacramentos — sinais visíveis da graça invisível de Deus"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sacramentos.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-burgundy/10 flex items-center justify-center mx-auto mb-4 text-burgundy">
                <DynamicIcon name={s.icone} size={24} />
              </div>
              <h3 className="font-serif text-base font-bold text-burgundy mb-2">{s.nome}</h3>
              <p className="text-sm text-text-soft mb-4 leading-relaxed">{s.descricao}</p>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
              >
                {s.cta} <Icons.ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar `components/sections/PastoralSection.tsx`**

```tsx
import * as Icons from 'lucide-react'

import type { Grupo } from '@/lib/types'

import SectionHeader from '../ui/SectionHeader'

interface PastoralSectionProps {
  grupos: Grupo[]
}

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = Icons[name as LucideIconName] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon) return null
  return <Icon size={size} />
}

export default function PastoralSection({ grupos }: PastoralSectionProps) {
  return (
    <section id="pastoral" className="py-20 bg-white">
      <div className="container-site">
        <SectionHeader
          title="Grupos e Movimentos"
          subtitle="Faça parte de uma comunidade viva e atuante"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="grupos">
          {grupos.map((grupo) => (
            <div
              key={grupo.nome}
              className="bg-cream rounded-xl p-6 hover:shadow-md transition-shadow border border-cream-dk"
            >
              <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center mb-4 text-burgundy">
                <DynamicIcon name={grupo.icone} size={22} />
              </div>
              <h3 className="font-serif text-base font-bold text-burgundy mb-2">{grupo.nome}</h3>
              <p className="text-sm text-text-soft leading-relaxed">{grupo.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Criar `components/sections/DevocoesSection.tsx`**

```tsx
import * as Icons from 'lucide-react'
import { CheckCircle } from 'lucide-react'

import Link from 'next/link'

import type { DevoItem } from '@/lib/types'

import Ornament from '../ui/Ornament'

interface DevocoesSectionProps {
  lista: string[]
  cards: DevoItem[]
}

type LucideIconName = keyof typeof Icons

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = Icons[name as LucideIconName] as React.ComponentType<{ size?: number; className?: string }> | undefined
  if (!Icon) return null
  return <Icon size={size} />
}

export default function DevocoesSection({ lista, cards }: DevocoesSectionProps) {
  return (
    <section id="devocoes" className="py-20 bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Text side */}
          <div>
            <Ornament />
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-burgundy mb-4">
              Devoções Tradicionais
            </h2>
            <p className="text-text-soft mb-6 leading-relaxed">
              O Santuário mantém vivas as tradições devocionais que alimentam a fé do povo
              maranhense há séculos.
            </p>
            <ul className="space-y-3 mb-8">
              {lista.map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-soft">
                  <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#calendario"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk transition-colors"
            >
              Ver Calendário Litúrgico
            </Link>
          </div>

          {/* Cards side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.titulo}
                className="bg-white rounded-xl p-5 shadow-sm border border-cream-dk hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center mb-3 text-burgundy">
                  <DynamicIcon name={card.icone} size={20} />
                </div>
                <h4 className="font-serif text-sm font-bold text-burgundy mb-1">{card.titulo}</h4>
                <p className="text-xs text-text-soft leading-relaxed">{card.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Criar `components/sections/CitacaoSection.tsx`**

```tsx
import { Quote } from 'lucide-react'

export default function CitacaoSection() {
  return (
    <section className="py-20 bg-burgundy">
      <div className="container-site max-w-3xl text-center">
        <Quote size={40} className="text-gold mx-auto mb-6 opacity-60" />
        <p className="font-serif text-[clamp(1.4rem,3vw,2rem)] font-bold text-white mb-4 leading-relaxed">
          "Ide a José!" — Gênesis 41,55
        </p>
        <p className="font-lora italic text-white/70 text-base">
          A Sagrada Escritura, ao falar de José do Egito, prefigurava São José, guardião e protetor
          do Messias.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/sections/SacramentosSection.tsx components/sections/PastoralSection.tsx components/sections/DevocoesSection.tsx components/sections/CitacaoSection.tsx
git commit -m "feat: add Sacramentos, Pastoral, Devocoes, and Citacao section components"
```

---

## Task 11: Server Action + ContatoForm + ContatoSection

**Files:**
- Criar: `app/actions/contato.ts`
- Criar: `components/interactive/ContatoForm.tsx`
- Criar: `components/sections/ContatoSection.tsx`
- Criar: `.env.local.example`

- [ ] **Step 1: Criar `.env.local.example`**

```bash
# Copiar para .env.local e preencher os valores
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Santuário São José <noreply@santuariosjoser.org.br>
RESEND_TO_EMAIL=contato@santuariosjoser.org.br
```

- [ ] **Step 2: Criar `app/actions/contato.ts`**

```typescript
'use server'

import { Resend } from 'resend'
import { z } from 'zod'

import { headers } from 'next/headers'

import type { ContactFormState } from '@/lib/types'

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  assunto: z.string().max(100).optional(),
  mensagem: z.string().min(10, 'Mensagem muito curta').max(2000, 'Mensagem muito longa'),
})

const rateLimit = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 3

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now - entry.ts > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, ts: now })
    return false
  }
  if (entry.count >= MAX_REQUESTS) return true
  entry.count++
  return false
}

export async function enviarContato(
  formData: FormData
): Promise<ContactFormState> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return {
      success: false,
      message: 'Muitas tentativas. Aguarde um momento antes de tentar novamente.',
    }
  }

  const raw = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    assunto: formData.get('assunto'),
    mensagem: formData.get('mensagem'),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.errors[0]
    return { success: false, message: first?.message ?? 'Dados inválidos.' }
  }

  const { nome, email, assunto, mensagem } = parsed.data

  const apiKey = process.env['RESEND_API_KEY']
  const fromEmail = process.env['RESEND_FROM_EMAIL'] ?? 'noreply@santuariosjoser.org.br'
  const toEmail = process.env['RESEND_TO_EMAIL'] ?? 'contato@santuariosjoser.org.br'

  if (!apiKey) {
    return { success: false, message: 'Serviço de e-mail indisponível.' }
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[Site Santuário] ${assunto ?? 'Mensagem de contato'}`,
      text: `Nome: ${nome}\nE-mail: ${email}\nAssunto: ${assunto ?? '—'}\n\n${mensagem}`,
    })

    return { success: true, message: 'Mensagem enviada com sucesso! Responderemos em breve.' }
  } catch {
    return { success: false, message: 'Erro ao enviar mensagem. Tente novamente.' }
  }
}
```

- [ ] **Step 3: Criar `components/interactive/ContatoForm.tsx`**

```tsx
'use client'

import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react'

import { useTransition, useState } from 'react'

import { enviarContato } from '@/app/actions/contato'
import type { ContactFormState } from '@/lib/types'

export default function ContatoForm() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<ContactFormState>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    startTransition(async () => {
      const res = await enviarContato(formData)
      setResult(res)
      if (res?.success) form.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h3 className="font-serif text-xl font-bold text-burgundy mb-6">Envie uma mensagem</h3>

      <div>
        <label htmlFor="nome" className="block text-sm font-semibold text-text mb-1">
          Nome completo
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          required
          placeholder="Seu nome"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-text mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="seu@email.com"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="assunto" className="block text-sm font-semibold text-text mb-1">
          Assunto
        </label>
        <select
          id="assunto"
          name="assunto"
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow"
        >
          <option value="">Selecione um assunto</option>
          <option>Agendamento de Sacramento</option>
          <option>Informações sobre a Festa</option>
          <option>Grupos e Movimentos</option>
          <option>Peregrinação</option>
          <option>Outros</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-semibold text-text mb-1">
          Mensagem
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          required
          placeholder="Sua mensagem..."
          className="w-full px-4 py-3 rounded border border-cream-dk bg-cream focus:outline-none focus:ring-2 focus:ring-burgundy/30 text-sm transition-shadow resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-burgundy text-white font-semibold rounded hover:bg-burgundy-dk disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={18} />
            Enviar Mensagem
          </>
        )}
      </button>

      {result && (
        <div
          className={`flex items-center gap-2 p-4 rounded text-sm font-medium ${
            result.success
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {result.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {result.message}
        </div>
      )}
    </form>
  )
}
```

- [ ] **Step 4: Criar `components/sections/ContatoSection.tsx`**

```tsx
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import ContatoForm from '../interactive/ContatoForm'
import SectionHeader from '../ui/SectionHeader'

export default function ContatoSection() {
  return (
    <section id="contato" className="py-20 bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Entre em Contato"
          subtitle="Estamos aqui para servi-lo"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: 'Endereço',
                lines: ['Praça São José, s/n', 'Centro, São José de Ribamar – MA', 'CEP: 65110-000'],
              },
              {
                icon: Phone,
                title: 'Telefone',
                lines: ['(98) 3227-0000', '(98) 9 9999-9999'],
              },
              {
                icon: Mail,
                title: 'E-mail',
                lines: ['contato@santuariosjoser.org.br'],
              },
              {
                icon: Clock,
                title: 'Secretaria',
                lines: [
                  'Segunda a Sexta: 08h00 às 12h00',
                  'e 14h00 às 18h00',
                  'Sábado: 08h00 às 12h00',
                ],
              },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center shrink-0 text-burgundy">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-burgundy mb-1">{title}</h4>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-text-soft">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-md min-h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31820.476!2d-44.0588!3d-2.5655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f68ce2a57b4e49%3A0x6b8a6b8a6b8a6b8a!2sSão%20José%20de%20Ribamar%2C%20MA!5e0!3m2!1spt!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Santuário"
            />
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <ContatoForm />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verificar tipos**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add app/actions/ components/interactive/ContatoForm.tsx components/sections/ContatoSection.tsx .env.local.example
git commit -m "feat: add contact Server Action with Resend + zod validation and ContatoSection"
```

---

## Task 12: layout.tsx + page.tsx

**Files:**
- Modificar: `app/layout.tsx`
- Modificar: `app/page.tsx`

- [ ] **Step 1: Criar `app/layout.tsx`**

```tsx
import { Cinzel, Lora, Open_Sans } from 'next/font/google'

import type { Metadata } from 'next'

import BackToTop from '@/components/interactive/BackToTop'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Topbar from '@/components/layout/Topbar'

import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://santuariosjoser.org.br'),
  title: {
    default: 'Santuário de São José de Ribamar',
    template: '%s | Santuário SJR',
  },
  description:
    'Santuário de São José de Ribamar — Um lugar de fé, oração e encontro com Deus. Horários de missas, sacramentos e agenda litúrgica.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Santuário de São José de Ribamar',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'Church'],
  name: 'Santuário de São José de Ribamar',
  description: 'Santuário católico dedicado ao padroeiro do Maranhão, São José de Ribamar.',
  url: 'https://santuariosjoser.org.br',
  telephone: '+559832270000',
  email: 'contato@santuariosjoser.org.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Praça São José, s/n',
    addressLocality: 'São José de Ribamar',
    addressRegion: 'MA',
    postalCode: '65110-000',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -2.5655,
    longitude: -44.0588,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '07:00',
      closes: '19:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '07:00',
      closes: '18:30',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${lora.variable} ${openSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Topbar />
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Criar `app/page.tsx`**

```tsx
import type { Metadata } from 'next'

import CalendarioSection from '@/components/sections/CalendarioSection'
import CitacaoSection from '@/components/sections/CitacaoSection'
import ContatoSection from '@/components/sections/ContatoSection'
import DevocoesSection from '@/components/sections/DevocoesSection'
import HeroSection from '@/components/sections/HeroSection'
import MissasSection from '@/components/sections/MissasSection'
import NoticiasSection from '@/components/sections/NoticiasSection'
import PastoralSection from '@/components/sections/PastoralSection'
import SacramentosSection from '@/components/sections/SacramentosSection'
import SaoJoseSection from '@/components/sections/SaoJoseSection'
import SobreSection from '@/components/sections/SobreSection'
import NoticeBar from '@/components/ui/NoticeBar'
import {
  getAgenda,
  getDevocoes,
  getGrupos,
  getMissas,
  getNoticias,
  getSacramentos,
} from '@/lib/data'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Início',
  openGraph: {
    title: 'Santuário de São José de Ribamar',
    description:
      'Santuário de São José de Ribamar — Um lugar de fé, oração e encontro com Deus. Horários de missas, sacramentos e agenda litúrgica.',
    images: ['/img/og-home.jpg'],
  },
  alternates: { canonical: 'https://santuariosjoser.org.br' },
}

export default function HomePage() {
  const missas = getMissas()
  const agenda = getAgenda()
  const noticias = getNoticias()
  const sacramentos = getSacramentos()
  const grupos = getGrupos()
  const devocoes = getDevocoes()

  return (
    <>
      <HeroSection />
      <NoticeBar />
      <MissasSection missas={missas} />
      <CalendarioSection agenda={agenda} />
      <SobreSection />
      <NoticiasSection noticias={noticias} />
      <SaoJoseSection />
      <SacramentosSection sacramentos={sacramentos} />
      <PastoralSection grupos={grupos} />
      <DevocoesSection lista={devocoes.lista} cards={devocoes.cards} />
      <CitacaoSection />
      <ContatoSection />
    </>
  )
}
```

- [ ] **Step 3: Rodar o servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000` no navegador. Verificar:
- Todas as seções renderizam sem erro
- Fontes carregam corretamente (Cinzel nos títulos, Lora nos subtítulos)
- Hero slider funciona (troca de slides a cada 5.5s)
- Menu mobile abre/fecha no viewport < 1024px
- Formulário de contato: preencher e submeter (sem `RESEND_API_KEY` retorna erro de serviço indisponível — comportamento esperado)

- [ ] **Step 4: Verificar tipos e lint**

```bash
npx tsc --noEmit && npm run lint
```

Esperado: sem erros de tipo nem de lint.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: wire up layout.tsx and page.tsx with all sections and metadata"
```

---

## Task 13: SEO — sitemap.ts + robots.ts

**Files:**
- Criar: `app/sitemap.ts`
- Criar: `app/robots.ts`

- [ ] **Step 1: Criar `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://santuariosjoser.org.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

- [ ] **Step 2: Criar `app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://santuariosjoser.org.br/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verificar rotas geradas**

```bash
npm run build 2>&1 | grep -E "sitemap|robots"
```

Esperado: `/sitemap.xml` e `/robots.txt` aparecem nas rotas geradas.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap.ts and robots.ts for SEO"
```

---

## Task 14: Segurança — next.config.ts + build final

**Files:**
- Modificar: `next.config.ts`

- [ ] **Step 1: Criar `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' images.unsplash.com data: blob:",
      "font-src 'self'",
      "frame-src https://www.google.com/maps/",
      "connect-src 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 2: Build de produção**

```bash
npm run build
```

Esperado: build completo sem erros. Output similar a:
```
Route (app)          Size    First Load JS
┌ ○ /                ...     ...
├ ○ /robots.txt      ...
└ ○ /sitemap.xml     ...
```

- [ ] **Step 3: Type check final**

```bash
npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **Step 4: Lint final**

```bash
npm run lint
```

Esperado: zero warnings ou errors.

- [ ] **Step 5: Verificar headers no browser**

```bash
npm run dev
```

Em DevTools > Network, selecionar a request da página `/`. Em Response Headers verificar:
- `x-frame-options: DENY`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`

- [ ] **Step 6: Commit final**

```bash
git add next.config.ts
git commit -m "feat: add security headers and image domain restrictions in next.config.ts"
```

---

## Checklist de verificação final

Antes de considerar a migração completa, verificar manualmente no browser:

- [ ] Hero slider troca de slides automaticamente e ao clicar nos dots
- [ ] Header fica sticky ao rolar a página
- [ ] Menu hamburger abre/fecha no mobile (viewport < 1024px)
- [ ] Dropdowns do menu funcionam no desktop (hover) e mobile (clique)
- [ ] Todas as seções renderizam com o design correto
- [ ] Imagens carregam com lazy loading (verificar Network tab)
- [ ] Formulário de contato: campos de validação HTML5 funcionam
- [ ] Botão "Voltar ao topo" aparece após rolar 400px
- [ ] `http://localhost:3000/sitemap.xml` retorna XML válido
- [ ] `http://localhost:3000/robots.txt` retorna texto correto
- [ ] `npm run build` conclui sem erros
- [ ] `npx tsc --noEmit` retorna zero erros
