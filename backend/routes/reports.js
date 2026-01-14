/**
 * Rutas de Reportes
 * =================
 * 
 * Maneja generación de reportes y análisis
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import express from 'express';
import { query } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// =====================================================
// GET /api/reports/dashboard - Reporte del dashboard
// =====================================================
router.get('/dashboard', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // días
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Estadísticas generales
    const generalStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM orders WHERE order_date >= $1) as recent_orders,
        (SELECT COUNT(*) FROM customers WHERE created_at >= $1) as new_customers,
        (SELECT COUNT(*) FROM production_batches WHERE production_date >= $1) as recent_batches,
        (SELECT COUNT(*) FROM raw_materials WHERE status IN ('low', 'critical')) as low_stock_items,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE order_date >= $1 AND status = 'delivered') as total_revenue
    `, [startDate]);

    // Ventas por día (últimos 7 días)
    const dailySales = await query(`
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as orders_count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE order_date >= $1 AND status = 'delivered'
      GROUP BY DATE(order_date)
      ORDER BY date DESC
      LIMIT 7
    `, [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]);

    // Productos más vendidos
    const topProducts = await query(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        COALESCE(SUM(oi.total_price), 0) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.order_date >= $1 AND o.status = 'delivered'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `, [startDate]);

    // Estado de pedidos
    const orderStatus = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders 
      WHERE order_date >= $1
      GROUP BY status
      ORDER BY count DESC
    `, [startDate]);

    res.json({
      success: true,
      data: {
        general_stats: generalStats.rows[0],
        daily_sales: dailySales.rows,
        top_products: topProducts.rows,
        order_status: orderStatus.rows,
        period_days: parseInt(period)
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/reports/sales - Reporte de ventas
// =====================================================
router.get('/sales', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'start_date y end_date son requeridos'
      });
    }

    let dateFormat;
    switch (group_by) {
      case 'month':
        dateFormat = "TO_CHAR(order_date, 'YYYY-MM')";
        break;
      case 'week':
        dateFormat = "TO_CHAR(order_date, 'YYYY-WW')";
        break;
      default:
        dateFormat = "DATE(order_date)";
    }

    const salesData = await query(`
      SELECT 
        ${dateFormat} as period,
        COUNT(*) as orders_count,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(subtotal), 0) as subtotal,
        COALESCE(SUM(tax_amount), 0) as total_tax,
        COALESCE(SUM(discount_amount), 0) as total_discounts,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders 
      WHERE order_date BETWEEN $1 AND $2 
        AND status = 'delivered'
      GROUP BY ${dateFormat}
      ORDER BY period
    `, [start_date, end_date]);

    // Resumen del período
    const summary = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value,
        COUNT(DISTINCT customer_id) as unique_customers
      FROM orders 
      WHERE order_date BETWEEN $1 AND $2 
        AND status = 'delivered'
    `, [start_date, end_date]);

    res.json({
      success: true,
      data: {
        sales_data: salesData.rows,
        summary: summary.rows[0],
        group_by,
        start_date,
        end_date
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/reports/inventory - Reporte de inventario
// =====================================================
router.get('/inventory', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    // Estado actual del inventario
    const inventoryStatus = await query(`
      SELECT 
        COUNT(*) as total_materials,
        COUNT(*) FILTER (WHERE status = 'optimal') as optimal_materials,
        COUNT(*) FILTER (WHERE status = 'low') as low_stock_materials,
        COUNT(*) FILTER (WHERE status = 'critical') as critical_materials,
        COALESCE(SUM(current_stock * unit_cost), 0) as total_inventory_value
      FROM raw_materials
    `);

    // Materiales con stock bajo
    const lowStockMaterials = await query(`
      SELECT 
        name,
        current_stock,
        minimum_stock,
        unit,
        status,
        COALESCE(current_stock * unit_cost, 0) as stock_value
      FROM raw_materials 
      WHERE status IN ('low', 'critical')
      ORDER BY 
        CASE status 
          WHEN 'critical' THEN 1 
          WHEN 'low' THEN 2 
        END,
        current_stock ASC
    `);

    // Movimientos recientes (últimos 30 días)
    const recentMovements = await query(`
      SELECT 
        movement_type,
        COUNT(*) as count,
        COALESCE(SUM(ABS(quantity)), 0) as total_quantity,
        COALESCE(SUM(total_cost), 0) as total_cost
      FROM inventory_movements 
      WHERE movement_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY movement_type
      ORDER BY count DESC
    `);

    // Materiales próximos a vencer
    const expiringMaterials = await query(`
      SELECT 
        name,
        current_stock,
        expiry_date,
        unit,
        EXTRACT(DAY FROM expiry_date - CURRENT_DATE) as days_to_expire
      FROM raw_materials 
      WHERE expiry_date IS NOT NULL 
        AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'
        AND current_stock > 0
      ORDER BY expiry_date ASC
    `);

    res.json({
      success: true,
      data: {
        inventory_status: inventoryStatus.rows[0],
        low_stock_materials: lowStockMaterials.rows,
        recent_movements: recentMovements.rows,
        expiring_materials: expiringMaterials.rows
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/reports/production - Reporte de producción
// =====================================================
router.get('/production', authenticate, authorize(['admin', 'manager', 'supervisor']), async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE production_date BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    }

    // Estadísticas de producción
    const productionStats = await query(`
      SELECT 
        COUNT(*) as total_batches,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_batches,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_batches,
        COALESCE(SUM(planned_quantity), 0) as total_planned,
        COALESCE(SUM(actual_quantity), 0) as total_produced,
        COALESCE(AVG(quality_score), 0) as average_quality,
        COALESCE(AVG(EXTRACT(EPOCH FROM (end_time - start_time))/3600), 0) as average_production_hours
      FROM production_batches ${dateFilter}
    `, params);

    // Producción por receta
    const productionByRecipe = await query(`
      SELECT 
        r.name as recipe_name,
        COUNT(pb.*) as batches_count,
        COALESCE(SUM(pb.actual_quantity), 0) as total_produced,
        COALESCE(AVG(pb.quality_score), 0) as average_quality
      FROM production_batches pb
      JOIN recipes r ON pb.recipe_id = r.id
      ${dateFilter}
      GROUP BY r.id, r.name
      ORDER BY total_produced DESC
    `, params);

    // Eficiencia de producción (planificado vs real)
    const efficiency = await query(`
      SELECT 
        DATE(production_date) as date,
        COALESCE(SUM(planned_quantity), 0) as planned,
        COALESCE(SUM(actual_quantity), 0) as actual,
        CASE 
          WHEN SUM(planned_quantity) > 0 
          THEN (SUM(actual_quantity) / SUM(planned_quantity)) * 100 
          ELSE 0 
        END as efficiency_percentage
      FROM production_batches 
      ${dateFilter}
      GROUP BY DATE(production_date)
      ORDER BY date DESC
      LIMIT 30
    `, params);

    res.json({
      success: true,
      data: {
        production_stats: productionStats.rows[0],
        production_by_recipe: productionByRecipe.rows,
        efficiency: efficiency.rows,
        start_date,
        end_date
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/reports/financial - Reporte financiero
// =====================================================
router.get('/financial', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'start_date y end_date son requeridos'
      });
    }

    // Resumen financiero
    const financialSummary = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as net_profit,
        COUNT(*) FILTER (WHERE type = 'income') as income_transactions,
        COUNT(*) FILTER (WHERE type = 'expense') as expense_transactions
      FROM financial_transactions 
      WHERE transaction_date BETWEEN $1 AND $2
    `, [start_date, end_date]);

    // Ingresos vs gastos por mes
    const monthlyComparison = await query(`
      SELECT 
        TO_CHAR(transaction_date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as profit
      FROM financial_transactions 
      WHERE transaction_date BETWEEN $1 AND $2
      GROUP BY TO_CHAR(transaction_date, 'YYYY-MM')
      ORDER BY month
    `, [start_date, end_date]);

    // Top categorías de gastos
    const topExpenseCategories = await query(`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as transaction_count
      FROM financial_transactions 
      WHERE transaction_date BETWEEN $1 AND $2 
        AND type = 'expense'
      GROUP BY category
      ORDER BY total_amount DESC
      LIMIT 10
    `, [start_date, end_date]);

    // Métodos de pago más utilizados
    const paymentMethods = await query(`
      SELECT 
        payment_method,
        COUNT(*) as usage_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM financial_transactions 
      WHERE transaction_date BETWEEN $1 AND $2 
        AND payment_method IS NOT NULL 
        AND payment_method != ''
      GROUP BY payment_method
      ORDER BY usage_count DESC
    `, [start_date, end_date]);

    res.json({
      success: true,
      data: {
        financial_summary: financialSummary.rows[0],
        monthly_comparison: monthlyComparison.rows,
        top_expense_categories: topExpenseCategories.rows,
        payment_methods: paymentMethods.rows,
        start_date,
        end_date
      }
    });

  } catch (error) {
    next(error);
  }
});

// =====================================================
// GET /api/reports/customers - Reporte de clientes
// =====================================================
router.get('/customers', authenticate, authorize(['admin', 'manager']), async (req, res, next) => {
  try {
    // Estadísticas generales de clientes
    const customerStats = await query(`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(*) FILTER (WHERE is_active = true) as active_customers,
        COALESCE(AVG(total_purchases), 0) as average_purchases,
        COALESCE(AVG(loyalty_points), 0) as average_loyalty_points
      FROM customers
    `);

    // Top clientes por compras
    const topCustomers = await query(`
      SELECT 
        c.first_name,
        c.last_name,
        c.email,
        c.total_purchases,
        c.loyalty_points,
        COUNT(o.id) as order_count
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE c.is_active = true
      GROUP BY c.id, c.first_name, c.last_name, c.email, c.total_purchases, c.loyalty_points
      ORDER BY c.total_purchases DESC
      LIMIT 10
    `);

    // Nuevos clientes por mes (últimos 12 meses)
    const newCustomersByMonth = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as new_customers
      FROM customers 
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `);

    // Distribución de puntos de lealtad
    const loyaltyDistribution = await query(`
      SELECT 
        CASE 
          WHEN loyalty_points = 0 THEN '0 puntos'
          WHEN loyalty_points BETWEEN 1 AND 100 THEN '1-100 puntos'
          WHEN loyalty_points BETWEEN 101 AND 500 THEN '101-500 puntos'
          WHEN loyalty_points BETWEEN 501 AND 1000 THEN '501-1000 puntos'
          ELSE 'Más de 1000 puntos'
        END as point_range,
        COUNT(*) as customer_count
      FROM customers 
      WHERE is_active = true
      GROUP BY 
        CASE 
          WHEN loyalty_points = 0 THEN '0 puntos'
          WHEN loyalty_points BETWEEN 1 AND 100 THEN '1-100 puntos'
          WHEN loyalty_points BETWEEN 101 AND 500 THEN '101-500 puntos'
          WHEN loyalty_points BETWEEN 501 AND 1000 THEN '501-1000 puntos'
          ELSE 'Más de 1000 puntos'
        END
      ORDER BY MIN(loyalty_points)
    `);

    res.json({
      success: true,
      data: {
        customer_stats: customerStats.rows[0],
        top_customers: topCustomers.rows,
        new_customers_by_month: newCustomersByMonth.rows,
        loyalty_distribution: loyaltyDistribution.rows
      }
    });

  } catch (error) {
    next(error);
  }
});

export default router;