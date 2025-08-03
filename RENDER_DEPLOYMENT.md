# Deploy Gratuito - Render (Backend)

Render oferece um plano gratuito perfeito para projetos pequenos como o seu. Aqui está o guia completo.

## 🆓 Plano Gratuito do Render

- **Web Services**: 1 serviço gratuito
- **Runtime**: 750 horas/mês (suficiente para 24/7)
- **RAM**: 512MB
- **CPU**: 0.1 vCPU
- **Sleep**: Dorme após 15 minutos de inatividade
- **Custom Domains**: Sim
- **SSL**: Automático

## 🚀 Deploy no Render

### 1. Criar conta no Render

1. Acesse [render.com](https://render.com)
2. Crie uma conta usando GitHub
3. Clique em "New +" e selecione "Web Service"

### 2. Conectar repositório

1. Selecione "Connect a repository"
2. Escolha seu repositório do GitHub
3. Configure as opções:
   - **Name**: `listas-eventos-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. Configurar variáveis de ambiente

No painel do Render, vá para **Environment** e adicione:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=https://seu-app.netlify.app
```

### 4. Configurar domínio

1. Vá para **Settings** > **Custom Domains**
2. Render fornecerá um domínio automático
3. Anote a URL (ex: `https://listas-eventos-backend.onrender.com`)

### 5. Executar migração

1. Vá para **Logs**
2. Clique em "Open Shell"
3. Execute:
```bash
npm run migrate
```

## 🔄 Atualizar configurações

### 1. Atualizar netlify.toml

Substitua a URL do backend no `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://listas-eventos-backend.onrender.com/api/:splat"
  status = 200
  force = true
```

### 2. Atualizar variáveis do Netlify

No painel do Netlify, atualize:
- `NEXT_PUBLIC_API_URL`: `https://listas-eventos-backend.onrender.com/api`
- `BACKEND_API_URL`: `https://listas-eventos-backend.onrender.com`

### 3. Atualizar CORS

No Render, atualize a variável:
```env
CORS_ORIGIN=https://seu-app.netlify.app
```

## 💰 Custos

**TOTAL: GRÁTIS!**

- Render: Gratuito (750h/mês)
- Netlify: Gratuito
- Supabase: Gratuito (500MB, 50MB bandwidth)

## ⚡ Performance

### Vantagens do Render:
- **Auto-scaling**: Escala automaticamente
- **SSL automático**: HTTPS incluído
- **CDN global**: Performance otimizada
- **Logs em tempo real**: Fácil debugging

### Limitações do plano gratuito:
- **Sleep mode**: Primeira requisição pode ser lenta
- **RAM limitada**: 512MB (suficiente para o projeto)
- **CPU limitada**: 0.1 vCPU (adequado para APIs simples)

## 🔧 Comandos úteis

```bash
# Ver logs do Render
# Acesse o painel do Render > Logs

# Executar comando no shell
# Acesse o painel do Render > Shell

# Verificar status
# Acesse o painel do Render > Overview
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

4. **Sleep mode lento**
   - Primeira requisição após 15min pode demorar 10-30 segundos
   - Isso é normal no plano gratuito

## 📊 Monitoramento

### Render Dashboard:
- **Uptime**: Monitoramento automático
- **Logs**: Acesso em tempo real
- **Métricas**: CPU, RAM, requisições

### Alternativas gratuitas:
- **UptimeRobot**: Monitoramento de uptime gratuito
- **LogRocket**: Logs de erro (plano gratuito limitado)

## 🔄 Deploy Automático

O Render oferece:
- **Auto-deploy**: Deploy automático a cada push
- **Preview deployments**: Para pull requests
- **Rollback**: Reverter para versões anteriores

## 📞 Suporte

- **Documentação**: [docs.render.com](https://docs.render.com)
- **Comunidade**: Discord oficial
- **Email**: Suporte por email

Para mais informações: [Documentação do Render](https://docs.render.com) 