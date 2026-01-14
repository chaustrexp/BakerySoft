import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import { useApp, useUI } from './hooks/useApp';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import InventoryGrid from './components/InventoryGrid';
import PersonalView from './components/PersonalView';
import FinanzasView from './components/FinanzasView';
import ProduccionView from './components/ProduccionView';
import POSView from './components/POSView';
import UsuariosView from './components/UsuariosView';
import ReportesView from './components/ReportesView';
import ProveedoresView from './components/ProveedoresView';
import PedidosView from './components/PedidosView';
import ProductosView from './components/ProductosView';
import PerfilClienteView from './components/PerfilClienteView';
import Logo from './components/Logo';

// Componente interno que usa el contexto
function AppContent() {
  const { state, login, logout, setActiveView, addUser } = useApp();
  const { darkMode } = useUI();
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' o 'register'
  const [error, setError] = useState(null);

  // Verificar usuario guardado al cargar
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Inicializando aplicación...');
        
        // No intentar auto-login desde localStorage
        // El AppContext ya maneja la verificación de autenticación
        
        // Simular carga inicial
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Aplicación inicializada correctamente');
        setIsLoading(false);
      } catch (error) {
        console.error('Error inicializando aplicación:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Función de login con manejo de errores
  const handleLogin = (user) => {
    try {
      console.log('Intentando login para:', user.username);
      login(user);
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión');
    }
  };

  // Función de registro con manejo de errores
  const handleRegister = (userData) => {
    try {
      console.log('Registrando nuevo usuario:', userData.username);
      
      // Agregar el nuevo usuario al sistema
      addUser(userData);
      
      // Hacer login automático después del registro
      login(userData);
      
      // Mostrar mensaje de éxito
      alert(`¡Cuenta creada exitosamente!\n\nBienvenido ${userData.name}.\nYa puedes usar el sistema con tu nueva cuenta.`);
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al registrar usuario');
    }
  };

  // Función de logout
  const handleLogout = () => {
    try {
      console.log('Cerrando sesión...');
      logout();
      setActiveView('dashboard');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Verificar permisos
  const hasPermission = (permission) => {
    try {
      return state.currentUser && state.currentUser.permissions && state.currentUser.permissions.includes(permission);
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  };

  // Renderizar contenido según vista activa
  const renderContent = () => {
    try {
      if (!hasPermission(state.activeView)) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚫</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Acceso Denegado</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                No tienes permisos para acceder a esta sección.
              </p>
              <button
                onClick={() => setActiveView('dashboard')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        );
      }

      switch (state.activeView) {
        case 'dashboard':
          return <Dashboard user={state.currentUser} />;
        case 'inventario':
          return <InventoryGrid />;
        case 'personal':
          return <PersonalView />;
        case 'finanzas':
          return <FinanzasView />;
        case 'produccion':
          return <ProduccionView />;
        case 'pos':
          return <POSView />;
        case 'usuarios':
          return <UsuariosView />;
        case 'reportes':
          return <ReportesView />;
        case 'proveedores':
          return <ProveedoresView />;
        case 'pedidos':
          return <PedidosView />;
        case 'productos':
          return <ProductosView />;
        case 'perfil':
          return <PerfilClienteView />;
        default:
          return <Dashboard user={state.currentUser} />;
      }
    } catch (error) {
      console.error('Error renderizando contenido:', error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error de Renderizado</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Ocurrió un error al cargar esta sección.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }
  };

  // Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error de Aplicación</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-medium"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-500 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            <Logo size="2xl" className="mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-2">BakerySoft</h1>
          <p className="text-xl mb-6">Sistema de Gestión para Panaderías</p>
          <div className="w-64 h-2 bg-amber-400 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-amber-100">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  // Pantalla de login/registro
  if (!state.isAuthenticated) {
    if (authView === 'register') {
      return (
        <div className={darkMode ? 'dark' : ''}>
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthView('login')}
          />
        </div>
      );
    }

    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      </div>
    );
  }

  // Dashboard principal con Layout
  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout
        user={state.currentUser}
        onLogout={handleLogout}
        activeView={state.activeView}
        setActiveView={setActiveView}
      >
        {renderContent()}
      </Layout>
    </div>
  );
}

// Componente principal que provee el contexto
function App() {
  console.log('Iniciando aplicación BakerySoft...');
  
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;