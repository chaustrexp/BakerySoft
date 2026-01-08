import { useState } from 'react';
import { useApp } from '../hooks/useApp';

const ProduccionView = () => {
  const { state } = useApp();
  const { recetas, planProduccion, controlCalidad, hornos, productos } = state;
  const [vistaActiva, setVistaActiva] = useState('planificacion');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [showNewReceta, setShowNewReceta] = useState(false);

  const vistas = [
    { id: 'planificacion', nombre: 'Planificación', icon: '📅' },
    { id: 'recetas', nombre: 'Recetas', icon: '📝' },
    { id: 'calidad', nombre: 'Control de Calidad', icon: '✅' },
    { id: 'hornos', nombre: 'Hornos', icon: '🔥' }
  ];

  const renderPlanificacion = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Plan de Producción</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Nuevo Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {planProduccion.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(plan.fecha).toLocaleDateString('es-ES')}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Turno: {plan.turno}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                plan.estado === 'completado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                plan.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {plan.estado.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3">
              {plan.productos.map((item, index) => {
                const producto = productos.find(p => p.id === item.productoId);
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{producto?.imagen}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{producto?.nombre}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.cantidad} unidades • {item.horaInicio} - {item.horaFin}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Horno {item.horno}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.responsable}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {plan.notas && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">{plan.notas}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecetas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Libro de Recetas</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Nueva Receta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recetas.map((receta) => (
          <div key={receta.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{receta.nombre}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{receta.categoria}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                receta.dificultad === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                receta.dificultad === 'media' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              }`}>
                {receta.dificultad}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{receta.rendimiento}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unidades</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{receta.tiempoPreparacion + receta.tiempoCoccion}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Min Total</p>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Ingredientes:</h5>
              <div className="space-y-1">
                {receta.ingredientes.slice(0, 3).map((ing, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {ing.agua ? 'Agua' : `Ingrediente ${ing.materiaId}`}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{ing.cantidad} {ing.unidad}</span>
                  </div>
                ))}
                {receta.ingredientes.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">+{receta.ingredientes.length - 3} más...</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Costo por unidad:</p>
                <p className="font-bold text-green-600 dark:text-green-400">${receta.costoPorUnidad.toFixed(2)}</p>
              </div>
              <button
                onClick={() => setRecetaSeleccionada(receta)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de receta detallada */}
      {recetaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{recetaSeleccionada.nombre}</h3>
                <button
                  onClick={() => setRecetaSeleccionada(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{recetaSeleccionada.rendimiento}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unidades</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{recetaSeleccionada.tiempoPreparacion}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Min Prep</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{recetaSeleccionada.temperaturaHorno}°C</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Horno</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ingredientes:</h4>
                <div className="space-y-2">
                  {recetaSeleccionada.ingredientes.map((ing, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-700 dark:text-gray-300">
                        {ing.agua ? 'Agua' : `Ingrediente ${ing.materiaId}`}
                      </span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900 dark:text-white">{ing.cantidad} {ing.unidad}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">${ing.costo.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Instrucciones:</h4>
                <ol className="space-y-2">
                  {recetaSeleccionada.instrucciones.map((paso, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white text-sm rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{paso}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {recetaSeleccionada.notas && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Notas:</h4>
                  <p className="text-yellow-700 dark:text-yellow-400">{recetaSeleccionada.notas}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Costo total: ${recetaSeleccionada.costoTotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Por unidad: ${recetaSeleccionada.costoPorUnidad.toFixed(2)}</p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                  Programar Producción
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCalidad = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Control de Calidad</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Nueva Inspección
        </button>
      </div>

      <div className="space-y-4">
        {controlCalidad.map((control) => {
          const producto = productos.find(p => p.id === control.productoId);
          return (
            <div key={control.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{producto?.imagen}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{producto?.nombre}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lote: {control.lote} • {control.cantidad} unidades
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  control.resultado === 'aprobado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  control.resultado === 'rechazado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {control.resultado}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(control.parametros).map(([key, param]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace('_', ' ')}
                    </p>
                    <p className={`text-lg font-bold ${param.cumple ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {param.valor} {param.unidad || ''}
                    </p>
                    <div className="flex items-center justify-center mt-1">
                      {param.cumple ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Inspector: {control.inspector}</span>
                <span className="text-gray-600 dark:text-gray-400">{new Date(control.fecha).toLocaleDateString('es-ES')}</span>
              </div>

              {control.observaciones && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">{control.observaciones}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHornos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Estado de Hornos</h3>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
          Programar Mantenimiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hornos.map((horno) => (
          <div key={horno.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{horno.nombre}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{horno.tipo}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                horno.estado === 'operativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                horno.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {horno.estado}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Capacidad:</span>
                <span className="font-medium text-gray-900 dark:text-white">{horno.capacidad} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Temp. Máxima:</span>
                <span className="font-medium text-gray-900 dark:text-white">{horno.temperaturaMax}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
                <span className="font-medium text-gray-900 dark:text-white">{horno.ubicacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Último Mantenimiento:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(horno.mantenimiento).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Ver Programa
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Configurar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVistaActiva = () => {
    switch (vistaActiva) {
      case 'planificacion':
        return renderPlanificacion();
      case 'recetas':
        return renderRecetas();
      case 'calidad':
        return renderCalidad();
      case 'hornos':
        return renderHornos();
      default:
        return renderPlanificacion();
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Navegación de pestañas */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {vistas.map((vista) => (
              <button
                key={vista.id}
                onClick={() => setVistaActiva(vista.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                  vistaActiva === vista.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
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
    </div>
  );
};

export default ProduccionView;