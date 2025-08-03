import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Verificar se as variáveis de ambiente do Supabase estão definidas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios no arquivo .env');
}

// Configuração do cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para executar queries SQL personalizadas
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: text,
      sql_params: params || []
    });
    
    const duration = Date.now() - start;
    console.log(`📊 Query executada em ${duration}ms:`, text.substring(0, 50) + '...');
    
    if (error) {
      console.error('❌ Erro na query:', error);
      throw error;
    }
    
    return { rows: data, rowCount: data?.length || 0 };
  } catch (error) {
    console.error('❌ Erro na query:', error);
    throw error;
  }
};

// Função para obter dados de uma tabela
export const from = (table: string) => {
  return supabase.from(table);
};

// Função para executar RPC (Remote Procedure Call)
export const rpc = (functionName: string, params?: any) => {
  return supabase.rpc(functionName, params);
};

console.log('✅ Conectado ao Supabase'); 