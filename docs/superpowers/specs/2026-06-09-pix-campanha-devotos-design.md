---
title: Botão Pix — Campanha dos Devotos
date: 2026-06-09
status: approved
---

## Visão Geral

Botão flutuante fixo na lateral direita da página inicial que abre um popover com QR Code e chave Pix para doações da Campanha dos Devotos.

## Escopo

- Aparece **somente na página inicial** (`app/page.tsx`)
- Acompanha o scroll do usuário (posição `fixed`)
- Não altera o Header, layout global ou outras páginas

## Componente

**Arquivo:** `components/interactive/PixCampanhaButton.tsx`
**Tipo:** Client Component (`'use client'`)

### Botão Flutuante

- Posição: `fixed right-0 top-1/2 -translate-y-1/2 z-40`
- Visual: fundo `burgundy`, texto branco, borda arredondada apenas no lado esquerdo (`rounded-l-lg`)
- Texto "Campanha dos Devotos" rotacionado 90° (`rotate-90` ou `writing-mode: vertical-rl`) em `font-serif`
- Pequeno ícone de coração antes do texto
- No mobile (`lg` breakpoint abaixo): exibe apenas o ícone, sem texto, para não bloquear conteúdo

### Popover

Abre ao clicar no botão, posicionado à esquerda do botão flutuante.

**Conteúdo:**
1. Cabeçalho com título "Campanha dos Devotos" (`font-serif`, cor `burgundy`) + botão X para fechar
2. Subtítulo pastoral curto (ex: "Contribua com o Santuário de São José de Ribamar")
3. Área do QR Code:
   - Enquanto não houver imagem: placeholder cinza quadrado com texto "QR Code em breve"
   - Quando disponível: `<Image src="/img/pix-qrcode.png" ... />` — trocar o placeholder por este
4. Chave Pix:
   - Label "Chave Pix (telefone)"
   - Valor `(98) 98893-0158` em `font-mono` destacado
   - Botão "Copiar" com feedback "Copiado!" por 2 segundos (mesmo padrão do `Topbar.tsx`)
5. Rodapé opcional: "Que São José abençoe sua oferta 🙏" em `font-lora italic text-text-soft`

**Dimensões:** `w-72` no desktop, `w-[calc(100vw-2rem)]` no mobile com max `w-80`

**Fechamento:**
- Clicar no X interno
- Clicar fora do popover (overlay transparente ou `useEffect` com listener no documento)

**Animação:** `transition-all duration-200` com `opacity-0 scale-95` → `opacity-100 scale-100`

## Integração

Em `app/page.tsx`, importar e adicionar `<PixCampanhaButton />` no final do JSX (antes do `</main>` ou após as seções), junto com os outros client components da página.

## Assets

- **QR Code:** ainda não disponível. Placeholder usado até o arquivo `/public/img/pix-qrcode.png` existir.
- **Chave Pix:** `(98) 98893-0158`

## Substituição do QR Code (quando disponível)

1. Adicionar a imagem em `public/img/pix-qrcode.png`
2. No componente, trocar o bloco do placeholder pelo `<Image>`:
   ```tsx
   <Image src="/img/pix-qrcode.png" alt="QR Code Pix" width={200} height={200} />
   ```

## Fora de escopo

- Integração com API de pagamento real
- Contador de doações ou metas
- Animação de entrada na primeira visita
- Exibição em páginas secundárias
