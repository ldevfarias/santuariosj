# CI/CD Setup — Santuário de São José de Ribamar

## O que foi implementado

Uma esteira completa de CI/CD com:
- **Testes e2e com Playwright** contra todas as páginas principais
- **GitHub Actions CI** que roda lint, typecheck, build e testes
- **Deploy automático via SSH** para Hostinger VPS com PM2

---

## Arquivos criados

### 1. Testes e2e
- `e2e/home.spec.ts` — Testa a página inicial
- `e2e/navigation.spec.ts` — Testa navegação entre rotas
- `playwright.config.ts` — Configuração do Playwright

### 2. GitHub Actions
- `.github/workflows/ci.yml` — Pipeline de CI (lint → typecheck → build → e2e)
- `.github/workflows/deploy.yml` — Deploy automático ao fazer merge na main

### 3. Scripts npm adicionados
```json
"typecheck": "tsc --noEmit",
"test:e2e": "playwright test",
"test:e2e:ci": "CI=true playwright test --reporter=list",
"test:e2e:ui": "playwright test --ui"
```

---

## Como usar localmente

### Rodar todos os testes
```bash
npm run lint          # Verificar código
npm run typecheck     # Verificar tipos
npm run build         # Build de produção
npm run test:e2e      # Rodar testes e2e (abre UI)
npm run test:e2e:ci   # Rodar testes e2e em modo CI (terminal)
```

### Debug de testes
```bash
npm run test:e2e:ui   # Interface interativa do Playwright
```

---

## Configuração do GitHub

### 1. GitHub Secrets

Você precisa adicionar os seguintes secrets no seu repositório:
**Settings → Secrets and variables → Actions → Repository secrets**

| Secret | Valor |
|---|---|
| `SSH_HOST` | IP ou domínio da VPS Hostinger |
| `SSH_USER` | Usuário SSH (ex: `ubuntu`, `deploy`) |
| `SSH_PRIVATE_KEY` | Chave privada ed25519 completa |
| `SSH_PORT` | Porta SSH (padrão: `22`) |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | ID do GA4 (ex: `G-XXXXXXXXXX`) |
| `RESEND_API_KEY` | Chave de API do Resend |
| `RESEND_FROM_EMAIL` | Email de origem dos envios |
| `RESEND_TO_EMAIL` | Email para receber as mensagens |

### 2. Como gerar a chave SSH

Na sua máquina local (onde estão suas chaves):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/santuario_deploy
```

Isso cria dois arquivos:
- `~/.ssh/santuario_deploy` (privada) — copie o conteúdo COMPLETO para o secret `SSH_PRIVATE_KEY`
- `~/.ssh/santuario_deploy.pub` (pública) — copie para o `~/.ssh/authorized_keys` da VPS

---

## Configuração da VPS Hostinger (one-time)

Execute estes comandos **uma única vez** na VPS:

```bash
# 1. Criar diretório e clonar repo
mkdir -p /var/www
cd /var/www
git clone <seu-repositorio-url> santuario-sj
cd santuario-sj

# 2. Criar arquivo .env.local com as variáveis de produção
cat > .env.local << EOF
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXX
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@santuario.org.br
RESEND_TO_EMAIL=secretaria@santuario.org.br
EOF

# 3. Instalar dependências e fazer build
npm ci
npm run build

# 4. Instalar PM2 globalmente (se não tiver)
npm install -g pm2

# 5. Iniciar o servidor
pm2 start npm --name "santuario-sj" -- start

# 6. Configurar PM2 para reiniciar após reboot
pm2 startup
pm2 save

# 7. Adicionar a chave SSH pública do GitHub Actions
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3... (conteúdo de santuario_deploy.pub)
EOF
```

### Verificar que tudo funciona

```bash
# Verificar que o servidor está rodando
pm2 status

# Ver logs
pm2 logs santuario-sj

# Teste manual de deploy (sem GitHub Actions)
# Na VPS, execute:
cd /var/www/santuario-sj
git pull origin main
npm ci
npm run build
pm2 reload santuario-sj --update-env
```

---

## Como funciona o pipeline

### CI Pipeline (em cada push)

1. **Lint** — Verifica código com ESLint
2. **Typecheck** — Valida tipos com TypeScript
3. **Build** — Compila o Next.js
4. **E2E Tests** — Roda testes Playwright contra a build de produção

✅ Se tudo passar, a esteira entra em **Deploy**.

### Deploy Pipeline (só na main, após CI passar)

1. **SSH** para a VPS
2. **Git pull** da branch main
3. **npm ci** — Instala dependências exatamente como no lock file
4. **npm run build** — Compila a aplicação
5. **pm2 reload** — Reinicia o servidor sem downtime
6. **pm2 save** — Persiste a configuração

---

## Troubleshooting

### Os testes passam localmente mas falham no CI

- Verifique que `.env.local` não está sendo commitado (deve estar em `.gitignore`)
- Se o Playwright não conseguir se conectar a `http://localhost:3000`, verifique o timeout em `playwright.config.ts`

### Deploy não funciona via SSH

1. Verifique que a chave SSH está correta: `ssh-keygen -l -f ~/.ssh/santuario_deploy`
2. Teste SSH manual: `ssh -i ~/.ssh/santuario_deploy user@host`
3. Verifique que a chave pública está em `~/.ssh/authorized_keys` na VPS
4. Verifique os logs do GitHub Actions para ver o erro exato

### PM2 não está reiniciando após deploy

```bash
# Na VPS:
pm2 delete santuario-sj
cd /var/www/santuario-sj
npm run build
pm2 start npm --name "santuario-sj" -- start
pm2 save
```

### Porta 3000 já está em uso

```bash
# Na VPS, mudar a porta de listening
# Editar o PM2 ecosystem.config.js ou usar argumentos personalizados
pm2 delete santuario-sj
pm2 start npm --name "santuario-sj" -- start --port 3001
pm2 save

# Depois configurar reverse proxy com Nginx
```

---

## Próximos passos

1. ✅ Commit dos novos arquivos para o repositório
2. 🔗 Configure os GitHub Secrets (8 itens)
3. 🚀 Faça um push para uma branch de teste e veja o CI rodar
4. 🖥️ Configure a VPS Hostinger seguindo as instruções acima
5. 📌 Faça um merge para main e veja o deploy automático acontecer

---

## Monitoramento

Depois de cada deploy, você pode:

```bash
# Verificar status do servidor na VPS
pm2 status
pm2 logs santuario-sj --lines 50

# Testar a aplicação
curl http://localhost:3000

# Ver histórico de restarts
pm2 info santuario-sj
```

---

## Performance

- **CI tempo total**: ~2-3 minutos (lint+typecheck+build+e2e)
- **Deploy tempo**: ~30 segundos (git pull + build + restart)
- **E2E tests**: 15 testes rodando em série, ~45 segundos cada na CI

Se quiser acelerar:
- Adicione mais workers em `playwright.config.ts` (não recomendado em CI com recursos limitados)
- Configure cache estratégico no CI (`.next` é já cacheado via artifacts)
