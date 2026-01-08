import { useState } from 'react';

const DemoModal = ({ section, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoData = {
    dashboard: {
      title: 'Dashboard - Panel Principal',
      icon: '🏠',
      description: 'Centro de control con resumen general del negocio',
      steps: [
        {
          title: 'Vista General',
          content: 'El dashboard muestra métricas clave como ventas del día, productos más vendidos, alertas de inventario y estado general del negocio.',
          features: ['Ventas en tiempo real', 'Gráficos de rendimiento', 'Alertas importantes', 'Resumen financiero']
        },
        {
          title: 'Métricas Principales',
          content: 'Visualiza KPIs importantes como ingresos diarios, productos críticos en inventario, empleados activos y pedidos pendientes.',
          features: ['Ingresos del día: $2,450', 'Productos vendidos: 156', 'Stock crítico: 3 items', 'Empleados activos: 8']
        },
        {
          title: 'Gráficos y Análisis',
          content: 'Gráficos interactivos muestran tendencias de ventas, productos más populares y análisis de rendimiento.',
          features: ['Gráfico de ventas semanales', 'Top 5 productos', 'Análisis de horarios pico', 'Comparativa mensual']
        }
      ]
    },
    pos: {
      title: 'Punto de Venta (POS)',
      icon: '🛒',
      description: 'Sistema completo de ventas y facturación',
      steps: [
        {
          title: 'Interfaz de Venta',
          content: 'Sistema intuitivo para procesar ventas rápidamente con catálogo de productos, cálculo automático y múltiples métodos de pago.',
          features: ['Catálogo visual de productos', 'Cálculo automático de totales', 'Aplicación de descuentos', 'Múltiples métodos de pago']
        },
        {
          title: 'Procesamiento de Pagos',
          content: 'Acepta efectivo, tarjetas y pagos digitales. Genera recibos automáticamente y actualiza inventario en tiempo real.',
          features: ['Efectivo y cambio automático', 'Pagos con tarjeta', 'Códigos QR y pagos móviles', 'Recibos digitales/impresos']
        },
        {
          title: 'Historial y Reportes',
          content: 'Registro completo de todas las transacciones con búsqueda avanzada y reportes de ventas detallados.',
          features: ['Historial de ventas', 'Búsqueda por fecha/cliente', 'Reportes de cajero', 'Análisis de productos']
        }
      ]
    },
    inventario: {
      title: 'Gestión de Inventario',
      icon: '📦',
      description: 'Control completo de materias primas y stock',
      steps: [
        {
          title: 'Control de Stock',
          content: 'Monitoreo en tiempo real de todas las materias primas con alertas automáticas cuando el stock está bajo o crítico.',
          features: ['Vista de todas las materias primas', 'Estados: Óptimo/Bajo/Crítico', 'Fechas de vencimiento', 'Alertas automáticas']
        },
        {
          title: 'Gestión de Productos',
          content: 'Agregar, editar y eliminar materias primas. Actualizar cantidades, precios y información de proveedores.',
          features: ['Agregar nuevas materias primas', 'Editar información existente', 'Actualizar cantidades', 'Gestión de proveedores']
        },
        {
          title: 'Reportes de Inventario',
          content: 'Reportes detallados de movimientos de stock, productos próximos a vencer y análisis de consumo.',
          features: ['Reporte de movimientos', 'Productos por vencer', 'Análisis de consumo', 'Valorización de inventario']
        }
      ]
    },
    produccion: {
      title: 'Gestión de Producción',
      icon: '🏭',
      description: 'Planificación y control de la producción de panadería',
      steps: [
        {
          title: 'Planificación de Producción',
          content: 'Programa qué productos hacer, cuándo y en qué hornos. Asigna responsables y controla tiempos de producción.',
          features: ['Calendario de producción', 'Asignación de hornos', 'Turnos y responsables', 'Control de tiempos']
        },
        {
          title: 'Libro de Recetas',
          content: 'Gestiona recetas con ingredientes, cantidades exactas, instrucciones paso a paso y cálculo automático de costos.',
          features: ['Recetas detalladas', 'Cálculo de costos', 'Instrucciones paso a paso', 'Rendimiento por receta']
        },
        {
          title: 'Control de Calidad',
          content: 'Registra inspecciones de calidad con parámetros específicos como textura, color, sabor y temperatura.',
          features: ['Inspecciones por lote', 'Parámetros de calidad', 'Aprobación/rechazo', 'Trazabilidad completa']
        },
        {
          title: 'Estado de Hornos',
          content: 'Monitorea el estado de todos los hornos, programa mantenimientos y controla la capacidad de producción.',
          features: ['Estado en tiempo real', 'Programación de uso', 'Mantenimiento preventivo', 'Capacidad y temperatura']
        }
      ]
    },
    finanzas: {
      title: 'Gestión Financiera',
      icon: '💰',
      description: 'Control completo de finanzas y contabilidad',
      steps: [
        {
          title: 'Resumen Financiero',
          content: 'Vista general de ingresos, gastos, utilidades y flujo de efectivo con gráficos y métricas clave.',
          features: ['Ingresos vs Gastos', 'Utilidad neta', 'Flujo de efectivo', 'Métricas financieras']
        },
        {
          title: 'Transacciones',
          content: 'Registro detallado de todas las transacciones financieras con categorización automática y búsqueda avanzada.',
          features: ['Registro de ingresos', 'Control de gastos', 'Categorización automática', 'Búsqueda y filtros']
        },
        {
          title: 'Presupuestos y Proyecciones',
          content: 'Crea y gestiona presupuestos, compara con resultados reales y genera proyecciones financieras.',
          features: ['Presupuestos mensuales', 'Comparativa real vs presupuesto', 'Proyecciones', 'Análisis de variaciones']
        },
        {
          title: 'Cuentas por Cobrar/Pagar',
          content: 'Gestiona créditos a clientes y deudas con proveedores con seguimiento de vencimientos y pagos.',
          features: ['Créditos a clientes', 'Deudas con proveedores', 'Vencimientos', 'Historial de pagos']
        }
      ]
    },
    personal: {
      title: 'Recursos Humanos',
      icon: '👥',
      description: 'Gestión completa del personal y nómina',
      steps: [
        {
          title: 'Gestión de Empleados',
          content: 'Administra información completa de empleados, puestos, departamentos y datos de contacto.',
          features: ['Perfiles de empleados', 'Puestos y departamentos', 'Información de contacto', 'Estados laborales']
        },
        {
          title: 'Control de Asistencia',
          content: 'Registra entrada y salida de empleados, calcula horas trabajadas y genera reportes de asistencia.',
          features: ['Registro de entrada/salida', 'Cálculo de horas', 'Reportes de asistencia', 'Control de tardanzas']
        },
        {
          title: 'Nómina y Pagos',
          content: 'Calcula salarios automáticamente incluyendo horas extra, bonificaciones, deducciones y beneficios.',
          features: ['Cálculo automático de salarios', 'Horas extra y bonos', 'Deducciones', 'Recibos de pago']
        },
        {
          title: 'Reportes de RRHH',
          content: 'Genera reportes de productividad, costos laborales, rotación de personal y análisis de desempeño.',
          features: ['Reportes de productividad', 'Costos laborales', 'Rotación de personal', 'Evaluaciones']
        }
      ]
    },
    pedidos: {
      title: 'Gestión de Pedidos',
      icon: '📋',
      description: 'Control de pedidos a proveedores y compras',
      steps: [
        {
          title: 'Crear Pedidos',
          content: 'Crea pedidos a proveedores seleccionando productos, cantidades y fechas de entrega esperadas.',
          features: ['Selección de proveedor', 'Productos y cantidades', 'Fechas de entrega', 'Observaciones especiales']
        },
        {
          title: 'Seguimiento de Estados',
          content: 'Rastrea el estado de cada pedido desde pendiente hasta entregado con actualizaciones en tiempo real.',
          features: ['Estados: Pendiente/En proceso/Entregado', 'Fechas de seguimiento', 'Notificaciones', 'Historial completo']
        },
        {
          title: 'Alertas de Reposición',
          content: 'Sistema inteligente que sugiere pedidos automáticamente cuando el stock está bajo o crítico.',
          features: ['Alertas automáticas', 'Sugerencias de pedidos', 'Productos críticos', 'Recomendaciones de cantidad']
        },
        {
          title: 'Análisis de Compras',
          content: 'Reportes de compras, análisis de proveedores, costos y tiempos de entrega para optimizar compras.',
          features: ['Historial de compras', 'Análisis de proveedores', 'Comparativa de precios', 'Tiempos de entrega']
        }
      ]
    },
    proveedores: {
      title: 'Directorio de Proveedores',
      icon: '🏢',
      description: 'Gestión completa de proveedores y contactos',
      steps: [
        {
          title: 'Directorio Completo',
          content: 'Base de datos completa de proveedores con información de contacto, productos que suministran y términos comerciales.',
          features: ['Información de contacto', 'Productos suministrados', 'Términos de pago', 'Calificaciones']
        },
        {
          title: 'Evaluación de Proveedores',
          content: 'Sistema de calificación basado en calidad, puntualidad, precios y servicio para optimizar selección.',
          features: ['Calificación por criterios', 'Historial de desempeño', 'Comparativas', 'Recomendaciones']
        },
        {
          title: 'Gestión de Contratos',
          content: 'Administra contratos, acuerdos comerciales, precios especiales y condiciones de pago con cada proveedor.',
          features: ['Contratos vigentes', 'Precios acordados', 'Condiciones especiales', 'Renovaciones']
        },
        {
          title: 'Análisis de Compras',
          content: 'Reportes detallados de compras por proveedor, análisis de costos y identificación de oportunidades de ahorro.',
          features: ['Compras por proveedor', 'Análisis de costos', 'Oportunidades de ahorro', 'Tendencias de precios']
        }
      ]
    },
    reportes: {
      title: 'Reportes y Análisis',
      icon: '📊',
      description: 'Sistema completo de reportes y business intelligence',
      steps: [
        {
          title: 'Dashboard de Reportes',
          content: 'Centro de control con acceso rápido a todos los tipos de reportes organizados por categorías y frecuencia.',
          features: ['Reportes por categoría', 'Acceso rápido', 'Reportes favoritos', 'Programación automática']
        },
        {
          title: 'Reportes de Ventas',
          content: 'Análisis detallado de ventas por período, producto, cliente, cajero y método de pago con gráficos interactivos.',
          features: ['Ventas por período', 'Productos más vendidos', 'Análisis por cajero', 'Métodos de pago']
        },
        {
          title: 'Reportes Operativos',
          content: 'Reportes de inventario, producción, personal y proveedores para optimizar operaciones diarias.',
          features: ['Movimientos de inventario', 'Eficiencia de producción', 'Productividad del personal', 'Desempeño de proveedores']
        },
        {
          title: 'Exportación y Programación',
          content: 'Exporta reportes en múltiples formatos y programa envíos automáticos por email a stakeholders.',
          features: ['Exportar PDF/Excel', 'Envío automático por email', 'Programación recurrente', 'Personalización de reportes']
        }
      ]
    },
    usuarios: {
      title: 'Gestión de Usuarios',
      icon: '👤',
      description: 'Administración de usuarios, roles y permisos del sistema',
      steps: [
        {
          title: 'Administración de Usuarios',
          content: 'Crea, edita y gestiona cuentas de usuario con información personal, credenciales y estado de cuenta.',
          features: ['Crear nuevos usuarios', 'Editar perfiles', 'Activar/desactivar cuentas', 'Resetear contraseñas']
        },
        {
          title: 'Roles y Permisos',
          content: 'Sistema granular de roles con permisos específicos para cada módulo del sistema según responsabilidades.',
          features: ['Roles predefinidos', 'Permisos granulares', 'Asignación flexible', 'Herencia de permisos']
        },
        {
          title: 'Seguridad y Auditoría',
          content: 'Monitoreo de actividad de usuarios, intentos de acceso, cambios importantes y logs de seguridad.',
          features: ['Log de actividades', 'Intentos de acceso', 'Cambios de permisos', 'Alertas de seguridad']
        },
        {
          title: 'Configuración de Acceso',
          content: 'Configura políticas de contraseñas, sesiones, horarios de acceso y restricciones por IP o dispositivo.',
          features: ['Políticas de contraseñas', 'Tiempo de sesión', 'Horarios de acceso', 'Restricciones de IP']
        }
      ]
    }
  };

  const currentDemo = demoData[section];
  const currentStepData = currentDemo?.steps[currentStep];

  if (!currentDemo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Sección no encontrada
          </h3>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentDemo.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{currentDemo.title}</h2>
                <p className="text-amber-100">{currentDemo.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 dark:bg-gray-700 h-2">
          <div 
            className="bg-amber-500 h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / currentDemo.steps.length) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Paso {currentStep + 1} de {currentDemo.steps.length}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {currentStepData.content}
            </p>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Funcionalidades Principales:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Simulation */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Simulación en Vivo
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Esta funcionalidad está completamente implementada y lista para usar. 
              Puedes acceder a ella directamente desde el menú lateral.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>

            <div className="flex space-x-2">
              {currentDemo.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-amber-500'
                      : index < currentStep
                      ? 'bg-amber-300'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (currentStep < currentDemo.steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  onClose();
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <span>{currentStep < currentDemo.steps.length - 1 ? 'Siguiente' : 'Finalizar'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;