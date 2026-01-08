import React, { useState } from 'react';
import UserProfile from './UserProfile';
import SearchModal from './SearchModal';
import SettingsModal from './SettingsModal';
import DemoModal from './DemoModal';
import DemoTourModal from './DemoTourModal';
import NotificationPanel from './NotificationPanel';
import { useUI } from '../hooks/useApp';
import { useNotifications } from '../context/NotificationContext';

const TopHeader = ({ user, onLogout, activeView, isMobile, onMobileMenuToggle, isMobileMenuOpen }) => {
  const { darkMode, setActiveView } = useUI();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Títulos por vista
  const viewTitles = {
    dashboard: 'Dashboard',
    inventario: 'Inventario',
    pedidos: 'Pedidos',
    proveedores: 'Proveedores',
    reportes: 'Reportes',
    usuarios: 'Usuarios',
    personal: 'Personal',
    finanzas: 'Finanzas',
    produccion: 'Producción',
    pos: 'Punto de Venta'
  };

  // Breadcrumbs por vista
  const viewBreadcrumbs = {
    dashboard: ['Inicio', 'Dashboard'],
    inventario: ['Inicio', 'Inventario'],
    pedidos: ['Inicio', 'Pedidos'],
    proveedores: ['Inicio', 'Proveedores'],
    reportes: ['Inicio', 'Reportes'],
    usuarios: ['Inicio', 'Usuarios'],
    personal: ['Inicio', 'Personal'],
    finanzas: ['Inicio', 'Finanzas'],
    produccion: ['Inicio', 'Producción'],
    pos: ['Inicio', 'Punto de Venta']
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Botón de menú móvil y título */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Botón hamburguesa para móvil */}
            {isMobile && (
              <button
                onClick={onMobileMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 md:hidden"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            {/* Título y breadcrumbs */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {viewTitles[activeView] || 'BakerySoft'}
              </h1>
              {/* Breadcrumbs - ocultos en móvil */}
              <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                {viewBreadcrumbs[activeView]?.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <span className={index === viewBreadcrumbs[activeView].length - 1 ? 'text-gray-900 dark:text-white font-medium' : 'hover:text-gray-700 dark:hover:text-gray-300'}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
          {/* Barra de herramientas */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Fecha y hora - solo en desktop */}
            <div className="hidden xl:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>

            {/* Búsqueda - oculta en móvil pequeño */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Botón de demostración */}
            <div className="relative">
              <button
                onClick={() => {
                  // Si estamos en dashboard, mostrar tour completo, sino demo de la sección actual
                  if (activeView === 'dashboard') {
                    setShowTour(true);
                  } else {
                    setShowDemo(true);
                  }
                }}
                className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                title={activeView === 'dashboard' ? 'Ver tour completo de funcionalidades' : `Ver demostración de ${viewTitles[activeView]}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16a3 3 0 01-3-3V9a3 3 0 013-3h10a3 3 0 013 3v4a3 3 0 01-3 3H7z" />
                </svg>
                <span className="hidden lg:inline text-sm font-medium">
                  {activeView === 'dashboard' ? 'Tour' : 'Demo'}
                </span>
              </button>
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 relative"
                title="Notificaciones"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Badge de notificaciones */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Configuración rápida - oculta en móvil */}
            <button
              onClick={() => setShowSettings(true)}
              className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="Configuración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Perfil de usuario */}
            <UserProfile user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>

      {/* Modales */}
      {showSearch && (
        <SearchModal 
          onClose={() => setShowSearch(false)}
          onNavigate={(view) => {
            setActiveView(view);
            setShowSearch(false);
          }}
        />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDemo && (
        <DemoModal 
          section={activeView}
          onClose={() => setShowDemo(false)}
        />
      )}

      {showTour && (
        <DemoTourModal 
          onClose={() => setShowTour(false)}
        />
      )}

      {/* Panel de notificaciones */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
};

export default TopHeader;