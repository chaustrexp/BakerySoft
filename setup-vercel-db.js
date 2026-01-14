// Script para ejecutar schema.sql en Vercel Postgres
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
  console.error('Asegúrate de tener el archivo .env.local');
  process.exit(1);
}

console.log('🔗 Conectando a Vercel Postgres...');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Leer el archivo schema.sql
    console.log('📄 Leyendo schema.sql...');
    const schema = readFileSync('./backend/database/schema.sql', 'utf8');

    // Ejecutar el schema
    console.log('⚙️  Ejecutando schema (esto puede tardar 1-2 minutos)...');
    await client.query(schema);

    console.log('✅ Schema ejecutado exitosamente');
    console.log('');
    console.log('🎉 ¡Base de datos configurada!');
    console.log('');
    console.log('📊 Tablas creadas:');
    console.log('  ✅ users');
    console.log('  ✅ employees');
    console.log('  ✅ customers');
    console.log('  ✅ products');
    console.log('  ✅ product_categories');
    console.log('  ✅ raw_materials');
    console.log('  ✅ suppliers');
    console.log('  ✅ orders');
    console.log('  ✅ order_items');
    console.log('  ✅ recipes');
    console.log('  ✅ recipe_ingredients');
    console.log('  ✅ production_batches');
    console.log('  ✅ financial_transactions');
    console.log('  ✅ inventory_movements');
    console.log('  ✅ system_settings');
    console.log('  ✅ audit_logs');
    console.log('');
    console.log('🚀 Siguiente paso: Ejecutar seed para crear usuarios');
    console.log('   Comando: node seed-vercel-db.js');

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

setupDatabase();
