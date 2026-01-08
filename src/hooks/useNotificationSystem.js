import { useEffect } from 'react';
import { useNotifications, NOTIFICATION_TYPES } from '../context/NotificationContext';
import { useApp } from './useApp';

export const useNotificationSystem = () => {
  const { addNotification } = useNotifications();
  const { state } = useApp();

  // Monitorear inventario bajo
  useEffect(() => {
    const checkLowInventory = () => {
      if (state.materiasPrimas) {
        const lowStockItems = state.materiasPrimas.filter(item => 
          item.estado === 'Crítico' || item.estado === 'Bajo'
        );

        lowStockItems.forEach(item => {
          if (item.estado === 'Crítico') {
            addNotification({
              type: NOTIFICATION_TYPES.ERROR,
              title: 'Stock Crítico',
              message: `${item.nombre} está en nivel crítico (${item.cantidad} ${item.unidad})`,
              action: {
                label: 'Ver Inventario',
                callback: () => {
                  // Navegar a inventario
                  window.location.hash = '#inventario';
                }
              }
            });
          } else if (item.estado === 'Bajo') {
            addNotification({
              type: NOTIFICATION_TYPES.WARNING,
              title: 'Stock Bajo',
              message: `${item.nombre} necesita reposición (${item.cantidad} ${item.unidad})`,
              action: {
                label: 'Ver Inventario',
                callback: () => {
                  window.location.hash = '#inventario';
                }
              }
            });
          }
        });
      }
    };

    // Verificar cada 5 minutos
    const interval = setInterval(checkLowInventory, 5 * 60 * 1000);
    
    // Verificar inmediatamente
    checkLowInventory();

    return () => clearInterval(interval);
  }, [state.materiasPrimas, addNotification]);

  // Notificaciones de bienvenida
  useEffect(() => {
    if (state.isAuthenticated && state.currentUser) {
      const welcomeTimeout = setTimeout(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          title: '¡Bienvenido!',
          message: `Hola ${state.currentUser.name}, tienes acceso como ${state.currentUser.role}`,
        });
      }, 2000);

      return () => clearTimeout(welcomeTimeout);
    }
  }, [state.isAuthenticated, state.currentUser, addNotification]);

  // Notificaciones de sistema
  const notifySuccess = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      action
    });
  };

  const notifyError = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      action
    });
  };

  const notifyWarning = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message,
      action
    });
  };

  const notifyInfo = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message,
      action
    });
  };

  const notifyInventory = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.INVENTORY,
      title,
      message,
      action
    });
  };

  const notifyOrder = (title, message, action = null) => {
    addNotification({
      type: NOTIFICATION_TYPES.ORDER,
      title,
      message,
      action
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyInventory,
    notifyOrder
  };
};