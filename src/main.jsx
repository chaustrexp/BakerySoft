import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Manejo global de errores no capturados
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada no manejada:', event.reason);
});

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento root en el DOM');
}

console.log('main.jsx: Iniciando BakerySoft...');

try {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('main.jsx: BakerySoft renderizado exitosamente');
} catch (error) {
  console.error('Error crítico al renderizar la aplicación:', error);
  
  // Fallback UI si falla completamente
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f3f4f6;
      color: #374151;
      padding: 20px;
    ">
      <div style="
        max-width: 400px;
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Error Crítico</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          No se pudo cargar BakerySoft. Error: ${error.message}
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #f59e0b;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 16px;
          "
        >
          🔄 Recargar Página
        </button>
        <button 
          onclick="localStorage.clear(); window.location.reload();" 
          style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 16px;
            margin-left: 10px;
          "
        >
          🗑️ Limpiar y Recargar
        </button>
      </div>
    </div>
  `;
}