import { createContext, useContext, useReducer, useEffect } from 'react';

const NotificationContext = createContext();

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  INVENTORY: 'inventory',
  ORDER: 'order',
  SYSTEM: 'system'
};

// Estado inicial
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    sound: true,
    desktop: true,
    email: false,
    inventory: true,
    orders: true,
    system: true
  }
};

// Reducer para manejar las notificaciones
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification = {
        id: Date.now() + Math.random(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case 'LOAD_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload.notifications || [],
        unreadCount: action.payload.unreadCount || 0
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
        unreadCount: 0
      };

    case 'REMOVE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
        unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount
      };

    default:
      return state;
  }
};

// Provider del contexto
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Cargar notificaciones del localStorage al iniciar (solo una vez)
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('bakerysoft_notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Si hay error, limpiar localStorage corrupto
      localStorage.removeItem('bakerysoft_notifications');
    }
  }, []); // Array vacío para que solo se ejecute una vez

  // Guardar notificaciones en localStorage cuando cambien (pero no en la carga inicial)
  useEffect(() => {
    // Solo guardar si hay notificaciones o si no es el estado inicial
    if (state.notifications.length > 0 || state.unreadCount > 0) {
      try {
        // Limitar a las últimas 50 notificaciones para evitar QuotaExceededError
        const limitedState = {
          notifications: state.notifications.slice(0, 50),
          unreadCount: state.unreadCount
        };
        localStorage.setItem('bakerysoft_notifications', JSON.stringify(limitedState));
      } catch (error) {
        console.error('Error saving notifications:', error);
        // Si falla por cuota excedida, limpiar notificaciones antiguas
        if (error.name === 'QuotaExceededError') {
          try {
            const reducedState = {
              notifications: state.notifications.slice(0, 20),
              unreadCount: Math.min(state.unreadCount, 20)
            };
            localStorage.setItem('bakerysoft_notifications', JSON.stringify(reducedState));
          } catch (e) {
            // Si aún falla, limpiar completamente
            localStorage.removeItem('bakerysoft_notifications');
          }
        }
      }
    }
  }, [state.notifications, state.unreadCount]);

  // Función para agregar notificación
  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Reproducir sonido si está habilitado
    if (state.settings.sound) {
      playNotificationSound();
    }
    
    // Mostrar notificación del navegador si está habilitado
    if (state.settings.desktop && 'Notification' in window) {
      showDesktopNotification(notification);
    }
  };

  // Función para reproducir sonido
  const playNotificationSound = () => {
    // Deshabilitado temporalmente - archivo de audio no disponible
    // Si deseas habilitar sonidos, agrega el archivo notification.mp3 en /public/
    return;
  };

  // Función para mostrar notificación del navegador
  const showDesktopNotification = (notification) => {
    if (Notification.permission === 'granted') {
      try {
        new Notification(`BakerySoft - ${notification.title}`, {
          body: notification.message,
          icon: '/img/Logo.png',
          tag: notification.id
        });
      } catch (error) {
        console.error('Error showing desktop notification:', error);
      }
    }
  };

  // Funciones de utilidad
  const markAsRead = (id) => dispatch({ type: 'MARK_AS_READ', payload: id });
  const markAllAsRead = () => dispatch({ type: 'MARK_ALL_AS_READ' });
  const removeNotification = (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    settings: state.settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para usar el contexto
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};