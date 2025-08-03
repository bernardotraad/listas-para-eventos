import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function fixRLSPolicies() {
  try {
    console.log('🔧 Corrigindo políticas RLS...');

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
    }

    // Criar cliente Supabase com service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🔑 Usando service role key para aplicar correções...');

    // Remover políticas existentes da tabela users
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;',
      'DROP POLICY IF EXISTS "Users are insertable by authenticated users" ON users;',
      'DROP POLICY IF EXISTS "Users are updatable by authenticated users" ON users;',
      'DROP POLICY IF EXISTS "Users are deletable by authenticated users" ON users;'
    ];

    for (const policy of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: policy });
      if (error) {
        console.log(`⚠️  Aviso ao remover política: ${error.message}`);
      }
    }

    // Criar novas políticas que permitem autenticação
    const createPolicies = [
      `CREATE POLICY "Users are viewable by everyone" ON users
       FOR SELECT USING (true);`,
      
      `CREATE POLICY "Users are insertable by authenticated users" ON users
       FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
      
      `CREATE POLICY "Users are updatable by authenticated users" ON users
       FOR UPDATE USING (auth.role() = 'authenticated');`,
      
      `CREATE POLICY "Users are deletable by authenticated users" ON users
       FOR DELETE USING (auth.role() = 'authenticated');`
    ];

    for (const policy of createPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: policy });
      if (error) {
        console.error(`❌ Erro ao criar política: ${error.message}`);
        return;
      }
    }

    console.log('✅ Políticas RLS corrigidas com sucesso!');
    console.log('');
    console.log('📋 Resumo das mudanças:');
    console.log('   - Usuários agora são visíveis para todos (necessário para login)');
    console.log('   - Apenas usuários autenticados podem inserir/atualizar/deletar usuários');
    console.log('   - Isso resolve o problema de autenticação circular');
    
  } catch (error) {
    console.error('❌ Erro ao corrigir políticas RLS:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixRLSPolicies();
}

export { fixRLSPolicies }; 