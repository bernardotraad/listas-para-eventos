const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'admin123';
  
  // Hash que está no banco de dados
  const storedHash = '$2a$12$zP/TC57tcO1xO6CYGmkLm.8gxhuzgaCPGIIzcHVrZmAerMcaabkDO';
  
  console.log('🔐 Testando senha...');
  console.log('Senha:', password);
  console.log('Hash armazenado:', storedHash);
  console.log('');
  
  // Testar se a senha corresponde ao hash
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('✅ Senha válida?', isValid);
  
  if (!isValid) {
    console.log('❌ Problema: A senha não corresponde ao hash!');
    console.log('');
    console.log('🔧 Gerando novo hash...');
    const newHash = await bcrypt.hash(password, 12);
    console.log('Novo hash:', newHash);
    console.log('');
    console.log('SQL para atualizar:');
    console.log(`UPDATE users SET password_hash = '${newHash}' WHERE username = 'admin';`);
  } else {
    console.log('✅ Hash está correto! O problema pode estar em outro lugar.');
  }
}

testPassword(); 