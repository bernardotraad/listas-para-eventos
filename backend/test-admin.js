const axios = require('axios');

const API_URL = 'https://listas-eventos-backend.onrender.com/api';

async function testAdmin() {
  try {
    console.log('🔍 Testando configuração do admin...');
    
    // Teste 1: Verificar se o servidor está rodando
    console.log('\n📡 Teste 1: Verificando se o servidor está rodando...');
    try {
      const healthResponse = await axios.get(`${API_URL}/health`);
      console.log('✅ Servidor está rodando:', healthResponse.data);
    } catch (error) {
      console.log('❌ Servidor não está respondendo:', error.message);
      return;
    }

    // Teste 2: Verificar variáveis de ambiente
    console.log('\n🔧 Teste 2: Verificando variáveis de ambiente...');
    try {
      const envResponse = await axios.get(`${API_URL}/auth/env-check`);
      console.log('✅ Variáveis de ambiente:', envResponse.data);
    } catch (error) {
      console.log('❌ Erro ao verificar variáveis de ambiente:', error.message);
    }

    // Teste 3: Login do admin
    console.log('\n🔐 Teste 3: Testando login do admin...');
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('📡 Resposta do login:', loginResponse.data);

    if (loginResponse.data.success) {
      const token = loginResponse.data.data.token;
      console.log('🎫 Token recebido:', token.substring(0, 20) + '...');

      // Teste 4: Verificar token
      console.log('\n🔍 Teste 4: Verificando token...');
      try {
        const verifyResponse = await axios.get(`${API_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Token verificado com sucesso:', verifyResponse.data);
      } catch (error) {
        console.log('❌ Erro ao verificar token:', error.response?.data || error.message);
      }

      // Teste 5: Testar endpoint protegido
      console.log('\n🔒 Teste 5: Testando endpoint protegido...');
      try {
        const eventsResponse = await axios.get(`${API_URL}/events`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Endpoint protegido funcionando:', eventsResponse.data);
      } catch (error) {
        console.log('❌ Erro no endpoint protegido:', error.response?.data || error.message);
      }
    } else {
      console.log('❌ Login falhou:', loginResponse.data.error);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('📡 Resposta do servidor:', error.response.data);
    }
  }
}

testAdmin(); 