/**
 * Middleware de Autenticación
 * ===========================
 * 
 * Maneja la autenticación JWT y autorización por roles
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * Middleware para verificar JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token de acceso requerido'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar que el usuario aún existe y está activo
      const userResult = await query(
        'SELECT id, username, email, name, role, permissions, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const user = userResult.rows[0];

      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          error: 'Usuario inactivo'
        });
      }

      // Agregar usuario a la request
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {...string} roles - Roles permitidos
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar permisos específicos
 * @param {string} permission - Permiso requerido
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(permission) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: `Permiso requerido: ${permission}`
      });
    }

    next();
  };
};

export default { authenticate, authorize, requirePermission };