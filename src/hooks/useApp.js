import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}

// Hook específico para autenticación
export function useAuth() {
  const { state, login, logout } = useApp();
  return {
    user: state.currentUser,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
}

// Hook específico para inventario
export function useInventory() {
  const { state, updateMateria, addMateria, deleteMateria } = useApp();
  return {
    materiasPrimas: state.materiasPrimas,
    updateMateria,
    addMateria,
    deleteMateria,
  };
}

// Hook específico para empleados
export function useEmployees() {
  const { state, updateEmpleado, addEmpleado, deleteEmpleado } = useApp();
  return {
    empleados: state.empleados,
    departamentos: state.departamentos,
    puestos: state.puestos,
    updateEmpleado,
    addEmpleado,
    deleteEmpleado,
  };
}

// Hook específico para usuarios
export function useUsers() {
  const { state, updateUser, addUser, deleteUser } = useApp();
  return {
    users: state.users,
    roles: state.roles,
    updateUser,
    addUser,
    deleteUser,
  };
}

// Hook específico para productos
export function useProducts() {
  const { state, updateProducto, addProducto, deleteProducto } = useApp();
  return {
    productos: state.productos,
    categorias: state.categorias,
    updateProducto,
    addProducto,
    deleteProducto,
  };
}

// Hook específico para pedidos
export function useOrders() {
  const { state, addPedido, updatePedido, deletePedido } = useApp();
  return {
    pedidos: state.pedidos,
    addPedido,
    updatePedido,
    deletePedido,
  };
}

// Hook específico para finanzas
export function useFinance() {
  const { state, addTransaccion } = useApp();
  return {
    transacciones: state.transacciones,
    presupuesto: state.presupuesto,
    flujoEfectivo: state.flujoEfectivo,
    cuentasPorCobrar: state.cuentasPorCobrar,
    cuentasPorPagar: state.cuentasPorPagar,
    addTransaccion,
  };
}

// Hook específico para producción
export function useProduction() {
  const { state, updateReceta, addReceta } = useApp();
  return {
    recetas: state.recetas,
    planProduccion: state.planProduccion,
    controlCalidad: state.controlCalidad,
    hornos: state.hornos,
    updateReceta,
    addReceta,
  };
}

// Hook específico para ventas
export function useSales() {
  const { state, addVenta } = useApp();
  return {
    ventas: state.ventas,
    clientes: state.clientes,
    metodsPago: state.metodsPago,
    cajas: state.cajas,
    addVenta,
  };
}

// Hook específico para UI
export function useUI() {
  const { state, setActiveView, toggleSidebar, toggleDarkMode, setSearchQuery, performSearch, toggleSearch, addNotification, removeNotification } = useApp();
  return {
    activeView: state.activeView,
    sidebarCollapsed: state.sidebarCollapsed,
    darkMode: state.darkMode,
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
    showSearch: state.showSearch,
    notifications: state.notifications,
    setActiveView,
    toggleSidebar,
    toggleDarkMode,
    setSearchQuery,
    performSearch,
    toggleSearch,
    addNotification,
    removeNotification,
  };
}