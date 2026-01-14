// Script para generar hashes de contraseñas
// Ejecutar con: node generate-hashes.js

import bcrypt from 'bcryptjs';

const passwords = {
  'admin123': 'admin',
  'gerente123': 'gerente',
  'supervisor123': 'supervisor',
  'empleado123': 'empleado',
  'cliente123': 'cliente'
};

console.log('Generando hashes de contraseñas...\n');

for (const [password, user] of Object.entries(passwords)) {
  const hash = bcrypt.hashSync(password, 10);
  console.log(`${user}: ${password}`);
  console.log(`Hash: ${hash}\n`);
}
