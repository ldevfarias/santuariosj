# Design: Modal de Bênção do Dia

**Data:** 2026-06-08
**Status:** Aprovado

## Objetivo

Exibir um modal com a bênção do dia ao carregar qualquer página do site. A bênção é selecionada com base no dia da semana atual, usando dados da tabela `bencao_dia` no banco de dados.

## Regra de negócio

- A tabela `bencao_dia` contém até 7 registros, um por dia da semana.
- O campo `dia` é informativo (ex.: "domingo", "segunda"); a seleção usa o índice posicional ordenado por `ordem ASC` (ordem 1 = domingo, 2 = segunda… 7 = sábado).
- `new Date().getDay()` retorna 0 (domingo) a 6 (sábado) — usado diretamente como índice no array retornado pela query.
- Se o array estiver vazio ou o índice não existir, o modal não é renderizado.
- O modal aparece toda vez que a página é carregada, sem persistência em `localStorage`.
- Fecha somente ao clicar no botão "Amém".

## Arquitetura

### Fluxo de dados

```
layout.tsx (Server Component)
  └─ getBencaoDia()           ← query ao banco, cache 3600s
       └─ BencaoModal (Client Component)
            ├─ new Date().getDay() → índice do dia
            └─ exibe bênção do dia ou nada (fallback seguro)
```

### Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `components/interactive/BencaoModal.tsx` | **Novo** — Client Component |
| `app/layout.tsx` | Adicionar `getBencaoDia()` e `<BencaoModal bencaos={bencaos} />` no `<body>` |

## Componente `BencaoModal`

### Props

```ts
type BencaoDiaRow = {
  id: number
  ordem: number
  dia: string
  mensagem: string
  autor: string
  imagem: string
}

// Props recebidas
{ bencaos: BencaoDiaRow[] }
```

### Comportamento

- `useState(true)` — modal aberto por padrão
- Calcula o índice: `const idx = new Date().getDay()` (0–6)
- Se `bencaos[idx]` não existir → retorna `null`
- Fecha ao clicar "Amém": `setOpen(false)`

### Estrutura visual

```
fixed inset-0 bg-black/60 z-50          ← overlay
  └─ card max-w-sm mx-auto (cream)
       ├─ next/image (campo imagem)     ← topo do card, aspect-ratio 4/3
       ├─ "† BÊNÇÃO DO DIA"            ← font-serif, text-gold, texto centrado
       ├─ mensagem                     ← font-lora italic, texto centrado
       └─ botão "Amém"                 ← bg-burgundy, text-white, w-full
```

### Acessibilidade

- `role="dialog"` e `aria-modal="true"` no card
- `aria-labelledby` apontando para o título
- `autoFocus` no botão "Amém" ao montar

### Animação

- Fade-in via Tailwind: `transition-opacity duration-300`
- Sem animação de saída (fecha imediatamente ao clicar)

## O que não está no escopo

- Campo `autor` — não exibido
- Persistência via `localStorage`
- Botão de fechar (X) — apenas o botão "Amém"
- Exibição condicional por página (aparece em todas)
