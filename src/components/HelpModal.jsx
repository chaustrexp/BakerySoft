import { useState } from 'react';

const HelpModal = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('general');

  const helpSections = {
    general: {
      title: 'Información General',
      icon: '📋',
      content: [
        {
          question: '¿Qué es BakerySoft?',
          answer: 'BakerySoft es un sistema integral de gestión para panaderías que te permite administrar inventario, personal, finanzas, producción, ventas y más desde una sola plataforma.'
        },
        {
          question: '¿Cómo navegar por el sistema?',
          answer: 'Utiliza el menú lateral para acceder a las diferentes secciones. Cada sección tiene su propio conjunto de herramientas y funcionalidades específicas.'
        },
        {
          question: '¿Cómo cambiar entre tema claro y oscuro?',
          answer: 'Puedes cambiar el tema usando el botón de luna/sol en la barra superior derecha, junto a tu perfil de usuario.'
        }
      ]
    },
    inventario: {
      title: 'Gestión de Inventario',
      icon: '📦',
      content: [
        {
          question: '¿Cómo agregar nuevas materias primas?',
          answer: 'Ve a la sección "Inventario" y haz clic en "Agregar Materia Prima". Completa la información requerida como nombre, cantidad, proveedor y fecha de vencimiento.'
        },
        {
          question: '¿Cómo actualizar el stock?',
          answer: 'En la vista de inventario, haz clic en el botón "Editar" de cualquier materia prima para actualizar su cantidad, estado o información.'
        },
        {
          question: '¿Qué significan los estados de stock?',
          answer: 'Óptimo (verde): Stock suficiente. Bajo (amarillo): Necesita reposición pronto. Crítico (rojo): Requiere reposición urgente.'
        }
      ]
    },
    personal: {
      title: 'Gestión de Personal',
      icon: '👥',
      content: [
        {
          question: '¿Cómo agregar un nuevo empleado?',
          answer: 'En la sección "Personal", haz clic en "Nuevo Empleado". Completa la información personal y laboral, incluyendo puesto, departamento y salario.'
        },
        {
          question: '¿Cómo gestionar la asistencia?',
          answer: 'La asistencia se registra automáticamente. Puedes ver el historial y estadísticas en la sección de personal de cada empleado.'
        },
        {
          question: '¿Cómo calcular la nómina?',
          answer: 'El sistema calcula automáticamente la nómina basada en el salario base, horas trabajadas, bonificaciones y deducciones configuradas.'
        }
      ]
    },
    produccion: {
      title: 'Gestión de Producción',
      icon: '🏭',
      content: [
        {
          question: '¿Cómo crear una nueva receta?',
          answer: 'Ve a Producción > Recetas y haz clic en "Nueva Receta". Define los ingredientes, cantidades, instrucciones y costos asociados.'
        },
        {
          question: '¿Cómo planificar la producción?',
          answer: 'En Producción > Planificación, puedes programar qué productos hacer, en qué horarios y asignar hornos y responsables.'
        },
        {
          question: '¿Cómo funciona el control de calidad?',
          answer: 'Registra inspecciones de calidad con parámetros específicos como textura, color, sabor y temperatura para mantener estándares consistentes.'
        }
      ]
    },
    ventas: {
      title: 'Punto de Venta',
      icon: '💰',
      content: [
        {
          question: '¿Cómo procesar una venta?',
          answer: 'En el POS, selecciona los productos, ajusta cantidades si es necesario, elige el método de pago y confirma la transacción.'
        },
        {
          question: '¿Cómo aplicar descuentos?',
          answer: 'Durante una venta, puedes aplicar descuentos por porcentaje o cantidad fija antes de procesar el pago.'
        },
        {
          question: '¿Cómo manejar devoluciones?',
          answer: 'Las devoluciones se procesan desde el historial de ventas. Selecciona la venta original y procesa la devolución parcial o total.'
        }
      ]
    },
    reportes: {
      title: 'Reportes y Análisis',
      icon: '📊',
      content: [
        {
          question: '¿Qué tipos de reportes están disponibles?',
          answer: 'Puedes generar reportes de ventas, inventario, personal, finanzas y producción con diferentes períodos y filtros.'
        },
        {
          question: '¿Cómo exportar reportes?',
          answer: 'Todos los reportes pueden exportarse en formato PDF o Excel usando los botones de exportación en la parte superior de cada reporte.'
        },
        {
          question: '¿Cómo programar reportes automáticos?',
          answer: 'En la configuración de reportes, puedes programar envíos automáticos por email de reportes específicos en intervalos regulares.'
        }
      ]
    }
  };

  const shortcuts = [
    { key: 'Ctrl + D', action: 'Ir al Dashboard' },
    { key: 'Ctrl + I', action: 'Abrir Inventario' },
    { key: 'Ctrl + P', action: 'Abrir Personal' },
    { key: 'Ctrl + V', action: 'Abrir POS' },
    { key: 'Ctrl + K', action: 'Búsqueda rápida' },
    { key: 'Ctrl + T', action: 'Cambiar tema' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar de secciones */}
          <div className="w-1/3 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Centro de Ayuda</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                {Object.entries(helpSections).map(([key, section]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSection === key
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
                
                <button
                  onClick={() => setActiveSection('shortcuts')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeSection === 'shortcuts'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">⌨️</span>
                  <span className="font-medium">Atajos de Teclado</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeSection === 'shortcuts' ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">⌨️</span>
                    Atajos de Teclado
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Usa estos atajos para navegar más rápidamente por BakerySoft:
                    </p>
                    <div className="grid gap-3">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-900 dark:text-white">{shortcut.action}</span>
                          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="text-2xl mr-3">{helpSections[activeSection]?.icon}</span>
                    {helpSections[activeSection]?.title}
                  </h3>
                  <div className="space-y-6">
                    {helpSections[activeSection]?.content.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {item.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con información adicional */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">¿Necesitas más ayuda?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contacta a nuestro equipo de soporte técnico
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                    Contactar Soporte
                  </button>
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Ver Tutoriales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;