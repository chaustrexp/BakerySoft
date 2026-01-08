const ChartSection = ({ data }) => {
  // Datos para el gráfico circular simulado
  const chartData = [
    { label: 'Óptimo', value: data.optimo, color: 'bg-green-500', percentage: data.porcentajeOptimo },
    { label: 'Bajo', value: data.bajo, color: 'bg-yellow-500', percentage: data.porcentajeBajo },
    { label: 'Crítico', value: data.critico, color: 'bg-red-500', percentage: data.porcentajeCritico }
  ];

  // Crear un gráfico de dona con CSS
  const createDonutChart = () => {
    const total = data.total;
    let cumulativePercentage = 0;
    
    return chartData.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const strokeDasharray = `${percentage} ${100 - percentage}`;
      const strokeDashoffset = -cumulativePercentage;
      cumulativePercentage += percentage;
      
      return (
        <circle
          key={index}
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke={item.color.replace('bg-', '').replace('-500', '')}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000"
        />
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Gráfico de Estado del Inventario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Distribución del Inventario</h3>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Gráfico de dona simulado con barras circulares */}
            <div className="w-48 h-48 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{data.total}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Productos</div>
                </div>
              </div>
              
              {/* Anillos de progreso */}
              <div className="absolute inset-4">
                <div className="w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                <div 
                  className="absolute inset-0 w-full h-full rounded-full border-8 border-green-500 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (data.porcentajeOptimo / 100) * 50}% 0%, 100% 100%, 0% 100%)`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 ${item.color} rounded-full mr-3`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de barras de progreso */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Estado por Categoría</h3>
        
        <div className="space-y-6">
          {chartData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value} productos</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className={`${item.color} h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                  style={{ width: `${item.percentage}%` }}
                >
                  <span className="text-xs font-bold text-white">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data.porcentajeOptimo}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Stock Saludable</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.porcentajeBajo + data.porcentajeCritico}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Requiere Atención</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;