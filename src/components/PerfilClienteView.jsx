import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNotifications } from '../context/NotificationContext';
import ProfileAvatar from './ProfileAvatar';

const PerfilClienteView = () => {
  const { state, updateUser } = useApp();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    telefono: '+1234567890',
    direccion: 'Calle Principal 123, Ciudad',
    fechaNacimiento: '1990-01-01',
    preferencias: {
      notificaciones: true,
      ofertas: true,
      newsletter: false,
      metodoPago: 'efectivo'
    }
  });

  const handleSave = () => {
    // Actualizar usuario en el contexto
    const updatedUser = {
      ...state.currentUser,
      name: formData.name,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      fechaNacimiento: formData.fechaNacimiento,
      preferencias: formData.preferencias
    };

    updateUser(updatedUser);

    addNotification({
      type: 'success',
      title: 'Perfil Actualizado',
      message: 'Tu información ha sido guardada exitosamente',
    });
    setIsEditing(false);
  };

  const pedidosRecientes = [
    {
      id: 'PED-001',
      fecha: '2024-01-07',
      productos: ['Pan Integral', 'Croissant', 'Café Americano'],
      total: 8.75,
      estado: 'Entregado',
      calificacion: 5
    },
    {
      id: 'PED-002',
      fecha: '2024-01-05',
      productos: ['Torta de Chocolate', 'Pan Francés'],
      total: 21.50,
      estado: 'Entregado',
      calificacion: 4
    },
    {
      id: 'PED-003',
      fecha: '2024-01-03',
      productos: ['Empanadas de Pollo', 'Muffin de Arándanos'],
      total: 7.50,
      estado: 'Entregado',
      calificacion: 5
    },
    {
      id: 'PED-004',
      fecha: '2024-01-08',
      productos: ['Croissant', 'Café Americano', 'Pan Integral'],
      total: 8.75,
      estado: 'En preparación',
      calificacion: null
    }
  ];

  const calcularEstadisticas = () => {
    const totalPedidos = pedidosRecientes.length;
    const totalGastado = pedidosRecientes.reduce((sum, pedido) => sum + pedido.total, 0);
    const pedidosEntregados = pedidosRecientes.filter(p => p.estado === 'Entregado').length;
    const promedioCalificacion = pedidosRecientes
      .filter(p => p.calificacion)
      .reduce((sum, p, _, arr) => sum + p.calificacion / arr.length, 0);
    
    return {
      totalPedidos,
      totalGastado,
      pedidosEntregados,
      promedioCalificacion: promedioCalificacion.toFixed(1),
      puntosAcumulados: Math.floor(totalGastado * 10) // 10 puntos por cada dólar
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Perfil
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Información Personal
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <ProfileAvatar user={state.currentUser} size="xl" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {state.currentUser?.name}
                  </h4>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">Cliente Premium</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Miembro desde {new Date(state.currentUser?.registrationDate || '2024-01-01').toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas del Cliente */}
        <div className="space-y-6">
          {/* Resumen */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resumen de Cuenta
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pedidos Realizados</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalPedidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Gastado</span>
                <span className="font-semibold text-gray-900 dark:text-white">${stats.totalGastado.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Puntos Acumulados</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{stats.puntosAcumulados}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calificación Promedio</span>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{stats.promedioCalificacion}</span>
                  <span className="text-yellow-500">⭐</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nivel</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                  Premium
                </span>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preferencias
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferencias.notificaciones}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferencias: {...formData.preferencias, notificaciones: e.target.checked}
                  })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Notificaciones de pedidos
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferencias.ofertas}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferencias: {...formData.preferencias, ofertas: e.target.checked}
                  })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Ofertas especiales
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferencias.newsletter}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferencias: {...formData.preferencias, newsletter: e.target.checked}
                  })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Newsletter semanal
                </span>
              </label>
              
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pago Preferido
                </label>
                <select
                  value={formData.preferencias.metodoPago}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferencias: {...formData.preferencias, metodoPago: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Pedidos */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Historial de Pedidos
          </h3>
          <div className="space-y-4">
            {pedidosRecientes.map(pedido => (
              <div key={pedido.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Pedido {pedido.id}
                      </h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.estado === 'Entregado' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : pedido.estado === 'En preparación'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {pedido.productos.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(pedido.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      ${pedido.total.toFixed(2)}
                    </p>
                    {pedido.calificacion && (
                      <div className="flex items-center justify-end space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < pedido.calificacion ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}
                    {pedido.estado === 'Entregado' && !pedido.calificacion && (
                      <button className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
                        Calificar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilClienteView;