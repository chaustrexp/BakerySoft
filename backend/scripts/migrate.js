/**
 * Script de Migración de Base de Datos
 * ====================================
 * 
 * Ejecuta el esquema de base de datos en PostgreSQL
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection, closePool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ejecutar migración de base de datos
 */
async function migrate() {
  try {
    console.log('🚀 Iniciando migración de base de datos...');

    // Verificar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Leer archivo de esquema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Archivo de esquema no encontrado:', schemaPath);
      process.exit(1);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Ejecutando esquema de base de datos...');
    
    // Ejecutar esquema
    await query(schemaSQL);
    
    console.log('✅ Migración completada exitosamente');
    console.log('📊 Tablas creadas:');
    
    // Verificar tablas creadas
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log(`\n🎉 Base de datos configurada con ${tablesResult.rows.length} tablas`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}

export default migrate;