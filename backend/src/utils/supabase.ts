import { createClient } from '@supabase/supabase-js';

// Função para obter cliente Supabase com service role key para autenticação
export function getAuthSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  
  console.log('🔧 Verificando variáveis de ambiente...');
  console.log('🔧 SUPABASE_URL:', supabaseUrl ? 'Configurado' : 'NÃO CONFIGURADO');
  console.log('🔧 SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'Configurado' : 'NÃO CONFIGURADO');
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Variáveis de ambiente faltando:', { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey });
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  }

  console.log('✅ Criando cliente Supabase com service role key...');
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} 