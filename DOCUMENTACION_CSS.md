# 🎨 Documentación CSS - BakerySoft

Esta documentación describe la arquitectura CSS del sistema BakerySoft, incluyendo la organización de archivos, convenciones de nomenclatura y mejores prácticas.

## 📁 Estructura de Archivos CSS

```
src/styles/
├── 📄 main.css                    # Archivo principal que importa todos los estilos
├── 📄 base.css                    # Variables CSS, animaciones y utilidades base
└── components/                    # Estilos específicos por componente
    ├── 📄 layout.css              # Layout, Sidebar, TopHeader
    ├── 📄 dashboard.css           # Dashboard, StatsCards, ChartSection
    ├── 📄 forms.css               # LoginForm, RegisterForm, Modales
    └── 📄 inventory.css           # InventoryGrid, ProductosView, Carrito
```

## 🎯 Filosofía de Diseño

### Principios Fundamentales
1. **Mobile First**: Diseño responsive que prioriza dispositivos móviles
2. **Utility First**: Uso de Tailwind CSS como framework principal
3. **Component Scoped**: Estilos organizados por componente
4. **Accessibility First**: Diseño inclusivo y accesible
5. **Performance Oriented**: Optimización para rendimiento

### Metodología CSS
- **Tailwind CSS**: Framework principal para estilos utilitarios
- **CSS Custom Properties**: Variables para temas y personalización
- **BEM-like**: Nomenclatura clara y descriptiva para clases personalizadas
- **Mobile First**: Media queries desde móvil hacia desktop

## 🎨 Sistema de Colores

### Paleta Principal
```css
:root {
  /* Colores principales del sistema */
  --bakery-primary: #f59e0b;      /* Amber-500 - Color principal */
  --bakery-primary-dark: #d97706;  /* Amber-600 - Hover states */
  --bakery-secondary: #ef4444;     /* Red-500 - Alertas críticas */
  --bakery-success: #10b981;       /* Emerald-500 - Estados exitosos */
  --bakery-warning: #f59e0b;       /* Amber-500 - Advertencias */
  --bakery-info: #3b82f6;          /* Blue-500 - Información */
}
```

### Estados de Inventario
```css
/* Colores de estado de inventario */
--status-optimal: #10b981;       /* Verde - Stock óptimo */
--status-low: #f59e0b;           /* Amarillo - Stock bajo */
--status-critical: #ef4444;      /* Rojo - Stock crítico */
```

### Modo Oscuro
El sistema soporta modo oscuro automático usando:
- Variables CSS adaptativas
- Clases `dark:` de Tailwind CSS
- Detección de preferencias del sistema

## 📐 Sistema de Espaciado

### Espaciado Estándar
```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
}
```

### Bordes y Radios
```css
:root {
  --border-radius: 0.5rem;         /* 8px - Radio base */
  --border-radius-lg: 0.75rem;     /* 12px - Radio grande */
  --border-radius-xl: 1rem;        /* 16px - Radio extra grande */
}
```

## 🎭 Animaciones y Transiciones

### Animaciones Personalizadas
```css
/* Animación de aparición suave */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Animación de blob para elementos decorativos */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

### Clases de Animación
```css
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-in-left { animation: slideInLeft 0.3s ease-out; }
.animate-pulse-slow { animation: pulse 2s infinite; }
.animate-blob { animation: blob 7s infinite; }
```

### Transiciones del Sistema
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
}
```

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

### Estrategia Mobile First
1. **Base**: Estilos para móvil (sin media query)
2. **Tablet**: Ajustes para pantallas medianas
3. **Desktop**: Layout completo para pantallas grandes
4. **Large**: Optimizaciones para pantallas extra grandes

## 🏗️ Arquitectura de Componentes

### Layout Components (layout.css)
```css
/* Sidebar */
.sidebar-container { /* Contenedor principal */ }
.sidebar-nav-button { /* Botones de navegación */ }
.sidebar-user-info { /* Información del usuario */ }

/* TopHeader */
.top-header-container { /* Header superior */ }
.top-header-breadcrumbs { /* Breadcrumbs */ }
.top-header-notifications { /* Notificaciones */ }
```

### Dashboard Components (dashboard.css)
```css
/* Dashboard */
.dashboard-container { /* Contenedor principal */ }
.welcome-banner { /* Banner de bienvenida */ }
.stats-cards-container { /* Grid de estadísticas */ }

/* Stats Cards */
.stats-card { /* Tarjeta individual */ }
.stats-card-progress { /* Barra de progreso */ }
```

### Form Components (forms.css)
```css
/* Authentication Forms */
.auth-form-container { /* Contenedor de formularios */ }
.login-form-card { /* Tarjeta de login */ }
.register-form-card { /* Tarjeta de registro */ }

/* Form Elements */
.form-input { /* Campos de entrada */ }
.form-button { /* Botones de formulario */ }
.form-error { /* Mensajes de error */ }
```

### Inventory Components (inventory.css)
```css
/* Inventory Grid */
.inventory-container { /* Contenedor principal */ }
.inventory-grid { /* Grid de productos */ }
.materia-card { /* Tarjeta de materia prima */ }

/* Product Catalog */
.productos-container { /* Catálogo de productos */ }
.producto-card { /* Tarjeta de producto */ }
.cart-modal { /* Modal del carrito */ }
```

## 🎪 Efectos Visuales

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

### Glassmorphism Effects
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### Loading States
```css
.loading::after {
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: loading-shimmer 1.5s infinite;
}
```

## ♿ Accesibilidad

### Focus Management
```css
:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 🖨️ Print Styles

### Print Optimizations
```css
@media print {
  .no-print { display: none !important; }
  .print-break-before { page-break-before: always; }
  .print-break-after { page-break-after: always; }
  
  body {
    background: white !important;
    color: black !important;
  }
}
```

## 🔧 Utilidades Personalizadas

### Text Utilities
```css
.text-balance { text-wrap: balance; }
.text-pretty { text-wrap: pretty; }
.line-clamp-2 { -webkit-line-clamp: 2; }
```

### Layout Utilities
```css
.min-h-screen-safe {
  min-height: 100vh;
  min-height: 100dvh; /* Soporte para navegadores modernos */
}
```

### Scrollbar Customization
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
```

## 📋 Convenciones de Nomenclatura

### Clases de Componente
```css
/* Patrón: .component-element-modifier */
.sidebar-nav-button          /* Elemento base */
.sidebar-nav-button.active   /* Modificador de estado */
.sidebar-nav-icon           /* Sub-elemento */
```

### Estados y Variantes
```css
/* Estados */
.active, .inactive, .disabled, .loading

/* Variantes de tamaño */
.sm, .md, .lg, .xl, .2xl

/* Variantes de color */
.primary, .secondary, .success, .warning, .error
```

### Responsive Suffixes
```css
/* Siguiendo convención de Tailwind */
.hide-mobile     /* Ocultar en móvil */
.hide-tablet     /* Ocultar en tablet */
.hide-desktop    /* Ocultar en desktop */
```

## 🚀 Optimización de Rendimiento

### CSS Optimization
1. **Critical CSS**: Estilos críticos inline en HTML
2. **CSS Purging**: Eliminación de CSS no utilizado con Tailwind
3. **Minification**: Compresión de archivos CSS en producción
4. **Caching**: Headers de cache para archivos CSS

### Animation Performance
```css
/* Usar transform y opacity para animaciones suaves */
.will-change-transform { will-change: transform; }
.will-change-opacity { will-change: opacity; }

/* Evitar animaciones costosas */
/* ❌ Malo: animar width, height, top, left */
/* ✅ Bueno: animar transform, opacity */
```

## 🔄 Mantenimiento

### Actualización de Estilos
1. **Modificar variables CSS** en `base.css` para cambios globales
2. **Actualizar componentes** en archivos específicos
3. **Probar responsive** en todos los breakpoints
4. **Validar accesibilidad** con herramientas de testing

### Debugging CSS
```css
/* Utilidades de debugging (solo desarrollo) */
.debug-red { border: 1px solid red !important; }
.debug-blue { border: 1px solid blue !important; }
.debug-grid { background-image: linear-gradient(...); }
```

## 📚 Recursos y Referencias

### Documentación
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Herramientas
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [PostCSS](https://postcss.org/)
- [Autoprefixer](https://autoprefixer.github.io/)

### Testing
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

## 🎯 Mejores Prácticas

### Do's ✅
- Usar Tailwind CSS para la mayoría de estilos
- Crear variables CSS para valores reutilizables
- Seguir mobile-first approach
- Documentar clases personalizadas
- Probar en múltiples dispositivos
- Validar accesibilidad

### Don'ts ❌
- No usar `!important` innecesariamente
- No crear estilos inline en JSX
- No ignorar el modo oscuro
- No usar animaciones costosas
- No olvidar el responsive design
- No ignorar la accesibilidad

---

*Documentación CSS actualizada: Enero 2024*
*Versión: 1.0.0*