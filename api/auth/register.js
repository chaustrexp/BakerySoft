/**
 * Vercel Serverless Function - Register
 */
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, email, password, name, role = 'empleado' } = req.body;

    // Validaciones
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await sql`
      SELECT id FROM users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El usuario o email ya existe'
      });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await sql`
      INSERT INTO users (username, email, password_hash, name, role, is_active)
      VALUES (${username}, ${email}, ${passwordHash}, ${name}, ${role}, true)
      RETURNING id, username, email, name, role, is_active, created_at
    `;

    const newUser = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username, 
        role: newUser.role 
      },
      process.env.JWT_SECRET || 'bakerysoft_secret_key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}
