-- Esquema do banco de dados para Listas para Eventos
-- PostgreSQL

-- Enum para tipos de usuário
CREATE TYPE user_role AS ENUM ('admin', 'portaria');

-- Enum para status de eventos
CREATE TYPE event_status AS ENUM ('ativo', 'cancelado', 'finalizado');

-- Enum para status de check-in
CREATE TYPE checkin_status AS ENUM ('pendente', 'presente', 'ausente');

-- Tabela de usuários do sistema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'portaria',
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de eventos
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    event_date DATE NOT NULL,
    event_time TIME,
    capacity INTEGER,
    status event_status DEFAULT 'ativo',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de listas de nomes (participantes)
CREATE TABLE name_lists (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    checkin_status checkin_status DEFAULT 'pendente',
    checkin_time TIMESTAMP,
    checked_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_name_lists_updated_at BEFORE UPDATE ON name_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (username, email, password_hash, role, full_name) 
VALUES ('admin', 'admin@eventos.com', '$2b$10$rQZ8K9mN2pL1vX3yW4uI5oP6qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6kL7mN8oP9', 'admin', 'Administrador do Sistema');

-- Inserir alguns eventos de exemplo
INSERT INTO events (name, description, location, event_date, event_time, capacity, created_by) 
VALUES 
    ('Workshop de Tecnologia', 'Workshop sobre as últimas tendências em tecnologia', 'Auditório Principal', '2024-02-15', '14:00:00', 100, 1),
    ('Conferência de Marketing', 'Conferência anual de marketing digital', 'Sala de Conferências', '2024-02-20', '09:00:00', 150, 1),
    ('Meetup de Desenvolvedores', 'Encontro mensal de desenvolvedores', 'Espaço Coworking', '2024-02-25', '19:00:00', 50, 1); 