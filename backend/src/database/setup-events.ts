import { supabase } from '../config/database';

async function setupEvents() {
  try {
    console.log('🎉 Configurando eventos de exemplo...');

    // Verificar se já existem eventos
    const { data: existingEvents } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    if (existingEvents && existingEvents.length > 0) {
      console.log('⚠️  Eventos já existem no banco de dados.');
      return;
    }

    // Verificar se existe um usuário admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (!adminUser) {
      console.log('❌ Usuário admin não encontrado. Execute primeiro: npm run setup-admin');
      return;
    }

    // Inserir eventos de exemplo
    const sampleEvents = [
      {
        name: 'Workshop de Tecnologia 2024',
        description: 'Workshop sobre as últimas tendências em tecnologia, incluindo IA, blockchain e desenvolvimento web.',
        location: 'Auditório Principal - Centro de Eventos',
        event_date: '2024-03-15',
        event_time: '14:00:00',
        capacity: 100,
        created_by: adminUser.id
      },
      {
        name: 'Conferência de Marketing Digital',
        description: 'Conferência anual sobre marketing digital, redes sociais e estratégias de crescimento.',
        location: 'Sala de Conferências - Hotel Business',
        event_date: '2024-03-20',
        event_time: '09:00:00',
        capacity: 150,
        created_by: adminUser.id
      },
      {
        name: 'Meetup de Desenvolvedores',
        description: 'Encontro mensal de desenvolvedores para networking e compartilhamento de experiências.',
        location: 'Espaço Coworking - Tech Hub',
        event_date: '2024-03-25',
        event_time: '19:00:00',
        capacity: 50,
        created_by: adminUser.id
      },
      {
        name: 'Palestra sobre Empreendedorismo',
        description: 'Palestra inspiradora sobre empreendedorismo e como transformar ideias em negócios.',
        location: 'Auditório Pequeno - Faculdade de Administração',
        event_date: '2024-04-05',
        event_time: '16:00:00',
        capacity: 80,
        created_by: adminUser.id
      }
    ];

    const { error: insertError } = await supabase
      .from('events')
      .insert(sampleEvents);

    if (insertError) {
      console.error('❌ Erro ao inserir eventos:', insertError);
      return;
    }

    console.log('✅ Eventos de exemplo criados com sucesso!');
    console.log('');
    console.log('📅 Eventos criados:');
    sampleEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name} - ${event.event_date} às ${event.event_time}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao configurar eventos:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEvents();
}

export { setupEvents }; 