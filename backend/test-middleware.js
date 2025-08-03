const axios = require('axios');

const API_URL = 'https://listas-eventos-backend.onrender.com/api';

async function testMiddleware() {
  try {
    console.log('🔍 Testando middleware de autenticação...');
    
    // 1. Fazer login para obter token
    console.log('\n🔐 1. Fazendo login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login falhou:', loginResponse.data.error);
      return;
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login bem-sucedido');
    console.log('🎫 Token:', token.substring(0, 20) + '...');
    
    // 2. Testar diferentes endpoints protegidos
    const protectedEndpoints = [
      '/events',
      '/users',
      '/name-lists/event/1'
    ];
    
    for (const endpoint of protectedEndpoints) {
      console.log(`\n🔒 Testando endpoint: ${endpoint}`);
      try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`✅ ${endpoint} - Sucesso:`, response.data.success);
      } catch (error) {
        console.log(`❌ ${endpoint} - Erro:`, error.response?.data?.error || error.message);
      }
    }
    
    // 3. Testar sem token
    console.log('\n🚫 Testando sem token...');
    try {
      const response = await axios.get(`${API_URL}/events`);
      console.log('❌ Deveria ter falhado sem token');
    } catch (error) {
      console.log('✅ Corretamente rejeitou sem token:', error.response?.data?.error);
    }
    
    // 4. Testar com token inválido
    console.log('\n🚫 Testando com token inválido...');
    try {
      const response = await axios.get(`${API_URL}/events`, {
        headers: {
          'Authorization': 'Bearer invalid_token_here'
        }
      });
      console.log('❌ Deveria ter falhado com token inválido');
    } catch (error) {
      console.log('✅ Corretamente rejeitou token inválido:', error.response?.data?.error);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('📡 Resposta do servidor:', error.response.data);
    }
  }
}

testMiddleware(); 