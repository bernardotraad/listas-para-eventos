// Simular o comportamento do frontend
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NDI2NDA1MywiZXhwIjoxNzU0MzUwNDUzfQ.g5z2H1Xe75y_zC_09CzDZekgATRa7dNOPqHqx4HglbU';

console.log('🧪 Testando armazenamento de token...');

// Simular localStorage
const mockLocalStorage = {
  data: {},
  setItem(key, value) {
    this.data[key] = value;
    console.log(`💾 Armazenado: ${key} = ${value.substring(0, 20)}...`);
  },
  getItem(key) {
    const value = this.data[key];
    console.log(`📖 Recuperado: ${key} = ${value ? value.substring(0, 20) + '...' : 'null'}`);
    return value;
  },
  removeItem(key) {
    delete this.data[key];
    console.log(`🗑️ Removido: ${key}`);
  }
};

// Simular o processo de login
console.log('\n🔐 Simulando login...');
mockLocalStorage.setItem('token', testToken);
mockLocalStorage.setItem('user', JSON.stringify({
  id: 1,
  username: 'admin',
  role: 'admin'
}));

// Simular verificação do token
console.log('\n🔍 Verificando token armazenado...');
const storedToken = mockLocalStorage.getItem('token');
const storedUser = mockLocalStorage.getItem('user');

if (storedToken && storedUser) {
  console.log('✅ Token e usuário encontrados no localStorage');
  console.log('🎫 Token:', storedToken.substring(0, 20) + '...');
  console.log('👤 Usuário:', JSON.parse(storedUser).username);
} else {
  console.log('❌ Token ou usuário não encontrados');
}

console.log('\n📊 Estado final do localStorage:');
console.log('Token:', mockLocalStorage.getItem('token') ? 'Presente' : 'Ausente');
console.log('User:', mockLocalStorage.getItem('user') ? 'Presente' : 'Ausente'); 