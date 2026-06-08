# Design: Dinamizar Comunidades via Banco de Dados

**Data:** 2026-06-08
**Status:** Aprovado

## Contexto

A seção de comunidades do site do Santuário de São José de Ribamar consumia dados de um arquivo JSON estático (`data/comunidades.json`). O banco de dados MySQL agora possui a tabela `comunidades` e os dados devem ser lidos de lá, seguindo o padrão já adotado para missas, sacerdotes, grupos e outros.

## Schema do banco

```sql
CREATE TABLE comunidades (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  ordem       INT NOT NULL DEFAULT 0,
  nome        VARCHAR(255) NOT NULL,
  endereco    VARCHAR(500) NOT NULL,
  celebracoes TEXT NOT NULL DEFAULT '',
  mapa_url    VARCHAR(500) NOT NULL DEFAULT '',
  imagem      VARCHAR(500) NOT NULL DEFAULT ''
)
```

## Decisões

- **Uma imagem por comunidade** — o card atual usava duas imagens (principal + secundária); o layout será simplificado para imagem única, alinhado ao schema real.
- **`endereco` substitui `bairro`** — label no card muda de "Bairro:" para "Endereço:".
- **`celebracoes` como texto simples** — exibido em linha, sem parse de lista.

## Tipo `Comunidade` (lib/types.ts)

Substituir os campos atuais pelos campos do banco:

```ts
export type Comunidade = {
  id: number
  nome: string
  endereco: string
  celebracoes: string
  mapaUrl: string
  imagem: string
}
```

Campos removidos: `slug`, `bairro`, `imagemPrincipal`, `imagemPrincipalAlt`, `imagemSecundaria`, `imagemSecundariaAlt`.

## Função `getComunidades` (lib/data.ts)

Migrar de leitura síncrona de JSON para query async com `dbCache`:

```ts
type ComunidadeRow = {
  id: number; ordem: number; nome: string; endereco: string
  celebracoes: string; mapa_url: string; imagem: string
}

export const getComunidades = dbCache(
  async (): Promise<Comunidade[]> => {
    const rows = await query<ComunidadeRow>('SELECT * FROM comunidades ORDER BY ordem ASC')
    return rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      endereco: r.endereco,
      celebracoes: r.celebracoes,
      mapaUrl: r.mapa_url,
      imagem: r.imagem,
    }))
  },
  ['comunidades'],
  { revalidate: 1800, tags: ['comunidades'] }
)
```

## Page `app/comunidades/page.tsx`

- Tornar `ComunidadesPage` async
- `await getComunidades()` em vez da chamada síncrona
- Remover bloco de imagem dupla; usar `<Image>` única com `src={comunidade.imagem}`
- `comunidade.bairro` → `comunidade.endereco`, label "Bairro:" → "Endereço:"
- `comunidade.celebracao` → `comunidade.celebracoes`
- `key={comunidade.id}` permanece válido (agora `number`)

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `lib/types.ts` | Reescrever tipo `Comunidade` |
| `lib/data.ts` | Migrar `getComunidades` para dbCache async |
| `app/comunidades/page.tsx` | Tornar async, ajustar campos e layout do card |

## Fora de escopo

- Migração dos dados do JSON para o banco (responsabilidade do time/admin)
- Alterações em outras páginas ou componentes
