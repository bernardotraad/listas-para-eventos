# 🚀 Guia de Deploy - Listas para Eventos

## ✅ Problemas Resolvidos

### 1. **Erro de TypeScript no Build**
- ✅ Node.js atualizado para versão 20
- ✅ Dependências de tipos movidas para `dependencies`
- ✅ Build simplificado usando `ts-node`

### 2. **Erro "ts-node: not found"**
- ✅ `ts-node` e `typescript` movidos para `dependencies`
- ✅ Script de build simplificado

### 3. **Erro de Conexão com API**
- ✅ URL da API configurada para produção
- ✅ CORS configurado para aceitar requisições do frontend

## 🔧 Configuração das Variáveis de Ambiente

### Backend (Render)

Configure as seguintes variáveis de ambiente no seu projeto no Render:

```bash
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Servidor
PORT=10000
NODE_ENV=production

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# CORS (URLs do frontend)
CORS_ORIGIN=https://listas-para-eventos.netlify.app,https://listas-para-eventos.vercel.app
```

### Frontend (Netlify/Vercel)

Configure as seguintes variáveis de ambiente:

```bash
# API URL
NEXT_PUBLIC_API_URL=https://listas-eventos-backend.onrender.com/api

# Ambiente
NODE_ENV=production
```

## 📝 URLs de Produção

### Backend
- **URL**: `https://listas-eventos-backend.onrender.com`
- **API**: `https://listas-eventos-backend.onrender.com/api`

### Frontend
- **Netlify**: `https://listas-para-eventos.netlify.app`
- **Vercel**: `https://listas-para-eventos.vercel.app`

## 🔄 Próximos Passos

1. **Atualizar variáveis de ambiente no Render**:
   - Acesse seu projeto no Render
   - Vá em "Environment"
   - Configure as variáveis listadas acima

2. **Redeploy do backend**:
   - Faça commit das mudanças
   - Push para o GitHub
   - O Render fará deploy automaticamente

3. **Testar a conexão**:
   - Acesse o frontend
   - Tente fazer login
   - Verifique se os eventos carregam

## 🐛 Troubleshooting

### Se ainda houver erro de conexão:

1. **Verificar URL do backend**:
   - Confirme que a URL está correta no `next.config.js`
   - Teste a URL diretamente no navegador

2. **Verificar CORS**:
   - Confirme que a URL do frontend está na lista de CORS
   - Verifique os logs do backend no Render

3. **Verificar variáveis de ambiente**:
   - Confirme que todas as variáveis estão configuradas
   - Verifique se não há espaços extras

## 📞 Suporte

Se ainda houver problemas, verifique:
- Logs do backend no Render
- Console do navegador para erros de CORS
- Network tab para ver as requisições 