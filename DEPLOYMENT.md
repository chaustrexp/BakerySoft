# 🚀 Guía de Despliegue - BakerySoft

Esta guía explica cómo desplegar BakerySoft en diferentes plataformas y resolver problemas comunes.

## 📋 Requisitos Previos

- Node.js 18+ 
- npm 8+
- Git configurado

## 🌐 Despliegue en Vercel

### Configuración Automática
1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. La configuración en `vercel.json` se aplicará automáticamente

### Configuración Manual
Si necesitas configurar manualmente:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Variables de Entorno en Vercel
Configura estas variables en el dashboard de Vercel:

```
VITE_APP_NAME=BakerySoft
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGGING=false
```

## 🔧 Comandos de Build

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar build anterior
npm run clean
```

## 🐛 Solución de Problemas

### Pantalla Blanca en Producción

**Problema**: La aplicación muestra pantalla blanca en Vercel
**Solución**: 

1. **Error Boundaries**: Implementados para capturar errores
2. **Logging Mejorado**: Console logs para debugging
3. **Fallback UI**: Interfaces de respaldo para errores críticos
4. **Configuración Vercel**: Routing SPA configurado correctamente

### Errores de Importación CSS

**Problema**: Errores con @import en CSS
**Solución**: 
- Los @import están al inicio de los archivos CSS
- Configuración de PostCSS correcta
- Tailwind CSS configurado apropiadamente

### Errores de Contexto

**Problema**: "useApp debe usarse dentro de AppProvider"
**Solución**:
- ErrorBoundary captura estos errores
- Verificación de contexto en hooks
- Fallback UI cuando el contexto falla

## 📊 Monitoreo y Debugging

### Logs en Producción
```javascript
// Los logs están deshabilitados en producción por defecto
// Para habilitar, configura VITE_ENABLE_LOGGING=true
```

### Error Tracking
- ErrorBoundary captura errores de React
- Window error handlers para errores globales
- Unhandled promise rejection handlers

### Performance
- Code splitting implementado
- Lazy loading de componentes
- Optimización de assets

## 🔄 Proceso de Despliegue

1. **Desarrollo**
   ```bash
   npm run dev
   ```

2. **Testing Local**
   ```bash
   npm run build
   npm run preview
   ```

3. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin main
   ```

4. **Despliegue Automático**
   - Vercel detecta el push
   - Ejecuta build automáticamente
   - Despliega si el build es exitoso

## 🛠️ Configuración Avanzada

### Custom Domain
1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Agrega tu dominio personalizado

### Environment Variables
```bash
# Desarrollo
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true

# Producción
VITE_DEV_MODE=false
VITE_ENABLE_LOGGING=false
```

### Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

## 📱 Testing en Diferentes Dispositivos

### Responsive Testing
- Chrome DevTools
- Real device testing
- Cross-browser compatibility

### Performance Testing
- Lighthouse scores
- Core Web Vitals
- Loading speed optimization

## 🚨 Troubleshooting Checklist

- [ ] Build se completa sin errores
- [ ] Preview funciona localmente
- [ ] Variables de entorno configuradas
- [ ] Routing SPA configurado
- [ ] Error boundaries implementados
- [ ] CSS imports correctos
- [ ] Assets accesibles

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs** en Vercel Dashboard
2. **Prueba localmente** con `npm run preview`
3. **Verifica configuración** de variables de entorno
4. **Consulta documentación** de Vercel y Vite

---

*Última actualización: Enero 2024*
*Versión: 1.0.0*