# 🔗 Guía de Integración Frontend-Backend

## ✅ Completado

1. ✅ **Servicio API creado** (`src/services/api.js`)
2. ✅ **Variables de entorno configuradas** (`.env`)
3. ✅ **Backend funcionando** en puerto 5000
4. ✅ **Frontend funcionando** en puerto 3001

## 🔄 Estado Actual

- **Frontend**: Usa localStorage para datos
- **Backend**: API REST con PostgreSQL funcionando
- **Próximo paso**: Conectar frontend con backend

## 📋 Pasos para Completar la Integración

### **Fase 1: Autenticación (CRÍTICO)**

#### 1.1 Actualizar LoginForm.jsx
- Reemplazar lógica de localStorage con `authAPI.login()`
- Manejar errores de autenticación
- Guardar token JWT

#### 1.2 Actualizar RegisterForm.jsx
- Usar `authAPI.register()` en lugar de crear usuario local
- Manejar validaciones del servidor

#### 1.3 Actualizar AppContext.jsx
- Modificar `LOGIN` action para usar API
- Modificar `REGISTER` action para usar API
- Agregar `LOGOUT` action que llame a `authAPI.logout()`
- Implementar verificación de token al cargar la app

### **Fase 2: Gestión de Datos**

#### 2.1 Empleados (PersonalView.jsx)
- Usar `employeesAPI.getAll()` para listar
- Usar `employeesAPI.create()` para crear
- Usar `employeesAPI.update()` para actualizar
- Usar `employeesAPI.delete()` para eliminar

#### 2.2 Inventario (InventoryGrid.jsx)
- Usar `inventoryAPI.getRawMaterials()` para listar
- Usar `inventoryAPI.createRawMaterial()` para crear
- Usar `inventoryAPI.updateRawMaterial()` para actualizar
- Usar `inventoryAPI.deleteRawMaterial()` para eliminar

#### 2.3 Productos (ProductosView.jsx)
- Usar `productsAPI.getAll()` para listar
- Usar `productsAPI.create()` para crear
- Usar `productsAPI.update()` para actualizar

#### 2.4 Pedidos (PedidosView.jsx)
- Usar `ordersAPI.getAll()` para listar
- Usar `ordersAPI.create()` para crear
- Usar `ordersAPI.update()` para actualizar estado

#### 2.5 Finanzas (FinanzasView.jsx)
- Usar `financesAPI.getTransactions()` para listar
- Usar `financesAPI.createTransaction()` para crear
- Usar `financesAPI.getSummary()` para resumen

#### 2.6 Producción (ProduccionView.jsx)
- Usar `productionAPI.getRecipes()` para recetas
- Usar `productionAPI.getBatches()` para lotes
- Usar `productionAPI.createBatch()` para crear lote

### **Fase 3: Dashboard y Reportes**

#### 3.1 Dashboard.jsx
- Usar `reportsAPI.getDashboard()` para estadísticas
- Mostrar datos en tiempo real de la BD

#### 3.2 ReportesView.jsx
- Usar `reportsAPI.getSales()` para ventas
- Usar `reportsAPI.getInventory()` para inventario
- Usar `reportsAPI.getProduction()` para producción
- Usar `reportsAPI.getFinancial()` para finanzas

## 🎯 Prioridad de Implementación

### **Alta Prioridad (Hacer Primero)**
1. ✅ Servicio API (COMPLETADO)
2. 🔄 Autenticación (LoginForm + RegisterForm)
3. 🔄 AppContext con API
4. 🔄 Manejo de errores global

### **Media Prioridad**
5. Empleados (PersonalView)
6. Inventario (InventoryGrid)
7. Productos (ProductosView)
8. Pedidos (PedidosView)

### **Baja Prioridad**
9. Finanzas (FinanzasView)
10. Producción (ProduccionView)
11. Reportes (ReportesView)
12. Dashboard con datos reales

## 🔧 Cambios Necesarios en AppContext

### Estructura Actual (localStorage)
```javascript
const [state, dispatch] = useReducer(appReducer, initialState);

// Cargar desde localStorage
useEffect(() => {
  const savedData = localStorage.getItem('bakerysoft_data');
  if (savedData) {
    dispatch({ type: 'RESTORE_DATA', payload: JSON.parse(savedData) });
  }
}, []);
```

### Nueva Estructura (API)
```javascript
const [state, dispatch] = useReducer(appReducer, initialState);
const [loading, setLoading] = useState(true);

// Verificar autenticación al cargar
useEffect(() => {
  const initAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const user = await authAPI.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        removeToken();
      }
    }
    setLoading(false);
  };
  
  initAuth();
}, []);
```

## 📝 Ejemplo de Migración: Login

### Antes (localStorage)
```javascript
const handleLogin = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    dispatch({ type: 'LOGIN', payload: user });
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};
```

### Después (API)
```javascript
const handleLogin = async (username, password) => {
  try {
    setLoading(true);
    const { user, token } = await authAPI.login(username, password);
    dispatch({ type: 'LOGIN', payload: user });
  } catch (error) {
    console.error('Error de login:', error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

## 🚨 Consideraciones Importantes

### 1. Manejo de Errores
- Todos los llamados a API deben estar en try-catch
- Mostrar mensajes de error al usuario
- Manejar errores de red (offline)
- Manejar errores 401 (no autorizado)

### 2. Loading States
- Mostrar indicadores de carga durante peticiones
- Deshabilitar botones mientras se procesa
- Feedback visual al usuario

### 3. Validaciones
- Validar en frontend antes de enviar
- Manejar errores de validación del backend
- Mostrar mensajes claros al usuario

### 4. Tokens JWT
- Guardar token en localStorage
- Incluir token en todas las peticiones
- Renovar token antes de expirar
- Limpiar token al cerrar sesión

### 5. Sincronización
- No mezclar datos de localStorage con API
- Eliminar código de localStorage gradualmente
- Mantener consistencia de datos

## 🎯 Próximos Pasos Inmediatos

1. **Actualizar LoginForm.jsx** para usar `authAPI.login()`
2. **Actualizar RegisterForm.jsx** para usar `authAPI.register()`
3. **Modificar AppContext.jsx** para manejar autenticación con API
4. **Probar login/logout** con usuarios de la base de datos
5. **Continuar con otros módulos** uno por uno

## 📚 Recursos

- **Servicio API**: `src/services/api.js`
- **Backend API**: http://localhost:5000
- **Documentación Backend**: `BACKEND_INTEGRATION_COMPLETE.md`
- **Usuarios de prueba**: Ver `BACKEND_INTEGRATION_COMPLETE.md`

---

**Estado**: 🔄 En Progreso  
**Última actualización**: 14 de Enero, 2026
