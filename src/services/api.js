/**
 * Servicio API para comunicación con el backend
 * =============================================
 * 
 * Maneja todas las peticiones HTTP al backend PostgreSQL
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug: verificar que la URL se cargue correctamente
console.log('🔗 API URL configurada:', API_URL);

/**
 * Clase para manejar errores de API
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Obtener token de autenticación
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Guardar token de autenticación
 */
const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Eliminar token de autenticación
 */
const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Realizar petición HTTP
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Intentar parsear la respuesta como JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Si no es JSON, crear un objeto de error genérico
      data = { 
        success: false, 
        error: `Error del servidor (${response.status})` 
      };
    }

    if (!response.ok) {
      throw new ApiError(
        data.error || `Error ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    // Error de red o fetch
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Error de conexión
    console.error('Error de conexión:', error);
    throw new ApiError(
      'Error de conexión con el servidor. Verifica que el backend esté ejecutándose.',
      0,
      error
    );
  }
};

// =====================================================
// AUTENTICACIÓN
// =====================================================

export const authAPI = {
  /**
   * Iniciar sesión
   */
  login: async (username, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (userData) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    
    return response.data;
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser: async () => {
    const response = await request('/auth/me');
    return response.data.user;
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  /**
   * Renovar token
   */
  refreshToken: async () => {
    const response = await request('/auth/refresh', { method: 'POST' });
    if (response.success && response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },
};

// =====================================================
// USUARIOS
// =====================================================

export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/users?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await request(`/users/${id}`);
    return response.data.user;
  },

  update: async (id, userData) => {
    const response = await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data.user;
  },

  delete: async (id) => {
    const response = await request(`/users/${id}`, { method: 'DELETE' });
    return response;
  },

  changePassword: async (id, passwords) => {
    const response = await request(`/users/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
    return response;
  },
};

// =====================================================
// EMPLEADOS
// =====================================================

export const employeesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/employees?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await request(`/employees/${id}`);
    return response.data.employee;
  },

  create: async (employeeData) => {
    const response = await request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
    return response.data.employee;
  },

  update: async (id, employeeData) => {
    const response = await request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
    return response.data.employee;
  },

  delete: async (id) => {
    const response = await request(`/employees/${id}`, { method: 'DELETE' });
    return response;
  },

  getDepartments: async () => {
    const response = await request('/employees/meta/departments');
    return response.data.departments;
  },

  getPositions: async () => {
    const response = await request('/employees/meta/positions');
    return response.data.positions;
  },

  getStats: async () => {
    const response = await request('/employees/meta/stats');
    return response.data;
  },
};

// =====================================================
// INVENTARIO
// =====================================================

export const inventoryAPI = {
  getRawMaterials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/inventory/raw-materials?${queryString}`);
    return response.data;
  },

  createRawMaterial: async (materialData) => {
    const response = await request('/inventory/raw-materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
    return response.data.material;
  },

  updateRawMaterial: async (id, materialData) => {
    const response = await request(`/inventory/raw-materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    });
    return response.data.material;
  },

  deleteRawMaterial: async (id) => {
    const response = await request(`/inventory/raw-materials/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  createMovement: async (movementData) => {
    const response = await request('/inventory/movements', {
      method: 'POST',
      body: JSON.stringify(movementData),
    });
    return response.data.movement;
  },

  getMovements: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/inventory/movements?${queryString}`);
    return response.data;
  },

  getAlerts: async () => {
    const response = await request('/inventory/alerts');
    return response.data.alerts;
  },
};

// =====================================================
// PRODUCTOS
// =====================================================

export const productsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/products?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await request(`/products/${id}`);
    return response.data.product;
  },

  create: async (productData) => {
    const response = await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response.data.product;
  },

  update: async (id, productData) => {
    const response = await request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response.data.product;
  },

  delete: async (id) => {
    const response = await request(`/products/${id}`, { method: 'DELETE' });
    return response;
  },

  getCategories: async () => {
    const response = await request('/products/categories/all');
    return response.data.categories;
  },

  createCategory: async (categoryData) => {
    const response = await request('/products/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data.category;
  },
};

// =====================================================
// PEDIDOS
// =====================================================

export const ordersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/orders?${queryString}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await request(`/orders/${id}`);
    return response.data.order;
  },

  create: async (orderData) => {
    const response = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data.order;
  },

  update: async (id, orderData) => {
    const response = await request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
    return response.data.order;
  },

  cancel: async (id) => {
    const response = await request(`/orders/${id}`, { method: 'DELETE' });
    return response;
  },

  getStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/orders/stats/summary?${queryString}`);
    return response.data.stats;
  },
};

// =====================================================
// FINANZAS
// =====================================================

export const financesAPI = {
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/finances/transactions?${queryString}`);
    return response.data;
  },

  createTransaction: async (transactionData) => {
    const response = await request('/finances/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    return response.data.transaction;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await request(`/finances/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
    return response.data.transaction;
  },

  deleteTransaction: async (id) => {
    const response = await request(`/finances/transactions/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  getSummary: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/finances/summary?${queryString}`);
    return response.data;
  },

  getCategories: async (type) => {
    const queryString = type ? `?type=${type}` : '';
    const response = await request(`/finances/categories${queryString}`);
    return response.data.categories;
  },

  getMonthlyReport: async (year) => {
    const response = await request(`/finances/monthly-report?year=${year}`);
    return response.data.monthly_data;
  },
};

// =====================================================
// PRODUCCIÓN
// =====================================================

export const productionAPI = {
  getRecipes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/production/recipes?${queryString}`);
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await request(`/production/recipes/${id}`);
    return response.data.recipe;
  },

  createRecipe: async (recipeData) => {
    const response = await request('/production/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
    return response.data.recipe;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await request(`/production/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
    return response.data.recipe;
  },

  getBatches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/production/batches?${queryString}`);
    return response.data;
  },

  createBatch: async (batchData) => {
    const response = await request('/production/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
    return response.data.batch;
  },

  updateBatch: async (id, batchData) => {
    const response = await request(`/production/batches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
    return response.data.batch;
  },

  getStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/production/stats?${queryString}`);
    return response.data.stats;
  },
};

// =====================================================
// REPORTES
// =====================================================

export const reportsAPI = {
  getDashboard: async (period = 30) => {
    const response = await request(`/reports/dashboard?period=${period}`);
    return response.data;
  },

  getSales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/reports/sales?${queryString}`);
    return response.data;
  },

  getInventory: async () => {
    const response = await request('/reports/inventory');
    return response.data;
  },

  getProduction: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/reports/production?${queryString}`);
    return response.data;
  },

  getFinancial: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await request(`/reports/financial?${queryString}`);
    return response.data;
  },

  getCustomers: async () => {
    const response = await request('/reports/customers');
    return response.data;
  },
};

// Exportar utilidades
export { getToken, setToken, removeToken, ApiError };