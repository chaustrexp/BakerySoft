/**
 * Rutas de Productos
 * ==================
 * 
 * Maneja operaciones CRUD de productos y categorías
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import Joi from 'joi';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Esquemas de validación
const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(''),
  category_id: Joi.string().uuid().allow(null),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0),
  sku: Joi.string().allow(''),
  barcode: Joi.string().allow(''),
  image_url: Joi.string().allow(''),
  is_active: Joi.boolean().default(true)
});

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow(''),
  is_active: Joi.boolean().default(true)
});

// =====================================================
// GET /api/products - Obtener todos los productos
// =====================================================
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category_id, search, active } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (category_id) {
      paramCount++;
      whereClause += ` AND p.category_id = $${paramCount}`;
      params.push(category_id);
    }

    if (active !== undefined) {
      paramCount++;
      whereClause += ` AND p.is_active = $${paramCount}`;
      params.push(active === 'true');
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.sku ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const productsResult = await query(
      `SELECT p.*, pc.name as category_name
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       ${whereClause}
       ORDER BY p.name
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        products: productsResult.rows,
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
// GET /api/products/:id - Obtener producto por ID
// =====================================================
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const productResult = await query(
      `SELECT p.*, pc.name as category_name
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       WHERE p.id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: { product: productResult.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/products - Crear producto
// =====================================================
router.post('/', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Verificar que el SKU no exista si se proporciona
    if (value.sku) {
      const existingProduct = await query(
        'SELECT id FROM products WHERE sku = $1',
        [value.sku]
      );

      if (existingProduct.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El SKU ya existe'
        });
      }
    }

    const result = await query(
      `INSERT INTO products (name, description, category_id, price, cost, sku, barcode, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        value.name, value.description, value.category_id, value.price,
        value.cost, value.sku, value.barcode, value.image_url, value.is_active
      ]
    );

    res.status(201).json({
      success: true,
      data: { product: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// PUT /api/products/:id - Actualizar producto
// =====================================================
router.put('/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = productSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Verificar que el SKU no exista en otro producto
    if (value.sku) {
      const existingProduct = await query(
        'SELECT id FROM products WHERE sku = $1 AND id != $2',
        [value.sku, id]
      );

      if (existingProduct.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El SKU ya existe'
        });
      }
    }

    const result = await query(
      `UPDATE products 
       SET name = $1, description = $2, category_id = $3, price = $4, 
           cost = $5, sku = $6, barcode = $7, image_url = $8, 
           is_active = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        value.name, value.description, value.category_id, value.price,
        value.cost, value.sku, value.barcode, value.image_url,
        value.is_active, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: { product: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/products/:id - Eliminar producto
// =====================================================
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// RUTAS DE CATEGORÍAS
// =====================================================

// GET /api/products/categories - Obtener categorías
router.get('/categories/all', authenticate, async (req, res, next) => {
  try {
    const categoriesResult = await query(
      'SELECT * FROM product_categories WHERE is_active = true ORDER BY name'
    );

    res.json({
      success: true,
      data: { categories: categoriesResult.rows }
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/products/categories - Crear categoría
router.post('/categories', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const result = await query(
      `INSERT INTO product_categories (name, description, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [value.name, value.description, value.is_active]
    );

    res.status(201).json({
      success: true,
      data: { category: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// PUT /api/products/categories/:id - Actualizar categoría
router.put('/categories/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = categorySchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const result = await query(
      `UPDATE product_categories 
       SET name = $1, description = $2, is_active = $3
       WHERE id = $4
       RETURNING *`,
      [value.name, value.description, value.is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: { category: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/categories/:id - Eliminar categoría
router.delete('/categories/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que no haya productos usando esta categoría
    const productsUsingCategory = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );

    if (parseInt(productsUsingCategory.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        error: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    const result = await query(
      'DELETE FROM product_categories WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

export default router;