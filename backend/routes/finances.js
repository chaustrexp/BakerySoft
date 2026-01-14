/**
 * Rutas de Finanzas
 * =================
 * 
 * Maneja operaciones financieras y transacciones
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
const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  category: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().required(),
  reference_id: Joi.string().uuid().allow(null),
  reference_type: Joi.string().allow(''),
  payment_method: Joi.string().allow(''),
  transaction_date: Joi.date().required(),
  is_recurring: Joi.boolean().default(false),
  recurring_frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').allow('')
});

// =====================================================
// GET /api/finances/transactions - Obtener transacciones
// =====================================================
router.get('/transactions', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, category, start_date, end_date, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      whereClause += ` AND ft.type = $${paramCount}`;
      params.push(type);
    }

    if (category) {
      paramCount++;
      whereClause += ` AND ft.category = $${paramCount}`;
      params.push(category);
    }

    if (start_date) {
      paramCount++;
      whereClause += ` AND ft.transaction_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      whereClause += ` AND ft.transaction_date <= $${paramCount}`;
      params.push(end_date);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (ft.description ILIKE $${paramCount} OR ft.transaction_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const transactionsResult = await query(
      `SELECT ft.*, e.first_name as employee_first_name, e.last_name as employee_last_name
       FROM financial_transactions ft
       LEFT JOIN employees e ON ft.employee_id = e.id
       ${whereClause}
       ORDER BY ft.transaction_date DESC, ft.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM financial_transactions ft ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        transactions: transactionsResult.rows,
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
// POST /api/finances/transactions - Crear transacción
// =====================================================
router.post('/transactions', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { error, value } = transactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    // Generar número de transacción único
    const transactionNumber = `TXN-${Date.now()}`;

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
      `INSERT INTO financial_transactions (transaction_number, type, category, amount, description, reference_id, reference_type, payment_method, transaction_date, employee_id, is_recurring, recurring_frequency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        transactionNumber, value.type, value.category, value.amount,
        value.description, value.reference_id, value.reference_type,
        value.payment_method, value.transaction_date, employeeId,
        value.is_recurring, value.recurring_frequency
      ]
    );

    res.status(201).json({
      success: true,
      data: { transaction: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// PUT /api/finances/transactions/:id - Actualizar transacción
// =====================================================
router.put('/transactions/:id', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = transactionSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const result = await query(
      `UPDATE financial_transactions 
       SET type = $1, category = $2, amount = $3, description = $4, 
           reference_id = $5, reference_type = $6, payment_method = $7, 
           transaction_date = $8, is_recurring = $9, recurring_frequency = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        value.type, value.category, value.amount, value.description,
        value.reference_id, value.reference_type, value.payment_method,
        value.transaction_date, value.is_recurring, value.recurring_frequency, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      data: { transaction: result.rows[0] }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// DELETE /api/finances/transactions/:id - Eliminar transacción
// =====================================================
router.delete('/transactions/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM financial_transactions WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transacción no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/finances/summary - Resumen financiero
// =====================================================
router.get('/summary', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE transaction_date BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    }

    const summaryResult = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_profit,
        COUNT(*) FILTER (WHERE type = 'income') as income_transactions,
        COUNT(*) FILTER (WHERE type = 'expense') as expense_transactions,
        COUNT(*) as total_transactions
      FROM financial_transactions ${dateFilter}
    `, params);

    // Obtener ingresos por categoría
    const incomeByCategory = await query(`
      SELECT category, SUM(amount) as total
      FROM financial_transactions 
      WHERE type = 'income' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      GROUP BY category
      ORDER BY total DESC
    `, params);

    // Obtener gastos por categoría
    const expensesByCategory = await query(`
      SELECT category, SUM(amount) as total
      FROM financial_transactions 
      WHERE type = 'expense' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      GROUP BY category
      ORDER BY total DESC
    `, params);

    res.json({
      success: true,
      data: {
        summary: summaryResult.rows[0],
        income_by_category: incomeByCategory.rows,
        expenses_by_category: expensesByCategory.rows
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/finances/categories - Obtener categorías
// =====================================================
router.get('/categories', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { type } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (type) {
      whereClause = 'WHERE type = $1';
      params.push(type);
    }

    const categoriesResult = await query(`
      SELECT DISTINCT category, type
      FROM financial_transactions 
      ${whereClause}
      ORDER BY type, category
    `, params);

    // Agrupar por tipo
    const categoriesByType = {
      income: [],
      expense: [],
      transfer: []
    };

    categoriesResult.rows.forEach(row => {
      if (categoriesByType[row.type]) {
        categoriesByType[row.type].push(row.category);
      }
    });

    res.json({
      success: true,
      data: { categories: categoriesByType }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/finances/monthly-report - Reporte mensual
// =====================================================
router.get('/monthly-report', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const monthlyResult = await query(`
      SELECT 
        EXTRACT(MONTH FROM transaction_date) as month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as profit
      FROM financial_transactions 
      WHERE EXTRACT(YEAR FROM transaction_date) = $1
      GROUP BY EXTRACT(MONTH FROM transaction_date)
      ORDER BY month
    `, [year]);

    // Crear array con todos los meses (1-12)
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const data = monthlyResult.rows.find(row => parseInt(row.month) === month);
      return {
        month,
        income: data ? parseFloat(data.income) : 0,
        expenses: data ? parseFloat(data.expenses) : 0,
        profit: data ? parseFloat(data.profit) : 0
      };
    });

    res.json({
      success: true,
      data: { monthly_data: monthlyData }
    });

  } catch (error) {
    next(error);
  }
});

export default router;