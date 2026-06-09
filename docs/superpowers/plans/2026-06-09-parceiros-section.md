# ParceirosSection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar a seção "Parceiros e Veículos de Comunicação" à página inicial com um carrossel CSS marquee horizontal e infinito exibindo logos clicáveis dos parceiros.

**Architecture:** Server Component estático com dados hardcoded. A animação é feita 100% em CSS via `@keyframes marquee` em `globals.css` — sem JS, sem dependências extras. Os logos são servidos como arquivos estáticos em `public/img/parceiros/`.

**Tech Stack:** Next.js 14+ App Router, React Server Components, Tailwind CSS v4 (`@theme`/`@layer`/`@utility`), `next/image`

---

## File Map

| Ação    | Arquivo                                          | Responsabilidade                            |
|---------|--------------------------------------------------|---------------------------------------------|
| Create  | `components/sections/ParceirosSection.tsx`       | Componente da seção com marquee             |
| Modify  | `app/globals.css`                                | Adicionar `@keyframes marquee` e utilitários |
| Modify  | `app/page.tsx`                                   | Importar e posicionar `<ParceirosSection />` |
| Add     | `public/img/parceiros/vatican-new.webp`          | Logo Vatican News                           |
| Add     | `public/img/parceiros/educadora-fm-catolica.webp`| Logo Rádio Educadora                        |
| Add     | `public/img/parceiros/arquidiocese.webp`         | Logo Arquidiocese de São Luís               |
| Add     | `public/img/parceiros/cnbb.webp`                 | Logo CNBB                                   |

---

## Task 1: Adicionar imagens dos parceiros

**Files:**
- Add: `public/img/parceiros/vatican-new.webp`
- Add: `public/img/parceiros/educadora-fm-catolica.webp`
- Add: `public/img/parceiros/arquidiocese.webp`
- Add: `public/img/parceiros/cnbb.webp`

- [ ] **Step 1: Criar a pasta**

```powershell
New-Item -ItemType Directory -Force "public/img/parceiros"
```

- [ ] **Step 2: Copiar os arquivos de imagem fornecidos pelo usuário**

Mover ou copiar cada arquivo para `public/img/parceiros/` com os nomes exatos:
- `vatican-new.webp`
- `educadora-fm-catolica.webp`
- `arquidiocese.webp`
- `cnbb.webp`

> Os arquivos devem vir do usuário ou de um diretório temporário. Não baixar da internet.

- [ ] **Step 3: Verificar que os 4 arquivos existem**

```powershell
Get-ChildItem public/img/parceiros/
```

Saída esperada: 4 arquivos `.webp` listados.

- [ ] **Step 4: Commit**

```bash
git add public/img/parceiros/
git commit -m "assets: add partner logos to public/img/parceiros"
```

---

## Task 2: Adicionar animação marquee ao globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Adicionar `@keyframes` e utilitários CSS ao final de `app/globals.css`**

Adicionar exatamente este bloco ao final do arquivo:

```css
/* ── Parceiros marquee ─────────────────────────────────────────────── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 22s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
```

- [ ] **Step 2: Verificar que o arquivo foi salvo corretamente**

```powershell
Select-String -Path "app/globals.css" -Pattern "marquee"
```

Saída esperada: linhas com `marquee` encontradas.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add CSS marquee animation for ParceirosSection"
```

---

## Task 3: Criar o componente ParceirosSection

**Files:**
- Create: `components/sections/ParceirosSection.tsx`

- [ ] **Step 1: Criar o arquivo com o seguinte conteúdo**

```tsx
import Image from 'next/image'

import SectionHeader from '../ui/SectionHeader'

const parceiros = [
  {
    nome: 'Vatican News',
    logo: '/img/parceiros/vatican-new.webp',
    url: 'https://www.vaticannews.va/pt.html',
  },
  {
    nome: 'Rádio Educadora',
    logo: '/img/parceiros/educadora-fm-catolica.webp',
    url: 'https://educadora560.com.br/',
  },
  {
    nome: 'Arquidiocese de São Luís',
    logo: '/img/parceiros/arquidiocese.webp',
    url: 'https://arquislz.org.br/',
  },
  {
    nome: 'CNBB',
    logo: '/img/parceiros/cnbb.webp',
    url: 'https://www.cnbb.org.br/',
  },
]

export default function ParceirosSection() {
  const track = [...parceiros, ...parceiros]

  return (
    <section id="parceiros" className="py-16 bg-cream-dk overflow-hidden">
      <div className="container-site">
        <SectionHeader
          title="Parceiros e Veículos de Comunicação"
          subtitle="Fontes de fé, informação e comunhão eclesial"
        />
      </div>

      <div className="overflow-hidden w-full" aria-label="Carrossel de parceiros">
        <div className="marquee-track">
          {track.map((parceiro, i) => (
            <a
              key={i}
              href={parceiro.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Acessar ${parceiro.nome}`}
              className="flex flex-col items-center gap-2 px-10 opacity-60 hover:opacity-100 transition-opacity duration-300 group"
            >
              <Image
                src={parceiro.logo}
                alt={parceiro.nome}
                width={120}
                height={60}
                className="object-contain max-h-[60px] w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-xs font-semibold text-burgundy uppercase tracking-wide">
                Acessar
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar que o arquivo foi criado**

```powershell
Test-Path "components/sections/ParceirosSection.tsx"
```

Saída esperada: `True`

- [ ] **Step 3: Commit**

```bash
git add components/sections/ParceirosSection.tsx
git commit -m "feat: add ParceirosSection with CSS marquee"
```

---

## Task 4: Registrar a seção em app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Adicionar o import de `ParceirosSection`**

No bloco de imports de `app/page.tsx`, adicionar após o import de `NoticiasSection`:

```tsx
import ParceirosSection from '@/components/sections/ParceirosSection'
```

- [ ] **Step 2: Posicionar `<ParceirosSection />` no JSX**

Localizar o bloco:

```tsx
{noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
<SaoJoseSection />
```

Substituir por:

```tsx
{noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
<ParceirosSection />
<SaoJoseSection />
```

- [ ] **Step 3: Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit
```

Saída esperada: sem erros.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render ParceirosSection on home page below noticias"
```

---

## Task 5: Verificação visual no browser

**Files:** nenhum (verificação)

- [ ] **Step 1: Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

Abrir `http://localhost:3000` no browser.

- [ ] **Step 2: Verificar checklist visual**

- [ ] A seção aparece abaixo de Notícias (ou logo após o Hero quando não há notícias)
- [ ] Os 4 logos são exibidos e animam da direita para a esquerda continuamente
- [ ] Hover na faixa pausa a animação
- [ ] Hover em um item específico: opacidade sobe e logo sai do grayscale
- [ ] Clique em cada logo abre a URL correta em nova aba
- [ ] Em mobile (≤ 768px) a animação funciona sem overflow visível
- [ ] Com `prefers-reduced-motion` ativado nas preferências do SO, a animação fica estática (logos visíveis, sem movimento)

- [ ] **Step 3: Commit final se necessário**

Se ajustes foram feitos durante a verificação:

```bash
git add -p
git commit -m "fix: visual adjustments to ParceirosSection"
```
