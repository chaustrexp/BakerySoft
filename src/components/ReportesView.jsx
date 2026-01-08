import { useState } from 'react';
import { useApp } from '../hooks/useApp';

const ReportesView = () => {
  const { state } = useApp();
  const { materiasPrimas } = state;
  const [selectedReport, setSelectedReport] = useState('inventario');
  const [dateRange, setDateRange] = useState('30');

  // Calcular estadísticas para reportes
  const stats = {
    totalProductos: materiasPrimas.length,
    productosOptimos: materiasPrimas.filter(m => m.estado === 'Óptimo').length,
    productosBajos: materiasPrimas.filter(m => m.estado === 'Bajo').length,
    productosCriticos: materiasPrimas.filter(m => m.estado === 'Crítico').length,
    valorTotal: materiasPrimas.reduce((total, materia) => {
      const precioEstimado = { 'kg': 2.5, 'litros': 3.0, 'unidades': 0.15 };
      return total + (materia.cantidad * (precioEstimado[materia.unidad] || 2.0));
    }, 0)
  };

  const reportTypes = [
    { id: 'inventario', name: 'Reporte de Inventario', icon: '📦' },
    { id: 'movimientos', name: 'Movimientos de Stock', icon: '📊' },
    { id: 'proveedores', name: 'Análisis de Proveedores', icon: '🏢' },
    { id: 'costos', name: 'Análisis de Costos', icon: '💰' },
    { id: 'prediccion', name: 'Predicción de Demanda', icon: '🔮' }
  ];

  const generateReport = () => {
    alert(`Generando reporte: ${reportTypes.find(r => r.id === selectedReport)?.name}\nPeriodo: Últimos ${dateRange} días`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reportes y Análisis</h2>
            <p className="text-gray-600 dark:text-gray-300">Genera reportes detallados del sistema</p>
          </div>
          <button
            onClick={generateReport}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración del Reporte</h3>
            
            {/* Tipo de reporte */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tipo de Reporte</label>
              <div className="space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                      selectedReport === report.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{report.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{report.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de fechas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 3 meses</option>
                <option value="365">Último año</option>
              </select>
            </div>

            {/* Formato de exportación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Formato</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-center">
                  <div className="text-lg mb-1">📄</div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">PDF</div>
                </button>
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-center">
                  <div className="text-lg mb-1">📊</div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">Excel</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa del reporte */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Vista Previa del Reporte</h3>
            
            {/* Estadísticas generales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalProductos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Productos</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.productosOptimos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Stock Óptimo</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.productosCriticos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Stock Crítico</div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">${stats.valorTotal.toFixed(0)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Valor Total</div>
              </div>
            </div>

            {/* Gráfico simulado */}
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Distribución del Inventario</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stock Óptimo</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.productosOptimos / stats.totalProductos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {Math.round((stats.productosOptimos / stats.totalProductos) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stock Bajo</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(stats.productosBajos / stats.totalProductos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {Math.round((stats.productosBajos / stats.totalProductos) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Stock Crítico</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(stats.productosCriticos / stats.totalProductos) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                      {Math.round((stats.productosCriticos / stats.totalProductos) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de productos críticos */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Productos que Requieren Atención</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock Actual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Proveedor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {materiasPrimas
                      .filter(m => m.estado === 'Crítico' || m.estado === 'Bajo')
                      .slice(0, 5)
                      .map((producto) => (
                        <tr key={producto.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {producto.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {producto.cantidad} {producto.unidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              producto.estado === 'Crítico' 
                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {producto.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {producto.proveedor}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesView;