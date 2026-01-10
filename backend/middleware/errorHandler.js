/**
 * Middleware de Manejo de Errores
 * ===============================
 * 
 * Maneja todos los errores de la aplicación de forma centralizada
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error
  console.error('❌ Error:', err);

  // Error de validación de Joi
  if (err.isJoi) {
    const message = err.details.map(detail => detail.message).join(', ');
    error = {
      message: `Error de validación: ${message}`,
      statusCode: 400
    };
  }

  // Error de PostgreSQL - Violación de constraint único
  if (err.code === '23505') {
    const message = 'Recurso duplicado. Este valor ya existe.';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de PostgreSQL - Violación de foreign key
  if (err.code === '23503') {
    const message = 'Referencia inválida. El recurso relacionado no existe.';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de PostgreSQL - Violación de not null
  if (err.code === '23502') {
    const message = 'Campo requerido faltante.';
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401
    };
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401
    };
  }

  // Error de cast (ID inválido)
  if (err.name === 'CastError') {
    const message = 'ID de recurso inválido';
    error = {
      message,
      statusCode: 400
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;