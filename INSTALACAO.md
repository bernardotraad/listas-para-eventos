# Guia de Instalação - Listas para Eventos

Este guia irá ajudá-lo a configurar o sistema "Listas para Eventos" usando Supabase como banco de dados.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase (gratuita em https://supabase.com)

## 🚀 Configuração do Supabase

### 1. Criar projeto no Supabase

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

## 🔧 Configuração do Backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

1. Copie o arquivo de exemplo:
```bash
cp env.example .env
```

2. Edite o arquivo `.env` com suas configurações do Supabase:

```env
# Configurações do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Configurações do Servidor
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Executar o backend

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🎨 Configuração do Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Configurar a API

Edite o arquivo `src/services/api.ts` e atualize a URL base da API:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### 3. Executar o frontend

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔐 Credenciais de Acesso

Após a instalação, você pode acessar o sistema com as seguintes credenciais:

- **Usuário**: `admin`
- **Senha**: `admin123`
- **Role**: `admin`

## 📁 Estrutura do Projeto

```
listas-para-eventos/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── config/         # Configurações
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # Páginas da aplicação
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── database/
│   └── supabase-schema.sql # Esquema do banco Supabase
└── README.md
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Documentação da API**: http://localhost:5000/api/docs

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Compilar para produção
npm run start        # Executar em modo produção
```

### Frontend
```bash
npm run dev          # Executar em modo desenvolvimento
npm run build        # Compilar para produção
npm run start        # Executar em modo produção
```

## 🚨 Troubleshooting

### Problemas comuns:

1. **Erro de conexão com Supabase**
   - Verifique se as credenciais estão corretas no `.env`
   - Confirme se o projeto está ativo no Supabase

2. **Erro de CORS**
   - Verifique se a URL do frontend está correta no `CORS_ORIGIN`
   - Certifique-se de que o backend está rodando na porta correta

3. **Erro de autenticação**
   - Verifique se o `JWT_SECRET` está configurado
   - Confirme se o usuário admin foi criado corretamente

## 📞 Suporte

Se você encontrar problemas durante a instalação, verifique:

1. Se todas as dependências foram instaladas corretamente
2. Se as variáveis de ambiente estão configuradas
3. Se o banco de dados foi criado e populado
4. Se as portas 3000 e 5000 estão disponíveis

Para mais informações, consulte a documentação do Supabase: https://supabase.com/docs 