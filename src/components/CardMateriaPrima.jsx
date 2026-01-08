const CardMateriaPrima = ({ nombre, cantidad, unidad, estado, proveedor }) => {
  // Configuración de colores según el estado
  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'Óptimo':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          textColor: 'text-green-800 dark:text-green-200',
          badgeColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'Bajo':
        return {
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          badgeColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'Crítico':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          textColor: 'text-red-800 dark:text-red-200',
          badgeColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          textColor: 'text-gray-800 dark:text-gray-200',
          badgeColor: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const config = getEstadoConfig(estado);

  // Función para manejar el botón "Pedir Urgente"
  const handlePedirUrgente = () => {
    alert(`¡Pedido urgente solicitado para ${nombre}!\n\nProveedor: ${proveedor}\nCantidad actual: ${cantidad} ${unidad}\n\nSe ha enviado la solicitud al proveedor.`);
  };

  // Función para mostrar detalles
  const handleVerDetalles = () => {
    alert(`Detalles de ${nombre}:\n\nCantidad: ${cantidad} ${unidad}\nEstado: ${estado}\nProveedor: ${proveedor}`);
  };

  // Función para revisar stock
  const handleRevisar = () => {
    alert(`Revisión programada para ${nombre}\n\nSe ha agregado a la lista de revisión del inventario.`);
  };

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{nombre}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{cantidad}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{unidad}</span>
          </div>
        </div>
        
        {/* Badge de estado */}
        <span className={`${config.badgeColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
          {estado}
        </span>
      </div>

      {/* Información del proveedor */}
      <div className="mb-6">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
          </svg>
          <span className="text-sm font-medium">{proveedor}</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={handleVerDetalles}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Detalles
          </button>
          <button
            onClick={handleRevisar}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Revisar
          </button>
        </div>
        
        {/* Botón Pedir Urgente - solo visible para estados Bajo y Crítico */}
        {(estado === 'Bajo' || estado === 'Crítico') && (
          <button
            onClick={handlePedirUrgente}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pedir Urgente
          </button>
        )}
      </div>
    </div>
  );
};

export default CardMateriaPrima;