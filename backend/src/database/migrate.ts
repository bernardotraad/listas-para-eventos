import { supabase } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🚀 Iniciando migração do Supabase...');

    // Ler o arquivo de schema
    const schemaPath = path.join(__dirname, '../../../database/supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Dividir o schema em comandos individuais
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Executando ${commands.length} comandos...`);

    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql_query: command + ';'
          });

          if (error) {
            console.error(`❌ Erro no comando ${i + 1}:`, error);
            console.error('Comando:', command);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.error(`❌ Erro ao executar comando ${i + 1}:`, err);
        }
      }
    }

    console.log('🎉 Migração concluída!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  runMigration();
}

export { runMigration }; 