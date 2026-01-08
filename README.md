# 🍞 BakerySoft - Sistema de Gestión para Panaderías

<div align="center">
  <img src="./public/img/Logo.png" alt="BakerySoft Logo" width="120" height="120">
  
  **Sistema completo de gestión para panaderías con interfaz moderna y funcionalidades avanzadas**
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.21-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 📋 Descripción

BakerySoft es un sistema integral de gestión diseñado específicamente para panaderías y negocios de repostería. Ofrece una solución completa que abarca desde la gestión de inventario hasta el punto de venta, con una interfaz moderna y fácil de usar.

## ✨ Características Principales

### 🏪 **Gestión Completa**
- **Dashboard Inteligente**: Resumen ejecutivo con métricas en tiempo real
- **Inventario Avanzado**: Control de materias primas con alertas automáticas
- **Punto de Venta (POS)**: Sistema de ventas integrado y eficiente
- **Gestión de Pedidos**: Seguimiento completo del ciclo de pedidos
- **Control de Producción**: Planificación y seguimiento de recetas

### 👥 **Sistema de Usuarios Multi-Rol**
- **Administrador**: Acceso completo al sistema
- **Gerente**: Gestión operativa y reportes
- **Supervisor**: Control de producción y personal
- **Empleado**: Operaciones básicas de POS e inventario
- **Cliente**: Catálogo de productos y gestión de pedidos

### 🛒 **Experiencia del Cliente**
- **Catálogo Interactivo**: Navegación intuitiva de productos
- **Carrito de Compras**: Sistema completo con gestión de cantidades
- **Perfil Personalizado**: Historial de pedidos y preferencias
- **Sistema de Puntos**: Programa de fidelización integrado
- **Ofertas Especiales**: Promociones y descuentos dinámicos

### 🎨 **Interfaz Moderna**
- **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **Tema Oscuro/Claro**: Alternancia automática según preferencias
- **Notificaciones Inteligentes**: Sistema de alertas contextual
- **Navegación Intuitiva**: UX/UI diseñado para eficiencia

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/chaustrexp/BakerySoft.git
   cd BakerySoft
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 👤 Usuarios de Demostración

El sistema incluye usuarios predefinidos para testing:

| Rol | Usuario | Contraseña | Descripción |
|-----|---------|------------|-------------|
| 👑 Administrador | `admin` | `admin123` | Acceso completo al sistema |
| 💼 Gerente | `manager` | `manager123` | Gestión operativa y reportes |
| 👨‍💼 Supervisor | `supervisor` | `supervisor123` | Control de producción y personal |
| 👤 Empleado | `empleado` | `empleado123` | Operaciones básicas |
| 🛒 Cliente | `cliente` | `cliente123` | Experiencia de compra |

## 📱 Funcionalidades por Módulo

### 📊 **Dashboard**
- Métricas de inventario en tiempo real
- Gráficos de estado de productos
- Alertas de stock crítico
- Resumen de proveedores activos
- Dashboard específico para clientes

### 📦 **Inventario**
- Control de materias primas
- Estados automáticos (Óptimo, Bajo, Crítico)
- Gestión de proveedores
- Alertas de reposición
- Historial de movimientos

### 🏭 **Producción**
- Planificación de recetas
- Control de tiempos de producción
- Gestión de lotes
- Seguimiento de calidad

### 💰 **Finanzas**
- Control de costos
- Análisis de rentabilidad
- Reportes financieros
- Gestión de gastos

### 👥 **Personal**
- Gestión de empleados
- Control de horarios
- Asignación de roles
- Historial laboral

### 🛒 **Punto de Venta**
- Interfaz de venta rápida
- Gestión de productos
- Procesamiento de pagos
- Impresión de tickets

### 📋 **Pedidos**
- Gestión completa de pedidos
- Estados de seguimiento
- Notificaciones automáticas
- Historial de clientes

### 📈 **Reportes**
- Reportes de ventas
- Análisis de inventario
- Métricas de producción
- Exportación de datos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2.0**: Biblioteca principal de UI
- **Vite 5.4.21**: Herramienta de build y desarrollo
- **Tailwind CSS 3.4.1**: Framework de CSS utilitario
- **React Hooks**: Gestión de estado moderno
- **Context API**: Estado global de la aplicación

### Características Técnicas
- **Responsive Design**: Adaptable a todos los dispositivos
- **Dark Mode**: Tema oscuro/claro automático
- **Local Storage**: Persistencia de datos local
- **Component Architecture**: Arquitectura modular y reutilizable
- **Modern JavaScript**: ES6+ y características modernas

## 📁 Estructura del Proyecto

```
BakerySoft/
├── public/
│   └── img/                    # Imágenes y assets estáticos
├── src/
│   ├── components/             # Componentes React
│   │   ├── modals/            # Modales del sistema
│   │   ├── Dashboard.jsx      # Dashboard principal
│   │   ├── LoginForm.jsx      # Formulario de login
│   │   ├── ProductosView.jsx  # Catálogo de productos
│   │   └── ...
│   ├── context/               # Context API
│   │   ├── AppContext.jsx     # Estado global
│   │   └── NotificationContext.jsx
│   ├── data/                  # Datos simulados
│   │   ├── users.js           # Usuarios del sistema
│   │   ├── productos.js       # Catálogo de productos
│   │   └── ...
│   ├── hooks/                 # Custom hooks
│   └── main.jsx              # Punto de entrada
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Roadmap

### Versión Actual (v1.0)
- ✅ Sistema multi-rol completo
- ✅ Gestión de inventario
- ✅ Punto de venta básico
- ✅ Dashboard interactivo
- ✅ Experiencia del cliente

### Próximas Versiones
- 🔄 Integración con APIs externas
- 🔄 Sistema de reportes avanzado
- 🔄 Módulo de contabilidad
- 🔄 App móvil nativa
- 🔄 Integración con sistemas de pago

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**BakerySoft Team**
- GitHub: [@chaustrexp](https://github.com/chaustrexp)

## 📞 Soporte

Si tienes preguntas o necesitas soporte:
- 📧 Email: support@bakerysoft.com
- 🐛 Issues: [GitHub Issues](https://github.com/chaustrexp/BakerySoft/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/chaustrexp/BakerySoft/wiki)

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad de panaderos</p>
  <p>© 2024 BakerySoft. Todos los derechos reservados.</p>
</div>