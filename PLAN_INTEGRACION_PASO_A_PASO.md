# 🚀 PLAN DE INTEGRACIÓN PASO A PASO - BAKERYSOFT

## OBJETIVO
Convertir BakerySoft de una aplicación con datos simulados a un sistema completamente funcional y operativo.

---

## FASE 1: PREPARACIÓN (Días 1-3)

### 1.1 Crear Sistema de Estado Global con Context API

**Archivo**: `src/context/AppContext.jsx`

```javascript
import React, { createContext, useReducer, useCallback } from 'react';
import { users, materiasPrimas, productos, empleados, transacciones, ventas } from '../data';

export const AppContext = createContext();

const initialState = {
  // Autenticación
  currentUser: null,
  isAuthenticated: false,
  
  // Datos
  users: users,
  materiasPrimas: materiasPrimas,
  productos: productos,
  empleados: empleados,
  transacciones: transacciones,
  ventas: ventas,
  
  // UI
  activeView: 'dashboard',
  sidebarCollapsed: false,
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    // Autenticación
    case 'LOGIN':
      return { ...state, currentUser: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false };
    
    // Inventario
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
    
    // UI
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = useCallback((user) => {
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateMateria = useCallback((materia) => {
    dispatch({ type: 'UPDATE_MATERIA', payload: materia });
  }, []);

  const addMateria = useCallback((materia) => {
    dispatch({ type: 'ADD_MATERIA', payload: materia });
  }, []);

  const updateEmpleado = useCallback((empleado) => {
    dispatch({ type: 'UPDATE_EMPLEADO', payload: empleado });
  }, []);

  const addEmpleado = useCallback((empleado) => {
    dispatch({ type: 'ADD_EMPLEADO', payload: empleado });
  }, []);

  const addTransaccion = useCallback((transaccion) => {
    dispatch({ type: 'ADD_TRANSACCION', payload: transaccion });
  }, []);

  const addVenta = useCallback((venta) => {
    dispatch({ type: 'ADD_VENTA', payload: venta });
  }, []);

  const setActiveView = useCallback((view) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);

  const value = {
    state,
    login,
    logout,
    updateMateria,
    addMateria,
    updateEmpleado,
    addEmpleado,
    addTransaccion,
    addVenta,
    setActiveView,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

### 1.2 Crear Hook Personalizado para usar Context

**Archivo**: `src/hooks/useApp.js`

```javascript
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}
```

### 1.3 Actualizar App.jsx para usar Context

```javascript
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      {/* Resto de la aplicación */}
    </AppProvider>
  );
}
```

---

## FASE 2: CONECTAR COMPONENTES (Días 4-7)

### 2.1 Actualizar Dashboard.jsx

```javascript
import { useApp } from '../hooks/useApp';

const Dashboard = ({ user }) => {
  const { state } = useApp();
  const { materiasPrimas } = state;

  // Usar materiasPrimas del context en lugar de importar directamente
  const totalProductos = materiasPrimas.length;
  const productosOptimos = materiasPrimas.filter(m => m.estado === 'Óptimo');
  // ... resto del código
};
```

### 2.2 Actualizar InventoryGrid.jsx

```javascript
import { useApp } from '../hooks/useApp';

const InventoryGrid = () => {
  const { state } = useApp();
  const { materiasPrimas } = state;

  // Usar materiasPrimas del context
  const materiasFiltradas = filtroEstado === 'Todos' 
    ? materiasPrimas 
    : materiasPrimas.filter(materia => materia.estado === filtroEstado);
  
  // ... resto del código
};
```

### 2.3 Actualizar POSView.jsx

```javascript
import { useApp } from '../hooks/useApp';

const POSView = () => {
  const { state, addVenta } = useApp();
  const { productos } = state;

  const procesarVenta = () => {
    const venta = {
      fecha: new Date().toISOString(),
      productos: carrito,
      total,
      metodoPago,
    };
    addVenta(venta);
    setCarrito([]);
  };
  
  // ... resto del código
};
```

### 2.4 Actualizar PersonalView.jsx

```javascript
import { useApp } from '../hooks/useApp';

const PersonalView = () => {
  const { state, updateEmpleado, addEmpleado } = useApp();
  const { empleados } = state;

  // Usar empleados del context
  // ... resto del código
};
```

---

## FASE 3: IMPLEMENTAR CRUD (Días 8-14)

### 3.1 Crear Modal de Edición de Empleado

**Archivo**: `src/components/personal/EditEmpleadoModal.jsx`

```javascript
import { useState } from 'react';
import { useApp } from '../../hooks/useApp';

export function EditEmpleadoModal({ empleado, onClose }) {
  const { updateEmpleado } = useApp();
  const [formData, setFormData] = useState(empleado);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmpleado(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Editar Empleado</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                placeholder="Puesto"
                value={formData.puesto}
                onChange={(e) => setFormData({...formData, puesto: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="number"
                placeholder="Salario"
                value={formData.salario}
                onChange={(e) => setFormData({...formData, salario: Number(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Crear Modal de Nuevo Empleado

**Archivo**: `src/components/personal/NewEmpleadoModal.jsx`

```javascript
import { useState } from 'react';
import { useApp } from '../../hooks/useApp';

export function NewEmpleadoModal({ onClose }) {
  const { addEmpleado, state } = useApp();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    puesto: '',
    departamento: '',
    salario: 0,
    estado: 'activo',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmpleado = {
      id: state.empleados.length + 1,
      codigo: `EMP-${String(state.empleados.length + 1).padStart(3, '0')}`,
      ...formData,
      fechaIngreso: new Date().toISOString(),
      avatar: '👤',
    };
    addEmpleado(newEmpleado);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Empleado</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Crear Empleado
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### 3.3 Actualizar PersonalView para usar Modales

```javascript
import { useState } from 'react';
import { EditEmpleadoModal } from './EditEmpleadoModal';
import { NewEmpleadoModal } from './NewEmpleadoModal';

const PersonalView = () => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  return (
    <div>
      {/* Botón para nuevo empleado */}
      <button onClick={() => setShowNewModal(true)}>
        Nuevo Empleado
      </button>

      {/* Modales */}
      {showNewModal && (
        <NewEmpleadoModal onClose={() => setShowNewModal(false)} />
      )}
      
      {selectedEmpleado && (
        <EditEmpleadoModal
          empleado={selectedEmpleado}
          onClose={() => setSelectedEmpleado(null)}
        />
      )}

      {/* Botón de edición en tarjeta */}
      <button onClick={() => setSelectedEmpleado(empleado)}>
        Editar
      </button>
    </div>
  );
};
```

---

## FASE 4: COMPLETAR PEDIDOS (Días 15-17)

### 4.1 Crear Estructura de Datos para Pedidos

**Archivo**: `src/data/pedidos.js`

```javascript
export const pedidos = [
  {
    id: 1,
    fecha: "2024-01-07",
    proveedor: "Molinos San Juan",
    productos: [
      { materiaId: 1, cantidad: 50, unidad: "kg", precioUnitario: 2.50 }
    ],
    total: 125.00,
    estado: "entregado",
    fechaEntrega: "2024-01-08"
  }
];
```

### 4.2 Implementar PedidosView Completo

```javascript
import { useState } from 'react';
import { useApp } from '../hooks/useApp';

const PedidosView = () => {
  const { state, addPedido } = useApp();
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const pedidosFiltrados = filtroEstado === 'todos'
    ? state.pedidos
    : state.pedidos.filter(p => p.estado === filtroEstado);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
        <button
          onClick={() => setShowNewPedido(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Nuevo Pedido
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 mb-6">
        {['todos', 'pendiente', 'en_proceso', 'entregado'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroEstado === estado
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pedido.proveedor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${pedido.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                    pedido.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-amber-600 hover:text-amber-700 mr-3">
                    Ver
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de nuevo pedido */}
      {showNewPedido && (
        <NewPedidoModal onClose={() => setShowNewPedido(false)} />
      )}
    </div>
  );
};
```

---

## FASE 5: PERSISTENCIA DE DATOS (Días 18-21)

### 5.1 Crear Utilidad de localStorage

**Archivo**: `src/utils/storage.js`

```javascript
const STORAGE_KEY = 'bakerysoft_data';

export const storage = {
  save: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
```

### 5.2 Integrar localStorage en AppContext

```javascript
import { storage } from '../utils/storage';

export function AppProvider({ children }) {
  // Cargar datos guardados
  const savedData = storage.load();
  
  const initialState = {
    ...defaultState,
    ...savedData
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Guardar datos cuando cambien
  useEffect(() => {
    storage.save(state);
  }, [state]);

  // ... resto del código
}
```

---

## FASE 6: VALIDACIÓN Y TESTING (Días 22-24)

### 6.1 Crear Validadores

**Archivo**: `src/utils/validators.js`

```javascript
export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  phone: (phone) => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone) && phone.length >= 10;
  },

  salary: (salary) => {
    return salary > 0;
  },

  required: (value) => {
    return value && value.trim().length > 0;
  }
};
```

### 6.2 Usar Validadores en Formularios

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Validar
  if (!validators.required(formData.nombre)) {
    alert('El nombre es requerido');
    return;
  }
  
  if (!validators.email(formData.email)) {
    alert('Email inválido');
    return;
  }
  
  if (!validators.salary(formData.salario)) {
    alert('El salario debe ser mayor a 0');
    return;
  }
  
  // Guardar
  updateEmpleado(formData);
  onClose();
};
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### Semana 1
- [ ] Crear AppContext y AppProvider
- [ ] Crear hook useApp
- [ ] Actualizar App.jsx para usar Context
- [ ] Conectar Dashboard con Context
- [ ] Conectar InventoryGrid con Context

### Semana 2
- [ ] Conectar POSView con Context
- [ ] Conectar PersonalView con Context
- [ ] Conectar FinanzasView con Context
- [ ] Crear EditEmpleadoModal
- [ ] Crear NewEmpleadoModal

### Semana 3
- [ ] Crear EditUsuarioModal
- [ ] Crear NewUsuarioModal
- [ ] Crear EditProductoModal
- [ ] Crear NewProductoModal
- [ ] Crear EditRecetaModal

### Semana 4
- [ ] Implementar PedidosView completo
- [ ] Crear NewPedidoModal
- [ ] Crear EditPedidoModal
- [ ] Implementar búsqueda global
- [ ] Agregar validaciones

### Semana 5
- [ ] Implementar localStorage
- [ ] Probar persistencia de datos
- [ ] Crear utilidades de validación
- [ ] Agregar manejo de errores
- [ ] Crear notificaciones

### Semana 6
- [ ] Agregar tests unitarios
- [ ] Optimizar performance
- [ ] Mejorar seguridad
- [ ] Pulir UI/UX
- [ ] Documentar código

---

## COMANDOS ÚTILES

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Testing (cuando se agregue)
npm run test
```

---

## PRÓXIMOS PASOS DESPUÉS DE COMPLETAR

1. **Agregar Backend API**
   - Crear servidor Express.js
   - Implementar endpoints CRUD
   - Conectar con base de datos

2. **Mejorar Gráficos**
   - Instalar Recharts
   - Reemplazar gráficos simples
   - Agregar más visualizaciones

3. **Exportación de Reportes**
   - Instalar jsPDF y xlsx
   - Implementar exportación a PDF
   - Implementar exportación a Excel

4. **Autenticación Avanzada**
   - Implementar JWT
   - Agregar 2FA
   - Mejorar seguridad

5. **Modo Oscuro**
   - Agregar toggle
   - Persistir preferencia
   - Aplicar a todos los componentes

---

**Documento generado**: 2024-01-07
**Versión**: 1.0
**Estado**: Plan Detallado
