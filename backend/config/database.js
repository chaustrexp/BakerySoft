/**
 * Configuración de Base de Datos PostgreSQL
 * =========================================
 * 
 * Configuración y conexión con PostgreSQL para BakerySoft
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'bakerysoft_db',
  user: process.env.DB_USER || 'bakerysoft_user',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo de espera para conectar
};

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Evento de conexión exitosa
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

// Evento de error
pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Ejecutar query con manejo de errores
 * @param {string} text - Query SQL
 * @param {Array} params - Parámetros del query
 * @returns {Promise} Resultado del query
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`🔍 Query ejecutado: ${duration}ms - ${text.substring(0, 50)}...`);
    return res;
  } catch (error) {
    console.error('❌ Error en query:', error);
    throw error;
  }
};

/**
 * Obtener cliente del pool para transacciones
 * @returns {Promise} Cliente de PostgreSQL
 */
export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;
  
  // Wrapper para logging
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };
  
  client.release = () => {
    console.log('🔄 Cliente liberado');
    return originalRelease.apply(client);
  };
  
  return client;
};

/**
 * Verificar conexión a la base de datos
 * @returns {Promise<boolean>} Estado de la conexión
 */
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Conexión a BD exitosa:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a BD:', error.message);
    return false;
  }
};

/**
 * Cerrar todas las conexiones
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log('🔒 Pool de conexiones cerrado');
  } catch (error) {
    console.error('❌ Error cerrando pool:', error);
  }
};

export default pool;