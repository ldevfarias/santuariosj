# Checklist — CI/CD Deployment Setup

Use este checklist para acompanhar o setup da esteira de CI/CD.

## ✅ Implementação (Concluído)

- [x] Instalar Playwright (`npm install --save-dev @playwright/test`)
- [x] Criar `playwright.config.ts`
- [x] Criar testes em `e2e/home.spec.ts`
- [x] Criar testes em `e2e/navigation.spec.ts`
- [x] Adicionar scripts em `package.json` (typecheck, test:e2e, test:e2e:ci, test:e2e:ui)
- [x] Criar `.github/workflows/ci.yml`
- [x] Criar `.github/workflows/deploy.yml`
- [x] Criar documentação em `CI_CD_SETUP.md`

---

## 📋 Próximos Passos

### 1. Git & GitHub
- [ ] Commit de todos os novos arquivos
  ```bash
  git add .
  git commit -m "feat: Add CI/CD pipeline with Playwright e2e tests"
  git push origin feature/secretaria
  ```

- [ ] Abrir Pull Request para review da CI

### 2. Configurar GitHub Secrets
Acesse: **Settings → Secrets and variables → Actions → Repository secrets**

- [ ] `SSH_HOST` — IP ou domínio da VPS (ex: `45.67.89.123`)
- [ ] `SSH_USER` — Usuário SSH (ex: `ubuntu`)
- [ ] `SSH_PRIVATE_KEY` — Chave privada ed25519 completa (começa com `-----BEGIN OPENSSH PRIVATE KEY-----`)
- [ ] `SSH_PORT` — Porta SSH (padrão: `22`)
- [ ] `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` — GA4 ID (ex: `G-XXXXXXXXXX`)
- [ ] `RESEND_API_KEY` — Chave do Resend (ex: `re_xxxxx`)
- [ ] `RESEND_FROM_EMAIL` — Email remetente (ex: `noreply@santuario.org.br`)
- [ ] `RESEND_TO_EMAIL` — Email destinatário (ex: `secretaria@santuario.org.br`)

**Dica:** Verifique cada secret está correto com `gh secret list`

### 3. Gerar Chave SSH (se não tiver)
Na sua máquina local:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/santuario_deploy
# Pressione Enter para não usar passphrase

# Copie o conteúdo da chave privada para o secret SSH_PRIVATE_KEY
cat ~/.ssh/santuario_deploy

# Guarde a chave pública para a VPS
cat ~/.ssh/santuario_deploy.pub
```

### 4. Configurar VPS Hostinger

#### 4.1 Preparação inicial (primeira vez)
```bash
# Na VPS, como root ou com sudo:

# 1. Clonar repositório
mkdir -p /var/www
cd /var/www
git clone https://github.com/seu-usuario/santuario-sj.git santuario-sj
cd santuario-sj

# 2. Criar arquivo .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@santuario.org.br
RESEND_TO_EMAIL=secretaria@santuario.org.br
EOF

# 3. Instalar dependências e fazer build
npm ci
npm run build

# 4. Instalar PM2 (se não tiver)
npm install -g pm2

# 5. Iniciar aplicação
pm2 start npm --name "santuario-sj" -- start

# 6. Configurar PM2 para autoiniciar
pm2 startup
pm2 save

# 7. Adicionar chave SSH pública
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAA... (conteúdo de ~/.ssh/santuario_deploy.pub)
EOF
chmod 600 ~/.ssh/authorized_keys
```

#### 4.2 Checklist VPS
- [ ] Repositório clonado em `/var/www/santuario-sj`
- [ ] `.env.local` criado com variáveis de produção
- [ ] `npm ci` executado com sucesso
- [ ] `npm run build` executado com sucesso
- [ ] PM2 instalado globalmente
- [ ] Aplicação rodando: `pm2 status` mostra `santuario-sj` online
- [ ] PM2 configurado para autoiniciar: `pm2 startup` rodado
- [ ] SSH public key adicionada a `~/.ssh/authorized_keys`
- [ ] Firewall permite porta 3000 (ou use Nginx reverse proxy)

### 5. Testar CI Pipeline
- [ ] Faça push para uma branch de feature
  ```bash
  git push origin feature/secretaria
  ```

- [ ] Vá ao GitHub → Actions e veja:
  - [ ] ✅ Lint job passou
  - [ ] ✅ Typecheck job passou
  - [ ] ✅ Build job passou
  - [ ] ✅ E2E tests job passou (15/15 testes)

### 6. Testar Deploy Pipeline
- [ ] Mergear PR para `main` (via GitHub UI ou CLI)
  ```bash
  git checkout main
  git pull origin main
  ```

- [ ] Vá ao GitHub → Actions e veja:
  - [ ] ✅ CI workflow passou
  - [ ] ✅ Deploy workflow iniciou
  - [ ] ✅ SSH deployment bem-sucedido

- [ ] Verifique a aplicação na VPS:
  ```bash
  # Na VPS
  pm2 status  # deve mostrar santuario-sj online
  pm2 logs santuario-sj --lines 10  # verificar logs
  curl http://localhost:3000  # testar localmente na VPS
  ```

- [ ] Acesse via domínio/IP público da VPS no navegador

---

## 🔍 Verificações Finais

- [ ] Testes locais passam
  ```bash
  npm run lint
  npm run typecheck
  npm run build
  npm run test:e2e:ci
  ```

- [ ] GitHub Secrets configurados
  ```bash
  gh secret list
  ```

- [ ] VPS pronta para deploy
  ```bash
  # Na VPS
  curl -I http://localhost:3000
  echo $RESEND_API_KEY  # deve estar definido
  ```

- [ ] Commit final feito
  ```bash
  git status  # deve estar limpo
  ```

---

## 📞 Troubleshooting Rápido

| Problema | Solução |
|---|---|
| CI falha na etapa E2E | Verifique se `next start` consegue iniciar. Aumente timeout em `playwright.config.ts` |
| Deploy não inicia | Verifique SSH_PRIVATE_KEY e SSH_HOST nos GitHub Secrets |
| `pm2 reload` falha | SSH na VPS e rode `pm2 delete santuario-sj && pm2 start npm --name santuario-sj -- start` |
| Playwright não conecta | Confirme que baseURL em `playwright.config.ts` é `http://localhost:3000` |
| Testes falharam localmente | Rode `npm run build` primeiro, depois `npm run test:e2e:ci` |

---

## 🎓 Documentação

- `CI_CD_SETUP.md` — Documentação completa
- `CICD_SUMMARY.md` — Resumo executivo
- `.github/workflows/ci.yml` — Código do CI
- `.github/workflows/deploy.yml` — Código do Deploy
- `playwright.config.ts` — Configuração dos testes

---

## ✨ Está tudo pronto?

Quando você completar todos os items:

1. ✅ CI pipeline passa em todas as branches
2. ✅ Deploy automático funciona ao fazer merge na main
3. ✅ E2E testes rodam e passam automaticamente
4. ✅ VPS está recebendo deploys sem downtime

**Você terá uma esteira CI/CD profissional, segura e completamente automatizada!** 🚀

---

**Tempo estimado total:** 30-45 minutos (incluindo setup da VPS)

**Suporte:** Consulte `CI_CD_SETUP.md` section "Troubleshooting"
