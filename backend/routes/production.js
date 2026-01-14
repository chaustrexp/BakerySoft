/**
 * Rutas de Producción
 * ===================
 * 
 * Maneja operaciones de producción, recetas y lotes
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
const recipeSchema = Joi.object({
  product_id: Joi.string().uuid().allow(null),
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  preparation_time: Joi.number().integer().min(0),
  cooking_time: Joi.number().integer().min(0),
  yield_quantity: Joi.number().min(0),
  yield_unit: Joi.string().allow(''),
  instructions: Joi.string().allow(''),
  difficulty_level: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  is_active: Joi.boolean().default(true),
  ingredients: Joi.array().items(Joi.object({
    raw_material_id: Joi.string().uuid().required(),
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    notes: Joi.string().allow('')
  }))
});

const batchSchema = Joi.object({
  recipe_id: Joi.string().uuid().required(),
  planned_quantity: Joi.number().min(0).required(),
  production_date: Joi.date().required(),
  notes: Joi.string().allow('')
});

const updateBatchSchema = Joi.object({
  actual_quantity: Joi.number().min(0),
  status: Joi.string().valid('planned', 'in_progress', 'completed', 'cancelled'),
  start_time: Joi.date().allow(null),
  end_time: Joi.date().allow(null),
  quality_score: Joi.number().integer().min(1).max(10),
  notes: Joi.string().allow('')
});

// =====================================================
// RUTAS DE RECETAS
// =====================================================

// GET /api/production/recipes - Obtener recetas
router.get('/recipes', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, difficulty, active } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (r.name ILIKE $${paramCount} OR r.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (difficulty) {
      paramCount++;
      whereClause += ` AND r.difficulty_level = $${paramCount}`;
      params.push(difficulty);
    }

    if (active !== undefined) {
      paramCount++;
      whereClause += ` AND r.is_active = $${paramCount}`;
      params.push(active === 'true');
    }

    const recipesResult = await query(
      `SELECT r.*, p.name as product_name
       FROM recipes r
       LEFT JOIN products p ON r.product_id = p.id
       ${whereClause}
       ORDER BY r.name
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM recipes r ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        recipes: recipesResult.rows,
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

// GET /api/production/recipes/:id - Obtener receta por ID
router.get('/recipes/:id', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipeResult = await query(
      `SELECT r.*, p.name as product_name
       FROM recipes r
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.id = $1`,
      [id]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Receta no encontrada'
      });
    }

    // Obtener ingredientes
    const ingredientsResult = await query(
      `SELECT ri.*, rm.name as material_name, rm.unit as material_unit
       FROM recipe_ingredients ri
       LEFT JOIN raw_materials rm ON ri.raw_material_id = rm.id
       WHERE ri.recipe_id = $1
       ORDER BY ri.created_at`,
      [id]
    );

    const recipe = recipeResult.rows[0];
    recipe.ingredients = ingredientsResult.rows;

    res.json({
      success: true,
      data: { recipe }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/production/recipes - Crear receta
router.post('/recipes', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = recipeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Crear receta
      const recipeResult = await client.query(
        `INSERT INTO recipes (product_id, name, description, preparation_time, cooking_time, yield_quantity, yield_unit, instructions, difficulty_level, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          value.product_id, value.name, value.description, value.preparation_time,
          value.cooking_time, value.yield_quantity, value.yield_unit,
          value.instructions, value.difficulty_level, value.is_active
        ]
      );

      const recipeId = recipeResult.rows[0].id;

      // Crear ingredientes si se proporcionaron
      if (value.ingredients && value.ingredients.length > 0) {
        for (const ingredient of value.ingredients) {
          await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, raw_material_id, quantity, unit, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [recipeId, ingredient.raw_material_id, ingredient.quantity, ingredient.unit, ingredient.notes]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: { recipe: recipeResult.rows[0] }
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

// PUT /api/production/recipes/:id - Actualizar receta
router.put('/recipes/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = recipeSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Actualizar receta
      const recipeResult = await client.query(
        `UPDATE recipes 
         SET product_id = $1, name = $2, description = $3, preparation_time = $4, 
             cooking_time = $5, yield_quantity = $6, yield_unit = $7, 
             instructions = $8, difficulty_level = $9, is_active = $10,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $11
         RETURNING *`,
        [
          value.product_id, value.name, value.description, value.preparation_time,
          value.cooking_time, value.yield_quantity, value.yield_unit,
          value.instructions, value.difficulty_level, value.is_active, id
        ]
      );

      if (recipeResult.rows.length === 0) {
        throw new Error('Receta no encontrada');
      }

      // Actualizar ingredientes si se proporcionaron
      if (value.ingredients) {
        // Eliminar ingredientes existentes
        await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);

        // Crear nuevos ingredientes
        for (const ingredient of value.ingredients) {
          await client.query(
            `INSERT INTO recipe_ingredients (recipe_id, raw_material_id, quantity, unit, notes)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, ingredient.raw_material_id, ingredient.quantity, ingredient.unit, ingredient.notes]
          );
        }
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        data: { recipe: recipeResult.rows[0] }
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
// RUTAS DE LOTES DE PRODUCCIÓN
// =====================================================

// GET /api/production/batches - Obtener lotes
router.get('/batches', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, start_date, end_date, recipe_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND pb.status = $${paramCount}`;
      params.push(status);
    }

    if (recipe_id) {
      paramCount++;
      whereClause += ` AND pb.recipe_id = $${paramCount}`;
      params.push(recipe_id);
    }

    if (start_date) {
      paramCount++;
      whereClause += ` AND pb.production_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      whereClause += ` AND pb.production_date <= $${paramCount}`;
      params.push(end_date);
    }

    const batchesResult = await query(
      `SELECT pb.*, r.name as recipe_name, e.first_name as employee_first_name, e.last_name as employee_last_name
       FROM production_batches pb
       LEFT JOIN recipes r ON pb.recipe_id = r.id
       LEFT JOIN employees e ON pb.employee_id = e.id
       ${whereClause}
       ORDER BY pb.production_date DESC, pb.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM production_batches pb ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        batches: batchesResult.rows,
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

// POST /api/production/batches - Crear lote
router.post('/batches', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { error, value } = batchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Generar número de lote único
    const batchNumber = `BATCH-${Date.now()}`;

    // Obtener employee_id del usuario actual
    let employeeId = null;
    const employeeResult = await query(
      'SELECT id FROM employees WHERE user_id = $1',
      [req.user.id]
    );
    if (employeeResult.rows.length > 0) {
      employeeId = employeeResult.rows[0].id;
    }

    const result = await query(
      `INSERT INTO production_batches (batch_number, recipe_id, employee_id, planned_quantity, production_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [batchNumber, value.recipe_id, employeeId, value.planned_quantity, value.production_date, value.notes]
    );

    res.status(201).json({
      success: true,
      data: { batch: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/production/batches/:id - Actualizar lote
router.put('/batches/:id', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateBatchSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Construir query dinámico
    const fields = Object.keys(value).filter(key => value[key] !== undefined);
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay campos para actualizar'
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => value[field])];

    const result = await query(
      `UPDATE production_batches SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Lote no encontrado'
      });
    }

    res.json({
      success: true,
      data: { batch: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/production/stats - Estadísticas de producción
router.get('/stats', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE production_date BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    }

    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_batches,
        COUNT(*) FILTER (WHERE status = 'planned') as planned_batches,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_batches,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_batches,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_batches,
        COALESCE(SUM(planned_quantity), 0) as total_planned_quantity,
        COALESCE(SUM(actual_quantity), 0) as total_actual_quantity,
        COALESCE(AVG(quality_score), 0) as average_quality_score
      FROM production_batches ${dateFilter}
    `, params);

    res.json({
      success: true,
      data: { stats: statsResult.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

export default router;