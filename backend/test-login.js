const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testando login do usuário admin...');
    
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };

    console.log('📤 Enviando dados de login:', { username: loginData.username, password: '***' });

    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Login bem-sucedido!');
    console.log('📊 Resposta:', {
      success: response.data.success,
      message: response.data.message,
      user: {
        id: response.data.data.user.id,
        username: response.data.data.user.username,
        email: response.data.data.user.email,
        role: response.data.data.user.role
      },
      token: response.data.data.token ? 'Token gerado com sucesso' : 'Token não gerado'
    });

  } catch (error) {
    console.error('❌ Erro no login:');
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('📊 Status:', error.response.status);
      console.error('📊 Dados da resposta:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('📊 Erro de conexão:', error.message);
      console.error('📊 Detalhes:', error.code);
    } else {
      // Erro na configuração da requisição
      console.error('📊 Erro de configuração:', error.message);
    }
    
    console.error('📊 Erro completo:', error.message);
  }
}

testLogin(); 