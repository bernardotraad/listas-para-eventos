# Guia de Deploy - Netlify + Supabase

Este guia irá ajudá-lo a fazer o deploy do sistema "Listas para Eventos" usando Netlify para o frontend e Supabase para o banco de dados.

## 📋 Pré-requisitos

- Conta no [Netlify](https://netlify.com) (gratuita)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Heroku](https://heroku.com) (para o backend) ou [Railway](https://railway.app)
- Repositório no GitHub

## 🚀 Deploy do Supabase

### 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Escolha uma organização ou crie uma nova
4. Preencha as informações do projeto:
   - **Name**: `listas-para-eventos`
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima
5. Clique em "Create new project"

### 2. Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `database/supabase-schema.sql`
4. Clique em **Run** para executar o script

### 3. Obter as credenciais

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key
   - **service_role** key (mantenha segura)

## 🔧 Deploy do Backend (Heroku)

### 1. Preparar o repositório

1. Certifique-se de que o backend está na pasta `backend/`
2. Verifique se o `Procfile` e `app.json` estão presentes
3. Commit e push das alterações para o GitHub

### 2. Deploy no Heroku

1. Acesse [heroku.com](https://heroku.com) e crie uma conta
2. Instale o [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. No terminal, navegue até a pasta `backend/`:
```bash
cd backend
```

4. Faça login no Heroku:
```bash
heroku login
```

5. Crie uma nova aplicação:
```bash
heroku create seu-app-name
```

6. Configure as variáveis de ambiente:
```bash
heroku config:set SUPABASE_URL=https://seu-projeto.supabase.co
heroku config:set SUPABASE_ANON_KEY=sua_chave_anonima_aqui
heroku config:set SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
heroku config:set JWT_SECRET=seu_jwt_secret_super_seguro_aqui
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://seu-app.netlify.app
```

7. Faça o deploy:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

8. Execute a migração do banco:
```bash
heroku run npm run migrate
```

9. Anote a URL do seu app Heroku (ex: `https://seu-app-name.herokuapp.com`)

## 🎨 Deploy do Frontend (Netlify)

### 1. Preparar o repositório

1. Certifique-se de que o frontend está na pasta `frontend/`
2. Verifique se o `netlify.toml` está na raiz do projeto
3. Commit e push das alterações para o GitHub

### 2. Deploy no Netlify

1. Acesse [netlify.com](https://netlify.com) e crie uma conta
2. Clique em "New site from Git"
3. Conecte com o GitHub e selecione seu repositório
4. Configure as opções de build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

5. Clique em "Deploy site"

### 3. Configurar variáveis de ambiente

1. No painel do Netlify, vá para **Site settings** > **Environment variables**
2. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_API_URL`: `https://seu-app-name.herokuapp.com/api`
   - `BACKEND_API_URL`: `https://seu-app-name.herokuapp.com`

### 4. Configurar domínio personalizado (opcional)

1. No painel do Netlify, vá para **Domain settings**
2. Clique em "Add custom domain"
3. Siga as instruções para configurar o DNS

## 🔗 Configurar CORS

### 1. Atualizar CORS no backend

Após o deploy do frontend, atualize a variável `CORS_ORIGIN` no Heroku:

```bash
heroku config:set CORS_ORIGIN=https://seu-app.netlify.app
```

### 2. Reiniciar o backend

```bash
heroku restart
```

## 🔐 Configurar autenticação

### 1. Criar usuário admin

Após o deploy, acesse a API para criar o usuário admin:

```bash
curl -X POST https://seu-app-name.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

## 🌐 URLs de Acesso

Após o deploy, você terá acesso aos seguintes URLs:

- **Frontend**: `https://seu-app.netlify.app`
- **Backend API**: `https://seu-app-name.herokuapp.com/api`
- **Supabase Dashboard**: `https://app.supabase.com/project/seu-projeto`

## 🔧 Configurações Adicionais

### 1. Configurar webhooks (opcional)

Para atualizações automáticas, configure webhooks do GitHub para o Netlify e Heroku.

### 2. Configurar monitoramento

- Use o [UptimeRobot](https://uptimerobot.com) para monitorar a disponibilidade
- Configure alertas no Heroku para problemas de performance

### 3. Configurar logs

```bash
# Ver logs do Heroku
heroku logs --tail

# Ver logs do Netlify
# Acesse o painel do Netlify > Functions > Logs
```

## 🚨 Troubleshooting

### Problemas comuns:

1. **Erro de build no Netlify**
   - Verifique se o Node.js version está correto
   - Confirme se todas as dependências estão no `package.json`

2. **Erro de CORS**
   - Verifique se a URL do frontend está correta no `CORS_ORIGIN`
   - Confirme se o backend está rodando

3. **Erro de conexão com Supabase**
   - Verifique se as credenciais estão corretas
   - Confirme se o projeto está ativo no Supabase

4. **Erro de autenticação**
   - Verifique se o `JWT_SECRET` está configurado
   - Confirme se o usuário admin foi criado

## 📞 Suporte

Se você encontrar problemas durante o deploy:

1. Verifique os logs do Heroku e Netlify
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Teste a API localmente antes do deploy
4. Verifique se o banco de dados foi criado corretamente

Para mais informações:
- [Documentação do Netlify](https://docs.netlify.com)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Heroku](https://devcenter.heroku.com) 