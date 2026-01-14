/**
 * Rutas de Pedidos
 * ================
 * 
 * Maneja operaciones CRUD de pedidos y órdenes
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
const orderSchema = Joi.object({
  customer_id: Joi.string().uuid().allow(null),
  delivery_date: Joi.date().allow(null),
  items: Joi.array().items(Joi.object({
    product_id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
    unit_price: Joi.number().min(0).required(),
    notes: Joi.string().allow('')
  })).min(1).required(),
  payment_method: Joi.string().allow(''),
  notes: Joi.string().allow(''),
  discount_amount: Joi.number().min(0).default(0)
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'in_progress', 'ready', 'delivered', 'cancelled'),
  delivery_date: Joi.date().allow(null),
  payment_status: Joi.string().valid('pending', 'paid', 'partial', 'refunded'),
  payment_method: Joi.string().allow(''),
  notes: Joi.string().allow('')
});

// =====================================================
// GET /api/orders - Obtener todos los pedidos
// =====================================================
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, customer_id, start_date, end_date, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Si es cliente, solo ver sus propios pedidos
    if (req.user.role === 'client') {
      const customerResult = await query(
        'SELECT id FROM customers WHERE user_id = $1',
        [req.user.id]
      );
      
      if (customerResult.rows.length > 0) {
        paramCount++;
        whereClause += ` AND o.customer_id = $${paramCount}`;
        params.push(customerResult.rows[0].id);
      } else {
        // Si no tiene customer asociado, no ver ningún pedido
        whereClause += ' AND 1=0';
      }
    }

    if (status) {
      paramCount++;
      whereClause += ` AND o.status = $${paramCount}`;
      params.push(status);
    }

    if (customer_id && req.user.role !== 'client') {
      paramCount++;
      whereClause += ` AND o.customer_id = $${paramCount}`;
      params.push(customer_id);
    }

    if (start_date) {
      paramCount++;
      whereClause += ` AND o.order_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      whereClause += ` AND o.order_date <= $${paramCount}`;
      params.push(end_date);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (o.order_number ILIKE $${paramCount} OR c.first_name ILIKE $${paramCount} OR c.last_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const ordersResult = await query(
      `SELECT o.*, 
              c.first_name as customer_first_name, 
              c.last_name as customer_last_name,
              c.email as customer_email,
              e.first_name as employee_first_name,
              e.last_name as employee_last_name
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN employees e ON o.employee_id = e.id
       ${whereClause}
       ORDER BY o.order_date DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total 
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        orders: ordersResult.rows,
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
// GET /api/orders/:id - Obtener pedido por ID
// =====================================================
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    let whereClause = 'WHERE o.id = $1';
    const params = [id];

    // Si es cliente, verificar que sea su pedido
    if (req.user.role === 'client') {
      const customerResult = await query(
        'SELECT id FROM customers WHERE user_id = $1',
        [req.user.id]
      );
      
      if (customerResult.rows.length > 0) {
        whereClause += ' AND o.customer_id = $2';
        params.push(customerResult.rows[0].id);
      } else {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para ver este pedido'
        });
      }
    }

    const orderResult = await query(
      `SELECT o.*, 
              c.first_name as customer_first_name, 
              c.last_name as customer_last_name,
              c.email as customer_email,
              c.phone as customer_phone,
              e.first_name as employee_first_name,
              e.last_name as employee_last_name
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       LEFT JOIN employees e ON o.employee_id = e.id
       ${whereClause}`,
      params
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    // Obtener items del pedido
    const itemsResult = await query(
      `SELECT oi.*, p.name as product_name, p.description as product_description
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1
       ORDER BY oi.created_at`,
      [id]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// POST /api/orders - Crear pedido
// =====================================================
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Generar número de orden único
      const orderNumber = `ORD-${Date.now()}`;

      // Calcular totales
      let subtotal = 0;
      for (const item of value.items) {
        subtotal += item.quantity * item.unit_price;
      }

      const taxAmount = subtotal * 0.19; // 19% IVA
      const totalAmount = subtotal + taxAmount - (value.discount_amount || 0);

      // Obtener employee_id si el usuario es empleado
      let employeeId = null;
      if (req.user.role !== 'client') {
        const employeeResult = await client.query(
          'SELECT id FROM employees WHERE user_id = $1',
          [req.user.id]
        );
        if (employeeResult.rows.length > 0) {
          employeeId = employeeResult.rows[0].id;
        }
      }

      // Si es cliente, obtener customer_id
      let customerId = value.customer_id;
      if (req.user.role === 'client') {
        const customerResult = await client.query(
          'SELECT id FROM customers WHERE user_id = $1',
          [req.user.id]
        );
        if (customerResult.rows.length > 0) {
          customerId = customerResult.rows[0].id;
        }
      }

      // Crear orden
      const orderResult = await client.query(
        `INSERT INTO orders (order_number, customer_id, employee_id, delivery_date, subtotal, tax_amount, discount_amount, total_amount, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          orderNumber, customerId, employeeId, value.delivery_date,
          subtotal, taxAmount, value.discount_amount, totalAmount,
          value.payment_method, value.notes
        ]
      );

      const orderId = orderResult.rows[0].id;

      // Crear items de la orden
      for (const item of value.items) {
        const totalPrice = item.quantity * item.unit_price;
        
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.product_id, item.quantity, item.unit_price, totalPrice, item.notes]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        data: { order: orderResult.rows[0] }
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
// PUT /api/orders/:id - Actualizar pedido
// =====================================================
router.put('/:id', authenticate, authorize(['admin', 'manager', 'supervisor', 'employee']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateOrderSchema.validate(req.body);
    
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
      `UPDATE orders SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: { order: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/orders/:id - Cancelar pedido
// =====================================================
router.delete('/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND status IN ('pending', 'confirmed')
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado o no se puede cancelar'
      });
    }

    res.json({
      success: true,
      message: 'Pedido cancelado exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/orders/stats/summary - Obtener estadísticas
// =====================================================
router.get('/stats/summary', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE order_date BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    }

    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_orders,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_orders,
        COUNT(*) FILTER (WHERE status = 'ready') as ready_orders,
        COUNT(*) FILTER (WHERE status = 'delivered') as delivered_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders ${dateFilter}
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