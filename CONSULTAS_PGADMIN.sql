-- =====================================================
-- CONSULTAS ÚTILES PARA PGADMIN - BAKERYSOFT
-- =====================================================
-- Copia y pega estas consultas en pgAdmin Query Tool
-- para revisar los datos de tu base de datos
-- =====================================================

-- =====================================================
-- USUARIOS
-- =====================================================

-- Ver todos los usuarios
SELECT 
    id,
    username,
    email,
    name,
    role,
    is_active,
    created_at,
    last_login
FROM users
ORDER BY created_at DESC;

-- Ver solo usuarios activos
SELECT username, email, name, role, created_at
FROM users
WHERE is_active = true
ORDER BY created_at DESC;

-- Contar usuarios por rol
SELECT 
    role,
    COUNT(*) as cantidad,
    COUNT(*) FILTER (WHERE is_active = true) as activos
FROM users
GROUP BY role
ORDER BY cantidad DESC;

-- Ver último usuario registrado
SELECT username, email, name, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 1;

-- Buscar usuario por nombre o email
SELECT username, email, name, role
FROM users
WHERE name ILIKE '%admin%' 
   OR email ILIKE '%admin%'
   OR username ILIKE '%admin%';

-- Ver usuarios registrados hoy
SELECT username, email, name, role, created_at
FROM users
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Ver usuarios que han iniciado sesión recientemente
SELECT username, name, role, last_login
FROM users
WHERE last_login IS NOT NULL
ORDER BY last_login DESC
LIMIT 10;

-- =====================================================
-- EMPLEADOS
-- =====================================================

-- Ver todos los empleados
SELECT 
    e.employee_code,
    e.first_name,
    e.last_name,
    e.position,
    e.department,
    e.salary,
    e.hire_date,
    u.username as usuario
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
ORDER BY e.hire_date DESC;

-- Contar empleados por departamento
SELECT 
    department,
    COUNT(*) as cantidad,
    AVG(salary) as salario_promedio
FROM employees
WHERE is_active = true
GROUP BY department
ORDER BY cantidad DESC;

-- Ver empleados con mayor salario
SELECT 
    first_name,
    last_name,
    position,
    department,
    salary
FROM employees
WHERE is_active = true
ORDER BY salary DESC
LIMIT 10;

-- =====================================================
-- PRODUCTOS
-- =====================================================

-- Ver todos los productos
SELECT 
    p.name,
    p.price,
    p.cost,
    p.sku,
    pc.name as categoria,
    p.is_active
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
ORDER BY p.name;

-- Ver productos por categoría
SELECT 
    pc.name as categoria,
    COUNT(p.id) as cantidad_productos,
    AVG(p.price) as precio_promedio
FROM product_categories pc
LEFT JOIN products p ON pc.id = p.category_id
GROUP BY pc.name
ORDER BY cantidad_productos DESC;

-- Ver productos más caros
SELECT name, price, cost, (price - cost) as ganancia
FROM products
WHERE is_active = true
ORDER BY price DESC
LIMIT 10;

-- =====================================================
-- INVENTARIO (MATERIAS PRIMAS)
-- =====================================================

-- Ver todas las materias primas
SELECT 
    name,
    current_stock,
    minimum_stock,
    maximum_stock,
    unit,
    status,
    supplier,
    unit_cost
FROM raw_materials
ORDER BY name;

-- Ver materias primas con stock bajo o crítico
SELECT 
    name,
    current_stock,
    minimum_stock,
    unit,
    status,
    supplier
FROM raw_materials
WHERE status IN ('low', 'critical')
ORDER BY 
    CASE status 
        WHEN 'critical' THEN 1 
        WHEN 'low' THEN 2 
    END,
    current_stock ASC;

-- Ver materias primas próximas a vencer
SELECT 
    name,
    current_stock,
    expiry_date,
    EXTRACT(DAY FROM expiry_date - CURRENT_DATE) as dias_para_vencer
FROM raw_materials
WHERE expiry_date IS NOT NULL 
  AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND current_stock > 0
ORDER BY expiry_date ASC;

-- Valor total del inventario
SELECT 
    SUM(current_stock * unit_cost) as valor_total_inventario,
    COUNT(*) as total_materias_primas
FROM raw_materials;

-- =====================================================
-- PEDIDOS
-- =====================================================

-- Ver todos los pedidos
SELECT 
    o.order_number,
    o.order_date,
    o.status,
    o.total_amount,
    c.first_name || ' ' || c.last_name as cliente,
    e.first_name || ' ' || e.last_name as empleado
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN employees e ON o.employee_id = e.id
ORDER BY o.order_date DESC;

-- Ver pedidos por estado
SELECT 
    status,
    COUNT(*) as cantidad,
    SUM(total_amount) as total_ventas
FROM orders
GROUP BY status
ORDER BY cantidad DESC;

-- Ver pedidos de hoy
SELECT 
    order_number,
    status,
    total_amount,
    order_date
FROM orders
WHERE DATE(order_date) = CURRENT_DATE
ORDER BY order_date DESC;

-- Ver pedidos pendientes
SELECT 
    order_number,
    order_date,
    total_amount,
    delivery_date
FROM orders
WHERE status IN ('pending', 'confirmed')
ORDER BY delivery_date ASC;

-- Ver detalle de un pedido específico
SELECT 
    o.order_number,
    o.order_date,
    o.status,
    p.name as producto,
    oi.quantity,
    oi.unit_price,
    oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'ORD-XXXXX' -- Reemplaza con el número de orden
ORDER BY oi.created_at;

-- =====================================================
-- FINANZAS
-- =====================================================

-- Ver todas las transacciones
SELECT 
    transaction_number,
    type,
    category,
    amount,
    description,
    transaction_date,
    payment_method
FROM financial_transactions
ORDER BY transaction_date DESC;

-- Resumen financiero del mes actual
SELECT 
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as ingresos,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as gastos,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as ganancia_neta
FROM financial_transactions
WHERE EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE);

-- Ver transacciones por categoría
SELECT 
    type,
    category,
    COUNT(*) as cantidad,
    SUM(amount) as total
FROM financial_transactions
GROUP BY type, category
ORDER BY type, total DESC;

-- Ver gastos más grandes
SELECT 
    transaction_number,
    category,
    amount,
    description,
    transaction_date
FROM financial_transactions
WHERE type = 'expense'
ORDER BY amount DESC
LIMIT 10;

-- =====================================================
-- PRODUCCIÓN
-- =====================================================

-- Ver todas las recetas
SELECT 
    r.name,
    r.difficulty_level,
    r.preparation_time,
    r.cooking_time,
    r.yield_quantity,
    r.yield_unit,
    p.name as producto
FROM recipes r
LEFT JOIN products p ON r.product_id = p.id
WHERE r.is_active = true
ORDER BY r.name;

-- Ver lotes de producción
SELECT 
    pb.batch_number,
    r.name as receta,
    pb.planned_quantity,
    pb.actual_quantity,
    pb.production_date,
    pb.status,
    pb.quality_score
FROM production_batches pb
JOIN recipes r ON pb.recipe_id = r.id
ORDER BY pb.production_date DESC;

-- Ver producción del día
SELECT 
    batch_number,
    planned_quantity,
    actual_quantity,
    status,
    quality_score
FROM production_batches
WHERE DATE(production_date) = CURRENT_DATE
ORDER BY created_at DESC;

-- =====================================================
-- CLIENTES
-- =====================================================

-- Ver todos los clientes
SELECT 
    customer_code,
    first_name,
    last_name,
    email,
    phone,
    loyalty_points,
    total_purchases,
    created_at
FROM customers
WHERE is_active = true
ORDER BY total_purchases DESC;

-- Ver clientes con más puntos de lealtad
SELECT 
    first_name,
    last_name,
    email,
    loyalty_points,
    total_purchases
FROM customers
WHERE is_active = true
ORDER BY loyalty_points DESC
LIMIT 10;

-- =====================================================
-- PROVEEDORES
-- =====================================================

-- Ver todos los proveedores
SELECT 
    name,
    contact_person,
    email,
    phone,
    address,
    is_active
FROM suppliers
ORDER BY name;

-- =====================================================
-- ESTADÍSTICAS GENERALES
-- =====================================================

-- Resumen general del sistema
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = true) as usuarios_activos,
    (SELECT COUNT(*) FROM employees WHERE is_active = true) as empleados_activos,
    (SELECT COUNT(*) FROM products WHERE is_active = true) as productos_activos,
    (SELECT COUNT(*) FROM raw_materials) as materias_primas,
    (SELECT COUNT(*) FROM orders) as total_pedidos,
    (SELECT COUNT(*) FROM customers WHERE is_active = true) as clientes_activos;

-- Actividad reciente (últimas 24 horas)
SELECT 
    'Usuarios' as tipo,
    COUNT(*) as cantidad
FROM users
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 
    'Pedidos' as tipo,
    COUNT(*) as cantidad
FROM orders
WHERE order_date >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 
    'Transacciones' as tipo,
    COUNT(*) as cantidad
FROM financial_transactions
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours';

-- =====================================================
-- CONSULTAS DE AUDITORÍA
-- =====================================================

-- Ver logs de auditoría recientes
SELECT 
    al.action,
    al.table_name,
    u.username,
    al.created_at
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 50;

-- =====================================================
-- LIMPIEZA Y MANTENIMIENTO
-- =====================================================

-- Ver tamaño de las tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Contar registros en todas las tablas
SELECT 
    'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'raw_materials', COUNT(*) FROM raw_materials
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL
SELECT 'financial_transactions', COUNT(*) FROM financial_transactions
UNION ALL
SELECT 'production_batches', COUNT(*) FROM production_batches
ORDER BY registros DESC;

-- =====================================================
-- FIN DE CONSULTAS
-- =====================================================
-- Guarda este archivo para referencia futura
-- Puedes modificar las consultas según tus necesidades
-- =====================================================
