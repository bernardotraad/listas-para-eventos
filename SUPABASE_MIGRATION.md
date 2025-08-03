# Migração para Supabase - Listas para Eventos

Este documento descreve as mudanças realizadas para migrar o sistema de PostgreSQL local para Supabase.

## 🔄 Mudanças Realizadas

### 1. **Dependências do Backend**

**Removidas:**
- `pg` - Cliente PostgreSQL direto
- `@types/pg` - Tipos do PostgreSQL

**Adicionadas:**
- `@supabase/supabase-js` - Cliente Supabase

### 2. **Configuração do Banco de Dados**

**Arquivo:** `backend/src/config/database.ts`

**Antes:**
```typescript
import { Pool } from 'pg';
// Configuração direta do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
```

**Depois:**
```typescript
import { createClient } from '@supabase/supabase-js';
// Configuração do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

### 3. **Variáveis de Ambiente**

**Arquivo:** `backend/env.example`

**Antes:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=listas_eventos
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
```

**Depois:**
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
```

### 4. **Controladores Atualizados**

Todos os controladores foram atualizados para usar a API do Supabase:

#### **AuthController**
- Substituído `query()` por `from('users')`
- Atualizada lógica de busca e inserção

#### **EventController**
- Substituído queries SQL por métodos Supabase
- Adicionado suporte a relacionamentos com `users!events_created_by_fkey`

#### **NameListController**
- Atualizada lógica de inserção em lote
- Melhorado tratamento de erros

#### **UserController**
- Simplificada lógica de atualização
- Melhorado tratamento de validações

### 5. **Middleware de Autenticação**

**Arquivo:** `backend/src/middleware/auth.ts`

- Atualizado para usar Supabase
- Melhorado tratamento de erros
- Mantida compatibilidade com JWT

### 6. **Esquema do Banco**

**Novo arquivo:** `database/supabase-schema.sql`

**Principais mudanças:**
- Adicionado Row Level Security (RLS)
- Configuradas políticas de acesso
- Mantida compatibilidade com o esquema original
- Adicionados índices para performance

### 7. **Tipos TypeScript**

**Arquivo:** `backend/src/types/index.ts`

**Mudanças:**
- Corrigido `AuthenticatedRequest` para estender `express.Request`
- Atualizados tipos de data para `string` (compatibilidade com Supabase)
- Adicionados campos opcionais para relacionamentos

## 🚀 Como Usar

### 1. **Configurar Supabase**
1. Criar projeto no [supabase.com](https://supabase.com)
2. Executar o script `database/supabase-schema.sql`
3. Copiar credenciais do projeto

### 2. **Configurar Backend**
```bash
cd backend
cp env.example .env
# Editar .env com suas credenciais do Supabase
npm install
npm run build
```

### 3. **Configurar Frontend**
```bash
cd frontend
npm install
npm run build
```

## 🔧 Vantagens da Migração

### **Supabase vs PostgreSQL Local**

| Aspecto | PostgreSQL Local | Supabase |
|---------|------------------|----------|
| **Setup** | Complexo (instalação, configuração) | Simples (criar projeto) |
| **Hosting** | Requer servidor próprio | Gerenciado |
| **Backup** | Manual | Automático |
| **Escalabilidade** | Limitada | Automática |
| **Segurança** | Manual | Integrada |
| **API** | Manual | Automática |
| **Auth** | Manual | Integrada |
| **RLS** | Manual | Fácil configuração |

### **Benefícios Específicos**

1. **Row Level Security (RLS)**
   - Controle granular de acesso aos dados
   - Políticas baseadas em roles
   - Segurança no nível do banco

2. **API Automática**
   - Endpoints REST automáticos
   - Suporte a GraphQL
   - Real-time subscriptions

3. **Autenticação Integrada**
   - Sistema de auth pronto
   - Múltiplos provedores
   - JWT automático

4. **Dashboard Web**
   - Interface para gerenciar dados
   - Logs em tempo real
   - Monitoramento de performance

## 🔒 Segurança

### **Políticas RLS Implementadas**

```sql
-- Usuários: apenas autenticados
CREATE POLICY "Users are viewable by authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Eventos: público pode ver, autenticados podem editar
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

-- Listas: público pode inserir, autenticados podem ver/editar
CREATE POLICY "Name lists are insertable by everyone" ON name_lists
    FOR INSERT WITH CHECK (true);
```

## 📊 Performance

### **Otimizações Implementadas**

1. **Índices Estratégicos**
   ```sql
   CREATE INDEX idx_events_status ON events(status);
   CREATE INDEX idx_events_date ON events(event_date);
   CREATE INDEX idx_name_lists_event_id ON name_lists(event_id);
   ```

2. **Relacionamentos Otimizados**
   - Uso de foreign keys
   - Joins eficientes
   - Contagem otimizada

3. **Paginação**
   - Suporte a `limit()` e `offset()`
   - Contagem eficiente com `count: 'exact'`

## 🐛 Troubleshooting

### **Problemas Comuns**

1. **Erro de conexão**
   - Verificar credenciais do Supabase
   - Confirmar se o projeto está ativo

2. **Erro de RLS**
   - Verificar políticas de acesso
   - Confirmar se o usuário está autenticado

3. **Erro de tipos**
   - Verificar se os tipos estão corretos
   - Confirmar compatibilidade com Supabase

### **Logs Úteis**

```bash
# Backend
npm run dev

# Verificar conexão
curl http://localhost:5000/api/health

# Testar autenticação
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript)
- [Exemplos de Uso](https://supabase.com/docs/guides/examples)

## 🔄 Próximos Passos

1. **Configurar ambiente de produção**
2. **Implementar backup automático**
3. **Configurar monitoramento**
4. **Otimizar queries complexas**
5. **Implementar cache se necessário**

---

**Status:** ✅ Migração Concluída  
**Versão:** 2.0.0  
**Data:** Janeiro 2024 