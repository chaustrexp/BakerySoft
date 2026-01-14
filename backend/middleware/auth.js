/**
 * Middleware de Autenticación y Autorización
 * ==========================================
 * 
 * Maneja la verificación de tokens JWT y permisos de usuario
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * Middleware de autenticación
 * Verifica el token JWT y carga los datos del usuario
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
      
      // Obtener datos actualizados del usuario
      const userResult = await query(
        'SELECT id, username, email, name, role, profile_photo, is_active FROM users WHERE id = $1',
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
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expirado'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      } else {
        throw jwtError;
      }
    }

  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware de autorización
 * Verifica que el usuario tenga uno de los roles permitidos
 * @param {Array} allowedRoles - Array de roles permitidos
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware de autorización por permisos específicos
 * Verifica que el usuario tenga permisos específicos
 * @param {Array} requiredPermissions - Array de permisos requeridos
 */
export const requirePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      // Obtener permisos del usuario
      const userResult = await query(
        'SELECT permissions FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const userPermissions = userResult.rows[0].permissions || [];

      // Verificar si el usuario tiene al menos uno de los permisos requeridos
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'No tienes los permisos necesarios para acceder a este recurso'
        });
      }

      next();

    } catch (error) {
      console.error('Error en middleware de permisos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware opcional de autenticación
 * Carga los datos del usuario si hay token, pero no falla si no lo hay
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continuar sin usuario
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userResult = await query(
        'SELECT id, username, email, name, role, profile_photo, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length > 0 && userResult.rows[0].is_active) {
        req.user = userResult.rows[0];
      }

    } catch (jwtError) {
      // Ignorar errores de JWT en autenticación opcional
    }

    next();

  } catch (error) {
    console.error('Error en middleware de autenticación opcional:', error);
    next(); // Continuar sin usuario en caso de error
  }
};

/**
 * Middleware para verificar si el usuario es propietario del recurso
 * @param {string} resourceIdParam - Nombre del parámetro que contiene el ID del recurso
 * @param {string} ownerField - Campo que contiene el ID del propietario
 * @param {string} tableName - Nombre de la tabla a consultar
 */
export const requireOwnership = (resourceIdParam, ownerField, tableName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'ID del recurso requerido'
        });
      }

      // Los administradores pueden acceder a cualquier recurso
      if (req.user.role === 'admin') {
        return next();
      }

      const result = await query(
        `SELECT ${ownerField} FROM ${tableName} WHERE id = $1`,
        [resourceId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Recurso no encontrado'
        });
      }

      const ownerId = result.rows[0][ownerField];
      
      if (ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para acceder a este recurso'
        });
      }

      next();

    } catch (error) {
      console.error('Error en middleware de propiedad:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};