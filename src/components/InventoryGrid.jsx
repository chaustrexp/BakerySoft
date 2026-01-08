import { useState } from 'react';
import CardMateriaPrima from './CardMateriaPrima';
import { useInventory } from '../hooks/useApp';

const InventoryGrid = () => {
  const { materiasPrimas } = useInventory();
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  // Estados disponibles
  const estadosInventario = {
    OPTIMO: 'Óptimo',
    BAJO: 'Bajo',
    CRITICO: 'Crítico'
  };

  // Filtrar materias primas según el estado seleccionado
  const materiasFiltradas = filtroEstado === 'Todos' 
    ? materiasPrimas 
    : materiasPrimas.filter(materia => materia.estado === filtroEstado);

  // Contar materias por estado
  const contarPorEstado = (estado) => {
    return materiasPrimas.filter(materia => materia.estado === estado).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filtros y estadísticas */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inventario de Materias Primas</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Total de productos: <span className="font-semibold">{materiasFiltradas.length}</span>
              {filtroEstado !== 'Todos' && (
                <span className="ml-2 text-sm">
                  (filtrado por: <span className="font-semibold">{filtroEstado}</span>)
                </span>
              )}
            </p>
          </div>

          {/* Filtro por estado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('Todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtroEstado === 'Todos'
                  ? 'bg-gray-900 dark:bg-gray-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos ({materiasPrimas.length})
            </button>
            <button
              onClick={() => setFiltroEstado(estadosInventario.OPTIMO)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtroEstado === estadosInventario.OPTIMO
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
              }`}
            >
              Óptimo ({contarPorEstado(estadosInventario.OPTIMO)})
            </button>
            <button
              onClick={() => setFiltroEstado(estadosInventario.BAJO)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtroEstado === estadosInventario.BAJO
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800'
              }`}
            >
              Bajo ({contarPorEstado(estadosInventario.BAJO)})
            </button>
            <button
              onClick={() => setFiltroEstado(estadosInventario.CRITICO)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filtroEstado === estadosInventario.CRITICO
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
              }`}
            >
              Crítico ({contarPorEstado(estadosInventario.CRITICO)})
            </button>
          </div>
        </div>

        {/* Alertas para estados críticos */}
        {contarPorEstado(estadosInventario.CRITICO) > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <span className="font-medium">¡Atención!</span> Tienes {contarPorEstado(estadosInventario.CRITICO)} producto(s) en estado crítico que requieren pedido urgente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid de tarjetas */}
      {materiasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiasFiltradas.map((materia) => (
            <CardMateriaPrima
              key={materia.id}
              nombre={materia.nombre}
              cantidad={materia.cantidad}
              unidad={materia.unidad}
              estado={materia.estado}
              proveedor={materia.proveedor}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No se encontraron materias primas con el filtro seleccionado.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;