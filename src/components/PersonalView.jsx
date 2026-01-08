import { useState } from 'react';
import { useEmployees } from '../hooks/useApp';
import { EditEmpleadoModal } from './modals/EditEmpleadoModal';
import { NewEmpleadoModal } from './modals/NewEmpleadoModal';
import ProfileAvatar from './ProfileAvatar';

const PersonalView = () => {
  const { empleados, departamentos } = useEmployees();
  const [vistaActiva, setVistaActiva] = useState('empleados');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const vistas = [
    { id: 'empleados', nombre: 'Empleados', icon: '👥' },
    { id: 'asistencia', nombre: 'Asistencia', icon: '⏰' },
    { id: 'nomina', nombre: 'Nómina', icon: '💰' },
    { id: 'evaluaciones', nombre: 'Evaluaciones', icon: '📊' },
    { id: 'capacitaciones', nombre: 'Capacitaciones', icon: '🎓' }
  ];

  const renderEmpleados = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Empleados</h3>
        <button 
          onClick={() => setShowNewModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Nuevo Empleado
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Empleados</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{empleados.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {empleados.filter(e => e.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departamentos</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{departamentos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nómina Mensual</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${empleados.reduce((sum, e) => sum + e.salario, 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de empleados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleados.map((empleado) => (
          <div key={empleado.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{empleado.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{empleado.nombre} {empleado.apellido}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{empleado.codigo}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                empleado.estado === 'activo' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
              }`}>
                {empleado.estado}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Puesto:</span>
                <span className="font-medium text-gray-900 dark:text-white">{empleado.puesto}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Departamento:</span>
                <span className="font-medium text-gray-900 dark:text-white">{empleado.departamento}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Salario:</span>
                <span className="font-medium text-green-600 dark:text-green-400">${empleado.salario.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Ingreso:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(empleado.fechaIngreso).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setEmpleadoSeleccionado(empleado)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Ver Perfil
              </button>
              <button
                onClick={() => {
                  setEmpleadoSeleccionado(empleado);
                  setShowEditModal(true);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de perfil de empleado */}
      {empleadoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                    <span className="text-3xl">{empleadoSeleccionado.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{empleadoSeleccionado.puesto}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmpleadoSeleccionado(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información personal */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información Personal</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Código:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.codigo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dirección:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.direccion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nacimiento:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(empleadoSeleccionado.fechaNacimiento).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información laboral */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información Laboral</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Departamento:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.departamento}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Puesto:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{empleadoSeleccionado.puesto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Salario:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">${empleadoSeleccionado.salario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo Contrato:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{empleadoSeleccionado.tipoContrato}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fecha Ingreso:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(empleadoSeleccionado.fechaIngreso).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Horario de Trabajo</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {Object.entries(empleadoSeleccionado.horario).map(([dia, horario]) => (
                    <div key={dia} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{dia}</p>
                      {horario.descanso ? (
                        <p className="text-gray-500 dark:text-gray-400">Descanso</p>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{horario.entrada} - {horario.salida}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAsistencia = () => {
    const { asistencia } = useEmployees();
    
    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Control de Asistencia</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Registrar Asistencia
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {asistencia.map((registro) => {
                const empleado = empleados.find(e => e.id === registro.empleadoId);
                return (
                  <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm">{empleado?.avatar}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{empleado?.nombre} {empleado?.apellido}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{empleado?.puesto}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(registro.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {registro.entrada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {registro.salida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {registro.horasTrabajadas.toFixed(2)}h
                      {registro.horasExtras > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">(+{registro.horasExtras.toFixed(2)}h)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        registro.estado === 'presente' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                        registro.estado === 'tarde' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}>
                        {registro.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  };

  const renderNomina = () => {
    const { nomina } = useEmployees();
    
    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Nómina</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Calcular Nómina
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nomina.map((registro) => {
          const empleado = empleados.find(e => e.id === registro.empleadoId);
          return (
            <div key={registro.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                    <span className="text-lg">{empleado?.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{empleado?.nombre} {empleado?.apellido}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Período: {registro.periodo}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  registro.estado === 'calculado' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                  registro.estado === 'pagado' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                  'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                }`}>
                  {registro.estado}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Salario Base:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${registro.salarioBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas Extras ({registro.horasExtras}h):</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    +${(registro.horasExtras * registro.valorHoraExtra).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bonificaciones:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+${registro.bonificaciones.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Seguro Social:</span>
                    <span className="text-red-600 dark:text-red-400">-${registro.deducciones.seguroSocial.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                    <span className="text-red-600 dark:text-red-400">-${registro.deducciones.impuestos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Otros:</span>
                    <span className="text-red-600 dark:text-red-400">-${registro.deducciones.otros.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">Salario Neto:</span>
                    <span className="text-green-600 dark:text-green-400">${registro.salarioNeto.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Ver Detalle
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Generar Recibo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  };

  const renderVistaActiva = () => {
    switch (vistaActiva) {
      case 'empleados':
        return renderEmpleados();
      case 'asistencia':
        return renderAsistencia();
      case 'nomina':
        return renderNomina();
      case 'evaluaciones':
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Módulo de evaluaciones en desarrollo</div>;
      case 'capacitaciones':
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Módulo de capacitaciones en desarrollo</div>;
      default:
        return renderEmpleados();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Navegación de pestañas */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {vistas.map((vista) => (
              <button
                key={vista.id}
                onClick={() => setVistaActiva(vista.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${
                  vistaActiva === vista.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span>{vista.icon}</span>
                <span>{vista.nombre}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido de la vista activa */}
      {renderVistaActiva()}

      {/* Modales */}
      {showNewModal && (
        <NewEmpleadoModal onClose={() => setShowNewModal(false)} />
      )}
      
      {showEditModal && empleadoSeleccionado && (
        <EditEmpleadoModal
          empleado={empleadoSeleccionado}
          onClose={() => {
            setShowEditModal(false);
            setEmpleadoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default PersonalView;