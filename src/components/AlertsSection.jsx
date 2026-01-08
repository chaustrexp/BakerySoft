const AlertsSection = ({ productosUrgentes, productosOptimos }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Productos que requieren atención */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Productos Críticos</h3>
          <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-3 py-1 rounded-full">
            {productosUrgentes.length} productos
          </span>
        </div>
        
        {productosUrgentes.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {productosUrgentes.map((producto) => (
              <div 
                key={producto.id} 
                className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                  producto.estado === 'Crítico' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 hover:bg-red-100 dark:hover:bg-red-900/30' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{producto.nombre}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    producto.estado === 'Crítico' 
                      ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' 
                      : 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {producto.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stock: <span className="font-medium">{producto.cantidad} {producto.unidad}</span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {producto.proveedor}
                  </span>
                </div>
                
                {/* Barra de progreso del stock */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        producto.estado === 'Crítico' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${Math.min((producto.cantidad / producto.stockMaximo) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Mín: {producto.stockMinimo}</span>
                    <span>Máx: {producto.stockMaximo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">¡Excelente!</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No hay productos que requieran atención inmediata.</p>
          </div>
        )}
      </div>

      {/* Productos con mejor rendimiento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Stock Óptimo</h3>
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full">
            {productosOptimos.length} productos
          </span>
        </div>
        
        {productosOptimos.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {productosOptimos.slice(0, 5).map((producto) => (
              <div 
                key={producto.id} 
                className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{producto.nombre}</h4>
                  <span className="bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold px-2 py-1 rounded">
                    Óptimo
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stock: <span className="font-medium text-green-700 dark:text-green-300">{producto.cantidad} {producto.unidad}</span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {producto.proveedor}
                  </span>
                </div>
                
                {/* Barra de progreso del stock */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ 
                        width: `${Math.min((producto.cantidad / producto.stockMaximo) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Mín: {producto.stockMinimo}</span>
                    <span>Máx: {producto.stockMaximo}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {productosOptimos.length > 5 && (
              <div className="text-center pt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  y {productosOptimos.length - 5} productos más con stock óptimo
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Sin productos óptimos</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Actualmente no hay productos con stock óptimo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsSection;