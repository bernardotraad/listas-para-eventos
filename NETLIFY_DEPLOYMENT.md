# 🚀 Deploy no Netlify - Listas para Eventos

## ✅ Problemas Resolvidos

### 1. **Erro "Cannot find module 'tailwindcss'"**
- ✅ Movido `tailwindcss`, `autoprefixer` e `postcss` para `dependencies`
- ✅ Atualizado Node.js para versão 20
- ✅ Adicionado comando de instalação explícito no `netlify.toml`

### 2. **Configuração do Build**
- ✅ Comando de build atualizado: `npm install && npm run build`
- ✅ Adicionado `NPM_FLAGS = "--legacy-peer-deps"`
- ✅ Configurado diretório base correto: `frontend`

## 🔧 Configuração no Netlify

### 1. **Configuração do Site**

1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte com o GitHub e selecione seu repositório
4. Configure as opções de build:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `.next`

### 2. **Variáveis de Ambiente**

No painel do Netlify, vá em **Site settings** > **Environment variables** e configure:

```bash
# API URL
NEXT_PUBLIC_API_URL=https://listas-eventos-backend.onrender.com/api

# Ambiente
NODE_ENV=production

# Node.js Version
NODE_VERSION=20
```

### 3. **Configuração de Domínio (Opcional)**

1. No painel do Netlify, vá em **Domain settings**
2. Clique em "Add custom domain"
3. Siga as instruções para configurar o DNS

## 📝 Arquivos de Configuração

### `netlify.toml` (na raiz do projeto)
```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api-proxy/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "functions"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### `frontend/package.json` (dependências)
```json
{
  "dependencies": {
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

## 🐛 Troubleshooting

### Se o build ainda falhar:

1. **Verificar logs do Netlify**:
   - Acesse o painel do Netlify
   - Vá em "Deploys" > "Latest deploy"
   - Clique em "View deploy log"

2. **Verificar dependências**:
   - Confirme que `tailwindcss` está em `dependencies`
   - Verifique se não há conflitos de versão

3. **Limpar cache do Netlify**:
   - No painel do Netlify, vá em "Deploys"
   - Clique em "Trigger deploy" > "Clear cache and deploy site"

4. **Verificar configuração do Next.js**:
   - Confirme que `next.config.js` está correto
   - Verifique se não há erros de sintaxe

### Comandos úteis para debug:

```bash
# Testar build localmente
cd frontend
npm install
npm run build

# Verificar versão do Node.js
node --version

# Verificar dependências
npm list tailwindcss
npm list autoprefixer
npm list postcss
```

## 🔄 Próximos Passos

1. **Fazer commit das mudanças**:
   ```bash
   git add .
   git commit -m "Fix Netlify build: move Tailwind to dependencies"
   git push origin main
   ```

2. **Redeploy no Netlify**:
   - O Netlify fará deploy automaticamente
   - Ou clique em "Trigger deploy" no painel

3. **Verificar o site**:
   - Acesse a URL do Netlify
   - Teste o login e carregamento de eventos

## 📞 Suporte

Se ainda houver problemas:
- Verifique os logs detalhados no Netlify
- Confirme que todas as variáveis de ambiente estão configuradas
- Teste o build localmente antes do deploy 