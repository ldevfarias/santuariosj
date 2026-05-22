# Design: Bênção do Dia

**Data:** 2026-05-22
**Status:** Aprovado

## Contexto

O padre solicitou que todo fiel ao entrar no site receba uma bênção de boas-vindas — uma imagem do São José acompanhada de um texto de bênção. A bênção muda diariamente, com imagem e texto rotacionando com base na data.

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Frequência | A cada visita | Fiel sempre recebe a bênção ao entrar |
| Conteúdo | Imagem + texto | Mais impactante e litúrgico |
| Variação | Diária (baseada na data) | Coerente com o ritmo litúrgico; todos recebem a mesma bênção no mesmo dia |
| Apresentação | Modal centralizado | Tom solene, não intrusivo |
| Textos | Arquivo fixo no código | Simples agora; estrutura pensada para automação futura com calendário litúrgico |
| Imagens | 7 imagens (uma por dia da semana) | O padre vai fornecer o conjunto de imagens |

## Arquitetura

### Novos arquivos

```
data/bencaos.ts                         # Dados: textos e caminhos de imagens
public/img/bencao/                      # Imagens do santo (domingo.jpg, segunda.jpg, ...)
components/interactive/BencaoModal.tsx  # Client Component — modal de bênção
```

### Modificação

- [app/layout.tsx](app/layout.tsx) — importar e montar `<BencaoModal />` dentro do `<body>`, após `<HashScrollFix />`

## Estrutura de dados (`data/bencaos.ts`)

```ts
export const BENCAOS = [
  { texto: "Que São José te abençoe e proteja neste dia.", autor: "Oração tradicional" },
  // ... mais textos (~10 iniciais, expansível para 365)
]

export const IMAGENS_SANTO: string[] = [
  "/img/bencao/domingo.jpg",
  "/img/bencao/segunda.jpg",
  "/img/bencao/terca.jpg",
  "/img/bencao/quarta.jpg",
  "/img/bencao/quinta.jpg",
  "/img/bencao/sexta.jpg",
  "/img/bencao/sabado.jpg",
]
```

**Lógica de seleção (no cliente):**

```ts
const hoje = new Date()
const diaSemana = hoje.getDay()            // 0–6 → índice da imagem
const diaAno = getDayOfYear(hoje)          // 1–365 → índice do texto
const imagem = IMAGENS_SANTO[diaSemana]
const bencao = BENCAOS[diaAno % BENCAOS.length]
```

## Componente `BencaoModal`

**Tipo:** Client Component (`'use client'`)

**Estado:** `const [aberto, setAberto] = useState(false)`

**Comportamento:**
- `useEffect` roda uma vez no cliente: calcula dia, define imagem + texto, abre o modal
- Fecha ao clicar no botão "Amém" ou pressionar `Escape`
- Foco preso no modal enquanto aberto (`focus trap`)

**Visual:**
- Backdrop: fundo escurecido com `backdrop-blur-sm`
- Card: centralizado, fundo `--cream`, borda `--gold`, sombra elevada, `max-w-md`
- Imagem do santo: topo do card, `object-cover`, altura fixa ~220px, bordas arredondadas no topo
- Título "✝ Bênção do Dia": fonte Cinzel, cor `--gold`, centralizado
- Texto da bênção: fonte Lora, itálico, centralizado, cor `--burgundy-dk`
- Autor (opcional): Open Sans, pequeno, cinza
- Botão "Amém": componente `Button` existente, variante primary (`--burgundy`), largura total

**Acessibilidade:**
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apontando para o título
- Fecha com `Escape`
- Foco inicial no botão "Amém" ao abrir

## Expansão futura (fora do escopo agora)

- Substituir seleção por data do dia por integração com API de calendário litúrgico
- Painel administrativo para o padre editar textos sem tocar no código
- Persistência com `localStorage` para exibir apenas uma vez por dia (atualmente: a cada visita)

## Arquivos afetados

| Arquivo | Ação |
|---|---|
| `data/bencaos.ts` | Criar |
| `public/img/bencao/*.jpg` | Adicionar (fornecidas pelo padre) |
| `components/interactive/BencaoModal.tsx` | Criar |
| `app/layout.tsx` | Modificar — adicionar `<BencaoModal />` |
