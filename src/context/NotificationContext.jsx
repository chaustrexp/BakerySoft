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

  // Cargar notificaciones del localStorage al iniciar
  useEffect(() => {
    const savedNotifications = localStorage.getItem('bakerysoft_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        parsed.notifications.forEach(notif => {
          dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
        });
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('bakerysoft_notifications', JSON.stringify(state));
  }, [state]);

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
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silenciar errores de audio
      });
    } catch (error) {
      // Silenciar errores de audio
    }
  };

  // Función para mostrar notificación del navegador
  const showDesktopNotification = (notification) => {
    if (Notification.permission === 'granted') {
      new Notification(`BakerySoft - ${notification.title}`, {
        body: notification.message,
        icon: '/img/Logo.png',
        tag: notification.id
      });
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