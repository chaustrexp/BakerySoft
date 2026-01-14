/**
 * Rutas de Inventario
 * ===================
 * 
 * Maneja operaciones de materias primas e inventario
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import Joi from 'joi';
import { query, getClient } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const rawMaterialSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  unit: Joi.string().required(),
  current_stock: Joi.number().min(0).default(0),
  minimum_stock: Joi.number().min(0).required(),
  maximum_stock: Joi.number().min(0).required(),
  unit_cost: Joi.number().min(0),
  supplier: Joi.string().allow(''),
  location: Joi.string().allow(''),
  expiry_date: Joi.date().allow(null)
});

const movementSchema = Joi.object({
  raw_material_id: Joi.string().uuid().required(),
  movement_type: Joi.string().valid('in', 'out', 'adjustment', 'waste').required(),
  quantity: Joi.number().required(),
  unit_cost: Joi.number().min(0),
  reason: Joi.string().required(),
  notes: Joi.string().allow('')
});

// =====================================================
// GET /api/inventory/raw-materials - Obtener materias primas
// =====================================================
router.get('/raw-materials', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const materialsResult = await query(
      `SELECT * FROM raw_materials 
       ${whereClause}
       ORDER BY name
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM raw_materials ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        materials: materialsResult.rows,
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
// POST /api/inventory/raw-materials - Crear materia prima
// =====================================================
router.post('/raw-materials', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = rawMaterialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Determinar status basado en stock
    let status = 'optimal';
    if (value.current_stock <= value.minimum_stock) {
      status = value.current_stock === 0 ? 'critical' : 'low';
    }

    const result = await query(
      `INSERT INTO raw_materials (name, description, unit, current_stock, minimum_stock, maximum_stock, unit_cost, supplier, location, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        value.name, value.description, value.unit, value.current_stock,
        value.minimum_stock, value.maximum_stock, value.unit_cost,
        value.supplier, value.location, value.expiry_date, status
      ]
    );

    res.status(201).json({
      success: true,
      data: { material: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// PUT /api/inventory/raw-materials/:id - Actualizar materia prima
// =====================================================
router.put('/raw-materials/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = rawMaterialSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Determinar status basado en stock
    let status = 'optimal';
    if (value.current_stock <= value.minimum_stock) {
      status = value.current_stock === 0 ? 'critical' : 'low';
    }

    const result = await query(
      `UPDATE raw_materials 
       SET name = $1, description = $2, unit = $3, current_stock = $4, 
           minimum_stock = $5, maximum_stock = $6, unit_cost = $7, 
           supplier = $8, location = $9, expiry_date = $10, status = $11,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        value.name, value.description, value.unit, value.current_stock,
        value.minimum_stock, value.maximum_stock, value.unit_cost,
        value.supplier, value.location, value.expiry_date, status, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Materia prima no encontrada'
      });
    }

    res.json({
      success: true,
      data: { material: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/inventory/raw-materials/:id - Eliminar materia prima
// =====================================================
router.delete('/raw-materials/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM raw_materials WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Materia prima no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Materia prima eliminada exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/inventory/movements - Registrar movimiento
// =====================================================
router.post('/movements', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { error, value } = movementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Obtener stock actual
      const materialResult = await client.query(
        'SELECT current_stock, minimum_stock FROM raw_materials WHERE id = $1',
        [value.raw_material_id]
      );

      if (materialResult.rows.length === 0) {
        throw new Error('Materia prima no encontrada');
      }

      const currentStock = parseFloat(materialResult.rows[0].current_stock);
      let newStock = currentStock;

      // Calcular nuevo stock
      if (value.movement_type === 'in') {
        newStock = currentStock + Math.abs(value.quantity);
      } else if (value.movement_type === 'out' || value.movement_type === 'waste') {
        newStock = currentStock - Math.abs(value.quantity);
        if (newStock < 0) {
          throw new Error('Stock insuficiente');
        }
      } else if (value.movement_type === 'adjustment') {
        newStock = value.quantity;
      }

      // Determinar nuevo status
      const minimumStock = parseFloat(materialResult.rows[0].minimum_stock);
      let status = 'optimal';
      if (newStock <= minimumStock) {
        status = newStock === 0 ? 'critical' : 'low';
      }

      // Registrar movimiento
      const movementResult = await client.query(
        `INSERT INTO inventory_movements (raw_material_id, movement_type, quantity, unit_cost, total_cost, reason, employee_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          value.raw_material_id, value.movement_type, value.quantity,
          value.unit_cost, (value.unit_cost || 0) * Math.abs(value.quantity),
          value.reason, req.user.id, value.notes
        ]
      );

      // Actualizar stock
      await client.query(
        'UPDATE raw_materials SET current_stock = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [newStock, status, value.raw_material_id]
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: { movement: movementResult.rows[0] }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/inventory/movements - Obtener movimientos
// =====================================================
router.get('/movements', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, material_id, type, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (material_id) {
      paramCount++;
      whereClause += ` AND im.raw_material_id = $${paramCount}`;
      params.push(material_id);
    }

    if (type) {
      paramCount++;
      whereClause += ` AND im.movement_type = $${paramCount}`;
      params.push(type);
    }

    if (start_date) {
      paramCount++;
      whereClause += ` AND im.movement_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      whereClause += ` AND im.movement_date <= $${paramCount}`;
      params.push(end_date);
    }

    const movementsResult = await query(
      `SELECT im.*, rm.name as material_name, u.name as employee_name
       FROM inventory_movements im
       LEFT JOIN raw_materials rm ON im.raw_material_id = rm.id
       LEFT JOIN users u ON im.employee_id = u.id
       ${whereClause}
       ORDER BY im.movement_date DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM inventory_movements im 
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        movements: movementsResult.rows,
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
// GET /api/inventory/alerts - Obtener alertas de stock
// =====================================================
router.get('/alerts', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const alertsResult = await query(
      `SELECT id, name, current_stock, minimum_stock, status, expiry_date
       FROM raw_materials 
       WHERE status IN ('low', 'critical') OR expiry_date <= CURRENT_DATE + INTERVAL '7 days'
       ORDER BY 
         CASE status 
           WHEN 'critical' THEN 1 
           WHEN 'low' THEN 2 
           ELSE 3 
         END,
         expiry_date ASC`
    );

    res.json({
      success: true,
      data: { alerts: alertsResult.rows }
    });

  } catch (error) {
    next(error);
  }
});

export default router;