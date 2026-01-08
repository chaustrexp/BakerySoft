import { useState } from 'react';
import { useAuth } from '../hooks/useApp';

const EditProfileModal = ({ onClose }) => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '👤',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState({});

  const avatares = ['👤', '👨‍💼', '👩‍💼', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍💻', '👩‍💻', '🧑‍🎨', '👩‍🎨', '🧑‍⚕️'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.username.trim()) newErrors.username = 'El usuario es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (activeTab === 'password') {
      if (!formData.currentPassword) newErrors.currentPassword = 'Contraseña actual requerida';
      if (!formData.newPassword) newErrors.newPassword = 'Nueva contraseña requerida';
      if (formData.newPassword.length < 6) newErrors.newPassword = 'Mínimo 6 caracteres';
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Actualizar usuario
    const updatedUser = {
      ...user,
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatar: formData.avatar
    };

    if (activeTab === 'password' && formData.newPassword) {
      updatedUser.password = formData.newPassword;
    }

    login(updatedUser);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Avatar
        </label>
        <div className="flex flex-wrap gap-2">
          {avatares.map(avatar => (
            <button
              key={avatar}
              type="button"
              onClick={() => handleChange('avatar', avatar)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
                formData.avatar === avatar
                  ? 'bg-amber-100 dark:bg-amber-900 border-2 border-amber-500'
                  : 'bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 border-2 border-transparent'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Usuario *
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="nombre_usuario"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="tu@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Información de la Cuenta</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Rol:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">{user?.role}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Miembro desde:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">Enero 2025</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Último acceso:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('es-ES')}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Estado:</span>
            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
              Activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Cambio de Contraseña
            </h3>
            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              <p>Asegúrate de usar una contraseña segura con al menos 6 caracteres.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña Actual *
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingresa tu contraseña actual"
          />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nueva Contraseña *
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ingresa tu nueva contraseña"
          />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Nueva Contraseña *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Confirma tu nueva contraseña"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Requisitos de Contraseña</h4>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center">
            <svg className={`w-4 h-4 mr-2 ${formData.newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Al menos 6 caracteres
          </li>
          <li className="flex items-center">
            <svg className={`w-4 h-4 mr-2 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Una letra mayúscula (recomendado)
          </li>
          <li className="flex items-center">
            <svg className={`w-4 h-4 mr-2 ${/\d/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Un número (recomendado)
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">{formData.avatar}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
                <p className="text-gray-600 dark:text-gray-400">Actualiza tu información personal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'password'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Cambiar Contraseña
              </button>
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' ? renderProfileTab() : renderPasswordTab()}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-dark-600 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;