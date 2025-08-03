const axios = require('axios');

async function testServer() {
  try {
    console.log('🧪 Testando se o servidor está rodando...');
    
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000
    });

    console.log('✅ Servidor está rodando!');
    console.log('📊 Status:', response.status);
    console.log('📊 Resposta:', response.data);

  } catch (error) {
    console.error('❌ Servidor não está rodando ou não acessível');
    console.error('📊 Erro:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Dica: Execute "npm run dev" para iniciar o servidor');
    }
  }
}

testServer(); 