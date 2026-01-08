import { useState } from 'react';
import { useApp } from '../hooks/useApp';

const POSView = () => {
  const { state } = useApp();
  const { productos, categorias } = state;
  const { metodsPago } = state;
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [cliente, setCliente] = useState(null);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [descuento, setDescuento] = useState(0);

  // Filtrar productos por categoría
  const productosFiltrados = categoriaActiva === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaActiva);

  // Calcular totales
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalDescuento = subtotal * (descuento / 100);
  const impuestos = (subtotal - totalDescuento) * 0.1; // 10% IVA
  const total = subtotal - totalDescuento + impuestos;

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter(item => item.id !== id));
    } else {
      setCarrito(carrito.map(item => 
        item.id === id ? { ...item, cantidad } : item
      ));
    }
  };

  const procesarVenta = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const venta = {
      fecha: new Date().toISOString(),
      productos: carrito.map(item => ({
        productoId: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.precio * item.cantidad
      })),
      subtotal,
      descuento: totalDescuento,
      impuestos,
      total,
      metodoPago,
      cliente: cliente || { nombre: 'Cliente General' }
    };

    alert(`Venta procesada exitosamente!\nTotal: $${total.toFixed(2)}\nMétodo: ${metodoPago}`);
    
    // Limpiar carrito
    setCarrito([]);
    setCliente(null);
    setDescuento(0);
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Panel de productos */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Filtros de categoría */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaActiva('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                categoriaActiva === 'todos'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaActiva(categoria.nombre)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  categoriaActiva === categoria.nombre
                    ? 'bg-amber-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{categoria.icon}</span>
                <span>{categoria.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productosFiltrados.map((producto) => (
            <button
              key={producto.id}
              onClick={() => agregarAlCarrito(producto)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left border border-gray-200 dark:border-gray-700"
            >
              <div className="text-4xl mb-2 text-center">{producto.imagen}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                {producto.nombre}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{producto.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  ${producto.precio.toFixed(2)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  categorias.find(c => c.nombre === producto.categoria)?.color || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {producto.categoria}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel del carrito */}
      <div className="w-96 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header del carrito */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Carrito de Compras</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{carrito.length} productos</p>
        </div>

        {/* Items del carrito */}
        <div className="flex-1 overflow-y-auto p-4">
          {carrito.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 dark:text-gray-400">Carrito vacío</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Selecciona productos para agregar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {carrito.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{item.imagen}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.nombre}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">${item.precio.toFixed(2)} c/u</p>
                      </div>
                    </div>
                    <button
                      onClick={() => actualizarCantidad(item.id, 0)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center text-gray-700 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de pago */}
        {carrito.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {/* Cliente */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cliente</label>
              <input
                type="text"
                placeholder="Nombre del cliente (opcional)"
                value={cliente?.nombre || ''}
                onChange={(e) => setCliente({ nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Descuento */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descuento (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Método de pago */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {metodsPago.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.icon} {metodo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Resumen */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Descuento ({descuento}%):</span>
                  <span>-${totalDescuento.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Impuestos (10%):</span>
                <span>${impuestos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-600 pt-2 text-gray-900 dark:text-white">
                <span>Total:</span>
                <span className="text-amber-600 dark:text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de pago */}
            <button
              onClick={procesarVenta}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Procesar Venta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSView;