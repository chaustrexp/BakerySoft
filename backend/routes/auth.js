/**
 * Rutas de Autenticación
 * ======================
 * 
 * Maneja login, registro y gestión de tokens
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'El nombre de usuario es requerido',
    'any.required': 'El nombre de usuario es requerido'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es requerida',
    'any.required': 'La contraseña es requerida'
  })
});

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'El nombre de usuario solo puede contener letras y números',
    'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
    'string.max': 'El nombre de usuario no puede tener más de 30 caracteres',
    'any.required': 'El nombre de usuario es requerido'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Debe ser un email válido',
    'any.required': 'El email es requerido'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es requerida'
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede tener más de 100 caracteres',
    'any.required': 'El nombre es requerido'
  }),
  role: Joi.string().valid('admin', 'manager', 'supervisor', 'employee', 'client').default('client')
});

/**
 * Generar JWT token
 * @param {string} userId - ID del usuario
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Obtener permisos por rol
 * @param {string} role - Rol del usuario
 * @returns {Array} Array de permisos
 */
const getPermissionsByRole = (role) => {
  const permissions = {
    admin: ['dashboard', 'inventario', 'personal', 'finanzas', 'produccion', 'pos', 'usuarios', 'reportes', 'proveedores', 'pedidos'],
    manager: ['dashboard', 'inventario', 'personal', 'finanzas', 'produccion', 'pos', 'reportes', 'proveedores', 'pedidos'],
    supervisor: ['dashboard', 'inventario', 'personal', 'produccion', 'pos', 'pedidos'],
    employee: ['dashboard', 'inventario', 'produccion', 'pos'],
    client: ['dashboard', 'productos', 'pedidos', 'perfil']
  };
  
  return permissions[role] || permissions.client;
};

// =====================================================
// POST /api/auth/login - Iniciar sesión
// =====================================================
router.post('/login', async (req, res, next) => {
  try {
    // Validar datos de entrada
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { username, password } = value;

    // Buscar usuario
    const userResult = await query(
      'SELECT id, username, email, password_hash, name, role, profile_photo, is_active FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const user = userResult.rows[0];

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generar token
    const token = generateToken(user.id);

    // Obtener permisos
    const permissions = getPermissionsByRole(user.role);

    // Respuesta exitosa
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhoto: user.profile_photo,
          permissions
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/auth/register - Registrar usuario
// =====================================================
router.post('/register', async (req, res, next) => {
  try {
    // Validar datos de entrada
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { username, email, password, name, role } = value;

    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El usuario o email ya existe'
      });
    }

    // Hashear contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Obtener permisos por rol
    const permissions = getPermissionsByRole(role);

    // Crear usuario
    const newUserResult = await query(
      `INSERT INTO users (username, email, password_hash, name, role, permissions) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, username, email, name, role, profile_photo`,
      [username, email, passwordHash, name, role, permissions]
    );

    const newUser = newUserResult.rows[0];

    // Generar token
    const token = generateToken(newUser.id);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          profilePhoto: newUser.profile_photo,
          permissions
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/auth/me - Obtener usuario actual
// =====================================================
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const permissions = getPermissionsByRole(req.user.role);
    
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          profilePhoto: req.user.profile_photo,
          permissions
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/auth/refresh - Renovar token
// =====================================================
router.post('/refresh', authenticate, async (req, res, next) => {
  try {
    // Generar nuevo token
    const token = generateToken(req.user.id);
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/auth/logout - Cerrar sesión
// =====================================================
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    // En una implementación más avanzada, aquí se podría
    // agregar el token a una blacklist
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

export default router;