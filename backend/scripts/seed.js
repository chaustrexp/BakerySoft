/**
 * Script de Datos Iniciales (Seed)
 * =================================
 * 
 * Pobla la base de datos con datos de ejemplo
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

import bcrypt from 'bcryptjs';
import { query, testConnection, closePool } from '../config/database.js';

/**
 * Crear usuarios de ejemplo
 */
async function createUsers() {
  console.log('👥 Creando usuarios de ejemplo...');

  const users = [
    {
      username: 'admin',
      email: 'admin@bakerysoft.com',
      password: 'admin123',
      name: 'Administrador Principal',
      role: 'admin',
      permissions: ['dashboard', 'inventario', 'personal', 'finanzas', 'produccion', 'pos', 'usuarios', 'reportes', 'proveedores', 'pedidos']
    },
    {
      username: 'gerente',
      email: 'gerente@bakerysoft.com',
      password: 'gerente123',
      name: 'María García',
      role: 'manager',
      permissions: ['dashboard', 'inventario', 'personal', 'finanzas', 'produccion', 'pos', 'reportes', 'proveedores', 'pedidos']
    },
    {
      username: 'supervisor',
      email: 'supervisor@bakerysoft.com',
      password: 'supervisor123',
      name: 'Carlos López',
      role: 'supervisor',
      permissions: ['dashboard', 'inventario', 'personal', 'produccion', 'pos', 'pedidos']
    },
    {
      username: 'empleado',
      email: 'empleado@bakerysoft.com',
      password: 'empleado123',
      name: 'Ana Martínez',
      role: 'employee',
      permissions: ['dashboard', 'inventario', 'produccion', 'pos']
    },
    {
      username: 'cliente',
      email: 'cliente@bakerysoft.com',
      password: 'cliente123',
      name: 'Juan Pérez',
      role: 'client',
      permissions: ['dashboard', 'productos', 'pedidos', 'perfil']
    }
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);
    
    await query(
      `INSERT INTO users (username, email, password_hash, name, role, permissions) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (username) DO NOTHING`,
      [user.username, user.email, passwordHash, user.name, user.role, user.permissions]
    );
  }

  console.log('   ✓ Usuarios creados');
}

/**
 * Crear empleados de ejemplo
 */
async function createEmployees() {
  console.log('👨‍💼 Creando empleados de ejemplo...');

  // Obtener IDs de usuarios
  const adminResult = await query('SELECT id FROM users WHERE username = $1', ['admin']);
  const managerResult = await query('SELECT id FROM users WHERE username = $1', ['gerente']);
  const supervisorResult = await query('SELECT id FROM users WHERE username = $1', ['supervisor']);
  const employeeResult = await query('SELECT id FROM users WHERE username = $1', ['empleado']);

  const employees = [
    {
      user_id: adminResult.rows[0]?.id,
      employee_code: 'EMP001',
      first_name: 'Administrador',
      last_name: 'Principal',
      position: 'Administrador General',
      department: 'Administración',
      hire_date: '2023-01-01',
      salary: 5000000,
      phone: '+57 300 123 4567',
      address: 'Calle 123 #45-67, Bogotá'
    },
    {
      user_id: managerResult.rows[0]?.id,
      employee_code: 'EMP002',
      first_name: 'María',
      last_name: 'García',
      position: 'Gerente General',
      department: 'Gerencia',
      hire_date: '2023-02-01',
      salary: 4000000,
      phone: '+57 301 234 5678',
      address: 'Carrera 45 #12-34, Bogotá'
    },
    {
      user_id: supervisorResult.rows[0]?.id,
      employee_code: 'EMP003',
      first_name: 'Carlos',
      last_name: 'López',
      position: 'Supervisor de Producción',
      department: 'Producción',
      hire_date: '2023-03-01',
      salary: 2500000,
      phone: '+57 302 345 6789',
      address: 'Avenida 68 #23-45, Bogotá'
    },
    {
      user_id: employeeResult.rows[0]?.id,
      employee_code: 'EMP004',
      first_name: 'Ana',
      last_name: 'Martínez',
      position: 'Panadera',
      department: 'Producción',
      hire_date: '2023-04-01',
      salary: 1800000,
      phone: '+57 303 456 7890',
      address: 'Calle 72 #34-56, Bogotá'
    }
  ];

  for (const employee of employees) {
    if (employee.user_id) {
      await query(
        `INSERT INTO employees (user_id, employee_code, first_name, last_name, position, department, hire_date, salary, phone, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (employee_code) DO NOTHING`,
        [
          employee.user_id, employee.employee_code, employee.first_name, employee.last_name,
          employee.position, employee.department, employee.hire_date, employee.salary,
          employee.phone, employee.address
        ]
      );
    }
  }

  console.log('   ✓ Empleados creados');
}

/**
 * Crear cliente de ejemplo
 */
async function createCustomers() {
  console.log('👤 Creando clientes de ejemplo...');

  const clientResult = await query('SELECT id FROM users WHERE username = $1', ['cliente']);

  if (clientResult.rows[0]) {
    await query(
      `INSERT INTO customers (user_id, customer_code, first_name, last_name, email, phone, address, loyalty_points)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (customer_code) DO NOTHING`,
      [
        clientResult.rows[0].id, 'CLI001', 'Juan', 'Pérez',
        'cliente@bakerysoft.com', '+57 304 567 8901',
        'Calle 80 #45-67, Bogotá', 150
      ]
    );
  }

  console.log('   ✓ Clientes creados');
}

/**
 * Crear productos de ejemplo
 */
async function createProducts() {
  console.log('🍞 Creando productos de ejemplo...');

  // Obtener categorías
  const categoriesResult = await query('SELECT id, name FROM product_categories ORDER BY name');
  const categories = {};
  categoriesResult.rows.forEach(cat => {
    categories[cat.name] = cat.id;
  });

  const products = [
    {
      name: 'Pan Integral',
      description: 'Pan integral artesanal con semillas',
      category_id: categories['Panes'],
      price: 3500,
      cost: 1500,
      sku: 'PAN001'
    },
    {
      name: 'Croissant de Mantequilla',
      description: 'Croissant francés tradicional',
      category_id: categories['Panes'],
      price: 2800,
      cost: 1200,
      sku: 'PAN002'
    },
    {
      name: 'Torta de Chocolate',
      description: 'Torta de chocolate con cobertura',
      category_id: categories['Pasteles'],
      price: 45000,
      cost: 20000,
      sku: 'TOR001'
    },
    {
      name: 'Galletas de Avena',
      description: 'Galletas caseras de avena y pasas',
      category_id: categories['Galletas'],
      price: 8000,
      cost: 3500,
      sku: 'GAL001'
    },
    {
      name: 'Café Americano',
      description: 'Café americano recién preparado',
      category_id: categories['Bebidas'],
      price: 4500,
      cost: 1500,
      sku: 'BEB001'
    }
  ];

  for (const product of products) {
    await query(
      `INSERT INTO products (name, description, category_id, price, cost, sku)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (sku) DO NOTHING`,
      [product.name, product.description, product.category_id, product.price, product.cost, product.sku]
    );
  }

  console.log('   ✓ Productos creados');
}

/**
 * Crear materias primas de ejemplo
 */
async function createRawMaterials() {
  console.log('📦 Creando materias primas de ejemplo...');

  const materials = [
    {
      name: 'Harina de Trigo',
      description: 'Harina de trigo todo uso',
      unit: 'kg',
      current_stock: 50,
      minimum_stock: 10,
      maximum_stock: 100,
      unit_cost: 2500,
      supplier: 'Molinos del Valle',
      location: 'Bodega A1'
    },
    {
      name: 'Azúcar Blanca',
      description: 'Azúcar refinada blanca',
      unit: 'kg',
      current_stock: 25,
      minimum_stock: 5,
      maximum_stock: 50,
      unit_cost: 3200,
      supplier: 'Ingenio San Carlos',
      location: 'Bodega A2'
    },
    {
      name: 'Mantequilla',
      description: 'Mantequilla sin sal',
      unit: 'kg',
      current_stock: 8,
      minimum_stock: 2,
      maximum_stock: 20,
      unit_cost: 12000,
      supplier: 'Lácteos La Pradera',
      location: 'Refrigerador 1'
    },
    {
      name: 'Huevos',
      description: 'Huevos frescos AA',
      unit: 'unidades',
      current_stock: 120,
      minimum_stock: 30,
      maximum_stock: 200,
      unit_cost: 450,
      supplier: 'Avícola El Campo',
      location: 'Refrigerador 2'
    },
    {
      name: 'Levadura',
      description: 'Levadura seca activa',
      unit: 'g',
      current_stock: 500,
      minimum_stock: 100,
      maximum_stock: 1000,
      unit_cost: 15,
      supplier: 'Fermentos Industriales',
      location: 'Bodega B1'
    }
  ];

  for (const material of materials) {
    // Determinar status basado en stock
    let status = 'optimal';
    if (material.current_stock <= material.minimum_stock) {
      status = material.current_stock === 0 ? 'critical' : 'low';
    }

    await query(
      `INSERT INTO raw_materials (name, description, unit, current_stock, minimum_stock, maximum_stock, unit_cost, supplier, location, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (name) DO NOTHING`,
      [
        material.name, material.description, material.unit, material.current_stock,
        material.minimum_stock, material.maximum_stock, material.unit_cost,
        material.supplier, material.location, status
      ]
    );
  }

  console.log('   ✓ Materias primas creadas');
}

/**
 * Ejecutar seed completo
 */
async function seed() {
  try {
    console.log('🌱 Iniciando población de base de datos...');

    // Verificar conexión
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    await createUsers();
    await createEmployees();
    await createCustomers();
    await createProducts();
    await createRawMaterials();

    console.log('\n🎉 Base de datos poblada exitosamente');
    console.log('\n📋 Usuarios de prueba creados:');
    console.log('   👑 Admin: admin / admin123');
    console.log('   👨‍💼 Gerente: gerente / gerente123');
    console.log('   👷 Supervisor: supervisor / supervisor123');
    console.log('   👩‍🍳 Empleado: empleado / empleado123');
    console.log('   👤 Cliente: cliente / cliente123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export default seed;