// Base de datos simulada de usuarios
export const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@bakerysoft.com',
    password: 'admin123', // En producción esto estaría hasheado
    role: 'admin',
    name: 'Carlos Administrador',
    avatar: '👨‍💼',
    profilePhoto: '/img/administrador.png',
    permissions: ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'personal', 'pedidos', 'proveedores', 'usuarios', 'reportes'],
    lastLogin: '2024-01-07T08:30:00Z',
    isActive: true,
    registrationDate: '2020-01-15T08:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@bakerysoft.com',
    password: 'manager123',
    role: 'manager',
    name: 'Ana Gerente',
    avatar: '👩‍💼',
    profilePhoto: '/img/gerente.png',
    permissions: ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'pedidos', 'proveedores', 'reportes'],
    lastLogin: '2024-01-07T07:15:00Z',
    isActive: true,
    registrationDate: '2021-03-10T09:30:00Z',
    status: 'active'
  },
  {
    id: 3,
    username: 'empleado',
    email: 'empleado@bakerysoft.com',
    password: 'empleado123',
    role: 'employee',
    name: 'Luis Empleado',
    avatar: '👨‍🍳',
    profilePhoto: '/img/empleado.jpeg',
    permissions: ['dashboard', 'pos', 'inventario'],
    lastLogin: '2024-01-06T16:45:00Z',
    isActive: true,
    registrationDate: '2022-06-20T11:00:00Z',
    status: 'active'
  },
  {
    id: 4,
    username: 'supervisor',
    email: 'supervisor@bakerysoft.com',
    password: 'supervisor123',
    role: 'supervisor',
    name: 'María Supervisora',
    avatar: '👩‍🍳',
    profilePhoto: '/img/supervisor.jpeg',
    permissions: ['dashboard', 'pos', 'inventario', 'produccion', 'pedidos'],
    lastLogin: '2024-01-07T06:00:00Z',
    isActive: true,
    registrationDate: '2023-08-15T10:30:00Z',
    status: 'active'
  },
  {
    id: 5,
    username: 'carlos.baker',
    email: 'carlos.baker@email.com',
    password: 'carlos123',
    role: 'employee',
    name: 'Carlos Panadero',
    avatar: '👨‍🍳',
    profilePhoto: '/img/empleado.jpeg',
    permissions: ['dashboard', 'pos', 'inventario'],
    lastLogin: '2024-01-06T14:20:00Z',
    isActive: true,
    registrationDate: '2024-01-05T09:15:00Z',
    status: 'active'
  },
  {
    id: 6,
    username: 'sofia.ventas',
    email: 'sofia.ventas@email.com',
    password: 'sofia123',
    role: 'employee',
    name: 'Sofía Vendedora',
    avatar: '👩‍💼',
    profilePhoto: '/img/empleado.jpeg',
    permissions: ['dashboard', 'pos', 'inventario'],
    lastLogin: null,
    isActive: true,
    registrationDate: '2024-01-07T16:45:00Z',
    status: 'active'
  },
  {
    id: 7,
    username: 'cliente',
    email: 'cliente@email.com',
    password: 'cliente123',
    role: 'client',
    name: 'María Cliente',
    avatar: '🛒',
    profilePhoto: '/img/cliente.png',
    permissions: ['productos', 'pedidos', 'perfil'],
    lastLogin: null,
    isActive: true,
    registrationDate: '2024-01-08T10:00:00Z',
    status: 'active'
  }
];

// Roles y sus descripciones
export const roles = {
  admin: {
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: 'bg-purple-100 text-purple-800',
    icon: '👨‍💼'
  },
  manager: {
    name: 'Gerente',
    description: 'Gestión de inventario y proveedores',
    color: 'bg-blue-100 text-blue-800',
    icon: '👩‍💼'
  },
  supervisor: {
    name: 'Supervisor',
    description: 'Supervisión de inventario y pedidos',
    color: 'bg-green-100 text-green-800',
    icon: '👨‍🍳'
  },
  employee: {
    name: 'Empleado',
    description: 'Consulta de inventario',
    color: 'bg-gray-100 text-gray-800',
    icon: '👩‍🍳'
  },
  client: {
    name: 'Cliente',
    description: 'Realizar pedidos y consultar productos',
    color: 'bg-orange-100 text-orange-800',
    icon: '🛒'
  }
};

// Función para simular autenticación
export const authenticateUser = (username, password) => {
  const user = users.find(u => 
    (u.username === username || u.email === username) && 
    u.password === password && 
    u.isActive
  );
  
  if (user) {
    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    // Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

// Función para registrar nuevo usuario
export const registerUser = (userData) => {
  const existingUser = users.find(u => 
    u.username === userData.username || u.email === userData.email
  );
  
  if (existingUser) {
    return { error: 'Usuario o email ya existe' };
  }
  
  const newUser = {
    id: users.length + 1,
    ...userData,
    role: userData.role || 'employee',
    permissions: getPermissionsByRole(userData.role || 'employee'),
    lastLogin: null,
    isActive: true,
    registrationDate: new Date().toISOString(),
    status: 'active' // active, pending, suspended
  };
  
  users.push(newUser);
  
  // Retornar usuario sin password
  const { password: _, confirmPassword: __, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Función para obtener permisos por rol
export const getPermissionsByRole = (role) => {
  const rolePermissions = {
    admin: ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'personal', 'pedidos', 'proveedores', 'usuarios', 'reportes'],
    manager: ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'pedidos', 'proveedores', 'reportes'],
    supervisor: ['dashboard', 'pos', 'inventario', 'produccion', 'pedidos'],
    employee: ['dashboard', 'pos', 'inventario'],
    client: ['productos', 'pedidos', 'perfil']
  };
  
  return rolePermissions[role] || rolePermissions.employee;
};