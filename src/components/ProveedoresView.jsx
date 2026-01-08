import { useApp } from '../hooks/useApp';

const ProveedoresView = () => {
  const { state } = useApp();
  const { materiasPrimas } = state;
  
  // Obtener proveedores únicos con sus productos
  const proveedoresData = [...new Set(materiasPrimas.map(m => m.proveedor))].map(proveedor => {
    const productos = materiasPrimas.filter(m => m.proveedor === proveedor);
    const productosOptimos = productos.filter(p => p.estado === 'Óptimo').length;
    const productosBajos = productos.filter(p => p.estado === 'Bajo').length;
    const productosCriticos = productos.filter(p => p.estado === 'Crítico').length;
    
    return {
      nombre: proveedor,
      productos,
      totalProductos: productos.length,
      productosOptimos,
      productosBajos,
      productosCriticos,
      // Simular datos adicionales
      telefono: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `contacto@${proveedor.toLowerCase().replace(/\s+/g, '')}.com`,
      direccion: `Calle ${Math.floor(Math.random() * 999) + 1}, Ciudad Industrial`
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Proveedores</h2>
        <p className="text-gray-600 dark:text-gray-300">Información y estado de todos los proveedores activos</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proveedores</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{proveedoresData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Proveedores Activos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{proveedoresData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productos Suministrados</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{materiasPrimas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de proveedores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proveedoresData.map((proveedor, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            {/* Header del proveedor */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{proveedor.nombre}</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center">
                    <span className="mr-2">📞</span>
                    {proveedor.telefono}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">✉️</span>
                    {proveedor.email}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📍</span>
                    {proveedor.direccion}
                  </p>
                </div>
              </div>
              
              {/* Estado general */}
              <div className="text-right">
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                  Activo
                </span>
              </div>
            </div>

            {/* Estadísticas de productos */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Productos Suministrados ({proveedor.totalProductos})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{proveedor.productosOptimos}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Óptimo</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{proveedor.productosBajos}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Bajo</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{proveedor.productosCriticos}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Crítico</div>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Productos:</h4>
              <div className="flex flex-wrap gap-2">
                {proveedor.productos.map((producto, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full ${
                      producto.estado === 'Óptimo' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      producto.estado === 'Bajo' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {producto.nombre}
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Ver Detalles
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Contactar
              </button>
              {proveedor.productosCriticos > 0 && (
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Pedido Urgente
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProveedoresView;