# Frontend - Sistema de Listas para Eventos

Este é o frontend do sistema de gerenciamento de listas de nomes para eventos, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades Implementadas

### 1. **Páginas de Autenticação**
- ✅ Login com validação de formulário
- ✅ Logout automático
- ✅ Redirecionamento baseado em perfil
- ✅ Proteção de rotas

### 2. **Painel do Administrador**
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de eventos
- ✅ CRUD completo de usuários
- ✅ Gerenciamento de permissões
- ✅ Visualização de relatórios

### 3. **Painel da Portaria**
- ✅ Dashboard específico para portaria
- ✅ Sistema de check-in de participantes
- ✅ Cadastro manual de nomes
- ✅ Busca e filtros de participantes
- ✅ Visualização de eventos ativos

### 4. **Componentes React Reutilizáveis**
- ✅ Button (com variantes e loading)
- ✅ Input (com validação)
- ✅ Select (com opções)
- ✅ Card (com header e footer)
- ✅ Table (com colunas customizáveis)
- ✅ Modal (com backdrop)
- ✅ Badge (com variantes)
- ✅ Alert (com tipos)
- ✅ LoadingSpinner
- ✅ Layout (Header + Sidebar)

### 5. **Páginas de Dashboard por Perfil**
- ✅ Dashboard Admin (estatísticas gerais)
- ✅ Dashboard Portaria (foco em check-in)
- ✅ Navegação baseada em perfil
- ✅ Sidebar responsiva

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Páginas Next.js 13+
│   │   ├── dashboard/          # Páginas do dashboard
│   │   │   ├── events/         # Gerenciamento de eventos
│   │   │   ├── users/          # Gerenciamento de usuários
│   │   │   ├── checkin/        # Check-in (portaria)
│   │   │   └── names/          # Cadastro de nomes (portaria)
│   │   ├── login/              # Página de login
│   │   └── page.tsx            # Página inicial
│   ├── components/             # Componentes reutilizáveis
│   │   ├── ui/                 # Componentes base
│   │   ├── layout/             # Componentes de layout
│   │   └── forms/              # Formulários específicos
│   ├── contexts/               # Contextos React
│   ├── services/               # Serviços de API
│   ├── types/                  # Tipos TypeScript
│   └── lib/                    # Utilitários
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **clsx + tailwind-merge** - Utilitários CSS

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env.local
```

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
npm start
```

## 🔐 Autenticação

O sistema utiliza JWT tokens para autenticação:

- **Login:** `/login` - Página de autenticação
- **Verificação:** Token verificado automaticamente
- **Logout:** Limpa token e redireciona
- **Proteção:** Rotas protegidas por perfil

## 👥 Perfis de Usuário

### **Administrador**
- Acesso completo ao sistema
- Gerenciamento de eventos
- Gerenciamento de usuários
- Visualização de relatórios
- Configurações do sistema

### **Portaria**
- Dashboard focado em check-in
- Realização de check-in
- Cadastro manual de participantes
- Visualização de eventos ativos
- Busca de participantes

## 🎨 Componentes UI

### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Clique aqui
</Button>
```

### Input
```tsx
<Input 
  label="Nome" 
  placeholder="Digite seu nome"
  error={errors.name}
/>
```

### Card
```tsx
<Card header={<h3>Título</h3>} footer={<p>Rodapé</p>}>
  Conteúdo do card
</Card>
```

### Table
```tsx
<Table 
  data={data} 
  columns={columns}
  loading={isLoading}
/>
```

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Mobile:** Sidebar colapsável
- **Tablet:** Layout adaptativo
- **Desktop:** Layout completo

## 🔧 Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Tailwind CSS
Configurado com classes utilitárias e componentes customizados.

## 📊 Funcionalidades por Página

### Dashboard Principal (`/dashboard`)
- Estatísticas gerais
- Ações rápidas
- Eventos recentes
- Navegação por perfil

### Eventos (`/dashboard/events`)
- Lista de eventos
- Criação de eventos
- Edição de eventos
- Exclusão de eventos
- Filtros e busca

### Usuários (`/dashboard/users`)
- Lista de usuários
- Criação de usuários
- Edição de usuários
- Exclusão de usuários
- Gerenciamento de permissões

### Check-in (`/dashboard/checkin`)
- Seleção de evento
- Lista de participantes
- Realização de check-in
- Busca de participantes
- Status de presença

### Cadastro de Nomes (`/dashboard/names`)
- Seleção de evento
- Formulário de cadastro
- Múltiplos nomes
- Validação de dados
- Feedback de sucesso

## 🎯 Próximos Passos

- [ ] Formulários de criação/edição de eventos
- [ ] Formulários de criação/edição de usuários
- [ ] Página de relatórios
- [ ] Página de configurações
- [ ] Melhorias de UX/UI
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 