import { useState } from 'react';
import DemoModal from './DemoModal';

const DemoTourModal = ({ onClose }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSectionDemo, setShowSectionDemo] = useState(false);

  const sections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '🏠',
      description: 'Panel principal con resumen general del negocio',
      color: 'from-blue-500 to-blue-600',
      features: ['Métricas en tiempo real', 'Gráficos interactivos', 'Alertas importantes']
    },
    {
      id: 'pos',
      title: 'Punto de Venta',
      icon: '🛒',
      description: 'Sistema completo de ventas y facturación',
      color: 'from-green-500 to-green-600',
      features: ['Procesamiento rápido', 'Múltiples métodos de pago', 'Recibos automáticos']
    },
    {
      id: 'inventario',
      title: 'Inventario',
      icon: '📦',
      description: 'Control completo de materias primas y stock',
      color: 'from-purple-500 to-purple-600',
      features: ['Control de stock', 'Alertas automáticas', 'Gestión de vencimientos']
    },
    {
      id: 'produccion',
      title: 'Producción',
      icon: '🏭',
      description: 'Planificación y control de la producción',
      color: 'from-orange-500 to-orange-600',
      features: ['Planificación de producción', 'Libro de recetas', 'Control de calidad']
    },
    {
      id: 'finanzas',
      title: 'Finanzas',
      icon: '💰',
      description: 'Control completo de finanzas y contabilidad',
      color: 'from-emerald-500 to-emerald-600',
      features: ['Resumen financiero', 'Control de gastos', 'Reportes financieros']
    },
    {
      id: 'personal',
      title: 'Personal',
      icon: '👥',
      description: 'Gestión completa del personal y nómina',
      color: 'from-indigo-500 to-indigo-600',
      features: ['Gestión de empleados', 'Control de asistencia', 'Cálculo de nómina']
    },
    {
      id: 'pedidos',
      title: 'Pedidos',
      icon: '📋',
      description: 'Control de pedidos a proveedores',
      color: 'from-cyan-500 to-cyan-600',
      features: ['Crear pedidos', 'Seguimiento de estados', 'Alertas de reposición']
    },
    {
      id: 'proveedores',
      title: 'Proveedores',
      icon: '🏢',
      description: 'Directorio completo de proveedores',
      color: 'from-teal-500 to-teal-600',
      features: ['Directorio completo', 'Evaluación de proveedores', 'Gestión de contratos']
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: '📊',
      description: 'Sistema completo de reportes y análisis',
      color: 'from-pink-500 to-pink-600',
      features: ['Reportes de ventas', 'Análisis operativo', 'Exportación automática']
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      icon: '👤',
      description: 'Administración de usuarios y permisos',
      color: 'from-red-500 to-red-600',
      features: ['Gestión de usuarios', 'Roles y permisos', 'Auditoría de seguridad']
    }
  ];

  const handleSectionClick = (section) => {
    setSelectedSection(section.id);
    setShowSectionDemo(true);
  };

  const handleCloseSectionDemo = () => {
    setShowSectionDemo(false);
    setSelectedSection(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h2 className="text-3xl font-bold">Tour de Funcionalidades</h2>
                  <p className="text-amber-100">Explora todas las capacidades de BakerySoft</p>
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Selecciona una sección para ver su demostración
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Cada sección incluye una guía paso a paso de sus funcionalidades principales
              </p>
            </div>

            {/* Grid de secciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => handleSectionClick(section)}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-200"
                >
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl">
                    {/* Header con gradiente */}
                    <div className={`bg-gradient-to-r ${section.color} p-4 text-white`}>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{section.icon}</div>
                        <div>
                          <h4 className="text-lg font-bold">{section.title}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                        {section.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {section.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Botón de acción */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Haz clic para ver demo
                          </span>
                          <div className="text-amber-500 group-hover:text-amber-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                    ¿Sabías que...?
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Todas las secciones están completamente funcionales y listas para usar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Los datos se guardan automáticamente en tu navegador</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Puedes cambiar entre tema claro y oscuro en cualquier momento</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>El sistema se adapta automáticamente a dispositivos móviles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">¿Listo para empezar?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explora cada sección y descubre todo lo que BakerySoft puede hacer por tu negocio
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Comenzar a Usar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de demostración de sección específica */}
      {showSectionDemo && selectedSection && (
        <DemoModal
          section={selectedSection}
          onClose={handleCloseSectionDemo}
        />
      )}
    </>
  );
};

export default DemoTourModal;