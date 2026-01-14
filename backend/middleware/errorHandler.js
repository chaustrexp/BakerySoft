/**
 * Middleware de Manejo de Errores
 * ===============================
 * 
 * Maneja todos los errores de la aplicación de forma centralizada
 * 
 * @author BakerySoft Team
 * @version 1.0.0
 */

/**
 * Middleware de manejo de errores
 * Captura y formatea todos los errores de la aplicación
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
      message,
      statusCode: 400
    };
  }

  // Error de PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Violación de restricción única
        error = {
          message: 'El recurso ya existe',
          statusCode: 400
        };
        break;
      case '23503': // Violación de clave foránea
        error = {
          message: 'Referencia inválida a otro recurso',
          statusCode: 400
        };
        break;
      case '23502': // Violación de NOT NULL
        error = {
          message: 'Campo requerido faltante',
          statusCode: 400
        };
        break;
      case '22P02': // Formato de datos inválido
        error = {
          message: 'Formato de datos inválido',
          statusCode: 400
        };
        break;
      case '42P01': // Tabla no existe
        error = {
          message: 'Recurso no encontrado',
          statusCode: 404
        };
        break;
      default:
        error = {
          message: 'Error de base de datos',
          statusCode: 500
        };
    }
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Token inválido',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expirado',
      statusCode: 401
    };
  }

  // Error de validación de Mongoose (si se usa)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // Error de cast (ID inválido)
  if (err.name === 'CastError') {
    error = {
      message: 'ID de recurso inválido',
      statusCode: 400
    };
  }

  // Error de duplicado (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      message: `El ${field} ya existe`,
      statusCode: 400
    };
  }

  // Errores de red/conexión
  if (err.code === 'ECONNREFUSED') {
    error = {
      message: 'Error de conexión a la base de datos',
      statusCode: 503
    };
  }

  if (err.code === 'ETIMEDOUT') {
    error = {
      message: 'Tiempo de espera agotado',
      statusCode: 408
    };
  }

  // Error por defecto
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  // Respuesta de error
  const errorResponse = {
    success: false,
    error: message
  };

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }

  // Log adicional para errores 500
  if (statusCode === 500) {
    console.error('🚨 Error interno del servidor:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para manejar errores asíncronos
 * Envuelve funciones async para capturar errores automáticamente
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Funciones helper para crear errores comunes
 */
export const createError = {
  badRequest: (message = 'Solicitud inválida') => new AppError(message, 400),
  unauthorized: (message = 'No autorizado') => new AppError(message, 401),
  forbidden: (message = 'Acceso prohibido') => new AppError(message, 403),
  notFound: (message = 'Recurso no encontrado') => new AppError(message, 404),
  conflict: (message = 'Conflicto con el estado actual') => new AppError(message, 409),
  unprocessable: (message = 'Datos no procesables') => new AppError(message, 422),
  tooManyRequests: (message = 'Demasiadas solicitudes') => new AppError(message, 429),
  internal: (message = 'Error interno del servidor') => new AppError(message, 500),
  notImplemented: (message = 'Funcionalidad no implementada') => new AppError(message, 501),
  badGateway: (message = 'Error de gateway') => new AppError(message, 502),
  serviceUnavailable: (message = 'Servicio no disponible') => new AppError(message, 503)
};