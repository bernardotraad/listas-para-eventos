const https = require('https');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testLogin() {
  const baseUrl = 'https://listas-eventos-backend.onrender.com';
  
  console.log('🔐 Testando login completo...\n');
  
  // Teste 1: Login com credenciais corretas
  console.log('1️⃣ Testando login com admin/admin123...');
  try {
    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    console.log('Status:', loginResponse.status);
    console.log('Resposta:', JSON.stringify(loginResponse.data, null, 2));
    console.log('');
    
    if (loginResponse.status === 200) {
      console.log('✅ Login bem-sucedido!');
      
      // Teste 2: Verificar token
      const token = loginResponse.data.data.token;
      console.log('2️⃣ Testando verificação do token...');
      
      const verifyResponse = await makeRequest(`${baseUrl}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status da verificação:', verifyResponse.status);
      console.log('Resposta da verificação:', JSON.stringify(verifyResponse.data, null, 2));
    } else {
      console.log('❌ Login falhou!');
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testLogin(); 