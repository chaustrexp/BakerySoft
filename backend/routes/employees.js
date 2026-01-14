/**
 * Rutas de Empleados
 * ==================
 * 
 * Maneja operaciones CRUD de empleados
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import Joi from 'joi';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Esquema de validación
const employeeSchema = Joi.object({
  user_id: Joi.string().uuid().allow(null),
  employee_code: Joi.string().required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  position: Joi.string().required(),
  department: Joi.string().required(),
  hire_date: Joi.date().required(),
  salary: Joi.number().min(0),
  phone: Joi.string().allow(''),
  address: Joi.string().allow(''),
  emergency_contact: Joi.string().allow(''),
  emergency_phone: Joi.string().allow(''),
  is_active: Joi.boolean().default(true)
});

// =====================================================
// GET /api/employees - Obtener todos los empleados
// =====================================================
router.get('/', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, department, position, search, active } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (department) {
      paramCount++;
      whereClause += ` AND e.department = $${paramCount}`;
      params.push(department);
    }

    if (position) {
      paramCount++;
      whereClause += ` AND e.position = $${paramCount}`;
      params.push(position);
    }

    if (active !== undefined) {
      paramCount++;
      whereClause += ` AND e.is_active = $${paramCount}`;
      params.push(active === 'true');
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (e.first_name ILIKE $${paramCount} OR e.last_name ILIKE $${paramCount} OR e.employee_code ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const employeesResult = await query(
      `SELECT e.*, u.username, u.email, u.role
       FROM employees e
       LEFT JOIN users u ON e.user_id = u.id
       ${whereClause}
       ORDER BY e.first_name, e.last_name
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM employees e ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        employees: employeesResult.rows,
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
// GET /api/employees/:id - Obtener empleado por ID
// =====================================================
router.get('/:id', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const employeeResult = await query(
      `SELECT e.*, u.username, u.email, u.role
       FROM employees e
       LEFT JOIN users u ON e.user_id = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      data: { employee: employeeResult.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/employees - Crear empleado
// =====================================================
router.post('/', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Verificar que el código de empleado no exista
    const existingEmployee = await query(
      'SELECT id FROM employees WHERE employee_code = $1',
      [value.employee_code]
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El código de empleado ya existe'
      });
    }

    const result = await query(
      `INSERT INTO employees (user_id, employee_code, first_name, last_name, position, department, hire_date, salary, phone, address, emergency_contact, emergency_phone, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        value.user_id, value.employee_code, value.first_name, value.last_name,
        value.position, value.department, value.hire_date, value.salary,
        value.phone, value.address, value.emergency_contact, value.emergency_phone,
        value.is_active
      ]
    );

    res.status(201).json({
      success: true,
      data: { employee: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// PUT /api/employees/:id - Actualizar empleado
// =====================================================
router.put('/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = employeeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Verificar que el código de empleado no exista en otro empleado
    const existingEmployee = await query(
      'SELECT id FROM employees WHERE employee_code = $1 AND id != $2',
      [value.employee_code, id]
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El código de empleado ya existe'
      });
    }

    const result = await query(
      `UPDATE employees 
       SET user_id = $1, employee_code = $2, first_name = $3, last_name = $4, 
           position = $5, department = $6, hire_date = $7, salary = $8, 
           phone = $9, address = $10, emergency_contact = $11, emergency_phone = $12, 
           is_active = $13, updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING *`,
      [
        value.user_id, value.employee_code, value.first_name, value.last_name,
        value.position, value.department, value.hire_date, value.salary,
        value.phone, value.address, value.emergency_contact, value.emergency_phone,
        value.is_active, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      data: { employee: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/employees/:id - Eliminar empleado
// =====================================================
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM employees WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Empleado eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/employees/departments - Obtener departamentos
// =====================================================
router.get('/meta/departments', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const departmentsResult = await query(
      'SELECT DISTINCT department FROM employees WHERE is_active = true ORDER BY department'
    );

    res.json({
      success: true,
      data: { departments: departmentsResult.rows.map(row => row.department) }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/employees/positions - Obtener posiciones
// =====================================================
router.get('/meta/positions', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const positionsResult = await query(
      'SELECT DISTINCT position FROM employees WHERE is_active = true ORDER BY position'
    );

    res.json({
      success: true,
      data: { positions: positionsResult.rows.map(row => row.position) }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/employees/stats - Obtener estadísticas
// =====================================================
router.get('/meta/stats', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_employees,
        COUNT(*) FILTER (WHERE is_active = true) as active_employees,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_employees,
        COUNT(DISTINCT department) as total_departments,
        COUNT(DISTINCT position) as total_positions
      FROM employees
    `);

    const departmentStatsResult = await query(`
      SELECT department, COUNT(*) as count
      FROM employees 
      WHERE is_active = true
      GROUP BY department
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        general: statsResult.rows[0],
        by_department: departmentStatsResult.rows
      }
    });

  } catch (error) {
    next(error);
  }
});

export default router;