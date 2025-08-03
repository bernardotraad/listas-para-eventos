import { supabase } from '../config/database';
import bcrypt from 'bcryptjs';

async function setupAdmin() {
  try {
    console.log('🔧 Configurando usuário admin...');

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