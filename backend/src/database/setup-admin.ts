import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function setupAdmin() {
  try {
    console.log('🔧 Configurando usuário admin...');

    // Verificar se temos a service role key para bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL não encontrada no arquivo .env');
    }

    // Usar service role key se disponível, senão usar anon key
    const supabaseKey = serviceRoleKey || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY não encontrada no arquivo .env');
    }

    // Criar cliente Supabase com a chave apropriada
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    if (serviceRoleKey) {
      console.log('🔑 Usando service role key (bypass RLS)');
    } else {
      console.log('⚠️  Usando anon key (pode falhar devido a RLS)');
    }

    // Verificar se o admin já existe
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe. Atualizando senha...');
      
      // Hash da nova senha
      const passwordHash = await bcrypt.hash('admin123', 12);
      
      // Atualizar senha do admin
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_hash: passwordHash,
          is_active: true 
        })
        .eq('username', 'admin');

      if (updateError) {
        console.error('❌ Erro ao atualizar admin:', updateError);
        return;
      }

      console.log('✅ Senha do admin atualizada com sucesso!');
    } else {
      console.log('📝 Criando novo usuário admin...');
      
      // Hash da senha
      const passwordHash = await bcrypt.hash('admin123', 12);
      
      // Inserir admin
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          email: 'admin@eventos.com',
          password_hash: passwordHash,
          role: 'admin',
          full_name: 'Administrador do Sistema',
          is_active: true
        });

      if (insertError) {
        console.error('❌ Erro ao criar admin:', insertError);
        return;
      }

      console.log('✅ Usuário admin criado com sucesso!');
    }

    console.log('');
    console.log('🔑 Credenciais do Admin:');
    console.log('Username: admin');
    console.log('Senha: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupAdmin();
}

export { setupAdmin }; 