# Frontend Build Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduzir o tempo de build do Next.js de ~40s para <20s eliminando arquivos gerados desnecessários e aplicando lazy loading em dependências pesadas.

**Architecture:** Três frentes independentes: (1) excluir `src/generated` do type-check do TypeScript, que representa 489 de 686 arquivos `.ts` compilados; (2) remover o plugin Zod do Kubb e migrar as 2 únicas importações de zod gerado para schemas locais inline; (3) aplicar `next/dynamic` em `@react-pdf/renderer` e `recharts` para tirá-los do bundle principal.

**Tech Stack:** Next.js 16, TypeScript 5, Kubb 4, Zod 4, `@react-pdf/renderer`, `recharts`, `driver.js`

---

## Mapa de arquivos

| Arquivo | Ação | Motivo |
|---|---|---|
| `apps/odonto-front/tsconfig.json` | Modificar | Adicionar `src/generated` ao `exclude` |
| `apps/odonto-front/run-kubb.mjs` | Modificar | Remover `pluginZod` |
| `apps/odonto-front/kubb.config.ts` | Modificar | Remover `pluginZod` |
| `apps/odonto-front/src/app/register/[token]/page.tsx` | Modificar | Substituir import de zod gerado por schema local inline |
| `apps/odonto-front/src/components/patients/Odontogram/ToothPopover.tsx` | Modificar | Substituir import de zod gerado por schema local inline |
| `apps/odonto-front/src/components/patients/BudgetPdfButton.tsx` | Modificar | Lazy load de `@react-pdf/renderer` via `next/dynamic` |
| `apps/odonto-front/src/app/(app)/dashboard/components/RevenueChart.tsx` | Modificar | Lazy load de `recharts` via `next/dynamic` |

---

## Task 1: Excluir `src/generated` do type-check do TypeScript

**Impacto:** Remove 489 arquivos da compilação do TypeScript. Os arquivos gerados pelo Kubb têm tipagem correta por construção — erros de tipo aparecem no código do app ao *usar* o gerado, não no gerado em si.

**Files:**
- Modify: `apps/odonto-front/tsconfig.json`

- [ ] **Step 1: Adicionar `src/generated` ao campo `exclude` do tsconfig**

Abrir [apps/odonto-front/tsconfig.json](apps/odonto-front/tsconfig.json) e alterar o campo `exclude`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "allowSyntheticDefaultImports": true,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules", "src/generated"]
}
```

- [ ] **Step 2: Verificar que o TypeScript ainda encontra os tipos gerados**

O Next.js usa `moduleResolution: bundler` — os imports `@/generated/...` ainda funcionam porque o TypeScript resolve os caminhos via path alias e o bundler (webpack/turbopack) empacota os arquivos. O `exclude` apenas retira os arquivos do type-check proativo, não dos imports explícitos.

Execute no diretório `apps/odonto-front`:

```bash
npx tsc --noEmit 2>&1 | head -30
```

Resultado esperado: zero erros (ou os mesmos erros que existiam antes — não devem aparecer erros *novos*).

- [ ] **Step 3: Commit**

```bash
git add apps/odonto-front/tsconfig.json
git commit -m "perf(frontend): exclude generated files from TypeScript type-checking"
```

---

## Task 2: Remover plugin Zod do Kubb e migrar schemas para inline

O `pluginZod` gera 132 arquivos de schema. Apenas 2 locais no app os importam. Vamos substituir essas 2 importações por schemas Zod escritos inline — mais simples e sem dependência do pipeline de geração.

**Files:**
- Modify: `apps/odonto-front/run-kubb.mjs`
- Modify: `apps/odonto-front/kubb.config.ts`
- Modify: `apps/odonto-front/src/app/register/[token]/page.tsx`
- Modify: `apps/odonto-front/src/components/patients/Odontogram/ToothPopover.tsx`

- [ ] **Step 1: Inspecionar o que `authControllerRegisterMutationRequestSchema` valida**

Abrir [apps/odonto-front/src/generated/zod/authControllerRegisterSchema.ts](apps/odonto-front/src/generated/zod/authControllerRegisterSchema.ts) e anotar os campos. O schema gerado valida o body da mutation `POST /auth/register`. Campos esperados: `token` (string), `name` (string), `password` (string).

- [ ] **Step 2: Inspecionar o que `createToothObservationDtoSchema` valida**

Abrir [apps/odonto-front/src/generated/zod/createToothObservationDtoSchema.ts](apps/odonto-front/src/generated/zod/createToothObservationDtoSchema.ts) e anotar os campos do DTO de criação de observação de dente.

- [ ] **Step 3: Migrar schema de registro inline em `register/[token]/page.tsx`**

No arquivo [apps/odonto-front/src/app/register/[token]/page.tsx](apps/odonto-front/src/app/register/[token]/page.tsx):

**Remover:**
```ts
import { authControllerRegisterMutationRequestSchema } from '@/generated/zod/authControllerRegisterSchema';
```

**Adicionar logo após os outros imports de `z`:**
```ts
const registerFormSchema = z.object({
  token: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})
```

**Substituir o uso do tipo gerado:**
```ts
// De:
type RegisterFormValues = z.infer<typeof authControllerRegisterMutationRequestSchema>;
// Para:
type RegisterFormValues = z.infer<typeof registerFormSchema>;
```

**Substituir no `useForm`:**
```ts
// De:
resolver: zodResolver(authControllerRegisterMutationRequestSchema),
// Para:
resolver: zodResolver(registerFormSchema),
```

- [ ] **Step 4: Inspecionar ToothPopover para entender como o schema Zod gerado é estendido**

Abrir [apps/odonto-front/src/components/patients/Odontogram/ToothPopover.tsx](apps/odonto-front/src/components/patients/Odontogram/ToothPopover.tsx) e verificar como `createToothObservationDtoSchema` é usado (possivelmente via `.extend()` ou `.merge()`).

- [ ] **Step 5: Migrar schema de observação de dente inline em `ToothPopover.tsx`**

Com base na inspeção do Step 4 e do arquivo do schema gerado, substituir o import do schema gerado por um schema local inline. O schema do DTO de observação deve ter os campos: `toothNumber` (number), `observation` (string), e quaisquer outros campos que estejam no DTO gerado.

Exemplo (ajustar campos conforme o schema gerado inspecionado no Step 2):

**Remover:**
```ts
import { createToothObservationDtoSchema } from '@/generated/zod/createToothObservationDtoSchema';
```

**Adicionar schema inline** (antes do componente, após os imports):
```ts
const toothObservationSchema = z.object({
  toothNumber: z.number(),
  observation: z.string().min(1, 'Observação é obrigatória'),
  // adicionar demais campos conforme o schema gerado
})
```

Substituir todas as referências a `createToothObservationDtoSchema` por `toothObservationSchema` no arquivo.

- [ ] **Step 6: Remover `pluginZod` do `run-kubb.mjs`**

No arquivo [apps/odonto-front/run-kubb.mjs](apps/odonto-front/run-kubb.mjs), remover:

```js
// Remover este import:
import { pluginZod } from '../../node_modules/@kubb/plugin-zod/dist/index.js';

// Remover da lista de plugins:
pluginZod({ output: { path: './zod' } }),
```

Resultado: o array `plugins` deve ficar:
```js
plugins: [
  pluginOas({ validate: true }),
  pluginTs({ output: { path: './ts' } }),
  pluginClient({
    output: { path: './clients' },
    importPath: '@/lib/api',
  }),
  pluginReactQuery({
    output: { path: './hooks' },
    client: {
      importPath: '@/lib/api',
    },
  }),
],
```

- [ ] **Step 7: Remover `pluginZod` do `kubb.config.ts`**

No arquivo [apps/odonto-front/kubb.config.ts](apps/odonto-front/kubb.config.ts), remover:

```ts
// Remover este import:
import { pluginZod } from '@kubb/plugin-zod';

// Remover da lista de plugins:
pluginZod({ output: { path: './zod' } }),
```

- [ ] **Step 8: Deletar a pasta `src/generated/zod/` existente**

Após remover o plugin, deletar manualmente a pasta gerada para evitar que o TypeScript a processe e para remover os arquivos obsoletos:

```bash
# Em apps/odonto-front/
rm -rf src/generated/zod
```

No Windows PowerShell:
```powershell
Remove-Item -Recurse -Force apps\odonto-front\src\generated\zod
```

- [ ] **Step 9: Verificar que o build não quebrou**

No diretório `apps/odonto-front`:
```bash
npx tsc --noEmit 2>&1 | head -30
```

Resultado esperado: sem erros de tipo nos arquivos migrados.

- [ ] **Step 10: Commit**

```bash
git add apps/odonto-front/run-kubb.mjs apps/odonto-front/kubb.config.ts
git add apps/odonto-front/src/app/register/\[token\]/page.tsx
git add apps/odonto-front/src/components/patients/Odontogram/ToothPopover.tsx
git add -u apps/odonto-front/src/generated/zod  # registrar remoção
git commit -m "perf(frontend): remove Zod plugin from Kubb and inline the 2 form schemas"
```

---

## Task 3: Lazy load de `@react-pdf/renderer`

`@react-pdf/renderer` é uma dependência pesada (~600KB minificado) que atualmente é empacotada no bundle principal porque `BudgetPdfButton` é importado diretamente. Com `next/dynamic`, o código PDF só é carregado quando o usuário abre a aba de orçamentos.

**Files:**
- Modify: `apps/odonto-front/src/components/patients/BudgetPdfButton.tsx`

- [ ] **Step 1: Converter `BudgetPdfButton` para lazy load interno**

Substituir o conteúdo de [apps/odonto-front/src/components/patients/BudgetPdfButton.tsx](apps/odonto-front/src/components/patients/BudgetPdfButton.tsx):

```tsx
'use client';

import dynamic from 'next/dynamic';
import { FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { BudgetPdfClinic, BudgetPdfPatient, BudgetPlan } from './budget-types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => m.PDFDownloadLink),
  { ssr: false }
);

const BudgetPdfDocument = dynamic(
  () => import('./BudgetPdfDocument').then((m) => m.BudgetPdfDocument),
  { ssr: false }
);

interface BudgetPdfButtonProps {
  plan: BudgetPlan;
  patient: BudgetPdfPatient;
  clinic: BudgetPdfClinic;
}

export function BudgetPdfButton({ plan, patient, clinic }: BudgetPdfButtonProps) {
  const { format } = require('date-fns');
  const filename = `orcamento-${(plan.title ?? 'orcamento').replace(/\s+/g, '-').toLowerCase()}-${format(new Date(plan.createdAt), 'dd-MM-yyyy')}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetPdfDocument plan={plan} patient={patient} clinic={clinic} />}
      fileName={filename}
    >
      {({ loading }: { loading: boolean }) => (
        <Button
          size="sm"
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          disabled={loading}
        >
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? 'Preparando...' : 'Gerar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
```

> **Nota:** O `require('date-fns')` inline evita que o import de `date-fns` fique no topo do arquivo — mas como `date-fns` já está no bundle de qualquer forma (usado em muitos outros lugares), pode-se simplesmente manter `import { format } from 'date-fns'` no topo. O ponto crítico é o `@react-pdf/renderer` ser lazy.

Versão limpa com import normal de `date-fns` no topo:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { BudgetPdfClinic, BudgetPdfPatient, BudgetPlan } from './budget-types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((m) => ({ default: m.PDFDownloadLink })),
  { ssr: false }
);

const BudgetPdfDocument = dynamic(
  () => import('./BudgetPdfDocument').then((m) => ({ default: m.BudgetPdfDocument })),
  { ssr: false }
);

interface BudgetPdfButtonProps {
  plan: BudgetPlan;
  patient: BudgetPdfPatient;
  clinic: BudgetPdfClinic;
}

export function BudgetPdfButton({ plan, patient, clinic }: BudgetPdfButtonProps) {
  const filename = `orcamento-${(plan.title ?? 'orcamento').replace(/\s+/g, '-').toLowerCase()}-${format(new Date(plan.createdAt), 'dd-MM-yyyy')}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetPdfDocument plan={plan} patient={patient} clinic={clinic} />}
      fileName={filename}
    >
      {({ loading }: { loading: boolean }) => (
        <Button
          size="sm"
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          disabled={loading}
        >
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? 'Preparando...' : 'Gerar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
```

- [ ] **Step 2: Verificar type-check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Resultado esperado: sem novos erros de tipo.

- [ ] **Step 3: Commit**

```bash
git add apps/odonto-front/src/components/patients/BudgetPdfButton.tsx
git commit -m "perf(frontend): lazy load @react-pdf/renderer via next/dynamic"
```

---

## Task 4: Lazy load de `recharts`

`recharts` (~500KB minificado) é usado apenas no `RevenueChart` no dashboard. Lazy loading move-o para um chunk separado, carregado apenas quando a rota `/dashboard` é visitada.

**Files:**
- Modify: `apps/odonto-front/src/app/(app)/dashboard/components/RevenueChart.tsx`

- [ ] **Step 1: Criar um wrapper lazy para o `RevenueChart`**

A estratégia mais simples: criar um arquivo `LazyRevenueChart.tsx` ao lado do original que o exporta via `next/dynamic`, e substituir o import nos pontos de uso.

Verificar quem importa `RevenueChart`:

```bash
# No diretório raiz do monorepo:
grep -r "RevenueChart" apps/odonto-front/src --include="*.tsx" --include="*.ts" -l
```

- [ ] **Step 2: Criar `LazyRevenueChart.tsx`**

Criar o arquivo `apps/odonto-front/src/app/(app)/dashboard/components/LazyRevenueChart.tsx`:

```tsx
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export const LazyRevenueChart = dynamic(
  () => import('./RevenueChart').then((m) => ({ default: m.RevenueChart })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col rounded-3xl border border-gray-100 bg-white px-7 py-6 shadow-sm">
        <div className="mb-4 flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-37 rounded-full" />
        </div>
        <div className="flex flex-1 items-end gap-3 pb-6">
          {[55, 70, 45, 80, 60, 75, 50].map((height, i) => (
            <Skeleton key={i} className="h-full w-full" style={{ maxHeight: `${height}%` }} />
          ))}
        </div>
      </div>
    ),
  }
);
```

- [ ] **Step 3: Substituir imports de `RevenueChart` por `LazyRevenueChart`**

Para cada arquivo que importa `RevenueChart` (encontrado no Step 1), substituir:

```tsx
// De:
import { RevenueChart } from './RevenueChart'; // (ou caminho relativo equivalente)
// Para:
import { LazyRevenueChart } from './LazyRevenueChart';
```

E substituir `<RevenueChart />` por `<LazyRevenueChart />` no JSX.

- [ ] **Step 4: Verificar type-check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Resultado esperado: sem novos erros de tipo.

- [ ] **Step 5: Commit**

```bash
git add apps/odonto-front/src/app/\(app\)/dashboard/components/LazyRevenueChart.tsx
git add apps/odonto-front/src/app/\(app\)/dashboard/components/  # arquivos que usam o chart
git commit -m "perf(frontend): lazy load recharts via next/dynamic"
```

---

## Task 5: Medir o resultado

- [ ] **Step 1: Executar build cronometrado antes e após**

No diretório `apps/odonto-front`, executar um build limpo (sem cache):

```bash
# Limpar cache do Next.js
rm -rf .next

# Medir tempo de build
Measure-Command { npm run build } | Select-Object TotalSeconds
# Ou no bash:
time npm run build
```

Resultado esperado: tempo de build abaixo de 20 segundos (redução de ~50% em relação aos 40s originais).

- [ ] **Step 2: Verificar que `src/generated/zod` não existe mais**

```bash
ls src/generated/
```

Resultado esperado: pastas `clients/`, `hooks/`, `ts/` — sem `zod/`.

- [ ] **Step 3: Verificar bundle analysis (opcional)**

Para confirmar que `@react-pdf/renderer` e `recharts` saíram do bundle principal:

```bash
ANALYZE=true npm run build
```

> Isso só funciona se o projeto tiver `@next/bundle-analyzer` configurado. Se não tiver, pular este step.

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "perf(frontend): build optimization complete - exclude generated from TS, remove zod plugin, lazy load heavy deps"
```

---

## Resumo das otimizações

| Otimização | Impacto estimado | Arquivos afetados |
|---|---|---|
| Excluir `src/generated` do TS | -20-30% tempo de build | `tsconfig.json` |
| Remover plugin Zod do Kubb | -132 arquivos gerados | `run-kubb.mjs`, `kubb.config.ts`, 2 componentes |
| Lazy load `@react-pdf/renderer` | -~600KB do bundle principal | `BudgetPdfButton.tsx` |
| Lazy load `recharts` | -~500KB do bundle principal | `RevenueChart.tsx`, `LazyRevenueChart.tsx` |
