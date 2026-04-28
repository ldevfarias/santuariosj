# CLAUDE.md — Santuário de São José de Ribamar

## Sobre o projeto

Site institucional estático do **Santuário de São José de Ribamar**, localizado em São José de Ribamar, Maranhão. Desenvolvido em HTML, CSS e JS puros — sem frameworks, sem build tools.

## Stack

- **HTML5** semântico (`index.html`)
- **CSS3** com custom properties (`css/style.css`)
- **JavaScript** vanilla com ES6+ (`js/main.js`)
- **Fontes:** Google Fonts (Cinzel, Lora, Open Sans)
- **Ícones:** Font Awesome 6 via CDN

## Estrutura de arquivos

```
santuarioSJ/
├── index.html          # Página principal (única página atual)
├── css/
│   └── style.css       # Todos os estilos — sem pré-processador
├── js/
│   └── main.js         # Toda a interatividade
└── assets/
    └── img/            # Imagens locais (ainda não populado)
```

## Design system

### Paleta de cores (CSS custom properties)

| Variável | Valor | Uso |
|---|---|---|
| `--burgundy` | `#6b1a1a` | Cor primária — títulos, botões, destaques |
| `--burgundy-dk` | `#4a0f0f` | Variante escura — topbar, footer, hover |
| `--gold` | `#b8860b` | Cor de acento — ornamentos, links, datas |
| `--gold-bright` | `#f0c040` | Dourado claro — hero, elementos sobre fundo escuro |
| `--cream` | `#faf6ef` | Fundo principal claro |
| `--cream-dk` | `#f0e8d8` | Fundo alternativo, bordas suaves |

### Tipografia

| Variável | Fonte | Uso |
|---|---|---|
| `--font-serif` | Cinzel | Títulos, marca, elementos litúrgicos |
| `--font-lora` | Lora | Subtítulos, citações, texto lead |
| `--font-body` | Open Sans | Corpo de texto geral |

### Classes utilitárias

- `.btn`, `.btn-primary`, `.btn-outline`, `.btn-gold`, `.btn-full` — sistema de botões
- `.reveal`, `.reveal-left`, `.reveal-right` — animações de entrada no scroll
- `.ornament`, `.ornament-light` — separador decorativo com cruz e linhas
- `.section-title`, `.section-subtitle`, `.section-header` — padrão de cabeçalho de seção
- `.container` — largura máxima 1200px, centralizado

## Contexto religioso e editorial

- O site é católico, voltado para fiéis e peregrinos
- **Padroeiro:** São José de Ribamar — padroeiro do Maranhão
- **Festa principal:** 19 de março
- **Tons:** respeitoso, acolhedor, litúrgico — nunca informal ou comercial
- Textos de notícias, artigos e eventos devem ter linguagem pastoral
- Referências litúrgicas seguem o calendário romano (CNBB / Arquidiocese de São Luís)

## Convenções de código

- Sem frameworks CSS — tudo em `style.css` com custom properties
- Sem transpiladores — JS deve ser compatível com ES6+ nativo
- Comentários de seção no CSS usam `/* ====... */` com nome em caixa alta
- Componentes JS encapsulados em IIFE `(function(){ 'use strict'; ... })()`
- Imagens externas usam Unsplash como placeholder; substituir por fotos reais do santuário
- IDs de seção em português, minúsculas, com hífen: `#horarios`, `#sao-jose`, `#sacramentos`

## Comportamentos implementados (JS)

| Feature | Como funciona |
|---|---|
| Header sticky | `scrolled` class via scroll event |
| Menu mobile | `hamburger` toggle + `open` class no nav |
| Dropdowns mobile | Toggle por clique individual em `.has-dropdown` |
| Hero slideshow | `setInterval` a cada 5.5s, pausa no hover |
| Nav active link | `IntersectionObserver` nas sections |
| Scroll reveal | `IntersectionObserver` com classes `.reveal*` |
| Back to top | Aparece após 400px de scroll |
| Formulário | Simulação de envio com feedback visual |
| Smooth scroll | Offset automático descontando a altura do header |

## Como expandir

- **Nova página** (ex.: `/noticias/`): criar novo HTML importando os mesmos CSS e JS
- **Nova seção**: adicionar no HTML com `id`, registrar link no `<nav>`, o observer de nav detecta automaticamente
- **Novo card de sacramento/grupo**: copiar estrutura existente — CSS já suporta `auto-fill`
- **Imagens reais**: substituir URLs do Unsplash por caminhos em `assets/img/`
- **Formulário real**: substituir o `setTimeout` em `main.js` por `fetch` para endpoint próprio

## O que NÃO fazer

- Não introduzir dependências npm, webpack ou qualquer bundler
- Não usar `!important` no CSS — a especificidade está controlada
- Não alterar as variáveis `--burgundy`/`--gold` sem revisar todos os usos
- Não remover o IIFE do `main.js` — evita poluição do escopo global
- Não usar texto informal, gírias ou emojis em conteúdo visível ao usuário
