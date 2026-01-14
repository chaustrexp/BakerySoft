/**
 * Rutas de Usuarios
 * =================
 * 
 * Maneja operaciones CRUD de usuarios
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Esquema de validación para actualizar usuario
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('admin', 'manager', 'supervisor', 'employee', 'client'),
  profile_photo: Joi.string().allow(''),
  is_active: Joi.boolean()
});

// =====================================================
// GET /api/users - Obtener todos los usuarios
// =====================================================
router.get('/', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      whereClause += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR username ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Obtener usuarios
    const usersResult = await query(
      `SELECT id, username, email, name, role, profile_photo, is_active, last_login, created_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Contar total
    const countResult = await query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/users/:id - Obtener usuario por ID
// =====================================================
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Solo admin/manager pueden ver otros usuarios, o el propio usuario
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para ver este usuario'
      });
    }

    const userResult = await query(
      `SELECT id, username, email, name, role, profile_photo, is_active, last_login, created_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: { user: userResult.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// PUT /api/users/:id - Actualizar usuario
// =====================================================
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Solo admin puede actualizar otros usuarios, o el propio usuario (campos limitados)
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para actualizar este usuario'
      });
    }

    // Validar datos
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Si no es admin, limitar campos que puede actualizar
    let allowedFields = value;
    if (req.user.role !== 'admin') {
      allowedFields = {
        name: value.name,
        email: value.email,
        profile_photo: value.profile_photo
      };
    }

    // Construir query dinámico
    const fields = Object.keys(allowedFields).filter(key => allowedFields[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay campos para actualizar'
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => allowedFields[field])];

    const updateResult = await query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id, username, email, name, role, profile_photo, is_active`,
      values
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: { user: updateResult.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/users/:id - Eliminar usuario
// =====================================================
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // No permitir que el admin se elimine a sí mismo
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'No puedes eliminar tu propia cuenta'
      });
    }

    const deleteResult = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/users/:id/change-password - Cambiar contraseña
// =====================================================
router.post('/:id/change-password', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Solo el propio usuario o admin pueden cambiar la contraseña
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para cambiar esta contraseña'
      });
    }

    // Validar contraseñas
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Si no es admin, verificar contraseña actual
    if (req.user.role !== 'admin') {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña actual es requerida'
        });
      }

      const userResult = await query(
        'SELECT password_hash FROM users WHERE id = $1',
        [id]
      );

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña actual es incorrecta'
        });
      }
    }

    // Hashear nueva contraseña
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, id]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

export default router;