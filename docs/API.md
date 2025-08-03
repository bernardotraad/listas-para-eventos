# API Documentation - Listas para Eventos

## Base URL
```
http://localhost:5000/api
```

## Autenticação
A API usa JWT (JSON Web Tokens) para autenticação. Para endpoints protegidos, inclua o token no header:
```
Authorization: Bearer <seu_token>
```

## Endpoints

### 🔐 Autenticação

#### POST /auth/login
Login de usuário
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@eventos.com",
      "role": "admin",
      "full_name": "Administrador do Sistema",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Login realizado com sucesso"
}
```

#### GET /auth/verify
Verificar token atual
**Headers:** `Authorization: Bearer <token>`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@eventos.com",
    "role": "admin",
    "full_name": "Administrador do Sistema",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Token válido"
}
```

### 📅 Eventos

#### GET /events/active (Público)
Listar eventos ativos
**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Workshop de Tecnologia",
      "description": "Workshop sobre as últimas tendências em tecnologia",
      "location": "Auditório Principal",
      "event_date": "2024-02-15",
      "event_time": "14:00:00",
      "capacity": 100,
      "status": "ativo"
    }
  ],
  "message": "Eventos ativos listados com sucesso"
}
```

#### GET /events/:id (Público)
Buscar evento por ID
**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Workshop de Tecnologia",
    "description": "Workshop sobre as últimas tendências em tecnologia",
    "location": "Auditório Principal",
    "event_date": "2024-02-15",
    "event_time": "14:00:00",
    "capacity": 100,
    "status": "ativo",
    "created_by": 1,
    "created_by_name": "Administrador do Sistema",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Evento encontrado com sucesso"
}
```

#### GET /events (Protegido - Admin/Portaria)
Listar todos os eventos
**Headers:** `Authorization: Bearer <token>`

#### POST /events (Protegido - Admin/Portaria)
Criar novo evento
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Novo Evento",
  "description": "Descrição do evento",
  "location": "Local do evento",
  "event_date": "2024-03-15",
  "event_time": "15:00:00",
  "capacity": 50
}
```

#### PUT /events/:id (Protegido - Admin/Portaria)
Atualizar evento
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Evento Atualizado",
  "status": "cancelado"
}
```

#### DELETE /events/:id (Protegido - Admin)
Deletar evento
**Headers:** `Authorization: Bearer <token>`

#### GET /events/:id/stats (Protegido - Admin/Portaria)
Obter estatísticas do evento
**Headers:** `Authorization: Bearer <token>`
**Resposta:**
```json
{
  "success": true,
  "data": {
    "name": "Workshop de Tecnologia",
    "capacity": 100,
    "total_registrations": 25,
    "present_count": 20,
    "absent_count": 3,
    "pending_count": 2
  },
  "message": "Estatísticas do evento obtidas com sucesso"
}
```

### 👥 Listas de Nomes

#### POST /name-lists/submit (Público)
Enviar múltiplos nomes para um evento
```json
{
  "event_id": 1,
  "names": ["João Silva", "Maria Santos", "Pedro Costa"],
  "emails": ["joao@email.com", "maria@email.com", "pedro@email.com"],
  "phones": ["11999999999", "11888888888", "11777777777"]
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "inserted": [
      {
        "id": 1,
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "11999999999",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "errors": ["Nome 2 (Maria Santos): Já registrado"],
    "event": {
      "id": 1,
      "name": "Workshop de Tecnologia",
      "status": "ativo"
    }
  },
  "message": "Processamento concluído. 1 nomes inseridos com sucesso. 1 erros encontrados."
}
```

#### GET /name-lists/event/:event_id (Protegido - Admin/Portaria)
Listar nomes de um evento
**Headers:** `Authorization: Bearer <token>`
**Query Params:** `?status=presente&search=joão`

#### PUT /name-lists/:name_list_id/checkin (Protegido - Admin/Portaria)
Fazer check-in de participante
**Headers:** `Authorization: Bearer <token>`
```json
{
  "status": "presente",
  "notes": "Check-in realizado às 14:30"
}
```

#### POST /name-lists/event/:event_id/add (Protegido - Admin/Portaria)
Adicionar nome individual
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Novo Participante",
  "email": "novo@email.com",
  "phone": "11666666666"
}
```

#### GET /name-lists/event/:event_id/search (Protegido - Admin/Portaria)
Buscar participante por nome
**Headers:** `Authorization: Bearer <token>`
**Query Params:** `?name=joão`

### 👤 Usuários (Apenas Admin)

#### GET /users (Protegido - Admin)
Listar todos os usuários
**Headers:** `Authorization: Bearer <token>`

#### GET /users/:id (Protegido - Admin)
Buscar usuário por ID
**Headers:** `Authorization: Bearer <token>`

#### PUT /users/:id (Protegido - Admin)
Atualizar usuário
**Headers:** `Authorization: Bearer <token>`
```json
{
  "full_name": "Nome Atualizado",
  "role": "portaria",
  "is_active": true
}
```

#### DELETE /users/:id (Protegido - Admin)
Deletar usuário
**Headers:** `Authorization: Bearer <token>`

#### POST /auth/register (Protegido - Admin)
Registrar novo usuário
**Headers:** `Authorization: Bearer <token>**
```json
{
  "username": "novo_usuario",
  "email": "novo@email.com",
  "password": "senha123",
  "role": "portaria",
  "full_name": "Novo Usuário"
}
```

### 🔍 Health Check

#### GET /health
Verificar status da API
**Resposta:**
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autenticado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Estrutura de Resposta

Todas as respostas seguem o padrão:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string
}
```

## Rate Limiting

- **Geral:** 100 requisições por IP por 15 minutos
- **Envio de nomes:** 5 envios por IP por minuto

## Exemplos de Uso

### Enviar nomes para evento (Público)
```bash
curl -X POST http://localhost:5000/api/name-lists/submit \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "names": ["João Silva", "Maria Santos"],
    "emails": ["joao@email.com", "maria@email.com"]
  }'
```

### Login e uso de token
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Usar token
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer <seu_token>"
``` 