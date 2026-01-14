import React, { createContext, useReducer, useCallback, useEffect, useState } from 'react';

// Importar servicio API
import { authAPI, getToken } from '../services/api';

// Importar datos locales (temporalmente para datos que aún no están en backend)
import { roles } from '../data/users';
import { materiasPrimas } from '../data/materias';
import { productos, categorias } from '../data/productos';
import { empleados, asistencia, nomina, departamentos, puestos } from '../data/personal';
import { transacciones, presupuesto, flujoEfectivo, cuentasPorCobrar, cuentasPorPagar } from '../data/finanzas';
import { recetas, planProduccion, controlCalidad, hornos } from '../data/produccion';
import { ventas, clientes, metodsPago, cajas } from '../data/ventas';

export const AppContext = createContext();

const initialState = {
  // Autenticación
  currentUser: null,
  isAuthenticated: false,
  authLoading: true, // Nuevo: para verificar token al cargar
  authError: null, // Nuevo: para manejar errores de autenticación
  
  // Datos principales (temporalmente locales, migraremos a API gradualmente)
  users: [], // Ahora vendrá del backend
  roles: roles,
  materiasPrimas: materiasPrimas,
  productos: productos,
  categorias: categorias,
  empleados: empleados,
  asistencia: asistencia,
  nomina: nomina,
  departamentos: departamentos,
  puestos: puestos,
  transacciones: transacciones,
  presupuesto: presupuesto,
  flujoEfectivo: flujoEfectivo,
  cuentasPorCobrar: cuentasPorCobrar,
  cuentasPorPagar: cuentasPorPagar,
  recetas: recetas,
  planProduccion: planProduccion,
  controlCalidad: controlCalidad,
  hornos: hornos,
  ventas: ventas,
  clientes: clientes,
  metodsPago: metodsPago,
  cajas: cajas,
  
  // Pedidos (inicialmente vacío)
  pedidos: [],
  
  // UI State
  activeView: 'dashboard',
  sidebarCollapsed: false,
  darkMode: false,
  searchQuery: '',
  searchResults: [],
  showSearch: false,
  notifications: [
    {
      id: 1,
      type: 'critical',
      title: 'Stock Crítico',
      message: 'Azúcar Blanca tiene stock crítico (3 kg)',
      time: '5 min',
      icon: '🚨'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Stock Bajo',
      message: 'Levadura Fresca necesita reposición (8 kg)',
      time: '15 min',
      icon: '⚠️'
    }
  ],
};

function appReducer(state, action) {
  switch (action.type) {
    // Autenticación
    case 'LOGIN':
      return { 
        ...state, 
        currentUser: action.payload, 
        isAuthenticated: true,
        authLoading: false,
        authError: null
      };
    case 'LOGOUT':
      return { 
        ...state, 
        currentUser: null, 
        isAuthenticated: false,
        authError: null
      };
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    case 'SET_AUTH_ERROR':
      return { ...state, authError: action.payload, authLoading: false };
    case 'CLEAR_AUTH_ERROR':
      return { ...state, authError: null };
    
    // Materias Primas
    case 'UPDATE_MATERIA':
      return {
        ...state,
        materiasPrimas: state.materiasPrimas.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'ADD_MATERIA':
      return {
        ...state,
        materiasPrimas: [...state.materiasPrimas, action.payload],
      };
    case 'DELETE_MATERIA':
      return {
        ...state,
        materiasPrimas: state.materiasPrimas.filter(m => m.id !== action.payload),
      };
    
    // Empleados
    case 'UPDATE_EMPLEADO':
      return {
        ...state,
        empleados: state.empleados.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'ADD_EMPLEADO':
      return {
        ...state,
        empleados: [...state.empleados, action.payload],
      };
    case 'DELETE_EMPLEADO':
      return {
        ...state,
        empleados: state.empleados.filter(e => e.id !== action.payload),
      };
    
    // Usuarios
    case 'UPDATE_USER':
      const updatedUsers = state.users.map(u =>
        u.id === action.payload.id ? action.payload : u
      );
      
      // Si el usuario actualizado es el usuario actual, también actualizar currentUser
      const updatedCurrentUser = state.currentUser && state.currentUser.id === action.payload.id 
        ? action.payload 
        : state.currentUser;
      
      return {
        ...state,
        users: updatedUsers,
        currentUser: updatedCurrentUser,
      };
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
      };
    
    // Productos
    case 'UPDATE_PRODUCTO':
      return {
        ...state,
        productos: state.productos.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'ADD_PRODUCTO':
      return {
        ...state,
        productos: [...state.productos, action.payload],
      };
    case 'DELETE_PRODUCTO':
      return {
        ...state,
        productos: state.productos.filter(p => p.id !== action.payload),
      };
    
    // Pedidos
    case 'ADD_PEDIDO':
      return {
        ...state,
        pedidos: [...state.pedidos, action.payload],
      };
    case 'UPDATE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.filter(p => p.id !== action.payload),
      };
    
    // Transacciones
    case 'ADD_TRANSACCION':
      return {
        ...state,
        transacciones: [...state.transacciones, action.payload],
      };
    
    // Ventas
    case 'ADD_VENTA':
      return {
        ...state,
        ventas: [...state.ventas, action.payload],
      };
    
    // Recetas
    case 'UPDATE_RECETA':
      return {
        ...state,
        recetas: state.recetas.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'ADD_RECETA':
      return {
        ...state,
        recetas: [...state.recetas, action.payload],
      };
    
    // UI
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'TOGGLE_SEARCH':
      return { ...state, showSearch: !state.showSearch };
    case 'RESTORE_DATA':
      return { ...state, [action.key]: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          dispatch({ type: 'SET_AUTH_LOADING', payload: true });
          const user = await authAPI.getCurrentUser();
          dispatch({ type: 'LOGIN', payload: user });
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          // Token inválido o expirado, limpiar
          localStorage.removeItem('token');
          dispatch({ type: 'SET_AUTH_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Cargar datos del localStorage al inicializar (datos que aún no están en backend)
  useEffect(() => {
    const savedData = localStorage.getItem('bakerysoft_data');
    const savedSettings = localStorage.getItem('bakerysoft_settings');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Restaurar datos guardados
        Object.keys(parsedData).forEach(key => {
          if (key !== 'currentUser' && key !== 'isAuthenticated') {
            dispatch({ type: 'RESTORE_DATA', key, payload: parsedData[key] });
          }
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.darkMode) {
          dispatch({ type: 'TOGGLE_DARK_MODE' });
        }
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    const dataToSave = {
      materiasPrimas: state.materiasPrimas,
      productos: state.productos,
      empleados: state.empleados,
      users: state.users,
      pedidos: state.pedidos,
      transacciones: state.transacciones,
      ventas: state.ventas,
      recetas: state.recetas,
    };
    localStorage.setItem('bakerysoft_data', JSON.stringify(dataToSave));
  }, [state.materiasPrimas, state.productos, state.empleados, state.users, state.pedidos, state.transacciones, state.ventas, state.recetas]);

  // Guardar configuraciones en localStorage
  useEffect(() => {
    const settings = {
      darkMode: state.darkMode,
      sidebarCollapsed: state.sidebarCollapsed,
    };
    localStorage.setItem('bakerysoft_settings', JSON.stringify(settings));
  }, [state.darkMode, state.sidebarCollapsed]);

  // Aplicar tema oscuro al body
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Funciones de autenticación con API
  const login = useCallback(async (username, password) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      dispatch({ type: 'CLEAR_AUTH_ERROR' });
      
      const { user, token } = await authAPI.login(username, password);
      dispatch({ type: 'LOGIN', payload: user });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      dispatch({ type: 'SET_AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true });
      dispatch({ type: 'CLEAR_AUTH_ERROR' });
      
      const { user, token } = await authAPI.register(userData);
      dispatch({ type: 'LOGIN', payload: user });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      dispatch({ type: 'SET_AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  // Funciones CRUD para Materias Primas
  const updateMateria = useCallback((materia) => {
    dispatch({ type: 'UPDATE_MATERIA', payload: materia });
  }, []);

  const addMateria = useCallback((materia) => {
    const newMateria = {
      ...materia,
      id: Math.max(...state.materiasPrimas.map(m => m.id)) + 1,
    };
    dispatch({ type: 'ADD_MATERIA', payload: newMateria });
  }, [state.materiasPrimas]);

  const deleteMateria = useCallback((id) => {
    dispatch({ type: 'DELETE_MATERIA', payload: id });
  }, []);

  // Funciones CRUD para Empleados
  const updateEmpleado = useCallback((empleado) => {
    dispatch({ type: 'UPDATE_EMPLEADO', payload: empleado });
  }, []);

  const addEmpleado = useCallback((empleado) => {
    const newEmpleado = {
      ...empleado,
      id: Math.max(...state.empleados.map(e => e.id)) + 1,
      codigo: `EMP-${String(Math.max(...state.empleados.map(e => e.id)) + 1).padStart(3, '0')}`,
      fechaIngreso: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_EMPLEADO', payload: newEmpleado });
  }, [state.empleados]);

  const deleteEmpleado = useCallback((id) => {
    dispatch({ type: 'DELETE_EMPLEADO', payload: id });
  }, []);

  // Funciones CRUD para Usuarios
  const updateUser = useCallback((user) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    
    // Si es el usuario actual, también actualizar localStorage
    const currentUser = JSON.parse(localStorage.getItem('bakerysoft_user') || '{}');
    if (currentUser.id === user.id) {
      localStorage.setItem('bakerysoft_user', JSON.stringify(user));
    }
  }, []);

  const addUser = useCallback((user) => {
    const newUser = {
      ...user,
      id: Math.max(...state.users.map(u => u.id)) + 1,
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
  }, [state.users]);

  const deleteUser = useCallback((id) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  }, []);

  // Funciones CRUD para Productos
  const updateProducto = useCallback((producto) => {
    dispatch({ type: 'UPDATE_PRODUCTO', payload: producto });
  }, []);

  const addProducto = useCallback((producto) => {
    const newProducto = {
      ...producto,
      id: Math.max(...state.productos.map(p => p.id)) + 1,
    };
    dispatch({ type: 'ADD_PRODUCTO', payload: newProducto });
  }, [state.productos]);

  const deleteProducto = useCallback((id) => {
    dispatch({ type: 'DELETE_PRODUCTO', payload: id });
  }, []);

  // Funciones CRUD para Pedidos
  const addPedido = useCallback((pedido) => {
    const newPedido = {
      ...pedido,
      id: Math.max(0, ...state.pedidos.map(p => p.id)) + 1,
      fecha: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_PEDIDO', payload: newPedido });
  }, [state.pedidos]);

  const updatePedido = useCallback((pedido) => {
    dispatch({ type: 'UPDATE_PEDIDO', payload: pedido });
  }, []);

  const deletePedido = useCallback((id) => {
    dispatch({ type: 'DELETE_PEDIDO', payload: id });
  }, []);

  // Funciones para Transacciones y Ventas
  const addTransaccion = useCallback((transaccion) => {
    const newTransaccion = {
      ...transaccion,
      id: Math.max(...state.transacciones.map(t => t.id)) + 1,
      fecha: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_TRANSACCION', payload: newTransaccion });
  }, [state.transacciones]);

  const addVenta = useCallback((venta) => {
    const newVenta = {
      ...venta,
      id: Math.max(...state.ventas.map(v => v.id)) + 1,
      fecha: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VENTA', payload: newVenta });
  }, [state.ventas]);

  // Funciones para Recetas
  const updateReceta = useCallback((receta) => {
    dispatch({ type: 'UPDATE_RECETA', payload: receta });
  }, []);

  const addReceta = useCallback((receta) => {
    const newReceta = {
      ...receta,
      id: Math.max(...state.recetas.map(r => r.id)) + 1,
    };
    dispatch({ type: 'ADD_RECETA', payload: newReceta });
  }, [state.recetas]);

  // Funciones UI
  const setActiveView = useCallback((view) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      return;
    }

    const results = [];
    const searchTerm = query.toLowerCase();

    // Buscar en empleados
    state.empleados.forEach(empleado => {
      if (empleado.nombre.toLowerCase().includes(searchTerm) || 
          empleado.apellido.toLowerCase().includes(searchTerm) ||
          empleado.puesto.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'empleado',
          id: empleado.id,
          title: `${empleado.nombre} ${empleado.apellido}`,
          subtitle: empleado.puesto,
          view: 'personal'
        });
      }
    });

    // Buscar en materias primas
    state.materiasPrimas.forEach(materia => {
      if (materia.nombre.toLowerCase().includes(searchTerm) ||
          materia.proveedor.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'materia',
          id: materia.id,
          title: materia.nombre,
          subtitle: `${materia.proveedor} - ${materia.estado}`,
          view: 'inventario'
        });
      }
    });

    // Buscar en productos
    state.productos.forEach(producto => {
      if (producto.nombre.toLowerCase().includes(searchTerm) ||
          producto.categoria.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'producto',
          id: producto.id,
          title: producto.nombre,
          subtitle: `${producto.categoria} - $${producto.precio}`,
          view: 'pos'
        });
      }
    });

    // Buscar en usuarios
    state.users.forEach(user => {
      if (user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'usuario',
          id: user.id,
          title: user.name,
          subtitle: `${user.username} - ${user.role}`,
          view: 'usuarios'
        });
      }
    });

    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results.slice(0, 10) });
  }, [state.empleados, state.materiasPrimas, state.productos, state.users]);

  const toggleSearch = useCallback(() => {
    dispatch({ type: 'TOGGLE_SEARCH' });
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      time: 'Ahora',
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const value = {
    state,
    // Auth
    login,
    logout,
    register, // Nueva función
    // Materias Primas
    updateMateria,
    addMateria,
    deleteMateria,
    // Empleados
    updateEmpleado,
    addEmpleado,
    deleteEmpleado,
    // Usuarios
    updateUser,
    addUser,
    deleteUser,
    // Productos
    updateProducto,
    addProducto,
    deleteProducto,
    // Pedidos
    addPedido,
    updatePedido,
    deletePedido,
    // Transacciones y Ventas
    addTransaccion,
    addVenta,
    // Recetas
    updateReceta,
    addReceta,
    // UI
    setActiveView,
    toggleSidebar,
    toggleDarkMode,
    setSearchQuery,
    performSearch,
    toggleSearch,
    addNotification,
    removeNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}