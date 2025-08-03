# Deploy Alternativo - Railway (Backend)

Como o Heroku removeu o plano gratuito, aqui está uma alternativa usando Railway para o backend.

## 🚂 Deploy no Railway

### 1. Criar conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Crie uma conta usando GitHub
3. Clique em "New Project"

### 2. Conectar repositório

1. Selecione "Deploy from GitHub repo"
2. Escolha seu repositório
3. Selecione a pasta `backend/` como root directory

### 3. Configurar variáveis de ambiente

No painel do Railway, vá para **Variables** e adicione:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
NODE_ENV=production
CORS_ORIGIN=https://seu-app.netlify.app
PORT=3000
```

### 4. Configurar domínio

1. Vá para **Settings** > **Domains**
2. Railway fornecerá um domínio automático
3. Anote a URL (ex: `https://seu-app-production.up.railway.app`)

### 5. Executar migração

1. Vá para **Deployments**
2. Clique no deployment mais recente
3. Vá para **Logs** e execute:
```bash
npm run migrate
```

## 🔄 Atualizar configurações

### 1. Atualizar netlify.toml

Substitua a URL do backend no `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://seu-app-production.up.railway.app/api/:splat"
  status = 200
  force = true
```

### 2. Atualizar variáveis do Netlify

No painel do Netlify, atualize:
- `NEXT_PUBLIC_API_URL`: `https://seu-app-production.up.railway.app/api`
- `BACKEND_API_URL`: `https://seu-app-production.up.railway.app`

### 3. Atualizar CORS

No Railway, atualize a variável:
```env
CORS_ORIGIN=https://seu-app.netlify.app
```

## 💰 Custos

Railway oferece:
- $5 de crédito gratuito mensal
- Deploy básico custa ~$5-10/mês
- Sem cartão de crédito necessário para começar

## 🔧 Comandos úteis

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Executar comando
railway run npm run migrate
```

## 🚨 Troubleshooting

### Problemas comuns:

1. **Erro de build**
   - Verifique se o `package.json` está correto
   - Confirme se o TypeScript está configurado

2. **Erro de conexão**
   - Verifique se as variáveis de ambiente estão corretas
   - Confirme se o Supabase está acessível

3. **Erro de CORS**
   - Atualize a variável `CORS_ORIGIN` com a URL correta do Netlify
   - Reinicie o deploy após a mudança

Para mais informações: [Documentação do Railway](https://docs.railway.app) 