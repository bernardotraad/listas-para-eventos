const jwt = require('jsonwebtoken');
const axios = require('axios');

const API_URL = 'https://listas-eventos-backend.onrender.com/api';

async function decodeToken() {
  try {
    console.log('🔍 Decodificando token JWT...');
    
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
    console.log('🎫 Token completo:', token);
    
    // 2. Decodificar token sem verificar (para ver o conteúdo)
    console.log('\n🔍 2. Decodificando token (sem verificar)...');
    const decoded = jwt.decode(token);
    console.log('📋 Conteúdo do token:', JSON.stringify(decoded, null, 2));
    
    // 3. Verificar se o user ID existe no banco
    console.log('\n👤 3. Verificando se o usuário existe no banco...');
    try {
      const verifyResponse = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Usuário encontrado via /auth/verify:', verifyResponse.data.data);
    } catch (error) {
      console.log('❌ Erro ao verificar usuário:', error.response?.data || error.message);
    }
    
    // 4. Testar com um token modificado
    console.log('\n🧪 4. Testando com user ID modificado...');
    const modifiedPayload = { ...decoded, userId: 999 }; // ID inexistente
    const modifiedToken = jwt.sign(modifiedPayload, 'test_secret');
    
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${modifiedToken}`
        }
      });
      console.log('❌ Deveria ter falhado com ID inexistente');
    } catch (error) {
      console.log('✅ Corretamente falhou com ID inexistente:', error.response?.data?.error);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    if (error.response) {
      console.error('📡 Resposta do servidor:', error.response.data);
    }
  }
}

decodeToken(); 