# 📚 Documentación de Componentes - BakerySoft

Esta documentación describe todos los componentes del sistema BakerySoft, su propósito, props, y cómo utilizarlos.

## 📁 Estructura de Componentes

```
src/components/
├── 🏗️ Layout/                    # Componentes de estructura
│   ├── Layout.jsx                # Layout principal de la aplicación
│   ├── Sidebar.jsx               # Barra lateral de navegación
│   ├── TopHeader.jsx             # Header superior con herramientas
│   └── LoadingScreen.jsx         # Pantalla de carga inicial
│
├── 🔐 Authentication/            # Componentes de autenticación
│   ├── LoginForm.jsx             # Formulario de inicio de sesión
│   ├── RegisterForm.jsx          # Formulario de registro
│   └── UserProfile.jsx           # Perfil y dropdown de usuario
│
├── 📊 Dashboard/                 # Componentes del dashboard
│   ├── Dashboard.jsx             # Dashboard principal
│   ├── StatsCards.jsx            # Tarjetas de estadísticas
│   ├── ChartSection.jsx          # Sección de gráficos
│   └── AlertsSection.jsx         # Alertas y notificaciones
│
├── 📦 Inventory/                 # Componentes de inventario
│   ├── InventoryGrid.jsx         # Grid del inventario
│   ├── CardMateriaPrima.jsx      # Tarjeta de materia prima
│   └── Header.jsx                # Header del inventario
│
├── 🛒 Products/                  # Componentes de productos
│   ├── ProductosView.jsx         # Catálogo de productos (clientes)
│   └── PerfilClienteView.jsx     # Perfil del cliente
│
├── 👥 Management/                # Componentes de gestión
│   ├── PersonalView.jsx          # Gestión de personal
│   ├── FinanzasView.jsx          # Gestión financiera
│   ├── ProduccionView.jsx        # Gestión de producción
│   ├── POSView.jsx               # Punto de venta
│   ├── PedidosView.jsx           # Gestión de pedidos
│   ├── ProveedoresView.jsx       # Gestión de proveedores
│   ├── ReportesView.jsx          # Reportes y análisis
│   └── UsuariosView.jsx          # Gestión de usuarios
│
├── 🔧 Utilities/                 # Componentes utilitarios
│   ├── Logo.jsx                  # Componente del logo
│   ├── ProfileAvatar.jsx         # Avatar de perfil por rol
│   ├── NotificationPanel.jsx     # Panel de notificaciones
│   └── Navbar.jsx                # Navegación legacy
│
├── 🪟 Modals/                    # Componentes modales
│   ├── modals/
│   │   ├── NewEmpleadoModal.jsx  # Modal nuevo empleado
│   │   └── EditEmpleadoModal.jsx # Modal editar empleado
│   ├── EditProfileModal.jsx      # Modal editar perfil
│   ├── SettingsModal.jsx         # Modal de configuración
│   ├── SearchModal.jsx           # Modal de búsqueda
│   ├── HelpModal.jsx             # Modal de ayuda
│   ├── DemoModal.jsx             # Modal de demostración
│   └── DemoTourModal.jsx         # Modal tour completo
│
└── 📱 Responsive/                # Componentes responsive
    └── (Todos los componentes son responsive)
```

---

## 🏗️ Componentes de Layout

### Layout.jsx
**Propósito**: Componente principal que maneja la estructura base de la aplicación.

```jsx
<Layout 
  user={currentUser}           // Usuario actual
  onLogout={handleLogout}      // Función de logout
  activeView={activeView}      // Vista activa actual
  setActiveView={setActiveView} // Función para cambiar vista
>
  {children}                   // Contenido de la vista
</Layout>
```

**Características**:
- ✅ Responsive design completo
- ✅ Sidebar colapsable
- ✅ Header superior con herramientas
- ✅ Overlay para móvil
- ✅ Gestión de estado de UI

### Sidebar.jsx
**Propósito**: Barra lateral de navegación con menú dinámico según permisos.

```jsx
<Sidebar 
  activeView={activeView}      // Vista activa
  setActiveView={setActiveView} // Cambiar vista
  user={user}                  // Usuario para permisos
  isCollapsed={isCollapsed}    // Estado colapsado
  setIsCollapsed={setIsCollapsed} // Toggle colapsar
  isMobile={isMobile}          // Detección móvil
  closeMobileMenu={closeMobileMenu} // Cerrar menú móvil
/>
```

**Características**:
- ✅ Filtrado por permisos de usuario
- ✅ Botones de demostración
- ✅ Toggle tema oscuro/claro
- ✅ Información del usuario
- ✅ Navegación responsive

### TopHeader.jsx
**Propósito**: Header superior con breadcrumbs, búsqueda y herramientas.

```jsx
<TopHeader 
  activeView={activeView}      // Vista actual para breadcrumbs
  user={user}                  // Usuario actual
  onLogout={onLogout}          // Función logout
  onToggleSidebar={onToggleSidebar} // Toggle sidebar
  isMobile={isMobile}          // Detección móvil
/>
```

**Características**:
- ✅ Breadcrumbs dinámicos
- ✅ Búsqueda global
- ✅ Notificaciones con badge
- ✅ Botón demo inteligente
- ✅ Perfil de usuario

---

## 🔐 Componentes de Autenticación

### LoginForm.jsx
**Propósito**: Formulario de inicio de sesión con usuarios demo.

```jsx
<LoginForm 
  onLogin={handleLogin}        // Callback al hacer login
  onSwitchToRegister={switchToRegister} // Cambiar a registro
/>
```

**Características**:
- ✅ Diseño moderno con glassmorphism
- ✅ Usuarios demo con un click
- ✅ Validación de formularios
- ✅ Imagen de fondo personalizada
- ✅ Responsive design

### RegisterForm.jsx
**Propósito**: Formulario de registro en 3 pasos con wizard.

```jsx
<RegisterForm 
  onRegister={handleRegister}  // Callback al registrarse
  onSwitchToLogin={switchToLogin} // Cambiar a login
/>
```

**Características**:
- ✅ Wizard de 3 pasos
- ✅ Selección de avatar
- ✅ Selección de rol con descripciones
- ✅ Validación por pasos
- ✅ Resumen final

### UserProfile.jsx
**Propósito**: Dropdown de perfil con información y acciones.

```jsx
<UserProfile 
  user={user}                  // Usuario actual
  onLogout={onLogout}          // Función logout
/>
```

**Características**:
- ✅ Información detallada del usuario
- ✅ Cambio de rol sin logout
- ✅ Edición de perfil
- ✅ Modal de ayuda
- ✅ Permisos visuales

---

## 📊 Componentes de Dashboard

### Dashboard.jsx
**Propósito**: Dashboard principal con métricas y visualizaciones.

```jsx
<Dashboard 
  user={user}                  // Usuario para personalización
/>
```

**Características**:
- ✅ Dashboard específico por rol
- ✅ Banner de bienvenida
- ✅ Tour de demostración
- ✅ Métricas en tiempo real
- ✅ Dashboard cliente separado

### StatsCards.jsx
**Propósito**: Tarjetas de estadísticas con métricas clave.

```jsx
<StatsCards 
  stats={statsData}            // Datos de estadísticas
/>
```

**Datos esperados**:
```javascript
{
  total: 15,                   // Total productos
  optimo: 8,                   // Productos óptimos
  bajo: 4,                     // Productos bajo stock
  critico: 3,                  // Productos críticos
  porcentajeOptimo: 53,        // Porcentaje óptimo
  porcentajeBajo: 27,          // Porcentaje bajo
  porcentajeCritico: 20,       // Porcentaje crítico
  valorInventario: 1250.50     // Valor total
}
```

### ChartSection.jsx
**Propósito**: Sección de gráficos y visualizaciones de datos.

```jsx
<ChartSection 
  data={statsData}             // Datos para gráficos
/>
```

**Características**:
- ✅ Gráficos de barras animados
- ✅ Toggle entre vistas
- ✅ Distribución por estado
- ✅ Análisis de proveedores

### AlertsSection.jsx
**Propósito**: Sección de alertas y productos críticos.

```jsx
<AlertsSection 
  productosUrgentes={urgentes} // Productos que necesitan atención
  productosOptimos={optimos}   // Productos en buen estado
/>
```

**Características**:
- ✅ Alertas por prioridad
- ✅ Barras de progreso
- ✅ Acciones rápidas
- ✅ Toggle entre vistas

---

## 📦 Componentes de Inventario

### InventoryGrid.jsx
**Propósito**: Grid principal del inventario con filtros.

```jsx
<InventoryGrid />
```

**Características**:
- ✅ Filtrado por estado
- ✅ Búsqueda en tiempo real
- ✅ Grid responsive
- ✅ Estados visuales

### CardMateriaPrima.jsx
**Propósito**: Tarjeta individual de materia prima.

```jsx
<CardMateriaPrima 
  materia={materiaData}        // Datos de la materia prima
/>
```

**Datos esperados**:
```javascript
{
  id: 1,
  nombre: "Harina de Trigo",
  cantidad: 45,
  unidad: "kg",
  minimo: 20,
  maximo: 100,
  estado: "Óptimo",           // "Óptimo", "Bajo", "Crítico"
  proveedor: "Molinos SA",
  fechaVencimiento: "2024-06-15",
  ubicacion: "Almacén A-1"
}
```

---

## 🛒 Componentes de Productos

### ProductosView.jsx
**Propósito**: Catálogo de productos para clientes con carrito.

```jsx
<ProductosView />
```

**Características**:
- ✅ Catálogo completo de productos
- ✅ Filtros por categoría
- ✅ Búsqueda de productos
- ✅ Carrito de compras funcional
- ✅ Modal de carrito
- ✅ Procesamiento de pedidos

### PerfilClienteView.jsx
**Propósito**: Perfil personalizado para clientes.

```jsx
<PerfilClienteView />
```

**Características**:
- ✅ Información personal editable
- ✅ Historial de pedidos
- ✅ Sistema de puntos
- ✅ Preferencias del cliente
- ✅ Estadísticas de compra

---

## 👥 Componentes de Gestión

### PersonalView.jsx
**Propósito**: Gestión de empleados y recursos humanos.

```jsx
<PersonalView />
```

**Características**:
- ✅ Lista de empleados
- ✅ CRUD completo
- ✅ Filtros y búsqueda
- ✅ Modales de edición

### PedidosView.jsx
**Propósito**: Gestión completa de pedidos.

```jsx
<PedidosView />
```

**Características**:
- ✅ Estados de pedidos
- ✅ Filtrado avanzado
- ✅ Acciones por pedido
- ✅ Historial completo

### POSView.jsx
**Propósito**: Punto de venta integrado.

```jsx
<POSView />
```

**Características**:
- ✅ Interfaz de venta
- ✅ Cálculo automático
- ✅ Métodos de pago
- ✅ Impresión de tickets

---

## 🔧 Componentes Utilitarios

### Logo.jsx
**Propósito**: Componente reutilizable del logo con diferentes tamaños.

```jsx
<Logo 
  size="sm"                    // "sm", "md", "lg", "xl", "2xl"
  className="custom-class"     // Clases adicionales
/>
```

### ProfileAvatar.jsx
**Propósito**: Avatar de perfil específico por rol.

```jsx
<ProfileAvatar 
  user={user}                  // Usuario con rol
  size="md"                    // Tamaño del avatar
/>
```

### NotificationPanel.jsx
**Propósito**: Panel de notificaciones del sistema.

```jsx
<NotificationPanel />
```

**Características**:
- ✅ Notificaciones en tiempo real
- ✅ Diferentes tipos de alerta
- ✅ Acciones por notificación
- ✅ Auto-dismiss

---

## 🪟 Componentes Modales

### Modales Principales
Todos los modales siguen el mismo patrón:

```jsx
<Modal 
  onClose={handleClose}        // Función para cerrar
  // Props específicos del modal
/>
```

**Modales disponibles**:
- `EditProfileModal` - Edición de perfil
- `SettingsModal` - Configuración del sistema
- `SearchModal` - Búsqueda global
- `HelpModal` - Sistema de ayuda
- `DemoModal` - Demostraciones por sección
- `DemoTourModal` - Tour completo del sistema

---

## 📱 Responsive Design

### Breakpoints del Sistema
```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

### Comportamiento Responsive
- **Mobile**: Sidebar como overlay, grids de 1 columna
- **Tablet**: Sidebar colapsable, grids de 2 columnas
- **Desktop**: Layout completo, grids de 3-4 columnas

---

## 🎨 Sistema de Temas

### Colores del Sistema
```css
/* Estados de inventario */
--status-optimal: #10b981    /* Verde */
--status-low: #f59e0b        /* Amarillo */
--status-critical: #ef4444   /* Rojo */

/* Colores principales */
--bakery-primary: #f59e0b    /* Amber-500 */
--bakery-secondary: #ef4444  /* Red-500 */
```

### Modo Oscuro
Todos los componentes soportan modo oscuro automático usando:
- `dark:` prefijos de Tailwind
- Variables CSS adaptativas
- Detección automática de preferencias

---

## 🔄 Estado Global

### Context API
El sistema usa Context API para:
- **AppContext**: Estado global de la aplicación
- **NotificationContext**: Sistema de notificaciones
- **UI State**: Estado de la interfaz (tema, sidebar, etc.)

### Hooks Personalizados
- `useApp()`: Acceso al estado global
- `useUI()`: Estado de la interfaz
- `useNotifications()`: Sistema de notificaciones
- `useNotificationSystem()`: Notificaciones avanzadas

---

## 🚀 Mejores Prácticas

### Desarrollo de Componentes
1. **Usar TypeScript** para props (futuro)
2. **Documentar props** con JSDoc
3. **Responsive first** design
4. **Accesibilidad** con ARIA labels
5. **Performance** con React.memo cuando sea necesario

### Estilos
1. **Tailwind CSS** como framework principal
2. **CSS Modules** para estilos específicos
3. **Variables CSS** para temas
4. **Mobile first** approach

### Testing
1. **Unit tests** para lógica de negocio
2. **Integration tests** para flujos completos
3. **E2E tests** para casos críticos
4. **Accessibility tests** para inclusión

---

## 📖 Recursos Adicionales

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Performance Best Practices](https://web.dev/performance/)

---

*Documentación actualizada: Enero 2024*
*Versión: 1.0.0*