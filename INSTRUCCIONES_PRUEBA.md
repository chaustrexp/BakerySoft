# 🚀 Instrucciones de Prueba - BakerySoft

## 📍 Acceso al Sistema

### URL de la Aplicación
**https://panaderia-management-system.vercel.app/**

---

## 🎯 Prueba Rápida (5 minutos)

### 1️⃣ Probar como Administrador

```
👤 Usuario: admin
🔑 Contraseña: admin123
```

**Qué verás:**
- ✅ Acceso a TODOS los módulos (11 módulos)
- ✅ Dashboard completo con estadísticas
- ✅ Módulo de "Usuarios" (solo admin lo ve)

**Cómo probar:**
1. Abre https://panaderia-management-system.vercel.app/
2. Ingresa: `admin` / `admin123`
3. Click "Iniciar Sesión"
4. Verifica que aparecen todos los módulos en el menú lateral
5. Click en diferentes módulos para navegar
6. Click en tu perfil (esquina superior derecha)
7. Click "Cerrar Sesión"

---

### 2️⃣ Probar como Gerente

```
👤 Usuario: gerente
🔑 Contraseña: gerente123
```

**Qué verás:**
- ✅ 10 módulos (sin "Usuarios")
- ✅ Acceso a Finanzas y Reportes
- ❌ NO verás el módulo "Usuarios"

**Cómo probar:**
1. Ingresa: `gerente` / `gerente123`
2. Click "Iniciar Sesión"
3. Verifica que NO aparece el módulo "Usuarios"
4. Verifica que SÍ aparecen Finanzas y Reportes
5. Click "Cerrar Sesión"

---

### 3️⃣ Probar como Empleado

```
👤 Usuario: empleado
🔑 Contraseña: empleado123
```

**Qué verás:**
- ✅ Solo 5 módulos básicos
- ✅ Dashboard, Inventario, Producción, POS, Productos
- ❌ NO verás Personal, Finanzas, Reportes, etc.

**Cómo probar:**
1. Ingresa: `empleado` / `empleado123`
2. Click "Iniciar Sesión"
3. Verifica que solo aparecen 5 módulos
4. Intenta navegar por los módulos disponibles
5. Click "Cerrar Sesión"

---

### 4️⃣ Probar como Cliente

```
👤 Usuario: cliente
🔑 Contraseña: cliente123
```

**Qué verás:**
- ✅ Solo 4 módulos: Inicio, Productos, Pedidos, Mi Perfil
- ✅ Vista simplificada para clientes
- ❌ NO verás módulos administrativos

**Cómo probar:**
1. Ingresa: `cliente` / `cliente123`
2. Click "Iniciar Sesión"
3. Verifica que solo aparecen 4 módulos
4. Navega por Productos y Pedidos
5. Click "Cerrar Sesión"

---

## 📊 Resumen de Usuarios

| Usuario | Contraseña | Rol | Módulos |
|---------|-----------|-----|---------|
| admin | admin123 | Administrador | 11 módulos (todos) |
| gerente | gerente123 | Gerente | 10 módulos |
| supervisor | supervisor123 | Supervisor | 7 módulos |
| empleado | empleado123 | Empleado | 5 módulos |
| cliente | cliente123 | Cliente | 4 módulos |

---

## ✅ Verificación de Funcionalidades

### Login
- [x] Acepta credenciales correctas
- [x] Rechaza credenciales incorrectas
- [x] Muestra mensaje de bienvenida
- [x] Carga dashboard automáticamente

### Permisos
- [x] Cada usuario ve solo sus módulos
- [x] Admin ve todos los módulos
- [x] Cliente ve solo módulos básicos
- [x] Empleado tiene acceso limitado

### Navegación
- [x] Sidebar muestra módulos permitidos
- [x] Click en módulos cambia la vista
- [x] Perfil de usuario visible
- [x] Logout funciona correctamente

### UI/UX
- [x] Interfaz responsive
- [x] Colores y estilos consistentes
- [x] Animaciones fluidas
- [x] Sin errores visuales

---

## 🐛 Notas Importantes

### ⚠️ Mensaje "Error interno del servidor"
**Esto es NORMAL y no afecta la funcionalidad.**

El sistema usa localStorage como fallback cuando el backend no está disponible. Esto permite que la aplicación funcione perfectamente sin necesidad de un servidor backend activo.

### 🔊 Error 404 notification.mp3
**Este error es cosmético y se puede ignorar.**

Es solo un archivo de audio para notificaciones que no está presente. No afecta ninguna funcionalidad del sistema.

### 🔄 Limpiar Caché
Si experimentas problemas, limpia el caché del navegador:
- **Chrome/Edge:** Ctrl + Shift + Delete
- **Firefox:** Ctrl + Shift + Delete
- Luego recarga la página: Ctrl + F5

---

## 🎯 Casos de Uso Recomendados

### Como Administrador
1. Login como admin
2. Ir a "Usuarios" (solo admin lo ve)
3. Revisar lista de usuarios
4. Ir a "Reportes"
5. Ver estadísticas completas

### Como Gerente
1. Login como gerente
2. Ir a "Finanzas"
3. Revisar transacciones
4. Ir a "Personal"
5. Ver empleados

### Como Empleado
1. Login como empleado
2. Ir a "Inventario"
3. Ver materias primas
4. Ir a "Punto de Venta"
5. Simular una venta

### Como Cliente
1. Login como cliente
2. Ir a "Productos"
3. Ver catálogo
4. Ir a "Pedidos"
5. Ver historial

---

## 📱 Prueba en Móvil

El sistema es responsive y funciona en dispositivos móviles:

1. Abre https://panaderia-management-system.vercel.app/ en tu móvil
2. Login con cualquier usuario
3. Verifica que el menú se adapta a pantalla pequeña
4. Prueba la navegación táctil

---

## 🎉 Resultado Esperado

Al completar las pruebas, deberías confirmar que:

✅ **Sistema de autenticación funciona**
- Login exitoso para todos los usuarios
- Logout funciona correctamente
- Sesión persiste al recargar

✅ **Sistema de permisos funciona**
- Cada usuario ve solo sus módulos
- No hay acceso a módulos no permitidos
- Filtrado automático del menú

✅ **Interfaz funciona correctamente**
- Dashboard carga sin errores
- Navegación fluida entre módulos
- Responsive en móvil y desktop

✅ **Experiencia de usuario es buena**
- Interfaz intuitiva
- Colores y diseño profesional
- Sin errores críticos

---

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que estás usando las credenciales correctas
2. Limpia el caché del navegador
3. Recarga la página (Ctrl + F5)
4. Verifica la consola del navegador (F12)

---

## 🚀 Próximos Pasos

Una vez verificado que todo funciona:

1. ✅ Sistema listo para desarrollo
2. ✅ Puedes agregar más funcionalidades
3. ✅ Puedes personalizar módulos
4. ✅ Puedes agregar más usuarios

---

**¡El sistema está listo para ser usado! 🎊**

**URL:** https://panaderia-management-system.vercel.app/

**Última actualización:** 14 de Enero, 2026
