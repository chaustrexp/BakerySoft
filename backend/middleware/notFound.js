/**
 * Middleware para Rutas No Encontradas
 * ====================================
 * 
 * Maneja las solicitudes a rutas que no existen
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

/**
 * Middleware para manejar rutas no encontradas (404)
 * Se ejecuta cuando ninguna ruta coincide con la solicitud
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.statusCode = 404;
  
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    message: 'La ruta solicitada no existe en este servidor',
    availableEndpoints: {
      auth: '/api/auth',
      users: '/api/users',
      inventory: '/api/inventory',
      employees: '/api/employees',
      orders: '/api/orders',
      products: '/api/products',
      finances: '/api/finances',
      production: '/api/production',
      reports: '/api/reports'
    }
  });
};