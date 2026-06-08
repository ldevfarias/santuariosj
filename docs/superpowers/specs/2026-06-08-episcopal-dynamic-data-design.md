---
name: episcopal-dynamic-data
description: Tornar a seção episcopal 100% dinâmica — padres, diáconos e bispo vindos do banco, sem dados hardcoded
metadata:
  type: project
---

# Design: Seção Episcopal — Dados 100% Dinâmicos

**Data:** 2026-06-08  
**Escopo:** `lib/types.ts`, `lib/data.ts`, `app/episcopal/page.tsx`, `app/episcopal/components/PriestCard.tsx`, `next.config.ts`

---

## Contexto

A página `/episcopal` já busca bispo e padres do banco via `getSacerdotes()` (tabela `episcopal`). Porém:

- Os **diáconos** estão hardcoded em `page.tsx` com nomes, bios e fotos estáticas.
- O campo `cargo` do banco (`bispo | reitor | paroco_solidario | diacono`) não é preservado no tipo `Sacerdote`, impedindo a filtragem correta.
- O badge de cargo no `PriestCard` exibe o valor bruto do banco (`paroco_solidario`, `diacono`), que não é legível.
- O CSP em `next.config.ts` não inclui o domínio R2, o que impede o carregamento de imagens hospedadas lá.

---

## Mudanças

### 1. `lib/types.ts` — campo `cargo` tipado

Adicionar `cargo` ao tipo `Sacerdote` preservando o valor original do banco:

```ts
export type Sacerdote = {
  id: string
  nome: string
  titulo: string
  cargo: 'bispo' | 'reitor' | 'paroco_solidario' | 'diacono' | string
  foto: string
  bio: string
  bispo: boolean
}
```

O campo `bispo: boolean` é mantido por compatibilidade com `BishopHighlight`.

### 2. `lib/data.ts` — garantir que `cargo` é mapeado

O mapeamento atual já inclui `cargo: r.cargo` (linha 181) — nenhuma alteração necessária aqui.

### 3. `app/episcopal/page.tsx` — separação por `cargo`

Substituir a lógica atual e remover o array hardcoded de diáconos:

```ts
const bispo    = sacerdotes.find(s => s.cargo === 'bispo')
const padres   = sacerdotes.filter(s => s.cargo === 'reitor' || s.cargo === 'paroco_solidario')
const diacono  = sacerdotes.filter(s => s.cargo === 'diacono')
```

Passar `diacono` para o segundo `<PriestsGrid>` no lugar do array estático.

### 4. `app/episcopal/components/PriestCard.tsx` — label legível no badge

Adicionar mapa de labels antes do componente:

```ts
const CARGO_LABEL: Record<string, string> = {
  bispo: 'Bispo',
  reitor: 'Reitor',
  paroco_solidario: 'Pároco Solidário',
  diacono: 'Diácono Permanente',
}
```

Usar no badge: `{CARGO_LABEL[padre.cargo] ?? padre.cargo}`

### 5. `next.config.ts` — CSP para imagens R2

Adicionar o wildcard R2 ao `img-src` do Content-Security-Policy:

```
img-src 'self' images.unsplash.com https://placehold.co https://*.r2.dev data: blob:
```

---

## O que NÃO muda

- Estrutura visual dos componentes (`PriestsGrid`, `PriestCard`, `BishopHighlight`)
- Query SQL (`SELECT * FROM episcopal ORDER BY ordem ASC`)
- Cache de 30 min com revalidate por tag `episcopal`
- `BishopHighlight` continua recebendo `bispo` como antes

---

## Critérios de aceitação

- [ ] Página `/episcopal` não contém nenhum dado hardcoded de sacerdote/diácono
- [ ] Seção "Diáconos Permanentes" exibe registros do banco com `cargo = 'diacono'`
- [ ] Seção "Nossos Padres" exibe apenas `cargo IN ('reitor', 'paroco_solidario')`
- [ ] Badge de cargo exibe texto legível em português
- [ ] Imagens do R2 carregam sem erro de CSP ou Next.js Image
