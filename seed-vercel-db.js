// Script para crear usuarios en Vercel Postgres
import { readFileSync } from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const { Client } = pg;

// Leer variables de entorno
const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL no encontrada');
  process.exit(1);
}

console.log('🔗 Conectando a Vercel Postgres...');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Leer el archivo vercel-seed.sql
    console.log('📄 Leyendo vercel-seed.sql...');
    const seed = readFileSync('./vercel-seed.sql', 'utf8');

    // Ejecutar el seed
    console.log('⚙️  Creando usuarios de prueba...');
    await client.query(seed);

    console.log('✅ Usuarios creados exitosamente');
    console.log('');
    console.log('👥 Usuarios disponibles:');
    console.log('  ✅ admin / admin123 (Administrador)');
    console.log('  ✅ gerente / gerente123 (Gerente)');
    console.log('  ✅ supervisor / supervisor123 (Supervisor)');
    console.log('  ✅ empleado / empleado123 (Empleado)');
    console.log('  ✅ cliente / cliente123 (Cliente)');
    console.log('');
    console.log('🎉 ¡Todo listo!');
    console.log('');
    console.log('🚀 Ahora puedes:');
    console.log('   1. Abrir tu app en Vercel');
    console.log('   2. Hacer login con admin/admin123');
    console.log('   3. ¡Disfrutar de tu sistema en la nube!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.detail) {
      console.error('Detalle:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
