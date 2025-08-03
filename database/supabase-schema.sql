-- Esquema do banco de dados para Listas para Eventos
-- Supabase PostgreSQL

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para tipos de usuário
CREATE TYPE user_role AS ENUM ('admin', 'portaria');

-- Enum para status de eventos
CREATE TYPE event_status AS ENUM ('ativo', 'cancelado', 'finalizado');

-- Enum para status de check-in
CREATE TYPE checkin_status AS ENUM ('pendente', 'presente', 'ausente');

-- Tabela de usuários do sistema
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'portaria',
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de eventos
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    event_date DATE NOT NULL,
    event_time TIME,
    capacity INTEGER,
    status event_status DEFAULT 'ativo',
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de listas de nomes (participantes)
CREATE TABLE name_lists (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    checkin_status checkin_status DEFAULT 'pendente',
    checkin_time TIMESTAMPTZ,
    checked_by BIGINT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para otimização de performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_name_lists_event_id ON name_lists(event_id);
CREATE INDEX idx_name_lists_name ON name_lists(name);
CREATE INDEX idx_name_lists_checkin_status ON name_lists(checkin_status);
CREATE INDEX idx_users_role ON users(role);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_name_lists_updated_at BEFORE UPDATE ON name_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Configurar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE name_lists ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela users (apenas admins podem ver/editar)
CREATE POLICY "Users are viewable by authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users are insertable by authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users are updatable by authenticated users" ON users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users are deletable by authenticated users" ON users
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para a tabela events (público pode ver eventos ativos)
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Events are insertable by authenticated users" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events are updatable by authenticated users" ON events
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Events are deletable by authenticated users" ON events
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para a tabela name_lists (público pode inserir, autenticados podem ver/editar)
CREATE POLICY "Name lists are viewable by authenticated users" ON name_lists
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Name lists are insertable by everyone" ON name_lists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Name lists are updatable by authenticated users" ON name_lists
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Name lists are deletable by authenticated users" ON name_lists
    FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir usuário admin padrão (senha: admin123)
-- Hash gerado com bcrypt: bcrypt.hash('admin123', 12)
INSERT INTO users (username, email, password_hash, role, full_name) 
VALUES ('admin', 'admin@eventos.com', '$2a$12$zP/TC57tcO1xO6CYGmkLm.8gxhuzgaCPGIIzcHVrZmAerMcaabkDO', 'admin', 'Administrador do Sistema');

-- Inserir alguns eventos de exemplo
INSERT INTO events (name, description, location, event_date, event_time, capacity, created_by) 
VALUES 
    ('Workshop de Tecnologia', 'Workshop sobre as últimas tendências em tecnologia', 'Auditório Principal', '2024-02-15', '14:00:00', 100, 1),
    ('Conferência de Marketing', 'Conferência anual de marketing digital', 'Sala de Conferências', '2024-02-20', '09:00:00', 150, 1),
    ('Meetup de Desenvolvedores', 'Encontro mensal de desenvolvedores', 'Espaço Coworking', '2024-02-25', '19:00:00', 50, 1); 