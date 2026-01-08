import { useState } from 'react';
import { useApp } from '../hooks/useApp';

const FinanzasView = () => {
  const { state } = useApp();
  const { transacciones, presupuesto, flujoEfectivo, cuentasPorCobrar, cuentasPorPagar } = state;
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [filtroTransacciones, setFiltroTransacciones] = useState('todos');
  const [showNewTransaccion, setShowNewTransaccion] = useState(false);

  // Definir categorías
  const categoriasIngreso = [
    { id: 'ventas', nombre: 'Ventas', color: 'bg-green-100 text-green-800' },
    { id: 'servicios', nombre: 'Servicios', color: 'bg-blue-100 text-blue-800' },
    { id: 'otros', nombre: 'Otros', color: 'bg-gray-100 text-gray-800' }
  ];

  const categoriasCosto = [
    { id: 'materias_primas', nombre: 'Materias Primas', color: 'bg-red-100 text-red-800' },
    { id: 'personal', nombre: 'Personal', color: 'bg-orange-100 text-orange-800' },
    { id: 'servicios', nombre: 'Servicios', color: 'bg-purple-100 text-purple-800' },
    { id: 'otros', nombre: 'Otros', color: 'bg-gray-100 text-gray-800' }
  ];

  const vistas = [
    { id: 'dashboard', nombre: 'Dashboard', icon: '📊' },
    { id: 'transacciones', nombre: 'Transacciones', icon: '💰' },
    { id: 'presupuesto', nombre: 'Presupuesto', icon: '📋' },
    { id: 'flujo', nombre: 'Flujo de Efectivo', icon: '📈' },
    { id: 'cuentas', nombre: 'Cuentas por Cobrar/Pagar', icon: '📄' }
  ];

  const renderDashboard = () => {
    const totalIngresos = transacciones
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const totalEgresos = transacciones
      .filter(t => t.tipo === 'egreso')
      .reduce((sum, t) => sum + t.monto, 0);
    
    const utilidad = totalIngresos - totalEgresos;
    const margenUtilidad = totalIngresos > 0 ? (utilidad / totalIngresos) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalIngresos.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Egresos</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalEgresos.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilidad</p>
                <p className={`text-2xl font-bold ${utilidad >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${utilidad.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Margen</p>
                <p className={`text-2xl font-bold ${margenUtilidad >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                  {margenUtilidad.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de flujo de efectivo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Flujo de Efectivo (Últimos 7 días)</h3>
          <div className="space-y-4">
            {flujoEfectivo.slice(-7).map((dia, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                    {new Date(dia.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((dia.saldoFinal / 20000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">${dia.saldoFinal.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +${dia.ingresos.toFixed(0)} -${dia.egresos.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de presupuesto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Presupuesto vs Real - Ingresos</h3>
            <div className="space-y-3">
              {Object.entries(presupuesto.ingresos).map(([key, data]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{key}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${data.real.toFixed(0)} / ${data.presupuestado.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        data.porcentaje >= 100 ? 'bg-green-500' : 
                        data.porcentaje >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(data.porcentaje, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.porcentaje.toFixed(1)}% del presupuesto</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Presupuesto vs Real - Egresos</h3>
            <div className="space-y-3">
              {Object.entries(presupuesto.egresos).map(([key, data]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${data.real.toFixed(0)} / ${data.presupuestado.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        data.porcentaje <= 75 ? 'bg-green-500' : 
                        data.porcentaje <= 90 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(data.porcentaje, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.porcentaje.toFixed(1)}% del presupuesto</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransacciones = () => {
    const transaccionesFiltradas = filtroTransacciones === 'todos' 
      ? transacciones 
      : transacciones.filter(t => t.tipo === filtroTransacciones);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Transacciones</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filtroTransacciones}
              onChange={(e) => setFiltroTransacciones(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todos">Todas</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Nueva Transacción
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transaccionesFiltradas.map((transaccion) => (
                  <tr key={transaccion.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">{transaccion.concepto}</p>
                        <p className="text-gray-500 dark:text-gray-400">{transaccion.referencia}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaccion.tipo === 'ingreso' 
                          ? categoriasIngreso.find(c => c.id === transaccion.categoria)?.color || 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : categoriasCosto.find(c => c.id === transaccion.categoria)?.color || 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {transaccion.categoria.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaccion.tipo === 'ingreso' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaccion.estado === 'confirmado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {transaccion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCuentas = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuentas por cobrar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cuentas por Cobrar</h3>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-semibold px-3 py-1 rounded-full">
              ${cuentasPorCobrar.reduce((sum, c) => sum + c.saldo, 0).toFixed(2)}
            </span>
          </div>
          <div className="space-y-3">
            {cuentasPorCobrar.map((cuenta) => (
              <div key={cuenta.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{cuenta.cliente}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    cuenta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    cuenta.estado === 'parcial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {cuenta.estado}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Factura: {cuenta.factura}</span>
                  <span>Vence: {new Date(cuenta.vencimiento).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Saldo: ${cuenta.saldo.toFixed(2)}</span>
                  <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-medium">
                    Registrar Pago
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cuentas por pagar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cuentas por Pagar</h3>
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-sm font-semibold px-3 py-1 rounded-full">
              ${cuentasPorPagar.reduce((sum, c) => sum + c.saldo, 0).toFixed(2)}
            </span>
          </div>
          <div className="space-y-3">
            {cuentasPorPagar.map((cuenta) => (
              <div key={cuenta.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{cuenta.proveedor}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    cuenta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    cuenta.estado === 'parcial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {cuenta.estado}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Factura: {cuenta.factura}</span>
                  <span>Vence: {new Date(cuenta.vencimiento).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Saldo: ${cuenta.saldo.toFixed(2)}</span>
                  <button className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-medium">
                    Pagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVistaActiva = () => {
    switch (vistaActiva) {
      case 'dashboard':
        return renderDashboard();
      case 'transacciones':
        return renderTransacciones();
      case 'presupuesto':
        return <div className="text-center py-8 text-gray-500">Módulo de presupuesto en desarrollo</div>;
      case 'flujo':
        return <div className="text-center py-8 text-gray-500">Análisis de flujo de efectivo en desarrollo</div>;
      case 'cuentas':
        return renderCuentas();
      default:
        return renderDashboard();
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
    </div>
  );
};

export default FinanzasView;