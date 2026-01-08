import { useState } from 'react';
import { useOrders, useInventory } from '../hooks/useApp';

const PedidosView = () => {
  const { pedidos, addPedido, updatePedido, deletePedido } = useOrders();
  const { materiasPrimas } = useInventory();
  const [showNewPedido, setShowNewPedido] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Estados de pedidos
  const estados = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    en_proceso: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800' },
    entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  };

  // Proveedores únicos de materias primas
  const proveedores = [...new Set(materiasPrimas.map(m => m.proveedor))];

  // Filtrar pedidos
  const pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtroEstado);

  // Contar pedidos por estado
  const contarPorEstado = (estado) => {
    return pedidos.filter(p => p.estado === estado).length;
  };

  // Productos que necesitan pedido urgente
  const productosUrgentes = materiasPrimas.filter(m => 
    m.estado === 'Crítico' || m.estado === 'Bajo'
  );

  const NewPedidoModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      proveedor: '',
      productos: [],
      observaciones: '',
      fechaEntregaEsperada: ''
    });
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(0);

    const agregarProducto = () => {
      if (!productoSeleccionado || cantidadSeleccionada <= 0) return;

      const materia = materiasPrimas.find(m => m.id === parseInt(productoSeleccionado));
      if (!materia) return;

      const precioEstimado = {
        'kg': 2.5,
        'litros': 3.0,
        'unidades': 0.15
      };

      const producto = {
        materiaId: materia.id,
        nombre: materia.nombre,
        cantidad: cantidadSeleccionada,
        unidad: materia.unidad,
        precioUnitario: precioEstimado[materia.unidad] || 2.0,
        total: cantidadSeleccionada * (precioEstimado[materia.unidad] || 2.0)
      };

      setFormData(prev => ({
        ...prev,
        productos: [...prev.productos, producto]
      }));

      setProductoSeleccionado('');
      setCantidadSeleccionada(0);
    };

    const eliminarProducto = (index) => {
      setFormData(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== index)
      }));
    };

    const calcularTotal = () => {
      return formData.productos.reduce((sum, p) => sum + p.total, 0);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.proveedor || formData.productos.length === 0) return;

      const nuevoPedido = {
        ...formData,
        total: calcularTotal(),
        estado: 'pendiente',
        fechaPedido: new Date().toISOString().split('T')[0]
      };

      addPedido(nuevoPedido);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Pedido</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Proveedor *
                  </label>
                  <select
                    value={formData.proveedor}
                    onChange={(e) => setFormData(prev => ({ ...prev, proveedor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map(proveedor => (
                      <option key={proveedor} value={proveedor}>{proveedor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha de Entrega Esperada
                  </label>
                  <input
                    type="date"
                    value={formData.fechaEntregaEsperada}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaEntregaEsperada: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Agregar productos */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agregar Productos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Seleccionar producto</option>
                    {materiasPrimas
                      .filter(m => formData.proveedor === '' || m.proveedor === formData.proveedor)
                      .map(materia => (
                        <option key={materia.id} value={materia.id}>
                          {materia.nombre} ({materia.estado})
                        </option>
                      ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={cantidadSeleccionada}
                    onChange={(e) => setCantidadSeleccionada(parseInt(e.target.value) || 0)}
                    placeholder="Cantidad"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={agregarProducto}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                {/* Lista de productos agregados */}
                {formData.productos.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">Productos en el pedido:</h5>
                    {formData.productos.map((producto, index) => (
                      <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{producto.nombre}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">
                            {producto.cantidad} {producto.unidad} × ${producto.precioUnitario.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">${producto.total.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="text-right font-bold text-lg text-gray-900 dark:text-white">
                      Total: ${calcularTotal().toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Instrucciones especiales, condiciones de entrega, etc."
                />
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Crear Pedido
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Pedidos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Total de pedidos: <span className="font-semibold">{pedidosFiltrados.length}</span>
          </p>
        </div>
        <button
          onClick={() => setShowNewPedido(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Nuevo Pedido
        </button>
      </div>

      {/* Alertas de productos urgentes */}
      {productosUrgentes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">¡Atención!</span> Tienes {productosUrgentes.length} producto(s) que necesitan pedido urgente.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {productosUrgentes.slice(0, 3).map(producto => (
                  <span key={producto.id} className="inline-flex px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded">
                    {producto.nombre}
                  </span>
                ))}
                {productosUrgentes.length > 3 && (
                  <span className="text-xs text-red-600 dark:text-red-400">+{productosUrgentes.length - 3} más</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroEstado === 'todos'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Todos ({pedidos.length})
        </button>
        {Object.entries(estados).map(([estado, config]) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroEstado === estado
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {config.label} ({contarPorEstado(estado)})
          </button>
        ))}
      </div>

      {/* Tabla de pedidos */}
      {pedidosFiltrados.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
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
                {pedidosFiltrados.map(pedido => (
                  <tr key={pedido.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {pedido.proveedor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs">
                        {pedido.productos.slice(0, 2).map((producto, index) => (
                          <div key={index} className="truncate">
                            {producto.nombre} ({producto.cantidad} {producto.unidad})
                          </div>
                        ))}
                        {pedido.productos.length > 2 && (
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            +{pedido.productos.length - 2} más
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${pedido.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estados[pedido.estado].color}`}>
                        {estados[pedido.estado].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                      >
                        Ver
                      </button>
                      {pedido.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => updatePedido({ ...pedido, estado: 'en_proceso' })}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Procesar
                          </button>
                          <button
                            onClick={() => deletePedido(pedido.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {pedido.estado === 'en_proceso' && (
                        <button
                          onClick={() => updatePedido({ ...pedido, estado: 'entregado' })}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Marcar Entregado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay pedidos</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filtroEstado === 'todos' 
              ? 'Comienza creando tu primer pedido.'
              : `No hay pedidos con estado "${estados[filtroEstado]?.label}".`
            }
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowNewPedido(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Crear Primer Pedido
            </button>
          </div>
        </div>
      )}

      {/* Modal de nuevo pedido */}
      {showNewPedido && (
        <NewPedidoModal onClose={() => setShowNewPedido(false)} />
      )}

      {/* Modal de detalle de pedido */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle del Pedido</h3>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{pedidoSeleccionado.proveedor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${estados[pedidoSeleccionado.estado].color}`}>
                      {estados[pedidoSeleccionado.estado].label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Pedido</label>
                    <p className="text-gray-900 dark:text-white">{new Date(pedidoSeleccionado.fechaPedido).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Entrega</label>
                    <p className="text-gray-900 dark:text-white">{pedidoSeleccionado.fechaEntregaEsperada ? new Date(pedidoSeleccionado.fechaEntregaEsperada).toLocaleDateString('es-ES') : 'No especificada'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Productos</label>
                  <div className="space-y-2">
                    {pedidoSeleccionado.productos.map((producto, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{producto.nombre}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {producto.cantidad} {producto.unidad} × ${producto.precioUnitario.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">${producto.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    Total: ${pedidoSeleccionado.total.toFixed(2)}
                  </div>
                </div>

                {pedidoSeleccionado.observaciones && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                    <p className="text-gray-600 dark:text-gray-400">{pedidoSeleccionado.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosView;