-- Script para corrigir as políticas RLS para permitir autenticação
-- Este script deve ser executado no Supabase SQL Editor

-- Remover políticas existentes da tabela users
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
DROP POLICY IF EXISTS "Users are insertable by authenticated users" ON users;
DROP POLICY IF EXISTS "Users are updatable by authenticated users" ON users;
DROP POLICY IF EXISTS "Users are deletable by authenticated users" ON users;

-- Criar novas políticas que permitem autenticação
-- Permitir que qualquer pessoa veja usuários (necessário para login)
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Permitir que usuários autenticados insiram novos usuários
CREATE POLICY "Users are insertable by authenticated users" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir que usuários autenticados atualizem usuários
CREATE POLICY "Users are updatable by authenticated users" ON users
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir que usuários autenticados deletem usuários
CREATE POLICY "Users are deletable by authenticated users" ON users
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verificar se as políticas foram aplicadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users'; 