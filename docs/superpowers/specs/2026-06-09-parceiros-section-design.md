# Seção Parceiros — Design Spec

**Data:** 2026-06-09
**Status:** Aprovado

---

## Objetivo

Adicionar uma seção "Parceiros e Veículos de Comunicação" à página inicial, exibida imediatamente abaixo da `NoticiasSection` (ou no mesmo slot quando não há notícias). A seção apresenta logos clicáveis de canais parceiros em um carrossel horizontal com rolagem automática contínua (CSS marquee).

---

## Posicionamento na página

Em `app/page.tsx`, a seção é inserida logo após o bloco condicional de notícias:

```tsx
{noticias.length >= 2 && <NoticiasSection noticias={noticias} />}
<ParceirosSection />   {/* sempre renderizado */}
<SaoJoseSection />
```

---

## Parceiros (dados hardcoded no componente)

| Nome                     | Logo (arquivo)              | URL de destino                   |
|--------------------------|-----------------------------|----------------------------------|
| Vatican News             | `vatican-new.webp`          | `https://www.vaticannews.va/pt.html` |
| Rádio Educadora          | `educadora-fm-catolica.webp`| `https://educadora560.com.br/`   |
| Arquidiocese de São Luís | `arquidiocese.webp`         | `https://arquislz.org.br/`       |
| CNBB                     | `cnbb.webp`                 | `https://www.cnbb.org.br/`       |

> **Nota:** As imagens devem ser colocadas em `public/img/parceiros/` antes da implementação.

---

## Componente

**Arquivo:** `components/sections/ParceirosSection.tsx`
**Tipo:** Server Component (sem `'use client'`)

### Estrutura JSX

```
<section id="parceiros" className="py-16 bg-cream-dk overflow-hidden">
  <div className="container-site">
    <SectionHeader title="Parceiros e Veículos de Comunicação" />
  </div>
  <div className="marquee-track-wrapper"> {/* overflow-hidden, full-width */}
    <div className="marquee-track"> {/* flex, animação CSS */}
      {/* items duplicados × 2 para loop infinito */}
      {[...parceiros, ...parceiros].map((p, i) => (
        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
           className="parceiro-item">
          <Image src={p.logo} alt={p.nome} width={120} height={60}
                 className="object-contain" />
          <span>Acessar</span>
        </a>
      ))}
    </div>
  </div>
</section>
```

### Animação CSS

Definida via `globals.css` ou Tailwind `@layer utilities`:

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 20s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}
```

A duplicação (`[...parceiros, ...parceiros]`) garante que quando o primeiro bloco sai pela esquerda, o segundo já está visível — loop perfeito sem salto.

### Estilo de cada item

```
flex-col, items-center, gap-2, px-10
logo: object-contain, max-h-[60px], w-auto, grayscale hover:grayscale-0 transition
span "Acessar": text-xs font-semibold text-burgundy uppercase tracking-wide
```

Hover no item: opacidade sobe (`opacity-60 → opacity-100`) e logo sai do grayscale — feedback visual sem interromper a faixa.

---

## Imagens

- Pasta: `public/img/parceiros/`
- Formato: `.webp` conforme nomes definidos pelo usuário
- Dimensão de display: `120 × 60` (logo ocupa até 120px de largura, 60px de altura, `object-contain`)
- Next.js `<Image>` com `width` e `height` fixos — sem `fill`

---

## Acessibilidade

- Cada `<a>` tem `aria-label="Acessar [Nome do Parceiro]"` para leitores de tela
- `rel="noopener noreferrer"` em todos os links externos
- Animação respeita `prefers-reduced-motion` via `@media`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; }
  }
  ```

---

## Fora do escopo

- Dados vindos de banco/CMS — hardcoded por ora
- Controles manuais (setas, dots)
- Fundação Dom Delgado — não foi incluída pois o usuário não forneceu logo/link; pode ser adicionada depois seguindo o mesmo padrão
