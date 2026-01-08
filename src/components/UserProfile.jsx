import { useState } from 'react';
import { roles } from '../data/users';
import { useApp } from '../hooks/useApp';
import { useNotifications } from '../context/NotificationContext';
import EditProfileModal from './EditProfileModal';
import HelpModal from './HelpModal';
import ProfileAvatar from './ProfileAvatar';

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  const { updateUser } = useApp();
  const { addNotification } = useNotifications();

  const userRole = roles[user.role] || roles.employee;
  
  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Primer inicio de sesión';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES');
  };

  // Función para cambiar rol
  const handleRoleChange = (newRole) => {
    const roleData = roles[newRole];
    
    // Mostrar confirmación
    if (window.confirm(`¿Estás seguro de cambiar tu rol a ${roleData.name}?\n\nEsto cambiará tus permisos de acceso y la foto de perfil.`)) {
      const updatedUser = {
        ...user,
        role: newRole,
        permissions: getPermissionsByRole(newRole),
        profilePhoto: getRolePhoto(newRole)
      };
      
      // Actualizar el usuario
      updateUser(updatedUser);
      
      // Notificar el cambio
      addNotification({
        type: 'success',
        title: 'Rol Cambiado Exitosamente',
        message: `Ahora tienes acceso como ${roleData.name}. Tus permisos han sido actualizados.`,
        action: {
          label: 'Ver Dashboard',
          callback: () => {
            // Navegar al dashboard para mostrar los cambios
            window.location.reload();
          }
        }
      });
      
      setShowRoleSelector(false);
      setIsDropdownOpen(false);
      
      // Pequeño delay para mostrar la notificación antes de recargar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Obtener permisos por rol
  const getPermissionsByRole = (role) => {
    switch (role) {
      case 'admin':
        return ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'personal', 'pedidos', 'proveedores', 'reportes', 'usuarios'];
      case 'manager':
        return ['dashboard', 'pos', 'inventario', 'produccion', 'finanzas', 'personal', 'pedidos', 'proveedores', 'reportes'];
      case 'supervisor':
        return ['dashboard', 'pos', 'inventario', 'produccion', 'personal', 'pedidos', 'proveedores'];
      case 'employee':
        return ['dashboard', 'pos', 'inventario', 'pedidos'];
      case 'client':
        return ['productos', 'pedidos', 'perfil'];
      default:
        return ['dashboard', 'pos', 'inventario', 'pedidos'];
    }
  };

  // Obtener foto por rol
  const getRolePhoto = (role) => {
    const rolePhotos = {
      'admin': '/img/administrador.png',
      'manager': '/img/gerente.png',
      'supervisor': '/img/supervisor.jpeg',
      'employee': '/img/empleado.jpeg',
      'client': '/img/cliente.png'
    };
    return rolePhotos[role] || '/img/empleado.jpeg';
  };

  return (
    <div className="relative">
      {/* Botón del perfil */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
      >
        <ProfileAvatar user={user} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{userRole.name}</p>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              Cambiar
            </span>
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown del perfil */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600 z-50">
          {/* Header del perfil */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-600">
            <div className="flex items-center space-x-3">
              <ProfileAvatar user={user} size="lg" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${userRole.color} mt-1`}>
                  {userRole.name}
                </span>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-600">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Usuario:</span>
                <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Último acceso:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatLastLogin(user.lastLogin)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                <span className="inline-flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-green-600 dark:text-green-400">Activo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Permisos */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-600">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Permisos de Acceso</h4>
            <div className="grid grid-cols-2 gap-2">
              {user.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="p-4">
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  setShowEditProfile(true);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Editar Perfil</span>
              </button>

              <button 
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Cambiar rol sin cerrar sesión - útil para testing y demostración"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Cambiar Rol</span>
                <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Demo
                </span>
                <svg className={`w-4 h-4 transition-transform ${showRoleSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Selector de roles */}
              {showRoleSelector && (
                <div className="ml-6 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                  {Object.entries(roles).map(([roleKey, roleData]) => (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleChange(roleKey)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                        user.role === roleKey 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg">{roleData.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{roleData.name}</div>
                        <div className="text-xs opacity-75">{roleData.description}</div>
                      </div>
                      {user.role === roleKey && (
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  setShowHelp(true);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ayuda</span>
              </button>
              
              <hr className="my-2 border-gray-200 dark:border-dark-600" />
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      {/* Modal de editar perfil */}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      {/* Modal de ayuda */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};

export default UserProfile;