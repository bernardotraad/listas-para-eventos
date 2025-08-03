# Listas para Eventos

Sistema de gerenciamento de listas de nomes para eventos com diferentes níveis de acesso para usuários.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT

## 📁 Estrutura do Projeto

```
listas-para-eventos/
├── frontend/          # Aplicação Next.js
├── backend/           # API Express
├── docs/             # Documentação
└── database/         # Scripts de banco de dados
```

## 🛠️ Instalação

### Opção 1: Instalação Local
1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd listas-para-eventos
```

2. **Execute o script de preparação**
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

3. **Configure o banco de dados Supabase**
- Siga o guia em `INSTALACAO.md`

4. **Inicie o desenvolvimento**
```bash
npm run dev
```

### Opção 2: Deploy em Produção
Para fazer o deploy em produção usando Netlify + Supabase:

1. **Configure o Supabase**
- Siga o guia em `DEPLOYMENT.md`

2. **Deploy do Backend (GRATUITO)**
- **Render (Recomendado)**: `RENDER_DEPLOYMENT.md` - Plano gratuito
- Railway: `RAILWAY_DEPLOYMENT.md` - $5-10/mês
- Heroku: `DEPLOYMENT.md` - Pago

3. **Deploy do Frontend**
- Siga o guia em `DEPLOYMENT.md`

## 🌐 Acesso

### Desenvolvimento Local
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Produção
- **Frontend**: `https://seu-app.netlify.app`
- **Backend API**: `https://listas-eventos-backend.onrender.com/api` (Render)
- **Backend API**: `https://seu-app-production.up.railway.app/api` (Railway)

## 👥 Perfis de Usuário

- **Público**: Acesso à página inicial para envio de nomes
- **Portaria**: Check-in, cadastro de nomes, gerenciamento básico de eventos
- **Admin**: Gerenciamento completo de usuários, eventos e listas

## 📋 Funcionalidades

### Página Inicial (Público)
- Envio de múltiplos nomes para eventos específicos
- Seleção de evento via dropdown

### Painel da Portaria
- Check-in de participantes
- Cadastro de novos nomes
- Edição básica de eventos

### Painel do Administrador
- Gerenciamento completo de usuários
- CRUD de eventos e listas
- Relatórios e estatísticas

## 📚 Documentação

- **Instalação Local**: `INSTALACAO.md`
- **Deploy em Produção**: `DEPLOYMENT.md`
- **Deploy Gratuito (Render)**: `RENDER_DEPLOYMENT.md` ⭐
- **Deploy Alternativo (Railway)**: `RAILWAY_DEPLOYMENT.md`
- **Migração Supabase**: `SUPABASE_MIGRATION.md` 