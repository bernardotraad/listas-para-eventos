const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testAdminUser() {
  try {
    console.log('🧪 Testando busca do usuário admin...');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL é obrigatório');
    }

    // Usar service role key se disponível, senão usar anon key
    const supabaseKey = serviceRoleKey || anonKey;
    
    if (!supabaseKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY é obrigatório');
    }

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

    // Testar busca do admin
    const { data: adminUser, error } = await supabase
      .from('users')
      .select('id, username, email, role, is_active')
      .eq('username', 'admin')
      .single();

    if (error) {
      console.error('❌ Erro ao buscar admin:', error);
      return;
    }

    if (adminUser) {
      console.log('✅ Usuário admin encontrado:');
      console.log('   ID:', adminUser.id);
      console.log('   Username:', adminUser.username);
      console.log('   Email:', adminUser.email);
      console.log('   Role:', adminUser.role);
      console.log('   Ativo:', adminUser.is_active);
    } else {
      console.log('❌ Usuário admin não encontrado');
    }

    // Testar busca de todos os usuários
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, username, email, role');

    if (allUsersError) {
      console.error('❌ Erro ao buscar todos os usuários:', allUsersError);
    } else {
      console.log(`📊 Total de usuários no banco: ${allUsers?.length || 0}`);
      if (allUsers && allUsers.length > 0) {
        allUsers.forEach(user => {
          console.log(`   - ${user.username} (${user.role})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testAdminUser(); 