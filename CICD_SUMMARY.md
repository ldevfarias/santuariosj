# Resumo: CI/CD Pipeline Implementado

## 🎯 Objetivo Alcançado

Criação de uma esteira CI/CD completa que garante qualidade antes de qualquer deploy automático para a Hostinger.

---

## 📦 O que foi criado

### Testes Automatizados (Playwright)

| Arquivo | O que testa |
|---|---|
| `e2e/home.spec.ts` | Home page (hero, header, contato, footer, seções principais) |
| `e2e/navigation.spec.ts` | Navegação entre todas as rotas (+404) |
| `playwright.config.ts` | Configuração dos testes (baseURL, webServer, retries) |

**Total: 15 testes e2e** cobrindo todas as páginas principais

### GitHub Actions Workflows

| Arquivo | Quando executa | O que faz |
|---|---|---|
| `.github/workflows/ci.yml` | Em cada push/PR em qualquer branch | Lint → Typecheck → Build → E2E Tests |
| `.github/workflows/deploy.yml` | Após CI passar na branch main | SSH → Git pull → Build → PM2 restart |

### Configuração

| Arquivo | Propósito |
|---|---|
| `package.json` (atualizado) | Novos scripts: typecheck, test:e2e, test:e2e:ci, test:e2e:ui |
| `CI_CD_SETUP.md` | Documentação completa de setup e troubleshooting |

---

## 🔄 Fluxo de Deploy

```
Desenvolvedor faz commit
         ↓
GitHub Actions CI inicia
         ↓
[Lint] → [Typecheck] → [Build] → [E2E Tests]
         ↓
    Tudo passou?
    ├─ Não → CI falha, bloqueia merge
    └─ Sim ↓
         Merge na main (opcional, manual ou auto)
         ↓
GitHub Actions Deploy inicia
         ↓
SSH → Git pull origin main
         ↓
npm ci (instala deps exato)
         ↓
npm run build (build de produção)
         ↓
pm2 reload santuario-sj (reinicia sem downtime)
         ↓
✅ Live na Hostinger
```

---

## 🚀 Como começar

### 1. Commit das mudanças
```bash
git add .
git commit -m "feat: Add CI/CD pipeline with Playwright e2e tests"
git push origin feature/secretaria
```

### 2. Configure GitHub Secrets
Acesse **Settings → Secrets and variables → Actions** e adicione:

```
SSH_HOST = seu-ip-hostinger.com
SSH_USER = seu-usuario
SSH_PRIVATE_KEY = (chave ed25519 privada completa)
SSH_PORT = 22
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = G-XXXXXX
RESEND_API_KEY = re_xxxxx
RESEND_FROM_EMAIL = noreply@santuario.org.br
RESEND_TO_EMAIL = secretaria@santuario.org.br
```

### 3. Configure a VPS Hostinger
Siga as instruções em `CI_CD_SETUP.md` na seção "Configuração da VPS Hostinger"

### 4. Teste
Faça push de uma branch → veja CI rodar no GitHub Actions → merge na main → veja deploy acontecer

---

## ✅ Garantias do Pipeline

- ✅ **Sem erro TypeScript** — Tudo passa `tsc --noEmit`
- ✅ **Código limpo** — Segue ESLint rules
- ✅ **Build funciona** — `next build` sem erros
- ✅ **E2E passa** — Todos os 15 testes executam contra a build de produção
- ✅ **Deploy é seguro** — Só deploy se tudo acima passou

---

## 📊 Tempo Esperado

| Etapa | Tempo |
|---|---|
| Lint | ~30 segundos |
| Typecheck | ~20 segundos |
| Build | ~1 minuto |
| E2E Tests | ~1 minuto |
| **CI Total** | **~2.5 minutos** |
| Deploy (SSH) | ~30 segundos |

---

## 🔧 Scripts Úteis (Local)

```bash
# Verificar tudo que o CI faz
npm run lint
npm run typecheck
npm run build
npm run test:e2e:ci  # Sem abrir UI

# Debugar testes com UI interativa
npm run test:e2e:ui

# Rodar apenas um arquivo de teste
npx playwright test e2e/home.spec.ts
```

---

## 📝 Estrutura dos Testes

### Home tests (`e2e/home.spec.ts`)
- Título da página correto
- Hero visível com h1 "São José"
- Header com link da marca
- Formulário de contato com campos corretos
- Seções sacramentos e horários presentes
- Footer presente

### Navigation tests (`e2e/navigation.spec.ts`)
- `/` → funciona
- `/comunidades` → funciona
- `/secretaria` → funciona
- `/episcopal` → funciona
- `/sacramentos/baptism` → página dinâmica OK
- `/devocoes/house-of-miracles` → página dinâmica OK
- `/rota-inexistente` → retorna 404

---

## 🐛 Troubleshooting Rápido

**Q: CI falha em Playwright?**
A: Verifique que `next start` consegue subir. Os testes usam webServer automático.

**Q: Deploy não inicia?**
A: Confirme que `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER` estão corretos nos GitHub Secrets.

**Q: Testes passam localmente mas falham no CI?**
A: Pode ser timeout. Aumente `webServer.timeout` em `playwright.config.ts` para 180_000.

**Q: Quer adicionar mais testes?**
A: Crie novo arquivo em `e2e/novo.spec.ts` seguindo o mesmo padrão de `home.spec.ts`.

---

## 📚 Documentação Completa

Veja `CI_CD_SETUP.md` para:
- Como gerar chaves SSH
- Setup passo-a-passo da VPS
- Comandos de troubleshooting
- Como configurar Nginx reverse proxy
- Como escalar para múltiplas instâncias

---

## 🎓 Próximas Melhorias (Opcional)

1. **Coverage de testes** — adicionar `@playwright/test` coverage reports
2. **Staging environment** — workflow deploy-staging antes de produção
3. **Slack notifications** — notificar canal quando deploy falha
4. **Database migrations** — se adicionar banco de dados, rodar migrations no pipeline
5. **Performance testing** — Lighthouse CI para métricas de performance

---

**Status:** ✅ CI/CD pipeline pronto para usar

**Data de implementação:** 2026-05-04

**Versão Next.js:** 16.2.4

**Node.js:** 20.x (LTS)
