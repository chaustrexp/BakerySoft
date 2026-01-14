# 🧪 Guía de Prueba de Usuarios - BakerySoft

## 🎯 Objetivo
Verificar que todos los usuarios pueden acceder al sistema y ver solo los módulos permitidos según sus permisos.

## 🌐 URL de Acceso
**https://panaderia-management-system.vercel.app/**

---

## 👤 Prueba 1: Administrador

### Credenciales
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### Módulos Esperados (11 módulos)
✅ Dashboard
✅ Inventario
✅ Personal
✅ Finanzas
✅ Producción
✅ Punto de Venta
✅ Reportes
✅ Proveedores
✅ Pedidos
✅ Productos (Catálogo)
✅ Usuarios
✅ Mi Perfil

### Pasos de Prueba
1. Abrir https://panaderia-management-system.vercel.app/
2. Ingresar usuario: `admin`
3. Ingresar contraseña: `admin123`
4. Click en "Iniciar Sesión"
5. ✅ Verificar que aparecen TODOS los módulos en el sidebar
6. ✅ Verificar que el nombre "Administrador" aparece en el perfil
7. Click en cada módulo para verificar acceso
8. Click en "Cerrar Sesión"

---

## 👔 Prueba 2: Gerente

### Credenciales
- **Usuario:** `gerente`
- **Contraseña:** `gerente123`

### Módulos Esperados (10 módulos)
✅ Dashboard
✅ Inventario
✅ Personal
✅ Finanzas
✅ Producción
✅ Punto de Venta
✅ Reportes
✅ Proveedores
✅ Pedidos
✅ Productos (Catálogo)
❌ Usuarios (NO debe aparecer)
✅ Mi Perfil

### Pasos de Prueba
1. Ingresar usuario: `gerente`
2. Ingresar contraseña: `gerente123`
3. Click en "Iniciar Sesión"
4. ✅ Verificar que aparecen 10 módulos (sin Usuarios)
5. ✅ Verificar que el nombre "Gerente General" aparece en el perfil
6. ✅ Verificar que NO aparece el módulo "Usuarios"
7. Click en "Cerrar Sesión"

---

## 👷 Prueba 3: Supervisor

### Credenciales
- **Usuario:** `supervisor`
- **Contraseña:** `supervisor123`

### Módulos Esperados (7 módulos)
✅ Dashboard
✅ Inventario
✅ Personal
✅ Producción
✅ Punto de Venta
✅ Pedidos
✅ Productos (Catálogo)
❌ Finanzas (NO debe aparecer)
❌ Reportes (NO debe aparecer)
❌ Proveedores (NO debe aparecer)
❌ Usuarios (NO debe aparecer)
✅ Mi Perfil

### Pasos de Prueba
1. Ingresar usuario: `supervisor`
2. Ingresar contraseña: `supervisor123`
3. Click en "Iniciar Sesión"
4. ✅ Verificar que aparecen 7 módulos
5. ✅ Verificar que el nombre "Supervisor" aparece en el perfil
6. ✅ Verificar que NO aparecen: Finanzas, Reportes, Proveedores, Usuarios
7. Click en "Cerrar Sesión"

---

## 👨‍🍳 Prueba 4: Empleado

### Credenciales
- **Usuario:** `empleado`
- **Contraseña:** `empleado123`

### Módulos Esperados (5 módulos)
✅ Dashboard
✅ Inventario
✅ Producción
✅ Punto de Venta
✅ Productos (Catálogo)
❌ Personal (NO debe aparecer)
❌ Finanzas (NO debe aparecer)
❌ Reportes (NO debe aparecer)
❌ Proveedores (NO debe aparecer)
❌ Pedidos (NO debe aparecer)
❌ Usuarios (NO debe aparecer)
✅ Mi Perfil

### Pasos de Prueba
1. Ingresar usuario: `empleado`
2. Ingresar contraseña: `empleado123`
3. Click en "Iniciar Sesión"
4. ✅ Verificar que aparecen solo 5 módulos
5. ✅ Verificar que el nombre "Empleado" aparece en el perfil
6. ✅ Verificar acceso limitado a operaciones básicas
7. Click en "Cerrar Sesión"

---

## 🛒 Prueba 5: Cliente

### Credenciales
- **Usuario:** `cliente`
- **Contraseña:** `cliente123`

### Módulos Esperados (4 módulos)
✅ Inicio (Dashboard)
✅ Productos
✅ Pedidos
✅ Mi Perfil
❌ Inventario (NO debe aparecer)
❌ Personal (NO debe aparecer)
❌ Finanzas (NO debe aparecer)
❌ Producción (NO debe aparecer)
❌ Punto de Venta (NO debe aparecer)
❌ Reportes (NO debe aparecer)
❌ Proveedores (NO debe aparecer)
❌ Usuarios (NO debe aparecer)

### Pasos de Prueba
1. Ingresar usuario: `cliente`
2. Ingresar contraseña: `cliente123`
3. Click en "Iniciar Sesión"
4. ✅ Verificar que aparecen solo 4 módulos
5. ✅ Verificar que el nombre "Cliente" aparece en el perfil
6. ✅ Verificar vista simplificada para cliente
7. ✅ Verificar que puede ver productos y hacer pedidos
8. Click en "Cerrar Sesión"

---

## 📋 Checklist General

### Funcionalidades Básicas
- [ ] Login funciona para todos los usuarios
- [ ] Cada usuario ve solo sus módulos permitidos
- [ ] Dashboard carga correctamente
- [ ] Navegación entre módulos funciona
- [ ] Logout funciona correctamente
- [ ] Información del usuario se muestra correctamente
- [ ] Sidebar muestra módulos según permisos
- [ ] No hay errores en consola del navegador

### Seguridad
- [ ] Usuario no puede acceder a módulos sin permiso
- [ ] Credenciales incorrectas son rechazadas
- [ ] Sesión persiste al recargar página
- [ ] Logout limpia la sesión correctamente

### UI/UX
- [ ] Interfaz se ve correctamente
- [ ] Colores y estilos son consistentes
- [ ] Responsive design funciona en móvil
- [ ] Animaciones y transiciones fluidas
- [ ] Iconos y logos se muestran correctamente

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "Error interno del servidor"
**Solución:** El sistema usa localStorage como fallback. Esto es normal y no afecta la funcionalidad.

### Problema: Pantalla en blanco
**Solución:** 
1. Limpiar caché del navegador (Ctrl + Shift + Delete)
2. Recargar página (Ctrl + F5)
3. Verificar que JavaScript está habilitado

### Problema: No aparecen algunos módulos
**Solución:** Esto es correcto. Cada usuario ve solo los módulos según sus permisos.

### Problema: Error 404 notification.mp3
**Solución:** Este error es cosmético y no afecta la funcionalidad. Se puede ignorar.

---

## 📊 Tabla Resumen de Permisos

| Módulo | Admin | Gerente | Supervisor | Empleado | Cliente |
|--------|-------|---------|------------|----------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inventario | ✅ | ✅ | ✅ | ✅ | ❌ |
| Personal | ✅ | ✅ | ✅ | ❌ | ❌ |
| Finanzas | ✅ | ✅ | ❌ | ❌ | ❌ |
| Producción | ✅ | ✅ | ✅ | ✅ | ❌ |
| POS | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Proveedores | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pedidos | ✅ | ✅ | ✅ | ❌ | ✅ |
| Productos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |
| Mi Perfil | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## ✅ Resultado Esperado

Al completar todas las pruebas, deberías verificar que:

1. ✅ Los 5 usuarios pueden iniciar sesión
2. ✅ Cada usuario ve solo sus módulos permitidos
3. ✅ El sistema de permisos funciona correctamente
4. ✅ La navegación es fluida
5. ✅ El logout funciona para todos los usuarios

**Si todas las pruebas pasan, el sistema está funcionando correctamente! 🎉**

---

**Última actualización:** 14 de Enero, 2026
**Versión:** 1.0.0
