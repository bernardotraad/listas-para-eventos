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

async function debugLogin() {
  const baseUrl = 'https://listas-eventos-backend.onrender.com';
  
  console.log('🔍 Debugando problema de login...\n');
  
  // Teste 1: Verificar se o endpoint está funcionando
  console.log('1️⃣ Testando endpoint de login...');
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
    console.log('Resposta completa:', JSON.stringify(loginResponse.data, null, 2));
    console.log('');
    
    // Teste 2: Verificar se há outros usuários
    console.log('2️⃣ Testando com diferentes variações...');
    
    const variations = [
      { username: 'Admin', password: 'admin123' },
      { username: 'ADMIN', password: 'admin123' },
      { username: 'admin', password: 'Admin123' },
      { username: 'admin', password: 'ADMIN123' }
    ];
    
    for (const variation of variations) {
      console.log(`Testando: ${variation.username} / ${variation.password}`);
      try {
        const response = await makeRequest(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(variation)
        });
        
        console.log(`Status: ${response.status}`);
        if (response.status === 200) {
          console.log('✅ SUCESSO!');
          break;
        }
      } catch (error) {
        console.log(`Erro: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

debugLogin(); 