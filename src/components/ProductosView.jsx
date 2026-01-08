import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useNotifications } from '../context/NotificationContext';

const ProductosView = () => {
  const { state } = useApp();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Datos de productos simulados (en una app real vendría de la API)
  const productos = [
    {
      id: 1,
      nombre: 'Pan Integral',
      descripcion: 'Pan integral artesanal con semillas de girasol y linaza',
      precio: 3.50,
      categoria: 'panes',
      imagen: '🍞',
      tiempoPreparacion: 15,
      tiempoCoccion: 25,
      popularidad: 85,
      activo: true,
      stock: 20
    },
    {
      id: 2,
      nombre: 'Croissant de Mantequilla',
      descripcion: 'Croissant francés tradicional con mantequilla fresca',
      precio: 2.75,
      categoria: 'pasteles',
      imagen: '🥐',
      tiempoPreparacion: 20,
      tiempoCoccion: 18,
      popularidad: 92,
      activo: true,
      stock: 15
    },
    {
      id: 3,
      nombre: 'Torta de Chocolate',
      descripcion: 'Deliciosa torta de chocolate con cobertura de ganache',
      precio: 18.00,
      categoria: 'tortas',
      imagen: '🎂',
      tiempoPreparacion: 45,
      tiempoCoccion: 35,
      popularidad: 95,
      activo: true,
      stock: 5
    },
    {
      id: 4,
      nombre: 'Empanadas de Pollo',
      descripcion: 'Empanadas caseras rellenas de pollo y verduras',
      precio: 4.25,
      categoria: 'salados',
      imagen: '🥟',
      tiempoPreparacion: 30,
      tiempoCoccion: 20,
      popularidad: 88,
      activo: true,
      stock: 12
    },
    {
      id: 5,
      nombre: 'Café Americano',
      descripcion: 'Café americano preparado con granos premium',
      precio: 2.50,
      categoria: 'bebidas',
      imagen: '☕',
      tiempoPreparacion: 3,
      tiempoCoccion: 0,
      popularidad: 90,
      activo: true,
      stock: 50
    },
    {
      id: 6,
      nombre: 'Muffin de Arándanos',
      descripcion: 'Muffin esponjoso con arándanos frescos',
      precio: 3.25,
      categoria: 'pasteles',
      imagen: '🧁',
      tiempoPreparacion: 15,
      tiempoCoccion: 22,
      popularidad: 87,
      activo: true,
      stock: 18
    }
  ];

  const categorias = [
    { id: 'panes', nombre: 'Panes', icon: '🍞' },
    { id: 'pasteles', nombre: 'Pasteles', icon: '🧁' },
    { id: 'tortas', nombre: 'Tortas', icon: '🎂' },
    { id: 'salados', nombre: 'Salados', icon: '🥟' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '☕' }
  ];

  // Filtrar productos
  const filteredProducts = productos.filter(producto => {
    const matchesCategory = selectedCategory === 'all' || producto.categoria === selectedCategory;
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && producto.activo;
  });

  // Agregar al carrito
  const addToCart = (producto) => {
    const existingItem = cart.find(item => item.id === producto.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === producto.id
          ? { ...item, quantity: Math.min(item.quantity + 1, producto.stock) }
          : item
      ));
    } else {
      setCart([...cart, { ...producto, quantity: 1 }]);
    }

    addNotification({
      type: 'success',
      title: 'Producto Agregado',
      message: `${producto.nombre} agregado al carrito`,
    });
  };

  // Remover del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Actualizar cantidad en carrito
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.min(newQuantity, item.stock) }
        : item
    ));
  };

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Procesar pedido
  const processOrder = () => {
    if (cart.length === 0) return;

    addNotification({
      type: 'success',
      title: 'Pedido Realizado',
      message: `Pedido por $${cartTotal.toFixed(2)} procesado exitosamente. Te contactaremos pronto.`,
    });

    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Catálogo de Productos
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Descubre nuestros deliciosos productos frescos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Buscar productos..."
          />
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategory(categoria.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === categoria.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{categoria.icon}</span>
              <span>{categoria.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Carrito flotante */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">{cartItemCount} productos</p>
              <p className="text-sm">${cartTotal.toFixed(2)}</p>
            </div>
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {cartItemCount}
            </div>
          </button>
        </div>
      )}

      {/* Modal del carrito */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Mi Carrito</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.imagen}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.nombre}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${item.precio}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={processOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(producto => (
          <div key={producto.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Imagen del producto */}
            <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 flex items-center justify-center relative">
              <span className="text-6xl">{producto.imagen}</span>
              {producto.stock < 5 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ¡Últimos!
                </div>
              )}
            </div>
            
            {/* Información del producto */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{producto.nombre}</h3>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  ${producto.precio}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {producto.descripcion}
              </p>
              
              {/* Información adicional */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>⏱️ {producto.tiempoPreparacion}min</span>
                <span>📦 Stock: {producto.stock}</span>
                <span className="flex items-center">
                  ⭐ {(producto.popularidad / 20).toFixed(1)}
                </span>
              </div>
              
              {/* Botón agregar al carrito */}
              <button
                onClick={() => addToCart(producto)}
                disabled={producto.stock === 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  producto.stock === 0
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                <span>{producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay productos */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta cambiar los filtros o el término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductosView;