import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Logo from './Logo';

const LoginForm = ({ onSwitchToRegister }) => {
  const { login, state } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      // El login exitoso redirigirá automáticamente desde App.jsx
    } catch (error) {
      setError(error.message || 'Usuario o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  // Usuarios de demostración
  const demoUsers = [
    { 
      username: 'admin', 
      password: 'admin123', 
      role: 'Administrador', 
      icon: '👑', 
      color: 'from-purple-500 to-purple-600',
      photo: '/img/administrador.png'
    },
    { 
      username: 'manager', 
      password: 'manager123', 
      role: 'Gerente', 
      icon: '💼', 
      color: 'from-blue-500 to-blue-600',
      photo: '/img/gerente.png'
    },
    { 
      username: 'supervisor', 
      password: 'supervisor123', 
      role: 'Supervisor', 
      icon: '👨‍💼', 
      color: 'from-green-500 to-green-600',
      photo: '/img/supervisor.jpeg'
    },
    { 
      username: 'empleado', 
      password: 'empleado123', 
      role: 'Empleado', 
      icon: '👤', 
      color: 'from-gray-500 to-gray-600',
      photo: '/img/empleado.jpeg'
    },
    { 
      username: 'cliente', 
      password: 'cliente123', 
      role: 'Cliente', 
      icon: '🛒', 
      color: 'from-orange-500 to-orange-600',
      photo: '/img/cliente.png'
    }
  ];

  const loginWithDemo = async (username, password) => {
    setFormData({ username, password });
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/img/fondo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30 dark:from-black/50 dark:via-black/40 dark:to-black/50"></div>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Panel izquierdo - Información */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-8 shadow-lg p-3">
                <Logo size="lg" />
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Bienvenido a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  BakerySoft
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                El sistema de gestión más completo para panaderías. 
                Controla inventario, producción, ventas y más desde una sola plataforma.
              </p>

              {/* Características */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Gestión completa de inventario</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Control de producción y recetas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Punto de venta integrado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Reportes y análisis financiero</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header móvil */}
            <div className="text-center lg:hidden mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-4 shadow-lg p-2">
                <Logo size="md" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">BakerySoft</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sistema de Gestión para Panaderías</p>
            </div>

            {/* Formulario principal */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-gray-700/30">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Iniciar Sesión</h3>
                <p className="text-gray-600 dark:text-gray-400">Accede a tu cuenta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Usuario */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Usuario o Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="Ingresa tu usuario o email"
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="Ingresa tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                {/* Botón de login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-300 disabled:to-orange-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar Sesión
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">o</span>
                  </div>
                </div>

                {/* Link a registro */}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="w-full text-center py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 font-medium"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </button>
              </form>
            </div>

            {/* Usuarios de demostración */}
            <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/30 dark:border-gray-700/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                🚀 Prueba con usuarios demo
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {demoUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => loginWithDemo(user.username, user.password)}
                    className={`p-3 bg-gradient-to-r ${user.color} hover:shadow-lg text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-white/30">
                        <img 
                          src={user.photo} 
                          alt={user.role}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-sm">{user.role}</p>
                      <p className="text-xs opacity-90">{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Haz click en cualquier usuario para acceder instantáneamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;