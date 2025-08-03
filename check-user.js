const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (você precisa adicionar suas credenciais)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  try {
    console.log('🔍 Verificando usuário admin no banco...\n');
    
    // Buscar usuário admin
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single();
    
    if (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return;
    }
    
    if (!user) {
      console.log('❌ Usuário admin não encontrado!');
      return;
    }
    
    console.log('✅ Usuário admin encontrado:');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Is Active:', user.is_active);
    console.log('Password Hash:', user.password_hash);
    console.log('Created At:', user.created_at);
    console.log('');
    
    // Verificar se o hash da senha está correto
    const bcrypt = require('bcryptjs');
    const password = 'admin123';
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    console.log('🔐 Teste da senha:');
    console.log('Senha testada:', password);
    console.log('Hash válido?', isValid);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkUser(); 