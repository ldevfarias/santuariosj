<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Instrucoes do Projeto - Santuario Sao Jose de Ribamar

## Objetivo
- Este repositorio contem a landing page institucional do Santuario Sao Jose de Ribamar.
- Prioridade: clareza pastoral, boa experiencia mobile, SEO forte e manutencao simples via dados locais.

## Stack e Arquitetura
- Next.js `16.2.4` com App Router (`app/`), React `19.2.4`, TypeScript estrito e Tailwind CSS v4.
- Fonte de dados principal: arquivos JSON em `data/*.json`, lidos por `lib/data.ts`.
- Layout global em `app/layout.tsx` com:
  - fontes via `next/font`;
  - metadata global;
  - JSON-LD de igreja/local;
  - `Topbar`, `Header`, `Footer`, `BackToTop`, `ScrollReveal`, `HashScrollFix`.
- Paginas principais:
  - `/` (`app/page.tsx`) com secoes em `components/sections`.
  - `/comunidades`, `/secretaria`, `/episcopal`.
  - Rotas dinamicas: `/sacramentos/[slug]` e `/devocoes/[slug]`.

## Convencoes Next.js 16 (obrigatorias)
- Antes de alterar comportamento de App Router, metadata, forms, server actions ou JSON-LD, leia o guia correspondente em `node_modules/next/dist/docs/`.
- Em rotas dinamicas, manter o padrao de props com `params: Promise<{ ... }>` e `await params`.
- `metadata` e `generateMetadata` devem ficar em Server Components.
- JSON-LD deve ser renderizado com `<script type="application/ld+json">` (nao `next/script`).

## Conteudo e Editorial (catolico)
- Texto em tom pastoral: respeitoso, acolhedor e liturgico.
- Evitar tom comercial, girias, ironia ou linguagem informal.
- Preservar fidelidade ao contexto da Igreja Catolica Apostolica Romana (liturgia, sacramentos, vida paroquial).
- Ao atualizar agenda/noticias/horarios, revisar datas e telefones com cuidado.

## Fontes de Verdade e Sincronizacao
- Se alterar dados de sacramentos/devocoes/comunidades:
  - atualizar JSON correspondente em `data/`;
  - validar tipos em `lib/types.ts` quando houver novos campos;
  - revisar rotas dinamicas (`generateStaticParams`/`generateMetadata`);
  - revisar `app/sitemap.ts` (slugs estao listados manualmente).
- Se criar/remover ancora de secao da home, sincronizar:
  - IDs nas secoes (`components/sections/*`);
  - links de navegacao (`MobileNav`, `HeroSection`, `Footer`, CTAs);
  - testes E2E que validam navegacao/visibilidade.
- Evitar links placeholder (`href="#"`) para recursos de producao.

## Design System e UI
- Tokens de tema ficam em `app/globals.css` dentro de `@theme`.
- Utilitarios e classes de reveal/animacao tambem estao centralizados em `app/globals.css`.
- Manter consistencia visual:
  - paleta vinho/dourado/creme;
  - tipografia Cinzel + Lora + Open Sans;
  - ritmo de espacos e raios de borda ja usados nas secoes.
- Respeitar `prefers-reduced-motion` em novas animacoes.

## Imagens, Scripts Externos e Seguranca
- Imagens locais: `public/img/...`.
- Hosts remotos permitidos para imagem e placeholders estao em `next.config.ts` (`images.remotePatterns`).
- Se adicionar novo dominio externo (imagem, script, iframe, API), atualizar tambem CSP em `next.config.ts`.
- Formulario de contato:
  - server action em `app/actions/contato.ts` com `zod` e rate limit em memoria;
  - segredos apenas no servidor (`RESEND_*`), nunca em componente client.

## Acessibilidade e SEO
- Toda imagem relevante precisa de `alt` descritivo.
- Preservar hierarquia de headings (`h1` unico por pagina).
- Sempre definir metadata de pagina quando criar nova rota.
- Manter `robots.ts`, `sitemap.ts` e canonical alinhados com rotas reais.

## Testes e Validacao Antes de Entregar
- Rodar, no minimo, para mudancas de codigo:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- Para mudancas de navegacao, anchors, SEO estrutural ou paginas, rodar tambem:
  - `npm run test:e2e`

## Regra de Ouro para Agentes
- Nao assumir API antiga do Next.js.
- Ler o guia local em `node_modules/next/dist/docs/` antes de alterar qualquer parte sensivel do framework.
- Entregar alteracoes pequenas, consistentes e sincronizadas entre conteudo, navegacao, SEO e testes.
