/**
 * Middleware para rutas no encontradas
 * ===================================
 * 
 * Maneja las rutas que no existen en la API
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;