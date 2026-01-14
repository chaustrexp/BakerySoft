import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNotificationSystem } from '../hooks/useNotificationSystem';
import StatsCards from './StatsCards';
import ChartSection from './ChartSection';
import AlertsSection from './AlertsSection';
import DemoTourModal from './DemoTourModal';
import Logo from './Logo';
import ProfileAvatar from './ProfileAvatar';

const Dashboard = ({ user }) => {
  const { state, setActiveView } = useApp();
  const { materiasPrimas, roles } = state;
  const [showTour, setShowTour] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  // Inicializar sistema de notificaciones
  const { notifySuccess, notifyWarning, notifyError, notifyInfo } = useNotificationSystem();
  
  const userRole = roles[user?.role] || roles.employee || { name: 'Empleado', permissions: [] };
  
  // Si es cliente, redirigir a vista de productos
  if (user?.role === 'client') {
    // Por ahora, mostrar dashboard normal
    // return <ClientDashboard user={user} setActiveView={setActiveView} />;
  }
  
  // Calcular estadísticas
  const totalProductos = materiasPrimas.length;
  const productosOptimos = materiasPrimas.filter(m => m.estado === 'Óptimo');
  const productosBajos = materiasPrimas.filter(m => m.estado === 'Bajo');
  const productosCriticos = materiasPrimas.filter(m => m.estado === 'Crítico');

  // Generar notificaciones de demostración (solo una vez)
  React.useEffect(() => {
    const hasGeneratedDemoNotifications = localStorage.getItem('bakerysoft_demo_notifications');
    
    if (!hasGeneratedDemoNotifications) {
      setTimeout(() => {
        notifyInfo(
          'Sistema Iniciado',
          'BakerySoft está funcionando correctamente',
          {
            label: 'Ver Dashboard',
            callback: () => console.log('Navegando al dashboard')
          }
        );
      }, 3000);

      setTimeout(() => {
        if (productosCriticos.length > 0) {
          notifyError(
            'Stock Crítico Detectado',
            `${productosCriticos.length} productos necesitan reposición urgente`,
            {
              label: 'Ver Inventario',
              callback: () => console.log('Navegando al inventario')
            }
          );
        }
      }, 5000);

      setTimeout(() => {
        notifySuccess(
          'Backup Completado',
          'Los datos han sido respaldados exitosamente'
        );
      }, 8000);

      localStorage.setItem('bakerysoft_demo_notifications', 'true');
    }
  }, [notifyInfo, notifyError, notifySuccess, productosCriticos.length]);

  // Calcular porcentajes
  const porcentajeOptimo = Math.round((productosOptimos.length / totalProductos) * 100);
  const porcentajeBajo = Math.round((productosBajos.length / totalProductos) * 100);
  const porcentajeCritico = Math.round((productosCriticos.length / totalProductos) * 100);

  // Productos que necesitan pedido urgente
  const productosUrgentes = materiasPrimas.filter(m => m.estado === 'Crítico' || m.estado === 'Bajo');

  // Proveedores únicos
  const proveedoresUnicos = [...new Set(materiasPrimas.map(m => m.proveedor))];

  // Valor total estimado del inventario (simulado)
  const valorTotalInventario = materiasPrimas.reduce((total, materia) => {
    const precioEstimado = {
      'kg': 2.5,
      'litros': 3.0,
      'unidades': 0.15
    };
    return total + (materia.cantidad * (precioEstimado[materia.unidad] || 2.0));
  }, 0);

  // Datos para los componentes
  const statsData = {
    total: totalProductos,
    optimo: productosOptimos.length,
    bajo: productosBajos.length,
    critico: productosCriticos.length,
    porcentajeOptimo,
    porcentajeBajo,
    porcentajeCritico,
    valorInventario: valorTotalInventario
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Banner de bienvenida con tour */}
      {showWelcomeBanner && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
          <button
            onClick={() => setShowWelcomeBanner(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">🎉</div>
                <div>
                  <h3 className="text-xl font-bold">¡Bienvenido a BakerySoft!</h3>
                  <p className="text-blue-100">Descubre todas las funcionalidades de tu sistema de gestión</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowTour(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16a3 3 0 01-3-3V9a3 3 0 013-3h10a3 3 0 013 3v4a3 3 0 01-3 3H7z" />
                  </svg>
                  <span>Ver Tour Completo</span>
                </button>
                
                <button
                  onClick={() => setShowWelcomeBanner(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors border border-blue-400"
                >
                  Explorar por mi cuenta
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block text-6xl opacity-20">
              <Logo size="2xl" className="opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Título del Dashboard */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard de Inventario
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Bienvenido, <span className="font-semibold">{user.name}</span> • {userRole.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Último acceso</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Primer acceso'}
              </p>
            </div>
            <ProfileAvatar user={user} size="lg" />
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="mb-6 sm:mb-8">
        <StatsCards stats={statsData} />
      </div>

      {/* Gráficos y visualizaciones */}
      <div className="mb-6 sm:mb-8">
        <ChartSection data={statsData} />
      </div>

      {/* Sección de proveedores */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Proveedores Activos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proveedoresUnicos.map((proveedor, index) => {
              const productosProveedor = materiasPrimas.filter(m => m.proveedor === proveedor);
              const productosCount = productosProveedor.length;
              const criticosCount = productosProveedor.filter(p => p.estado === 'Crítico').length;
              
              return (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{proveedor}</h4>
                    {criticosCount > 0 && (
                      <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold px-2 py-1 rounded flex-shrink-0 ml-2">
                        {criticosCount} crítico{criticosCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{productosCount} productos</span>
                    <div className="flex space-x-1">
                      {productosProveedor.slice(0, 5).map((producto, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            producto.estado === 'Óptimo' ? 'bg-green-500' :
                            producto.estado === 'Bajo' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          title={`${producto.nombre} - ${producto.estado}`}
                        ></div>
                      ))}
                      {productosProveedor.length > 5 && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">+{productosProveedor.length - 5}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Resumen de proveedores */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{proveedoresUnicos.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Proveedores Activos</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">${valorTotalInventario.toFixed(0)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Valor Total Estimado</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((productosOptimos.length / totalProductos) * 100)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Productos Saludables</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y productos críticos */}
      <AlertsSection 
        productosUrgentes={productosUrgentes} 
        productosOptimos={productosOptimos}
      />

      {/* Modal de tour */}
      {showTour && (
        <DemoTourModal onClose={() => setShowTour(false)} />
      )}
    </div>
  );
};

// Dashboard específico para clientes
const ClientDashboard = ({ user, setActiveView }) => {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

  // Datos simulados para el cliente
  const clientStats = {
    pedidosRealizados: 4,
    totalGastado: 46.50,
    puntosAcumulados: 465,
    descuentosDisponibles: 2
  };

  const productosPopulares = [
    { id: 1, nombre: 'Pan Integral', precio: 3.50, imagen: '🍞', popularidad: 95 },
    { id: 2, nombre: 'Croissant', precio: 2.75, imagen: '🥐', popularidad: 92 },
    { id: 3, nombre: 'Torta de Chocolate', precio: 18.00, imagen: '🎂', popularidad: 88 },
    { id: 4, nombre: 'Empanadas', precio: 4.25, imagen: '🥟', popularidad: 85 }
  ];

  const ofertas = [
    {
      id: 1,
      titulo: '2x1 en Croissants',
      descripcion: 'Lleva 2 croissants y paga solo 1',
      descuento: '50%',
      validoHasta: '2024-01-15',
      imagen: '🥐'
    },
    {
      id: 2,
      titulo: 'Combo Desayuno',
      descripcion: 'Pan + Café por solo $5.00',
      descuento: '$1.25',
      validoHasta: '2024-01-20',
      imagen: '☕'
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* Banner de bienvenida para clientes */}
      {showWelcomeBanner && (
        <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
          <button
            onClick={() => setShowWelcomeBanner(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-3xl">🛒</div>
                <div>
                  <h3 className="text-xl font-bold">¡Bienvenido {user.name}!</h3>
                  <p className="text-orange-100">Descubre nuestros productos frescos y ofertas especiales</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveView('productos')}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Ver Productos</span>
                </button>
                
                <button
                  onClick={() => setActiveView('pedidos')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors border border-orange-400 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Mis Pedidos</span>
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <ProfileAvatar user={user} size="2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del cliente */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Mi Resumen
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pedidos Realizados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{clientStats.pedidosRealizados}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${clientStats.totalGastado}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Puntos Acumulados</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{clientStats.puntosAcumulados}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Descuentos</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{clientStats.descuentosDisponibles}</p>
              </div>
              <div className="text-3xl">🎁</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ofertas especiales */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔥 Ofertas Especiales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ofertas.map(oferta => (
              <div key={oferta.id} className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{oferta.imagen}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{oferta.titulo}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{oferta.descripcion}</p>
                  </div>
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {oferta.descuento}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Válido hasta: {new Date(oferta.validoHasta).toLocaleDateString('es-ES')}
                  </span>
                  <button
                    onClick={() => setActiveView('productos')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ver Productos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productos populares */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">🌟 Productos Populares</h3>
            <button
              onClick={() => setActiveView('productos')}
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm"
            >
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {productosPopulares.map(producto => (
              <div key={producto.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="text-center">
                  <div className="text-4xl mb-2">{producto.imagen}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{producto.nombre}</h4>
                  <p className="text-orange-600 dark:text-orange-400 font-bold">${producto.precio}</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{(producto.popularidad / 20).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('productos')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🛒</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Explorar Productos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ver catálogo completo</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveView('pedidos')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">📋</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Mis Pedidos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Historial y estado</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setActiveView('perfil')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-4xl">👤</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Mi Perfil</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Información personal</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;