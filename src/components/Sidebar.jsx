import { roles } from '../data/users';
import { useUI } from '../hooks/useApp';
import { useState } from 'react';
import DemoModal from './DemoModal';
import Logo from './Logo';

const Sidebar = ({ activeView, setActiveView, user, isCollapsed, setIsCollapsed, isMobile, closeMobileMenu }) => {
  const userRole = roles[user.role] || roles.employee;
  const { toggleDarkMode, darkMode } = useUI();
  const [showDemo, setShowDemo] = useState(false);
  const [demoSection, setDemoSection] = useState(null);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: user.role === 'client' ? 'Inicio' : 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      ),
      description: user.role === 'client' ? 'Página principal' : 'Resumen general'
    },
    { 
      id: 'productos', 
      label: user.role === 'client' ? 'Productos' : 'Catálogo', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: user.role === 'client' ? 'Catálogo de productos' : 'Productos disponibles'
    },
    { 
      id: 'pos', 
      label: 'Punto de Venta', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      ),
      description: 'Sistema de ventas'
    },
    { 
      id: 'inventario', 
      label: 'Inventario', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      description: 'Materias primas'
    },
    { 
      id: 'produccion', 
      label: 'Producción', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      description: 'Recetas y planificación'
    },
    { 
      id: 'finanzas', 
      label: 'Finanzas', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      description: 'Contabilidad y costos'
    },
    { 
      id: 'personal', 
      label: 'Personal', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Recursos humanos'
    },
    { 
      id: 'pedidos', 
      label: 'Pedidos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: user.role === 'client' ? 'Mis pedidos' : 'Gestión de pedidos'
    },
    { 
      id: 'proveedores', 
      label: 'Proveedores', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
        </svg>
      ),
      description: 'Directorio de proveedores'
    },
    { 
      id: 'reportes', 
      label: 'Reportes', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'Análisis y reportes'
    },
    { 
      id: 'usuarios', 
      label: 'Usuarios', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      description: 'Gestión de usuarios'
    },
    { 
      id: 'perfil', 
      label: user.role === 'client' ? 'Mi Perfil' : 'Mi Perfil', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: user.role === 'client' ? 'Mi información personal' : 'Información personal'
    }
  ];

  // Filtrar menú según permisos del usuario
  const filteredMenuItems = menuItems.filter(item => 
    user.permissions.includes(item.id)
  );

  const handleMenuClick = (viewId) => {
    setActiveView(viewId);
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const handleDemoClick = (sectionId, event) => {
    event.stopPropagation();
    setDemoSection(sectionId);
    setShowDemo(true);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isMobile ? 'w-64' : (isCollapsed ? 'w-16' : 'w-64')
    } flex flex-col h-full`}>
      {/* Logo y toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 p-1">
                <Logo size="sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BakerySoft</h1>
            </div>
          )}
          {(isCollapsed && !isMobile) && (
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mx-auto p-1">
              <Logo size="sm" />
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg 
                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                  isCollapsed ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          {isMobile && (
            <button
              onClick={closeMobileMenu}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Información del usuario */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg">{user.avatar}</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole.name}</p>
            </div>
          )}
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="mt-3">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${userRole.color}`}>
              {userRole.description}
            </span>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={(isCollapsed && !isMobile) ? item.label : ''}
              >
                <div className={`flex-shrink-0 ${activeView === item.id ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                  {item.icon}
                </div>
                {(!isCollapsed || isMobile) && (
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs opacity-75 truncate">{item.description}</p>
                  </div>
                )}
                {(!isCollapsed || isMobile) && activeView === item.id && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                )}
              </button>
              
              {/* Botón de demostración */}
              {(!isCollapsed || isMobile) && (
                <button
                  onClick={(e) => handleDemoClick(item.id, e)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                  title={`Ver demo de ${item.label}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16a3 3 0 01-3-3V9a3 3 0 013-3h10a3 3 0 013 3v4a3 3 0 01-3 3H7z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Toggle tema oscuro */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <div className="flex-shrink-0">
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {(!isCollapsed || isMobile) && (
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">BakerySoft v1.0</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Sistema de Gestión</p>
          </div>
        )}
        {(isCollapsed && !isMobile) && (
          <div className="text-center">
            <button
              onClick={toggleDarkMode}
              className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {darkMode ? (
                <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal de demostración */}
      {showDemo && demoSection && (
        <DemoModal
          section={demoSection}
          onClose={() => {
            setShowDemo(false);
            setDemoSection(null);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;